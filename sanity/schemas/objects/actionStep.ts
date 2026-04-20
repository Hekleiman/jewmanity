import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'actionStep',
  title: 'Action Step',
  type: 'object',
  description: 'A numbered action step. Steps auto-number by position — drag to reorder in Studio and numbers update automatically.',
  fields: [
    defineField({
      name: 'title',
      title: 'Step Title',
      type: 'string',
      description: "Short step title, e.g., 'Educate Yourself'.",
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Step Description',
      type: 'text',
      rows: 4,
      description: '1-2 sentences explaining what this step looks like in practice.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
