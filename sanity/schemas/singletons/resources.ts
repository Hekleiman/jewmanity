import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'resources',
  title: 'Mental Health Resources',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Mental Health Resources page.',
    }),
    defineField({
      name: 'advocacyPillars',
      title: 'Advocacy Pillars',
      type: 'array',
      description: 'The numbered pillars of mental health advocacy.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Pillar Number',
              type: 'string',
              description: 'The display number (e.g., "01", "02").',
            }),
            defineField({
              name: 'title',
              title: 'Pillar Title',
              type: 'string',
              description: 'Short title for this pillar.',
            }),
            defineField({
              name: 'description',
              title: 'Pillar Description',
              type: 'text',
              rows: 3,
              description: 'Brief explanation of this advocacy pillar.',
            }),
          ],
          preview: {
            select: { number: 'number', title: 'title' },
            prepare({ number, title }) {
              return { title: `${number || '#'} — ${title || 'Untitled'}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'whyMattersBody',
      title: 'Why Mental Health Matters',
      type: 'portableText',
      description: 'Content for the "Why Mental Health Matters" section.',
    }),
    defineField({
      name: 'commonStruggles',
      title: 'Common Struggles',
      type: 'array',
      description: 'List of common mental health struggles (displayed as tags or bullets).',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'signsBody',
      title: 'Signs to Watch For',
      type: 'portableText',
      description: 'Content about recognizing signs of mental health struggles.',
    }),
    defineField({
      name: 'crisisResources',
      title: 'Crisis Resources',
      type: 'array',
      description: 'Hotlines and resources for people in crisis.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Resource Name',
              type: 'string',
              description: 'The name of the hotline or resource (e.g., "988 Suicide & Crisis Lifeline").',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Brief description of what this resource provides.',
            }),
            defineField({
              name: 'phone',
              title: 'Phone Number',
              type: 'string',
              description: 'The phone number to call or text (e.g., "988" or "1-800-273-8255").',
            }),
            defineField({
              name: 'url',
              title: 'Website URL',
              type: 'url',
              description: 'Link to the resource\'s website.',
            }),
            defineField({
              name: 'region',
              title: 'Region / Country',
              type: 'string',
              description: 'Where this resource is available (e.g., "United States", "Israel", "International").',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'region' },
          },
        }),
      ],
    }),
    defineField({
      name: 'disclaimer',
      title: 'Disclaimer Text',
      type: 'text',
      rows: 3,
      description: 'Legal disclaimer shown at the bottom of the resources page.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Mental Health Resources' };
    },
  },
});
