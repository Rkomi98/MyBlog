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

async function copyStaticBlogPages(rootDir, blogDir) {
  const sourceDir = path.join(rootDir, 'blog');
  let entries = [];
  try {
    entries = await fs.readdir(sourceDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.html')) continue;
    if (entry.name === 'index.html') continue;
    const src = path.join(sourceDir, entry.name);
    const dest = path.join(blogDir, entry.name);
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

async function generateSitemap(posts, distDir) {
  const baseUrl = 'https://rkomi98.github.io/MyBlog';
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/blog/index.html`, priority: '0.8', changefreq: 'weekly' },
  ];

  for (const post of posts) {
    for (const lang of Object.keys(post.languages)) {
      urls.push({
        loc: `${baseUrl}/blog/${lang}/${post.slug}/`,
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: (post.languages[lang].modifiedTime || post.updatedAt).toISOString().split('T')[0]
      });
    }
  }

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf8');
  console.log(`✔️  Generated sitemap.xml with ${urls.length} URLs`);
}

async function syncDocsDirectory(distDir, rootDir) {
  const docsDir = path.join(rootDir, 'docs');
  await fs.ensureDir(docsDir);
  await fs.emptyDir(docsDir);
  await fs.copy(distDir, docsDir, { overwrite: true });
}

async function build() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '..');

  dotenv.config({ path: path.join(rootDir, '.env') });

  const distDir = path.join(rootDir, 'dist');
  await fs.emptyDir(distDir);
  await fs.writeFile(path.join(distDir, '.nojekyll'), '');

  await copyIfExists(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
  await copyIfExists(path.join(rootDir, 'Assets'), path.join(distDir, 'Assets'));
  await copyIfExists(path.join(rootDir, 'pdf'), path.join(distDir, 'pdf'));
  await copyIfExists(path.join(rootDir, 'data'), path.join(distDir, 'data'));
  await copyIfExists(path.join(rootDir, 'robots.txt'), path.join(distDir, 'robots.txt'));

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
  await copyStaticBlogPages(rootDir, blogDir);

  await generateSitemap(posts, distDir);

  await syncDocsDirectory(distDir, rootDir);

  console.log(`✔️  Generated ${posts.length} post(s) into ${toPosix(path.relative(rootDir, distDir))}`);
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exitCode = 1;
});
