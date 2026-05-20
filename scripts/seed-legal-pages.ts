/**
 * Seeds the four new legal/404 singletons from the current hardcoded
 * page content. Uses createOrReplace, which is safe because these docs
 * are new in Phase 2 of the CMS completeness audit closeout.
 *
 * Body content is faithfully migrated from the existing pages
 * (src/pages/404.astro, privacy.astro, terms.astro, nonprofit-disclosures.astro)
 * so that visual diff after seeding is zero.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-legal-pages.ts
 */

import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';

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

function key(): string {
  return randomBytes(5).toString('hex');
}

type Span = { _type: 'span'; _key: string; text: string; marks: string[] };
type Block = {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  markDefs: any[];
  children: Span[];
  listItem?: 'bullet' | 'number';
  level?: number;
};

function span(text: string, marks: string[] = []): Span {
  return { _type: 'span', _key: key(), text, marks };
}

function block(style: Block['style'], children: Span[] | string): Block {
  const kids = typeof children === 'string' ? [span(children)] : children;
  return { _type: 'block', _key: key(), style, markDefs: [], children: kids };
}

function p(text: string): Block {
  return block('normal', text);
}

function h2(text: string): Block {
  return block('h2', text);
}

function bullet(children: Span[] | string): Block {
  const b = block('normal', children);
  b.listItem = 'bullet';
  b.level = 1;
  return b;
}

function linkBlock(textBefore: string, linkText: string, href: string, textAfter: string): Block {
  const markKey = key();
  const children: Span[] = [];
  if (textBefore) children.push(span(textBefore));
  children.push({ _type: 'span', _key: key(), text: linkText, marks: [markKey] });
  if (textAfter) children.push(span(textAfter));
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [{ _key: markKey, _type: 'link', href }],
    children,
  };
}

// ---------- 404 ----------
async function seedNotFoundPage() {
  console.log('Seeding notFoundPage...');
  const doc = {
    _id: 'notFoundPage',
    _type: 'notFoundPage',
    heading: 'Page Not Found',
    body: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    buttons: [
      { _key: 'home', label: 'Go Home', href: '/' },
      { _key: 'programs', label: 'Browse Programs', href: '/programs/heads-up' },
      { _key: 'contact', label: 'Get in Touch', href: '/get-involved/contact' },
    ],
  };
  const res = await client.createOrReplace(doc);
  console.log(`  wrote: ${res._id}`);
}

// ---------- Privacy ----------
async function seedPrivacyPage() {
  console.log('Seeding privacyPage...');
  const body: Block[] = [
    h2('Information We Collect'),
    p('Jewmanity collects information you voluntarily provide when using our website, including:'),
    bullet('Contact information (name, email address) submitted through our contact and volunteer forms'),
    bullet('Donation information processed through our third-party donation platform'),
    bullet('Purchase information processed through our third-party shop platform (Snipcart)'),
    bullet('Email addresses submitted through our newsletter signup'),
    bullet('Usage data collected automatically (browser type, pages visited, referring site) through standard web analytics'),

    h2('How We Use Your Information'),
    p('We use the information we collect to:'),
    bullet('Respond to your inquiries and support requests'),
    bullet('Process donations and purchases'),
    bullet('Send newsletters and program updates (only if you opted in)'),
    bullet('Improve our website and programs'),
    bullet('Comply with legal obligations'),

    h2('Third-Party Services'),
    p('We use the following third-party services that may collect data:'),
    bullet([span('Third-party donation processor', ['strong']), span(' for donation processing')]),
    bullet([span('Snipcart', ['strong']), span(' for merchandise purchases (see Snipcart Privacy Policy)')]),
    bullet([span('Formspree', ['strong']), span(' for form submissions (see Formspree Privacy Policy)')]),
    bullet([span('Vercel', ['strong']), span(' for website hosting (see Vercel Privacy Policy)')]),
    p('We do not sell, rent, or share your personal information with third parties for marketing purposes.'),

    h2('Data Security'),
    p('We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'),

    h2('Cookies'),
    p('Our website may use essential cookies for basic functionality. We do not use advertising or tracking cookies.'),

    h2('Your Rights'),
    p('You have the right to:'),
    bullet('Request access to the personal information we hold about you'),
    bullet('Request correction or deletion of your personal information'),
    bullet('Opt out of newsletter communications at any time'),
    bullet('Contact us with any privacy-related concerns'),

    h2("Children's Privacy"),
    p('Our website is not directed at children under the age of 13, and we do not knowingly collect personal information from children.'),

    h2('Changes to This Policy'),
    p('We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.'),

    h2('Contact Us'),
    linkBlock(
      'If you have questions about this Privacy Policy, please reach out through our ',
      'contact form',
      '/get-involved/contact',
      '.',
    ),
  ];

  const doc = {
    _id: 'privacyPage',
    _type: 'privacyPage',
    heading: 'Privacy Policy',
    lastUpdated: '2026-03-01',
    body,
  };
  const res = await client.createOrReplace(doc);
  console.log(`  wrote: ${res._id}`);
}

