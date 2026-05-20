# Prompt: CMS Audit Closeout, Phase 4 of 4 — Long-tail sweep

Hand this to Claude Code from inside `/Users/hek/jewmanity` for a fresh session. Reference: `docs/cms-completeness-audit-2026-05-20.md`. Closes the last bucket of audit gaps: component section headings the pages don't thread through, the mitzvah FAQ heading the May audit missed, image alt fields, and a small set of long-tail labels.

Estimate: 45 to 75 minutes. Many small edits, no big schema design decisions. Each piece touches one or two files. The pattern is the same throughout: extend an existing singleton with a string or text field, thread it down through page → component as a prop, seed with the current hardcoded value.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead.

The repo's `.env` contains a working `SANITY_API_TOKEN`. Seed steps need it.

PR flow per saved memory: `gh pr create` then `gh pr merge --auto --squash --delete-branch`.

Keep the existing audit pattern intact: every component reads CMS first, falls back to a hardcoded default if Sanity returns null. Do not remove the fallbacks.

---

## Pre-flight

```
cd /Users/hek/jewmanity
git fetch origin
git status
git pull --ff-only
```

If the pull errors with "diverging", stop and tell the user. Phases 1 through 3 should already be merged at this point. If they aren't, stop and ask which order to take.

Create a fresh branch:

```
git checkout -b feat/cms-sweep-section-headings
```

---

## Goal of Phase 4

After this PR, every visible heading, subtitle, button label, and image alt that Belinda would reasonably want to edit lives in Sanity. Site fully meets the "Belinda can edit everything" bar.

Eight pieces, ordered from highest severity to lowest:

