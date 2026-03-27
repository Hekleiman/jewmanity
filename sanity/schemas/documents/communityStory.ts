import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'communityStory',
  title: 'Community Story',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Story Title',
      type: 'string',
      description: 'The headline for this community story.',
      validation: (rule) =>
        rule
          .required()
          .error('Please add a title for this story.')
          .max(80)
          .warning('Shorter titles display better on cards.'),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from the title. This becomes the story page URL.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 96),
      },
      validation: (rule) => rule.required().error('Click "Generate" to create the URL slug.'),
    }),
    defineField({
      name: 'image',
      title: 'Story Image',
      type: 'image',
      description: 'A photo representing this story. Recommended: 800x600px or larger, landscape.',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Every story needs an image.'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Preview',
      type: 'text',
      rows: 2,
      description: 'Short preview shown on the card. 1-2 sentences to draw readers in.',
      validation: (rule) => rule.max(200).warning('Keep the preview short — it appears on the card.'),
    }),
    defineField({
      name: 'body',
      title: 'Full Story',
      type: 'portableText',
      description: 'The complete community story. Share the experience, impact, and personal touches.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank for default order.',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      excerpt: 'excerpt',
      media: 'image',
    },
    prepare({ title, excerpt, media }) {
      return {
        title: title || 'Untitled Story',
        subtitle: excerpt || '',
        media,
      };
    },
  },
});
