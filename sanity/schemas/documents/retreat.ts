import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'retreat',
  title: 'Retreat',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Retreat Title',
      type: 'string',
      description: 'The name of this retreat article (e.g., "Healing Together: January 2024 Retreat").',
      validation: (rule) =>
        rule
          .required()
          .error('Please add a retreat title.')
          .max(100)
          .warning('Shorter titles work better on cards.'),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from the title. This becomes the page URL.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 96),
      },
      validation: (rule) => rule.required().error('Click "Generate" to create the URL slug.'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'A short tagline (e.g., "Winter in San Diego"). Shown below the title on the card.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Who wrote this article (e.g., "Written by retreat assistant, Kate H.").',
    }),
    defineField({
      name: 'date',
      title: 'Retreat Date',
      type: 'date',
      description: 'When the retreat took place. Used for sorting (newest first).',
      options: { dateFormat: 'MMMM D, YYYY' },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'The main photo for this retreat. Shown as the card thumbnail and article header. Recommended: 1200x800px.',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Every retreat article needs a cover image.'),
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      description: 'Additional photos from the retreat. These appear in a gallery on the article page.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'portableText',
      description: 'The full retreat story. Write about the experience, activities, and impact.',
    }),
    defineField({
      name: 'participants',
      title: 'Number of Participants',
      type: 'number',
      description: 'How many people attended (e.g., 15). Shown as a stat on the article.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where the retreat took place (e.g., "San Diego, CA").',
    }),
    defineField({
      name: 'orderRank',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank to sort by date.',
    }),
  ],
  orderings: [
    { title: 'Date (Newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
    },
    prepare({ title, date, media }) {
      return {
        title: title || 'Untitled Retreat',
        subtitle: date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '',
        media,
      };
    },
  },
});
