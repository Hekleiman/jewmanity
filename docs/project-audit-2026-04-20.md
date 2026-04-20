# Jewmanity — Project Reality Audit (2026-04-20)

Snapshot of the codebase as it exists on branch `main` at HEAD `8c94e84`, with ~60 files dirty in the working tree. This document states what is actually in the code, not what was planned.

---

## 1. Dependencies

### Production dependencies (`package.json`)

| Package | Version | Purpose |
| --- | --- | --- |
| `astro` | ^5 | Static-site framework (locked at 5.x per CLAUDE.md) |
| `@astrojs/sitemap` | ^3.7.1 | Generates `sitemap-0.xml` / `sitemap-index.xml` during `astro build` |
| `tailwindcss` | ^4 | Tailwind 4 — CSS-first config lives in `src/styles/global.css` |
| `@tailwindcss/vite` | ^4 | Tailwind 4 Vite plugin wired in `astro.config.mjs` |
| `typescript` | ^5 | TS compiler — project runs under `astro/tsconfigs/strict` |
| `@sanity/client` | ^7.19.0 | Sanity fetch client used from `src/lib/sanity.ts` |
| `@sanity/image-url` | ^2.0.3 | Builds Sanity asset URLs via `urlFor()` |
| `@portabletext/to-html` | ^5.0.2 | Renders Portable Text → HTML (donate FAQ, volunteer FAQ, mitzvah FAQ, recipes) |
| `astro-portabletext` | ^0.13.0 | **Installed but never imported** in `src/` — candidate for removal (grep 0 hits) |
| `gsap` | ^3 | Scroll / fade animations in `src/scripts/animations.ts` (only importer) |

### Dev dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| `@playwright/test` | ^1.58.2 | Chromium driver used by `scripts/screenshot.mjs` and `scripts/visual-qa.mjs`. No actual `test/` spec files exist. |
| `sharp` | ^0.34.5 | Not directly imported in `src/`; used transitively by Astro's image optimizer. |

### Node version
`package.json` does **not** declare an `engines` field. No `.nvmrc`. Node version is implicit / developer-machine-dependent.

### Studio (separate package)
`sanity/package.json` is its own package: `sanity@^3`, `@sanity/icons`, `@sanity/vision`, `react@^19.2.4`, `react-dom@^19.2.4`, `styled-components@^6.3.12`. Scripts: `sanity dev`, `sanity build`, `sanity deploy`. Has its own `node_modules`.

---

## 2. Environment Variables

### `.env.example` (checked in)
```
PUBLIC_SANITY_PROJECT_ID=9pc3wgri
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_write_token
FORMSPREE_ID=your_form_id
ANTHROPIC_API_KEY=your_api_key
```

### Actual usage (grep `import.meta.env` / `process.env`)

| Variable | Where | In `.env.example`? | Fallback? | Notes |
| --- | --- | --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | `src/lib/sanity.ts:6` | yes | yes (`'9pc3wgri'` hardcoded) | Also read by `scripts/seed-testimonials.ts` |
| `PUBLIC_SANITY_DATASET` | `src/lib/sanity.ts:7` | yes | yes (`'production'` hardcoded) | Same |
| `SANITY_API_TOKEN` | Sanity seed scripts only (11 files under `scripts/`) | yes | no | Never read from browser / `src/` |
| `SANITY_WRITE_TOKEN` | Many seed scripts as an alias | **no** | no | Most scripts accept `SANITY_API_TOKEN \|\| SANITY_WRITE_TOKEN` — `.env.example` should probably document this alias |
| `SANITY_TOKEN` | `scripts/migrate-products.mjs:8` only | **no** | no | Third alias for the same thing — unique to this one script |
| `FORMSPREE_ID` | **Nowhere in code.** Form action URLs are hardcoded `https://formspree.io/f/xlgpvpja` | yes (as `FORMSPREE_ID=your_form_id`) | n/a | **Mismatch:** `.env.example` advertises this variable but code ignores it |
| `ANTHROPIC_API_KEY` | `scripts/visual-qa.mjs:57` | yes | no | Used only by the visual-QA Claude Vision script |

### Key mismatches
- `.env.example` promises `FORMSPREE_ID` — code never reads it; form IDs are baked into `ContactForm.astro` and `VolunteerForm.astro`.
- Three different names for the Sanity write token (`SANITY_API_TOKEN`, `SANITY_WRITE_TOKEN`, `SANITY_TOKEN`) are read across scripts.
- No public Sanity read token referenced — the client runs in CDN mode (`useCdn: true`), so it works for published/public docs only.
- Mailchimp subscription endpoint is hardcoded into `src/components/home/Newsletter.astro` (list URL with list id `63c97041047a0d6a6e1c61091`, form id `728dc5cdc2`). No env var.

---

## 3. Third-Party Integrations (Active)

