# CMS Audit 2026-05-18, Closeout

This is a one-page handoff for the next session. Captures the final state of the work that started from `docs/cms-website-gap-audit-2026-05-18.md` (the source audit) and shipped across five PRs between 2026-05-18 and 2026-05-19.

## Source audit

- `docs/cms-website-gap-audit-2026-05-18.md`. 14 recommendations, organized by editor-impact priority.
- Methodology: read-only three-way reconciliation across schema files, GROQ queries, and page reads, plus a live CDN scan of the published Sanity dataset via Chrome MCP.
- Counterpart from the prior cycle: `docs/project-audit-2026-04-20.md`. The May audit notes which of the April findings became stale; that doc now carries an inline annotation pointing forward.

## PRs shipped

| PR | Commit | Title | Scope |
|----|--------|-------|-------|
| #1 | `f7c4279` (merge of `814b86d`, `2729896`, `759e42e`, `cdcd9e5`, `0d5c7ec`) | Four CMS gap fixes plus orphan-page singletons plus footerTagline plus audit doc | Closes recommendations 1, 2, 4, 6, 8, 11, 13 |
| #2 | `eacff80` | Move Formspree and Mailchimp wiring to env vars | Refactor in response to E2E test pass finding that Mailchimp pointed at the wrong audience |
| #3 | `4c5d761` | Max-editability pass plus mitzvah hero image seed | Closes recommendations 3, 7, 9 |
| #4 | `d34fb9b` | Archive CMS audit working materials | Commits the six prompt docs and the read-only `verify-cms-state.mjs` script that drove PRs 1 through 3 |
| #5 | `c1aacf3` | Clean up dead schema fields | Closes recommendations 5, 10, 12, 14 |

All PRs squash-merged to `main` via `gh pr merge --auto --squash --delete-branch`. Default flow saved in memory.

## Recommendation status

| # | Topic | Status | Closing commit |
|---|-------|--------|----------------|
| 1 | Wire `cmsRetreats` into `RetreatGrid` on past retreats page | Done | `814b86d` |
| 2 | Drop hardcoded slug allowlist in community stories `getStaticPaths` | Done | `814b86d` |
| 3 | Implement `product.inStock` visibility | Done | `4c5d761` |
| 4 | Drop ghost `faqContext` from donate and volunteer seeds and live documents | Done | `814b86d` plus `759e42e` cleanup script |
| 5 | Remove `mitzvahProject.openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution` | Done | `c1aacf3` |
| 6 | Read `siteSettings.footerTagline` in `Footer.astro` | Done | `0d5c7ec` |
| 7 | Render `hero.ctas` across heroes | Done | `4c5d761` |
| 8 | Stop rendering `relatedRecipes` from hardcoded `allRecipes` object | Done | `0d5c7ec` |
| 9 | Surface other-region crisis resources on `/resources` | Done | `4c5d761` |
| 10 | Remove `resources.disclaimer` from schema and GROQ | Done | `c1aacf3` |
| 11 | Add CMS singletons for four orphan pages (team, community-stories listing, recipes listing, past-retreats listing) | Done | `2729896` |
| 12 | Remove dead `mitzvahProject.steps[]` subfields | Done with one retained subfield, see correction note | `c1aacf3` |
| 13 | Wrap `getRetreats()` in try/catch in `programs/[slug].astro` getStaticPaths | Done | `814b86d` |
| 14 | Annotate stale `*BySlug` claim in April audit doc | Done | `c1aacf3` |

## Correction to the audit

Item 12 listed four `mitzvahProject.steps[]` subfields as dead and slated for deletion: `label`, `description`, `actions`, `tip`. CC's grep before deletion found that `description` is actively seeded by `scripts/seed-mitzvah-page.ts:83` and actively rendered by `src/components/mitzvah/HowItWorks.astro:130`. Only `label`, `actions`, and `tip` were truly dead and were removed. `description` stays.

Methodology lesson worth flagging in any future audit: schema field descriptions that say "Retained for future use. Not currently rendered." are not always accurate. Always grep the page and component code before deleting. Three of four schema descriptions were right; one was wrong.

## CMS scan findings the audit could not see (now resolved or noted)

The 2026-05-18 live CDN scan via Chrome MCP surfaced content-side issues that pure code analysis could not catch:

