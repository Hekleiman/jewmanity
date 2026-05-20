import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'termsPage',
  title: 'Terms of Service Page',
  type: 'document',
  description:
    'The full Terms of Service page. Legal counsel may want to update this content. The hero strip and section formatting are styled in code; everything below the hero is editable here.',
  fields: [
    defineField({
      name: 'meta',
      title: 'Page Meta (SEO)',
      type: 'pageMetaOverride',
    }),
    defineField({
      name: 'heading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Page H1. Default: "Terms of Service".',
      initialValue: 'Terms of Service',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description:
        'Date these terms were last reviewed. Displayed under the heading as "Last updated: Month YYYY". Update whenever you revise the body.',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'body',
      title: 'Terms Body',
      type: 'portableText',
      description:
        'The body of the Terms of Service. Use Heading 2 for section titles, Normal for paragraphs, and Bullet list for itemized lists. Bold and Italic available as marks. Add links via the link decorator.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Terms of Service Page' };
    },
  },
});
