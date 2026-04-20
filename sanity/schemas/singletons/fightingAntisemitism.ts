import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'fightingAntisemitism',
  title: 'Fighting Antisemitism',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'understanding', title: 'Understanding' },
    { name: 'forms', title: 'How It Shows Up' },
    { name: 'action', title: 'Taking Action' },
    { name: 'articles', title: 'Articles Section' },
    { name: 'organizations', title: 'Organizations' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Fighting Antisemitism page.',
      group: 'hero',
    }),

    defineField({
      name: 'understandingHeading',
      title: 'Understanding Section Heading',
      type: 'string',
      description: "Heading for the opening 'Understanding' section. Default: 'Understanding Antisemitism Today'.",
      initialValue: 'Understanding Antisemitism Today',
      group: 'understanding',
    }),
    defineField({
      name: 'understandingBody',
      title: 'Understanding Body',
      type: 'portableText',
      description: '2-3 paragraph intro explaining the current landscape of antisemitism. Portable text supports formatting like bold and links.',
      group: 'understanding',
    }),
    defineField({
      name: 'understandingStats',
      title: 'Understanding Stats',
      type: 'array',
      description: 'Statistic cards shown below the intro paragraphs.',
      of: [{ type: 'antisemitismStat' }],
      group: 'understanding',
    }),

    defineField({
      name: 'formsHeading',
      title: 'Forms Section Heading',
      type: 'string',
      description: 'Heading for the section showing common forms of antisemitism.',
      initialValue: 'How Antisemitism Shows Up',
      group: 'forms',
    }),
    defineField({
      name: 'formsCards',
      title: 'Forms Cards',
      type: 'array',
      description: 'Cards describing common forms of antisemitism (usually 4).',
      of: [{ type: 'antisemitismFormCard' }],
      group: 'forms',
    }),

    defineField({
      name: 'actionHeading',
      title: 'Action Section Heading',
      type: 'string',
      description: 'Heading for the action steps section.',
      initialValue: 'Taking Action Against Antisemitism',
      group: 'action',
    }),
    defineField({
      name: 'actionSubtitle',
      title: 'Action Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short intro explaining why action matters.',
      group: 'action',
    }),
    defineField({
      name: 'actionSteps',
      title: 'Action Steps',
      type: 'array',
      description: 'Ordered steps readers can take. Steps auto-number by position — drag to reorder in Studio and numbers update automatically. No need to manually number them.',
      of: [{ type: 'actionStep' }],
      group: 'action',
    }),

    defineField({
      name: 'articlesHeading',
      title: 'Articles Section Heading',
      type: 'string',
      description: "Heading for the 'Learn More' article grid. The articles themselves are managed in the separate 'Recommended Articles' content type — add or edit articles there.",
      initialValue: 'Learn More',
      group: 'articles',
    }),
    defineField({
      name: 'articlesSubtitle',
      title: 'Articles Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short intro above the articles grid.',
      group: 'articles',
    }),

    defineField({
      name: 'organizationsHeading',
      title: 'Organizations Section Heading',
      type: 'string',
      description: 'Heading for the section listing partner/aligned organizations.',
      initialValue: 'Organizations Fighting Antisemitism',
      group: 'organizations',
    }),
    defineField({
      name: 'organizationsSubtitle',
      title: 'Organizations Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short intro about these organizations.',
      group: 'organizations',
    }),
    defineField({
      name: 'organizations',
      title: 'Organizations',
      type: 'array',
      description: 'Organizations doing work to fight antisemitism. Each opens in a new tab when clicked.',
      of: [{ type: 'antisemitismOrg' }],
      group: 'organizations',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Final call-to-action heading at the bottom of the page.',
      initialValue: 'Stand With Us Against Antisemitism',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 3,
      description: 'Short paragraph under the CTA heading.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryButton',
      title: 'CTA Primary Button',
      type: 'object',
      description: 'Primary call-to-action button. Use for the most important action.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({ name: 'href', title: 'Button Link', type: 'string' }),
      ],
    }),
    defineField({
      name: 'ctaSecondaryButton',
      title: 'CTA Secondary Button',
      type: 'object',
      description: 'Secondary outlined button shown next to the primary.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({ name: 'href', title: 'Button Link', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Fighting Antisemitism' };
    },
  },
});