### Donorbox — donation widget (live in HEAD)
- **HEAD:** `src/components/donate/DonateHero.astro` embeds `https://donorbox.org/embed/jewmanity-donation?default_interval=o&hide_donation_meter=true` with a query-param handler that reads `?amount=` and patches the iframe `src` (commit `8c94e84`, 2026-04-06).
- `src/components/home/DonationCTA.astro:51` — each tier card links `href="/donate?amount=${tier.amount}"`, feeding the Donorbox iframe handler.
- **Working tree (uncommitted):** DonateHero has been locally replaced with **Givebutter** placeholder markup (`YOUR_ACCOUNT_ID`, `WIDGET_ID` TODOs). The change is uncommitted and unreleased.
- `src/layouts/Layout.astro:66-67` still has a `<link rel="preconnect" href="https://widgets.givebutter.com">` from the uncommitted edits (the preconnect was also swapped from donorbox.org).
- **Manual step for go-live:** if the Givebutter path is chosen, replace both `YOUR_ACCOUNT_ID` and `WIDGET_ID`. Otherwise revert `DonateHero.astro` to the committed Donorbox version.
- Privacy/Terms copy still mentions **Givebutter** as the donation processor (`src/pages/privacy.astro:22,41`, `src/pages/terms.astro:33`) even though the live site uses Donorbox.

### Snipcart — e-commerce (live, test mode)
- Script + stylesheet loaded in `src/layouts/Layout.astro:90-94`.
- API key hardcoded at `src/layouts/Layout.astro:94`: `data-api-key="YzI4MTdlM2YtN2U2NS00YTIxLWE1NGUtNWUwOTU3YzFhZjJkNjM5MDk2MjU4MDY4MDc3ODg1"` — tagged with inline comment *"This is the TEST API key. Switch to live key before production deployment."*
- Add-to-cart buttons use the `snipcart-add-item` class: `src/components/shop/ProductCard.astro:31`, `src/components/shop/ProductDetail.astro:147`.
- Product `snipcartId` flows from Sanity: `src/pages/shop.astro:13`, `src/pages/shop/[slug].astro:109`. Falls back to the slug if missing.
- **Go-live:** swap test API key for live key in `Layout.astro`.

### Formspree — contact + volunteer forms (live, real form id)
- Both forms POST to the same Formspree endpoint `https://formspree.io/f/xlgpvpja`:
  - `src/components/contact/ContactForm.astro:20`
  - `src/components/volunteer/VolunteerForm.astro:25`
- Submission is JS-intercepted → `fetch()` → show success/error divs (see `ContactForm.astro:147-179`).
- Not driven by env or CMS — single shared form id. `.env.example` has `FORMSPREE_ID` but it is dead.

### Mailchimp — newsletter signup (live)
- `src/components/home/Newsletter.astro:23` posts directly to `https://gmail.us13.list-manage.com/subscribe/post` with `u=63c97041047a0d6a6e1c61091`, `id=728dc5cdc2`, and a honeypot hidden input `b_63c97041047a0d6a6e1c61091_728dc5cdc2`.
- Target `_blank` — user is bounced to Mailchimp's confirmation page.
- Hardcoded in component markup. No env, no CMS.

### Sanity — CMS (live, CDN-read)
- Project ID `9pc3wgri`, dataset `production` (see `src/lib/sanity.ts:5-10`).
- Client runs with `useCdn: true` — no auth needed for read; schema has 29 registered types in `sanity/schemas/index.ts`.
- Studio lives in `sanity/` as a separate npm package; run locally via `cd sanity && npx sanity dev`.
- Write scripts in `scripts/seed-*.ts` and `scripts/cleanup-*.ts` require `SANITY_API_TOKEN` (or aliases).
- Every page fetch is wrapped in `try/catch` with an inline hardcoded fallback (see `src/pages/*.astro` — homepage, about/story, heads-up, fighting-antisemitism, resources, donate, shop, volunteer, contact, mitzvah).

### Vercel — hosting (config present)
- `vercel.json` declares `framework: astro`, `buildCommand: npm run build`, `outputDirectory: dist`.
- `astro.config.mjs` sets `site: 'https://jewmanity.org'` (used by sitemap integration).
- Deployment happens via the Vercel↔GitHub integration; no Vercel-specific SDK code in `src/`. No Vercel-defined env var present.

---

## 4. Third-Party Integrations (Absent)

Stated negatively so future sessions don't re-grep:

