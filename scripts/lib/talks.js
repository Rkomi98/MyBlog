import path from 'path';
import fs from 'fs-extra';
import {
  INDEX_PAGE_CSS,
  escapeHtml,
  joinUrl,
  renderSiteFooter,
} from './templates.js';

const BASE_URL = 'https://rkomi98.github.io/MyBlog';

/**
 * Legge `data/talks.json` e tiene solo le voci il cui deck esiste in `talks/<slug>/index.html`.
 * Le voci senza deck vengono segnalate e saltate, così il build non produce link rotti.
 */
export async function loadTalks({ rootDir, logger = console } = {}) {
  const metadataPath = path.join(rootDir, 'data', 'talks.json');
  if (!(await fs.pathExists(metadataPath))) {
    return [];
  }

  const entries = await fs.readJson(metadataPath);
  const talks = [];
  for (const entry of entries) {
    if (!entry?.slug) continue;
    const deckEntry = path.join(rootDir, 'talks', entry.slug, 'index.html');
    if (!(await fs.pathExists(deckEntry))) {
      logger.warn?.(`[talks] "${entry.slug}": deck non trovato in talks/${entry.slug}/, voce saltata.`);
      continue;
    }
    if (entry.draft) continue;
    talks.push(entry);
  }

  talks.sort((a, b) => new Date(b.date) - new Date(a.date));
  return talks;
}

function pair(value, fallback = '') {
  const it = value?.it ?? value?.en ?? fallback;
  const en = value?.en ?? value?.it ?? fallback;
  return { it, en };
}

function i18n(value) {
  const { it, en } = pair(value);
  return `data-it="${escapeHtml(it)}" data-en="${escapeHtml(en)}"`;
}

function renderTalkItem(talk, deckHref) {
  const title = pair(talk.titles);
  const summary = pair(talk.summaries);
  const event = pair(talk.event);
  const venue = pair(talk.venue);
  const type = pair(talk.type);
  const metaParts = [
    `<span><time datetime="${escapeHtml(talk.date)}" data-date="${escapeHtml(talk.date)}">${escapeHtml(talk.date)}</time></span>`,
    event.it ? `<span ${i18n(talk.event)}>${escapeHtml(event.it)}</span>` : '',
    venue.it ? `<span ${i18n(talk.venue)}>${escapeHtml(venue.it)}</span>` : '',
    talk.slides ? `<span>${Number(talk.slides)} slide</span>` : '',
    type.it ? `<span class="post-item__category" ${i18n(talk.type)}>${escapeHtml(type.it)}</span>` : '',
  ].filter(Boolean);

  return `<li class="post-item">
        <h2 class="post-item__title"><a href="${deckHref}" ${i18n(talk.titles)}>${escapeHtml(title.it)}</a></h2>
        <p class="post-item__summary" ${i18n(talk.summaries)}>${escapeHtml(summary.it)}</p>
        <p class="post-item__meta">${metaParts.join('')}</p>
        <p class="talk-item__links">
          <a href="${deckHref}" data-it="Apri le slide →" data-en="Open the slides →">Apri le slide →</a>
        </p>
      </li>`;
}

