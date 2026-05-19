# Prompt: CMS Singletons for 4 Orphan Pages (Audit Item 11)

Hand this to Claude Code from inside `/Users/hek/jewmanity`. Reference: `docs/cms-website-gap-audit-2026-05-18.md` item 11. This is the biggest editor-experience win from the audit. Estimate: 1.5 to 2 hours including verification and seeding.

Do not use em-dashes in code, comments, descriptions, or commit messages. Commas, periods, or parens instead. This applies to schema field descriptions too, since editors read them in Studio.

---

## Why

Belinda reported she could not find Sanity fields for several page elements that look editable on the rendered site. The 2026-05-18 CMS-state pull confirms that four pages currently have zero schema for their hero text, intro paragraphs, and CTA blocks. Everything visible on those pages is hardcoded in `.astro` files and requires a developer to change. The four pages:

- `/about/team` (the team grid itself is CMS-driven, the chrome around it is not)
- `/about/community-stories` (testimonials inside are CMS-driven, hero plus intro plus voices heading plus CTA are not)
- `/community/recipes` listing (recipe grid is CMS-driven, hero plus intro plus CTA are not)
- `/programs/past-retreats` listing (retreat grid is now CMS-driven after commit 814b86d, but hero plus grid heading plus testimonials heading plus CTA are still hardcoded)

This prompt adds a singleton document per page so Belinda can edit hero text, intros, and CTAs from Studio.

---

## Pattern to follow

Use `sanity/schemas/singletons/aboutStory.ts` as the structural template for all four new singletons. Mirror its conventions:

- Singleton document type, one per page.
- `groups` array at the top so Studio renders one tab per section (Hero, Intro, CTA, etc.).
- `hero` field of type `heroSection` (the existing reusable object), not a custom hero shape. This keeps all hero editing UX consistent across the site.
- Field descriptions written so a content editor with no developer context can understand what the field controls. Write descriptions in plain English. Example: "The large heading at the top of the team page. Keep to 5 to 10 words for impact."
- Use `initialValue` on string fields to pre-populate sensible defaults when the editor creates a new field.
- Use `validation: rule => rule.max(N).warning('...')` on copy-length fields to nudge editors toward short text.
- `preview.prepare()` returns a static `title` for the singleton in Studio (e.g., "Team Page").

For the page wiring, mirror the pattern in `src/pages/about/story.astro` (lines 24 to 41) which already consumes a singleton this way. Wrap the fetch in try/catch, fall back to existing hardcoded strings if Sanity returns nothing, then thread the values into the existing components.

---

## Four singletons to create

For each one, the work is: schema file, register in index, register in desk, GROQ in `src/lib/sanity.ts`, page wiring, seed script. Each singleton should ship with its seed populated using the existing hardcoded values on the page, so when CC runs the seeds the live Studio shows Belinda's current site content immediately.

### Singleton 1: `aboutTeamPage`

- Schema file: `sanity/schemas/singletons/aboutTeamPage.ts`.
- Page to wire: `src/pages/about/team.astro`.
- Hardcoded source values for the seed: lines 22 to 32 of `team.astro`.

Fields:

- `hero` (heroSection). Seed heading "Meet the People Behind Jewmanity", subtitle "A dedicated team united by compassion, lived experience, and a commitment to building resilience in our community.", backgroundImage `/images/hero/about-team.jpg`.
- `ctaHeading` (string). Seed "Be Part of the Work We Do".
- `ctaSubtitle` (text, 3 rows). Seed "Join a growing community committed to service, responsibility, and impact.".
- `ctaPrimaryButton` (object with `text` and `href`). Seed `{ text: 'Learn How to Get Involved', href: '/get-involved/volunteer' }`.
- `ctaSecondaryButton` (object with `text` and `href`). Seed empty so editor can add later.

Groups: `hero`, `cta`.

### Singleton 2: `aboutCommunityStoriesPage`

- Schema file: `sanity/schemas/singletons/aboutCommunityStoriesPage.ts`.
- Page to wire: `src/pages/about/community-stories.astro`.
- Hardcoded source values for the seed: lines 60 to 65 (hero), 70 to 75 (intro paragraphs), 85 to 89 (voices section), 135 to 138 (CTA).

Fields:

- `hero` (heroSection). Seed heading "Community Stories", subtitle "Celebrating the legacy of care, resilience, and humanity that defines Jewish communities around the world", backgroundImage `/images/hero/community-stories.jpg`.
- `introParagraphs` (array of strings, or use `portableText` if you want richer formatting; strings are fine here). Seed the two existing paragraphs from lines 71 and 74. Note that the second paragraph in the source uses an em-dash and an en-dash; convert both to plain prose during seeding (commas or rewrites), so the seeded content does not violate the project style rule.
- `voicesHeading` (string). Seed "Voices from Our Community".
- `voicesSubtitle` (text). Seed "Real stories from the people whose lives have been touched by Jewmanity".
- `ctaHeading` (string). Seed "Be Part of the Ongoing Story".
- `ctaSubtitle` (text). Seed the existing line 137 subtitle (clean any dashes).
- `ctaPrimaryButton` (object). Seed `{ text: 'Get Involved', href: '/get-involved/volunteer' }`.