| Service | Integrated? | Evidence |
| --- | --- | --- |
| Stripe (direct) | **No.** | No `stripe` package; one comment in `DonateHero.astro:37` mentions Stripe only as a Givebutter fee-mode reference. Donation payments are handled *inside* Donorbox (or Givebutter) — not by our code. |
| PayPal | **No.** | The Donorbox embed URL in HEAD does not pass `paypalExpress=true`. No `paypal` package or endpoint. |
| Google Analytics / GA4 / gtag | **No.** | No `gtag`, `ga(`, `google-analytics` refs in `src/`. |
| Plausible / Fathom / Hotjar / Mixpanel / Segment / Matomo | **No.** | All zero hits in `src/`. |
| CRM (HubSpot, Salesforce, Airtable, Pipedrive, etc.) | **No.** | Contact/volunteer submissions go only to Formspree. |
| Algolia / Typesense / Meilisearch | **No.** | No search. |
| reCAPTCHA / hCaptcha / Turnstile | **No.** | Forms use a hidden `_gotcha` honeypot only (`ContactForm.astro:26`, `VolunteerForm.astro` same pattern). |
| Sentry / LogRocket / Datadog | **No.** | No client-side error reporting. |
| Cookie consent banner | **No.** | No consent UI despite GA absence — privacy page mentions cookies but nothing injects them. |
| OpenGraph image generator | **No.** | Single static `public/og-default.png` referenced from `Layout.astro:45`. |
| Service worker / PWA | **No.** | No `manifest.json`, no worker registration. |

---

## 5. Page Inventory

All routes live under `src/pages/`. CMS-driven pages fall back to inline fallback content on fetch failure. "Top-level components" lists only those imported directly by the page, not their descendants.

| Route | File | Sanity doc | GROQ fn | Top-level components |
| --- | --- | --- | --- | --- |
| `/` | `pages/index.astro` | `homepage` | `getHomepage` | `Hero`, `HowWeHelp`, `ImpactStories`, `DonationCTA`, `Newsletter`, `StatsBar` |
| `/about/story` | `pages/about/story.astro` | `aboutStory` | `getAboutStory` | `HeroSection`, `StoryContent`, `ValuesGrid`, `CTASection` |
| `/about/team` | `pages/about/team.astro` | `teamMember` (collection) | `getTeamMembers` | `HeroSection`, `TeamGrid`, `CTASection` |
| `/about/community-stories` | `pages/about/community-stories.astro` | `communityStory` + `testimonial` | `getCommunityStories`, `getTestimonials` | `HeroSection`, `StoriesGrid`, `CTASection` (also has two inline `<section>`s) |
| `/about/community-stories/[slug]` | `pages/about/community-stories/[slug].astro` | `communityStory` | `getCommunityStories` (re-used in `getStaticPaths`) | none (inline `<article>` markup) |
| `/programs/heads-up` | `pages/programs/heads-up.astro` | `headsUp` singleton | `getHeadsUp` | `HeroSection`, `SafeHaven`, `WhoWeSupport`, `RetreatExperience`, `EvidenceBasedCare`, `WhatsIncluded`, `CommunityPowered`, `ImpactStats`, `CTASection` |
| `/programs/past-retreats` | `pages/programs/past-retreats.astro` | `retreat` + `testimonial` | `getRetreats`, `getTestimonials('headsup')` | `HeroSection`, `RetreatGrid`, `TestimonialCarousel`, `CTASection` |
| `/programs/[slug]` | `pages/programs/[slug].astro` | `retreat` | `getRetreats` | `RetreatArticle`. Also reads `src/data/retreats.ts` for hardcoded fallbacks. |
| `/community/fighting-antisemitism` | `pages/community/fighting-antisemitism.astro` | `fightingAntisemitism` singleton | `getFightingAntisemitism` | `HeroSection`, `AntisemitismIntro`, `ResourcesGrid`, `StandTogether`, `CTASection`. `ResourcesGrid` internally calls `getRecommendedArticles`. |
| `/community/recipes` | `pages/community/recipes.astro` | `recipe` collection | `getRecipes` | `HeroSection`, `RecipesIntro`, `RecipeGrid`, `CTASection` |
| `/community/recipes/[slug]` | `pages/community/recipes/[slug].astro` | `recipe` | `getRecipes` (in `getStaticPaths`) | `RecipePage` |
| `/donate` | `pages/donate.astro` | `donatePage` + `faqItem` | `getDonatePage`, `getFaqItems('donate')` | `DonateHero`, `ImpactCards` (donate/), `WhyGive`, `CostBreakdown`, `FAQAccordion` + inline CTA section |
| `/shop` | `pages/shop.astro` | `shopPage` + `product` | `getShopPage`, `getProducts` | `HeroSection`, `ImpactSection` (shop/), `ProductGrid`, `CTASection` |
| `/shop/[slug]` | `pages/shop/[slug].astro` | `product` | `getProducts` (in `getStaticPaths`) | `ProductDetail` |
| `/get-involved/contact` | `pages/get-involved/contact.astro` | `contactPage` singleton | `getContactPage` | `HeroSection`, `ContactForm`, `OtherWays` + inline intro section |
| `/get-involved/volunteer` | `pages/get-involved/volunteer.astro` | `volunteerPage` + `testimonial` + `faqItem` | `getVolunteerPage`, `getTestimonials('volunteer')`, `getFaqItems('volunteer')` | `HeroSection`, `WhyVolunteer`, `HowToHelp`, `VolunteerImpact`, `TestimonialCarousel`, `FAQAccordion`, `VolunteerForm`, `CTASection` |
| `/get-involved/mitzvah-project` | `pages/get-involved/mitzvah-project.astro` | `mitzvahProject` + `faqItem` | `getMitzvahProject`, `getFaqItems('mitzvah')` | `MitzvahHero`, `MitzvahQuote` (x2), `WhyThisMatters` (mitzvah/), `ImpactCards` (mitzvah/), `HowItWorks`, `ChooseYourPath`, `FundraisingGoals`, `FAQAccordion`, `MitzvahCTA` |
| `/resources` | `pages/resources.astro` | `resources` singleton | `getResources` | `HeroSection`, `AdvocacyPillars`, `WhyThisMatters` (resources/), `CommonStruggles`, `SignsSection`, `CrisisResources` |
| `/privacy` | `pages/privacy.astro` | none (static) | — | `Layout` only (inline markup) |
| `/terms` | `pages/terms.astro` | none (static) | — | `Layout` only |
| `/nonprofit-disclosures` | `pages/nonprofit-disclosures.astro` | none (static) | — | `Layout` only |
| `/404` | `pages/404.astro` | none (static) | — | `Layout` only |

