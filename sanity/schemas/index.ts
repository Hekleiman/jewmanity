// Object types (reusable field groups)
import portableText from './objects/portableText';
import heroSection from './objects/heroSection';
import ctaButton from './objects/ctaButton';
import statItem from './objects/statItem';
import valueCard from './objects/valueCard';
import aboutValueCard from './objects/aboutValueCard';
import supportCard from './objects/supportCard';
import experienceItem from './objects/experienceItem';
import carePillar from './objects/carePillar';
import includedItem from './objects/includedItem';
import programCard from './objects/programCard';
import homepageStat from './objects/homepageStat';
import contactCard from './objects/contactCard';
import shopImpactIcon from './objects/shopImpactIcon';
import howToHelpCard from './objects/howToHelpCard';
import donateImpactCard from './objects/donateImpactCard';
import whyGiveValue from './objects/whyGiveValue';
import antisemitismStat from './objects/antisemitismStat';
import antisemitismFormCard from './objects/antisemitismFormCard';
import actionStep from './objects/actionStep';
import antisemitismOrg from './objects/antisemitismOrg';
import pageMetaOverride from './objects/pageMetaOverride';

// Collection document types
import recipe from './documents/recipe';
import retreat from './documents/retreat';
import teamMember from './documents/teamMember';
import product from './documents/product';
import testimonial from './documents/testimonial';
import faqItem from './documents/faqItem';
import communityStory from './documents/communityStory';
import recommendedArticle from './documents/recommendedArticle';

// Singleton page documents
import homepage from './singletons/homepage';
import aboutStory from './singletons/aboutStory';
import aboutTeamPage from './singletons/aboutTeamPage';
import aboutCommunityStoriesPage from './singletons/aboutCommunityStoriesPage';
import headsUp from './singletons/headsUp';
import programsPastRetreatsPage from './singletons/programsPastRetreatsPage';
import fightingAntisemitism from './singletons/fightingAntisemitism';
import resources from './singletons/resources';
import communityRecipesPage from './singletons/communityRecipesPage';
import donatePage from './singletons/donatePage';
import shopPage from './singletons/shopPage';
import volunteerPage from './singletons/volunteerPage';
import contactPage from './singletons/contactPage';
import mitzvahProject from './singletons/mitzvahProject';
import siteSettings from './singletons/siteSettings';
import navigation from './singletons/navigation';

// All schema types
export const schemaTypes = [
  // Objects (must be registered before documents that use them)
  portableText,
  heroSection,
  ctaButton,
  statItem,
  valueCard,
  aboutValueCard,
  supportCard,
  experienceItem,
  carePillar,
  includedItem,
  programCard,
  homepageStat,
  contactCard,
  shopImpactIcon,
  howToHelpCard,
  donateImpactCard,
  whyGiveValue,
  antisemitismStat,
  antisemitismFormCard,
  actionStep,
  antisemitismOrg,
  pageMetaOverride,

  // Collections
  recipe,
  retreat,
  teamMember,
  product,
  testimonial,
  faqItem,
  communityStory,
  recommendedArticle,

  // Singletons
  homepage,
  aboutStory,
  aboutTeamPage,
  aboutCommunityStoriesPage,
  headsUp,
  programsPastRetreatsPage,
  fightingAntisemitism,
  resources,
  communityRecipesPage,
  donatePage,
  shopPage,
  volunteerPage,
  contactPage,
  mitzvahProject,
  siteSettings,
  navigation,
];

// Singleton type names — used by desk structure and config to prevent duplicates
export const singletonTypes = new Set([
  'homepage',
  'aboutStory',
  'aboutTeamPage',
  'aboutCommunityStoriesPage',
  'headsUp',
  'programsPastRetreatsPage',
  'fightingAntisemitism',
  'resources',
  'communityRecipesPage',
  'donatePage',
  'shopPage',
  'volunteerPage',
  'contactPage',
  'mitzvahProject',
  'siteSettings',
  'navigation',
]);
