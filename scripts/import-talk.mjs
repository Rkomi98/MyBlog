#!/usr/bin/env node
/**
 * Importa un deck Slidev nella sezione "Interventi" del blog.
 *
 *   node scripts/import-talk.mjs <cartella-deck-slidev> <slug>
 *   npm run talk:import -- "/Volumes/T7/Documents/Cernusco/lezione 1" cernusco-lezione-1-capire-ai
 *
 * Cosa fa:
 *  1. crea accanto al deck una copia temporanea dell'entry con `routerMode: hash`
 *     (GitHub Pages non sa gestire le URL "pulite" di Slidev) e la cancella a fine build;
 *  2. lancia `slidev build` con base `/MyBlog/talks/<slug>/`;
 *  3. sostituisce `talks/<slug>/` con il risultato.
 *
 * Il deck originale non viene modificato. Dopo l'import registra (o aggiorna) la voce
 * in `data/talks.json` e lancia `npm run build`.
 */
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';
import fs from 'fs-extra';

const SITE_BASE = '/MyBlog';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

const [deckArg, slug] = process.argv.slice(2);
if (!deckArg || !slug) {
  fail('Uso: node scripts/import-talk.mjs <cartella-deck-slidev> <slug>');
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail('Lo slug deve essere minuscolo, con numeri e trattini (es. cernusco-lezione-1-capire-ai).');
}

const deckDir = path.resolve(deckArg);
const entryFile = path.join(deckDir, 'slides.md');
const slidevBin = path.join(deckDir, 'node_modules', '.bin', 'slidev');
if (!(await fs.pathExists(entryFile))) fail(`slides.md non trovato in ${deckDir}`);
if (!(await fs.pathExists(slidevBin))) {
  fail(`Slidev non installato in ${deckDir}: lancia prima "npm install" nella cartella del deck.`);
}

/** Forza `routerMode: hash` nel frontmatter (headmatter) del primo slide. */
function withHashRouter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) fail('Il deck non ha un frontmatter iniziale: impossibile impostare routerMode.');
  const header = /^routerMode\s*:/m.test(match[1])
    ? match[1].replace(/^routerMode\s*:.*$/m, 'routerMode: hash')
    : `${match[1]}\nrouterMode: hash`;
  return source.replace(match[0], `---\n${header}\n---`);
}

const tempEntry = path.join(deckDir, '.talk-import.md');
const outDir = path.join(rootDir, 'talks', slug);
const stagingDir = path.join(rootDir, 'talks', `.${slug}.staging`);
const base = `${SITE_BASE}/talks/${slug}/`;

try {
  await fs.writeFile(tempEntry, withHashRouter(await fs.readFile(entryFile, 'utf8')), 'utf8');
  await fs.remove(stagingDir);
  await fs.ensureDir(path.dirname(stagingDir));

  console.log(`→ slidev build  (base ${base}, router hash)`);
  const result = spawnSync(slidevBin, ['build', path.basename(tempEntry), '--base', base, '--out', stagingDir], {
    cwd: deckDir,
    stdio: 'inherit',
  });
  if (result.status !== 0) fail('slidev build fallita.');

  // La build SPA genera anche 404.html e _redirects pensati per Netlify: inutili con il router hash.
  await fs.remove(path.join(stagingDir, '_redirects'));
  await fs.remove(path.join(stagingDir, '404.html'));

  // Il disco esterno (exFAT) genera file AppleDouble `._*`: non vanno pubblicati.
  const junk = await fg(['**/._*', '**/.DS_Store'], { cwd: stagingDir, dot: true });
  await Promise.all(junk.map((file) => fs.remove(path.join(stagingDir, file))));

  await fs.remove(outDir);
  await fs.move(stagingDir, outDir);
  console.log(`✔ Deck importato in ${path.relative(rootDir, outDir)}/`);
} finally {
  await fs.remove(tempEntry);
  await fs.remove(stagingDir);
}
