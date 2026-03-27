import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'The product\'s display name (e.g., "Pink Trucker Hat").',
      validation: (rule) =>
        rule
          .required()
          .error('Please add a product name.')
          .max(80)
          .warning('Shorter names display better on cards.'),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from the name. This becomes the product page URL.',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 96),
      },
      validation: (rule) => rule.required().error('Click "Generate" to create the URL slug.'),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Product price in USD (e.g., 35.00). Do not include the dollar sign.',
      validation: (rule) =>
        rule.required().error('Please set a price.').min(0).error('Price cannot be negative.'),
    }),
    defineField({
      name: 'description',
      title: 'Product Description',
      type: 'text',
      rows: 4,
      description: 'A compelling description of the product. 2-3 sentences.',
    }),
    defineField({
      name: 'snipcartId',
      title: 'Snipcart Product ID',
      type: 'string',
      description: 'Unique product ID for the shopping cart. Use lowercase-with-dashes, e.g., "pink-trucker-hat". Must match the Snipcart dashboard.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'The primary product photo. Recommended: square, 800x800px or larger, white background.',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Every product needs a photo.'),
    }),
    defineField({
      name: 'gallery',
      title: 'Additional Images',
      type: 'array',
      description: 'Extra product photos for the detail page (different angles, lifestyle shots, etc.).',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'What Makes It Special',
      type: 'array',
      description: 'Bullet points highlighting what makes this product great.',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      description: 'Turn off to hide the "Add to Cart" button when sold out.',
      initialValue: true,
    }),
    defineField({
      name: 'orderRank',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first in the shop.',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Name A-Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Price (Low to High)', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      media: 'mainImage',
    },
    prepare({ title, price, media }) {
      return {
        title: title || 'Untitled Product',
        subtitle: price != null ? `$${price.toFixed(2)}` : 'No price set',
        media,
      };
    },
  },
});
