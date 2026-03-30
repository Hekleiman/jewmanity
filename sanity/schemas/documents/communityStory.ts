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
          .max(120)
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
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'Category badge shown on the card (e.g., "Jewmanity Retreat", "Community Impact").',
      options: {
        list: [
          { title: 'Jewmanity Retreat', value: 'Jewmanity Retreat' },
          { title: 'Jewmanity Volunteer', value: 'Jewmanity Volunteer' },
          { title: 'Community Impact', value: 'Community Impact' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Story Image',
      type: 'image',
      description: 'A photo representing this story. Recommended: 800x600px or larger, landscape.',
      options: { hotspot: true },
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
      name: 'paragraphs',
      title: 'Story Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      description: 'The full story broken into paragraphs. Each array item is one paragraph.',
    }),
    defineField({
      name: 'body',
      title: 'Full Story (Rich Text)',
      type: 'portableText',
      description: 'Alternative rich-text body. Used only if paragraphs field is empty.',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'text',
      rows: 2,
      description: 'An optional highlighted quote displayed within the story card.',
    }),
    defineField({
      name: 'pullQuoteAttribution',
      title: 'Pull Quote Attribution',
      type: 'string',
      description: 'Who said the pull quote (e.g., "Kate H., Retreat Assistant").',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Link',
      type: 'url',
      description: 'For stories about external organizations. Opens in a new tab.',
    }),
    defineField({
      name: 'internalUrl',
      title: 'Internal Link',
      type: 'string',
      description: 'For Jewmanity stories. A relative path like /programs/past-retreats.',
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
      tag: 'tag',
      media: 'image',
    },
    prepare({ title, tag, media }) {
      return {
        title: title || 'Untitled Story',
        subtitle: tag || '',
        media,
      };
    },
  },
});
