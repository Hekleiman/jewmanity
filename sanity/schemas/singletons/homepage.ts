import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'howWeHelp', title: 'How We Help' },
    { name: 'impactStories', title: 'Impact Stories' },
    { name: 'donation', title: 'Donation CTA' },
    { name: 'newsletter', title: 'Newsletter' },
    { name: 'stats', title: 'Stats Bar' },
  ],
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'The large text visitors see first. Keep to 5-10 words for impact.',
      validation: (rule) => rule.max(80).warning('Shorter headings have more impact.'),
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Supporting text below the heading. 1-2 short sentences.',
      validation: (rule) => rule.max(200).warning('Keep it brief — this sits below the heading.'),
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'The full-width background image for the homepage hero. Recommended: 1920x800px or larger.',
      options: { hotspot: true },
      group: 'hero',
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image Alt Text',
      type: 'string',
      description: 'Alt text for screen readers and SEO — describe the image briefly.',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Hero Primary Button',
      type: 'object',
      description: 'The main call-to-action button in the hero. Always visible.',
      group: 'hero',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'Where the button goes (e.g., "/about/story").',
        }),
      ],
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Hero Secondary Button (optional)',
      type: 'object',
      description: 'Optional secondary button shown next to the primary one. Leave text/link blank to hide.',
      group: 'hero',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({ name: 'href', title: 'Button Link', type: 'string' }),
      ],
    }),

    defineField({
      name: 'howWeHelpHeading',
      title: 'How We Help Heading',
      type: 'string',
      description: 'Heading for the programs grid section.',
      initialValue: 'How We Help You',
      group: 'howWeHelp',
    }),
    defineField({
      name: 'howWeHelpSubtitle',
      title: 'How We Help Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short line below the heading.',
      group: 'howWeHelp',
    }),
    defineField({
      name: 'howWeHelpPrograms',
      title: 'Program Cards',
      type: 'array',
      description: 'Cards displayed in the How We Help You grid (usually 4).',
      of: [{ type: 'programCard' }],
      group: 'howWeHelp',
    }),

    defineField({
      name: 'impactStoriesHeading',
      title: 'Impact Stories Heading',
      type: 'string',
      description: 'Heading for the testimonials carousel section.',
      initialValue: 'Impact Stories',
      group: 'impactStories',
    }),
    defineField({
      name: 'impactStoriesSubtitle',
      title: 'Impact Stories Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short line below the heading. Testimonials themselves come from the Testimonials section of Studio.',
      group: 'impactStories',
    }),

    defineField({
      name: 'donationHeading',
      title: 'Donation Section Heading',
      type: 'string',
      description: 'Heading for the donation tiers section.',
      initialValue: 'How You Can Help',
      group: 'donation',
    }),
    defineField({
      name: 'donationSubtitle',
      title: 'Donation Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short line below the donation heading.',
      group: 'donation',
    }),
    defineField({
      name: 'donationAmounts',
      title: 'Suggested Donation Amounts',
      type: 'array',
      description: 'The pre-set donation buttons shown on the homepage.',
      group: 'donation',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'amount',
              title: 'Dollar Amount',
              type: 'number',
              description: 'The donation amount in dollars (e.g., 36). Displayed as "$36".',
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'label',
              title: 'Label (optional)',
              type: 'string',
              description: "Optional short label displayed below the amount (e.g., 'Chai', 'Double Chai'). Leave blank if not needed.",
            }),
            defineField({
              name: 'description',
              title: 'Impact Description',
              type: 'string',
              description: 'What this amount provides (e.g., "Provides supplies for one retreat participant").',
            }),
          ],
          preview: {
            select: { amount: 'amount', label: 'label' },
            prepare({ amount, label }) {
              return { title: `$${amount || 0}${label ? ' — ' + label : ''}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'donationButton',
      title: 'Donation Section Button',
      type: 'object',
      description: 'The "Learn More" button displayed below the tier grid.',
      group: 'donation',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({ name: 'href', title: 'Button Link', type: 'string' }),
      ],
    }),
    defineField({
      name: 'donationFooterText',
      title: 'Donation Footer Text',
      type: 'text',
      rows: 3,
      description: 'Small print displayed under the donation button.',
      group: 'donation',
    }),

    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter Heading',
      type: 'string',
      description: 'Heading for the newsletter signup section.',
      initialValue: 'Stay Connected',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterDescription',
      title: 'Newsletter Description',
      type: 'string',
      description: 'Brief text encouraging visitors to subscribe.',
      group: 'newsletter',
    }),

    defineField({
      name: 'statsItems',
      title: 'Stats Bar Items',
      type: 'array',
      description: 'Trust-builder stats shown at the bottom of the homepage (usually 4).',
      of: [{ type: 'homepageStat' }],
      validation: (rule) => rule.max(6).warning('Keep to 4 stats for best visual fit.'),
      group: 'stats',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' };
    },
  },
});
