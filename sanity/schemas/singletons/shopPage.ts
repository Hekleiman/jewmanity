import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'shopPage',
  title: 'Shop Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'impact', title: 'Impact Section' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Shop page.',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta',
      title: 'Hero Button',
      type: 'object',
      description: 'The call-to-action button in the hero.',
      group: 'hero',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          description: "Text on the main hero button, e.g., 'Shop Our Collection'.",
        }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description:
            "Where the hero button links to. Use '#product-grid' to scroll to the products section on the same page, or a path like '/donate' to link to another page.",
        }),
      ],
    }),

    defineField({
      name: 'impactHeading',
      title: 'Impact Section Heading',
      type: 'string',
      description: 'Section heading above the 3 impact icons.',
      initialValue: 'Every Purchase Makes an Impact',
      group: 'impact',
    }),
    defineField({
      name: 'introDescription',
      title: 'Intro Description',
      type: 'text',
      rows: 4,
      description: 'Paragraph below the heading explaining how purchases support Jewmanity.',
      group: 'impact',
    }),
    defineField({
      name: 'impactIcons',
      title: 'Impact Icons',
      type: 'array',
      description: 'Icon + label pairs shown in a row (usually 3).',
      of: [{ type: 'shopImpactIcon' }],
      group: 'impact',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Large heading for the call-to-action section at the bottom of the shop page.',
      initialValue: 'Support Healing Through Everyday Actions',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 2,
      description: 'Supporting line below the CTA heading.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryButton',
      title: 'CTA Primary Button',
      type: 'object',
      description: 'Primary button in the bottom CTA.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: "Where this button links to. Internal path like '/donate' or full URL.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Shop Page' };
    },
  },
});
