# Mitzvah Project Page — Design vs. Live Audit

**Date:** 2026-04-26
**Live URL:** `/get-involved/mitzvah-project`
**Live page file:** `src/pages/get-involved/mitzvah-project.astro`
**Design references:**
- `design-refs/mitzvah-desktop.png` (2880×13114)
- `design-refs/mitzvah-mobile.png` (788×18160)
**Live screenshots:**
- `screenshots/mitzvah-desktop.png` (1440px viewport, full page, reducedMotion=reduce)
- `screenshots/mitzvah-mobile.png` (375px viewport, full page, reducedMotion=reduce)

> **Methodology note.** A first capture at 1280px without reducedMotion produced empty bands for ImpactCards / HowItWorks / ChooseYourPath / FundraisingGoals. Cause: those components use `data-animate="fade-up"`/`"stagger"` and `gsap.from(...)` (`src/scripts/animations.ts:34,65`) which sets `opacity: 0` until a ScrollTrigger fires. Playwright's `fullPage: true` does not scroll the viewport, so triggers below ~765px never fire. The CSS safety net at `src/styles/global.css:92` only kicks in under `prefers-reduced-motion: reduce`, which is what the re-capture used. **This is a real screenshot artifact, not a production-broken page** — production users with normal motion settings will see content reveal as they scroll. Logged as a separate MINOR item below so the screenshot tooling isn't lying again.

> **CMS note.** The live page reads from the Sanity `mitzvahProject` singleton via `getMitzvahProject()` (`src/lib/sanity.ts`). The seed script at `scripts/seed-mitzvah-page.ts` is the current source of truth for live copy — that's the file most copy-gap punch list items should patch (or, equivalently, the Sanity Studio document). Component fallback strings exist but are shadowed by CMS data when present.

> **Stale-prompt note.** The brief states the page imports `MitzvahQuote (×2)`. As of HEAD (`ac1f743`), `MitzvahQuote` is no longer imported, no instance renders, and `src/components/mitzvah/` contains no `MitzvahQuote.astro` file (`grep -rn "MitzvahQuote" src/` returns zero matches). The component was removed in `b6cd20f feat(mitzvah): redesign page per Harrison mocks`. The design has no quote blocks, so this is the correct end state — see the Punch List for the explicit confirmation item.

---

## 1. Hero — "A Mitzvah That Matters Right Now"

**Match**
- Heading text "A Mitzvah That Matters Right Now" matches design (`scripts/seed-mitzvah-page.ts:30`, rendered at `src/components/mitzvah/MitzvahHero.astro:29`).
- Section structure (full-width photo background with dark overlay + centered headline + subtitle) matches.
- Photo subject (group of Jewish people at a mitzvah-style celebration) matches design intent.

**Gap**
- **Heading style — color.** Design renders the heading in white/cream (regular weight, no italics) over the dark photo overlay. Live renders it teal (`text-primary` = `#3783A3`) and italic. Citation: `src/components/mitzvah/MitzvahHero.astro:28` (`italic ... text-primary`). Severity: **MAJOR**.
- **Heading style — italic.** Design heading is upright; live heading is italic (same line as above). Severity: **MAJOR**.
- **Subtitle copy.** Design: *"Make a real impact by fighting antisemitism, supporting Jewish identity, and helping others."* Live: *"Turn your biggest Jewish milestone into an act of tikkun olam — help fight antisemitism, fund life-changing retreats, and stand beside Jewish soldiers visiting San Diego."* Citations: design-refs/mitzvah-desktop.png hero band; live source `scripts/seed-mitzvah-page.ts:31-32` (heroSubtitle), fallback at `src/components/mitzvah/MitzvahHero.astro:10`. Severity: **MAJOR**.
- **Subtitle color.** Design subtitle reads cream/off-white at higher contrast; live uses `text-white/85`. Visually similar but design contrast is closer to `text-white/100` or `text-primary-light/100`. Citation: `src/components/mitzvah/MitzvahHero.astro:31`. Severity: **MINOR**.

---

## 2. Why This Matters — text + image side-by-side

