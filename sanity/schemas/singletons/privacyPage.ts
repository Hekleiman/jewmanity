import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'privacyPage',
  title: 'Privacy Policy Page',
  type: 'document',
  description:
    'The full Privacy Policy page. Legal counsel may want to update this content. The hero strip and section formatting are styled in code; everything below the hero is editable here.',
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
      description: 'Page H1. Default: "Privacy Policy".',
      initialValue: 'Privacy Policy',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description:
        'Date this policy was last reviewed. Displayed under the heading as "Last updated: Month YYYY". Update whenever you revise the body.',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'body',
      title: 'Policy Body',
      type: 'portableText',
      description:
        'The body of the Privacy Policy. Use Heading 2 for section titles, Normal for paragraphs, and Bullet list for itemized lists. Bold and Italic available as marks. Add links via the link decorator.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Privacy Policy Page' };
    },
  },
});
