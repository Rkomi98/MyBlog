import path from 'path';
import { markdownToHtml } from './markdown.js';

function toPosix(input) {
  return input.split(path.sep).join('/');
}

function joinUrl(base, ...parts) {
  const normalisedBase = base ? toPosix(base) : '.';
  return toPosix(path.posix.join(normalisedBase, ...parts.filter(Boolean)));
}

function formatDate(date) {
  if (!date) {
    return '';
  }
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

const sharedStyles = `
  :root {
    color-scheme: light dark;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
  }
  body {
    margin: 0;
    padding: 0;
    background: var(--bg, #0f172a);
    color: #0f172a;
  }
  @media (prefers-color-scheme: dark) {
    body {
      color: #e2e8f0;
    }
  }
  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }
  header nav a {
    margin-left: 1rem;
    text-decoration: none;
    font-weight: 500;
    color: inherit;
  }
  header nav a:hover {
    text-decoration: underline;
  }
`;

export function renderBlogIndex({ posts, relativeRoot }) {
  const italian = posts
    .filter((post) => post.languages.it)
    .map((post) => ({
      slug: post.slug,
      title: post.languages.it.title,
      summary: post.languages.it.summary,
      date: formatDate(post.languages.it.modifiedTime),
    }));

  const english = posts
    .filter((post) => post.languages.en)
    .map((post) => ({
      slug: post.slug,
      title: post.languages.en.title,
      summary: post.languages.en.summary,
      date: formatDate(post.languages.en.modifiedTime),
    }));

  const totalItems = italian.length + english.length;

  const homeLink = joinUrl(relativeRoot, 'index.html');

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog | Mirko Calcaterra</title>
  <style>
    ${sharedStyles}
    h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin-bottom: 0.5rem;
    }
    .count {
      color: #64748b;
      margin-bottom: 2rem;
    }
    .grid {
      display: grid;
      gap: 1.5rem;
    }
    .card {
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.85);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    @media (prefers-color-scheme: dark) {
      .card {
        background: rgba(15, 23, 42, 0.65);
      }
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 35px -20px rgba(15, 23, 42, 0.5);
    }
    .card a {
      color: inherit;
      text-decoration: none;
    }
    .card h2 {
      margin: 0 0 0.75rem;
      font-size: 1.3rem;
    }
    .card p {
      margin: 0;
      color: #475569;
    }
    @media (prefers-color-scheme: dark) {
      .card p {
        color: #cbd5f5;
      }
    }
    section {
      margin-bottom: 3rem;
    }
    section header {
      margin: 0 0 1.5rem;
    }
    section header h2 {
      margin: 0;
      font-size: 1.6rem;
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <div>
        <h1>Blog</h1>
        <p class="count">${totalItems} markdown file(s) in <code>files</code></p>
      </div>
      <nav>
        <a href="${homeLink}">Home</a>
      </nav>
    </header>

    <main>
      <section>
        <header>
          <h2>Articoli in Italiano</h2>
          <p>${italian.length} elementi</p>
        </header>
        <div class="grid">
          ${italian
            .map(
              (item) => `
          <article class="card">
            <a href="${joinUrl('.', 'it', item.slug, '/')}" lang="it">
              <h2>${item.title}</h2>
              <p>${item.summary}</p>
              <p><small>${item.date}</small></p>
            </a>
          </article>`,
            )
            .join('\n')}
        </div>
      </section>

      <section>
        <header>
          <h2>English Articles</h2>
          <p>${english.length} items</p>
        </header>
        <div class="grid">
          ${english
            .map(
              (item) => `
          <article class="card">
            <a href="${joinUrl('.', 'en', item.slug, '/')}" lang="en">
              <h2>${item.title}</h2>
              <p>${item.summary}</p>
              <p><small>${item.date}</small></p>
            </a>
          </article>`,
            )
            .join('\n')}
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;
}

export function renderBlogDetail({
  post,
  language,
  relativeRoot,
}) {
  const langData = post.languages[language];
  if (!langData) {
    throw new Error(`Language ${language} is not available for ${post.slug}`);
  }

  const otherLang = language === 'it' ? 'en' : 'it';
  const otherLangData = post.languages[otherLang];
  const blogHome = joinUrl(relativeRoot, 'blog', 'index.html');
  const homeLink = joinUrl(relativeRoot, 'index.html');

  const otherLangLink = otherLangData
    ? joinUrl(relativeRoot, 'blog', otherLang, post.slug, '/')
    : null;

  const html = markdownToHtml(langData.markdown, { relativeRoot });

  return `<!DOCTYPE html>
<html lang="${language}" ${
    language === 'en' ? '' : 'translate="no"'
  }>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${langData.title}</title>
  <style>
    ${sharedStyles}
    h1 {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      margin-bottom: 1rem;
    }
    .meta {
      color: #64748b;
      margin-bottom: 2.5rem;
    }
    article {
      font-size: 1.05rem;
    }
    article img {
      max-width: 100%;
      border-radius: 0.75rem;
      margin: 1.5rem 0;
      box-shadow: 0 10px 25px -12px rgba(15, 23, 42, 0.35);
    }
    article pre {
      background: rgba(15, 23, 42, 0.85);
      color: #e2e8f0;
      padding: 1rem 1.25rem;
      overflow-x: auto;
      border-radius: 0.75rem;
    }
    nav {
      margin-bottom: 2rem;
      display: flex;
      gap: 1rem;
    }
    nav a {
      text-decoration: none;
      font-weight: 500;
      color: inherit;
    }
    nav a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="page">
    <nav>
      <a href="${blogHome}">← Blog</a>
      <a href="${homeLink}">Home</a>
      ${
        otherLangLink
          ? `<a href="${otherLangLink}">${
              language === 'it' ? 'Read in English' : 'Leggi in Italiano'
            }</a>`
          : ''
      }
    </nav>
    <article>
      <header>
        <h1>${langData.title}</h1>
        <p class="meta">
          Aggiornato il ${formatDate(langData.modifiedTime)}
        </p>
      </header>
      ${html}
    </article>
  </div>
</body>
</html>`;
}
