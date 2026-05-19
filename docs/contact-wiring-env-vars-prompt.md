# Prompt: Move Formspree and Mailchimp wiring to env vars

Hand this to Claude Code from inside `/Users/hek/jewmanity`. Estimate 30 minutes.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead.

---

## Why

CC's end-to-end test pass on 2026-05-18 surfaced that the Mailchimp signup form on the homepage submits to a HEKDesigns audience (`u=63c97041047a0d6a6e1c61091&id=728dc5cdc2`), not a Jewmanity audience. The Formspree IDs for contact and volunteer (`mykopjon`, `mwvyqbze`) also need verification that they route to Belinda. Patching the strings inline is the wrong fix because the same bug class can recur on every credential swap. Move all three wirings to environment variables so the values live in `.env` (not committed) and Vercel env vars (production), and the code references stay clean.

This is exactly the pattern `PUBLIC_SNIPCART_API_KEY` already uses in `src/layouts/Layout.astro:29`. Mirror it.

---

## Scope

Three component files plus `.env.example`:

- `src/components/contact/ContactForm.astro`
- `src/components/volunteer/VolunteerForm.astro`
- `src/components/home/Newsletter.astro`
- `.env.example`

No other files should change.

---

## Fix 1: Contact form

File: `src/components/contact/ContactForm.astro`, line 20.

Today: `action="https://formspree.io/f/mykopjon"` hardcoded.

In the frontmatter block at the top, read the env var:

```ts
const formId = import.meta.env.PUBLIC_FORMSPREE_CONTACT_ID;
const isConfigured = !!formId && formId !== 'your_formspree_form_id_for_contact_form';
const actionUrl = isConfigured ? `https://formspree.io/f/${formId}` : '';
```

Then replace the hardcoded action with `{actionUrl}` and conditionally render the form. If unset, render a centered notice in place of the form:

```astro
{isConfigured ? (
  <form id="contact-form-el" action={actionUrl} method="POST" class="mt-10 space-y-6">
    {/* existing form contents unchanged */}
  </form>
) : (
  <p class="mt-10 text-center font-body text-sm text-text-muted">
    The contact form is being configured. Please email us at the address shown on this page or check back soon.
  </p>
)}
```

Keep all existing form fields, validation, and submit handler logic. The only change is the wrapper conditional and the dynamic action URL.

---

## Fix 2: Volunteer form

File: `src/components/volunteer/VolunteerForm.astro`, line 25.

Same pattern as Fix 1. Use env var `PUBLIC_FORMSPREE_VOLUNTEER_ID`. Placeholder check string is `'your_formspree_form_id_for_volunteer_form'`. Fallback message wording:

```
The volunteer application form is being configured. Please check back soon or reach out via the contact page.
```

---

## Fix 3: Mailchimp newsletter

File: `src/components/home/Newsletter.astro`, lines 23 and 40.

Today: action URL hardcoded with `u=` and `id=` query params, plus a honeypot input whose `name` is `b_<u>_<id>`. The honeypot must match the form's `u` and `id` or Mailchimp may reject the submission as spam.

Use a single env var that captures the entire form action URL. This is what Belinda will be able to copy directly from her Mailchimp embed code without needing to understand which piece is which.

```ts
const formAction = import.meta.env.PUBLIC_MAILCHIMP_FORM_ACTION;

let isConfigured = false;
let honeypotName = '';

if (formAction && formAction !== 'your_mailchimp_form_action_url') {
  try {
    const url = new URL(formAction);
    const userId = url.searchParams.get('u');
    const listId = url.searchParams.get('id');
    if (userId && listId) {
      isConfigured = true;
      honeypotName = `b_${userId}_${listId}`;
    }
  } catch {
    // Invalid URL, leave isConfigured false.
  }
}
```

Then conditionally render the form using `formAction` for the `action` attribute and `honeypotName` for the hidden honeypot input's `name`. When unset, render a centered placeholder in place of the form:

```
Newsletter signup is being configured. Subscribe at launch.
```

Keep the heading, description, and Privacy Policy line outside the conditional so the section structure stays consistent whether the form renders or not.

---

## Fix 4: `.env.example`

File: `.env.example`. Today it has 6 lines. Add three new entries after the existing `SANITY_API_TOKEN` line:

```
# Formspree form IDs. Get from formspree.io/forms after creating each form.
# These appear in the form action URL: https://formspree.io/f/<form_id>
PUBLIC_FORMSPREE_CONTACT_ID=your_formspree_form_id_for_contact_form
PUBLIC_FORMSPREE_VOLUNTEER_ID=your_formspree_form_id_for_volunteer_form

