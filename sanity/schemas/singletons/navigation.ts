import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'navigation',
  title: 'Site Navigation',
  type: 'document',
  description:
    'Top-level navigation labels, links, and ordering. Used by both the desktop nav and the mobile menu. Changes here affect every page.',
  fields: [
    defineField({
      name: 'items',
      title: 'Top-Level Nav Items',
      type: 'array',
      description:
        'The nav items shown across the top of the desktop nav and as accordions in the mobile menu. Reorder by dragging. Each item can have child links shown in a dropdown.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Visible text for the nav item (e.g., "About", "Programs").',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              description:
                'Where this nav item links. Use a relative path like "/about/story" for internal pages, or a full URL for external.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'children',
              title: 'Child Links (dropdown)',
              type: 'array',
              description:
                'Optional. If set, the parent label gets a dropdown caret and these appear inside. Leave empty for a simple flat link.',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'Link URL',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'Nav CTA Button',
      type: 'object',
      description:
        'The pill-shaped button at the top-right of the nav. Default: "Support Healing" linking to /donate.',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          description: 'e.g., "Support Healing".',
        }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'Usually /donate.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Navigation' };
    },
  },
});
