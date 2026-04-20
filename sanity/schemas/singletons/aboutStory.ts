import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutStory',
  title: 'Our Story',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'story', title: 'Story' },
    { name: 'values', title: 'Our Values' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Our Story page.',
      group: 'hero',
    }),

    defineField({
      name: 'storyHeading',
      title: 'Story Heading',
      type: 'string',
      description: 'Heading displayed above the long-form story text (e.g., "Our Story").',
      initialValue: 'Our Story',
      group: 'story',
    }),
    defineField({
      name: 'storyBody',
      title: 'Story Body',
      type: 'portableText',
      description: "The long-form \"Our Story\" text. Share Jewmanity's origin, mission, and journey.",
      group: 'story',
    }),

    defineField({
      name: 'valuesHeading',
      title: 'Values Section Heading',
      type: 'string',
      description: 'Heading above the values grid (e.g., "Our Values & Approach").',
      initialValue: 'Our Values & Approach',
      group: 'values',
    }),
    defineField({
      name: 'valuesSubtitle',
      title: 'Values Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short intro line displayed below the values heading.',
      group: 'values',
    }),
    defineField({
      name: 'values',
      title: 'Our Values',
      type: 'array',
      description: 'The core values displayed as cards. Each card picks its icon from a fixed set of site SVGs.',
      of: [{ type: 'aboutValueCard' }],
      validation: (rule) => rule.max(12).warning('12 values is the maximum for this layout.'),
      group: 'values',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the call-to-action section at the bottom (e.g., "Join Our Mission").',
      group: 'cta',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'string',
      description: 'Brief text encouraging action below the CTA heading.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryButton',
      title: 'Primary CTA Button',
      type: 'object',
      description: 'The main call-to-action button.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'Where the button links to. Use "/donate", "/get-involved/volunteer", etc. for internal pages.',
        }),
      ],
    }),
    defineField({
      name: 'ctaSecondaryButton',
      title: 'Secondary CTA Button',
      type: 'object',
      description: 'The secondary (outline) button displayed next to the primary one.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({ name: 'href', title: 'Button Link', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Our Story' };
    },
  },
});
