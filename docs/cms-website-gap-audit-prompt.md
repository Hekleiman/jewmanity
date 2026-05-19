# Prompt: CMS ↔ Website Gap Audit

Hand this to Claude Code from inside `/Users/hek/jewmanity`. Goal is a fresh, evidence-based map of where the Sanity CMS and the rendered site disagree, as of today (2026-05-18).

There is already a static-analysis audit from 2026-04-20 at `docs/project-audit-2026-04-20.md`. Use it as a starting reference, do not rewrite it. The new doc should focus narrowly on CMS↔site drift and what the gaps actually are right now, not on general project state.

---

## Output

Write a single new file: `docs/cms-website-gap-audit-2026-05-18.md`.

Date stamp it. Lead with a one-paragraph executive summary of the worst gaps (the ones a content editor would hit immediately). Then the sections below.

Do not use em-dashes anywhere in the doc (commas, periods, parens, or rewrites instead).

---

## Sections to produce

### 1. Three-way field reconciliation (per document type)

For every Sanity document type in `sanity/schemas/`, produce a table or compact list with three columns:

- Fields declared in the schema file.
- Fields actually requested by the matching GROQ query in `src/lib/sanity.ts`.
- Fields actually read by the consuming page or component (grep the destructured props and the `cms*` references in `src/pages/**` and `src/components/**`).

Call out three gap classes:

- Schema fields that are queried but never read by any page (dead pull).
- Schema fields that are declared but never queried (dead field).
- Page reads that have no schema or GROQ backing, which means the page is silently falling through to hardcoded fallback content (content editor will be confused when they cannot edit it).

Cover at minimum these doc types: `homepage`, `aboutStory`, `headsUp`, `fightingAntisemitism`, `resources`, `donatePage`, `shopPage`, `volunteerPage`, `contactPage`, `mitzvahProject`, `siteSettings`, `recipe`, `retreat`, `teamMember`, `product`, `testimonial`, `faqItem`, `communityStory`, `recommendedArticle`.

### 2. Orphan queries and orphan doc types

List query functions exported from `src/lib/sanity.ts` that are never imported anywhere in `src/`. (The April audit had `getRecipeBySlug`, `getRetreatBySlug`, `getProductBySlug`, `getCommunityStoryBySlug`. Verify whether that is still true.) Also list any document types in `sanity/schemas/index.ts` that have no consuming page.

### 3. Hardcoded content drift

For every page that fetches from Sanity, look at its `catch` block (or inline default) and report:

- Whether the hardcoded fallback still matches what would be reasonable production content if Sanity returned nothing.
- Whether the fallback content is structurally compatible with the schema (same field names, same shapes) so an editor could in theory port it in.
- Any pages where the hardcoded fallback is materially longer or richer than what is currently in Sanity (the "CMS thinks the page is empty, but the rendered site has lots of content" case).

Specifically check: homepage, about/story, programs/heads-up, community/fighting-antisemitism, resources, donate, shop, get-involved/volunteer, get-involved/contact, get-involved/mitzvah-project.

### 4. Components that bypass the CMS

List components rendered on CMS-driven pages that do not accept CMS props at all (everything they show is hardcoded). For each, note whether that is intentional (decorative, never-changing) or a real gap.

Pay attention to:

- `src/components/home/Newsletter.astro` (Mailchimp config hardcoded).
- `src/components/shop/ProductCard.astro` and `ProductDetail.astro` (Snipcart config).
- `src/components/contact/ContactForm.astro` and `src/components/volunteer/VolunteerForm.astro` (Formspree IDs).
- Anything in `src/components/shared/` that takes only string literals from parent pages.

### 5. Dynamic route coverage

For each `[slug].astro` page, compare the slugs returned by Sanity with the hardcoded fallback slugs in `src/data/` (e.g. `src/data/retreats.ts`). Flag any cases where:

- The site builds slugs from the fallback array even though Sanity has more entries.
- The CMS has a doc the dynamic route does not actually render (slug mismatch, missing in `getStaticPaths`).

Cover: `/programs/[slug]`, `/community/recipes/[slug]`, `/about/community-stories/[slug]`, `/shop/[slug]`.

### 6. Singleton field deadweight

Specifically verify the April audit's call-out that `donatePage.faqContext` and `volunteerPage.faqContext` are declared in the schema but never requested by GROQ. Check the rest of the singletons for the same pattern (a field that looks like it should drive behavior but is in fact ignored).

### 7. Working tree vs HEAD

Run `git status` and `git diff --stat`. List which schema files, GROQ queries, and pages are dirty. For each dirty schema file, note whether the corresponding GROQ query in the dirty `src/lib/sanity.ts` has been updated to match. This is where gaps quietly appear during in-progress work.

### 8. Sanity Studio reality check

In `sanity/schemas/`, scan for fields with `validation: Rule => Rule.required()` and verify the consuming page actually treats them as required (does the fallback work without them? does the page break?). Also flag fields without validation that the page treats as guaranteed (a content editor could publish an empty value and break the page).

### 9. What the content editor actually sees

For the highest-traffic pages (home, donate, programs/heads-up, get-involved/volunteer, get-involved/mitzvah-project), open the seed script under `scripts/seed-*.ts` if it exists and compare what was seeded with what the page currently expects. Note any seeded fields the page no longer reads, and any page reads with no corresponding seed.

### 10. Recommendation list, sorted by editor impact

End the doc with a numbered list of concrete fixes, ordered by "what would most surprise a content editor right now". For each, give the file paths involved and a one-line description of the fix. Do not implement anything, just enumerate.

---

## Method

- Read first, write second. No edits to schemas, queries, pages, or seeds.
- Use `git status` and `git diff` to ground claims about working tree state.
- Use `grep -rn` aggressively. Do not assume from the April audit, verify each claim still holds.
- If a claim from the April audit is now wrong, say so explicitly in the new doc.
- Cite file paths and line numbers wherever a specific field or function is mentioned.
- Do not run `npm run build` or `astro build`. Static analysis only.
- Do not start `sanity dev` or hit the Sanity API. Schema-on-disk is the source of truth for this audit.

## Style

- Plain prose with short tables. No emoji.
- Absolute paths from repo root (`src/lib/sanity.ts:42`), not relative.
- No em-dashes anywhere in the output.
- If a section is genuinely empty (no gaps found), say "No gaps found." rather than padding.

## Time

This is a read-only audit. Budget about 45 minutes. If you run long on section 1, condense sections 5 through 9 to bullet lists.
