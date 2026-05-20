# Prompt: Set Formspree env vars on Vercel and redeploy

Hand this to Claude Code from inside `/Users/hek/jewmanity`. Quick task, about 5 minutes.

The Formspree refactor in PR #2 (`eacff80`) moved the two form IDs out of source and into env vars. They're not set on Vercel yet, so the live contact and volunteer forms currently render the "being configured" placeholder. This prompt sets the two values, redeploys, and verifies.

Newsletter (Mailchimp) is intentionally out of scope; we do not yet have Belinda's Mailchimp action URL. Newsletter stays in placeholder mode until that lands.

---

## Values

```
PUBLIC_FORMSPREE_CONTACT_ID = mykopjon
PUBLIC_FORMSPREE_VOLUNTEER_ID = mwwyabze
```

**Important ambiguity about the volunteer ID.** The original code had `mwvyqbze`. The user typed `mwwyabze` (two characters different: `w↔v` at position 3 and `a↔q` at position 5). The user has not explicitly resolved which is correct. Both ARE syntactically valid Formspree IDs; the question is which one points to the right account.

Before setting the volunteer env var, do this confirmation step:

1. Hit Formspree's public endpoint for both IDs and check the HTTP response:

```
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" -d '{"_test":true}' https://formspree.io/f/mwwyabze
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" -d '{"_test":true}' https://formspree.io/f/mwvyqbze
```

If only one returns `200` and the other returns `404`, the `200` ID is the real one; use it. If both return `200`, both forms exist in someone's Formspree account and we still cannot tell which one is the user's. In that case, do not guess; tell the user "both IDs resolve to active Formspree forms, please confirm via formspree.io/forms which one is yours" and stop.

If you proceed, the assumption is `mwwyabze` based on the user's most recent input.

---

## Steps

### 1. Verify Vercel CLI is authenticated

```
vercel whoami
```

Should print the user's Vercel username. If it errors with "not authenticated", stop and tell the user to run `vercel login` from their machine.

### 2. Set the two env vars across all environments

The Vercel CLI's `vercel env add` is interactive and prompts for value and environments. To stay non-interactive, pipe the value via stdin and pass the environment as an argument. Repeat per environment (production, preview, development) so the values work in all three.

For contact ID:

```
echo -n "mykopjon" | vercel env add PUBLIC_FORMSPREE_CONTACT_ID production
echo -n "mykopjon" | vercel env add PUBLIC_FORMSPREE_CONTACT_ID preview
echo -n "mykopjon" | vercel env add PUBLIC_FORMSPREE_CONTACT_ID development
```

For volunteer ID (use the value determined in the ambiguity step above):

```
echo -n "<chosen_id>" | vercel env add PUBLIC_FORMSPREE_VOLUNTEER_ID production
echo -n "<chosen_id>" | vercel env add PUBLIC_FORMSPREE_VOLUNTEER_ID preview
echo -n "<chosen_id>" | vercel env add PUBLIC_FORMSPREE_VOLUNTEER_ID development
```

If any of these errors with "already exists", that is fine; the existing entry takes precedence and you can `vercel env rm` then re-add if the value needs updating. Verify state with `vercel env ls`.

### 3. Trigger a production redeploy

```
vercel --prod
```

This deploys the current `main` to production with the new env vars baked in. Note: Astro reads `PUBLIC_*` env vars at build time, so the redeploy is mandatory. Just adding the env vars does not update already-deployed pages.

Wait for the deploy to finish (the CLI prints the URL when complete, usually 30 to 60 seconds).

### 4. Verify the forms are live

After redeploy completes, check that the two pages no longer show the placeholder text and that the form actions resolve to the right Formspree endpoints:

```
curl -s https://jewmanity.vercel.app/get-involved/contact | grep -E 'formspree\.io/f/[a-z0-9]+|being configured' | head -5
curl -s https://jewmanity.vercel.app/get-involved/volunteer | grep -E 'formspree\.io/f/[a-z0-9]+|being configured' | head -5
```

Expected output: contact page shows `action="https://formspree.io/f/mykopjon"`, volunteer page shows `action="https://formspree.io/f/<chosen_id>"`, neither shows "being configured".

Newsletter page should still show "being configured" / "Subscribe at launch", confirming we did not accidentally set the Mailchimp var.

Report results to the user, including which volunteer ID was used and the deploy URL.

---

## What you should NOT do

- Do not set `PUBLIC_MAILCHIMP_FORM_ACTION`. We do not have the value yet. Setting it to a placeholder string would just keep the form in the configured-but-broken state instead of the configured-and-clean placeholder it shows today.
- Do not commit any code or open a PR. This is a Vercel-side change only. The repo does not change.
- Do not test-submit the forms with synthetic data. Belinda needs to be the one who confirms her end of the chain (she should see the form's data hit her Formspree inbox). Reporting the rendered action URLs is sufficient.

---

## After this lands

The next session's outstanding item collapses to "Mailchimp action URL from Belinda". Once that arrives, the same pattern applies:

```
echo -n "<her_action_url>" | vercel env add PUBLIC_MAILCHIMP_FORM_ACTION production
# etc for preview and development
vercel --prod
```

And then a similar curl-grep verification on the homepage to confirm the form rendered with a real action URL and the right honeypot field name.
