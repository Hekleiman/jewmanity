/**
 * Seeds retreat galleries + community story pullQuotes.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-retreats-and-pullquotes.ts
 */

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('Error: SANITY_API_TOKEN env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const retreatGalleryMap: Record<string, string[]> = {
  'retreat-heads-up-first': ['retreat-1-body-1.jpg', 'retreat-1-body-2.jpg'],
  'retreat-heads-up-second': ['retreat-2-body-1.jpg', 'retreat-2-body-2.jpg'],
  'retreat-heads-up-third': ['retreat-3-body-1.jpg', 'retreat-3-body-2.jpg'],
  'retreat-heads-up-fourth': ['retreat-4-body-1.jpg', 'retreat-4-body-2.jpg'],
};

const pullQuotePatches = [
  {
    _id: 'AlZ3wEBVs3Hpaeh4ZZy467',
    title: 'The Golani Boys Return',
    pullQuote: 'I feel like a kid again!',
    pullQuoteAttribution: 'A soldier, during the second retreat',
  },
  {
    _id: 'DDkH7Ore4K9MDVWIp2wQaL',
    title: 'The Brave Girls',
    pullQuote:
      'The experience of surf therapy was amazing. Working one on one, I felt a moment of disconnection with myself. The combination of surfing and the ocean, it was so much fun, meaningful, and enjoyable.',
    pullQuoteAttribution: 'A soldier, during the third retreat',
  },
];

const IMAGE_DIR = resolve(process.cwd(), 'public/images/retreats');

async function uploadImage(filename: string): Promise<string> {
  const filePath = resolve(IMAGE_DIR, filename);
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename: basename(filePath),
  });
  return asset._id;
}

async function preflight() {
  console.log('=== DRY-RUN: planned writes ===\n');

  const retreatIds = Object.keys(retreatGalleryMap);
  const currentRetreats = await client.fetch<{ _id: string; galleryCount: number | null }[]>(
    `*[_type == "retreat" && _id in $ids]{_id, "galleryCount": count(gallery)}`,
    { ids: retreatIds },
  );
  const galleryByDoc = new Map(currentRetreats.map((r) => [r._id, r.galleryCount ?? 0]));

  console.log('Retreat galleries (overwrite null → 2-image array):');
  for (const [docId, files] of Object.entries(retreatGalleryMap)) {
    const currentCount = galleryByDoc.get(docId) ?? 0;
    console.log(`  ${docId}`);
    console.log(`    current gallery count: ${currentCount}`);
    console.log(`    planned: upload + attach ${files.join(', ')}`);
    if (currentCount > 0) {
      throw new Error(
        `ABORT: ${docId} has ${currentCount} existing gallery images. Prompt said to flag before overwrite.`,
      );
    }
  }

  const storyIds = pullQuotePatches.map((p) => p._id);
  const currentStories = await client.fetch<{ _id: string; pullQuote?: string }[]>(
    `*[_type == "communityStory" && _id in $ids]{_id, pullQuote}`,
    { ids: storyIds },
  );
  const quoteByDoc = new Map(currentStories.map((s) => [s._id, s.pullQuote]));

  console.log('\nCommunity story pullQuotes:');
  for (const patch of pullQuotePatches) {
    const currentQuote = quoteByDoc.get(patch._id) ?? '(none)';
    console.log(`  ${patch._id} — ${patch.title}`);
    console.log(`    current pullQuote: ${currentQuote}`);
    console.log(`    planned pullQuote: ${patch.pullQuote}`);
    console.log(`    planned attribution: ${patch.pullQuoteAttribution}`);
  }
  console.log('\n=== END DRY-RUN ===\n');
}

async function seedRetreatGalleries() {
  console.log('Uploading retreat gallery images + patching retreat docs...\n');

  for (const [docId, files] of Object.entries(retreatGalleryMap)) {
    console.log(`Retreat: ${docId}`);
    const galleryRefs = [];
    for (const file of files) {
      process.stdout.write(`  uploading ${file}...`);
      const assetId = await uploadImage(file);
      console.log(` → ${assetId}`);
      galleryRefs.push({
        _key: assetId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24),
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      });
    }
    await client.patch(docId).set({ gallery: galleryRefs }).commit();
    console.log(`  patched ${docId} with ${galleryRefs.length} gallery images\n`);
  }
}

async function seedPullQuotes() {
  console.log('Patching community story pullQuotes...\n');
  for (const patch of pullQuotePatches) {
    console.log(`  patching ${patch._id} (${patch.title})`);
    await client
      .patch(patch._id)
      .set({
        pullQuote: patch.pullQuote,
        pullQuoteAttribution: patch.pullQuoteAttribution,
      })
      .commit();
    console.log(`    done`);
  }
}

async function verify() {
  console.log('\n=== VERIFICATION ===\n');

  const retreatCheck = await client.fetch(
    `*[_type == "retreat"] | order(_id asc){_id, "slug": slug.current, "galleryCount": count(gallery)}`,
  );
  console.log('Retreats:');
  console.log(JSON.stringify(retreatCheck, null, 2));

  const storyCheck = await client.fetch(
    `*[_type == "communityStory" && _id in ["AlZ3wEBVs3Hpaeh4ZZy467", "DDkH7Ore4K9MDVWIp2wQaL"]]{_id, title, pullQuote, pullQuoteAttribution}`,
  );
  console.log('\nCommunity stories:');
  console.log(JSON.stringify(storyCheck, null, 2));
}

async function main() {
  await preflight();
  await seedRetreatGalleries();
  await seedPullQuotes();
  await verify();
  console.log('\nAll done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
