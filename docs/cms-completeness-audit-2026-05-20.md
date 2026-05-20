# CMS Completeness Audit, 2026-05-20

Goal: confirm whether Belinda (non-technical client) can edit ALL user-facing content on the Jewmanity site through Sanity Studio. Anything hardcoded in a `.astro` file that she would reasonably want to change is a gap.

Working tree: `/Users/hek/jewmanity`, branch state assumed clean. This audit is read-only.

Prior cycle: `docs/cms-website-gap-audit-2026-05-18.md` (14 items, all marked closed in `docs/cms-audit-2026-05-18-closeout.md`). The prior audit scoped narrowly to schema↔GROQ↔page drift. The user's intuition is correct: a lot of editorial copy living inside `src/components/*.astro` and the legal pages was out of scope and never surfaced.

---

## TL;DR

**Counts (HARDCODED-NO-SCHEMA gaps, the real "Belinda cannot edit this" cases):**

| Category | Count | Examples |
|---|---|---|
| Legal page bodies (no CMS at all) | 3 pages | privacy.astro, terms.astro, nonprofit-disclosures.astro |
| Form labels, placeholders, options, success/error messages | ~40 strings | ContactForm, VolunteerForm, Newsletter |
| Component section headings + subtitles that pages do not pass through from CMS | ~10 sections | RecipeGrid "From Our Table to Yours", ProductGrid "Our Current Collection", TeamGrid "Our Team", recipe-page "Ingredients/Instructions/Chef's Notes", retreat article "Retreat Photos", testimonial carousel on heads-up "Voices from Heads Up" |
| 404 page | 1 page (all copy) | 404.astro |
| Navigation menu (labels, order, parent/child structure) | 1 component | Navigation.astro + MobileMenu.astro (duplicated) |
| Footer secondary copy (legal link labels, tax disclaimer) | 1 component | Footer.astro |
| Site-level meta defaults (title, description, OG image, structured data) | 1 file | Layout.astro |
| Givebutter widget ID and account | 1 component | DonateHero.astro |
| Newsletter section privacy note ("You can unsubscribe…") | 1 component | Newsletter.astro |
| Mitzvah page FAQ heading/subtitle (called out in May audit, schema fields never added) | 1 page | mitzvah-project.astro |
| Image alt text on CMS-driven section images (e.g., "Safe, supportive retreat environment…") | ~8 components | SafeHaven, WhyGive, etc. |
| Crisis country dropdown dataset (37 countries) | 1 component | CrisisResources.astro |

**Overall verdict:** No, the site does not currently meet "Belinda can edit everything." The May 18 audit closed all 14 schema-drift items it found, but a much wider class of hardcoded content remains. Most surprising: the three legal pages, the 404, the navigation labels, the form fields and their entire option lists, and the site default page title/description are 100% code, with no schema surface area whatsoever.

Severity-weighted, the highest-priority gaps to close are:
1. The three legal pages (legally required content, must change as laws/policies change, and Belinda is the only one who can review/approve)
2. Navigation labels and order (any page rename or new page requires a code change)
3. Form labels, subject/interest options, and success/error messages (Belinda will absolutely want to tweak these once forms start producing real submissions)
4. The 404 page (low-stakes but trivial to wire and surprising to find hardcoded)

---

## 1. Punch list, by page (in nav order)

Severity legend: HIGH = Belinda will definitely want to edit, MEDIUM = she might, LOW = unlikely but listing for completeness.

### 1.1 Homepage (`src/pages/index.astro`)

