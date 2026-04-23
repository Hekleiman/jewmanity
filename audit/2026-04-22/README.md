# Jewmanity state-of-the-project audit — 2026-04-22

HEAD at audit time: **`fbadfc5`** on `main` (clean working tree, 0 ahead / 0 behind `origin/main`). Prior audit was at `8c94e84` on 2026-04-20; 17 commits have landed since.

## Table of contents

- [00-git-state.md](00-git-state.md) — working-tree, branch, and commit posture since the prior audit.
- [01-dependencies-and-env.md](01-dependencies-and-env.md) — `package.json`, `.env.example`, every env-var read across the repo.
- [02-integrations.md](02-integrations.md) — Givebutter, Snipcart, Formspree, Mailchimp, Sanity, Vercel — state + remaining manual steps.
- [03-hotspot-bug-surface.md](03-hotspot-bug-surface.md) — the hotspot bug — schema, consumers, diagnostic script output, CDN ground-truth check, root cause.
- [04-sanity-schema-reality.md](04-sanity-schema-reality.md) — schema ↔ GROQ ↔ consumer diff for every document type.
- [05-pages-and-components.md](05-pages-and-components.md) — 22 pages, 62 components, nav vs file check.
- [06-dead-code-and-orphans.md](06-dead-code-and-orphans.md) — unused deps, dead exports, orphan components, TODO scan.
- [07-build-and-deploy.md](07-build-and-deploy.md) — dist/ inspection (no rebuild), Vercel + Astro config.
- [08-handoff-blockers.md](08-handoff-blockers.md) — prioritized blocker list for handoff to Belinda.
- [hotspot-diagnostic-output.txt](hotspot-diagnostic-output.txt) — raw stdout from the Phase 3 diagnostic (44 image values, full JSON + URL tokens).
- [scripts/diagnose-hotspots.ts](scripts/diagnose-hotspots.ts) — the read-only diagnostic script used in Phase 3.

## Executive summary — what's the state of the project right now

- **Tech stack is stable and the build is fresh.** Astro 5 + Tailwind 4 static site, Sanity CMS wired through with hardcoded fallbacks on every page, Vercel deploy target. `dist/` was rebuilt 24 seconds before the HEAD commit; working tree is clean with 0 uncommitted changes.
- **CMS wiring is essentially complete.** Every page that should read from Sanity does — 11 singletons, 8 collections, 21 object types, all registered and consumed. Every one of the 22 page routes renders and maps to a static HTML file in `dist/`.
- **Givebutter migration is live in code but still on placeholders.** `Donorbox` is fully purged (Phase 2 — zero references). `Givebutter` is what `src/components/donate/DonateHero.astro` renders, with preconnect wired in `Layout.astro:67`. But `YOUR_ACCOUNT_ID` and `WIDGET_ID` are literal placeholder strings pending Belinda creating the Givebutter account.
- **Snipcart is running on the TEST API key.** Line 94 of `Layout.astro` is explicitly labeled "TEST API key" with a comment saying "Switch to live key before production deployment." Must happen before launch.
- **Forms are hardcoded and coexist.** Contact and Volunteer forms both POST to Formspree form ID `xlgpvpja` (same inbox). Newsletter form posts to Mailchimp list `u=63c97041047a0d6a6e1c61091`. `FORMSPREE_ID` in `.env.example` is documentation debt — it's never actually read.

## Most urgent bug — the `urlForCropped` hotspot bug

- **Root cause**: `src/lib/sanity.ts:30` calls `.crop('focalpoint')` but never calls `.focalPoint(x, y)`. In `@sanity/image-url`, setting `spec.crop = 'focalpoint'` disables the library's built-in `fit()` auto-rect computation (see `node_modules/@sanity/image-url/src/urlForImage.ts:82`). Without `.focalPoint()`, `fp-x` / `fp-y` params are never emitted. The CDN sees `crop=focalpoint` but has no focal-point coords — it falls back to a centered crop.
- **Current impact**: the `/about/team` page displays 4 team photos. 3 have stored hotspots at `y=0.33` (Andrew, Rabbi Avi, Shai) but render centered because the URL is missing `fp-y`. Belinda's hotspot is at `y=0.5` so she is unaffected. CDN ground-truth check confirms byte-level diff when fp params are appended manually (Belinda -21KB, one product +745 B, one retreat -7KB).
- **Fix scope is small**: one function, one file, 1-2 lines of diff. Five other consumer sites (`ImpactStories.astro`, `volunteer.astro`, `past-retreats.astro`, `heads-up.astro`, `community-stories.astro`) use `urlFor(...).width().height()` which DOES trigger the library's auto-rect when a hotspot is present, so they are not currently broken — but are inconsistent with the team page and should migrate to `urlForCropped` once it's fixed.

## What surprised me vs the prior audit (2026-04-20)

- **`src/lib/cms.ts` is gone.** The prior audit flagged it as a stale stub; it has been deleted. One cleanup win.
- **The recipe detail page's "missing fields" bug from the prior audit was fixed in a surprising way.** Instead of extending `getRecipeBySlug`, the detail page sidesteps it entirely — it consumes `getRecipes()` via `getStaticPaths` and passes the full object as `props`. `getRecipeBySlug` is therefore dead code with a stale projection, not a source of runtime bugs. Same pattern applies to `getProductBySlug`, `getRetreatBySlug`, `getCommunityStoryBySlug` — all four `…BySlug` exports are unused.
- **Only 4 documents in production Sanity currently have hotspot metadata set** (the 4 team members). Every other document — products, recipes, retreats, testimonials, community stories, all singleton hero images — has no hotspot set. The schema allows it everywhere (22 image fields all declare `options: { hotspot: true }`), but editors haven't used it yet. So the visible surface of the hotspot bug is narrower than the schema suggests — but every future editor-set hotspot would silently not apply until the bug is fixed.

## Handoff blockers (from Phase 8)

**Blockers** (must-fix before Belinda launch email):
1. Replace `YOUR_ACCOUNT_ID` + `WIDGET_ID` in `DonateHero.astro` with real Givebutter IDs.
2. Create Givebutter campaign + choose fee mode + set presets.
3. Swap Snipcart TEST key for LIVE key in `Layout.astro:94`.
4. Fix the hotspot bug in `urlForCropped`.
5. Decide fix approach + update docstring to match.
6. Point `jewmanity.org` DNS at Vercel with TLS.

**Important** (launch-worthy only with explicit acceptance):
7. Rotate `SANITY_API_TOKEN`.
8. Configure Sanity → Vercel deploy hook.
9. Verify Formspree account ownership + plan.
10. Decide one vs two Formspree form IDs.
11. Verify Mailchimp list ownership.
12. Add Mailchimp to privacy-policy third-party list.
13. Verify Givebutter `?amount=` URL-param pre-select behavior.

**Nice-to-have** (can ship without):
14. Delete unused dep `astro-portabletext`.
15. Delete or wire `FORMSPREE_ID` in `.env.example`.
16. Delete dead `…BySlug` GROQ exports.
17. Resolve `communityStory.body` schema/projection mismatch.
18. Resolve `faqContext` dead schema fields on donatePage + volunteerPage.
19. Delete or restore orphan `StoriesGrid.astro`.
20. Migrate 5 testimonial/story image consumers to `urlForCropped` after fix.
21. Add security headers (CSP, HSTS) to `vercel.json`.
22. Render recipe `gallery` on recipe detail pages.
23. Remove stale "Replace with real photo" TODO on recipes list.
24. Collapse three token-name variants to one.
25. Pin `playwright` explicitly in `package.json`.
