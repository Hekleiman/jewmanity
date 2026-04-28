# Pending content tasks (waiting on client)

Last updated: 2026-04-28

## Donate page — Givebutter migration
- **Status:** Pre-staged, waiting on Belinda
- **Blocker:** Givebutter `ACCOUNT_ID` and `WIDGET_ID` not yet provided
- **Current state:** Production reverted to Donorbox on 2026-04-28 after `76ca270` was found shipping placeholder IDs to `jewmanity.vercel.app`. Real donors are still on the old Squarespace site at `jewmanity.com` (DNS not yet cut over to Vercel), so no live donations were affected by the WIP commit. Givebutter scaffold preserved on branch `feat/givebutter-migration` (tip `76ca270`). Privacy/terms now vendor-neutral (commit `5ea08ea`). Runbook at `docs/givebutter-swap-runbook.md`. Campaign config (with ASK BELINDA items) at `docs/givebutter-campaign-config.md`. Test plan at `docs/givebutter-test-plan.md`.
- **Lessons learned:** Future processor migrations stage on a feature branch from day one. WIP commits with placeholder IDs never land on `main`, even when the canonical domain isn't pointing at Vercel.
- **Next action:** Belinda delivers IDs → checkout branch, rebase on main, replace 2 placeholders, run test plan in dev, merge.


## A5 — Fighting Antisemitism metric cards
- **Status:** Waiting on Belinda
- **Blocker:** 2025/2026 ADL/AJC data not yet sourced
- **Current state:** Three metrics in Sanity (`fightingAntisemitism.understandingStats`) cite 2024 figures: 9,354 incidents (ADL Audit, 2024), 344% five-year increase (ADL Audit, 2024), 67% online-content exposure (AJC State of Antisemitism in America, 2024)
- **Next action:** Belinda to provide updated figures + citations, then edit directly in Sanity Studio

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