1. Mitzvah FAQ heading + subtitle (May audit miss, HIGH).
2. About > Team section heading + subtitle (HIGH).
3. Programs > Heads Up testimonial carousel heading + subtitle (HIGH).
4. Community > Recipes grid heading + subtitle (HIGH).
5. Shop product grid heading + subtitle (MEDIUM).
6. Recipe detail page labels (Ingredients, Instructions, Chef's Notes, related recipes heading, metadata labels) (MEDIUM-LOW).
7. Retreat detail labels (Retreat Photos heading, Back link text) (LOW).
8. Image alt text fields on schema images that don't have them yet (MEDIUM).

The 37-country crisis dropdown dataset (`src/components/resources/CrisisResources.astro:111-310`) is intentionally OUT OF SCOPE for this phase. It's a static dataset Belinda will rarely touch, and threading 37 country entries plus per-country phone numbers into Sanity is more work than the value justifies. If she ever needs to add or remove a country, a dev makes the edit.

---

## Piece 1: Mitzvah FAQ heading + subtitle (audit §1.13, May audit miss)

File: `src/pages/get-involved/mitzvah-project.astro:106-107`. Currently hardcoded:

```
<h2>Frequently Asked Questions</h2>
<p>Have questions? We're here to help.</p>
```

Schema change: `sanity/schemas/singletons/mitzvahProject.ts`. Add two fields:

- `faqHeading` (string) — title "FAQ Section Heading"
- `faqSubtitle` (text, rows 2) — title "FAQ Section Subtitle"

Group both under an existing or new "FAQ Section" fieldset for editor clarity.

Code change: pass the new fields from `mitzvahProject` to wherever the FAQ heading renders on the page. Fall back to the current hardcoded strings if CMS returns null.

Seed: extend whatever `scripts/seed-*.ts` covers `mitzvahProject` (or add a small one-off script) to populate the new fields with the current strings.

---

## Piece 2: About > Team section heading + subtitle (audit §1.3)

File: `src/components/about/TeamGrid.astro:50-54`. Currently hardcoded:

```
<h2>Our Team</h2>
<p>A group of leaders, advocates, and community members...</p>
```

Schema change: `sanity/schemas/singletons/aboutTeamPage.ts`. Add:

- `teamSectionHeading` (string) — current value "Our Team"
- `teamSectionSubtitle` (text, rows 3) — current value (read the exact paragraph from `TeamGrid.astro` lines 52 to 54)

Code change: `src/pages/about/team.astro` fetches `aboutTeamPage` already; pass the two new fields as props to `<TeamGrid />`. Update `TeamGrid.astro` to accept the props with the current strings as fallbacks.

Seed: extend the existing aboutTeamPage seed.

---

## Piece 3: Heads Up testimonial carousel heading + subtitle (audit §1.6)

File: `src/pages/programs/heads-up.astro:117-118`. Currently hardcoded:

```
<TestimonialCarousel
  heading="Voices from Heads Up"
  subtitle="Honest reflections from soldiers and family members who have walked this path."
  ...
/>
```

Schema change: `sanity/schemas/singletons/headsUp.ts`. Add:

- `testimonialsHeading` (string) — current value "Voices from Heads Up"
- `testimonialsSubtitle` (text, rows 2) — current value as above

Code change: `src/pages/programs/heads-up.astro` already fetches `headsUp`. Pass the new fields to `<TestimonialCarousel />` with the current hardcoded strings as fallbacks.

Seed: extend the headsUp seed.

Note: the May audit explicitly flagged this in its punch list but the schema fields were never added. This piece closes that miss.

---

## Piece 4: Community > Recipes grid heading + subtitle (audit §1.10)

File: `src/components/community/RecipeGrid.astro:75-80`. Currently hardcoded:

```
<h2>From Our Table to Yours</h2>
<p>Delicious recipes passed down...</p>
```

Schema change: `sanity/schemas/singletons/communityRecipesPage.ts`. Add:

- `gridHeading` (string) — current value "From Our Table to Yours"
- `gridSubtitle` (text, rows 3) — current value (exact paragraph from `RecipeGrid.astro`)

Code change: `src/pages/community/recipes.astro` already fetches the singleton. Thread the two fields into `<RecipeGrid />` as props with hardcoded fallbacks.

Seed: extend the communityRecipesPage seed.

---

## Piece 5: Shop product grid heading + subtitle (audit cross-cutting)

Inspect `src/components/shop/ProductGrid.astro` for an "Our Current Collection" heading (per audit). If found:

Schema change: `sanity/schemas/singletons/shopPage.ts`. Add:

- `gridHeading` (string)
- `gridSubtitle` (text, rows 3)

Same pattern as the recipes grid: thread through page, fallback to current strings, seed.

If the exact strings differ slightly from what's in the audit doc, use what the file actually contains today. Read the file, do not trust the audit doc verbatim for this one.

---

## Piece 6: Recipe detail page labels (audit §1.11)

File: `src/components/community/RecipePage.astro`. Multiple small labels:

- `:222` "Ingredients" section label
- `:242` "Instructions" section label
- `:262` "Chef's Notes" label
- `:271-275` "Share This Recipe" heading + the "shared with love from our community" subtitle
- `:286` "Copy Link" button text
- `:295` "Print Recipe" button text
- `:303` "More from Our Table" related-recipes heading
- `:323` "View All Recipes →" link text
- `:172,182,192,202` Metadata labels: "Prep", "Cook", "Servings", "Difficulty"

Schema change: `sanity/schemas/singletons/communityRecipesPage.ts`. Add a new fieldset called "Recipe Detail Page Labels" grouping these strings:

- `detailIngredientsLabel` (string), default "Ingredients"
- `detailInstructionsLabel` (string), default "Instructions"
- `detailChefsNotesLabel` (string), default "Chef's Notes"
- `detailShareHeading` (string), default "Share This Recipe"
- `detailShareSubtitle` (text, rows 3), default current text from `:271-275`
- `detailCopyLinkText` (string), default "Copy Link"
- `detailPrintText` (string), default "Print Recipe"
- `detailRelatedHeading` (string), default "More from Our Table"
- `detailViewAllText` (string), default "View All Recipes →"
- `detailPrepLabel` (string), default "Prep"
- `detailCookLabel` (string), default "Cook"
- `detailServingsLabel` (string), default "Servings"
- `detailDifficultyLabel` (string), default "Difficulty"

Code change: page `src/pages/community/recipes/[slug].astro` fetches `communityRecipesPage` and threads the labels to `<RecipePage />` via props. Add a `labels` prop object to `RecipePage.astro` to keep the prop list manageable. Fall back to current hardcoded strings if CMS missing.

The "Copied!" and "Copy failed" transient JS strings stay in code; threading runtime states through CMS is more friction than value.

The breadcrumb labels "Community" and "Recipes" at `:64-70` also stay in code; they derive from nav structure but threading them now would couple this PR to the navigation singleton in ways that complicate review.

Seed: extend the communityRecipesPage seed with the new label values.

---

## Piece 7: Retreat detail labels (audit §1.8)

File: `src/components/programs/RetreatArticle.astro`:

- `:50` "Retreat Photos" gallery heading
- `:152` "Back to Past Retreats" link text

Schema change: `sanity/schemas/singletons/programsPastRetreatsPage.ts` (the singleton already exists; verify). Add:

- `detailGalleryHeading` (string), default "Retreat Photos"
- `detailBackLinkText` (string), default "Back to Past Retreats"

Code change: `src/pages/programs/[slug].astro` fetches the singleton (or fetches the retreat doc plus the parent singleton). Pass the two labels as props to `RetreatArticle.astro`. Fallback to current strings.

Seed: extend the programsPastRetreatsPage seed.

---

## Piece 8: Image alt text on schema images

The audit flagged ~8 places where component images have hardcoded alt attributes even though the image src can come from CMS. The image schema fields in Sanity should always carry an `alt` field; the components should read `image.alt` instead of using a hardcoded string.

For each location below, inspect the image field definition in its schema and ensure an `alt` subfield exists. If not, add it. Then update the rendering component to use `image.alt` with the current hardcoded string as fallback.

Components to audit (find by grepping for `alt=` in components that consume CMS images):

- `src/components/home/SafeHaven.astro` (and similar "Safe, supportive retreat environment..." style alts)
- `src/components/home/WhyGive.astro`
- `src/components/home/Hero.astro` (hero image fallback alt is fine to leave in code; the schema already supports `homepage.heroImageAlt`)
- `src/components/about/StoryContent.astro` (if it has any)
- Any `src/components/programs/*.astro` with a CMS image and a hardcoded alt
- `src/components/community/RecipePage.astro` recipe hero image (recipe schema's `coverImage.alt`)

For each: schema gets an `alt` field on the image object (set as a string, with optional initial value matching current hardcoded text). Component reads `image.alt` with fallback. Seed extends the relevant singleton or document type with the alt text it should carry.

If a schema image object is shared across many singletons via an object type (`sanity/schemas/objects/`), edit the shared object once.

---

## Cross-cutting checks before opening PR

1. `npm run build` succeeds with no TypeScript errors.
2. `npm run dev` renders every touched page with no visible regressions. Headings, subtitles, button labels, and image alts match the current production text.
3. Open each touched singleton in Studio (`cd sanity && npx sanity dev`) and confirm every new field is editable and shows the seeded value.
4. Edit one seeded value in Studio (say, change the recipes grid heading from "From Our Table to Yours" to a test string), save, restart dev, confirm the change appears on the rendered page. Revert the edit when done.
5. The audit doc's HIGH-severity items in §1.3, §1.6, §1.10, §1.11, §1.13 are all closed.

---

## Commit and PR

```
git add -A
git commit -m "feat(cms): long-tail sweep of section headings, FAQ, recipe labels, alts

Closes the final tier of the 2026-05-20 CMS completeness audit.

- Mitzvah FAQ heading + subtitle (May audit miss)
- Team section heading + subtitle
- Heads Up testimonials heading + subtitle
- Recipes grid heading + subtitle
- Shop product grid heading + subtitle
- Recipe detail labels (Ingredients, Instructions, Chef's Notes, share
  card, copy/print buttons, related recipes, prep/cook/servings/difficulty)
- Retreat detail gallery heading + back link
- Alt text fields on schema images

Belinda now controls every visible heading, subtitle, label, and image
alt across the site from Studio. The 37-country crisis dropdown remains
in code by design (low edit frequency, schema bloat outweighs value).

Closes Phase 4 of 4."
git push -u origin feat/cms-sweep-section-headings
gh pr create --fill
gh pr merge --auto --squash --delete-branch
```

---

## After this phase

The 2026-05-20 CMS completeness audit is fully closed. The site meets the "Belinda can edit everything" bar. Optional follow-ups (not part of this audit):

- Onboarding doc for Belinda walking through Studio (which singleton controls what).
- Sanity Studio desk structure improvements: group related singletons under folder headings so the sidebar is easier to scan.
- Migrate fallback content out of code entirely once Belinda has populated everything in Studio (lowers the risk of fallback/CMS drift). Defer until she has actually edited each surface at least once.
