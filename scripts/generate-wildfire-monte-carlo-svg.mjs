import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'Assets/fire-assets/images/04-propagazione-probabilistica.svg');

const CONFIG = Object.freeze({
  seed: 20260730,
  runs: 1000,
  cols: 120,
  rows: 56,
  steps: 70,
  ignition: { x: 14, y: 43 },
  samples: [17, 204, 731],
  base: {
    wind: 0.65,
    directionDeg: -22,
    humidity: 0.30,
    continuity: 0.83,
    spotting: 0.0011
  },
  uncertainty: {
    windSd: 0.10,
    directionSdDeg: 10,
    humiditySd: 0.05,
    continuitySd: 0.05,
    spottingLogSd: 0.34
  }
});

class RNG {
  constructor(seed = 1) {
    this.state = seed >>> 0 || 1;
  }

  next() {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 4294967296;
  }

  normal() {
    const u = Math.max(this.next(), 1e-12);
    const v = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const indexOf = (x, y) => y * CONFIG.cols + x;

function smooth(values, cols, rows, rounds) {
  let current = values;
  for (let round = 0; round < rounds; round += 1) {
    const next = new Float32Array(current.length);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        let sum = 0;
        let weight = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
            const w = dx === 0 && dy === 0 ? 2 : 1;
            sum += current[indexOf(nx, ny)] * w;
            weight += w;
          }
        }
        next[indexOf(x, y)] = sum / weight;
      }
    }
    current = next;
  }
  return current;
}

function normalize(values) {
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  const normalized = new Float32Array(values.length);
  for (let i = 0; i < values.length; i += 1) {
    normalized[i] = (values[i] - min) / Math.max(1e-9, max - min);
  }
  return normalized;
}

function makeLandscape() {
  const rng = new RNG(CONFIG.seed ^ 0x9e3779b9);
  const size = CONFIG.cols * CONFIG.rows;
  const raw = new Float32Array(size);
  for (let i = 0; i < size; i += 1) raw[i] = rng.next();
  const noise = normalize(smooth(raw, CONFIG.cols, CONFIG.rows, 5));
  const fuel = new Float32Array(size);
  const elevation = new Float32Array(size);
  const barrier = new Uint8Array(size); // 0 fuel, 1 road, 2 water/rock

  for (let y = 0; y < CONFIG.rows; y += 1) {
    for (let x = 0; x < CONFIG.cols; x += 1) {
      const nx = x / (CONFIG.cols - 1);
      const ny = y / (CONFIG.rows - 1);
      const hillA = Math.exp(-(((nx - 0.42) / 0.25) ** 2 + ((ny - 0.35) / 0.34) ** 2));
      const hillB = 0.72 * Math.exp(-(((nx - 0.79) / 0.18) ** 2 + ((ny - 0.68) / 0.27) ** 2));
      const idx = indexOf(x, y);
      elevation[idx] = clamp(0.08 + 0.58 * hillA + 0.48 * hillB + 0.12 * noise[idx], 0, 1);
      fuel[idx] = clamp(0.30 + 0.72 * noise[idx] - 0.08 * elevation[idx], 0.08, 1);

      const roadY = Math.round(35 + 2.7 * Math.sin(x / 13));
      const roadGap = x >= 55 && x <= 61;
      if (Math.abs(y - roadY) <= 1 && !roadGap) {
        barrier[idx] = 1;
        fuel[idx] = 0.035;
      }

      const lake = ((x - 83) / 9) ** 2 + ((y - 17) / 6) ** 2 < 1;
      const rock = ((x - 100) / 8) ** 2 + ((y - 42) / 5) ** 2 < 1;
      if (lake || rock) {
        barrier[idx] = 2;
        fuel[idx] = 0;
      }
    }
  }

  return { fuel, elevation, barrier };
}

function drawParameters(rng) {
  return {
    wind: clamp(CONFIG.base.wind + rng.normal() * CONFIG.uncertainty.windSd, 0.25, 1),
    directionDeg: CONFIG.base.directionDeg + rng.normal() * CONFIG.uncertainty.directionSdDeg,
    humidity: clamp(CONFIG.base.humidity + rng.normal() * CONFIG.uncertainty.humiditySd, 0.12, 0.55),
    continuity: clamp(CONFIG.base.continuity + rng.normal() * CONFIG.uncertainty.continuitySd, 0.60, 0.98),
    spotting: clamp(
      CONFIG.base.spotting * Math.exp(rng.normal() * CONFIG.uncertainty.spottingLogSd),
      0.00025,
      0.0035
    )
  };
}

