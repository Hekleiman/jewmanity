import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Therapy (medical cross)', value: 'therapy' },
  { title: 'Accommodation (house)', value: 'accommodation' },
  { title: 'Meals (dome / plate)', value: 'meals' },
  { title: 'Transport (car / van)', value: 'transport' },
  { title: 'Activities (mountains / camera)', value: 'activities' },
  { title: 'Ongoing Support (target / circles)', value: 'support' },
] as const;

export default defineType({
  name: 'includedItem',
  title: "What's Included Item",
  type: 'object',
  description: "An item in the Heads Up → What's Included grid.",
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Which site icon to render for this item.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Item Title',
      type: 'string',
      description: 'Short name (e.g., "Daily Therapy Sessions").',
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Item Description',
      type: 'text',
      rows: 3,
      description: 'One-sentence explanation of what participants receive.',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled item', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
