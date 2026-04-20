import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Meals (plate / food)', value: 'meals' },
  { title: 'Transport (car / van)', value: 'transport' },
  { title: 'Hosting (home)', value: 'hosting' },
  { title: 'Support (circles / target)', value: 'support' },
] as const;

export default defineType({
  name: 'howToHelpCard',
  title: 'How To Help Card',
  type: 'object',
  description: 'A card in the Volunteer → How You Can Help section.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Choose an icon that matches this opportunity.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: "Short card heading, e.g., 'Preparing Meals'.",
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      description: '1-2 sentences describing the volunteer role.',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled card', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
