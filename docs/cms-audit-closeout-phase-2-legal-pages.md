# Prompt: CMS Audit Closeout, Phase 2 — Legal Pages and 404

Hand this to Claude Code from inside `/Users/hek/jewmanity` for a fresh session. Reference: `docs/cms-completeness-audit-2026-05-20.md`. Closes audit sections 1.19 (404), 1.20 (Privacy), 1.21 (Terms), and 1.22 (Nonprofit Disclosures). All four pages currently ship 100% hardcoded with no schema surface area.

Estimate: 60 to 90 minutes. Smaller than phase 1 but four singletons, each with PortableText bodies, plus the cross-document reference from disclosures into `donatePage.costBreakdown`.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead.

The repo's `.env` contains a working `SANITY_API_TOKEN` for seed scripts.

PR flow per saved memory: `gh pr create` then `gh pr merge --auto --squash --delete-branch`.

**Depends on Phase 1.** The `pageMetaOverride` object type from Phase 1 (`sanity/schemas/objects/pageMetaOverride.ts`) is embedded on every new singleton in this phase. Do not start Phase 2 until Phase 1 has merged.

Keep the existing audit pattern: every page reads from CMS first, falls back to hardcoded content if Sanity returns null. The hardcoded fallbacks stay in this phase. Phase 4 may revisit removing them.

---

## Pre-flight

```
cd /Users/hek/jewmanity
git fetch origin
git status
git pull --ff-only
```

Confirm `sanity/schemas/objects/pageMetaOverride.ts` exists. If not, Phase 1 has not landed yet; stop and tell the user.

```
git checkout -b feat/cms-legal-pages-and-404
```

---

## Piece 1: `notFoundPage` singleton

Smallest of the four; do this first to lock in the pattern.

Create `sanity/schemas/singletons/notFoundPage.ts`:

```ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'notFoundPage',
  title: '404 Page',
  type: 'document',
  description: 'Content shown to visitors who land on a URL that does not exist.',
  fields: [
    defineField({
      name: 'meta',
      title: 'Page Meta (SEO)',
      type: 'pageMetaOverride',
      description:
        'Overrides for the browser tab title, meta description, and social share image on the 404 page.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading (e.g., "Page Not Found").',
      initialValue: 'Page Not Found',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 3,
      description:
        'Short reassuring message under the heading. 1 to 2 sentences. Default: "The page you are looking for does not exist or has been moved. Let us get you back on track."',
    }),
    defineField({
      name: 'buttons',
      title: 'Action Buttons',
      type: 'array',
      description: 'Up to 3 action buttons shown below the body. First is the primary (filled), the others are outlined.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Button Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Button URL',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
      validation: (rule) => rule.max(3).warning('3 buttons maximum fit on one row.'),
    }),
  ],
  preview: { prepare() { return { title: '404 Page' }; } },
});
```

Register it in `sanity/schemas/index.ts` (import + push to `schemaTypes` + add to `singletonTypes` Set).

Add GROQ helper to `src/lib/sanity.ts` (place with the other singleton helpers):

```ts
export async function getNotFoundPage() {
  return client.fetch(`
    *[_type == "notFoundPage"][0] {
      meta,
      heading,
      body,
      buttons[]{ label, href }
    }
  `);
}
```

Rewrite `src/pages/404.astro` to consume it. Current file is 38 lines; new version:

