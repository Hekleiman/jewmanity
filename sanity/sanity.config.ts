import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, singletonTypes } from './schemas/index';
import { structure } from './lib/desk';
import { Logo } from './lib/branding';

export default defineConfig({
  name: 'jewmanity',
  title: 'Jewmanity CMS',

  projectId: '9pc3wgri',
  dataset: 'production',

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: {
    types: schemaTypes,
    // Prevent creating new singleton documents from the "Create new" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singletons: prevent delete action, only allow publish + edit
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },

  studio: {
    components: {
      logo: Logo,
    },
  },
});
