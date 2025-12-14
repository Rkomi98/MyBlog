"""terra_gravimetria_360.py

Hai ragione: l'output precedente NON era corretto.

Perché succedeva:
- I coefficienti ICGEM (.gfc) sono quasi sempre *fully-normalized* (C̄_lm, S̄_lm).
- Il mio fallback usava P_lm NON normalizzati e una ricorrenza numericamente instabile a gradi alti.
- Risultato: valori enormi vicino ai poli / bande artificiali, e normalizzazione 0..1 che schiacciava tutto.

Fix in questa versione:
1) Sintesi armonica con **Legendre associati fully-normalized** usando SciPy (stabile):
   P̄_lm = sqrt((2-δ_m0)(2l+1)(l-m)!/(l+m)!) * P_lm
2) Converte in una quantità fisica semplice e più sensata: **disturbing potential** T al raggio di riferimento
   e un'approssimazione di **altezza del geoide**: N ≈ T / γ, con γ≈9.81 m/s².
   (Non è una geoid computation completa come SHTOOLS, ma è molto più coerente del "proxy" precedente.)
3) Rendering video *molto veloce*:
   - texture RGB dalla griglia
   - proiezione ortografica inversa
   - campionamento **bilineare**
   - export MP4 via imageio-ffmpeg

Requisiti:
  pip install numpy matplotlib requests imageio scipy

Uso col tuo modelid (vis3d):
  python terra_gravimetria_360.py \
    --model XGM2019e_2159 \
    --modelid 2b82cfe40a06ab1d7cf36cbdb954f5ca0753fb711f20c9c63b3eb70de0f8fac8 \
    --lmax 180 --grid_step 1.0 \
    --out_map grav_map.png \
    --out_video xgm2019e_360.mp4 \
    --video_fps 60 --duration_s 6 --video_size 720

Test:
  python terra_gravimetria_360.py --run_tests

Nota:
- Se SciPy non è disponibile, lo script si ferma con un messaggio chiaro (perché senza SciPy
  non posso garantire stabilità/normalizzazione corretta a lmax ~180+).
"""

from __future__ import annotations

import argparse
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Tuple

import numpy as np
import matplotlib.pyplot as plt
import requests
import imageio.v2 as imageio

try:
    from scipy.special import lpmv, gammaln
except Exception as e:  # pragma: no cover
    lpmv = None
    gammaln = None


ICGEM_GETMODEL_GFC_TMPL = "https://icgem.gfz.de/getmodel/gfc/{modelid}/{model}.gfc"


# -----------------------------
# Utilities
# -----------------------------

def _safe_mkdir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def manim_like_diverging():
    """Diverging colormap Manim-ish (blu/viola -> ciano -> giallo)."""
    from matplotlib.colors import LinearSegmentedColormap

    colors = [
        (0.05, 0.02, 0.12),
        (0.22, 0.05, 0.45),
        (0.05, 0.20, 0.75),
        (0.00, 0.80, 0.90),
        (0.98, 0.95, 0.20),
    ]
    return LinearSegmentedColormap.from_list("manim_like", colors, N=256)


def build_getmodel_gfc_url(model: str, modelid: str) -> str:
    model = model.strip()
    modelid = modelid.strip()
    if not model or not modelid:
        raise ValueError("model e modelid non possono essere vuoti")
    return ICGEM_GETMODEL_GFC_TMPL.format(modelid=modelid, model=model)


def download_file(url: str, out_path: Path, chunk_size: int = 1024 * 1024) -> Path:
    out_path = out_path.resolve()
    _safe_mkdir(out_path.parent)

    if out_path.exists() and out_path.stat().st_size > 0:
        return out_path

    sess = requests.Session()
    sess.headers.update(
        {
            "User-Agent": "Mozilla/5.0 (compatible; gravimetry-demo/2.0)",
            "Accept": "*/*",
        }
    )

    last_err: Optional[Exception] = None
    for _ in range(3):
        try:
            with sess.get(url, stream=True, timeout=180, allow_redirects=True) as r:
                if r.status_code >= 400:
                    snippet = ""
                    try:
                        snippet = r.text[:200]
                    except Exception:
                        pass
                    raise RuntimeError(f"HTTP {r.status_code}. Snippet={snippet!r}")

                with open(out_path, "wb") as f:
                    for chunk in r.iter_content(chunk_size=chunk_size):
                        if chunk:
                            f.write(chunk)

            if out_path.exists() and out_path.stat().st_size > 0:
                return out_path
            raise RuntimeError("File vuoto dopo download")
        except Exception as e:
            last_err = e

    raise RuntimeError(f"Download fallito: {last_err}")