# Mailchimp signup form action URL. Get from your Mailchimp dashboard:
# Audience > Signup Forms > Embedded Forms > "Naked" embed. Copy the
# action="..." URL from the resulting HTML and paste it here verbatim.
# The honeypot field name is derived automatically from the u= and id=
# parameters in this URL.
PUBLIC_MAILCHIMP_FORM_ACTION=your_mailchimp_form_action_url
```

Do not modify `.env` itself; the user maintains that file and may already have real values to fill in.

---

## Verification

1. `npm run build`. Must succeed with zero TS errors.

2. With env vars unset (`.env` deleted or vars commented out), open the rendered `dist/get-involved/contact/index.html`, `dist/get-involved/volunteer/index.html`, and `dist/index.html`. Each should show the configured-placeholder message, not a broken form.

3. With env vars set to placeholder strings (`your_formspree_form_id_for_contact_form` etc.), same result: placeholder message, not a broken form. The string-equality check is the safety net against `.env.example` getting copied to `.env` without editing.

4. With env vars set to real values (the existing `mykopjon`, `mwvyqbze`, and the existing Mailchimp action URL), all three forms render exactly as they do today on `main`. Visual diff should be zero.

5. `git diff` shows changes to exactly four files: the three .astro components plus `.env.example`. No other files modified.

---

## Commit, push, PR

One commit on `great-volhard-b7c625` (the same branch as the CMS work). After CI passes, merge to main via auto-merge.

Commit message:

```
refactor(forms): move Formspree and Mailchimp wiring to env vars

E2E test pass on 2026-05-18 surfaced that the Mailchimp signup form
points at a HEKDesigns audience instead of a Jewmanity one. Also flagged
ambiguity on the volunteer Formspree ID. Move all three credential
strings out of source and into PUBLIC_* env vars so the values live in
.env (not committed) and Vercel env vars (production), eliminating this
class of bug.

Pattern mirrors the existing PUBLIC_SNIPCART_API_KEY wiring in
src/layouts/Layout.astro.

New env vars (see .env.example for placeholders):
- PUBLIC_FORMSPREE_CONTACT_ID
- PUBLIC_FORMSPREE_VOLUNTEER_ID
- PUBLIC_MAILCHIMP_FORM_ACTION

When unset or left at placeholder values, the affected form renders a
"being configured" notice instead of a broken POST target.

Follow-up: Belinda needs to provide her real Mailchimp action URL plus
confirm receipt on the Formspree forms before launch. Until those
values land in Vercel env vars, the production forms will fall to the
placeholder notice.
```

After commit:

```
git push
gh pr create --title "refactor(forms): move Formspree and Mailchimp wiring to env vars" --body "$(cat <<'EOF'
E2E test pass on 2026-05-18 surfaced that the Mailchimp signup form on the
homepage submits to a HEKDesigns audience instead of a Jewmanity one. The
Formspree IDs for contact and volunteer also need verification that they
route to Belinda.

This PR moves all three credential strings out of source and into PUBLIC_
env vars, mirroring the existing PUBLIC_SNIPCART_API_KEY pattern. The
values now live in .env (not committed) and Vercel env vars (production),
eliminating this class of bug.

Files changed:
- src/components/contact/ContactForm.astro
- src/components/volunteer/VolunteerForm.astro
- src/components/home/Newsletter.astro
- .env.example

New env vars (placeholders in .env.example):
- PUBLIC_FORMSPREE_CONTACT_ID
- PUBLIC_FORMSPREE_VOLUNTEER_ID
- PUBLIC_MAILCHIMP_FORM_ACTION

When unset or left at placeholder values, the form renders a "being
configured" notice instead of a broken submission target.

Verification: build clean, zero TS errors. Forms render identically to
main when env vars are set to current production values.

After merge, the local .env and Vercel env vars need to be updated with
Belinda's real Mailchimp action URL (the current value points to
HEKDesigns) and her Formspree IDs confirmed.
EOF
)"
gh pr merge --auto --squash --delete-branch
```

`--auto` waits for CI. `--squash` keeps `main`'s log compact. `--delete-branch` cleans up the remote feature branch after merge.

---

## Out of scope for this PR

- The round-2 CMS render fixes (`docs/cms-quick-render-fixes-prompt.md`, footerTagline and related recipes). Still queued. Different concern, separate PR.
- Belinda outreach for the actual Mailchimp credentials. Cowork will handle the message draft separately.
- Updating Vercel production env vars. That is a `vercel env add` step or a click in the Vercel dashboard. Needs the real values from Belinda first.
- The pre-launch checklist update marking C7 as in-progress. Belongs to whoever maintains that doc.
