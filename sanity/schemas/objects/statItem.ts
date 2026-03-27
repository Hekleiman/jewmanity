import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'statItem',
  title: 'Stat Counter',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Number',
      type: 'string',
      description: 'The number to display. Include commas if needed (e.g., "1,500").',
      validation: (rule) => rule.required().error('Please enter the stat number.'),
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'Optional text after the number, like "+" or "%".',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'What this number represents (e.g., "Participants Supported", "Events Hosted").',
      validation: (rule) => rule.required().error('Please describe what this number represents.'),
    }),
  ],
  preview: {
    select: { value: 'value', suffix: 'suffix', label: 'label' },
    prepare({ value, suffix, label }) {
      return {
        title: `${value || '0'}${suffix || ''} — ${label || ''}`,
      };
    },
  },
});