**Match**
- Heading "Why This Matters" matches (`scripts/seed-mitzvah-page.ts:35`, rendered at `src/components/mitzvah/WhyThisMatters.astro:25`).
- Three-paragraph text block on the left, image on the right, on desktop; stacks on mobile. Layout matches.
- Image aspect / rounded corners (`rounded-2xl`) match (`src/components/mitzvah/WhyThisMatters.astro:38`).

**Gap**
- **Paragraph 1 copy.** Design: *"At a time when antisemitism is rising and Jewish identity is under attack, your Bar or Bat Mitzvah can be more than a celebration—it can be a stand for what you believe in."* Live: *"Antisemitism in America is at its highest level in decades. More than half of Jewish Americans report experiencing antisemitism in the past year. As a young Jewish adult, your bar or bat mitzvah project is an opportunity to take a stand — not just celebrate."* Citation: `scripts/seed-mitzvah-page.ts:37`. Severity: **MAJOR**.
- **Paragraph 2 copy.** Design: *"…connect with soldiers and survivors in Israel, and take meaningful action that creates lasting impact."* Live matches this in seed (`scripts/seed-mitzvah-page.ts:38`). Component fallback drifts (`src/components/mitzvah/WhyThisMatters.astro:12` says "soldiers and individuals in need"); when CMS is empty the fallback would diverge. Severity: **MINOR** (fallback only; live uses the matching CMS string).
- **Paragraph 3 copy.** Design: *"This is your chance to not only mark your Jewish milestone, but to fight for your people, live your values, and make a difference that matters."* Live prepends *"Jewmanity gives you real ways to make a real difference. "* in the seed (`scripts/seed-mitzvah-page.ts:39`). Severity: **MAJOR**.
- **Image subject.** Design shows two men sitting on a couch in a quiet living-room conversation. Live shows a wider community-gathering photo. Citation: image is loaded from Sanity `whyImage` if set (`src/pages/get-involved/mitzvah-project.astro:37`) or static fallback `/images/sections/mitzvah-why-matters.jpg` (`src/components/mitzvah/WhyThisMatters.astro:38`). Severity: **MAJOR**.

---

## 3. The Impact You'll Make — 4 cards

**Match**
- Section heading "The Impact You'll Make" matches (`scripts/seed-mitzvah-page.ts:43`).
- Section subtitle "Your mitzvah project creates real change in four powerful ways" matches (`scripts/seed-mitzvah-page.ts:44`).
- Section background is the alt-cream tone matching design (`src/components/mitzvah/ImpactCards.astro:44` `bg-bg-section-alt`).
- 4-card layout (4 across desktop, 2×2 tablet, stacked mobile) matches (`src/components/mitzvah/ImpactCards.astro:55`).
- Card 4 title "Live Jewish Values" matches design exactly.

