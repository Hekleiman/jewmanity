import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'donatePage',
  title: 'Donate Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Donate page.',
    }),
    defineField({
      name: 'donorboxEmbed',
      title: 'Donorbox Embed Code',
      type: 'text',
      rows: 6,
      description: 'Paste the Donorbox embed code here. Get this from your Donorbox dashboard under "Embed Form".',
    }),
    defineField({
      name: 'impactCards',
      title: 'Your Impact Cards',
      type: 'array',
      description: 'Cards showing what donations make possible.',
      of: [{ type: 'valueCard' }],
    }),
    defineField({
      name: 'whyGiveBody',
      title: 'Why Give',
      type: 'portableText',
      description: 'Content explaining why donations matter and how they\'re used.',
    }),
    defineField({
      name: 'costBreakdown',
      title: 'Cost Breakdown',
      type: 'array',
      description: 'Show donors exactly where their money goes.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'item',
              title: 'Item',
              type: 'string',
              description: 'What the funds cover (e.g., "Retreat supplies per participant").',
            }),
            defineField({
              name: 'amount',
              title: 'Dollar Amount',
              type: 'string',
              description: 'The cost (e.g., "$36", "$500"). Include the dollar sign.',
            }),
          ],
          preview: {
            select: { title: 'item', subtitle: 'amount' },
          },
        }),
      ],
    }),
    defineField({
      name: 'faqContext',
      title: 'FAQ Filter',
      type: 'string',
      description: 'Internal — used to show Donate-specific FAQs.',
      initialValue: 'donate',
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Donate Page' };
    },
  },
});
