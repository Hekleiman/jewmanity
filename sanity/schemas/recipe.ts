export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
    { name: 'ingredients', title: 'Ingredients', type: 'array', of: [{ type: 'text', rows: 2 }] },
    { name: 'instructions', title: 'Instructions', type: 'array', of: [{ type: 'text', rows: 3 }] },
    { name: 'culturalContext', title: 'Cultural Context', type: 'text', rows: 4 },
  ],
};
