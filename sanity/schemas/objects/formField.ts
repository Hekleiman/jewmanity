import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  description:
    'A single field on a form. The "name" must match the HTML form field name used by the code (e.g., firstName, email, subject). Reorder fields by dragging.',
  fields: [
    defineField({
      name: 'name',
      title: 'Field Name (code identifier)',
      type: 'string',
      description:
        'The HTML field name. Must match what the form code expects. Do not change unless you have updated the corresponding Astro component.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label (visible)',
      type: 'string',
      description: 'Text shown to visitors above the field (e.g., "First Name", "Email Address").',
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
      description: 'Light gray hint text shown inside an empty field (e.g., "Enter your first name").',
    }),
    defineField({
      name: 'helperText',
      title: 'Helper Text (optional)',
      type: 'string',
      description: 'Small note shown under the field. Leave blank if not needed.',
    }),
    defineField({
      name: 'type',
      title: 'Input Type',
      type: 'string',
      description:
        'Controls how the field renders. text, email, tel, textarea, select, checkboxGroup, radioGroup. Set in code; only change if the form has been updated.',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
          { title: 'Textarea (multi-line)', value: 'textarea' },
          { title: 'Select (dropdown)', value: 'select' },
          { title: 'Checkbox group', value: 'checkboxGroup' },
          { title: 'Radio group', value: 'radioGroup' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      description: 'When ON, the field shows a red asterisk and the form will not submit without it.',
      initialValue: false,
    }),
    defineField({
      name: 'options',
      title: 'Options (for select / checkbox / radio)',
      type: 'array',
      description:
        'List of choices for select, checkboxGroup, and radioGroup fields. Each option has a label (visible) and a value (sent with the form). For most cases label and value are the same.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'value',
              title: 'Submitted Value',
              type: 'string',
              description: 'What gets sent with the form. Leave blank to use the label.',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'name', type: 'type' },
    prepare({ title, subtitle, type }) {
      return { title: title || '(no label)', subtitle: `${subtitle || '?'} · ${type || 'text'}` };
    },
  },
});
