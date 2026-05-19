# Prompt: Max CMS Editability Pass (audit items 3, 7, 9 + mitzvah hero seed)

Hand this to Claude Code from inside `/Users/hek/jewmanity`. Reference: `docs/cms-website-gap-audit-2026-05-18.md`. Implements the audit's three "decision-required" items under the project's "everything editable via CMS" rule, plus seeds the mitzvah project hero image that was flagged as empty in the live CMS scan.

Estimate: 90 to 120 minutes including the seed run and PR merge.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead. Applies to code comments, schema descriptions, seed copy, commit messages, and the PR body.

The repo's `.env` already contains a working `SANITY_API_TOKEN`. Source it before running the seed script:

```
set -a; source .env; set +a
```

PR flow per the project's standing memory: `gh pr create` then `gh pr merge --auto --squash --delete-branch`.

---

## Overview

Four self-contained pieces in one PR:

1. **Seed `mitzvahProject.heroImage`.** Schema field exists, page reads it, the published document is empty. Upload the existing hardcoded fallback (`public/images/hero/mitzvah-project.jpg`) and patch the document. Pure data, no code change.

2. **Audit item 3: implement `product.inStock` visibility.** Schema field already exists and Belinda can toggle it in Studio; the site ignores it. Hide the "Add to Cart" button on the product card when `inStock === false`, replace with a "Sold Out" indicator. Also gray out the detail-page Add-to-Cart.

3. **Audit item 7: render `hero.ctas`.** Eight singletons (every one that uses the `heroSection` object) declare a `ctas` array in schema that pages do not render. Extend `HeroSection.astro` to render up to two buttons from a `ctas[]` array. Update each singleton's GROQ projection and page wiring to thread `cms?.hero?.ctas` through. Retire the legacy `ctaText` / `ctaHref` single-CTA props (only `shop.astro` uses them; migrate it to the array form for consistency).

4. **Audit item 9: surface all crisis-resource regions on `/resources`.** Currently filters to `region === 'United States'` and silently drops Israel and International entries. Group all entries by region, render stacked sections labeled by region. Editors get to add any region they want and see it appear.

---

## Piece 1: Seed mitzvah heroImage

Create `scripts/seed-mitzvah-hero-image.ts`. Mirror the boilerplate in `scripts/seed-about-story.ts` (token check, asset upload helper, createClient with the same project / dataset / apiVersion). Body:

```ts
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

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

async function uploadImage(publicPath: string): Promise<string> {
  const full = resolve(process.cwd(), 'public' + publicPath);
  const buffer = await readFile(full);
  const asset = await client.assets.upload('image', buffer, { filename: basename(full) });
  return asset._id;
}

function imageRef(assetId: string) {
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: assetId },
  };
}

async function main() {
  console.log('Uploading mitzvah hero image...');
  const assetId = await uploadImage('/images/hero/mitzvah-project.jpg');
  console.log('  asset:', assetId);

  console.log('Patching mitzvahProject.heroImage...');
  await client.patch('mitzvahProject').set({ heroImage: imageRef(assetId) }).commit();

  const verify = await client.fetch(
    `*[_id == "mitzvahProject"][0]{"heroImagePresent": defined(heroImage.asset)}`,
  );
  console.log('Verification:', JSON.stringify(verify));
  if (!verify?.heroImagePresent) {
    console.error('FAIL: heroImage still not present after patch.');
    process.exit(1);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
```

Run after sourcing env:

```
set -a; source .env; set +a
npx tsx scripts/seed-mitzvah-hero-image.ts
```

Expected output: prints the asset `_id`, then `Verification: {"heroImagePresent":true}`.

---

## Piece 2: `product.inStock` visibility

### Component changes

`src/components/shop/ProductCard.astro`:

- Add `inStock?: boolean` to the `Props` interface, defaulting to `true` in the destructure (`const { id, name, ..., inStock = true } = Astro.props;`).
- When `inStock` is `false`, replace the `<button class="snipcart-add-item ...">` element with a disabled, visually distinct indicator. Suggested markup:

```astro
{inStock ? (
  <button class="snipcart-add-item ..." data-item-id={id} ...>
    Add to Cart +
  </button>
) : (
  <div class="mt-4 w-full rounded-[100px] bg-bg-section-alt py-3 text-center font-heading text-sm font-medium text-text-muted">
    Sold Out
  </div>
)}
```

Use existing color tokens (`bg-bg-section-alt`, `text-text-muted`) so it visually reads as inactive without introducing new Tailwind classes.

`src/components/shop/ProductDetail.astro`: same treatment on whatever the detail page's primary Add-to-Cart control is. If the detail page also shows a price or quantity selector, leave those visible. Only the purchase action is gated.

### Page wiring

