import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await fs.readFile(path.join(rootDir, 'Assets/fire-assets/js/cems-live.js'), 'utf8');
const cache = JSON.parse(await fs.readFile(path.join(rootDir, 'Assets/fire-assets/data/cems-activations.json'), 'utf8'));

let Widget;
vm.runInNewContext(source, {
  HTMLElement: class {},
  customElements: {
    get: () => undefined,
    define: (_name, constructor) => { Widget = constructor; },
  },
  document: {},
  AbortController,
  clearTimeout,
  setTimeout,
});

function widgetFor(code) {
  const widget = new Widget();
  const refresh = { disabled: false };
  widget.code = code;
  widget.snapshot = '/Assets/fire-assets/data/cems-activations.json';
  widget.root = { querySelector: selector => selector === '#refresh' ? refresh : null };
  widget.setLoading = () => {};
  widget.endpoints = () => ['https://example.invalid/cems'];
  widget.getJson = async url => {
    if (url === widget.snapshot) return cache;
    throw new Error('CORS blocked');
  };
  return widget;
}

test('a catalog activation remains rendered when the live browser request is CORS-blocked', async () => {
  const widget = widgetFor('EMSR920');
  const rendered = [];
  let unavailable = false;
  widget.render = (activation, meta) => rendered.push({ activation, meta });
  widget.renderUnavailable = () => { unavailable = true; };

  await widget.load(true);

  assert.equal(rendered.length, 1);
  assert.equal(rendered[0].activation.code, 'EMSR920');
  assert.equal(rendered[0].meta.mode, 'snapshot');
  assert.equal(unavailable, false);
});

test('Rapid Mapping activations retain their official perimeter in the local catalog', () => {
  const activation = cache.results.find(item => item.code === 'EMSR920');
  assert.match(activation?.extent || '', /^POLYGON\s*\(\(/);
  assert.ok(activation.aois?.every(aoi => /^POLYGON\s*\(\(/.test(aoi.extent)));
});

test('a Rapid Mapping perimeter renders as a polygon rather than a centroid marker', () => {
  const activation = cache.results.find(item => item.code === 'EMSR920');
  const points = [...activation.extent.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)]
    .map(([, x, y]) => [Number(x), Number(y)]);
  const widget = new Widget();
  widget.copy = { extent: 'Extent', extentNote: 'Official perimeter', centroid: 'Centroid', centroidNote: 'Centroid only', noGeometry: 'No geometry', openViewerMap: 'Open viewer' };

  const svg = widget.drawMap([points], activation.centroid);

  assert.match(svg, /<path d="M /);
  assert.doesNotMatch(svg, /<circle /);
});

test('a code absent from the catalog never receives another activation’s data', async () => {
  const widget = widgetFor('EMSR000');
  let rendered = false;
  let unavailable = false;
  widget.render = () => { rendered = true; };
  widget.renderUnavailable = () => { unavailable = true; };

  await widget.load(true);

  assert.equal(rendered, false);
  assert.equal(unavailable, true);
});
