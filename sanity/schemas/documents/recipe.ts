import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Recipe Title',
      type: 'string',
      description: 'The name of the dish (e.g., "Grandma\'s Challah"). This is what visitors see on the card.',
      validation: (rule) =>
        rule
          .required()
          .error('Please add a recipe title — this is what visitors see on the card.')
          .max(80)
          .warning('Shorter titles display better on mobile.'),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from the title. This becomes the page URL (e.g., /recipes/grandmas-challah).',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 96),
      },
      validation: (rule) => rule.required().error('Click "Generate" to create the URL slug.'),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'A mouth-watering teaser shown on the recipe card. 1-2 sentences.',
      validation: (rule) => rule.max(200).warning('Keep it short — this appears on the preview card.'),
    }),
    defineField({
      name: 'image',
      title: 'Recipe Photo',
      type: 'image',
      description: 'A mouth-watering photo of the finished dish. Recommended: 800x600px or larger, landscape orientation.',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Every recipe needs a beautiful photo!'),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Categorize this recipe so visitors can filter. Select all that apply.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Shabbat', value: 'Shabbat' },
          { title: 'Holiday', value: 'Holiday' },
          { title: 'Passover', value: 'Passover' },
          { title: 'Hanukkah', value: 'Hanukkah' },
          { title: 'Family Favorite', value: 'Family Favorite' },
          { title: 'Comfort Food', value: 'Comfort Food' },
          { title: 'Everyday', value: 'Everyday' },
          { title: 'Quick & Easy', value: 'Quick & Easy' },
          { title: 'Traditional', value: 'Traditional' },
          { title: 'Dessert', value: 'Dessert' },
        ],
      },
    }),
    defineField({
      name: 'prepTime',
      title: 'Prep Time',
      type: 'string',
      description: 'How long it takes to make (e.g., "30 min", "1 hour 15 min").',
    }),
    defineField({
      name: 'cookTime',
      title: 'Cook Time',
      type: 'string',
      description: 'How long the cooking/baking portion takes (e.g., "35 min", "1½ hrs").',
    }),
    defineField({
      name: 'servings',
      title: 'Servings',
      type: 'string',
      description: 'How many people this feeds (e.g., "6 servings", "Makes 24 cookies").',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      description: 'How challenging the recipe is (e.g., "Easy", "Medium", "Advanced"). Free-form so authors can use their own phrasing.',
    }),
    defineField({
      name: 'author',
      title: 'Recipe Author',
      type: 'string',
      description: 'Who contributed or originated this recipe (e.g., "Belinda Donner", "Mindy (via Belinda Donner)"). Displayed as "Recipe by [Author]" on the recipe page.',
    }),
    defineField({
      name: 'date',
      title: 'Publish Date',
      type: 'datetime',
      description: 'When this recipe was added. Displayed next to the author on the recipe page.',
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      description: 'List each ingredient on its own line (e.g., "2 cups all-purpose flour").',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'portableText',
      description: 'Step-by-step cooking directions. Use numbered lists for steps.',
    }),
    defineField({
      name: 'culturalContext',
      title: 'Cultural Context',
      type: 'portableText',
      description: 'Optional: the story behind this recipe — its origin, family history, or cultural significance.',
    }),
    defineField({
      name: 'notes',
      title: "Chef's Notes",
      type: 'text',
      rows: 4,
      description: 'Optional tips, variations, or storage notes displayed in a callout below the instructions.',
    }),
    defineField({
      name: 'gallery',
      title: 'Additional Photos',
      type: 'array',
      description: 'Extra photos (e.g., a family photo or process shot) shown alongside the main recipe image.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the photo for screen readers.',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'orderRank',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank for alphabetical order.',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      tags: 'tags',
      media: 'image',
    },
    prepare({ title, tags, media }) {
      return {
        title: title || 'Untitled Recipe',
        subtitle: Array.isArray(tags) ? tags.join(', ') : '',
        media,
      };
    },
  },
});
