import { marked } from 'marked';
import path from 'path';

const DEFAULT_SUMMARY_LENGTH = 260;

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