```astro
---
import Layout from '../layouts/Layout.astro';
import { getNotFoundPage, urlFor } from '../lib/sanity';

let cms: Record<string, any> | null = null;
try {
  cms = await getNotFoundPage();
} catch (e) {
  console.warn('Sanity fetch failed for notFoundPage, using hardcoded fallback');
}

const heading = cms?.heading || 'Page Not Found';
const body =
  cms?.body
    || "The page you're looking for doesn't exist or has been moved. Let's get you back on track.";

const fallbackButtons = [
  { label: 'Go Home', href: '/' },
  { label: 'Browse Programs', href: '/programs/heads-up' },
  { label: 'Get in Touch', href: '/get-involved/contact' },
];
const buttons = (cms?.buttons && cms.buttons.length > 0) ? cms.buttons : fallbackButtons;

const metaTitle = cms?.meta?.title;
const metaDescription = cms?.meta?.description;
const metaOgImage = cms?.meta?.ogImage ? urlFor(cms.meta.ogImage).width(1200).height(630).url() : undefined;
---
<Layout title={metaTitle || 'Page Not Found | Jewmanity'} description={metaDescription || "The page you're looking for doesn't exist or has been moved."} ogImage={metaOgImage}>
  <section class="flex min-h-[70vh] items-center justify-center px-6 pt-24 pb-16">
    <div class="mx-auto max-w-[480px] text-center">
      <img src="/images/logo.png" alt="" class="mx-auto mb-8 h-16 w-auto opacity-40" width="150" height="100" aria-hidden="true" />
      <h1 class="font-heading text-[clamp(32px,5vw,48px)] font-medium leading-tight text-text-heading">
        {heading}
      </h1>
      <p class="mx-auto mt-4 max-w-[400px] font-body text-base leading-relaxed text-text-body">
        {body}
      </p>
      <div class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {buttons.map((btn: { label: string; href: string }, i: number) => (
          <a
            href={btn.href}
            class:list={[
              'inline-block rounded-[100px] px-8 py-3 font-heading text-sm font-medium transition-colors',
              i === 0
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'border border-[#DADADA] bg-white text-text-heading hover:border-primary hover:text-primary',
            ]}
          >
            {btn.label}
          </a>
        ))}
      </div>
    </div>
  </section>
</Layout>
```

---

## Piece 2: `privacyPage` singleton

Create `sanity/schemas/singletons/privacyPage.ts`:

```ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'privacyPage',
  title: 'Privacy Policy Page',
  type: 'document',
  description:
    'The full Privacy Policy page. Legal counsel may want to update this content. The hero strip and section formatting are styled in code; everything below the hero is editable here.',
  fields: [
    defineField({
      name: 'meta',
      title: 'Page Meta (SEO)',
      type: 'pageMetaOverride',
    }),
    defineField({
      name: 'heading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Page H1. Default: "Privacy Policy".',
      initialValue: 'Privacy Policy',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description:
        'Date this policy was last reviewed. Displayed under the heading as "Last updated: Month YYYY". Update whenever you revise the body.',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'body',
      title: 'Policy Body',
      type: 'portableText',
      description:
        'The body of the Privacy Policy. Use Heading 2 for section titles, Normal for paragraphs, and Bullet list for itemized lists. Bold and Italic available as marks. Add links via the link decorator.',
    }),
  ],
  preview: { prepare() { return { title: 'Privacy Policy Page' }; } },
});
```

Register in `sanity/schemas/index.ts`.

GROQ helper in `src/lib/sanity.ts`:

```ts
export async function getPrivacyPage() {
  return client.fetch(`
    *[_type == "privacyPage"][0] {
      meta,
      heading,
      lastUpdated,
      body
    }
  `);
}
```

Rewrite `src/pages/privacy.astro`. The current file is 155 lines; keep the `<style>` block exactly as-is (the `.prose-legal` selectors apply to PortableText output). New page frontmatter and body:

