# Givebutter campaign config — for Belinda

Campaign settings to configure in the Givebutter dashboard before the swap. The Form widget's settings here must match what the codebase expects so URL-param pre-select works and donor-collected data is consistent with what Donorbox is collecting today.

Items marked **ASK BELINDA** are decisions that need a human answer; do not assume.

---

## Donation amount presets — required

The homepage tier cards (`src/components/home/DonationCTA.astro`) deep-link to `/donate?amount=X` for the four primary tiers. Givebutter's URL-param pre-select only works if the value exactly matches an existing preset on the campaign.

**Required preset list:**

| Amount | Suggested label | Source |
|---|---|---|
| $18 | Chai | Hebrew word for "life" — value 18 |
| $36 | Double Chai | 18 × 2 |
| $180 | Chai × 10 | Long-standing Jewish-tradition tier |
| $360 | Double Chai × 10 | Long-standing Jewish-tradition tier |
| $720 | Chai × 40 | Listed but no homepage card |
| $1,800 | Chai × 100 | Listed but no homepage card |

Labels are nice-to-have; what matters is that the **numeric values are exactly `18`, `36`, `180`, `360`, `720`, `1800`** with no decimals, no commas, no currency symbols. Givebutter URL-param matching is strict.

The four amounts wired to homepage tier cards today are `18`, `36`, `180`, `360`. If you add `720` and `1800` to the campaign but want them on the homepage too, that's a separate code change to `DonationCTA.astro` — flag and we'll add a tier card.

---

## Recurring vs one-time

Donorbox today defaults to one-time (`?default_interval=o`). 

- **ASK BELINDA:** Should Givebutter offer both monthly and one-time? Default to one-time?
- **ASK BELINDA:** If recurring is offered, does Belinda want a monthly-only option, or the full recurring menu (weekly/monthly/quarterly/yearly)?

---

## Custom amount

Donorbox today allows custom amounts (the iframe shows a "Other" / "Custom" option below the presets).

- **ASK BELINDA:** Should the Givebutter form allow custom amounts? Recommended yes (matches current Donorbox behavior, lets donors give whatever they want).
- **ASK BELINDA:** If yes — minimum allowed? ($1? $5? $18?) Recommend matching whatever Donorbox is enforcing today.

---

## Cover-the-fee toggle

Givebutter has a "donor covers fees" checkbox option that adds the credit-card processing fee on top of the donation amount.

- **ASK BELINDA:** Enable cover-the-fee? Default checked or unchecked?
- Note: with the cover-the-fee toggle enabled and Givebutter's 0% platform fee + tip model, ~98%+ of donations net to Jewmanity. Worth confirming Belinda has chosen the 0%-platform-fee plan in her account.

---

## Required donor fields

Read off `DonateHero.astro:36-52` (the current Donorbox iframe) — the Donorbox campaign collects whatever fields are configured in the Donorbox dashboard, which we cannot inspect from here. To ensure parity:

- **Manual step for Belinda:** Open Donorbox dashboard → Campaign `jewmanity-donation` → "Form Fields" or equivalent. Note which fields are marked Required.
- Replicate the same Required/Optional flags in Givebutter Form > Form Fields.

Common minimum set (likely current state, but please confirm):
- Name (required)
- Email (required)
- Donation amount (required, comes from preset/custom selector)
- Comments / message (optional)

- **ASK BELINDA:** Confirm exact field list against the Donorbox campaign before the swap.

---

## Tax receipt settings

Jewmanity is a 501(c)(3); donations are tax-deductible. Receipts are required.

- **Auto-issue receipts after each donation:** YES — match Donorbox behavior.
- **Receipt should include:**
  - Jewmanity's 501(c)(3) EIN
  - Donation amount, date
  - "No goods or services were provided in exchange for this contribution" boilerplate
  - Belinda's contact email for receipt corrections

- **ASK BELINDA:** What is the EIN format Givebutter expects? US EINs are formatted `XX-XXXXXXX` (two digits, hyphen, seven digits). Confirm the EIN string Belinda enters in the Givebutter dashboard receipt template.
- **ASK BELINDA:** Does Belinda want the receipt to come from a `info@jewmanity.com`-style address (preferred — looks more official) or from Givebutter's default receipt sender?

---

## Confirmation page / thank-you

After a donor completes a donation, Givebutter can either:
1. Show its own thank-you page (default — donor stays on Givebutter), or
2. Redirect to a Jewmanity URL (e.g., `/thank-you` if we build one).

Donorbox today uses option 1 (default).

- **ASK BELINDA:** Stay on Givebutter's confirmation page (simplest), or redirect back to a Jewmanity page?
- If redirect: target URL must exist before the swap. If we don't have a `/thank-you` page yet, we'd build one as part of the swap — flag and we'll scope.

---

## Branding / theme

Donorbox today uses primary color `#3783A3` (Jewmanity teal — set in the Donorbox dashboard, not in code).

- **Must do in Givebutter dashboard:** Campaign > Design > Primary color → `#3783A3`.
- Match button text and accent colors to Jewmanity's design tokens (see `CLAUDE.md` Design Tokens section for hex values).
- Logo upload: Jewmanity logo at `public/images/logo.png` if Givebutter wants a campaign-level logo.

This is presentation-level and won't break functionality, but it'll feel jarring to donors if the embedded widget shows Givebutter's default purple-ish theme.

---

## Domain / DNS interaction

Note: as of 2026-04-28, `jewmanity.com` runs the old Squarespace site (where real donors are today) and DNS hasn't been pointed at Vercel. The current production-accessible Vercel URL is `jewmanity.vercel.app`. Givebutter doesn't typically care which domain embeds the widget, but if Givebutter has any allowed-origin / referrer settings, ensure both `jewmanity.vercel.app` and `jewmanity.com` are in the allowlist before the DNS cutover.

- **ASK BELINDA:** Does Givebutter campaign have allowed-origin restrictions? If so, add `jewmanity.vercel.app` and `jewmanity.com`.

---

## Summary checklist for Belinda

Before delivering account ID + widget ID for the swap:

- [ ] Six Chai presets configured: `18`, `36`, `180`, `360`, `720`, `1800` (exact integers)
- [ ] Recurring menu decided (ASK BELINDA item)
- [ ] Custom amount setting decided (ASK BELINDA item)
- [ ] Cover-the-fee setting decided (ASK BELINDA item)
- [ ] Donor field list matches current Donorbox campaign (ASK BELINDA to verify)
- [ ] Receipt template has correct EIN, sender, boilerplate (ASK BELINDA items)
- [ ] Confirmation page / redirect choice made (ASK BELINDA item)
- [ ] Primary color set to `#3783A3` in campaign theme
- [ ] Allowed-origin allowlist (if applicable) includes both Vercel and canonical domains
- [ ] Account ID and widget ID delivered to Hek for the code swap
