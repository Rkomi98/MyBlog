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
  const translated = await translateMarkdown(markdown, { apiKey, endpoint, model, apiVersion });

  await fs.writeFile(englishPath, translated, 'utf8');
  logger.info(`[translate] Saved ${toPosix(path.relative(process.cwd(), englishPath))}`);

  return englishPath;
}

function getGeminiConfig() {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const inferredVersion = /^gemini-2/i.test(model) ? 'v1' : 'v1beta';
  const apiVersion = process.env.GEMINI_API_VERSION || inferredVersion;
  const endpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;
  return { endpoint, model, apiVersion };
}

export async function translateMarkdown(
  markdown,
  { apiKey, endpoint, model, apiVersion, retries = 2 } = {},
) {
  const config = endpoint
    ? { endpoint, model: model ?? 'unknown', apiVersion: apiVersion ?? 'v1beta' }
    : getGeminiConfig();
  const resolvedEndpoint = config.endpoint;

  const prompt = [
    'You are a professional technical translator.',
    'Translate the following Markdown document from Italian to English.',
    'Preserve the original Markdown structure, code blocks, formatting, images, links, and emphasis.',
    'Do not add commentary or explanations. Return only the translated Markdown.',
    '',
    markdown,
  ].join('\n');

  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      const response = await fetch(`${resolvedEndpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
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
        throw new Error('Gemini API did not return any text.');
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
