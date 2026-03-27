import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'orgName',
      title: 'Organization Name',
      type: 'string',
      description: 'The official organization name displayed across the site.',
      initialValue: 'Jewmanity',
    }),
    defineField({
      name: 'ein',
      title: 'EIN Number',
      type: 'string',
      description: 'Your EIN number displayed in the footer, e.g., "12-3456789". This is required for 501(c)(3) compliance.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      description: 'Links to your social media profiles. These appear in the footer.',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Full URL to your Facebook page (e.g., "https://facebook.com/jewmanity").',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Full URL to your Instagram profile.',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter / X URL',
          type: 'url',
          description: 'Full URL to your Twitter/X profile.',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          description: 'Full URL to your LinkedIn page.',
        }),
      ],
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      description: 'A short tagline shown in the footer (e.g., "Healing Through Community").',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright notice in the footer. The year updates automatically.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
