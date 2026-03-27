import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'The large text visitors see first (e.g., "Healing Through Community"). Keep to 5-10 words.',
      validation: (rule) => rule.max(80).warning('Shorter headings have more impact.'),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Supporting text below the heading. 1-2 short sentences.',
      validation: (rule) => rule.max(200).warning('Keep it brief — this sits below the heading.'),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'The full-width background image for the homepage hero. Recommended: 1920x800px or larger.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroCtas',
      title: 'Hero Buttons',
      type: 'array',
      description: 'Up to 2 call-to-action buttons in the hero section.',
      of: [{ type: 'ctaButton' }],
      validation: (rule) => rule.max(2).warning('The hero looks best with 1-2 buttons.'),
    }),
    defineField({
      name: 'impactStats',
      title: 'Impact Statistics',
      type: 'array',
      description: 'Key numbers that showcase Jewmanity\'s impact (e.g., "180+ Participants Supported").',
      of: [{ type: 'statItem' }],
      validation: (rule) => rule.max(4).warning('4 stats is the ideal maximum for this section.'),
    }),
    defineField({
      name: 'donationAmounts',
      title: 'Suggested Donation Amounts',
      type: 'array',
      description: 'The pre-set donation buttons shown on the homepage.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'amount',
              title: 'Dollar Amount',
              type: 'number',
              description: 'The donation amount in dollars (e.g., 36).',
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'A short label (e.g., "Supporter", "Champion").',
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
              return { title: `$${amount || 0} — ${label || 'Unnamed'}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter Heading',
      type: 'string',
      description: 'Heading for the newsletter signup section (e.g., "Stay Connected").',
    }),
    defineField({
      name: 'newsletterDescription',
      title: 'Newsletter Description',
      type: 'string',
      description: 'Brief text encouraging visitors to subscribe.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' };
    },
  },
});
