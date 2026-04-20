import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description: 'The testimonial text. Use their exact words — authentic quotes resonate most.',
      validation: (rule) =>
        rule
          .required()
          .error('Please add the testimonial quote.')
          .max(500)
          .warning('Shorter quotes have more impact — try to keep under 500 characters.'),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'Who said this (e.g., "Sarah M." or "Anonymous Retreat Participant").',
      validation: (rule) => rule.required().error('Please add the author\'s name (or "Anonymous").'),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Context',
      type: 'string',
      description: 'Additional context (e.g., "Retreat Participant, January 2024" or "Volunteer since 2023").',
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Photo',
      type: 'image',
      description: 'Optional headshot. Recommended: square, 200x200px or larger.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      title: 'Carousel Excerpt',
      type: 'text',
      rows: 2,
      description: 'Short 1-2 sentence version shown in carousels. Keep under 200 characters.',
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'authorName', maxLength: 96 },
      description: 'Used for anchor links on the Community Stories page.',
    }),
    defineField({
      name: 'context',
      title: 'Display Context',
      type: 'string',
      description: 'Where should this testimonial appear? Used to filter testimonials by page.',
      options: {
        list: [
          { title: 'Retreat', value: 'retreat' },
          { title: 'Volunteer', value: 'volunteer' },
          { title: 'Heads Up Program', value: 'headsup' },
          { title: 'Antisemitism Story', value: 'antisemitism' },
          { title: 'General / Homepage', value: 'general' },
        ],
        layout: 'radio',
      },
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
      quote: 'quote',
      author: 'authorName',
      media: 'authorImage',
    },
    prepare({ quote, author, media }) {
      const excerpt = quote && quote.length > 60 ? `${quote.slice(0, 60)}...` : quote;
      return {
        title: excerpt || 'Empty testimonial',
        subtitle: author || 'Unknown author',
        media,
      };
    },
  },
});
