# Phase 8: Handoff blockers

Prioritized list of everything that must happen before Belinda receives a "site is live" email. Synthesized from Phases 0-7.

Severity scale:
- **blocker** — site will be visibly broken or non-functional for a key user flow if launched today.
- **important** — launch-worthy only if owner accepts the known gap (legal/compliance, analytics, etc.).
- **nice-to-have** — can ship without, can also be fixed post-launch.

Owner abbreviations: **Er** = Hekleiman (primary dev); **Belinda** = client; **Harrison** = co-collaborator; **external** = paid service account action.

---

## Blockers

| # | Item | Category | Owner | Done when |
|---|---|---|---|---|
| 1 | Replace `YOUR_ACCOUNT_ID` and `WIDGET_ID` placeholders in `src/components/donate/DonateHero.astro:40,42` with real Givebutter account + form widget IDs | code fix + external account setup | Belinda (create account) + Er (swap values) | donate page renders a working Givebutter donation form that processes a $1 test transaction |
| 2 | Create Givebutter campaign, choose fee mode (0% + donor tips vs 3% + Stripe), set branding, define preset amounts that match the homepage donation-card `?amount=` params | external account setup | Belinda | Campaign is live in Givebutter dashboard and preset amounts are documented |
| 3 | Swap Snipcart TEST key (`YzI4MTdlM2Yt…`) at `src/layouts/Layout.astro:94` for a LIVE public key, and remove the "TEST API key" comment on line 95 | code fix + external account setup | Belinda (subscribe + create live store) + Er (swap key) | a test checkout on `/shop/<slug>` processes a real $1 order end-to-end |
| 4 | Fix the hotspot bug in `urlForCropped` (`src/lib/sanity.ts:29-31`) so URLs include `fp-x`/`fp-y` (or use the library auto-rect path) | code fix | Er | a team photo at `/about/team` with an off-center hotspot renders with the focal point correctly cropped; verify via byte-level CDN diff on three team photos |
| 5 | Decide and implement: keep `crop=focalpoint` + add `.focalPoint(x,y)`, OR drop `.crop('focalpoint')` and rely on library auto-rect. Update the `urlForCropped` docstring (lines 20-28 of `src/lib/sanity.ts`) to reflect chosen approach | code fix + decision | Er | docstring matches behavior; behavior verified against Sanity docs |
| 6 | Point `jewmanity.org` DNS at the Vercel project and set up TLS | external account setup | Belinda + Er (coordinate) | `https://jewmanity.org` returns the Vercel-built site with a valid cert |

## Important

| # | Item | Category | Owner | Done when |
|---|---|---|---|---|
| 7 | Rotate `SANITY_API_TOKEN` (per persistent memory: the token was shared across dev sessions and may be cached in terminal history or other scripts) | external account setup | Er | old token revoked in Sanity management; new token in Er's `.env` only; no seed scripts fail |
| 8 | Configure Sanity → Vercel deploy hook so that publishing content in Studio triggers a Vercel rebuild | external account setup | Er | publishing a testimonial in Studio causes a Vercel deploy within 60 seconds and the new content appears on the live site |
| 9 | Verify Formspree form ID `xlgpvpja` at `src/components/contact/ContactForm.astro:20` and `src/components/volunteer/VolunteerForm.astro:25` is on the right account and has an appropriate plan for expected volume | external account setup | Belinda + Er | test submission arrives in the correct inbox; rate-limit strategy confirmed |
| 10 | Decide whether Contact and Volunteer forms should keep the same Formspree ID (current) or split into two | decision | Belinda + Er | choice is documented; if splitting, new IDs replace the single one and `.env.example` `FORMSPREE_ID` is either actually wired or removed |
| 11 | Verify Mailchimp list ownership (Newsletter.astro action URL embeds `u=63c97041047a0d6a6e1c61091`) — confirm this is the org-owned account, not a personal Gmail-linked account | external account setup | Belinda | account ownership confirmed; list audience confirmed as opt-in compliant |
| 12 | Add Mailchimp to privacy-policy third-party list (currently `privacy.astro:41-45` lists Givebutter, Snipcart, Formspree, Vercel — Mailchimp is absent despite being embedded in the newsletter form) | code fix + legal | Er (edit copy) + Belinda (approve) | privacy policy mentions Mailchimp in the third-party data processors list |
| 13 | Verify Givebutter `?amount=<int>` URL-param pre-select behavior (`src/components/donate/DonateHero.astro:43-55` has a TODO flagging that the param name / behavior hasn't been end-to-end verified against Givebutter's actual widget) | code fix | Er | a homepage donation card click lands on `/donate?amount=180` and the widget pre-selects $180 |

