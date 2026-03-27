import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutStory',
  title: 'Our Story',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Our Story page.',
    }),
    defineField({
      name: 'storyBody',
      title: 'Our Story',
      type: 'portableText',
      description: 'The long-form "Our Story" text. Share Jewmanity\'s origin, mission, and journey.',
    }),
    defineField({
      name: 'values',
      title: 'Our Values',
      type: 'array',
      description: 'The core values displayed as cards on the Our Story page.',
      of: [{ type: 'valueCard' }],
      validation: (rule) => rule.max(12).warning('12 values is the maximum for this layout.'),
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the call-to-action section at the bottom (e.g., "Join Our Mission").',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'string',
      description: 'Brief text encouraging action below the CTA heading.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Our Story' };
    },
  },
});
