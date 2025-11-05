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

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog | Mirko Calcaterra</title>
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

  const tocItems = headings
    .filter((heading) => heading.level >= 2 && heading.level <= 4)
    .map(
      (heading) =>
        `<li class="post-toc__item level-${Math.max(0, heading.level - 2)}"><a class="post-toc__link" href="#${
          heading.id
        }">${escapeHtml(heading.text)}</a></li>`,
    )
    .join('');
  const tocHtml = tocItems
    ? `<aside class="post-toc">
        <div class="post-toc__title" data-it="Indice" data-en="Table of contents">${
          language === 'it' ? 'Indice' : 'Table of contents'
        }</div>
        <ul class="post-toc__list">
          ${tocItems}
        </ul>
      </aside>`
    : '';
  const layoutClass = tocHtml ? 'post-layout' : 'post-layout post-layout--single';
  const pageTitle = escapeHtml(langData.title);
  const formattedCategory = escapeHtml(categoryLabel);
  const formattedDateHtml = escapeHtml(formattedDate);
  const iconHtml = escapeHtml(icon);
  const currentYear = new Date().getFullYear();
  const logoPath = joinUrl(relativeRoot, 'Assets', 'Logo.png');

  return `<!DOCTYPE html>
<html lang="${language}" ${language === 'en' ? '' : 'translate="no"'}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
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
      padding: 1.8rem 1.6rem;
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 120px;
      max-height: calc(100vh - 160px);
      overflow-y: auto;
    }
    .post-toc__title {
      text-transform: uppercase;
      font-size: 0.78rem;
      letter-spacing: 0.18em;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 1.2rem;
    }
    .post-toc__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .post-toc__item.level-1 {
      padding-left: 1rem;
    }
    .post-toc__item.level-2 {
      padding-left: 2rem;
    }
    .post-toc__link {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.4;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
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
      background: rgba(15, 23, 42, 0.65);
      color: #f8fafc;
      padding: 0.2rem 0.45rem;
      border-radius: 6px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.9rem;
    }
    body[data-theme="light"] .post-body code {
      background: rgba(15, 23, 42, 0.08);
      color: #111827;
    }
    .post-body pre {
      background: rgba(15, 23, 42, 0.92);
      color: #f8fafc;
      padding: 1.2rem 1.4rem;
      border-radius: 18px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.95rem;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.12);
    }
    body[data-theme="light"] .post-body pre {
      background: #0f172a;
      color: #f8fafc;
    }
    .post-body img {
      max-width: 100%;
      border-radius: 18px;
      margin: 2.2rem 0;
      box-shadow: 0 24px 45px -28px rgba(15, 23, 42, 0.55);
    }
    .post-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.12);
    }
    .post-body tr {
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    }
    .post-body th,
    .post-body td {
      padding: 0.9rem 1rem;
      text-align: left;
    }
    body[data-theme="light"] .post-body table {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.16);
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
    }
  </style>
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
      const tocLinks = Array.from(document.querySelectorAll('.post-toc__link'));
      const headingEntries = tocLinks
        .map((link) => {
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          return target ? { link, target } : null;
        })
        .filter(Boolean);
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