Groups: `hero`, `intro`, `voices`, `cta`.

### Singleton 3: `communityRecipesPage`

- Schema file: `sanity/schemas/singletons/communityRecipesPage.ts`.
- Page to wire: `src/pages/community/recipes.astro`.
- Intro component to also wire: `src/components/community/RecipesIntro.astro` (currently takes no props; add a `paragraphs` prop array so it can accept CMS values).
- Hardcoded source values for the seed: lines 24 to 30 (hero), `RecipesIntro.astro` lines 7 to 12 (two intro paragraphs), lines 35 to 38 of `recipes.astro` (CTA).

Fields:

- `hero` (heroSection). Seed heading "Recipes Inspired by Our Heritage", subtitle "Where tradition, memory, and togetherness gather around the table", backgroundImage `/images/hero/recipes.jpg`. Note the page has a TODO comment about replacing the hero image with a client photo; preserve the comment as a Studio description on the backgroundImage field ("Replace with a real photograph from the client when available.") so the editor sees the note in context.
- `introParagraphs` (array of objects each with `text` and `italic: boolean`, or two separate fields `introParagraph1` and `introParagraph2` plus a `introParagraph2Italic` boolean; pick whichever is simpler in Studio). Seed the two existing paragraphs.
- `ctaHeading` (string). Seed "Share Your Recipe, Share Your Story".
- `ctaSubtitle` (text, 3 rows). Seed the existing subtitle copy at line 37, replacing the em-dash with a comma.
- `ctaPrimaryButton` (object). Seed `{ text: 'Join Our Table', href: '/get-involved/contact' }`.

Groups: `hero`, `intro`, `cta`.

### Singleton 4: `programsPastRetreatsPage`

- Schema file: `sanity/schemas/singletons/programsPastRetreatsPage.ts`.
- Page to wire: `src/pages/programs/past-retreats.astro`.
- Component to also wire: `src/components/programs/RetreatGrid.astro` (currently has a hardcoded section heading and subtitle inside the component; add `heading` and `subtitle` props that, if provided, override the hardcoded text).
- Hardcoded source values for the seed: page lines 42 to 45 (hero), `RetreatGrid.astro` lines 54 to 59 (grid heading and subtitle), page lines 49 to 50 (testimonials carousel heading and subtitle), page lines 64 to 67 (CTA).

Fields:

- `hero` (heroSection). Seed heading "Past Retreats", subtitle "Jewmanity creates safe, restorative spaces where Israeli soldiers and their loved ones find healing, connection, and renewed hope.", backgroundImage `/images/hero/past-retreats.jpg`, imagePosition "center 20%" (treat imagePosition as a string field on the heroSection object only if it is already declared; if not, leave as default and note the hardcoded `imagePosition` prop on the page).
- `gridHeading` (string). Seed "Stories of courage, connection, and healing".
- `gridSubtitle` (text). Seed the existing copy from `RetreatGrid.astro:57-58`, cleaning any non-plain dashes.
- `testimonialsHeading` (string). Seed "What Our Attendees Say".
- `testimonialsSubtitle` (text). Seed "Honest reflections from those who found healing, connection, and renewed strength through Heads Up.".
- `ctaHeading` (string). Seed "Healing Happens Together".
- `ctaSubtitle` (text). Seed the existing copy at line 66 (clean dashes).
- `ctaPrimaryButton` (object). Seed `{ text: 'Learn More About Heads Up', href: '/programs/heads-up' }`.

Groups: `hero`, `grid`, `testimonials`, `cta`.

---

## Per-singleton wiring checklist

For each of the four singletons, every step below must be done before moving to the next singleton. Do not batch all schemas first, all GROQs second, etc., because that produces a half-broken state in the middle of the task.

