# Phase 2: Integrations

## What I checked

1. `grep -rn "givebutter\|Givebutter\|GIVEBUTTER" src/`
2. `grep -rn "donorbox\|Donorbox\|DONORBOX" src/`
3. `grep -rn "YOUR_ACCOUNT_ID\|WIDGET_ID\|TODO(belinda)" src/`
4. `cat src/components/donate/DonateHero.astro`
5. `cat src/layouts/Layout.astro` (preconnects + Snipcart)
6. `cat src/pages/privacy.astro`, `src/pages/terms.astro`, `src/pages/nonprofit-disclosures.astro`
7. `grep -rn "snipcart" src/`
8. `grep -rn "formspree" src/` and form `action=` attrs
9. `grep -rn "mailchimp\|list-manage" src/`
10. `cat src/lib/sanity.ts` (client config)
11. `cat vercel.json`, `cat astro.config.mjs`

---

## 1. Donation platform (Donorbox vs Givebutter)

### Evidence

`src/components/donate/DonateHero.astro:36-55`:
```html
<!-- Right: Givebutter donation widget -->
<!-- Note: Widget color/branding is set in the Givebutter dashboard (Campaign > Design). Platform fee mode (0% + donor tips, or 3% flat + Stripe) is also chosen per-campaign in the dashboard, not here. -->
<div class="w-full max-w-[440px] lg:w-1/2">
  <!-- TODO(belinda): replace YOUR_ACCOUNT_ID with the real Givebutter account ID once the account is created. -->
  <script src="https://widgets.givebutter.com/latest.umd.cjs?acct=YOUR_ACCOUNT_ID&p=other" async is:inline></script>
  <!-- TODO(belinda): replace WIDGET_ID with the real Givebutter Form widget ID from the dashboard. -->
  <givebutter-widget id="WIDGET_ID"></givebutter-widget>
  <script is:inline>
    (function () {
      // TODO(verify-givebutter-url-param): Givebutter docs use `amount` to pre-select a preset donation amount (value must match an existing preset on the campaign). The widget may read window.location.search natively; this script also sets the attribute on the element for defense-in-depth.
      var params = new URLSearchParams(window.location.search);
      var amount = params.get('amount');
      if (amount && /^\d+$/.test(amount)) {
        var widget = document.querySelector('givebutter-widget');
        if (widget) {
          widget.setAttribute('amount', amount);
        }
      }
    })();
  </script>
</div>
```

`src/layouts/Layout.astro:66-67`:
```html
<!-- Givebutter preconnect -->
<link rel="preconnect" href="https://widgets.givebutter.com" />
```

Grep for `donorbox` (all variants) across `src/`:
```
(zero hits)
```

`src/pages/privacy.astro:22,41`:
```
<li>Donation information processed through our third-party donation platform (Givebutter)</li>
...
<li><strong>Givebutter</strong> for donation processing (see Givebutter Privacy Policy)</li>
```

`src/pages/terms.astro:32-35`:
```
All donations made through our website are voluntary and processed by Givebutter, our third-party payment
processor. Donations to Jewmanity are tax-deductible to the fullest extent allowed by law. Refund requests for
donations should be directed to <a href="mailto:info@jewmanity.org">info@jewmanity.org</a>.
```

`src/pages/nonprofit-disclosures.astro`: does not mention Donorbox or Givebutter by name.

### State of this integration
- **Platform on HEAD: Givebutter.** Donorbox is completely gone from `src/` — zero references.
- **Live status: PLACEHOLDER.** The widget script has the literal strings `YOUR_ACCOUNT_ID` and `WIDGET_ID`. These are TODOs tagged for Belinda. Until real IDs land, the donation widget will fail to load with real content.
- **Code path, preconnect, and legal copy are internally consistent** — all three reference Givebutter. Prior audit concern about Donorbox leftovers is fully resolved.
- **URL-param pre-select**: widget supports `?amount=<int>` via an inline script that mirrors the query param to the `amount` attribute. Comment labels this "TODO(verify-givebutter-url-param)" — behavior not yet confirmed against Givebutter's actual widget API.

