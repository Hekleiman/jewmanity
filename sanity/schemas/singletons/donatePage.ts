import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'donatePage',
  title: 'Donate Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'impact', title: 'Every Donation Makes an Impact' },
    { name: 'whyGive', title: 'Why Give' },
    { name: 'costBreakdown', title: 'Cost Breakdown' },
    { name: 'faq', title: 'FAQ' },
    { name: 'cta', title: 'Bottom CTA' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
      description: 'The hero banner at the top of the Donate page.',
      group: 'hero',
    }),
    defineField({
      name: 'heroTaxNote',
      title: 'Hero Tax Note',
      type: 'text',
      rows: 3,
      description:
        'Small tax-exempt disclaimer displayed under the hero. Legal/compliance language — review with your accountant before changing.',
      group: 'hero',
    }),

    defineField({
      name: 'impactHeading',
      title: 'Impact Section Heading',
      type: 'string',
      description: 'Heading for the section showing what donations fund.',
      initialValue: 'Every Donation Makes an Impact',
      group: 'impact',
    }),
    defineField({
      name: 'impactSubtitle',
      title: 'Impact Section Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short intro under the impact heading.',
      group: 'impact',
    }),
    defineField({
      name: 'impactCards',
      title: 'Impact Cards',
      type: 'array',
      description: 'Cards showing what donations make possible (usually 3).',
      of: [{ type: 'donateImpactCard' }],
      group: 'impact',
    }),

    defineField({
      name: 'whyGiveImage',
      title: 'Why Give Image',
      type: 'image',
      description: 'Photo or illustration displayed alongside the "Why Give" section. Recommended: 600x400px, landscape.',
      options: { hotspot: true },
      group: 'whyGive',
    }),
    defineField({
      name: 'whyGiveHeading',
      title: 'Why Give Heading',
      type: 'string',
      description: 'Heading for the section explaining the case for supporting Jewmanity.',
      initialValue: 'Why Give to Jewmanity',
      group: 'whyGive',
    }),
    defineField({
      name: 'whyGiveValues',
      title: 'Why Give Value Props',
      type: 'array',
      description: '3 short value props — each with a heading and 1-2 sentence description. Keep titles under ~30 characters.',
      of: [{ type: 'whyGiveValue' }],
      group: 'whyGive',
    }),
    defineField({
      name: 'whyGiveClosingText',
      title: 'Why Give Closing Text',
      type: 'text',
      rows: 3,
      description: 'Closing paragraph displayed after the value props, in italic styling.',
      group: 'whyGive',
    }),

    defineField({
      name: 'costBreakdownHeading',
      title: 'Cost Breakdown Heading',
      type: 'string',
      description: 'Heading for the transparency section.',
      initialValue: 'How Your Donation is Used',
      group: 'costBreakdown',
    }),
    defineField({
      name: 'costBreakdownSubtitle',
      title: 'Cost Breakdown Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short intro about donation transparency.',
      group: 'costBreakdown',
    }),
    defineField({
      name: 'costBreakdown',
      title: 'Cost Breakdown Items',
      type: 'array',
      description: 'Line items showing how each dollar is allocated per participant. Add, remove, or reorder as program costs evolve.',
      group: 'costBreakdown',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Short emoji representing this cost (e.g., ✈️ for flights, 🏠 for housing, 💊 for therapy). Pick from your emoji keyboard.',
            }),
            defineField({
              name: 'title',
              title: 'Item Title',
              type: 'string',
              description: 'Short label for this cost category.',
              validation: (rule) => rule.required().error('Please add a title.'),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: '1 sentence explaining what this cost covers.',
            }),
            defineField({
              name: 'amount',
              title: 'Amount',
              type: 'string',
              description: "Dollar amount displayed as a string (e.g., '$1,200'). Include currency symbol and commas.",
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'amount', icon: 'icon' },
            prepare({ title, subtitle, icon }) {
              return { title: `${icon || ''} ${title || 'Untitled item'}`.trim(), subtitle: subtitle || '' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'costBreakdownTotalLabel',
      title: 'Cost Breakdown Total Label',
      type: 'string',
      description: 'Label for the total row at the bottom of the breakdown.',
      initialValue: 'Average Cost Per Participant',
      group: 'costBreakdown',
    }),
    defineField({
      name: 'costBreakdownTotalAmount',
      title: 'Cost Breakdown Total Amount',
      type: 'string',
      description: 'Total dollar amount for the breakdown.',
      initialValue: '$4,500',
      group: 'costBreakdown',
    }),
    defineField({
      name: 'costBreakdownDisclaimer',
      title: 'Cost Breakdown Disclaimer',
      type: 'text',
      rows: 3,
      description: "'Responsible Stewardship' note at the bottom of the breakdown. Explains how funds are carefully allocated.",
      group: 'costBreakdown',
    }),

    defineField({
      name: 'faqHeading',
      title: 'FAQ Heading',
      type: 'string',
      description: "FAQ section heading. Default is 'Frequently Asked Questions'.",
      initialValue: 'Frequently Asked Questions',
      group: 'faq',
    }),
    defineField({
      name: 'faqSubtitle',
      title: 'FAQ Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short line under the FAQ heading.',
      group: 'faq',
    }),
    defineField({
      name: 'faqContext',
      title: 'FAQ Filter',
      type: 'string',
      description: 'Internal — used to show Donate-specific FAQs.',
      initialValue: 'donate',
      hidden: true,
      group: 'faq',
    }),

    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Final call-to-action heading at the bottom of the page.',
      initialValue: 'Healing Happens Because of You',
      group: 'cta',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      rows: 3,
      description: 'Paragraph under the final CTA heading.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaContactPrompt',
      title: 'CTA Contact Prompt',
      type: 'string',
      description: "Question prompt shown above the contact link, e.g., 'Questions about donating?'",
      group: 'cta',
    }),
    defineField({
      name: 'ctaContactLink',
      title: 'CTA Contact Link',
      type: 'object',
      description: 'The link shown below the contact prompt.',
      group: 'cta',
      fields: [
        defineField({
          name: 'text',
          title: 'Link Text',
          type: 'string',
          description:
            "The visible link text. Tip: if href is a mailto link, this text usually reads like 'Contact us at name@example.com'. If href is a page link, simpler text like 'Contact us' works better.",
        }),
        defineField({
          name: 'href',
          title: 'Link URL',
          type: 'string',
          description:
            "Where this link goes. Options: (1) An internal path like '/get-involved/contact' to open the contact page. (2) A mailto link like 'mailto:donations@jewmanity.org' to open the user's email client with the address pre-filled. (3) An external URL.",
        }),
      ],
    }),

  ],
  preview: {
    prepare() {
      return { title: 'Donate Page' };
    },
  },
});
