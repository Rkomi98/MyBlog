# MyBlog

Static site generator that converts the markdown files in `files/` into a blog ready for GitHub Pages.  
The generator keeps the existing landing page (`index.html`) as the home page and publishes a blog
index plus per-language article pages under `blog/`.

## Prerequisites

- Node.js 18 or newer (Node 18+ provides the native `fetch` API used for translations).
- A `.env` file with `GOOGLE_API_KEY` pointing to a Gemini Flash API key (already provided).  
  Optional overrides:
  - `GEMINI_MODEL` (default `gemini-2.0-flash`)
  - `GEMINI_API_VERSION` (default `v1` when the model starts with `gemini-2`, otherwise `v1beta`)

## Install

```bash
npm install
```

## Commands

- `npm run build` – generate the static site into `dist/`. The script copies `index.html`, assets and PDFs,
  creates the blog listing, and emits one page per article per available language.
- `npm run translate` – scan every Italian markdown file and create a matching `_en.md` file if it is missing.
  Translations are made via Gemini Flash and saved under `files/`.
- `npm run deploy` – run the build and publish the contents of `dist/` to the `gh-pages` branch using the
  `gh-pages` package.
- `npm run clean` – remove `dist/`.

## Automatic translation

During `npm run build` the generator checks Italian sources for a missing English counterpart:

- If `SKIP_TRANSLATION=true` is set in the environment, the build skips the API call and keeps only the
  languages already available on disk.  
- Otherwise it calls Gemini Flash once, persists the translated markdown as `*_en.md`, and uses it for the
  English blog section.

Translations are cached as regular files, so subsequent builds do not hit the API again unless the English
file is removed.

## GitHub Pages

After running `npm run build` locally, the generated site lives in `dist/`.  
Run `npm run deploy` to push the folder to the `gh-pages` branch. Configure the GitHub Pages settings to
serve from that branch (root) to make the site public.
