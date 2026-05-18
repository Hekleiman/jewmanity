/**
 * Seeds the aboutTeamPage singleton (_id: aboutTeamPage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-about-team-page.ts
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
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: assetId } };
}

async function main() {
  console.log('Uploading hero image...');
  const heroAsset = await uploadImage('/images/hero/about-team.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'aboutTeamPage',
    _type: 'aboutTeamPage',

    hero: {
      heading: 'Meet the People Behind Jewmanity',
      subtitle:
        'A dedicated team united by compassion, lived experience, and a commitment to building resilience in our community.',
      backgroundImage: imageRef(heroAsset),
    },

    ctaHeading: 'Be Part of the Work We Do',
    ctaSubtitle: 'Join a growing community committed to service, responsibility, and impact.',
    ctaPrimaryButton: { text: 'Learn How to Get Involved', href: '/get-involved/volunteer' },
    ctaSecondaryButton: { text: '', href: '' },
  };

  console.log('\nWriting aboutTeamPage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "aboutTeamPage"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      ctaHeading,
      "primary": ctaPrimaryButton.text
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