1. Write the schema file under `sanity/schemas/singletons/`.
2. Register the schema in `sanity/schemas/index.ts`: add the import, add to the `schemaTypes` array, add the type name to the `singletonTypes` Set.
3. Add a `singletonListItem` entry in `sanity/lib/desk.ts` inside the "Pages" sublist, in the order: existing items, then the new one in a sensible spot (group it next to siblings: `aboutTeamPage` next to `aboutStory`, `aboutCommunityStoriesPage` after that, `communityRecipesPage` after resources, `programsPastRetreatsPage` next to `headsUp`). Pick an icon from `@sanity/icons` that matches: `UsersIcon` for team, `BookIcon` for community stories, `ComposeIcon` for recipes, `CalendarIcon` for past retreats.
4. Add a GROQ fetcher function in `src/lib/sanity.ts` next to the related ones. Mirror the shape of `getAboutStory()`: project every field the page reads. For `hero`, project the inner fields explicitly the way `getAboutStory()` does at line 218 area, do not just project `hero` as a whole object.
5. Update the page `.astro` file to fetch the singleton, fall back to the existing hardcoded values via `??`, and thread values into components. The hardcoded strings must remain inline as the fallback; do not delete them. The pattern is: `cms?.field ?? 'hardcoded value'`.
6. If a component needs new props (RetreatGrid, RecipesIntro), update the `interface Props` and the destructure plus the markup. Use the same `prop ?? hardcoded` pattern inside the component.
7. Write the seed script at `scripts/seed-about-team-page.ts`, `scripts/seed-about-community-stories-page.ts`, `scripts/seed-community-recipes-page.ts`, `scripts/seed-programs-past-retreats-page.ts`. Mirror `scripts/seed-about-story.ts` for the boilerplate (token env check, image upload helper, block helper, createOrReplace at the end). Seed values are the page's current hardcoded strings with all em-dashes and en-dashes replaced by commas, periods, parens, or rewrites.

---

## After all four are wired

Run from the repo root:

```
npm run build
```

Build must succeed with zero TypeScript errors. The build pulls from Sanity, so if a GROQ projection has a typo it will surface as an undefined field in the page output. Spot-check the four pages in `dist/`: they should still render their hardcoded fallback content (because the new singletons are not seeded yet).

If you have a Sanity API token in `.env`, run the four new seed scripts in this order:

```
SANITY_API_TOKEN=$TOKEN npx tsx scripts/seed-about-team-page.ts
SANITY_API_TOKEN=$TOKEN npx tsx scripts/seed-about-community-stories-page.ts
SANITY_API_TOKEN=$TOKEN npx tsx scripts/seed-community-recipes-page.ts
SANITY_API_TOKEN=$TOKEN npx tsx scripts/seed-programs-past-retreats-page.ts
```

If you do not have a token, stop after writing the seed scripts and tell the user the token-bearing step needs to happen on their machine.

After seeding, rebuild and spot-check that the rendered pages now contain the CMS-driven text (it will be identical to the hardcoded fallback for now, since the seed mirrors it, but the chain is live).

---

## Out of scope (do not touch in this prompt)

- The `siteSettings.footerTagline` rendering and the recipe `relatedRecipes` switch. Those are the round-2 prompt at `docs/cms-quick-render-fixes-prompt.md` and should land separately.
- The `inStock`, `hero.ctas`, and crisis-resources-region items (audit recommendations 3, 7, 9). They need product decisions, not implementation.
- The orphan `faqContext` ghost field on the live donate and volunteer documents. That is a one-off patch script worth doing separately (see follow-ups below).

---

## Follow-ups to surface in the commit message

The 2026-05-18 CMS scan surfaced three content-side items the audit could not see. None block this prompt, but the commit message should call them out so they do not get lost:

1. `mitzvahProject.heroImage` is unset in Sanity, so the mitzvah page is falling back to the placeholder. Belinda should upload a hero image.
2. The live `donatePage` and `volunteerPage` documents still carry a `faqContext` field on the published doc even though the schema and seeds no longer declare it. A one-line cleanup script using `client.patch().unset(['faqContext']).commit()` will fix it.
3. Only 2 testimonials are published. Most pages that show multiple testimonials are leaning on hardcoded fallbacks. More testimonial documents would replace the fallbacks automatically.

---

## Commit

One bundled commit. Suggested message:

```
feat(cms): add page-content singletons for four orphan pages

Closes audit item 11 from docs/cms-website-gap-audit-2026-05-18.md. The
team, community-stories listing, recipes listing, and past-retreats listing
pages now have Sanity singletons covering hero text, intro paragraphs, and
CTAs. Existing hardcoded values remain as graceful fallbacks; the seed
scripts mirror those values so Studio shows the current site content out
of the box.

Schemas added:
- aboutTeamPage
- aboutCommunityStoriesPage
- communityRecipesPage
- programsPastRetreatsPage

Pages updated:
- src/pages/about/team.astro
- src/pages/about/community-stories.astro
- src/pages/community/recipes.astro
- src/pages/programs/past-retreats.astro

Components updated:
- src/components/community/RecipesIntro.astro (accepts paragraphs prop)
- src/components/programs/RetreatGrid.astro (accepts heading/subtitle props)

Seed scripts added under scripts/ following the seed-about-story pattern.

Follow-ups (separate work):
- mitzvahProject.heroImage is unset in Sanity (content task for Belinda)
- ghost faqContext field still on live donate and volunteer documents
  (needs one-off unset patch script)
- only 2 testimonials published, pages leaning on hardcoded fallbacks
```

No em-dashes anywhere in the commit message.
