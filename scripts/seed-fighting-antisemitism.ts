/**
 * Seeds the fightingAntisemitism singleton (_id: fightingAntisemitism).
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-fighting-antisemitism.ts
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
  const heroAsset = await uploadImage('/images/hero/fighting-antisemitism.jpg');
  console.log('  hero:', heroAsset);

  const doc = {
    _id: 'fightingAntisemitism',
    _type: 'fightingAntisemitism',

    hero: {
      heading: 'Responding to Antisemitism',
      subtitle:
        'Building understanding and resilience through education, dialogue, and responses rooted in compassion and empathy.',
      backgroundImage: imageRef(heroAsset),
    },

    understandingHeading: 'Understanding Antisemitism Today',
    understandingBody: [
      block(
        'Antisemitism is rising in the United States at an alarming rate. From online hate and campus harassment to vandalism, violence, and the spread of conspiracy theories, Jewish communities face threats that are growing in both frequency and severity.',
      ),
      block(
        'It affects people of all ages \u2014 from teens bullied at school to adults targeted in their communities and workplaces. The impact is felt not just by those directly targeted, but by entire communities living with heightened fear and anxiety.',
      ),
      block(
        'At Jewmanity, we believe that awareness, education, and community action are the most powerful tools to fight back. Understanding the scope of the problem is the first step toward meaningful change.',
      ),
    ],
    understandingStats: [
      {
        _key: 'stat-incidents',
        _type: 'antisemitismStat',
        value: '9,354',
        description: 'Antisemitic incidents recorded in the U.S. in 2024',
        citation: 'ADL Audit of Antisemitic Incidents, 2024',
      },
      {
        _key: 'stat-increase',
        _type: 'antisemitismStat',
        value: '344%',
        description: 'Increase in antisemitic incidents over the past five years',
        citation: 'ADL Audit of Antisemitic Incidents, 2024',
      },
      {
        _key: 'stat-online',
        _type: 'antisemitismStat',
        value: '73%',
        description: 'of American Jews experienced antisemitism online or on social media',
        citation: 'AJC State of Antisemitism in America, 2025',
      },
    ],

    formsHeading: 'How Antisemitism Shows Up',
    formsCards: [
      {
        _key: 'form-social',
        _type: 'antisemitismFormCard',
        icon: 'social-media',
        title: 'Online & Social Media',
        description:
          'Antisemitic content spreads rapidly through social media platforms, from coded language and conspiracy theories to direct harassment and threats. Young people are especially vulnerable to radicalization through algorithms that amplify hateful content.',
      },
      {
        _key: 'form-campus',
        _type: 'antisemitismFormCard',
        icon: 'campus',
        title: 'On Campus',
        description:
          'College campuses have seen an 84% increase in antisemitic incidents. Jewish students report feeling unsafe expressing their identity, with many facing harassment during protests, in classrooms, and in campus social spaces.',
      },
      {
        _key: 'form-communities',
        _type: 'antisemitismFormCard',
        icon: 'community',
        title: 'In Communities',
        description:
          'Antisemitic vandalism, threats against synagogues, and harassment of visibly Jewish people in public spaces have become more common. Jewish institutions face increasing security costs to protect their congregants and students.',
      },
      {
        _key: 'form-conspiracy',
        _type: 'antisemitismFormCard',
        icon: 'conspiracy',
        title: 'Through Conspiracy Theories',
        description:
          'Ancient antisemitic tropes about Jewish power, control, and dual loyalty continue to resurface in modern forms \u2014 amplified by social media, political rhetoric, and foreign disinformation campaigns.',
      },
    ],

    actionHeading: 'Taking Action Against Antisemitism',
    actionSubtitle: "Every person can make a difference. Here's how to start.",
    actionSteps: [
      {
        _key: 'step-educate',
        _type: 'actionStep',
        title: 'Educate Yourself',
        description:
          'Learn to recognize antisemitism in all its forms \u2014 from overt hate speech to subtle coded language. Understanding the history and patterns of antisemitism makes you better equipped to identify and confront it.',
      },
      {
        _key: 'step-speak',
        _type: 'actionStep',
        title: 'Speak Up',
        description:
          'When you witness antisemitism \u2014 online, at school, at work, or in public \u2014 say something. Silence can be interpreted as acceptance. Your voice matters.',
      },
      {
        _key: 'step-support',
        _type: 'actionStep',
        title: 'Support Jewish Communities',
        description:
          'Attend events, volunteer, donate, or simply show up as an ally. Solidarity from people of all backgrounds sends a powerful message that hate will not be tolerated.',
      },
      {
        _key: 'step-report',
        _type: 'actionStep',
        title: 'Report Incidents',
        description:
          'Report antisemitic incidents to the ADL (adl.org/report-incident), local law enforcement, and school or workplace administrators. Documentation helps track patterns and hold perpetrators accountable.',
      },
      {
        _key: 'step-platform',
        _type: 'actionStep',
        title: 'Use Your Platform',
        description:
          'Share accurate information about antisemitism on social media. Post about Jewish culture, history, and contributions. Counter misinformation with facts, not outrage.',
      },
      {
        _key: 'step-jewmanity',
        _type: 'actionStep',
        title: 'Get Involved with Jewmanity',
        description:
          'Join our mission to support healing, build resilience, and fight antisemitism through community action. Every volunteer, donor, and advocate makes our community stronger.',
      },
    ],

    articlesHeading: 'Learn More',
    articlesSubtitle: 'Articles and perspectives on fighting antisemitism today',

    organizationsHeading: 'Organizations Fighting Antisemitism',
    organizationsSubtitle: 'Connect with these organizations for reporting, education, and support',
    organizations: [
      {
        _key: 'org-adl',
        _type: 'antisemitismOrg',
        name: 'ADL (Anti-Defamation League)',
        description: 'Tracks antisemitic incidents, provides education resources, and advocates for policy change.',
        url: 'https://www.adl.org',
      },
      {
        _key: 'org-heat',
        _type: 'antisemitismOrg',
        name: 'ADL H.E.A.T. Map',
        description: 'Interactive map tracking incidents of hate, extremism, antisemitism, and terrorism across the U.S.',
        url: 'https://www.adl.org/resources/tools-to-track-hate/heat-map',
      },
      {
        _key: 'org-ajc',
        _type: 'antisemitismOrg',
        name: 'AJC (American Jewish Committee)',
        description: 'Global advocacy organization combating antisemitism and promoting democratic values.',
        url: 'https://www.ajc.org',
      },
      {
        _key: 'org-cam',
        _type: 'antisemitismOrg',
        name: 'Combat Antisemitism Movement (CAM)',
        description: 'Global coalition of 700+ organizations and 3 million people working to fight antisemitism.',
        url: 'https://combatantisemitism.org',
      },
      {
        _key: 'org-swu',
        _type: 'antisemitismOrg',
        name: 'StandWithUs',
        description:
          'Education organization empowering students and communities to fight antisemitism and support Israel.',
        url: 'https://www.standwithus.com',
      },
      {
        _key: 'org-report',
        _type: 'antisemitismOrg',
        name: 'Report an Incident (ADL)',
        description: "If you've experienced or witnessed antisemitism, report it to the ADL to help track and respond.",
        url: 'https://www.adl.org/report-incident',
      },
    ],

    ctaHeading: 'Stand With Us Against Antisemitism',
    ctaSubtitle:
      "Whether you volunteer, donate, or simply share what you've learned, your actions help build a world where Jewish communities can thrive without fear.",
    ctaPrimaryButton: { text: 'Get Involved', href: '/get-involved/volunteer' },
    ctaSecondaryButton: { text: 'Support Healing', href: '/donate' },
  };

  console.log('\nWriting fightingAntisemitism doc...');
  const res = await client.createOrReplace(doc);
  console.log(`Wrote: ${res._id}`);

  const verify = await client.fetch(
    `*[_id == "fightingAntisemitism"][0]{
      _id,
      "heroHeading": hero.heading,
      "hasHeroImage": defined(hero.backgroundImage),
      understandingHeading,
      "understandingBlocks": count(understandingBody),
      "statCount": count(understandingStats),
      formsHeading,
      "formCount": count(formsCards),
      actionHeading,
      "stepCount": count(actionSteps),
      articlesHeading,
      organizationsHeading,
      "orgCount": count(organizations),
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
