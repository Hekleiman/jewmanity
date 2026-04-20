/**
 * Seeds the volunteerPage singleton (_id: volunteerPage).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-volunteer-page.ts
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
  console.log('Uploading 2 images...');
  const heroAsset = await uploadImage('/images/hero/volunteer.jpg');
  const whyAsset = await uploadImage('/images/sections/volunteer-why.jpg');
  console.log('  hero:', heroAsset);
  console.log('  whyVolunteer:', whyAsset);

  const doc = {
    _id: 'volunteerPage',
    _type: 'volunteerPage',

    hero: {
      heading: 'Volunteer With Jewmanity',
      subtitle: 'Support healing, connection, and dignity through presence, care, and community.',
      backgroundImage: imageRef(heroAsset),
    },

    whyVolunteerHeading: 'Why Volunteer?',
    whyVolunteerBody: [
      block(
        "Volunteers are the heart of Jewmanity's retreats. Your presence creates a safe, welcoming space where participants can begin their healing journey from trauma, antisemitism, and the profound impacts of war.",
      ),
      block(
        "You don't need to be a therapist or trauma expert. What matters most is your compassion, reliability, and willingness to show up with care and humanity.",
      ),
      block(
        'Through simple acts—preparing meals, offering rides, hosting gatherings, or providing day-to-day support—you help create an environment where healing can happen.',
      ),
    ],
    whyVolunteerImage: imageRef(whyAsset),

    howToHelpHeading: 'How You Can Help',
    howToHelpSubtitle: 'There are many meaningful ways to contribute—find the one that feels right for you.',
    howToHelpCards: [
      {
        _key: 'help-meals',
        _type: 'howToHelpCard',
        icon: 'meals',
        title: 'Preparing and Serving Meals',
        description:
          'Help create nourishing, home-cooked meals that bring comfort and community to retreat participants.',
      },
      {
        _key: 'help-transport',
        _type: 'howToHelpCard',
        icon: 'transport',
        title: 'Transportation and Logistics',
        description: 'Provide safe, reliable transportation to and from retreat locations, airports, or local activities.',
      },
      {
        _key: 'help-hosting',
        _type: 'howToHelpCard',
        icon: 'hosting',
        title: 'Hosting Dinners and Gatherings',
        description: 'Open your home to create welcoming spaces where participants can connect and feel supported.',
      },
      {
        _key: 'help-support',
        _type: 'howToHelpCard',
        icon: 'support',
        title: 'Day-to-Day Support',
        description:
          'Be a steady presence during retreats\u2014setting up spaces, offering conversation, or simply being there.',
      },
    ],

    impactHeading: 'The Impact of Volunteering',
    impactIntro:
      'Volunteers make our retreats possible. Your time, care, and presence help create the foundation of safety and support that allows participants to heal. Every meal prepared, every conversation shared, every ride given tells participants: you are seen, you matter, you are not alone.',
    impactStats: [
      { _key: 'stat-retreats', _type: 'statItem', value: '50', suffix: '+', label: 'Retreats Supported' },
      { _key: 'stat-volunteers', _type: 'statItem', value: '200', suffix: '+', label: 'Volunteers Involved' },
      { _key: 'stat-participants', _type: 'statItem', value: '500', suffix: '+', label: 'Participants Impacted' },
    ],

    testimonialsHeading: 'What Our Volunteers Say',
    testimonialsSubtitle:
      'Honest reflections from those who fostered healing, connection, and renewed strength for Heads Up attendees.',

    faqHeading: 'Frequently Asked Questions',
    faqSubtitle: "Have questions? We're here to help.",
    faqContext: 'volunteer',

    formHeading: 'Volunteer Application',
    formSubtitle: "Fill out the form below and we'll be in touch to find the right fit for you.",
    formPrivacyNote: 'Your information will be kept confidential and used only for volunteer coordination.',

    ctaHeading: 'Ready to Get Involved?',
    ctaDescription:
      'Whether you have a few hours or can commit to regular support, your contribution makes a meaningful difference. Help comes in many forms\u2014find yours.',
    ctaPrimaryButton: { text: 'Apply to Volunteer', href: '#volunteer-form' },
    ctaSecondaryButton: { text: 'Support Healing', href: '/donate' },
  };

  console.log('\nWriting volunteerPage doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "volunteerPage"][0]{
      _id,
      "heroHeading": hero.heading,
      whyVolunteerHeading,
      "whyBlocks": count(whyVolunteerBody),
      howToHelpHeading,
      "helpCount": count(howToHelpCards),
      impactHeading,
      "statCount": count(impactStats),
      testimonialsHeading,
      faqHeading,
      formHeading,
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
