import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import recipe from './schemas/recipe';
import retreat from './schemas/retreat';
import teamMember from './schemas/teamMember';
import product from './schemas/product';
import testimonial from './schemas/testimonial';
import faqItem from './schemas/faqItem';
import communityStory from './schemas/communityStory';
import siteSettings from './schemas/siteSettings';

export default defineConfig({
  name: 'jewmanity',
  title: 'Jewmanity CMS',
  projectId: '9pc3wgri',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [recipe, retreat, teamMember, product, testimonial, faqItem, communityStory, siteSettings],
  },
});
