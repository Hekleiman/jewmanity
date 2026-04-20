import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Shield (soldiers / protection)', value: 'shield' },
  { title: 'Heart (love / loss)', value: 'heart' },
  { title: 'Family (group of people)', value: 'family' },
] as const;

export default defineType({
  name: 'supportCard',
  title: 'Who We Support Card',
  type: 'object',
  description: 'A card in the Heads Up → Who We Support section. Each card picks an icon from a fixed set.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Which site icon to render on this card.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: 'Short descriptor (e.g., "Israeli Soldiers").',
      validation: (rule) => rule.required().error('Please add a title for this card.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      description: 'Brief explanation of who this group is. 1-2 sentences work best.',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled card', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
