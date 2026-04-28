# Pending content tasks (waiting on client)

Last updated: 2026-04-28

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