function simulate(landscape, runIndex) {
  const rng = new RNG((CONFIG.seed + Math.imul(runIndex + 1, 2654435761)) >>> 0);
  const params = drawParameters(rng);
  const size = CONFIG.cols * CONFIG.rows;
  let state = new Uint8Array(size); // 0 available, 1 burning, 2 burned
  let burning = [];

  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      const x = CONFIG.ignition.x + dx;
      const y = CONFIG.ignition.y + dy;
      const idx = indexOf(x, y);
      state[idx] = 1;
      burning.push(idx);
    }
  }

  const offsets = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],             [1, 0],
    [-1, 1],  [0, 1],   [1, 1]
  ];
  const angle = params.directionDeg * Math.PI / 180;
  const wx = Math.cos(angle);
  const wy = Math.sin(angle);

  for (let step = 0; step < CONFIG.steps && burning.length > 0; step += 1) {
    const survival = new Map();

    for (const idx of burning) {
      const x = idx % CONFIG.cols;
      const y = Math.floor(idx / CONFIG.cols);
      state[idx] = 2;

      for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= CONFIG.cols || ny < 0 || ny >= CONFIG.rows) continue;
        const nextIdx = indexOf(nx, ny);
        if (state[nextIdx] !== 0 || landscape.barrier[nextIdx] === 2) continue;

        const distance = Math.hypot(dx, dy);
        const alignment = (dx * wx + dy * wy) / distance;
        const uphill = (landscape.elevation[nextIdx] - landscape.elevation[idx]) * 5;
        const fuelFactor = 0.28 + 0.92 * landscape.fuel[nextIdx] * params.continuity;
        const dryness = 1 - 0.72 * params.humidity;
        const windFactor = Math.exp(1.12 * params.wind * alignment);
        const slopeFactor = Math.exp(0.52 * uphill);
        const diagonal = distance > 1 ? 0.74 : 1;
        let probability = 0.44 * fuelFactor * dryness * windFactor * slopeFactor * diagonal;
        if (landscape.barrier[nextIdx] === 1) probability *= 0.10;
        probability = clamp(probability, 0.001, 0.82);

        const previousSurvival = survival.get(nextIdx) ?? 1;
        survival.set(nextIdx, previousSurvival * (1 - probability));
      }

      if (rng.next() < params.spotting * (0.4 + params.wind)) {
        const distance = 5 + Math.floor(-Math.log(Math.max(1e-9, 1 - rng.next())) * 7);
        const lateral = rng.normal() * 2.2;
        const nx = Math.round(x + wx * distance - wy * lateral);
        const ny = Math.round(y + wy * distance + wx * lateral);
        if (nx >= 0 && nx < CONFIG.cols && ny >= 0 && ny < CONFIG.rows) {
          const nextIdx = indexOf(nx, ny);
          if (state[nextIdx] === 0 && landscape.barrier[nextIdx] !== 2) {
            const probability = clamp(
              0.30 * landscape.fuel[nextIdx] * params.continuity * (1 - params.humidity),
              0,
              0.45
            );
            const previousSurvival = survival.get(nextIdx) ?? 1;
            survival.set(nextIdx, previousSurvival * (1 - probability));
          }
        }
      }
    }

    const nextBurning = [];
    for (const [idx, probabilityOfNoIgnition] of survival) {
      if (rng.next() < 1 - probabilityOfNoIgnition) {
        state[idx] = 1;
        nextBurning.push(idx);
      }
    }
    burning = nextBurning;
  }

  let burnedCells = 0;
  const reached = new Uint8Array(size);
  for (let i = 0; i < size; i += 1) {
    if (state[i] > 0) {
      reached[i] = 1;
      burnedCells += 1;
    }
  }
  return { reached, burnedCells, params };
}