The page itself is fully CMS-wired. All gaps below live in the components it imports.

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/home/Newsletter.astro:69-72` | "You can unsubscribe at any time. Review our Privacy Policy." footer line | `homepage.newsletterFootnote` (text) | MEDIUM |
| `src/components/home/Newsletter.astro:65` | Placeholder message "Newsletter signup is being configured. Subscribe at launch." | `homepage.newsletterPlaceholder` (string) | LOW |
| `src/components/home/Newsletter.astro:50` | Email input placeholder "Enter your email" | `homepage.newsletterEmailPlaceholder` (string) | LOW |
| `src/components/home/Newsletter.astro:57` | Submit button text "Subscribe" | `homepage.newsletterButtonText` (string) | LOW |
| `src/components/home/Hero.astro:42` | Hero image `loading="eager"` and the image alt text fallback "Jewish community members gathering together in support" | Already covered by `homepage.heroImageAlt`; the fallback ships with no CMS link | LOW |
| `src/components/home/HowWeHelp.astro:79` | "Learn More" link text inside each program card | `programCard.linkText` (string) per card | MEDIUM |
| `src/components/home/ImpactStories.astro:43-49` | Hardcoded "Your Story / Share your experience" placeholder slide that always appends to the carousel | Either a `homepage.impactStoriesCallout` object, or remove if not editorial | MEDIUM |
| `src/components/home/ImpactStories.astro:140` | "Read their story →" / "Share your story →" inline text | `homepage.impactStoriesReadLinkText` (string) | LOW |
| `src/components/home/DonationCTA.astro:50-74` | "$X" amount, link to `/donate?amount=X`, hardcoded `→` chevron on each tier | Mostly already CMS, but the link prefix is computed in code | LOW |

### 1.2 About > Our Story (`src/pages/about/story.astro`)

Fully wired through `aboutStory` singleton. No new gaps beyond `hero.ctas` (already addressed in prior audit) and image alt text on `WhyGive`-style sections.

### 1.3 About > Our Team (`src/pages/about/team.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/about/TeamGrid.astro:50` | "Our Team" section heading | `aboutTeamPage.teamSectionHeading` (string) | HIGH |
| `src/components/about/TeamGrid.astro:52-54` | "A group of leaders, advocates, and community members…" subtitle | `aboutTeamPage.teamSectionSubtitle` (text) | HIGH |
| `src/components/about/TeamMember.astro` | TeamMember photo gradient fallback (placeholder until a `photo` is set on each member) | Editor cannot influence; informational only | LOW |

### 1.4 About > Community Stories listing (`src/pages/about/community-stories.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/pages/about/community-stories.astro:40-55` | `fallbackStories` array with Matan + Dahlia full quotes if testimonials CMS empty | Already covered by `testimonial` documents; just need Sanity content. **Verify Belinda knows to populate testimonials.** | MEDIUM (content task) |

### 1.5 About > Community Story detail (`/about/community-stories/[slug]`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/pages/about/community-stories/[slug].astro:14-77` | Six full hardcoded fallback stories with quotes and attributions | Need Sanity `communityStory` documents for all 6 slugs (probable content task; schema exists) | MEDIUM (content task) |
| `src/pages/about/community-stories/[slug].astro:160` | "Back to Community Stories" link text | `communityStory.backLinkText` (string) or site-wide setting | LOW |

### 1.6 Programs > Heads Up (`src/pages/programs/heads-up.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/pages/programs/heads-up.astro:117-118` | TestimonialCarousel heading "Voices from Heads Up" and subtitle "Honest reflections from soldiers…" | `headsUp.testimonialsHeading`, `headsUp.testimonialsSubtitle` (string + text) | HIGH |
| `src/pages/programs/heads-up.astro:68-75` | Inline `fallbackTestimonials` (single Matan testimonial if CMS empty) | Already covered by `testimonial` content task | MEDIUM (content task) |

### 1.7 Programs > Past Retreats (`src/pages/programs/past-retreats.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/programs/RetreatGrid.astro:52-53` | Default grid heading "Stories of courage…" + subtitle paragraph if `programsPastRetreatsPage.gridHeading` empty | Schema field already exists; verify seed populates it. **Spot check passes.** | MEDIUM (content task) |
| `src/pages/programs/past-retreats.astro:71-82` | Two-entry fallback testimonial array (Matan, Dahlia) for the carousel | Content task; `testimonial` schema supports it | MEDIUM (content task) |

### 1.8 Programs > Retreat detail (`/programs/[slug]`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/programs/RetreatArticle.astro:50` | "Retreat Photos" gallery heading | `retreat.galleryHeading` (string) on the document, or a site-wide `programsPastRetreatsPage.galleryHeading` | LOW |
| `src/components/programs/RetreatArticle.astro:152` | "Back to Past Retreats" link text | Could go in `programsPastRetreatsPage.detailBackLinkText` | LOW |
| `src/pages/programs/[slug].astro:36` | Hero image fallback `/images/hero/retreat-article.jpg` | Per-retreat field is `coverImage` (already wired). Fallback path is fine. | LOW |
| `src/pages/programs/[slug].astro:66` | Page meta description "Read about this transformative Heads Up healing retreat experience." | Add per-retreat `metaDescription` to the `retreat` schema, or accept | LOW |

### 1.9 Community > Fighting Antisemitism (`src/pages/community/fighting-antisemitism.astro`)

Fully wired. Note that `ResourcesGrid` falls back to 6 hardcoded articles + 6 hardcoded organizations if neither the `fightingAntisemitism.organizations` array nor the `recommendedArticle` collection has entries (content task, not a code gap).

