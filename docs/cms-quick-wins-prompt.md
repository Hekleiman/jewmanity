# Prompt: CMS Gap Quick Wins

Hand this to Claude Code from inside `/Users/hek/jewmanity`. Reference: `docs/cms-website-gap-audit-2026-05-18.md`. These are the four lowest-risk fixes from the audit's recommendation list (items 1, 2, 4, 13). No design decisions required. Total estimate: 20 to 30 minutes including verification.

Do not use em-dashes in code comments, commit messages, or any output. Commas, periods, or parens instead.

---

## Fix 1: Wire `cmsRetreats` into `RetreatGrid` on past retreats page

File: `src/pages/programs/past-retreats.astro`, line 47.

The page already fetches retreats from Sanity into `cmsRetreats` (lines 10 to 21) and `RetreatGrid` already accepts an optional `retreats` prop (`src/components/programs/RetreatGrid.astro:12-14`). The grid currently always renders the hardcoded fallback because no prop is passed.

Change:

```astro
  <RetreatGrid />
```

to:

```astro
  <RetreatGrid retreats={cmsRetreats.length > 0 ? cmsRetreats : undefined} />
```

The `undefined` (rather than `[]`) is intentional so the component's internal `cmsRetreats && cmsRetreats.length > 0` check correctly falls through to its hardcoded fallback when Sanity returns nothing.

Verify: `npm run build` succeeds. After build, a quick grep of `dist/programs/past-retreats/index.html` should show retreat titles from Sanity if any retreats exist there.

---

## Fix 2: Drop the slug allowlist in community stories `getStaticPaths`

File: `src/pages/about/community-stories/[slug].astro`, lines 79 to 102.

Today, only six pre-approved slugs ever become a page even if Sanity has more `communityStory` documents. Mirror the `/shop/[slug]` pattern: take every CMS slug, then union with the hardcoded fallback slugs for ones not in CMS.

Replace the current `getStaticPaths` body (lines 80 to 102) with:

```ts
export async function getStaticPaths() {
  let cmsStories: Record<string, unknown>[] = [];
  try {
    cmsStories = await getCommunityStories();
  } catch (e) {
    console.warn('Sanity fetch failed for community story paths, using fallback');
  }

  const fallbackSlugs = ['first-retreat', 'golani-boys-return', 'brave-girls', 'fathers-fighters-finding-peace', 'joy-of-giving', 'believing-again'];

  const cmsPaths = cmsStories
    .filter((s) => s.slug)
    .map((s) => ({
      params: { slug: s.slug as string },
      props: { story: s },
    }));

  const cmsSlugs = new Set(cmsPaths.map((p) => p.params.slug));
  const fallbackPaths = fallbackSlugs
    .filter((s) => !cmsSlugs.has(s))
    .map((s) => ({ params: { slug: s } }));

  return [...cmsPaths, ...fallbackPaths];
}
```

The only behavioral change is the removal of the `allowedSlugs.has(...)` filter. Every CMS community story now produces a page. Any fallback slug not present in CMS still renders from `fallbackStories`.

Verify: `npm run build` succeeds and produces a `dist/about/community-stories/<slug>/index.html` for every CMS story slug (not just the six fallback slugs).

---

## Fix 3: Remove the ghost `faqContext` from the donate seed

File: `scripts/seed-donate-page.ts`, line 161.

The `donatePage` schema no longer declares `faqContext`. The seed still writes it, creating an undeclared field on the Sanity document. Delete the line.

Remove:

```ts
    faqContext: 'donate',
```

(Single line, between `faqSubtitle` at line 160 and the blank line at 162.) The trailing blank line above `ctaHeading` should remain.

Verify: `npm run build` still succeeds. The seed script itself does not need to be re-run for this audit. If the user later re-runs `npx tsx scripts/seed-donate-page.ts`, the resulting document will no longer carry a stale field.

---

## Fix 4: Remove the ghost `faqContext` from the volunteer seed

File: `scripts/seed-volunteer-page.ts`, line 121.

Same issue, different file.

Remove:

```ts
    faqContext: 'volunteer',
```

(Single line, between `faqSubtitle` at line 120 and the blank line at 122.)

---

## Fix 5: Wrap `getRetreats()` in try/catch in the retreat detail page's `getStaticPaths`

File: `src/pages/programs/[slug].astro`, lines 14 to 20.

Today a Sanity outage will fail the build because `getStaticPaths` calls `getRetreats()` with no error handling. There is no longer a `src/data/retreats.ts` fallback (it was removed between April and May), so a graceful empty paths array on failure is the right behavior. Worst case, retreat detail pages disappear from that build, which is what would happen anyway. Best case, the rest of the site still ships.

Replace the current `getStaticPaths` (lines 14 to 20) with:

```ts
export async function getStaticPaths() {
  let retreats: Record<string, unknown>[] = [];
  try {
    retreats = await getRetreats();
  } catch (e) {
    console.warn('Sanity fetch failed for retreat paths, no detail pages will be built');
    return [];
  }

  return retreats.map((retreat: Record<string, unknown>) => ({
    params: { slug: (retreat.slug as { current: string }).current },
    props: { retreat },
  }));
}
```

Verify: `npm run build` succeeds. The behavior on successful Sanity fetch is unchanged. To prove the catch path, temporarily break the Sanity project ID in `.env` (or pass a bad value), confirm the build no longer crashes, then revert.

---

## Verification

After all five edits:

1. `npm run build`. It must succeed with zero TypeScript errors and zero runtime errors. Watch the build log for any new Sanity warnings; they are expected if the project ID env var is missing locally, but no fetch should silently fail in a way that the console does not surface.

2. Spot-check the output directory:
   - `dist/programs/past-retreats/index.html` should contain at least the CMS retreat titles, not just the four hardcoded fallbacks.
   - `dist/about/community-stories/` should contain a directory for every CMS communityStory slug, not just the six allowlist slugs.

3. `git diff` should show changes to exactly five files: `src/pages/programs/past-retreats.astro`, `src/pages/about/community-stories/[slug].astro`, `scripts/seed-donate-page.ts`, `scripts/seed-volunteer-page.ts`, `src/pages/programs/[slug].astro`. No other files modified.

4. `git diff --stat` line counts should be small (under 50 added lines across all five files combined).

## Commit

One commit per fix is fine, or one bundled commit titled:

```
fix(cms): close four CMS gaps from 2026-05-18 audit

- pass cmsRetreats into RetreatGrid on past-retreats page (was always falling back)
- remove hardcoded slug allowlist from community-stories getStaticPaths
- strip ghost faqContext field from donate and volunteer seed scripts
- wrap getRetreats in try/catch in programs/[slug].astro getStaticPaths

Refs docs/cms-website-gap-audit-2026-05-18.md items 1, 2, 4, 13.
```

No em-dashes in the commit message.
