# Mitzvah Project — Fixes Verification

**Date:** 2026-04-26
**Audit reference:** `docs/mitzvah-audit-2026-04-26.md`
**Live URL:** `/get-involved/mitzvah-project`
**Capture:** Playwright with `reducedMotion: 'reduce'`. Desktop 1440×900 viewport, mobile 375×812. Both `fullPage: true`.
**Live screenshots:** `screenshots/mitzvah-desktop-fixed.png`, `screenshots/mitzvah-mobile-fixed.png`
**FAQ regression checks:** `screenshots/donate-faq-regression.png`, `screenshots/volunteer-faq-regression.png`

Sanity reseed succeeded — `*[_id=="mitzvahProject"][0]` now returns the new heroSubtitle, whyParagraphs, pathsSubtitle, goalsHeading, and impactCards icon strings (`heart`, `user`, `network`, `star-of-david`).

---

## Per-item status

### BLOCKER

- **#1 — HowItWorks renders step descriptions.** **VERIFIED.** Each of the 7 numbered rows now shows title (Manrope medium) plus the description paragraph (Inter, body color) underneath. Visible in `screenshots/mitzvah-desktop-fixed.png` "How It Works" band. Rows are now `items-start` so number circle stays at the top while text wraps.

### MAJOR

- **#2 — Hero heading: drop italic + switch teal to white.** **VERIFIED.** `MitzvahHero.astro:28` no longer has `italic` and uses `text-white`. Heading on the live page renders white, upright.
- **#3 — Hero subtitle copy.** **VERIFIED.** Sanity returns *"Make a real impact by fighting antisemitism, supporting Jewish identity, and helping others."* and the live page renders that string.
- **#4 — Why para 1.** **VERIFIED.** Sanity returns *"At a time when antisemitism is rising and Jewish identity is under attack, your Bar or Bat Mitzvah can be more than a celebration—it can be a stand for what you believe in."* (em-dash, no spaces). Live page matches.
- **#5 — Why para 3.** **VERIFIED.** Sanity now stores *"This is your chance to not only mark your Jewish milestone, but to fight for your people, live your values, and make a difference that matters."* — the *"Jewmanity gives you real ways…"* lead-in is gone.
- **#6 — Why image swap.** **STILL DIFFERS.** Image source not found. `design-refs/` contains only the desktop and mobile mockup PNGs. `public/images/` has hundreds of SHA-named files in `figma-raw/` with no metadata, so visually scanning is intractable. I did not attempt a blind Squarespace scrape because the prompt forbids fabricating or substituting. Per the prompt's explicit fallback: image left in place, flagged here. **Needs Harrison.** The design photo is a quiet two-men-on-couch conversation in a modern living room (visible in `design-refs/mitzvah-desktop.png` rows 1500-3200 / `design-refs/mitzvah-mobile.png` rows 2200-4500); the live photo is a wider community-gathering shot of ~12 people in a living room (`public/images/sections/mitzvah-why-matters.jpg`).
- **#7 — Impact Card 1 title + description.** **VERIFIED.** Sanity now returns title *"Fight Antisemitism"* and description *"Stand up against hate by supporting programs that educate, defend, and build resilience in Jewish communities worldwide."* Live page matches.
- **#8 — Impact Card 1 icon: shield → heart.** **VERIFIED.** Sanity icon string is `heart`. `ImpactCards.astro` heart SVG renders. Visible in the Impact band.
- **#9 — Impact Card 2 description.** **VERIFIED.** *"Sponsor healing retreats for soldiers and survivors, providing rest, community, and a path forward after trauma."*
- **#10 — Impact Card 2 icon: mountain → user.** **VERIFIED.** Icon string is `user`; SVG is a simple person silhouette (head circle + shoulder curve).
- **#11 — Impact Card 3 description.** **VERIFIED.** *"Connect directly with Israeli soldiers through hands-on volunteering, building bridges and showing solidarity."*
- **#12 — Impact Card 3 icon: handshake → network.** **VERIFIED.** Icon string is `network`; SVG is a 4-node hub with center circle and four corner circles.
- **#13 — Impact Card 4 description.** **VERIFIED.** *"Embody the principles of tikkun olam, tzedakah, and gemilut chasadim through meaningful, lasting action."*
- **#14 — Impact Card 4 icon: heart → star-of-david.** **VERIFIED.** Icon string is `star-of-david`; SVG renders two overlapping triangles forming a hexagram. Reads small but clearly six-pointed at full resolution.
- **#15 — Choose Your Path Card 2 title.** **SKIPPED** per prompt exclusion (Belinda question, not a copy fix). Live still renders *"Volunteer with Soldiers in San Diego"* with the original San-Diego-framed description and bullets. No code or copy touched in this card.
- **#16 — Choose Your Path Card 1 description + bullets.** **VERIFIED.** Description: *"Raise funds to sponsor healing retreats for soldiers and survivors. Every dollar directly supports rest, recovery, and resilience."* Bullets: *Set a personal fundraising goal · Share your campaign with friends and family · Track your impact in real-time · See exactly where your funds go.*
- **#17 — Choose Your Path Card 2 description + bullets.** **NOT APPLIED — covered by #15 exclusion.** The audit listed two related items here: #15 (title) and #17 (description + bullets). The prompt's "EXCLUDED FROM THIS PROMPT" block says: "Do NOT touch Card 2's title, description, or bullets." So #17 is also out of scope. Marking SKIPPED. Live retains the existing San-Diego-framed copy.
- **#18 — Choose Your Path Card 3 description + bullets.** **VERIFIED.** Description: *"Use your voice to educate your community about antisemitism and the importance of supporting Jewish identity."* Bullets: *Create social media campaigns · Host educational events · Share stories from the field · Inspire others to take action.*
- **#19 — Choose Your Path icons.** **VERIFIED.** Card 1 = circle-with-dollar-sign (clean fundraising glyph); Card 2 = handshake (interlocking diagonals from the original ImpactCards Card 3 SVG); Card 3 = megaphone with two arc rings (audio-out cone). All three differ from the previous icons (`circle-dollar-arrow`, `star-burst`, `horn-only`) and read closer to the design.
- **#20 — Fundraising Goals heading.** **VERIFIED.** Sanity returns *"Set Your Fundraising Goal"*. Live page heading matches.
- **#21 — Fundraising Goals subtitle.** **VERIFIED.** *"Every amount makes a real difference. Choose a goal that's meaningful to you."*
- **#22 — FAQ row container styling: cards variant.** **VERIFIED.** `FAQAccordion` now accepts `variant: 'flat' | 'cards'` (default `'flat'`). `mitzvah-project.astro` passes `variant="cards"`. Each FAQ row is a standalone white card with `rounded-2xl`, soft shadow, `space-y-3` between cards, container `max-w-[1100px]`. Live page shows the new motif clearly. **Regression checks:** `/donate` and `/get-involved/volunteer` use the default flat variant — both still render the original `divide-y` flat-row style. Confirmed in `screenshots/donate-faq-regression.png` and `screenshots/volunteer-faq-regression.png`.
- **#23 — CTA section background.** **VERIFIED.** `MitzvahCTA.astro:23` is now `bg-bg-page`. Live page shows the CTA on cream, with the dark-teal site footer rendering as a separate band below it.
- **#24 — CTA heading + body to dark text on light bg.** **VERIFIED.** Heading is `text-text-heading`, no italic. Description is `text-text-body`. Both legible on the cream background.
- **#25 — Secondary button restyled for light background.** **VERIFIED.** Now `border-2 border-primary bg-white text-primary` with hover `bg-primary text-white`. Visible in the CTA band.