### Redundancy / oddities
- There is both `src/pages/shop.astro` AND `src/pages/shop/[slug].astro` — Astro resolves this fine (`/shop` + `/shop/:slug`) but worth noting.
- `src/pages/programs/[slug].astro` mixes a hardcoded fallback map (`src/data/retreats.ts`) with CMS data and prefers the fallback when the CMS body is ≤3 blocks (`[slug].astro:45`).
- Two different `WhyThisMatters.astro` components exist — `resources/` and `mitzvah/` — they are distinct implementations, not duplicated.
- Two different `ImpactCards.astro` components exist — `donate/` and `mitzvah/` — also distinct.

---

## 6. Sanity Schema Reality

Registered types in `sanity/schemas/index.ts`: 21 object types + 8 collection documents + 11 singletons = 40 total.

### Singletons and their consumption
Every singleton has exactly one GROQ query function in `src/lib/sanity.ts` and exactly one page consumer.

| Singleton | Query fn | Page consumer | Unconsumed fields (defined, not requested by GROQ) |
| --- | --- | --- | --- |
| `homepage` | `getHomepage` | `/` | *(all requested fields match)* |
| `aboutStory` | `getAboutStory` | `/about/story` | *(matches)* |
| `headsUp` | `getHeadsUp` | `/programs/heads-up` | *(matches)* |
| `fightingAntisemitism` | `getFightingAntisemitism` | `/community/fighting-antisemitism` | *(matches)* |
| `resources` | `getResources` | `/resources` | *(matches)* |
| `donatePage` | `getDonatePage` | `/donate` | `faqContext` (field declared in `sanity/schemas/singletons/donatePage.ts`, but `getDonatePage` does not request it and `/donate` instead calls `getFaqItems('donate')` directly). |
| `shopPage` | `getShopPage` | `/shop` | *(matches)* |
| `volunteerPage` | `getVolunteerPage` | `/get-involved/volunteer` | `faqContext` (same pattern as `donatePage` — page hardcodes `getFaqItems('volunteer')`). |
| `contactPage` | `getContactPage` | `/get-involved/contact` | *(matches)* |
| `mitzvahProject` | `getMitzvahProject` | `/get-involved/mitzvah-project` | *(matches)* |
| `siteSettings` | `getSiteSettings` | `Layout.astro` (via `Footer.astro`) | *(matches)* |

### Collections and their consumption

| Document type | Query fn(s) | Page(s) that use it |
| --- | --- | --- |
| `communityStory` | `getCommunityStories`, `getCommunityStoryBySlug` | `/about/community-stories`, `/about/community-stories/[slug]`. The `[slug]` page uses `getCommunityStories` in `getStaticPaths` and reads from props — **`getCommunityStoryBySlug` is exported but never imported.** |
| `recipe` | `getRecipes`, `getRecipeBySlug` | `/community/recipes`, `/community/recipes/[slug]`. Same pattern — **`getRecipeBySlug` exported but unused.** |
| `retreat` | `getRetreats`, `getRetreatBySlug` | `/programs/past-retreats`, `/programs/[slug]`. **`getRetreatBySlug` exported but unused.** |
| `product` | `getProducts`, `getProductBySlug` | `/shop`, `/shop/[slug]`. **`getProductBySlug` exported but unused.** |
| `testimonial` | `getTestimonials(context?)` | `/about/community-stories`, `/programs/past-retreats` (`context='headsup'`), `/get-involved/volunteer` (`context='volunteer'`) |
| `faqItem` | `getFaqItems(context?)` | `/donate` (`'donate'`), `/get-involved/volunteer` (`'volunteer'`), `/get-involved/mitzvah-project` (`'mitzvah'`) |
| `teamMember` | `getTeamMembers` | `/about/team` |
| `recommendedArticle` | `getRecommendedArticles` | Used inside `src/components/community/ResourcesGrid.astro` (rendered on `/community/fighting-antisemitism`) |

