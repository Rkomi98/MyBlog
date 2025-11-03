import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { ensureEnglishTranslation } from './lib/translation.js';

async function translateMissing() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '..');

  dotenv.config({ path: path.join(rootDir, '.env') });

  const filesDir = path.join(rootDir, 'files');
  const italianFiles = await fg(['**/*.md', '!**/*_en.md', '!Old docs/**', '!old docs/**'], {
    cwd: filesDir,
    onlyFiles: true,
  });

  if (!italianFiles.length) {
    console.log('No Italian markdown files found.');
    return;
  }

  const needsTranslation = [];
  for (const relative of italianFiles) {
    const absolutePath = path.join(filesDir, relative);
    const englishCandidate = path.join(
      path.dirname(absolutePath),
      `${path.basename(absolutePath, '.md')}_en.md`,
    );
    const exists = await fs.pathExists(englishCandidate);
    if (!exists) {
      needsTranslation.push(absolutePath);
    }
  }

  if (!needsTranslation.length) {
    console.log('All Italian files already have an English translation.');
    return;
  }

  console.log(`Translating ${needsTranslation.length} file(s)`);

  for (const filePath of needsTranslation) {
    await ensureEnglishTranslation(filePath, { logger: console });
  }
}

translateMissing().catch((error) => {
  console.error('Translation failed:', error);
  process.exitCode = 1;
});
