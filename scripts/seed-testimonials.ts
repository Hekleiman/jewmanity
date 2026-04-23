/**
 * One-time script to seed Sanity with real testimonial data + photos.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-testimonials.ts
 *
 * Requires the SANITY_API_TOKEN env var (a Sanity write-token for project 9pc3wgri).
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('Error: SANITY_API_TOKEN env var is required.');
  console.error('Usage: SANITY_API_TOKEN=<token> npx tsx scripts/seed-testimonials.ts');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

interface TestimonialData {
  authorName: string;
  authorRole: string;
  context: string;
  slug: string;
  order: number;
  quote: string;
  excerpt: string;
  photoFile: string;
}

const testimonials: TestimonialData[] = [
  {
    authorName: 'Matamba Lassan',
    authorRole: 'Retreat Participant',
    context: 'headsup',
    slug: 'matamba-lassan',
    order: 1,
    quote:
      "My name is Matamba Lassan. I'm 23 years old, recently married. After October 7th, I lost my faith \u2014 especially in myself. Through my journey with the Jewmanity organization, we spent a month in the U.S. healing, sharing, and being supported by professional care. This journey helped me believe in myself again. When I came back to Israel, I finally knew how to move forward. I want to say thank you to Jewmanity for everything. Keep going. Am Israel Chai. Thank you for everything.",
    excerpt:
      "After October 7th, I lost my faith \u2014 especially in myself. Through Jewmanity, I spent a month in the U.S. healing and being supported by professional care. This journey helped me believe in myself again.",
    photoFile: 'testimonial-matamba.png',
  },
  {
    authorName: 'Dahlia',
    authorRole: 'Volunteer',
    context: 'volunteer',
    slug: 'dahlia',
    order: 2,
    quote:
      "I have no words to express my appreciation for Jewmanity, the amazing organization dedicated to providing support for soldiers who live with PTSD after going through war. Every one of them carries a whole life story. They come from all ages and backgrounds \u2014 men and women, married and single \u2014 and each one of them matters deeply to me. As a volunteer, I don't do anything big or heroic. Sometimes I cook a meal or two for them. Sometimes I help during our surfing activities. Simple things. But the way they appreciate it touches me more than I can explain. I give them my heart, my time, and my presence, and somehow I receive so much back. We meet a couple of groups each year, and every time I'm reminded how powerful human connection can be. Being with them, listening, laughing, supporting them through difficult moments \u2014 I enjoy every single minute. The joy of giving to them feels endless, and I'm grateful to be part of their journey.",
    excerpt:
      "I give them my heart, my time, and my presence, and somehow I receive so much back. The joy of giving to them feels endless, and I'm grateful to be part of their journey.",
    photoFile: 'testimonial-dahlia.png',
  },
];

async function uploadImage(filename: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } }> {
  const filePath = resolve(process.cwd(), filename);
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/png',
  });
  console.log(`  Uploaded ${filename} -> ${asset._id}`);
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  };
}

async function main() {
  console.log(`Seeding testimonials into ${projectId}/${dataset}...\n`);

  for (const t of testimonials) {
    console.log(`Processing: ${t.authorName}`);

    const imageRef = await uploadImage(t.photoFile);

    const doc = {
      _type: 'testimonial' as const,
      authorName: t.authorName,
      authorRole: t.authorRole,
      context: t.context,
      slug: { _type: 'slug' as const, current: t.slug },
      order: t.order,
      quote: t.quote,
      excerpt: t.excerpt,
      authorImage: imageRef,
    };

    const created = await client.create(doc);
    console.log(`  Created document: ${created._id}\n`);
  }

  console.log('Done! Testimonials seeded successfully.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
