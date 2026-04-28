# Givebutter swap runbook

Step-by-step procedure for executing the Donorbox → Givebutter migration once Belinda delivers real account/widget IDs. The swap-ready scaffold lives on branch `feat/givebutter-migration` (tip: `76ca270`). Production currently runs Donorbox.

---

## Prerequisites — required before starting

Belinda must deliver:

1. **Givebutter account ID** — short alphanumeric string from her Givebutter account profile. Used as the `acct=` query param on the widget script URL.
2. **Givebutter Form widget ID** — alphanumeric ID for the specific Form widget she creates. Visible in the Givebutter dashboard under the form's embed code.
3. **Confirmation that Chai-tier presets are configured** in the Givebutter campaign. Required preset values: `18`, `36`, `180`, `360`, `720`, `1800`. The amounts on the homepage tier cards (`/`) link via `?amount=` and only pre-select correctly if the value matches an existing campaign preset.
4. **Resolved `ASK BELINDA` items** in `docs/givebutter-campaign-config.md` (recurring vs one-time default, custom amount allowed, cover-the-fee toggle, EIN format, confirmation page).

---

## Pre-swap checks

```bash
# 1. Confirm clean working tree on main
git status            # expect: nothing to commit, working tree clean
git log --oneline -3  # confirm current main HEAD

# 2. Confirm the feature branch exists and tip is the WIP commit
git fetch origin
git log --oneline origin/feat/givebutter-migration -3
# expect tip: 76ca270 wip: Givebutter platform migration (placeholder IDs pending Belinda)

# 3. Smoke test the current Donorbox flow in dev — captures "good" baseline
npm run dev
# Visit http://localhost:4321/donate
# Visit http://localhost:4321/donate?amount=180 — Donorbox should pre-select $180
# Stop dev server when done.
```

---

## The swap

```bash
# 1. Check out the feature branch
git checkout feat/givebutter-migration

# 2. Rebase onto current main (branch was created off pre-revert state, so it
#    has diverged; rebase brings it on top of the revert + legal-copy + docs commits)
git rebase main
# If conflicts: most likely in DonateHero.astro (revert and Givebutter both
# touched it) or privacy/terms (revert reintroduced "Donorbox" wording that
# the legal-copy commit then genericified). Resolve by keeping main's
# generic legal copy + Givebutter's widget code; abort and ask if unclear.

# 3. Find the placeholders
grep -n "YOUR_ACCOUNT_ID\|WIDGET_ID" src/components/donate/DonateHero.astro
# Expect two lines: one in the <script src="..."> URL, one on
# <givebutter-widget id="...">.

# 4. Replace placeholders with real values from Belinda
#    DO NOT commit the real IDs in any other file (no env files, no docs).
#    They live only in DonateHero.astro.
```

After replacement, two lines in `src/components/donate/DonateHero.astro` should look like:

```html
<script src="https://widgets.givebutter.com/latest.umd.cjs?acct=<REAL_ACCOUNT_ID>&p=other" async is:inline></script>
<givebutter-widget id="<REAL_WIDGET_ID>"></givebutter-widget>
```

Also remove the two `TODO(belinda)` comment lines above each — they're stale once the real values are in.

---

## Run the test plan in dev

```bash
npm run dev
```

Open `docs/givebutter-test-plan.md` and walk every test in the **Pre-merge (dev)** section. Do not proceed to merge until all dev tests pass.

If any test fails, **stop**. Common failure modes:

- **Widget never renders** → account ID typo, or widget ID mismatch with the form Belinda created. Double-check both against the Givebutter dashboard's embed code.
- **Pre-select doesn't work for `?amount=180`** → preset value missing in the Givebutter campaign. Verify all six Chai presets exist.
- **Widget renders but shows different brand colors than expected** → campaign theme not set. This is a Belinda-side dashboard fix, not a code fix.

---

## Merge and deploy

```bash
# 5. Push feature branch
git push origin feat/givebutter-migration

# 6. Open a PR against main; review the diff one last time to confirm
#    the only changes vs main are:
#    - DonateHero.astro: Donorbox iframe -> Givebutter widget with real IDs
#    - Layout.astro: preconnect URL swap to widgets.givebutter.com

# 7. Merge to main (fast-forward or squash, your call)
# 8. Vercel auto-rebuilds; wait ~2 min
```

---

## Production verification

After Vercel rebuild, run the **Post-merge (production)** section of `docs/givebutter-test-plan.md`. Specifically:

- Hit `https://jewmanity.vercel.app/donate` (or `https://jewmanity.com/donate` if DNS has been cut over to Vercel by the time of the swap).
- Confirm Givebutter widget renders interactively.
- Run all tier-card and `?amount=` URL tests against production.
- Belinda runs a $1 test donation in Givebutter test mode to confirm end-to-end donation flow + Stripe receipt.

---

## Privacy/terms reconciliation

Privacy and terms are already vendor-neutral as of commit `5ea08ea` ("fix(legal): generic donation-processor language"). **No legal copy changes needed for the swap.** This is by design — the genericification commit was made specifically so future processor migrations don't require legal-copy edits.

If Belinda *prefers* the legal copy to name Givebutter explicitly post-swap (some 501(c)(3) compliance reviewers like vendor-named disclosures), edit `src/pages/privacy.astro:22,41` and `src/pages/terms.astro:33` to reintroduce the vendor name. This is a presentation choice, not a legal requirement.

---

## Rollback plan

If the Givebutter widget fails to load on production after merge:

```bash
# Find the merge commit hash
git log --oneline -5 main

# Revert it
git revert -m 1 <MERGE_COMMIT_HASH>
git push origin main
```

`-m 1` tells `git revert` to keep main's first parent (the pre-merge state) — necessary for reverting a merge commit. Vercel rebuilds back to Donorbox within ~2 min.

The feature branch is preserved on `origin/feat/givebutter-migration` regardless of how many times we revert.

---

## Lessons learned (for future processor migrations)

- WIP commits with placeholder IDs **never** land on `main`. The `feat/givebutter-migration` branch is the right place for in-flight work. Even if the canonical domain isn't pointed at Vercel yet, every Vercel deploy is publicly URL-accessible.
- Legal copy went vendor-neutral after this incident specifically so future swaps don't require coordinated copy + code changes.