### 1.10 Community > Recipes listing (`src/pages/community/recipes.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/community/RecipeGrid.astro:75` | Grid heading "From Our Table to Yours" | `communityRecipesPage.gridHeading` (string) | HIGH |
| `src/components/community/RecipeGrid.astro:78-80` | Grid subtitle "Delicious recipes passed down…" | `communityRecipesPage.gridSubtitle` (text) | HIGH |
| `src/components/community/RecipeGrid.astro:16-66` | Seven full hardcoded recipe fallbacks | Content task; `recipe` schema covers it | MEDIUM (content task) |

### 1.11 Community > Recipe detail (`/community/recipes/[slug]`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/community/RecipePage.astro:222` | "Ingredients" section label | `communityRecipesPage.detailIngredientsLabel` or just leave as code | LOW |
| `src/components/community/RecipePage.astro:242` | "Instructions" section label | Same pattern | LOW |
| `src/components/community/RecipePage.astro:262` | "Chef's Notes" label | Same pattern | LOW |
| `src/components/community/RecipePage.astro:271-275` | "Share This Recipe" card heading and subtitle "This recipe is shared with love from our community. We hope it brings warmth and sweetness to your table." | `communityRecipesPage.detailShareHeading` + `detailShareSubtitle` | MEDIUM |
| `src/components/community/RecipePage.astro:286` | "Copy Link" button text + transient "Copied!" / "Copy failed" states | Could go in `communityRecipesPage.detail*` | LOW |
| `src/components/community/RecipePage.astro:295` | "Print Recipe" button text | Same | LOW |
| `src/components/community/RecipePage.astro:303` | "More from Our Table" related-recipes heading | `communityRecipesPage.relatedRecipesHeading` (string) | LOW |
| `src/components/community/RecipePage.astro:323` | "View All Recipes →" link text | Same | LOW |
| `src/components/community/RecipePage.astro:64-70` | Breadcrumb: "Community", "Recipes" labels | Should derive from nav structure but currently hardcoded | LOW |
| `src/components/community/RecipePage.astro:155` | "Recipe by {author}" label prefix | Currently always "Recipe by" — fine | LOW |
| `src/components/community/RecipePage.astro:172,182,192,202` | Metadata labels "Prep", "Cook", "Servings", "Difficulty" | `communityRecipesPage.detail*Label` set | LOW |

### 1.12 Get Involved > Volunteer (`src/pages/get-involved/volunteer.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/volunteer/VolunteerForm.astro:40-67` | Form labels: First Name, Last Name, Email Address | `volunteerPage.formLabels` object (or individual fields), plus `formLabelEmail` etc. | HIGH |
| `src/components/volunteer/VolunteerForm.astro:86, 102, 113, 134, 160, 174` | Field labels: Phone Number, City/Location, How did you hear about us?, Areas of Interest, Tell us about yourself, Availability | Same as above | HIGH |
| `src/components/volunteer/VolunteerForm.astro:49,58,81,93,109` | Placeholders: "Enter your first name", "Enter your last name", "your@email.com", "(555) 123-4567", "e.g. San Diego, CA" | Same schema slot for placeholders | MEDIUM |
| `src/components/volunteer/VolunteerForm.astro:122-129` | Referral dropdown options (6 entries) | `volunteerPage.referralOptions` (array of string) | HIGH |
| `src/components/volunteer/VolunteerForm.astro:139-144` | Areas of Interest checkbox options (4 entries) | `volunteerPage.interestOptions` (array of string) | HIGH |
| `src/components/volunteer/VolunteerForm.astro:182-187` | Availability dropdown options (4 entries) | `volunteerPage.availabilityOptions` (array of string) | HIGH |
| `src/components/volunteer/VolunteerForm.astro:167` | Textarea placeholder "Share anything you'd like us to know — your background, availability, or what drew you to volunteer." | `volunteerPage.aboutTextareaPlaceholder` (text) | MEDIUM |
| `src/components/volunteer/VolunteerForm.astro:197` | Submit button text "Submit Volunteer Application" + "Submitting…" loading state | `volunteerPage.submitButtonText` (string) | MEDIUM |
| `src/components/volunteer/VolunteerForm.astro:211` | Success message "Thank you for your application! We'll be in touch soon." | `volunteerPage.successMessage` (text) | HIGH |
| `src/components/volunteer/VolunteerForm.astro:220` | Error message "Something went wrong. Please try again." | `volunteerPage.errorMessage` (text) | MEDIUM |
| `src/components/volunteer/VolunteerForm.astro:225` | "The volunteer application form is being configured…" placeholder when env var missing | `volunteerPage.formPlaceholderText` (text) | LOW |
| `src/components/volunteer/VolunteerForm.astro:34` | Hidden `_subject` value "New Volunteer Application" (Formspree email subject) | Could go in CMS as `volunteerPage.emailSubject` | LOW |
| `src/pages/get-involved/volunteer.astro:77-88` | Hardcoded fallback testimonials (2 entries) | Content task | MEDIUM |
| `src/pages/get-involved/volunteer.astro:90-98` | Hardcoded fallback FAQs (7 entries) | Content task — `faqItem` schema covers it | MEDIUM |

