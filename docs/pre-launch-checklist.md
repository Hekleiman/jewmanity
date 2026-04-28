# Pre-Launch Checklist

Last updated: 2026-04-28

**Site state:** Pre-launch. `jewmanity.com` currently runs the old Squarespace site (real donors). `jewmanity.vercel.app` is the staging URL for the new Astro site, which will take over `jewmanity.com` at launch. No DNS cutover yet.

**Goal of this doc:** Single source of truth for everything that needs to happen before DNS flips. Each item tagged by owner and blocking status. Update as items close.

**Adjacent docs (do not duplicate; cross-reference):**
- `docs/pending-content-tasks.md` — Belinda-blocked content items (A5, A6 bylines, A6 gallery, Givebutter)
- `docs/givebutter-swap-runbook.md` — Givebutter swap procedure
- `docs/givebutter-campaign-config.md` — Givebutter campaign settings (with ASK BELINDA items)
- `docs/givebutter-test-plan.md` — post-swap test checklist
- `docs/editor-guide.md` — CMS editor reference for Belinda
- `docs/project-audit-2026-04-20.md` — exhaustive code-state audit from 2026-04-20
- `docs/belinda-changes-source-audit.md` — source-of-truth matrix for Belinda's change list
- `DEPLOYMENT.md` — Vercel + DNS + webhook setup steps

---

## Legend

- 🚫 **BLOCKER** — DNS cutover cannot happen until this is done
- 🟡 **PRE-LAUNCH** — Should be done before launch but not strictly blocking
- 🔵 **POST-LAUNCH OK** — Could ship without; address in week 1

Status icons:
- [ ] open
- [~] in progress
- [x] done

---

## Category A: Credentials & accounts

### A1. Givebutter ACCOUNT_ID + WIDGET_ID
- **Status:** [ ]
- **Owner:** Belinda
- **Blocker level:** 🟡 (only blocker if Givebutter is the chosen processor at launch — if Belinda opts to launch on Donorbox and migrate later, downgrades to 🔵)
- **Source:** `docs/givebutter-swap-runbook.md`, `docs/pending-content-tasks.md`, branch `feat/givebutter-migration`
- **Description:** Belinda must finish Givebutter signup, configure the campaign per `docs/givebutter-campaign-config.md` (six Chai presets + ASK BELINDA decisions), and deliver `ACCOUNT_ID` + `WIDGET_ID`.
- **Next action:** Wait on Belinda. When delivered, follow runbook.

### A2. Snipcart LIVE API key
- **Status:** [ ]
- **Owner:** Belinda (provides) → CC (wires)
- **Blocker level:** 🚫 BLOCKER
- **Source:** `src/layouts/Layout.astro:94-95` (`<div hidden id="snipcart" data-api-key="YzI4...">` followed by `<!-- NOTE: This is the TEST API key. Switch to live key before production deployment. -->`); `DEPLOYMENT.md` post-deploy checklist line 1: "Switch Snipcart from Test to Live mode (Dashboard → toggle)".
- **Description:** A Snipcart **test** API key is currently hardcoded in `Layout.astro` and ships in every page's HTML on staging. Test keys cannot accept real payments — every Add-to-Cart on the new site today routes to Snipcart's sandbox. Live key swap requires (a) Belinda toggling Snipcart from Test → Live mode in her Snipcart dashboard, (b) Belinda providing the live API key, (c) CC swapping the key in `Layout.astro` (and ideally moving it to an env var as part of C1 below).
- **Next action:** Belinda toggles to Live and shares the key. Hard-fail launch blocker — donors cannot purchase merch with the test key.

### A3. Donorbox production campaign confirmation
- **Status:** [ ]
- **Owner:** Belinda
- **Blocker level:** 🟡
- **Source:** `DEPLOYMENT.md` post-deploy checklist line 2: "Verify Donorbox production campaign is active". Iframe src is `https://donorbox.org/embed/jewmanity-donation` (`src/components/donate/DonateHero.astro:42`).
- **Description:** Confirm the `jewmanity-donation` campaign in Donorbox is live (not test mode), is configured to receive payouts to Jewmanity's bank account, and has the six Chai-tier presets (`18`, `36`, `180`, `360`, `720`, `1800`) so URL-param pre-select works on tier-card click-throughs.
- **Next action:** Belinda spot-checks the Donorbox campaign settings.

