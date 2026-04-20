/**
 * Seeds the contactPage singleton (_id: contactPage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-contact-page.ts
 */

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

const token = process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('Error: SANITY_API_TOKEN (or SANITY_WRITE_TOKEN) env var required.');
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
  const heroAsset = await uploadImage('/images/hero/contact.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'contactPage',
    _type: 'contactPage',
    hero: {
      heading: 'Get in Touch',
      subtitle:
        'We welcome your questions, stories, and inquiries. This is a safe space for open conversation and meaningful connection.',
      backgroundImage: imageRef(heroAsset),
    },
    introText:
      "We're here to listen and support you. Whether you have questions about our programs, need support resources, are interested in partnership opportunities, or simply want to connect, please reach out. All inquiries are handled with respect and confidentiality.",
    formHeading: 'Contact Us',
    privacyNote: 'Your message will be kept private and treated with care.',
    otherWaysHeading: 'Other Ways to Connect',
    otherWaysCards: [
      {
        _key: 'card-involved',
        _type: 'contactCard',
        icon: 'people',
        title: 'Get Involved',
        description: 'Join our community and engage in fostering healing and connection.',
        linkText: 'Learn More',
        href: '/get-involved/volunteer',
      },
      {
        _key: 'card-resources',
        _type: 'contactCard',
        icon: 'book',
        title: 'Resources',
        description: 'Access helpful materials, guides, and information for your journey.',
        linkText: 'Learn More',
        href: '/resources',
      },
      {
        _key: 'card-support',
        _type: 'contactCard',
        icon: 'heart',
        title: 'Support Healing',
        description: 'Make a difference by supporting our mission of healing and resilience.',
        linkText: 'Learn More',
        href: '/donate',
      },
    ],
  };

  console.log('\nWriting contactPage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "contactPage"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      introText,
      formHeading,
      privacyNote,
      otherWaysHeading,
      "cardCount": count(otherWaysCards)
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
