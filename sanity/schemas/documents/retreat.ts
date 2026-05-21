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
      type: 'array',
      description: 'The full retreat story. Write about the experience, activities, and impact. Insert images between paragraphs with the + button.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Heading 5', value: 'h5' },
            { title: 'Heading 6', value: 'h6' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    description: 'The web address to link to. Use full URLs (https://...) for external sites, or relative paths (/donate) for internal pages.',
                    validation: (rule) =>
                      rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    description: 'Turn on for external links so visitors stay on the Jewmanity site.',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Inline Image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Describe the image for screen readers and visitors who can\'t see it (e.g., "Participants gathered around a fire pit at sunset").',
              validation: (rule) => rule.required().error('Add alt text so this image is accessible.'),
            },
          ],
        }),
      ],
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
