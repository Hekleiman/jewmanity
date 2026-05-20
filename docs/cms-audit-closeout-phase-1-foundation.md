# Prompt: CMS Audit Closeout, Phase 1 — Foundation (siteSettings, navigation singleton, pageMetaOverride)

Hand this to Claude Code from inside `/Users/hek/jewmanity` for a fresh session. Reference: `docs/cms-completeness-audit-2026-05-20.md`. This phase closes the cross-cutting chrome gaps so the later phases have something stable to build on. Specifically it closes audit sections 2.1 (Navigation), 2.2 (Footer secondary copy), and 2.3 (Layout meta defaults and JSON-LD), plus the Givebutter widget config flagged in section 1.18.

Estimate: 90 to 120 minutes. This is the largest of the four phases because the navigation singleton consolidates a pair of duplicated component files, and the `pageMetaOverride` object you create here is consumed by every later phase.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead.

The repo's `.env` contains a working `SANITY_API_TOKEN` for seed scripts.

PR flow per saved memory: `gh pr create` then `gh pr merge --auto --squash --delete-branch`.

Keep the existing audit pattern intact: every component reads from Sanity first, falls back to a hardcoded default if Sanity returns null. Do not remove the hardcoded fallbacks in this phase.

---

## Pre-flight

Confirm local `main` is current before starting:

```
cd /Users/hek/jewmanity
git fetch origin
git status
git pull --ff-only
```

If `git pull --ff-only` errors with "diverging", stop and tell the user. Local work has accumulated that wasn't merged via PR.

Create a fresh branch:

```
git checkout -b feat/cms-foundation-singletons
```

---

## Piece 1: New `pageMetaOverride` object type

This object becomes the shared shape for per-page SEO/meta overrides. Phase 2 (legal pages, 404) embeds it on each new singleton; later phases may add it to existing singletons.

Create `sanity/schemas/objects/pageMetaOverride.ts`:

```ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pageMetaOverride',
  title: 'Page Meta Override',
  type: 'object',
  description:
    'Per-page SEO and social-share overrides. Leave fields blank to inherit the site-wide defaults from Site Settings.',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (browser tab and Google result)',
      type: 'string',
      description:
        'Overrides the site default page title for this page. Format suggestion: "Page Name | Jewmanity". Leave blank to use the site default.',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description:
        'Short summary shown in search results and on social shares. 1 to 2 sentences, under 160 characters.',
      validation: (rule) => rule.max(200).warning('Search engines truncate beyond ~160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'Image shown when this page is shared on Facebook, LinkedIn, iMessage, etc. Recommended: 1200x630px. Leave blank to use the site default.',
      options: { hotspot: true },
    }),
  ],
});
```

Register it in `sanity/schemas/index.ts` alongside the other object types (add `import pageMetaOverride from './objects/pageMetaOverride';` near the top and push it into the `schemaTypes` array in the Objects block).

No GROQ or page work in this piece. Phases 2 to 4 will consume it.

---

## Piece 2: Extend `siteSettings` with site-wide defaults

File: `sanity/schemas/singletons/siteSettings.ts`.

Add field groups (the current file has no `groups` array). Top of the document config:

```ts
groups: [
  { name: 'identity', title: 'Organization Identity', default: true },
  { name: 'social', title: 'Social Media' },
  { name: 'footer', title: 'Footer' },
  { name: 'meta', title: 'Site Meta Defaults' },
  { name: 'address', title: 'Organization Address' },
  { name: 'donate', title: 'Donate Widget' },
],
```

Assign every existing field to its group (`orgName`, `ein` → identity; `socialLinks` → social; `footerTagline`, `copyrightText` → footer).

Then add the following new fields. All are optional. All match what currently ships hardcoded in `Layout.astro` and `Footer.astro`.

Identity group:
- `logo` (image, hotspot, `description`: 'Logo image used in the nav, footer, and structured data. PNG, transparent background, around 400x267px.')
- `foundingYear` (string, `description`: 'Year the organization was founded. Used in structured data and copyright contexts.', `initialValue`: '2019')

