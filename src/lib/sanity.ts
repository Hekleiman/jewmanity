import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ============ Collection Queries ============

export async function getRecipes() {
  return client.fetch(`
    *[_type == "recipe"] | order(orderRank asc, title asc) {
      _id,
      title,
      slug,
      description,
      image,
      tags,
      prepTime,
      cookTime,
      servings,
      difficulty,
      author,
      date,
      ingredients,
      instructions,
      culturalContext,
      notes,
      gallery,
      orderRank
    }
  `);
}

export async function getRecipeBySlug(slug: string) {
  return client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      image,
      tags,
      prepTime,
      servings,
      ingredients,
      instructions,
      culturalContext
    }`,
    { slug },
  );
}

export async function getRetreats() {
  return client.fetch(`
    *[_type == "retreat"] | order(date desc) {
      _id,
      title,
      slug,
      subtitle,
      author,
      date,
      coverImage,
      gallery,
      body,
      participants,
      location,
      orderRank
    }
  `);
}

export async function getRetreatBySlug(slug: string) {
  return client.fetch(
    `*[_type == "retreat" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      subtitle,
      author,
      date,
      coverImage,
      gallery,
      body,
      participants,
      location
    }`,
    { slug },
  );
}

export async function getTeamMembers() {
  return client.fetch(`
    *[_type == "teamMember"] | order(orderRank asc, name asc) {
      _id,
      name,
      role,
      photo,
      bio,
      orderRank
    }
  `);
}

export async function getProducts() {
  return client.fetch(`
    *[_type == "product"] | order(orderRank asc, name asc) {
      _id,
      name,
      slug,
      price,
      description,
      snipcartId,
      mainImage,
      gallery,
      features,
      inStock,
      orderRank
    }
  `);
}

export async function getProductBySlug(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      price,
      description,
      snipcartId,
      mainImage,
      gallery,
      features,
      inStock
    }`,
    { slug },
  );
}

export async function getTestimonials(context?: string) {
  const filter = context
    ? `*[_type == "testimonial" && context == $context]`
    : `*[_type == "testimonial"]`;
  return client.fetch(
    `${filter} | order(order asc, _createdAt desc) {
      _id,
      quote,
      excerpt,
      authorName,
      authorRole,
      authorImage,
      context,
      order,
      "slug": slug.current,
      "imageUrl": authorImage.asset->url
    }`,
    { context },
  );
}

export async function getFaqItems(context?: string) {
  const filter = context
    ? `*[_type == "faqItem" && (context == $context || context == "general")]`
    : `*[_type == "faqItem"]`;
  return client.fetch(
    `${filter} | order(orderRank asc) {
      _id,
      question,
      answer,
      context,
      orderRank
    }`,
    { context },
  );
}

export async function getCommunityStories() {
  return client.fetch(`
    *[_type == "communityStory"] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      image,
      "imageUrl": image.asset->url,
      excerpt,
      paragraphs,
      body,
      tag,
      pullQuote,
      pullQuoteAttribution,
      externalUrl,
      internalUrl,
      orderRank
    }
  `);
}

export async function getCommunityStoryBySlug(slug: string) {
  return client.fetch(
    `*[_type == "communityStory" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      image,
      excerpt,
      body
    }`,
    { slug },
  );
}

export async function getRecommendedArticles() {
  return client.fetch(`
    *[_type == "recommendedArticle"] | order(order asc) {
      _id,
      title,
      publication,
      date,
      url,
      description,
      order
    }
  `);
}

// ============ Singleton Queries ============

export async function getHomepage() {
  return client.fetch(`
    *[_type == "homepage"][0] {
      heroHeading,
      heroSubtitle,
      heroImage,
      heroImageAlt,
      heroPrimaryCta,
      heroSecondaryCta,
      howWeHelpHeading,
      howWeHelpSubtitle,
      howWeHelpPrograms,
      impactStoriesHeading,
      impactStoriesSubtitle,
      donationHeading,
      donationSubtitle,
      donationAmounts,
      donationButton,
      donationFooterText,
      newsletterHeading,
      newsletterDescription,
      statsItems
    }
  `);
}

export async function getAboutStory() {
  return client.fetch(`
    *[_type == "aboutStory"][0] {
      hero,
      storyHeading,
      storyBody,
      valuesHeading,
      valuesSubtitle,
      values,
      ctaHeading,
      ctaDescription,
      ctaPrimaryButton,
      ctaSecondaryButton
    }
  `);
}