`src/pages/shop.astro`: pass `inStock={p.inStock}` to each `<ProductCard />` (or the equivalent prop chain via `ProductGrid`, depending on the current wiring). The `inStock` field is already queried in `getProducts()`; the data is there, just not read.

`src/pages/shop/[slug].astro`: same. Pass `inStock` through to the detail component.

### Schema description update

While in the file, sharpen the description on `sanity/schemas/documents/product.ts` `inStock` field so it accurately reflects the new behavior. Replace the existing description with: `Turn off to hide the "Add to Cart" button and show a "Sold Out" indicator instead.` (No em-dashes in the original; preserve.)

### Verification

Build cleanly. Open `dist/shop/index.html` and `dist/shop/<some-product>/index.html`. With all four current products at `inStock: true` (per the live CMS scan), every card should still show "Add to Cart". Then flip one product's `inStock` to `false` in Sanity Studio (or via a quick `client.patch()` call), rebuild, confirm the card shows "Sold Out" and the button is absent.

---

## Piece 3: Render `hero.ctas` across all heroes

### HeroSection component changes

`src/components/shared/HeroSection.astro`:

Replace the existing single-CTA props (`ctaText`, `ctaHref`) with a `ctas?: CtaButton[]` array. Define the type at the top:

```ts
interface CtaButton {
  label: string;
  url: string;
  style?: 'primary' | 'secondary';
}

interface Props {
  heading: string;
  subtitle?: string;
  backgroundImage?: string;
  imagePosition?: string;
  heightClass?: string;
  ctas?: CtaButton[];
}
```

Render up to two buttons side-by-side, primary solid and secondary outlined. Suggested markup, replacing the current single-CTA block:

```astro
{ctas && ctas.length > 0 && (
  <div data-animate="hero-fade-up" class="mt-8 flex flex-wrap justify-center gap-3">
    {ctas.slice(0, 2).map((cta) => (
      <a
        href={cta.url}
        class:list={[
          'inline-block rounded-[100px] px-8 py-3 font-heading text-base font-medium transition-colors',
          cta.style === 'secondary'
            ? 'border border-white/80 text-white hover:bg-white/10'
            : 'bg-[#FAF8F5] text-primary hover:bg-white',
        ]}
      >
        {cta.label}
      </a>
    ))}
  </div>
)}
```

Match the existing primary styling. Secondary is an outlined variant suitable on top of dark imagery.

### Migrate shop.astro to the new prop

`src/pages/shop.astro:47-48`. Replace:

```astro
ctaText={heroCtaText}
ctaHref={heroCtaHref}
```

with:

```astro
ctas={cms?.hero?.ctas ?? (heroCtaText && heroCtaHref ? [{ label: heroCtaText, url: heroCtaHref, style: 'primary' }] : undefined)}
```

This keeps the existing fallback CTA working when the CMS hero has no `ctas[]` yet, but prefers the CMS values when present.

### Update all singleton GROQ projections

`src/lib/sanity.ts`: every `get*()` function that returns a singleton with a hero needs to project the `ctas` array. Identify the singletons that use `heroSection`:

- `aboutStory`
- `headsUp`
- `fightingAntisemitism`
- `resources`
- `donatePage`
- `shopPage`
- `volunteerPage`
- `contactPage`
- `aboutTeamPage`
- `aboutCommunityStoriesPage`
- `communityRecipesPage`
- `programsPastRetreatsPage`

For each, the `hero` projection block needs to include `ctas[]{ label, url, style }`. Example for `getAboutStory()`:

```groq
hero {
  heading,
  subtitle,
  backgroundImage,
  ctas[] { label, url, style }
}
```

### Update page wiring for each singleton's `HeroSection`

Each page that consumes one of those singletons currently passes `heading={cms?.hero?.heading}` etc. to `HeroSection`. Add `ctas={cms?.hero?.ctas}` to each. Pages to update:

- `src/pages/about/story.astro`
- `src/pages/programs/heads-up.astro`
- `src/pages/community/fighting-antisemitism.astro`
- `src/pages/resources.astro`
- `src/pages/donate.astro`
- `src/pages/shop.astro` (already covered above)
- `src/pages/get-involved/volunteer.astro`
- `src/pages/get-involved/contact.astro`
- `src/pages/about/team.astro`
- `src/pages/about/community-stories.astro`
- `src/pages/community/recipes.astro`
- `src/pages/programs/past-retreats.astro`

Twelve pages. The change per page is one new prop line.

### Verification

Build cleanly. With no `ctas` set in any singleton (current state), every hero should look exactly as it does today. To smoke-test the new behavior, add 1-2 CTA buttons to one singleton via Studio (or a one-line `client.patch().set({ 'hero.ctas': [{label,url,style:'primary'}] })`), rebuild, confirm the buttons render on top of the hero.

---

## Piece 4: Surface all crisis-resource regions

### Page wiring

`src/pages/resources.astro`. Replace lines 67-69 (the US-only filter) with a grouping function:

