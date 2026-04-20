/**
 * Seeds the shopPage singleton (_id: shopPage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-shop-page.ts
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
  const heroAsset = await uploadImage('/images/hero/shop.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'shopPage',
    _type: 'shopPage',
    hero: {
      heading: 'Shop with Purpose',
      subtitle: "Wear your values. Every purchase directly supports Jewmanity's healing programs.",
      backgroundImage: imageRef(heroAsset),
    },
    heroCta: { text: 'Shop Our Collection', href: '#product-grid' },

    impactHeading: 'Every Purchase Makes an Impact',
    introDescription:
      "When you shop with Jewmanity, you're not just getting quality merchandise\u2014you're directly funding healing retreats, peer support groups, and ongoing care for individuals and families in our community. Your purchase creates lasting change and supports those on their healing journey.",
    impactIcons: [
      { _key: 'icon-healing', _type: 'shopImpactIcon', icon: 'heart', label: 'Healing Retreats' },
      { _key: 'icon-community', _type: 'shopImpactIcon', icon: 'people', label: 'Community Support' },
      { _key: 'icon-care', _type: 'shopImpactIcon', icon: 'sparkles', label: 'Ongoing Care' },
    ],

    ctaHeading: 'Support Healing Through Everyday Actions',
    ctaSubtitle: "Your choice to shop with purpose makes a real difference in someone's healing journey.",
    ctaPrimaryButton: { text: 'Learn About Heads Up', href: '/programs/heads-up' },
  };

  console.log('\nWriting shopPage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "shopPage"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      "heroCtaText": heroCta.text,
      impactHeading,
      "introLen": length(introDescription),
      "iconCount": count(impactIcons),
      ctaHeading,
      "ctaButtonText": ctaPrimaryButton.text
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
