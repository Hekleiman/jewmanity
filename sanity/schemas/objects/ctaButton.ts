import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'ctaButton',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      description: 'The text shown on the button (e.g., "Donate Now", "Learn More").',
      validation: (rule) => rule.required().error('Every button needs a label.'),
    }),
    defineField({
      name: 'url',
      title: 'Button Link',
      type: 'string',
      description: 'Where the button links to. Use relative paths like "/donate" for internal pages, or full URLs for external sites.',
      validation: (rule) => rule.required().error('Every button needs a link destination.'),
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      description: 'Primary = solid teal button. Secondary = outlined button.',
      options: {
        list: [
          { title: 'Primary (solid teal)', value: 'primary' },
          { title: 'Secondary (outlined)', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'url' },
  },
});