```ts
function groupByRegion(items: CrisisResource[]): Record<string, CrisisResource[]> {
  const groups: Record<string, CrisisResource[]> = {};
  for (const item of items) {
    const region = item.region || 'Other';
    if (!groups[region]) groups[region] = [];
    groups[region].push(item);
  }
  return groups;
}

const crisisResourcesByRegion: Record<string, CrisisResource[]> = Array.isArray(cms?.crisisResources)
  ? groupByRegion(cms!.crisisResources as CrisisResource[])
  : {};
```

Then in the markup, replace:

```astro
<CrisisResources
  ...
  usResources={usCrisisResources.length > 0 ? usCrisisResources : undefined}
/>
```

with:

```astro
<CrisisResources
  ...
  resourcesByRegion={Object.keys(crisisResourcesByRegion).length > 0 ? crisisResourcesByRegion : undefined}
/>
```

### Component changes

`src/components/resources/CrisisResources.astro`: change the `usResources` prop to `resourcesByRegion?: Record<string, CrisisResource[]>`. If the prop is provided, iterate the keys (sort: "United States" first if present, then alphabetical) and render one labeled section per region. Each region's section shows the same card layout the US section uses today. Keep the existing hardcoded fallback inside the component intact for the no-CMS case.

Region labels render as small section sub-headings (e.g., font-heading text-xl, mb-4). Use existing color tokens. Section ordering: US first if present, Israel second if present, International third if present, anything else alphabetical.

### Schema description

`sanity/schemas/singletons/resources.ts`. Update the `crisisResources` field description to reflect new behavior. Replace any mention of "only US is rendered" or "the US region is shown" with: `Entries are grouped by region on the page. Add resources for any region (United States, Israel, International, or others) and they will appear as their own section.` (No em-dashes.)

### Verification

Build cleanly. With current CMS state (US entries only, per scan), the resources page shows a single "United States" section, identical to today. To smoke-test the new behavior, add an Israel entry via Studio and confirm a second region section appears below.

---

## Out of scope for this PR

- Audit items 5, 10, 12 (schema cleanup, remove dead `openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution`, `disclaimer`, and unused `steps[]` subfields). Pure deletion work, easy follow-up.
- Belinda credentials drop (Mailchimp action URL, Formspree confirmation). Handled separately.
- Vercel env var configuration. After Belinda sends values, that is a `vercel env add` step.
- Additional testimonial documents to displace hardcoded fallbacks. Content task for Belinda or a separate seed.

---

## Commit, push, PR, merge

One commit. Suggested message:

```
feat(cms): max-editability pass + seed mitzvah hero image

Implements audit items 3, 7, and 9 from
docs/cms-website-gap-audit-2026-05-18.md under the project's
"everything editable via CMS" rule, plus seeds the mitzvahProject
heroImage that was empty in the live CMS scan.

Changes:
- product.inStock now hides "Add to Cart" and shows "Sold Out" when off
  (ProductCard.astro, ProductDetail.astro, shop.astro, shop/[slug].astro).
- HeroSection.astro renders up to 2 CTA buttons from hero.ctas[] across
  all 12 singletons that use the heroSection object. Single-CTA props
  ctaText/ctaHref retired (shop.astro migrated to the array form).
  GROQ projections updated for every singleton.
- /resources page now groups crisisResources by region and renders one
  section per region (United States, Israel, International, others)
  instead of dropping non-US entries.
- scripts/seed-mitzvah-hero-image.ts uploads the hardcoded fallback
  image and patches the mitzvahProject document. Idempotent.

Run with: set -a; source .env; set +a; npx tsx scripts/seed-mitzvah-hero-image.ts
```

After commit:

```
git push
gh pr create --title "feat(cms): max-editability pass + seed mitzvah hero image" --body "$(cat <<'EOF'
Implements audit items 3, 7, and 9 from docs/cms-website-gap-audit-2026-05-18.md
under the project's "everything editable via CMS" rule, plus seeds the
mitzvahProject heroImage that was empty in the live CMS scan.

Changes:
- product.inStock now hides "Add to Cart" and shows "Sold Out" when off.
- HeroSection.astro renders up to 2 CTA buttons from hero.ctas[] across
  every singleton that uses the heroSection object. shop.astro migrated
  off the legacy single-CTA props.
- /resources page surfaces all crisis-resource regions, grouped and
  labeled, instead of filtering to US only.
- scripts/seed-mitzvah-hero-image.ts seeds the empty mitzvah hero.

Verified after seed run: mitzvahProject.heroImage now resolves on Sanity.

Build clean, zero TypeScript errors. No visual regressions with current
CMS state. New behavior unlocks when editors flip inStock, add hero CTAs,
or add non-US crisis resources in Studio.
EOF
)"
gh pr merge --auto --squash --delete-branch
```
