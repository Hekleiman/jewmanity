import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Social Media (phone / device)', value: 'social-media' },
  { title: 'Campus (graduation cap)', value: 'campus' },
  { title: 'Community (building)', value: 'community' },
  { title: 'Conspiracy (warning triangle)', value: 'conspiracy' },
] as const;

export default defineType({
  name: 'antisemitismFormCard',
  title: 'Antisemitism Form Card',
  type: 'object',
  description: 'A card describing a common form of antisemitism.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon representing this form (social-media, campus, community, conspiracy).',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: "Short card heading, e.g., 'On Social Media'.",
      validation: (rule) => rule.required().error('Please add a title.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 4,
      description: '1-2 sentences describing how antisemitism manifests in this context.',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled card', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
