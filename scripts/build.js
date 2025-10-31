import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import dotenv from 'dotenv';
import { collectPosts } from './lib/content.js';
import { renderBlogDetail, renderBlogIndex } from './lib/templates.js';
import { loadBlogMetadata } from './lib/postMetadata.js';

function toPosix(input) {
  return input.split(path.sep).join('/');
}

async function copyIfExists(src, dest) {
  const exists = await fs.pathExists(src);
  if (exists) {
    await fs.copy(src, dest, { overwrite: true });
  }
}

function computeReadTime(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return 1;
  }
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function resolvePublishedAt(entry, fallback) {
  if (entry?.date) {
    const parsed = new Date(entry.date);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed;
    }
  }
  return fallback;
}

function mergeMetadata(posts, metadata) {
  for (const post of posts) {
    const languageEntries = Object.values(post.languages ?? {});
    let matchedEntry = null;

    for (const langData of languageEntries) {
      const relative = toPosix(langData.relativePath);
      matchedEntry =
        metadata.byPath.get(relative) ??
        metadata.byPath.get(`files/${relative}`) ??
        null;
      if (matchedEntry) {
        break;
      }
    }

    const fallbackLanguage = post.languages.it ?? post.languages.en ?? languageEntries[0];
    const fallbackMarkdown = fallbackLanguage?.markdown ?? '';
    const readTime = matchedEntry?.readTime ?? computeReadTime(fallbackMarkdown);
    const publishedAt = resolvePublishedAt(matchedEntry, post.updatedAt);
    const icon = matchedEntry?.icon ?? '📝';
    const category = matchedEntry?.category ?? 'General';
    const categoryLabels = matchedEntry?.categoryLabels ?? {
      it: category === 'General' ? 'Generale' : category,
      en: category,
    };
    const titles = matchedEntry?.titles ?? {};

    for (const [lang, langData] of Object.entries(post.languages)) {
      const overrideTitle = titles[lang];
      if (overrideTitle && overrideTitle !== langData.title) {
        post.languages[lang] = {
          ...langData,
          title: overrideTitle,
        };
      }
    }

    if (matchedEntry?.slug && matchedEntry.slug !== post.slug) {
      post.slug = matchedEntry.slug;
    }

    post.meta = {
      slug: post.slug,
      icon,
      category,
      categoryLabels: {
        it: categoryLabels.it ?? category,
        en: categoryLabels.en ?? category,
      },
      publishedAt,
      readTime,
      titles,
    };
  }

  posts.sort((a, b) => {
    const dateA = a.meta?.publishedAt ?? a.updatedAt;
    const dateB = b.meta?.publishedAt ?? b.updatedAt;
    return dateB - dateA;
  });

  return posts;
}

async function writeManifest(posts, outputDir) {
  const manifest = posts.map((post) => {
    const languages = {};
    for (const [lang, langData] of Object.entries(post.languages)) {
      languages[lang] = {
        title: langData.title,
        summary: langData.summary,
        source: toPosix(langData.relativePath),
        output: toPosix(path.join('blog', lang, post.slug, 'index.html')),
        updatedAt: langData.modifiedTime.toISOString(),
      };
    }

    return {
      slug: post.slug,
      updatedAt: post.updatedAt.toISOString(),
      publishedAt: post.meta?.publishedAt?.toISOString?.() ?? post.updatedAt.toISOString(),
      readTime: post.meta?.readTime ?? null,
      icon: post.meta?.icon ?? null,
      category: post.meta?.category ?? null,
      categoryLabels: post.meta?.categoryLabels ?? null,
      languages,
    };
  });

  await fs.writeJson(path.join(outputDir, 'posts.json'), manifest, { spaces: 2 });
}

async function build() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '..');

  dotenv.config({ path: path.join(rootDir, '.env') });

  const distDir = path.join(rootDir, 'dist');
  await fs.emptyDir(distDir);

  await copyIfExists(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
  await copyIfExists(path.join(rootDir, 'Assets'), path.join(distDir, 'Assets'));
  await copyIfExists(path.join(rootDir, 'pdf'), path.join(distDir, 'pdf'));
  await copyIfExists(path.join(rootDir, 'data'), path.join(distDir, 'data'));

  const metadata = await loadBlogMetadata({ rootDir, logger: console });

  const posts = await collectPosts({ rootDir, logger: console });
  mergeMetadata(posts, metadata);

  const blogDir = path.join(distDir, 'blog');
  await fs.ensureDir(blogDir);

  const blogIndexHtml = renderBlogIndex({
    posts,
    relativeRoot: path.relative(blogDir, distDir) || '.',
  });
  await fs.writeFile(path.join(blogDir, 'index.html'), blogIndexHtml, 'utf8');

  for (const post of posts) {
    for (const language of Object.keys(post.languages)) {
      const pageDir = path.join(blogDir, language, post.slug);
      await fs.ensureDir(pageDir);
      const relativeRoot = path.relative(pageDir, distDir) || '.';
      const html = renderBlogDetail({
        post,
        language,
        relativeRoot,
      });
      await fs.writeFile(path.join(pageDir, 'index.html'), html, 'utf8');
    }
  }

  await writeManifest(posts, blogDir);

  console.log(`✔️  Generated ${posts.length} post(s) into ${toPosix(path.relative(rootDir, distDir))}`);
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exitCode = 1;
});
