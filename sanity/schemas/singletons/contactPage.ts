import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Contact page.',
    }),
    defineField({
      name: 'privacyNote',
      title: 'Privacy Note',
      type: 'string',
      description: 'A brief privacy assurance shown near the form (e.g., "Your information is kept confidential").',
    }),
    defineField({
      name: 'otherWaysCards',
      title: 'Other Ways to Connect',
      type: 'array',
      description: 'Cards showing alternative contact methods (email, social media, etc.).',
      of: [{ type: 'valueCard' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact Page' };
    },
  },
});
