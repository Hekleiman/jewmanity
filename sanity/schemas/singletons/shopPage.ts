import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'shopPage',
  title: 'Shop Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Shop page.',
    }),
    defineField({
      name: 'introDescription',
      title: 'Intro Description',
      type: 'text',
      rows: 3,
      description: 'Brief text below the hero explaining the shop and its purpose (e.g., "Every purchase supports our programs").',
    }),
    defineField({
      name: 'impactIcons',
      title: 'Impact Icons',
      type: 'array',
      description: 'Small icon cards showing the impact of purchases (e.g., "100% of proceeds fund programs").',
      of: [{ type: 'valueCard' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Shop Page' };
    },
  },
});
