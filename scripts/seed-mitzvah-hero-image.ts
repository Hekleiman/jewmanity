/**
 * Seeds mitzvahProject.heroImage with the hardcoded fallback hero image.
 *
 * Resolves the 2026-05-18 CMS gap audit finding that mitzvahProject.heroImage
 * is declared in schema, read by the page, but empty in the live document.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-mitzvah-hero-image.ts
 */

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

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

async function uploadImage(publicPath: string): Promise<string> {
  const full = resolve(process.cwd(), 'public' + publicPath);
  const buffer = await readFile(full);
  const asset = await client.assets.upload('image', buffer, { filename: basename(full) });
  return asset._id;
}

function imageRef(assetId: string) {
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: assetId },
  };
}

async function main() {
  console.log('Uploading mitzvah hero image...');
  const assetId = await uploadImage('/images/hero/mitzvah-project.jpg');
  console.log('  asset:', assetId);

  console.log('Patching mitzvahProject.heroImage...');
  await client.patch('mitzvahProject').set({ heroImage: imageRef(assetId) }).commit();

  const verify = await client.fetch(
    `*[_id == "mitzvahProject"][0]{"heroImagePresent": defined(heroImage.asset)}`,
  );
  console.log('Verification:', JSON.stringify(verify));
  if (!verify?.heroImagePresent) {
    console.error('FAIL: heroImage still not present after patch.');
    process.exit(1);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