### A4. Sanity API token rotation policy
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🔵
- **Source:** `.env` (token present locally), `docs/project-audit-2026-04-20.md` §2 ("Environment Variables"), 38 scripts in `scripts/` that read `SANITY_API_TOKEN`.
- **Description:** A long-lived Sanity write token sits in `.env` (gitignored) and Vercel env vars. No rotation policy documented. Pre-launch hygiene: confirm the token in production Vercel matches what's in `.env`, document a rotation procedure (revoke in Sanity → issue new → update Vercel + local `.env`), set a calendar reminder.
- **Next action:** Add a one-page `docs/sanity-token-rotation.md` runbook. Not on critical path.

---

## Category B: Content (Belinda-owned)

Most active content items live in `docs/pending-content-tasks.md`. Cross-referenced here.

### B1. Antisemitism 2025/26 metric updates (A5 from designer audit)
- **Status:** [ ]
- **Owner:** Belinda
- **Blocker level:** 🟡 (current 2024 figures with citations are correct-as-of-citation-date; not strictly wrong, just stale)
- **Source:** `docs/pending-content-tasks.md` "A5 — Fighting Antisemitism metric cards". GROQ confirmed `fightingAntisemitism.understandingStats` returns 9,354 / 344% / 67% with 2024 ADL/AJC citations.
- **Description:** Belinda to source 2025 or early-2026 ADL/AJC figures and update each `understandingStats[]` entry's `value`, `description`, and `citation` in Sanity Studio.
- **Next action:** Wait on Belinda.

### B2. Recipe author bylines (A6 from designer audit)
- **Status:** [ ]
- **Owner:** Belinda
- **Blocker level:** 🟡
- **Source:** `docs/pending-content-tasks.md` "A6 — Recipe author bylines". All 7 recipes show "Recipe by Belinda Donner" placeholder per the doc.
- **Description:** Belinda to provide real recipe authors and update each `recipe.author` field in Sanity Studio. Schema field already exists.
- **Next action:** Wait on Belinda.

### B3. Recipe second-image gallery photos (A6)
- **Status:** [ ]
- **Owner:** Belinda → CC (carousel UI already shipped)
- **Blocker level:** 🔵
- **Source:** `docs/pending-content-tasks.md` "A6 — Recipe second-image gallery". Schema `gallery` field present at `sanity/schemas/documents/recipe.ts:133`. `RecipePage.astro:83-145` renders carousel when `galleryImages.length > 1`. GROQ confirmed all 7 recipes have `hasGallery: false`.
- **Description:** Source second photo (family/context image) per recipe. Recipes look fine with one image; gallery is enrichment, not a launch requirement.
- **Next action:** Belinda sources photos when available.

### B4. Mitzvah project "Why This Matters" image
- **Status:** [ ]
- **Owner:** Harrison (sources photo) → Belinda (uploads)
- **Blocker level:** 🟡
- **Source:** `docs/mitzvah-fixes-verification-2026-04-26.md` "STILL DIFFERS — punch list item #6". Design shows two-men-on-couch conversation; live page shows wider community-gathering photo at `public/images/sections/mitzvah-why-matters.jpg`.
- **Description:** The Mitzvah Project page Why-This-Matters section image is not the design-spec photo. Design-correct subject (quiet two-men-on-couch conversation) was not available locally during the 2026-04-26 fix pass; placeholder community-gathering photo was kept.
- **Next action:** Harrison provides design-spec photo or approves the current substitute. Belinda uploads to Sanity `mitzvahProject.whyImage` once delivered.

### B5. Heads Up testimonials count
- **Status:** [ ]
- **Owner:** Belinda
- **Blocker level:** 🔵
- **Source:** GROQ `count(*[_type=="testimonial"])` returns 2 (Matan, Dahlia). `docs/belinda-changes-source-audit.md` item #3 noted plans for a Heads Up testimonial section. `src/components/shared/TestimonialCarousel.astro` is wired up and consumes `getTestimonials(context)`.
- **Description:** Only two testimonials exist in production. The `TestimonialCarousel` component supports more; the Heads Up page would benefit from 2–3 additional voices. Not strictly blocking — the carousel renders fine with one entry — but a thin testimonial deck looks pre-launch.
- **Next action:** Belinda sources additional Heads Up + Volunteer testimonials over time.

