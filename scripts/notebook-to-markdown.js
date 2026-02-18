import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

function toPosix(input) {
  return input.split(path.sep).join('/');
}

function asText(value) {
  if (Array.isArray(value)) {
    return value.join('');
  }
  if (value == null) {
    return '';
  }
  return String(value);
}

function asBase64(value) {
  return asText(value).replace(/\s+/g, '');
}

function inferCodeLanguage(cell, fallback = 'python') {
  const languageHints = [
    cell?.metadata?.vscode?.languageId,
    cell?.metadata?.language,
    cell?.metadata?.magics_language,
    fallback,
  ];

  for (const hint of languageHints) {
    if (typeof hint === 'string' && hint.trim()) {
      return hint.trim().toLowerCase();
    }
  }

  return 'python';
}

function normaliseFenceLanguage(language) {
  const normalised = (language || '').trim().toLowerCase();
  if (!normalised) {
    return 'text';
  }
  if (normalised === 'py') {
    return 'python';
  }
  return normalised;
}

function collectHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function normaliseHeadingText(text) {
  let value = (text || '').trim();
  value = value.replace(/^(?:parte|part)\s+\d+\s*[:\-–—]\s*/i, '');
  value = value.replace(/^\d+(?:\.\d+)*\s*(?:[.)\-:–—]\s*)?/, '');
  return value.trim();
}