function runMonteCarlo() {
  const landscape = makeLandscape();
  const counts = new Uint16Array(CONFIG.cols * CONFIG.rows);
  const samples = new Map();
  const burnedCells = [];

  for (let run = 0; run < CONFIG.runs; run += 1) {
    const result = simulate(landscape, run);
    burnedCells.push(result.burnedCells);
    for (let i = 0; i < result.reached.length; i += 1) counts[i] += result.reached[i];
    if (CONFIG.samples.includes(run)) samples.set(run, result);
  }

  const probability = new Float32Array(counts.length);
  for (let i = 0; i < counts.length; i += 1) probability[i] = counts[i] / CONFIG.runs;
  return { landscape, probability, samples, burnedCells };
}

const fmt = (value, digits = 0) => value.toFixed(digits).replace('.', ',');
const xml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function quantile(values, q) {
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const fraction = position - lower;
  return sorted[lower + 1] === undefined
    ? sorted[lower]
    : sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
}

function baseColor(landscape, idx) {
  if (landscape.barrier[idx] === 2) return '#dbe9ec';
  if (landscape.barrier[idx] === 1) return '#e7e2d8';
  const level = Math.min(4, Math.floor(landscape.fuel[idx] * 5));
  return ['#eef3ee', '#e7efe7', '#dce9de', '#cfe0d2', '#bdd2c2'][level];
}

function probabilityColor(probability, landscape, idx) {
  const p = probability[idx];
  if (p < 0.01) return baseColor(landscape, idx);
  if (p < 0.05) return '#fff1c7';
  if (p < 0.20) return '#ffd166';
  if (p < 0.50) return '#f6a13a';
  if (p < 0.80) return '#ed5a32';
  return '#a61b1b';
}

function horizontalRuns(colors, x, y, width, height) {
  const cellWidth = width / CONFIG.cols;
  const cellHeight = height / CONFIG.rows;
  const fragments = [];
  for (let row = 0; row < CONFIG.rows; row += 1) {
    let start = 0;
    let color = colors[indexOf(0, row)];
    for (let col = 1; col <= CONFIG.cols; col += 1) {
      const nextColor = col < CONFIG.cols ? colors[indexOf(col, row)] : null;
      if (nextColor !== color) {
        fragments.push(
          `<rect x="${fmt(x + start * cellWidth, 2)}" y="${fmt(y + row * cellHeight, 2)}" ` +
          `width="${fmt((col - start) * cellWidth + 0.08, 2)}" height="${fmt(cellHeight + 0.08, 2)}" fill="${color}"/>`
        );
        start = col;
        color = nextColor;
      }
    }
  }
  return fragments.join('');
}

function thresholdPath(probability, threshold, x, y, width, height) {
  const cellWidth = width / CONFIG.cols;
  const cellHeight = height / CONFIG.rows;
  const segments = [];
  const above = (col, row) => (
    col >= 0 && col < CONFIG.cols &&
    row >= 0 && row < CONFIG.rows &&
    probability[indexOf(col, row)] >= threshold
  );

  for (let row = 0; row < CONFIG.rows; row += 1) {
    for (let col = 0; col < CONFIG.cols; col += 1) {
      if (!above(col, row)) continue;
      const x0 = x + col * cellWidth;
      const y0 = y + row * cellHeight;
      const x1 = x0 + cellWidth;
      const y1 = y0 + cellHeight;
      if (!above(col, row - 1)) segments.push(`M${fmt(x0, 1)} ${fmt(y0, 1)}H${fmt(x1, 1)}`);
      if (!above(col + 1, row)) segments.push(`M${fmt(x1, 1)} ${fmt(y0, 1)}V${fmt(y1, 1)}`);
      if (!above(col, row + 1)) segments.push(`M${fmt(x0, 1)} ${fmt(y1, 1)}H${fmt(x1, 1)}`);
      if (!above(col - 1, row)) segments.push(`M${fmt(x0, 1)} ${fmt(y0, 1)}V${fmt(y1, 1)}`);
    }
  }
  return segments.join('');
}

function burnedRuns(reached, x, y, width, height) {
  const cellWidth = width / CONFIG.cols;
  const cellHeight = height / CONFIG.rows;
  const fragments = [];
  for (let row = 0; row < CONFIG.rows; row += 1) {
    let start = -1;
    for (let col = 0; col <= CONFIG.cols; col += 1) {
      const burned = col < CONFIG.cols && reached[indexOf(col, row)] === 1;
      if (burned && start < 0) start = col;
      if (!burned && start >= 0) {
        fragments.push(
          `<rect x="${fmt(x + start * cellWidth, 2)}" y="${fmt(y + row * cellHeight, 2)}" ` +
          `width="${fmt((col - start) * cellWidth + 0.08, 2)}" height="${fmt(cellHeight + 0.08, 2)}"/>`
        );
        start = -1;
      }
    }
  }
  return fragments.join('');
}

