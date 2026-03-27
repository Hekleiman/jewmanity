import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'The team member\'s display name (e.g., "Belinda Katz").',
      validation: (rule) => rule.required().error('Please enter the team member\'s name.'),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'Their position at Jewmanity (e.g., "Founder & Executive Director").',
      validation: (rule) => rule.required().error('Please add their role or title.'),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description: 'A professional headshot or friendly photo. Recommended: square crop, 400x400px or larger.',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Every team member needs a photo.'),
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
      description: 'A brief biography. 2-3 sentences about their background and what they do at Jewmanity.',
      validation: (rule) => rule.max(300).warning('Keep bios concise — under 300 characters.'),
    }),
    defineField({
      name: 'orderRank',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Use this to control the order on the About page (e.g., Founder = 1).',
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Name A-Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
});