### B6. Donor field parity check (Donorbox vs Givebutter)
- **Status:** [ ]
- **Owner:** Belinda
- **Blocker level:** 🟡 (only matters if Givebutter ships)
- **Source:** `docs/givebutter-campaign-config.md` "Required donor fields" section.
- **Description:** Confirm exact field set the current Donorbox campaign collects so the Givebutter form requires the same set. Need to inspect Donorbox dashboard manually.
- **Next action:** Belinda reads off the Donorbox campaign field config when building the Givebutter form.

---

## Category C: Code hygiene (CC- or Er-owned)

### C1. Snipcart key → env var (paired with A2)
- **Status:** [ ]
- **Owner:** CC
- **Blocker level:** 🟡 (functional fix is the live-key swap A2; env-var move is hygiene)
- **Source:** `src/layouts/Layout.astro:94`. Pattern: `data-api-key="..."` is a hardcoded string in the component.
- **Description:** Move the Snipcart API key out of source code into `import.meta.env.PUBLIC_SNIPCART_API_KEY` (must be `PUBLIC_*` prefix to be readable in client-side template). Add to `.env.example` and Vercel env vars. Keeps the value out of git history and lets test/live mode swap via env without code changes.
- **Next action:** Do this at the same time as A2 — single commit that moves the key to env and switches to live in Vercel env config.

### C2. `info@jewmanity.com` vs `info@jewmanity.org` typo
- **Status:** [ ]
- **Owner:** CC
- **Blocker level:** 🚫 BLOCKER
- **Source:** `src/components/mitzvah/HowItWorks.astro:22` — `'Email Jewmanity at info@jewmanity.com with the subject line: "Mitzvah Project – [Your Name]"'`. Every other contact-email reference uses `info@jewmanity.org`: `src/pages/privacy.astro:84`, `src/pages/terms.astro:35,88`, `src/pages/nonprofit-disclosures.astro:90`.
- **Description:** Single string in the Mitzvah Project step-1 instructions points donors at `.com` instead of `.org`. If `.com` doesn't have an MX record routing to the same inbox (likely doesn't, given `.com` runs Squarespace), donors who follow the instructions will email a black hole.
- **Next action:** One-character/three-character fix. Out of scope for this discovery prompt (rules say no code changes); flag for the next code-cleanup batch.

### C3. Stale TODO comments in components
- **Status:** [ ]
- **Owner:** CC
- **Blocker level:** 🔵
- **Source:**
  - `src/components/about/StoriesGrid.astro:118` — `<!-- TODO: Replace with real image from Sanity -->` next to a placeholder gradient block
  - `src/pages/community/recipes.astro:27` — `{/* TODO: Replace with real photo from client */}` adjacent to the recipes hero `backgroundImage`
- **Description:** Two TODO comments tied to imagery still pending. The StoriesGrid one is a fallback path that only renders when a community-story doc has no image — currently inert because all 6 community stories have images per the 2026-04-22 seed. The recipes hero uses a static `/images/hero/recipes.jpg`. Both are hygiene, not bugs.
- **Next action:** Decide: source the missing photos (B-category content work) OR delete the TODO comments and accept the fallback path.

