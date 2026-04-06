export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image';
  text?: string;
  src?: string;
  alt?: string;
}

export interface RetreatData {
  title: string;
  subtitle: string;
  author: string;
  coverImage: string;
  description: string;
  location: string;
  body: ContentBlock[];
}

export const retreatData: Record<string, RetreatData> = {
  'heads-up-first-retreat': {
    title: 'Heads Up First Retreat',
    subtitle: 'Narratives: Belinda Donner',
    author: 'Belinda Donner',
    coverImage: '/images/retreats/retreat-1.jpg',
    description: 'The story of how Jewmanity\u2019s healing retreat program began \u2014 bringing Golani Battalion soldiers to San Diego for 10 days of therapy, community, and hope.',
    location: 'Del Mar, California \u00B7 June 2024',
    body: [
      { type: 'paragraph', text: 'On October 7, 2024, my life was irrevocably altered. A piece of my heart was torn away, and the reason behind it is hard to explain. The massacre that occurred on that day was unprecedented, reminiscent of the horrors of the Holocaust, which my mother survived. The aftermath brought a swift and alarming rise in anti-Semitism in the United States. How could Jews be blamed for such a terrible massacre? Why were so few non-Jews speaking out against the hatred? I felt helpless and isolated, unable to help from afar.' },
      { type: 'paragraph', text: 'I immersed myself in the news, sharing videos, interviews, and photos to raise awareness about the victims and the unfolding events. My family, concerned for my well-being, saw my obsession grow. I desperately wanted to help those suffering from anti-Semitism or anyone affected in Israel.' },
      { type: 'paragraph', text: 'I became involved in various programs, like Workshop 8teen, which helps teenagers combat anti-Semitism, and I donated to the IDF for military supplies and PTSD support. I even suggested to a friend from FIDF that if anyone in Israel needed a safe place, they could stay at our guest home in Del Mar. Then, something magical happened.' },
      { type: 'image', src: '/images/retreats/retreat-1-body-1.jpg', alt: 'Soldiers arriving for the first Heads Up retreat' },
      { type: 'paragraph', text: 'I was introduced to Shai Gino, an Israeli who had returned to fight after October 7 and now lived in San Diego. Shai suffered from PTSD and continued therapy by the government in Israel. He was devastated by his experiences, losing friends and his childhood home in Metula, which was bombed. His family had been evacuated and were living in hotels.' },
      { type: 'paragraph', text: 'Shai told me about the Golani Battalion, 13 brigade, which was one of the hardest-hit units on October 7. These soldiers fought in the Nahal Oz. Out of 15 soldiers, 9 died, all of these soldiers were struggling with PTSD. In May 2024, a friend mentioned that Shai wanted to bring some of these soldiers to San Diego for rehabilitation. My husband and I met Shai, and within minutes, we formed a connection. By June, enough funds were raised to bring soldiers, a therapist, a command officer, and a logistics person to San Diego from Israel.' },
      { type: 'paragraph', text: 'The soldiers arrived late at night on June 13. Most of them had ever been on an airplane before. They stayed in San Diego for ten days. The stay was broken up to living at our home for a week and ending with individual home stays of Shai\u2019s friends in the Community. Despite the Soldiers exhaustion on arrival, we welcomed them with big hugs and open arms. The following days were filled with Shabbat dinners, 5 days of therapy by a certified psychologist from Israel, yoga on the beach, breathwork, boating in Newport Beach, other excursions, and plenty of cigarettes. The therapist noted a remarkable transformation in the soldiers. Initially, the Soldiers feared being hated, feeling like the enemy. The anti-Israel sentiment they saw in the media magnified their sense of despair. But their San Diego experience gave them hope, love, support and a much needed break from their chaos.' },
      { type: 'image', src: '/images/retreats/retreat-1-body-2.jpg', alt: 'Retreat participants bonding during activities in San Diego' },
      { type: 'paragraph', text: 'This experience was life-changing for the soldiers and for us. We gained new friends from Israel as well as San Diego and the satisfaction of making a positive impact was priceless. We\u2019re now planning to broaden the initiative and bring additional soldiers, widowers, and family members to San Diego in the coming year.' },
    ],
  },
  'heads-up-second-retreat': {
    title: 'Heads Up Retreat #2 \u2014 Golani Boys',
    subtitle: 'Written by Belinda Donner',
    author: 'Belinda Donner',
    coverImage: '/images/retreats/retreat-2.jpg',
    description: 'Nine soldiers from the Golani Battalion arrived in San Diego for ten days of healing \u2014 therapy, surf therapy with dolphins, and art therapy at the Museum of Tolerance.',
    location: 'Del Mar, California \u00B7 January 2025',
    body: [
      { type: 'paragraph', text: 'Seven months have passed since our first retreat, when we brought soldiers from the Golani Battalion\u2019s, 13th Brigade--one of the hardest-hit units of October 7th --to Del Mar for rehabilitation. That moment marked the beginning of Heads Up, a Jewmanity program dedicated to supporting the resilience and recovery of those impacted by war.' },
      { type: 'paragraph', text: 'Since then, we\u2019ve remained in close contact with the soldiers, even traveling to Israel in September 2024. We were fortunate to reunite with nearly all of them and were relieved to see them doing well.' },
      { type: 'paragraph', text: 'Now our second retreat has just concluded. This time, a new group of soldiers, accompanied by a therapist, arrived in San Diego for ten days of healing and renewal. Thanks to the deep military connections of Jewmanity\u2019s Executive Director, Shai Gino, we identified nine soldiers --including their commander-- who had been profoundly affected by the events of October 7th. A dedicated therapist accompanied them to provide ongoing support throughout the retreat.' },
      { type: 'paragraph', text: 'On January 22, 2025, the soldiers landed at LAX, greeted with open arms by Shai and his cousin Yohai. For some, this was their first time outside of Israel-- some had never even been on an airplane. Yet despite their exhaustion, their faces lit up as they stepped onto foreign soil, momentarily freed from the weight of war.' },
      { type: 'paragraph', text: 'After a two-hour drive, they arrived at the Del Mar retreat-- a sanctuary where the sound of crashing waves replaced sirens, and birdsong took the place of missile alerts. They settled into their new home before gathering for a welcoming dinner.' },
      { type: 'paragraph', text: 'The retreat was thoughtfully structured to provide both emotional processing and moments of joy. Therapy formed the backbone of their time in San Diego, with multiple sessions each day led by therapist Evyatar Ayzen. These sessions helped the soldiers process the psychological wounds of war, address PTSD and anxiety, and find ways to reframe their experiences. Group therapy fostered a sense of camaraderie, allowing them to share their stories in a space where they felt truly seen and understood.' },
      { type: 'image', src: '/images/retreats/retreat-2-body-1.jpg', alt: 'Soldiers during therapy and healing activities' },
      { type: 'paragraph', text: 'Friday night\u2019s Shabbat dinner was particularly meaningful. The soldiers were embraced by warmth, tradition, and an incredible outpouring of support from the community. Volunteers stepped up in every way imaginable--cooking meals, doing laundry, driving, and handling countless behind-the-scenes tasks. For many, this was a way to show solidarity when distance had previously made them feel helpless in the wake of October 7th.' },
      { type: 'paragraph', text: 'Beyond therapy, the soldiers engaged in activities designed to bring them back to the present moment--indoor go-karting, surfing lessons, and a visit to SeaWorld. These simple joys offered them a rare opportunity to be young again, to laugh without restraint. One soldier, beaming, remarked, \u201CI feel like a kid again!\u201D' },
      { type: 'paragraph', text: 'A recurring symbol emerged throughout their stay--dolphins. While surfing, pods of dolphins swam beneath their boards, leaping through the water in a breathtaking display of freedom. Later that same day at SeaWorld, they once again found themselves face-to-face with these creatures. It felt as if the universe was sending a quiet message: play, joy, and lightness were returning to their lives.' },
      { type: 'paragraph', text: 'One evening, they gathered for a backyard BBQ and massage night--another simple yet powerful moment of relaxation. These experiences were as vital to their healing as the therapy itself.' },
      { type: 'paragraph', text: 'The final days of the retreat included music therapy, art therapy, yoga, and breathwork--practices that provided the soldiers with immediate, accessible tools for finding inner peace amid chaos. One of the most profound moments came during a play therapy session. The therapist placed small figurines--soldiers, families, children, ambulances, and military vehicles--in front of them and asked them to use the figures to recreate their experiences from October 7th. What began as a simple exercise became an emotional breakthrough. Through these tiny representations, they told stories that words could not capture, expressing grief, trauma, and resilience in ways they hadn\u2019t before.' },
      { type: 'image', src: '/images/retreats/retreat-2-body-2.jpg', alt: 'Soldiers participating in art and surf therapy' },
      { type: 'paragraph', text: 'As the retreat drew to a close, a final ceremony allowed the soldiers to reflect on their journey. They did not leave as the same people who arrived ten days prior--they left carrying renewed strength, a sense of hope, and the unwavering knowledge that they were not alone.' },
      { type: 'paragraph', text: 'One of the most deeply moving moments of the retreat came from a soldier who had been noticeably withdrawn upon arrival. He kept his distance, speaking little, his energy weighed down by an unspoken sorrow. Two nights in, he quietly pulled us aside. His girlfriend, who had been working on base on October 7th, had been killed. As he spoke, he reached into his pocket and handed us a sticker--hers. It was a small but deeply personal gesture, a way of keeping her memory alive and entrusting a piece of his grief to someone who would carry it with care.' },
      { type: 'paragraph', text: 'Her name was Sivan Asraf, and she was killed during the Hamas attack on the Nahal Oz base.' },
      { type: 'paragraph', text: 'After leaving the retreat, the soldiers traveled to Los Angeles to work with Israeli conceptual artist Tomer Peretz, founder of The 8 Project. Tomer created the initiative after volunteering with Zaka, where he witnessed the devastation firsthand as he helped recover bodies from Kibbutz Be\u2019eri.' },
      { type: 'paragraph', text: 'Through The 8 Project, art became a tool for healing. The soldiers poured their emotions into their work, channeling their pain and resilience onto the canvas. Their pieces will be exhibited at the Museum of Tolerance in Los Angeles, opening on March 19, 2025.' },
      { type: 'paragraph', text: 'This initiative was more than just a trip--it was a transformative experience. It was a safe space for healing, an opportunity to rediscover joy, and a powerful reminder that no one walks alone. The journey doesn\u2019t end here, and neither does our commitment to these brave individuals.' },
      { type: 'paragraph', text: 'Until next time, we stand with them--united in healing, in love, and in unwavering support.' },
    ],
  },
  'heads-up-third-retreat': {
    title: 'Heads Up Retreat #3 \u2014 The Brave Girls',
    subtitle: 'Written by Belinda Donner',
    author: 'Belinda Donner',
    coverImage: '/images/retreats/retreat-3.jpg',
    description: 'Nine female IDF soldiers from Kissufim and Nahal Oz arrived for the first all-female Heads Up retreat \u2014 yoga, surf therapy, equine therapy, and sisterhood.',
    location: 'Del Mar, California \u00B7 July 2025',
    body: [
      { type: 'paragraph', text: 'This summer in San Diego, nine female IDF soldiers stepped onto American soil carrying scars few could see and stories few could bear to tell. Two years ago, Jewmanity and Heads Up made a promise to bring those wounded by war to California for healing, especially those haunted by the invisible shadow of PTSD. In July, we welcomed a group unlike any before: eight women from Kissufim and one from Nahal Oz, military bases forever marked by the tragedy of October 7, 2023.' },
      { type: 'heading', text: 'The Nightmare of October 7' },
      { type: 'paragraph', text: 'October 7, 2023 is a day seared into the memory of Israel and the world. On that morning, these women stood watch at their posts, guarding their base, never imagining the horror Hamas would unleash. The assault was relentless: gunfire, explosions, lives torn apart. Some lost friends just hours before. Many hid for their lives, helpless to answer the cries echoing in the chaos. Their world shattered in an instant, leaving behind emotional wreckage and unanswered questions.' },
      { type: 'heading', text: 'Reunited in Compassion' },
      { type: 'paragraph', text: 'For most, this week in San Diego was their first reunion since that dark day. They carried heavy burdens, grief, survivor\u2019s guilt, but found solace in each other\u2019s company. They were joined by Yossi Shtainmentz, a therapist devoted to IDF soldiers, and supported by coordinators Orit Biton and Rikki Gino, whose care made every day a little lighter.' },
      { type: 'paragraph', text: 'Upon arrival, their first request was simple but telling: a trip to the San Clemente outlets. It was a gentle act of reclaiming joy, choosing a moment of normalcy to start their healing journey. Of course, Shopping therapy is important also :)' },
      { type: 'image', src: '/images/retreats/retreat-3-body-1.jpg', alt: 'Female soldiers during healing activities at the retreat' },
      { type: 'heading', text: 'A Sanctuary by the Sea' },
      { type: 'paragraph', text: 'In Del Mar, the air itself seemed to whisper hope. Every day was filled with healing through yoga, breathwork, acupuncture, music movement, and art therapy. Each session was led by volunteers who gave freely of their time and their hearts to help these women find some peace.' },
      { type: 'paragraph', text: 'Local families prepared homemade lunches and opened their homes for dinners, showing these soldiers that caring strangers could become family.' },
      { type: 'heading', text: 'The Power of Surf Therapy' },
      { type: 'paragraph', text: 'The ocean proved transformative. Surf therapy meant standing at the edge, boards in hand, hearts pounding as they faced the waves. The experience was daunting at first but with patient instructors the women paddled out, laughed, fell, stood again, and discovered a fleeting lightness. One soldier shared, \u201CThe experience of surf therapy was amazing. Working one on one, I felt a moment of disconnection with myself. The combination of surfing and the ocean, it was so much fun, meaningful, and enjoyable\u201D. A big thank you to Betty Kraug and her volunteers for putting together an unforgettable experience.' },
      { type: 'heading', text: 'Moments of Joy and Reflection' },
      { type: 'paragraph', text: 'Afternoons brought visits to SeaWorld, shopping at Sephora, equine therapy, and more family hosted dinners. Evenings shimmered with Pacific sunsets, Shabbat music, tequila toasts, and laughter spilling out from late night jacuzzi talks, moments when hearts were mended by simple joys.' },
      { type: 'image', src: '/images/retreats/retreat-3-body-2.jpg', alt: 'Retreat participants enjoying ocean activities and community' },
      { type: 'heading', text: 'Transformation and Sisterhood' },
      { type: 'paragraph', text: 'This retreat felt different from others. The feminine energy brought deep emotions to the surface. Tears flowed, but so did laughter. The women danced barefoot in the sand and held hands in remembrance of lost friends, survivors standing together as sisters.' },
      { type: 'paragraph', text: 'By week\u2019s end, they did not just leave healed. They left changed. Not all scars fade, but hope had returned. They believed healing is possible, and their resilience inspired everyone involved.' },
      { type: 'heading', text: 'A Ripple of Hope' },
      { type: 'paragraph', text: 'For the volunteers and community, the soldiers\u2019 journey was just as moving. Witnessing their courage and seeing them step just out of the shadow is proof that human kindness, empathy, and connection are stronger than violence.' },
      { type: 'paragraph', text: 'This retreat was not merely a week away from home. It was a reminder that hope can be reborn, even after the darkest of days.' },
    ],
  },
  'heads-up-retreat-4-fathers-fighters': {
    title: 'Heads Up Retreat #4 \u2014 Fathers, Fighters',
    subtitle: 'Winter in San Diego',
    author: 'Written by retreat assistant, Kate H.',
    coverImage: '/images/retreats/retreat-4.jpg',
    description: 'Older soldiers \u2014 all fathers, all veterans of decades of service \u2014 arrived for 10 days of therapy, surf therapy, and brotherhood.',
    location: 'Del Mar, California \u00B7 December 2025',
    body: [
      { type: 'paragraph', text: 'You could hear the sound of makot-- the rhythmic ping of balls hitting paddles-- as I walked up to the group of soldiers playing on the beach. It was the end of a gorgeous San Diego winter day; they were in T-shirts, laughing, and completely relaxed. When I approached, they greeted me with warm hugs and immediately invited me to join them on the porch of the house. With beers in hand, we watched the huge orange sun disappear into the dark blue ocean together. We sat there for a long time, talking, sharing stories about their grandmothers born in Jaffa before World War II, and their children born after COVID. We discussed where to buy Bamba in San Diego and the similarities of Jewish mothers, even though we had been raised in such different cultures.' },
      { type: 'paragraph', text: 'The warmth, their connection, and their immediate family-like nature were palpable.' },
      { type: 'heading', text: 'A Silent Burden' },
      { type: 'paragraph', text: 'At that sunset moment, it was impossible to tell that these men, with their big smiles and relaxed demeanor, were carrying a heavy burden. As veterans of the Israeli Defense Forces, many had been serving for 20 years or more-- surviving one conflict after another, enduring the constant weight of military duty, and bearing the additional trauma of October 7 on top of decades of violence.' },
      { type: 'paragraph', text: 'The toll of combat, loss, and constant vigilance had left deep marks-- something we can classify as PTSD. PTSD is often a burden many carry invisibly. A silent companion that visits at the worst times: when people are alone with their thoughts, or when an unexpected situation arises that triggers the traumatic event. It can be sudden, unexpected, and extremely difficult to live with. Despite this daily weight, these men continued to serve in the IDF with pride, despite the toll it had taken on their mental health.' },
      { type: 'paragraph', text: 'Now, they had come to San Diego for a retreat: a chance to finally confront their trauma, heal, and reclaim the parts of themselves they thought they had lost.' },
      { type: 'image', src: '/images/retreats/retreat-4-body-1.jpg', alt: 'Soldiers during retreat activities in San Diego' },
      { type: 'heading', text: 'Fathers, Fighters' },
      { type: 'paragraph', text: 'This Heads Up x Jewmanity retreat #4 was particularly special because these were men who had spent decades in the military, all of them fathers, and older than the usual group of 18-22 year-olds who had participated in our previous retreats.' },
      { type: 'paragraph', text: 'I spoke with Shai Gino, the founder of Heads Up, who gave me a behind-the-scenes look at some of the most meaningful moments of the 10 days spent with these men.' },
      { type: 'paragraph', text: 'When they first arrived, Shai shared with me, the men were tense because they didn\u2019t realize what a welcoming environment they were stepping into. Belinda and Andrew Donner, the founders of Jewmanity, and the retreat organizers/coordinators, specialize in making the soldiers feel like family-- like home. The men began to relax once they realized they were embraced by the strength of connection, community, and care.' },
      { type: 'paragraph', text: 'The days of the retreat consisted of psychological therapy sessions, alternative therapies such as surf therapy and breathwork, and opportunities for relaxation and connection, thanks to the network of volunteers who hosted dinners and activities for the men.' },
      { type: 'paragraph', text: 'The daily therapy sessions are led by Yossi, the therapist who accompanies the men from Israel. They are healing opportunities for the men to open up in a group setting and be witnessed by others who have experienced the same kinds of traumas and losses. They share their fears, their grief, and their stories. And they find themselves mirrored in understanding by the other men.' },
      { type: 'paragraph', text: 'One soldier\u2019s wife told Shai at a Shabbat dinner in Israel prior to the retreat that she felt like she had lost her husband Roy. Roy had stopped smiling, stopped being happy. But after the retreat, she saw a huge shift. Roy told Shai that he has a renewed sense of self, and his problems are smaller. He feels hope again.' },
      { type: 'paragraph', text: 'Many more soldiers from the retreat have stories exactly like Roy\u2019s. Now they understand in their bones that they have a backing, and they feel a part of something. They have a feeling that they\u2019re home and that they matter.' },
      { type: 'paragraph', text: 'The alternative therapies gave the soldiers exposure to new things, such as yoga, breathwork, and glassmaking. One soldier, who had rarely traveled outside of Israel, caught his first wave during the surf therapy activity. He never thought in his life that he would sit on a surfboard because he is so busy in the military. And now he is talking about buying a surfboard when he gets back to Israel because he loved it and it made him feel so good.' },
      { type: 'paragraph', text: 'Others talked about incorporating the healing practices they were introduced to into their lives back home. The alternative therapies not only provided healing to the men but gave them an opportunity to push the limits of their boundaries and step outside their comfort zones.' },
      { type: 'image', src: '/images/retreats/retreat-4-body-2.jpg', alt: 'Soldiers bonding and connecting during the retreat' },
      { type: 'heading', text: 'Laughter as Medicine' },
      { type: 'paragraph', text: 'What distinguishes these retreats from other programs is the intimacy created by sharing daily life together under one roof. Healing didn\u2019t stop when the therapy sessions ended- it continued in carpools filled with spontaneous karaoke, during casual shopping trips where laughter came easily, and around the Shabbat dinner table, when the wigs were broken out for laughs! Staying in the same house allowed barriers to fall away; conversations stretched late into the night, trust began to form, and created an irreplaceable closeness.' },
      { type: 'paragraph', text: 'The volunteers who cook, clean, and host meals and activities are an integral part of the retreat program. They are what make the retreat what it is. The soldiers told Shai that they don\u2019t understand why someone would take time out of their busy lives to do their laundry, for example.' },
      { type: 'paragraph', text: 'But when the men land here, they get access to an immediate community of vibrant volunteers who begin to feel like family. Every person who hosts a dinner in their home or volunteers their time to teach movement therapy, surf therapy, yoga, etc. is a valuable part of the retreat and the men\u2019s experience.' },
      { type: 'heading', text: 'Moving Forward' },
      { type: 'paragraph', text: 'By the end of the retreat, the men were not only more open with each other, but they were more open with themselves. The group that had arrived unsure and tense was now bonded by shared vulnerability and brotherhood. Laughter and camaraderie flowed together in the evenings.' },
      { type: 'paragraph', text: 'They stayed up late, talking, playing games, and even drinking scotch together. The weight of the war was still there, of course, but it wasn\u2019t all they were. They had found a new kind of freedom in each other\u2019s presence--a quiet, lasting kind of relief.' },
    ],
  },
};