function windArrow(x, y, angleDeg, length = 34) {
  const angle = angleDeg * Math.PI / 180;
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  const left = angle + Math.PI * 0.82;
  const right = angle - Math.PI * 0.82;
  return `<path d="M${fmt(x, 1)} ${fmt(y, 1)}L${fmt(x2, 1)} ${fmt(y2, 1)} ` +
    `M${fmt(x2, 1)} ${fmt(y2, 1)}L${fmt(x2 + Math.cos(left) * 9, 1)} ${fmt(y2 + Math.sin(left) * 9, 1)} ` +
    `M${fmt(x2, 1)} ${fmt(y2, 1)}L${fmt(x2 + Math.cos(right) * 9, 1)} ${fmt(y2 + Math.sin(right) * 9, 1)}" ` +
    `fill="none" stroke="#102233" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function scenarioCard(run, result, x, y) {
  const mapX = x + 18;
  const mapY = y + 58;
  const mapW = 284;
  const mapH = 132.53;
  const ignitionX = mapX + (CONFIG.ignition.x + 0.5) * mapW / CONFIG.cols;
  const ignitionY = mapY + (CONFIG.ignition.y + 0.5) * mapH / CONFIG.rows;
  return `
    <g>
      <rect x="${x}" y="${y}" width="320" height="224" rx="22" fill="#ffffff" stroke="#e1e7ea"/>
      <text x="${x + 18}" y="${y + 29}" class="scenario-title">Corsa ${String(run + 1).padStart(3, '0')}</text>
      <text x="${x + 302}" y="${y + 29}" text-anchor="end" class="scenario-stat">${result.burnedCells} celle</text>
      <rect x="${mapX}" y="${mapY}" width="${mapW}" height="${mapH}" rx="10" fill="#e8f0e9"/>
      <g clip-path="url(#mini-${run})" fill="#e84b32" opacity=".88" shape-rendering="crispEdges">
        ${burnedRuns(result.reached, mapX, mapY, mapW, mapH)}
      </g>
      <circle cx="${fmt(ignitionX, 2)}" cy="${fmt(ignitionY, 2)}" r="4.5" fill="#102233" stroke="#ffffff" stroke-width="2"/>
      ${windArrow(x + 270, y + 205, result.params.directionDeg, 29)}
      <text x="${x + 18}" y="${y + 210}" class="scenario-note">vento ${fmt(result.params.wind, 2)} · umidità ${fmt(result.params.humidity * 100)}%</text>
    </g>`;
}

function createSvg(result) {
  const { landscape, probability, samples, burnedCells } = result;
  const map = { x: 84, y: 466, width: 1014, height: 473.2 };
  const mapColors = new Array(probability.length);
  for (let i = 0; i < probability.length; i += 1) {
    mapColors[i] = probabilityColor(probability, landscape, i);
  }

  const mean = burnedCells.reduce((sum, value) => sum + value, 0) / burnedCells.length;
  const q10 = quantile(burnedCells, 0.10);
  const q90 = quantile(burnedCells, 0.90);
  const maxStandardError = Math.sqrt(0.25 / CONFIG.runs) * 100;
  const ignitionX = map.x + (CONFIG.ignition.x + 0.5) * map.width / CONFIG.cols;
  const ignitionY = map.y + (CONFIG.ignition.y + 0.5) * map.height / CONFIG.rows;
  const metadata = xml(JSON.stringify({
    generator: 'scripts/generate-wildfire-monte-carlo-svg.mjs',
    config: CONFIG,
    summary: { meanBurnedCells: mean, q10BurnedCells: q10, q90BurnedCells: q90, maxMonteCarloStandardErrorPercentagePoints: maxStandardError }
  }));

  const sampleCards = CONFIG.samples
    .map((run, index) => scenarioCard(run, samples.get(run), 60 + index * 340, 170))
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img" aria-labelledby="title desc">
  <title id="title">Simulazione Monte Carlo della propagazione di un incendio su un paesaggio sintetico</title>
  <desc id="desc">Tre corse campionate e una mappa della quota di mille simulazioni in cui ogni cella è stata raggiunta dal fuoco. Il modello è un automa cellulare didattico con variazioni casuali di vento, umidità, continuità del combustibile e spotting.</desc>
  <metadata>${metadata}</metadata>
  <defs>
    ${CONFIG.samples.map(run => `<clipPath id="mini-${run}"><rect x="${78 + CONFIG.samples.indexOf(run) * 340}" y="228" width="284" height="132.53" rx="10"/></clipPath>`).join('')}
    <clipPath id="main-map"><rect x="${map.x}" y="${map.y}" width="${map.width}" height="${map.height}" rx="13"/></clipPath>
    <filter id="shadow" x="-12%" y="-12%" width="124%" height="130%"><feDropShadow dx="0" dy="7" stdDeviation="11" flood-color="#102233" flood-opacity=".08"/></filter>
    <style>
      text { font-family: Inter, "Helvetica Neue", Arial, sans-serif; fill:#102233; }
      .eyebrow { font-size:14px; font-weight:800; letter-spacing:1.7px; fill:#d93f2e; }
      .headline { font-size:44px; font-weight:800; letter-spacing:-1.1px; }
      .subtitle { font-size:19px; font-weight:500; fill:#607080; }
      .scenario-title { font-size:17px; font-weight:800; }
      .scenario-stat { font-size:14px; font-weight:700; fill:#607080; }
      .scenario-note { font-size:13px; font-weight:650; fill:#607080; }
      .section-label { font-size:14px; font-weight:800; letter-spacing:1.3px; fill:#d93f2e; }
      .map-title { font-size:25px; font-weight:800; }
      .map-note { font-size:15px; font-weight:550; fill:#607080; }
      .panel-title { font-size:19px; font-weight:800; }
      .body { font-size:15px; font-weight:550; fill:#526170; }
      .metric { font-size:28px; font-weight:800; }
      .metric-label { font-size:13px; font-weight:650; fill:#607080; }
      .legend { font-size:14px; font-weight:700; fill:#526170; }
      .mono { font-family:"SFMono-Regular", Consolas, monospace; font-size:13px; font-weight:650; fill:#526170; }
    </style>
  </defs>

  <rect width="1600" height="1000" fill="#f5f7f8"/>

  <text x="60" y="54" class="eyebrow">MONTE CARLO RIPRODUCIBILE · SEED ${CONFIG.seed}</text>
  <text x="60" y="105" class="headline">1.000 futuri, una mappa di frequenze</text>
  <text x="60" y="137" class="subtitle">Ogni valore è la quota di corse in cui la cella viene raggiunta entro ${CONFIG.steps} passi.</text>

  ${sampleCards}

  <g filter="url(#shadow)">
    <rect x="1080" y="170" width="460" height="224" rx="22" fill="#ffffff"/>
  </g>
  <text x="1106" y="203" class="section-label">COSA CAMBIA TRA LE CORSE</text>
  <text x="1106" y="237" class="panel-title">Input campionati</text>
  <text x="1106" y="266" class="mono">vento       N(0,65; 0,10), troncata</text>
  <text x="1106" y="291" class="mono">direzione   N(−22°; 10°)</text>
  <text x="1106" y="316" class="mono">umidità     N(30%; 5%), troncata</text>
  <text x="1106" y="341" class="mono">continuità  N(83%; 5%), troncata</text>
  <text x="1106" y="366" class="mono">spotting    lognormale, media ≈ 0,11%</text>

  <g filter="url(#shadow)">
    <rect x="60" y="420" width="1480" height="540" rx="24" fill="#ffffff"/>
  </g>
  <text x="84" y="451" class="section-label">PROBABILITÀ EMPIRICA DI PASSAGGIO</text>

  <g clip-path="url(#main-map)" shape-rendering="crispEdges">
    ${horizontalRuns(mapColors, map.x, map.y, map.width, map.height)}
    <path d="${thresholdPath(probability, 0.10, map.x, map.y, map.width, map.height)}" fill="none" stroke="#8d5708" stroke-width="1.4" opacity=".85"/>
    <path d="${thresholdPath(probability, 0.50, map.x, map.y, map.width, map.height)}" fill="none" stroke="#ffffff" stroke-width="2.4"/>
    <path d="${thresholdPath(probability, 0.90, map.x, map.y, map.width, map.height)}" fill="none" stroke="#102233" stroke-width="2.7"/>
    ${Array.from({ length: 11 }, (_, i) => `<path d="M${fmt(map.x + i * map.width / 10, 1)} ${map.y}V${fmt(map.y + map.height, 1)}" stroke="#ffffff" stroke-width="1" opacity=".13"/>`).join('')}
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${map.x} ${fmt(map.y + i * map.height / 5, 1)}H${fmt(map.x + map.width, 1)}" stroke="#ffffff" stroke-width="1" opacity=".13"/>`).join('')}
  </g>
  <rect x="${map.x}" y="${map.y}" width="${map.width}" height="${map.height}" rx="13" fill="none" stroke="#d5dfe2" stroke-width="2"/>
  <circle cx="${fmt(ignitionX, 2)}" cy="${fmt(ignitionY, 2)}" r="9" fill="#102233" stroke="#ffffff" stroke-width="3"/>
  <path d="M${fmt(ignitionX, 1)} ${fmt(ignitionY - 14, 1)}V${fmt(ignitionY - 38, 1)}H${fmt(ignitionX + 72, 1)}" fill="none" stroke="#102233" stroke-width="2"/>
  <text x="${fmt(ignitionX + 78, 1)}" y="${fmt(ignitionY - 32, 1)}" class="legend">innesco fisso</text>

  <text x="1140" y="486" class="panel-title">Quota delle 1.000 corse</text>
  ${[
    ['#eef3ee', '&lt; 1%'],
    ['#fff1c7', '1–5%'],
    ['#ffd166', '5–20%'],
    ['#f6a13a', '20–50%'],
    ['#ed5a32', '50–80%'],
    ['#a61b1b', '80–100%']
  ].map((entry, i) => `<rect x="1140" y="${510 + i * 34}" width="26" height="22" rx="5" fill="${entry[0]}" stroke="#d5dfe2"/><text x="1178" y="${527 + i * 34}" class="legend">${entry[1]}</text>`).join('')}

  <text x="1140" y="738" class="panel-title">Isolinee</text>
  <path d="M1140 766H1180" stroke="#8d5708" stroke-width="2"/><text x="1192" y="771" class="legend">10%</text>
  <path d="M1262 766H1302" stroke="#d7dfe3" stroke-width="5"/><path d="M1262 766H1302" stroke="#ffffff" stroke-width="2.5"/><text x="1314" y="771" class="legend">50%</text>
  <path d="M1384 766H1424" stroke="#102233" stroke-width="3"/><text x="1436" y="771" class="legend">90%</text>

  <line x1="1140" y1="798" x2="1500" y2="798" stroke="#e1e7ea"/>
  <text x="1140" y="828" class="metric">${fmt(mean)}</text>
  <text x="1140" y="849" class="metric-label">celle raggiunte in media</text>
  <text x="1290" y="828" class="metric">${fmt(q10)}–${fmt(q90)}</text>
  <text x="1290" y="849" class="metric-label">intervallo 10°–90° percentile</text>

  <rect x="1140" y="876" width="360" height="57" rx="12" fill="#fff8e8" stroke="#f0dca8"/>
  <text x="1155" y="899" class="metric-label" style="fill:#7c5b14">Errore Monte Carlo massimo: ${fmt(maxStandardError, 2)} p.p. (1σ)</text>
  <text x="1155" y="919" class="metric-label" style="fill:#7c5b14">Automa cellulare didattico, non calibrato.</text>
</svg>`;
}

const result = runMonteCarlo();
const svg = createSvg(result);
fs.writeFileSync(OUTPUT, svg, 'utf8');

const mean = result.burnedCells.reduce((sum, value) => sum + value, 0) / result.burnedCells.length;
console.log(JSON.stringify({
  output: path.relative(ROOT, OUTPUT),
  runs: CONFIG.runs,
  seed: CONFIG.seed,
  meanBurnedCells: Number(mean.toFixed(2)),
  q10BurnedCells: quantile(result.burnedCells, 0.10),
  q90BurnedCells: quantile(result.burnedCells, 0.90),
  maxMonteCarloStandardErrorPercentagePoints: Number((Math.sqrt(0.25 / CONFIG.runs) * 100).toFixed(3))
}, null, 2));
