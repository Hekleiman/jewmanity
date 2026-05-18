/**
 * Seeds the communityRecipesPage singleton (_id: communityRecipesPage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-community-recipes-page.ts
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
  const heroAsset = await uploadImage('/images/hero/recipes.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'communityRecipesPage',
    _type: 'communityRecipesPage',

    hero: {
      heading: 'Recipes Inspired by Our Heritage',
      subtitle: 'Where tradition, memory, and togetherness gather around the table',
      backgroundImage: imageRef(heroAsset),
    },

    introParagraphs: [
      {
        _key: 'intro-1',
        text: "Food is more than sustenance. It carries the weight of our stories, the warmth of our homes, and the continuity of who we are. In Jewish life, recipes are passed down like heirlooms, each dish a thread connecting us to those who came before and those who will come after. Whether it's the challah your grandmother braided every Friday, the soup that grounded you during hard times, or the dish you now make for your own loved ones, food speaks a language of care, comfort, and belonging.",
        italic: false,
      },
      {
        _key: 'intro-2',
        text: 'Here, we celebrate the recipes that have nourished us, body and soul, and the moments of connection they create. These are not just instructions for cooking; they are invitations to remember, to gather, and to carry forward the traditions that make us whole.',
        italic: true,
      },
    ],

    ctaHeading: 'Share Your Recipe, Share Your Story',
    ctaSubtitle:
      "We believe that every recipe has a story worth sharing, a memory of someone you love, a tradition you've carried forward, or a dish that brings comfort when nothing else will. Your contribution helps create a shared table where we can all find nourishment and belonging.",
    ctaPrimaryButton: { text: 'Join Our Table', href: '/get-involved/contact' },
  };

  console.log('\nWriting communityRecipesPage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "communityRecipesPage"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      "introCount": count(introParagraphs),
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