Meta group (site-wide SEO defaults):
- `defaultPageTitle` (string, `description`: 'Default browser-tab title used when a page does not set its own. Current value: "Jewmanity | Supporting Healing & Resilience".')
- `defaultPageDescription` (text, rows 2, `description`: 'Default meta description used when a page does not set its own. 1 to 2 sentences. Search engines truncate beyond ~160 characters.', validation: max 200 warning)
- `defaultOgImage` (image, hotspot, `description`: 'Default social-share image. 1200x630px. Used on pages that do not set their own OG image.')

Address group (drives the JSON-LD structured data block in `Layout.astro:80`):
- `address` (object), fields:
  - `streetAddress` (string, optional)
  - `addressLocality` (string, `initialValue`: 'San Diego')
  - `addressRegion` (string, `initialValue`: 'CA')
  - `postalCode` (string, optional)
  - `addressCountry` (string, `initialValue`: 'US')

Footer group:
- `legalLinks` (array of `{ label: string, href: string }`, `description`: 'Legal links shown at the bottom of every page. Default set: Privacy Policy /privacy, Terms of Service /terms, Nonprofit Disclosures /nonprofit-disclosures.')
- `footerDisclaimer` (text, rows 2, `description`: 'Legal disclaimer at the bottom of the footer. Default: "All donations are tax-deductible to the fullest extent allowed by law." Review wording with counsel before changing.')

Donate group:
- `givebutterAccountId` (string, `description`: 'Givebutter account ID for the donate-page widget. Find it in your Givebutter dashboard under Widget Embed (the value after "acct="). Current value: qGMyp9PcvINJwyvd.')
- `givebutterWidgetId` (string, `description`: 'Givebutter widget ID for the donate-page widget. Find it in your dashboard under Widget Embed (the value inside givebutter-widget id="..."). Current value: g8MJdP.')

---

## Piece 3: New `navigation` singleton

File: `sanity/schemas/singletons/navigation.ts`. This replaces the duplicated `navItems` arrays in `Navigation.astro` and `MobileMenu.astro`.

```ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'navigation',
  title: 'Site Navigation',
  type: 'document',
  description:
    'Top-level navigation labels, links, and ordering. Used by both the desktop nav and the mobile menu. Changes here affect every page.',
  fields: [
    defineField({
      name: 'items',
      title: 'Top-Level Nav Items',
      type: 'array',
      description:
        'The nav items shown across the top of the desktop nav and as accordions in the mobile menu. Reorder by dragging. Each item can have child links shown in a dropdown.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Visible text for the nav item (e.g., "About", "Programs").',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              description:
                'Where this nav item links. Use a relative path like "/about/story" for internal pages, or a full URL for external.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'children',
              title: 'Child Links (dropdown)',
              type: 'array',
              description:
                'Optional. If set, the parent label gets a dropdown caret and these appear inside. Leave empty for a simple flat link.',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'Link URL',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'Nav CTA Button',
      type: 'object',
      description:
        'The pill-shaped button at the top-right of the nav. Default: "Support Healing" linking to /donate.',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          description: 'e.g., "Support Healing".',
        }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'Usually /donate.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Navigation' };
    },
  },
});
```

Register in `sanity/schemas/index.ts`:
- Add `import navigation from './singletons/navigation';` with the other singleton imports (around line 49).
- Push `navigation` into the `schemaTypes` array in the Singletons block.
- Add the string `'navigation'` to the `singletonTypes` Set so Studio knows not to allow duplicates.

If `sanity/structure.ts` (or `sanity/sanity.config.ts`) hand-builds the Studio desk structure, add a list item for "Site Navigation" pointing at `_id: 'navigation'`. Use the same pattern the other singletons use; grep for `S.documentListItem` or `S.editor` to find the location.

---

## Piece 4: Update GROQ helpers in `src/lib/sanity.ts`

