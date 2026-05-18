import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'programsPastRetreatsPage',
  title: 'Past Retreats Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'grid', title: 'Retreat Grid Heading' },
    { name: 'testimonials', title: 'Testimonials Section' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Past Retreats page.',
      group: 'hero',
    }),

    defineField({
      name: 'gridHeading',
      title: 'Retreat Grid Heading',
      type: 'string',
      description: 'Heading shown above the retreats grid (e.g., "Stories of courage, connection, and healing").',
      initialValue: 'Stories of courage, connection, and healing',
      validation: (rule) => rule.max(100).warning('Shorter headings have more impact.'),
      group: 'grid',
    }),
    defineField({
      name: 'gridSubtitle',
      title: 'Retreat Grid Subtitle',
      type: 'text',
      rows: 4,
      description: 'Supporting paragraph shown below the grid heading.',
      group: 'grid',
    }),

    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials Heading',
      type: 'string',
      description: 'Heading above the testimonial carousel.',
      initialValue: 'What Our Attendees Say',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonialsSubtitle',
      title: 'Testimonials Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short line below the testimonials heading.',
      group: 'testimonials',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the call-to-action section at the bottom (e.g., "Healing Happens Together").',
      initialValue: 'Healing Happens Together',
      validation: (rule) => rule.max(80).warning('Shorter headings have more impact.'),
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the CTA heading.',
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
          description: 'Where the button links to (e.g., "/programs/heads-up").',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Past Retreats Page' };
    },
  },
});
