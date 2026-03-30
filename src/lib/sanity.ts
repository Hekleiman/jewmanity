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
      servings,
      ingredients,
      instructions,
      culturalContext,
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

// ============ Singleton Queries ============

export async function getHomepage() {
  return client.fetch(`
    *[_type == "homepage"][0] {
      heroHeading,
      heroSubtitle,
      heroImage,
      heroCtas,
      impactStats,
      donationAmounts,
      newsletterHeading,
      newsletterDescription
    }
  `);
}

export async function getAboutStory() {
  return client.fetch(`
    *[_type == "aboutStory"][0] {
      hero,
      storyBody,
      values,
      ctaHeading,
      ctaDescription
    }
  `);
}

export async function getHeadsUp() {
  return client.fetch(`
    *[_type == "headsUp"][0] {
      hero,
      sections,
      supportCards,
      includedItems,
      impactStats,
      carePillars
    }
  `);
}

export async function getFightingAntisemitism() {
  return client.fetch(`
    *[_type == "fightingAntisemitism"][0] {
      hero,
      introBody,
      sections
    }
  `);
}

export async function getResources() {
  return client.fetch(`
    *[_type == "resources"][0] {
      hero,
      advocacyPillars,
      whyMattersBody,
      commonStruggles,
      signsBody,
      crisisResources,
      disclaimer
    }
  `);
}

export async function getDonatePage() {
  return client.fetch(`
    *[_type == "donatePage"][0] {
      hero,
      donorboxEmbed,
      impactCards,
      whyGiveBody,
      costBreakdown
    }
  `);
}

export async function getShopPage() {
  return client.fetch(`
    *[_type == "shopPage"][0] {
      hero,
      introDescription,
      impactIcons
    }
  `);
}

export async function getVolunteerPage() {
  return client.fetch(`
    *[_type == "volunteerPage"][0] {
      hero,
      whyVolunteerBody,
      whyVolunteerImage,
      howToHelpCards,
      impactStats,
      ctaHeading,
      ctaDescription
    }
  `);
}

export async function getContactPage() {
  return client.fetch(`
    *[_type == "contactPage"][0] {
      hero,
      privacyNote,
      otherWaysCards
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