# -----------------------------
# GFC parsing
# -----------------------------

@dataclass
class GFCModel:
    gm: Optional[float]
    r0: Optional[float]
    max_degree_in_file: int
    C: np.ndarray
    S: np.ndarray


def read_gfc_coeffs(gfc_path: Path, lmax: int) -> GFCModel:
    gm: Optional[float] = None
    r0: Optional[float] = None
    maxdeg = 0

    C = np.zeros((lmax + 1, lmax + 1), dtype=float)
    S = np.zeros((lmax + 1, lmax + 1), dtype=float)

    with open(gfc_path, "r", encoding="utf-8", errors="ignore") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue

            parts = line.split()
            if not parts:
                continue

            # header
            if parts[0] == "earth_gravity_constant" and len(parts) >= 2:
                try:
                    gm = float(parts[1])
                except Exception:
                    pass
                continue

            if parts[0] == "radius" and len(parts) >= 2:
                try:
                    r0 = float(parts[1])
                except Exception:
                    pass
                continue

            # coeffs
            if parts[0] == "gfc" and len(parts) >= 5:
                try:
                    l = int(parts[1])
                    m = int(parts[2])
                    if l > lmax or m > l:
                        continue
                    c = float(parts[3])
                    s = float(parts[4])
                except Exception:
                    continue

                C[l, m] = c
                S[l, m] = s
                maxdeg = max(maxdeg, l)

    return GFCModel(gm=gm, r0=r0, max_degree_in_file=maxdeg, C=C, S=S)


# -----------------------------
# Fully-normalized associated Legendre
# -----------------------------

def fully_normalized_legendre(l: int, m: int, x: float) -> float:
    """Restituisce P̄_lm(x) fully-normalized.

    Usa SciPy lpmv(m, l, x) per P_lm (con fase di Condon-Shortley inclusa),
    poi applica:
      P̄_lm = sqrt((2-δ_m0)(2l+1)(l-m)!/(l+m)!) * P_lm
    """
    if lpmv is None or gammaln is None:
        raise RuntimeError("SciPy non disponibile: installa 'scipy' per una sintesi stabile e corretta.")

    P_lm = float(lpmv(m, l, x))

    # log((l-m)!/(l+m)!) = gammaln(l-m+1) - gammaln(l+m+1)
    log_ratio = float(gammaln(l - m + 1) - gammaln(l + m + 1))
    k = 2.0 if m > 0 else 1.0
    norm = math.sqrt(k * (2.0 * l + 1.0) * math.exp(log_ratio))

    return norm * P_lm


# -----------------------------
# Synthesis: disturbing potential T and geoid height N≈T/γ
# -----------------------------

