import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Grounding (anchor / arrival)', value: 'grounding' },
  { title: 'Healing (heart with cross)', value: 'healing' },
  { title: 'Connection (linked people)', value: 'connection' },
] as const;

export default defineType({
  name: 'experienceItem',
  title: 'Retreat Experience Step',
  type: 'object',
  description: 'A step in the Heads Up → The Retreat Experience journey.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Which site icon to render for this step.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Step Title',
      type: 'string',
      description: 'Short phase name (e.g., "Arrival & Grounding").',
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Step Description',
      type: 'text',
      rows: 4,
      description: 'What happens during this phase. 2-3 sentences.',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled step', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
