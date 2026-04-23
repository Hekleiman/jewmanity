/**
 * Seeds the donatePage singleton (_id: donatePage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-donate-page.ts
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
  console.log('Uploading 2 images...');
  const heroAsset = await uploadImage('/images/hero/donate.jpg');
  const whyGiveAsset = await uploadImage('/images/sections/donate-why-give.jpg');
  console.log('  hero:', heroAsset);
  console.log('  whyGive:', whyGiveAsset);

  const doc = {
    _id: 'donatePage',
    _type: 'donatePage',

    hero: {
      heading: 'Give Today. Create Lasting Impact.',
      subtitle:
        'Your donation directly funds healing retreats, community care, and trauma-informed programs like Heads Up\u2014supporting Israelis and Jewish individuals on their journey to recovery.',
      backgroundImage: imageRef(heroAsset),
    },
    heroTaxNote:
      'We are an official tax exempt organization with a 501(c)(3) classification. All donors can deduct contributions.',

    impactHeading: 'Every Donation Makes an Impact',
    impactSubtitle: 'Your generosity creates tangible change in the lives of those healing from trauma.',
    impactCards: [
      {
        _key: 'impact-therapy',
        _type: 'donateImpactCard',
        icon: 'heart',
        title: 'Therapy & Healing Retreats',
        description:
          'Comprehensive rehabilitation programs in San Diego, offering evidence-based therapy, peer support, and healing experiences in a safe, compassionate environment.',
      },
      {
        _key: 'impact-community',
        _type: 'donateImpactCard',
        icon: 'people',
        title: 'Community and Peer Support',
        description:
          'Building lasting connections through group sessions, shared experiences, and ongoing community care that extends beyond the retreat.',
      },
      {
        _key: 'impact-antisemitism',
        _type: 'donateImpactCard',
        icon: 'shield',
        title: 'Resources to Fight Antisemitism',
        description:
          'Empowering communities with knowledge, tools, and resources to recognize, address, and advocate against antisemitism while fostering resilience.',
      },
    ],

    whyGiveImage: imageRef(whyGiveAsset),
    whyGiveHeading: 'Why Give to Jewmanity',
    whyGiveValues: [
      {
        _key: 'value-dignity',
        _type: 'whyGiveValue',
        title: 'Dignity in Healing',
        description:
          "We honor each individual's journey with compassion and respect, creating spaces where healing happens on their terms.",
      },
      {
        _key: 'value-resilience',
        _type: 'whyGiveValue',
        title: 'Building Resilience',
        description:
          'Every retreat, every therapy session, every moment of connection is designed to restore agency, hope, and a path forward.',
      },
      {
        _key: 'value-empowerment',
        _type: 'whyGiveValue',
        title: 'Empowerment Through Care',
        description:
          'Every retreat, every therapy session, every moment of connection is designed to restore agency, hope, and a path forward.',
      },
    ],
    whyGiveClosingText:
      "When you give to Jewmanity, you're not just funding programs\u2014you're investing in human potential and the power of community to heal.",

    costBreakdownHeading: 'How Your Donation is Used',
    costBreakdownSubtitle:
      "We believe in complete transparency. Here's a breakdown of the average cost to support one participant through a healing retreat.",
    costBreakdown: [
      {
        _key: 'cost-flights',
        icon: '\u2708\uFE0F',
        title: 'International Flights',
        description: 'Round-trip travel from Israel to San Diego',
        amount: '$1,200',
      },
      {
        _key: 'cost-housing',
        icon: '\uD83C\uDFE0',
        title: 'Housing & Accommodations',
        description: 'Safe, comfortable lodging for the entire duration',
        amount: '$800',
      },
      {
        _key: 'cost-therapy',
        icon: '\uD83D\uDC8A',
        title: 'Therapy & Clinical Support',
        description: 'Professional trauma therapy, mindfulness, and counseling',
        amount: '$1,500',
      },
      {
        _key: 'cost-meals',
        icon: '\uD83C\uDF7D\uFE0F',
        title: 'Meals & Nutrition',
        description: 'Nourishing meals throughout the program',
        amount: '$400',
      },
      {
        _key: 'cost-activities',
        icon: '\uD83C\uDFAF',
        title: 'Program Activities & Logistics',
        description: 'Workshops, group sessions, and recreational experiences',
        amount: '$600',
      },
    ],
    costBreakdownTotalLabel: 'Average Cost Per Participant',
    costBreakdownTotalAmount: '$4,500',
    costBreakdownDisclaimer:
      'Responsible Stewardship: Every dollar is carefully allocated to maximize impact. Administrative costs are kept minimal, ensuring your contribution directly supports healing programs.',

    faqHeading: 'Frequently Asked Questions',
    faqSubtitle: "Have questions? We're here to help.",
    faqContext: 'donate',

    ctaHeading: 'Healing Happens Because of You',
    ctaDescription:
      'Your compassion and generosity create pathways to recovery, resilience, and hope. Together, we build a stronger, more supported community.',
    ctaContactPrompt: 'Questions about donating or want to discuss giving options?',
    ctaContactLink: {
      text: 'Contact us at donations@jewmanity.org',
      href: '/get-involved/contact',
    },
  };

  console.log('\nWriting donatePage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "donatePage"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      "hasTaxNote": defined(heroTaxNote),
      impactHeading,
      "impactCardCount": count(impactCards),
      whyGiveHeading,
      "whyGiveValueCount": count(whyGiveValues),
      costBreakdownHeading,
      "costBreakdownCount": count(costBreakdown),
      costBreakdownTotalAmount,
      faqHeading,
      ctaHeading,
      "ctaLinkText": ctaContactLink.text
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
