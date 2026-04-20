import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'resources',
  title: 'Mental Health Resources',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'advocacy', title: 'Advocacy Pillars' },
    { name: 'whyMatters', title: 'Why Mental Health Matters' },
    { name: 'commonStruggles', title: 'Common Struggles' },
    { name: 'signs', title: 'Signs to Watch For' },
    { name: 'crisis', title: 'Crisis Resources' },
    { name: 'legal', title: 'Legal' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Mental Health Resources page.',
      group: 'hero',
    }),

    defineField({
      name: 'advocacySectionHeading',
      title: 'Advocacy Section Heading',
      type: 'string',
      description: 'Main heading above the advocacy pillars (e.g., "What We Advocate For").',
      initialValue: 'What We Advocate For',
      group: 'advocacy',
    }),
    defineField({
      name: 'advocacySectionSubtitle',
      title: 'Advocacy Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short intro sentence shown below the advocacy heading.',
      group: 'advocacy',
    }),
    defineField({
      name: 'advocacyPillars',
      title: 'Advocacy Pillars',
      type: 'array',
      description: 'The numbered pillars of mental health advocacy.',
      group: 'advocacy',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Pillar Number',
              type: 'string',
              description: 'The display number (e.g., "01", "02").',
            }),
            defineField({
              name: 'title',
              title: 'Pillar Title',
              type: 'string',
              description: 'Short title for this pillar.',
            }),
            defineField({
              name: 'description',
              title: 'Pillar Description',
              type: 'text',
              rows: 3,
              description: 'Brief explanation of this advocacy pillar.',
            }),
          ],
          preview: {
            select: { number: 'number', title: 'title' },
            prepare({ number, title }) {
              return { title: `${number || '#'} — ${title || 'Untitled'}` };
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'whyMattersHeading',
      title: 'Why It Matters Heading',
      type: 'string',
      description: 'Heading for the "Why This Matters" section.',
      initialValue: 'Why This Matters',
      group: 'whyMatters',
    }),
    defineField({
      name: 'whyMattersBody',
      title: 'Why Mental Health Matters — Body',
      type: 'portableText',
      description: 'Intro paragraph and stats for the "Why This Matters" section. Use a bulleted list for the stats.',
      group: 'whyMatters',
    }),
    defineField({
      name: 'whyMattersPullQuote',
      title: 'Why It Matters Pull Quote',
      type: 'object',
      description: 'Highlighted belief/affirmation shown below the intro.',
      group: 'whyMatters',
      fields: [
        defineField({
          name: 'quote',
          title: 'Quote Text',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'attribution',
          title: 'Attribution (optional)',
          type: 'string',
          description: 'Who said this quote, if applicable. Leave blank if this is an organizational statement.',
        }),
      ],
    }),
    defineField({
      name: 'whyMattersImage',
      title: 'Why It Matters Image',
      type: 'image',
      description: 'Photo shown beside the "Why This Matters" text. Recommended: 600x400px, landscape.',
      options: { hotspot: true },
      group: 'whyMatters',
    }),

    defineField({
      name: 'commonStrugglesHeading',
      title: 'Common Struggles Heading',
      type: 'string',
      description: 'Heading for the struggles list section.',
      initialValue: 'Common Struggles We Recognize',
      group: 'commonStruggles',
    }),
    defineField({
      name: 'commonStruggles',
      title: 'Common Struggles',
      type: 'array',
      description: 'List of common mental health struggles (displayed as bullet points).',
      of: [defineArrayMember({ type: 'string' })],
      group: 'commonStruggles',
    }),
    defineField({
      name: 'medicalDisclaimer',
      title: 'Medical Disclaimer',
      type: 'text',
      rows: 3,
      description: 'Legal disclaimer about Jewmanity not being a medical provider. Review wording with a lawyer before modifying.',
      group: 'commonStruggles',
    }),
    defineField({
      name: 'commonStrugglesImage',
      title: 'Common Struggles Image',
      type: 'image',
      description: 'Photo shown beside the struggles list. Recommended: 600x400px, landscape.',
      options: { hotspot: true },
      group: 'commonStruggles',
    }),

    defineField({
      name: 'signsSectionHeading',
      title: 'Signs Section Heading',
      type: 'string',
      description: 'Heading for the "Signs to Watch For" section.',
      initialValue: 'Signs You Might Need Additional Support',
      group: 'signs',
    }),
    defineField({
      name: 'signsBody',
      title: 'Signs Body',
      type: 'portableText',
      description: 'Intro paragraph and list of signs to watch for. Use a bulleted list for the signs.',
      group: 'signs',
    }),
    defineField({
      name: 'signsCallout',
      title: 'Signs Callout',
      type: 'text',
      rows: 3,
      description: 'Callout box reminding users this is self-identification, not diagnosis.',
      group: 'signs',
    }),
    defineField({
      name: 'signsSectionImage',
      title: 'Signs Section Image',
      type: 'image',
      description: 'Photo shown beside the signs list. Recommended: 600x400px, landscape.',
      options: { hotspot: true },
      group: 'signs',
    }),

    defineField({
      name: 'crisisSectionHeading',
      title: 'Crisis Section Heading',
      type: 'string',
      description: 'Heading for the crisis hotlines section.',
      initialValue: 'Immediate Help & Crisis Resources',
      group: 'crisis',
    }),
    defineField({
      name: 'crisisIntroParagraphs',
      title: 'Crisis Intro Paragraphs',
      type: 'array',
      description: 'The intro paragraphs shown before the crisis cards. One array entry per paragraph.',
      of: [defineArrayMember({ type: 'text', rows: 3 })],
      group: 'crisis',
    }),
    defineField({
      name: 'crisisResources',
      title: 'Crisis Resources',
      type: 'array',
      description: 'Hotlines and resources for people in crisis. The "United States" card is rendered from entries whose region is "United States".',
      group: 'crisis',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Resource Name',
              type: 'string',
              description: 'The name of the hotline or resource (e.g., "988 Suicide & Crisis Lifeline").',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Brief description of what this resource provides (e.g., "Call or Text 988").',
            }),
            defineField({
              name: 'phone',
              title: 'Phone Number',
              type: 'string',
              description: 'The phone number to call or text (e.g., "988" or "1-800-273-8255").',
            }),
            defineField({
              name: 'url',
              title: 'Website URL',
              type: 'url',
              description: "Link to the resource's website.",
            }),
            defineField({
              name: 'region',
              title: 'Region / Country',
              type: 'string',
              description: 'Where this resource is available (e.g., "United States", "Israel", "International").',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'region' },
          },
        }),
      ],
    }),

    defineField({
      name: 'disclaimer',
      title: 'Page Footer Disclaimer (unused)',
      type: 'text',
      rows: 3,
      description: 'Legal disclaimer originally intended for the bottom of the resources page. Not currently rendered.',
      group: 'legal',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Mental Health Resources' };
    },
  },
});
