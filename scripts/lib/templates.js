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

function serializeForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function escapeHtml(value) {
  if (value == null) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildTocTree(headings = []) {
  const filtered = headings.filter((heading) => heading.level >= 2 && heading.level <= 4);
  if (!filtered.length) {
    return [];
  }

  const root = { level: 1, children: [] };
  const stack = [root];

  for (const heading of filtered) {
    const node = { ...heading, children: [] };
    while (stack.length && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    const parent = stack[stack.length - 1] ?? root;
    parent.children.push(node);
    stack.push(node);
  }

  assignTocNumbers(root.children, []);
  return root.children;
}

function assignTocNumbers(nodes, prefix) {
  nodes.forEach((node, index) => {
    const parts = [...prefix, index + 1];
    node.number = parts.join('.');
    if (node.children?.length) {
      assignTocNumbers(node.children, parts);
    }
  });
}

function renderTocList(nodes, isRoot = true) {
  if (!nodes?.length) {
    return '';
  }

  const listClass = isRoot ? 'post-toc__list' : 'post-toc__list post-toc__sublist';
  return `<ul class="${listClass}">
    ${nodes
      .map((node) => {
        const childHtml = renderTocList(node.children, false);
        const depth = Math.max(0, node.level - 2);
        return `<li class="post-toc__item" data-depth="${depth}">
          <a class="post-toc__link" href="#${node.id}">
            <span class="post-toc__number">${escapeHtml(node.number ?? '')}</span>
            <span class="post-toc__text">${escapeHtml(node.text)}</span>
          </a>
          ${childHtml}
        </li>`;
      })
      .join('')}
  </ul>`;
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
  const logoPath = joinUrl(relativeRoot, 'Assets', 'Logo.png');
  const logoWebpPath = joinUrl(relativeRoot, 'Assets', 'Logo.webp');
  const postsPayload = posts.map((post) => {
    const languages = {};
    for (const [lang, langData] of Object.entries(post.languages)) {
      languages[lang] = {
        title: langData.title,
        summary: langData.summary,
        link: joinUrl('.', lang, post.slug, 'index.html'),
      };
    }

    const publishedAt = post.meta?.publishedAt ?? post.updatedAt;
    return {
      slug: post.slug,
      icon: post.meta?.icon ?? '📝',
      category: post.meta?.category ?? 'General',
      categoryLabels: post.meta?.categoryLabels ?? { it: 'Generale', en: 'General' },
      readTime: post.meta?.readTime ?? 1,
      publishedAt: publishedAt.toISOString(),
      timestamp: publishedAt.getTime(),
      languages,
    };
  });

  const serializedPosts = serializeForScript(postsPayload);
  const homeLink = joinUrl(relativeRoot, 'index.html');
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://rkomi98.github.io/MyBlog';
  const canonicalUrl = `${baseUrl}/blog/index.html`;

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog | Mirko Calcaterra</title>
  <meta name="description" content="Blog tecnico di Mirko Calcaterra: approfondimenti su AI, Data Engineering, Geoinformatica e sviluppo software.">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-9EVQ8G9W48"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-9EVQ8G9W48');
  </script>
  
  <!-- Open Graph -->
  <meta property="og:type" content="blog">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="Blog | Mirko Calcaterra">
  <meta property="og:description" content="Approfondimenti e tutorial su AI, Geoinformatica e tecnologia.">
  <meta property="og:image" content="${baseUrl}/Assets/Logo.png">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary">
  <meta property="twitter:title" content="Blog | Mirko Calcaterra">
  <meta property="twitter:description" content="Approfondimenti e tutorial su AI, Geoinformatica e tecnologia.">
  <meta property="twitter:image" content="${baseUrl}/Assets/Logo.png">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Mirko Calcaterra Blog",
    "url": "${canonicalUrl}",
    "description": "Blog tecnico su AI e Geoinformatica",
    "publisher": {
      "@type": "Person",
      "name": "Mirko Calcaterra"
    }
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: radial-gradient(120% 120% at 50% 0%, rgba(59, 130, 246, 0.18) 0%, transparent 65%), var(--bg-primary);
      color: var(--text-primary);
      transition: background 0.3s ease, color 0.3s ease;
      --bg-primary: #0f172a;
      --bg-secondary: #111c33;
      --bg-card: rgba(15, 23, 42, 0.75);
      --border: rgba(148, 163, 184, 0.24);
      --text-primary: #e2e8f0;
      --text-secondary: #cbd5f5;
      --text-muted: #94a3b8;
      --accent: #60a5fa;
      --accent-strong: #38bdf8;
      --shadow-lg: 0 24px 45px -32px rgba(15, 23, 42, 0.85);
    }
    body[data-theme="light"] {
      --bg-primary: #f8fafc;
      --bg-secondary: #ffffff;
      --bg-card: rgba(255, 255, 255, 0.95);
      --border: rgba(148, 163, 184, 0.18);
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --accent: #2563eb;
      --accent-strong: #1d4ed8;
      --shadow-lg: 0 24px 45px -30px rgba(15, 23, 42, 0.12);
      background: radial-gradient(120% 120% at 50% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 60%), var(--bg-primary);
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    header.site-header {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(14px);
      background: rgba(15, 23, 42, 0.85);
      border-bottom: 1px solid var(--border);
      transition: background 0.3s ease;
    }
    body[data-theme="light"] header.site-header {
      background: rgba(248, 250, 252, 0.9);
    }
    .site-header__inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.2rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1.05rem;
      letter-spacing: 0.01em;
    }
    .logo-img {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      object-fit: cover;
      box-shadow: 0 8px 18px -12px rgba(15, 23, 42, 0.6);
    }
    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .lang-btn {
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 0.45rem 0.9rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, border 0.2s ease, transform 0.2s ease;
    }
    .lang-btn:hover {
      background: var(--accent);
      color: #ffffff;
      transform: translateY(-1px);
      border-color: transparent;
    }
    .theme-toggle {
      position: relative;
      width: 52px;
      height: 28px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      cursor: pointer;
      padding: 0;
      transition: background 0.3s ease, border 0.3s ease;
      display: flex;
      align-items: center;
    }
    .theme-toggle .theme-thumb {
      position: absolute;
      top: 50%;
      left: 4px;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #ffffff;
      color: #1f2937;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
      box-shadow: 0 6px 18px -8px rgba(15, 23, 42, 0.6);
    }
    body[data-theme="dark"] .theme-toggle .theme-thumb {
      transform: translate(20px, -50%);
      background: #1f2937;
      color: #f8fafc;
    }
    body[data-theme="dark"] .theme-toggle {
      background: rgba(37, 99, 235, 0.2);
      border-color: rgba(37, 99, 235, 0.3);
    }
    main.page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3.5rem 2rem 4rem;
    }
    .hero {
      margin-bottom: 2.5rem;
    }
    .hero h1 {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
    }
    .hero p {
      margin: 0;
      max-width: 720px;
      color: var(--text-muted);
      font-size: 1.05rem;
      line-height: 1.7;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .filter {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 220px;
    }
    .filter label {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    .filter select {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 0.65rem 0.9rem;
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
      transition: border 0.2s ease, box-shadow 0.2s ease;
    }
    .filter select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.22);
    }
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    .post-card {
      background: var(--bg-card);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      min-height: 100%;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .post-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 32px 60px -40px rgba(15, 23, 42, 0.95);
    }
    .post-card-hero {
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .post-card-icon {
      font-size: 2.8rem;
      filter: drop-shadow(0 10px 22px rgba(15, 23, 42, 0.45));
    }
    .post-card-body {
      padding: 1.8rem 1.8rem 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      flex: 1;
    }
    .post-card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.92rem;
    }
    .post-card-category {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.18);
      color: var(--accent);
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    body[data-theme="light"] .post-card-category {
      background: rgba(37, 99, 235, 0.12);
    }
    .post-card-date {
      color: var(--text-muted);
      font-weight: 500;
    }
    .post-card-title {
      margin: 0;
      font-size: 1.35rem;
      line-height: 1.3;
      color: var(--text-primary);
    }
    .post-card-summary {
      margin: 0;
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.65;
    }
    .post-card-footer {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      color: var(--text-muted);
      font-size: 0.92rem;
    }
    .post-card-link {
      font-weight: 600;
      color: var(--accent);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: color 0.2s ease, transform 0.2s ease;
    }
    .post-card-link:hover {
      color: var(--accent-strong);
      transform: translateX(2px);
    }
    .no-results {
      text-align: center;
      margin-top: 3rem;
      color: var(--text-muted);
      font-size: 1rem;
      display: none;
    }
    footer {
      margin-top: 4rem;
      padding: 2rem 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.92rem;
      border-top: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.35);
    }
    body[data-theme="light"] footer {
      background: rgba(255, 255, 255, 0.72);
    }
    @media (max-width: 768px) {
      .site-header__inner {
        padding: 1rem 1.5rem;
      }
      main.page {
        padding: 2.75rem 1.5rem 3.25rem;
      }
      .filters {
        flex-direction: column;
        align-items: stretch;
      }
      .filter {
        width: 100%;
      }
      .post-card-body {
        padding: 1.6rem 1.6rem 1.4rem;
      }
      .post-card-hero {
        height: 120px;
      }
    }
  </style>
