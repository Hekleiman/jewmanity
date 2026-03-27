import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'fightingAntisemitism',
  title: 'Fighting Antisemitism',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Fighting Antisemitism page.',
    }),
    defineField({
      name: 'introBody',
      title: 'Introduction',
      type: 'portableText',
      description: 'Opening text that introduces the topic and Jewmanity\'s stance.',
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      description: 'The main content sections of the page. Each has a title, body text, and optional image.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'The heading for this section.',
            }),
            defineField({
              name: 'body',
              title: 'Section Content',
              type: 'portableText',
              description: 'The body text for this section.',
            }),
            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              description: 'Optional image to accompany this section.',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'Untitled Section' };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Fighting Antisemitism' };
    },
  },
});
