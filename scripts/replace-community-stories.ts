/**
 * Replaces all communityStory documents in Sanity with 6 Jewmanity-only stories.
 * Downloads retreat photos, reuses Dahlia/Matamba testimonial images.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/replace-community-stories.ts
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

const token = process.env.SANITY_API_TOKEN;

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

type ImageRef = { _type: 'image'; asset: { _type: 'reference'; _ref: string } };

async function uploadImage(filePath: string, filename: string, contentType: string): Promise<ImageRef> {
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, { filename, contentType });
  console.log(`  Uploaded ${filename} -> ${asset._id}`);
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

async function main() {
  // Step 1: Delete all existing communityStory documents
  console.log('Deleting existing community stories...');
  const existing = await client.fetch('*[_type == "communityStory"]{ _id, title }');
  for (const s of existing) {
    await client.delete(s._id);
    console.log(`  Deleted: ${s.title}`);
  }
  console.log(`  ${existing.length} stories deleted.\n`);

  // Step 2: Upload 4 retreat photos
  console.log('Uploading retreat photos...');
  const retreat1Img = await uploadImage('/tmp/retreat-1.webp', 'retreat-1-first-retreat.webp', 'image/webp');
  const retreat2Img = await uploadImage('/tmp/retreat-2.webp', 'retreat-2-golani-boys.webp', 'image/webp');
  const retreat3Img = await uploadImage('/tmp/retreat-3.webp', 'retreat-3-brave-girls.webp', 'image/webp');
  const retreat4Img = await uploadImage('/tmp/retreat-4.webp', 'retreat-4-fathers-fighters.webp', 'image/webp');
  console.log('');

  // Step 3: Get Dahlia and Matamba's existing image asset references
  console.log('Fetching existing testimonial image refs...');
  const testimonials: { authorName: string; imageRef: string }[] = await client.fetch(`
    *[_type == "testimonial" && authorName in ["Dahlia", "Matamba Lassan"]] {
      authorName,
      "imageRef": authorImage.asset._ref
    }
  `);

  const dahliaRef = testimonials.find((t) => t.authorName === 'Dahlia')?.imageRef;
  const matambaRef = testimonials.find((t) => t.authorName === 'Matamba Lassan')?.imageRef;

  if (!dahliaRef || !matambaRef) {
    console.error('Could not find testimonial image refs:', { dahliaRef, matambaRef });
    process.exit(1);
  }

  const dahliaImg: ImageRef = { _type: 'image', asset: { _type: 'reference', _ref: dahliaRef } };
  const matambaImg: ImageRef = { _type: 'image', asset: { _type: 'reference', _ref: matambaRef } };
  console.log(`  Dahlia: ${dahliaRef}`);
  console.log(`  Matamba: ${matambaRef}\n`);

  // Step 4: Create 6 stories
  const stories = [
    {
      title: 'The First Retreat: How It All Began',
      slug: 'first-retreat',
      tag: 'Jewmanity Retreat',
      internalUrl: '/programs/past-retreats',
      image: retreat1Img,
      orderRank: 1,
      paragraphs: [
        "In May 2024, Belinda and Andrew Donner met Shai Gino, an Israeli veteran living in San Diego who was struggling with PTSD after returning to fight following October 7th. Shai told them about the Golani Battalion\u2019s 13th Brigade \u2014 one of the hardest-hit units that day. Out of 15 soldiers in one group, 9 had been killed. The survivors were struggling.",
        'By June, enough funds had been raised to bring soldiers, a therapist, a commanding officer, and a logistics coordinator to San Diego from Israel. The soldiers arrived late at night on June 13th \u2014 most had never been on an airplane before.',
        'Over ten days, the retreat combined daily therapy sessions led by a certified Israeli psychologist, yoga on the beach, breathwork, boating, home-cooked Shabbat dinners, and the warmth of a volunteer community that opened their homes and hearts. The therapist noted a remarkable transformation in the soldiers, who had initially arrived fearing they would be hated because of the anti-Israel sentiment they had seen in the media.',
      ],
      pullQuote: "You literally saved our lives. You're the best!",
      pullQuoteAttribution: 'Commanding Officer, First Retreat',
    },
    {
      title: 'The Golani Boys Return',
      slug: 'golani-boys',
      tag: 'Jewmanity Retreat',
      internalUrl: '/programs/past-retreats',
      image: retreat2Img,
      orderRank: 2,
      paragraphs: [
        "Seven months after the first retreat, a new group of nine soldiers from the Golani Battalion \u2014 including their commander \u2014 arrived in San Diego for ten days of healing. Thanks to the deep military connections of Jewmanity\u2019s Executive Director Shai Gino, the soldiers were identified as profoundly affected by the events of October 7th.",
        'On January 22, 2025, they landed at LAX, greeted by Shai and his cousin Yohai. For some, it was their first time outside Israel \u2014 some had never even been on an airplane. Yet despite their exhaustion, their faces lit up as they stepped onto foreign soil, momentarily freed from the weight of war.',
        'The retreat followed the same proven model: daily therapy with a dedicated Israeli psychologist, surf therapy, breathwork, community dinners, and the unconditional warmth of San Diego volunteers who opened their homes. By the end, the bonds formed between the soldiers and their hosts had become something lasting \u2014 a bridge between two communities united by care.',
      ],
    },
    {
      title: 'The Brave Girls',
      slug: 'brave-girls',
      tag: 'Jewmanity Retreat',
      internalUrl: '/programs/past-retreats',
      image: retreat3Img,
      orderRank: 3,
      paragraphs: [
        'In the summer of 2025, nine female IDF soldiers stepped onto American soil carrying scars few could see and stories few could bear to tell. Eight were from Kissufim and one from Nahal Oz \u2014 military bases forever marked by the tragedy of October 7, 2023. On that morning, these women stood watch at their posts, never imagining the horror that would unfold.',
        'For most, the San Diego retreat was their first reunion since that day. They carried grief, survivor\u2019s guilt, and the weight of memories that had never been fully spoken. But in the safety of the retreat \u2014 surrounded by therapists, volunteers, and each other \u2014 they began to share what they had held inside for nearly two years.',
        'The retreat marked a milestone for Jewmanity and Heads Up: the first time the program welcomed an all-female group. The experience reinforced what the organizers had always believed \u2014 that healing happens through connection, and that every person who served deserves the chance to be seen, heard, and supported.',
      ],
    },
    {
      title: 'Fathers, Fighters, and Finding Peace',
      slug: 'fathers-fighters',
      tag: 'Jewmanity Retreat',
      internalUrl: '/programs/past-retreats',
      image: retreat4Img,
      orderRank: 4,
      paragraphs: [
        "The fourth Heads Up retreat was different. These weren\u2019t the usual 18-to-22-year-olds \u2014 they were older men, fathers who had spent decades in the military, carrying wounds that had compounded over years of service. They arrived in San Diego tense and uncertain, not realizing the warmth that was waiting for them.",
        'Retreat assistant Kate H. described arriving to find the soldiers playing makot on the beach at sunset \u2014 the rhythmic ping of paddles and the sound of laughter filling the evening air. Within minutes of meeting, they greeted her with hugs and invited her to watch the sun set over the Pacific with beers in hand.',
        "In the group therapy sessions, men who had been silent for years began to open up, sharing their fears and grief with others who understood. One soldier\u2019s wife had told the organizers before the retreat that she felt like she had lost her husband \u2014 he had stopped smiling, stopped being happy. After the retreat, she saw a transformation.",
      ],
      pullQuote: 'We sat there for a long time, talking, sharing stories about their grandmothers born in Jaffa before World War II, and their children born after COVID.',
      pullQuoteAttribution: 'Kate H., Retreat Assistant',
    },
    {
      title: "The Joy of Giving: A Volunteer\u2019s Journey",
      slug: 'dahlia-volunteer',
      tag: 'Jewmanity Volunteer',
      internalUrl: '/about/community-stories#dahlia',
      image: dahliaImg,
      orderRank: 5,
      paragraphs: [
        "When Dahlia first started volunteering with Jewmanity, she didn\u2019t think what she was doing was anything special. Sometimes she cooked a meal. Sometimes she helped out during surfing activities. Simple things, she says. But the appreciation she received from the soldiers she served touched her more deeply than she could have imagined.",
        "Dahlia volunteers with groups of Israeli soldiers living with PTSD who come to San Diego through Jewmanity\u2019s Heads Up retreat program. Every one of them carries a whole life story, she says \u2014 they come from all ages and backgrounds, men and women, married and single. Each one matters deeply to her.",
        'What started as small acts of service became something transformative \u2014 not just for the soldiers, but for Dahlia herself. She describes the experience as giving her heart, her time, and her presence, and somehow receiving so much more in return. The connection she builds with each group reminds her how powerful simple human presence can be.',
      ],
      pullQuote: "The joy of giving to them feels endless, and I\u2019m grateful to be part of their journey.",
      pullQuoteAttribution: 'Dahlia, Jewmanity Volunteer',
    },
    {
      title: "Believing Again: Matamba\u2019s Journey Home",
      slug: 'matamba-journey',
      tag: 'Jewmanity Retreat',
      internalUrl: '/about/community-stories#matamba-lassan',
      image: matambaImg,
      orderRank: 6,
      paragraphs: [
        'Matamba Lassan was 23 years old and recently married when October 7th shattered his world. In the aftermath, he lost his faith \u2014 especially in himself. The trauma of what he had witnessed left him unable to see a path forward.',
        "Through Jewmanity\u2019s Heads Up program, Matamba traveled to the United States for a month of healing. The retreat combined professional psychological care with the warmth of a community that embraced him and his fellow soldiers. For the first time since the attack, he felt supported \u2014 not as a soldier, but as a person.",
        'When Matamba returned to Israel, something had changed. The journey had helped him believe in himself again. He finally knew how to move forward. His message to Jewmanity was simple and heartfelt: keep going. Am Israel Chai.',
      ],
      pullQuote: 'This journey helped me believe in myself again. When I came back to Israel, I finally knew how to move forward.',
      pullQuoteAttribution: 'Matamba Lassan, Retreat Participant',
    },
  ];

  console.log('Creating 6 community stories...');
  for (const s of stories) {
    const doc: Record<string, unknown> = {
      _type: 'communityStory',
      title: s.title,
      slug: { _type: 'slug', current: s.slug },
      tag: s.tag,
      image: s.image,
      paragraphs: s.paragraphs,
      orderRank: s.orderRank,
    };
    if (s.internalUrl) doc.internalUrl = s.internalUrl;
    if (s.pullQuote) doc.pullQuote = s.pullQuote;
    if (s.pullQuoteAttribution) doc.pullQuoteAttribution = s.pullQuoteAttribution;

    const created = await client.create(doc);
    console.log(`  Created: ${s.title} (${created._id})`);
  }

  console.log('\nDone! 6 Jewmanity community stories seeded with photos.');
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