```astro
---
import Layout from '../layouts/Layout.astro';
import { getPrivacyPage, urlFor } from '../lib/sanity';
import { PortableText } from 'astro-portabletext';

let cms: Record<string, any> | null = null;
try {
  cms = await getPrivacyPage();
} catch (e) {
  console.warn('Sanity fetch failed for privacyPage, using hardcoded fallback');
}

const heading = cms?.heading || 'Privacy Policy';
const lastUpdatedRaw = cms?.lastUpdated;
const lastUpdated = lastUpdatedRaw
  ? new Date(lastUpdatedRaw).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  : 'March 2026';

const metaTitle = cms?.meta?.title;
const metaDescription = cms?.meta?.description;
const metaOgImage = cms?.meta?.ogImage ? urlFor(cms.meta.ogImage).width(1200).height(630).url() : undefined;
---
<Layout
  title={metaTitle || 'Privacy Policy | Jewmanity'}
  description={metaDescription || 'How Jewmanity collects, uses, and protects your personal information.'}
  ogImage={metaOgImage}
>
  <section id="privacy-hero" class="bg-primary-light py-20 pt-32 md:py-24 md:pt-36">
    <div class="mx-auto max-w-[800px] px-6 text-center">
      <h1 class="font-heading text-[clamp(32px,5vw,48px)] font-medium leading-tight text-text-heading">
        {heading}
      </h1>
      <p class="mt-3 font-heading text-lg text-text-muted">Last updated: {lastUpdated}</p>
    </div>
  </section>

  <section id="privacy-content" class="py-16 md:py-20">
    <div class="prose-legal mx-auto max-w-[800px] px-6">
      {cms?.body ? (
        <PortableText value={cms.body} />
      ) : (
        <FallbackPrivacyBody />
      )}
    </div>
  </section>
</Layout>

<!-- keep existing <style> block exactly as-is -->
```

Note: `astro-portabletext` may not yet be a dependency. Check `package.json`. If absent, install it: `npm install astro-portabletext`. If you prefer not to add a dependency, render PortableText with `@portabletext/to-html` (already in use elsewhere in the repo, see `src/pages/get-involved/mitzvah-project.astro:12`) and set the result with `<div set:html={toHTML(cms.body)} />`. Either approach is fine; pick the one already used most in the repo. Check `grep -rn 'PortableText\|toHTML' src/` to see what the repo standard is.

The `FallbackPrivacyBody` reference above is a placeholder. Instead, leave the original hardcoded `<h2>` and `<p>` blocks (lines 16 to 85 in the original file) inside an `{!cms?.body && (...)}` Astro conditional. That preserves the audit pattern: CMS-first, hardcoded fallback if Sanity returns nothing.

---

## Piece 3: `termsPage` singleton

Same shape as `privacyPage`. Create `sanity/schemas/singletons/termsPage.ts` by copying the privacy schema and changing names/titles/initialValues. Same three top-level fields: `meta`, `heading` (initialValue `'Terms of Service'`), `lastUpdated`, `body`.

Register in `sanity/schemas/index.ts`.

Add `getTermsPage()` to `src/lib/sanity.ts` with the same projection.

Rewrite `src/pages/terms.astro` using the same pattern as Piece 2: CMS-first, hardcoded fallback inside an `{!cms?.body && (...)}` block, `<style>` block unchanged.

---

## Piece 4: `nonprofitDisclosuresPage` singleton (special: references donatePage.costBreakdown)

This one has more structure. Fields:

```ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'nonprofitDisclosuresPage',
  title: 'Nonprofit Disclosures Page',
  type: 'document',
  description:
    'The Nonprofit Disclosures page. Legal and financial transparency content. Edit with care; this is a compliance-adjacent page.',
  groups: [
    { name: 'meta', title: 'Page Meta', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'orgInfo', title: 'Organization Info' },
    { name: 'taxStatus', title: 'Tax Status' },
    { name: 'mission', title: 'Mission' },
    { name: 'programs', title: 'Use of Funds' },
    { name: 'financial', title: 'Financial Transparency' },
    { name: 'board', title: 'Board of Directors' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Page Meta (SEO)',
      type: 'pageMetaOverride',
      group: 'meta',
    }),
    defineField({
      name: 'heading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Page H1.',
      initialValue: 'Nonprofit Disclosures',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Tagline under the heading.',
      initialValue: 'Transparency and accountability in everything we do',
      group: 'hero',
    }),
    defineField({
      name: 'organizationInfo',
      title: 'Organization Info Block',
      type: 'object',
      description:
        'The labeled key/value rows at the top of the page (Legal Name, EIN, etc.). EIN is duplicated in Site Settings; keep them in sync.',
      group: 'orgInfo',
      fields: [
        defineField({ name: 'legalName', title: 'Legal Name', type: 'string', initialValue: 'Jewmanity' }),
        defineField({ name: 'orgType', title: 'Type', type: 'string', initialValue: '501(c)(3) Nonprofit Organization' }),
        defineField({ name: 'ein', title: 'EIN', type: 'string', initialValue: '99-4219099' }),
        defineField({ name: 'yearEstablished', title: 'Year Established', type: 'string', initialValue: '2019' }),
        defineField({ name: 'stateOfIncorporation', title: 'State of Incorporation', type: 'string', initialValue: 'California' }),
      ],
    }),
    defineField({
      name: 'taxStatusHeading',
      title: 'Tax Status Heading',
      type: 'string',
      initialValue: 'Tax-Deductible Status',
      group: 'taxStatus',
    }),
    defineField({
      name: 'taxStatusBody',
      title: 'Tax Status Body',
      type: 'portableText',
      description: 'IRS recognition, tax-deductibility, donor receipt language.',
      group: 'taxStatus',
    }),
    defineField({
      name: 'missionHeading',
      title: 'Mission Heading',
      type: 'string',
      initialValue: 'Mission Statement',
      group: 'mission',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'text',
      rows: 4,
      group: 'mission',
    }),
    defineField({
      name: 'programsHeading',
      title: 'Use of Funds Heading',
      type: 'string',
      initialValue: 'Use of Funds',
      group: 'programs',
    }),
    defineField({
      name: 'programsIntro',
      title: 'Use of Funds Intro',
      type: 'text',
      rows: 2,
      description: 'Short lead-in sentence before the program bullets.',
      group: 'programs',
    }),
    defineField({
      name: 'programs',
      title: 'Program Bullets',
      type: 'array',
      description: 'Each entry is a strong-label + description pair. Reorder by dragging.',
      group: 'programs',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Program Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        },
      ],
    }),
    defineField({
      name: 'financialHeading',
      title: 'Financial Transparency Heading',
      type: 'string',
      initialValue: 'Financial Transparency',
      group: 'financial',
    }),
    defineField({
      name: 'financialIntro',
      title: 'Financial Transparency Intro',
      type: 'text',
      rows: 3,
      description:
        'Paragraph before the cost breakdown. Mention the average cost per participant.',
      group: 'financial',
    }),
    defineField({
      name: 'useDonatePageCostBreakdown',
      title: 'Use Donate Page Cost Breakdown',
      type: 'boolean',
      description:
        'When ON, this page reads the cost breakdown items from the Donate Page (single source of truth). Recommended. Turn OFF only if you need a separate breakdown specific to disclosures.',
      initialValue: true,
      group: 'financial',
    }),
    defineField({
      name: 'financialClosing',
      title: 'Financial Transparency Closing Line',
      type: 'text',
      rows: 2,
      description: 'Final line after the bullets (e.g., "Administrative costs are kept minimal...").',
      group: 'financial',
    }),
    defineField({
      name: 'boardHeading',
      title: 'Board Heading',
      type: 'string',
      initialValue: 'Board of Directors',
      group: 'board',
    }),
    defineField({
      name: 'boardMembers',
      title: 'Board Members',
      type: 'array',
      description:
        'List shown on this page. Independent of the Team Members collection so legal naming and ordering can differ from the public team page.',
      group: 'board',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        },
      ],
    }),
    defineField({
      name: 'contactBody',
      title: 'Contact Section Body',
      type: 'portableText',
      description: 'Closing paragraph pointing visitors to the contact form.',
    }),
  ],
  preview: { prepare() { return { title: 'Nonprofit Disclosures Page' }; } },
});
```

Register in `sanity/schemas/index.ts`.

GROQ in `src/lib/sanity.ts`. The trick here is the cross-document join when `useDonatePageCostBreakdown` is true:

