(() => {
  'use strict';

  const COLORS = {
    navy: '#0d1b2a',
    navy2: '#1a2e42',
    red: '#e8412a',
    orange: '#f5a623',
    blue: '#2563eb',
    green: '#2d6a4f',
    sage: '#7a9e7e',
    paper: '#f7f8fa',
    white: '#ffffff',
    muted: '#6b7280',
    border: '#d1d5db',
    darkRed: '#7f1d1d'
  };

  const sharedStyle = `
    :host { display:block; margin:2rem 0; color:${COLORS.navy}; font-family:'DM Sans', system-ui, sans-serif; }
    * { box-sizing:border-box; }
    .lab { background:${COLORS.white}; border:1px solid #e5e7eb; border-radius:18px; overflow:hidden; box-shadow:0 16px 50px rgba(13,27,42,.08); }
    .head { padding:1.25rem 1.4rem 1rem; display:flex; gap:1rem; align-items:flex-start; justify-content:space-between; border-bottom:1px solid #e5e7eb; }
    .eyebrow { font:700 .68rem/1.2 'DM Mono', monospace; letter-spacing:.11em; text-transform:uppercase; color:${COLORS.red}; margin-bottom:.45rem; }
    h3 { margin:0; font-size:clamp(1.1rem,2vw,1.55rem); line-height:1.15; letter-spacing:-.025em; }
    .head p { margin:.45rem 0 0; color:${COLORS.muted}; font-size:.88rem; line-height:1.55; max-width:48rem; }
    .status { flex:0 0 auto; padding:.4rem .65rem; border-radius:999px; background:#fff7ed; color:#9a3412; font:700 .65rem/1.2 'DM Mono', monospace; text-transform:uppercase; letter-spacing:.06em; }
    .body { display:grid; grid-template-columns:minmax(0,1fr) 18rem; min-height:28rem; }
    .stage { position:relative; min-width:0; background:linear-gradient(145deg,#eef4ef,#dce8df); padding:1rem; display:flex; align-items:center; justify-content:center; }
    canvas { width:100%; height:auto; max-height:38rem; display:block; border-radius:12px; background:#e6eee7; touch-action:none; }
    .controls { padding:1rem 1.15rem 1.2rem; border-left:1px solid #e5e7eb; background:#fbfcfd; }
    .control { margin-bottom:1rem; }
    .control-head { display:flex; align-items:center; justify-content:space-between; gap:.7rem; margin-bottom:.35rem; }
    label { font-size:.78rem; font-weight:700; }
    output { font:700 .72rem/1 'DM Mono', monospace; color:${COLORS.red}; }
    input[type='range'] { width:100%; accent-color:${COLORS.red}; }
    select, input[type='text'] { width:100%; border:1px solid ${COLORS.border}; background:${COLORS.white}; color:${COLORS.navy}; padding:.65rem .7rem; border-radius:9px; font:600 .78rem 'DM Sans',sans-serif; }
    .buttons { display:grid; grid-template-columns:1fr 1fr; gap:.55rem; margin-top:1.1rem; }
    button { border:0; border-radius:9px; padding:.72rem .75rem; cursor:pointer; font:700 .75rem 'DM Sans',sans-serif; transition:transform .15s ease, opacity .15s ease; }
    button:hover { transform:translateY(-1px); }
    button:disabled { opacity:.45; cursor:not-allowed; transform:none; }
    .primary { background:${COLORS.navy}; color:${COLORS.white}; }
    .accent { background:${COLORS.red}; color:${COLORS.white}; }
    .soft { background:#e9eef5; color:${COLORS.navy}; }
    .wide { grid-column:1 / -1; }
    .metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; margin-top:1rem; }
    .metric { padding:.7rem .55rem; background:${COLORS.white}; border:1px solid #e5e7eb; border-radius:10px; text-align:center; }
    .metric strong { display:block; font:700 .88rem/1.2 'DM Mono',monospace; }
    .metric span { color:${COLORS.muted}; font-size:.62rem; }
    .note { margin-top:1rem; padding:.8rem .85rem; border-left:3px solid ${COLORS.orange}; background:#fffbeb; color:#7c5b14; font-size:.72rem; line-height:1.5; border-radius:0 9px 9px 0; }
    .legend { position:absolute; left:1.6rem; bottom:1.5rem; display:flex; flex-wrap:wrap; gap:.45rem .75rem; padding:.55rem .65rem; border-radius:9px; background:rgba(255,255,255,.9); backdrop-filter:blur(5px); font-size:.65rem; box-shadow:0 4px 18px rgba(13,27,42,.1); }
    .legend span { display:inline-flex; align-items:center; gap:.3rem; }
    .swatch { width:.66rem; height:.66rem; border-radius:2px; }
    .progress { height:5px; background:#e5e7eb; overflow:hidden; border-radius:999px; margin-top:.8rem; }
    .progress > i { display:block; width:0; height:100%; background:${COLORS.red}; transition:width .15s; }
    @media (max-width:860px) {
      .body { grid-template-columns:1fr; }
      .controls { border-left:0; border-top:1px solid #e5e7eb; }
      .stage { min-height:22rem; }
      .head { flex-direction:column; }
    }
  `;

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

  class HotspotDemo extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>${sharedStyle}</style>
        <div class="lab">
          <div class="head">
            <div><div class="eyebrow">Esperimento 01</div><h3>Il punto rosso e la sorgente termica</h3><p>Riduci la cella e sposta la sorgente: il simbolo pubblicato rimane al centro del pixel che contiene l’anomalia.</p></div>
            <div class="status">didattico</div>
          </div>
          <div class="body">
            <div class="stage"><canvas width="900" height="560" aria-label="Dimostrazione della relazione tra hotspot e pixel"></canvas>
              <div class="legend"><span><i class="swatch" style="background:${COLORS.red}"></i> hotspot pubblicato</span><span><i class="swatch" style="background:${COLORS.darkRed}"></i> sorgente simulata</span></div>
            </div>
            <div class="controls">
              <div class="control"><div class="control-head"><label for="sensor">Sensore concettuale</label></div><select id="sensor"><option value="5">MODIS · ~1 km</option><option value="12">VIIRS · ~375 m</option></select></div>
              <div class="control"><div class="control-head"><label for="x">Posizione orizzontale</label><output id="xv">68%</output></div><input id="x" type="range" min="4" max="96" value="68"></div>
              <div class="control"><div class="control-head"><label for="y">Posizione verticale</label><output id="yv">42%</output></div><input id="y" type="range" min="4" max="96" value="42"></div>
              <div class="buttons"><button class="soft wide" id="random">Sposta casualmente la sorgente</button></div>
              <div class="metrics"><div class="metric"><strong id="cell">1 km</strong><span>pixel nominale</span></div><div class="metric"><strong id="offset">—</strong><span>offset dal centro</span></div><div class="metric"><strong>≠</strong><span>non è un perimetro</span></div></div>
              <div class="note">La scala è illustrativa. I prodotti reali dipendono dalla geometria del sensore e dall’algoritmo di rilevazione.</div>
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
      this.draw();
    }

    disconnectedCallback() { if (this.resizeObserver) this.resizeObserver.disconnect(); }

    draw() {
      if (!this.ctx) return;
      const c = this.canvas; const ctx = this.ctx;
      const w = c.width; const h = c.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#dfeadf'; ctx.fillRect(0, 0, w, h);
      const n = Number(this.sensor.value || 5);
      const margin = 48; const side = Math.min(w - margin * 2, h - margin * 2);
      const ox = (w - side) / 2; const oy = (h - side) / 2;
      const cell = side / n;
      const fx = ox + side * Number(this.x.value) / 100;
      const fy = oy + side * (1 - Number(this.y.value) / 100);
      const col = clamp(Math.floor((fx - ox) / cell), 0, n - 1);
      const row = clamp(Math.floor((fy - oy) / cell), 0, n - 1);
      const cx = ox + (col + .5) * cell; const cy = oy + (row + .5) * cell;

      ctx.fillStyle = 'rgba(245,166,35,.34)';
      ctx.fillRect(ox + col * cell, oy + row * cell, cell, cell);
      ctx.strokeStyle = COLORS.red; ctx.lineWidth = 4;
      ctx.strokeRect(ox + col * cell, oy + row * cell, cell, cell);
      ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.lineWidth = n > 8 ? 1 : 2;
      for (let i = 0; i <= n; i += 1) {
        ctx.beginPath(); ctx.moveTo(ox + i * cell, oy); ctx.lineTo(ox + i * cell, oy + side); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, oy + i * cell); ctx.lineTo(ox + side, oy + i * cell); ctx.stroke();
      }
      ctx.fillStyle = COLORS.red; ctx.beginPath(); ctx.arc(cx, cy, n > 8 ? 9 : 14, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = COLORS.white; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = COLORS.darkRed;
      ctx.beginPath(); ctx.moveTo(fx, fy - 17); ctx.lineTo(fx - 14, fy + 12); ctx.lineTo(fx + 14, fy + 12); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = COLORS.white; ctx.lineWidth = 2; ctx.stroke();
      ctx.setLineDash([8, 7]); ctx.strokeStyle = COLORS.navy; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(fx, fy); ctx.stroke(); ctx.setLineDash([]);

      ctx.fillStyle = COLORS.navy; ctx.font = '700 23px DM Sans, sans-serif';
      ctx.fillText(n === 5 ? 'MODIS · cella nominale più ampia' : 'VIIRS · cella nominale più fine', 35, 36);
      ctx.font = '500 16px DM Sans, sans-serif'; ctx.fillStyle = COLORS.muted;
      ctx.fillText('Il simbolo resta al centro della cella, la sorgente può stare altrove.', 35, h - 22);

      const dx = Math.abs(fx - cx) / cell; const dy = Math.abs(fy - cy) / cell;
      this.shadowRoot.querySelector('#cell').textContent = n === 5 ? '1 km' : '375 m';
      this.shadowRoot.querySelector('#offset').textContent = `${Math.round(Math.hypot(dx, dy) * 100)}%`;
    }
  }

  class WildfireSimulator extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>${sharedStyle}</style>
        <div class="lab">
          <div class="head">
            <div><div class="eyebrow">Esperimento 02</div><h3>Propagazione probabilistica su un paesaggio sintetico</h3><p>Vento, umidità, continuità del combustibile e spotting cambiano il percorso. La modalità ensemble sovrappone più futuri possibili.</p></div>
            <div class="status">non operativo</div>
          </div>
          <div class="body">
            <div class="stage"><canvas width="960" height="640" aria-label="Simulatore didattico della propagazione di un incendio"></canvas>
              <div class="legend"><span><i class="swatch" style="background:${COLORS.orange}"></i> fronte</span><span><i class="swatch" style="background:${COLORS.darkRed}"></i> bruciato</span><span><i class="swatch" style="background:${COLORS.blue}"></i> probabilità ensemble</span></div>
            </div>
            <div class="controls">
              <div class="control"><div class="control-head"><label for="wind">Forza del vento</label><output id="windv">0,65</output></div><input id="wind" type="range" min="0" max="100" value="65"></div>
              <div class="control"><div class="control-head"><label for="angle">Direzione</label><output id="anglev">25°</output></div><input id="angle" type="range" min="0" max="359" value="25"></div>
              <div class="control"><div class="control-head"><label for="humidity">Umidità</label><output id="humidityv">30%</output></div><input id="humidity" type="range" min="10" max="70" value="30"></div>
              <div class="control"><div class="control-head"><label for="fuel">Continuità del combustibile</label><output id="fuelv">82%</output></div><input id="fuel" type="range" min="25" max="100" value="82"></div>
              <div class="control"><div class="control-head"><label for="spotting">Spotting</label><output id="spottingv">1,8%</output></div><input id="spotting" type="range" min="0" max="50" value="18"></div>
              <div class="buttons"><button class="primary" id="run">Avvia</button><button class="soft" id="reset">Azzera</button><button class="accent wide" id="ensemble">Calcola 32 scenari</button></div>
              <div class="progress"><i id="bar"></i></div>
              <div class="metrics"><div class="metric"><strong id="step">0</strong><span>passi</span></div><div class="metric"><strong id="burned">0%</strong><span>area raggiunta</span></div><div class="metric"><strong id="mode">singolo</strong><span>vista</span></div></div>
              <div class="note">Automa cellulare esplicativo. Non incorpora la fisica completa della combustione, dati osservati o regole operative.</div>
            </div>
          </div>
        </div>`;
      this.canvas = root.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.rows = 80; this.cols = 120;
      this.land = makeLandscape(this.rows, this.cols);
      this.controls = {};
      for (const id of ['wind', 'angle', 'humidity', 'fuel', 'spotting']) this.controls[id] = root.querySelector(`#${id}`);
      this.running = false; this.frame = 0; this.ensembleProb = null;
      this.seedCounter = 0;
      this.bindControls();
      root.querySelector('#run').addEventListener('click', () => this.toggle());
      root.querySelector('#reset').addEventListener('click', () => this.reset());
      root.querySelector('#ensemble').addEventListener('click', () => this.runEnsemble());
      this.reset();
    }

    bindControls() {
      const root = this.shadowRoot;
      const show = () => {
        root.querySelector('#windv').value = (Number(this.controls.wind.value) / 100).toFixed(2).replace('.', ',');
        root.querySelector('#anglev').value = `${this.controls.angle.value}°`;
        root.querySelector('#humidityv').value = `${this.controls.humidity.value}%`;
        root.querySelector('#fuelv').value = `${this.controls.fuel.value}%`;
        root.querySelector('#spottingv').value = `${(Number(this.controls.spotting.value) / 10).toFixed(1).replace('.', ',')}%`;
        this.draw();
      };
      Object.values(this.controls).forEach(control => control.addEventListener('input', show));
      show();
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

    reset() {
      this.running = false;
      this.shadowRoot.querySelector('#run').textContent = 'Avvia';
      this.state = new Uint8Array(this.rows * this.cols);
      this.burning = [];
      const sy = Math.floor(this.rows * .73); const sx = Math.floor(this.cols * .18);
      for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
        const idx = (sy + dy) * this.cols + sx + dx;
        this.state[idx] = 1; this.burning.push(idx);
      }
      this.stepNo = 0; this.ensembleProb = null;
      this.shadowRoot.querySelector('#bar').style.width = '0%';
      this.updateMetrics('singolo'); this.draw();
    }

    toggle() {
      this.running = !this.running;
      this.shadowRoot.querySelector('#run').textContent = this.running ? 'Pausa' : 'Riprendi';
      if (this.running) this.loop();
    }

    loop() {
      if (!this.running) return;
      for (let i = 0; i < 2; i += 1) this.stepSimulation();
      this.draw(); this.updateMetrics('singolo');
      if (this.burning.length === 0 || this.stepNo >= 130) {
        this.running = false; this.shadowRoot.querySelector('#run').textContent = 'Avvia'; return;
      }
      requestAnimationFrame(() => this.loop());
    }

    stepSimulation() {
      const result = this.advance(this.state, this.burning, this.params(), new RNG(1701 + this.seedCounter++));
      this.state = result.state; this.burning = result.burning; this.stepNo += 1;
    }

    advance(state, burning, params, rng) {
      const nextState = state.slice(); const nextBurning = [];
      const candidates = new Map();
      const wy = Math.sin(params.angle); const wx = Math.cos(params.angle);
      const offsets = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      for (const idx of burning) {
        const y = Math.floor(idx / this.cols); const x = idx % this.cols;
        nextState[idx] = 2;
        for (const [dy, dx] of offsets) {
          const ny = y + dy; const nx = x + dx;
          if (ny < 0 || ny >= this.rows || nx < 0 || nx >= this.cols) continue;
          const ni = ny * this.cols + nx;
          if (state[ni] !== 0) continue;
          const norm = Math.hypot(dx, dy); const align = Math.max(0, (dx * wx + dy * wy) / norm);
          const uphill = Math.max(0, this.land.elevation[ni] - this.land.elevation[idx]);
          const localFuel = this.land.fuel[ni] * params.continuity;
          let p = .022 + .23 * localFuel + .25 * (1 - params.humidity) + .27 * params.wind * align + .18 * Math.min(1, uphill * 8);
          p *= .72 + .34 * rng.next(); p = clamp(p, 0, .93);
          if (p > (candidates.get(ni) || 0)) candidates.set(ni, p);
        }
        if (rng.next() < params.spotting * params.wind) {
          const distance = 5 + Math.floor(rng.next() * 14);
          const ny = Math.round(y + wy * distance + rng.normal() * 1.5);
          const nx = Math.round(x + wx * distance + rng.normal() * 1.5);
          if (ny >= 0 && ny < this.rows && nx >= 0 && nx < this.cols) {
            const ni = ny * this.cols + nx;
            if (state[ni] === 0) candidates.set(ni, Math.max(candidates.get(ni) || 0, .35 * this.land.fuel[ni] * (1 - params.humidity)));
          }
        }
      }
      for (const [idx, p] of candidates) {
        if (rng.next() < p) { nextState[idx] = 1; nextBurning.push(idx); }
      }
      return { state: nextState, burning: nextBurning };
    }

    async runEnsemble() {
      this.running = false; this.shadowRoot.querySelector('#run').textContent = 'Avvia';
      const button = this.shadowRoot.querySelector('#ensemble');
      button.disabled = true; button.textContent = 'Calcolo in corso…';
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
        let state = new Uint8Array(this.rows * this.cols); let burning = [];
        const sy = Math.floor(this.rows * .73); const sx = Math.floor(this.cols * .18);
        for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
          const idx = (sy + dy) * this.cols + sx + dx; state[idx] = 1; burning.push(idx);
        }
        for (let t = 0; t < 82 && burning.length; t += 1) {
          const next = this.advance(state, burning, params, rng); state = next.state; burning = next.burning;
        }
        for (let i = 0; i < state.length; i += 1) if (state[i] === 2 || state[i] === 1) counts[i] += 1;
        this.shadowRoot.querySelector('#bar').style.width = `${((r + 1) / runs) * 100}%`;
        if (r % 4 === 3) await new Promise(resolve => setTimeout(resolve, 0));
      }
      this.ensembleProb = new Float32Array(counts.length);
      for (let i = 0; i < counts.length; i += 1) this.ensembleProb[i] = counts[i] / runs;
      this.updateMetrics('ensemble'); this.draw();
      button.disabled = false; button.textContent = 'Calcola 32 scenari';
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
      root.querySelector('#burned').textContent = `${(100 * burned / this.state.length).toFixed(1).replace('.', ',')}%`;
      root.querySelector('#mode').textContent = mode;
    }

    draw() {
      if (!this.ctx || !this.land) return;
      const ctx = this.ctx; const w = this.canvas.width; const h = this.canvas.height;
      const cw = w / this.cols; const ch = h / this.rows;
      const image = ctx.createImageData(w, h);
      // Draw one logical cell as a rectangle for speed and crispness.
      ctx.fillStyle = '#e7efe8'; ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < this.rows; y += 1) {
        for (let x = 0; x < this.cols; x += 1) {
          const idx = y * this.cols + x;
          const v = clamp(.2 + .55 * this.land.fuel[idx] - .18 * this.land.elevation[idx], 0, 1);
          let rgb = colorMix('#dfeade', '#456b4f', v);
          if (this.ensembleProb) {
            const p = this.ensembleProb[idx];
            if (p > 0) rgb = colorMix('#fef3c7', '#7f1d1d', Math.pow(p, .72));
          } else if (this.state[idx] === 2) rgb = colorMix('#6b3b2a', '#260e0a', .45 + .45 * this.land.fuel[idx]);
          else if (this.state[idx] === 1) rgb = colorMix('#f5a623', '#e8412a', .65);
          ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
          ctx.fillRect(x * cw, y * ch, Math.ceil(cw + .25), Math.ceil(ch + .25));
        }
      }
      // Terrain contours, road and wind arrow.
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1;
      for (let y = 8; y < this.rows; y += 10) {
        ctx.beginPath();
        for (let x = 0; x < this.cols; x += 1) {
          const yy = (y + 2.5 * Math.sin(x / 8)) * ch;
          if (x === 0) ctx.moveTo(0, yy); else ctx.lineTo(x * cw, yy);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(247,248,250,.75)'; ctx.lineWidth = Math.max(2, ch * 1.4); ctx.beginPath();
      for (let x = 0; x < this.cols; x += 1) {
        const y = this.rows * (.58 + .06 * Math.sin(x / 11));
        if (x === 0) ctx.moveTo(0, y * ch); else ctx.lineTo(x * cw, y * ch);
      }
      ctx.stroke();
      const p = this.params(); const ax = w - 90; const ay = 78; const len = 52 + p.wind * 30;
      ctx.strokeStyle = COLORS.navy; ctx.fillStyle = COLORS.navy; ctx.lineWidth = 4;
      const ex = ax + Math.cos(p.angle) * len; const ey = ay + Math.sin(p.angle) * len;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
      const head = 12; const a1 = p.angle + Math.PI * .82; const a2 = p.angle - Math.PI * .82;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(a1) * head, ey + Math.sin(a1) * head); ctx.lineTo(ex + Math.cos(a2) * head, ey + Math.sin(a2) * head); ctx.closePath(); ctx.fill();
      ctx.font = '700 16px DM Mono, monospace'; ctx.fillText('VENTO', ax - 5, ay - 18);
      if (this.ensembleProb) {
        ctx.fillStyle = 'rgba(255,255,255,.88)'; ctx.fillRect(22, 20, 245, 44);
        ctx.fillStyle = COLORS.navy; ctx.font = '700 18px DM Sans, sans-serif'; ctx.fillText('32 futuri sovrapposti', 38, 48);
      }
    }
  }

  if (!customElements.get('hotspot-demo')) customElements.define('hotspot-demo', HotspotDemo);
  if (!customElements.get('wildfire-simulator')) customElements.define('wildfire-simulator', WildfireSimulator);
})();
