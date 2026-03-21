export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role / Context', type: 'string' },
    { name: 'program', title: 'Program', type: 'string' },
    { name: 'date', title: 'Date', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
};
