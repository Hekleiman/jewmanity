/**
 * Adds the two community stories Belinda sent in September 2026:
 *   1. Niv's Story: From Survival to a New Beginning
 *   2. Sababa Smash Brought Israeli Beach Culture to San Diego
 *
 * Idempotent: uses fixed document IDs, so re-running updates rather than duplicates.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-belinda-stories-2026-09.ts
 *
 * With Belinda's photos (recommended). Web-ready copies with EXIF orientation baked
 * in already exist at ~/Downloads/jewmanityphotos/web/ :
 *
 *   NIV_PHOTO=~/Downloads/jewmanityphotos/web/niv-danon-diploma.jpg \
 *   SABABA_PHOTO=~/Downloads/jewmanityphotos/web/sababa-smash.jpg \
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-belinda-stories-2026-09.ts
 *
 * Photo picks:
 *   niv-danon-diploma.jpg  Niv receiving his Danon "Grand Diplome De Cuisine".
 *   sababa-smash.jpg       Mission Bay, palm trees, two attendees in Jewmanity
 *                          trucker hats. Shot at the actual event.
 *   sababa-smash-matkot-alt.jpg  Alternative: two players with matkot paddles at
 *                          sunset. Better composition, but it is Crystal Pier in
 *                          Pacific Beach, not the Mission Bay event. Swap it in only
 *                          if Belinda is fine running an illustrative photo.
 *
 * The two originals (IMG_5220 / IMG_5231) carry EXIF orientation 5 (mirrored and
 * rotated). Always use the web/ copies, which have the rotation applied and the EXIF
 * stripped, so no downstream pipeline has to guess.
 *
 * If a photo env var is unset, that story keeps whatever image it already has
 * (or renders the placeholder gradient on the card).
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import { basename, extname } from 'node:path';

const token = process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('Error: SANITY_API_TOKEN env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

type Hotspot = { x: number; y: number };

type ImageRef = {
  _type: 'image';
  asset: { _type: 'reference'; _ref: string };
  hotspot?: { _type: 'sanity.imageHotspot'; x: number; y: number; width: number; height: number };
  crop?: { _type: 'sanity.imageCrop'; top: number; bottom: number; left: number; right: number };
};

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
};

async function uploadImage(filePath: string, hotspot?: Hotspot): Promise<ImageRef | null> {
  if (!existsSync(filePath)) {
    console.warn(`  Photo not found, skipping: ${filePath}`);
    return null;
  }
  const ext = extname(filePath).toLowerCase();
  const contentType = MIME[ext];
  if (!contentType) {
    console.warn(`  Unsupported image type "${ext}", skipping: ${filePath}`);
    return null;
  }
  if (ext === '.heic') {
    console.warn('  HEIC detected. Convert to JPG before uploading (project convention).');
    return null;
  }
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename: basename(filePath),
    contentType,
  });
  console.log(`  Uploaded ${basename(filePath)} -> ${asset._id}`);

  const image: ImageRef = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };

  // Both of Belinda's photos are portrait against a landscape card/article crop, so an
  // unset hotspot would default to dead centre and cut the subject. These values were
  // measured off the actual frames. Belinda can still drag the hotspot in the Studio.
  if (hotspot) {
    image.hotspot = { _type: 'sanity.imageHotspot', x: hotspot.x, y: hotspot.y, width: 1, height: 1 };
    image.crop = { _type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0 };
    console.log(`  Hotspot set to x=${hotspot.x} y=${hotspot.y}`);
  }

  return image;
}

interface StoryDoc {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  paragraphs: string[];
  pullQuote?: string;
  pullQuoteAttribution?: string;
  internalUrl?: string;
  orderRank: number;
  photoEnv: string;
  hotspot: Hotspot;
}

const stories: StoryDoc[] = [
  {
    _id: 'communityStory-nivs-story',
    title: 'Niv’s Story: From Survival to a New Beginning',
    slug: 'nivs-story',
    tag: 'Jewmanity Retreat',
    orderRank: 7,
    internalUrl: '/programs/heads-up',
    photoEnv: 'NIV_PHOTO',
    // Faces sit ~0.36-0.53 and the diploma ~0.56-0.66 down the frame.
    // Centring at 0.50 keeps both inside the crop.
    hotspot: { x: 0.5, y: 0.5 },
    excerpt:
      'He survived October 7 at Nahal Oz and came home with wounds no one could see. Today, with a Jewmanity scholarship, Niv is studying culinary arts and building a new life.',
    paragraphs: [
      'On October 7, 2023, Niv David was serving at the Nahal Oz military base when his life changed forever.',
      'For approximately ten and a half hours, Niv fought during the attack on the base. Eighteen people were killed, including seven members of his own team. Of his team, only five survived.',
      'Niv survived that day, but like so many soldiers who experienced the horrors of October 7, he came home carrying wounds that could not always be seen. He was left with hearing loss and post-traumatic stress disorder (PTSD).',
      'Through Shai Gino, Niv was introduced to Jewmanity founders Belinda and Andrew Donner and became part of our Heads Up program in San Diego. Here, he was given a safe place to begin healing, receiving therapeutic support while also experiencing friendship, community, nature, and moments of normalcy again.',
      'But healing does not end when a retreat ends.',
      'After leaving San Diego, Niv spent time traveling throughout North, Central, and South America. Eventually, he returned home to Israel ready to begin thinking about his future and something he had always loved: food and cooking.',
      'With scholarship support from Jewmanity, Niv enrolled at the prestigious Danon Culinary School in Israel and began studying culinary arts.',
      'Today, Niv continues his PTSD treatment while building a new life for himself. When he completes treatment, his goal is to return to the restaurant world and pursue a career doing what he truly loves.',
      'For Jewmanity, Niv’s journey represents exactly why our work continues.',
      'Recovery from trauma is not a single treatment, retreat, or moment. It is a long road that requires continued support, purpose, opportunity, and people who refuse to stop showing up.',
      'Niv is still on that road, and we are incredibly proud to be walking alongside him.',
      'This is what healing can look like: surviving, rebuilding, finding purpose, and beginning to dream about the future again.',
      'And this is why Jewmanity is committed to staying beside our soldiers, not only in the immediate aftermath of trauma, but throughout the journey that comes next.',
    ],
    pullQuote:
      'I want to express my deepest gratitude to Belinda, Andrew, and Shai for everything they have done for me and for so many other soldiers. Your kindness, generosity, and support have made a tremendous difference in our lives. Thank you from the bottom of my heart. I love you all very much.',
    pullQuoteAttribution: 'Niv David, Heads Up Participant',
  },
  {
    _id: 'communityStory-sababa-smash',
    title: 'Sababa Smash Brought Israeli Beach Culture to San Diego',
    slug: 'sababa-smash',
    tag: 'Community Event',
    orderRank: 8,
    photoEnv: 'SABABA_PHOTO',
    // Hats ~0.27-0.47, faces ~0.49-0.72. Centring at 0.50 crops rows 0.25-0.75,
    // which keeps both Jewmanity hats and both chins in (0.46 cut the left chin).
    hotspot: { x: 0.5, y: 0.5 },
    excerpt:
      'Matkot, sheshbesh, music, and Israeli food at Mission Bay. A free community morning built on the idea that the strongest connections happen when people simply come together.',
    paragraphs: [
      'This summer, Jewmanity brought a little piece of Israel to San Diego with Sababa Smash, a free community event filled with Israeli beach games, food, music, and connection.',
      'Held at Mission Bay Mariners Point on July 16, Sababa Smash brought kids, families, and members of our community together for a morning inspired by the energy and spirit of Israel’s beaches.',
      'The day began with Matkot, the iconic paddle game played up and down the beaches of Israel. Participants learned how to play before putting their new skills to the test in a fun and friendly competition.',
      'We also played backgammon (sheshbesh) and filled the morning with music, prizes, swag, and plenty of time for everyone to hang out and enjoy being together by the water.',
      'And of course, we had great food! Burekas Box San Diego provided delicious Israeli-inspired food, and Solely Fruit Snacks helped keep everyone fueled with snacks throughout the event.',
      'Sababa Smash was made even more special through our collaborations with House of Israel San Diego and Youth Action Movement San Diego. Bringing local organizations together allowed us to reach more families and create an event that truly felt like a celebration of community.',
      'But Sababa Smash was about much more than games.',
      'At Jewmanity, we believe that some of the strongest connections happen when people simply come together. Creating joyful, welcoming experiences gives our community an opportunity to meet one another, build friendships, celebrate Jewish and Israeli culture, and feel a greater sense of belonging.',
      'There was something incredibly special about watching kids learn a game so closely associated with Israel, seeing families spending the morning together, and experiencing our San Diego community connecting in such a relaxed and joyful setting.',
      'Sababa Smash was exactly what we hoped it would be: fun, energetic, a little competitive, and filled with community.',
      'The event was offered completely free of charge as part of Jewmanity’s commitment to creating meaningful experiences that strengthen connection and belonging.',
      'We are incredibly grateful to House of Israel San Diego, Youth Action Movement San Diego, Burekas Box San Diego, Solely Fruit Snacks, and everyone who participated, volunteered, donated, and helped make Sababa Smash such a memorable day.',
      'We can’t wait to smash again.💙',
      'Follow @jewmanity_ for upcoming events and more ways to get involved.',
    ],
  },
];

async function main() {
  console.log('Seeding Belinda’s September 2026 community stories into 9pc3wgri/production...\n');

  for (const story of stories) {
    console.log(`${story.title}`);

    const photoPath = process.env[story.photoEnv];
    let image: ImageRef | null = null;
    if (photoPath) {
      image = await uploadImage(photoPath, story.hotspot);
    } else {
      console.log(`  No ${story.photoEnv} set, leaving image untouched.`);
    }

    const doc: Record<string, unknown> = {
      _id: story._id,
      _type: 'communityStory',
      title: story.title,
      slug: { _type: 'slug', current: story.slug },
      tag: story.tag,
      excerpt: story.excerpt,
      paragraphs: story.paragraphs,
      orderRank: story.orderRank,
    };
    if (story.pullQuote) doc.pullQuote = story.pullQuote;
    if (story.pullQuoteAttribution) doc.pullQuoteAttribution = story.pullQuoteAttribution;
    if (story.internalUrl) doc.internalUrl = story.internalUrl;
    if (image) doc.image = image;

    await client.createOrReplace(doc as never);
    console.log(`  Saved as ${story._id} (/about/community-stories/${story.slug})\n`);
  }

  console.log('Done. Redeploy Vercel (or wait for the CMS webhook) to rebuild the static pages.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
