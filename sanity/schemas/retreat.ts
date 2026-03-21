export default {
  name: 'retreat',
  title: 'Retreat',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'author', title: 'Author', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'date', title: 'Date', type: 'string' },
    { name: 'description', title: 'Short Description', type: 'text', rows: 3 },
    { name: 'image', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'body', title: 'Article Body', type: 'array', of: [{ type: 'block' }] },
  ],
};
