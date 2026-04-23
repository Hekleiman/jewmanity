/**
 * Seeds the singleton siteSettings doc.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-site-settings.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('Error: SANITY_API_TOKEN env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const siteSettingsDoc = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  orgName: 'Jewmanity',
  ein: '99-4219099',
  socialLinks: {
    facebook: 'https://www.facebook.com/profile.php?id=61577185790846',
    instagram: 'https://www.instagram.com/jewmanity_',
  },
  copyrightText: 'A registered 501(c)(3) nonprofit organization.',
};

async function main() {
  console.log('Seeding siteSettings singleton (_id: siteSettings)...\n');

  const existing = await client.fetch(`*[_id == "siteSettings"][0]{_id}`);
  console.log(existing ? 'Existing doc found — will use createOrReplace.' : 'No existing doc — creating fresh.');

  const result = await client.createOrReplace(siteSettingsDoc);
  console.log(`\nWrote: ${result._id}`);

  const verify = await client.fetch(
    `*[_id == "siteSettings"][0]{_id, orgName, ein, socialLinks, copyrightText, footerTagline}`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
