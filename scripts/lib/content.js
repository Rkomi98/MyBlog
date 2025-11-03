import path from 'path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import slugify from 'slugify';
import { extractSummary, extractTitle } from './markdown.js';
import { ensureEnglishTranslation } from './translation.js';

function toPosix(input) {
  return input.split(path.sep).join('/');
}

function titleFromFilename(filename) {
  return filename
    .replace(/[_-]+/g, ' ')
    .replace(/\.md$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function addLanguageData(post, lang, fileInfo) {
  const markdown = await fs.readFile(fileInfo.absolutePath, 'utf8');
  const stats = await fs.stat(fileInfo.absolutePath);
  const title = extractTitle(markdown, titleFromFilename(path.basename(fileInfo.absolutePath)));
  const summary = extractSummary(markdown);

  post.languages[lang] = {
    title,
    summary,
    markdown,
    absolutePath: fileInfo.absolutePath,
    relativePath: fileInfo.relativePath,
    modifiedTime: stats.mtime,
  };
}

export async function collectPosts({
  rootDir,
  autoTranslate = true,
  logger = console,
} = {}) {
  const filesDir = path.join(rootDir, 'files');
  const entries = await fg(['**/*.md'], {
    cwd: filesDir,
    onlyFiles: true,
    ignore: ['Old docs/**', 'old docs/**'],
  });

  const postMap = new Map();

  for (const relative of entries) {
    const absolutePath = path.join(filesDir, relative);
    const filename = path.basename(relative);
    const dir = path.dirname(relative) === '.' ? '' : path.dirname(relative);
    const isEn = filename.toLowerCase().endsWith('_en.md');
    const baseName = isEn ? filename.replace(/_en\.md$/i, '.md') : filename;
    const key = path.join(dir, baseName);

    if (!postMap.has(key)) {
      postMap.set(key, {
        key,
        dir,
        baseName,
        languages: {},
      });
    }

    postMap.get(key).languages[isEn ? 'en' : 'it'] = {
      absolutePath,
      relativePath: relative,
    };
  }

  if (autoTranslate) {
    for (const entry of postMap.values()) {
      if (entry.languages.it && !entry.languages.en) {
        try {
          const englishPath = await ensureEnglishTranslation(entry.languages.it.absolutePath, {
            logger,
          });
          if (englishPath) {
            entry.languages.en = {
              absolutePath: englishPath,
              relativePath: toPosix(path.relative(filesDir, englishPath)),
            };
          }
        } catch (error) {
          logger.error(
            `[translate] Failed to generate English version for ${entry.baseName}: ${error.message}`,
          );
          logger.debug?.(error);
        }
      }
    }
  }

  const posts = [];
  const slugCounts = new Map();

  for (const entry of postMap.values()) {
    const post = {
      key: entry.key,
      dir: entry.dir,
      baseName: entry.baseName,
      languages: {},
    };

    if (entry.languages.it) {
      await addLanguageData(post, 'it', entry.languages.it);
    }

    if (entry.languages.en) {
      await addLanguageData(post, 'en', entry.languages.en);
    }

    const slugSeed =
      post.languages.it?.title ??
      post.languages.en?.title ??
      titleFromFilename(entry.baseName) ??
      entry.baseName.replace(/\.md$/, '');

    const slugCandidate = slugify(slugSeed, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = slugCandidate || slugify(entry.baseName, { lower: true, strict: true });
    if (!slug || slug === '') {
      slug = slugify(entry.key, { lower: true, strict: true }) || `post-${posts.length + 1}`;
    }

    const count = slugCounts.get(slug) ?? 0;
    if (count > 0) {
      slugCounts.set(slug, count + 1);
      post.slug = `${slug}-${count + 1}`;
    } else {
      slugCounts.set(slug, 1);
      post.slug = slug;
    }

    const latestDate = ['it', 'en']
      .map((lang) => post.languages[lang]?.modifiedTime)
      .filter(Boolean)
      .sort((a, b) => b - a)[0];

    post.updatedAt = latestDate ?? new Date();

    posts.push(post);
  }

  posts.sort((a, b) => b.updatedAt - a.updatedAt);

  return posts;
}