```ts
export async function getNonprofitDisclosuresPage() {
  return client.fetch(`
    *[_type == "nonprofitDisclosuresPage"][0] {
      meta,
      heading,
      heroSubtitle,
      organizationInfo,
      taxStatusHeading,
      taxStatusBody,
      missionHeading,
      missionStatement,
      programsHeading,
      programsIntro,
      programs[]{ name, description },
      financialHeading,
      financialIntro,
      useDonatePageCostBreakdown,
      financialClosing,
      boardHeading,
      boardMembers[]{ name, role },
      contactBody,
      "donateCostBreakdown": *[_type == "donatePage"][0].costBreakdown[]{ title, description, amount }
    }
  `);
}
```

Rewrite `src/pages/nonprofit-disclosures.astro` to consume this. Same CMS-first pattern. The cost breakdown loop uses `donateCostBreakdown` when `useDonatePageCostBreakdown !== false`, else the hardcoded fallback list (`International flights: $1,200`, etc.). Keep the `<style>` block unchanged.

---

## Piece 5: Seed the four singletons

Create `scripts/seed-legal-pages.ts`. Idempotent via `setIfMissing` for new docs and `createOrReplace` for first-time seeds when no editor data could exist.

The seed values come straight from the current hardcoded pages:
- `src/pages/404.astro:9-15` for the 404 heading, body, and three buttons.
- `src/pages/privacy.astro:14-86` for the privacy body (convert to PortableText blocks).
- `src/pages/terms.astro:16-89` for the terms body.
- `src/pages/nonprofit-disclosures.astro:18-91` for the disclosures fields.

PortableText block shape, for reference:

```ts
function block(style: 'normal' | 'h2', text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  };
}
function listItem(text: string) {
  return {
    ...block('normal', text),
    listItem: 'bullet',
    level: 1,
  };
}
```

Script skeleton:

```ts
/**
 * Seeds the four new legal/404 singletons from the current hardcoded
 * page content. Idempotent: uses createOrReplace, which is safe because
 * these docs are new in Phase 2.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-legal-pages.ts
 */

import { createClient } from '@sanity/client';

// ... client setup identical to other seed scripts ...

async function seedNotFoundPage() { /* ... */ }
async function seedPrivacyPage() { /* ... */ }
async function seedTermsPage() { /* ... */ }
async function seedNonprofitDisclosuresPage() { /* ... */ }

async function main() {
  await seedNotFoundPage();
  await seedPrivacyPage();
  await seedTermsPage();
  await seedNonprofitDisclosuresPage();

  const verify = await client.fetch(`{
    "notFound": *[_id == "notFoundPage"][0]{ heading, "buttonCount": count(buttons) },
    "privacy": *[_id == "privacyPage"][0]{ heading, lastUpdated, "bodyBlocks": count(body) },
    "terms": *[_id == "termsPage"][0]{ heading, lastUpdated, "bodyBlocks": count(body) },
    "disclosures": *[_id == "nonprofitDisclosuresPage"][0]{
      heading,
      organizationInfo,
      "programCount": count(programs),
      "boardCount": count(boardMembers),
      useDonatePageCostBreakdown
    }
  }`);
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
```

For each long body section (privacy + terms), define a `body` array of `block(...)` and `listItem(...)` calls that produces the same text and structure as the current hardcoded page. The `<h2>` becomes `block('h2', '...')`, paragraphs are `block('normal', '...')`, and `<ul><li>...</li></ul>` items are `listItem('...')`.

Watch the apostrophes: the existing pages use the typographic apostrophe character (`'`) in places like `Children's Privacy`. Match the source exactly.

Run:

```
set -a; source .env; set +a
npx tsx scripts/seed-legal-pages.ts
```

---

## Piece 6: Update `verify-cms-state.mjs`

Add four checks at the end of the `checks` array:

