/**
 * Seeds Sanity with 6 recommended article documents.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-articles.ts
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

const articles = [
  {
    title: 'We Need 1 Million More Jews on Social Media',
    publication: 'Times of Israel',
    date: 'January 2026',
    url: 'https://blogs.timesofisrael.com/we-need-1-million-more-jews-on-social-media/',
    description:
      'Rabbi Elchanan Poupko makes the case for a million Jews to actively join social media \u2014 not to argue politics, but to share Jewish food, history, innovation, and pride. The goal: change what the next generation sees before radicalization takes hold.',
    order: 1,
  },
  {
    title: 'How Teens Have a Real Chance of Fighting Antisemitism',
    publication: 'eJewish Philanthropy',
    date: 'March 2026',
    url: 'https://ejewishphilanthropy.com/how-teens-have-a-real-chance-of-fighting-antisemitism/',
    description:
      "A look at the New York Jewish Teen Summit and why today's teens \u2014 brave, tech-savvy, and unafraid to speak \u2014 may be the most powerful force against antisemitism. Features teen-created platforms like StrongerVoices that turn isolation into community.",
    order: 2,
  },
  {
    title: 'On Fighting Antisemitism and the American Dream',
    publication: 'Jewish Journal',
    date: 'February 2026',
    url: 'https://jewishjournal.com/commentary/opinion/387234/on-fighting-antisemitism-and-the-american-dream/',
    description:
      'An address at George Washington University offering a pragmatic, optimistic message: antisemitism cannot be eradicated, but it can be confronted, exposed, and marginalized. Three reasons for hope in the fight ahead.',
    order: 3,
  },
  {
    title: 'How to Respond to Antisemitism',
    publication: 'American Jewish Committee',
    date: '2025',
    url: 'https://www.ajc.org/respond-to-antisemitism',
    description:
      'A comprehensive guide covering what individuals, governments, social media companies, and institutions can do to counter antisemitism. Includes practical steps for reporting, advocacy, and community action.',
    order: 4,
  },
  {
    title: 'Global Guidelines for Countering Antisemitism',
    publication: 'U.S. Department of State',
    date: 'February 2026',
    url: 'https://www.state.gov/global-guidelines-for-countering-antisemitism',
    description:
      'International best practices adopted by governments and special envoys worldwide for monitoring and combating antisemitism through education, legislation, and cross-society collaboration.',
    order: 5,
  },
  {
    title: 'Addressing Antisemitism Through Education',
    publication: 'UNESCO',
    date: '2026',
    url: 'https://www.unesco.org/en/education-addressing-antisemitism',
    description:
      "UNESCO's global initiative training educators and policymakers to recognize and respond to antisemitism in schools. Over 1,300 educators trained across Europe since 2023, with expanding programs in the U.S. and Australia.",
    order: 6,
  },
];

async function main() {
  console.log('Seeding recommended articles into 9pc3wgri/production...\n');

  for (const a of articles) {
    console.log(`Creating: ${a.title}`);
    const created = await client.create({ _type: 'recommendedArticle', ...a });
    console.log(`  Created: ${created._id}\n`);
  }

  console.log('Done! 6 recommended articles seeded.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
