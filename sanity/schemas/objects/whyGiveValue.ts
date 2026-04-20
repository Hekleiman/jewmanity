import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'whyGiveValue',
  title: 'Why Give Value Prop',
  type: 'object',
  description: 'A value proposition shown in the Donate → Why Give section. Each renders with a green check-mark.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "Short heading for this value prop (e.g., 'Dignity in Healing'). Keep under ~30 characters.",
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '1-2 sentences explaining this value.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
