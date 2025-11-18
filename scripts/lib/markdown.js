import { marked } from 'marked';
import path from 'path';
import hljs from 'highlight.js';

const DEFAULT_SUMMARY_LENGTH = 260;
const CODE_LINE_BREAK_REGEX = /(^|\n)[ \t]*<br\s*\/>[ \t]*/gi;
const CODE_ESCAPES_REGEX = /\\([#$])/g;

function toPosix(input) {
  return input.split(path.sep).join('/');
}

function normaliseRelativeRoot(relativeRoot) {
  if (!relativeRoot) {
    return '.';
  }
  return toPosix(relativeRoot);
}

function resolveRelativeLink(href, relativeRoot) {
  if (!href || typeof href !== 'string') {
    return href;
  }

  if (/^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('#')) {
    return href;
  }

  if (href.startsWith('data:')) {
    return href;
  }

  const base = normaliseRelativeRoot(relativeRoot);

  if (href.startsWith('../')) {
    const stripped = href.replace(/^\.\.\//, '');
    return toPosix(path.posix.join(base, stripped));
  }

  if (href.startsWith('./')) {
    const stripped = href.replace(/^\.\//, '');
    return toPosix(path.posix.join(base, stripped));
  }

  if (href.startsWith('/')) {
    const stripped = href.replace(/^\//, '');
    return toPosix(path.posix.join(base, stripped));
  }

  return toPosix(path.posix.join(base, href));
}

function stripHtmlEntities(text) {
  if (text == null) {
    return '';
  }
  return String(text)
    .replace(/<[^>]*>/g, '')
    .trim();
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

function highlightCode(code, language) {
  const normalised = (language || '').trim().toLowerCase();
  if (normalised && hljs.getLanguage(normalised)) {
    const { value } = hljs.highlight(code, { language: normalised });
    return { value, language: normalised };
  }
  const auto = hljs.highlightAuto(code);
  return {
    value: auto.value,
    language: auto.language ?? (normalised || null),
  };
}

function normaliseCodeContent(value) {
  if (!value) {
    return '';
  }
  return String(value)
    .replace(CODE_LINE_BREAK_REGEX, (_, prefix) => `${prefix}\n`)
    .replace(CODE_ESCAPES_REGEX, '$1');
}

function generateSlug(value, registry) {
  const base = stripHtmlEntities(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const candidate = base || `section-${registry.size + 1}`;
  const count = registry.get(candidate) ?? 0;
  registry.set(candidate, count + 1);
  return count > 0 ? `${candidate}-${count}` : candidate;
}

export function markdownToHtml(markdown, { relativeRoot = '.' } = {}) {
  const renderer = new marked.Renderer();
  const originalImage = renderer.image.bind(renderer);
  const originalLink = renderer.link.bind(renderer);
  const originalHeading = renderer.heading.bind(renderer);
  const originalTable = renderer.table ? renderer.table.bind(renderer) : null;
  const headings = [];
  const slugRegistry = new Map();

  renderer.image = function image(token) {
    const resolved = resolveRelativeLink(token?.href, relativeRoot);
    return originalImage.call(this, { ...token, href: resolved });
  };

  renderer.link = function link(token) {
    const resolved = resolveRelativeLink(token?.href, relativeRoot);
    return originalLink.call(this, { ...token, href: resolved });
  };

  renderer.heading = function heading(token) {
    const slug = generateSlug(token?.text ?? '', slugRegistry);
    if (token?.depth >= 2 && token.depth <= 4) {
      headings.push({
        level: token.depth,
        text: stripHtmlEntities(token.text ?? ''),
        id: slug,
      });
    }
    const html = originalHeading.call(this, token);
    return html.replace(/^(<h\d)(>)/, `$1 id="${slug}"$2`);
  };

  renderer.table = function table(header, body) {
    const tableHtml = originalTable
      ? originalTable(header, body)
      : `<table>\n${header ?? ''}${body ?? ''}</table>\n`;
    return `<figure class="table-wrapper" data-enhanced-table><div class="table-wrapper__scroll">${tableHtml}</div></figure>`;
  };
  renderer.code = function codeRenderer(token) {
    const rawCode = typeof token === 'string' ? token : token?.text ?? '';
    const code = normaliseCodeContent(rawCode);
    const info = typeof token === 'string' ? '' : token?.lang ?? '';
    const rawLang = (info || '').match(/\S+/)?.[0] ?? '';
    let highlighted = escapeHtml(code);
    let languageClass = rawLang ? `language-${rawLang.toLowerCase()}` : '';
    try {
      const result = highlightCode(code, rawLang);
      highlighted = result.value;
      if (result.language) {
        languageClass = `language-${result.language}`;
      }
    } catch (error) {
      highlighted = escapeHtml(code);
    }
    const classes = ['hljs', languageClass].filter(Boolean).join(' ');
    return `<pre><code class="${classes}">${highlighted}</code></pre>`;
  };

  const html = marked.parse(markdown, {
    mangle: false,
    gfm: true,
    renderer,
  });

  return { html, headings };
}

export function extractTitle(markdown, fallback = '') {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  return fallback;
}

export function extractSummary(markdown, length = DEFAULT_SUMMARY_LENGTH) {
  const cleaned = markdown
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline code
    .replace(/!\[[^\]]*]\([^)]+\)/g, '') // images
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1') // links -> text
    .replace(/[*_>#`~\-]/g, '') // formatting chars
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= length) {
    return cleaned;
  }

  return `${cleaned.slice(0, length - 1).trimEnd()}…`;
}
