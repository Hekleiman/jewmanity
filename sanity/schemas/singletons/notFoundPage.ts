import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'notFoundPage',
  title: '404 Page',
  type: 'document',
  description: 'Content shown to visitors who land on a URL that does not exist.',
  fields: [
    defineField({
      name: 'meta',
      title: 'Page Meta (SEO)',
      type: 'pageMetaOverride',
      description:
        'Overrides for the browser tab title, meta description, and social share image on the 404 page.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading (e.g., "Page Not Found").',
      initialValue: 'Page Not Found',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 3,
      description:
        'Short reassuring message under the heading. 1 to 2 sentences. Default: "The page you are looking for does not exist or has been moved. Let us get you back on track."',
    }),
    defineField({
      name: 'buttons',
      title: 'Action Buttons',
      type: 'array',
      description:
        'Up to 3 action buttons shown below the body. First is the primary (filled), the others are outlined.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Button Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Button URL',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
      validation: (rule) => rule.max(3).warning('3 buttons maximum fit on one row.'),
    }),
  ],
  preview: {
    prepare() {
      return { title: '404 Page' };
    },
  },
});
