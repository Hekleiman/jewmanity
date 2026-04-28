# Givebutter test plan

Concrete clickable test list for the post-swap migration. Run in two passes:

- **Pre-merge (dev):** local `npm run dev` against `localhost:4321` with the real Givebutter IDs in `DonateHero.astro`. All tests must pass before merging the feature branch.
- **Post-merge (production):** against the live Vercel URL after the merge + Vercel rebuild.

Both passes use the same checklist; only the URL prefix differs.

---

## Test environment

- **Dev:** `http://localhost:4321`
- **Production:** `https://jewmanity.vercel.app` (until canonical-domain DNS cutover)
- Browser: Chrome or Safari, latest. DevTools open from the start so console errors and Network requests are captured live.

---

## 1. Homepage tier cards → donate page pre-select

Click each of the 4 preset cards on the homepage (`/`). Each lands on `/donate?amount=X` with the matching Chai value, and the Givebutter widget should pre-select that preset.

- [ ] Click `$18 Chai` card → URL becomes `/donate?amount=18`, widget shows $18 selected
- [ ] Click `$36 Double Chai` card → URL becomes `/donate?amount=36`, widget shows $36 selected
- [ ] Click `$180 Chai × 10` card → URL becomes `/donate?amount=180`, widget shows $180 selected
- [ ] Click `$360 Double Chai × 10` card → URL becomes `/donate?amount=360`, widget shows $360 selected

If pre-select fails for one specific amount, that preset is missing from the campaign — confirm with Belinda. If pre-select fails for *all* amounts, the URL-param patcher (`DonateHero.astro:53-65`) is broken — check console.

---

## 2. Direct URL pre-select

Open each URL fresh in a new tab. Confirm the widget shows the matching preset selected on first paint.

- [ ] `/donate?amount=18` → $18 preset selected
- [ ] `/donate?amount=36` → $36 preset selected
- [ ] `/donate?amount=180` → $180 preset selected
- [ ] `/donate?amount=360` → $360 preset selected
- [ ] `/donate?amount=720` → $720 preset selected (no homepage card, but campaign should have this preset)
- [ ] `/donate?amount=1800` → $1,800 preset selected (no homepage card)

---

## 3. Custom (non-preset) amount

- [ ] `/donate?amount=99` — open URL, observe widget behavior. **Expected:** depends on Givebutter's policy when the URL param doesn't match any preset. Likely outcomes: (a) widget pre-fills custom-amount field with `99`, (b) widget falls back to default selection and ignores `99`, or (c) widget rejects the param. **Document whichever happens** — that's the de-facto behavior we're shipping.
- [ ] `/donate?amount=0.50` — non-integer. The URL-param patcher's `/^\d+$/` regex rejects this on the client side — patcher should not call `iframe.src` mutation, widget loads with no preset. Confirm.
- [ ] `/donate?amount=abc` — non-digit. Same as above — patcher rejects, widget loads with no preset.

---

## 4. No `?amount=` param

- [ ] `/donate` (no query string) — widget loads with no preset selected. Default-selected tier (if any) is whatever Belinda configured as the campaign default in the dashboard.

---

## 5. Mobile rendering

Resize DevTools to 375px viewport (iPhone SE / iPhone 13 mini) or use a real phone.

- [ ] Widget renders within the donate-hero column without overflowing horizontally
- [ ] Buttons inside the widget are tap-target-sized (≥44px)
- [ ] Hero text ("Give Today. Create Lasting Impact.") doesn't collide with widget
- [ ] Tier cards on `/` are tappable; clicking a tier card lands on `/donate?amount=X` and pre-select still works

---

## 6. One-time vs recurring toggle (if recurring enabled)

Only run this section if Belinda's campaign config enables recurring donations.

- [ ] Toggle from one-time → monthly: widget UI updates without page reload, amount field stays populated
- [ ] Default tab on first load matches the campaign default (per `givebutter-campaign-config.md`'s ASK BELINDA decision)
- [ ] URL `?amount=X` pre-select works when the recurring tab is active too (not just one-time)

---

## 7. End-to-end test donation ($1)

This requires Belinda's involvement — a real Givebutter test-mode donation through the live Givebutter sandbox.

- [ ] Belinda enters Givebutter test mode in the campaign settings (or uses Givebutter's documented test card numbers)
- [ ] Run a $1 donation on the live `/donate` page using a test card (e.g., Stripe's `4242 4242 4242 4242`)
- [ ] Donation completes without error
- [ ] Stripe receipt arrives at Belinda's configured receipt email within 1–2 minutes
- [ ] Receipt contains: amount ($1), date, Jewmanity 501(c)(3) EIN, "no goods or services" boilerplate
- [ ] Funds appear in Givebutter dashboard under the campaign (test mode shows separately from live)
- [ ] Switch campaign back from test → live mode after the test passes

---

## 8. CSP / preconnect / network

DevTools → Network tab, hard reload the page.

- [ ] First request to `widgets.givebutter.com` is the widget JS — completes with status 200, not blocked
- [ ] Preconnect link `<link rel="preconnect" href="https://widgets.givebutter.com">` is in the HTML head (verify in Elements tab)
- [ ] Zero requests to `donorbox.org` (those should all be gone post-swap)
- [ ] DevTools Console: no CSP errors, no "Refused to load" errors, no failed widget script loads, no unhandled promise rejections from the widget

If you see CSP errors, the project doesn't currently have a CSP header set, so this is more about confirming nothing's misbehaving than confirming a policy. If the widget script fails to load on production but works in dev, suspect a Vercel security header conflict.

---

## 9. Privacy / terms consistency

After the swap, confirm legal copy is still consistent with what the live page does.

- [ ] `/privacy` says "third-party donation platform" (vendor-neutral, no specific name) — should match commit `5ea08ea`
- [ ] `/terms` says "our third-party payment processor" (vendor-neutral) — should match commit `5ea08ea`
- [ ] If Belinda decided to name Givebutter explicitly post-swap, confirm both pages now say "Givebutter" wherever appropriate

---

## 10. Sanity check on the rollback path

Just confirm the rollback works *before* you trust the merge.

- [ ] Note the merge-commit hash from `git log --oneline -3 main`
- [ ] On a separate branch (`git checkout -b rollback-test`), run `git revert -m 1 <MERGE_HASH>` to confirm the revert applies cleanly
- [ ] `git checkout main && git branch -D rollback-test` to throw away the test branch

This is preventative — no production change. You're just confirming the revert command would work if needed.

---

## Pass criteria

All sections 1–9 pass on production. Section 10 passes locally. If any section fails, **do not declare the swap complete** — fix or roll back.
