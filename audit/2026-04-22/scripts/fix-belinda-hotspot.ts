/**
 * Belinda Donner hotspot patch.
 *
 * Team members do not have a slug field — matched by _id instead
 * (verified in verify-team-fix.ts output: id = "team-belinda-donner").
 *
 * Requires SANITY_API_TOKEN in env (write-scoped). Fails loudly if missing.
 * Uses useCdn:false — CDN client is not appropriate for mutations.
 *
 * Dry-run by default (prints the patch object and exits 0).
 * Pass --apply to actually commit the write.
 *
 * Run from repo root:
 *   npx tsx audit/2026-04-22/scripts/fix-belinda-hotspot.ts          # dry run
 *   npx tsx audit/2026-04-22/scripts/fix-belinda-hotspot.ts --apply  # write
 */

import { createClient } from '@sanity/client';

const BELINDA_ID = 'team-belinda-donner';
const TARGET_HOTSPOT = {
  _type: 'sanity.imageHotspot',
  x: 0.5,
  y: 0.33,
  height: 1,
  width: 1,
} as const;

function fail(msg: string): never {
  console.error(`\n[fix-belinda-hotspot] FATAL: ${msg}\n`);
  process.exit(1);
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(
    `fix-belinda-hotspot — ${new Date().toISOString()} — mode=${apply ? 'APPLY' : 'DRY-RUN'}`,
  );

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    fail(
      'SANITY_API_TOKEN not set in env. This script needs a write-scoped token to mutate a Sanity document. Export it and retry.',
    );
  }

  const client = createClient({
    projectId: '9pc3wgri',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  });

  // Pre-flight: fetch Belinda's current photo.hotspot.
  const belinda = await client.fetch<{ _id: string; name: string; photo: any } | null>(
    `*[_type == "teamMember" && _id == $id][0] { _id, name, photo }`,
    { id: BELINDA_ID },
  );

  if (!belinda) {
    fail(`Team member with _id="${BELINDA_ID}" not found in dataset.`);
  }

  console.log(`\nFound: ${belinda.name} (_id=${belinda._id})`);
  console.log(`Current photo.hotspot: ${JSON.stringify(belinda.photo?.hotspot ?? null)}`);

  const currentY = belinda.photo?.hotspot?.y;
  if (typeof currentY === 'number' && Math.abs(currentY - 0.33) < 0.005) {
    console.log(
      "\nBelinda's hotspot is already correct (y≈0.33) — nothing to do. Aborting to avoid no-op write.",
    );
    process.exit(0);
  }
  if (typeof currentY !== 'number' || Math.abs(currentY - 0.5) > 0.005) {
    fail(
      `Pre-flight assertion failed: expected Belinda's photo.hotspot.y to be ~0.5 (current buggy state), got ${JSON.stringify(
        belinda.photo?.hotspot ?? null,
      )}. Refusing to write — investigate before re-running.`,
    );
  }

  const patchObject = {
    id: belinda._id,
    set: { 'photo.hotspot': TARGET_HOTSPOT },
  };

  console.log('\nPatch to send:');
  console.log(JSON.stringify(patchObject, null, 2));

  if (!apply) {
    console.log('\n[dry-run] Not committing. Re-run with --apply to write.');
    process.exit(0);
  }

  console.log('\n[apply] Committing patch...');
  const result = await client
    .patch(belinda._id)
    .set({ 'photo.hotspot': TARGET_HOTSPOT })
    .commit();

  console.log(`Patch committed. Result _id: ${result._id}, _rev: ${result._rev}`);

  // Re-query to confirm the write.
  const after = await client.fetch<{ photo: any } | null>(
    `*[_type == "teamMember" && _id == $id][0] { photo }`,
    { id: BELINDA_ID },
  );
  console.log(`\nPost-write photo.hotspot: ${JSON.stringify(after?.photo?.hotspot ?? null)}`);

  const afterY = after?.photo?.hotspot?.y;
  if (typeof afterY === 'number' && Math.abs(afterY - 0.33) < 0.005) {
    console.log('OK — hotspot.y is now ~0.33.');
  } else {
    fail(
      `Write did not take: expected y≈0.33, got ${JSON.stringify(
        after?.photo?.hotspot ?? null,
      )}. Investigate.`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
