import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Star', value: 'star' },
  { title: 'Magnifying Glass (Search)', value: 'search' },
  { title: 'Heart', value: 'heart' },
  { title: 'Grid of Four', value: 'grid' },
  { title: 'Smiley Face', value: 'smiley' },
  { title: 'Shield', value: 'shield' },
  { title: 'Link', value: 'link' },
  { title: 'Clipboard', value: 'clipboard' },
  { title: 'Growth Chart', value: 'growth' },
] as const;

export default defineType({
  name: 'aboutValueCard',
  title: 'About Story Value Card',
  type: 'object',
  description: 'A value card shown in the About → Our Values section. Icons are picked from a fixed set of site SVGs.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Which site icon to render beside this card. These map to fixed SVGs used on the Our Values section.',
      options: {
        list: [...ICON_OPTIONS],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: 'A short, descriptive title for this value (e.g., "Compassion").',
      validation: (rule) => rule.required().error('Please add a title for this value.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      description: 'A brief explanation. Keep to 1-2 sentences.',
      validation: (rule) => rule.max(400).warning('Shorter descriptions look better on cards.'),
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return {
        title: title || 'Untitled value',
        subtitle: icon ? `Icon: ${icon}` : 'No icon selected',
      };
    },
  },
});
