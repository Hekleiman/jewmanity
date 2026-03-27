import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Hero Heading',
      type: 'string',
      description: 'The large text displayed over the hero image. Keep to 5-10 words for best impact.',
      validation: (rule) => rule.max(100).warning('Shorter headings have more visual impact.'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'A supporting line beneath the heading. 1-2 short sentences.',
      validation: (rule) => rule.max(200).warning('Keep it concise — this appears below the heading.'),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Full-width hero background. Recommended: 1920x800px or larger, landscape orientation.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctas',
      title: 'Call-to-Action Buttons',
      type: 'array',
      description: 'Up to 2 buttons displayed in the hero area.',
      of: [{ type: 'ctaButton' }],
      validation: (rule) => rule.max(2).warning('Heroes look best with 1-2 buttons.'),
    }),
  ],
});