## Nice-to-have

| # | Item | Category | Owner | Done when |
|---|---|---|---|---|
| 14 | Delete unused dep `astro-portabletext` from `package.json` (zero imports across src/ and scripts/) | code fix | Er | `npm install` still succeeds; all pages still build |
| 15 | Delete or wire `FORMSPREE_ID` in `.env.example` (currently documented but never read) | code fix | Er | env-example only lists vars that are actually read |
| 16 | Delete dead `getRecipeBySlug`, `getRetreatBySlug`, `getProductBySlug`, `getCommunityStoryBySlug` exports in `src/lib/sanity.ts` (0 consumers each) — or keep and document intent | code fix | Er | chosen direction documented |
| 17 | Resolve `communityStory.body` (GROQ projects, schema doesn't declare). Either add `body` portableText field to schema or remove from projection | code fix / data fix | Er | schema and GROQ are in sync; no dead projection fields |
| 18 | Resolve `donatePage.faqContext` and `volunteerPage.faqContext` dead schema fields — delete from schemas, or read them in the GROQ projection and pass to `getFaqItems` | code fix | Er | same rule — every schema field is either read or removed |
| 19 | Delete or restore orphan component `src/components/about/StoriesGrid.astro` (0 importers) | code fix | Er | file is gone or has at least one consumer |
| 20 | Migrate the 5 testimonial-image + community-story-image consumers currently using `urlFor(...).width(W).height(H).url()` to `urlForCropped(...)` once the hotspot bug is fixed (see Phase 3 Open questions for specific file/line list) | code fix | Er | consistent hotspot handling across the site |
| 21 | Consider adding security headers (CSP, HSTS) to `vercel.json` — CSP must allow `widgets.givebutter.com`, `cdn.snipcart.com`, `app.snipcart.com`, `gmail.us13.list-manage.com`, `formspree.io`, `cdn.sanity.io` | code fix | Er | CSP header present without breaking any integration |
| 22 | Render the recipe `gallery` field on the recipe detail page (`src/pages/community/recipes/[slug].astro:340` has TODO; data is seeded into Sanity already) | code fix | Er + UX decision | recipe detail page shows a gallery carousel below the main image |
| 23 | Remove the "Replace with real photo from client" placeholder TODO in `src/pages/community/recipes.astro:27` since CMS images exist for every recipe now | code fix | Er | TODO removed or replaced with a permanent caption |
| 24 | Collapse the three token names (`SANITY_API_TOKEN` / `SANITY_WRITE_TOKEN` / `SANITY_TOKEN`) to a single canonical name across all 20+ scripts and `.env.example` | code fix | Er | every seed script reads one env-var name; `.env.example` documents only that name |
| 25 | Pin `playwright` (not just `@playwright/test`) in `package.json` — `scripts/screenshot.mjs` and `scripts/visual-qa.mjs` import from `playwright` directly but it's only a transitive dep | code fix | Er | `npm ci` from a clean clone lets `npm run screenshot` succeed |

## Working-tree state (from Phase 0)

- **Working tree is clean.** Zero dirty files, zero staged, zero untracked, zero stashes.
- 0 commits ahead or behind `origin/main`. No in-flight work that needs committing or reverting.
- The one WIP-tagged commit on `main` is `76ca270 wip: Givebutter platform migration (placeholder IDs pending Belinda)`. The WIP state is fully reflected in the remaining placeholders in `DonateHero.astro` (blockers 1 + 2).

## Not handled by this audit (scope-limited, explicit)

- Fixing the hotspot bug itself. Audit documents scope only.
- Running any seed / patch / cleanup / replace script. All such scripts are read-only-inspected.
- Any Vercel dashboard-side config (deploy hooks, env vars). Only repo-visible state was audited.
- Sanity Studio UI state (hotspots editors have or haven't set on specific images).
