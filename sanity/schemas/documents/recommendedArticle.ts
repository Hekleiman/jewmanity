import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'recommendedArticle',
  title: 'Recommended Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      validation: (rule) => rule.required().error('Please add the article title.'),
    }),
    defineField({
      name: 'publication',
      title: 'Publication',
      type: 'string',
      description: 'e.g. "Times of Israel", "Jewish Journal"',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'e.g. "January 2026" or "2025"',
    }),
    defineField({
      name: 'url',
      title: 'Article URL',
      type: 'url',
      validation: (rule) => rule.required().error('Please add the article URL.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '2-3 sentence summary of the article.',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publication',
    },
  },
});
