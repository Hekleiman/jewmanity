import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'nonprofitDisclosuresPage',
  title: 'Nonprofit Disclosures Page',
  type: 'document',
  description:
    'The Nonprofit Disclosures page. Legal and financial transparency content. Edit with care; this is a compliance-adjacent page.',
  groups: [
    { name: 'meta', title: 'Page Meta', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'orgInfo', title: 'Organization Info' },
    { name: 'taxStatus', title: 'Tax Status' },
    { name: 'mission', title: 'Mission' },
    { name: 'programs', title: 'Use of Funds' },
    { name: 'financial', title: 'Financial Transparency' },
    { name: 'board', title: 'Board of Directors' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Page Meta (SEO)',
      type: 'pageMetaOverride',
      group: 'meta',
    }),
    defineField({
      name: 'heading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Page H1.',
      initialValue: 'Nonprofit Disclosures',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Tagline under the heading.',
      initialValue: 'Transparency and accountability in everything we do',
      group: 'hero',
    }),
    defineField({
      name: 'organizationInfo',
      title: 'Organization Info Block',
      type: 'object',
      description:
        'The labeled key/value rows at the top of the page (Legal Name, EIN, etc.). EIN is duplicated in Site Settings; keep them in sync.',
      group: 'orgInfo',
      fields: [
        defineField({ name: 'legalName', title: 'Legal Name', type: 'string', initialValue: 'Jewmanity' }),
        defineField({ name: 'orgType', title: 'Type', type: 'string', initialValue: '501(c)(3) Nonprofit Organization' }),
        defineField({ name: 'ein', title: 'EIN', type: 'string', initialValue: '99-4219099' }),
        defineField({ name: 'yearEstablished', title: 'Year Established', type: 'string', initialValue: '2019' }),
        defineField({ name: 'stateOfIncorporation', title: 'State of Incorporation', type: 'string', initialValue: 'California' }),
      ],
    }),
    defineField({
      name: 'taxStatusHeading',
      title: 'Tax Status Heading',
      type: 'string',
      initialValue: 'Tax-Deductible Status',
      group: 'taxStatus',
    }),
    defineField({
      name: 'taxStatusBody',
      title: 'Tax Status Body',
      type: 'portableText',
      description: 'IRS recognition, tax-deductibility, donor receipt language.',
      group: 'taxStatus',
    }),
    defineField({
      name: 'missionHeading',
      title: 'Mission Heading',
      type: 'string',
      initialValue: 'Mission Statement',
      group: 'mission',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'text',
      rows: 4,
      group: 'mission',
    }),
    defineField({
      name: 'programsHeading',
      title: 'Use of Funds Heading',
      type: 'string',
      initialValue: 'Use of Funds',
      group: 'programs',
    }),
    defineField({
      name: 'programsIntro',
      title: 'Use of Funds Intro',
      type: 'text',
      rows: 2,
      description: 'Short lead-in sentence before the program bullets.',
      group: 'programs',
    }),
    defineField({
      name: 'programs',
      title: 'Program Bullets',
      type: 'array',
      description: 'Each entry is a strong-label + description pair. Reorder by dragging.',
      group: 'programs',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Program Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        },
      ],
    }),
    defineField({
      name: 'financialHeading',
      title: 'Financial Transparency Heading',
      type: 'string',
      initialValue: 'Financial Transparency',
      group: 'financial',
    }),
    defineField({
      name: 'financialIntro',
      title: 'Financial Transparency Intro',
      type: 'text',
      rows: 3,
      description:
        'Paragraph before the cost breakdown. Mention the average cost per participant.',
      group: 'financial',
    }),
    defineField({
      name: 'useDonatePageCostBreakdown',
      title: 'Use Donate Page Cost Breakdown',
      type: 'boolean',
      description:
        'When ON, this page reads the cost breakdown items from the Donate Page (single source of truth). Recommended. Turn OFF only if you need a separate breakdown specific to disclosures.',
      initialValue: true,
      group: 'financial',
    }),
    defineField({
      name: 'financialClosing',
      title: 'Financial Transparency Closing Line',
      type: 'text',
      rows: 2,
      description: 'Final line after the bullets (e.g., "Administrative costs are kept minimal...").',
      group: 'financial',
    }),
    defineField({
      name: 'boardHeading',
      title: 'Board Heading',
      type: 'string',
      initialValue: 'Board of Directors',
      group: 'board',
    }),
    defineField({
      name: 'boardMembers',
      title: 'Board Members',
      type: 'array',
      description:
        'List shown on this page. Independent of the Team Members collection so legal naming and ordering can differ from the public team page.',
      group: 'board',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        },
      ],
    }),
    defineField({
      name: 'contactHeading',
      title: 'Contact Heading',
      type: 'string',
      initialValue: 'Contact',
      group: 'contact',
    }),
    defineField({
      name: 'contactBody',
      title: 'Contact Section Body',
      type: 'portableText',
      description: 'Closing paragraph pointing visitors to the contact form.',
      group: 'contact',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Nonprofit Disclosures Page' };
    },
  },
});