### Manual steps remaining for production cutover
- [ ] Create Givebutter account for Jewmanity (Belinda)
- [ ] Create Campaign + Form widget in Givebutter dashboard; choose platform fee mode (0% + donor tips vs 3% flat + Stripe)
- [ ] Set campaign branding (colors, logo) in the Givebutter dashboard
- [ ] Define preset donation amounts in the Campaign (must match `?amount=` values used by homepage donation cards)
- [ ] Replace `YOUR_ACCOUNT_ID` on line 40 with real account ID
- [ ] Replace `WIDGET_ID` on line 42 with real Form widget ID
- [ ] Verify `?amount=` preset behavior end-to-end with a real Campaign
- [ ] Remove the TODO comments after values land
- [ ] Confirm homepage donation-card query params match Campaign preset amounts

---

## 2. Snipcart (e-commerce)

### Evidence

`src/layouts/Layout.astro:90-95`:
```html
<!-- Snipcart E-Commerce -->
<link rel="preconnect" href="https://app.snipcart.com" />
<link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css" />
<script async src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js"></script>
<div hidden id="snipcart" data-api-key="YzI4MTdlM2YtN2U2NS00YTIxLWE1NGUtNWUwOTU3YzFhZjJkNjM5MDk2MjU4MDY4MDc3ODg1" data-config-modal-style="side"></div>
<!-- NOTE: This is the TEST API key. Switch to live key before production deployment. -->
```

Other Snipcart integration points:
```
src/components/shop/ProductCard.astro:31    class="snipcart-add-item …"
src/components/shop/ProductDetail.astro:147 class="snipcart-add-item …"
src/pages/shop.astro:13                     id: p.snipcartId || p.slug?.current || p._id,
src/pages/shop/[slug].astro:109             const productId = cmsProduct?.snipcartId || fallback.id;
src/lib/sanity.ts:138                       snipcartId, // in getProducts projection
src/lib/sanity.ts:156                       snipcartId, // in getProductBySlug projection
```

### State of this integration
- **Live status: TEST MODE.** The `data-api-key` on Layout.astro:94 begins with `YzI4…` (base64-decoded: `c2817e3f-7e65-4a21-a54e-5e0957c1af2d63909625806807788...` — a standard Snipcart test key format, which is also explicitly confirmed by the inline comment on line 95: "This is the TEST API key. Switch to live key before production deployment.").
- Snipcart theme version hard-pinned at `v3.7.1`.
- Product-to-Snipcart-SKU mapping flows through Sanity's `product.snipcartId` field.

### Manual steps remaining for production cutover
- [ ] Create Snipcart LIVE account + subscribe to a plan
- [ ] Configure Snipcart dashboard: payment gateway (Stripe), shipping, tax (CA)
- [ ] Mirror product catalog in Snipcart backoffice (or configure JSON-LD parsing — current `snipcart-add-item` buttons rely on Snipcart crawling the rendered HTML)
- [ ] Replace TEST API key at `Layout.astro:94` with LIVE public key
- [ ] Remove the "TEST API key" comment on line 95 once swapped
- [ ] Test checkout end-to-end with a real card before launch

---

## 3. Formspree

### Evidence

`src/components/contact/ContactForm.astro:20`:
```html
action="https://formspree.io/f/xlgpvpja"
```

`src/components/volunteer/VolunteerForm.astro:25`:
```html
action="https://formspree.io/f/xlgpvpja"
```

`grep -rn "FORMSPREE_ID" src/ scripts/ sanity/schemas` → **zero hits**.

Privacy copy reference: `src/pages/privacy.astro:43`:
```
<li><strong>Formspree</strong> for form submissions (see Formspree Privacy Policy)</li>
```

### State of this integration
- **Live status: HARDCODED FORM ID.** Both forms POST to the same Formspree form ID `xlgpvpja` — that is, contact messages and volunteer applications land in **the same inbox**, indistinguishable except by `_subject: "New Volunteer Application"` and the selected `subject` field.
- **The `FORMSPREE_ID` env var listed in `.env.example` is never read anywhere.** It's documentation debt; the form IDs are hardcoded in the components.
- Both forms have `_gotcha` honeypot fields and an async `fetch` override that shows success/error banners without navigation.
- Volunteer form also sets `_subject: "New Volunteer Application"`.

