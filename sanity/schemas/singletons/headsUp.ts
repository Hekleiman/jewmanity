import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'headsUp',
  title: 'Heads Up Program',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Heads Up program page.',
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      description: 'Flexible content sections for the Heads Up page. Add as many as needed.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              description: 'The heading for this content section.',
            }),
            defineField({
              name: 'sectionBody',
              title: 'Section Content',
              type: 'portableText',
              description: 'The body text for this section.',
            }),
            defineField({
              name: 'sectionImage',
              title: 'Section Image',
              type: 'image',
              description: 'Optional image for this section.',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'sectionTitle' },
            prepare({ title }) {
              return { title: title || 'Untitled Section' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'supportCards',
      title: 'Who We Support',
      type: 'array',
      description: 'Cards describing who the Heads Up program helps.',
      of: [{ type: 'valueCard' }],
    }),
    defineField({
      name: 'includedItems',
      title: 'What\'s Included',
      type: 'array',
      description: 'Cards listing what participants receive in the program.',
      of: [{ type: 'valueCard' }],
    }),
    defineField({
      name: 'impactStats',
      title: 'Impact Statistics',
      type: 'array',
      description: 'Key numbers showing the program\'s impact.',
      of: [{ type: 'statItem' }],
      validation: (rule) => rule.max(4).warning('4 stats maximum for this layout.'),
    }),
    defineField({
      name: 'carePillars',
      title: 'Evidence-Based Care',
      type: 'array',
      description: 'Cards describing the pillars of evidence-based care used in the program.',
      of: [{ type: 'valueCard' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Heads Up Program' };
    },
  },
});
