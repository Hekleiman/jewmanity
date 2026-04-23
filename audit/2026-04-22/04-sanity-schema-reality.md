# Phase 4: Sanity schema reality

## What I checked

1. `cat sanity/schemas/index.ts` (schema registration).
2. For every singleton and document type, grepped field names from the schema file.
3. Diffed field lists against the GROQ projections in `src/lib/sanity.ts`.
4. For each GROQ function, grepped `src/` for consumers.
5. Re-verified the four items flagged in the prior audit: `donatePage.faqContext`, `volunteerPage.faqContext`, recipe detail missing fields, `communityStory.body`.
6. Checked each `objects/*.ts` type for at least one consumer.

## Evidence

### `sanity/schemas/index.ts`
Registered types: 21 objects + 8 collection documents + 11 singletons (36 total).

Objects: portableText, heroSection, ctaButton, statItem, valueCard, aboutValueCard, supportCard, experienceItem, carePillar, includedItem, programCard, homepageStat, contactCard, shopImpactIcon, howToHelpCard, donateImpactCard, whyGiveValue, antisemitismStat, antisemitismFormCard, actionStep, antisemitismOrg.

Collections: recipe, retreat, teamMember, product, testimonial, faqItem, communityStory, recommendedArticle.

Singletons: homepage, aboutStory, headsUp, fightingAntisemitism, resources, donatePage, shopPage, volunteerPage, contactPage, mitzvahProject, siteSettings.

### Singleton field ↔ GROQ ↔ consumer diff

| Singleton | GROQ fn | Page consumer | Schema→GROQ issues |
|---|---|---|---|
| homepage | `getHomepage()` | `src/pages/index.astro` | in sync |
| aboutStory | `getAboutStory()` | `src/pages/about/story.astro` | in sync |
| headsUp | `getHeadsUp()` | `src/pages/programs/heads-up.astro` | in sync |
| fightingAntisemitism | `getFightingAntisemitism()` | `src/pages/community/fighting-antisemitism.astro` | in sync |
| resources | `getResources()` | `src/pages/resources.astro` | in sync |
| donatePage | `getDonatePage()` | `src/pages/donate.astro` | **schema has `faqContext` (line 195), not projected by GROQ** |
| shopPage | `getShopPage()` | `src/pages/shop.astro` | in sync |
| volunteerPage | `getVolunteerPage()` | `src/pages/get-involved/volunteer.astro` | **schema has `faqContext` (line 135), not projected by GROQ** |
| contactPage | `getContactPage()` | `src/pages/get-involved/contact.astro` | in sync |
| mitzvahProject | `getMitzvahProject()` | `src/pages/get-involved/mitzvah-project.astro` | in sync |
| siteSettings | `getSiteSettings()` | `src/layouts/Layout.astro` (footer) | in sync |

### Collection ↔ GROQ ↔ consumer diff

| Collection | GROQ fn(s) | Consumer(s) | Issues |
|---|---|---|---|
| recipe | `getRecipes()`, `getRecipeBySlug()` | `src/pages/community/recipes.astro`, `src/pages/community/recipes/[slug].astro` | `getRecipes()` fully in sync with schema. **`getRecipeBySlug()` omits `cookTime`, `difficulty`, `author`, `date`, `notes`, `gallery`, `orderRank`** — but the detail page uses `getRecipes()` via `getStaticPaths` and passes the full object as props (lines 285-294), so `getRecipeBySlug()` is unused in practice. |
| retreat | `getRetreats()`, `getRetreatBySlug()` | `src/pages/programs/past-retreats.astro`, `src/pages/programs/[slug].astro` | both in sync with schema |
| teamMember | `getTeamMembers()` | `src/pages/about/team.astro` | in sync (schema has bio as portableText array, GROQ projects it; consumer reads `m.bio` as an array-of-blocks) |
| product | `getProducts()`, `getProductBySlug()` | `src/pages/shop.astro`, `src/pages/shop/[slug].astro` | both in sync |
| testimonial | `getTestimonials(context?)` | `ImpactStories.astro`, `volunteer.astro`, `past-retreats.astro`, `heads-up.astro`, `community-stories.astro` | in sync — projects `quote, excerpt, authorName, authorRole, authorImage, context, order, slug.current, imageUrl` |
| faqItem | `getFaqItems(context?)` | `donate.astro`, `volunteer.astro`, `mitzvah-project.astro` | in sync |
| communityStory | `getCommunityStories()`, `getCommunityStoryBySlug()` | `about/community-stories.astro`, `about/community-stories/[slug].astro` | **`getCommunityStories()` projects `body` which does not exist in schema** — the schema uses `paragraphs` (line 62). The `body` field will always be undefined. **`getCommunityStoryBySlug()` is exported but never imported** (zero consumers across `src/`). |
| recommendedArticle | `getRecommendedArticles()` | `src/components/community/ResourcesGrid.astro` | in sync |

