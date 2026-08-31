import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://mapping.emergency.copernicus.eu/activations/api/activations/';
const PAGE_SIZE = 1000;
const REQUEST_TIMEOUT_MS = 30_000;

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

async function main() {
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

  const cache = {
    retrieved_at: new Date().toISOString(),
    source: API,
    count: all.length,
    results: all,
  };
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const outputPaths = [
    path.join(rootDir, 'Assets/fire-assets/data/cems-activations.json'),
    path.join(rootDir, 'docs/Assets/fire-assets/data/cems-activations.json'),
  ];
  await Promise.all(outputPaths.map(output => fs.outputJson(output, cache, { spaces: 2 })));
  console.log(`Updated CEMS public activation cache: ${all.length} records.`);
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
