/**
 * Seeds the resources singleton (_id: resources).
 *
 * Uploads 4 images (hero + 3 section images), then writes the doc verbatim
 * from the content currently hardcoded in src/components/resources/*.astro.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-resources.ts
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
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: assetId },
  };
}

function block(text: string, style: 'normal' | 'h2' | 'h3' = 'normal', listItem?: 'bullet' | 'number') {
  const b: Record<string, unknown> = {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 14),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 14), text, marks: [] }],
  };
  if (listItem) {
    b.listItem = listItem;
    b.level = 1;
  }
  return b;
}

async function main() {
  console.log('Uploading images...');
  const heroAsset = await uploadImage('/images/hero/resources.jpg');
  const whyMattersAsset = await uploadImage('/images/sections/resources-why-matters.jpg');
  const commonStrugglesAsset = await uploadImage('/images/sections/resources-common-struggles.jpg');
  const signsAsset = await uploadImage('/images/sections/resources-signs.jpg');
  console.log('  hero:', heroAsset);
  console.log('  whyMatters:', whyMattersAsset);
  console.log('  commonStruggles:', commonStrugglesAsset);
  console.log('  signs:', signsAsset);

  const doc = {
    _id: 'resources',
    _type: 'resources',

    hero: {
      heading: 'You Are Not Alone',
      subtitle:
        "Struggling with anxiety, depression, trauma, or emotional overwhelm can feel isolating. It doesn't have to be. Jewmanity stands in advocacy, compassion, and connection for those navigating mental health challenges.",
      backgroundImage: imageRef(heroAsset),
    },

    advocacySectionHeading: 'What We Advocate For',
    advocacySectionSubtitle: 'Your generosity creates tangible change in the lives of those healing from trauma.',
    advocacyPillars: [
      {
        _key: 'pillar-1',
        number: '1',
        title: 'Reducing Stigma',
        description:
          'Mental health challenges are not personal failures. They are human experiences that deserve compassion and understanding.',
      },
      {
        _key: 'pillar-2',
        number: '2',
        title: 'Encouraging Early Support',
        description:
          'The earlier someone seeks help, the better the outcomes. We advocate for proactive care rather than crisis-only intervention.',
      },
      {
        _key: 'pillar-3',
        number: '3',
        title: 'Trauma-Informed Healing',
        description:
          'For soldiers, families, and civilians alike, trauma can manifest long after the event. Healing is not linear, and recovery is possible.',
      },
      {
        _key: 'pillar-4',
        number: '4',
        title: 'Community-Based Care',
        description:
          'Isolation fuels suffering, which can further exacerbate mental health issues. Community connection fosters resilience.',
      },
    ],

    whyMattersHeading: 'Why This Matters',
    whyMattersBody: [
      block(
        'Mental health struggles are more common than we often realize. Within Jewish communities and beyond, many people suffer silently. Cultural stigma, fear of judgment, and lack of accessible resources often prevent individuals from seeking help.',
      ),
      block('1 in 5 adults experiences a mental health condition each year', 'normal', 'bullet'),
      block('Anxiety disorders affect over 40 million adults in the United States', 'normal', 'bullet'),
      block('Trauma exposure significantly increases risk of depression and PTSD', 'normal', 'bullet'),
    ],
    whyMattersPullQuote: {
      quote: 'Our belief is simple: Mental health matters. Seeking support is a strength.',
    },
    whyMattersImage: imageRef(whyMattersAsset),

    commonStrugglesHeading: 'Common Struggles We Recognize',
    commonStruggles: [
      'Depression',
      'Anxiety and panic disorders',
      'PTSD and trauma-related symptoms',
      'Grief and loss',
      'Burnout and emotional exhaustion',
      'Survivor\u2019s guilt',
      'Adjustment challenges',
    ],
    medicalDisclaimer:
      'Jewmanity is not a medical provider. If you are experiencing a crisis or immediate danger, please contact emergency services or a licensed mental health professional.',
    commonStrugglesImage: imageRef(commonStrugglesAsset),

    signsSectionHeading: 'Signs You Might Need Additional Support',
    signsBody: [
      block('This section helps you self-identify without self-diagnosing.'),
      block('Persistent sadness lasting more than two weeks', 'normal', 'bullet'),
      block('Sleep disruption or extreme fatigue', 'normal', 'bullet'),
      block('Withdrawal from friends or family', 'normal', 'bullet'),
      block('Feeling hopeless or numb', 'normal', 'bullet'),
      block('Increased irritability or panic', 'normal', 'bullet'),
      block('Difficulty concentrating', 'normal', 'bullet'),
      block('Loss of interest in previously enjoyed activities', 'normal', 'bullet'),
    ],
    signsCallout:
      'If these feel familiar, speaking with a licensed therapist or mental health provider can be a powerful first step.',
    signsSectionImage: imageRef(signsAsset),

    crisisSectionHeading: 'Immediate Help & Crisis Resources',
    crisisIntroParagraphs: [
      'If you or someone you love is in immediate danger, please contact emergency services right away. If you are struggling and unsure where to turn, confidential support is available through the resources listed here.',
      'You do not have to face this moment alone. Help is available, and reaching out can be the first step toward relief.',
    ],
    crisisResources: [
      {
        _key: 'us-988',
        name: '988 Suicide & Crisis Lifeline',
        description: 'Call or Text 988',
        phone: '988',
        region: 'United States',
      },
      {
        _key: 'us-911',
        name: '911 for immediate emergency',
        phone: '911',
        region: 'United States',
      },
      {
        _key: 'us-crisis-text',
        name: 'Crisis Text Line',
        description: 'Text HOME to 741741',
        phone: '741741',
        region: 'United States',
      },
    ],
  };

  console.log('\nWriting resources doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "resources"][0]{
      _id,
      "heroHeading": hero.heading,
      advocacySectionHeading,
      "pillarCount": count(advocacyPillars),
      whyMattersHeading,
      "whyMattersBlocks": count(whyMattersBody),
      "whyMattersPullQuote": whyMattersPullQuote.quote,
      "hasWhyMattersImage": defined(whyMattersImage),
      commonStrugglesHeading,
      "struggleCount": count(commonStruggles),
      medicalDisclaimer,
      signsSectionHeading,
      "signsBlocks": count(signsBody),
      crisisSectionHeading,
      "crisisParaCount": count(crisisIntroParagraphs),
      "crisisResourceCount": count(crisisResources)
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
