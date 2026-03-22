import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

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

// ============ Portable Text Helpers ============

/**
 * Convert a Portable Text block array to a single HTML string.
 * Falls through gracefully if the input is already a string.
 */
export function portableTextToHtml(blocks: unknown): string {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return String(blocks);

  return blocks
    .map((block: any) => {
      if (!block || block._type !== 'block') return '';
      const text = renderBlockChildren(block);
      switch (block.style) {
        case 'h2': return `<h2>${text}</h2>`;
        case 'h3': return `<h3>${text}</h3>`;
        case 'h4': return `<h4>${text}</h4>`;
        case 'blockquote': return `<blockquote>${text}</blockquote>`;
        default: return text;
      }
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Convert Portable Text blocks to an array of HTML strings (one per block).
 * Useful for recipe instructions where each block is a numbered step.
 */
export function portableTextToStrings(blocks: unknown): string[] {
  if (!blocks) return [];
  if (typeof blocks === 'string') return [blocks];
  if (!Array.isArray(blocks)) return [String(blocks)];

  return blocks
    .filter((block: any) => block?._type === 'block')
    .map((block: any) => renderBlockChildren(block))
    .filter((s: string) => s.length > 0);
}

function renderBlockChildren(block: any): string {
  const markDefs: Record<string, any> = {};
  if (block.markDefs) {
    for (const def of block.markDefs) {
      markDefs[def._key] = def;
    }
  }

  return (block.children || [])
    .map((child: any) => {
      let text = child.text || '';
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const marks = child.marks || [];
      for (const mark of marks) {
        if (mark === 'strong') {
          text = `<strong>${text}</strong>`;
        } else if (mark === 'em') {
          text = `<em>${text}</em>`;
        } else if (markDefs[mark]?._type === 'link') {
          const href = markDefs[mark].href || '';
          text = `<a href="${href}" class="text-primary hover:text-primary-hover underline">${text}</a>`;
        }
      }
      return text;
    })
    .join('');
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
    `${filter} | order(_createdAt desc) {
      _id,
      quote,
      authorName,
      authorRole,
      authorImage,
      context
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
      slug,
      image,
      excerpt,
      body,
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
