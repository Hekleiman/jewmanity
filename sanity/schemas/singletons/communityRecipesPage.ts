import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'communityRecipesPage',
  title: 'Recipes Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro Paragraphs' },
    { name: 'grid', title: 'Recipe Grid' },
    { name: 'detail', title: 'Recipe Detail Page Labels' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Recipes page. Replace the hero background image with a real photograph from the client when available.',
      group: 'hero',
    }),

    defineField({
      name: 'introParagraphs',
      title: 'Intro Paragraphs',
      type: 'array',
      description: 'The opening paragraphs displayed between the hero and the recipe grid. One array entry per paragraph. Toggle "Italic" on a paragraph to render it in italics.',
      group: 'intro',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Paragraph Text',
              type: 'text',
              rows: 5,
              validation: (rule) => rule.required().error('Paragraph text is required.'),
            }),
            defineField({
              name: 'italic',
              title: 'Italic',
              type: 'boolean',
              description: 'Render this paragraph in italics. Use sparingly, usually for closing or reflective copy.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { text: 'text', italic: 'italic' },
            prepare({ text, italic }) {
              const snippet = (text || '').slice(0, 60);
              return {
                title: snippet || 'Empty paragraph',
                subtitle: italic ? 'Italic' : 'Plain',
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.max(4).warning('Two paragraphs is usually enough.'),
    }),

    defineField({
      name: 'gridHeading',
      title: 'Recipe Grid Heading',
      type: 'string',
      description: 'Heading above the grid of recipe cards. Default: "From Our Table to Yours".',
      initialValue: 'From Our Table to Yours',
      group: 'grid',
    }),
    defineField({
      name: 'gridSubtitle',
      title: 'Recipe Grid Subtitle',
      type: 'text',
      rows: 3,
      description:
        'Short paragraph below the grid heading. Default: "Delicious recipes passed down that have stood the test of time and perseverance."',
      group: 'grid',
    }),

    defineField({
      name: 'detailIngredientsLabel',
      title: 'Ingredients Label',
      type: 'string',
      description: 'Section heading for the ingredients list on a recipe page. Default: "Ingredients".',
      initialValue: 'Ingredients',
      group: 'detail',
    }),
    defineField({
      name: 'detailInstructionsLabel',
      title: 'Instructions Label',
      type: 'string',
      initialValue: 'Instructions',
      group: 'detail',
    }),
    defineField({
      name: 'detailChefsNotesLabel',
      title: "Chef's Notes Label",
      type: 'string',
      initialValue: "Chef's Notes",
      group: 'detail',
    }),
    defineField({
      name: 'detailShareHeading',
      title: 'Share Card Heading',
      type: 'string',
      initialValue: 'Share This Recipe',
      group: 'detail',
    }),
    defineField({
      name: 'detailShareSubtitle',
      title: 'Share Card Subtitle',
      type: 'text',
      rows: 3,
      initialValue:
        'This recipe is shared with love from our community. We hope it brings warmth and sweetness to your table.',
      group: 'detail',
    }),
    defineField({
      name: 'detailCopyLinkText',
      title: 'Copy Link Button Text',
      type: 'string',
      initialValue: 'Copy Link',
      group: 'detail',
    }),
    defineField({
      name: 'detailPrintText',
      title: 'Print Recipe Button Text',
      type: 'string',
      initialValue: 'Print Recipe',
      group: 'detail',
    }),
    defineField({
      name: 'detailRelatedHeading',
      title: 'Related Recipes Heading',
      type: 'string',
      initialValue: 'More from Our Table',
      group: 'detail',
    }),
    defineField({
      name: 'detailViewAllText',
      title: 'View All Recipes Link Text',
      type: 'string',
      description: 'Use a trailing arrow if you want one, e.g., "View All Recipes →".',
      initialValue: 'View All Recipes →',
      group: 'detail',
    }),
    defineField({
      name: 'detailPrepLabel',
      title: 'Prep Time Label',
      type: 'string',
      initialValue: 'Prep',
      group: 'detail',
    }),
    defineField({
      name: 'detailCookLabel',
      title: 'Cook Time Label',
      type: 'string',
      initialValue: 'Cook',
      group: 'detail',
    }),
    defineField({
      name: 'detailServingsLabel',
      title: 'Servings Label',
      type: 'string',
      initialValue: 'Servings',
      group: 'detail',
    }),
    defineField({
      name: 'detailDifficultyLabel',
      title: 'Difficulty Label',
      type: 'string',
      initialValue: 'Difficulty',
      group: 'detail',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the call-to-action section at the bottom (e.g., "Share Your Recipe, Share Your Story").',
      initialValue: 'Share Your Recipe, Share Your Story',
      validation: (rule) => rule.max(80).warning('Shorter headings have more impact.'),
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the CTA heading.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryButton',
      title: 'CTA Primary Button',
      type: 'object',
      description: 'The main call-to-action button.',
      group: 'cta',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'Where the button links to (e.g., "/get-involved/contact").',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Recipes Page' };
    },
  },
});
