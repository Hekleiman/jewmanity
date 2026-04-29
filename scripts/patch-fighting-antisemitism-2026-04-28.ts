/**
 * Patch fightingAntisemitism.understandingStats[2] (the AJC online-content
 * stat) to the 2025 figure.
 *
 *   Before: 67% — "of American Jews report seeing antisemitic content online"
 *           — AJC State of Antisemitism in America, 2024
 *   After:  73% — "of American Jews experienced antisemitism online or on social media"
 *           — AJC State of Antisemitism in America, 2025
 *
 * Source: AJC State of Antisemitism in America 2025 — Behind the Numbers.
 *   "73% of American Jews experienced antisemitism online — either by seeing
 *   or hearing it or by being personally targeted. First time the figure has
 *   risen above seven in 10 in the history of the report."
 *   https://www.ajc.org/AntisemitismReport2025/BehindtheNumbers
 *
 * Cards 1 + 2 (9,354 incidents, 344% five-year increase) are the latest
 * available ADL Audit numbers — the 2025 calendar-year audit had not been
 * released as of 2026-04-28. Patch those once ADL publishes (typically
 * around April 22 each year).
 *
 * Defaults to dry-run. Pass --apply to actually write.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-fighting-antisemitism-2026-04-28.ts
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-fighting-antisemitism-2026-04-28.ts --apply
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

const DOC_ID = 'fightingAntisemitism';

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
    `*[_id==$id][0]{_id, understandingStats}`,
    { id: DOC_ID },
  );
  if (!doc) {
    throw new Error(`fightingAntisemitism singleton not found at _id="${DOC_ID}"`);
  }

  const stats = doc.understandingStats ?? [];
  if (stats.length !== 3) {
    throw new Error(
      `Precondition failed: understandingStats length is ${stats.length}, expected 3`,
    );
  }

  const target = stats[2];
  if (target?.value !== '67%') {
    throw new Error(
      `Precondition failed: understandingStats[2].value="${target?.value}", expected "67%"`,
    );
  }
  if (!/AJC State of Antisemitism in America, 2024/i.test(target?.citation ?? '')) {
    throw new Error(
      `Precondition failed: understandingStats[2].citation="${target?.citation}", expected to contain "AJC State of Antisemitism in America, 2024"`,
    );
  }
  console.log(
    `✓ Found understandingStats[2]: value="${target.value}", citation="${target.citation}". OK to update.`,
  );

  const newStat = {
    ...stats[2],
    value: '73%',
    description: 'of American Jews experienced antisemitism online or on social media',
    citation: 'AJC State of Antisemitism in America, 2025',
  };

  const newArray = [stats[0], stats[1], newStat];

  logHeader('PLANNED MUTATION');
  console.log(
    JSON.stringify(
      {
        docId: DOC_ID,
        fieldsChanged: ['understandingStats[2].value', 'understandingStats[2].description', 'understandingStats[2].citation'],
        oldValue: stats[2],
        newValue: newStat,
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
  await client.patch(DOC_ID).set({ understandingStats: newArray }).commit();
  console.log(`  ✓ Patched ${DOC_ID}.understandingStats[2]`);

  logHeader('DONE');
}

main().catch((err) => {
  console.error('\n✗ FAILED:', err.message);
  process.exit(1);
});
