/**
 * Seeds the homepage singleton (_id: homepage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-homepage.ts
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
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: assetId } };
}

async function main() {
  console.log('Uploading 5 images (hero + 4 program cards)...');
  const heroAsset = await uploadImage('/images/hero/homepage.jpg');
  const card1 = await uploadImage('/images/cards/how-we-help-1.jpg');
  const card2 = await uploadImage('/images/cards/how-we-help-2.jpg');
  const card3 = await uploadImage('/images/cards/how-we-help-3.jpg');
  const card4 = await uploadImage('/images/cards/how-we-help-4.jpg');
  console.log('  hero:', heroAsset);
  console.log('  card1:', card1);
  console.log('  card2:', card2);
  console.log('  card3:', card3);
  console.log('  card4:', card4);

  const doc = {
    _id: 'homepage',
    _type: 'homepage',

    heroHeading: 'Supporting healing and resilience for the Jewish Community',
    heroSubtitle:
      'Jewmanity provides compassionate mental health support for Israelis and Jewish individuals navigating PTSD and trauma.',
    heroImage: imageRef(heroAsset),
    heroImageAlt: 'Jewish community members gathering together in support',
    heroPrimaryCta: { text: 'Learn About Our Work', href: '/about/story' },

    howWeHelpHeading: 'How We Help You',
    howWeHelpSubtitle: 'Comprehensive programs designed to support healing at every stage.',
    howWeHelpPrograms: [
      {
        _key: 'prog-heads-up',
        _type: 'programCard',
        image: imageRef(card1),
        alt: 'Healing retreat participants in a supportive group setting',
        title: 'Heads Up Healing Retreats',
        description:
          'Immersive retreat experiences in safe, supportive environments that foster healing and connection.',
        href: '/programs/heads-up',
      },
      {
        _key: 'prog-community',
        _type: 'programCard',
        image: imageRef(card2),
        alt: 'Community members supporting each other through peer connection',
        title: 'Community & Peer Support',
        description:
          'Guided group sessions and peer networks that foster understanding, shared experience, and mutual support.',
        href: '/about/community-stories',
      },
      {
        _key: 'prog-education',
        _type: 'programCard',
        image: imageRef(card3),
        alt: 'Educational workshop on mental health awareness',
        title: 'Education & Awareness',
        description:
          'Evidence-based workshops and resources to help individuals and families understand and navigate trauma.',
        href: '/resources',
      },
      {
        _key: 'prog-ongoing',
        _type: 'programCard',
        image: imageRef(card4),
        alt: 'Ongoing care and mental health resources',
        title: 'Ongoing Care Resources',
        description:
          'Accessible mental health tools, therapist referrals, and ongoing connection to care networks.',
        href: '/resources',
      },
    ],

    impactStoriesHeading: 'Impact Stories',
    impactStoriesSubtitle: "Real stories from individuals supported through Jewmanity's programs and community.",

    donationHeading: 'How You Can Help',
    donationSubtitle:
      'Your contribution directly supports healing, connection, and recovery for individuals and families in our community.',
    donationAmounts: [
      {
        _key: 'don-18',
        amount: 18,
        description: 'Provides trauma education materials for one individual',
      },
      {
        _key: 'don-36',
        amount: 36,
        description: "Supports a person\u2019s participation in a peer support group",
      },
      {
        _key: 'don-180',
        amount: 180,
        description: 'Sponsors a day of retreat programming for one participant',
      },
      {
        _key: 'don-360',
        amount: 360,
        description: 'Funds a week of therapeutic care and community healing',
      },
    ],
    donationButton: { text: 'Learn More', href: '/donate' },
    donationFooterText:
      'Your contribution helps fund healing retreats, peer support, and ongoing care for individuals and families in our community.',

    newsletterHeading: 'Stay Connected',
    newsletterDescription:
      'Receive updates on our programs, resources, and how your support is making a difference. We respect your privacy and will never share your information.',

    statsItems: [
      {
        _key: 'stat-nonprofit',
        _type: 'homepageStat',
        icon: 'shield',
        value: '501(c)(3) Nonprofit',
        label: 'Tax-exempt charitable organization',
      },
      {
        _key: 'stat-established',
        _type: 'homepageStat',
        icon: 'calendar',
        value: 'Established 2019',
        label: 'Years of dedicated service',
      },
      {
        _key: 'stat-helped',
        _type: 'homepageStat',
        icon: 'people',
        value: '1,500+ Helped',
        label: 'Individuals across all programs',
      },
      {
        _key: 'stat-programs',
        _type: 'homepageStat',
        icon: 'heart',
        value: '4 Core Programs',
        label: 'Comprehensive healing services',
      },
    ],
  };

  console.log('\nWriting homepage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "homepage"][0]{
      _id,
      heroHeading,
      "hasHeroImage": defined(heroImage),
      heroImageAlt,
      "primary": heroPrimaryCta.text,
      "secondary": heroSecondaryCta.text,
      howWeHelpHeading,
      "programCount": count(howWeHelpPrograms),
      impactStoriesHeading,
      donationHeading,
      "donationTierCount": count(donationAmounts),
      "donationButton": donationButton.text,
      newsletterHeading,
      "statsCount": count(statsItems)
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