```js
{
  name: '404 page singleton (phase 2)',
  groq: `*[_type=="notFoundPage"][0]{
    heading, body, "buttonCount": count(buttons), meta
  }`,
},
{
  name: 'Privacy page singleton (phase 2)',
  groq: `*[_type=="privacyPage"][0]{
    heading, lastUpdated, "bodyBlocks": count(body), meta
  }`,
},
{
  name: 'Terms page singleton (phase 2)',
  groq: `*[_type=="termsPage"][0]{
    heading, lastUpdated, "bodyBlocks": count(body), meta
  }`,
},
{
  name: 'Nonprofit disclosures page singleton (phase 2)',
  groq: `*[_type=="nonprofitDisclosuresPage"][0]{
    heading,
    organizationInfo,
    "programCount": count(programs),
    "boardCount": count(boardMembers),
    useDonatePageCostBreakdown,
    meta
  }`,
},
```

Run `node scripts/verify-cms-state.mjs` and confirm all four return populated.

---

## Verification

1. `npm run build` succeeds with zero TypeScript errors.
2. `npm run dev`, then load `/privacy`, `/terms`, `/nonprofit-disclosures`, and an intentionally broken URL like `/this-is-not-a-page` (which triggers the 404). Compare each to a screenshot taken before this branch. Visual delta should be zero.
3. In Studio (`cd sanity && npx sanity dev`), open each new singleton and confirm:
   - The `meta` field renders as a collapsible group with title, description, OG image.
   - Privacy and Terms show a PortableText editor with H2 styles and bullet lists.
   - Disclosures shows all groups and the `useDonatePageCostBreakdown` boolean defaults to ON.
4. Edit the privacy heading in Studio, publish, refresh `/privacy` in dev mode, confirm the change appears.
5. On the disclosures page, with `useDonatePageCostBreakdown` ON, confirm the five cost rows match the live `donatePage.costBreakdown` items.

---

## Commit, push, PR, merge

```
git add sanity/schemas/singletons/notFoundPage.ts \
  sanity/schemas/singletons/privacyPage.ts \
  sanity/schemas/singletons/termsPage.ts \
  sanity/schemas/singletons/nonprofitDisclosuresPage.ts \
  sanity/schemas/index.ts \
  src/lib/sanity.ts \
  src/pages/404.astro \
  src/pages/privacy.astro \
  src/pages/terms.astro \
  src/pages/nonprofit-disclosures.astro \
  scripts/seed-legal-pages.ts \
  scripts/verify-cms-state.mjs \
  package.json package-lock.json

git commit -m "feat(cms): legal pages and 404 in Sanity (phase 2)

Closes audit sections 1.19 (404), 1.20 (Privacy Policy), 1.21 (Terms
of Service), and 1.22 (Nonprofit Disclosures) from
docs/cms-completeness-audit-2026-05-20.md.

Four new singletons (notFoundPage, privacyPage, termsPage,
nonprofitDisclosuresPage), each with the pageMetaOverride object from
Phase 1 for per-page SEO. Privacy and Terms use PortableText for body
content; Disclosures has structured fields for org info, mission,
program bullets, board members, and a boolean to read the cost
breakdown from donatePage (single source of truth for the \$4,500
figure).

Pages now read from CMS with hardcoded fallbacks. Belinda and legal
counsel can edit any legal page from Studio without a code change.
Seed script populates each singleton with current hardcoded copy."

git push -u origin feat/cms-legal-pages-and-404
gh pr create --title "feat(cms): legal pages and 404 in Sanity (phase 2)" --body "$(cat <<'EOF'
Phase 2 of 4 closing out docs/cms-completeness-audit-2026-05-20.md.

Depends on Phase 1's pageMetaOverride object (merged already).

Closes audit sections 1.19, 1.20, 1.21, 1.22.

Belinda and legal counsel can now edit:
- The 404 page heading, body, buttons, and meta.
- The Privacy Policy heading, last-updated date, and full body.
- The Terms of Service heading, last-updated date, and full body.
- The Nonprofit Disclosures org info, mission, programs, board, and
  financial breakdown (which reads from donatePage by default to
  avoid drift on the \$4,500 figure).

Verification:
- npm run build clean.
- Visual diff on each page is zero.
- node scripts/verify-cms-state.mjs prints the new singletons populated.
EOF
)"
gh pr merge --auto --squash --delete-branch
```