### C4. Unused `FORMSPREE_ID` in `.env.example` (already removed per `73e5f39`?)
- **Status:** [x] (resolved per `git log` showing commit `73e5f39 chore: remove unused FORMSPREE_ID from .env.example`)
- **Owner:** —
- **Blocker level:** —
- **Source:** `.env.example` (current contents: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`, `ANTHROPIC_API_KEY` only — no `FORMSPREE_ID`); `git log -S FORMSPREE_ID` shows commit `73e5f39`.
- **Description:** Form action URLs are hardcoded to `https://formspree.io/f/xlgpvpja` in `ContactForm.astro:20` and `VolunteerForm.astro:25`. The env var has already been removed.
- **Next action:** None.

### C5. `SANITY_WRITE_TOKEN` and `SANITY_TOKEN` aliases not documented
- **Status:** [ ]
- **Owner:** CC
- **Blocker level:** 🔵
- **Source:** `docs/project-audit-2026-04-20.md` §2: "`SANITY_WRITE_TOKEN` — Many seed scripts as an alias — not in `.env.example`"; `scripts/migrate-products.mjs:8` uses `SANITY_TOKEN` (third alias). Cross-checked: `scripts/patch-designer-audit-2026-04-28.ts:22` reads `process.env.SANITY_API_TOKEN ?? process.env.SANITY_WRITE_TOKEN`.
- **Description:** Three names for the same secret across scripts. `.env.example` only documents `SANITY_API_TOKEN`. Anyone running an unfamiliar script may not know which env var name it expects. Hygiene item: standardize on `SANITY_API_TOKEN` everywhere or document the aliases.
- **Next action:** Either (a) sweep `scripts/` to use only `SANITY_API_TOKEN`, or (b) add aliases to `.env.example` with a comment. Low priority.

### C6. `dist/` size: 300 MB
- **Status:** [ ]
- **Owner:** CC
- **Blocker level:** 🔵
- **Source:** `du -sh dist/` after `npm run build` returns 300M for 39 pages.
- **Description:** Large for a static site. Likely dominated by unoptimized hero/retreat photos in `public/images/`. Not a launch blocker — Vercel serves them fine — but cold-cache LCP and bandwidth may suffer. Worth an image-optimization pass at some point.
- **Next action:** Run an image-size audit; convert remaining `.jpg`/`.png` to `.webp` where possible; verify Astro's image-component is being used for the largest hero images.

### C7. Newsletter form points at Mailchimp embed URL
- **Status:** [ ]
- **Owner:** Er (verify it's the right Mailchimp list)
- **Blocker level:** 🟡
- **Source:** `src/components/home/Newsletter.astro:23` — `action="https://gmail.us13.list-manage.com/subscribe/post?u=63c97041047a0d6a6e1c61091&id=728dc5cdc2&f_id=0008a0e0f0"`.
- **Description:** Newsletter form posts directly to a Mailchimp list owned by `gmail.us13.list-manage.com` user `63c97041047a0d6a6e1c61091`, list ID `728dc5cdc2`. Verify this is the correct Jewmanity Mailchimp account/list (vs a placeholder dev list) and that the welcome-email automation is configured.
- **Next action:** Confirm with Belinda that this is her live Jewmanity Mailchimp list. If not, swap the action URL.

---

## Category D: Integration testing (Er-owned, browser-executed)

### D1. End-to-end Donorbox $1 test
- **Status:** [ ]
- **Owner:** Er + Belinda (Belinda confirms receipt)
- **Blocker level:** 🚫 BLOCKER
- **Source:** `DEPLOYMENT.md` post-deploy checklist line 6: "Test donation widget (Donorbox)".
- **Description:** Run a $1 donation through the live Donorbox campaign on staging. Confirm: (a) widget renders interactively, (b) `?amount=180` URL-param pre-select works, (c) donation completes, (d) Stripe receipt arrives at the configured receipt email, (e) funds appear in Donorbox dashboard, (f) tax-receipt template includes Jewmanity 501(c)(3) EIN.
- **Next action:** Run before DNS cutover.

### D2. Snipcart sandbox checkout test (test mode)
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🟡 (test before A2 live-key swap; live-mode test required after)
- **Source:** `DEPLOYMENT.md` post-deploy checklist line 5: "Test Add to Cart + checkout flow (Snipcart)".
- **Description:** With the current TEST API key, run a test checkout on the staging URL: add a product (e.g., heads-up-water-bottle), proceed to checkout, complete with a Stripe test card. Confirms cart UI, shipping, payment integration end-to-end. After A2 lands (live key), repeat in live mode with a real card and refund.
- **Next action:** Test mode now; live mode after A2.

### D3. Formspree submission test (contact + volunteer)
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🚫 BLOCKER
- **Source:** `src/components/contact/ContactForm.astro:20` and `src/components/volunteer/VolunteerForm.astro:25` both POST to `https://formspree.io/f/xlgpvpja`. `DEPLOYMENT.md` post-deploy checklist line 3: "Test contact form submission (Formspree)".
- **Description:** Submit each form on staging with a test message. Confirm: (a) form submits without error, (b) submission arrives in Formspree dashboard, (c) Formspree forwards to Belinda's email (or whichever inbox is configured), (d) auto-reply to the user fires if configured.
- **Next action:** Run twice (once per form) before DNS cutover.

### D4. Mailchimp newsletter subscription test
- **Status:** [ ]
- **Owner:** Er + Belinda
- **Blocker level:** 🟡
- **Source:** `src/components/home/Newsletter.astro:23` Mailchimp action URL. `DEPLOYMENT.md` post-deploy checklist line 4: "Test newsletter signup (Mailchimp)".
- **Description:** Subscribe a test email through the homepage newsletter form. Confirm: (a) form submits, (b) test email appears in the Mailchimp audience list, (c) double-opt-in confirmation email fires, (d) post-confirmation welcome automation runs (if configured).
- **Next action:** Run before DNS cutover.

### D5. Givebutter test plan (post-swap, if applicable)
- **Status:** [ ] (deferred — only runs if/when Givebutter swap happens)
- **Owner:** Er + Belinda
- **Blocker level:** 🟡 conditional
- **Source:** `docs/givebutter-test-plan.md` (sections 1–10).
- **Description:** Full test pass after the Givebutter swap merges. Already documented end-to-end.
- **Next action:** Defer until A1 lands.

---

## Category E: QA & accessibility (CC + Er)

### E1. Lighthouse audit ≥95 across categories
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🟡
- **Source:** `DEPLOYMENT.md` post-deploy checklist line 7: "Run Lighthouse audit — target 95+ across all categories".
- **Description:** Run Lighthouse against the Vercel staging URL on key pages: `/`, `/donate`, `/programs/heads-up`, `/community/recipes`, `/get-involved/volunteer`, `/about/team`. Target ≥95 in Performance, Accessibility, Best Practices, SEO. Largest expected weak spot: Performance on `/` and `/donate` due to the synchronous Donorbox `widget.js` and synchronous Snipcart `snipcart.js` script tags blocking initial render.
- **Next action:** Run audit; if Performance <95, evaluate making third-party scripts `async` or `defer` (Donorbox already loads sync because that's their embed pattern; consider whether Snipcart's `async` flag is actually being respected).

### E2. Mobile responsive sweep at 375px
- **Status:** [ ]
- **Owner:** CC + Er
- **Blocker level:** 🟡
- **Source:** `DEPLOYMENT.md` post-deploy checklist line 8: "Verify all pages render correctly on mobile (375px)". `CLAUDE.md` Coding Conventions item 12: "Responsive — all layouts must work at 375px, 768px, and 1280px+".
- **Description:** Walk every page at iPhone-SE width (375px) and confirm no horizontal-scroll bugs, no text-truncation, no overlapping CTAs, no broken navigation.
- **Next action:** Manual sweep before DNS cutover. Priority pages: `/`, `/donate`, all four `/programs/heads-up-*` retreat slugs, `/get-involved/mitzvah-project`, `/community/recipes`, `/community/recipes/[slug]`, `/shop`, `/get-involved/volunteer`, `/get-involved/contact`.

### E3. Accessibility audit
- **Status:** [ ]
- **Owner:** CC
- **Blocker level:** 🟡
- **Source:** `CLAUDE.md` Coding Conventions item 7: "Accessibility — aria attributes, focus-visible styles, 4.5:1 contrast, sr-only labels where needed". No formal a11y audit logged.
- **Description:** Run axe-core or Lighthouse a11y mode against every page. Spot-check: keyboard navigation (Tab order on `/`, Skip-to-content link from `Layout.astro:97-99`), screen-reader landmark hierarchy, color contrast on light-on-cream copy in Mitzvah/CTA sections.
- **Next action:** Tooling-driven first pass; manual keyboard/screen-reader spot-check on top 5 pages.

### E4. Broken-link crawl
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🟡
- **Source:** No formal crawl run. `dist/sitemap-0.xml` lists 38 URLs.
- **Description:** Crawl all 38 sitemap URLs + every `<a href>` on each page. Report 4xx/5xx hits. Particular concern: external links to Belinda's Squarespace pages (if any), Donorbox campaign URL, Snipcart product pages, Sanity CDN image URLs (CMS-driven; check that all images resolve).
- **Next action:** Run a crawler (e.g., `lychee`, `linkchecker`, or `wget --spider`) against the Vercel staging URL. Fix any 4xx hits before cutover.

### E5. OG / social-share preview check
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🔵
- **Source:** `src/layouts/Layout.astro` has OG/Twitter meta tags wired (verified in served HTML). `og-default.png` referenced as the fallback image.
- **Description:** Paste the staging URL into Facebook's sharing debugger, Twitter's card validator, and LinkedIn's post inspector. Confirm: title, description, og-image render correctly with no missing-asset 404s. Specifically check `/donate` and `/programs/heads-up` — the high-share-intent pages.
- **Next action:** Quick 5-minute validator check before launch.

### E6. robots.txt + sitemap-index.xml verification
- **Status:** [x] (build outputs both — verified `dist/robots.txt` and `dist/sitemap-index.xml` exist)
- **Owner:** —
- **Blocker level:** —
- **Source:** Build artifacts at `dist/robots.txt` (89 bytes, points sitemap at `https://jewmanity.org/sitemap-index.xml`) and `dist/sitemap-index.xml` (184 bytes, references `sitemap-0.xml` with 38 URLs).
- **Description:** Both artifacts generated correctly. Sitemap correctly lists all 38 routes including dynamic recipe/retreat/community-story slugs.
- **Next action:** None pre-launch. Submit sitemap to Google Search Console post-DNS-cutover.

---

## Category F: Deployment & DNS (Er + Belinda for registrar)

### F1. Vercel production env vars
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🚫 BLOCKER
- **Source:** `DEPLOYMENT.md` "Environment Variables" section. `.env.example` lists `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`, `ANTHROPIC_API_KEY`.
- **Description:** Confirm Vercel project Environment Variables (Production scope) match the local `.env`:
  - `PUBLIC_SANITY_PROJECT_ID=9pc3wgri`
  - `PUBLIC_SANITY_DATASET=production`
  - `SANITY_API_TOKEN=` (write token — used at build time only, not exposed to client because no `PUBLIC_*` prefix)
  - `ANTHROPIC_API_KEY=` (only needed if `scripts/visual-qa.mjs` runs in CI; not required for site build)
  - When C1 lands: add `PUBLIC_SNIPCART_API_KEY` (live key)
- **Next action:** Spot-check Vercel dashboard. Add any missing.

### F2. DNS cutover — `jewmanity.com` → Vercel
- **Status:** [ ]
- **Owner:** Er + Belinda (registrar access)
- **Blocker level:** 🚫 BLOCKER (this *is* the launch)
- **Source:** `DEPLOYMENT.md` "Custom Domain Setup" mentions `jewmanity.org`, but this prompt's context says `jewmanity.com` is where real donors are. **Discrepancy flagged.** `astro.config.mjs:9` declares `site: 'https://jewmanity.org'`, sitemap and OG tags use `.org`.
- **Description:** **Open question:** is the launch domain `jewmanity.com` or `jewmanity.org`? Currently:
  - `jewmanity.com` — live Squarespace site (per this prompt's context)
  - `jewmanity.org` — parked GoDaddy lander (verified earlier this session via curl)
  - Astro config canonical → `jewmanity.org`
  - DEPLOYMENT.md → `jewmanity.org`
  - Phone-canonical and structured-data → `jewmanity.org`
  
  This needs a decision before DNS work. Options:
  1. Keep `.org` as canonical: point `.org` DNS at Vercel; `.com` keeps Squarespace OR redirects to `.org`.
  2. Switch canonical to `.com`: update `astro.config.mjs`, regenerate sitemap, update OG/structured-data, point `.com` at Vercel; `.org` redirects to `.com`.
- **Next action:** Confirm with Belinda which domain is the launch domain. Update Astro config + sitemap if option 2. Then point DNS per `DEPLOYMENT.md` "Custom Domain Setup".

### F3. Squarespace → Vercel URL redirects
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🟡
- **Source:** No redirect map exists. Old Squarespace URL structure unknown without inspecting the live site.
- **Description:** Some old Squarespace URLs may not have direct equivalents on the new site (or may have moved). Before DNS cutover, audit Squarespace URLs that are: (a) externally linked from social/email/PR, (b) ranked in Google. Build a redirect map (e.g., `/old-page` → `/new-page`) and configure as Vercel redirects in `vercel.json`.
- **Next action:** Pull a list of Squarespace URLs (sitemap or `site:jewmanity.com` Google query). Cross-check against new sitemap. Author redirect map.

### F4. SSL cert verification
- **Status:** [x] (Vercel auto-provisions on domain add)
- **Owner:** Er (post-DNS verification)
- **Blocker level:** —
- **Source:** `DEPLOYMENT.md` "Vercel auto-provisions an SSL certificate once DNS propagates."
- **Description:** Vercel handles automatically. Just verify cert resolves correctly post-cutover.
- **Next action:** Visual confirmation after DNS propagates.

### F5. Sanity → Vercel deploy webhook
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🟡
- **Source:** `DEPLOYMENT.md` "Sanity Webhook (Auto-Redeploy on CMS Publish)" section.
- **Description:** Wire Sanity content publishes to a Vercel deploy hook so Belinda's edits trigger rebuilds without Er needing to redeploy manually. `editor-guide.md` already promises Belinda's edits will appear "About 2–3 minutes after you click Publish" — that timing depends on this webhook being configured.
- **Next action:** Follow `DEPLOYMENT.md` steps 1-4 in the Sanity Webhook section. Verify with a test edit.

### F6. Sanity Studio hosted deployment
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🟡
- **Source:** `DEPLOYMENT.md` "Sanity Studio → Deploy hosted Studio" section. `editor-guide.md` references `https://jewmanity.sanity.studio` as Belinda's login URL.
- **Description:** Run `cd sanity && npx sanity deploy` and choose `jewmanity` as the Studio hostname so Belinda can log in at `jewmanity.sanity.studio` per the editor guide.
- **Next action:** Run the deploy. Test login as Belinda's user.

---

## Category G: Training & handoff (Er + Belinda)

### G1. `editor-guide.md` currency check
- **Status:** [ ]
- **Owner:** CC (audit) → Er (review with Belinda)
- **Blocker level:** 🟡
- **Source:** `docs/editor-guide.md` exists (verified). Last updated content references "Save ≠ Publish" and CMS structure that matches current schema.
- **Description:** Audit the editor guide for staleness against the current schema and recent content changes. Specifically: (a) does it mention the `recipe.gallery` field added recently?, (b) does it reflect the design-audit punch-list resolutions (Heads Up tile changes, Mitzvah copy), (c) any references to `Matamba Lassan` or other obsolete content?
- **Next action:** Diff `editor-guide.md` against current `sanity/schemas/` field set; flag drift.

### G2. CMS editor walkthrough with Belinda
- **Status:** [ ]
- **Owner:** Er + Belinda
- **Blocker level:** 🟡
- **Source:** `DEPLOYMENT.md` post-deploy checklist line 10: "Client walkthrough + CMS editor training".
- **Description:** Live walkthrough with Belinda covering: log in to Studio, edit a homepage hero string, save vs publish distinction, find a recipe and update an ingredient, add a new team member, troubleshoot if a published edit doesn't appear.
- **Next action:** Schedule once F6 (hosted Studio) is live.

### G3. Post-launch support process
- **Status:** [ ]
- **Owner:** Er
- **Blocker level:** 🔵
- **Source:** Not currently documented. Implied by editor-guide.md's "If you don't see the email, check spam. If it's still missing, contact Erik."
- **Description:** Document how Belinda contacts Er when something breaks (email? slack? text?), what level of urgency triggers what response time, and a fallback if Er is unavailable.
- **Next action:** One-page `docs/post-launch-support.md` after launch dust settles.

---

## Category H: Design QA (Harrison)

### H1. Mitzvah project Why-This-Matters image (paired with B4)
- **Status:** [ ]
- **Owner:** Harrison
- **Blocker level:** 🟡
- **Source:** `docs/mitzvah-fixes-verification-2026-04-26.md` punch-list item #6.
- **Description:** Same as B4. Harrison sources the design-spec photo (quiet two-men-on-couch conversation) or signs off on the current placeholder.
- **Next action:** Wait on Harrison.

### H2. Final visual review on staging URL
- **Status:** [ ]
- **Owner:** Harrison
- **Blocker level:** 🟡
- **Source:** `CLAUDE.md` Visual QA Workflow section: "Compare against the corresponding PNG in `design-reference/`". 62 design PNGs in `design-reference/`, post-Mitzvah-redesign mocks now in `design-refs/` (gitignored).
- **Description:** Harrison walks every page on `jewmanity.vercel.app` against the latest design references and signs off or files specific deltas. Especially: pages that haven't been recently audited (homepage, About, Programs, Resources, Shop, Contact, Volunteer pages — the 2026-04-26 audit cycle was Mitzvah-focused).
- **Next action:** Schedule with Harrison.

### H3. Hero photo art-direction sign-off
- **Status:** [ ]
- **Owner:** Harrison + Belinda
- **Blocker level:** 🟡
- **Source:** Multiple hero pages reference static images in `public/images/hero/` (donate.jpg, recipes.jpg, mitzvah-project.jpg, etc.); Sanity-driven heroes accept `heroImage` field.
- **Description:** Confirm every hero photo is final art direction, not a stand-in. Particular concern from the source-of-truth audit: B4/H1 above (Mitzvah whyImage), and recipes hero (`recipes.astro:27` TODO comment).
- **Next action:** Walk every hero with Harrison; collect approvals or replacements.

---

## Recently closed (2026-04-28 audit cycle wins)

These were on the list and have shipped. Pulling from recent commits to show momentum and prevent re-discovery.

- ✅ **Heads Up "Who We Support" tiles → 1 card** (Israeli Soldiers only) — production patched 2026-04-28 via `scripts/patch-designer-audit-2026-04-28.ts` (commit `f09618b`); component fallback was already trimmed in earlier work
- ✅ **Heads Up "Our Growing Impact" stats → 4 / 40+ / 100%** — production patched 2026-04-28 via patch script
- ✅ **Inner Healing icon overlap on Retreat Experience card** — verified non-issue (no double-icon in code or CMS data)
- ✅ **Matamba Lassan → Matan Balahsan rename + role change to "Heads Up Participant"** — testimonial doc patched + photo swap (commit `f09618b`); seed scripts aligned (commit `27e09c1`)
- ✅ **Volunteer "How You Can Help" → 3-card row, Transportation removed** — verified DONE-DEPLOYED in HEAD already
- ✅ **Mitzvah hero heading: white, no italic** (commit `70fdfb2`)
- ✅ **Mitzvah CTA cream background to match design intent** (commit `6c9b8b8`)
- ✅ **Mitzvah polish — step descriptions, FAQ cards variant, copy + icon refinements** (commit `71148cb`)
- ✅ **Mitzvah seed-script aligned with design-correct page state** (commit `05b2ced`)
- ✅ **Donorbox restoration to production after Givebutter WIP commit `76ca270` was found shipping placeholder IDs** (revert commit `e5f0462`)
- ✅ **Vendor-neutral legal copy — privacy + terms no longer name a specific donation processor** (commit `5ea08ea`)
- ✅ **Givebutter migration scaffold preserved on `feat/givebutter-migration` branch** (tip `76ca270`)
- ✅ **Givebutter swap runbook + campaign config + test plan** (commits `46bc4bc`, `47b223c`, `bb6ea01`)
- ✅ **`design-refs/` gitignored** (commit `3632d99`) — ~60 MB of Figma exports removed from version control
- ✅ **Stale Phase 2 line removed from CLAUDE.md** (commit `d857812`)
- ✅ **Mitzvah audit history committed for posterity** (commit `1f590df`)
- ✅ **`pending-content-tasks.md` log established and updated** (commits `1f32d18`, `ad7722b`)
- ✅ **Dead code removed** (earlier in cycle — commits `7f30d05` getXBySlug exports, `73e5f39` FORMSPREE_ID env var, `704883b` astro-portabletext dependency, `587a193` faqContext schema fields, `f5a5a89` communityStory.body orphan projection)
