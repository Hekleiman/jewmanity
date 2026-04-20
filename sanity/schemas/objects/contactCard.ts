import { defineType, defineField } from 'sanity';

const ICON_OPTIONS = [
  { title: 'People (community / involvement)', value: 'people' },
  { title: 'Book (resources / knowledge)', value: 'book' },
  { title: 'Heart (support / care)', value: 'heart' },
] as const;

export default defineType({
  name: 'contactCard',
  title: 'Contact Page Card',
  type: 'object',
  description: 'A card in the Contact → Other Ways to Connect section.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Which site icon to render on this card.',
      options: { list: [...ICON_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      description: 'Short title (e.g., "Get Involved").',
      validation: (rule) => rule.required().error('Please add a title for this card.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      description: 'Brief explanation of this connection option. 1-2 sentences.',
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: "Button or link text shown at the bottom of the card. Usually 'Learn More' or similar.",
      initialValue: 'Learn More',
    }),
    defineField({
      name: 'href',
      title: 'Card Link',
      type: 'string',
      description: "Where the card links to. Internal path like '/donate' or full URL like 'https://...'.",
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon', subtitle: 'href' },
    prepare({ title, icon, subtitle }) {
      return { title: title || 'Untitled card', subtitle: [icon, subtitle].filter(Boolean).join(' — ') };
    },
  },
});