</head>
<body data-theme="dark">
  <header class="site-header">
    <div class="site-header__inner">
      <a class="logo" href="${homeLink}">
        <picture>
          <source srcset="${logoWebpPath}" type="image/webp">
          <source srcset="${logoPath}" type="image/png">
          <img src="${logoPath}" alt="Mirko Calcaterra logo" class="logo-img" width="40" height="40">
        </picture>
        <span class="logo-text">Mirko Calcaterra</span>
      </a>
      <div class="header-controls">
        <button class="lang-btn" type="button">EN</button>
        <button class="theme-toggle" type="button" aria-label="Toggle theme">
          <span class="theme-thumb">☀️</span>
        </button>
      </div>
    </div>
  </header>
  <main class="page">
    <section class="hero">
      <h1 data-it="Il mio blog tecnico" data-en="My technical blog">Il mio blog tecnico</h1>
      <p data-it="Approfondimenti, casi studio e sperimentazioni su AI, Data Engineering e sviluppo software."
         data-en="Deep dives, case studies, and experiments on AI, Data Engineering, and modern software development.">
         Approfondimenti, casi studio e sperimentazioni su AI, Data Engineering e sviluppo software.
      </p>
    </section>
    <section class="filters" aria-label="Blog controls">
      <div class="filter">
        <label for="category-filter" data-it="Filtra per categoria" data-en="Filter by category">Filtra per categoria</label>
        <select id="category-filter">
          <option value="all" data-it="Tutte" data-en="All">Tutte</option>
        </select>
      </div>
      <div class="filter">
        <label for="sort-order" data-it="Ordina per data" data-en="Sort by date">Ordina per data</label>
        <select id="sort-order">
          <option value="desc" data-it="Più recenti" data-en="Newest first">Più recenti</option>
          <option value="asc" data-it="Meno recenti" data-en="Oldest first">Meno recenti</option>
        </select>
      </div>
    </section>
    <section aria-live="polite">
      <div id="posts-grid" class="posts-grid"></div>
      <p id="no-results" class="no-results" data-it="Nessun articolo trovato." data-en="No articles found.">Nessun articolo trovato.</p>
    </section>
  </main>
  <footer>
    <span data-it="© ${currentYear} Mirko Calcaterra. Tutti i diritti riservati."
          data-en="© ${currentYear} Mirko Calcaterra. All rights reserved.">
      © ${currentYear} Mirko Calcaterra. Tutti i diritti riservati.
    </span>
  </footer>
  <script>
    const POSTS_DATA = ${serializedPosts};
    (function() {
      const gradients = [
        'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        'linear-gradient(135deg, #f97316 0%, #fb7185 100%)',
        'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
        'linear-gradient(135deg, #f472b6 0%, #c084fc 100%)'
      ];
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const storedTheme = (localStorage.getItem('blogTheme') || '').toLowerCase();
      const storedLang = (localStorage.getItem('blogLang') || '').toLowerCase();
      const state = {
        lang: storedLang === 'en' ? 'en' : 'it',
        theme: storedTheme === 'light' ? 'light' : (storedTheme === 'dark' ? 'dark' : (prefersDark ? 'dark' : 'light')),
        category: 'all',
        sort: 'desc'
      };
      const elements = {
        body: document.body,
        langBtn: document.querySelector('.lang-btn'),
        themeToggle: document.querySelector('.theme-toggle'),
        themeThumb: document.querySelector('.theme-toggle .theme-thumb'),
        categorySelect: document.getElementById('category-filter'),
        sortSelect: document.getElementById('sort-order'),
        postsGrid: document.getElementById('posts-grid'),
        noResults: document.getElementById('no-results')
      };
      const categoryEntries = Array.from(
        POSTS_DATA.reduce((acc, post) => {
          if (!acc.has(post.category)) {
            acc.set(post.category, post.categoryLabels || {});
          }
          return acc;
        }, new Map())
      );
      function formatDate(isoString) {
        const date = new Date(isoString);
        if (Number.isNaN(date.valueOf())) {
          return '';
        }
        const formatter = state.lang === 'it'
          ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
          : new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        return formatter.format(date);
      }
      function applyTheme(theme) {
        state.theme = theme === 'dark' ? 'dark' : 'light';
        elements.body.setAttribute('data-theme', state.theme);
        if (elements.themeToggle) {
          elements.themeToggle.classList.toggle('active', state.theme === 'dark');
        }
        if (elements.themeThumb) {
          elements.themeThumb.textContent = state.theme === 'dark' ? '🌙' : '☀️';
        }
        localStorage.setItem('blogTheme', state.theme);
      }
      function updateTexts() {
        document.querySelectorAll('[data-it][data-en]').forEach((node) => {
          const value = node.getAttribute(state.lang === 'it' ? 'data-it' : 'data-en');
          if (value !== null) {
            node.textContent = value;
          }
        });
        if (elements.langBtn) {
          elements.langBtn.textContent = state.lang === 'it' ? 'EN' : 'IT';
        }
      }
      function populateCategoryOptions() {
        if (!elements.categorySelect) {
          return;
        }
        const currentValue = state.category;
        elements.categorySelect.innerHTML = '';
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.setAttribute('data-it', 'Tutte');
        allOption.setAttribute('data-en', 'All');
        elements.categorySelect.appendChild(allOption);
        categoryEntries.forEach(([value, labels]) => {
          const option = document.createElement('option');
          option.value = value;
          option.setAttribute('data-it', labels.it || value);
          option.setAttribute('data-en', labels.en || value);
          elements.categorySelect.appendChild(option);
        });
        const availableValues = new Set(['all', ...categoryEntries.map(([value]) => value)]);
        if (availableValues.has(currentValue)) {
          elements.categorySelect.value = currentValue;
        } else {
          elements.categorySelect.value = 'all';
          state.category = 'all';
        }
      }
      function renderPosts() {
        if (!elements.postsGrid) {
          return;
        }
        const posts = POSTS_DATA.filter((post) => state.category === 'all' || post.category === state.category)
          .sort((a, b) => {
            if (state.sort === 'asc') {
              return a.timestamp - b.timestamp;
            }
            return b.timestamp - a.timestamp;
          });
        elements.postsGrid.innerHTML = '';
        if (!posts.length) {
          if (elements.noResults) {
            elements.noResults.style.display = 'block';
          }
          return;
        }
        if (elements.noResults) {
          elements.noResults.style.display = 'none';
        }
        const fragment = document.createDocumentFragment();
        posts.forEach((post, index) => {
          const card = document.createElement('article');
          card.className = 'post-card';
          card.setAttribute('data-category', post.category);
          const hero = document.createElement('div');
          hero.className = 'post-card-hero';
          hero.style.background = gradients[index % gradients.length];
          const icon = document.createElement('div');
          icon.className = 'post-card-icon';
          icon.textContent = post.icon || '📝';
          hero.appendChild(icon);
          card.appendChild(hero);
          const body = document.createElement('div');
          body.className = 'post-card-body';
          const metaRow = document.createElement('div');
          metaRow.className = 'post-card-meta';
          const categoryChip = document.createElement('span');
          categoryChip.className = 'post-card-category';
          const categoryLabel = (post.categoryLabels && post.categoryLabels[state.lang]) || post.category;
          categoryChip.textContent = categoryLabel;
          const dateSpan = document.createElement('span');
          dateSpan.className = 'post-card-date';
          dateSpan.textContent = formatDate(post.publishedAt);
          metaRow.appendChild(categoryChip);
          metaRow.appendChild(dateSpan);
          body.appendChild(metaRow);
          const titleEl = document.createElement('h3');
          titleEl.className = 'post-card-title';
          titleEl.textContent =
            (post.languages[state.lang] && post.languages[state.lang].title) ||
            (post.languages.it && post.languages.it.title) ||
            (post.languages.en && post.languages.en.title) ||
            '';
          body.appendChild(titleEl);
          const summaryEl = document.createElement('p');
          summaryEl.className = 'post-card-summary';
          summaryEl.textContent =
            (post.languages[state.lang] && post.languages[state.lang].summary) ||
            (post.languages.it && post.languages.it.summary) ||
            (post.languages.en && post.languages.en.summary) ||
            '';
          body.appendChild(summaryEl);
          const footerRow = document.createElement('div');
          footerRow.className = 'post-card-footer';
          const readSpan = document.createElement('span');
          readSpan.className = 'post-card-readtime';
          readSpan.textContent = '⏱️ ' + post.readTime + ' min';
          const linkEl = document.createElement('a');
          linkEl.className = 'post-card-link';
          const fallbackLink = (post.languages.it && post.languages.it.link) || (post.languages.en && post.languages.en.link) || '#';
          linkEl.href = (post.languages[state.lang] && post.languages[state.lang].link) || fallbackLink;
          linkEl.textContent = state.lang === 'it' ? 'Leggi di più →' : 'Read more →';
          footerRow.appendChild(readSpan);
          footerRow.appendChild(linkEl);
          body.appendChild(footerRow);
          card.appendChild(body);
          fragment.appendChild(card);
        });
        elements.postsGrid.appendChild(fragment);
      }
      function applyLanguage(lang) {
        state.lang = lang === 'en' ? 'en' : 'it';
        document.documentElement.setAttribute('lang', state.lang);
        localStorage.setItem('blogLang', state.lang);
        updateTexts();
        renderPosts();
      }
      function init() {
        document.documentElement.setAttribute('lang', state.lang);
        populateCategoryOptions();
        updateTexts();
        applyTheme(state.theme);
        if (elements.categorySelect) {
          elements.categorySelect.addEventListener('change', (event) => {
            state.category = event.target.value;
            renderPosts();
          });
        }
        if (elements.sortSelect) {
          elements.sortSelect.value = state.sort;
          elements.sortSelect.addEventListener('change', (event) => {
            state.sort = event.target.value === 'asc' ? 'asc' : 'desc';
            renderPosts();
          });
        }
        if (elements.langBtn) {
          elements.langBtn.addEventListener('click', () => {
            applyLanguage(state.lang === 'it' ? 'en' : 'it');
          });
        }
        if (elements.themeToggle) {
          elements.themeToggle.addEventListener('click', () => {
            applyTheme(state.theme === 'dark' ? 'light' : 'dark');
          });
        }
        renderPosts();
      }
      init();
    })();
  </script>
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
    ? joinUrl(relativeRoot, 'blog', otherLang, post.slug, 'index.html')
    : null;

  const { html, headings } = markdownToHtml(langData.markdown, { relativeRoot });
  const cleanedHtml = html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/i, '').trim();
  const contentHtml = cleanedHtml || html;

  const publishedRaw = post.meta?.publishedAt ?? langData.modifiedTime ?? post.updatedAt;
  const publishedAt = new Date(publishedRaw);
  const formattedDate = Number.isNaN(publishedAt.valueOf())
    ? ''
    : publishedAt.toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const readTime =
    post.meta?.readTime ?? Math.max(1, Math.round(langData.markdown.split(/\s+/).length / 200));
  const categoryLabel =
    post.meta?.categoryLabels?.[language] ??
    post.meta?.category ??
    (language === 'it' ? 'Generale' : 'General');
  const icon = post.meta?.icon ?? '📝';

  const tocTree = buildTocTree(headings);
  const tocListHtml = renderTocList(tocTree);
  const tocLabels =
    language === 'it'
      ? { title: 'Indice', open: 'Mostra indice', close: 'Nascondi indice' }
      : { title: 'Table of contents', open: 'Show table of contents', close: 'Hide table of contents' };
  const tocHtml = tocListHtml
    ? `<aside class="post-toc" data-collapsed="false">
        <div class="post-toc__header">
          <div class="post-toc__title" data-it="Indice" data-en="Table of contents">${tocLabels.title}</div>
          <button class="post-toc__toggle" type="button" aria-expanded="true" aria-label="${tocLabels.close}">
            <span class="post-toc__toggle-text">${tocLabels.title}</span>
            <span class="post-toc__toggle-icon" aria-hidden="true">▾</span>
          </button>
        </div>
        <div class="post-toc__content">
          ${tocListHtml}
        </div>
      </aside>`
    : '';
  const layoutClass = tocHtml ? 'post-layout' : 'post-layout post-layout--single';
  const pageTitle = escapeHtml(langData.title);
  const formattedCategory = escapeHtml(categoryLabel);
  const formattedDateHtml = escapeHtml(formattedDate);
  const iconHtml = escapeHtml(icon);
  const currentYear = new Date().getFullYear();
  const logoPath = joinUrl(relativeRoot, 'Assets', 'Logo.png');
  
  const baseUrl = 'https://rkomi98.github.io/MyBlog';
  // Construct the absolute URL for the current page
  // We assume the structure: blog/{lang}/{slug}/index.html
  const pageUrl = `${baseUrl}/blog/${language}/${post.slug}/`;
  const summary = langData.summary || `Articolo su ${formattedCategory} di Mirko Calcaterra.`;
  const imageUrl = post.meta?.image ? (post.meta.image.startsWith('http') ? post.meta.image : `${baseUrl}/${post.meta.image}`) : `${baseUrl}/Assets/Logo.png`;

  return `<!DOCTYPE html>
<html lang="${language}" ${language === 'en' ? '' : 'translate="no"'}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle} | Mirko Calcaterra</title>
  <meta name="description" content="${escapeHtml(summary)}">
  <meta name="author" content="Mirko Calcaterra">
  <link rel="canonical" href="${pageUrl}">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-9EVQ8G9W48"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-9EVQ8G9W48');
  </script>

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${escapeHtml(summary)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="article:published_time" content="${publishedAt.toISOString()}">
  <meta property="article:author" content="Mirko Calcaterra">
  <meta property="article:section" content="${formattedCategory}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="${pageTitle}">
  <meta property="twitter:description" content="${escapeHtml(summary)}">
  <meta property="twitter:image" content="${imageUrl}">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${pageTitle}",
    "image": "${imageUrl}",
    "datePublished": "${publishedAt.toISOString()}",
    "dateModified": "${(langData.modifiedTime || publishedAt).toISOString()}",
    "author": {
      "@type": "Person",
      "name": "Mirko Calcaterra",
      "url": "${baseUrl}/"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mirko Calcaterra"
    },
    "description": "${escapeHtml(summary)}"
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: radial-gradient(120% 120% at 50% 0%, rgba(59, 130, 246, 0.18) 0%, transparent 65%), var(--bg-primary);
      color: var(--text-primary);
      transition: background 0.3s ease, color 0.3s ease;
      --bg-primary: #0f172a;
      --bg-secondary: #111c33;
      --bg-card: rgba(15, 23, 42, 0.78);
      --bg-card-strong: rgba(15, 23, 42, 0.9);
      --border: rgba(148, 163, 184, 0.24);
      --text-primary: #e2e8f0;
      --text-secondary: #cbd5f5;
      --text-muted: #94a3b8;
      --accent: #60a5fa;
      --accent-strong: #38bdf8;
      --shadow-lg: 0 28px 60px -36px rgba(15, 23, 42, 0.9);
      --code-inline-bg: rgba(6, 11, 19, 0.92);
      --code-block-bg: #050912;
      --code-border: rgba(148, 163, 184, 0.35);
      --code-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.12);
      --code-text: #f8fafc;
    }
    body[data-theme="light"] {
      --bg-primary: #f8fafc;
      --bg-secondary: #ffffff;
      --bg-card: rgba(255, 255, 255, 0.96);
      --bg-card-strong: rgba(248, 250, 252, 0.98);
      --border: rgba(148, 163, 184, 0.18);
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --accent: #2563eb;
      --accent-strong: #1d4ed8;
      --shadow-lg: 0 28px 50px -38px rgba(15, 23, 42, 0.18);
      background: radial-gradient(120% 120% at 50% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 60%), var(--bg-primary);
    }
    body[data-theme="light"] .post-toc {
      background: rgba(255, 255, 255, 0.96);
    }
    body[data-theme="light"] .post-body {
      background: rgba(255, 255, 255, 0.96);
      color: var(--text-secondary);
    }
    body[data-theme="light"] .post-hero__category {
      background: rgba(37, 99, 235, 0.12);
      color: var(--accent-strong);
    }
    body[data-theme="light"] .post-body blockquote {
      background: rgba(37, 99, 235, 0.1);
      color: var(--text-primary);
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    header.site-header {
      position: sticky;
      top: 0;
      z-index: 12;
      backdrop-filter: blur(14px);
      background: rgba(15, 23, 42, 0.85);
      border-bottom: 1px solid var(--border);
      transition: background 0.3s ease;
    }
    body[data-theme="light"] header.site-header {
      background: rgba(248, 250, 252, 0.9);
    }
    .site-header__inner {
      max-width: 960px;
      margin: 0 auto;
      padding: 1.15rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .site-header__left {
      display: flex;
      align-items: center;
      gap: 1.75rem;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1.05rem;
      letter-spacing: 0.01em;
    }
    .logo-img {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      object-fit: cover;
      box-shadow: 0 8px 18px -12px rgba(15, 23, 42, 0.6);
    }
    .site-nav {
      display: flex;
      gap: 1.1rem;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-muted);
    }
    .site-nav a:hover {
      color: var(--accent);
    }
    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .lang-btn {
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 0.45rem 0.9rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, border 0.2s ease, transform 0.2s ease;
    }
    .lang-btn:hover:not(.lang-btn--disabled) {
      background: var(--accent);
      color: #ffffff;
      transform: translateY(-1px);
      border-color: transparent;
    }
    .lang-btn--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .theme-toggle {
      position: relative;
      width: 52px;
      height: 28px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      cursor: pointer;
      padding: 0;
      transition: background 0.3s ease, border 0.3s ease;
      display: flex;
      align-items: center;
    }
    .theme-toggle .theme-thumb {
      position: absolute;
      top: 50%;
      left: 4px;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #ffffff;
      color: #1f2937;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
      box-shadow: 0 6px 18px -8px rgba(15, 23, 42, 0.6);
    }
    body[data-theme="dark"] .theme-toggle .theme-thumb {
      transform: translate(20px, -50%);
      background: #1f2937;
      color: #f8fafc;
    }
    body[data-theme="dark"] .theme-toggle {
      background: rgba(37, 99, 235, 0.2);
      border-color: rgba(37, 99, 235, 0.3);
    }
    main.page {
      max-width: 960px;
      margin: 0 auto;
      padding: 3.5rem 2rem 4.5rem;
    }
    .post-hero {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(14, 165, 233, 0.08) 60%), var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 2.75rem;
      box-shadow: var(--shadow-lg);
      margin-bottom: 3rem;
    }
    .post-hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.22) 0%, transparent 55%);
      pointer-events: none;
    }
    .post-hero__icon {
      position: relative;
      font-size: 3.1rem;
      margin-bottom: 1.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .post-hero__category {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.35);
      color: #ffffff;
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    .post-hero__title {
      position: relative;
      margin: 0 0 1.25rem;
      font-size: clamp(2.4rem, 4vw, 3.2rem);
      letter-spacing: -0.025em;
      line-height: 1.2;
      color: var(--text-primary);
    }
    .post-hero__meta {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 500;
    }
    .post-hero__meta span {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
    }
    .post-layout {
      display: grid;
      grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
      gap: 2.5rem;
      align-items: flex-start;
    }
    .post-layout--single {
      grid-template-columns: minmax(0, 1fr);
    }
    .post-toc {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 22px;
      padding: 1.5rem 1.6rem 1.8rem;
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 120px;
      max-height: calc(100vh - 160px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .post-toc__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .post-toc__title {
      text-transform: uppercase;
      font-size: 0.78rem;
      letter-spacing: 0.18em;
      font-weight: 700;
      color: var(--text-muted);
    }
    .post-toc__toggle {
      display: none;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-secondary);
      border-radius: 999px;
      padding: 0.25rem 0.8rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      align-items: center;
      gap: 0.4rem;
      transition: background 0.2s ease, border 0.2s ease, color 0.2s ease;
    }
    .post-toc__toggle:hover {
      background: rgba(96, 165, 250, 0.15);
      border-color: transparent;
      color: var(--accent);
    }
    .post-toc__content {
      margin-top: 0.6rem;
      overflow-y: auto;
      padding-right: 0.4rem;
      transition: max-height 0.25s ease, opacity 0.25s ease;
      max-height: calc(100vh - 220px);
    }
    .post-toc--collapsed .post-toc__content {
      max-height: 0;
      opacity: 0;
      margin-top: 0;
      pointer-events: none;
    }
    .post-toc__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .post-toc__sublist {
      margin-left: 0.85rem;
      padding-left: 0.85rem;
      border-left: 1px solid rgba(148, 163, 184, 0.35);
      margin-top: 0.4rem;
      gap: 0.35rem;
    }
    .post-toc__item {
      margin: 0;
    }
    .post-toc__link {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.45;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      border-bottom: 1px dashed transparent;
      transition: color 0.2s ease, border-bottom 0.2s ease, transform 0.2s ease;
    }
    .post-toc__link:hover {
      color: var(--accent);
      border-bottom-color: rgba(96, 165, 250, 0.4);
      transform: translateX(2px);
    }
    .post-toc__link--active {
      color: var(--accent-strong);
      border-bottom-color: var(--accent-strong);
    }
    .post-toc__number {
      font-variant-numeric: tabular-nums;
      font-size: 0.85rem;
      color: var(--text-muted);
      min-width: 2.5ch;
      display: inline-flex;
      justify-content: flex-end;
      padding-top: 0.15rem;
    }
    .post-toc__text {
      flex: 1;
    }
    .post-body {
      background: var(--bg-card-strong);
      border: 1px solid var(--border);
      border-radius: 26px;
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      font-size: 1.04rem;
      line-height: 1.75;
      color: var(--text-secondary);
    }
    .post-body h2 {
      margin-top: 2.75rem;
      margin-bottom: 1.25rem;
      font-size: clamp(1.9rem, 3vw, 2.35rem);
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }
    .post-body h3 {
      margin-top: 2.2rem;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      color: var(--text-primary);
    }
    .post-body h4 {
      margin-top: 1.8rem;
      margin-bottom: 0.75rem;
      font-size: 1.2rem;
      color: var(--text-primary);
    }
    .post-body p {
      margin-bottom: 1.4rem;
    }
    .post-body .post-warning {
      margin: 2rem 0;
      border-radius: 18px;
      border: 1px solid rgba(250, 204, 21, 0.35);
      background: rgba(254, 243, 199, 0.9);
      color: #4a3b0a;
      padding: 0 1.25rem 1rem;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
    }
    body[data-theme="dark"] .post-body .post-warning {
      background: rgba(253, 230, 138, 0.12);
      border-color: rgba(251, 191, 36, 0.5);
      color: #f6e6b2;
      box-shadow: inset 0 0 0 1px rgba(250, 200, 88, 0.3);
    }
    .post-body .post-warning summary {
      list-style: none;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 0;
      color: inherit;
    }
    .post-body .post-warning summary::-webkit-details-marker {
      display: none;
    }
    .post-body .post-warning summary::before {
      content: '⚠️';
      font-size: 1rem;
    }
    .post-body .post-warning[open] {
      padding-bottom: 1.25rem;
    }
    .post-body .post-warning p:last-child {
      margin-bottom: 0;
    }
    .post-body ul,
    .post-body ol {
      margin: 1.4rem 0 1.4rem 1.4rem;
      padding: 0;
    }
    .post-body li {
      margin-bottom: 0.8rem;
    }
    .post-body a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid rgba(96, 165, 250, 0.35);
      transition: color 0.2s ease, border-bottom 0.2s ease;
    }
    .post-body a:hover {
      color: var(--accent-strong);
      border-bottom-color: var(--accent-strong);
    }
    .post-body blockquote {
      margin: 2rem 0;
      padding: 1.5rem 1.75rem;
      border-left: 4px solid var(--accent);
      border-radius: 0 18px 18px 0;
      background: rgba(37, 99, 235, 0.12);
      color: var(--text-primary);
    }
    .post-body code {
      background: var(--code-inline-bg);
      color: var(--code-text);
      padding: 0.2rem 0.45rem;
      border-radius: 6px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.9rem;
    }
    .post-body pre code {
      background: transparent;
      padding: 0;
      display: block;
      font-size: inherit;
      line-height: inherit;
    }
    .hljs {
      color: #e2e8f0;
      background: transparent;
    }
    .hljs-comment,
    .hljs-quote {
      color: #7dd79d;
      font-style: italic;
    }
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-name,
    .hljs-strong,
    .hljs-built_in {
      color: #7dd3fc;
      font-weight: 600;
    }
    .hljs-title,
    .hljs-section,
    .hljs-function,
    .hljs-meta .hljs-keyword {
      color: #38bdf8;
      font-weight: 600;
    }
    .hljs-string,
    .hljs-doctag,
    .hljs-addition,
    .hljs-attribute,
    .hljs-template-tag,
    .hljs-template-variable {
      color: #facc15;
    }
    .hljs-number,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-type {
      color: #f472b6;
    }
    .hljs-variable,
    .hljs-params {
      color: #cbd5f5;
    }
    .post-body pre {
      background: var(--code-block-bg);
      color: var(--code-text);
      padding: 1.2rem 1.4rem;
      padding-right: 3.6rem;
      border-radius: 18px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.95rem;
      box-shadow: var(--code-shadow);
      border: 1px solid var(--code-border);
      margin: 2rem 0;
      position: relative;
    }
    .code-copy-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(15, 23, 42, 0.8);
      color: #e2e8f0;
      border: 1px solid rgba(148, 163, 184, 0.35);
      border-radius: 999px;
      padding: 0.25rem 0.85rem;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    }
    .code-copy-btn:hover {
      background: rgba(96, 165, 250, 0.85);
      color: #ffffff;
      border-color: transparent;
      transform: translateY(-1px);
    }
    .code-copy-btn--copied {
      background: rgba(34, 197, 94, 0.85);
      color: #ffffff;
      border-color: transparent;
    }
    .code-copy-btn__icon {
      font-size: 0.95rem;
    }
    .code-copy-btn__text {
      display: inline-block;
    }
    body[data-theme="light"] .code-copy-btn {
      background: rgba(248, 250, 252, 0.85);
      color: #0f172a;
      border-color: rgba(148, 163, 184, 0.4);
    }
    body[data-theme="light"] .code-copy-btn--copied {
      background: rgba(34, 197, 94, 0.92);
      color: #ffffff;
    }
    .post-body img {
      max-width: 100%;
      border-radius: 18px;
      margin: 2.2rem 0;
      box-shadow: 0 24px 45px -28px rgba(15, 23, 42, 0.55);
    }
    .post-body .table-wrapper {
      margin: 2rem 0;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.55);
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.12);
      position: relative;
      overflow: hidden;
    }
    .post-body .table-wrapper__scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .post-body .table-wrapper__scroll::-webkit-scrollbar {
      height: 10px;
    }
    .post-body .table-wrapper__scroll::-webkit-scrollbar-thumb {
      background: rgba(96, 165, 250, 0.4);
      border-radius: 999px;
    }
    .post-body .table-wrapper table {
      width: 100%;
      border-collapse: collapse;
      background: transparent;
    }
    .post-body .table-wrapper[data-table-size="medium"] table {
      min-width: 720px;
    }
    .post-body .table-wrapper[data-table-size="wide"] table {
      min-width: 960px;
    }
    .post-body .table-wrapper thead th {
      background: rgba(96, 165, 250, 0.12);
      color: var(--text-primary);
      font-weight: 600;
    }
    .post-body .table-wrapper th,
    .post-body .table-wrapper td {
      padding: 0.9rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      white-space: nowrap;
    }
    .post-body .table-wrapper td {
      white-space: normal;
    }
    .post-body .table-wrapper tr:last-child td {
      border-bottom: none;
    }
    .post-body .table-wrapper__expand {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.3);
      color: var(--accent);
      border-radius: 999px;
      padding: 0.35rem 0.9rem;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
      z-index: 2;
    }
    .post-body .table-wrapper__expand:hover {
      background: rgba(37, 99, 235, 0.35);
      color: #ffffff;
      transform: translateY(-1px);
      border-color: transparent;
    }
    .table-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      z-index: 999;
    }
    .table-overlay--visible {
      display: flex;
    }
    .table-overlay__content {
      background: var(--bg-card-strong);
      border: 1px solid var(--border);
      border-radius: 24px;
      max-width: min(1080px, 92vw);
      max-height: 85vh;
      width: 100%;
      box-shadow: 0 32px 80px -40px rgba(15, 23, 42, 0.9);
      position: relative;
      overflow: hidden;
    }
    .table-overlay__close {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.35);
      color: var(--text-primary);
      border-radius: 999px;
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
    }
    .table-overlay__close:hover {
      background: rgba(37, 99, 235, 0.4);
      color: #ffffff;
      border-color: transparent;
    }
    .table-overlay__scroll {
      overflow: auto;
      max-height: 85vh;
      padding: 2.5rem 2rem 2rem;
    }
    .table-overlay__scroll table {
      width: 100%;
      border-collapse: collapse;
      background: transparent;
    }
    .table-overlay__scroll table[data-table-size="medium"] {
      min-width: 720px;
    }
    .table-overlay__scroll table[data-table-size="wide"] {
      min-width: 960px;
    }
    .table-overlay__scroll thead th {
      background: rgba(96, 165, 250, 0.12);
      color: var(--text-primary);
      font-weight: 600;
    }
    .table-overlay__scroll th,
    .table-overlay__scroll td {
      padding: 0.9rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      white-space: nowrap;
    }
    .table-overlay__scroll td {
      white-space: normal;
    }
    .table-overlay__scroll tr:last-child td {
      border-bottom: none;
    }
    body[data-theme="light"] .post-body .table-wrapper {
      background: rgba(255, 255, 255, 0.96);
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.16);
    }
    body[data-theme="light"] .post-body .table-wrapper__expand {
      background: rgba(248, 250, 252, 0.9);
    }
    body[data-theme="light"] .table-overlay {
      background: rgba(15, 23, 42, 0.25);
    }
    body[data-theme="light"] .table-overlay__content {
      background: rgba(255, 255, 255, 0.98);
    }
    body.no-scroll {
      overflow: hidden;
    }
    footer {
      margin-top: 4rem;
      padding: 2rem 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.92rem;
      border-top: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.35);
    }
    body[data-theme="light"] footer {
      background: rgba(255, 255, 255, 0.72);
    }
    @media (max-width: 1024px) {
      .site-header__inner {
        padding: 1rem 1.5rem;
      }
      main.page {
        padding: 2.75rem 1.5rem 4rem;
      }
      .post-layout {
        grid-template-columns: minmax(0, 1fr);
      }
      .post-toc {
        position: static;
        max-height: none;
        margin-bottom: 2rem;
        padding: 1.25rem 1.35rem 1.5rem;
      }
      .post-toc__toggle {
        display: inline-flex;
      }
      .post-toc__content {
        max-height: none;
        margin-top: 0.4rem;
        overflow: visible;
      }
    }
    @media (max-width: 720px) {
      .post-hero {
        padding: 2.1rem 1.65rem;
      }
      .post-body {
        padding: 1.9rem 1.5rem;
      }
      .site-header__inner {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      .site-header__left {
        justify-content: space-between;
      }
      .header-controls {
        align-self: flex-end;
      }
      .post-hero__title {
        font-size: clamp(2rem, 6vw, 2.6rem);
      }
      .post-body .table-wrapper {
        margin: 1.6rem 0;
      }
      .post-body .table-wrapper__expand {
        top: 0.6rem;
        right: 0.6rem;
        font-size: 0.78rem;
        padding: 0.25rem 0.75rem;
      }
      .table-overlay__scroll {
        padding: 1.8rem 1.25rem 1.5rem;
      }
    }
  </style>
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true,
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      },
    };
  </script>
  <script id="mathjax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
</head>
<body data-theme="dark">
  <header class="site-header">
    <div class="site-header__inner">
      <div class="site-header__left">
        <a class="logo" href="${homeLink}">
          <img src="${logoPath}" alt="Mirko Calcaterra logo" class="logo-img">
          <span class="logo-text">Mirko Calcaterra</span>
        </a>
        <nav class="site-nav">
          <a href="${homeLink}" data-it="Home" data-en="Home">Home</a>
          <a href="${blogHome}" data-it="Blog" data-en="Blog">Blog</a>
        </nav>
      </div>
      <div class="header-controls">
        <button class="lang-btn" type="button">EN</button>
        <button class="theme-toggle" type="button" aria-label="Toggle theme">
          <span class="theme-thumb">☀️</span>
        </button>
      </div>
    </div>
  </header>
  <main class="page">
    <article class="post">
      <section class="post-hero">
        <div class="post-hero__icon">${iconHtml}</div>
        <span class="post-hero__category">${formattedCategory}</span>
        <h1 class="post-hero__title">${pageTitle}</h1>
        <div class="post-hero__meta">
          <span>📅 ${formattedDateHtml}</span>
          <span>⏱️ ${readTime} min</span>
        </div>
      </section>
      <section class="${layoutClass}">
        ${tocHtml}
        <div class="post-body">
          ${contentHtml}
        </div>
      </section>
    </article>
  </main>
  <footer>
    <span data-it="© ${currentYear} Mirko Calcaterra. Tutti i diritti riservati."
          data-en="© ${currentYear} Mirko Calcaterra. All rights reserved.">
      © ${currentYear} Mirko Calcaterra. Tutti i diritti riservati.
    </span>
  </footer>
  <script>
    const BLOG_LANG_KEY = 'blogLang';
    const BLOG_THEME_KEY = 'blogTheme';
    const CURRENT_LANG = ${serializeForScript(language)};
    const OTHER_LANG = ${serializeForScript(otherLang)};
    const OTHER_LANG_LINK = ${serializeForScript(otherLangLink)};
    (function() {
      const body = document.body;
      const themeToggle = document.querySelector('.theme-toggle');
      const themeThumb = document.querySelector('.theme-toggle .theme-thumb');
      const langBtn = document.querySelector('.lang-btn');
      const tocElement = document.querySelector('.post-toc');
      const tocToggle = tocElement ? tocElement.querySelector('.post-toc__toggle') : null;
      const tocToggleText = tocElement ? tocElement.querySelector('.post-toc__toggle-text') : null;
      const tocTitle = tocElement ? tocElement.querySelector('.post-toc__title') : null;
      const tocLinks = tocElement ? Array.from(tocElement.querySelectorAll('.post-toc__link')) : [];
      const headingEntries = tocLinks
        .map((link) => {
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          return target ? { link, target } : null;
        })
        .filter(Boolean);
      const tocLabels = CURRENT_LANG === 'it'
        ? { title: 'Indice', show: 'Mostra indice', hide: 'Nascondi indice' }
        : { title: 'Table of contents', show: 'Show table of contents', hide: 'Hide table of contents' };
      const tableWrappers = Array.from(document.querySelectorAll('.table-wrapper[data-enhanced-table]'));
      const tableLabels = CURRENT_LANG === 'it'
        ? { expand: 'Apri a schermo intero', close: 'Chiudi' }
        : { expand: 'Open full view', close: 'Close' };
      const codeBlocks = Array.from(document.querySelectorAll('.post-body pre'));
      const codeCopyLabels = {
        it: { copy: 'Copia', copied: 'Copiato!' },
        en: { copy: 'Copy', copied: 'Copied!' },
      };
      let tableOverlay = null;
      let tableOverlayScroll = null;
      let tableOverlayClose = null;
      if (tocTitle) {
        tocTitle.textContent = tocLabels.title;
      }
      if (tocToggleText) {
        tocToggleText.textContent = tocLabels.title;
      }
      let tocCollapsed = false;
      let tocManualOverride = false;
      const tocMediaQuery = window.matchMedia ? window.matchMedia('(max-width: 1024px)') : null;
      function ensureTableOverlay() {
        if (tableOverlay) {
          return;
        }
        tableOverlay = document.createElement('div');
        tableOverlay.className = 'table-overlay';
        tableOverlay.innerHTML =
          '<div class="table-overlay__content">' +
          '<button type="button" class="table-overlay__close">' + tableLabels.close + '</button>' +
          '<div class="table-overlay__scroll"></div>' +
          '</div>';
        body.appendChild(tableOverlay);
        tableOverlayScroll = tableOverlay.querySelector('.table-overlay__scroll');
        tableOverlayClose = tableOverlay.querySelector('.table-overlay__close');
        if (tableOverlayClose) {
          tableOverlayClose.setAttribute('aria-label', tableLabels.close);
          tableOverlayClose.addEventListener('click', closeTableOverlay);
        }
        tableOverlay.addEventListener('click', (event) => {
          if (event.target === tableOverlay) {
            closeTableOverlay();
          }
        });
      }
      function closeTableOverlay() {
        if (!tableOverlay) {
          return;
        }
        tableOverlay.classList.remove('table-overlay--visible');
        body.classList.remove('no-scroll');
        if (tableOverlayScroll) {
          tableOverlayScroll.innerHTML = '';
        }
      }
      function openTableOverlay(wrapper) {
        ensureTableOverlay();
        if (!tableOverlay || !tableOverlayScroll) {
          return;
        }
        tableOverlayScroll.innerHTML = '';
        const table = wrapper.querySelector('table');
        if (table) {
          const clone = table.cloneNode(true);
          const tableSize = table.dataset.tableSize;
          if (tableSize) {
            clone.dataset.tableSize = tableSize;
          }
          tableOverlayScroll.appendChild(clone);
        }
        tableOverlay.classList.add('table-overlay--visible');
        body.classList.add('no-scroll');
        if (tableOverlayClose) {
          tableOverlayClose.focus();
        }
      }
      function enhanceTables() {
        if (!tableWrappers.length) {
          return;
        }
        tableWrappers.forEach((wrapper) => {
          if (wrapper.dataset.enhanced === 'true') {
            return;
          }
          const table = wrapper.querySelector('table');
          if (!table) {
            return;
          }
          const headerCells = table.querySelectorAll('thead th');
          const referenceCells = headerCells.length ? headerCells : table.querySelectorAll('tr:first-child > *');
          const columnCount = referenceCells.length;
          let tableSize = '';
          if (columnCount >= 6) {
            tableSize = 'wide';
          } else if (columnCount >= 4) {
            tableSize = 'medium';
          }
          if (tableSize) {
            wrapper.setAttribute('data-table-size', tableSize);
            table.dataset.tableSize = tableSize;
          }
          const expandBtn = document.createElement('button');
          expandBtn.type = 'button';
          expandBtn.className = 'table-wrapper__expand';
          expandBtn.innerHTML = '<span aria-hidden="true">🔍</span> ' + tableLabels.expand;
          expandBtn.setAttribute('aria-label', tableLabels.expand);
          expandBtn.addEventListener('click', () => openTableOverlay(wrapper));
          wrapper.appendChild(expandBtn);
          wrapper.dataset.enhanced = 'true';
        });
      }
      function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        let successful = false;
        try {
          successful = document.execCommand('copy');
        } catch (error) {
          successful = false;
        }
        textarea.remove();
        return successful;
      }
      function showCopyFeedback(button, labels) {
        if (button._copyTimeout) {
          clearTimeout(button._copyTimeout);
        }
        const labelEl = button.querySelector('.code-copy-btn__text');
        button.classList.add('code-copy-btn--copied');
        if (labelEl) {
          labelEl.textContent = labels.copied;
        }
        button._copyTimeout = window.setTimeout(() => {
          button.classList.remove('code-copy-btn--copied');
          if (labelEl) {
            labelEl.textContent = labels.copy;
          }
        }, 2000);
      }
      function enhanceCodeBlocks() {
        if (!codeBlocks.length) {
          return;
        }
        const labels = codeCopyLabels[CURRENT_LANG] || codeCopyLabels.en;
        codeBlocks.forEach((pre) => {
          if (pre.dataset.copyEnhanced === 'true') {
            return;
          }
          const code = pre.querySelector('code');
          if (!code) {
            return;
          }
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'code-copy-btn';
          button.setAttribute('aria-label', labels.copy);
          button.innerHTML =
            '<span class="code-copy-btn__icon" aria-hidden="true">📋</span>' +
            '<span class="code-copy-btn__text">' + labels.copy + '</span>';
          button.addEventListener('click', async () => {
            const text = (code.textContent || '').replace(/\s+$/, '');
            if (!text) {
              return;
            }
            let copied = false;
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
              try {
                await navigator.clipboard.writeText(text);
                copied = true;
              } catch (error) {
                copied = false;
              }
            }
            if (!copied) {
              copied = fallbackCopy(text);
            }
            if (copied) {
              showCopyFeedback(button, labels);
            }
          });
          pre.appendChild(button);
          pre.dataset.copyEnhanced = 'true';
        });
      }
      function setTocCollapsed(collapsed, { manual = false } = {}) {
        if (!tocElement) {
          return;
        }
        tocCollapsed = Boolean(collapsed);
        if (manual) {
          tocManualOverride = true;
        }
        tocElement.classList.toggle('post-toc--collapsed', tocCollapsed);
        tocElement.setAttribute('data-collapsed', tocCollapsed ? 'true' : 'false');
        if (tocToggle) {
          tocToggle.setAttribute('aria-expanded', tocCollapsed ? 'false' : 'true');
          tocToggle.setAttribute('aria-label', tocCollapsed ? tocLabels.show : tocLabels.hide);
        }
      }
      function initToc() {
        if (!tocElement) {
          return;
        }
        if (tocToggle) {
          tocToggle.addEventListener('click', () => {
            setTocCollapsed(!tocCollapsed, { manual: true });
          });
        }
        if (tocMediaQuery) {
          const handleMediaChange = (event) => {
            if (tocManualOverride) {
              return;
            }
            setTocCollapsed(event.matches);
          };
          if (typeof tocMediaQuery.addEventListener === 'function') {
            tocMediaQuery.addEventListener('change', handleMediaChange);
          } else if (typeof tocMediaQuery.addListener === 'function') {
            tocMediaQuery.addListener(handleMediaChange);
          }
          setTocCollapsed(tocMediaQuery.matches);
        } else {
          setTocCollapsed(false);
        }
      }
      const storedTheme = (localStorage.getItem(BLOG_THEME_KEY) || '').toLowerCase();
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = storedTheme === 'light' ? 'light' : (storedTheme === 'dark' ? 'dark' : (prefersDark ? 'dark' : 'light'));
      let activeLink = null;
      let ticking = false;
      function applyTheme(theme) {
        const resolved = theme === 'dark' ? 'dark' : 'light';
        body.setAttribute('data-theme', resolved);
        if (themeToggle) {
          themeToggle.classList.toggle('active', resolved === 'dark');
        }
        if (themeThumb) {
          themeThumb.textContent = resolved === 'dark' ? '🌙' : '☀️';
        }
        localStorage.setItem(BLOG_THEME_KEY, resolved);
      }
      function setActive(link) {
        if (activeLink === link) {
          return;
        }
        if (activeLink) {
          activeLink.classList.remove('post-toc__link--active');
        }
        if (link) {
          link.classList.add('post-toc__link--active');
        }
        activeLink = link;
      }
      function updateActiveHeading() {
        if (!headingEntries.length) {
          return;
        }
        const scrollPosition = window.scrollY + 160;
        let current = headingEntries[0];
        for (const item of headingEntries) {
          if (item.target.offsetTop <= scrollPosition) {
            current = item;
          } else {
            break;
          }
        }
        setActive(current.link);
      }
      function onScroll() {
        if (ticking) {
          return;
        }
        ticking = true;
        window.requestAnimationFrame(() => {
          updateActiveHeading();
          ticking = false;
        });
      }
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeTableOverlay();
        }
      });
      enhanceTables();
      enhanceCodeBlocks();
      initToc();
      applyTheme(initialTheme);
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          applyTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
      }
      if (langBtn) {
        langBtn.textContent = CURRENT_LANG === 'it' ? 'EN' : 'IT';
        if (OTHER_LANG_LINK) {
          langBtn.addEventListener('click', () => {
            localStorage.setItem(BLOG_LANG_KEY, OTHER_LANG);
            window.location.href = OTHER_LANG_LINK;
          });
        } else {
          langBtn.disabled = true;
          langBtn.classList.add('lang-btn--disabled');
        }
      }
      localStorage.setItem(BLOG_LANG_KEY, CURRENT_LANG);
      if (headingEntries.length) {
        headingEntries.sort((a, b) => a.target.offsetTop - b.target.offsetTop);
        updateActiveHeading();
        window.addEventListener('scroll', onScroll, { passive: true });
      }
    })();
  </script>
</body>
</html>`;
}