In `getSiteSettings()` (currently at lines 508 to 518), extend the projection to include every new field added in Piece 2:

```ts
export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      orgName,
      ein,
      foundingYear,
      logo,
      socialLinks,
      footerTagline,
      copyrightText,
      defaultPageTitle,
      defaultPageDescription,
      defaultOgImage,
      address,
      legalLinks,
      footerDisclaimer,
      givebutterAccountId,
      givebutterWidgetId
    }
  `);
}
```

Add a new helper for the navigation singleton, placed alongside the other singleton helpers (after `getSiteSettings` is fine):

```ts
export async function getNavigation() {
  return client.fetch(`
    *[_type == "navigation"][0] {
      items[]{
        label,
        href,
        children[]{ label, href }
      },
      ctaButton
    }
  `);
}
```

---

## Piece 5: Wire `Layout.astro` to read site defaults from CMS

File: `src/layouts/Layout.astro`.

The current file (read lines 1 to 30 of the original) already fetches `siteSettings` for the Footer. Extend that fetch result to drive the page meta defaults and JSON-LD structured data.

Add `urlFor` to the existing import (currently `import { getSiteSettings } from '../lib/sanity';`):

```astro
import { getSiteSettings, urlFor } from '../lib/sanity';
```

Replace the `const { title, description, ogImage }` destructure (lines 14 to 18) so the props can fall through to CMS defaults instead of being literal strings:

```astro
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const { title: propTitle, description: propDescription, ogImage: propOgImage } = Astro.props;

let siteSettings = null;
try {
  siteSettings = await getSiteSettings();
} catch (e) {
  console.warn('Sanity fetch failed for siteSettings, layout will use hardcoded fallbacks');
}

const title =
  propTitle
    || siteSettings?.defaultPageTitle
    || 'Jewmanity | Supporting Healing & Resilience';

const description =
  propDescription
    || siteSettings?.defaultPageDescription
    || 'Jewmanity is a 501(c)(3) nonprofit supporting mental health and healing for Jewish and Israeli communities through retreats, peer support, education, and ongoing care.';

const defaultOgImageUrl = siteSettings?.defaultOgImage
  ? urlFor(siteSettings.defaultOgImage).width(1200).height(630).url()
  : '/og-default.png';

const ogImage = propOgImage || defaultOgImageUrl;
```

Replace the `<meta property="og:image" content={`https://jewmanity.com${ogImage}`} />` and Twitter equivalent with a normalized URL helper (some CMS images will already be absolute):

```astro
const absoluteOgImage = ogImage.startsWith('http')
  ? ogImage
  : `https://jewmanity.com${ogImage}`;
```

Then use `{absoluteOgImage}` in both `og:image` and `twitter:image`.

For the JSON-LD block (lines 72 to 90), replace the hardcoded org info with CMS-driven values:

```astro
const orgName = siteSettings?.orgName || 'Jewmanity';
const foundingYear = siteSettings?.foundingYear || '2019';
const addressLocality = siteSettings?.address?.addressLocality || 'San Diego';
const addressRegion = siteSettings?.address?.addressRegion || 'CA';
const addressCountry = siteSettings?.address?.addressCountry || 'US';
const logoUrl = siteSettings?.logo
  ? urlFor(siteSettings.logo).width(400).url()
  : 'https://jewmanity.com/images/logo.png';
