/**
 * Deletes all existing communityStory documents from Sanity.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/cleanup-community-stories.ts
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
  const stories = await client.fetch(
    '*[_type == "communityStory"]{ _id, title }'
  );
  console.log(`Found ${stories.length} existing community stories:`);
  stories.forEach((s: { _id: string; title?: string }) =>
    console.log(`  - ${s.title || 'Untitled'} (${s._id})`)
  );

  for (const s of stories) {
    await client.delete(s._id);
    console.log(`  Deleted: ${s._id}`);
  }
  console.log('\nAll old community stories deleted.');
}

cleanup().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