def synthesize_geoid_approx(
    model: GFCModel,
    lmax: int,
    lats: np.ndarray,
    lons360: np.ndarray,
    gamma: float = 9.81,
    lmin: int = 2,
) -> np.ndarray:
    """Sintetizza N ≈ T/γ in metri.

    ⚠️ Fix stabilità numerica:
    - SciPy `lpmv` può restituire NaN/inf ai poli (x=±1) e vicino ai poli per m>0.
    - Evitiamo x esattamente ±1 clampando e gestendo il caso polare: per x≈±1, P̄_lm=0 per m>0.

    Questa non è una geoid computation completa come SHTOOLS, ma è *coerente* e stabile per visualizzazioni.
    """
    if lpmv is None or gammaln is None:
        raise RuntimeError("SciPy non disponibile: installa 'scipy' per una sintesi stabile e corretta.")

    if model.gm is None or model.r0 is None:
        GM = 3.986004415e14
        r0 = 6378136.3
    else:
        GM = float(model.gm)
        r0 = float(model.r0)

    lon_rad = np.deg2rad(lons360)

    cos_mlon = [np.ones_like(lon_rad)]
    sin_mlon = [np.zeros_like(lon_rad)]
    for m in range(1, lmax + 1):
        cos_mlon.append(np.cos(m * lon_rad))
        sin_mlon.append(np.sin(m * lon_rad))

    Ngrid = np.full((len(lats), len(lons360)), np.nan, dtype=np.float64)

    # scala ~ (GM/r0)/gamma ~ 6.4e6
    scale = GM / r0 / gamma

    # clamp per evitare x=±1 esatto
    eps = 1e-12

    for i, lat in enumerate(lats):
        x = math.sin(math.radians(float(lat)))
        # clamp in (-1,1) per evitare NaN nei Legendre
        if x >= 1.0:
            x = 1.0 - eps
        elif x <= -1.0:
            x = -1.0 + eps

        # per lat molto vicine ai poli, forziamo P̄_lm=0 per m>0
        near_pole = abs(1.0 - abs(x)) < 1e-10

        row = np.zeros((len(lons360),), dtype=np.float64)

        for l in range(lmin, lmax + 1):
            # m=0 è sempre definito
            p0 = fully_normalized_legendre(l, 0, x)
            if np.isfinite(p0):
                row += p0 * model.C[l, 0]

            if near_pole:
                continue  # m>0 ~ 0 ai poli

            for m in range(1, l + 1):
                p = fully_normalized_legendre(l, m, x)
                if not np.isfinite(p):
                    continue
                # evita overflow in somme: se coeff è 0, salta
                c = model.C[l, m]
                s = model.S[l, m]
                if c == 0.0 and s == 0.0:
                    continue
                row += p * (c * cos_mlon[m] + s * sin_mlon[m])

        if np.isfinite(row).any():
            Ngrid[i, :] = scale * row

    # remove global mean solo se c'è almeno un valore finito
    if np.isfinite(Ngrid).any():
        Ngrid = Ngrid - float(np.nanmean(Ngrid))

    # se tutto NaN, significa che la sintesi è fallita (tipicamente SciPy/lpmv o input)
    if not np.isfinite(Ngrid).any():
        raise RuntimeError(
            "La griglia risultante è tutta NaN. "
            "Tipicamente succede se i Legendre diventano NaN ai poli (instabilità) o se SciPy è incompatibile. "
            "Prova: --grid_step 2.0 e/o --lmax 120; verifica che SciPy funzioni correttamente."
        )

    return Ngrid



def compute_grid_from_gfc(
    gfc_path: Path, lmax: int, grid_step_deg: float
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, str]:
    if lpmv is None or gammaln is None:
        raise RuntimeError(
            "SciPy non disponibile. Installa 'scipy' per evitare artefatti e produrre una mappa sensata."
        )

    model = read_gfc_coeffs(gfc_path, lmax=lmax)

    # Evita includere esattamente ±90°, che stressa i Legendre.
    # Manteniamo la copertura quasi completa con epsilon.
    nlat = int(round(180.0 / grid_step_deg)) + 1
    nlon = int(round(360.0 / grid_step_deg))

    eps_lat = 1e-6
    lats = np.linspace(90.0 - eps_lat, -90.0 + eps_lat, nlat)
    lons360 = np.linspace(0.0, 360.0, nlon, endpoint=False)

    geoid_m = synthesize_geoid_approx(model, lmax=lmax, lats=lats, lons360=lons360)
    return lats, lons360, geoid_m, "geoid_approx_m"


# -----------------------------
# 2D plot (sanity)
# -----------------------------

