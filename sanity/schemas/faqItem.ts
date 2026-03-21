export default {
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'answer', title: 'Answer', type: 'text', rows: 4 },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['volunteer', 'donate', 'general'] } },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
};
