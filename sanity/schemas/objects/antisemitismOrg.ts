import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'antisemitismOrg',
  title: 'Antisemitism Organization',
  type: 'object',
  description: 'An organization card in the Fighting Antisemitism page. Each card opens in a new tab when clicked.',
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      description: "Organization name (e.g., 'Anti-Defamation League').",
      validation: (rule) => rule.required().error('Please add a name.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '1 sentence describing what this organization does.',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: "Full URL to the organization's website. Include https:// at the start.",
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('Please enter a full URL starting with https://'),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'url' },
  },
});
