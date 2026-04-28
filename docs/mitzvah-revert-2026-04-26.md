# Mitzvah Project — Revert Verification (PDF as authoritative source)

**Date:** 2026-04-26
**Authoritative source:** `public/jewmanity-bar-bat-mitzvah-project.pdf` (note: prompt referenced `docs/`, but actual location is `public/` — same file, ~243KB, 13 pages, extracted via pypdf)
**Live URL:** `/get-involved/mitzvah-project`
**Capture:** Playwright with `reducedMotion: 'reduce'`. Desktop 1440×900, mobile 375×812. Both `fullPage: true`.
**Live screenshots:** `screenshots/mitzvah-desktop-reverted.png`, `screenshots/mitzvah-mobile-reverted.png`

Reseed succeeded — GROQ confirms all reverted strings on `*[_id=="mitzvahProject"][0]`.

---

## Per-field verification (against PDF only — design PNGs no longer authoritative)

### Hero

- **heroSubtitle** → **VERIFIED.** Sanity returns *"Turn your biggest Jewish milestone into an act of tikkun olam — help fight antisemitism, fund life-changing retreats, and stand beside Jewish soldiers visiting San Diego."* Matches PDF p.1 verbatim. Live page shows this string.
- **heroHeading** → **N/A** (per prompt: do not touch in this run). Live page still shows *"A Mitzvah That Matters Right Now"*.

### Why This Matters (PDF p.1, "A Mitzvah That Matters Right Now")

The PDF combines the Antisemitism stats + the *"Jewmanity gives you real ways to make a real difference"* lead-in into a single paragraph. The seed retains the 3-paragraph structure that existed in HEAD (`scripts/seed-mitzvah-page.ts`@HEAD), which splits that PDF paragraph across `[0]` and `[2]` and keeps `[1]` as the bridge sentence about Jewmanity's program. This matches the prompt's "match HEAD~2 structure" guidance.

- **whyParagraphs[0]** → **VERIFIED.** *"Antisemitism in America is at its highest level in decades. More than half of Jewish Americans report experiencing antisemitism in the past year. As a young Jewish adult, your bar or bat mitzvah project is an opportunity to take a stand — not just celebrate."* Matches PDF p.1 sentences 1-3 verbatim.
- **whyParagraphs[1]** → **VERIFIED.** *"Through Jewmanity's Mitzvah Project, you'll learn about the challenges facing Jewish communities, connect with soldiers and survivors in Israel, and take meaningful action that creates lasting impact."* This is the bridge sentence that was already correct from HEAD; not a literal PDF quote but matches the project's pre-existing structure and is consistent with the PDF's voice. No revert needed.
- **whyParagraphs[2]** → **VERIFIED.** *"Jewmanity gives you real ways to make a real difference. This is your chance to not only mark your Jewish milestone, but to fight for your people, live your values, and make a difference that matters."* The lead-in *"Jewmanity gives you real ways…"* is restored as the first sentence of this paragraph (matches PDF p.1 final sentence). Closing sentence is the project's pre-existing copy that was in HEAD.

### Impact Cards (PDF p.2 — all 4 cards)

- **Card 1 title** → **VERIFIED.** *"Fight the World's Oldest Hatred"* (PDF p.2). Curly apostrophe (U+2019) matches.
- **Card 1 description** → **VERIFIED.** *"Your project directly supports Jewmanity's mission to educate communities, publish resources, and combat antisemitism at every level."* (PDF p.2)
- **Card 1 icon** → **VERIFIED.** Sanity returns `shield`. SVG renders shield-with-checkmark — restored from HEAD via direct paste. Visible in `mitzvah-desktop-reverted.png` Impact band.
- **Card 2 title** → **VERIFIED.** *"Fund Life-Changing Retreats"* (PDF p.2).
- **Card 2 description** → **VERIFIED.** *"Money you raise helps send Jewish young people to retreats that build identity, resilience, and pride during a time when those things are under attack."* (PDF p.2)
- **Card 2 icon** → **VERIFIED.** Sanity returns `mountain`. SVG renders mountain-with-sun — restored from HEAD.
- **Card 3 title** → **VERIFIED.** *"Volunteer with Jewish Soldiers"* (PDF p.2).
- **Card 3 description** → **VERIFIED.** *"When Israeli soldiers visit San Diego, you can be there to welcome, serve, and honor them — a once-in-a-lifetime volunteer experience you'll never forget."* (PDF p.2)
- **Card 3 icon** → **VERIFIED.** Sanity returns `handshake`. SVG renders interlocking-diagonals handshake — restored from HEAD.
- **Card 4 title** → **VERIFIED (no change).** *"Live Jewish Values"* (PDF p.2).
- **Card 4 description** → **VERIFIED.** *"Tikkun olam. Tzedakah. Ahavat Yisrael. This project isn't just a requirement — it's a living expression of everything your bar or bat mitzvah stands for."* (PDF p.2)
- **Card 4 icon** → **VERIFIED (intentionally retained from prior fix).** Sanity returns `star-of-david`. The PDF's Card 4 graphic at p.2 shows a purple Star of David, which is the design intent. SVG (two overlapping triangles forming a hexagram) is unchanged from this morning's fix run.

### Choose Your Path (PDF p.4–6)

