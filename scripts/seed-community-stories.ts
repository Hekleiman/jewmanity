/**
 * Seeds Sanity with the 6 real community story documents.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-community-stories.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('Error: SANITY_WRITE_TOKEN env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

interface StoryData {
  title: string;
  slug: string;
  tag: string;
  paragraphs: string[];
  pullQuote?: string;
  pullQuoteAttribution?: string;
  externalUrl?: string;
  internalUrl?: string;
  orderRank: number;
}

const stories: StoryData[] = [
  {
    title: 'The First Retreat: How It All Began',
    slug: 'the-first-retreat-how-it-all-began',
    tag: 'Jewmanity Retreat',
    internalUrl: '/programs/past-retreats',
    orderRank: 1,
    paragraphs: [
      "In May 2024, Belinda and Andrew Donner met Shai Gino, an Israeli veteran living in San Diego who was struggling with PTSD after returning to fight following October 7th. Shai told them about the Golani Battalion's 13th Brigade \u2014 one of the hardest-hit units that day. Out of 15 soldiers in one group, 9 had been killed. The survivors were struggling.",
      'By June, enough funds had been raised to bring soldiers, a therapist, a commanding officer, and a logistics coordinator to San Diego from Israel. The soldiers arrived late at night on June 13th \u2014 most had never been on an airplane before.',
      'Over ten days, the retreat combined daily therapy sessions led by a certified Israeli psychologist, yoga on the beach, breathwork, boating, home-cooked Shabbat dinners, and the warmth of a volunteer community that opened their homes and hearts. The therapist noted a remarkable transformation in the soldiers, who had initially arrived fearing they would be hated because of the anti-Israel sentiment they had seen in the media.',
    ],
    pullQuote: 'Know that every once in a while, I just think about what you have done for us, and I am again filled with gratitude for everything. You literally saved our lives.',
    pullQuoteAttribution: 'Commanding Officer, First Retreat',
  },
  {
    title: 'Fathers, Fighters, and Finding Peace',
    slug: 'fathers-fighters-and-finding-peace',
    tag: 'Jewmanity Retreat',
    internalUrl: '/programs/past-retreats',
    orderRank: 2,
    paragraphs: [
      "The fourth Heads Up retreat was different. These weren't the usual 18-to-22-year-olds \u2014 they were older men, fathers who had spent decades in the military, carrying wounds that had compounded over years of service. They arrived in San Diego tense and uncertain, not realizing the warmth that was waiting for them.",
      'Retreat assistant Kate H. described arriving to find the soldiers playing makot on the beach at sunset \u2014 the rhythmic ping of paddles and the sound of laughter filling the evening air. Within minutes of meeting, they greeted her with hugs and invited her to watch the sun set over the Pacific with beers in hand.',
      "The days were structured around therapy sessions, surf therapy, breathwork, and dinners hosted by local volunteers. In the group sessions, men who had been silent for years began to open up, sharing their fears and grief with others who understood. One soldier's wife had told the organizers before the retreat that she felt like she had \"lost her husband\" \u2014 he had stopped smiling, stopped being happy. After the retreat, she saw a transformation.",
    ],
    pullQuote: 'We sat there for a long time, talking, sharing stories about their grandmothers born in Jaffa before World War II, and their children born after COVID.',
    pullQuoteAttribution: 'Kate H., Retreat Assistant',
  },
  {
    title: "The Joy of Giving: A Volunteer's Journey",
    slug: 'the-joy-of-giving-a-volunteers-journey',
    tag: 'Jewmanity Volunteer',
    internalUrl: '/about/community-stories#dahlia',
    orderRank: 3,
    paragraphs: [
      "When Dahlia first started volunteering with Jewmanity, she didn't think what she was doing was anything special. Sometimes she cooked a meal. Sometimes she helped out during surfing activities. Simple things, she says. But the appreciation she received from the soldiers she served touched her more deeply than she could have imagined.",
      "Dahlia volunteers with groups of Israeli soldiers living with PTSD who come to San Diego through Jewmanity's Heads Up retreat program. Every one of them carries a whole life story, she says \u2014 they come from all ages and backgrounds, men and women, married and single. Each one matters deeply to her.",
      'What started as small acts of service became something transformative \u2014 not just for the soldiers, but for Dahlia herself. She describes the experience as giving her heart, her time, and her presence, and somehow receiving so much more in return. The connection she builds with each group reminds her how powerful simple human presence can be.',
    ],
    pullQuote: "The joy of giving to them feels endless, and I'm grateful to be part of their journey.",
    pullQuoteAttribution: 'Dahlia, Jewmanity Volunteer',
  },
  {
    title: 'Repairing the World, One Community at a Time',
    slug: 'repairing-the-world-one-community-at-a-time',
    tag: 'Community Impact',
    externalUrl: 'https://werepair.org',
    orderRank: 4,
    paragraphs: [
      'Across the United States, Repair the World mobilizes thousands of young Jews to serve their communities through hands-on volunteer projects grounded in Jewish values. From packing meals for food-insecure families to furnishing homes for refugees, their work embodies the Jewish principle of tikkun olam \u2014 repairing the world.',
      "What makes Repair the World unique is their approach: they don't just organize service projects, they connect volunteering to Jewish learning and identity. Volunteers reflect on how Torah values like tzedakah and chesed inform their work, creating experiences that are both practically impactful and spiritually meaningful.",
      'Their model has expanded to cities nationwide, engaging people who may never have connected to organized Jewish life through any other door. For many young adults, a Sunday morning spent making soup for neighbors becomes the beginning of a deeper relationship with their community and their heritage.',
    ],
  },
  {
    title: '6,000 Meals a Month: The Jewish Relief Agency',
    slug: '6000-meals-a-month-the-jewish-relief-agency',
    tag: 'Community Impact',
    externalUrl: 'https://jewishrelief.org',
    orderRank: 5,
    paragraphs: [
      'Every month in Philadelphia, the Jewish Relief Agency coordinates hundreds of volunteers to pack and deliver boxes of kosher food to more than 6,000 low-income individuals. What started as a small food pantry has grown into one of the most impactful hunger-relief operations in the region \u2014 powered almost entirely by volunteers.',
      "The model is deceptively simple: volunteers gather at a warehouse, pack boxes with groceries and essential items, and then fan out across the city to deliver them directly to doorsteps. But the impact goes beyond food. For many recipients \u2014 elderly Holocaust survivors, struggling single parents, recent immigrants \u2014 the delivery is often the only human connection they receive all week.",
      'JRA has become a gathering point for the community itself. Families volunteer together, synagogues organize group packing days, and bar and bat mitzvah students fulfill their service projects by sorting canned goods alongside their grandparents. The act of giving becomes a shared experience that strengthens the community doing the giving.',
    ],
  },
  {
    title: "Fighting Loneliness: DOROT's Intergenerational Connection",
    slug: 'fighting-loneliness-dorots-intergenerational-connection',
    tag: 'Community Impact',
    externalUrl: 'https://www.dorotusa.org',
    orderRank: 6,
    paragraphs: [
      'Social isolation among older adults is one of the most widespread and least visible public health challenges in the United States. DOROT, a New York-based organization, has been addressing it for decades through a simple but powerful idea: connection.',
      'Their programs match volunteers with isolated seniors for regular friendly visits, weekly phone calls, and holiday packages. What begins as a scheduled call often becomes a genuine friendship \u2014 a college student and an 87-year-old Holocaust survivor who talk every Thursday, or a young professional who visits a homebound widow and stays for tea and stories about pre-war Budapest.',
      "DOROT's intergenerational model doesn't just help seniors feel less alone \u2014 it gives younger volunteers a living connection to Jewish history and heritage that no textbook can provide. In a community that values the wisdom of elders, DOROT ensures that wisdom isn't lost to isolation.",
    ],
  },
];

async function main() {
  console.log('Seeding community stories into 9pc3wgri/production...\n');

  for (const s of stories) {
    console.log(`Creating: ${s.title}`);

    const doc: Record<string, unknown> = {
      _type: 'communityStory',
      title: s.title,
      slug: { _type: 'slug', current: s.slug },
      tag: s.tag,
      paragraphs: s.paragraphs,
      orderRank: s.orderRank,
    };

    if (s.pullQuote) doc.pullQuote = s.pullQuote;
    if (s.pullQuoteAttribution) doc.pullQuoteAttribution = s.pullQuoteAttribution;
    if (s.externalUrl) doc.externalUrl = s.externalUrl;
    if (s.internalUrl) doc.internalUrl = s.internalUrl;

    const created = await client.create(doc);
    console.log(`  Created: ${created._id}\n`);
  }

  console.log('Done! 6 community stories seeded successfully.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
