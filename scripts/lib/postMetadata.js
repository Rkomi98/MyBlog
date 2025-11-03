import path from 'path';
import fs from 'fs-extra';

function toPosix(input) {
  return input.split(path.sep).join('/');
}

function normaliseMetadataPath(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') {
    return null;
  }

  let cleaned = rawPath.trim();
  if (!cleaned) {
    return null;
  }

  cleaned = cleaned.replace(/^[./]+/, '');
  if (cleaned.toLowerCase().startsWith('files/')) {
    cleaned = cleaned.slice('files/'.length);
  }

  return toPosix(cleaned);
}

export async function loadBlogMetadata({ rootDir, logger = console } = {}) {
  const dataDir = path.join(rootDir, 'data');
  const metadataPath = path.join(dataDir, 'blog-posts.json');

  const exists = await fs.pathExists(metadataPath);
  if (!exists) {
    logger.warn?.(
      `[build] Blog metadata not found at ${toPosix(path.relative(rootDir, metadataPath))}. Continuing without additional metadata.`,
    );
    return {
      entries: [],
      bySlug: new Map(),
      byPath: new Map(),
    };
  }

  try {
    const entries = await fs.readJson(metadataPath);
    if (!Array.isArray(entries)) {
      throw new Error('Blog metadata must be an array.');
    }

    const bySlug = new Map();
    const byPath = new Map();

    for (const entry of entries) {
      if (entry?.slug) {
        bySlug.set(entry.slug, entry);
      }

      const paths = entry?.markdownPaths ?? {};
      for (const rawPath of Object.values(paths)) {
        const normalised = normaliseMetadataPath(rawPath);
        if (normalised) {
          byPath.set(normalised, entry);
          byPath.set(`files/${normalised}`, entry);
        }
      }
    }

    return { entries, bySlug, byPath };
  } catch (error) {
    logger.error?.(`[build] Failed to read blog metadata: ${error.message}`);
    throw error;
  }
}

export { normaliseMetadataPath };
