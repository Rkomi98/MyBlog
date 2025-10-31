import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import dotenv from 'dotenv';
import { collectPosts } from './lib/content.js';
import { renderBlogDetail, renderBlogIndex } from './lib/templates.js';

function toPosix(input) {
  return input.split(path.sep).join('/');
}

async function copyIfExists(src, dest) {
  const exists = await fs.pathExists(src);
  if (exists) {
    await fs.copy(src, dest, { overwrite: true });
  }
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

  const posts = await collectPosts({ rootDir, logger: console });

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
