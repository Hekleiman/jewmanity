# Phase 1: Dependencies and env

## What I checked

1. `cat package.json`
2. `cat sanity/package.json`
3. `cat .env.example`
4. `node --version`, `npm --version`
5. `grep` of each `.env.example` var across `src/`, `scripts/`, `sanity/schemas`
6. `grep` of `import.meta.env\.` and `process\.env\.` across `src/`, `scripts/`, `sanity/schemas`
7. Checked `engines` field in both `package.json` files
8. `grep` of each top-level dep to confirm at least one src import
9. `cat src/env.d.ts`
10. `cat sanity/sanity.config.ts`

## Evidence

### `/package.json` (full)
```json
{
  "name": "jewmanity",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "screenshot": "node scripts/screenshot.mjs",
    "visual-qa": "node scripts/visual-qa.mjs",
    "visual-qa:compare": "node scripts/visual-qa.mjs"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.7.1",
    "@portabletext/to-html": "^5.0.2",
    "@sanity/client": "^7.19.0",
    "@sanity/image-url": "^2.0.3",
    "@tailwindcss/vite": "^4",
    "astro": "^5",
    "astro-portabletext": "^0.13.0",
    "gsap": "^3",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "devDependencies": {
    "@playwright/test": "^1.58.2",
    "sharp": "^0.34.5"
  }
}
```

### `/sanity/package.json` (full)
```json
{
  "name": "jewmanity-studio",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "dependencies": {
    "@sanity/icons": "^3.7.4",
    "@sanity/vision": "^3",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "sanity": "^3",
    "styled-components": "^6.3.12"
  },
  "devDependencies": {
    "@sanity/eslint-config-studio": "^4"
  }
}
```

### `/.env.example` (full)
```
PUBLIC_SANITY_PROJECT_ID=9pc3wgri
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_write_token
FORMSPREE_ID=your_form_id
ANTHROPIC_API_KEY=your_api_key
```

### Node / npm
```
node  v20.19.5
npm   10.8.2
```

### `src/env.d.ts`
```ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Grep per `.env.example` var (scope: `src/`, `scripts/`, `sanity/schemas/`)

```
PUBLIC_SANITY_PROJECT_ID
  src/env.d.ts:4          readonly PUBLIC_SANITY_PROJECT_ID: string;
  src/lib/sanity.ts:6     projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri',
  scripts/seed-testimonials.ts:14  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri';

PUBLIC_SANITY_DATASET
  src/env.d.ts:5          readonly PUBLIC_SANITY_DATASET: string;
  src/lib/sanity.ts:7     dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  scripts/seed-testimonials.ts:15  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

SANITY_API_TOKEN
  (read by 15+ seed/patch scripts — see full list below)
  scripts/seed-shop-page.ts, seed-site-settings.ts, seed-volunteer-page.ts, seed-heads-up.ts,
  seed-retreats-from-squarespace.ts, seed-homepage.ts, seed-donate-page.ts,
  seed-resources.ts, seed-contact-page.ts, seed-retreats-and-pullquotes.ts,
  seed-about-story.ts, seed-team-members.ts, seed-team-hotspots.ts,
  seed-fighting-antisemitism.ts, strip-emdashes-recipes.ts, seed-sanity.mjs
  (all either use process.env.SANITY_API_TOKEN or fall back to SANITY_WRITE_TOKEN)

FORMSPREE_ID
  (zero hits across src/, scripts/, sanity/schemas)

ANTHROPIC_API_KEY
  scripts/visual-qa.mjs:13  // Load .env file if it exists (for ANTHROPIC_API_KEY)
  scripts/visual-qa.mjs:57  const apiKey = process.env.ANTHROPIC_API_KEY;
  scripts/visual-qa.mjs:59  console.log('… ANTHROPIC_API_KEY not set — skipping vision analysis.');
