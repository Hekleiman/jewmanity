# Prompt: CMS Schema Cleanup (audit items 5, 10, 12, 14)

Hand this to Claude Code from inside `/Users/hek/jewmanity` for a fresh session. Reference: `docs/cms-website-gap-audit-2026-05-18.md`. Closes the four remaining cleanup items from the audit. No editor-facing behavior changes; this removes dead schema fields that show up in Studio but go nowhere, plus marks one stale paragraph in the older April audit doc.

Estimate: 15 to 25 minutes. Mostly deletions and a small doc edit.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead.

The repo's `.env` contains a working `SANITY_API_TOKEN`. Only the optional ghost-data cleanup at the end needs it; the schema and code changes do not.

PR flow per saved memory: `gh pr create` then `gh pr merge --auto --squash --delete-branch`.

---

## Pre-flight

Confirm local `main` is current before starting:

```
cd /Users/hek/jewmanity
git fetch origin
git status
git pull --ff-only
```

If `git pull --ff-only` errors with "diverging", stop and tell the user. Local work has accumulated that wasn't merged via PR.

Create a fresh branch:

```
git checkout -b chore/audit-schema-cleanup
```

---

## Piece 1: Delete dead mitzvah quote fields (audit item 5)

File: `sanity/schemas/singletons/mitzvahProject.ts`. Remove three field definitions:

- `openingQuote`
- `inspirationalQuote`
- `inspirationalQuoteAttribution`

Per the live CMS scan, all three are `null` in the published document, so no data is lost. Per the audit, no page reads these. The fields are declared in schema but functionally dead.

After deleting from the schema file, also remove the projections from `src/lib/sanity.ts` inside `getMitzvahProject()`. Search the GROQ string for `openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution` and strip those three lines.

Then grep the codebase for any other references:

```
grep -rn 'openingQuote\|inspirationalQuote' src/ scripts/ sanity/ --include='*.ts' --include='*.astro' --include='*.mjs'
```

Anything still matching should be assessed: page reads should be removed (they would be no-ops anyway), seed-script writes should be removed (they would write data that no field accepts).

---

## Piece 2: Delete `resources.disclaimer` (audit item 10)

File: `sanity/schemas/singletons/resources.ts`. Remove the `disclaimer` field definition (the schema description literally labels it "Page Footer Disclaimer (unused)" so deletion is expected).

Also remove the `disclaimer` projection from `src/lib/sanity.ts` inside `getResources()`.

Grep:

```
grep -rn 'disclaimer' src/pages/resources.astro src/lib/sanity.ts sanity/schemas/singletons/resources.ts
```

Per the live CMS scan the field is unset, so no data is at risk. If the grep surfaces a separate `medicalDisclaimer` field in the resources schema or page, do not touch it; that one is a different field that is actually rendered.

---

## Piece 3: Delete unused `mitzvahProject.steps[]` subfields (audit item 12)

File: `sanity/schemas/singletons/mitzvahProject.ts`. Inside the `steps` array field's `of: [{ type: 'object', fields: [...] }]` definition, remove the four subfields:

- `label`
- `description`
- `actions`
- `tip`

Keep `title` and any numbering field that the page actually renders. The audit notes the schema descriptions explicitly say "Retained for future use. Not currently rendered." for the dead subfields.

Grep the codebase:

```
grep -rn 'steps\[\]\|step\.label\|step\.description\|step\.actions\|step\.tip' src/ scripts/ sanity/ --include='*.ts' --include='*.astro' --include='*.mjs'
```

If `getMitzvahProject()` in `src/lib/sanity.ts` projects these subfields explicitly inside the `steps[]` projection, remove them. If it projects `steps[]` as a whole object, no change needed at the GROQ layer.

The `HowItWorks` component (`src/components/mitzvah/HowItWorks.astro`) is the consumer; verify it does not destructure these subfields. If it does, drop them from the prop interface too.

---

## Piece 4: Mark stale `*BySlug` claim in April audit (audit item 14)

File: `docs/project-audit-2026-04-20.md`. Search for the section that mentions `getRecipeBySlug`, `getRetreatBySlug`, `getProductBySlug`, or `getCommunityStoryBySlug` as orphan exports.

Do not delete the section. Add a note at the top of that section (or immediately before it) indicating the claim is now stale:

```
> **Stale as of 2026-05-18.** The `*BySlug` exports listed below have since been removed from `src/lib/sanity.ts`. See `docs/cms-website-gap-audit-2026-05-18.md` section 2.1 for the current state of orphan queries.
```

Preserving the original text matters for historical context (this was a real finding at the time). The annotation just signals that anyone reading it now should follow the breadcrumb to the newer audit.

---

## Optional: Ghost-data cleanup on live documents

