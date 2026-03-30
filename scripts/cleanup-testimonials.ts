/**
 * Deletes all existing testimonial documents from Sanity.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/cleanup-testimonials.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('Error: SANITY_WRITE_TOKEN env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function cleanup() {
  const testimonials = await client.fetch(
    '*[_type == "testimonial"]{ _id, authorName }'
  );
  console.log(`Found ${testimonials.length} existing testimonials:`);
  testimonials.forEach((t: { _id: string; authorName?: string }) =>
    console.log(`  - ${t.authorName || 'Unknown'} (${t._id})`)
  );

  for (const t of testimonials) {
    await client.delete(t._id);
    console.log(`  Deleted: ${t._id}`);
  }
  console.log('\nAll old testimonials deleted.');
}

cleanup().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