const sameAs = [
  siteSettings?.socialLinks?.facebook,
  siteSettings?.socialLinks?.instagram,
  siteSettings?.socialLinks?.twitter,
  siteSettings?.socialLinks?.linkedin,
].filter(Boolean);
if (sameAs.length === 0) {
  sameAs.push(
    'https://www.facebook.com/profile.php?id=61577185790846',
    'https://www.instagram.com/jewmanity_',
  );
}
```

Then replace the `set:html={JSON.stringify({...})}` block with the dynamic version that uses `orgName`, `foundingYear`, `logoUrl`, `addressLocality`, etc.

---

## Piece 6: Wire `Navigation.astro` and `MobileMenu.astro` to the `navigation` singleton

Both files currently declare an identical `navItems` array (lines 10 to 48 in each). Replace with a CMS read and a shared fallback.

Step 1: extract the fallback into a shared module so both files reference the same constant. Create `src/lib/navigation-fallback.ts`:

```ts
export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const fallbackNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about/story',
    children: [
      { label: 'Our Story', href: '/about/story' },
      { label: 'Our Team', href: '/about/team' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs/heads-up',
    children: [
      { label: 'Heads Up', href: '/programs/heads-up' },
      { label: 'Past Retreats', href: '/programs/past-retreats' },
    ],
  },
  {
    label: 'Community',
    href: '/community/fighting-antisemitism',
    children: [
      { label: 'Community Stories', href: '/about/community-stories' },
      { label: 'Fighting Antisemitism', href: '/community/fighting-antisemitism' },
      { label: 'Recipes', href: '/community/recipes' },
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved/volunteer',
    children: [
      { label: 'Volunteer', href: '/get-involved/volunteer' },
      { label: 'Mitzvah Project', href: '/get-involved/mitzvah-project' },
      { label: 'Contact', href: '/get-involved/contact' },
    ],
  },
  { label: 'Resources', href: '/resources' },
  { label: 'Shop', href: '/shop' },
];

export const fallbackNavCta = { text: 'Support Healing', href: '/donate' };
```

Step 2: update both Navigation files to fetch and merge.

`src/components/Navigation.astro` frontmatter (replace lines 1 to 48):

```astro
---
import { getNavigation, getSiteSettings, urlFor } from '../lib/sanity';
import { fallbackNavItems, fallbackNavCta, type NavItem } from '../lib/navigation-fallback';

interface Props {}

let nav: { items?: NavItem[]; ctaButton?: { text?: string; href?: string } } | null = null;
let siteSettings: { logo?: any; orgName?: string | null } | null = null;
try {
  nav = await getNavigation();
} catch (e) {
  console.warn('Sanity fetch failed for navigation, using hardcoded fallbacks');
}
try {
  siteSettings = await getSiteSettings();
} catch (e) {
  console.warn('Sanity fetch failed for siteSettings (nav logo), using hardcoded fallback');
}

const navItems: NavItem[] = nav?.items && nav.items.length > 0 ? nav.items : fallbackNavItems;
const navCta = {
  text: nav?.ctaButton?.text || fallbackNavCta.text,
  href: nav?.ctaButton?.href || fallbackNavCta.href,
};
const logoUrl = siteSettings?.logo
  ? urlFor(siteSettings.logo).width(100).url()
  : '/images/logo.png';
const logoAlt = siteSettings?.orgName || 'Jewmanity';

const currentPath = Astro.url.pathname;

function isActive(item: NavItem): boolean {
  if (currentPath === item.href || currentPath === item.href + '/') return true;
  if (item.children) {
    return item.children.some(
      (child) => currentPath === child.href || currentPath === child.href + '/'
    );
  }
  return false;
}
---
```

Then replace the hardcoded `<img src="/images/logo.png" alt="Jewmanity" ...>` with `<img src={logoUrl} alt={logoAlt} ...>`, and the hardcoded "Support Healing" CTA (around line 147) with `<a href={navCta.href}>{navCta.text}</a>`.

Do the equivalent edit on `src/components/MobileMenu.astro` (same imports, same fetch, same fallbacks, same logo and CTA substitutions). Both files keep their existing markup, behavior, and styles. Only the source of `navItems`, the logo, and the CTA pill change.

---

## Piece 7: Wire `Footer.astro` to the new fields

File: `src/components/Footer.astro`.

Extend the `SiteSettings` interface (lines 9 to 15) to include the new fields:

```astro
interface SiteSettings {
  orgName?: string | null;
  ein?: string | null;
  socialLinks?: SocialLinks | null;
  copyrightText?: string | null;
  footerTagline?: string | null;
  legalLinks?: { label: string; href: string }[] | null;
  footerDisclaimer?: string | null;
}
```

Add fallback constants in the frontmatter:

```astro
const fallbackLegalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Nonprofit Disclosures', href: '/nonprofit-disclosures' },
];
const legalLinks = siteSettings?.legalLinks && siteSettings.legalLinks.length > 0
  ? siteSettings.legalLinks
  : fallbackLegalLinks;