### Object types — consumer check

Every `sanity/schemas/objects/*.ts` type is referenced as `type: '<name>'` from at least one parent schema (8 singletons use `heroSection`; each other object is used by exactly one parent). No orphaned object schemas.

### Prior-audit items, re-verified against HEAD `fbadfc5`

| Prior-audit claim | Current state |
|---|---|
| `donatePage.faqContext` is declared in the schema but never queried | **Persists.** Schema declares `faqContext` with `initialValue: 'donate'`, `hidden: true` (`sanity/schemas/singletons/donatePage.ts:194-202`). `getDonatePage()` GROQ does not project it. Instead `donate.astro:20` hardcodes `getFaqItems('donate')`. The field is dead schema. |
| `volunteerPage.faqContext` same situation | **Persists.** Schema declares it (`volunteerPage.ts:134-142`). GROQ doesn't project it. `volunteer.astro:55` hardcodes `getFaqItems('volunteer')`. |
| recipe detail page is missing `cookTime`, `difficulty`, `author`, `date`, `notes` in GROQ | **Shape has changed.** The schema now includes all five fields (`recipe.ts:77, 89, 95, 101, 126`). `getRecipes()` (the list query) projects all of them correctly. `getRecipeBySlug()` still omits them — but the detail page (`recipes/[slug].astro`) never calls `getRecipeBySlug()`; it uses `getRecipes()` via `getStaticPaths` and passes the full object in `props.recipe`, so the detail page has access to all fields. The bug is purely in the unused `getRecipeBySlug()` function. |
| `communityStory.body` is queried but not in schema | **Persists.** `getCommunityStories()` (`src/lib/sanity.ts:213`) projects `body`; schema has `paragraphs` not `body`. Consumer (`about/community-stories/[slug].astro:111`) uses `paragraphs`, so the undefined `body` is silently dropped. Dead query field. |

## Findings

Categorized mismatches:

**(a) Field in schema, never queried** — dead schema field:
- `donatePage.faqContext` (`sanity/schemas/singletons/donatePage.ts:194`). Hidden field with `initialValue: 'donate'`, no GROQ reference.
- `volunteerPage.faqContext` (`sanity/schemas/singletons/volunteerPage.ts:134`). Hidden field with `initialValue: 'volunteer'`, no GROQ reference.

**(b) Field queried, not in schema** — returns undefined at runtime:
- `communityStory.body` (`src/lib/sanity.ts:213`) — schema has `paragraphs` instead.

**(c) Field queried + in schema, not consumed by component** — dead query field:
- None identified. Every projected field on a called query is consumed somewhere.

**Dead exports** (function defined, zero import callers):
- `getCommunityStoryBySlug` in `src/lib/sanity.ts:224-236`.
- `getRecipeBySlug` in `src/lib/sanity.ts:60-77` (dead code in practice — `recipes/[slug].astro` sidesteps it).

**No schema-wide orphans**: all 21 object types are referenced; all 8 collection documents and 11 singletons have corresponding GROQ functions + page consumers.

## Open questions

- Should `faqContext` be removed from `donatePage` and `volunteerPage` schemas, or should the consumers switch from hardcoded strings to reading the field? The prior audit noted this too; decision belongs to a cleanup session.
- Should `body` be removed from the `getCommunityStories` GROQ projection, or should the `communityStory` schema add a `body` (portableText) field to match what the query expects? Current state is benign but misleading.
- Should `getCommunityStoryBySlug` and `getRecipeBySlug` be deleted, or kept for future use? They are the only non-list-query export paths for those document types. The two pages that would normally use them (`community-stories/[slug].astro`, `recipes/[slug].astro`) both sidestep by filtering the list query result — a pattern that works but scales poorly if either collection grows.
