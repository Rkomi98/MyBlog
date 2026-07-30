(() => {
  'use strict';

  // The article shell owns the global theme. The hotspot module uses a Shadow DOM,
  // so it needs its own surface styles while still consuming the shell's tokens.
  const hotspotStyle = `
    :host { display:block; margin:2rem 0; color:var(--text-primary, #e2e8f0); font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    * { box-sizing:border-box; }
    .lab { overflow:hidden; border:1px solid var(--border, rgba(148,163,184,.2)); border-radius:22px; background:var(--bg-card-strong, rgba(11,17,32,.92)); box-shadow:var(--shadow-lg, 0 28px 60px -36px rgba(2,6,23,.9)); transition:background .3s ease, border-color .3s ease, color .3s ease; }
    .head { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; padding:1.45rem 1.5rem 1.2rem; border-bottom:1px solid var(--border, rgba(148,163,184,.2)); }
    .eyebrow { margin-bottom:.5rem; color:var(--accent-strong, #34d399); font:700 .68rem/1.2 'JetBrains Mono', 'Fira Code', monospace; letter-spacing:.12em; text-transform:uppercase; }
    h3 { margin:0; color:var(--text-primary, #e2e8f0); font:700 clamp(1.1rem, 2vw, 1.4rem)/1.25 'JetBrains Mono', 'Fira Code', monospace; letter-spacing:-.025em; }
    .head p { max-width:46rem; margin:.55rem 0 0; color:var(--text-muted, #94a3b8); font-size:.9rem; line-height:1.6; }
    .status { flex:0 0 auto; padding:.42rem .65rem; border:1px solid color-mix(in srgb, var(--accent, #10b981) 38%, transparent); border-radius:999px; background:color-mix(in srgb, var(--accent, #10b981) 14%, transparent); color:var(--accent-strong, #34d399); font:700 .64rem/1.2 'JetBrains Mono', 'Fira Code', monospace; letter-spacing:.08em; text-transform:uppercase; }
    .body { display:grid; grid-template-columns:minmax(0, 1fr) 18.25rem; min-height:29rem; }
    .stage { position:relative; display:flex; align-items:center; justify-content:center; min-width:0; padding:1rem; background:var(--surface, #1e293b); transition:background .3s ease; }
    canvas { display:block; width:100%; height:auto; max-height:38rem; border:1px solid var(--border, rgba(148,163,184,.2)); border-radius:14px; touch-action:none; }
    .controls { padding:1.1rem 1.15rem 1.25rem; border-left:1px solid var(--border, rgba(148,163,184,.2)); background:color-mix(in srgb, var(--bg-card, rgba(15,23,42,.84)) 90%, transparent); }
    .control { margin-bottom:1rem; }
    .control-head { display:flex; align-items:center; justify-content:space-between; gap:.7rem; margin-bottom:.35rem; }
    label { color:var(--text-secondary, #cbd5e1); font-size:.78rem; font-weight:700; }
    output { color:var(--accent-strong, #34d399); font:700 .72rem/1 'JetBrains Mono', 'Fira Code', monospace; }
    input[type='range'] { width:100%; accent-color:var(--accent, #10b981); }
    select { width:100%; padding:.65rem .7rem; border:1px solid var(--border, rgba(148,163,184,.2)); border-radius:10px; background:var(--bg-card, rgba(15,23,42,.84)); color:var(--text-primary, #e2e8f0); font:600 .78rem 'Inter', sans-serif; }
    .buttons { display:grid; grid-template-columns:1fr; gap:.55rem; margin-top:1.1rem; }
    button { border:1px solid var(--border, rgba(148,163,184,.2)); border-radius:10px; padding:.72rem .75rem; background:var(--surface, #1e293b); color:var(--text-primary, #e2e8f0); cursor:pointer; font:700 .75rem 'Inter', sans-serif; transition:transform .15s ease, background .2s ease, border-color .2s ease; }
    button:hover { transform:translateY(-1px); border-color:color-mix(in srgb, var(--accent, #10b981) 60%, transparent); background:color-mix(in srgb, var(--accent, #10b981) 15%, var(--surface, #1e293b)); }
    .metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; margin-top:1rem; }
    .metric { padding:.72rem .45rem; border:1px solid var(--border, rgba(148,163,184,.2)); border-radius:11px; background:var(--bg-card, rgba(15,23,42,.84)); text-align:center; }
    .metric strong { display:block; color:var(--text-primary, #e2e8f0); font:700 .86rem/1.2 'JetBrains Mono', 'Fira Code', monospace; }
    .metric span { color:var(--text-muted, #94a3b8); font-size:.62rem; line-height:1.25; }
    .note { margin-top:1rem; padding:.8rem .85rem; border-left:3px solid var(--accent, #10b981); border-radius:0 10px 10px 0; background:color-mix(in srgb, var(--accent, #10b981) 10%, transparent); color:var(--text-secondary, #cbd5e1); font-size:.72rem; line-height:1.5; }
    .legend { position:absolute; left:1.6rem; bottom:1.5rem; display:flex; flex-wrap:wrap; gap:.4rem .75rem; padding:.55rem .65rem; border:1px solid var(--border, rgba(148,163,184,.2)); border-radius:10px; background:color-mix(in srgb, var(--bg-card-strong, rgba(11,17,32,.92)) 88%, transparent); backdrop-filter:blur(8px); color:var(--text-secondary, #cbd5e1); font-size:.65rem; box-shadow:0 8px 22px rgba(2,6,23,.18); }
    .legend span { display:inline-flex; align-items:center; gap:.3rem; }
    .swatch { width:.66rem; height:.66rem; border-radius:3px; }
    @media (max-width:860px) { .body { grid-template-columns:1fr; } .controls { border-top:1px solid var(--border, rgba(148,163,184,.2)); border-left:0; } .stage { min-height:22rem; } .head { flex-direction:column; } }
  `;

  // The simulator lives inside a ~688px article column, so the two-column split has
  // to answer to the element width, not the viewport: hence container queries.
  const wildfireStyle = `${hotspotStyle}
    :host { container-type:inline-size; }
    .body { min-height:0; align-items:start; }
    .stage { flex-direction:column; align-items:stretch; justify-content:flex-start; gap:.75rem; }
    canvas { aspect-ratio:3 / 2; max-height:none; }
    .buttons { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    .buttons .wide { grid-column:1 / -1; }
    .buttons .primary { background:var(--surface, #1e293b); }
    .buttons .accent { border-color:color-mix(in srgb, var(--accent, #10b981) 65%, transparent); background:var(--accent, #10b981); color:#fff; }
    .buttons .accent:hover { background:var(--accent-strong, #34d399); color:#052e24; }
    .buttons .soft { background:color-mix(in srgb, var(--surface, #1e293b) 75%, var(--text-primary, #e2e8f0) 8%); }
    button:disabled { cursor:not-allowed; opacity:.52; transform:none; }
    .progress { height:5px; margin-top:.8rem; overflow:hidden; border-radius:999px; background:var(--border, rgba(148,163,184,.2)); }
    .progress > i { display:block; width:0; height:100%; background:var(--accent, #10b981); transition:width .15s ease; }
    .metric span { display:block; }
    .legend { position:static; left:auto; bottom:auto; justify-content:center; align-items:center; gap:.4rem 1rem; box-shadow:none; }
    .legend .swatch { box-shadow:0 0 0 1px var(--border, rgba(148,163,184,.35)); }
    .legend .ramp { gap:.45rem; }
    .legend .gradient { width:5.5rem; height:.55rem; border-radius:999px; border:1px solid var(--border, rgba(148,163,184,.2)); }
    .legend em { font-style:normal; color:var(--text-muted, #94a3b8); font:600 .62rem/1 'JetBrains Mono', monospace; }
    @container (max-width:52rem) {
      .body { grid-template-columns:1fr; }
      .controls { display:grid; grid-template-columns:repeat(auto-fit, minmax(11.5rem, 1fr)); gap:0 1.1rem; align-items:start; border-top:1px solid var(--border, rgba(148,163,184,.2)); border-left:0; }
      .control { margin-bottom:.9rem; }
      .buttons, .progress, .metrics, .note { grid-column:1 / -1; }
      .buttons { grid-template-columns:repeat(auto-fit, minmax(9rem, 1fr)); }
      .buttons .wide { grid-column:auto; }
    }
  `;

  const HOTSPOT_COPY = {
    it: {
      experiment: 'Esperimento 01', title: 'Il punto rosso e la sorgente termica',
      intro: 'Riduci la cella e sposta la sorgente: il simbolo pubblicato rimane al centro del pixel che contiene l’anomalia.',
      status: 'didattico', published: 'hotspot pubblicato', source: 'sorgente simulata',
      sensor: 'Sensore concettuale', horizontal: 'Posizione orizzontale', vertical: 'Posizione verticale',
      random: 'Sposta casualmente la sorgente', nominalPixel: 'pixel nominale', offset: 'offset dal centro', notPerimeter: 'non è un perimetro',
      note: 'La scala è illustrativa. I prodotti reali dipendono dalla geometria del sensore e dall’algoritmo di rilevazione.',
      canvasLabel: 'Dimostrazione della relazione tra hotspot e pixel', modisTitle: 'MODIS · cella nominale più ampia', viirsTitle: 'VIIRS · cella nominale più fine',
      canvasHint: 'Il simbolo resta al centro della cella, la sorgente può stare altrove.'
    },
    en: {
      experiment: 'Experiment 01', title: 'The red dot and the thermal source',
      intro: 'Shrink the cell and move the source: the published symbol remains at the centre of the pixel that contains the anomaly.',
      status: 'educational', published: 'published hotspot', source: 'simulated source',
      sensor: 'Conceptual sensor', horizontal: 'Horizontal position', vertical: 'Vertical position',
      random: 'Move source randomly', nominalPixel: 'nominal pixel', offset: 'offset from centre', notPerimeter: 'not a perimeter',
      note: 'The scale is illustrative. Real products depend on sensor geometry and on the detection algorithm.',
      canvasLabel: 'Demonstration of the relationship between a hotspot and its pixel', modisTitle: 'MODIS · larger nominal cell', viirsTitle: 'VIIRS · finer nominal cell',
      canvasHint: 'The symbol stays at the centre of the cell; the source can be elsewhere.'
    }
  };

  const WILDFIRE_COPY = {
    it: {
      experiment: 'Esperimento 02',
      title: 'Propagazione probabilistica su un paesaggio sintetico',
      intro: 'Vento, umidità, continuità del combustibile e spotting cambiano il percorso. La modalità ensemble sovrappone più futuri possibili.',
      canvasLabel: 'Simulatore didattico della propagazione di un incendio',
      front: 'fronte attivo', burned: 'bruciato', vegetation: 'vegetazione', probability: 'probabilità ensemble',
      wind: 'Forza del vento', direction: 'Direzione', humidity: 'Umidità', fuel: 'Continuità del combustibile', spotting: 'Spotting',
      start: 'Avvia', pause: 'Pausa', resume: 'Riprendi', reset: 'Azzera', ensemble: 'Calcola 32 scenari', calculating: 'Calcolo in corso…',
      steps: 'passi', reached: 'area raggiunta', view: 'vista', single: 'singolo', ensembleMode: 'ensemble',
      note: 'Automa cellulare esplicativo. Non incorpora la fisica completa della combustione, dati osservati o regole operative.',
      windCanvas: 'VENTO', ensembleCanvas: '32 futuri sovrapposti'
    },
    en: {
      experiment: 'Experiment 02',
      title: 'Probabilistic spread across a synthetic landscape',
      intro: 'Wind, humidity, fuel continuity, and spotting change the path. Ensemble mode overlays several possible futures.',
      canvasLabel: 'Educational wildfire spread simulator',
      front: 'active front', burned: 'burned', vegetation: 'vegetation', probability: 'ensemble probability',
      wind: 'Wind strength', direction: 'Direction', humidity: 'Humidity', fuel: 'Fuel continuity', spotting: 'Spotting',
      start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset', ensemble: 'Run 32 scenarios', calculating: 'Calculating…',
      steps: 'steps', reached: 'reached area', view: 'view', single: 'single', ensembleMode: 'ensemble',
      note: 'Explanatory cellular automaton. It does not include full combustion physics, observed data, or operational rules.',
      windCanvas: 'WIND', ensembleCanvas: '32 overlaid outcomes'
    }
  };

  class RNG {
    constructor(seed = 1) { this.s = seed >>> 0 || 1; }
    next() {
      let x = this.s;
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      this.s = x >>> 0;
      return this.s / 4294967296;
    }
    normal() {
      const u = Math.max(this.next(), 1e-12);
      const v = this.next();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function makeLandscape(rows, cols, seed = 202608) {
    const rng = new RNG(seed);
    const size = rows * cols;
    let noise = new Float32Array(size);
    for (let i = 0; i < size; i += 1) noise[i] = rng.next();
    for (let round = 0; round < 7; round += 1) {
      const next = new Float32Array(size);
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          let sum = 0; let count = 0;
          for (let dy = -1; dy <= 1; dy += 1) {
            for (let dx = -1; dx <= 1; dx += 1) {
              const ny = y + dy; const nx = x + dx;
              if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
                sum += noise[ny * cols + nx]; count += 1;
              }
            }
          }
          next[y * cols + x] = sum / count;
        }
      }
      noise = next;
    }
    let min = Infinity; let max = -Infinity;
    for (const v of noise) { min = Math.min(min, v); max = Math.max(max, v); }
    for (let i = 0; i < size; i += 1) noise[i] = (noise[i] - min) / Math.max(1e-6, max - min);

    const elevation = new Float32Array(size);
    const fuel = new Float32Array(size);
    const slope = new Float32Array(size);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const nx = x / cols; const ny = y / rows;
        const hillA = Math.exp(-(((nx - .34) / .24) ** 2 + ((ny - .38) / .27) ** 2));
        const hillB = .9 * Math.exp(-(((nx - .72) / .25) ** 2 + ((ny - .68) / .25) ** 2));
        const idx = y * cols + x;
        elevation[idx] = clamp(.1 + .58 * hillA + .62 * hillB + .13 * noise[idx], 0, 1);
        fuel[idx] = clamp(.26 + .7 * noise[idx], 0, 1);
        const roadY = Math.floor(rows * (.58 + .06 * Math.sin(x / 11)));
        if (Math.abs(y - roadY) <= 1) fuel[idx] *= .12;
      }
    }
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const idx = y * cols + x;
        const left = elevation[y * cols + Math.max(0, x - 1)];
        const right = elevation[y * cols + Math.min(cols - 1, x + 1)];
        const down = elevation[Math.max(0, y - 1) * cols + x];
        const up = elevation[Math.min(rows - 1, y + 1) * cols + x];
        slope[idx] = clamp(Math.hypot(right - left, up - down) * 7, 0, 1);
      }
    }
    return { rows, cols, elevation, fuel, slope };
  }

  function colorMix(a, b, t) {
    const pa = a.match(/\w\w/g).map(v => parseInt(v, 16));
    const pb = b.match(/\w\w/g).map(v => parseInt(v, 16));
    return pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  }

  function rgbCss(rgb) { return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`; }

  // Three-stop sequential ramp for the ensemble probability surface.
  function rampAt(palette, t) {
    return t <= .5
      ? colorMix(palette.rampLow, palette.rampMid, t / .5)
      : colorMix(palette.rampMid, palette.rampHigh, (t - .5) / .5);
  }

  const WILDFIRE_PALETTES = {
    dark: {
      background: '#141f31', terrainLow: '#1b352f', terrainHigh: '#4e7659',
      burnedLow: '#3c1f18', burnedHigh: '#140907',
      activeLow: '#fcd34d', activeHigh: '#dc2626',
      rampLow: '#1e3a5f', rampMid: '#f59e0b', rampHigh: '#991b1b',
      contour: 'rgba(226,232,240,.15)', road: 'rgba(226,232,240,.6)',
      ink: '#e2e8f0', chip: 'rgba(10,16,28,.82)', chipBorder: 'rgba(148,163,184,.3)'
    },
    light: {
      background: '#e8efe9', terrainLow: '#e2ecdf', terrainHigh: '#43684d',
      burnedLow: '#7a4630', burnedHigh: '#2a100b',
      activeLow: '#f59e0b', activeHigh: '#c81e0f',
      rampLow: '#dbeafe', rampMid: '#f59e0b', rampHigh: '#7f1d1d',
      contour: 'rgba(255,255,255,.28)', road: 'rgba(250,251,252,.85)',
      ink: '#0d1b2a', chip: 'rgba(255,255,255,.88)', chipBorder: 'rgba(15,23,42,.14)'
    }
  };

  class HotspotDemo extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: 'open' });
      this.language = document.documentElement.lang === 'en' ? 'en' : 'it';
      this.copy = HOTSPOT_COPY[this.language];
      root.innerHTML = `
        <style>${hotspotStyle}</style>
        <div class="lab">
          <div class="head">
            <div><div class="eyebrow">${this.copy.experiment}</div><h3>${this.copy.title}</h3><p>${this.copy.intro}</p></div>
            <div class="status">${this.copy.status}</div>
          </div>
          <div class="body">
            <div class="stage"><canvas width="900" height="560" aria-label="${this.copy.canvasLabel}"></canvas>
              <div class="legend"><span><i class="swatch" style="background:#fb7185"></i> ${this.copy.published}</span><span><i class="swatch" style="background:#f97316"></i> ${this.copy.source}</span></div>
            </div>
            <div class="controls">
              <div class="control"><div class="control-head"><label for="sensor">${this.copy.sensor}</label></div><select id="sensor"><option value="5">MODIS · ~1 km</option><option value="12">VIIRS · ~375 m</option></select></div>
              <div class="control"><div class="control-head"><label for="x">${this.copy.horizontal}</label><output id="xv">68%</output></div><input id="x" type="range" min="4" max="96" value="68"></div>
              <div class="control"><div class="control-head"><label for="y">${this.copy.vertical}</label><output id="yv">42%</output></div><input id="y" type="range" min="4" max="96" value="42"></div>
              <div class="buttons"><button id="random">${this.copy.random}</button></div>
              <div class="metrics"><div class="metric"><strong id="cell">1 km</strong><span>${this.copy.nominalPixel}</span></div><div class="metric"><strong id="offset">—</strong><span>${this.copy.offset}</span></div><div class="metric"><strong>≠</strong><span>${this.copy.notPerimeter}</span></div></div>
              <div class="note">${this.copy.note}</div>
            </div>
          </div>
        </div>`;
      this.canvas = root.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.sensor = root.querySelector('#sensor');
      this.x = root.querySelector('#x');
      this.y = root.querySelector('#y');
      const update = () => { root.querySelector('#xv').value = `${this.x.value}%`; root.querySelector('#yv').value = `${this.y.value}%`; this.draw(); };
      this.sensor.addEventListener('change', update);
      this.x.addEventListener('input', update);
      this.y.addEventListener('input', update);
      root.querySelector('#random').addEventListener('click', () => {
        this.x.value = String(Math.round(7 + Math.random() * 86));
        this.y.value = String(Math.round(7 + Math.random() * 86));
        update();
      });
      this.resizeObserver = new ResizeObserver(() => this.draw());
      this.resizeObserver.observe(this.canvas);
      this.themeObserver = new MutationObserver(() => this.draw());
      this.themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
      this.draw();
    }

    disconnectedCallback() {
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.themeObserver) this.themeObserver.disconnect();
    }

    draw() {
      if (!this.ctx) return;
      const c = this.canvas; const ctx = this.ctx;
      const w = c.width; const h = c.height;
      const dark = document.body.dataset.theme !== 'light';
      const palette = dark
        ? { canvas: '#152235', cell: '#1d3147', grid: 'rgba(148,163,184,.38)', selected: 'rgba(16,185,129,.22)', border: '#34d399', hotspot: '#fb7185', source: '#fb923c', line: '#e2e8f0', text: '#e2e8f0', muted: '#94a3b8' }
        : { canvas: '#edf4f0', cell: '#dcebe2', grid: 'rgba(71,85,105,.3)', selected: 'rgba(5,150,105,.17)', border: '#059669', hotspot: '#e11d48', source: '#ea580c', line: '#0f172a', text: '#0f172a', muted: '#64748b' };
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = palette.canvas; ctx.fillRect(0, 0, w, h);
      const n = Number(this.sensor.value || 5);
      const margin = 48; const side = Math.min(w - margin * 2, h - margin * 2);
      const ox = (w - side) / 2; const oy = (h - side) / 2;
      const cell = side / n;
      const fx = ox + side * Number(this.x.value) / 100;
      const fy = oy + side * (1 - Number(this.y.value) / 100);
      const col = clamp(Math.floor((fx - ox) / cell), 0, n - 1);
      const row = clamp(Math.floor((fy - oy) / cell), 0, n - 1);
      const cx = ox + (col + .5) * cell; const cy = oy + (row + .5) * cell;

      ctx.fillStyle = palette.selected;
      ctx.fillRect(ox + col * cell, oy + row * cell, cell, cell);
      ctx.strokeStyle = palette.border; ctx.lineWidth = 4;
      ctx.strokeRect(ox + col * cell, oy + row * cell, cell, cell);
      ctx.strokeStyle = palette.grid; ctx.lineWidth = n > 8 ? 1 : 2;
      for (let i = 0; i <= n; i += 1) {
        ctx.beginPath(); ctx.moveTo(ox + i * cell, oy); ctx.lineTo(ox + i * cell, oy + side); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, oy + i * cell); ctx.lineTo(ox + side, oy + i * cell); ctx.stroke();
      }
      ctx.fillStyle = palette.hotspot; ctx.beginPath(); ctx.arc(cx, cy, n > 8 ? 9 : 14, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = palette.line; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = palette.source;
      ctx.beginPath(); ctx.moveTo(fx, fy - 17); ctx.lineTo(fx - 14, fy + 12); ctx.lineTo(fx + 14, fy + 12); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = palette.line; ctx.lineWidth = 2; ctx.stroke();
      ctx.setLineDash([8, 7]); ctx.strokeStyle = palette.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(fx, fy); ctx.stroke(); ctx.setLineDash([]);

      ctx.fillStyle = palette.text; ctx.font = '700 22px Inter, sans-serif';
      ctx.fillText(n === 5 ? this.copy.modisTitle : this.copy.viirsTitle, 35, 36);
      ctx.font = '500 16px Inter, sans-serif'; ctx.fillStyle = palette.muted;
      ctx.fillText(this.copy.canvasHint, 35, h - 22);

      const dx = Math.abs(fx - cx) / cell; const dy = Math.abs(fy - cy) / cell;
      this.shadowRoot.querySelector('#cell').textContent = n === 5 ? '1 km' : '375 m';
      this.shadowRoot.querySelector('#offset').textContent = `${Math.round(Math.hypot(dx, dy) * 100)}%`;
    }
  }

  class WildfireSimulator extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: 'open' });
      this.language = document.documentElement.lang === 'en' ? 'en' : 'it';
      this.copy = WILDFIRE_COPY[this.language];
      this.locale = this.language === 'en' ? 'en-US' : 'it-IT';
      root.innerHTML = `
        <style>${wildfireStyle}</style>
        <div class="lab">
          <div class="head">
            <div><div class="eyebrow">${this.copy.experiment}</div><h3>${this.copy.title}</h3><p>${this.copy.intro}</p></div>
          </div>
          <div class="body">
            <div class="stage"><canvas width="960" height="640" aria-label="${this.copy.canvasLabel}"></canvas>
              <div class="legend" id="legend"></div>
            </div>
            <div class="controls">
              <div class="control"><div class="control-head"><label for="wind">${this.copy.wind}</label><output id="windv">0</output></div><input id="wind" type="range" min="0" max="100" value="65"></div>
              <div class="control"><div class="control-head"><label for="angle">${this.copy.direction}</label><output id="anglev">25°</output></div><input id="angle" type="range" min="0" max="359" value="25"></div>
              <div class="control"><div class="control-head"><label for="humidity">${this.copy.humidity}</label><output id="humidityv">30%</output></div><input id="humidity" type="range" min="10" max="70" value="30"></div>
              <div class="control"><div class="control-head"><label for="fuel">${this.copy.fuel}</label><output id="fuelv">82%</output></div><input id="fuel" type="range" min="25" max="100" value="82"></div>
              <div class="control"><div class="control-head"><label for="spotting">${this.copy.spotting}</label><output id="spottingv">0</output></div><input id="spotting" type="range" min="0" max="50" value="18"></div>
              <div class="buttons"><button class="primary" id="run">${this.copy.start}</button><button class="soft" id="reset">${this.copy.reset}</button><button class="accent wide" id="ensemble">${this.copy.ensemble}</button></div>
              <div class="progress"><i id="bar"></i></div>
              <div class="metrics"><div class="metric"><strong id="step">0</strong><span>${this.copy.steps}</span></div><div class="metric"><strong id="burned">0%</strong><span>${this.copy.reached}</span></div><div class="metric"><strong id="mode">${this.copy.single}</strong><span>${this.copy.view}</span></div></div>
              <div class="note">${this.copy.note}</div>
            </div>
          </div>
        </div>`;
      this.canvas = root.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.rows = 80; this.cols = 120;
      // A cell keeps burning for a few ticks, so the front has depth and keeps
      // trying its neighbours instead of dying after a single attempt.
      this.burnTicks = 5;
      this.land = makeLandscape(this.rows, this.cols);
      this.controls = {};
      for (const id of ['wind', 'angle', 'humidity', 'fuel', 'spotting']) this.controls[id] = root.querySelector(`#${id}`);
      this.running = false; this.ensembleProb = null;
      this.seedCounter = 0;
      // bindControls() draws once to reflect the sliders, so the state must
      // already exist before that first render.
      this.state = new Uint8Array(this.rows * this.cols);
      this.life = new Uint8Array(this.rows * this.cols);
      this.bindControls();
      root.querySelector('#run').addEventListener('click', () => this.toggle());
      root.querySelector('#reset').addEventListener('click', () => this.reset());
      root.querySelector('#ensemble').addEventListener('click', () => this.runEnsemble());
      this.themeObserver = new MutationObserver(() => this.draw());
      this.themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
      this.resizeObserver = new ResizeObserver(() => this.draw());
      this.resizeObserver.observe(this.canvas);
      this.reset();
    }

    disconnectedCallback() {
      this.running = false;
      if (this.themeObserver) this.themeObserver.disconnect();
      if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    palette() {
      return WILDFIRE_PALETTES[document.body.dataset.theme === 'light' ? 'light' : 'dark'];
    }

    // The canvas is laid out fluidly, so its backing store has to follow the CSS
    // box: otherwise labels and cells are drawn at 960px and squeezed into ~360px.
    syncCanvasSize() {
      const cssWidth = Math.max(280, Math.round(this.canvas.clientWidth || 900));
      const cssHeight = Math.round(cssWidth * this.rows / this.cols);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(cssWidth * dpr);
      const height = Math.round(cssHeight * dpr);
      if (this.canvas.width !== width) this.canvas.width = width;
      if (this.canvas.height !== height) this.canvas.height = height;
      return { width: cssWidth, height: cssHeight, dpr };
    }

    // The legend has to be built from the same palette the canvas uses, or the
    // swatches stop matching the map as soon as the theme flips.
    renderLegend() {
      const palette = this.palette();
      const legend = this.shadowRoot.querySelector('#legend');
      let markup;
      if (this.ensembleProb) {
        const gradient = `linear-gradient(90deg,${rgbCss(rampAt(palette, 0))},${rgbCss(rampAt(palette, .5))},${rgbCss(rampAt(palette, 1))})`;
        markup = `<span class="ramp">${this.copy.probability}<i class="gradient" style="background:${gradient}"></i><em>0 → 100%</em></span>`;
      } else {
        markup = [
          [colorMix(palette.terrainLow, palette.terrainHigh, .62), this.copy.vegetation],
          [colorMix(palette.activeLow, palette.activeHigh, .45), this.copy.front],
          [colorMix(palette.burnedLow, palette.burnedHigh, .55), this.copy.burned]
        ].map(([rgb, label]) => `<span><i class="swatch" style="background:${rgbCss(rgb)}"></i> ${label}</span>`).join('');
      }
      if (legend.innerHTML !== markup) legend.innerHTML = markup;
    }

    bindControls() {
      const root = this.shadowRoot;
      const show = () => {
        root.querySelector('#windv').value = this.formatNumber(Number(this.controls.wind.value) / 100, 2);
        root.querySelector('#anglev').value = `${this.controls.angle.value}°`;
        root.querySelector('#humidityv').value = `${this.controls.humidity.value}%`;
        root.querySelector('#fuelv').value = `${this.controls.fuel.value}%`;
        root.querySelector('#spottingv').value = `${this.formatNumber(Number(this.controls.spotting.value) / 10, 1)}%`;
        this.draw();
      };
      Object.values(this.controls).forEach(control => control.addEventListener('input', show));
      show();
    }

    formatNumber(value, maximumFractionDigits = 1) {
      return new Intl.NumberFormat(this.locale, { minimumFractionDigits: maximumFractionDigits, maximumFractionDigits }).format(value);
    }

    params() {
      return {
        wind: Number(this.controls.wind.value) / 100,
        angle: Number(this.controls.angle.value) * Math.PI / 180,
        humidity: Number(this.controls.humidity.value) / 100,
        continuity: Number(this.controls.fuel.value) / 100,
        spotting: Number(this.controls.spotting.value) / 1000
      };
    }

    ignition() {
      const state = new Uint8Array(this.rows * this.cols);
      const life = new Uint8Array(this.rows * this.cols);
      const burning = [];
      const sy = Math.floor(this.rows * .73); const sx = Math.floor(this.cols * .18);
      for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
        const idx = (sy + dy) * this.cols + sx + dx;
        state[idx] = 1; life[idx] = this.burnTicks; burning.push(idx);
      }
      return { state, life, burning };
    }

    reset() {
      this.running = false;
      this.shadowRoot.querySelector('#run').textContent = this.copy.start;
      const seeded = this.ignition();
      this.state = seeded.state; this.life = seeded.life; this.burning = seeded.burning;
      this.stepNo = 0; this.ensembleProb = null; this.seedCounter = 0;
      this.shadowRoot.querySelector('#bar').style.width = '0%';
      this.updateMetrics(this.copy.single); this.draw();
    }

    finished() { return this.stepNo >= 150 || this.burning.length === 0; }

    toggle() {
      // A finished run restarts from the ignition point instead of doing nothing.
      if (!this.running && (this.finished() || this.ensembleProb)) this.reset();
      this.running = !this.running;
      this.shadowRoot.querySelector('#run').textContent = this.running ? this.copy.pause : this.copy.resume;
      if (this.running) this.loop();
    }

    loop() {
      if (!this.running) return;
      for (let i = 0; i < 2; i += 1) this.stepSimulation();
      this.draw(); this.updateMetrics(this.copy.single);
      if (this.finished()) {
        this.running = false; this.shadowRoot.querySelector('#run').textContent = this.copy.start; return;
      }
      requestAnimationFrame(() => this.loop());
    }

    stepSimulation() {
      const result = this.advance(this.state, this.life, this.burning, this.params(), new RNG(1701 + this.seedCounter++));
      this.state = result.state; this.life = result.life; this.burning = result.burning; this.stepNo += 1;
    }

    // Neighbour offsets with a length weight: diagonals share less flame front.
    static get OFFSETS() {
      return [[-1,-1,.72],[-1,0,1],[-1,1,.72],[0,-1,1],[0,1,1],[1,-1,.72],[1,0,1],[1,1,.72]];
    }

    advance(state, life, burning, params, rng) {
      const nextState = state.slice(); const nextLife = life.slice(); const nextBurning = [];
      const candidates = new Map();
      const wy = Math.sin(params.angle); const wx = Math.cos(params.angle);
      const dryness = .3 + 1.4 * (1 - params.humidity);
      let frontSize = 0;
      for (const idx of burning) {
        const y = Math.floor(idx / this.cols); const x = idx % this.cols;
        if (life[idx] === this.burnTicks) frontSize += 1;
        for (const [dy, dx, weight] of WildfireSimulator.OFFSETS) {
          const ny = y + dy; const nx = x + dx;
          if (ny < 0 || ny >= this.rows || nx < 0 || nx >= this.cols) continue;
          const ni = ny * this.cols + nx;
          if (state[ni] !== 0) continue;
          const localFuel = this.land.fuel[ni] * params.continuity;
          if (localFuel < .04) continue;
          const norm = Math.hypot(dx, dy); const align = Math.max(0, (dx * wx + dy * wy) / norm);
          const uphill = Math.max(0, this.land.elevation[ni] - this.land.elevation[idx]);
          const push = 1 + 2.4 * params.wind * Math.pow(align, 1.4);
          const rise = 1 + 2.2 * Math.min(1, uphill * 9);
          let p = .062 * weight * (.3 + localFuel) * dryness * push * rise;
          p *= .75 + .5 * rng.next(); p = clamp(p, 0, .6);
          // Neighbours are independent ignition attempts, so accumulate the
          // survival probability instead of keeping only the strongest one.
          candidates.set(ni, (candidates.has(ni) ? candidates.get(ni) : 1) * (1 - p));
        }
        const remaining = life[idx] - 1;
        if (remaining <= 0) { nextState[idx] = 2; nextLife[idx] = 0; }
        else { nextLife[idx] = remaining; nextBurning.push(idx); }
      }
      // Embers leave the leading edge only, otherwise a deep front seeds the whole map.
      let embers = frontSize * params.spotting * params.wind * .15;
      while (embers > 0) {
        if (embers < 1 && rng.next() > embers) break;
        embers -= 1;
        const distance = 5 + Math.floor(rng.next() * 14);
        const source = burning[Math.floor(rng.next() * burning.length)];
        if (source === undefined) break;
        const ny = Math.round(Math.floor(source / this.cols) + wy * distance + rng.normal() * 1.8);
        const nx = Math.round((source % this.cols) + wx * distance + rng.normal() * 1.8);
        if (ny < 0 || ny >= this.rows || nx < 0 || nx >= this.cols) continue;
        const ni = ny * this.cols + nx;
        if (state[ni] !== 0) continue;
        const p = .55 * this.land.fuel[ni] * params.continuity * (1 - params.humidity);
        candidates.set(ni, (candidates.has(ni) ? candidates.get(ni) : 1) * (1 - p));
      }
      for (const [idx, survival] of candidates) {
        if (rng.next() < 1 - survival) { nextState[idx] = 1; nextLife[idx] = this.burnTicks; nextBurning.push(idx); }
      }
      return { state: nextState, life: nextLife, burning: nextBurning };
    }

    async runEnsemble() {
      this.running = false; this.shadowRoot.querySelector('#run').textContent = this.copy.start;
      const button = this.shadowRoot.querySelector('#ensemble');
      button.disabled = true; button.textContent = this.copy.calculating;
      const runs = 32; const counts = new Uint16Array(this.rows * this.cols);
      const base = this.params();
      for (let r = 0; r < runs; r += 1) {
        const rng = new RNG(9100 + r * 19);
        const params = {
          wind: clamp(base.wind + rng.normal() * .1, 0, 1),
          angle: base.angle + rng.normal() * .16,
          humidity: clamp(base.humidity + rng.normal() * .055, .05, .8),
          continuity: clamp(base.continuity + rng.normal() * .06, .2, 1),
          spotting: clamp(base.spotting + rng.normal() * .004, 0, .06)
        };
        let { state, life, burning } = this.ignition();
        for (let t = 0; t < 150 && burning.length; t += 1) {
          const next = this.advance(state, life, burning, params, rng);
          state = next.state; life = next.life; burning = next.burning;
        }
        for (let i = 0; i < state.length; i += 1) if (state[i] > 0) counts[i] += 1;
        this.shadowRoot.querySelector('#bar').style.width = `${((r + 1) / runs) * 100}%`;
        if (r % 4 === 3) await new Promise(resolve => setTimeout(resolve, 0));
      }
      this.ensembleProb = new Float32Array(counts.length);
      for (let i = 0; i < counts.length; i += 1) this.ensembleProb[i] = counts[i] / runs;
      this.updateMetrics(this.copy.ensembleMode); this.draw();
      button.disabled = false; button.textContent = this.copy.ensemble;
    }

    updateMetrics(mode) {
      const root = this.shadowRoot;
      let burned = 0;
      if (this.ensembleProb) {
        for (const p of this.ensembleProb) if (p >= .1) burned += 1;
      } else {
        for (const s of this.state) if (s > 0) burned += 1;
      }
      root.querySelector('#step').textContent = String(this.stepNo || 0);
      root.querySelector('#burned').textContent = `${this.formatNumber(100 * burned / this.state.length, 1)}%`;
      root.querySelector('#mode').textContent = mode;
    }

    draw() {
      if (!this.ctx || !this.land) return;
      const ctx = this.ctx;
      const view = this.syncCanvasSize();
      const w = view.width; const h = view.height;
      const cw = w / this.cols; const ch = h / this.rows;
      const palette = this.palette();
      this.renderLegend();
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      // Draw one logical cell as a rectangle for speed and crispness.
      ctx.fillStyle = palette.background; ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < this.rows; y += 1) {
        for (let x = 0; x < this.cols; x += 1) {
          const idx = y * this.cols + x;
          const v = clamp(.2 + .55 * this.land.fuel[idx] - .18 * this.land.elevation[idx], 0, 1);
          let rgb = colorMix(palette.terrainLow, palette.terrainHigh, v);
          if (this.ensembleProb) {
            const p = this.ensembleProb[idx];
            if (p > 0) rgb = rampAt(palette, Math.pow(p, .72));
          } else if (this.state[idx] === 2) rgb = colorMix(palette.burnedLow, palette.burnedHigh, .35 + .5 * this.land.fuel[idx]);
          else if (this.state[idx] === 1) {
            // Freshly lit cells read as the bright leading edge, older ones cool to red.
            const age = 1 - (this.life[idx] || 1) / this.burnTicks;
            rgb = colorMix(palette.activeLow, palette.activeHigh, clamp(age, 0, 1));
          }
          ctx.fillStyle = rgbCss(rgb);
          ctx.fillRect(x * cw, y * ch, Math.ceil(cw + .5), Math.ceil(ch + .5));
        }
      }
      // Terrain contours, road and wind arrow.
      ctx.strokeStyle = palette.contour; ctx.lineWidth = 1;
      for (let y = 8; y < this.rows; y += 10) {
        ctx.beginPath();
        for (let x = 0; x < this.cols; x += 1) {
          const yy = (y + 2.5 * Math.sin(x / 8)) * ch;
          if (x === 0) ctx.moveTo(0, yy); else ctx.lineTo(x * cw, yy);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = palette.road; ctx.lineWidth = Math.max(1.5, ch * 1.4); ctx.beginPath();
      for (let x = 0; x < this.cols; x += 1) {
        const y = this.rows * (.58 + .06 * Math.sin(x / 11));
        if (x === 0) ctx.moveTo(0, y * ch); else ctx.lineTo(x * cw, y * ch);
      }
      ctx.stroke();
      this.drawWindArrow(ctx, palette, w);
      if (this.ensembleProb) this.drawChip(ctx, palette, this.copy.ensembleCanvas, 14, 14);
    }

    // A chip keeps canvas labels readable over burned ground in either theme.
    drawChip(ctx, palette, label, x, y) {
      ctx.font = '700 13px Inter, system-ui, sans-serif';
      const padding = 8;
      const width = ctx.measureText(label).width + padding * 2;
      ctx.fillStyle = palette.chip;
      ctx.strokeStyle = palette.chipBorder; ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, width, 26, 8); else ctx.rect(x, y, width, 26);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = palette.ink; ctx.textBaseline = 'middle';
      ctx.fillText(label, x + padding, y + 14);
      ctx.textBaseline = 'alphabetic';
      return width;
    }

    drawWindArrow(ctx, palette, w) {
      const p = this.params();
      const length = 26 + p.wind * 22;
      const cx = w - 34 - length; const cy = 52;
      this.drawChip(ctx, palette, this.copy.windCanvas, w - 34 - length - 6, 14);
      ctx.strokeStyle = palette.ink; ctx.fillStyle = palette.ink; ctx.lineWidth = 2.5;
      const ex = cx + Math.cos(p.angle) * length; const ey = cy + Math.sin(p.angle) * length;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
      const head = 8; const a1 = p.angle + Math.PI * .82; const a2 = p.angle - Math.PI * .82;
      ctx.beginPath(); ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(a1) * head, ey + Math.sin(a1) * head);
      ctx.lineTo(ex + Math.cos(a2) * head, ey + Math.sin(a2) * head);
      ctx.closePath(); ctx.fill();
    }
  }

  if (!customElements.get('hotspot-demo')) customElements.define('hotspot-demo', HotspotDemo);
  if (!customElements.get('wildfire-simulator')) customElements.define('wildfire-simulator', WildfireSimulator);
})();