**Gap**
- **Card 1 title.** Design: *"Fight Antisemitism"*. Live: *"Fight the World's Oldest Hatred"*. Citation: `scripts/seed-mitzvah-page.ts:49`. Severity: **MAJOR**.
- **Card 1 description.** Design: *"Stand up against hate by supporting programs that educate, defend, and build resilience in Jewish communities worldwide."* Live: *"Your project directly supports Jewmanity's mission to educate communities, publish resources, and combat antisemitism at every level."* Citation: `scripts/seed-mitzvah-page.ts:50-51`. Severity: **MAJOR**.
- **Card 1 icon.** Design: heart outline. Live: shield-with-checkmark (`shield`). Citation: icon string at `scripts/seed-mitzvah-page.ts:48`; SVG at `src/components/mitzvah/ImpactCards.astro:60-63`. Severity: **MAJOR**.
- **Card 2 title.** Design: *"Fund Retreats"*. Live: *"Fund Life-Changing Retreats"*. Citation: `scripts/seed-mitzvah-page.ts:56`. Severity: **MINOR** (small wording add).
- **Card 2 description.** Design: *"Sponsor healing retreats for soldiers and survivors, providing rest, community, and a path forward after trauma."* Live: *"Money you raise helps send Jewish young people to retreats that build identity, resilience, and pride during a time when those things are under attack."* Two different audience framings (soldiers/survivors vs. young people). Citation: `scripts/seed-mitzvah-page.ts:57-58`. Severity: **MAJOR**.
- **Card 2 icon.** Design: a person/profile glyph (looks like a stylized Star-of-David figure or person with hair). Live: mountain-with-sun (`mountain`). Citation: `scripts/seed-mitzvah-page.ts:55`; SVG at `src/components/mitzvah/ImpactCards.astro:65-69`. Severity: **MAJOR**.
- **Card 3 title.** Design: *"Volunteer with Soldiers"*. Live: *"Volunteer with Jewish Soldiers"*. Citation: `scripts/seed-mitzvah-page.ts:63`. Severity: **MINOR**.
- **Card 3 description.** Design: *"Connect directly with Israeli soldiers through hands-on volunteering, building bridges and showing solidarity."* Live: *"When Israeli soldiers visit San Diego, you can be there to welcome, serve, and honor them — a once-in-a-lifetime volunteer experience you'll never forget."* Citation: `scripts/seed-mitzvah-page.ts:64-65`. Severity: **MAJOR**.
- **Card 3 icon.** Design: 4-node hub/network icon. Live: handshake glyph (`handshake`). Citation: `scripts/seed-mitzvah-page.ts:62`; SVG at `src/components/mitzvah/ImpactCards.astro:71-77`. Severity: **MAJOR**.
- **Card 4 description.** Design: *"Embody the principles of tikkun olam, tzedakah, and gemilut chasadim through meaningful, lasting action."* Live: *"Tikkun olam. Tzedakah. Ahavat Yisrael. This project isn't just a requirement — it's a living expression of everything your bar or bat mitzvah stands for."* Citation: `scripts/seed-mitzvah-page.ts:71-72`. Severity: **MAJOR**.
- **Card 4 icon.** Design: Star of David. Live: heart (`heart`). Citation: `scripts/seed-mitzvah-page.ts:69`; SVG at `src/components/mitzvah/ImpactCards.astro:79-82`. Severity: **MAJOR**.

---

## 4. How It Works — 7 numbered steps

**Match**
- Section heading "How It Works" matches.
- Subtitle "A clear, supportive process from start to finish" matches.
- 7 stacked numbered rows (single-column, narrow max-width container) match the design's stacked-card list at `src/components/mitzvah/HowItWorks.astro:118`.
- Number circles (filled teal with white digit) match design.
- Step titles 1-7 match exactly: "Get Started", "Learn", "Choose Your Path", "Fundraise", "Volunteer Experience", "Share Your Story", "Celebrate & Continue" (`scripts/seed-mitzvah-page.ts:82,88,94,100,106,112,118`).

**Gap**
- **Step descriptions are not rendered.** Each design step shows a one-line gray description directly under the title (e.g., "Reach out to Jewmanity and schedule your orientation. We'll introduce you to the project and answer any questions."). The live component template at `src/components/mitzvah/HowItWorks.astro:119-127` only emits the number circle + `{step.title}` — there is no `{step.description}` markup, even though the prop interface (`src/components/mitzvah/HowItWorks.astro:5`) and CMS data (`scripts/seed-mitzvah-page.ts:83-84,89-90,…`) supply one. Severity: **BLOCKER** (every row is missing visible content).
- **Number-circle color tone.** Design uses a soft tinted-teal background with darker teal numerals (looks like `bg-primary-light text-primary`). Live uses solid `bg-primary` with white digits (`src/components/mitzvah/HowItWorks.astro:121`). Severity: **MINOR**.
- **Right-side affordance.** Several design rows show no chevron, but rows in the design read as static information cards, not collapsibles. Live also has no chevron. No gap here — listing for completeness. Severity: **N/A**.

---

## 5. Choose Your Path — 3 cards

