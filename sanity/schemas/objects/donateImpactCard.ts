import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Heart (therapy / healing)', value: 'heart' },
  { title: 'People (community / peer support)', value: 'people' },
  { title: 'Shield (anti-antisemitism / protection)', value: 'shield' },
] as const;

export default defineType({
  name: 'donateImpactCard',
  title: 'Donate Impact Card',
  type: 'object',
  description: 'A card in the Donate → Every Donation Makes an Impact section.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon representing this impact area.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: "Short card heading, e.g., 'Therapy & Healing Retreats'.",
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 4,
      description: '2-3 sentence explanation of how donations support this area.',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled card', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
