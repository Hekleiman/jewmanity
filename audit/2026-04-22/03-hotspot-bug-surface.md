# Phase 3: Hotspot bug surface

## What I checked

1. Re-read `src/lib/sanity.ts` verbatim.
2. Located `urlForCropped` definition and ran `grep -rn "urlForCropped" src/` to list consumers.
3. For each consumer, inspected 5 lines of surrounding context.
4. `grep -rn "type: 'image'"` across `sanity/schemas/` — listed every image field.
5. For each image field, checked whether `options: { hotspot: true }` is set.
6. Wrote `audit/2026-04-22/scripts/diagnose-hotspots.ts` and ran it; raw output in `audit/2026-04-22/hotspot-diagnostic-output.txt`.
7. Ran 3 CDN `curl` pairs (Belinda, one product, one retreat) — with and without `&fp-x=0.5&fp-y=0.33` appended.
8. Read `node_modules/@sanity/image-url/src/urlForImage.ts` and `builder.ts` to confirm library behavior.
9. Ran `grep -rn "urlFor\b" src/` and `grep -rn "imageUrl"` to inventory every image consumer that currently does NOT use `urlForCropped`.

## Evidence

### `src/lib/sanity.ts` (full)
```ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Hotspot-aware image URL builder for cropped card/thumbnail images.
 *
 * Sanity's hotspot/crop metadata only takes effect when both width AND height
 * are constrained AND the URL requests `.fit('crop').crop('focalpoint')`.
 * This helper bundles all three so consumers don't have to remember.
 *
 * Use for any image rendered in a fixed aspect-ratio container (cards,
 * thumbnails, grid tiles). For hero backgrounds and full-bleed images, use
 * `urlFor(...).width(...).url()` without cropping.
 */
export function urlForCropped(source: SanityImageSource, width: number, height: number) {
  return builder.image(source).width(width).height(height).fit('crop').crop('focalpoint');
}
// … (collection + singleton query functions follow; unchanged for this phase)
```

### `urlForCropped` definition (lines 29-31)
```ts
29:export function urlForCropped(source: SanityImageSource, width: number, height: number) {
30-  return builder.image(source).width(width).height(height).fit('crop').crop('focalpoint');
31-}
```

### `grep -rn "urlForCropped" src/`
```
src/lib/sanity.ts:29:export function urlForCropped(…)
src/pages/about/team.astro:6:import { getTeamMembers, urlForCropped } from '../../lib/sanity';
src/pages/about/team.astro:15:  image: m.photo ? urlForCropped(m.photo, 800, 600).url() : undefined,
```

Only **one** consumer page: `src/pages/about/team.astro`.

### Context at `src/pages/about/team.astro:10-20`
```
11	const teamMembers = await getTeamMembers().catch(() => [] as any[]);
12	
13	const members = teamMembers.map((m: any) => ({
14	  name: m.name,
15	  image: m.photo ? urlForCropped(m.photo, 800, 600).url() : undefined,
16	  role: m.role,
17	  bio: m.bio,
18	}));
```

### Image fields across all schemas

Every `type: 'image'` field in the codebase has `options: { hotspot: true }`. Full list:

| Schema file | Field | hotspot |
|---|---|---|
| `sanity/schemas/singletons/homepage.ts:35` | `heroImage` | yes |
| `sanity/schemas/singletons/headsUp.ts:45` | `safeHavenImage` | yes |
| `sanity/schemas/singletons/headsUp.ts:112` | `careImage` | yes |
| `sanity/schemas/singletons/headsUp.ts:194` | `communityImage` | yes |
| `sanity/schemas/singletons/resources.ts:120` | `whyMattersImage` | yes |
| `sanity/schemas/singletons/resources.ts:153` | `commonStrugglesImage` | yes |
| `sanity/schemas/singletons/resources.ts:185` | `signsSectionImage` | yes |
| `sanity/schemas/singletons/mitzvahProject.ts:27` | `heroImage` | yes |
| `sanity/schemas/singletons/mitzvahProject.ts:59` | `whyImage` | yes |
| `sanity/schemas/singletons/volunteerPage.ts:44` | `whyVolunteerImage` | yes |
| `sanity/schemas/singletons/donatePage.ts:61` | `whyGiveImage` | yes |
| `sanity/schemas/objects/heroSection.ts:25` | `backgroundImage` (used by every singleton that has a `hero` field) | yes |
| `sanity/schemas/objects/programCard.ts:12` | `image` | yes |
| `sanity/schemas/documents/retreat.ts:55` | `coverImage` | yes |
| `sanity/schemas/documents/retreat.ts:67` | gallery item | yes |
| `sanity/schemas/documents/product.ts:57` | `mainImage` | yes |
| `sanity/schemas/documents/product.ts:69` | gallery item | yes |
| `sanity/schemas/documents/recipe.ts:44` | `image` | yes |
| `sanity/schemas/documents/recipe.ts:139` | gallery item | yes |
| `sanity/schemas/documents/communityStory.ts:49` | `image` | yes |
| `sanity/schemas/documents/teamMember.ts:25` | `photo` | yes |
| `sanity/schemas/documents/testimonial.ts:37` | `authorImage` | yes |

