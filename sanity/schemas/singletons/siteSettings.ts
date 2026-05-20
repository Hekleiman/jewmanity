import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Organization Identity', default: true },
    { name: 'social', title: 'Social Media' },
    { name: 'footer', title: 'Footer' },
    { name: 'meta', title: 'Site Meta Defaults' },
    { name: 'address', title: 'Organization Address' },
    { name: 'donate', title: 'Donate Widget' },
  ],
  fields: [
    defineField({
      name: 'orgName',
      title: 'Organization Name',
      type: 'string',
      description: 'The official organization name displayed across the site.',
      initialValue: 'Jewmanity',
      group: 'identity',
    }),
    defineField({
      name: 'ein',
      title: 'EIN Number',
      type: 'string',
      description: 'Your EIN number displayed in the footer, e.g., "12-3456789". This is required for 501(c)(3) compliance.',
      group: 'identity',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Logo image used in the nav, footer, and structured data. PNG, transparent background, around 400x267px.',
      options: { hotspot: true },
      group: 'identity',
    }),
    defineField({
      name: 'foundingYear',
      title: 'Founding Year',
      type: 'string',
      description: 'Year the organization was founded. Used in structured data and copyright contexts.',
      initialValue: '2019',
      group: 'identity',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      description: 'Links to your social media profiles. These appear in the footer.',
      group: 'social',
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
      group: 'footer',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright notice in the footer. The year updates automatically.',
      group: 'footer',
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      description:
        'Legal links shown at the bottom of every page. Default set: Privacy Policy /privacy, Terms of Service /terms, Nonprofit Disclosures /nonprofit-disclosures.',
      group: 'footer',
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
    defineField({
      name: 'footerDisclaimer',
      title: 'Footer Disclaimer',
      type: 'text',
      rows: 2,
      description:
        'Legal disclaimer at the bottom of the footer. Default: "All donations are tax-deductible to the fullest extent allowed by law." Review wording with counsel before changing.',
      group: 'footer',
    }),
    defineField({
      name: 'defaultPageTitle',
      title: 'Default Page Title',
      type: 'string',
      description:
        'Default browser-tab title used when a page does not set its own. Current value: "Jewmanity | Supporting Healing & Resilience".',
      group: 'meta',
    }),
    defineField({
      name: 'defaultPageDescription',
      title: 'Default Page Description',
      type: 'text',
      rows: 2,
      description:
        'Default meta description used when a page does not set its own. 1 to 2 sentences. Search engines truncate beyond ~160 characters.',
      validation: (rule) => rule.max(200).warning('Search engines truncate beyond ~160 characters.'),
      group: 'meta',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Open Graph Image',
      type: 'image',
      description:
        'Default social-share image. 1200x630px. Used on pages that do not set their own OG image.',
      options: { hotspot: true },
      group: 'meta',
    }),
    defineField({
      name: 'address',
      title: 'Organization Address',
      type: 'object',
      description: 'Drives the address block in the structured data (JSON-LD) emitted on every page.',
      group: 'address',
      fields: [
        defineField({
          name: 'streetAddress',
          title: 'Street Address',
          type: 'string',
        }),
        defineField({
          name: 'addressLocality',
          title: 'City',
          type: 'string',
          initialValue: 'San Diego',
        }),
        defineField({
          name: 'addressRegion',
          title: 'State / Region',
          type: 'string',
          initialValue: 'CA',
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        }),
        defineField({
          name: 'addressCountry',
          title: 'Country (ISO code)',
          type: 'string',
          initialValue: 'US',
        }),
      ],
    }),
    defineField({
      name: 'givebutterAccountId',
      title: 'Givebutter Account ID',
      type: 'string',
      description:
        'Givebutter account ID for the donate-page widget. Find it in your Givebutter dashboard under Widget Embed (the value after "acct="). Current value: qGMyp9PcvINJwyvd.',
      group: 'donate',
    }),
    defineField({
      name: 'givebutterWidgetId',
      title: 'Givebutter Widget ID',
      type: 'string',
      description:
        'Givebutter widget ID for the donate-page widget. Find it in your dashboard under Widget Embed (the value inside givebutter-widget id="..."). Current value: g8MJdP.',
      group: 'donate',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
