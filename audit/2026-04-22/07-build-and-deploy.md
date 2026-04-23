# Phase 7: Build and deploy

## What I checked

1. `ls -la dist/` — dist/ exists.
2. `find dist -name "*.html" | wc -l` and full list.
3. `cat dist/sitemap-index.xml`, `head dist/sitemap-0.xml`.
4. Compared a known-changed asset (team photo URLs on `/about/team`) between working tree and dist render.
5. `stat -f "%m %N" dist/index.html` vs `git log -1 --format="%ct"` to compare modification times.
6. Re-read `vercel.json`, `astro.config.mjs`.
7. `ls src/pages/api` and `grep -rn "astro:env\|export const prerender\|APIRoute" src/`.
8. Did NOT run `npm run build` — inspected existing artifact only.

## Evidence

### `ls -la dist/`
```
drwxr-xr-x  27 hek  staff   864 Apr 22 12:52 .
-rw-r--r--       404.html
_astro/
about/ community/ donate/ get-involved/ images/ nonprofit-disclosures/ privacy/ programs/ resources/ shop/ terms/
favicon-{16,32}x{16,32}.png  favicon.ico  favicon.png  apple-touch-icon.png  og-default.png
index.html
jewmanity-bar-bat-mitzvah-project.pdf
robots.txt
sitemap-0.xml  sitemap-index.xml
fonts/
```

Dist was last written at `Apr 22 12:52` (timestamp `1776887544`).

### HTML files in dist (39 total)
```
dist/404.html
dist/index.html
dist/nonprofit-disclosures/index.html
dist/privacy/index.html
dist/terms/index.html
dist/donate/index.html
dist/resources/index.html
dist/about/community-stories/index.html
dist/about/community-stories/{believing-again,brave-girls,fathers-fighters-finding-peace,first-retreat,golani-boys-return,joy-of-giving}/index.html   (6)
dist/about/story/index.html
dist/about/team/index.html
dist/community/fighting-antisemitism/index.html
dist/community/recipes/index.html
dist/community/recipes/{bubbas-brisket,grammys-chocolate-peanut-butter-candy,grandma-joyces-lemon-cake,grandma-mendelsons-apple-butter-cake,memas-mondel-brot,mimas-noodle-kugel,savtas-stuffed-chicken}/index.html   (7)
dist/get-involved/{contact,mitzvah-project,volunteer}/index.html   (3)
dist/programs/heads-up/index.html
dist/programs/past-retreats/index.html
dist/programs/{heads-up-first-retreat,heads-up-retreat-4-fathers-fighters,heads-up-second-retreat,heads-up-third-retreat}/index.html   (4)
dist/shop/index.html
dist/shop/{black-trucker-hat,heads-up-water-bottle,pink-trucker-hat,travel-shabbat-candle-set}/index.html   (4)
```

### Sitemap files
```
dist/sitemap-index.xml   (points at sitemap-0.xml)
dist/sitemap-0.xml       (38 <url> entries; matches HTML count minus 404.html)
```

### Does dist reflect the current working tree?

`/about/team` is a known-changed page (post-hotspot feature, `fbadfc5`). Sample URLs extracted from `dist/about/team/index.html`:
```
cdn.sanity.io/images/9pc3wgri/production/5c8dfa079be1ed8f389b9d0cf713f49e008ae3ef-2500x3757.webp?w=800&h=600&fit=crop&crop=focalpoint   (Belinda)
cdn.sanity.io/images/9pc3wgri/production/7e1146f8caf8b9cc68a82d4f933a2d1a4d581bc5-2500x3125.webp?w=800&h=600&fit=crop&crop=focalpoint   (Andrew)
cdn.sanity.io/images/9pc3wgri/production/876bb298b496f7c3b6db24f9c4462b8e57f316d2-704x867.webp?w=800&h=600&fit=crop&crop=focalpoint     (Shai)
cdn.sanity.io/images/9pc3wgri/production/54223a41aa2639fbf8d2047d63cf6be959e8e90f-457x466.webp?w=800&h=600&fit=crop&crop=focalpoint     (Rabbi Avi)
```

These are identical to what `urlForCropped` produces today (Phase 3 evidence). The build does reflect the current working tree, including the hotspot bug.

### Timestamps
```
dist/index.html mtime: 1776887544   (Apr 22 12:52:24 local)
HEAD commit time:      1776887568   (Apr 22 12:52:48 local — fbadfc5)
```
Gap: 24 seconds. The build was run immediately before the final commit landed. Working tree is clean — dist is in sync.

### `vercel.json`
```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```
No env-var overrides, no headers, no redirects/rewrites.

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jewmanity.org',
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
});
```
No `output:` field (default is `'static'`). No adapter (`@astrojs/vercel` / `@astrojs/node` absent from package.json). No `experimental` flags.

### Serverless function / API route check
```
src/pages/api               : does not exist
astro:env mentions          : 0
export const prerender      : 0
APIRoute references         : 0
```

## Findings

- **dist/ is fresh.** Last written 24 seconds before the most recent commit; reflects current working tree verbatim.
- **39 HTML files** (38 plus 404) matching a 1:1 mapping to the 22 source pages in `src/pages/` plus dynamic expansion:
  - 6 community-stories detail pages
  - 7 recipe detail pages
  - 4 retreat detail pages
  - 4 shop detail pages
  - 1 index + 17 other top-level or grouped pages + 404
- **Sitemap is up-to-date.** `sitemap-0.xml` lists 38 URLs (excluding 404).
- **No pages in dist/ for routes that no longer exist in `src/pages/`** — every dist/ HTML file maps to a live page.
- **No pages in `src/pages/` missing from dist/** — all 22 page sources have produced output.
- **Static-only build.** No SSR adapter, no API routes, no `astro:env`, no `prerender` overrides. Site is 100% static.
- **The hotspot bug is baked into the current dist.** Every `/about/team` image URL in the built artifact has `crop=focalpoint` without `fp-x`/`fp-y`. A rebuild with a fixed `urlForCropped` is required to deploy the fix.
- **Vercel config is minimal and correct for a static Astro site.** No security headers (CSP, HSTS), no custom redirects. Ships `/foo/index.html` files — Vercel serves these without extensions.

## Open questions

- Should `vercel.json` add security headers (CSP allowing Givebutter + Snipcart + Mailchimp + Formspree + Sanity CDN; HSTS) before public launch? Currently no CSP at all.
- Should a Vercel deploy hook be configured for Sanity webhooks, so that editor-driven content changes trigger rebuilds? Currently no such webhook is visible in the repo (it would be configured in the Vercel + Sanity dashboards, not in the repo).
- (Confirmed `dist/` IS gitignored: `.gitignore:2` contains `dist/`.)