### Live data surface — diagnostic output summary

Full output: `audit/2026-04-22/hotspot-diagnostic-output.txt` (265 lines, 44 image field values inspected).

```
=== SUMMARY ===
Total image field values checked: 44
URLs with rect=  : 0
URLs with fp-x=  : 0
URLs with fp-y=  : 0
URLs with crop=  : 44
Hotspots present in docs: 4
  at center (0.5, 0.5 ± 0.01): 1
  offset from center        : 3
```

**All four hotspot-bearing documents are the four team members.** Every other document currently has no hotspot metadata stored:

```
[teamMember] team-andrew-donner  field=photo
  hotspot: {x:0.5, y:0.33}
  URL: …?w=800&h=600&fit=crop&crop=focalpoint
  tokens: w=800 h=600 fit=crop crop=focalpoint rect=<MISSING> fp-x=<MISSING> fp-y=<MISSING>

[teamMember] team-belinda-donner  field=photo
  hotspot: {x:0.5, y:0.5}
  URL: …?w=800&h=600&fit=crop&crop=focalpoint
  tokens: w=800 h=600 fit=crop crop=focalpoint rect=<MISSING> fp-x=<MISSING> fp-y=<MISSING>

[teamMember] team-rabbi-avi-libman  field=photo
  hotspot: {x:0.5, y:0.33}
  URL: …?w=800&h=600&fit=crop&crop=focalpoint
  tokens: w=800 h=600 fit=crop crop=focalpoint rect=<MISSING> fp-x=<MISSING> fp-y=<MISSING>

[teamMember] team-shai-gino  field=photo
  hotspot: {x:0.5, y:0.33}
  URL: …?w=800&h=600&fit=crop&crop=focalpoint
  tokens: w=800 h=600 fit=crop crop=focalpoint rect=<MISSING> fp-x=<MISSING> fp-y=<MISSING>
```

