import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '9pc3wgri',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ============ GROQ Queries ============

export async function getRecipes() {
  return sanityClient.fetch(`
    *[_type == "recipe"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      tags,
      image,
      ingredients,
      instructions,
      culturalContext
    }
  `);
}

export async function getRecipeBySlug(slug: string) {
  return sanityClient.fetch(`
    *[_type == "recipe" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      tags,
      image,
      ingredients,
      instructions,
      culturalContext
    }
  `, { slug });
}

export async function getRetreats() {
  return sanityClient.fetch(`
    *[_type == "retreat"] | order(date desc) {
      _id,
      title,
      slug,
      location,
      date,
      description,
      image,
      body
    }
  `);
}

export async function getRetreatBySlug(slug: string) {
  return sanityClient.fetch(`
    *[_type == "retreat" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      location,
      date,
      subtitle,
      author,
      description,
      image,
      body
    }
  `, { slug });
}

export async function getTeamMembers() {
  return sanityClient.fetch(`
    *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      role,
      bio,
      image,
      order
    }
  `);
}

export async function getProducts() {
  return sanityClient.fetch(`
    *[_type == "product"] | order(title asc) {
      _id,
      title,
      slug,
      price,
      description,
      features,
      image,
      images
    }
  `);
}

export async function getProductBySlug(slug: string) {
  return sanityClient.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      price,
      description,
      features,
      image,
      images
    }
  `, { slug });
}

export async function getTestimonials() {
  return sanityClient.fetch(`
    *[_type == "testimonial"] | order(order asc) {
      _id,
      quote,
      name,
      role,
      program,
      date,
      order
    }
  `);
}

export async function getFaqItems(category?: string) {
  const filter = category
    ? `*[_type == "faqItem" && category == $category]`
    : `*[_type == "faqItem"]`;
  return sanityClient.fetch(`
    ${filter} | order(order asc) {
      _id,
      question,
      answer,
      category,
      order
    }
  `, { category });
}

export async function getCommunityStories() {
  return sanityClient.fetch(`
    *[_type == "communityStory"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      image
    }
  `);
}

export async function getSiteSettings() {
  return sanityClient.fetch(`
    *[_type == "siteSettings"][0] {
      organizationName,
      ein,
      yearEstablished,
      contactEmail,
      socialLinks
    }
  `);
}