### MINOR

- **#26 — Hero subtitle contrast.** **VERIFIED.** `text-white/85` → `text-white`. Subtitle reads at full opacity over the dark photo overlay.
- **#27 — Why fallback paragraph 2.** **VERIFIED.** `WhyThisMatters.astro:12` now says *"soldiers and survivors in Israel"*, matching design + CMS. Defends against CMS-empty rendering.
- **#28 — Impact Card 2 title tightened.** **VERIFIED.** *"Fund Life-Changing Retreats"* → *"Fund Retreats"*.
- **#29 — Impact Card 3 title tightened.** **VERIFIED.** *"Volunteer with Jewish Soldiers"* → *"Volunteer with Soldiers"*.
- **#30 — How It Works number-circle softening.** **VERIFIED.** `bg-primary text-white` → `bg-primary-light text-primary`. Number circles now read as a soft tinted-teal pill.
- **#31 — Choose Your Path subtitle dash + period normalization.** **VERIFIED.** Now stored as *"Make an impact in the way that speaks to you—or combine all three"* (em-dash, no surrounding spaces, no trailing period).
- **#32 — Tier 3 description: restore "all of the".** **VERIFIED.** *"Covers all of the supplies and materials to provide for a Jewish youth retreat experience."*
- **#33 — FAQ row vertical padding bump.** **VERIFIED.** Cards-variant rows use `py-6 md:py-7`; flat-variant rows still use `py-5`.
- **#34 — FAQ container width.** **VERIFIED.** Cards-variant uses `max-w-[1100px]`; flat-variant retains `max-w-[800px] lg:max-w-[960px]`.
- **#35 — Screenshot tool fix.** **SKIPPED** per prompt exclusion. Inline workaround used instead: a temporary `.tmp-mitzvah-shot.mjs` (cleaned up after run) called Playwright with `reducedMotion: 'reduce'` to bypass the GSAP-empty-band issue.

---

## Notes / follow-ups (not blocking)

- **Schema icon-keyword help text is stale.** `sanity/schemas/singletons/mitzvahProject.ts:81` still says *"e.g., 'shield', 'mountain', 'handshake', 'heart'"* and line 190 still says *"e.g., 'fundraise', 'volunteer', 'awareness'"*. The first list no longer matches the codebase (now `heart`, `user`, `network`, `star-of-david`). Studio editors who consult the field description will be misled. Schema edit was out of scope for this prompt; flag for a follow-up touch-up.
- **Star of David SVG at 24×24 reads small.** It's recognizable as a hexagram at full resolution but reads more like a stylized asterisk at the 12×12 to 16×16 sizes the icon container collapses to on mobile. If Belinda flags this, the SVG can be made bolder by widening the triangles or switching to filled triangles with a hollow center.
- **CTA `data-animate="fade-up"` on a now-light-background section.** No functional issue — the safety net at `src/styles/global.css:92` keeps it visible under reduced motion, and the GSAP fade-up still works in production. Listing in case anyone wants to revisit hero/CTA animation choreography after the redesign.

---

## Final verdict

**1 STILL DIFFERS** — punch list item **#6** (Why This Matters image). All other items: 31 VERIFIED, 3 SKIPPED (#15, #17 per prompt exclusion of Card 2 program-scope question; #35 per prompt exclusion of screenshot tool fix). FAQ regression checks confirm `/donate` and `/get-involved/volunteer` are unchanged. Sanity reseed succeeded.

The single STILL DIFFERS item has a documented blocker (image source not available locally; prompt forbids fabricating); needs an asset hand-off from Harrison.
