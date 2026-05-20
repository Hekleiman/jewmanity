import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'formMessages',
  title: 'Form Messages',
  type: 'object',
  description:
    'The strings shown around form submission state (submit button, loading, success, error, and the configuration-pending placeholder).',
  fields: [
    defineField({
      name: 'submitButton',
      title: 'Submit Button Text',
      type: 'string',
      description: 'e.g., "Send Message", "Submit Volunteer Application".',
    }),
    defineField({
      name: 'submittingButton',
      title: 'Submitting Button Text',
      type: 'string',
      description: 'Shown while the form is being submitted (e.g., "Sending...", "Submitting...").',
    }),
    defineField({
      name: 'success',
      title: 'Success Message',
      type: 'text',
      rows: 2,
      description: 'Shown after a successful submission.',
    }),
    defineField({
      name: 'error',
      title: 'Error Message',
      type: 'text',
      rows: 2,
      description: 'Shown if the submission fails (network error, server error, etc.).',
    }),
    defineField({
      name: 'configurationPending',
      title: 'Configuration Pending Message',
      type: 'text',
      rows: 3,
      description:
        'Shown when the form has not yet been wired up to Formspree. Visitors see this in place of the form.',
    }),
  ],
});