### 1.13 Get Involved > Mitzvah Project (`src/pages/get-involved/mitzvah-project.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/pages/get-involved/mitzvah-project.astro:106-107` | FAQ section heading "Frequently Asked Questions" + subtitle "Have questions? We're here to help." (the May 2026 audit flagged this and noted that `mitzvahProject` schema does not declare them; **still not added**) | `mitzvahProject.faqHeading` + `mitzvahProject.faqSubtitle` (string + text) | HIGH |
| `src/components/mitzvah/MitzvahCTA.astro:17` | Default secondary button URL `/jewmanity-bar-bat-mitzvah-project.pdf` | Already CMS-controllable via `mitzvahProject.ctaButton2Url`; the file path itself is the gap (no PDF upload field) | MEDIUM |

### 1.14 Get Involved > Contact (`src/pages/get-involved/contact.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/contact/ContactForm.astro:35,49,66,80,103` | Form labels: First Name, Last Name, Email Address, Subject, Message | `contactPage.formLabels.*` (or individual fields per label) | HIGH |
| `src/components/contact/ContactForm.astro:44,58,75,90,112` | Placeholders: "Enter your first name", "Enter your last name", "your@email.com", "Select a topic", "Write your message here…" | `contactPage.formPlaceholders.*` | MEDIUM |
| `src/components/contact/ContactForm.astro:91-97` | Subject dropdown options (7 entries: General Inquiry, Program Information, Volunteer Opportunities, Donation Questions, Mitzvah Project, Partnership, Other) | `contactPage.subjectOptions` (array of string) | HIGH |
| `src/components/contact/ContactForm.astro:123` | Submit button text "Send Message" + "Sending…" loading | `contactPage.submitButtonText` | MEDIUM |
| `src/components/contact/ContactForm.astro:137` | Success message "Thank you! Your message has been sent." | `contactPage.successMessage` (text) | HIGH |
| `src/components/contact/ContactForm.astro:146` | Error message "Something went wrong. Please try again." | `contactPage.errorMessage` (text) | MEDIUM |
| `src/components/contact/ContactForm.astro:151` | "The contact form is being configured…" placeholder | `contactPage.formPlaceholderText` (text) | LOW |

### 1.15 Resources (`src/pages/resources.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/resources/CrisisResources.astro:111-147` | International country `<option>` dropdown (37 countries) | Could become a Sanity reference list, but practically this is a static dataset Belinda will rarely touch | LOW |
| `src/components/resources/CrisisResources.astro:162-310` | Crisis phone numbers per country (the `crisisData` object inside the `<script>`) | Same as above; if Belinda needs to add a country she'd ping a dev | LOW |
| `src/components/resources/CrisisResources.astro:151-152` | "Select your country to find local crisis support numbers" empty-state text | `resources.crisisInternationalEmptyText` | LOW |

### 1.16 Shop listing (`src/pages/shop.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/shop/ProductGrid.astro:64` | Product grid heading "Our Current Collection" | `shopPage.productGridHeading` (string) | HIGH |

### 1.17 Shop product detail (`/shop/[slug]`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/shop/ProductDetail.astro:83` | Breadcrumb "Shop" link label | LOW (derived from nav; ok to leave) | LOW |
| `src/components/shop/ProductDetail.astro:103` | "What Makes It Special" features section heading | `shopPage.detailFeaturesHeading` (string) or per-product field | MEDIUM |
| `src/components/shop/ProductDetail.astro:118` | "Quantity" label | `shopPage.detailQuantityLabel` (string) | LOW |
| `src/components/shop/ProductDetail.astro:158` | "Add to Cart +" button text | `shopPage.addToCartButtonText` (string) | MEDIUM |
| `src/components/shop/ProductDetail.astro:165` | "Sold Out" state text | `shopPage.soldOutText` (string) | MEDIUM |

