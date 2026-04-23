/**
 * Seeds reasonable default hotspots on teamMember docs so the /about/team
 * card crop focuses on the upper third of each photo (where faces typically
 * are) instead of center-cropping through torsos.
 *
 * Default: { x: 0.5, y: 0.33, height: 1, width: 1 }
 *
 * Idempotent: skips any doc whose photo.hotspot already equals the target.
 *
 * Usage:
 *   npx tsx scripts/seed-team-hotspots.ts --dry-run
 *   npx tsx scripts/seed-team-hotspots.ts
 *
 * Token: reads SANITY_API_TOKEN from .env or process.env.
 *
 * Editors can refine per-person in Studio afterward — see
 * docs/editor-guide.md → "Adjusting team member photo framing".
 */

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function loadEnv(): Promise<void> {
  try {
    const raw = await readFile(resolve(process.cwd(), '.env'), 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const m = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      const [, key, val] = m;
      if (!process.env[key]) process.env[key] = val.replace(/^["']|["']$/g, '');
    }
  } catch {
    // .env absent — rely on process.env
  }
}

const DRY_RUN = process.argv.includes('--dry-run');

const TEAM_IDS = [
  'team-belinda-donner',
  'team-andrew-donner',
  'team-shai-gino',
  'team-rabbi-avi-libman',
];

const TARGET_HOTSPOT = { x: 0.5, y: 0.33, height: 1, width: 1 } as const;

interface Hotspot {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
}

function hotspotEquals(a: Hotspot | null | undefined, b: Hotspot): boolean {
  if (!a) return false;
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.height === b.height &&
    a.width === b.width
  );
}

async function main() {
  await loadEnv();
  const token = process.env.SANITY_API_TOKEN;

  if (!DRY_RUN && !token) {
    console.error('Error: SANITY_API_TOKEN is required for live run.');
    process.exit(1);
  }

  const client = createClient({
    projectId: '9pc3wgri',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  console.log(DRY_RUN ? '=== DRY RUN (no writes) ===' : '=== LIVE RUN ===');
  console.log(`Target hotspot: ${JSON.stringify(TARGET_HOTSPOT)}`);
  console.log(`Members to check: ${TEAM_IDS.length}`);
  console.log('');

  const docs = await client.fetch<
    { _id: string; name: string; photo?: { hotspot?: Hotspot } }[]
  >(
    `*[_type == "teamMember" && _id in $ids] { _id, name, photo { hotspot } }`,
    { ids: TEAM_IDS },
  );

  const byId = new Map(docs.map((d) => [d._id, d]));

  let writeCount = 0;
  let skipCount = 0;

  for (const id of TEAM_IDS) {
    const doc = byId.get(id);
    console.log(`--- ${id} ---`);
    if (!doc) {
      console.log(`  NOT FOUND in Sanity — skipping`);
      continue;
    }
    console.log(`  name: ${doc.name}`);
    const current = doc.photo?.hotspot ?? null;
    console.log(`  current hotspot: ${current ? JSON.stringify(current) : '(none)'}`);

    if (hotspotEquals(current, TARGET_HOTSPOT)) {
      console.log(`  already matches target — no write needed`);
      skipCount += 1;
      console.log('');
      continue;
    }

    console.log(`  target hotspot:  ${JSON.stringify(TARGET_HOTSPOT)}`);

    if (DRY_RUN) {
      console.log(`  [dry-run] would patch ${id} → set photo.hotspot`);
      writeCount += 1;
      console.log('');
      continue;
    }

    await client
      .patch(id)
      .set({
        'photo.hotspot': {
          _type: 'sanity.imageHotspot',
          ...TARGET_HOTSPOT,
        },
      })
      .commit();
    console.log(`  patch ${id} → ok`);
    writeCount += 1;
    console.log('');
  }

  console.log(DRY_RUN ? '=== DRY RUN COMPLETE ===' : '=== SEED COMPLETE ===');
  console.log(`Writes: ${writeCount} ${DRY_RUN ? '(planned)' : ''}`);
  console.log(`Skipped (already up-to-date): ${skipCount}`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
