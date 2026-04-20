/**
 * Seeds the headsUp singleton (_id: headsUp).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-heads-up.ts
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
  console.log('Uploading 4 images...');
  const heroAsset = await uploadImage('/images/hero/heads-up.jpg');
  const safeHavenAsset = await uploadImage('/images/sections/heads-up-safe-haven.jpg');
  const careAsset = await uploadImage('/images/sections/heads-up-evidence-based.jpg');
  const communityAsset = await uploadImage('/images/sections/heads-up-community.jpg');
  console.log('  hero:', heroAsset);
  console.log('  safeHaven:', safeHavenAsset);
  console.log('  care:', careAsset);
  console.log('  community:', communityAsset);

  const doc = {
    _id: 'headsUp',
    _type: 'headsUp',

    hero: {
      heading: 'Heads Up',
      subtitle:
        'A comprehensive rehabilitation retreat in San Diego, designed to support Israeli soldiers and their loved ones experiencing PTSD and ongoing trauma',
      backgroundImage: imageRef(heroAsset),
    },

    safeHavenHeading: 'A Safe Haven for Healing',
    safeHavenBody: [
      block(
        "Heads Up is Jewmanity's flagship rehabilitation program, offering a comprehensive retreat experience that combines evidence-based psychological treatment with restorative recreational therapy.",
      ),
      block(
        'The program provides a safe, insulated environment away from the ongoing trauma and stress of conflict zones, allowing participants to begin their healing journey in a supportive, compassionate setting.',
      ),
      block(
        'Located in San Diego, California, our retreat creates space for Israeli soldiers, widows, widowers, and family members to reconnect with themselves, their communities, and their sense of purpose.',
      ),
    ],
    safeHavenImage: imageRef(safeHavenAsset),

    supportHeading: 'Who We Support',
    supportSubtitle: 'Heads Up is designed for those who have experienced trauma in service of their community.',
    supportCards: [
      {
        _key: 'support-soldiers',
        _type: 'supportCard',
        icon: 'shield',
        title: 'Israeli Soldiers',
        description:
          'Active service and veterans experiencing PTSD, combat stress, and the physical and mental toll of service in high-risk environments.',
      },
      {
        _key: 'support-widows',
        _type: 'supportCard',
        icon: 'heart',
        title: 'Widows & Widowers',
        description:
          'Those who have lost loved ones in service, navigating grief and the emotional and life challenges of rebuilding their lives.',
      },
      {
        _key: 'support-families',
        _type: 'supportCard',
        icon: 'family',
        title: 'Families & Loved Ones',
        description:
          'Family members affected by the trauma of their loved ones, seeking support, understanding, and tools for healing for themselves.',
      },
    ],

    experienceHeading: 'The Retreat Experience',
    experienceSubtitle: 'A carefully designed journey from arrival to reconnection',
    experienceItems: [
      {
        _key: 'exp-grounding',
        _type: 'experienceItem',
        icon: 'grounding',
        title: 'Arrival & Grounding',
        description:
          'The retreat opens with a day of safety and comfort. Participants are welcomed into a peaceful environment where they can begin to let go of hypervigilance and embrace a sense of security, trust, and community from the first day onward.',
      },
      {
        _key: 'exp-healing',
        _type: 'experienceItem',
        icon: 'healing',
        title: 'Inner Healing',
        description:
          'Through group therapy sessions, mindfulness practices, and body-based healing modalities, participants begin to process their experiences in a supported environment. This stage introduces self-compassion, emotional regulation, and reconnection with identity.',
      },
      {
        _key: 'exp-connection',
        _type: 'experienceItem',
        icon: 'connection',
        title: 'Community Connection',
        description:
          'Healing deepens in community. Through outdoor adventures, group activities, shared meals, and emotional experiences and rituals, connections are formed that extend well beyond the retreat. The bonds created become lifelong networks of mutual strength and support.',
      },
    ],

    careHeading: 'Evidence-Based Care',
    careImage: imageRef(careAsset),
    carePillars: [
      {
        _key: 'care-clinical',
        _type: 'carePillar',
        icon: 'clinical',
        title: 'Clinical Excellence',
        description:
          'Daily therapy sessions led by certified trauma counselors from Israel who understand the cultural and linguistic nuances of their community.',
      },
      {
        _key: 'care-holistic',
        _type: 'carePillar',
        icon: 'holistic',
        title: 'Holistic Healing',
        description:
          'Integration of mindfulness practices, body-based healing, art therapy, and evidence-based trauma interventions into the nervous system.',
      },
      {
        _key: 'care-community',
        _type: 'carePillar',
        icon: 'community',
        title: 'Community-Based Healing',
        description:
          'Group sessions and community-centered therapies that foster connection, reduce isolation, and build lasting support networks.',
      },
    ],

    includedHeading: "What's Included",
    includedSubtitle: 'Everything participants need to focus on their healing journey',
    includedItems: [
      {
        _key: 'inc-therapy',
        _type: 'includedItem',
        icon: 'therapy',
        title: 'Daily Therapy Sessions',
        description: 'Individual and group therapy with certified trauma counselors',
      },
      {
        _key: 'inc-accommodation',
        _type: 'includedItem',
        icon: 'accommodation',
        title: 'Comfortable Accommodations',
        description: 'Private rooms in peaceful, comfortable shared settings',
      },
      {
        _key: 'inc-meals',
        _type: 'includedItem',
        icon: 'meals',
        title: 'All Meals Provided',
        description: 'Full-time, culturally appropriate meals prepared with care',
      },
      {
        _key: 'inc-transport',
        _type: 'includedItem',
        icon: 'transport',
        title: 'Transportation',
        description: 'Airport pickup and all transportation during the retreat',
      },
      {
        _key: 'inc-activities',
        _type: 'includedItem',
        icon: 'activities',
        title: 'Recreational Activities',
        description: 'Healing excursions, nature walks, and community experiences',
      },
      {
        _key: 'inc-support',
        _type: 'includedItem',
        icon: 'support',
        title: 'Ongoing Support',
        description: 'Post-retreat resources and connection to continuing care',
      },
    ],

    communityHeading: 'Powered by Community',
    communityIntro:
      'The Heads Up program relies on the dedication and compassion of volunteers who believe in the power of healing. Our volunteer community makes this work possible.',
    communityBullets: [
      'Preparing and serving meals with care and intention',
      'Providing logistical support and coordination',
      'Leading recreational and healing experiences',
      'Offering emotional presence and community support',
    ],
    communityButton: { text: 'Become a Volunteer', href: '/get-involved/volunteer' },
    communityImage: imageRef(communityAsset),

    impactHeading: 'Our Growing Impact',
    impactSubtitle: "Since our founding, we've remained committed to expanding access to healing.",
    impactStats: [
      { _key: 'stat-retreats', _type: 'statItem', value: '12', label: 'Retreats Completed' },
      { _key: 'stat-participants', _type: 'statItem', value: '180', suffix: '+', label: 'Participants Supported' },
      { _key: 'stat-scholarship', _type: 'statItem', value: '100', suffix: '%', label: 'Scholarship Coverage' },
    ],

    ctaHeading: 'Creating Space for Healing',
    ctaSubtitle:
      'Healing from trauma requires safety, compassion, and community. Your support helps us provide these essential spaces where Israeli soldiers and their loved ones can begin to recover, reconnect, and rebuild.',
    ctaPrimaryButton: { text: 'Support Healing', href: '/donate' },
  };

  console.log('\nWriting headsUp doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "headsUp"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      safeHavenHeading,
      "safeHavenBlocks": count(safeHavenBody),
      "hasSafeHavenImage": defined(safeHavenImage),
      supportHeading,
      "supportCount": count(supportCards),
      experienceHeading,
      "experienceCount": count(experienceItems),
      careHeading,
      "hasCareImage": defined(careImage),
      "pillarCount": count(carePillars),
      includedHeading,
      "includedCount": count(includedItems),
      communityHeading,
      "bulletCount": count(communityBullets),
      "communityButtonText": communityButton.text,
      "hasCommunityImage": defined(communityImage),
      impactHeading,
      "statCount": count(impactStats),
      ctaHeading,
      "ctaButtonText": ctaPrimaryButton.text
    }`,
  );
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