// ---------- Terms ----------
async function seedTermsPage() {
  console.log('Seeding termsPage...');
  const body: Block[] = [
    h2('Acceptance of Terms'),
    p('By accessing and using the Jewmanity website (jewmanity.com), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.'),

    h2('Use of Website'),
    p('You may use our website for lawful purposes only. You agree not to:'),
    bullet('Use the website in any way that violates applicable laws or regulations'),
    bullet('Attempt to interfere with the proper functioning of the website'),
    bullet('Use automated systems to access the website without permission'),
    bullet('Impersonate any person or entity'),

    h2('Donations'),
    linkBlock(
      'All donations made through our website are voluntary and processed by our third-party payment processor. Donations to Jewmanity are tax-deductible to the fullest extent allowed by law. Refund requests for donations should be submitted through our ',
      'contact form',
      '/get-involved/contact',
      '.',
    ),

    h2('Merchandise Purchases'),
    linkBlock(
      'Merchandise purchases are processed through Snipcart. All sales are subject to product availability. Prices are listed in US dollars. For questions about orders, returns, or exchanges, please contact us through our ',
      'contact page',
      '/get-involved/contact',
      '.',
    ),

    h2('Intellectual Property'),
    p('All content on this website—including text, images, logos, and design—is the property of Jewmanity or its content suppliers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without written permission.'),

    h2('Disclaimer'),
    p('The information provided on this website is for general informational purposes only. Jewmanity is not a medical provider. The content on this website does not constitute medical, psychological, or professional advice. If you are experiencing a mental health crisis, please contact emergency services or the 988 Suicide & Crisis Lifeline.'),

    h2('Limitation of Liability'),
    p('Jewmanity shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or reliance on any information provided.'),

    h2('Third-Party Links'),
    p('Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these external sites.'),

    h2('Changes to Terms'),
    p('We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page.'),

    h2('Governing Law'),
    p('These Terms of Service are governed by the laws of the State of California, without regard to conflict of law principles.'),

    h2('Contact'),
    linkBlock(
      'For questions about these Terms of Service, please reach out through our ',
      'contact form',
      '/get-involved/contact',
      '.',
    ),
  ];

  const doc = {
    _id: 'termsPage',
    _type: 'termsPage',
    heading: 'Terms of Service',
    lastUpdated: '2026-03-01',
    body,
  };
  const res = await client.createOrReplace(doc);
  console.log(`  wrote: ${res._id}`);
}