### 1.18 Donate (`src/pages/donate.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/components/donate/DonateHero.astro:64-65` | Givebutter widget account ID `qGMyp9PcvINJwyvd` and widget ID `g8MJdP` | Environment variables or `siteSettings.givebutterAccountId` + `givebutterWidgetId` (strings) | HIGH (Belinda swapping live/test campaigns would need this) |
| `src/components/donate/DonateHero.astro:27` | Hero image alt text "Supporting healing through generous donations" | `donatePage.hero.imageAlt` (string) — currently no alt field on `heroSection` object | MEDIUM |

### 1.19 404 (`src/pages/404.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/pages/404.astro:4` | Page meta title and description | New `notFoundPage` singleton or `siteSettings.notFoundTitle/Description` | MEDIUM |
| `src/pages/404.astro:9-15` | H1 "Page Not Found" and body "The page you're looking for doesn't exist or has been moved. Let's get you back on track." | `notFoundPage.heading` + `notFoundPage.body` | MEDIUM |
| `src/pages/404.astro:16-35` | Three action buttons: Go Home, Browse Programs, Get in Touch (labels + hrefs) | `notFoundPage.buttons` array (3 entries) | MEDIUM |

### 1.20 Privacy Policy (`src/pages/privacy.astro`)

ENTIRE PAGE is hardcoded. ~80 lines of body content. No CMS at all.

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/pages/privacy.astro:4-12` | Page meta title, description, hero heading "Privacy Policy", "Last updated: March 2026" | `privacyPage.heading`, `metaDescription`, `lastUpdated` (date) | HIGH |
| `src/pages/privacy.astro:14-86` | 8 sections of body copy: Information We Collect, How We Use Your Information, Third-Party Services, Data Security, Cookies, Your Rights, Children's Privacy, Changes, Contact | `privacyPage.body` (portable text) | HIGH |

Recommend a `privacyPage` singleton with `heading`, `lastUpdated`, `intro`, and a portable text `body` field. Legal counsel will want to tweak this and shouldn't need a developer.

### 1.21 Terms of Service (`src/pages/terms.astro`)

Same problem. ~90 lines hardcoded.

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| All | Hero heading "Terms of Service", "Last updated", 10 body sections | New `termsPage` singleton with `heading`, `lastUpdated`, portable text `body` | HIGH |

### 1.22 Nonprofit Disclosures (`src/pages/nonprofit-disclosures.astro`)

Same problem. ~95 lines hardcoded. Notable: hardcoded EIN `99-4219099`, hardcoded "501(c)(3)" status copy, hardcoded $4,500 retreat cost breakdown (which would drift from the donate page's `donatePage.costBreakdown` totals if not kept in sync), hardcoded board of directors list (which would drift from `teamMember` documents).

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `src/pages/nonprofit-disclosures.astro:18-25` | Org info block: legal name, type, EIN, year established, state | `nonprofitDisclosuresPage.organizationInfo` object | HIGH |
| `src/pages/nonprofit-disclosures.astro:27-42` | Tax-deductible status copy | `nonprofitDisclosuresPage.taxStatusBody` (portable text) | HIGH |
| `src/pages/nonprofit-disclosures.astro:37-41` | Mission statement | `nonprofitDisclosuresPage.missionStatement` (text) | HIGH |
| `src/pages/nonprofit-disclosures.astro:43-63` | Use of funds (4 program bullets) | `nonprofitDisclosuresPage.programs` array | MEDIUM |
| `src/pages/nonprofit-disclosures.astro:65-77` | Financial transparency (the $4,500 cost breakdown — duplicates donatePage data) | Either reference `donatePage.costBreakdown` or new field | MEDIUM (de-dup risk) |
| `src/pages/nonprofit-disclosures.astro:79-85` | Board of directors list (Belinda, Andrew, Shai, Rabbi Avi) | Pull from `teamMember` documents filtered to board role, or new `nonprofitDisclosuresPage.boardMembers` | HIGH |

### 1.23 Pages outside main nav

None other than the legal pages and 404 above.

---

## 2. Cross-cutting gaps (site-wide chrome)

### 2.1 Navigation (`src/components/Navigation.astro` and `src/components/MobileMenu.astro`)

The entire nav structure is hardcoded **twice**, in two parallel files, with identical `navItems` arrays.

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `Navigation.astro:10-48`, `MobileMenu.astro:10-48` | 7 top-level items + their children, labels and hrefs | New `navigation` singleton with `items` array (each item: label, href, children) | HIGH |
| `Navigation.astro:147`, `MobileMenu.astro:83` | "Support Healing" CTA button text and `/donate` link in the top-right nav button | Either `siteSettings.navCtaText` / `navCtaHref` or part of the `navigation` singleton | HIGH |
| `Navigation.astro:75`, `MobileMenu.astro:75` | Logo alt text "Jewmanity" | Already in `siteSettings.orgName`; just need to wire it | LOW |
| Both files | Hardcoded logo image path `/images/logo.png` | `siteSettings.logo` (image) | MEDIUM |

The fact that the nav structure is duplicated between desktop and mobile is also a code quality risk: any nav edit needs to be done in both files. Worth consolidating when adding the CMS singleton.

### 2.2 Footer (`src/components/Footer.astro`)

`siteSettings` covers org name, EIN, social URLs, footer tagline, and copyright text. Remaining hardcoded:

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `Footer.astro:113,119,125` | Legal link labels: "Privacy Policy", "Terms of Service", "Nonprofit Disclosures" | `siteSettings.legalLinks` array (label + href) | MEDIUM |
| `Footer.astro:135-137` | Tax disclaimer "All donations are tax-deductible to the fullest extent allowed by law." | `siteSettings.footerDisclaimer` (text) | HIGH (legal copy) |
| `Footer.astro:131` | "&copy; {year} {orgName}. {copyrightText} EIN: {ein}" template — the literal "EIN:" label and the comma/space layout | Acceptable, but could be `siteSettings.copyrightTemplate` | LOW |

### 2.3 Site-level meta and structured data (`src/layouts/Layout.astro`)

| File:line | What is hardcoded | Suggested schema field | Severity |
|---|---|---|---|
| `Layout.astro:15-17` | Default page title "Jewmanity \| Supporting Healing & Resilience" and default description | `siteSettings.defaultPageTitle` + `defaultPageDescription` | HIGH |
| `Layout.astro:17` | Default OG image `/og-default.png` | `siteSettings.defaultOgImage` (image) | MEDIUM |
| `Layout.astro:27` | Canonical URL prefix `https://jewmanity.com` | Could be `siteSettings.canonicalDomain`; currently safe as code | LOW |
| `Layout.astro:39` | Theme color `#3783A3` | Design token, not editorial | LOW |
| `Layout.astro:72-90` | JSON-LD structured data: org name, founding date "2019", address (San Diego, CA), social URLs | `siteSettings.foundingYear`, `siteSettings.address.{locality, region, country}`. Some fields duplicate `socialLinks`; would be safer to derive | MEDIUM |
| `Layout.astro:77` | Logo URL in JSON-LD `https://jewmanity.com/images/logo.png` | Derive from `siteSettings.logo` once added | MEDIUM |
| `Layout.astro:101-103` | Skip-link text "Skip to content" | a11y; acceptable as code | LOW |

