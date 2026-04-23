/**
 * Pre-migration baseline — READ-ONLY.
 *
 * For each of the five migration-candidate consumers, reproduce the exact
 * image transformation they are currently doing and log the resulting URL
 * alongside the hotspot metadata. Run this before the migration, then re-run
 * as a post-migration variant, then diff.
 *
 * Same env-fallback pattern as verify-team-fix.ts: src/lib/sanity.ts reads
 * `import.meta.env.PUBLIC_SANITY_*` which is Astro/Vite-only, so we
 * reconstruct the client inline and inline the helpers.
 *
 * Consumers and their current call shapes:
 *   - src/components/home/ImpactStories.astro      getTestimonials('general')    W=160  H=160
 *   - src/pages/get-involved/volunteer.astro       getTestimonials('volunteer')  W=224  H=224
 *   - src/pages/programs/past-retreats.astro       getTestimonials('headsup')    W=224  H=224
 *   - src/pages/programs/heads-up.astro            getTestimonials('headsup')    W=224  H=224
 *   - src/pages/about/community-stories.astro      getTestimonials() [all, slug] W=640  H=854
 *
 * Run from repo root:
 *   npx tsx audit/2026-04-22/scripts/baseline-image-urls.ts > audit/2026-04-22/baseline-pre-migration.txt
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

// Mirrors src/lib/sanity.ts exactly.
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

function urlForCropped(source: SanityImageSource, width: number, height: number) {
  return builder.image(source).width(width).height(height).fit('crop');
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

function formatTokens(tokens: Record<string, string | null>): string {
  return Object.entries(tokens)
    .map(([k, v]) => (v === null ? `${k}=<MISSING>` : `${k}=${v}`))
    .join('  ');
}

interface Testimonial {
  _id: string;
  slug: string | null;
  authorName: string | null;
  authorRole: string | null;
  context: string | null;
  authorImage: any;
  imageUrl: string | null;
}

const TESTIMONIAL_PROJECTION = `{
  _id,
  authorName,
  authorRole,
  context,
  authorImage,
  "slug": slug.current,
  "imageUrl": authorImage.asset->url
}`;

async function fetchTestimonials(context?: string): Promise<Testimonial[]> {
  const filter = context
    ? `*[_type == "testimonial" && context == $context]`
    : `*[_type == "testimonial"]`;
  return client.fetch<Testimonial[]>(
    `${filter} | order(order asc, _createdAt desc) ${TESTIMONIAL_PROJECTION}`,
    { context: context ?? null },
  );
}

interface ConsumerSpec {
  label: string;
  file: string;
  context?: string;
  width: number;
  height: number;
  // Only community-stories filters to testimonials with a slug.
  slugRequired?: boolean;
}

const CONSUMERS: ConsumerSpec[] = [
  {
    label: 'ImpactStories (home)',
    file: 'src/components/home/ImpactStories.astro',
    context: 'general',
    width: 160,
    height: 160,
  },
  {
    label: 'Volunteer page',
    file: 'src/pages/get-involved/volunteer.astro',
    context: 'volunteer',
    width: 224,
    height: 224,
  },
  {
    label: 'Past Retreats',
    file: 'src/pages/programs/past-retreats.astro',
    context: 'headsup',
    width: 224,
    height: 224,
  },
  {
    label: 'Heads Up',
    file: 'src/pages/programs/heads-up.astro',
    context: 'headsup',
    width: 224,
    height: 224,
  },
  {
    label: 'Community Stories',
    file: 'src/pages/about/community-stories.astro',
    // no context filter — fetches all
    width: 640,
    height: 854,
    slugRequired: true,
  },
];

function logConsumer(spec: ConsumerSpec, docs: Testimonial[]) {
  console.log(`\n=== ${spec.label} ===`);
  console.log(`file:    ${spec.file}`);
  console.log(`context: ${spec.context ?? '<all>'}`);
  console.log(`dims:    ${spec.width} x ${spec.height}`);

  const filtered = spec.slugRequired ? docs.filter((d) => d.slug) : docs;
  console.log(`count:   ${filtered.length}`);

  for (const d of filtered) {
    console.log(`\n--- testimonial id=${d._id} name=${d.authorName ?? '?'} slug=${d.slug ?? '-'} ctx=${d.context ?? '-'} ---`);
    console.log(`  authorImage: ${d.authorImage ? '<present>' : '<null>'}`);
    if (d.authorImage) {
      console.log(`  hotspot:     ${JSON.stringify(d.authorImage.hotspot ?? null)}`);
    }
    console.log(`  imageUrl (bare asset): ${d.imageUrl ?? '<null>'}`);

    if (!d.authorImage) {
      console.log(`  current (urlFor.width.height): <skipped — authorImage missing>`);
      console.log(`  new     (urlForCropped):       <skipped — authorImage missing>`);
      continue;
    }

    const currentUrl = urlFor(d.authorImage as SanityImageSource)
      .width(spec.width)
      .height(spec.height)
      .url();
    const newUrl = urlForCropped(d.authorImage as SanityImageSource, spec.width, spec.height).url();

    console.log(`  current: ${currentUrl}`);
    console.log(`    tokens: ${formatTokens(parseTokens(currentUrl))}`);
    console.log(`  new:     ${newUrl}`);
    console.log(`    tokens: ${formatTokens(parseTokens(newUrl))}`);
    console.log(`  identical: ${currentUrl === newUrl}`);
  }
}

async function main() {
  console.log('Image URL baseline — ' + new Date().toISOString());

  // Fetch once per unique context to avoid redundant queries.
  const contextCache = new Map<string, Testimonial[]>();
  const uniqueKeys = Array.from(new Set(CONSUMERS.map((c) => c.context ?? '<all>')));
  for (const key of uniqueKeys) {
    const ctx = key === '<all>' ? undefined : key;
    contextCache.set(key, await fetchTestimonials(ctx));
  }

  for (const spec of CONSUMERS) {
    const docs = contextCache.get(spec.context ?? '<all>') ?? [];
    logConsumer(spec, docs);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
