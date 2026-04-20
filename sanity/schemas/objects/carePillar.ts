import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Clinical (clipboard)', value: 'clinical' },
  { title: 'Holistic (clock / balance)', value: 'holistic' },
  { title: 'Community (group)', value: 'community' },
] as const;

export default defineType({
  name: 'carePillar',
  title: 'Evidence-Based Care Pillar',
  type: 'object',
  description: 'A pillar in the Heads Up → Evidence-Based Care section.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Which site icon to render for this pillar.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Pillar Title',
      type: 'string',
      description: 'Short name (e.g., "Clinical Excellence").',
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Pillar Description',
      type: 'text',
      rows: 4,
      description: 'How this pillar shows up in the program.',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled pillar', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