(Note on diagnostic deviation: `src/lib/sanity.ts` reads `import.meta.env`, which is Astro/Vite-only and evaluates to `undefined` under plain Node. Honoring the audit's "import directly from src/lib/sanity.ts" instruction would require editing that file, which the hard rules forbid. The diagnostic therefore reconstructs the client inline with the same `projectId`/`dataset`/`apiVersion`/`useCdn` values and copies `urlForCropped` verbatim. Docstring in the script notes this.)

### CDN ground-truth check (three data points)

Belinda (team member, 2500×3757 webp):
```
no fp:            content-length: 74130   bytes on disk: 74130
+fp-x=0.5&fp-y=0.33  content-length: 52639   bytes on disk: 52639   Δ = -21,491 bytes
```

Water bottle product (1080×1080 webp):
```
no fp:            content-length: 15001   bytes on disk: 15001
+fp-x=0.5&fp-y=0.33  content-length: 15746   bytes on disk: 15746   Δ = +745 bytes
```

First retreat cover (589×589 webp):
```
no fp:            content-length: 69812   bytes on disk: 69812
+fp-x=0.5&fp-y=0.33  content-length: 62596   bytes on disk: 62596   Δ = -7,216 bytes
```

All three responses return HTTP 200. In every case the byte count changes, confirming the CDN produces a different image when fp-x/fp-y are present vs absent. The content itself changes — the focal point is being honored server-side.

### Builder source-of-truth (`node_modules/@sanity/image-url/src/urlForImage.ts:80-87`)

```ts
// If irrelevant, or if we are requested to: don't perform crop/fit based on
// the crop/hotspot.
if (!(spec.rect || spec.focalPoint || spec.ignoreImageParams || spec.crop)) {
  spec = {...spec, ...fit({crop, hotspot}, spec)}
}

return specToImageUrl({...spec, asset})
```

The library's auto-fit (lines 142-206 of the same file) is the **only** path that emits `rect=` to the URL, and it is gated by the condition above. When any of `spec.rect`, `spec.focalPoint`, `spec.ignoreImageParams`, or `spec.crop` is truthy, `fit()` is skipped.

`specToImageUrl` (lines 100-118) emits `fp-x=` / `fp-y=` only when `spec.focalPoint` is set (set by the builder method `.focalPoint(x, y)`, not by `.crop('focalpoint')`).

Calling `.crop('focalpoint')` sets `spec.crop = 'focalpoint'`. This:
- Satisfies the condition at line 82 (makes it `true`), so **`fit()` is skipped** → no `rect=` emitted.
- Does NOT set `spec.focalPoint` → no `fp-x=` / `fp-y=` emitted.
- Does emit `crop=focalpoint` via the generic mapping table (line 29 of SPEC_NAME_TO_URL_NAME_MAPPINGS).

**The library treats `crop=focalpoint` as an instruction to the CDN that says "use the focal point for crop anchoring" — but without sending fp-x/fp-y, the CDN has no focal-point coordinates to anchor on.** The CDN falls back to centered cropping (verified empirically by the Belinda byte-count change: her stored hotspot is at (0.5, 0.5), so her "no fp" and "+fp-x=0.5,fp-y=0.5" renders should be identical; we tested against (0.5, 0.33) and got a different image, which proves the CDN changed behavior based on the presence of fp params).

## Findings

- **Is `.crop('focalpoint')` present in `urlForCropped`?** Yes — see `src/lib/sanity.ts:30`.
- **Do URLs produced by `urlForCropped` contain `fp-x` / `fp-y`?** No. Across all 44 image values tested, zero URLs contain either param.
- **Do URLs produced by `urlForCropped` contain `rect=`?** No. Across all 44 image values tested, zero URLs contain `rect=`.
- **Do URLs contain `crop=focalpoint`?** Yes — every one of the 44 URLs (because `.crop('focalpoint')` is always called).
- **Does the CDN honor `fp-x`/`fp-y` when appended?** Yes. The CDN returns different bytes for the same image asset when fp params are appended vs. absent, across three independent assets (team photo, product, retreat cover).
- **Root cause**: `urlForCropped` sets `spec.crop = 'focalpoint'` but never sets `spec.focalPoint`. In `@sanity/image-url`, `spec.crop` truthiness disables the built-in `fit()` auto-rect computation, while `fp-x`/`fp-y` are only emitted from `spec.focalPoint`. Result: the library emits `w`, `h`, `fit=crop`, `crop=focalpoint` — and nothing that tells the CDN where the focal point actually is.
- **Live-data impact right now**: only **4 documents** in the dataset have hotspot metadata (the 4 team members). Of those, **3 have offset hotspots** (Andrew, Rabbi Avi, Shai: all at `y=0.33`) and **1 is centered** (Belinda at `y=0.5`). So the visual bug is currently observable for 3 team photos on the `/about/team` page. Belinda's photo would not visibly change regardless of the fix because her hotspot is at center.
- **Schema is ready for hotspots everywhere** (22 image fields all declare `options: { hotspot: true }`), but editors have only set hotspots on team photos so far. Other images coincidentally render fine because centered crops of product/retreat/community imagery look OK — but as soon as any editor sets a hotspot on, say, a recipe photo, it will silently not apply.
- **The only page currently affected** is `/about/team` (`src/pages/about/team.astro:15`). All other pages still use bare `urlFor(...).width(...).height(...).url()`, which triggers the library's auto-fit path and **does** emit a correct `rect=` when a hotspot exists in the document — though that code path also skips hotspot handling if either `width` or `height` is missing (see `fit()` at urlForImage.ts:148-154).

### Pages that display images (all potential future consumers)

```
src/pages/about/community-stories.astro         (testimonial.authorImage)
src/pages/about/community-stories/[slug].astro  (communityStory.image)
src/pages/about/story.astro                     (aboutStory.hero.backgroundImage)
src/pages/about/team.astro                      (teamMember.photo — ONLY current urlForCropped user)
src/pages/community/fighting-antisemitism.astro (fightingAntisemitism.hero.backgroundImage)
src/pages/community/recipes.astro               (recipe.image — cards, width only)
src/pages/community/recipes/[slug].astro        (recipe.image — detail)
src/pages/donate.astro                          (donatePage.hero, donatePage.whyGiveImage)
src/pages/get-involved/contact.astro            (contactPage.hero.backgroundImage)
src/pages/get-involved/mitzvah-project.astro    (mitzvahProject.heroImage, whyImage)
src/pages/get-involved/volunteer.astro          (volunteerPage.hero, whyVolunteerImage, testimonial.authorImage)
src/pages/index.astro                           (homepage.heroImage + impact stories testimonial.authorImage)
src/pages/programs/[slug].astro                 (retreat.coverImage, retreat.gallery)
src/pages/programs/heads-up.astro               (headsUp hero/safeHaven/care/community images + testimonials)
src/pages/programs/past-retreats.astro          (retreat.coverImage cards + testimonials)
src/pages/resources.astro                       (resources hero + whyMatters + commonStruggles + signs)
src/pages/shop.astro                            (product.mainImage)
src/pages/shop/[slug].astro                     (product.mainImage, product.gallery)
```

## Open questions

- **Consumers that probably should use `urlForCropped` (fixed aspect ratio, hotspot meaningful) but currently don't**:
  - `src/components/home/ImpactStories.astro:65` — `urlFor(t.authorImage).width(160).height(160).url()` — 1:1 crop on testimonial author headshot. File+line: `src/components/home/ImpactStories.astro:63-66`.
  - `src/pages/get-involved/volunteer.astro:46` — `urlFor(t.authorImage).width(224).height(224).url()` — 1:1 crop on testimonial author headshot.
  - `src/pages/programs/past-retreats.astro:33` — `urlFor(t.authorImage).width(224).height(224).url()` — 1:1 crop.
  - `src/pages/programs/heads-up.astro:61` — `urlFor(t.authorImage).width(224).height(224).url()` — 1:1 crop.
  - `src/pages/about/community-stories.astro:47` — `urlFor(t.authorImage as SanityImageSource).width(640).height(854).url()` — ~3:4 portrait crop.

  These five call sites all set both width AND height, meaning the library's built-in auto-fit path DOES run today and emits `rect=` when a hotspot exists — but once a hotspot is set in Sanity, the visual result will differ from `urlForCropped`'s current bugged output. If `urlForCropped` is fixed, migrating these five to use it centralizes hotspot handling.

- **Consumers with width-only (no height)** — hotspot is not applicable to these today (the library doesn't crop when only one dimension is constrained; `fit()` at urlForImage.ts:148-154 returns early):
  - All hero/background images on every page (homepage, donate, resources, programs/heads-up, etc.): `urlFor(cms.hero.backgroundImage).width(1920).quality(80).url()` — renders the whole image scaled to 1920 wide.
  - Card thumbnails that don't set height: recipes `.width(600)` (community/recipes.astro:17), products `.width(600)` (shop.astro:19), retreats `.width(600)` (past-retreats.astro:17), product gallery `.width(600)` (shop/[slug].astro:117), etc.

  These don't have a fix-required action from the hotspot bug alone, but they're worth an audit pass separately — if card thumbnails visually need aspect-ratio cropping, they're currently relying on CSS `object-cover` to do it, which ignores Sanity hotspots entirely.

- **Should `urlForCropped`'s fix** (a) drop `.crop('focalpoint')` and let the library auto-rect, or (b) keep `.crop('focalpoint')` and additionally read `source.hotspot.{x,y}` to call `.focalPoint(x, y)` explicitly? Both emit correct crops. Option (a) is a one-line delete. Option (b) requires the consumer to pass the full image object (with hotspot) rather than a bare reference, which all current consumers already do. Decision belongs to the fix session.

- **Why does the docstring describe the wrong behavior?** Lines 20-28 of `src/lib/sanity.ts` state: "Sanity's hotspot/crop metadata only takes effect when both width AND height are constrained AND the URL requests `.fit('crop').crop('focalpoint')`." This is contradicted by the library source — `.crop('focalpoint')` actively *disables* the library's auto-rect path. It's possible the author was referencing older Sanity behavior or a different library version. Worth clarifying in the fix session.