### Manual steps remaining for production cutover
- [ ] Confirm form ID `xlgpvpja` belongs to the right Formspree account (Belinda's, presumably) and is on a paid plan sufficient for real volume
- [ ] Decide: keep single form ID for both, or split contact vs volunteer into two separate form IDs for clean inbox triage
- [ ] If splitting: replace the shared ID and delete `.env.example` `FORMSPREE_ID` line (or actually wire it via `import.meta.env`)
- [ ] Alternatively: replace hardcoded form IDs with `import.meta.env.FORMSPREE_ID` reads so the var is actually live
- [ ] Configure reCAPTCHA / rate limits in Formspree dashboard
- [ ] Test submission end-to-end

---

## 4. Mailchimp (newsletter)

### Evidence

`src/components/home/Newsletter.astro:23`:
```html
<form method="POST" action="https://gmail.us13.list-manage.com/subscribe/post?u=63c97041047a0d6a6e1c61091&id=728dc5cdc2&f_id=0008a0e0f0" target="_blank" class="mx-auto flex max-w-[450px]">
```

Hidden honeypot (line 39-41):
```html
<div aria-hidden="true" style="position: absolute; left: -5000px;">
  <input type="text" name="b_63c97041047a0d6a6e1c61091_728dc5cdc2" tabindex="-1" value="" />
</div>
```

### State of this integration
- **Live status: WIRED to a real-looking Mailchimp list.**
- List owner: the `gmail` subdomain on `list-manage.com` indicates this is the legacy Mailchimp account that was previously hooked to a personal Gmail account. User ID `u=63c97041047a0d6a6e1c61091` and list ID `id=728dc5cdc2`.
- Form opens in a new tab (`target="_blank"`) to Mailchimp's default hosted confirmation page — no inline success message.
- Honeypot name matches the convention `b_<userid>_<listid>`, which is Mailchimp-generated.
- Not referenced anywhere in legal copy (privacy.astro lists Givebutter, Snipcart, Formspree, Vercel — no mention of Mailchimp as a third-party data processor).

### Manual steps remaining for production cutover
- [ ] Confirm list ownership: is the account `u=63c97041047a0d6a6e1c61091` the Jewmanity nonprofit's or a personal Gmail address? If personal, migrate to org-owned Mailchimp account.
- [ ] Verify the list still exists and is tagged for org double-opt-in compliance
- [ ] Add Mailchimp to privacy policy third-party list
- [ ] Consider replacing `target="_blank"` + Mailchimp hosted confirmation with AJAX + inline success banner (matches patterns used by contact/volunteer forms)

---

## 5. Sanity

### Evidence

`src/lib/sanity.ts:1-10`:
```ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

`sanity/sanity.config.ts`:
```ts
projectId: '9pc3wgri',
dataset: 'production',
```

### State of this integration
- **Live status: LIVE / production dataset, read-only from the Astro site.**
- `useCdn: true` — the Astro build reads from Sanity's CDN at build time (content is static).
- **No auth token** passed to the client → public dataset reads only. All write operations happen via seed scripts using `SANITY_API_TOKEN` / `SANITY_WRITE_TOKEN`.
- Studio is hardcoded to `projectId: '9pc3wgri'` / `dataset: 'production'`.

### Manual steps remaining for production cutover
- [ ] Rotate `SANITY_API_TOKEN` if it was shared during dev (per persistent memory from prior audit, the token was handed around across sessions)
- [ ] Verify Sanity → Vercel webhook: does publishing content in Studio trigger a Vercel redeploy? If not, content changes won't reach the live site without a manual deploy
- [ ] Confirm Studio is deployed and accessible at its hosted URL (see `48b483f chore(sanity): set studioHost for production studio deploy`)

---

## 6. Vercel

### Evidence

`vercel.json`:
```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jewmanity.org',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
```

### State of this integration
- **Live status: Static build, no SSR adapter.** No `@astrojs/vercel` adapter, no `output: 'server'`, no API routes in `src/pages/api/` (confirmed in Phase 7).
- `site: 'https://jewmanity.org'` drives canonical URL building in `Layout.astro` and the sitemap plugin.
- `vercel.json` is minimal — no env-var gating, no custom headers, no redirects/rewrites.

### Manual steps remaining for production cutover
- [ ] Ensure Vercel project has `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` env vars set (both have hardcoded fallbacks, so redeploy is safe even if missing — but making them explicit is worth it)
- [ ] Point `jewmanity.org` DNS to the Vercel project
- [ ] Configure Sanity → Vercel deploy hook (see Sanity section above)
- [ ] Decide on custom security headers (CSP, HSTS) — none currently in `vercel.json`
