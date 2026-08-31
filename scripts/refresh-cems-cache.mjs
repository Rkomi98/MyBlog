import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://mapping.emergency.copernicus.eu/activations/api/activations/';
const RAPID_API = 'https://rapidmapping.emergency.copernicus.eu/backend/dashboard-api/public-activations/';
const PAGE_SIZE = 1000;
const REQUEST_TIMEOUT_MS = 30_000;
const GEOMETRY_TIMEOUT_MS = 12_000;
const GEOMETRY_CONCURRENCY = 3;
const GEOMETRY_LOOKBACK_DAYS = 90;

function toPublicActivation(value) {
  return {
    code: value.code,
    countries: value.countries,
    category: value.category,
    name: value.name,
    centroid: value.centroid,
    activationTime: value.activationTime,
    lastUpdate: value.lastUpdate,
    drmPhase: value.drmPhase,
    closed: value.closed,
    n_aois: value.n_aois,
    n_products: value.n_products,
    reason: value.search_snippet,
  };
}

async function getPage(offset) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const url = new URL(API);
    url.searchParams.set('limit', String(PAGE_SIZE));
    url.searchParams.set('offset', String(offset));
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Copernicus catalog returned HTTP ${response.status}`);
    const payload = await response.json();
    if (!Number.isInteger(payload.count) || !Array.isArray(payload.results)) {
      throw new Error('Copernicus catalog response has an unexpected shape');
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

async function getRapidGeometry(code) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEOMETRY_TIMEOUT_MS);
    try {
      const url = new URL(RAPID_API);
      url.searchParams.set('code', code);
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const activation = payload.results?.find(item => item.code === code);
      if (!activation?.extent) return null;
      return {
        extent: activation.extent,
        aois: Array.isArray(activation.aois)
          ? activation.aois
              .filter(aoi => aoi?.extent)
              .map(aoi => ({ name: aoi.name, extent: aoi.extent }))
          : [],
      };
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
  }
  console.warn(`No Rapid Mapping geometry for ${code}: ${lastError?.message || 'unknown error'}`);
  return null;
}

async function mapWithConcurrency(items, worker, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  const runWorker = async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  return results;
}

async function loadCachedGeometries(cachePath) {
  try {
    const cache = await fs.readJson(cachePath);
    return new Map(
      (cache.results || [])
        .filter(item => item?.code && item?.extent)
        .map(item => [item.code, { extent: item.extent, aois: item.aois || [] }]),
    );
  } catch {
    return new Map();
  }
}

async function main() {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const sourceCachePath = path.join(rootDir, 'Assets/fire-assets/data/cems-activations.json');
  const geometryByCode = await loadCachedGeometries(sourceCachePath);
  const all = [];
  let offset = 0;
  let expectedCount = null;
  do {
    const page = await getPage(offset);
    expectedCount ??= page.count;
    if (page.count !== expectedCount || page.results.length === 0) {
      throw new Error('Copernicus catalog changed while it was being downloaded');
    }
    all.push(...page.results.map(toPublicActivation));
    offset += page.results.length;
  } while (offset < expectedCount);

  const distinctCodes = new Set(all.map(item => item.code));
  if (all.length !== expectedCount || distinctCodes.size !== expectedCount) {
    throw new Error(`Incomplete catalog: received ${all.length}/${expectedCount} unique activations`);
  }

  const recentThreshold = Date.now() - GEOMETRY_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const geometryCandidates = all.filter(item => {
    if (!/^EMSR\d+$/i.test(item.code)) return false;
    const activationTime = new Date(item.activationTime).getTime();
    const isRecent = Number.isFinite(activationTime) && activationTime >= recentThreshold;
    return item.closed === false || (isRecent && !geometryByCode.has(item.code));
  });
  const geometryResults = await mapWithConcurrency(geometryCandidates, async item => [item.code, await getRapidGeometry(item.code)], GEOMETRY_CONCURRENCY);
  for (const [code, geometry] of geometryResults) {
    if (geometry) geometryByCode.set(code, geometry);
  }
  const enriched = all.map(item => ({ ...item, ...(geometryByCode.get(item.code) || {}) }));
  const cache = {
    retrieved_at: new Date().toISOString(),
    source: API,
    geometry_source: RAPID_API,
    count: enriched.length,
    geometry_count: geometryByCode.size,
    results: enriched,
  };
  const outputPaths = [
    path.join(rootDir, 'Assets/fire-assets/data/cems-activations.json'),
    path.join(rootDir, 'docs/Assets/fire-assets/data/cems-activations.json'),
  ];
  await Promise.all(outputPaths.map(output => fs.outputJson(output, cache, { spaces: 2 })));
  console.log(`Updated CEMS public activation cache: ${enriched.length} records, ${geometryByCode.size} official Rapid Mapping perimeters.`);
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
