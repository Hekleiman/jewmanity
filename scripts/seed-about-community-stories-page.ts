/**
 * Seeds the aboutCommunityStoriesPage singleton (_id: aboutCommunityStoriesPage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-about-community-stories-page.ts
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
  const heroAsset = await uploadImage('/images/hero/community-stories.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'aboutCommunityStoriesPage',
    _type: 'aboutCommunityStoriesPage',

    hero: {
      heading: 'Community Stories',
      subtitle:
        'Celebrating the legacy of care, resilience, and humanity that defines Jewish communities around the world',
      backgroundImage: imageRef(heroAsset),
    },

    introParagraphs: [
      'For thousands of years, Jewish communities have embodied a commitment to compassion, service, and mutual responsibility. This is not a recent response to crisis. It is woven into the fabric of our identity.',
      'From ancient traditions of caring for the stranger to modern innovations in medical aid and social services, these stories reflect a timeless dedication to human dignity and the belief that we are all responsible for one another.',
    ],

    voicesHeading: 'Voices from Our Community',
    voicesSubtitle: 'Real stories from the people whose lives have been touched by Jewmanity',

    ctaHeading: 'Be Part of the Ongoing Story',
    ctaSubtitle:
      'Every act of care, every moment of connection, every gesture of support adds a new chapter to this living legacy. Join us in building a more compassionate world.',
    ctaPrimaryButton: { text: 'Get Involved', href: '/get-involved/volunteer' },
  };

  console.log('\nWriting aboutCommunityStoriesPage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "aboutCommunityStoriesPage"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      "introCount": count(introParagraphs),
      voicesHeading,
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
