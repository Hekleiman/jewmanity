# Pending content tasks (waiting on client)

Last updated: 2026-04-28

## Donate page — Givebutter migration
- **Status:** Pre-staged, waiting on Belinda
- **Blocker:** Givebutter `ACCOUNT_ID` and `WIDGET_ID` not yet provided
- **Current state:** Production reverted to Donorbox on 2026-04-28 after `76ca270` was found shipping placeholder IDs to `jewmanity.vercel.app`. Real donors are still on the old Squarespace site at `jewmanity.com` (DNS not yet cut over to Vercel), so no live donations were affected by the WIP commit. Givebutter scaffold preserved on branch `feat/givebutter-migration` (tip `76ca270`). Privacy/terms now vendor-neutral (commit `5ea08ea`). Runbook at `docs/givebutter-swap-runbook.md`. Campaign config (with ASK BELINDA items) at `docs/givebutter-campaign-config.md`. Test plan at `docs/givebutter-test-plan.md`.
- **Lessons learned:** Future processor migrations stage on a feature branch from day one. WIP commits with placeholder IDs never land on `main`, even when the canonical domain isn't pointing at Vercel.
- **Next action:** Belinda delivers IDs → checkout branch, rebase on main, replace 2 placeholders, run test plan in dev, merge.


## A5 — Fighting Antisemitism metric cards
- **Status:** Card 3 patched 2026-04-28; Cards 1 + 2 pending ADL 2025 audit release
- **Blocker:** ADL has not yet released its 2025 calendar-year Audit of Antisemitic Incidents (typically published around April 22 each year — the 2024 audit dropped 2025-04-22). Cards 1 + 2 are bound to that report.
- **Current state:** Sanity `fightingAntisemitism.understandingStats` now reads:
  - [0] 9,354 incidents — ADL Audit of Antisemitic Incidents, 2024 *(latest available)*
  - [1] 344% five-year increase — ADL Audit of Antisemitic Incidents, 2024 *(latest available)*
  - [2] 73% online — AJC State of Antisemitism in America, 2025 ✅ *(updated from 67% / 2024 via `scripts/patch-fighting-antisemitism-2026-04-28.ts` on 2026-04-28; seed file aligned)*
- **Next action:** Once ADL publishes the 2025 audit (expected late April / May 2026), patch Cards 1 + 2 with the new total + multi-year increase. Reuse the same script pattern. Belinda can also override directly in Sanity Studio if she prefers different figures (e.g., the 893% ten-year increase already in the same ADL report).

## A6 — Recipe author bylines
- **Status:** Waiting on Belinda
- **Blocker:** Real recipe authors not yet identified
- **Current state:** All 7 recipes show "Recipe by Belinda Donner" placeholder
- **Next action:** Belinda to update each recipe doc's `author` field in Sanity Studio

## A6 — Recipe second-image gallery
- **Status:** Schema + UI ready; content not authored
- **Blocker:** Need second photo for each of 7 recipes (dish + family/context image)
- **Current state:** `recipe.gallery` field exists in schema; `RecipePage.astro` renders carousel when `galleryImages.length > 1`; all 7 recipes currently have `gallery: []` or unset
- **Next action:** Source family/context photos (client photos preferred; can fall back to Squarespace CDN per project pattern), upload to Sanity, populate `gallery` for each recipe

## ~~Sanity content — `.org` references to patch~~ — RESOLVED 2026-05-07
- **Status:** Resolved 2026-05-07. Superseded by the broader "no public mailto anywhere" decision: all `@jewmanity` email references were removed from the codebase and Sanity, and inquiries now route through the contact form at `/get-involved/contact`.
- **What landed:** `scripts/patch-donate-page-contact-link-2026-05-07.ts` set `donatePage.ctaContactLink` to `{ text: 'Get in touch', href: '/get-involved/contact' }` (rev `kSV5HTTyFsb2BqzijahIKB`). Same commit also stripped mailto links from `terms.astro`, `privacy.astro`, `nonprofit-disclosures.astro`, the donate-page CMS fallback, mitzvah-project copy, and the donatePage schema help-text; added a "Mitzvah Project" subject option to the contact form dropdown.
