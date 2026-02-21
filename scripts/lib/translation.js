import fs from 'fs-extra';
import path from 'path';

function toPosix(input) {
  return input.split(path.sep).join('/');
}

function redactKey(key) {
  if (!key || key.length < 8) {
    return '[missing]';
  }
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export async function ensureEnglishTranslation(inputPath, { logger = console } = {}) {
  const itPath = path.resolve(inputPath);
  const dir = path.dirname(itPath);
  const basename = path.basename(itPath, '.md');
  const englishPath = path.join(dir, `${basename}_en.md`);

  const exists = await fs.pathExists(englishPath);
  if (exists) {
    return englishPath;
  }

  if (process.env.SKIP_TRANSLATION?.toLowerCase() === 'true') {
    logger.warn(
      `[translate] Missing English version for ${toPosix(
        path.relative(process.cwd(), itPath),
      )}, but SKIP_TRANSLATION=true so skipping automatic translation.`,
    );
    return null;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      `GOOGLE_API_KEY not found in environment. Cannot translate ${path.basename(itPath)}.`,
    );
  }

  const { endpoint, model, apiVersion } = getGeminiConfig();

  logger.info(
    `[translate] Generating English version for ${path.basename(
      itPath,
    )} using Gemini model ${model} (API ${apiVersion}) (${redactKey(apiKey)})`,
  );

  const markdown = await fs.readFile(itPath, 'utf8');
  const translated = await translateMarkdown(markdown, { apiKey, endpoint, model, apiVersion, logger });

  await fs.writeFile(englishPath, translated, 'utf8');
  logger.info(`[translate] Saved ${toPosix(path.relative(process.cwd(), englishPath))}`);

  return englishPath;
}

function getGeminiConfig() {
  const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
  const inferredVersion = /^gemini-2/i.test(model) ? 'v1' : 'v1beta';
  const apiVersion = process.env.GEMINI_API_VERSION || inferredVersion;
  const endpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;
  return { endpoint, model, apiVersion };
}

const DEFAULT_SAFETY_THRESHOLD = process.env.GEMINI_SAFETY_THRESHOLD || 'BLOCK_ONLY_HIGH';
const ENV_SAFETY_CATEGORIES = process.env.GEMINI_SAFETY_CATEGORIES
  ?.split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);
const DEFAULT_SAFETY_CATEGORIES = [
  'HARM_CATEGORY_DANGEROUS_CONTENT',
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_CIVIC_INTEGRITY',
];

function buildSafetySettings(
  threshold = DEFAULT_SAFETY_THRESHOLD,
  categories = ENV_SAFETY_CATEGORIES ?? DEFAULT_SAFETY_CATEGORIES,
) {
  if (!categories?.length) {
    return null;
  }

  return categories.map((category) => ({
    category,
    threshold,
  }));
}

export async function translateMarkdown(
  markdown,
  { apiKey, endpoint, model, apiVersion, retries = 2, maxChunkChars = 5000, logger = console } = {},
) {
  const chunks = splitMarkdownIntoChunks(markdown, maxChunkChars);
  const translatedChunks = [];

  if (chunks.length > 1) {
    logger?.info(`[translate] Document split into ${chunks.length} chunks for translation`);
  }

  for (let i = 0; i < chunks.length; i += 1) {
    const meta = chunks.length > 1 ? { index: i + 1, total: chunks.length } : null;
    if (chunks.length > 1) {
      logger?.info(`[translate] Processing chunk ${i + 1}/${chunks.length}`);
    }
    // eslint-disable-next-line no-await-in-loop
    const translated = await translateChunk(chunks[i], {
      apiKey,
      endpoint,
      model,
      apiVersion,
      retries,
      meta,
    });
    translatedChunks.push(translated.trim());
  }

  return translatedChunks.join('\n\n');
}

