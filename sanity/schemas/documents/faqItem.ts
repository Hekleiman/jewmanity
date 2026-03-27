import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'The frequently asked question, exactly as a visitor would ask it.',
      validation: (rule) => rule.required().error('Please enter the question.'),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'portableText',
      description: 'The answer to this question. Keep it clear, friendly, and concise. You can use bold, links, and lists.',
    }),
    defineField({
      name: 'context',
      title: 'Page Context',
      type: 'string',
      description: 'Which page should this FAQ appear on? "General" shows it everywhere.',
      options: {
        list: [
          { title: 'Volunteer Page', value: 'volunteer' },
          { title: 'Donate Page', value: 'donate' },
          { title: 'General / All Pages', value: 'general' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'orderRank',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Use this to control the display order.',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'question', context: 'context' },
    prepare({ title, context }) {
      return {
        title: title || 'Untitled FAQ',
        subtitle: context ? `Shown on: ${context}` : 'No page assigned',
      };
    },
  },
});