const footerDisclaimer =
  siteSettings?.footerDisclaimer
    || 'All donations are tax-deductible to the fullest extent allowed by law.';
```

Replace the three hardcoded `<a>` legal links (lines 108 to 127) with a `.map` over `legalLinks`. Replace the hardcoded disclaimer paragraph (lines 135 to 137) with `{footerDisclaimer}`.

---

## Piece 8: Wire `DonateHero.astro` to read Givebutter config from CMS

File: `src/components/donate/DonateHero.astro`.

Extend the Props interface:

```astro
interface Props {
  imagePosition?: string;
  heading?: string;
  subtitle?: string;
  imageUrl?: string;
  taxNote?: string;
  ctas?: CtaButton[];
  givebutterAccountId?: string;
  givebutterWidgetId?: string;
}
```

Replace the destructure block and add fallbacks:

```astro
const {
  imagePosition = 'center 25%',
  heading,
  subtitle,
  imageUrl,
  taxNote,
  ctas,
  givebutterAccountId,
  givebutterWidgetId,
} = Astro.props;

const acctId = givebutterAccountId || 'qGMyp9PcvINJwyvd';
const widgetId = givebutterWidgetId || 'g8MJdP';
```

Replace the hardcoded widget script/element (lines 64 to 65):

```astro
<script src={`https://widgets.givebutter.com/latest.umd.cjs?acct=${acctId}&p=other`} async is:inline></script>
<givebutter-widget id={widgetId}></givebutter-widget>
```

Then in `src/pages/donate.astro` (read first), pass the values down from siteSettings. The donate page already calls `getDonatePage()`; add a `getSiteSettings()` call alongside it and pass `givebutterAccountId={siteSettings?.givebutterAccountId}` and `givebutterWidgetId={siteSettings?.givebutterWidgetId}` on `<DonateHero ... />`.

---

## Piece 9: Seed Sanity with the current values

Create `scripts/seed-foundation-singletons.ts`. The script extends siteSettings with the new fields, creates the navigation singleton, and is idempotent via `createOrReplace` and per-field patches.

```ts
/**
 * Seeds the new siteSettings fields and the navigation singleton with the
 * values currently hardcoded in the codebase. Idempotent.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-foundation-singletons.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error('Error: SANITY_API_TOKEN env var required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function patchSiteSettings() {
  console.log('Patching siteSettings with new defaults...');
  await client
    .patch('siteSettings')
    .setIfMissing({
      foundingYear: '2019',
      defaultPageTitle: 'Jewmanity | Supporting Healing & Resilience',
      defaultPageDescription:
        'Jewmanity is a 501(c)(3) nonprofit supporting mental health and healing for Jewish and Israeli communities through retreats, peer support, education, and ongoing care.',
      address: {
        addressLocality: 'San Diego',
        addressRegion: 'CA',
        addressCountry: 'US',
      },
      legalLinks: [
        { _key: 'privacy', label: 'Privacy Policy', href: '/privacy' },
        { _key: 'terms', label: 'Terms of Service', href: '/terms' },
        { _key: 'disclosures', label: 'Nonprofit Disclosures', href: '/nonprofit-disclosures' },
      ],
      footerDisclaimer:
        'All donations are tax-deductible to the fullest extent allowed by law.',
      givebutterAccountId: 'qGMyp9PcvINJwyvd',
      givebutterWidgetId: 'g8MJdP',
    })
    .commit();
  console.log('  done.');
}

async function seedNavigation() {
  console.log('Seeding navigation singleton...');
  const doc = {
    _id: 'navigation',
    _type: 'navigation',
    items: [
      { _key: 'home', label: 'Home', href: '/' },
      {
        _key: 'about',
        label: 'About',
        href: '/about/story',
        children: [
          { _key: 'about-story', label: 'Our Story', href: '/about/story' },
          { _key: 'about-team', label: 'Our Team', href: '/about/team' },
        ],
      },
      {
        _key: 'programs',
        label: 'Programs',
        href: '/programs/heads-up',
        children: [
          { _key: 'programs-headsup', label: 'Heads Up', href: '/programs/heads-up' },
          {
            _key: 'programs-past',
            label: 'Past Retreats',
            href: '/programs/past-retreats',
          },
        ],
      },
      {
        _key: 'community',
        label: 'Community',
        href: '/community/fighting-antisemitism',
        children: [
          {
            _key: 'community-stories',
            label: 'Community Stories',
            href: '/about/community-stories',
          },
          {
            _key: 'community-antisemitism',
            label: 'Fighting Antisemitism',
            href: '/community/fighting-antisemitism',
          },
          { _key: 'community-recipes', label: 'Recipes', href: '/community/recipes' },
        ],
      },
      {
        _key: 'getinvolved',
        label: 'Get Involved',
        href: '/get-involved/volunteer',
        children: [
          {
            _key: 'gi-volunteer',
            label: 'Volunteer',
            href: '/get-involved/volunteer',
          },
          {
            _key: 'gi-mitzvah',
            label: 'Mitzvah Project',
            href: '/get-involved/mitzvah-project',
          },
          { _key: 'gi-contact', label: 'Contact', href: '/get-involved/contact' },
        ],
      },
      { _key: 'resources', label: 'Resources', href: '/resources' },
      { _key: 'shop', label: 'Shop', href: '/shop' },
    ],
    ctaButton: { text: 'Support Healing', href: '/donate' },
  };

  const existing = await client.fetch(`*[_id == "navigation"][0]{_id}`);
  console.log(existing ? '  existing doc found, replacing.' : '  no existing doc, creating.');
  const res = await client.createOrReplace(doc);
  console.log(`  wrote: ${res._id}`);
}

async function main() {
  await patchSiteSettings();
  await seedNavigation();

  const verify = await client.fetch(
    `{
      "siteSettings": *[_id == "siteSettings"][0]{
        orgName, ein, foundingYear, defaultPageTitle, defaultPageDescription,
        address, "legalLinkCount": count(legalLinks), footerDisclaimer,
        givebutterAccountId, givebutterWidgetId
      },
      "navigation": *[_id == "navigation"][0]{
        "itemCount": count(items),
        items[]{ label, href, "childCount": count(children) },
        ctaButton
      }
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
```

The `setIfMissing` semantics protect against clobbering values Belinda may have already edited in Studio. The navigation `createOrReplace` is safe because nothing exists at `_id: 'navigation'` yet.

Run it:

```
set -a; source .env; set +a
npx tsx scripts/seed-foundation-singletons.ts
```

Note: Uploading the logo image and a default OG image as Sanity assets is a Belinda task. The fallbacks in code keep both rendering correctly until she uploads them.

---

## Piece 10: Update `verify-cms-state.mjs`

Add two new checks at the end of the `checks` array in `scripts/verify-cms-state.mjs`. Use the existing pattern.

```js
{
  name: 'Navigation singleton (phase 1)',
  groq: `*[_type=="navigation"][0]{
    "itemCount": count(items),
    items[]{ label, href, "childCount": count(children) },
    ctaButton
  }`,
},
{
  name: 'Site Settings extended fields (phase 1)',
  groq: `*[_type=="siteSettings"][0]{
    foundingYear,
    "hasLogo": defined(logo.asset),
    "hasDefaultOgImage": defined(defaultOgImage.asset),
    defaultPageTitle,
    "hasDefaultDescription": defined(defaultPageDescription),
    address,
    "legalLinkCount": count(legalLinks),
    footerDisclaimer,
    givebutterAccountId,
    givebutterWidgetId
  }`,
},
```

Run `node scripts/verify-cms-state.mjs` and confirm the new sections print without errors.

---

## Verification

1. `npm run build` succeeds with zero TypeScript errors.
2. `npm run dev`, then load the homepage, the donate page, and one inner page. Confirm:
   - Nav labels and order unchanged from before.
   - Footer legal links and disclaimer unchanged.
   - Donate page widget loads and matches the previous campaign.
   - View source: title, description, OG image, and JSON-LD all populated.
3. Open Sanity Studio (`cd sanity && npx sanity dev`) and confirm:
   - "Site Navigation" appears as a single doc in the sidebar.
   - Site Settings has the new groups (Site Meta Defaults, Organization Address, Donate Widget, Footer).
4. Run `node scripts/verify-cms-state.mjs` and confirm both new checks return populated objects.
5. `npm run screenshot -- http://localhost:4321/ phase-1-home` and compare to a baseline screenshot. Visual delta should be zero.

---

## Commit, push, PR, merge

```
git add sanity/schemas/objects/pageMetaOverride.ts \
  sanity/schemas/singletons/siteSettings.ts \
  sanity/schemas/singletons/navigation.ts \
  sanity/schemas/index.ts \
  src/lib/sanity.ts \
  src/lib/navigation-fallback.ts \
  src/layouts/Layout.astro \
  src/components/Navigation.astro \
  src/components/MobileMenu.astro \
  src/components/Footer.astro \
  src/components/donate/DonateHero.astro \
  src/pages/donate.astro \
  scripts/seed-foundation-singletons.ts \
  scripts/verify-cms-state.mjs

git commit -m "feat(cms): foundation layer for audit closeout (phase 1)

Closes audit sections 2.1 (Navigation), 2.2 (Footer secondary copy),
2.3 (Layout meta and JSON-LD), and 1.18 (Givebutter widget config)
from docs/cms-completeness-audit-2026-05-20.md.

New:
- pageMetaOverride object type (consumed by phases 2 to 4).
- navigation singleton, replacing duplicated navItems arrays in
  Navigation.astro and MobileMenu.astro. Both components now read
  from the same Sanity doc with a shared TS fallback module.
- siteSettings groups and new fields: foundingYear, logo,
  defaultPageTitle, defaultPageDescription, defaultOgImage, address,
  legalLinks, footerDisclaimer, givebutterAccountId,
  givebutterWidgetId.

Layout.astro now reads page title, description, OG image, and the
JSON-LD organization block from siteSettings with hardcoded fallbacks.
DonateHero reads Givebutter account and widget IDs from siteSettings.
Footer reads legalLinks and footerDisclaimer from siteSettings.

Seed script populates the navigation doc and siteSettings extension
with current production values. Idempotent."

git push -u origin feat/cms-foundation-singletons
gh pr create --title "feat(cms): foundation layer for audit closeout (phase 1)" --body "$(cat <<'EOF'
Phase 1 of 4 closing out docs/cms-completeness-audit-2026-05-20.md.

Scope:
- New pageMetaOverride object type (consumed by phases 2 to 4).
- New navigation singleton, deduplicates nav between desktop and mobile.
- Extended siteSettings: meta defaults, address, logo, legal links,
  footer disclaimer, Givebutter widget config.

Layout, Navigation, MobileMenu, Footer, and DonateHero now read from
the CMS with hardcoded fallbacks. Belinda can now edit nav labels,
footer legal links, the footer tax disclaimer, the site default page
title and description, and the Givebutter widget IDs from Studio.

Phases 2 to 4 build on the pageMetaOverride object created here.

Verification:
- npm run build clean.
- Visual diff on home, donate, and an inner page is zero.
- node scripts/verify-cms-state.mjs prints the new checks populated.
EOF
)"
gh pr merge --auto --squash --delete-branch
```
