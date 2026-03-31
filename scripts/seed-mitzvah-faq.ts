/**
 * Seeds Sanity with 7 FAQ items for the Mitzvah Project page.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-mitzvah-faq.ts
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

const faqs = [
  {
    question: 'How early should we start the project?',
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'We recommend starting 6\u201312 months before your bar or bat mitzvah date. This gives you time to learn, fundraise, and potentially participate in a soldier visit. Contact us anytime \u2014 we\u2019ll work with your timeline.',
          },
        ],
      },
    ],
    context: 'mitzvah',
    orderRank: 1,
  },
  {
    question: 'Does my child need to be in San Diego to participate?',
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'No! While the volunteer experience with soldiers happens in San Diego, the fundraising and awareness paths can be done from anywhere. We\u2019ll work with your family to find the best fit.',
          },
        ],
      },
    ],
    context: 'mitzvah',
    orderRank: 2,
  },
  {
    question: 'Will Jewmanity help us set up a fundraising page?',
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Absolutely. Your Jewmanity mentor will help you create a personalized fundraising page with your name, photo, and story. We\u2019ll also help you craft a compelling message that moves people to give.',
          },
        ],
      },
    ],
    context: 'mitzvah',
    orderRank: 3,
  },
  {
    question: 'Does this project count as an official mitzvah project for our synagogue?',
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'In most cases, yes. Jewmanity\u2019s program includes community service, learning, and a presentation component \u2014 the three elements most synagogues require. We\u2019re happy to provide documentation or speak with your rabbi.',
          },
        ],
      },
    ],
    context: 'mitzvah',
    orderRank: 4,
  },
  {
    question: "What if my child is shy and doesn't want to do public presentations?",
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'That\u2019s completely okay. Presentations can be as small as sharing at a family Shabbat dinner or writing a reflection piece. We meet every child where they are and help them find a way to share that feels comfortable.',
          },
        ],
      },
    ],
    context: 'mitzvah',
    orderRank: 5,
  },
  {
    question: 'Is there a cost to participate?',
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'There is no cost to participate in the Jewmanity Mitzvah Project. The program is free \u2014 all funds raised go directly to Jewmanity\u2019s healing programs and retreats.',
          },
        ],
      },
    ],
    context: 'mitzvah',
    orderRank: 6,
  },
  {
    question: 'Can siblings or friends join the project too?',
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Yes! We love group projects. Siblings, friends, or even an entire Hebrew school class can participate together. Group projects often raise more and create a stronger sense of shared purpose.',
          },
        ],
      },
    ],
    context: 'mitzvah',
    orderRank: 7,
  },
];

async function main() {
  console.log('Seeding Mitzvah Project FAQ items into 9pc3wgri/production...\n');

  for (const faq of faqs) {
    console.log(`Creating: ${faq.question}`);
    const created = await client.create({ _type: 'faqItem', ...faq });
    console.log(`  Created: ${created._id}\n`);
  }

  console.log('Done! 7 Mitzvah Project FAQ items seeded.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