**Match**
- Section heading "Choose Your Path" matches (`scripts/seed-mitzvah-page.ts:125`).
- Section background is the alt-cream tone matching design (`src/components/mitzvah/ChooseYourPath.astro:43` `bg-bg-section-alt`).
- 3-card grid (3 across desktop, stacked mobile) matches (`src/components/mitzvah/ChooseYourPath.astro:54`).
- Card 1 title "Fundraise for Retreats" matches.
- Card 3 title "Raise Awareness" matches.
- Each card has icon → title → description → bulleted list (4 bullets), matching the design structure (`src/components/mitzvah/ChooseYourPath.astro:55-91`).

**Gap**
- **Subtitle copy.** Design: *"Make an impact in the way that speaks to you—or combine all three"* (em-dash, no period). Live: *"Make an impact in the way that speaks to you — or combine all three."* (en-dash + spaces, trailing period). Citation: `scripts/seed-mitzvah-page.ts:126`. Severity: **MINOR**.
- **Card 2 title.** Design: *"Volunteer with Soldiers"* (Israel-framed). Live: *"Volunteer with Soldiers in San Diego"*. Citation: `scripts/seed-mitzvah-page.ts:144`. Severity: **MAJOR** — the design positions this as a guided trip *to Israel*, while the live copy describes welcoming visiting soldiers *in San Diego*. Different program.
- **Card 1 description.** Design: *"Raise funds to sponsor healing retreats for soldiers and survivors. Every dollar directly supports rest, recovery, and resilience."* Live: *"Raise money to fund retreats for Jewish young people — experiences that build Jewish identity, resilience, and community during a time of rising antisemitism."* Citation: `scripts/seed-mitzvah-page.ts:132-133`. Severity: **MAJOR**.
- **Card 1 bullets.** Design bullets: *Set a personal fundraising goal · Share your campaign with friends and family · Track your impact in real-time · See exactly where your funds go.* Live bullets: *Set a fundraising goal (see suggested goals below) · Create an online fundraising page · Host a fundraising event · Share your story with guests at your celebration.* Citation: `scripts/seed-mitzvah-page.ts:134-139`. Severity: **MAJOR**.
- **Card 2 description.** Design: *"Travel to Israel and volunteer directly with soldiers. Build relationships, share stories, and show up when it matters most."* Live: *"When Israeli and Jewish soldiers visit San Diego, Jewmanity organizes volunteer experiences so you can meet, serve, and honor them directly."* Citation: `scripts/seed-mitzvah-page.ts:145-146`. Severity: **MAJOR**.
- **Card 2 bullets.** Design bullets: *Join a guided volunteer mission · Meet soldiers and hear their stories · Participate in meaningful service projects · Create lifelong connections.* Live bullets: *Register as a volunteer with Jewmanity San Diego · Help organize welcome events and meals · Write personal letters to soldiers beforehand · Document your experience for your mitzvah presentation.* Citation: `scripts/seed-mitzvah-page.ts:147-152`. Severity: **MAJOR**.
- **Card 3 description.** Design: *"Use your voice to educate your community about antisemitism and the importance of supporting Jewish identity."* Live: *"Use your voice — in your school, synagogue, and online — to educate others about antisemitism and what they can do about it."* Citation: `scripts/seed-mitzvah-page.ts:158-159`. Severity: **MAJOR**.
- **Card 3 bullets.** Design bullets: *Create social media campaigns · Host educational events · Share stories from the field · Inspire others to take action.* Live bullets: *Give a presentation at your school or synagogue · Create an informational display or poster series · Write and share your personal story on social media · Collect pledges from friends and family in exchange for awareness actions.* Citation: `scripts/seed-mitzvah-page.ts:160-165`. Severity: **MAJOR**.
- **Card icons.** Design uses (1) a person-with-mic / fundraiser glyph, (2) a handshake glyph, (3) a megaphone glyph. Live uses (1) a circled-dollar glyph, (2) a star/cross outline, (3) a horn-shaped glyph. All three differ in shape. Citations: `src/components/mitzvah/ChooseYourPath.astro:58-75` (SVG paths). Severity: **MAJOR**.

---

## 6. Set Your Fundraising Goal — 6 tier cards