- `mitzvahProject.heroImage` was unset in Sanity. Seeded in PR #3 (`scripts/seed-mitzvah-hero-image.ts` uploads `public/images/hero/mitzvah-project.jpg`).
- The published `donatePage` and `volunteerPage` documents carried orphan `faqContext` field values even after the schema and seeds dropped them. Cleaned by `scripts/cleanup-ghost-fields.ts` (committed in PR #1, then re-run after `eacff80` to ensure no regression). Script is idempotent.
- Only two testimonials are published in Sanity (`headsup` and `volunteer` contexts). Multiple pages still lean on their hardcoded fallback testimonial arrays. Content task for Belinda, not code work.
- `siteSettings.footerTagline` is null in Sanity. The render fix shipped in PR #1 reads the field but produces no visible footer tagline until Belinda sets a value in Studio.

## What is still open

### Launch blockers (waiting on Belinda)

The three contact and signup forms on the live site currently render placeholder text ("being configured", "check back soon", "Subscribe at launch") because the env vars added in PR #2 are not yet set on Vercel. The values that need to land:

| Vercel env var | Source | Status |
|----------------|--------|--------|
| `PUBLIC_MAILCHIMP_FORM_ACTION` | Belinda's Mailchimp dashboard, Audience > Signup Forms > Embedded > "Naked" embed, the form action URL | Pending |
| `PUBLIC_FORMSPREE_CONTACT_ID` | Confirm with Belinda that the existing `mykopjon` ID belongs to her Formspree account | Pending confirmation |
| `PUBLIC_FORMSPREE_VOLUNTEER_ID` | Confirm with Belinda that the existing `mwvyqbze` ID belongs to her Formspree account; if not, get the correct one | Pending confirmation |

Setting these requires either `vercel env add` via CC, or driving the Vercel dashboard via Claude in Chrome. CC + Vercel CLI is cleaner.

### Belinda content tasks (non-blocking, done in Studio when she has time)

- Set `siteSettings.footerTagline` if she wants a tagline visible above the footer copyright line.
- Add more testimonials to `testimonial` documents to displace the hardcoded fallbacks on `/programs/heads-up`, `/programs/past-retreats`, `/get-involved/volunteer`, `/about/community-stories`, and `src/components/home/ImpactStories.astro`.
- Optional: replace the seeded mitzvah hero image with a final approved photograph (currently uses the fallback `mitzvah-project.jpg`).
- Optional: preview and edit hero text or CTAs on the four newly CMS-driven pages (team, community-stories listing, recipes listing, past-retreats listing) where the seed mirrors the previous hardcoded copy verbatim.

### Tech debt and known frictions

- "All domains" Cowork egress allowlist did not propagate to the sandbox during this conversation even after restart. Workaround: use Claude in Chrome MCP for any external HTTPS access from Cowork. Worth a thumbs-down with screenshot to surface the bug.
- `gh pr merge --delete-branch` partially fails when CC is operating inside a `.claude/worktrees/<name>/` worktree because the parent worktree has `main` checked out. Workaround documented in saved memory: fall back to `git push --delete origin <branch>` after the auto-merge succeeds.
- Files created by Cowork in `/Users/hek/jewmanity/docs/` are not visible to fresh CC worktrees until they are committed. Workaround: either commit the prompt before the CC handoff, or instruct CC to read via absolute path (`/Users/hek/jewmanity/docs/...`).

## Where to pick up next session

The next session's first move depends on Belinda's response. If she has sent values:

1. Confirm the values in chat.
2. CC runs `vercel env add` for each variable in the Production environment.
3. CC triggers `vercel --prod` to redeploy.
4. Live verify the three forms via Chrome MCP against `jewmanity.vercel.app`: confirm `action` attributes resolve to her endpoints, the honeypot name on the Mailchimp form matches `b_<u>_<id>`, and the placeholder text is gone.
5. Send a test submission through each form to confirm Belinda receives it on the receiving end.

If she has not responded yet:

1. Possibly nudge.
2. Otherwise the audit thread is at a natural pause point. Other work (Belinda content tasks above, or unrelated streams like the Givebutter live-mode swap, DNS cutover prep, etc.) can proceed in parallel.

## File index

The complete set of prompts and scripts produced during this audit cycle, all committed to `main`:

- `docs/cms-website-gap-audit-2026-05-18.md` (the source audit)
- `docs/cms-website-gap-audit-prompt.md` (brief that produced the audit)
- `docs/cms-quick-wins-prompt.md` (PR #1 first batch)
- `docs/cms-quick-render-fixes-prompt.md` (PR #1 round 2)
- `docs/cms-orphan-page-singletons-prompt.md` (PR #1 item 11)
- `docs/contact-wiring-env-vars-prompt.md` (PR #2)
- `docs/cms-max-editability-prompt.md` (PR #3)
- `docs/cms-schema-cleanup-prompt.md` (PR #5)
- `scripts/verify-cms-state.mjs` (read-only audit tool, reusable)
- `scripts/cleanup-ghost-fields.ts` (one-off cleanup, idempotent, reusable for future ghost fields)
- `scripts/seed-mitzvah-hero-image.ts` (one-off, run once)
- `scripts/seed-about-team-page.ts`, `scripts/seed-about-community-stories-page.ts`, `scripts/seed-community-recipes-page.ts`, `scripts/seed-programs-past-retreats-page.ts` (four seeds for PR #1 item 11)
