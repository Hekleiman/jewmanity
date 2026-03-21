export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'description', title: 'Description', type: 'text', rows: 4 },
    { name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] },
    { name: 'image', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'images', title: 'Gallery Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
  ],
};
