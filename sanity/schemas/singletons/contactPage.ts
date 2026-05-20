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
        'Heading above the contact form. The fields, dropdown options, and submission messages are now editable in the Form Fields and Messages section below.',
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
      name: 'formSection',
      title: 'Form Fields and Messages',
      type: 'object',
      description:
        'Labels, placeholders, dropdown options, and submission messages for the contact form. The form has 5 fields: firstName, lastName, email, subject, message. Adding or removing fields here without a code change will not affect the form.',
      group: 'form',
      fields: [
        defineField({
          name: 'fields',
          title: 'Form Fields',
          type: 'array',
          description:
            'The 5 fields on the contact form. Match the "Field Name" exactly to what is in code: firstName, lastName, email, subject, message.',
          of: [{ type: 'formField' }],
        }),
        defineField({
          name: 'messages',
          title: 'Submit and Status Messages',
          type: 'formMessages',
        }),
      ],
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