// ---------- Nonprofit Disclosures ----------
async function seedNonprofitDisclosuresPage() {
  console.log('Seeding nonprofitDisclosuresPage...');

  const taxStatusBody: Block[] = [
    p('Jewmanity is recognized by the Internal Revenue Service as a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code. All donations to Jewmanity are tax-deductible to the fullest extent allowed by law.'),
    p('Donors will receive a tax receipt via email for all contributions. For donations of $250 or more, a written acknowledgment will be provided as required by IRS regulations.'),
  ];

  const contactBody: Block[] = [
    linkBlock(
      'For questions about our nonprofit status, financial practices, or organizational governance, please reach out through our ',
      'contact form',
      '/get-involved/contact',
      '.',
    ),
  ];

  const doc = {
    _id: 'nonprofitDisclosuresPage',
    _type: 'nonprofitDisclosuresPage',
    heading: 'Nonprofit Disclosures',
    heroSubtitle: 'Transparency and accountability in everything we do',
    organizationInfo: {
      legalName: 'Jewmanity',
      orgType: '501(c)(3) Nonprofit Organization',
      ein: '99-4219099',
      yearEstablished: '2019',
      stateOfIncorporation: 'California',
    },
    taxStatusHeading: 'Tax-Deductible Status',
    taxStatusBody,
    missionHeading: 'Mission Statement',
    missionStatement:
      'Jewmanity is dedicated to supporting mental health and healing for Jewish and Israeli communities through rehabilitation retreats, peer support programs, education, and ongoing care resources.',
    programsHeading: 'Use of Funds',
    programsIntro:
      'Jewmanity is committed to responsible stewardship of all contributions. Our programs include:',
    programs: [
      {
        _key: 'p1',
        name: 'Heads Up Healing Retreats',
        description:
          'Comprehensive rehabilitation retreats in San Diego for Israeli soldiers, widows, widowers, and family members experiencing PTSD and trauma',
      },
      {
        _key: 'p2',
        name: 'Community & Peer Support',
        description: 'Group sessions and peer networks that foster understanding and mutual support',
      },
      {
        _key: 'p3',
        name: 'Education & Awareness',
        description:
          'Workshops and resources addressing mental health stigma, trauma, and antisemitism',
      },
      {
        _key: 'p4',
        name: 'Ongoing Care Resources',
        description: 'Therapist referrals, mental health tools, and continuing support',
      },
    ],
    financialHeading: 'Financial Transparency',
    financialIntro:
      'We believe in complete transparency about how donations are used. The average cost to support one participant through a healing retreat is approximately $4,500, which covers:',
    useDonatePageCostBreakdown: true,
    financialClosing:
      'Administrative costs are kept minimal to ensure maximum impact from every contribution.',
    boardHeading: 'Board of Directors',
    boardMembers: [
      { _key: 'b1', name: 'Belinda Donner', role: 'Founding Board Member' },
      { _key: 'b2', name: 'Andrew Donner', role: 'Founding Board Member' },
      { _key: 'b3', name: 'Shai Gino', role: 'Executive Director' },
      { _key: 'b4', name: 'Rabbi Avi Libman', role: 'Board Member' },
    ],
    contactHeading: 'Contact',
    contactBody,
  };
  const res = await client.createOrReplace(doc);
  console.log(`  wrote: ${res._id}`);
}

async function main() {
  await seedNotFoundPage();
  await seedPrivacyPage();
  await seedTermsPage();
  await seedNonprofitDisclosuresPage();

  const verify = await client.fetch(`{
    "notFound": *[_id == "notFoundPage"][0]{ heading, "buttonCount": count(buttons) },
    "privacy": *[_id == "privacyPage"][0]{ heading, lastUpdated, "bodyBlocks": count(body) },
    "terms": *[_id == "termsPage"][0]{ heading, lastUpdated, "bodyBlocks": count(body) },
    "disclosures": *[_id == "nonprofitDisclosuresPage"][0]{
      heading,
      organizationInfo,
      "programCount": count(programs),
      "boardCount": count(boardMembers),
      useDonatePageCostBreakdown
    }
  }`);
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
