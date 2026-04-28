/**
 * Surgical patch for the 2026-04-28 designer audit.
 *
 * Three mutations:
 *   A1 — headsUp.supportCards: drop entries 2 and 3 (keep "Israeli Soldiers" only)
 *   A2 — headsUp.impactStats:  4 retreats / 40+ participants / 100% scholarship
 *   A4 — testimonial(Matamba Lassan): rename to Matan Balahsan, role to
 *        "Heads Up Participant", swap image to public/images/testimonials/matan.png
 *
 * Defaults to dry-run. Pass --apply to actually write.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-designer-audit-2026-04-28.ts
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-designer-audit-2026-04-28.ts --dry-run
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-designer-audit-2026-04-28.ts --apply
 */

import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';

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

const HEADS_UP_ID = 'headsUp';
const MATAN_IMAGE_PATH = path.resolve('public/images/testimonials/matan.png');
const MATAN_IMAGE_FILENAME = 'matan-balahsan.png';

type Mutation = {
  id: string;
  docId: string;
  fieldsChanged: string[];
  oldValue: unknown;
  newValue: unknown;
};

function logHeader(title: string) {
  const bar = '─'.repeat(72);
  console.log(`\n${bar}\n${title}\n${bar}`);
}

function logMutation(m: Mutation) {
  console.log(JSON.stringify(m, null, 2));
}

async function preflight(): Promise<{
  headsUp: any;
  testimonialId: string;
  testimonialDoc: any;
  matanImageOk: boolean;
}> {
  logHeader('PREFLIGHT — read current state and verify preconditions');

  // A1 + A2 source doc
  const headsUp = await client.fetch(
    `*[_id==$id][0]{_id, supportCards, impactStats}`,
    { id: HEADS_UP_ID },
  );
  if (!headsUp) {
    throw new Error(`headsUp singleton not found at _id="${HEADS_UP_ID}"`);
  }

  // A1 precondition
  const sc = headsUp.supportCards ?? [];
  if (sc.length !== 3) {
    throw new Error(
      `A1 precondition failed: supportCards length is ${sc.length}, expected 3`,
    );
  }
  const titles = sc.map((c: any) => c?.title);
  if (
    !/widow/i.test(titles[1] ?? '') ||
    !/famil/i.test(titles[2] ?? '')
  ) {
    throw new Error(
      `A1 precondition failed: expected entry[1] to be a widow card and entry[2] a families card. Got titles=${JSON.stringify(titles)}`,
    );
  }
  console.log(
    `✓ A1: supportCards has 3 entries — entry[0]="${titles[0]}", entry[1]="${titles[1]}", entry[2]="${titles[2]}". OK to drop entries 1+2.`,
  );

  // A2 precondition
  const stats = headsUp.impactStats ?? [];
  if (stats.length !== 3) {
    throw new Error(
      `A2 precondition failed: impactStats length is ${stats.length}, expected 3`,
    );
  }
  const labels = stats.map((s: any) => s?.label);
  const expectedLabels = [
    'Retreats Completed',
    'Participants Supported',
    'Scholarship Coverage',
  ];
  for (let i = 0; i < 3; i++) {
    if (labels[i] !== expectedLabels[i]) {
      throw new Error(
        `A2 precondition failed: impactStats[${i}].label="${labels[i]}", expected "${expectedLabels[i]}"`,
      );
    }
  }
  console.log(
    `✓ A2: impactStats has 3 entries with expected labels. Current values: ${stats[0].value} / ${stats[1].value}${stats[1].suffix ?? ''} / ${stats[2].value}${stats[2].suffix ?? ''}.`,
  );

  // A4 doc lookup
  const testimonialMatches = await client.fetch(
    `*[_type=="testimonial" && authorName=="Matamba Lassan"]{_id, authorName, authorRole, "imgRef": authorImage.asset._ref}`,
  );
  if (testimonialMatches.length === 0) {
    throw new Error(
      `A4 precondition failed: no testimonial found with authorName="Matamba Lassan"`,
    );
  }
  if (testimonialMatches.length > 1) {
    throw new Error(
      `A4 precondition failed: ${testimonialMatches.length} testimonials match authorName="Matamba Lassan", expected exactly 1`,
    );
  }
  const testimonialDoc = testimonialMatches[0];
  console.log(
    `✓ A4: found testimonial _id="${testimonialDoc._id}" authorName="${testimonialDoc.authorName}" authorRole="${testimonialDoc.authorRole}".`,
  );

  // A4 image source
  let matanImageOk = false;
  try {
    const stat = await fs.stat(MATAN_IMAGE_PATH);
    if (!stat.isFile()) {
      throw new Error(`${MATAN_IMAGE_PATH} exists but is not a regular file`);
    }
    matanImageOk = true;
    console.log(
      `✓ A4: source image found at ${MATAN_IMAGE_PATH} (${stat.size.toLocaleString()} bytes).`,
    );
  } catch (err) {
    throw new Error(
      `A4 precondition failed: cannot read source image at ${MATAN_IMAGE_PATH}. Aborting all mutations (will not run A1 or A2 either).\n  ${(err as Error).message}`,
    );
  }

  return {
    headsUp,
    testimonialId: testimonialDoc._id,
    testimonialDoc,
    matanImageOk,
  };
}