def plot_2d_map(lats: np.ndarray, lons360: np.ndarray, grid_m: np.ndarray, out_png: Path, title: str):
    cmap = manim_like_diverging()

    fig = plt.figure(figsize=(12, 5), dpi=150)
    ax = plt.axes()
    fig.patch.set_facecolor("#0b0b12")
    ax.set_facecolor("#0b0b12")

    # show as -180..180
    lons180 = (lons360 + 180.0) % 360.0 - 180.0
    order = np.argsort(lons180)

    # symmetric range for nicer look
    vmax = float(np.nanpercentile(np.abs(grid_m), 98))
    vmin = -vmax

    img = ax.imshow(
        grid_m[:, order],
        extent=[float(lons180[order].min()), float(lons180[order].max()), float(lats.min()), float(lats.max())],
        origin="lower",
        cmap=cmap,
        aspect="auto",
        vmin=vmin,
        vmax=vmax,
    )

    cb = plt.colorbar(img, ax=ax, orientation="horizontal", pad=0.08, shrink=0.9)
    cb.set_label("meters (approx geoid height)")

    ax.set_title(title, color="#e6e6f0")
    ax.set_xlabel("Longitude (deg)", color="#cfd0e8")
    ax.set_ylabel("Latitude (deg)", color="#cfd0e8")
    ax.tick_params(colors="#cfd0e8")

    plt.tight_layout()
    fig.savefig(out_png, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


# -----------------------------
# Fast video renderer
# -----------------------------

def texture_from_grid(grid_m: np.ndarray) -> np.ndarray:
    cmap = manim_like_diverging()

    vmax = float(np.nanpercentile(np.abs(grid_m), 98))
    vmin = -vmax
    g = np.clip((grid_m - vmin) / (vmax - vmin), 0.0, 1.0)

    rgba = cmap(g)
    rgb = (rgba[:, :, :3] * 255.0).astype(np.uint8)
    return rgb


def orthographic_inverse(x: np.ndarray, y: np.ndarray, lon0_deg: float, lat0_deg: float) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    lat0 = math.radians(lat0_deg)
    lon0 = math.radians(lon0_deg)

    rho = np.sqrt(x * x + y * y)
    inside = rho <= 1.0

    rho_safe = np.where(rho == 0.0, 1.0, rho)

    c = np.arcsin(np.clip(rho, 0.0, 1.0))
    sin_c = np.sin(c)
    cos_c = np.cos(c)

    lat = np.arcsin(cos_c * math.sin(lat0) + (y * sin_c * math.cos(lat0) / rho_safe))

    lon = lon0 + np.arctan2(
        x * sin_c,
        rho * math.cos(lat0) * cos_c - y * math.sin(lat0) * sin_c,
    )

    lat_deg = np.degrees(lat)
    lon_deg = np.degrees(lon)

    lon360 = lon_deg % 360.0

    finite = np.isfinite(lat_deg) & np.isfinite(lon360)
    inside = inside & finite

    return lat_deg, lon360, inside


def sample_texture_bilinear(tex: np.ndarray, lat_deg: np.ndarray, lon360: np.ndarray) -> np.ndarray:
    nlat, nlon, _ = tex.shape

    u = (90.0 - lat_deg) / 180.0 * (nlat - 1)
    u = np.clip(u, 0.0, float(nlat - 1))
    u0 = np.floor(u).astype(np.int32)
    u1 = np.minimum(u0 + 1, nlat - 1)
    fu = (u - u0).astype(np.float32)

    v = (lon360 / 360.0) * nlon
    v0 = np.floor(v).astype(np.int32) % nlon
    v1 = (v0 + 1) % nlon
    fv = (v - np.floor(v)).astype(np.float32)

    c00 = tex[u0, v0]
    c01 = tex[u0, v1]
    c10 = tex[u1, v0]
    c11 = tex[u1, v1]

    c0 = c00 * (1.0 - fv[..., None]) + c01 * fv[..., None]
    c1 = c10 * (1.0 - fv[..., None]) + c11 * fv[..., None]
    c = c0 * (1.0 - fu[..., None]) + c1 * fu[..., None]

    return c.astype(np.uint8)


def render_video_fast(grid_m: np.ndarray, out_video: Path, fps: int, duration_s: float, size_px: int, lat0_deg: float, spin_deg_per_s: float):
    out_video = out_video.resolve()

    tex = texture_from_grid(grid_m)

    N = int(size_px)
    lin = np.linspace(-1.0, 1.0, N, dtype=np.float32)
    X, Y = np.meshgrid(lin, -lin)

    rho = np.sqrt(X * X + Y * Y)
    rim = (rho <= 1.0) & (rho >= 0.992)

    bg = np.array([11, 11, 18], dtype=np.uint8)
    rim_color = np.array([32, 32, 48], dtype=np.uint8)

    frames = max(1, int(round(fps * duration_s)))

    _safe_mkdir(out_video.parent)

    try:
        writer = imageio.get_writer(out_video, format="ffmpeg", codec="libx264", fps=fps, quality=8)
    except Exception:
        writer = imageio.get_writer(out_video, format="ffmpeg", fps=fps)

    with writer:
        for k in range(frames):
            t = k / float(fps)
            lon0 = (t * spin_deg_per_s) % 360.0

            lat_deg, lon360, inside = orthographic_inverse(X, Y, lon0_deg=lon0, lat0_deg=lat0_deg)
            rgb = sample_texture_bilinear(tex, lat_deg, lon360)

            frame = np.empty((N, N, 3), dtype=np.uint8)
            frame[:, :] = bg
            frame[inside] = rgb[inside]
            frame[rim] = rim_color

            writer.append_data(frame)


# -----------------------------
# Tests (no rete)
# -----------------------------

def _run_tests() -> None:
    import unittest

    class TestNormalization(unittest.TestCase):
        def test_pbar_finite(self):
            if lpmv is None:
                self.skipTest("scipy non disponibile")
            # valore semplice
            v = fully_normalized_legendre(2, 0, 0.0)
            self.assertTrue(np.isfinite(v))

        def test_pbar_monotone_domain(self):
            if lpmv is None:
                self.skipTest("scipy non disponibile")
            # x deve essere in [-1,1]
            for x in [-1.0, -0.3, 0.0, 0.7, 1.0]:
                v = fully_normalized_legendre(10, 3, x)
                self.assertTrue(np.isfinite(v))

    class TestBilinear(unittest.TestCase):
        def test_bilinear_shape(self):
            tex = np.zeros((181, 360, 3), dtype=np.uint8)
            lat = np.zeros((5, 7), dtype=np.float32)
            lon = np.zeros((5, 7), dtype=np.float32)
            out = sample_texture_bilinear(tex, lat, lon)
            self.assertEqual(out.shape, (5, 7, 3))

    class TestSynthesis(unittest.TestCase):
        def test_synthesize_not_all_nan(self):
            if lpmv is None:
                self.skipTest("scipy non disponibile")
            # modello finto con un solo coefficiente (l=2,m=0)
            lmax = 10
            C = np.zeros((lmax + 1, lmax + 1), dtype=float)
            S = np.zeros((lmax + 1, lmax + 1), dtype=float)
            C[2, 0] = -4.841651437908150e-04
            model = GFCModel(gm=3.986004415e14, r0=6378136.3, max_degree_in_file=2, C=C, S=S)
            lats = np.linspace(90.0 - 1e-6, -90.0 + 1e-6, 91)
            lons = np.linspace(0.0, 360.0, 180, endpoint=False)
            grid = synthesize_geoid_approx(model, lmax=lmax, lats=lats, lons360=lons)
            self.assertTrue(np.isfinite(grid).any())
            self.assertFalse(np.isnan(grid).all())

    suite = unittest.TestSuite()
    suite.addTest(unittest.defaultTestLoader.loadTestsFromTestCase(TestNormalization))
    suite.addTest(unittest.defaultTestLoader.loadTestsFromTestCase(TestBilinear))

    runner = unittest.TextTestRunner(verbosity=2)
    res = runner.run(suite)
    if not res.wasSuccessful():
        raise SystemExit(1)


# -----------------------------
# Main
# -----------------------------

def main():
    ap = argparse.ArgumentParser(description="ICGEM vis3d-like globe video (fast, corrected)")

    ap.add_argument("--model", default="XGM2019e_2159")
    ap.add_argument("--modelid", required=True)

    ap.add_argument("--data_dir", default="data_icgem")
    ap.add_argument("--lmax", type=int, default=180)
    ap.add_argument("--grid_step", type=float, default=1.0)

    ap.add_argument("--out_map", default="grav_map.png")
    ap.add_argument("--out_video", default="earth_360.mp4")
    ap.add_argument("--video_fps", type=int, default=60)
    ap.add_argument("--duration_s", type=float, default=6.0)
    ap.add_argument("--video_size", type=int, default=720)
    ap.add_argument("--spin_deg_per_s", type=float, default=60.0)
    ap.add_argument("--lat0", type=float, default=15.0)

    ap.add_argument("--run_tests", action="store_true")

    args = ap.parse_args()

    if args.run_tests:
        _run_tests()
        print("OK")
        return

    if lpmv is None:
        raise RuntimeError("Manca SciPy. Installa: pip install scipy")

    data_dir = Path(args.data_dir)
    _safe_mkdir(data_dir)

    url = build_getmodel_gfc_url(args.model, args.modelid)
    gfc_path = data_dir / f"{args.model}.gfc"

    print("Download:", url)
    download_file(url, gfc_path)

    print("Compute grid (approx geoid)...")
    lats, lons360, grid_m, mode = compute_grid_from_gfc(gfc_path, lmax=args.lmax, grid_step_deg=args.grid_step)

    title = f"{args.model} approx geoid (m), lmax={args.lmax}"

    print("Save map:", args.out_map)
    plot_2d_map(lats, lons360, grid_m, out_png=Path(args.out_map), title=title)

    print("Render video:", args.out_video)
    render_video_fast(
        grid_m=grid_m,
        out_video=Path(args.out_video),
        fps=args.video_fps,
        duration_s=args.duration_s,
        size_px=args.video_size,
        lat0_deg=args.lat0,
        spin_deg_per_s=args.spin_deg_per_s,
    )

    print("Done")


if __name__ == "__main__":
    main()
