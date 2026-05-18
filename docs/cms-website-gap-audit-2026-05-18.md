# CMS ↔ Website Gap Audit, 2026-05-18

Read-only audit of where the Sanity CMS and the rendered Astro site disagree, as of 2026-05-18. This focuses narrowly on drift between `sanity/schemas/`, the GROQ queries in `src/lib/sanity.ts`, the consuming pages under `src/pages/`, and the seed scripts under `scripts/seed-*.ts`. Working tree is clean (current branch `great-volhard-b7c625`, up to date with `origin/main`). The April 2026 baseline is `docs/project-audit-2026-04-20.md`; deltas from that baseline are called out inline.

## Executive Summary

The worst editor-facing gaps right now are silent ones, where the CMS implies an editor can change something but the site ignores the value. Three stand out. First, `src/pages/programs/past-retreats.astro` fetches retreats from Sanity, maps them into `cmsRetreats`, then renders `<RetreatGrid />` without passing the prop, so the grid always shows the hardcoded 4-card fallback no matter what is in the CMS. Second, `src/pages/about/community-stories/[slug].astro` filters `getStaticPaths` against a hardcoded six-slug allowlist, so any new `communityStory` document an editor creates with a different slug will not get a page built. Third, the `inStock` field on `product` is queried but never read in the shop page or `ProductDetail.astro`, so the "Add to Cart" button shows for sold-out items despite the schema description promising it controls visibility. Additional dead pulls (fields requested by GROQ but never displayed) exist on `mitzvahProject` (`openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution`), `resources` (`disclaimer`), `siteSettings` (`footerTagline`), and every page that fetches a `heroSection` object (`heroSection.ctas` is in every singleton's hero but never rendered). The April audit's `faqContext` claim is now stale: the field has been removed from both `donatePage` and `volunteerPage` schemas, but `scripts/seed-donate-page.ts` and `scripts/seed-volunteer-page.ts` still write `faqContext` on the documents they create.

---

## 1. Three-way field reconciliation (per document type)

For each document type, fields are checked across: schema declaration (`sanity/schemas/`), GROQ projection (`src/lib/sanity.ts`), and page reads (`src/pages/**`, `src/components/**`). Only gaps are listed in detail; fully-aligned fields are not enumerated.

### 1.1 `homepage` (singleton)

Schema: `sanity/schemas/singletons/homepage.ts`. GROQ: `getHomepage()` at `src/lib/sanity.ts:189`. Page: `src/pages/index.astro`.

- No gaps. All 20 schema fields are queried, all queried fields are read by `index.astro` or the components it passes them to.
- Programs grid fields (`programCard.image`, `alt`, `title`, `description`, `href`) are all read at `src/pages/index.astro:21` through `Hero`, `HowWeHelp`, `DonationCTA`, `Newsletter`, `StatsBar`.

### 1.2 `aboutStory` (singleton)

Schema: `sanity/schemas/singletons/aboutStory.ts`. GROQ: `getAboutStory()` at `src/lib/sanity.ts:215`. Page: `src/pages/about/story.astro`.

- Schema fields queried and read: `hero` (heading/subtitle/backgroundImage), `storyHeading`, `storyBody`, `valuesHeading`, `valuesSubtitle`, `values`, `ctaHeading`, `ctaDescription`, `ctaPrimaryButton`, `ctaSecondaryButton`.
- **Dead pull**: `hero.ctas` is included in the `hero` projection at `src/lib/sanity.ts:218`, but `src/pages/about/story.astro:32-50` only reads `hero.heading`, `hero.subtitle`, `hero.backgroundImage`. This applies to every singleton that uses the `heroSection` object (see section 6).

### 1.3 `headsUp` (singleton)

Schema: `sanity/schemas/singletons/headsUp.ts`. GROQ: `getHeadsUp()` at `src/lib/sanity.ts:232`. Page: `src/pages/programs/heads-up.astro`.

- All 27 schema fields are queried and read.
- **Dead pull**: `hero.ctas` (same pattern as above).
- Note: `TestimonialCarousel` heading/subtitle on this page are hardcoded ("Voices from Heads Up", `src/pages/programs/heads-up.astro:116-117`), not pulled from CMS. The `headsUp` schema does not declare these fields, so this is intentional, not a gap.

### 1.4 `fightingAntisemitism` (singleton)

Schema: `sanity/schemas/singletons/fightingAntisemitism.ts`. GROQ: `getFightingAntisemitism()` at `src/lib/sanity.ts:266`. Page: `src/pages/community/fighting-antisemitism.astro`.

- All schema fields are queried and read.
- **Dead pull**: `hero.ctas`.

### 1.5 `resources` (singleton)

Schema: `sanity/schemas/singletons/resources.ts`. GROQ: `getResources()` at `src/lib/sanity.ts:291`. Page: `src/pages/resources.astro`.

- **Dead pull**: `disclaimer` is queried at `src/lib/sanity.ts:313` and the schema label is even "Page Footer Disclaimer (unused)" (`sanity/schemas/singletons/resources.ts:259`). Page never reads it. Schema description openly admits it is not rendered.
- **Dead pull**: `hero.ctas`.
- **Partial pull**: `crisisResources` is queried but `src/pages/resources.astro:67-69` filters to `region === 'United States'` and discards everything else. Editor adding an Israel-region or International-region crisis resource will see it persist in Studio but never render. The schema description at line 211 hints this ("the 'United States' card is rendered from entries whose region is 'United States'") but does not say other regions are dropped silently.

### 1.6 `donatePage` (singleton)

Schema: `sanity/schemas/singletons/donatePage.ts`. GROQ: `getDonatePage()` at `src/lib/sanity.ts:318`. Page: `src/pages/donate.astro`.

- All 21 schema fields are queried and read.
- **Dead pull**: `hero.ctas`.
- **Stale claim from April audit**: the April audit (line 184, 208) says `donatePage.faqContext` is "declared in schema, never queried." As of 2026-05-18 the field is no longer declared in `sanity/schemas/singletons/donatePage.ts`. However `scripts/seed-donate-page.ts:161` still writes `faqContext: 'donate'` on the seeded document. So Sanity stores a value that has no matching schema field, no GROQ pull, no page consumption. (Sanity allows unknown fields to persist on documents.) See section 9.

### 1.7 `shopPage` (singleton)

Schema: `sanity/schemas/singletons/shopPage.ts`. GROQ: `getShopPage()` at `src/lib/sanity.ts:346`. Page: `src/pages/shop.astro`.

- All schema fields are queried and read.
- **Dead pull**: `hero.ctas`.

### 1.8 `volunteerPage` (singleton)

Schema: `sanity/schemas/singletons/volunteerPage.ts`. GROQ: `getVolunteerPage()` at `src/lib/sanity.ts:361`. Page: `src/pages/get-involved/volunteer.astro`.

- All 21 schema fields are queried and read.
- **Dead pull**: `hero.ctas`.
- **Stale claim from April audit**: same as `donatePage`. `volunteerPage.faqContext` was removed from the schema since April, but `scripts/seed-volunteer-page.ts:121` still seeds it.

### 1.9 `contactPage` (singleton)

Schema: `sanity/schemas/singletons/contactPage.ts`. GROQ: `getContactPage()` at `src/lib/sanity.ts:389`. Page: `src/pages/get-involved/contact.astro`.

- All 6 schema fields are queried and read.
- **Dead pull**: `hero.ctas`.

### 1.10 `mitzvahProject` (singleton)

Schema: `sanity/schemas/singletons/mitzvahProject.ts`. GROQ: `getMitzvahProject()` at `src/lib/sanity.ts:402`. Page: `src/pages/get-involved/mitzvah-project.astro`.

- **Three dead pulls**:
  - `openingQuote` queried at `src/lib/sanity.ts:407`. Page never reads.
  - `inspirationalQuote` queried at `src/lib/sanity.ts:421`. Page never reads.
  - `inspirationalQuoteAttribution` queried at `src/lib/sanity.ts:422`. Page never reads.
- **Dead schema sub-fields**: `steps[].label`, `steps[].description`, `steps[].actions`, `steps[].tip` are declared in the schema with notes like "Retained for future use. Not currently rendered." (`sanity/schemas/singletons/mitzvahProject.ts:126-156`). They flow through the GROQ as part of `steps`, but `src/pages/get-involved/mitzvah-project.astro:93` passes `steps` to `HowItWorks` which (per the schema's own description) renders only the title and number. Editor expectations are correctly managed by the schema description, but the fields are still there.
- FAQ heading/subtitle on this page are HARDCODED at `src/pages/get-involved/mitzvah-project.astro:106-107`. The `mitzvahProject` schema does not declare these (unlike `donatePage` and `volunteerPage` which do). So an editor cannot change "Frequently Asked Questions" / "Have questions? We're here to help." on the mitzvah page from Studio.

### 1.11 `siteSettings` (singleton)

Schema: `sanity/schemas/singletons/siteSettings.ts`. GROQ: `getSiteSettings()` at `src/lib/sanity.ts:436`. Consumer: `src/components/Footer.astro` via `src/layouts/Layout.astro:22`.

- **Dead pull**: `footerTagline` is queried at `src/lib/sanity.ts:442` but `src/components/Footer.astro` never reads it. The footer renders only `orgName`, `ein`, `copyrightText`, and the four `socialLinks`. An editor changing the tagline in Studio will see no effect on the site.

### 1.12 `recipe` (collection)

Schema: `sanity/schemas/documents/recipe.ts`. GROQ: `getRecipes()` at `src/lib/sanity.ts:41`. Consumers: `src/pages/community/recipes.astro` (listing), `src/pages/community/recipes/[slug].astro` (detail).

- All schema fields are queried.
- Listing reads only `title`, `description`, `tags`, `slug`, `image`.
- Detail reads `title`, `description`, `culturalContext`, `ingredients`, `instructions`, `image`, `gallery`, `prepTime`, `cookTime`, `servings`, `difficulty`, `author`, `date`, `notes`. `orderRank` is used implicitly by GROQ sorting.
- No gaps.

### 1.13 `retreat` (collection)

Schema: `sanity/schemas/documents/retreat.ts`. GROQ: `getRetreats()` at `src/lib/sanity.ts:66`. Consumers: `src/pages/programs/[slug].astro` (detail), `src/pages/programs/past-retreats.astro` (listing).

- **Major silent gap**: `src/pages/programs/past-retreats.astro` calls `getRetreats()` at line 11 and builds `cmsRetreats` at lines 12-21, but then renders `<RetreatGrid />` with NO props at line 47. `RetreatGrid` accepts an optional `retreats` prop (`src/components/programs/RetreatGrid.astro:13`) and falls back to a hardcoded 4-card array if absent. Result: the listing always shows the four hardcoded fallback retreats and ignores Sanity entirely. An editor adding, editing, or removing retreats sees no change on `/programs/past-retreats`.
- Detail page `src/pages/programs/[slug].astro:14-19` reads `title`, `subtitle`, `author`, `coverImage`, `gallery`, `body`. `date`, `participants`, `location`, `orderRank` are queried but not rendered on the detail page. (Listing uses `location` and `subtitle`, so the queries themselves are not dead, but the detail page does not surface participant counts or dates.)

### 1.14 `teamMember` (collection)

Schema: `sanity/schemas/documents/teamMember.ts`. GROQ: `getTeamMembers()` at `src/lib/sanity.ts:85`. Consumer: `src/pages/about/team.astro`.

- Page reads `name`, `role`, `bio`, `photo`. `orderRank` is used by GROQ sorting.
- No gaps.

### 1.15 `product` (collection)

Schema: `sanity/schemas/documents/product.ts`. GROQ: `getProducts()` at `src/lib/sanity.ts:98`. Consumers: `src/pages/shop.astro` (listing), `src/pages/shop/[slug].astro` (detail), `src/components/shop/ProductDetail.astro`.

- **Dead pull / undocumented behavior gap**: `inStock` is queried at `src/lib/sanity.ts:110` but is NEVER read on the listing page (`src/pages/shop.astro:11-23`), the detail page (`src/pages/shop/[slug].astro:106-118`), or the detail component (`src/components/shop/ProductDetail.astro`). The schema description at `sanity/schemas/documents/product.ts:85` promises: "Turn off to hide the 'Add to Cart' button when sold out." That behavior is not implemented. Sold-out products show "Add to Cart" everywhere.
- Other fields (`name`, `slug`, `price`, `description`, `snipcartId`, `mainImage`, `gallery`, `features`) all wired through correctly.

### 1.16 `testimonial` (collection)

Schema: `sanity/schemas/documents/testimonial.ts`. GROQ: `getTestimonials(context?)` at `src/lib/sanity.ts:116`. Consumers: `src/components/home/ImpactStories.astro`, `src/pages/programs/heads-up.astro`, `src/pages/programs/past-retreats.astro`, `src/pages/get-involved/volunteer.astro`, `src/pages/about/community-stories.astro`.

- All queried fields (`quote`, `excerpt`, `authorName`, `authorRole`, `authorImage`, `context`, `order`, `slug`, `imageUrl`) are read across the various consumers.
- No gaps.

### 1.17 `faqItem` (collection)

Schema: `sanity/schemas/documents/faqItem.ts`. GROQ: `getFaqItems(context?)` at `src/lib/sanity.ts:137`. Consumers: `src/pages/donate.astro`, `src/pages/get-involved/volunteer.astro`, `src/pages/get-involved/mitzvah-project.astro`.

- All queried fields (`question`, `answer`, `context`, `orderRank`) are read.
- The schema's `context` options list (`sanity/schemas/documents/faqItem.ts:27-31`) includes `volunteer`, `donate`, `mitzvah`, `general`. All four are exercised by the three consuming pages (general appears via the `||` fallback in the GROQ at `src/lib/sanity.ts:140`). No gaps.

### 1.18 `communityStory` (collection)

Schema: `sanity/schemas/documents/communityStory.ts`. GROQ: `getCommunityStories()` at `src/lib/sanity.ts:153`. Consumer: `src/pages/about/community-stories/[slug].astro`.

- All queried fields are read by the slug page.
- **No consumer for the listing**: `src/pages/about/community-stories.astro` does not call `getCommunityStories()`. It uses `getTestimonials()` instead (`src/pages/about/community-stories.astro:35`). So `communityStory` documents only ever appear on individual detail pages, never on a listing. There is no aggregate community-stories index page that surfaces them.
- See section 5 for the related `getStaticPaths` allowlist gap.

### 1.19 `recommendedArticle` (collection)

Schema: `sanity/schemas/documents/recommendedArticle.ts`. GROQ: `getRecommendedArticles()` at `src/lib/sanity.ts:173`. Consumer: `src/components/community/ResourcesGrid.astro`.

- All queried fields (`title`, `publication`, `date`, `url`, `description`, `order`) are read.
- No gaps.

---

## 2. Orphan queries and orphan doc types

### 2.1 Orphan query functions

Grepping for each exported function name across `src/`:

| Function | Imported by | Status |
|---|---|---|
| `getRecipes` | `src/pages/community/recipes.astro`, `src/pages/community/recipes/[slug].astro` | Used |
| `getRetreats` | `src/pages/programs/[slug].astro`, `src/pages/programs/past-retreats.astro` | Used (but see section 1.13 for unused result) |
| `getTeamMembers` | `src/pages/about/team.astro` | Used |
| `getProducts` | `src/pages/shop.astro`, `src/pages/shop/[slug].astro` | Used |
| `getTestimonials` | 5 callers | Used |
| `getFaqItems` | 3 callers | Used |
| `getCommunityStories` | `src/pages/about/community-stories/[slug].astro` | Used |
| `getRecommendedArticles` | `src/components/community/ResourcesGrid.astro` | Used |
| `getHomepage`, `getAboutStory`, `getHeadsUp`, `getFightingAntisemitism`, `getResources`, `getDonatePage`, `getShopPage`, `getVolunteerPage`, `getContactPage`, `getMitzvahProject`, `getSiteSettings` | Each used by exactly one page or layout | Used |

No orphan query functions found.

**Correction to April audit**: The April audit (line 245-252 of `docs/project-audit-2026-04-20.md`) listed `getRecipeBySlug`, `getRetreatBySlug`, `getProductBySlug`, `getCommunityStoryBySlug` as orphan exports. As of 2026-05-18 those functions are no longer exported from `src/lib/sanity.ts`. Grep for `BySlug` across `src/` returns no matches. So the April finding is now stale: the cleanup happened.

### 2.2 Orphan document types

Every type in `sanity/schemas/index.ts:73-93` (8 collections + 11 singletons = 19 types) has a consuming page or component. No orphan document types.

---

## 3. Hardcoded content drift

For each page that fetches a singleton, the catch-block or `??` fallback was compared to what is currently in the seed file.

### 3.1 Homepage (`src/pages/index.astro`)

- Page passes all fields through with no `??` defaults; relies entirely on `cms?.*` chaining and components' own defaults.
- Components (e.g., `Hero`, `HowWeHelp`) define their own hardcoded fallbacks. If CMS is empty, the page renders blank section frames. This is structurally consistent with the schema.
- Seed (`scripts/seed-homepage.ts`) is fully aligned with the schema and the page expectations.

### 3.2 About Story (`src/pages/about/story.astro`)

- Page provides `??` fallbacks for: `hero.heading`, `hero.subtitle`, `hero.backgroundImage` (uses `/images/hero/about-story.jpg`), `ctaHeading`, `ctaDescription`, `ctaPrimaryButton`, `ctaSecondaryButton`.
- Fallback CTA text differs from typical seed values; consult `scripts/seed-about-story.ts` for the canonical seed.
- Structurally compatible with the schema.

### 3.3 Heads Up (`src/pages/programs/heads-up.astro`)

- Page provides `??` fallbacks for hero fields and `ctaHeading`, `ctaSubtitle`, `ctaPrimaryButton`.
- Inline fallback testimonial at lines 68-75 (one entry) is shorter than what the CMS seed would provide.
- TestimonialCarousel heading/subtitle are hardcoded ("Voices from Heads Up", lines 116-117). These have no CMS equivalent.
- Structurally compatible.

### 3.4 Fighting Antisemitism (`src/pages/community/fighting-antisemitism.astro`)

- Hero, CTA primary, CTA secondary all have `??` fallbacks.
- `ResourcesGrid` component embeds 6 hardcoded fallback articles and 6 hardcoded fallback organizations (`src/components/community/ResourcesGrid.astro:26-84`). These are MUCH richer than the fightingAntisemitism singleton's `organizations` field if empty, and the articles fallback bypasses `recommendedArticle` documents entirely if Sanity is empty.
- Structurally compatible with schema.

### 3.5 Resources (`src/pages/resources.astro`)

- Page provides `??` fallbacks only for hero. Everything else falls through to component-level defaults.
- Structurally compatible.

### 3.6 Donate (`src/pages/donate.astro`)

- Page provides `??` fallbacks for: hero background image, `ctaContactLink`, `faqHeading`, `faqSubtitle`, `ctaHeading`, `ctaDescription`, `ctaContactPrompt`.
- `fallbackFaqs` array at lines 38-45 contains 6 FAQ entries. If Sanity returns zero `faqItem` documents with `context == "donate"` (or "general"), the user sees these hardcoded FAQs instead.
- Structurally compatible with the schema and the donatePage seed.

### 3.7 Shop (`src/pages/shop.astro`)

- Page provides `??` fallbacks for hero, hero CTA, and `ctaPrimaryButton`.
- `ProductGrid` falls through to its own internal fallback list if `cmsProducts` is empty.
- Structurally compatible.

### 3.8 Volunteer (`src/pages/get-involved/volunteer.astro`)

- Page provides `??` fallbacks for hero, CTAs, FAQ heading/subtitle, testimonials heading/subtitle.
- `fallbackFaqs` array at lines 90-98 contains 7 FAQ entries.
- `fallbackTestimonials` array at lines 77-88 contains 2 testimonials.
- Structurally compatible with the schema and the volunteerPage seed.

### 3.9 Contact (`src/pages/get-involved/contact.astro`)

- Page provides `??` fallbacks for hero and intro text.
- Structurally compatible.

### 3.10 Mitzvah Project (`src/pages/get-involved/mitzvah-project.astro`)

- Page provides no explicit `??` fallbacks at the top level; relies on component-level defaults.
- `fallbackFaqItems` array at lines 39-68 contains 7 FAQ entries.
- FAQ heading/subtitle are hardcoded in the page itself (not in CMS), unlike `donatePage` and `volunteerPage`.
- Structurally compatible with the schema.

**Pages where the hardcoded fallback is richer than what is currently in Sanity (the "CMS thinks the page is empty, but the rendered site has lots of content" case)** cannot be confirmed without hitting the Sanity API (out of scope for this audit), but `ResourcesGrid.astro` (6 articles + 6 organizations hardcoded) and `RetreatGrid.astro` (4 retreats hardcoded) are the most likely candidates given how their pages are wired (see sections 1.13 and 4.1).

---

## 4. Components that bypass the CMS

### 4.1 `src/components/programs/RetreatGrid.astro`

- Accepts `retreats?` prop but the only page rendering it (`src/pages/programs/past-retreats.astro:47`) does not pass it. So it always uses its hardcoded fallback array of 4 retreats.
- Heading ("Stories of courage, connection, and healing") and subtitle paragraph are hardcoded in the component (`src/components/programs/RetreatGrid.astro:55-59`) with no prop interface.
- **Real gap**, not intentional. The page even fetches and shapes the data; it just forgets to pass it.

### 4.2 `src/components/home/Newsletter.astro`

- Mailchimp endpoint hardcoded at line 23: `https://gmail.us13.list-manage.com/subscribe/post?u=63c97041047a0d6a6e1c61091&id=728dc5cdc2&f_id=0008a0e0f0`.
- Honeypot field name `b_63c97041047a0d6a6e1c61091_728dc5cdc2` matches the same Mailchimp list.
- Accepts `heading` and `description` props from CMS (homepage singleton). Endpoint, list ID, and honeypot are intentionally out of CMS reach. This is appropriate: list endpoints are deploy-time configuration, not editorial content.

### 4.3 `src/components/shop/ProductCard.astro` and `ProductDetail.astro`

- Snipcart integration uses product fields (`snipcartId`, `name`, `price`, etc.) from CMS data, so cards are content-driven.
- Snipcart API key is in `src/layouts/Layout.astro:29` via `PUBLIC_SNIPCART_API_KEY` env var with a TEST fallback. Intentionally bypasses CMS.
- **Gap**: `inStock` is never checked (see section 1.15).

### 4.4 `src/components/contact/ContactForm.astro`

- Formspree endpoint hardcoded at line 20: `https://formspree.io/f/mykopjon`.
- Accepts `heading` and `privacyNote` props from `contactPage`. Form fields, subject options, submit behavior are not CMS-driven, and the `contactPage` schema (`sanity/schemas/singletons/contactPage.ts:36`) calls this out explicitly. Appropriate.

### 4.5 `src/components/volunteer/VolunteerForm.astro`

- Formspree endpoint hardcoded at line 25: `https://formspree.io/f/mwvyqbze`.
- Accepts `heading`, `subtitle`, `privacyNote` props from `volunteerPage`. Form fields, interests checklist, availability dropdown, referral options are all hardcoded in the component. The `volunteerPage` schema notes this at `sanity/schemas/singletons/volunteerPage.ts:138`. Appropriate, but note the referral and interests lists are duplicated between the form and any potential CMS-managed copy.

### 4.6 Shared components from `src/components/shared/`

- `HeroSection.astro`, `CTASection.astro`, `FAQAccordion.astro`, `TestimonialCarousel.astro` all take typed props from the parent page. They do not fetch CMS data themselves. No gap.

### 4.7 `src/components/about/StoryContent.astro` and `ValuesGrid.astro`, etc.

- All accept CMS props from `src/pages/about/story.astro`. No bypass.

### 4.8 Page-level hardcoded headings on CMS-aware pages

- `src/pages/about/team.astro` does not consult any singleton (no `aboutTeamPage` schema exists). The hero heading, subtitle, and CTA are all hardcoded at lines 23-32. An editor cannot change "Meet the People Behind Jewmanity" without code edits.
- `src/pages/about/community-stories.astro` similarly has no singleton; all chrome (hero, intro paragraphs, "Voices from Our Community" heading, CTA) is hardcoded at lines 60-138. Only the testimonial list itself is CMS-driven.
- `src/pages/community/recipes.astro` has no singleton; hero, intro, and CTA are hardcoded.
- `src/pages/programs/past-retreats.astro` has no singleton; hero and CTA are hardcoded.

These are genuine editor gaps. Whether they are intentional or just unimplemented is a product decision, but the schema layer is currently silent about them.

---

## 5. Dynamic route coverage

### 5.1 `/programs/[slug]` (`src/pages/programs/[slug].astro`)

- `getStaticPaths` at line 14 awaits `getRetreats()` and maps every returned slug. No fallback array.
- **Risk**: If `getRetreats()` throws, the build fails. There is no try/catch around `getRetreats()` here, unlike every other page. (The listing page has a try/catch; this slug page does not.)
- No fallback slug list exists. Any retreat in Sanity becomes a page; no retreat means no detail pages. The "more entries in CMS than fallback" case is not possible (and there is no fallback to be richer than CMS).

### 5.2 `/community/recipes/[slug]` (`src/pages/community/recipes/[slug].astro`)

- `getStaticPaths` at line 282: if CMS returns any recipes, uses CMS slugs exclusively. If CMS returns zero recipes, uses the 7 hardcoded fallback slugs from `allRecipes` at lines 24-278.
- **Drift**: `relatedRecipes` at lines 360-368 always pulls from the hardcoded `allRecipes` object, even when the page itself was generated from a CMS recipe. So a CMS-driven recipe page shows related recipes from the hardcoded fallback set, and the editor cannot influence the related list.

### 5.3 `/about/community-stories/[slug]` (`src/pages/about/community-stories/[slug].astro`)

- `getStaticPaths` at line 79: pulls CMS stories, then filters with a hardcoded six-slug allowlist at line 87: `['first-retreat', 'golani-boys-return', 'brave-girls', 'fathers-fighters-finding-peace', 'joy-of-giving', 'believing-again']`.
- **Major drift**: any `communityStory` document with a slug NOT in this allowlist is dropped from `getStaticPaths`. An editor adding a new story with a fresh slug will never see a page built. The CMS-has-more-than-fallback case is silently broken.
- Conversely, if a fallback slug exists in the allowlist but no CMS document has it, the fallback `fallbackStories` (lines 14-77) provides the content. So both directions of "CMS has more" and "CMS has less" diverge from the allowlist.

### 5.4 `/shop/[slug]` (`src/pages/shop/[slug].astro`)

- `getStaticPaths` at line 82: pulls CMS products and adds 4 fallback slugs that are not in CMS. If CMS has all 4, fallback adds nothing. If CMS has a 5th product, it gets built (no allowlist filter, unlike community stories).
- This is the correct pattern. No drift.

---

## 6. Singleton field deadweight

The April audit specifically flagged `donatePage.faqContext` and `volunteerPage.faqContext`. As established in section 1.6 and 1.8, those fields are no longer in the schema files. The April finding is corrected: these fields were removed at some point between 2026-04-20 and 2026-05-18.

However, the same pattern (a field that "looks like it should drive behavior but is in fact ignored") still exists elsewhere:

- **`heroSection.ctas`** (`sanity/schemas/objects/heroSection.ts:30-37`). Declared on every singleton that uses the `heroSection` object (which is 8 of 11 singletons: `aboutStory`, `headsUp`, `fightingAntisemitism`, `resources`, `donatePage`, `shopPage`, `volunteerPage`, `contactPage`). Every singleton GROQ includes `hero` as a whole object pull. No page reads `hero.ctas`. An editor populating two CTA buttons in the hero section in Studio will see absolutely nothing change on the site.
- **`resources.disclaimer`**: schema admits it ("Page Footer Disclaimer (unused)") and the field description openly says "Not currently rendered." Still on disk.
- **`siteSettings.footerTagline`**: queried but not rendered by the footer.
- **`product.inStock`**: queried but not consulted; sold-out switches do nothing.
- **`mitzvahProject.openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution`**: queried but not rendered.
- **`mitzvahProject.steps[].label/description/actions/tip`**: schema admits these are unused.

---

## 7. Working tree vs HEAD

`git status` at the start of this audit: clean working tree on branch `great-volhard-b7c625`, up to date with `origin/main`. `git diff --stat` returns nothing.

No schema, GROQ, page, or seed files are dirty. There are no in-progress drift gaps to surface from uncommitted work.

Recent commits (last 5) per `git log`:
- `e2e4fda` Remove @jewmanity email references, route inquiries through contact form.
- `246d0bd` Fix incorrect jewmanity.org references, domain is .com.
- `521d9b9` Wire real Formspree IDs for contact and volunteer forms.
- `fdc9447` chore(git): ignore .claude/ tooling artifacts.
- `f9d4e17` chore(scripts): add qa-nav-fix multi-viewport screenshot script.

None of these touched the schema↔query↔page seam, which is consistent with the gaps documented here being long-standing rather than freshly introduced.

---

## 8. Sanity Studio reality check

Required fields (`validation: Rule => Rule.required()`) declared in schemas and whether the page tolerates a missing value:

| Schema | Required field | Page tolerance |
|---|---|---|
| `mitzvahProject` | `heroHeading` (`mitzvahProject.ts:14`) | `src/pages/get-involved/mitzvah-project.astro:76` passes `cms?.heroHeading` straight to `MitzvahHero` with no fallback. Required validation enforced by Studio is the only guard. |
| `mitzvahProject.impactCards[].title`, `description` | Same as above. Studio enforces, page passes through. |
| `mitzvahProject.paths[].title`, `description` | Same. |
| `mitzvahProject.goals[].amount`, `name`, `description` | Same. |
| `recipe` | `title`, `slug`, `image` | Listing reads all three; detail uses `cmsRecipe?.title || fallback?.title || 'Recipe'` so a missing title silently falls back. |
| `retreat` | `title`, `slug`, `coverImage` | Listing builds card from each; missing title yields empty card title (no explicit fallback). |
| `teamMember` | `name`, `role`, `photo` | Mapped without fallbacks at `src/pages/about/team.astro:11-16`. |
| `product` | `name`, `slug`, `price`, `mainImage` | Mapped without fallbacks; `price.toFixed(2)` at `src/pages/shop.astro:16` will throw if `price` is undefined, but Studio enforces required. |
| `testimonial` | `quote`, `authorName` | Listing pages map without fallback. |
| `faqItem` | `question` | `answer` is NOT marked required, but pages render the answer raw; a published faqItem with no answer would show an empty accordion body. |
| `recommendedArticle` | `title`, `url` | Same shape. |
| `communityStory` | `title`, `slug` | Same shape. |

Fields that the page treats as guaranteed but the schema does not validate (potential silent breakage):

- `recipe.image` is required (✓), but `recipe.description`, `recipe.tags`, `recipe.ingredients`, `recipe.instructions` are NOT required, yet pages render them as if present. An editor publishing a recipe with no ingredients or instructions ships an empty recipe page.
- `product.price` is required (✓), but `product.description`, `product.features`, `product.snipcartId` are NOT required. A product with no `snipcartId` will be put into Snipcart with `p._id` as the item ID (`src/pages/shop.astro:13`), which Snipcart may not recognize as a registered product.
- `testimonial.excerpt` is not required, but pages fall back to `quote` when missing (`src/pages/programs/heads-up.astro:55`).
- `homepage`, `aboutStory`, `headsUp`, `fightingAntisemitism`, `resources`, `donatePage`, `shopPage`, `volunteerPage`, `contactPage`, `siteSettings`. NONE of these singletons have any `required` validation on any field. Pages have `??` fallbacks for the most critical ones (hero, CTAs) but many descriptive fields render empty strings if blank. This is intentional for a forgiving authoring experience but worth noting.

---

## 9. What the content editor actually sees (seed vs page)

Five highest-traffic pages cross-referenced with their seed scripts:

### 9.1 Homepage

- `scripts/seed-homepage.ts` writes 20 fields. Page reads 20 fields. Fully aligned.
- Seed does NOT include `heroSecondaryCta` (line 59 sets only `heroPrimaryCta`). Page renders nothing if it is absent, which is the intended behavior.

### 9.2 Donate

- `scripts/seed-donate-page.ts` writes 21 schema fields plus `faqContext: 'donate'` at line 161.
- The schema has NO `faqContext` field. The page reads no such field. The seed writes a value that has no schema home, no GROQ pull, no page consumption. Sanity stores it on the document, but it is invisible in Studio (no field rendered) and useless.
- **Action**: Either remove the `faqContext` line from the seed, or restore the field to the schema. This is a direct delta from the April audit, which flagged the opposite problem (field in schema but not queried). Schema was cleaned up; seed was not.

### 9.3 Heads Up

- `scripts/seed-heads-up.ts` writes the full `hero` object, `safeHaven*`, `support*`, `experience*`, `care*`, `included*`, `community*`, `impact*`, and `cta*` fields.
- All seeded fields map to page reads. No seed → page gap discovered in spot checks (full diff of seed vs reads is out of time budget).

### 9.4 Volunteer

- `scripts/seed-volunteer-page.ts` writes 19 schema fields plus `faqContext: 'volunteer'` at line 121.
- Same issue as donate: `faqContext` is a ghost field, written by the seed but with no schema, no query, no read.

### 9.5 Mitzvah Project

- `scripts/seed-mitzvah-page.ts` does NOT seed three schema-and-GROQ fields: `openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution`. Page never reads them, so this is consistent. The schema, however, displays the fields in Studio for the editor to fill, and those edits are then queried and silently discarded.
- Seed does NOT include `steps[].label`, `steps[].description`, `steps[].actions`, `steps[].tip` either. Schema admits these are unused.

---

## 10. Recommendation list, sorted by editor impact

Ordered by how badly a content editor would be surprised right now if they tried to use the affected field.

1. **Wire `cmsRetreats` into `RetreatGrid` on the past retreats page.** Files: `src/pages/programs/past-retreats.astro:47`, `src/components/programs/RetreatGrid.astro:13`. Fix: pass `retreats={cmsRetreats.length > 0 ? cmsRetreats : undefined}` so CMS retreats actually render. Current behavior silently ignores every CMS retreat.

2. **Remove the hardcoded slug allowlist in community stories `getStaticPaths`.** File: `src/pages/about/community-stories/[slug].astro:87-94`. New CMS community story entries with unknown slugs never get built. Either drop the allowlist filter entirely (mirror the `/shop/[slug]` pattern) or rebuild the allowlist from CMS slugs.

3. **Implement `product.inStock` behavior or remove the field.** Files: `src/pages/shop.astro`, `src/pages/shop/[slug].astro`, `src/components/shop/ProductDetail.astro`, `sanity/schemas/documents/product.ts:82-87`. The schema description tells editors that toggling this hides "Add to Cart", but nothing reads it.

4. **Drop `faqContext` from the donate and volunteer seed scripts (or restore the schema field).** Files: `scripts/seed-donate-page.ts:161`, `scripts/seed-volunteer-page.ts:121`. The seed currently writes a ghost field that has no schema, no GROQ, no page read. Seeds are out of sync with schema cleanup.

5. **Remove `mitzvahProject.openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution` from the schema (or render them).** Files: `sanity/schemas/singletons/mitzvahProject.ts`, `src/lib/sanity.ts:407,421-422`. Three text fields visible in Studio that go nowhere.

6. **Read `siteSettings.footerTagline` in `Footer.astro` (or remove it from schema).** Files: `src/components/Footer.astro`, `sanity/schemas/singletons/siteSettings.ts:53-58`. The tagline field looks important; it is invisible.

7. **Render `hero.ctas` on the 8 singleton pages that use `heroSection`, or remove the field from the `heroSection` object.** File: `sanity/schemas/objects/heroSection.ts:29-37`. Right now every singleton with a hero invites editors to add up to 2 buttons that will not appear. The singleton-level `*PrimaryButton`/`*SecondaryButton` fields handle CTAs separately, so `heroSection.ctas` is structurally redundant.

8. **Stop rendering `relatedRecipes` from the hardcoded `allRecipes` object on the recipe detail page.** File: `src/pages/community/recipes/[slug].astro:360-368`. CMS recipe pages show fallback related recipes, ignoring the actual CMS recipe set.

9. **Surface other-region crisis resources or restrict the schema dropdown.** Files: `src/pages/resources.astro:67-69`, `sanity/schemas/singletons/resources.ts:208-255`. Editors can add Israel-region or International crisis entries, but only "United States" is rendered.

10. **Remove `resources.disclaimer` from schema and GROQ.** Files: `sanity/schemas/singletons/resources.ts:257-264`, `src/lib/sanity.ts:313`. Schema label says "(unused)"; cleanup is overdue.

11. **Add a CMS singleton for the about/team page, about/community-stories listing, community/recipes listing, and programs/past-retreats listing.** These four pages have no schema; everything visible (hero text, intro paragraphs, CTAs) requires a code change.

12. **Update or delete the `mitzvahProject.steps[].label/description/actions/tip` subfields** to match what the `HowItWorks` component actually renders. Files: `sanity/schemas/singletons/mitzvahProject.ts:120-156`.

13. **Wrap `getRetreats()` in a try/catch in `src/pages/programs/[slug].astro:14-19`.** Today a Sanity outage breaks the build with no graceful fallback. Every other page that calls a query already has the pattern.

14. **Fix the April audit's stale `*BySlug` claim in any internal documentation.** The April audit at `docs/project-audit-2026-04-20.md:245-252` references `getRecipeBySlug`, `getRetreatBySlug`, `getProductBySlug`, `getCommunityStoryBySlug`. Those exports no longer exist. New developers reading the April audit get a wrong picture.