**Match**
- 6-tier 3×2 grid layout matches (`src/components/mitzvah/FundraisingGoals.astro:41`).
- Tier amounts match exactly: $180, $360, $500, $1,000, $2,500, Custom (`scripts/seed-mitzvah-page.ts:176,182,188,194,200,206`).
- Tier names match exactly: Chai Level, Double Chai, Rising Star, Champion, Leader, Your Goal (note: design's "Custom" tier mistakenly shows "Rising Star" subtitle — that's a typo in the design itself; live "Your Goal" is correct and should not be regressed).
- Tier 1 ($180) description matches verbatim (`scripts/seed-mitzvah-page.ts:178`).
- Tier 2 ($360) description matches verbatim (`scripts/seed-mitzvah-page.ts:184`).
- Amounts rendered in large teal serif/heading font matching design (`src/components/mitzvah/FundraisingGoals.astro:44` `text-primary font-medium`).

**Gap**
- **Section heading.** Design: *"Set Your Fundraising Goal"*. Live: *"How Much Should I Raise?"*. Citation: `scripts/seed-mitzvah-page.ts:170`. Severity: **MAJOR**.
- **Section subtitle.** Design: *"Every amount makes a real difference. Choose a goal that's meaningful to you."* Live: *"Every dollar you raise makes a direct impact. Here are suggested fundraising tiers — choose what feels right for you, and remember: it's not about the amount, it's about the effort and the heart behind it."* Citation: `scripts/seed-mitzvah-page.ts:171-172`. Severity: **MAJOR**.
- **Tier 3 ($500) description.** Design: *"Covers all of the supplies and materials to provide for a Jewish youth retreat experience."* Live: *"Covers supplies and materials for a Jewish youth retreat experience."* Citation: `scripts/seed-mitzvah-page.ts:190`. Severity: **MINOR** (close paraphrase; design phrasing is wordier).
- **Tier 4 ($1,000) description.** Design: *"Helps fund a full retreat scholarship for a Jewish young person who couldn't [otherwise attend]"* (truncated by my crop boundary). Live: *"Helps fund a full retreat scholarship for a Jewish young person who couldn't otherwise attend."* Citation: `scripts/seed-mitzvah-page.ts:196`. Severity: **N/A** (matches once design ellipsis is resolved).
- **Tier 6 (Custom) name.** Live: *"Your Goal"*. Design: shows *"Rising Star"* due to a copy-paste typo in the mock; live's *"Your Goal"* is the correct value and should be retained. No fix needed — flagged for awareness only. Severity: **N/A** (intentional deviation).

---

## 7. Frequently Asked Questions

**Match**
- Section heading "Frequently Asked Questions" matches (`src/pages/get-involved/mitzvah-project.astro:106`).
- Subtitle "Have questions? We're here to help." matches (`src/pages/get-involved/mitzvah-project.astro:107`).
- All 7 question texts match design exactly, in the same order: How early should we start the project? · Does my child need to be in San Diego to participate? · Will Jewmanity help us set up a fundraising page? · Does this project count as an official mitzvah project for our synagogue? · What if my child is shy and doesn't want to do public presentations? · Is there a cost to participate? · Can siblings or friends join the project too? Citations: `src/pages/get-involved/mitzvah-project.astro:41-67` (fallback list, matches CMS via `getFaqItems('mitzvah')`).
- Right-edge chevron icon matches (`src/components/shared/FAQAccordion.astro:36`).
- Click-to-expand `<details>` interactivity is consistent with a typical accordion (`src/components/shared/FAQAccordion.astro:33`).

**Gap**
- **Row container styling.** Design: each FAQ row is its own white card with `rounded-2xl`, soft shadow, and an explicit gap between cards. Live: rows are flat list items separated by horizontal hairlines (`src/components/shared/FAQAccordion.astro:31` `divide-y divide-border-card`). Severity: **MAJOR** — visually different motif.
- **Row padding.** Design rows show ~24-28px vertical padding inside each card. Live uses `py-5` (~20px) inside flat rows (`src/components/shared/FAQAccordion.astro:34`). Severity: **MINOR**.
- **Container max-width.** Design FAQ grid spans wider than the live container (the live page caps at `max-w-[800px] lg:max-w-[960px]` per `src/components/shared/FAQAccordion.astro:17`); the design FAQ visually extends almost to the section edges (~1100-1200px). Severity: **MINOR**.