```

### `import.meta.env` reads (project only)
```
src/lib/sanity.ts:6   projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri',
src/lib/sanity.ts:7   dataset:   import.meta.env.PUBLIC_SANITY_DATASET   || 'production',
```
No other `import.meta.env.*` reads anywhere in `src/`.

### `process.env` reads (project only, deduped to unique var names)
```
SANITY_API_TOKEN           many seed scripts
SANITY_WRITE_TOKEN         many seed scripts (fallback of SANITY_API_TOKEN)
SANITY_TOKEN               scripts/migrate-products.mjs:8  token: process.env.SANITY_TOKEN,
PUBLIC_SANITY_PROJECT_ID   scripts/seed-testimonials.ts:14
PUBLIC_SANITY_DATASET      scripts/seed-testimonials.ts:15
ANTHROPIC_API_KEY          scripts/visual-qa.mjs:57
```
Scripts that use the bare `SANITY_WRITE_TOKEN` (no `SANITY_API_TOKEN` fallback):
```
scripts/seed-articles.ts:10
scripts/seed-community-stories.ts:10
scripts/cleanup-community-stories.ts:10
scripts/seed-mitzvah-page.ts:10
scripts/cleanup-testimonials.ts:10
scripts/patch-mitzvah-content.ts:15
scripts/seed-mitzvah-faq.ts:10
scripts/replace-community-stories.ts:12
scripts/seed-testimonials.ts:16
```

### Engines field
`engines` is **absent** from both `package.json` and `sanity/package.json`.

### Per-dep src/ import check

| Dep | Imported in src? | Where |
|-----|------|-------|
| `@astrojs/sitemap` | yes | `astro.config.mjs:5` |
| `@portabletext/to-html` | yes | donate.astro, volunteer.astro, mitzvah-project.astro, community/recipes/[slug].astro |
| `@sanity/client` | yes | `src/lib/sanity.ts:1` |
| `@sanity/image-url` | yes | `src/lib/sanity.ts:2-3`, ImpactStories.astro, community-stories.astro, community-stories/[slug].astro |
| `@tailwindcss/vite` | yes | `astro.config.mjs:3` |
| `astro` | yes | implicit — Astro runtime |
| `astro-portabletext` | **zero hits in `src/` or `scripts/`** |
| `gsap` | yes | `src/scripts/animations.ts` (20+ references) |
| `tailwindcss` | yes (via CSS import) | `src/styles/global.css:1  @import "tailwindcss";` |
| `typescript` | yes | implicit |
| `@playwright/test` (devDep) | **not imported**; `scripts/screenshot.mjs` + `scripts/visual-qa.mjs` import `playwright` (the runtime package) directly — which is not listed in `package.json` |
| `sharp` (devDep) | **zero hits** in src/ or scripts/ — likely pulled in transitively by `astro`'s image service at build time |

### `sanity/sanity.config.ts` (relevant lines)
```ts
projectId: '9pc3wgri',
dataset: 'production',
```
Hardcoded. Does not read `.env`. Studio uses no env vars.

## Findings

- **Env var mismatches between `.env.example` and code**:
  - `.env.example` documents `FORMSPREE_ID` — **zero code references** anywhere in the repo. Either dead documentation or a placeholder for planned contact-form work that never landed.
  - `.env.example` documents `SANITY_API_TOKEN` but code *also* accepts `SANITY_WRITE_TOKEN` as a fallback in most seed scripts; `SANITY_WRITE_TOKEN` is **not documented**. Some scripts (seed-articles, seed-community-stories, cleanup-community-stories, seed-mitzvah-page, seed-mitzvah-faq, cleanup-testimonials, patch-mitzvah-content, replace-community-stories, seed-testimonials) accept **only** `SANITY_WRITE_TOKEN`, not `SANITY_API_TOKEN`.
  - `scripts/migrate-products.mjs:8` reads a third name, `SANITY_TOKEN`, which is documented nowhere.
  - `ANTHROPIC_API_KEY` is used only by `scripts/visual-qa.mjs`; it is not needed at runtime or build time.
  - `src/env.d.ts` only declares `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`; all other env vars are only read by build-time scripts outside of Astro.
- **Installed deps with zero `src/` imports**: `astro-portabletext` (prior audit flagged this; **confirmed unused**). All other top-level deps are used in `src/`, `astro.config.mjs`, or `src/styles/global.css`.
- **Hidden dependency**: `scripts/screenshot.mjs` and `scripts/visual-qa.mjs` both `import { chromium } from 'playwright'`. Only `@playwright/test` is declared in `package.json` — the bare `playwright` package is not. It works only if `playwright` is present transitively.
- **`sharp`** (devDep) has no direct references in src/ or scripts/; Astro's built-in image service consumes it transitively at build time.
- **No `engines` field** in either `package.json`, so Node version isn't pinned; current dev uses Node 20.19.5.
- **No runtime env reads** beyond Sanity project/dataset. Astro site has only two env vars that matter for the deployed build: `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`. Both have hardcoded fallbacks to `9pc3wgri` / `production`.
- **Studio hardcodes project ID + dataset** in `sanity/sanity.config.ts` rather than reading env.

## Open questions

- Is `astro-portabletext` kept on purpose for future use, or is it safe to remove?
- Was `FORMSPREE_ID` planned for the contact form that never got wired? (Contact form integration is covered in Phase 2.)
- Should the three token names (`SANITY_API_TOKEN`, `SANITY_WRITE_TOKEN`, `SANITY_TOKEN`) be collapsed to a single canonical name in `.env.example` and scripts, or kept as historical compatibility?
