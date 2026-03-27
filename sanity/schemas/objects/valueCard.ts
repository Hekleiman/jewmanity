import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'valueCard',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'An emoji that represents this item (e.g., "🏠", "💚", "🧠").',
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: 'A short, descriptive title for this card.',
      validation: (rule) => rule.required().error('Please add a title for this card.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      description: 'A brief explanation. Keep to 1-2 sentences.',
      validation: (rule) => rule.max(200).warning('Shorter descriptions look better on cards.'),
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return {
        title: icon ? `${icon} ${title}` : title || 'Untitled card',
      };
    },
  },
});
