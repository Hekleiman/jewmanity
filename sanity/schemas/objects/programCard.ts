import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'programCard',
  title: 'Program Card',
  type: 'object',
  description: 'A program card shown in the homepage → How We Help You grid.',
  fields: [
    defineField({
      name: 'image',
      title: 'Card Image',
      type: 'image',
      description: 'Photo representing this program. Recommended: 600x400px or larger, landscape.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alt',
      title: 'Image Alt Text',
      type: 'string',
      description: 'Description of the image for screen readers and SEO. Keep to one short sentence.',
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: 'Program name (e.g., "Heads Up Healing Retreats").',
      validation: (rule) => rule.required().error('Please add a title for this program.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      description: 'Short blurb describing the program. 1-2 sentences.',
    }),
    defineField({
      name: 'href',
      title: 'Card Link',
      type: 'string',
      description: 'Where the "Learn More" link goes (e.g., "/programs/heads-up").',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'href', media: 'image' },
  },
});