function normaliseMarkdownHeadings(markdown) {
  return markdown
    .split('\n')
    .map((line) => {
      const headingMatch = line.match(/^(\s{0,3}#{1,6}\s+)(.+)$/);
      if (!headingMatch) {
        return line;
      }
      const [, prefix, text] = headingMatch;
      const cleanedText = normaliseHeadingText(text);
      return `${prefix}${cleanedText || text.trim()}`;
    })
    .join('\n');
}

function normaliseCodeCommentLine(line) {
  if (!line) {
    return line;
  }

  if (/^\s*#\s*[=\-_*]{4,}\s*$/.test(line)) {
    return null;
  }

  const hashPrefix = line.match(/^(\s*#\s*)(.*)$/);
  if (!hashPrefix) {
    return line;
  }

  let text = hashPrefix[2].trim();
  text = normaliseHeadingText(text);
  if (!text) {
    return null;
  }

  return `${hashPrefix[1]}${text}`;
}

function normaliseCodeContent(source) {
  const cleaned = asText(source)
    .split('\n')
    .map((line) => normaliseCodeCommentLine(line))
    .filter((line) => line !== null);
  return cleaned.join('\n').replace(/\s+$/, '');
}

function parseJobsFromArgs(args) {
  if (!args.length) {
    return null;
  }

  if (args.length % 2 !== 0) {
    throw new Error('Usage: node scripts/notebook-to-markdown.js <input.ipynb> <output.md> [<input2.ipynb> <output2.md> ...]');
  }

  const jobs = [];
  for (let i = 0; i < args.length; i += 2) {
    jobs.push({ input: args[i], output: args[i + 1] });
  }
  return jobs;
}

async function renderNotebookToMarkdown({
  rootDir,
  input,
  output,
}) {
  const inputAbsolute = path.resolve(rootDir, input);
  const outputAbsolute = path.resolve(rootDir, output);
  const notebook = await fs.readJson(inputAbsolute);
  const cells = Array.isArray(notebook?.cells) ? notebook.cells : [];
  const notebookStem = path.basename(inputAbsolute, '.ipynb');

  const notebookLang = normaliseFenceLanguage(
    notebook?.metadata?.language_info?.name || 'python',
  );

  const imageDir = path.join(rootDir, 'Assets', 'Notebook', 'generated', notebookStem);
  const imageLinkPrefix = `../Assets/Notebook/generated/${notebookStem}`;
  const notebookLink = `../Assets/Notebook/${path.basename(inputAbsolute)}`;

  await fs.ensureDir(path.dirname(outputAbsolute));
  await fs.ensureDir(imageDir);
  await fs.emptyDir(imageDir);

  const blocks = [];
  let imageCounter = 0;

  for (const cell of cells) {
    if (cell?.cell_type === 'markdown') {
      const markdown = normaliseMarkdownHeadings(asText(cell.source)).trim();
      if (markdown) {
        blocks.push(markdown);
      }
      continue;
    }

    if (cell?.cell_type !== 'code') {
      continue;
    }

    const sourceCode = normaliseCodeContent(cell.source);
    if (sourceCode) {
      const language = normaliseFenceLanguage(inferCodeLanguage(cell, notebookLang));
      blocks.push(`\`\`\`${language}\n${sourceCode}\n\`\`\``);
    }

    const outputs = Array.isArray(cell.outputs) ? cell.outputs : [];
    for (const outputEntry of outputs) {
      const outputType = outputEntry?.output_type;

      if (outputType === 'stream') {
        const streamText = asText(outputEntry?.text).replace(/\s+$/, '');
        if (streamText) {
          blocks.push(`\`\`\`text\n${streamText}\n\`\`\``);
        }
        continue;
      }

      if (outputType === 'error') {
        const traceback = asText(outputEntry?.traceback).replace(/\s+$/, '');
        if (traceback) {
          blocks.push(`\`\`\`text\n${traceback}\n\`\`\``);
        }
        continue;
      }

      if (outputType !== 'display_data' && outputType !== 'execute_result') {
        continue;
      }

      const data = outputEntry?.data || {};
      const pngData = data['image/png'];
      if (pngData) {
        imageCounter += 1;
        const imageName = `${notebookStem}-output-${String(imageCounter).padStart(2, '0')}.png`;
        const imageAbsolutePath = path.join(imageDir, imageName);
        const binary = Buffer.from(asBase64(pngData), 'base64');
        await fs.writeFile(imageAbsolutePath, binary);
        blocks.push(`![Notebook output ${imageCounter}](${imageLinkPrefix}/${imageName})`);
      }

      const textData = asText(data['text/plain']).replace(/\s+$/, '');
      if (!pngData && textData) {
        blocks.push(`\`\`\`text\n${textData}\n\`\`\``);
      }
    }
  }

  const firstHeading = collectHeading(blocks.join('\n\n'));
  const fallbackTitle = notebookStem
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const sourceNote = `> Notebook sorgente: [${path.basename(inputAbsolute)}](${notebookLink})`;
  let markdown = '';

  if (firstHeading) {
    blocks.push(sourceNote);
    markdown = `${blocks.join('\n\n')}\n`;
  } else {
    markdown = `# ${fallbackTitle}\n\n${sourceNote}\n\n${blocks.join('\n\n')}\n`;
  }
  await fs.writeFile(outputAbsolute, markdown, 'utf8');

  const summary = {
    input: toPosix(path.relative(rootDir, inputAbsolute)),
    output: toPosix(path.relative(rootDir, outputAbsolute)),
    images: imageCounter,
    title: firstHeading || fallbackTitle,
  };

  return summary;
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '..');

  const defaultJobs = [
    {
      input: 'Assets/Notebook/datavis_masterclass_parte1.ipynb',
      output: 'files/AI Engineering/Datavis Masterclass Parte 1.md',
    },
    {
      input: 'Assets/Notebook/datavis_masterclass_parte2.ipynb',
      output: 'files/AI Engineering/Datavis Masterclass Parte 2.md',
    },
  ];

  const jobs = parseJobsFromArgs(process.argv.slice(2)) || defaultJobs;
  const results = [];

  for (const job of jobs) {
    // eslint-disable-next-line no-await-in-loop
    const result = await renderNotebookToMarkdown({
      rootDir,
      input: job.input,
      output: job.output,
    });
    results.push(result);
  }

  for (const result of results) {
    console.log(`✔️  ${result.input} -> ${result.output} (${result.images} image output)`);
  }
}

main().catch((error) => {
  console.error('Notebook conversion failed:', error);
  process.exitCode = 1;
});