### Object types (reusable field groups)
21 object types registered. Every object type is referenced by at least one singleton/document that requests its fields via GROQ. Spot-check confirms `heroSection`, `ctaButton`, `statItem`, etc. all flow through. **No object-type orphans detected.**

### Schema ↔ GROQ mismatches
- `donatePage.faqContext` and `volunteerPage.faqContext` — defined in schema, never requested by GROQ, never consumed. Page code hardcodes the context string (`'donate'` / `'volunteer'`). Either use the field or remove it.
- Recipe schema lacks `cookTime`, `difficulty`, `author`, `date`, `notes` — the `/community/recipes/[slug]` page reads these from `cmsRecipe` and falls through to the hardcoded `allRecipes` map because the CMS will always return `undefined` for them. Either extend `sanity/schemas/documents/recipe.ts` or drop the reads from the page.
- Product schema lacks `cookTime`-style extras; `/shop/[slug]` reads `cmsProduct.price.toFixed(2)` which assumes price is a number (schema confirms `price` is `number`, so fine).
- `communityStory` has `body` (Portable Text) defined in the schema, but only the `[slug]` page queries it via `getCommunityStoryBySlug` which no page actually calls. The listing page uses `paragraphs` (plain string array) instead. The `body` field is therefore effectively dead.

### Orphan document types
No wholly-orphan document types — every type has at least one query consumer.

---

## 7. GROQ Query Catalogue

All exports in `src/lib/sanity.ts`.

| Function | Type | Fields requested | Called from |
| --- | --- | --- | --- |
| `getRecipes()` | `recipe[]` | `_id, title, slug, description, image, tags, prepTime, servings, ingredients, instructions, culturalContext, orderRank` | `pages/community/recipes.astro`, `pages/community/recipes/[slug].astro` (getStaticPaths) |
| `getRecipeBySlug(slug)` | `recipe` | same as above minus orderRank | **No imports — orphan** |
| `getRetreats()` | `retreat[]` | `_id, title, slug, subtitle, author, date, coverImage, body, participants, location, orderRank` | `pages/programs/past-retreats.astro`, `pages/programs/[slug].astro` |
| `getRetreatBySlug(slug)` | `retreat` | adds `gallery` | **No imports — orphan** |
| `getTeamMembers()` | `teamMember[]` | `_id, name, role, photo, bio, orderRank` | `pages/about/team.astro` |
| `getProducts()` | `product[]` | `_id, name, slug, price, description, snipcartId, mainImage, gallery, features, inStock, orderRank` | `pages/shop.astro`, `pages/shop/[slug].astro` (getStaticPaths) |
| `getProductBySlug(slug)` | `product` | same, no orderRank | **No imports — orphan** |
| `getTestimonials(context?)` | `testimonial[]` | `_id, quote, excerpt, authorName, authorRole, authorImage, context, order, slug, imageUrl` | `pages/about/community-stories.astro`, `pages/programs/past-retreats.astro`, `pages/get-involved/volunteer.astro` |
| `getFaqItems(context?)` | `faqItem[]` | `_id, question, answer, context, orderRank`. When `context` is provided, also matches `context == 'general'` to include shared FAQs. | `pages/donate.astro`, `pages/get-involved/volunteer.astro`, `pages/get-involved/mitzvah-project.astro` |
| `getCommunityStories()` | `communityStory[]` | `_id, title, slug, image, imageUrl, excerpt, paragraphs, body, tag, pullQuote, pullQuoteAttribution, externalUrl, internalUrl, orderRank` | `pages/about/community-stories.astro`, `pages/about/community-stories/[slug].astro` |
| `getCommunityStoryBySlug(slug)` | `communityStory` | `_id, title, slug, image, excerpt, body` | **No imports — orphan** |
| `getRecommendedArticles()` | `recommendedArticle[]` | `_id, title, publication, date, url, description, order` | `components/community/ResourcesGrid.astro` |
| `getHomepage()` | `homepage` singleton | 18 fields | `pages/index.astro` |
| `getAboutStory()` | `aboutStory` | 11 fields | `pages/about/story.astro` |
| `getHeadsUp()` | `headsUp` | 25 fields | `pages/programs/heads-up.astro` |
| `getFightingAntisemitism()` | `fightingAntisemitism` | 17 fields | `pages/community/fighting-antisemitism.astro` |
| `getResources()` | `resources` | 20 fields | `pages/resources.astro` |
| `getDonatePage()` | `donatePage` | 22 fields (excludes `faqContext`) | `pages/donate.astro` |
| `getShopPage()` | `shopPage` | 8 fields | `pages/shop.astro` |
| `getVolunteerPage()` | `volunteerPage` | 22 fields (excludes `faqContext`) | `pages/get-involved/volunteer.astro` |
| `getContactPage()` | `contactPage` | 6 fields | `pages/get-involved/contact.astro` |
| `getMitzvahProject()` | `mitzvahProject` | 28 fields | `pages/get-involved/mitzvah-project.astro` |
| `getSiteSettings()` | `siteSettings` | 5 fields | `layouts/Layout.astro` |

