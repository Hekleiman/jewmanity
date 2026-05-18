import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'aboutCommunityStoriesPage',
  title: 'Community Stories Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro Paragraphs' },
    { name: 'voices', title: 'Voices Section' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Community Stories page.',
      group: 'hero',
    }),

    defineField({
      name: 'introParagraphs',
      title: 'Intro Paragraphs',
      type: 'array',
      description: 'The opening paragraphs displayed between the hero and the stories list. One array entry per paragraph (keep to 2 or 3 for best pacing).',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      validation: (rule) => rule.max(5).warning('Three paragraphs is usually enough.'),
      group: 'intro',
    }),

    defineField({
      name: 'voicesHeading',
      title: 'Voices Section Heading',
      type: 'string',
      description: 'Heading above the personal stories list (e.g., "Voices from Our Community").',
      initialValue: 'Voices from Our Community',
      group: 'voices',
    }),
    defineField({
      name: 'voicesSubtitle',
      title: 'Voices Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short line below the voices heading.',
      initialValue: 'Real stories from the people whose lives have been touched by Jewmanity',
      group: 'voices',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the call-to-action section at the bottom (e.g., "Be Part of the Ongoing Story").',
      initialValue: 'Be Part of the Ongoing Story',
      validation: (rule) => rule.max(80).warning('Shorter headings have more impact.'),
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the CTA heading.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryButton',
      title: 'CTA Primary Button',
      type: 'object',
      description: 'The main call-to-action button.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'Where the button links to (e.g., "/get-involved/volunteer").',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Community Stories Page' };
    },
  },
});
