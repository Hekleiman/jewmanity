import { defineType, defineArrayMember } from 'sanity';

export default defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                description: 'The web address to link to. Use full URLs (https://...) for external sites, or relative paths (/donate) for internal pages.',
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                description: 'Turn on for external links so visitors stay on the Jewmanity site.',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
  ],
});