**Orphan query functions (exported, never imported):** `getRecipeBySlug`, `getRetreatBySlug`, `getProductBySlug`, `getCommunityStoryBySlug`.

---

## 8. Component Inventory

Totals under `src/components/`:

| Directory | Count | Scope | Notes |
| --- | --- | --- | --- |
| (root) | 3 | Navigation, MobileMenu, Footer — used only by `Layout.astro` | |
| `shared/` | 4 | Cross-page reuse | `HeroSection` (used on ~10 pages), `CTASection` (~10 pages), `FAQAccordion` (3 pages), `TestimonialCarousel` (2 pages) |
| `home/` | 6 | single-use | Hero, HowWeHelp, ImpactStories, DonationCTA, Newsletter, StatsBar — all imported only by `/` |
| `about/` | 5 | single-use each | StoriesGrid, StoryContent, TeamGrid, TeamMember, ValuesGrid |
| `programs/` | 10 | mostly single-use | RetreatCard is used inside RetreatGrid; RetreatArticle is single-use on `[slug]` |
| `community/` | 7 | single-use | RecipeCard is used inside RecipeGrid, RecipePage is single-use on `[slug]` |
| `contact/` | 2 | single-use | ContactForm, OtherWays |
| `donate/` | 4 | single-use | CostBreakdown, DonateHero, ImpactCards, WhyGive |
| `mitzvah/` | 8 | single-use | ChooseYourPath, FundraisingGoals, HowItWorks, ImpactCards, MitzvahCTA, MitzvahHero, MitzvahQuote (used twice on same page), WhyThisMatters |
| `resources/` | 5 | single-use | AdvocacyPillars, CommonStruggles, CrisisResources, SignsSection, WhyThisMatters |
| `shop/` | 4 | mostly single-use | ImpactSection, ProductCard (inside ProductGrid), ProductDetail, ProductGrid |
| `volunteer/` | 4 | single-use | HowToHelp, VolunteerForm, VolunteerImpact, WhyVolunteer |

**No unused component files detected.** Every `.astro` under `src/components/` is imported by at least one page or parent component. `TeamMember.astro` is used by `TeamGrid.astro`; `RetreatCard` by `RetreatGrid`; `RecipeCard` by `RecipeGrid`; `ProductCard` by `ProductGrid`.

---

## 9. Scripts & Tooling

### `package.json` scripts
| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `astro dev` | Local dev server (default port 4321) |
| `build` | `astro build` | Static build → `dist/` |
| `preview` | `astro preview` | Serve `dist/` locally |
| `astro` | `astro` | Passthrough |
| `screenshot` | `node scripts/screenshot.mjs` | Takes desktop+mobile screenshots via Playwright chromium |
| `visual-qa` | `node scripts/visual-qa.mjs` | Screenshot + Claude Vision analysis (needs `ANTHROPIC_API_KEY`) |
| `visual-qa:compare` | `node scripts/visual-qa.mjs` | Same command; kept for readability |

### `scripts/` directory

| File | Purpose |
| --- | --- |
| `screenshot.mjs` | Playwright screenshot utility — outputs to `screenshots/` (gitignored) |
| `visual-qa.mjs` | Screenshot + call to Claude API (`ANTHROPIC_API_KEY`) for visual diff analysis |
| `seed-sanity.mjs` | Legacy seed runner (reads `SANITY_API_TOKEN`) |
| `migrate-products.mjs` | One-shot script that pulled products from the existing Jewmanity site into Sanity. Reads `SANITY_TOKEN` — note: different env name from other scripts. |
| `seed-about-story.ts` | Seeds `aboutStory` singleton |
| `seed-articles.ts` | Seeds `recommendedArticle` collection |
| `seed-community-stories.ts` | Seeds `communityStory` collection |
| `seed-contact-page.ts` | Seeds `contactPage` singleton |
| `seed-donate-page.ts` | Seeds `donatePage` singleton |
| `seed-fighting-antisemitism.ts` | Seeds `fightingAntisemitism` singleton |
| `seed-heads-up.ts` | Seeds `headsUp` singleton |
| `seed-homepage.ts` | Seeds `homepage` singleton |
| `seed-mitzvah-faq.ts` | Seeds `faqItem` documents with `context='mitzvah'` |
| `seed-mitzvah-page.ts` | Seeds `mitzvahProject` singleton |
| `seed-resources.ts` | Seeds `resources` singleton |
| `seed-retreats-and-pullquotes.ts` | Seeds retreats + pull quotes |
| `seed-shop-page.ts` | Seeds `shopPage` singleton |
| `seed-site-settings.ts` | Seeds `siteSettings` singleton |
| `seed-testimonials.ts` | Seeds `testimonial` collection |
| `seed-volunteer-page.ts` | Seeds `volunteerPage` singleton |
| `cleanup-community-stories.ts` | Destructive — deletes/normalizes communityStory docs |
| `cleanup-testimonials.ts` | Destructive — deletes/normalizes testimonial docs |
| `replace-community-stories.ts` | Wipes and re-seeds community stories |
| `patch-mitzvah-content.ts` | Patches specific fields on the mitzvahProject singleton |