---

## 8. Final CTA — "Ready to Begin Your Mitzvah Project?"

**Match**
- Heading text "Ready to Begin Your Mitzvah Project?" matches (`scripts/seed-mitzvah-page.ts:213`, rendered at `src/components/mitzvah/MitzvahCTA.astro:25`).
- Description "Reach out to the Jewmanity team today. We'd love to meet you, hear your story, and help you make your bar or bat mitzvah truly unforgettable." matches verbatim (`scripts/seed-mitzvah-page.ts:214-215`).
- Primary button "Start Your Project" → `/get-involved/contact` matches (`scripts/seed-mitzvah-page.ts:216-217`).
- Secondary button "Download Project Guide" → `/jewmanity-bar-bat-mitzvah-project.pdf` matches (`scripts/seed-mitzvah-page.ts:218-219`).
- Two-button row, primary teal pill + secondary outlined pill, matches design pattern.

**Gap**
- **Section background.** Design: cream/light page background (#FAF8F5), with the existing dark-teal site footer rendered separately *below* it. Live: the CTA section itself uses `bg-bg-footer` (#244755), so it visually merges with the footer above it. Citation: `src/components/mitzvah/MitzvahCTA.astro:23` (`bg-bg-footer`). Severity: **MAJOR** — the CTA reads as part of the footer rather than a final page section.
- **Heading color.** Design: dark heading text on light background. Live: white heading on dark teal (`src/components/mitzvah/MitzvahCTA.astro:25` `text-white`). Severity: **MAJOR** (follows from the background change).
- **Heading style — italic.** Design heading is upright. Live heading uses `italic` (`src/components/mitzvah/MitzvahCTA.astro:25`). Severity: **MAJOR**.
- **Description color.** Design: dark body text on cream. Live: `text-white/80` on dark (`src/components/mitzvah/MitzvahCTA.astro:28`). Severity: **MAJOR** (follows from the background change).
- **Secondary button style.** Design: white-fill pill with teal text and teal border. Live: transparent pill with white text and white border (`src/components/mitzvah/MitzvahCTA.astro:41`). Severity: **MAJOR** (follows from the background change).

---

## Sections in the live page but NOT in the design

- **None.** Every section the live page renders maps to a section in the design. Specifically:
  - There are no `MitzvahQuote` instances on the live page (component file does not exist; no imports anywhere in `src/`). The brief's mention of "MitzvahQuote (×2)" is stale — the component was removed in commit `b6cd20f` as part of "redesign page per Harrison mocks". The design also has no quote blocks. **No removal needed.**

## Sections in the design but NOT in the live page

- **None.** All 8 design sections are present on the live page. The gaps above are content/styling within sections, not missing sections.

---

## Prioritized Punch List

### BLOCKER

1. **Render the step description in `HowItWorks`.** Update the row template at `src/components/mitzvah/HowItWorks.astro:119-127` to emit `{step.description}` (and consider an optional `actions` / `tip` block, since the prop interface already includes them). Without this, every numbered step shows only its title — six rows of design content are silently dropped from the live page.

### MAJOR

2. **Hero — switch heading from teal italic to white upright.** In `src/components/mitzvah/MitzvahHero.astro:28`, remove `italic` and change `text-primary` to a white/cream class (e.g. `text-white`).
3. **Hero — replace subtitle copy.** Update Sanity `mitzvahProject.heroSubtitle` (and seed at `scripts/seed-mitzvah-page.ts:31-32`) to *"Make a real impact by fighting antisemitism, supporting Jewish identity, and helping others."*
4. **Why This Matters — replace paragraph 1.** Update `mitzvahProject.whyParagraphs[0]` (and seed at `scripts/seed-mitzvah-page.ts:37`) to the design's two-clause version: *"At a time when antisemitism is rising and Jewish identity is under attack, your Bar or Bat Mitzvah can be more than a celebration—it can be a stand for what you believe in."*
5. **Why This Matters — replace paragraph 3.** Update `mitzvahProject.whyParagraphs[2]` (and seed at `scripts/seed-mitzvah-page.ts:39`) to drop the *"Jewmanity gives you real ways…"* lead-in and start at *"This is your chance…"*.
6. **Why This Matters — swap image.** Replace the community-gathering photo with the two-men-on-couch conversation shot from the design. Update Sanity `mitzvahProject.whyImage` and the static fallback at `public/images/sections/mitzvah-why-matters.jpg` referenced in `src/components/mitzvah/WhyThisMatters.astro:38`.
7. **Impact — rewrite Card 1 title and description.** Update `scripts/seed-mitzvah-page.ts:49-51` (and Sanity) to title *"Fight Antisemitism"* with description *"Stand up against hate by supporting programs that educate, defend, and build resilience in Jewish communities worldwide."*
8. **Impact — swap Card 1 icon.** Replace the `shield` SVG at `src/components/mitzvah/ImpactCards.astro:60-63` with a heart outline (and update the stored icon string from `shield` → `heart` at `scripts/seed-mitzvah-page.ts:48`, recognizing this collides with Card 4's current `heart` value).
9. **Impact — rewrite Card 2 description.** Update `scripts/seed-mitzvah-page.ts:57-58` to *"Sponsor healing retreats for soldiers and survivors, providing rest, community, and a path forward after trauma."*
10. **Impact — swap Card 2 icon.** Replace the `mountain` SVG at `src/components/mitzvah/ImpactCards.astro:65-69` with a person/profile glyph; update the icon string at `scripts/seed-mitzvah-page.ts:55`.
11. **Impact — rewrite Card 3 description.** Update `scripts/seed-mitzvah-page.ts:64-65` to *"Connect directly with Israeli soldiers through hands-on volunteering, building bridges and showing solidarity."*
12. **Impact — swap Card 3 icon.** Replace the `handshake` SVG at `src/components/mitzvah/ImpactCards.astro:71-77` with a 4-node hub/network glyph; update the icon string at `scripts/seed-mitzvah-page.ts:62`.
13. **Impact — rewrite Card 4 description.** Update `scripts/seed-mitzvah-page.ts:71-72` to *"Embody the principles of tikkun olam, tzedakah, and gemilut chasadim through meaningful, lasting action."*
14. **Impact — swap Card 4 icon.** Replace the `heart` SVG at `src/components/mitzvah/ImpactCards.astro:79-82` with a Star of David glyph; update the icon string at `scripts/seed-mitzvah-page.ts:69`.
15. **Choose Your Path — rename Card 2.** Update title at `scripts/seed-mitzvah-page.ts:144` from *"Volunteer with Soldiers in San Diego"* → *"Volunteer with Soldiers"*, and confirm with stakeholder whether the program is San-Diego-only or includes Israel travel (the design copy implies travel to Israel, which is a program scope decision, not just copy).
16. **Choose Your Path — rewrite Card 1 description and bullets.** Update `scripts/seed-mitzvah-page.ts:132-139` to design copy ("Raise funds to sponsor healing retreats…" + the four bullets in design item 1).
17. **Choose Your Path — rewrite Card 2 description and bullets.** Update `scripts/seed-mitzvah-page.ts:145-152` to design copy ("Travel to Israel and volunteer directly with soldiers…" + the four design bullets).
18. **Choose Your Path — rewrite Card 3 description and bullets.** Update `scripts/seed-mitzvah-page.ts:158-165` to design copy ("Use your voice to educate your community…" + the four design bullets).
19. **Choose Your Path — swap card icons.** Replace the three SVGs at `src/components/mitzvah/ChooseYourPath.astro:58-75` to match design: (1) person/mic-fundraiser, (2) handshake, (3) megaphone.
20. **Fundraising Goals — rename section heading.** Update `scripts/seed-mitzvah-page.ts:170` from *"How Much Should I Raise?"* → *"Set Your Fundraising Goal"*.
21. **Fundraising Goals — replace section subtitle.** Update `scripts/seed-mitzvah-page.ts:171-172` to *"Every amount makes a real difference. Choose a goal that's meaningful to you."*
22. **FAQ — switch row container styling.** Update `src/components/shared/FAQAccordion.astro:31-44` so each FAQ item is a standalone white card (`rounded-2xl bg-white shadow-...` with vertical gap between items via `space-y-3` or `gap-3`) instead of the current flat `divide-y` list. Note this is a shared component used elsewhere — check how this change affects the FAQ accordion on other pages before shipping.
23. **CTA — move section background from dark to cream.** In `src/components/mitzvah/MitzvahCTA.astro:23`, replace `bg-bg-footer` with the page background (or alt-cream) so the dark-teal site footer is the only dark band at the bottom of the page.
24. **CTA — flip heading and body to dark text on light background.** Update `src/components/mitzvah/MitzvahCTA.astro:25,28` to drop `text-white` / `text-white/80` in favor of `text-text-heading` / `text-text-body`; and remove `italic` from the heading.
25. **CTA — restyle secondary button for light background.** Update `src/components/mitzvah/MitzvahCTA.astro:41` from `border-white bg-transparent text-white hover:bg-white hover:text-primary` to `border-primary bg-white text-primary hover:bg-primary hover:text-white` (or equivalent).

### MINOR

26. **Hero — bump subtitle contrast.** Change `text-white/85` at `src/components/mitzvah/MitzvahHero.astro:31` to a fuller-opacity cream/white, matching the design's higher-contrast sub-heading.
27. **Why This Matters — fix component fallback for paragraph 2.** Edit `src/components/mitzvah/WhyThisMatters.astro:12` so the fallback says "soldiers and survivors in Israel" (matches design + CMS) instead of "soldiers and individuals in need". Defends against CMS-empty rendering.
28. **Impact — tighten Card 2 title.** Update `scripts/seed-mitzvah-page.ts:56` from *"Fund Life-Changing Retreats"* → *"Fund Retreats"*.
29. **Impact — tighten Card 3 title.** Update `scripts/seed-mitzvah-page.ts:63` from *"Volunteer with Jewish Soldiers"* → *"Volunteer with Soldiers"*.
30. **How It Works — soften number-circle style.** Change `src/components/mitzvah/HowItWorks.astro:121` from `bg-primary ... text-white` to `bg-primary-light text-primary` to match the design's softer pill.
31. **Choose Your Path — normalize subtitle dash and trailing period.** Update `scripts/seed-mitzvah-page.ts:126` from *" — or combine all three."* to *"—or combine all three"* (em-dash, no surrounding spaces, no trailing period).
32. **Fundraising Goals — restore "all of the" phrasing in Tier 3.** Update `scripts/seed-mitzvah-page.ts:190` from *"Covers supplies and materials for…"* to *"Covers all of the supplies and materials to provide for…"* if exact-design-match is desired.
33. **FAQ — increase row vertical padding.** Bump `py-5` at `src/components/shared/FAQAccordion.astro:34` to `py-6 md:py-7` once the rows become standalone cards (BLOCKER #22).
34. **FAQ — widen container.** Bump `max-w-[800px] lg:max-w-[960px]` at `src/components/shared/FAQAccordion.astro:17` to `max-w-[1100px]` so the FAQ grid matches the design's near-full-width framing.
35. **Screenshot tool — capture animated content.** The repository's `scripts/screenshot.mjs` produces empty bands for sections that rely on ScrollTrigger. Either pass `reducedMotion: 'reduce'` in the Playwright context (matching the safety net at `src/styles/global.css:92`) or programmatically scroll the page top-to-bottom before snapshotting. Without this, future visual QA against this page (and any other GSAP-animated page) is broken. Citation: `scripts/screenshot.mjs:7-21`.
36. **MitzvahQuote follow-up.** Confirm there is no remaining Sanity content tied to a (now non-existent) MitzvahQuote schema. Run `grep -rn "mitzvahQuote\|MitzvahQuote" sanity/ scripts/` — should return zero matches. (Currently does.) No action required, listed for the engineer's checklist.
