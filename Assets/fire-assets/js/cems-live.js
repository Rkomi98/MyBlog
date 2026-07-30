(() => {
  'use strict';

  const STYLE = `
    :host { display:block; margin:2rem 0; container-type:inline-size; color:var(--text-primary,#e2e8f0); font-family:'Inter',system-ui,sans-serif; }
    * { box-sizing:border-box; }
    .box { overflow:hidden; border:1px solid var(--border,rgba(148,163,184,.2)); border-radius:22px; background:var(--bg-card-strong,rgba(11,17,32,.92)); color:var(--text-primary,#e2e8f0); box-shadow:var(--shadow-lg,0 28px 60px -36px rgba(2,6,23,.9)); transition:background .3s ease,border-color .3s ease; }
    header { padding:1.35rem 1.5rem 1.2rem; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; border-bottom:1px solid var(--border,rgba(148,163,184,.2)); }
    .eyebrow { font:700 .68rem/1.2 'JetBrains Mono',monospace; color:var(--accent-strong,#34d399); letter-spacing:.12em; text-transform:uppercase; margin-bottom:.5rem; }
    h3 { margin:0; color:var(--text-primary,#e2e8f0); font:700 clamp(1.1rem,2vw,1.4rem)/1.25 'JetBrains Mono',monospace; letter-spacing:-.025em; }
    header p { margin:.55rem 0 0; color:var(--text-muted,#94a3b8); font-size:.88rem; line-height:1.6; max-width:46rem; }
    /* The badge states read from the shell tokens so both themes keep their contrast. */
    .badge { flex:0 0 auto; border:1px solid transparent; border-radius:999px; padding:.42rem .65rem; font:700 .64rem/1.2 'JetBrains Mono',monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted,#94a3b8); background:color-mix(in srgb,var(--text-muted,#94a3b8) 12%,transparent); border-color:color-mix(in srgb,var(--text-muted,#94a3b8) 30%,transparent); }
    .badge.is-live { color:var(--accent-strong,#34d399); background:color-mix(in srgb,var(--accent,#10b981) 14%,transparent); border-color:color-mix(in srgb,var(--accent,#10b981) 38%,transparent); }
    .badge.is-snapshot { color:#b45309; background:rgba(245,158,11,.14); border-color:rgba(245,158,11,.4); }
    .badge.is-error { color:#b91c1c; background:rgba(248,113,113,.14); border-color:rgba(248,113,113,.42); }
    :host-context(body[data-theme="dark"]) .badge.is-snapshot { color:#fcd34d; }
    :host-context(body[data-theme="dark"]) .badge.is-error { color:#fca5a5; }
    .toolbar { padding:.85rem 1.5rem; display:flex; gap:.55rem; flex-wrap:wrap; border-bottom:1px solid var(--border,rgba(148,163,184,.2)); background:color-mix(in srgb,var(--bg-card,rgba(15,23,42,.84)) 90%,transparent); }
    input { min-width:8rem; flex:1 1 10rem; background:var(--surface,#1e293b); color:var(--text-primary,#e2e8f0); border:1px solid var(--border,rgba(148,163,184,.2)); border-radius:10px; padding:.66rem .75rem; font:700 .75rem 'JetBrains Mono',monospace; text-transform:uppercase; }
    button,a.button { border:1px solid var(--border,rgba(148,163,184,.2)); border-radius:10px; padding:.68rem .85rem; font:700 .74rem 'Inter',sans-serif; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; transition:transform .15s ease,background .2s ease,border-color .2s ease; }
    button { background:var(--accent,#10b981); color:#fff; } button:hover,a.button:hover { transform:translateY(-1px); } button:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    a.button { background:var(--surface,#1e293b); color:var(--text-primary,#e2e8f0); }
    .content { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(18rem,.65fr); min-height:22rem; }
    .main { padding:1.35rem 1.5rem 1.45rem; } .map { position:relative; min-height:22rem; background:var(--surface,#1e293b); border-left:1px solid var(--border,rgba(148,163,184,.2)); display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .map::before { content:''; position:absolute; inset:0; opacity:.22; background-image:linear-gradient(var(--border,rgba(148,163,184,.2)) 1px,transparent 1px),linear-gradient(90deg,var(--border,rgba(148,163,184,.2)) 1px,transparent 1px); background-size:32px 32px; }
    svg { position:relative; width:88%; height:88%; overflow:visible; } .title { font-size:1.35rem; font-weight:800; color:var(--text-primary,#e2e8f0); margin:.2rem 0 .5rem; } .reason { color:var(--text-secondary,#cbd5e1); line-height:1.6; font-size:.84rem; margin:0 0 1.1rem; }
    .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.62rem; margin-bottom:1rem; } .metric { background:var(--bg-card,rgba(15,23,42,.84)); border:1px solid var(--border,rgba(148,163,184,.2)); border-radius:11px; padding:.72rem .8rem; } .metric span { display:block; color:var(--text-muted,#94a3b8); font:700 .61rem/1.2 'JetBrains Mono',monospace; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.3rem; } .metric strong { color:var(--text-primary,#e2e8f0); font-size:.84rem; line-height:1.35; display:block; overflow-wrap:anywhere; }
    .timeline { margin-top:1rem; } .timeline h4 { margin:0 0 .6rem; color:var(--text-primary,#e2e8f0); font-size:.82rem; } .item { display:grid; grid-template-columns:5rem 1fr; gap:.65rem; padding:.62rem 0; border-top:1px solid var(--border,rgba(148,163,184,.2)); } .item time { color:var(--accent-strong,#34d399); font:700 .64rem/1.35 'JetBrains Mono',monospace; } .item div { color:var(--text-secondary,#cbd5e1); font-size:.75rem; line-height:1.45; }
    .notice { padding:.85rem .9rem; border-left:3px solid var(--accent,#10b981); background:color-mix(in srgb,var(--accent,#10b981) 10%,transparent); color:var(--text-secondary,#cbd5e1); border-radius:0 10px 10px 0; font-size:.74rem; line-height:1.5; } .error { border-left-color:#f87171; background:rgba(248,113,113,.1); }
    .source { padding:.8rem 1.5rem; border-top:1px solid var(--border,rgba(148,163,184,.2)); color:var(--text-muted,#94a3b8); font-size:.64rem; line-height:1.45; display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap; } .source a { color:var(--accent-strong,#34d399); } .spinner { width:1rem; height:1rem; border:2px solid var(--border,rgba(148,163,184,.3)); border-top-color:var(--accent-strong,#34d399); border-radius:50%; animation:spin .8s linear infinite; display:inline-block; margin-right:.45rem; vertical-align:-.18rem; }
    @keyframes spin { to { transform:rotate(360deg); } } @media(max-width:860px){ .content{grid-template-columns:1fr}.map{border-left:0;border-top:1px solid var(--border,rgba(148,163,184,.2));min-height:18rem}.grid{grid-template-columns:1fr 1fr}header{flex-direction:column} } @media(max-width:520px){ .grid{grid-template-columns:1fr}.toolbar{display:grid;grid-template-columns:1fr 1fr}.toolbar input{grid-column:1/-1;width:100%} }
  `;

  const COPY = {
    it: {
      eyebrow: 'Copernicus EMS · API pubblica', title: 'Dati di un’attivazione Rapid Mapping',
      intro: 'Snapshot locale per l’affidabilità editoriale, aggiornamento live quando il browser riesce a raggiungere l’API.',
      waiting: 'in attesa', codeLabel: 'Codice attivazione', refresh: 'Aggiorna', viewer: 'Apri il viewer', loading: 'Caricamento dello snapshot e verifica dell’API…', checking: 'Interrogazione delle fonti Copernicus…', updating: 'aggiornamento',
      untitled: 'Attivazione senza titolo', notProvided: 'non indicato', closed: 'chiusa', open: 'in corso', noReason: 'La risposta non include una descrizione estesa.', recentProducts: 'Ultimi prodotti riconosciuti nella risposta', product: 'Prodotto',
      code: 'Codice', status: 'Stato', category: 'Categoria', countries: 'Paesi', aois: 'Aree d’interesse', products: 'Prodotti', activation: 'Attivazione', lastUpdate: 'Ultimo aggiornamento',
      publicMetadata: 'Il riquadro mostra metadati pubblici. Non è un allarme, una previsione di propagazione o un ordine di evacuazione.', live: 'live verificato', snapshot: 'snapshot locale', source: 'Fonte', checked: 'verificato',
      unavailable: 'non raggiungibile', unavailableText: 'Il browser non ha ottenuto una risposta JSON utilizzabile. Possibili cause: attivazione non ancora pubblica, endpoint temporaneamente indisponibile o politica CORS. Il pannello non inventa dati sostitutivi.', unspecified: 'Errore non specificato', checkOfficial: 'Controlla l’attivazione sul sito ufficiale', attemptedSources: 'Fonti tentate', attempted: 'tentativo',
      noGeometry: 'Geometria non inclusa nella risposta', openViewerMap: 'Apri il viewer per la cartografia completa', centroid: 'Centroide dell’attivazione', centroidNote: 'centroide disponibile · perimetro assente', extent: 'Estensione geografica semplificata dell’attivazione', extentNote: 'estensione semplificata dai metadati API'
    },
    en: {
      eyebrow: 'Copernicus EMS · public API', title: 'Rapid Mapping activation data',
      intro: 'A local snapshot supports editorial reliability; live data are refreshed when the browser can reach the API.',
      waiting: 'waiting', codeLabel: 'Activation code', refresh: 'Refresh', viewer: 'Open viewer', loading: 'Loading the snapshot and checking the API…', checking: 'Querying Copernicus sources…', updating: 'updating',
      untitled: 'Untitled activation', notProvided: 'not provided', closed: 'closed', open: 'ongoing', noReason: 'The response does not include an extended description.', recentProducts: 'Latest products found in the response', product: 'Product',
      code: 'Code', status: 'Status', category: 'Category', countries: 'Countries', aois: 'Areas of interest', products: 'Products', activation: 'Activation', lastUpdate: 'Last update',
      publicMetadata: 'This panel shows public metadata only. It is not an alert, spread forecast, or evacuation order.', live: 'live verified', snapshot: 'local snapshot', source: 'Source', checked: 'checked',
      unavailable: 'unavailable', unavailableText: 'The browser did not obtain a usable JSON response. The activation may not yet be public, an endpoint may be temporarily unavailable, or CORS may block the request. The panel does not invent replacement data.', unspecified: 'Unspecified error', checkOfficial: 'Check the activation on the official site', attemptedSources: 'Attempted sources', attempted: 'attempted',
      noGeometry: 'Geometry not included in the response', openViewerMap: 'Open the viewer for full cartography', centroid: 'Activation centroid', centroidNote: 'centroid available · perimeter unavailable', extent: 'Simplified geographic extent of the activation', extentNote: 'extent simplified from API metadata'
    }
  };

  const fmtDate = (value, locale = 'it-IT', notProvided = 'not provided') => {
    if (!value) return notProvided;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(locale, { dateStyle:'medium', timeStyle:'short', timeZone:'UTC' }).format(date) + ' UTC';
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
      this.language = document.documentElement.lang === 'en' ? 'en' : 'it';
      this.copy = COPY[this.language];
      this.locale = this.language === 'en' ? 'en-US' : 'it-IT';
      this.code = (this.getAttribute('activation') || 'EMSR906').toUpperCase();
      this.snapshot = this.getAttribute('snapshot') || 'assets/data/emsr906-fallback.json';
      this.root.innerHTML = `<style>${STYLE}</style><div class="box"><header><div><div class="eyebrow">${this.copy.eyebrow}</div><h3>${this.copy.title}</h3><p>${this.copy.intro}</p></div><div class="badge" id="badge">${this.copy.waiting}</div></header><div class="toolbar"><input id="code" maxlength="10" value="${this.code}" aria-label="${this.copy.codeLabel}"><button id="refresh">${this.copy.refresh}</button><a class="button" id="viewer" target="_blank" rel="noopener">${this.copy.viewer}</a></div><div id="body"><div class="main"><div class="notice"><span class="spinner"></span> ${this.copy.loading}</div></div></div><div class="source"><span id="source">${this.copy.source}: —</span><span id="checked"></span></div></div>`;
      this.root.querySelector('#refresh').addEventListener('click', () => {
        this.code = this.root.querySelector('#code').value.trim().toUpperCase() || this.code;
        this.load(true);
      });
      this.root.querySelector('#code').addEventListener('keydown', e => { if (e.key === 'Enter') this.root.querySelector('#refresh').click(); });
      this.load(false);
      this.timer = setInterval(() => this.load(true, true), 5 * 60 * 1000);
    }

    disconnectedCallback() { if (this.timer) clearInterval(this.timer); }

    formatDate(value) { return fmtDate(value, this.locale, this.copy.notProvided); }

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
      this.root.querySelector('#badge').textContent = this.copy.updating;
      this.root.querySelector('#body').innerHTML = `<div class="main"><div class="notice"><span class="spinner"></span> ${this.copy.checking}</div></div>`;
    }

    render(activation, meta) {
      const code = first(activation.code, this.code);
      this.code = String(code).toUpperCase();
      this.root.querySelector('#code').value = this.code;
      const viewerUrl = `https://mapping.emergency.copernicus.eu/activations/${encodeURIComponent(this.code)}`;
      const viewer = this.root.querySelector('#viewer'); viewer.href = viewerUrl;
      const name = first(activation.name, activation.title, this.copy.untitled);
      const category = textValue(first(activation.category, activation.eventType, activation.hazardType)) || this.copy.notProvided;
      const countries = textValue(first(activation.countries, activation.country, activation.affectedCountries)) || this.copy.notProvided;
      const closed = first(activation.closed, activation.isClosed);
      const status = closed === true ? this.copy.closed : closed === false ? this.copy.open : textValue(first(activation.status, activation.activationStatus)) || this.copy.notProvided;
      const lastUpdate = first(activation.lastUpdate, activation.last_update, activation.updatedAt, activation.modified);
      const activationTime = first(activation.activationTime, activation.activation_time, activation.createdAt);
      const eventTime = first(activation.eventTime, activation.event_time, activation.eventDate);
      const reason = first(activation.reason, activation.description, activation.summary, this.copy.noReason);
      const aois = first(activation.n_aois, activation.nAoIs, Array.isArray(activation.aois) ? activation.aois.length : undefined, Array.isArray(activation.areasOfInterest) ? activation.areasOfInterest.length : undefined, '—');
      const products = flattenProducts(activation);
      const productCount = first(activation.n_products, activation.nProducts, products.length || undefined, '—');
      const polygons = collectGeometry(activation);
      const recent = products.slice().sort((a,b) => new Date(first(b.publicationDate,b.deliveryTime,b.updatedAt,0)) - new Date(first(a.publicationDate,a.deliveryTime,a.updatedAt,0))).slice(0,5);
      const timeline = recent.length ? `<div class="timeline"><h4>${this.copy.recentProducts}</h4>${recent.map(product => {
        const date = first(product.publicationDate, product.deliveryTime, product.version && product.version.deliveryTime, product.published, product.updatedAt);
        const label = textValue(first(product.name, product.productType, product.type, product.category, this.copy.product));
        const aoi = product._aoi ? ` · ${product._aoi}` : '';
        return `<div class="item"><time>${date ? this.formatDate(date).replace(' UTC','') : '—'}</time><div>${this.escape(label)}${this.escape(aoi)}</div></div>`;
      }).join('')}</div>` : '';
      const mapSvg = this.drawMap(polygons, first(activation.centroid, activation.center));
      this.root.querySelector('#body').innerHTML = `<div class="content"><div class="main"><div class="title">${this.escape(name)}</div><p class="reason">${this.escape(String(reason))}</p><div class="grid"><div class="metric"><span>${this.copy.code}</span><strong>${this.escape(this.code)}</strong></div><div class="metric"><span>${this.copy.status}</span><strong>${this.escape(status)}</strong></div><div class="metric"><span>${this.copy.category}</span><strong>${this.escape(category)}</strong></div><div class="metric"><span>${this.copy.countries}</span><strong>${this.escape(countries)}</strong></div><div class="metric"><span>${this.copy.aois}</span><strong>${this.escape(String(aois))}</strong></div><div class="metric"><span>${this.copy.products}</span><strong>${this.escape(String(productCount))}</strong></div><div class="metric"><span>${this.copy.activation}</span><strong>${this.escape(this.formatDate(activationTime))}</strong></div><div class="metric"><span>${this.copy.lastUpdate}</span><strong>${this.escape(this.formatDate(lastUpdate || eventTime))}</strong></div></div>${timeline}<div class="notice">${this.copy.publicMetadata}</div></div><div class="map">${mapSvg}</div></div>`;
      const badge = this.root.querySelector('#badge');
      badge.textContent = meta.mode === 'live' ? this.copy.live : this.copy.snapshot;
      badge.style.color = meta.mode === 'live' ? '#34d399' : '#fcd34d';
      badge.style.borderColor = meta.mode === 'live' ? 'rgba(52,211,153,.34)' : 'rgba(245,166,35,.32)';
      badge.style.background = meta.mode === 'live' ? 'rgba(16,185,129,.14)' : 'rgba(245,166,35,.13)';
      this.root.querySelector('#source').innerHTML = `${this.copy.source}: <a href="${this.escapeAttr(meta.url)}" target="_blank" rel="noopener">${meta.mode === 'live' ? 'Copernicus EMS API' : this.copy.snapshot}</a>`;
      this.root.querySelector('#checked').textContent = `${this.copy.checked} ${this.formatDate(meta.retrieved || new Date().toISOString())}`;
    }

    drawMap(polygons, centroidValue) {
      let points = polygons.flat();
      if (!points.length && centroidValue) {
        const match = String(centroidValue).match(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
        if (match) points = [[Number(match[1]), Number(match[2])]];
      }
      if (!points.length) return `<svg viewBox="0 0 600 420" role="img" aria-label="${this.copy.noGeometry}"><text x="300" y="200" fill="var(--text-secondary,#cbd5e1)" text-anchor="middle" font-size="18">${this.copy.noGeometry}</text><text x="300" y="228" fill="var(--text-muted,#94a3b8)" text-anchor="middle" font-size="13">${this.copy.openViewerMap}</text></svg>`;
      let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
      for (const [x,y] of points) { minX=Math.min(minX,x); maxX=Math.max(maxX,x); minY=Math.min(minY,y); maxY=Math.max(maxY,y); }
      if (maxX-minX < 1e-9) { minX -= .5; maxX += .5; }
      if (maxY-minY < 1e-9) { minY -= .5; maxY += .5; }
      const project = ([x,y]) => [55 + (x-minX)/(maxX-minX)*490, 365 - (y-minY)/(maxY-minY)*310];
      const paths = polygons.map(poly => poly.map((p,i) => `${i?'L':'M'} ${project(p)[0].toFixed(1)} ${project(p)[1].toFixed(1)}`).join(' ') + ' Z').join(' ');
      if (!paths) {
        const [cx,cy]=project(points[0]);
        return `<svg viewBox="0 0 600 420" role="img" aria-label="${this.copy.centroid}"><circle cx="${cx}" cy="${cy}" r="12" fill="var(--accent,#10b981)" stroke="var(--bg-card-strong,#0b1120)" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="var(--accent,#10b981)" stroke-opacity=".42" stroke-width="3"/><text x="300" y="400" fill="var(--text-muted,#94a3b8)" text-anchor="middle" font-size="12">${this.copy.centroidNote}</text></svg>`;
      }
      return `<svg viewBox="0 0 600 420" role="img" aria-label="${this.copy.extent}"><defs><linearGradient id="cemsFill" x1="0" x2="1"><stop offset="0" stop-color="#34d399" stop-opacity=".55"/><stop offset="1" stop-color="#0ea5e9" stop-opacity=".78"/></linearGradient></defs><path d="${paths}" fill="url(#cemsFill)" stroke="var(--text-primary,#e2e8f0)" stroke-width="3" vector-effect="non-scaling-stroke"/><text x="300" y="400" fill="var(--text-muted,#94a3b8)" text-anchor="middle" font-size="12">${this.copy.extentNote}</text></svg>`;
    }

    renderUnavailable(error) {
      const code = this.code;
      const viewerUrl = `https://mapping.emergency.copernicus.eu/activations/${encodeURIComponent(code)}`;
      this.root.querySelector('#viewer').href = viewerUrl;
      this.root.querySelector('#badge').textContent = this.copy.unavailable;
      this.root.querySelector('#badge').style.color = '#fca5a5';
      this.root.querySelector('#badge').style.borderColor = 'rgba(248,113,113,.32)';
      this.root.querySelector('#badge').style.background = 'rgba(248,113,113,.12)';
      this.root.querySelector('#body').innerHTML = `<div class="main"><div class="title">${this.escape(code)}</div><div class="notice error">${this.copy.unavailableText}</div><p class="reason" style="margin-top:1rem">${this.escape(error ? String(error.message || error) : this.copy.unspecified)}</p><a class="button" href="${viewerUrl}" target="_blank" rel="noopener">${this.copy.checkOfficial}</a></div>`;
      this.root.querySelector('#source').innerHTML = `${this.copy.attemptedSources}: <a href="https://mapping.emergency.copernicus.eu/about/how-to-harvest-cems-mapping-data/" target="_blank" rel="noopener">Copernicus EMS API</a>`;
      this.root.querySelector('#checked').textContent = `${this.copy.attempted} ${this.formatDate(new Date().toISOString())}`;
    }

    escape(value) { const div=document.createElement('div'); div.textContent=String(value ?? ''); return div.innerHTML; }
    escapeAttr(value) { return this.escape(value).replace(/"/g,'&quot;'); }
  }

  if (!customElements.get('cems-activation')) customElements.define('cems-activation', CemsActivation);
})();
