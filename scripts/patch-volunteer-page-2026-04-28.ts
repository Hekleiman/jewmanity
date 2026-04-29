/**
 * Drop the "Transportation and Logistics" card from the Volunteer page's
 * "How You Can Help" section. Jewmanity does not offer transportation
 * volunteering — designer audit 2026-04-28.
 *
 *   Before: [meals, transport, hosting, support]   (4 cards, wraps 3+1)
 *   After:  [meals, hosting, support]              (3 cards, single row)
 *
 * Defaults to dry-run. Pass --apply to actually write.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-volunteer-page-2026-04-28.ts
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-volunteer-page-2026-04-28.ts --apply
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_WRITE_TOKEN;
const apply = process.argv.includes('--apply');
const dryRun = !apply;

if (!token) {
  console.error('Error: SANITY_API_TOKEN (or SANITY_WRITE_TOKEN) env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const DOC_ID = 'volunteerPage';

function logHeader(title: string) {
  const bar = '─'.repeat(72);
  console.log(`\n${bar}\n${title}\n${bar}`);
}

async function main() {
  console.log(
    `Mode: ${apply ? 'APPLY (writes will be sent to Sanity production)' : 'DRY-RUN (no writes)'}`,
  );

  logHeader('PREFLIGHT — read current state and verify preconditions');

  const doc = await client.fetch(
    `*[_id==$id][0]{_id, howToHelpCards}`,
    { id: DOC_ID },
  );
  if (!doc) {
    throw new Error(`volunteerPage singleton not found at _id="${DOC_ID}"`);
  }

  const cards = doc.howToHelpCards ?? [];
  const transportIndex = cards.findIndex(
    (c: any) => /transport/i.test(c?.icon ?? '') || /transport/i.test(c?.title ?? ''),
  );
  if (transportIndex === -1) {
    throw new Error(
      `Precondition failed: no transport card found in howToHelpCards. Current titles: ${JSON.stringify(cards.map((c: any) => c?.title))}`,
    );
  }

  const removed = cards[transportIndex];
  const newCards = cards.filter((_: any, i: number) => i !== transportIndex);

  console.log(
    `✓ Found transport card at index ${transportIndex}: title="${removed.title}" _key="${removed._key}". OK to remove.`,
  );
  console.log(
    `  Remaining ${newCards.length} cards: ${JSON.stringify(newCards.map((c: any) => c.title))}`,
  );

  logHeader('PLANNED MUTATION');
  console.log(
    JSON.stringify(
      {
        docId: DOC_ID,
        fieldsChanged: ['howToHelpCards (remove transport entry)'],
        oldLength: cards.length,
        newLength: newCards.length,
        removedEntry: removed,
      },
      null,
      2,
    ),
  );

  if (dryRun) {
    logHeader('DRY-RUN — no writes performed');
    console.log('Re-run with --apply to commit the above mutation to Sanity production.');
    return;
  }

  logHeader('APPLYING MUTATION');
  await client.patch(DOC_ID).set({ howToHelpCards: newCards }).commit();
  console.log(`  ✓ Patched ${DOC_ID}.howToHelpCards`);

  logHeader('DONE');
}

main().catch((err) => {
  console.error('\n✗ FAILED:', err.message);
  process.exit(1);
});
