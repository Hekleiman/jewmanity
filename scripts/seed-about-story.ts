/**
 * Seeds the aboutStory singleton (_id: aboutStory).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-about-story.ts
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

function block(text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 14),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 14), text, marks: [] }],
  };
}

async function main() {
  console.log('Uploading hero image...');
  const heroAsset = await uploadImage('/images/hero/about-story.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'aboutStory',
    _type: 'aboutStory',

    hero: {
      heading: 'Creating space for healing, connection, and resilience',
      subtitle:
        'Supporting Jewish and Israeli communities navigating trauma, PTSD, and cultural stress with compassion and care.',
      backgroundImage: imageRef(heroAsset),
    },

    storyHeading: 'Our Story',
    storyBody: [
      block(
        'Jewmanity was founded in response to a growing need: the unique mental health challenges faced by Jewish and Israeli communities, particularly those impacted by antisemitic violence, intergenerational trauma, and the ongoing effects of conflict.',
      ),
      block(
        'For too long, many individuals within our community have carried their pain in silence\u2014unsure where to turn, afraid of being misunderstood, or unable to access culturally sensitive support. We recognized that healing requires more than clinical intervention. It requires community, connection, and the knowledge that you are not alone.',
      ),
      block(
        'Our approach is grounded in trauma-informed care that honors the complexity of Jewish identity and experience. We understand that trauma does not exist in a vacuum\u2014it is shaped by history, culture, family, and faith. And so, our work meets people where they are, with the respect and awareness their stories deserve.',
      ),
      block(
        'Since our founding, Jewmanity has grown into a trusted network of support, education, and healing. We are counselors, survivors, advocates, and community members who believe deeply in the power of shared experience and the possibility of recovery.',
      ),
    ],

    valuesHeading: 'Our Values & Approach',
    valuesSubtitle: 'Guided by principles that honor the complexity of trauma and the strength of our community.',
    values: [
      {
        _key: 'v-respect',
        _type: 'aboutValueCard',
        icon: 'star',
        title: 'Respect',
        description: 'We honor the dignity and humanity in every person we serve.',
      },
      {
        _key: 'v-curiosity',
        _type: 'aboutValueCard',
        icon: 'search',
        title: 'Curiosity',
        description:
          'Our approach to healing is rooted in the recognition that we are learning alongside each other.',
      },
      {
        _key: 'v-compassion',
        _type: 'aboutValueCard',
        icon: 'heart',
        title: 'Compassion',
        description:
          'The literal definition of compassion is "to suffer together." We aim to reduce the suffering through shared experiencing.',
      },
      {
        _key: 'v-awareness',
        _type: 'aboutValueCard',
        icon: 'grid',
        title: 'Awareness',
        description:
          'We promote mindfulness and understanding of the diverse experiences and challenges faced by those we serve.',
      },
      {
        _key: 'v-kindness',
        _type: 'aboutValueCard',
        icon: 'smiley',
        title: 'Kindness',
        description:
          'We lead with warmth, joy, and intentional care, creating moments that are heartfelt and memorable.',
      },
      {
        _key: 'v-integrity',
        _type: 'aboutValueCard',
        icon: 'shield',
        title: 'Integrity',
        description: 'We maintain the highest standards of honesty and transparency in all our actions.',
      },
      {
        _key: 'v-connection',
        _type: 'aboutValueCard',
        icon: 'link',
        title: 'Connection',
        description: 'We foster genuine relationships through grassroots connection and experiences.',
      },
      {
        _key: 'v-responsibility',
        _type: 'aboutValueCard',
        icon: 'clipboard',
        title: 'Responsibility',
        description:
          'Acknowledge the commitment to ensure that Jews are seen, treated and respected as full members of the human family, and to stand up for that truth in all spaces.',
      },
      {
        _key: 'v-resilience',
        _type: 'aboutValueCard',
        icon: 'growth',
        title: 'Resilience',
        description: 'We support strength, growth, and the capacity to heal over time.',
      },
    ],

    ctaHeading: 'Join Us in Supporting Healing',
    ctaDescription:
      'Whether through volunteering, donating, or simply spreading awareness, your support helps us create a safer, more connected community for those navigating trauma.',
    ctaPrimaryButton: { text: 'Support Healing', href: '/donate' },
    ctaSecondaryButton: { text: 'Become a Volunteer', href: '/get-involved/volunteer' },
  };

  console.log('\nWriting aboutStory doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "aboutStory"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      storyHeading,
      "storyBlocks": count(storyBody),
      valuesHeading,
      valuesSubtitle,
      "valuesCount": count(values),
      ctaHeading,
      "primary": ctaPrimaryButton.text,
      "secondary": ctaSecondaryButton.text
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
