/**
 * One-off cleanup: removes the ghost `faqContext` field from the live
 * donatePage and volunteerPage documents in Sanity.
 *
 * Context: the `faqContext` field was removed from both schemas (and from
 * the seeds in commit 814b86d), but documents seeded before that change
 * still carry the field. Sanity preserves unknown fields on documents, so
 * this script explicitly unsets them.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/cleanup-ghost-fields.ts
 *
 * Safe to run multiple times. Unsetting an absent field is a no-op.
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error('Error: SANITY_API_TOKEN env var required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const TARGETS = ['donatePage', 'volunteerPage'] as const;

async function main() {
  console.log('Inspecting current state of ghost faqContext field...\n');

  for (const id of TARGETS) {
    const before = await client.fetch<{ _id: string; faqContext: string | null } | null>(
      `*[_id == $id][0]{ _id, faqContext }`,
      { id },
    );

    if (!before) {
      console.log(`  ${id}: document not found, skipping.`);
      continue;
    }

    if (before.faqContext == null) {
      console.log(`  ${id}: no faqContext field present. Nothing to clean up.`);
      continue;
    }

    console.log(`  ${id}: faqContext = "${before.faqContext}". Unsetting...`);
    await client.patch(id).unset(['faqContext']).commit();

    const after = await client.fetch<{ faqContext: string | null }>(
      `*[_id == $id][0]{ faqContext }`,
      { id },
    );
    console.log(`  ${id}: post-cleanup faqContext = ${after?.faqContext ?? 'null'} (expected null).`);
  }

  console.log('\nCleanup complete.');
}

main().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