All `.ts` seed scripts read `SANITY_API_TOKEN` or `SANITY_WRITE_TOKEN`. None are wired into npm scripts — they're invoked with `npx tsx scripts/seed-<name>.ts` or similar manually.

### Playwright / Visual QA status
- `@playwright/test` is installed but there is **no test directory** (no `tests/`, no `*.spec.ts`, no `playwright.config.ts`). Playwright is used as a browser driver only.
- `screenshots/` contains **159 PNGs**. Cannot verify last successful QA run from code — the directory is gitignored and file timestamps reflect local runs.
- Visual QA depends on `ANTHROPIC_API_KEY` in `.env`.

---

## 10. Known TODOs in Code

Grouped by file. Line numbers are current HEAD; a working-tree edit may shift them slightly.

### `src/components/donate/DonateHero.astro` (uncommitted edits — Givebutter placeholder)
- Line 39: `TODO(belinda): replace YOUR_ACCOUNT_ID with the real Givebutter account ID once the account is created.`
- Line 41: `TODO(belinda): replace WIDGET_ID with the real Givebutter Form widget ID from the dashboard.`
- Line 45: `TODO(verify-givebutter-url-param)` — validate that the `amount=` query param pre-selects a Givebutter preset.

### `src/components/about/StoriesGrid.astro`
- Line 118: `<!-- TODO: Replace with real image from Sanity -->`

### `src/pages/community/recipes.astro`
- Line 27: `{/* TODO: Replace with real photo from client */}` (recipes hero image)

### `src/lib/cms.ts`
- Line 1: `// TODO: Set up Sanity client and query helpers (Phase 3)` — **stale.** `src/lib/sanity.ts` is the real client; this file is a one-line vestige.

No `FIXME`, `HACK`, or `XXX` markers found anywhere under `src/`, `sanity/`, or `scripts/` (excluding `package-lock.json` sha integrity hashes).

---

## 11. Git State

### Current branch
`main` (local `main` tracks `origin/main`; at HEAD `8c94e84`).

### Uncommitted changes
**62 modified files** and **30 untracked paths.** Working tree is heavily dirty.

**Modified — top-level docs and config:**
- `CLAUDE.md`, `DEPLOYMENT.md`
- `sanity/sanity.cli.ts`, `sanity/schemas/index.ts`

**Modified — Sanity schemas (9 singletons + communityStory):**
- `sanity/schemas/documents/communityStory.ts`
- `sanity/schemas/singletons/{aboutStory,contactPage,donatePage,fightingAntisemitism,headsUp,homepage,resources,shopPage,volunteerPage}.ts`

**Modified — ~43 `.astro` files:** Layout, most components under home/, about/, programs/, community/, donate/, resources/, volunteer/, contact/, shop/; most page files. The pattern is consistent with adding CMS props to already-existing components and wiring GROQ fields through.

**Modified — `src/lib/sanity.ts`** (the GROQ catalogue).

**Untracked:**
- Entire `docs/` directory (including `docs/editor-guide.md`)
- 16 new object schemas under `sanity/schemas/objects/` (aboutValueCard, actionStep, antisemitismFormCard, antisemitismOrg, antisemitismStat, carePillar, contactCard, donateImpactCard, experienceItem, homepageStat, howToHelpCard, includedItem, programCard, shopImpactIcon, supportCard, whyGiveValue)
- 11 new seed scripts under `scripts/`
- Two binary image files: `src/testimonial-dahlia.png`, `testimonial-dahlia.png` (the repo-root one is listed in the initial gitStatus but `.gitignore` does not cover it — likely stray)

**Net effect:** Most of the work that made pages CMS-driven (and the schemas/seed scripts that back them) is still sitting in the working tree, unstaged. Committing would likely be ~90 files.

