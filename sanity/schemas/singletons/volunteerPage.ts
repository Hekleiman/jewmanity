import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'volunteerPage',
  title: 'Volunteer Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Volunteer page.',
    }),
    defineField({
      name: 'whyVolunteerBody',
      title: 'Why Volunteer',
      type: 'portableText',
      description: 'Content explaining why volunteering with Jewmanity is meaningful.',
    }),
    defineField({
      name: 'whyVolunteerImage',
      title: 'Why Volunteer Image',
      type: 'image',
      description: 'A warm photo of volunteers in action. Recommended: 800x600px or larger.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'howToHelpCards',
      title: 'How To Help',
      type: 'array',
      description: 'Cards describing different ways people can volunteer.',
      of: [{ type: 'valueCard' }],
    }),
    defineField({
      name: 'impactStats',
      title: 'Volunteer Impact Stats',
      type: 'array',
      description: 'Key numbers showing volunteer program impact.',
      of: [{ type: 'statItem' }],
      validation: (rule) => rule.max(4).warning('4 stats maximum for this layout.'),
    }),
    defineField({
      name: 'faqContext',
      title: 'FAQ Filter',
      type: 'string',
      description: 'Internal — used to show Volunteer-specific FAQs.',
      initialValue: 'volunteer',
      hidden: true,
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the bottom call-to-action section (e.g., "Ready to Make a Difference?").',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'string',
      description: 'Brief encouraging text below the CTA heading.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Volunteer Page' };
    },
  },
});