async function planMutations(state: Awaited<ReturnType<typeof preflight>>): Promise<Mutation[]> {
  const { headsUp, testimonialDoc } = state;

  const a1: Mutation = {
    id: 'A1',
    docId: HEADS_UP_ID,
    fieldsChanged: ['supportCards'],
    oldValue: headsUp.supportCards,
    newValue: [headsUp.supportCards[0]],
  };

  const newImpactStats = [
    { ...headsUp.impactStats[0], value: '4' },
    { ...headsUp.impactStats[1], value: '40', suffix: '+' },
    { ...headsUp.impactStats[2], value: '100', suffix: '%' },
  ];
  // Strip undefined suffix so we don't write `suffix: undefined` for entry 0
  if (newImpactStats[0].suffix === undefined) delete newImpactStats[0].suffix;

  const a2: Mutation = {
    id: 'A2',
    docId: HEADS_UP_ID,
    fieldsChanged: ['impactStats'],
    oldValue: headsUp.impactStats,
    newValue: newImpactStats,
  };

  const a4: Mutation = {
    id: 'A4',
    docId: testimonialDoc._id,
    fieldsChanged: ['authorName', 'authorRole', 'authorImage.asset._ref'],
    oldValue: {
      authorName: testimonialDoc.authorName,
      authorRole: testimonialDoc.authorRole,
      authorImageRef: testimonialDoc.imgRef,
    },
    newValue: {
      authorName: 'Matan Balahsan',
      authorRole: 'Heads Up Participant',
      authorImageRef: '<asset id assigned at upload time>',
    },
  };

  return [a1, a2, a4];
}

async function applyA1(m: Mutation) {
  await client.patch(m.docId).set({ supportCards: m.newValue }).commit();
  console.log(`  ✓ A1 applied to ${m.docId}`);
}

async function applyA2(m: Mutation) {
  await client.patch(m.docId).set({ impactStats: m.newValue }).commit();
  console.log(`  ✓ A2 applied to ${m.docId}`);
}

async function applyA4(m: Mutation): Promise<{ assetId: string }> {
  const buffer = await fs.readFile(MATAN_IMAGE_PATH);
  const asset = await client.assets.upload('image', buffer, {
    filename: MATAN_IMAGE_FILENAME,
  });
  console.log(`  ✓ A4 image uploaded: asset _id=${asset._id}`);

  await client
    .patch(m.docId)
    .set({
      authorName: 'Matan Balahsan',
      authorRole: 'Heads Up Participant',
      authorImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
    .commit();
  console.log(`  ✓ A4 patched testimonial ${m.docId}`);
  return { assetId: asset._id };
}

async function main() {
  console.log(
    `Mode: ${apply ? 'APPLY (writes will be sent to Sanity production)' : 'DRY-RUN (no writes)'}`,
  );

  const state = await preflight();
  const mutations = await planMutations(state);

  logHeader('PLANNED MUTATIONS');
  for (const m of mutations) {
    logMutation(m);
  }

  if (dryRun) {
    logHeader('DRY-RUN — no writes performed');
    console.log(
      'Re-run with --apply to commit the above mutations to Sanity production.',
    );
    return;
  }

  logHeader('APPLYING MUTATIONS');
  await applyA1(mutations[0]);
  await applyA2(mutations[1]);
  const a4Result = await applyA4(mutations[2]);

  logHeader('DONE');
  console.log(
    JSON.stringify(
      {
        a1: 'applied',
        a2: 'applied',
        a4: { applied: true, assetId: a4Result.assetId },
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error('\n✗ FAILED:', err.message);
  process.exit(1);
});
