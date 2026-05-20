/**
 * Seeds the long-tail CMS content from phase 4 of the
 * 2026-05-20 CMS completeness audit closeout. Idempotent via
 * setIfMissing patches: never overwrites editor-set values.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-sweep-content.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error('Error: SANITY_API_TOKEN env var required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function patchMitzvahProject() {
  console.log('Patching mitzvahProject.faq* ...');
  await client.patch('mitzvahProject').setIfMissing({
    faqHeading: 'Frequently Asked Questions',
    faqSubtitle: "Have questions? We're here to help.",
  }).commit();
  console.log('  done.');
}

async function patchAboutTeamPage() {
  console.log('Patching aboutTeamPage.teamSection* ...');
  await client.patch('aboutTeamPage').setIfMissing({
    teamSectionHeading: 'Our Team',
    teamSectionSubtitle:
      'A group of leaders, advocates, and community members united by compassion, lived experience, and a shared commitment to healing.',
  }).commit();
  console.log('  done.');
}

async function patchHeadsUp() {
  console.log('Patching headsUp.testimonials* ...');
  await client.patch('headsUp').setIfMissing({
    testimonialsHeading: 'Voices from Heads Up',
    testimonialsSubtitle:
      'Honest reflections from soldiers who found healing, connection, and renewed strength through our retreats.',
  }).commit();
  console.log('  done.');
}

async function patchCommunityRecipesPage() {
  console.log('Patching communityRecipesPage grid + detail labels ...');
  await client.patch('communityRecipesPage').setIfMissing({
    gridHeading: 'From Our Table to Yours',
    gridSubtitle: 'Delicious recipes passed down that have stood the test of time and perseverance.',
    detailIngredientsLabel: 'Ingredients',
    detailInstructionsLabel: 'Instructions',
    detailChefsNotesLabel: "Chef's Notes",
    detailShareHeading: 'Share This Recipe',
    detailShareSubtitle:
      'This recipe is shared with love from our community. We hope it brings warmth and sweetness to your table.',
    detailCopyLinkText: 'Copy Link',
    detailPrintText: 'Print Recipe',
    detailRelatedHeading: 'More from Our Table',
    detailViewAllText: 'View All Recipes →',
    detailPrepLabel: 'Prep',
    detailCookLabel: 'Cook',
    detailServingsLabel: 'Servings',
    detailDifficultyLabel: 'Difficulty',
  }).commit();
  console.log('  done.');
}

async function patchShopPage() {
  console.log('Patching shopPage.gridHeading ...');
  await client.patch('shopPage').setIfMissing({
    gridHeading: 'Our Current Collection',
  }).commit();
  console.log('  done.');
}

async function patchProgramsPastRetreatsPage() {
  console.log('Patching programsPastRetreatsPage.detail* ...');
  await client.patch('programsPastRetreatsPage').setIfMissing({
    detailGalleryHeading: 'Retreat Photos',
    detailBackLinkText: 'Back to Past Retreats',
  }).commit();
  console.log('  done.');
}

async function patchImageAlts() {
  console.log('Patching image alt fields (headsUp.safeHavenImage.alt, donatePage.whyGiveImage.alt, mitzvahProject.whyImage.alt) ...');
  await client.patch('headsUp').setIfMissing({
    'safeHavenImage.alt': 'Safe, supportive retreat environment for healing',
  }).commit();
  await client.patch('donatePage').setIfMissing({
    'whyGiveImage.alt': 'Community care and support through Jewmanity programs',
  }).commit();
  await client.patch('mitzvahProject').setIfMissing({
    'whyImage.alt': 'Community gathering',
  }).commit();
  console.log('  done.');
}

async function main() {
  await patchMitzvahProject();
  await patchAboutTeamPage();
  await patchHeadsUp();
  await patchCommunityRecipesPage();
  await patchShopPage();
  await patchProgramsPastRetreatsPage();
  await patchImageAlts();

  const verify = await client.fetch(`{
    "mitzvah": *[_id == "mitzvahProject"][0]{ faqHeading, faqSubtitle, "whyImageAlt": whyImage.alt },
    "team": *[_id == "aboutTeamPage"][0]{ teamSectionHeading, teamSectionSubtitle },
    "headsUp": *[_id == "headsUp"][0]{ testimonialsHeading, testimonialsSubtitle, "safeHavenImageAlt": safeHavenImage.alt },
    "recipesPage": *[_id == "communityRecipesPage"][0]{
      gridHeading, gridSubtitle,
      detailIngredientsLabel, detailInstructionsLabel, detailChefsNotesLabel,
      detailShareHeading, detailRelatedHeading, detailViewAllText,
      detailPrepLabel, detailCookLabel, detailServingsLabel, detailDifficultyLabel
    },
    "shop": *[_id == "shopPage"][0]{ gridHeading },
    "retreats": *[_id == "programsPastRetreatsPage"][0]{ detailGalleryHeading, detailBackLinkText },
    "donate": *[_id == "donatePage"][0]{ "whyGiveImageAlt": whyGiveImage.alt }
  }`);
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
