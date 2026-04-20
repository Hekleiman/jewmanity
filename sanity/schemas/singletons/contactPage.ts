import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro' },
    { name: 'form', title: 'Contact Form' },
    { name: 'otherWays', title: 'Other Ways to Connect' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Contact page.',
      group: 'hero',
    }),

    defineField({
      name: 'introText',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 4,
      description: 'Short intro paragraph displayed between the hero and the contact form.',
      group: 'intro',
    }),

    defineField({
      name: 'formHeading',
      title: 'Form Heading',
      type: 'string',
      description:
        'Heading above the contact form. The form itself (fields, subject options, submit behavior) is connected to Formspree and managed in code — contact your web developer to change those elements.',
      initialValue: 'Contact Us',
      group: 'form',
    }),
    defineField({
      name: 'privacyNote',
      title: 'Privacy Note',
      type: 'string',
      description: 'A brief privacy assurance shown near the form (e.g., "Your information is kept confidential").',
      group: 'form',
    }),

    defineField({
      name: 'otherWaysHeading',
      title: 'Other Ways Heading',
      type: 'string',
      description: "Heading for the cards section at the bottom of the contact page, e.g., 'Other Ways to Connect'.",
      initialValue: 'Other Ways to Connect',
      group: 'otherWays',
    }),
    defineField({
      name: 'otherWaysCards',
      title: 'Other Ways Cards',
      type: 'array',
      description: 'Cards showing alternative contact methods.',
      of: [{ type: 'contactCard' }],
      group: 'otherWays',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact Page' };
    },
  },
});