export async function getHeadsUp() {
  return client.fetch(`
    *[_type == "headsUp"][0] {
      hero,
      safeHavenHeading,
      safeHavenBody,
      safeHavenImage,
      supportHeading,
      supportSubtitle,
      supportCards,
      experienceHeading,
      experienceSubtitle,
      experienceItems,
      careHeading,
      careImage,
      carePillars,
      includedHeading,
      includedSubtitle,
      includedItems,
      communityHeading,
      communityIntro,
      communityBullets,
      communityButton,
      communityImage,
      impactHeading,
      impactSubtitle,
      impactStats,
      ctaHeading,
      ctaSubtitle,
      ctaPrimaryButton
    }
  `);
}

export async function getFightingAntisemitism() {
  return client.fetch(`
    *[_type == "fightingAntisemitism"][0] {
      hero,
      understandingHeading,
      understandingBody,
      understandingStats,
      formsHeading,
      formsCards,
      actionHeading,
      actionSubtitle,
      actionSteps,
      articlesHeading,
      articlesSubtitle,
      organizationsHeading,
      organizationsSubtitle,
      organizations,
      ctaHeading,
      ctaSubtitle,
      ctaPrimaryButton,
      ctaSecondaryButton
    }
  `);
}

export async function getResources() {
  return client.fetch(`
    *[_type == "resources"][0] {
      hero,
      advocacySectionHeading,
      advocacySectionSubtitle,
      advocacyPillars,
      whyMattersHeading,
      whyMattersBody,
      whyMattersPullQuote,
      whyMattersImage,
      commonStrugglesHeading,
      commonStruggles,
      medicalDisclaimer,
      commonStrugglesImage,
      signsSectionHeading,
      signsBody,
      signsCallout,
      signsSectionImage,
      crisisSectionHeading,
      crisisIntroParagraphs,
      crisisResources,
      disclaimer
    }
  `);
}

export async function getDonatePage() {
  return client.fetch(`
    *[_type == "donatePage"][0] {
      hero,
      heroTaxNote,
      impactHeading,
      impactSubtitle,
      impactCards,
      whyGiveImage,
      whyGiveHeading,
      whyGiveValues,
      whyGiveClosingText,
      costBreakdownHeading,
      costBreakdownSubtitle,
      costBreakdown,
      costBreakdownTotalLabel,
      costBreakdownTotalAmount,
      costBreakdownDisclaimer,
      faqHeading,
      faqSubtitle,
      ctaHeading,
      ctaDescription,
      ctaContactPrompt,
      ctaContactLink
    }
  `);
}

export async function getShopPage() {
  return client.fetch(`
    *[_type == "shopPage"][0] {
      hero,
      heroCta,
      impactHeading,
      introDescription,
      impactIcons,
      ctaHeading,
      ctaSubtitle,
      ctaPrimaryButton
    }
  `);
}

export async function getVolunteerPage() {
  return client.fetch(`
    *[_type == "volunteerPage"][0] {
      hero,
      whyVolunteerHeading,
      whyVolunteerBody,
      whyVolunteerImage,
      howToHelpHeading,
      howToHelpSubtitle,
      howToHelpCards,
      impactHeading,
      impactIntro,
      impactStats,
      testimonialsHeading,
      testimonialsSubtitle,
      faqHeading,
      faqSubtitle,
      formHeading,
      formSubtitle,
      formPrivacyNote,
      ctaHeading,
      ctaDescription,
      ctaPrimaryButton,
      ctaSecondaryButton
    }
  `);
}

export async function getContactPage() {
  return client.fetch(`
    *[_type == "contactPage"][0] {
      hero,
      introText,
      formHeading,
      privacyNote,
      otherWaysHeading,
      otherWaysCards
    }
  `);
}

export async function getMitzvahProject() {
  return client.fetch(`
    *[_type == "mitzvahProject"][0] {
      heroHeading,
      heroSubtitle,
      heroImage,
      openingQuote,
      whyHeading,
      whyParagraphs,
      whyImage,
      impactHeading,
      impactSubtitle,
      impactCards,
      howItWorksHeading,
      howItWorksSubtitle,
      steps,
      pathsHeading,
      pathsSubtitle,
      paths,
      inspirationalQuote,
      inspirationalQuoteAttribution,
      goalsHeading,
      goalsSubtitle,
      goals,
      ctaHeading,
      ctaDescription,
      ctaButton1Text,
      ctaButton1Url,
      ctaButton2Text,
      ctaButton2Url
    }
  `);
}

export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      orgName,
      ein,
      socialLinks,
      footerTagline,
      copyrightText
    }
  `);
}
