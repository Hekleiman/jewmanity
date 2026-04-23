# Phase 6: Dead code and orphans

## What I checked

1. Consolidated findings from Phases 1, 4, 5.
2. `ls -la src/lib/` to confirm state of the prior audit's "stale stub" `cms.ts`.
3. `grep -n "^export" src/lib/sanity.ts` — every named export.
4. For each export, `grep -rln` across `src/` (excluding `sanity.ts` itself) to count importers.
5. `grep -rn "TODO\|FIXME\|HACK\|XXX" src/ sanity/schemas/ scripts/ --include="*.ts" --include="*.astro" --include="*.tsx"`.

## Evidence

### `src/lib/` directory
```
src/lib/
  sanity.ts     (10 KB)
```
`src/lib/cms.ts` **no longer exists** (prior audit flagged it as a stale stub; it has been removed since).

### Unused npm dependencies (from Phase 1)
```
astro-portabletext  — declared in package.json, zero imports across src/ and scripts/
```

### Exported GROQ functions with zero importers
```
getRecipeBySlug             (src/lib/sanity.ts:60)   — 0 consumers
getRetreatBySlug            (src/lib/sanity.ts:98)   — 0 consumers
getProductBySlug            (src/lib/sanity.ts:148)  — 0 consumers
getCommunityStoryBySlug     (src/lib/sanity.ts:224)  — 0 consumers
```
All four `…BySlug` exports are dead. Each corresponding dynamic page (`recipes/[slug].astro`, `programs/[slug].astro`, `shop/[slug].astro`, `about/community-stories/[slug].astro`) consumes the list query via `getStaticPaths` and passes the full document as `props`, so the by-slug helper is never needed.

Prior audit flagged 4 dead `…BySlug` exports; **all 4 still dead**.

### Schema fields never queried (dead schema fields)
```
donatePage.faqContext      (sanity/schemas/singletons/donatePage.ts:194)    — hidden field, initialValue 'donate'
volunteerPage.faqContext   (sanity/schemas/singletons/volunteerPage.ts:134) — hidden field, initialValue 'volunteer'
```

### GROQ fields not in schema (projected, returns undefined)
```
getCommunityStories → projects `body` — schema has `paragraphs` (not `body`)
```

### Component files never imported
```
src/components/about/StoriesGrid.astro    — 0 importers (contains a TODO comment about placeholder Sanity images)
```

### TODO / FIXME / HACK / XXX scan
```
src/components/donate/DonateHero.astro:39:
  <!-- TODO(belinda): replace YOUR_ACCOUNT_ID with the real Givebutter account ID once the account is created. -->

src/components/donate/DonateHero.astro:41:
  <!-- TODO(belinda): replace WIDGET_ID with the real Givebutter Form widget ID from the dashboard. -->

src/components/donate/DonateHero.astro:45:
  // TODO(verify-givebutter-url-param): Givebutter docs use `amount` to pre-select a preset donation amount (value must match an existing preset on the campaign). The widget may read window.location.search natively; this script also sets the attribute on the element for defense-in-depth.

src/components/about/StoriesGrid.astro:118:
  <!-- TODO: Replace with real image from Sanity -->

src/pages/community/recipes/[slug].astro:340:
  // TODO: render recipe.gallery (added in Commit 1) — carousel UX decision pending

src/pages/community/recipes.astro:27:
  {/* TODO: Replace with real photo from client */}
```
Zero FIXME, HACK, XXX tags in any project source.

### Other documentation-only drift
- `.env.example` declares `FORMSPREE_ID` — never read anywhere (Phase 1 evidence).
- `package.json` devDependency `@playwright/test` is installed but not imported; `scripts/screenshot.mjs` and `scripts/visual-qa.mjs` import from the bare `playwright` package (transitive dep) instead (Phase 1 evidence).

## Consolidated dead-code list with categorization

