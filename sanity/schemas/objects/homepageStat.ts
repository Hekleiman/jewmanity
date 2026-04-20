import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'Shield (nonprofit / trust)', value: 'shield' },
  { title: 'Calendar (established / time)', value: 'calendar' },
  { title: 'People (helped / community)', value: 'people' },
  { title: 'Heart (programs / care)', value: 'heart' },
] as const;

export default defineType({
  name: 'homepageStat',
  title: 'Homepage Stat',
  type: 'object',
  description: 'A stat displayed in the homepage → Stats Bar. Use short phrases alongside an icon.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Which site icon to render above the stat.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description:
        "Can be any short phrase or number — e.g., '501(c)(3) Nonprofit', 'Established 2019', or '1,500+ Helped'.",
      validation: (rule) => rule.required().error('Please add a value.'),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Supporting phrase displayed below the value.',
    }),
  ],
  preview: {
    select: { value: 'value', label: 'label', icon: 'icon' },
    prepare({ value, label, icon }) {
      return { title: value || 'Untitled stat', subtitle: [icon, label].filter(Boolean).join(' — ') };
    },
  },
});