The schema and code changes above are non-destructive. Sanity will continue to store the now-orphaned values on the published documents (similar to the `faqContext` situation we already cleaned in `759e42e`). Per the live CMS scan, the only field at risk of having data is `mitzvahProject.steps[].label` etc., since the scan did not query those subfields specifically. The other targets (`openingQuote`, `inspirationalQuote`, `inspirationalQuoteAttribution`, `disclaimer`) are confirmed null.

Run this quick check first to see if there's actually anything to clean up:

```
set -a; source .env; set +a
node -e "
const { createClient } = require('@sanity/client');
const client = createClient({ projectId: '9pc3wgri', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_API_TOKEN, useCdn: false });
client.fetch(\`*[_id == 'mitzvahProject'][0]{ steps[]{ \\\"hasLabel\\\": defined(label), \\\"hasDescription\\\": defined(description), \\\"hasActions\\\": defined(actions), \\\"hasTip\\\": defined(tip) } }\`).then(r => console.log(JSON.stringify(r, null, 2)));
"
```

If all `has*` booleans return `false`, no cleanup needed; skip this section.

If any return `true`, extend `scripts/cleanup-ghost-fields.ts` with a new `TARGETS_WITH_FIELDS` entry that unsets the dead step subfields:

```ts
const STEP_SUBFIELDS = ['label', 'description', 'actions', 'tip'];
// ... after the existing donatePage and volunteerPage loop ...
console.log('Cleaning dead step subfields on mitzvahProject...');
const mitzvah = await client.fetch(`*[_id == 'mitzvahProject'][0]{ steps }`);
if (mitzvah?.steps?.length) {
  for (let i = 0; i < mitzvah.steps.length; i++) {
    const paths = STEP_SUBFIELDS.map(f => `steps[${i}].${f}`);
    await client.patch('mitzvahProject').unset(paths).commit();
  }
}
```

Then run it: `npx tsx scripts/cleanup-ghost-fields.ts`. Idempotent.

---

## Verification

```
npm run build
```

Must succeed with zero TypeScript errors. The schema deletions reduce Studio's field count; the page reads should still work since the deleted fields were not consumed.

Visual diff: open `dist/get-involved/mitzvah-project/index.html` and `dist/resources/index.html`. Both should render identically to before the change.

`git diff --stat` should touch at most six files:

- `sanity/schemas/singletons/mitzvahProject.ts`
- `sanity/schemas/singletons/resources.ts`
- `src/lib/sanity.ts`
- `docs/project-audit-2026-04-20.md`
- Optionally `scripts/cleanup-ghost-fields.ts` and a re-run of it

---

## Commit, push, PR, merge

```
git add sanity/schemas/singletons/mitzvahProject.ts sanity/schemas/singletons/resources.ts src/lib/sanity.ts docs/project-audit-2026-04-20.md
# add scripts/cleanup-ghost-fields.ts if it was touched
git commit -m "chore(cms): clean up dead schema fields from 2026-05-18 audit

Closes the final four cleanup items from
docs/cms-website-gap-audit-2026-05-18.md.

Items:
- 5: remove mitzvahProject.openingQuote, inspirationalQuote, and
  inspirationalQuoteAttribution (declared, never rendered).
- 10: remove resources.disclaimer (schema description labeled it
  '(unused)').
- 12: remove the dead mitzvahProject.steps[].label, .description,
  .actions, and .tip subfields (schema description noted 'Retained
  for future use. Not currently rendered.').
- 14: annotate the stale *BySlug claim in the April audit doc.

All affected fields verified null in the live production dataset before
deletion, so no editor data is lost. Removing them tidies Studio for
Belinda and removes the gap between schema and reality."

git push -u origin chore/audit-schema-cleanup
gh pr create --title "chore(cms): clean up dead schema fields from 2026-05-18 audit" --body "$(cat <<'EOF'
Closes the final four cleanup items from docs/cms-website-gap-audit-2026-05-18.md.

- Item 5: remove three dead quote fields from mitzvahProject schema.
- Item 10: remove dead disclaimer field from resources schema.
- Item 12: remove four dead subfields from mitzvahProject.steps[].
- Item 14: annotate stale *BySlug claim in docs/project-audit-2026-04-20.md.

All four targets verified null in the live CMS before deletion. No data
loss. Studio loses 8 field slots that were declared but never rendered,
so editors see less clutter when editing the mitzvah and resources pages.

Build clean, zero TypeScript errors. Visual diff on /get-involved/mitzvah-project
and /resources is zero.

With this merged, all 14 audit recommendations from docs/cms-website-gap-audit-2026-05-18.md
are closed.
EOF
)"
gh pr merge --auto --squash --delete-branch
```

If `--delete-branch` errors on local cleanup (the known worktree gotcha), fall back to `git push --delete origin chore/audit-schema-cleanup` after the auto-merge completes.