async function translateChunk(
  markdown,
  { apiKey, endpoint, model, apiVersion, retries = 2, meta } = {},
) {
  const config = endpoint
    ? { endpoint, model: model ?? 'unknown', apiVersion: apiVersion ?? 'v1beta' }
    : getGeminiConfig();
  const resolvedEndpoint = config.endpoint;

  const chunkContext = meta
    ? `You are translating part ${meta.index} of ${meta.total} of a longer Markdown document. ` +
      'Keep headings, numbering, references, and tables consistent so the parts can be concatenated.'
    : null;

  const systemPrompt = [
    'You are an expert Italian-to-English technical editor and translator.',
    'Your output must read like natural, idiomatic English written by a human technical writer.',
    'Translate meaning and intent, not Italian word order.',
    'Avoid literal calques and awkward phrasing.',
    'If an Italian sentence is long or heavy, split or restructure it for readability while preserving meaning.',
    'Preserve the author tone: clear, practical, and conversational when appropriate.',
    'Preserve Markdown structure exactly: heading levels, lists, tables, blockquotes, links, images, emphasis, and line breaks where meaningful.',
    'Do not translate code blocks, inline code, commands, file paths, identifiers, URLs, or YAML keys.',
    'Keep technical terminology consistent across chunks.',
    'Keep heading levels and numbering unchanged; use natural English sentence case for headings.',
    'Do not add commentary or explanations. Return only translated Markdown.',
  ].join('\n');

  const prompt = [
    chunkContext,
    'Translate the following Markdown content from Italian to English.',
    '',
    markdown,
  ]
    .filter(Boolean)
    .join('\n');

  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      const safetySettings = buildSafetySettings();
      const response = await fetch(`${resolvedEndpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '8192', 10),
          },
          ...(safetySettings ? { safetySettings } : {}),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        const is404 = response.status === 404;
        if (is404) {
          const payloadText = JSON.stringify(payload, null, 2);
          throw new Error(
            `Gemini API error: ${response.status} ${response.statusText}. ` +
              `The model path "${resolvedEndpoint}" is not available. ` +
              `Set GEMINI_MODEL (current: "${config.model}") ` +
              `and GEMINI_API_VERSION (current: "${config.apiVersion}") ` +
              `to a supported combination.\nResponse body: ${payloadText}`,
          );
        }
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}\n${JSON.stringify(
            payload,
            null,
            2,
          )}`,
        );
      }

      const text =
        payload?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? '')
          .join('')
          .trim() ?? '';

      if (!text) {
        const finishReason = payload?.candidates?.[0]?.finishReason;
        const blockReason = payload?.promptFeedback?.blockReason;
        const safetyHits = payload?.promptFeedback?.safetyRatings
          ?.filter((rating) => rating?.probability && rating?.probability !== 'NEGLIGIBLE')
          ?.map((rating) => `${rating.category}:${rating.probability}`);
        const details = [
          finishReason ? `finishReason=${finishReason}` : null,
          blockReason ? `blockReason=${blockReason}` : null,
          safetyHits?.length ? `safety=${safetyHits.join('|')}` : null,
        ]
          .filter(Boolean)
          .join(', ');
        const suffix = details ? ` (${details})` : '';
        throw new Error(`Gemini API did not return any text${suffix}.`);
      }

      return text;
    } catch (error) {
      lastError = error;
      attempt += 1;
      if (attempt > retries) {
        break;
      }
      const delay = 500 * attempt ** 2;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

function splitMarkdownIntoChunks(text, maxChars = 9000) {
  if (!text || text.length <= maxChars) {
    return [text];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(text.length, start + maxChars);
    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf('\n\n', end);
      if (paragraphBreak > start + maxChars * 0.5) {
        end = paragraphBreak + 1;
      } else {
        const lineBreak = text.lastIndexOf('\n', end);
        if (lineBreak > start + maxChars * 0.5) {
          end = lineBreak;
        }
      }
    }

    if (end <= start) {
      end = Math.min(text.length, start + maxChars);
    }

    const chunk = text.slice(start, end).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    start = end;
  }

  return chunks.length ? chunks : [text];
}
