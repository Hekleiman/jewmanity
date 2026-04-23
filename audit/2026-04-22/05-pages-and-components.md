# Phase 5: Pages and components

## What I checked

1. `find src/pages -name "*.astro" | sort` — full page list.
2. For each page: extracted `import { ... } from '../lib/sanity'` and top-level component imports (non-recursive).
3. `find src/components -name "*.astro"` — 62 components total.
4. For each component: grepped `src/` for importers (excluding self).
5. Compared `src/components/Navigation.astro`'s link table to the page file list.
6. Checked `src/components/Footer.astro` for links to pages not in the top nav.

## Evidence

### All page routes (22 files)
```
src/pages/404.astro
src/pages/about/community-stories.astro
src/pages/about/community-stories/[slug].astro
src/pages/about/story.astro
src/pages/about/team.astro
src/pages/community/fighting-antisemitism.astro
src/pages/community/recipes.astro
src/pages/community/recipes/[slug].astro
src/pages/donate.astro
src/pages/get-involved/contact.astro
src/pages/get-involved/mitzvah-project.astro
src/pages/get-involved/volunteer.astro
src/pages/index.astro
src/pages/nonprofit-disclosures.astro
src/pages/privacy.astro
src/pages/programs/[slug].astro
src/pages/programs/heads-up.astro
src/pages/programs/past-retreats.astro
src/pages/resources.astro
src/pages/shop.astro
src/pages/shop/[slug].astro
src/pages/terms.astro
```

### Per-page GROQ + top-level component imports

| Page | GROQ calls | Top-level components imported |
|---|---|---|
| `index.astro` | `getHomepage`, `getTestimonials('general')` | Hero, HowWeHelp, ImpactStories, DonationCTA, Newsletter, StatsBar |
| `about/story.astro` | `getAboutStory` | HeroSection, StoryContent, ValuesGrid, CTASection |
| `about/team.astro` | `getTeamMembers` | HeroSection, TeamGrid, CTASection |
| `about/community-stories.astro` | `getCommunityStories`, `getTestimonials('antisemitism')` | HeroSection, StandTogether, TestimonialCarousel |
| `about/community-stories/[slug].astro` | `getCommunityStories` (in `getStaticPaths`) | (renders inline, no subcomponent imports beyond Layout) |
| `programs/heads-up.astro` | `getHeadsUp`, `getTestimonials('headsup')` | HeroSection, SafeHaven, WhoWeSupport, RetreatExperience, EvidenceBasedCare, WhatsIncluded, CommunityPowered, ImpactStats, TestimonialCarousel, CTASection |
| `programs/past-retreats.astro` | `getRetreats`, `getTestimonials('retreat')` | HeroSection, RetreatGrid, TestimonialCarousel, CTASection |
| `programs/[slug].astro` | `getRetreats` (in `getStaticPaths`) | RetreatArticle |
| `community/fighting-antisemitism.astro` | `getFightingAntisemitism` | HeroSection, AntisemitismIntro, ResourcesGrid, CTASection |
| `community/recipes.astro` | `getRecipes` | HeroSection, RecipesIntro, RecipeGrid, CTASection |
| `community/recipes/[slug].astro` | `getRecipes` (in `getStaticPaths`) | RecipePage |
| `resources.astro` | `getResources` | HeroSection, AdvocacyPillars, WhyThisMatters, CommonStruggles, SignsSection, CrisisResources |
| `donate.astro` | `getFaqItems('donate')`, `getDonatePage` | DonateHero, ImpactCards, WhyGive, CostBreakdown, FAQAccordion, CTASection |
| `shop.astro` | `getProducts`, `getShopPage` | HeroSection, ProductGrid, ImpactSection, CTASection |
| `shop/[slug].astro` | `getProducts` (in `getStaticPaths`) | ProductDetail |
| `get-involved/volunteer.astro` | `getTestimonials('volunteer')`, `getFaqItems('volunteer')`, `getVolunteerPage` | HeroSection, WhyVolunteer, HowToHelp, VolunteerImpact, TestimonialCarousel, FAQAccordion, VolunteerForm, CTASection |
| `get-involved/mitzvah-project.astro` | `getMitzvahProject`, `getFaqItems('mitzvah')` | MitzvahHero, MitzvahQuote, WhyThisMatters, ImpactCards, HowItWorks, ChooseYourPath, FundraisingGoals, FAQAccordion, MitzvahCTA |
| `get-involved/contact.astro` | `getContactPage` | HeroSection, ContactForm, OtherWays |
| `privacy.astro` | (none) | (Layout only, inline content) |
| `terms.astro` | (none) | (Layout only, inline content) |
| `nonprofit-disclosures.astro` | (none) | (Layout only, inline content) |
| `404.astro` | (none) | (Layout only) |

