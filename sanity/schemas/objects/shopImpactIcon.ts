import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Heart (healing / retreats)', value: 'heart' },
  { title: 'People (community)', value: 'people' },
  { title: 'Sparkles (ongoing care)', value: 'sparkles' },
] as const;

export default defineType({
  name: 'shopImpactIcon',
  title: 'Shop Impact Icon',
  type: 'object',
  description: 'A small icon + label shown in the Shop → Every Purchase Makes an Impact row.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Choose an icon that represents this impact area.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: "Short label under the icon, e.g., 'Healing Retreats'. Keep under ~25 characters for best visual fit.",
      validation: (rule) => rule.required().error('Please add a label.'),
    }),
  ],
  preview: {
    select: { title: 'label', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: title || 'Untitled icon', subtitle: icon ? `Icon: ${icon}` : 'No icon selected' };
    },
  },
});
