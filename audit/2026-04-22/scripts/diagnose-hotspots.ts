/**
 * Hotspot diagnostic — READ-ONLY.
 *
 * NOTE ON DEVIATION: The audit spec asked the diagnostic to import `client` and
 * `urlForCropped` from `src/lib/sanity.ts` directly. That module reads
 * `import.meta.env.PUBLIC_SANITY_PROJECT_ID`, which is an Astro/Vite-only
 * construct and evaluates to `undefined` when the module is loaded from plain
 * Node (via tsx). Honoring the import would require editing src/lib/sanity.ts
 * to add a process.env fallback, which the audit's hard rules forbid.
 *
 * To preserve read-only discipline, this script reconstructs the client inline
 * with the same project/dataset/apiVersion/useCdn settings, and mirrors the
 * `urlForCropped` implementation from src/lib/sanity.ts verbatim (see SOURCE
 * below). The behavior is intentionally identical to what the Astro build
 * produces at call-sites.
 *
 * SOURCE copied from src/lib/sanity.ts lines 29-31:
 *   export function urlForCropped(source, width, height) {
 *     return builder.image(source).width(width).height(height).fit('crop').crop('focalpoint');
 *   }
 *
 * Run from repo root:
 *   npx tsx audit/2026-04-22/scripts/diagnose-hotspots.ts
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Mirrors src/lib/sanity.ts:29-31 exactly.
function urlForCropped(source: SanityImageSource, width: number, height: number) {
  return builder.image(source).width(width).height(height).fit('crop').crop('focalpoint');
}

type AnyDoc = Record<string, any>;

interface ImageCheck {
  docType: string;
  docId: string;
  slug: string | null;
  fieldName: string;
  imageJson: AnyDoc;
  url: string;
  tokens: Record<string, string | null>;
}

const TOKENS_OF_INTEREST = ['w', 'h', 'fit', 'crop', 'rect', 'fp-x', 'fp-y', 'auto'];

function parseTokens(url: string): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  const q = url.split('?')[1];
  if (!q) return Object.fromEntries(TOKENS_OF_INTEREST.map((t) => [t, null]));
  const params = new URLSearchParams(q);
  for (const k of TOKENS_OF_INTEREST) {
    out[k] = params.has(k) ? params.get(k) : null;
  }
  return out;
}

async function queryCollection(docType: string, imageFields: string[]): Promise<ImageCheck[]> {
  const groq = `*[_type == "${docType}"] { _id, "slug": slug.current, ${imageFields.join(', ')} }`;
  const docs = await client.fetch<AnyDoc[]>(groq);
  const checks: ImageCheck[] = [];
  for (const d of docs) {
    for (const f of imageFields) {
      const img = d[f];
      if (!img) continue;
      const url = urlForCropped(img, 800, 600).url();
      checks.push({
        docType,
        docId: d._id,
        slug: d.slug ?? null,
        fieldName: f,
        imageJson: img,
        url,
        tokens: parseTokens(url),
      });
    }
  }
  return checks;
}

function looksLikeImage(v: any): boolean {
  return !!(v && typeof v === 'object' && v._type === 'image' && v.asset);
}

async function querySingleton(docType: string, imageFields: string[]): Promise<ImageCheck[]> {
  const topFields = Array.from(new Set(imageFields.map((f) => f.split('.')[0])));
  const groq = `*[_type == "${docType}"][0] { _id, ${topFields.join(', ')} }`;
  const doc = await client.fetch<AnyDoc | null>(groq);
  if (!doc) return [];
  const checks: ImageCheck[] = [];
  for (const f of imageFields) {
    let img: any = flattenPath(doc, f);
    // If caller passed a parent key like "hero" that wraps an image, dig into it
    if (img && !looksLikeImage(img)) {
      if (looksLikeImage(img.backgroundImage)) img = img.backgroundImage;
      else if (looksLikeImage(img.image)) img = img.image;
      else continue;
    }
    if (!img) continue;
    const url = urlForCropped(img, 800, 600).url();
    checks.push({
      docType,
      docId: doc._id,
      slug: null,
      fieldName: f,
      imageJson: img,
      url,
      tokens: parseTokens(url),
    });
  }
  return checks;
}

function flattenPath(obj: AnyDoc, path: string): any {
  return path.split('.').reduce<any>((acc, k) => (acc ? acc[k] : undefined), obj);
}

function printChecks(title: string, checks: ImageCheck[]) {
  console.log(`\n=== ${title} (${checks.length} image field values) ===`);
  for (const c of checks) {
    const slugStr = c.slug ? `  slug=${c.slug}` : '';
    console.log(`\n[${c.docType}] ${c.docId}${slugStr}  field=${c.fieldName}`);
    console.log(`  image JSON: ${JSON.stringify(c.imageJson)}`);
    console.log(`  URL:  ${c.url}`);
    const presentTokens = Object.entries(c.tokens)
      .map(([k, v]) => (v === null ? `${k}=<MISSING>` : `${k}=${v}`))
      .join('  ');
    console.log(`  tokens: ${presentTokens}`);
  }
}

async function main() {
  console.log('Hotspot diagnostic — ' + new Date().toISOString());
  console.log('Client config:', { projectId: '9pc3wgri', dataset: 'production', useCdn: true });

  const teamMembers = await queryCollection('teamMember', ['photo']);
  printChecks('teamMember.photo', teamMembers);

  const products = await queryCollection('product', ['mainImage']);
  printChecks('product.mainImage', products);

  const recipes = await queryCollection('recipe', ['image']);
  printChecks('recipe.image', recipes);

  const retreats = await queryCollection('retreat', ['coverImage']);
  printChecks('retreat.coverImage', retreats);

  const stories = await queryCollection('communityStory', ['image']);
  printChecks('communityStory.image', stories);

  const testimonials = await queryCollection('testimonial', ['authorImage']);
  printChecks('testimonial.authorImage', testimonials);

  const homepage = await querySingleton('homepage', ['heroImage']);
  printChecks('homepage.heroImage', homepage);

  const headsUp = await querySingleton('headsUp', [
    'hero',
    'safeHavenImage',
    'careImage',
    'communityImage',
  ]);
  printChecks('headsUp images', headsUp);

  const resources = await querySingleton('resources', [
    'hero',
    'whyMattersImage',
    'commonStrugglesImage',
    'signsSectionImage',
  ]);
  printChecks('resources images', resources);

  const mitzvah = await querySingleton('mitzvahProject', ['heroImage', 'whyImage']);
  printChecks('mitzvahProject images', mitzvah);

  const donate = await querySingleton('donatePage', ['hero', 'whyGiveImage']);
  printChecks('donatePage images', donate);

  const volunteer = await querySingleton('volunteerPage', ['hero', 'whyVolunteerImage']);
  printChecks('volunteerPage images', volunteer);

  const contact = await querySingleton('contactPage', ['hero']);
  printChecks('contactPage.hero', contact);

  const aboutStory = await querySingleton('aboutStory', ['hero']);
  printChecks('aboutStory.hero', aboutStory);

  const shopPage = await querySingleton('shopPage', ['hero']);
  printChecks('shopPage.hero', shopPage);

  const fighting = await querySingleton('fightingAntisemitism', ['hero']);
  printChecks('fightingAntisemitism.hero', fighting);

  const all = [
    ...teamMembers, ...products, ...recipes, ...retreats, ...stories, ...testimonials,
    ...homepage, ...headsUp, ...resources, ...mitzvah, ...donate, ...volunteer,
    ...contact, ...aboutStory, ...shopPage, ...fighting,
  ];

  const withRect = all.filter((c) => c.tokens.rect !== null).length;
  const withFpX = all.filter((c) => c.tokens['fp-x'] !== null).length;
  const withFpY = all.filter((c) => c.tokens['fp-y'] !== null).length;
  const withCrop = all.filter((c) => c.tokens.crop !== null).length;

  console.log('\n=== SUMMARY ===');
  console.log(`Total image field values checked: ${all.length}`);
  console.log(`URLs with rect=  : ${withRect}`);
  console.log(`URLs with fp-x=  : ${withFpX}`);
  console.log(`URLs with fp-y=  : ${withFpY}`);
  console.log(`URLs with crop=  : ${withCrop}`);

  const hotspots = all
    .map((c) => c.imageJson.hotspot)
    .filter(Boolean)
    .map((h: any) => ({ x: h.x, y: h.y }));
  const centered = hotspots.filter((h) => Math.abs(h.x - 0.5) < 0.01 && Math.abs(h.y - 0.5) < 0.01).length;
  const offset = hotspots.length - centered;
  console.log(`Hotspots present in docs: ${hotspots.length}`);
  console.log(`  at center (0.5, 0.5 ± 0.01): ${centered}`);
  console.log(`  offset from center        : ${offset}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
