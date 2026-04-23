/**
 * Team-member hotspot verification — READ-ONLY.
 *
 * Same `import.meta.env` workaround as diagnose-hotspots.ts: src/lib/sanity.ts
 * reads `import.meta.env.PUBLIC_SANITY_*`, which is Astro/Vite-only and
 * evaluates to `undefined` under plain Node. To preserve read-only discipline,
 * this script reconstructs the client inline and copies the *post-fix*
 * `urlForCropped` verbatim.
 *
 * SOURCE copied from src/lib/sanity.ts (post-fix):
 *   export function urlForCropped(source, width, height) {
 *     return builder.image(source).width(width).height(height).fit('crop');
 *   }
 *
 * Run from repo root:
 *   npx tsx audit/2026-04-22/scripts/verify-team-fix.ts
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Mirrors post-fix src/lib/sanity.ts exactly.
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

interface TeamDoc {
  _id: string;
  name: string;
  slug: string | null;
  photo: any;
}

async function main() {
  console.log('Team-member verification — ' + new Date().toISOString());

  const docs = await client.fetch<TeamDoc[]>(
    `*[_type == "teamMember"] | order(orderRank asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      photo
    }`,
  );

  console.log(`\nFound ${docs.length} team members.\n`);

  for (const d of docs) {
    if (!d.photo) {
      console.log(`[${d.name}] slug=${d.slug} — NO PHOTO`);
      continue;
    }
    const hotspot = d.photo.hotspot ?? null;
    const url = urlForCropped(d.photo, 800, 600).url();
    const tokens = parseTokens(url);

    console.log(`\n=== ${d.name} (slug=${d.slug}, id=${d._id}) ===`);
    console.log(`  hotspot: ${JSON.stringify(hotspot)}`);
    console.log(`  URL:     ${url}`);
    const tokensLine = Object.entries(tokens)
      .map(([k, v]) => (v === null ? `${k}=<MISSING>` : `${k}=${v}`))
      .join('  ');
    console.log(`  tokens:  ${tokensLine}`);

    // curl -sI
    try {
      const head = execSync(`curl -sI "${url}"`, { encoding: 'utf8' });
      const statusLine = head.split('\n')[0]?.trim() ?? '(no status)';
      const contentLength =
        head
          .split('\n')
          .find((l) => /^content-length:/i.test(l))
          ?.trim() ?? '(no content-length)';
      console.log(`  HEAD:    ${statusLine}   ${contentLength}`);
    } catch (e: any) {
      console.log(`  HEAD:    ERROR ${e.message}`);
    }

    // curl body to /tmp
    const slugSafe = (d.slug ?? d._id).replace(/[^a-zA-Z0-9_-]/g, '-');
    const tmpPath = `/tmp/team-${slugSafe}.jpg`;
    try {
      execSync(`curl -s "${url}" -o "${tmpPath}"`);
      const size = statSync(tmpPath).size;
      console.log(`  bytes:   ${size} -> ${tmpPath}`);
    } catch (e: any) {
      console.log(`  bytes:   ERROR ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
