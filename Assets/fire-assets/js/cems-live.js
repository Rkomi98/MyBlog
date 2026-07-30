(() => {
  'use strict';

  const STYLE = `
    :host { display:block; margin:2rem 0; color:#0d1b2a; font-family:'DM Sans',system-ui,sans-serif; }
    * { box-sizing:border-box; }
    .box { background:#0d1b2a; color:#eaf0f5; border-radius:18px; overflow:hidden; box-shadow:0 18px 50px rgba(13,27,42,.18); }
    header { padding:1.25rem 1.35rem; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; border-bottom:1px solid rgba(255,255,255,.08); }
    .eyebrow { font:700 .67rem/1.2 'DM Mono',monospace; color:#f87171; letter-spacing:.12em; text-transform:uppercase; margin-bottom:.45rem; }
    h3 { margin:0; color:#fff; font-size:clamp(1.15rem,2vw,1.55rem); line-height:1.15; letter-spacing:-.025em; }
    header p { margin:.45rem 0 0; color:#9fb0c0; font-size:.82rem; line-height:1.5; max-width:46rem; }
    .badge { flex:0 0 auto; border-radius:999px; padding:.42rem .65rem; font:700 .63rem/1 'DM Mono',monospace; letter-spacing:.06em; text-transform:uppercase; background:rgba(245,166,35,.13); color:#fcd34d; border:1px solid rgba(245,166,35,.28); }
    .toolbar { padding:.8rem 1.35rem; display:flex; gap:.55rem; flex-wrap:wrap; border-bottom:1px solid rgba(255,255,255,.08); background:#112337; }
    input { min-width:8rem; flex:1 1 10rem; background:#081521; color:#fff; border:1px solid #2b4053; border-radius:9px; padding:.66rem .75rem; font:700 .75rem 'DM Mono',monospace; text-transform:uppercase; }
    button, a.button { border:0; border-radius:9px; padding:.68rem .8rem; font:700 .74rem 'DM Sans',sans-serif; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; }
    button { background:#e8412a; color:#fff; }
    button:disabled { opacity:.5; cursor:not-allowed; }
    a.button { background:#23394d; color:#dbeafe; }
    .content { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(18rem,.65fr); min-height:22rem; }
    .main { padding:1.25rem 1.35rem 1.4rem; }
    .map { position:relative; min-height:22rem; background:radial-gradient(circle at 55% 45%,#29445a,#0b1a29 65%); border-left:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .map::before { content:''; position:absolute; inset:0; opacity:.18; background-image:linear-gradient(rgba(255,255,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px); background-size:32px 32px; }
    svg { position:relative; width:88%; height:88%; overflow:visible; }
    .title { font-size:1.35rem; font-weight:800; color:#fff; margin:.2rem 0 .5rem; }
    .reason { color:#b6c2ce; line-height:1.6; font-size:.84rem; margin:0 0 1.1rem; }
    .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.62rem; margin-bottom:1rem; }
    .metric { background:#13283b; border:1px solid rgba(255,255,255,.07); border-radius:11px; padding:.72rem .8rem; }
    .metric span { display:block; color:#6f879c; font:700 .61rem/1.2 'DM Mono',monospace; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.3rem; }
    .metric strong { color:#f8fafc; font-size:.84rem; line-height:1.35; display:block; overflow-wrap:anywhere; }
    .timeline { margin-top:1rem; }
    .timeline h4 { margin:0 0 .6rem; color:#fff; font-size:.82rem; }
    .item { display:grid; grid-template-columns:5rem 1fr; gap:.65rem; padding:.62rem 0; border-top:1px solid rgba(255,255,255,.07); }
    .item time { color:#fca5a5; font:700 .64rem/1.35 'DM Mono',monospace; }
    .item div { color:#aebdca; font-size:.75rem; line-height:1.45; }
    .notice { padding:.85rem .9rem; border-left:3px solid #f5a623; background:rgba(245,166,35,.09); color:#f5d889; border-radius:0 9px 9px 0; font-size:.74rem; line-height:1.5; }
    .error { border-left-color:#ef4444; background:rgba(239,68,68,.1); color:#fecaca; }
    .source { padding:.75rem 1.35rem; border-top:1px solid rgba(255,255,255,.08); color:#71879a; font-size:.64rem; line-height:1.45; display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
    .source a { color:#93c5fd; }
    .spinner { width:1rem; height:1rem; border:2px solid rgba(255,255,255,.25); border-top-color:#fff; border-radius:50%; animation:spin .8s linear infinite; display:inline-block; margin-right:.45rem; vertical-align:-.18rem; }
    @keyframes spin { to { transform:rotate(360deg); } }
    @media(max-width:860px){ .content{grid-template-columns:1fr}.map{border-left:0;border-top:1px solid rgba(255,255,255,.08);min-height:18rem}.grid{grid-template-columns:1fr 1fr}header{flex-direction:column} }
    @media(max-width:520px){ .grid{grid-template-columns:1fr}.toolbar{display:grid;grid-template-columns:1fr 1fr}.toolbar input{grid-column:1/-1;width:100%} }
  `;

  const fmtDate = value => {
    if (!value) return 'non indicato';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('it-IT', { dateStyle:'medium', timeStyle:'short', timeZone:'UTC' }).format(date) + ' UTC';
  };

  const textValue = value => {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(', ');
    return value.name || value.short_name || value.shortName || value.label || value.slug || '';
  };

  const first = (...values) => values.find(v => v !== undefined && v !== null && v !== '');

  function unwrap(payload) {
    if (!payload) return null;
    if (Array.isArray(payload.results)) return payload.results[0] || null;
    if (payload.activation) return payload.activation;
    if (payload.payload) return unwrap(payload.payload);
    if (payload.data && Array.isArray(payload.data.results)) return payload.data.results[0] || null;
    if (payload.code || payload.name) return payload;
    return null;
  }

  function flattenProducts(activation) {
    const direct = first(activation.products, activation.mapProducts, activation.product_list, []);
    const products = Array.isArray(direct) ? direct.slice() : [];
    const aois = first(activation.aois, activation.areasOfInterest, activation.areas_of_interest, []);
    if (Array.isArray(aois)) {
      for (const aoi of aois) {
        const nested = first(aoi.products, aoi.mapProducts, []);
        if (Array.isArray(nested)) products.push(...nested.map(p => ({ ...p, _aoi: first(aoi.name, aoi.code, aoi.id) })));
      }
    }
    return products;
  }

  function getPolygons(value) {
    if (!value) return [];
    if (typeof value === 'object') {
      const geometry = value.geometry || value;
      if (geometry.type === 'Polygon') return geometry.coordinates || [];
      if (geometry.type === 'MultiPolygon') return (geometry.coordinates || []).flat();
      return [];
    }
    const s = String(value).trim();
    if (!/^(MULTIPOLYGON|POLYGON)/i.test(s)) return [];
    const coordinatePairs = [];
    const regex = /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g;
    let match;
    while ((match = regex.exec(s))) coordinatePairs.push([Number(match[1]), Number(match[2])]);
    return coordinatePairs.length ? [coordinatePairs] : [];
  }

  function collectGeometry(activation) {
    const candidates = [activation.extent, activation.geometry, activation.footprint, activation.aoiExtent, activation.centroid];
    const aois = first(activation.aois, activation.areasOfInterest, activation.areas_of_interest, []);
    if (Array.isArray(aois)) for (const aoi of aois) candidates.push(aoi.extent, aoi.geometry, aoi.footprint, aoi.centroid);
    const polygons = [];
    for (const candidate of candidates) polygons.push(...getPolygons(candidate));
    return polygons.filter(p => p && p.length >= 2);
  }

  class CemsActivation extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      this.root = this.attachShadow({ mode:'open' });
      this.code = (this.getAttribute('activation') || 'EMSR906').toUpperCase();
      this.snapshot = this.getAttribute('snapshot') || 'assets/data/emsr906-fallback.json';
      this.root.innerHTML = `<style>${STYLE}</style><div class="box"><header><div><div class="eyebrow">Copernicus EMS · API pubblica</div><h3>Dati di un’attivazione Rapid Mapping</h3><p>Snapshot locale per l’affidabilità editoriale, aggiornamento live quando il browser riesce a raggiungere l’API.</p></div><div class="badge" id="badge">in attesa</div></header><div class="toolbar"><input id="code" maxlength="10" value="${this.code}" aria-label="Codice attivazione"><button id="refresh">Aggiorna</button><a class="button" id="viewer" target="_blank" rel="noopener">Apri il viewer</a></div><div id="body"><div class="main"><div class="notice"><span class="spinner"></span> Caricamento dello snapshot e verifica dell’API…</div></div></div><div class="source"><span id="source">Fonte in caricamento</span><span id="checked"></span></div></div>`;
      this.root.querySelector('#refresh').addEventListener('click', () => {
        this.code = this.root.querySelector('#code').value.trim().toUpperCase() || this.code;
        this.load(true);
      });
      this.root.querySelector('#code').addEventListener('keydown', e => { if (e.key === 'Enter') this.root.querySelector('#refresh').click(); });
      this.load(false);
      this.timer = setInterval(() => this.load(true, true), 5 * 60 * 1000);
    }

    disconnectedCallback() { if (this.timer) clearInterval(this.timer); }

    endpoints(code) {
      return [
        `https://mapping.emergency.copernicus.eu/activations/${encodeURIComponent(code)}/openapi`,
        `https://rapidmapping.emergency.copernicus.eu/backend/dashboard-api/public-activations/?code=${encodeURIComponent(code)}`,
        `https://mapping.emergency.copernicus.eu/activations/api/activations/${encodeURIComponent(code)}/`
      ];
    }

    async getJson(url, timeout = 8500) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { headers:{ Accept:'application/json' }, signal:controller.signal, cache:'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const type = response.headers.get('content-type') || '';
        if (!type.includes('json')) {
          const text = await response.text();
          try { return JSON.parse(text); } catch { throw new Error('risposta non JSON'); }
        }
        return await response.json();
      } finally { clearTimeout(id); }
    }

    async load(forceLive = false, silent = false) {
      const refresh = this.root.querySelector('#refresh');
      refresh.disabled = true;
      if (!silent) this.setLoading();
      let snapshotPayload = null;
      if (!forceLive) {
        try { snapshotPayload = await this.getJson(this.snapshot, 3500); } catch { snapshotPayload = null; }
        const snapActivation = unwrap(snapshotPayload);
        if (snapActivation) this.render(snapActivation, { mode:'snapshot', url:this.snapshot, retrieved:first(snapshotPayload.retrieved_at, snapshotPayload.generated_at) });
      }

      let lastError = null;
      for (const url of this.endpoints(this.code)) {
        try {
          const payload = await this.getJson(url);
          const activation = unwrap(payload);
          if (!activation) throw new Error('attivazione non presente nella risposta');
          this.render(activation, { mode:'live', url, retrieved:new Date().toISOString() });
          refresh.disabled = false;
          return;
        } catch (error) { lastError = error; }
      }
      if (!unwrap(snapshotPayload) || forceLive) this.renderUnavailable(lastError);
      refresh.disabled = false;
    }

    setLoading() {
      this.root.querySelector('#badge').textContent = 'aggiornamento';
      this.root.querySelector('#body').innerHTML = `<div class="main"><div class="notice"><span class="spinner"></span> Interrogazione delle fonti Copernicus…</div></div>`;
    }

    render(activation, meta) {
      const code = first(activation.code, this.code);
      this.code = String(code).toUpperCase();
      this.root.querySelector('#code').value = this.code;
      const viewerUrl = `https://mapping.emergency.copernicus.eu/activations/${encodeURIComponent(this.code)}`;
      const viewer = this.root.querySelector('#viewer'); viewer.href = viewerUrl;
      const name = first(activation.name, activation.title, 'Attivazione senza titolo');
      const category = textValue(first(activation.category, activation.eventType, activation.hazardType)) || 'non indicata';
      const countries = textValue(first(activation.countries, activation.country, activation.affectedCountries)) || 'non indicati';
      const closed = first(activation.closed, activation.isClosed);
      const status = closed === true ? 'chiusa' : closed === false ? 'in corso' : textValue(first(activation.status, activation.activationStatus)) || 'non indicato';
      const lastUpdate = first(activation.lastUpdate, activation.last_update, activation.updatedAt, activation.modified);
      const activationTime = first(activation.activationTime, activation.activation_time, activation.createdAt);
      const eventTime = first(activation.eventTime, activation.event_time, activation.eventDate);
      const reason = first(activation.reason, activation.description, activation.summary, 'La risposta non include una descrizione estesa.');
      const aois = first(activation.n_aois, activation.nAoIs, Array.isArray(activation.aois) ? activation.aois.length : undefined, Array.isArray(activation.areasOfInterest) ? activation.areasOfInterest.length : undefined, '—');
      const products = flattenProducts(activation);
      const productCount = first(activation.n_products, activation.nProducts, products.length || undefined, '—');
      const polygons = collectGeometry(activation);
      const recent = products.slice().sort((a,b) => new Date(first(b.publicationDate,b.deliveryTime,b.updatedAt,0)) - new Date(first(a.publicationDate,a.deliveryTime,a.updatedAt,0))).slice(0,5);
      const timeline = recent.length ? `<div class="timeline"><h4>Ultimi prodotti riconosciuti nella risposta</h4>${recent.map(product => {
        const date = first(product.publicationDate, product.deliveryTime, product.version && product.version.deliveryTime, product.published, product.updatedAt);
        const label = textValue(first(product.name, product.productType, product.type, product.category, 'Prodotto'));
        const aoi = product._aoi ? ` · ${product._aoi}` : '';
        return `<div class="item"><time>${date ? fmtDate(date).replace(' UTC','') : '—'}</time><div>${this.escape(label)}${this.escape(aoi)}</div></div>`;
      }).join('')}</div>` : '';
      const mapSvg = this.drawMap(polygons, first(activation.centroid, activation.center));
      this.root.querySelector('#body').innerHTML = `<div class="content"><div class="main"><div class="title">${this.escape(name)}</div><p class="reason">${this.escape(String(reason))}</p><div class="grid"><div class="metric"><span>Codice</span><strong>${this.escape(this.code)}</strong></div><div class="metric"><span>Stato</span><strong>${this.escape(status)}</strong></div><div class="metric"><span>Categoria</span><strong>${this.escape(category)}</strong></div><div class="metric"><span>Paesi</span><strong>${this.escape(countries)}</strong></div><div class="metric"><span>Aree d’interesse</span><strong>${this.escape(String(aois))}</strong></div><div class="metric"><span>Prodotti</span><strong>${this.escape(String(productCount))}</strong></div><div class="metric"><span>Attivazione</span><strong>${this.escape(fmtDate(activationTime))}</strong></div><div class="metric"><span>Ultimo aggiornamento</span><strong>${this.escape(fmtDate(lastUpdate || eventTime))}</strong></div></div>${timeline}<div class="notice">Il riquadro mostra metadati pubblici. Non è un allarme, una previsione di propagazione o un ordine di evacuazione.</div></div><div class="map">${mapSvg}</div></div>`;
      const badge = this.root.querySelector('#badge');
      badge.textContent = meta.mode === 'live' ? 'live verificato' : 'snapshot locale';
      badge.style.color = meta.mode === 'live' ? '#86efac' : '#fcd34d';
      badge.style.borderColor = meta.mode === 'live' ? 'rgba(134,239,172,.3)' : 'rgba(245,166,35,.28)';
      badge.style.background = meta.mode === 'live' ? 'rgba(34,197,94,.12)' : 'rgba(245,166,35,.13)';
      this.root.querySelector('#source').innerHTML = `Fonte: <a href="${this.escapeAttr(meta.url)}" target="_blank" rel="noopener">${meta.mode === 'live' ? 'API Copernicus EMS' : 'snapshot locale'}</a>`;
      this.root.querySelector('#checked').textContent = `verificato ${fmtDate(meta.retrieved || new Date().toISOString())}`;
    }

    drawMap(polygons, centroidValue) {
      let points = polygons.flat();
      if (!points.length && centroidValue) {
        const match = String(centroidValue).match(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
        if (match) points = [[Number(match[1]), Number(match[2])]];
      }
      if (!points.length) return `<svg viewBox="0 0 600 420" role="img" aria-label="Geometria non inclusa nella risposta"><text x="300" y="200" fill="#90a5b7" text-anchor="middle" font-size="18">geometria non inclusa</text><text x="300" y="228" fill="#607a90" text-anchor="middle" font-size="13">apri il viewer per la cartografia completa</text></svg>`;
      let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
      for (const [x,y] of points) { minX=Math.min(minX,x); maxX=Math.max(maxX,x); minY=Math.min(minY,y); maxY=Math.max(maxY,y); }
      if (maxX-minX < 1e-9) { minX -= .5; maxX += .5; }
      if (maxY-minY < 1e-9) { minY -= .5; maxY += .5; }
      const project = ([x,y]) => [55 + (x-minX)/(maxX-minX)*490, 365 - (y-minY)/(maxY-minY)*310];
      const paths = polygons.map(poly => poly.map((p,i) => `${i?'L':'M'} ${project(p)[0].toFixed(1)} ${project(p)[1].toFixed(1)}`).join(' ') + ' Z').join(' ');
      if (!paths) {
        const [cx,cy]=project(points[0]);
        return `<svg viewBox="0 0 600 420" role="img" aria-label="Centroid dell’attivazione"><circle cx="${cx}" cy="${cy}" r="12" fill="#e8412a" stroke="#fff" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="#e8412a" stroke-opacity=".35" stroke-width="3"/><text x="300" y="400" fill="#90a5b7" text-anchor="middle" font-size="12">centroide disponibile · perimetro assente</text></svg>`;
      }
      return `<svg viewBox="0 0 600 420" role="img" aria-label="Estensione geografica semplificata dell’attivazione"><defs><linearGradient id="cemsFill" x1="0" x2="1"><stop offset="0" stop-color="#f5a623" stop-opacity=".58"/><stop offset="1" stop-color="#e8412a" stop-opacity=".78"/></linearGradient></defs><path d="${paths}" fill="url(#cemsFill)" stroke="#fecaca" stroke-width="3" vector-effect="non-scaling-stroke"/><text x="300" y="400" fill="#90a5b7" text-anchor="middle" font-size="12">estensione semplificata dai metadati API</text></svg>`;
    }

    renderUnavailable(error) {
      const code = this.code;
      const viewerUrl = `https://mapping.emergency.copernicus.eu/activations/${encodeURIComponent(code)}`;
      this.root.querySelector('#viewer').href = viewerUrl;
      this.root.querySelector('#badge').textContent = 'non raggiungibile';
      this.root.querySelector('#body').innerHTML = `<div class="main"><div class="title">${this.escape(code)}</div><div class="notice error">Il browser non ha ottenuto una risposta JSON utilizzabile. Possibili cause: attivazione non ancora pubblica, endpoint temporaneamente indisponibile o politica CORS. Il pacchetto non inventa un dato di riserva.</div><p class="reason" style="margin-top:1rem">${this.escape(error ? String(error.message || error) : 'Errore non specificato')}</p><a class="button" href="${viewerUrl}" target="_blank" rel="noopener">Controlla l’attivazione sul sito ufficiale</a></div>`;
      this.root.querySelector('#source').innerHTML = `Fonti tentate: <a href="https://mapping.emergency.copernicus.eu/about/how-to-harvest-cems-mapping-data/" target="_blank" rel="noopener">API Copernicus EMS</a>`;
      this.root.querySelector('#checked').textContent = `tentativo ${fmtDate(new Date().toISOString())}`;
    }

    escape(value) { const div=document.createElement('div'); div.textContent=String(value ?? ''); return div.innerHTML; }
    escapeAttr(value) { return this.escape(value).replace(/"/g,'&quot;'); }
  }

  if (!customElements.get('cems-activation')) customElements.define('cems-activation', CemsActivation);
})();