### Recent commits (last 10)
```
8c94e84  Wire homepage donation cards to Donorbox with pre-selected amount
9be7093  Update images, components, retreat pages, and community story routing
8a05e1c  Update Mitzvah Project page with full PDF content and quote blocks
bf7c841  Add Bar/Bat Mitzvah Project page with Sanity CMS integration
a65f52b  Hero height updates and ImpactStories carousel fix
cf441b8  Fix testimonial card overflow, donate hero fullscreen, revert volunteer hero
d6bc4b7  Fix testimonial carousel overflow at mid-size viewports
dc976b3  Mobile fixes: full-height heroes, testimonial carousel spacing
39e2a8b  Add recommended articles to Sanity CMS with 6 articles
9086832  CMS-driven community stories with real photos and card truncation
```

The shift from Donorbox → Givebutter placeholder is **uncommitted** (not in the last 10 commits; commit history shows Donorbox going live on 2026-03-27 and being refined up through 2026-04-06).

---

## 12. Build & Deploy Reality

**This audit is static-analysis only — no build was executed.** What can be inferred from `dist/`:

- `dist/` exists and was last written **2026-04-20 00:18** (today). It contains **39 HTML files**. This tells us the build succeeded at that timestamp, but does **not** confirm the current (dirty) working tree builds.
- Built pages: full site tree — `/`, `/404`, `/about/{story,team,community-stories,community-stories/*}`, `/community/{fighting-antisemitism,recipes,recipes/*}`, `/donate`, `/get-involved/{contact,mitzvah-project,volunteer}`, `/nonprofit-disclosures`, `/privacy`, `/programs/{heads-up,past-retreats,heads-up-first-retreat,heads-up-second-retreat,heads-up-third-retreat,heads-up-retreat-4-fathers-fighters}`, `/resources`, `/shop/{,black-trucker-hat,heads-up-water-bottle,pink-trucker-hat,travel-shabbat-candle-set}`, `/terms`. Sitemap generated (`sitemap-index.xml`, `sitemap-0.xml`). `robots.txt` present. `og-default.png` present. PDF shipped at `dist/jewmanity-bar-bat-mitzvah-project.pdf`.
- `dev` script: `astro dev` — cannot verify it starts cleanly without executing it.
- Vercel: `vercel.json` is minimal (`framework, buildCommand, outputDirectory` only). No env var, no routing overrides, no serverless functions. Cannot verify the current deployment state from the codebase.

### Runtime concerns not surfaced by build
- **Snipcart is in test mode** (`Layout.astro:94`). Checkout with the test API key will work end-to-end in Snipcart's sandbox but not process real payments.
- **Donorbox/Givebutter:** HEAD has live Donorbox; working tree swaps to Givebutter placeholders. If the working tree is what gets deployed, the donate page will render Givebutter with `YOUR_ACCOUNT_ID` / `WIDGET_ID` and the widget will fail to load.
- **`src/lib/cms.ts`** still exists as a one-line stale stub; it is not imported by anything but also not deleted.

---

## 13. Documentation Files

| File | Purpose | Current? |
| --- | --- | --- |
| `README.md` (20 lines) | Top-level intro, tech stack bullets, 501(c)(3) disclaimer | Minimal; matches reality |
| `CLAUDE.md` (139 lines) | Project rules for AI-assisted sessions — design tokens, conventions, "What NOT To Do" | Mostly current, but line 138 says *"Do NOT add Snipcart/Givebutter/Formspree until Phase 2"* while all three are already integrated. **Stale restriction.** |
| `DEPLOYMENT.md` (70 lines) | Vercel deploy checklist, DNS, env vars, go-live TODOs | References Formspree test step — current |
| `docs/editor-guide.md` (362 lines) | Non-technical guide for content editors of the Sanity studio | Current per working tree (untracked file, so not yet in any commit) |
| `docs/project-audit-2026-04-20.md` | **This file** | — |

No other `.md` files in the repo root or under `docs/`. `sanity/README.md` exists but is the auto-generated Sanity Studio readme and is not project-specific.

---

## Gaps this audit cannot answer (stated plainly)

- **Whether the Sanity write token has been rotated recently** — cannot verify from codebase. It lives in `.env` (ignored by git).
- **Whether the Snipcart live API key exists anywhere** — only the test key is present in `Layout.astro`. A live key may or may not be configured on Snipcart's dashboard.
- **Which Donorbox vs. Givebutter path is the intended production choice** — HEAD says Donorbox; working tree says Givebutter; privacy/terms pages say Givebutter. The source of truth is a product decision, not visible in code.
- **Last successful Vercel deploy commit** — not queryable from the local repo. Check Vercel dashboard.
- **Whether the currently dirty ~90 files represent one in-progress feature or several** — inspection suggests "CMS-ification of the whole site" (adding GROQ props, schemas, and seed scripts in parallel), but the commit boundary is up to the maintainer.
- **Whether any of the seed scripts have been run against production** — would need Sanity project history to confirm.