### Components

Total: **62** `.astro` files under `src/components/`.

Breakdown by directory:
```
10  src/components/programs/
 8  src/components/mitzvah/
 7  src/components/community/
 6  src/components/home/
 5  src/components/resources/
 5  src/components/about/
 4  src/components/volunteer/
 4  src/components/shop/
 4  src/components/shared/
 4  src/components/donate/
 2  src/components/contact/
 3  src/components/        (Navigation.astro, MobileMenu.astro, Footer.astro — top-level)
```

### Component import check (orphans)

Ran `grep -rln` for each component's filename across `src/` excluding self. **Exactly one component has zero importers**:

```
src/components/about/StoriesGrid.astro
```

All other 61 components are imported at least once.

### Navigation ↔ page file check

`src/components/Navigation.astro` links to 14 URLs:
```
/
/about/story, /about/team
/programs/heads-up, /programs/past-retreats
/about/community-stories, /community/fighting-antisemitism, /community/recipes
/get-involved/volunteer, /get-involved/mitzvah-project, /get-involved/contact
/resources
/shop
/donate   (via "Support Healing" CTA button)
```

Every one of these resolves to a file in `src/pages/`. **No navigation link points at a missing page.**

Pages not linked from the top nav:
- `/privacy` — linked from footer (`src/components/Footer.astro:102`)
- `/terms` — linked from footer (`src/components/Footer.astro:108`)
- `/nonprofit-disclosures` — linked from footer (`src/components/Footer.astro:114`)
- `/404` — Astro fallback; not user-navigable by design.
- `/shop/[slug]` — reached via `ProductCard` / `ProductGrid` linking from `/shop`.
- `/programs/[slug]` — reached via `RetreatCard` / `RetreatGrid` linking from `/programs/past-retreats`.
- `/about/community-stories/[slug]` — reached via cards on `/about/community-stories`.
- `/community/recipes/[slug]` — reached via cards on `/community/recipes`.

All of these are reachable via in-page links, not top-nav.

## Findings

- **Exactly one orphan component**: `src/components/about/StoriesGrid.astro`. Zero importers. Likely superseded by `TeamGrid` or by the inline community-stories list page. Safe-to-review-for-deletion candidate.
- **Every navigation link resolves to a page file**. No broken nav.
- **Every non-navigation page is linked from the footer or from an in-page card**. No orphan pages.
- **22 total page routes**, of which 4 are dynamic (`[slug]`) — community-stories, recipes, programs, shop. Each uses `getStaticPaths` seeded from the corresponding collection GROQ list query.
- **All dynamic-slug pages use the list query (`getRecipes`, `getRetreats`, `getProducts`, `getCommunityStories`)** with fallback to a hardcoded dictionary. The by-slug GROQ variants (`getRecipeBySlug`, `getCommunityStoryBySlug`) are not used.
- Navigation nests dropdowns for About, Programs, Community, and Get Involved. "Community Stories" lives under the Community dropdown but its route is `/about/community-stories/*` — a small taxonomy inconsistency (Community dropdown links to an `/about/...` URL).
- Homepage, About Story, Heads Up, Mitzvah Project, Donate, and Volunteer are the page templates that import the most components (5-9 each); the short-copy pages (privacy, terms, nonprofit-disclosures, 404) use Layout only and inline content.

## Open questions

- Is `StoriesGrid.astro` intentionally kept for a future feature, or is it leftover from the previous iteration of the community-stories layout (which now uses the inline page template)? Git log on that file would clarify.
- Is the taxonomy mismatch ("Community" nav menu → `/about/community-stories`) intentional, or should the route be renamed to `/community/stories` to align?
