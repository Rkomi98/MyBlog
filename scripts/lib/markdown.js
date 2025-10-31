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

export function markdownToHtml(markdown, { relativeRoot = '.' } = {}) {
  const renderer = new marked.Renderer();
  const originalImage = renderer.image.bind(renderer);
  const originalLink = renderer.link.bind(renderer);

  renderer.image = (href, title, text) => {
    const resolved = resolveRelativeLink(href, relativeRoot);
    return originalImage(resolved, title, text);
  };

  renderer.link = (href, title, text) => {
    const resolved = resolveRelativeLink(href, relativeRoot);
    return originalLink(resolved, title, text);
  };

  return marked.parse(markdown, {
    mangle: false,
    headerIds: true,
    gfm: true,
    renderer,
  });
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
