/**
 * Seeds the programsPastRetreatsPage singleton (_id: programsPastRetreatsPage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-programs-past-retreats-page.ts
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
  const heroAsset = await uploadImage('/images/hero/past-retreats.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'programsPastRetreatsPage',
    _type: 'programsPastRetreatsPage',

    hero: {
      heading: 'Past Retreats',
      subtitle:
        'Jewmanity creates safe, restorative spaces where Israeli soldiers and their loved ones find healing, connection, and renewed hope.',
      backgroundImage: imageRef(heroAsset),
    },

    gridHeading: 'Stories of courage, connection, and healing',
    gridSubtitle:
      'These retreats are part of the Heads Up × Jewmanity collaboration, a comprehensive program designed to support Israeli soldiers and their loved ones experiencing PTSD and ongoing trauma. Through shared experiences in nature and community, participants find healing, build lasting connections, and create a foundation for long-term recovery and growth.',

    testimonialsHeading: 'What Our Attendees Say',
    testimonialsSubtitle: 'Honest reflections from those who found healing, connection, and renewed strength through Heads Up.',

    ctaHeading: 'Healing Happens Together',
    ctaSubtitle:
      'These retreats continue to create space for healing, connection, and transformation. Your support helps us expand our reach and serve more individuals on their journey toward recovery.',
    ctaPrimaryButton: { text: 'Learn More About Heads Up', href: '/programs/heads-up' },
  };

  console.log('\nWriting programsPastRetreatsPage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "programsPastRetreatsPage"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      gridHeading,
      testimonialsHeading,
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
