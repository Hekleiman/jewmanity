import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'mitzvahProject',
  title: 'Mitzvah Project Page',
  type: 'document',
  fields: [
    // ── Hero ──────────────────────────────────────────
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Main heading that appears over the hero image (e.g., "A Mitzvah That Matters Right Now").',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the hero heading. Keep it to 1–2 sentences.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Full-width background photo for the hero. Recommended: 1920x1080px or larger.',
      options: { hotspot: true },
    }),

    // ── Opening Quote ─────────────────────────────────
    defineField({
      name: 'openingQuote',
      title: 'Opening Quote',
      type: 'text',
      rows: 3,
      description: 'Inspirational blockquote displayed between the hero and "Why This Matters" section.',
    }),

    // ── Why This Matters ──────────────────────────────
    defineField({
      name: 'whyHeading',
      title: 'Why This Matters — Heading',
      type: 'string',
      description: 'Heading for the "Why This Matters" section.',
    }),
    defineField({
      name: 'whyParagraphs',
      title: 'Why This Matters — Paragraphs',
      type: 'array',
      description: 'The body text for this section. Each item is one paragraph.',
      of: [{ type: 'text', rows: 4 }],
      validation: (rule) => rule.max(5).warning('3 paragraphs is ideal.'),
    }),
    defineField({
      name: 'whyImage',
      title: 'Why This Matters — Image',
      type: 'image',
      description: 'Photo displayed beside the text. Recommended: 800x600px or larger.',
      options: { hotspot: true },
    }),

    // ── Impact Cards ──────────────────────────────────
    defineField({
      name: 'impactHeading',
      title: 'Impact Section — Heading',
      type: 'string',
      description: 'Heading for the impact cards section (e.g., "The Impact You\'ll Make").',
    }),
    defineField({
      name: 'impactSubtitle',
      title: 'Impact Section — Subtitle',
      type: 'string',
      description: 'Brief subtitle below the heading.',
    }),
    defineField({
      name: 'impactCards',
      title: 'Impact Cards',
      type: 'array',
      description: 'Four cards showing the types of impact. Each needs an icon keyword, title, and description.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon Keyword',
              type: 'string',
              description: 'Internal keyword for the icon (e.g., "shield", "mountain", "handshake", "heart"). Don\'t change unless updating the code.',
            }),
            defineField({
              name: 'title',
              title: 'Card Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Card Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(300),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'icon' },
          },
        },
      ],
      validation: (rule) => rule.max(6).warning('4 cards is the intended layout.'),
    }),

    // ── How It Works ──────────────────────────────────
    defineField({
      name: 'howItWorksHeading',
      title: 'How It Works — Heading',
      type: 'string',
    }),
    defineField({
      name: 'howItWorksSubtitle',
      title: 'How It Works — Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      description: 'The 7-step timeline. Each step has a month label, title, description, action items, and an optional tip box.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Month Label',
              type: 'string',
              description: 'Gold label above the title (e.g., "GETTING STARTED \u2014 MONTH 1").',
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'actions',
              title: 'Action Items',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Bullet-point action items for this step.',
            }),
            defineField({
              name: 'tip',
              title: 'Tip / Callout Box',
              type: 'text',
              rows: 3,
              description: 'Optional tip displayed in a highlighted box. Start with the label (e.g., "Tip for your speech: ...").',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'label' },
          },
        },
      ],
    }),

    // ── Choose Your Path ──────────────────────────────
    defineField({
      name: 'pathsHeading',
      title: 'Choose Your Path — Heading',
      type: 'string',
    }),
    defineField({
      name: 'pathsSubtitle',
      title: 'Choose Your Path — Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'paths',
      title: 'Path Cards',
      type: 'array',
      description: 'Three path cards (Fundraise, Volunteer, Raise Awareness). Each has bullets.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon Keyword',
              type: 'string',
              description: 'Internal keyword for the icon (e.g., "fundraise", "volunteer", "awareness"). Don\'t change unless updating the code.',
            }),
            defineField({
              name: 'title',
              title: 'Card Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Card Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'bullets',
              title: 'Bullet Points',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Action items shown as a checklist under the description.',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'icon' },
          },
        },
      ],
      validation: (rule) => rule.max(4).warning('3 cards is the intended layout.'),
    }),

    // ── Inspirational Quote ────────────────────────────
    defineField({
      name: 'inspirationalQuote',
      title: 'Inspirational Quote (Before Fundraising)',
      type: 'text',
      rows: 3,
      description: 'Blockquote displayed between "Choose Your Path" and the fundraising goals section.',
    }),
    defineField({
      name: 'inspirationalQuoteAttribution',
      title: 'Quote Attribution',
      type: 'string',
      description: 'e.g., "JEWMANITY.COM"',
    }),

    // ── Fundraising Goals ─────────────────────────────
    defineField({
      name: 'goalsHeading',
      title: 'Fundraising Goals — Heading',
      type: 'string',
    }),
    defineField({
      name: 'goalsSubtitle',
      title: 'Fundraising Goals — Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'goals',
      title: 'Goal Tiers',
      type: 'array',
      description: 'Fundraising tiers shown as cards. Each has a dollar amount, name, and description.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'amount',
              title: 'Amount',
              type: 'string',
              description: 'e.g., "$180", "$500", "Custom"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Tier Name',
              type: 'string',
              description: 'e.g., "Chai Level", "Rising Star"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Tier Description',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required().max(200),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'amount' },
          },
        },
      ],
      validation: (rule) => rule.max(8).warning('6 tiers is the intended layout.'),
    }),

    // ── CTA Section ───────────────────────────────────
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the bottom call-to-action (e.g., "Ready to Begin Your Mitzvah Project?").',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      rows: 2,
      description: 'Brief encouraging text below the CTA heading.',
    }),
    defineField({
      name: 'ctaButton1Text',
      title: 'Primary Button Text',
      type: 'string',
      description: 'e.g., "Start Your Project"',
    }),
    defineField({
      name: 'ctaButton1Url',
      title: 'Primary Button URL',
      type: 'string',
      description: 'e.g., "/get-involved/contact"',
    }),
    defineField({
      name: 'ctaButton2Text',
      title: 'Secondary Button Text',
      type: 'string',
      description: 'e.g., "Download Project Guide"',
    }),
    defineField({
      name: 'ctaButton2Url',
      title: 'Secondary Button URL',
      type: 'string',
      description: 'Path to the downloadable PDF (e.g., "/jewmanity-bar-bat-mitzvah-project.pdf").',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Mitzvah Project Page' };
    },
  },
});