export function renderTalksIndex({ talks, relativeRoot }) {
  const logoPath = joinUrl(relativeRoot, 'Assets', 'Logo.png');
  const logoWebpPath = joinUrl(relativeRoot, 'Assets', 'Logo.webp');
  const homeLink = joinUrl(relativeRoot, 'index.html');
  const blogLink = joinUrl(relativeRoot, 'blog', 'index.html');
  const canonicalUrl = `${BASE_URL}/talks/index.html`;
  const currentYear = new Date().getFullYear();

  const items = talks.map((talk) => renderTalkItem(talk, `./${talk.slug}/`)).join('\n      ');

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Interventi | Mirko Calcaterra</title>
  <meta name="description" content="Slide e materiali dei miei interventi, lezioni e talk su AI, dati e sviluppo software.">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-9EVQ8G9W48"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9EVQ8G9W48');
  </script>

  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="Interventi | Mirko Calcaterra">
  <meta property="og:description" content="Slide e materiali dei miei interventi, lezioni e talk.">
  <meta property="og:image" content="${BASE_URL}/Assets/Logo.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${INDEX_PAGE_CSS}</style>
</head>
<body data-theme="dark">
  <header class="site-header">
    <div class="site-header__inner">
      <a class="logo" href="${homeLink}">
        <picture>
          <source srcset="${logoWebpPath}" type="image/webp">
          <source srcset="${logoPath}" type="image/png">
          <img src="${logoPath}" alt="" class="logo-img" width="36" height="36">
        </picture>
        <span class="logo-text">Mirko Calcaterra</span>
      </a>
      <nav class="site-nav" aria-label="Sezioni">
        <a href="${blogLink}" data-it="Blog" data-en="Blog">Blog</a>
        <a href="./index.html" aria-current="page" data-it="Interventi" data-en="Talks">Interventi</a>
      </nav>
      <div class="header-controls">
        <button class="lang-btn" type="button">EN</button>
        <button class="theme-toggle" type="button" aria-label="Cambia tema" title="Cambia tema">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
      </div>
    </div>
  </header>
  <main class="page">
    <section class="hero">
      <h1 data-it="I miei interventi" data-en="My talks">I miei interventi</h1>
      <p data-it="Lezioni, workshop e talk che ho tenuto. Le slide sono navigabili direttamente dal browser."
         data-en="Lessons, workshops and talks I have given. The slides can be browsed right in the browser.">
         Lezioni, workshop e talk che ho tenuto. Le slide sono navigabili direttamente dal browser.
      </p>
    </section>
    <section aria-live="polite">
      <ol class="post-list">
      ${items}
      </ol>
    </section>
  </main>
  ${renderSiteFooter({ currentYear })}
  <script>
    (function() {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const read = (key) => { try { return (localStorage.getItem(key) || '').toLowerCase(); } catch (e) { return ''; } };
      const write = (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} };
      const storedTheme = read('blogTheme');
      const storedLang = read('blogLang');
      const browserLang = ((navigator.language || 'it').slice(0, 2)).toLowerCase();
      const state = {
        lang: storedLang === 'en' || storedLang === 'it' ? storedLang : (browserLang === 'it' ? 'it' : 'en'),
        theme: storedTheme === 'light' ? 'light' : (storedTheme === 'dark' ? 'dark' : (prefersDark ? 'dark' : 'light'))
      };
      const langBtn = document.querySelector('.lang-btn');
      const themeToggle = document.querySelector('.theme-toggle');

      function applyTheme(theme) {
        state.theme = theme === 'dark' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', state.theme);
        write('blogTheme', state.theme);
      }
      function applyLanguage(lang) {
        state.lang = lang === 'en' ? 'en' : 'it';
        document.documentElement.setAttribute('lang', state.lang);
        write('blogLang', state.lang);
        document.querySelectorAll('[data-it][data-en]').forEach((node) => {
          node.textContent = node.getAttribute(state.lang === 'it' ? 'data-it' : 'data-en');
        });
        const locale = state.lang === 'it' ? 'it-IT' : 'en-US';
        const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
        document.querySelectorAll('time[data-date]').forEach((node) => {
          const date = new Date(node.getAttribute('data-date') + 'T12:00:00');
          if (!Number.isNaN(date.valueOf())) node.textContent = formatter.format(date);
        });
        langBtn.textContent = state.lang === 'it' ? 'EN' : 'IT';
        langBtn.setAttribute('aria-label', state.lang === 'it' ? 'Read in English' : 'Leggi in italiano');
        const themeLabel = state.lang === 'it' ? 'Cambia tema' : 'Toggle theme';
        themeToggle.setAttribute('aria-label', themeLabel);
        themeToggle.setAttribute('title', themeLabel);
      }

      langBtn.addEventListener('click', () => applyLanguage(state.lang === 'it' ? 'en' : 'it'));
      themeToggle.addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
      applyTheme(state.theme);
      applyLanguage(state.lang);
    })();
  </script>
</body>
</html>`;
}
