import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'antisemitismStat',
  title: 'Antisemitism Statistic',
  type: 'object',
  description: 'A statistic card in the Fighting Antisemitism → Understanding section.',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: "Large number or short phrase shown prominently, e.g., '360%' or '3,697'.",
      validation: (rule) => rule.required().error('Please add a value.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Short sentence explaining what the number represents.',
    }),
    defineField({
      name: 'citation',
      title: 'Citation',
      type: 'text',
      rows: 2,
      description:
        "Source of the statistic. IMPORTANT: always update the citation when you update the number. Example: 'ADL 2023 Audit of Antisemitic Incidents'.",
    }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'description' },
  },
});