### 2.4 Image alt text on CMS-driven sections

Several components hardcode `alt` attributes for images that come from CMS, e.g.:
- `src/components/programs/SafeHaven.astro:37`: alt "Safe, supportive retreat environment for healing"
- `src/components/donate/WhyGive.astro:32`: alt "Community care and support through Jewmanity programs"
- `src/components/mitzvah/WhyThisMatters.astro` (similar pattern, not re-checked)

These should travel with the image in Sanity. If Belinda swaps an image, the alt becomes wrong. **Add `alt` to the image fields in each relevant singleton.** Severity: MEDIUM (accessibility risk).

---

## 3. Prior audit (2026-05-18) validation

Spot-checking each of the 14 closeouts.

| # | Topic | Closeout claim | Verification |
|---|-------|----------------|--------------|
| 1 | Wire `cmsRetreats` into `RetreatGrid` | Done in `814b86d` | **Confirmed.** `src/pages/programs/past-retreats.astro:64` passes `retreats={cmsRetreats.length > 0 ? cmsRetreats : undefined}`. `RetreatGrid.astro:50` consumes it. |
| 2 | Drop community-stories slug allowlist | Done in `814b86d` | **Confirmed.** `src/pages/about/community-stories/[slug].astro:89-94` now adds all CMS slugs without filtering against an allowlist. The `fallbackSlugs` array remains, but it's used only as a top-up for slugs not present in CMS (lines 96-99), which is the correct pattern. |
| 3 | Implement `product.inStock` visibility | Done in `4c5d761` | **Confirmed.** `ProductCard.astro:31` and `ProductDetail.astro:146` both check `inStock` and switch between "Add to Cart" and "Sold Out" UI. `src/pages/shop.astro:20` maps `inStock !== false` (so undefined defaults to true). `src/pages/shop/[slug].astro:119` does the same. |
| 4 | Remove `faqContext` ghost field | Done in `814b86d` + cleanup script | **Confirmed.** No `faqContext` reference in `seed-donate-page.ts` or `seed-volunteer-page.ts`. Schema files contain no such field. Cleanup script `scripts/cleanup-ghost-fields.ts` exists and is idempotent. |
| 5 | Remove `mitzvahProject` quote fields | Done in `c1aacf3` | **Confirmed.** `sanity/schemas/singletons/mitzvahProject.ts` contains no `openingQuote`, `inspirationalQuote`, or `inspirationalQuoteAttribution`. GROQ `getMitzvahProject` (src/lib/sanity.ts:477) similarly clean. |
| 6 | Read `siteSettings.footerTagline` | Done in `0d5c7ec` | **Confirmed.** `Footer.astro:26,99-103` reads and renders the tagline when present. |
| 7 | Render `hero.ctas` across heroes | Done in `4c5d761` | **Confirmed.** `HeroSection.astro:14-26` accepts and renders the `ctas` prop. Every page passing through `HeroSection` (about/story, about/team, programs/heads-up, etc.) wires `ctas={cms?.hero?.ctas}`. |
| 8 | Stop rendering `relatedRecipes` from hardcoded set | Done in `0d5c7ec` | **Confirmed.** `src/pages/community/recipes/[slug].astro:361-379` checks `allCmsRecipes.length > 0` first; the hardcoded set is only used when CMS returns zero recipes. |
| 9 | Surface other-region crisis resources | Done in `4c5d761` | **Confirmed.** `src/pages/resources.astro:67-79` groups all crisis resources by region (no `=== 'United States'` filter). `CrisisResources.astro:38-49` orders regions: US, Israel, International, then alphabetical. |
| 10 | Remove `resources.disclaimer` | Done in `c1aacf3` | **Confirmed.** Field absent from schema; only `medicalDisclaimer` remains, which is actively rendered. |
| 11 | CMS singletons for 4 orphan pages | Done in `2729896` | **Confirmed.** `aboutTeamPage`, `aboutCommunityStoriesPage`, `communityRecipesPage`, `programsPastRetreatsPage` all present in `sanity/schemas/singletons/` and wired into `src/lib/sanity.ts`. **However, see Section 1.3 — these new singletons only cover hero + CTA, not section headings inside the page bodies** (e.g., TeamGrid's "Our Team", RecipeGrid's "From Our Table to Yours", ProductGrid's "Our Current Collection"). The closeout is technically valid but the singletons are thin. |
| 12 | Remove dead `mitzvahProject.steps[]` subfields | Done in `c1aacf3` (with correction) | **Confirmed.** Schema retains only `steps[].title` and `steps[].description`. `label`, `actions`, `tip` removed. The correction noted that `description` was actively rendered, which lines up with `HowItWorks.astro:72-74`. |
| 13 | Wrap `getRetreats()` in try/catch in `[slug].astro` getStaticPaths | Done in `814b86d` | **Confirmed.** `src/pages/programs/[slug].astro:14-22` has try/catch and returns empty array on failure. |
| 14 | Annotate stale `*BySlug` claim in April audit | Done in `c1aacf3` | Did not re-verify; trust the closeout. |

**Net: all 14 closeouts hold up.** The May 18 audit was thorough within its scope. The reason this 2026-05-20 audit finds so many additional gaps is that the May 18 scope was narrowly "schema↔GROQ↔page drift" and did not check whether all editorial content is reachable from Sanity in the first place.

---

## 4. Recommendations, ordered for batching

Group fixes by the Sanity document that needs the new field, so similar edits batch into a single PR.

### Batch A — new singletons (HIGH priority)

1. **`privacyPage` singleton.** Heading, lastUpdated date, portable-text body, meta title/description. Seed from current page copy. Closes 1.20.
2. **`termsPage` singleton.** Same shape as privacyPage. Closes 1.21.
3. **`nonprofitDisclosuresPage` singleton.** organizationInfo (legalName, type, ein, foundingYear, state), missionStatement (text), taxStatusBody (portable text), programs array, useOfFunds portable text, board members (or reference to `teamMember` with role filter). Closes 1.22. Also deduplicates EIN with `siteSettings.ein`.
4. **`navigation` singleton.** Items array with label, href, children, plus a primary CTA (text + href + style). Consume from both `Navigation.astro` and `MobileMenu.astro`. Closes 2.1.
5. **`notFoundPage` singleton (or fold into siteSettings).** Heading, body, 3-button array, meta. Closes 1.19.

### Batch B — extend existing singletons (HIGH)

6. **`aboutTeamPage` + `communityRecipesPage` + `shopPage` (and similar): add inner-section heading/subtitle fields.** Specifically:
   - `aboutTeamPage.teamSectionHeading`, `teamSectionSubtitle`
   - `communityRecipesPage.gridHeading`, `gridSubtitle`
   - `shopPage.productGridHeading`
   - `headsUp.testimonialsHeading`, `testimonialsSubtitle`
   - `mitzvahProject.faqHeading`, `faqSubtitle` (called out in May audit, still open)
   Closes 1.3, 1.6, 1.10, 1.13, 1.16.

7. **Extend `contactPage` and `volunteerPage` with form-field schemas.** New fields:
   - `contactPage.subjectOptions` (array)
   - `contactPage.formLabels` + `formPlaceholders` (objects)
   - `contactPage.submitButtonText`, `successMessage`, `errorMessage`, `formPlaceholderText`
   - `volunteerPage.referralOptions`, `interestOptions`, `availabilityOptions` (arrays)
   - `volunteerPage.formLabels` + `formPlaceholders` (objects)
   - `volunteerPage.submitButtonText`, `successMessage`, `errorMessage`, `formPlaceholderText`
   Closes 1.12, 1.14.

8. **Extend `siteSettings` with site-level chrome:**
   - `legalLinks` array (label + href)
   - `footerDisclaimer` (text)
   - `defaultPageTitle`, `defaultPageDescription`, `defaultOgImage`
   - `logo` (image)
   - `foundingYear`, `address` (object)
   - `navCtaText`, `navCtaHref` (if not folded into `navigation`)
   - `givebutterAccountId`, `givebutterWidgetId`
   Closes 1.18 (Givebutter), 2.2, 2.3.

### Batch C — image alt text (MEDIUM)

9. **Add `alt` field to image inputs that drive section visuals.** Touch: `aboutStory.values` (already covered via card titles), `headsUp.safeHavenImage`, `donatePage.whyGiveImage`, etc. Currently the alt text is fixed in the component, not in Sanity. Add `alt` to the relevant Sanity image fields (Sanity supports `fields` on image type) and read it in each consuming component. Closes 2.4.

### Batch D — small text wiring (LOW priority but cheap)

10. Newsletter footnote, ImpactStories "Read their story" / "Share your story" link text, Recipe detail labels (Ingredients, Instructions, Chef's Notes, Share, Copy Link, Print, More from Our Table), Retreat article "Retreat Photos" + "Back to Past Retreats", Shop product detail "What Makes It Special" + "Quantity" + "Add to Cart" + "Sold Out". Could batch into a single "string polish" PR via `siteSettings.uiStrings` if you don't want to spread across multiple singletons.

### Batch E — content tasks for Belinda (no code work)

These are listed in the May 18 closeout but worth resurfacing:
- Add testimonials to displace hardcoded fallback testimonial arrays on heads-up, past-retreats, volunteer, and about/community-stories pages.
- Add `communityStory` documents for all six story slugs so the hardcoded fallback never renders.
- Set `siteSettings.footerTagline` if a tagline is desired.
- Add more `recipe` and `retreat` documents to displace component-level hardcoded fallbacks.

---

## 5. Notes and miscellany

- The `nav` is duplicated between `Navigation.astro` and `MobileMenu.astro`. Either pattern (CMS source-of-truth or shared TS module) eliminates the duplication risk.
- The Snipcart API key fallback in `Layout.astro:29` ships a TEST key publicly. This is the documented intent (`PUBLIC_SNIPCART_API_KEY` env var overrides), but confirm before launch that production has the env var set.
- The Givebutter widget ID is in component code; if Belinda runs a new campaign, the widget swap is currently a code change.
- The schema descriptions on `contactPage.formHeading` and `volunteerPage.formHeading` correctly tell editors that fields and options are managed in code. That guidance becomes false if Batch B item 7 above ships, so update those descriptions in the same PR.
- StoriesGrid.astro (`src/components/about/StoriesGrid.astro`) is dead code, no consumers. Safe to delete in a cleanup pass.
- `astro.config.mjs` site URL is `https://jewmanity.com` — confirmed correct per project memory.