- **pathsSubtitle** → **VERIFIED.** *"Make an impact in the way that speaks to you — or combine all three."* Restored from HEAD with em-dash + surrounding spaces + trailing period (the design-style normalization from punch list #31 has been undone).
- **Card 1 (Fundraise for Retreats) description** → **VERIFIED.** *"Raise money to fund retreats for Jewish young people — experiences that build Jewish identity, resilience, and community during a time of rising antisemitism."* (PDF p.5)
- **Card 1 bullets** → **VERIFIED.** Order matches PDF p.5: (1) *Set a fundraising goal (see suggested goals below)*, (2) *Create an online fundraising page*, (3) *Host a fundraising event*, (4) *Share your story with guests at your celebration*.
- **Card 2 (Volunteer with Soldiers in San Diego)** → **NO CHANGE.** Title/description/bullets untouched per the previous prompt's #15 exclusion (Belinda program-scope question). Matches PDF p.5 already.
- **Card 3 (Raise Awareness) description** → **VERIFIED.** *"Use your voice — in your school, synagogue, and online — to educate others about antisemitism and what they can do about it."* (PDF p.5–6)
- **Card 3 bullets** → **VERIFIED.** Order matches PDF p.6: (1) *Give a presentation at your school or synagogue*, (2) *Create an informational display or poster series*, (3) *Write and share your personal story on social media*, (4) *Collect pledges from friends and family in exchange for awareness actions*.

### Choose Your Path icons (component SVGs)

`src/components/mitzvah/ChooseYourPath.astro` SVGs restored from `git show HEAD:src/components/mitzvah/ChooseYourPath.astro`. Diff vs HEAD is zero — file is back to its committed state. The three glyphs that render: circle-with-dollar-sign (fundraise), star/asterisk-burst (volunteer), horn-with-sound-arcs (awareness).

- **#19 — VERIFIED (reverted).** Today's design-style icons (clean dollar coin / handshake / megaphone) are gone. The earlier-committed glyphs are back. The PDF doesn't lock in specific shapes for these path cards — that's a design decision Belinda + Harrison can iterate on separately.

### Fundraising Goals (PDF p.10)

- **goalsHeading** → **VERIFIED.** *"How Much Should I Raise?"* Matches PDF p.10 verbatim.
- **goalsSubtitle** → **VERIFIED.** *"Every dollar you raise makes a direct impact. Here are suggested fundraising tiers — choose what feels right for you, and remember: it's not about the amount, it's about the effort and the heart behind it."* Matches PDF p.10 verbatim.
- **Tier 3 description** → **VERIFIED.** *"Covers supplies and materials for a Jewish youth retreat experience."* (PDF p.10) The design's *"Covers all of the supplies and materials to provide for…"* phrasing is gone.
- **Tiers 1, 2, 4, 5, 6** → unchanged (already matched PDF before today's fix run; not touched in either pass).

---

## DO NOT REVERT — confirmed still in place

- **HowItWorks renders `step.description`.** `src/components/mitzvah/HowItWorks.astro:119-134` still emits the description paragraph under each title. Visible in the live page's "How It Works" band.
- **HowItWorks number-circle softer style.** `bg-primary-light text-primary` retained at line 121.
- **Hero heading: white, no italic.** `MitzvahHero.astro:28` still has `text-white` and no `italic`.
- **Hero subtitle contrast.** `MitzvahHero.astro:31` still uses `text-white` (not `text-white/85`).
- **WhyThisMatters fallback paragraph 2 wording.** `src/components/mitzvah/WhyThisMatters.astro:12` still says "soldiers and survivors in Israel".
- **ImpactCards Card 4 icon = star-of-david.** Sanity confirms; SVG unchanged.
- **FAQAccordion `cards` variant.** `src/components/shared/FAQAccordion.astro` `variant: 'flat' | 'cards'` prop intact; padding and `max-w-[1100px]` retained.
- **`mitzvah-project.astro` passes `variant="cards"`.** Confirmed in the consumer call.
- **MitzvahCTA cream background + dark text + light-mode secondary button.** Lines 23, 25, 28, 41 unchanged from this morning's fix.

`git diff` confirms `ChooseYourPath.astro` is clean (matches HEAD). The other 6 components plus the page consumer remain modified vs HEAD — all intentional retentions from the prior fix run.

---

## Files changed in this revert pass

```
scripts/seed-mitzvah-page.ts                # copy + icon strings
src/components/mitzvah/ImpactCards.astro    # 3 SVGs (Card 4 untouched)
```

Plus the new doc: `docs/mitzvah-revert-2026-04-26.md`. New screenshots: `screenshots/mitzvah-desktop-reverted.png`, `screenshots/mitzvah-mobile-reverted.png` (both gitignored under `screenshots/`).

`src/components/mitzvah/ChooseYourPath.astro` was edited (SVGs reverted) but the result matches `git show HEAD:` byte-for-byte, so it disappears from `git status` — the revert is correct, not missing.

---

## Final verdict

**ALL VERIFIED.** Every quoted string in the prompt matches the PDF verbatim. Sanity reseed succeeded; GROQ confirms reverted values on every reverted field. Component SVGs restored to their HEAD-committed shield/mountain/handshake glyphs (Card 4 deliberately retains the new star-of-david). All "DO NOT REVERT" items confirmed still in place. No regression to FAQ on `/donate` or `/get-involved/volunteer` (those continue to use the default `flat` variant, untouched by either pass).

The remaining open question — whether to swap the hero heading to the PDF's *"Support Jewmanity for Your Bar or Bat Mitzvah Project"*, restore the two pull-quotes (PDF p.1 and p.10) that were removed in `b6cd20f`, or enrich `HowItWorks` with sub-bullets and the *"Tip"* / *"Did you know?"* callouts from PDF p.3-9 — remains for a separate decision per the prompt's exclusions.