| Item | Location | Category | Notes |
|---|---|---|---|
| `astro-portabletext` | `package.json` dep | **Safe to delete** | zero imports; `@portabletext/to-html` is what gets used |
| `FORMSPREE_ID` env-var doc | `.env.example` | **Safe to delete** (or needs review) | safe to delete if forms stay hardcoded; keep + wire through code if a real env-driven form swap is planned |
| `getRecipeBySlug` | `src/lib/sanity.ts:60-77` | **Needs review** | zero consumers; also has bug (missing fields) that's irrelevant because unused |
| `getRetreatBySlug` | `src/lib/sanity.ts:98-115` | **Needs review** | zero consumers |
| `getProductBySlug` | `src/lib/sanity.ts:148-164` | **Needs review** | zero consumers |
| `getCommunityStoryBySlug` | `src/lib/sanity.ts:224-236` | **Needs review** | zero consumers; projection is also out of sync with current schema (omits `paragraphs`, `tag`, `pullQuote`, etc.) |
| `donatePage.faqContext` | `sanity/schemas/singletons/donatePage.ts:194` | **Needs review** | hidden + unused; `donate.astro` hardcodes `getFaqItems('donate')` instead |
| `volunteerPage.faqContext` | `sanity/schemas/singletons/volunteerPage.ts:134` | **Needs review** | same pattern as donatePage |
| `body` in `getCommunityStories` projection | `src/lib/sanity.ts:213` | **Needs review** | always undefined at runtime; consumer uses `paragraphs` |
| `src/components/about/StoriesGrid.astro` | component file | **Needs review** | zero importers; also contains a "Replace with real image from Sanity" TODO, suggesting it was a pre-CMS draft |
| DonateHero TODOs (acct + widget) | `src/components/donate/DonateHero.astro:39,41` | **Actively in progress** | WIP Givebutter migration — blocks production cutover (Phase 2 + Phase 8) |
| DonateHero verify-param TODO | `src/components/donate/DonateHero.astro:45` | **Needs review** | verify against actual Givebutter widget docs |
| `recipe.gallery` render TODO | `src/pages/community/recipes/[slug].astro:340` | **Needs review** | feature not yet implemented; data is being seeded (Commit 1 of recipe work) |
| `recipes.astro:27` placeholder TODO | `src/pages/community/recipes.astro:27` | **Actively in progress** | card-image placeholder comment — relevant now that Sanity images exist |
| `@playwright/test` devDep vs `playwright` import | `package.json` devDeps + `scripts/screenshot.mjs`, `scripts/visual-qa.mjs` | **Needs review** | works transitively but is fragile; pin `playwright` in package.json |

## Findings

- Dead-code footprint has grown slightly since prior audit: 4 `…BySlug` dead exports still present, plus 2 `faqContext` schema fields, plus 1 dead schema-vs-GROQ name mismatch (`body` vs `paragraphs`), plus 1 orphan component (`StoriesGrid.astro`).
- The prior audit's "stale stub" `src/lib/cms.ts` has been **deleted** — one cleanup win since 2026-04-20.
- All TODOs are recent and load-bearing (Givebutter migration, recipe gallery, placeholder images). No stale TODOs from pre-CMS iterations remain except the one in the orphan `StoriesGrid.astro` file.
- No FIXME/HACK/XXX tags anywhere in project source — code hygiene is clean in this dimension.

## Open questions

- Is `StoriesGrid.astro` reserved for a future layout, or can it be deleted outright?
- Is the plan to keep the `…BySlug` GROQ helpers for a future SSR mode, or should they be deleted since the static-build pattern makes them moot?
- For the schema-vs-GROQ mismatches (`body` vs `paragraphs`; `faqContext`): do you want to rename schema fields to match GROQ, delete dead schema fields, or update GROQ to match schema? The answer affects editor UX (adding `body` field would let editors write rich text; deleting `faqContext` removes a confusing hidden field).
