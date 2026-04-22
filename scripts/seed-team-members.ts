/**
 * Seeds Sanity teamMember docs with real bios + photos from the current
 * Jewmanity Squarespace site (https://www.jewmanity.com/team).
 *
 * Usage:
 *   npx tsx scripts/seed-team-members.ts --dry-run   # plan + verify URLs, no writes
 *   npx tsx scripts/seed-team-members.ts             # upload photos, createOrReplace docs
 *
 * Token: reads SANITY_API_TOKEN from .env (or SANITY_WRITE_TOKEN / process.env).
 * Idempotent: uses createOrReplace on the 4 predictable _ids that already exist.
 */

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function loadEnv(): Promise<void> {
  try {
    const raw = await readFile(resolve(process.cwd(), '.env'), 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const m = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      const [, key, val] = m;
      if (!process.env[key]) process.env[key] = val.replace(/^["']|["']$/g, '');
    }
  } catch {
    // .env absent — rely on process.env
  }
}

const DRY_RUN = process.argv.includes('--dry-run');

interface TeamMemberSeed {
  _id: string;
  name: string;
  role: string;
  orderRank: number;
  photoUrl: string;
  photoFilename: string;
  bioParagraphs: string[];
}

const members: TeamMemberSeed[] = [
  {
    _id: 'team-belinda-donner',
    name: 'Belinda Donner',
    role: 'Founding Board Member',
    orderRank: 1,
    photoUrl:
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/7224aca5-68e1-4e79-ba6f-745bd4f0b74b/belindaDSC_7972.jpg',
    photoFilename: 'belinda-donner.jpg',
    bioParagraphs: [
      "As a daughter of a Holocaust survivor, Belinda's heritage is a cornerstone of her identity. This legacy fuels her commitment to community causes, evidenced by active involvement in Friends of the Shoah, Jewish Federation, Hadassah and Jewish Family Services.",
      'A proud graduate of the University of Arizona with dual degrees in Business and Fashion Merchandising, she brings a creative dynamism to Jewmanity.',
      'Her most cherished role has been that of a devoted stay-at-home mother to four wonderful children, and loving husband, who fuel her desire to make a meaningful difference in the lives of others.',
    ],
  },
  {
    _id: 'team-andrew-donner',
    name: 'Andrew Donner',
    role: 'Founding Board Member',
    orderRank: 2,
    photoUrl:
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/e9b13e9e-21c7-4179-b54e-495755ce3ff6/Andrew+Donner+1.jpg',
    photoFilename: 'andrew-donner.jpg',
    bioParagraphs: [
      'Andrew B. Donner, Owner and CEO of Resort Gaming Group, has over 30 years of experience in real estate, operations, and investment. His career began in Mortgage Banking with Weyerhaeuser, and he later developed and led multiple companies, including 1031 Bridge Funding, Timbers Hospitality Group, and Resort Properties Group.',
      'Notable projects include his ownership and operation of the Lady Luck Hotel Casino, development of the Zappos headquarters at City Hall Las Vegas, and leadership of a $250 million real estate fund for DTP RE. Andrew has also overseen the Life is Beautiful Festival and managed several public-private partnerships with the City of Las Vegas.',
    ],
  },
  {
    _id: 'team-shai-gino',
    name: 'Shai Gino',
    role: 'Jewmanity Executive Director',
    orderRank: 3,
    photoUrl:
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/f3dd47d4-72c0-4192-bcbe-43eb9b9e5f39/image0.jpg',
    photoFilename: 'shai-gino.jpg',
    bioParagraphs: [
      'Shai served for seven years in the IDF, concluding his service as a company commander in the paratroopers battalion. During Operation Protective Edge in 2014, he was wounded, leading to a diagnosis of PTSD. Despite these challenges, he returned to active duty following the events of Oct. 7th, including two weeks of intense combat in Gaza.',
      "Shai's commitment to service extends beyond the battlefield; three years ago, he saved a life in downtown San Diego during a shooting event, demonstrating bravery and dedication to helping others in moments of crisis.",
    ],
  },
  {
    _id: 'team-rabbi-avi-libman',
    name: 'Rabbi Avi Libman',
    role: 'Board Member',
    orderRank: 4,
    photoUrl:
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/0226e35f-7a82-4aea-92c1-14caf7ef552f/avi_edited.png.jpeg',
    photoFilename: 'rabbi-avi-libman.jpg',
    bioParagraphs: [
      "Rabbi Avi Libman has served as Congregation Beth El's Rabbi for the past 20 years. During his tenure, he has assisted in growing the religious school and teen programs, created a thriving Young Adult community and countless life cycle events.",
      'Prior to joining Beth El, Rabbi Libman served as a Chaplain in the Naval Chaplaincy Corps. He credits his tenure to the warm embrace he and his family have received from its membership. Rabbi Libman is passionate about helping members find their spiritual, intellectual and social path of Jewish expression.',
    ],
  },
];

async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function main() {
  await loadEnv();
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN;

  if (!DRY_RUN && !token) {
    console.error('Error: SANITY_API_TOKEN (or SANITY_WRITE_TOKEN) is required for live run.');
    process.exit(1);
  }

  const client = createClient({
    projectId: '9pc3wgri',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  console.log(DRY_RUN ? '=== DRY RUN (no writes) ===' : '=== LIVE RUN ===');
  console.log(`Mode: ${DRY_RUN ? 'dry-run' : 'live'}`);
  console.log(`Members to seed: ${members.length}`);
  console.log('');

  for (const m of members) {
    const bio = m.bioParagraphs.join('\n\n');
    console.log(`--- ${m.name} ---`);
    console.log(`  _id: ${m._id}`);
    console.log(`  role: ${m.role}`);
    console.log(`  orderRank: ${m.orderRank}`);
    console.log(`  bio: ${m.bioParagraphs.length} paragraphs, ${bio.length} chars`);
    console.log(`  photo source: ${m.photoUrl}`);
    console.log(`  photo filename: ${m.photoFilename}`);

    const buffer = await fetchImageBuffer(m.photoUrl);
    const kb = (buffer.length / 1024).toFixed(1);
    console.log(`  photo fetched: ${buffer.length} bytes (${kb} KB)`);

    if (DRY_RUN) {
      console.log(`  [dry-run] would upload asset and createOrReplace doc ${m._id}`);
      console.log('');
      continue;
    }

    const asset = await client.assets.upload('image', buffer, { filename: m.photoFilename });
    console.log(`  uploaded asset: ${asset._id}`);

    const doc = {
      _id: m._id,
      _type: 'teamMember',
      name: m.name,
      role: m.role,
      orderRank: m.orderRank,
      bio,
      photo: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    };

    await client.createOrReplace(doc);
    console.log(`  createOrReplace ${m._id} → ok`);
    console.log('');
  }

  console.log(DRY_RUN ? '=== DRY RUN COMPLETE ===' : '=== SEED COMPLETE ===');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
