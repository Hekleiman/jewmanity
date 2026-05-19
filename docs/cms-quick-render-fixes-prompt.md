# Prompt: CMS Quick Render Fixes (Round 2)

Hand this to Claude Code from inside `/Users/hek/jewmanity`. Reference: `docs/cms-website-gap-audit-2026-05-18.md`. These are audit items 6 and 8, both "data is already in the CMS, we just forgot to render it" fixes. Total estimate: 20 to 30 minutes.

Do not use em-dashes in code, comments, or commit messages. Commas, periods, or parens instead.

---

## Fix 1: Render `siteSettings.footerTagline` in the footer

Files:
- `src/components/Footer.astro` (consumer)
- `src/lib/sanity.ts:442` (GROQ already includes `footerTagline`, no change needed)
- `sanity/schemas/singletons/siteSettings.ts:53-58` (schema already declares it, no change needed)

Today: editors can set "Footer Tagline" in Studio. The value flows through the GROQ pull. `Footer.astro` never reads it, so Studio edits are invisible.

### Edits to `src/components/Footer.astro`

In the `SiteSettings` interface (lines 9 to 14), add the field:

```ts
interface SiteSettings {
  orgName?: string | null;
  ein?: string | null;
  socialLinks?: SocialLinks | null;
  copyrightText?: string | null;
  footerTagline?: string | null;
}
```

Below the existing `const copyrightText = ...` (line 24), add:

```ts
const footerTagline = siteSettings?.footerTagline || null;
```

(No hardcoded fallback. If the editor leaves it blank, we render nothing rather than placeholder text. This matches how `twitter` and `linkedin` are handled at lines 28 to 29.)

In the markup, render the tagline between the social icons and the legal links block. Insert it as a new element inside the outer flex column, after the closing `</div>` of the social icons div (line 95) and before the opening `<div class="flex flex-col items-center gap-4">` of the text block (line 98):

```astro
    {footerTagline && (
      <p class="text-center font-heading text-base leading-relaxed text-[rgba(250,248,245,0.85)]">
        {footerTagline}
      </p>
    )}
```

Rationale for placement and styling: the outer container is `flex-col items-center gap-12`, so a centered paragraph between the social icons and the text block sits naturally in the 12px gap rhythm. The slightly higher opacity (0.85 vs 0.7) gives the tagline more weight than legal links without overpowering the copyright line. Uses `font-heading` (Manrope) to match the brand voice rather than the body font used for legal text. The whole block is gated on `footerTagline` being truthy so leaving the field blank in Studio renders nothing.

If Belinda later wants different placement or styling, this is a one-element move. Note in the commit message that the placement is a first pass and easy to revise.

### Verification

`npm run build`. Open `dist/index.html` (or any built page) and grep for the rendered tagline string if `siteSettings.footerTagline` is set in Sanity. If the editor has not set a tagline yet, no tagline element should appear in the rendered HTML (search for `font-heading text-base leading-relaxed` and confirm zero matches).

---

## Fix 2: Pull related recipes from CMS, not the hardcoded `allRecipes` object

Files:
- `src/pages/community/recipes/[slug].astro` (lines 280 and 360 to 368)

Today: every recipe detail page (CMS-built or fallback-built) shows three "related recipes" pulled from the hardcoded `allRecipes` object at lines 24 to 279. An editor adding a new recipe in Sanity will never see it appear as a related recipe on other pages.

### Edits to `src/pages/community/recipes/[slug].astro`

The current `getStaticPaths` (lines 282 to 306) builds paths from CMS recipes if present, otherwise from a hardcoded slug list. We need to pass the full CMS recipe set along with each individual recipe so the page body can compute related recipes from CMS data.

Replace the current `getStaticPaths` (lines 282 to 306) with:

```ts
export async function getStaticPaths() {
  let recipes: any[] = [];
  try {
    recipes = await getRecipes();
  } catch (e) {
    console.warn('Sanity fetch failed for recipe paths, using fallback');
  }

  if (recipes.length > 0) {
    return recipes.map((recipe: any) => ({
      params: { slug: recipe.slug.current },
      props: { recipe, allCmsRecipes: recipes },
    }));
  }

  return [
    { params: { slug: 'savtas-stuffed-chicken' } },
    { params: { slug: 'mimas-noodle-kugel' } },
    { params: { slug: 'grammys-chocolate-peanut-butter-candy' } },
    { params: { slug: 'grandma-mendelsons-apple-butter-cake' } },
    { params: { slug: 'bubbas-brisket' } },
    { params: { slug: 'memas-mondel-brot' } },
    { params: { slug: 'grandma-joyces-lemon-cake' } },
  ];
}
```

The only change is the `props` object now includes `allCmsRecipes: recipes` so each page receives the full set alongside its own recipe.

Just below `const cmsRecipe = Astro.props.recipe || null;` (currently line 309), add:

```ts
const allCmsRecipes = (Astro.props.allCmsRecipes as any[] | undefined) ?? [];
```

Replace the existing `relatedRecipes` block (lines 360 to 368) with:

```ts
const relatedRecipes: RelatedRecipe[] = allCmsRecipes.length > 0
  ? allCmsRecipes
      .filter((r) => r.slug?.current && r.slug.current !== slug)
      .slice(0, 3)
      .map((r) => ({
        title: r.title || '',
        description: r.description || '',
        slug: r.slug.current,
        image: r.image?.asset ? urlFor(r.image).width(800).url() : undefined,
      }))
  : recipeSlugs
      .filter((s) => s !== slug)
      .slice(0, 3)
      .map((s) => ({
        title: allRecipes[s].title,
        description: allRecipes[s].description,
        slug: s,
        image: allRecipes[s].image,
      }));
```

When CMS data is available, we use it. When the page was built from the hardcoded fallback list (no CMS recipes), we keep the original hardcoded-related-recipes behavior so the fallback is still self-consistent.

### Verification

`npm run build`. After build:

1. Open any CMS-driven recipe page HTML in `dist/community/recipes/<slug>/index.html`.
2. Search the rendered related-recipes section for the titles of CMS recipes (not the hardcoded ones like "Savta's Stuffed Chicken"). If Sanity has at least four recipes, the related section should show three of them, none matching the current page's own slug.
3. Confirm related-recipe images point to Sanity CDN URLs (`cdn.sanity.io/images/...`), not `/images/recipes/...`.

If Sanity has fewer than four recipes total, the related section may show only zero, one, or two cards. That is correct behavior, since we cannot show three unique-related recipes if the CMS set is small.

---

## Verification (both fixes)

1. `npm run build` succeeds with no TypeScript errors.

2. `git diff` should show changes to exactly two files: `src/components/Footer.astro` and `src/pages/community/recipes/[slug].astro`. No other files.

3. `git diff --stat` line counts: under 30 added lines total.

4. Visual spot-check, recipe detail page in browser (or `dist` HTML) shows related recipes pulled from CMS when present.

5. Footer renders the tagline only if `siteSettings.footerTagline` has a value in Sanity. Blank value, no element.

## Commit

One bundled commit:

```
fix(cms): render footerTagline and pull related recipes from CMS

- read siteSettings.footerTagline in Footer.astro (was queried, never rendered)
- pass full CMS recipe set through getStaticPaths so recipe detail pages
  compute related recipes from Sanity, not the hardcoded allRecipes object

Refs docs/cms-website-gap-audit-2026-05-18.md items 6 and 8.

Footer tagline placement is a first pass (between social icons and legal
links, font-heading at 0.85 opacity). Adjust styling or position in a
follow-up if design wants something different.
```

No em-dashes anywhere in the commit message.
