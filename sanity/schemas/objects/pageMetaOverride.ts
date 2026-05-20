import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pageMetaOverride',
  title: 'Page Meta Override',
  type: 'object',
  description:
    'Per-page SEO and social-share overrides. Leave fields blank to inherit the site-wide defaults from Site Settings.',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (browser tab and Google result)',
      type: 'string',
      description:
        'Overrides the site default page title for this page. Format suggestion: "Page Name | Jewmanity". Leave blank to use the site default.',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description:
        'Short summary shown in search results and on social shares. 1 to 2 sentences, under 160 characters.',
      validation: (rule) => rule.max(200).warning('Search engines truncate beyond ~160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'Image shown when this page is shared on Facebook, LinkedIn, iMessage, etc. Recommended: 1200x630px. Leave blank to use the site default.',
      options: { hotspot: true },
    }),
  ],
});
