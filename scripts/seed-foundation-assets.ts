/**
 * Uploads the local logo and default OG images as Sanity image assets,
 * then patches siteSettings.logo and siteSettings.defaultOgImage to
 * reference them. Idempotent on two levels:
 *   1. If a Sanity asset with the same SHA-1 hash already exists, reuse it.
 *   2. The siteSettings patch uses setIfMissing, so an editor-set value
 *      in Studio is never clobbered.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-foundation-assets.ts
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';

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

const ROOT = process.cwd();

function firstExistingPath(candidates: string[]): string | null {
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function ensureAsset(localPath: string, filename: string): Promise<string> {
  const buffer = readFileSync(localPath);
  const sha1 = createHash('sha1').update(buffer).digest('hex');

  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]{_id, originalFilename}`,
    { sha1 },
  );
  if (existing?._id) {
    console.log(
      `  asset already in Sanity (sha1 match): ${existing._id}` +
        (existing.originalFilename ? ` (${existing.originalFilename})` : ''),
    );
    return existing._id;
  }

  console.log(`  uploading ${filename} (${buffer.length} bytes)...`);
  const uploaded = await client.assets.upload('image', buffer, { filename });
  console.log(`  uploaded: ${uploaded._id}`);
  return uploaded._id;
}

function imageRef(assetId: string) {
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
  };
}

async function main() {
  console.log('Ensuring logo asset...');
  const logoPath = firstExistingPath([
    join(ROOT, 'public/images/logo.png'),
    join(ROOT, 'public/logo.png'),
  ]);
  if (!logoPath) {
    console.error('Logo not found at public/images/logo.png or public/logo.png');
    process.exit(1);
  }
  const logoId = await ensureAsset(logoPath, 'logo.png');

  console.log('\nEnsuring default OG image asset...');
  const ogPath = firstExistingPath([
    join(ROOT, 'public/og-default.png'),
    join(ROOT, 'public/og-default.jpg'),
    join(ROOT, 'public/images/og-default.png'),
    join(ROOT, 'public/images/og-default.jpg'),
  ]);
  if (!ogPath) {
    console.error(
      'OG default not found. Checked: public/og-default.{png,jpg}, public/images/og-default.{png,jpg}.',
    );
    process.exit(1);
  }
  const ogFilename = ogPath.endsWith('.jpg') ? 'og-default.jpg' : 'og-default.png';
  const ogId = await ensureAsset(ogPath, ogFilename);

  console.log('\nPatching siteSettings with image refs (setIfMissing)...');
  await client
    .patch('siteSettings')
    .setIfMissing({
      logo: imageRef(logoId),
      defaultOgImage: imageRef(ogId),
    })
    .commit();
  console.log('  done.');

  const verify = await client.fetch(`*[_id == "siteSettings"][0]{
    "logoAssetId": logo.asset._ref,
    "logoUrl": logo.asset->url,
    "defaultOgAssetId": defaultOgImage.asset._ref,
    "defaultOgUrl": defaultOgImage.asset->url
  }`);
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
