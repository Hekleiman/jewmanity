import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'communityRecipesPage',
  title: 'Recipes Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro Paragraphs' },
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
