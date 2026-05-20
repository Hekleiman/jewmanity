/**
 * Seeds the new siteSettings fields and the navigation singleton with the
 * values currently hardcoded in the codebase. Idempotent.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-foundation-singletons.ts
 */

import { createClient } from '@sanity/client';

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

async function patchSiteSettings() {
  console.log('Patching siteSettings with new defaults...');
  await client
    .patch('siteSettings')
    .setIfMissing({
      foundingYear: '2019',
      defaultPageTitle: 'Jewmanity | Supporting Healing & Resilience',
      defaultPageDescription:
        'Jewmanity is a 501(c)(3) nonprofit supporting mental health and healing for Jewish and Israeli communities through retreats, peer support, education, and ongoing care.',
      address: {
        addressLocality: 'San Diego',
        addressRegion: 'CA',
        addressCountry: 'US',
      },
      legalLinks: [
        { _key: 'privacy', label: 'Privacy Policy', href: '/privacy' },
        { _key: 'terms', label: 'Terms of Service', href: '/terms' },
        { _key: 'disclosures', label: 'Nonprofit Disclosures', href: '/nonprofit-disclosures' },
      ],
      footerDisclaimer:
        'All donations are tax-deductible to the fullest extent allowed by law.',
      givebutterAccountId: 'qGMyp9PcvINJwyvd',
      givebutterWidgetId: 'g8MJdP',
    })
    .commit();
  console.log('  done.');
}

async function seedNavigation() {
  console.log('Seeding navigation singleton...');
  const doc = {
    _id: 'navigation',
    _type: 'navigation',
    items: [
      { _key: 'home', label: 'Home', href: '/' },
      {
        _key: 'about',
        label: 'About',
        href: '/about/story',
        children: [
          { _key: 'about-story', label: 'Our Story', href: '/about/story' },
          { _key: 'about-team', label: 'Our Team', href: '/about/team' },
        ],
      },
      {
        _key: 'programs',
        label: 'Programs',
        href: '/programs/heads-up',
        children: [
          { _key: 'programs-headsup', label: 'Heads Up', href: '/programs/heads-up' },
          {
            _key: 'programs-past',
            label: 'Past Retreats',
            href: '/programs/past-retreats',
          },
        ],
      },
      {
        _key: 'community',
        label: 'Community',
        href: '/community/fighting-antisemitism',
        children: [
          {
            _key: 'community-stories',
            label: 'Community Stories',
            href: '/about/community-stories',
          },
          {
            _key: 'community-antisemitism',
            label: 'Fighting Antisemitism',
            href: '/community/fighting-antisemitism',
          },
          { _key: 'community-recipes', label: 'Recipes', href: '/community/recipes' },
        ],
      },
      {
        _key: 'getinvolved',
        label: 'Get Involved',
        href: '/get-involved/volunteer',
        children: [
          {
            _key: 'gi-volunteer',
            label: 'Volunteer',
            href: '/get-involved/volunteer',
          },
          {
            _key: 'gi-mitzvah',
            label: 'Mitzvah Project',
            href: '/get-involved/mitzvah-project',
          },
          { _key: 'gi-contact', label: 'Contact', href: '/get-involved/contact' },
        ],
      },
      { _key: 'resources', label: 'Resources', href: '/resources' },
      { _key: 'shop', label: 'Shop', href: '/shop' },
    ],
    ctaButton: { text: 'Support Healing', href: '/donate' },
  };

  const existing = await client.fetch(`*[_id == "navigation"][0]{_id}`);
  console.log(existing ? '  existing doc found, replacing.' : '  no existing doc, creating.');
  const res = await client.createOrReplace(doc);
  console.log(`  wrote: ${res._id}`);
}

async function main() {
  await patchSiteSettings();
  await seedNavigation();

  const verify = await client.fetch(
    `{
      "siteSettings": *[_id == "siteSettings"][0]{
        orgName, ein, foundingYear, defaultPageTitle, defaultPageDescription,
        address, "legalLinkCount": count(legalLinks), footerDisclaimer,
        givebutterAccountId, givebutterWidgetId
      },
      "navigation": *[_id == "navigation"][0]{
        "itemCount": count(items),
        items[]{ label, href, "childCount": count(children) },
        ctaButton
      }
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
