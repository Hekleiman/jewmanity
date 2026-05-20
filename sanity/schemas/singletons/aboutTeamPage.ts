import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutTeamPage',
  title: 'Team Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'teamSection', title: 'Team Section' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Team page.',
      group: 'hero',
    }),

    defineField({
      name: 'teamSectionHeading',
      title: 'Team Section Heading',
      type: 'string',
      description: 'Heading above the grid of team members. Default: "Our Team".',
      initialValue: 'Our Team',
      group: 'teamSection',
    }),
    defineField({
      name: 'teamSectionSubtitle',
      title: 'Team Section Subtitle',
      type: 'text',
      rows: 3,
      description: 'Short paragraph below the heading describing the team.',
      group: 'teamSection',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the call-to-action section at the bottom of the page (e.g., "Be Part of the Work We Do").',
      initialValue: 'Be Part of the Work We Do',
      validation: (rule) => rule.max(80).warning('Shorter headings have more impact.'),
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the CTA heading. Keep to 1 or 2 sentences.',
      initialValue: 'Join a growing community committed to service, responsibility, and impact.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryButton',
      title: 'CTA Primary Button',
      type: 'object',
      description: 'The main call-to-action button.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'Where the button links to (e.g., "/get-involved/volunteer").',
        }),
      ],
    }),
    defineField({
      name: 'ctaSecondaryButton',
      title: 'CTA Secondary Button (optional)',
      type: 'object',
      description: 'Optional secondary outlined button shown next to the primary one. Leave text and link blank to hide.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({ name: 'href', title: 'Button Link', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Team Page' };
    },
  },
});
