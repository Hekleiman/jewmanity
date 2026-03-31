/**
 * Patches the Sanity mitzvahProject singleton with full PDF-accurate content:
 * - Opening quote
 * - Updated WhyThisMatters paragraphs
 * - Full step titles, labels, action items, and tip boxes
 * - Inspirational quote
 * - Updated fundraising heading
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/patch-mitzvah-content.ts
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

async function main() {
  console.log('Patching mitzvahProject singleton with full PDF content...\n');

  await client
    .patch('mitzvahProject')
    .set({
      // Opening quote
      openingQuote:
        "The most important moment in Jewish life is not the party \u2014 it\u2019s the promise you make to your community. Your mitzvah project is that promise.",

      // Why This Matters — original spec paragraphs
      whyParagraphs: [
        'At a time when antisemitism in America is rising and Jewish identity is under attack, your bar or bat mitzvah can be more than a celebration. It can be a stand for what you believe in.',
        'Through Jewmanity\u2019s Mitzvah Project, you\u2019ll learn about the challenges facing Jewish communities, connect with soldiers and individuals in need, and take meaningful action that creates lasting impact.',
        'This is your chance to not only mark your Jewish milestone, but to fight for your people, live your values, and make a difference that matters.',
      ],

      // Full steps with labels, actions, tips
      steps: [
        {
          _key: 'step1',
          label: 'GETTING STARTED \u2014 MONTH 1',
          title: 'Reach Out to Jewmanity & Register Your Project',
          description:
            'The very first step is to connect with the Jewmanity team so we can support you throughout your project. We\u2019ll pair you with a Jewmanity mentor, learn about your interests and strengths, and help you set a personal goal that feels right for you.',
          actions: [
            'Email Jewmanity at info@jewmanity.com with the subject line: \u201cMitzvah Project \u2013 [Your Name]\u201d',
            'Tell us: your name, age, synagogue, bar/bat mitzvah date, and what excites you most about this project',
            'We\u2019ll schedule a free 30-minute Zoom call to introduce you to our team and walk you through your options',
            'Get your official Jewmanity Mitzvah Project certificate and welcome packet',
          ],
          tip: "Tip for your speech: You can mention in your d\u2019var Torah (Torah commentary) how your project connects to your Torah portion. Our team can help you find that connection!",
        },
        {
          _key: 'step2',
          label: 'LEARN \u2014 MONTH 1\u20132',
          title: 'Educate Yourself on Antisemitism in America Today',
          description:
            'You can\u2019t fight something you don\u2019t understand. Before you fundraise or volunteer, take time to learn about what antisemitism looks like in America right now, why it matters, and what Jewmanity is doing about it. This knowledge will make your speeches, fundraising messages, and conversations far more powerful.',
          actions: [
            'Read at least 3 articles from Jewmanity\u2019s Recommended Reading page on antisemitism',
            'Watch one documentary or educational video about the Holocaust or modern antisemitism (suggestions provided by Jewmanity)',
            'Talk with a grandparent, family member, or Jewish elder about their experiences \u2014 their story can inspire your whole project',
            'Write a one-page reflection: \u201cWhy fighting antisemitism matters to me personally\u201d \u2014 this becomes part of your mitzvah project presentation',
          ],
          tip: 'Did you know? According to AJC research, 42% of Jewish college students have experienced antisemitism on campus. Learning these facts helps you explain to friends and family WHY your project matters.',
        },
        {
          _key: 'step3',
          label: 'CHOOSE YOUR PATH \u2014 MONTH 2',
          title: 'Select Your Project Focus Area',
          description:
            'Jewmanity offers three ways to make your mitzvah project meaningful. You can choose one, or combine them all for the biggest impact. Talk with your family and your Jewmanity mentor to decide what fits you best.',
        },
        {
          _key: 'step4',
          label: 'FUNDRAISE \u2014 MONTH 2\u20135',
          title: 'Launch Your Fundraising Campaign',
          description:
            'If you\u2019ve chosen to fundraise (Path A or in combination with other paths), here is exactly how to do it. Your Jewmanity mentor will help you set up your fundraising page and create a compelling message that moves people to give.',
          actions: [
            'Set your goal: Choose a fundraising target from the goal chart below. We suggest starting with $500 and going from there!',
            'Create your online page: Jewmanity will help you set up a personalized fundraising page with your name, photo, and story',
            'Write your message: Tell donors WHY you chose this project \u2014 your personal connection makes all the difference',
            'Share it widely: Email family, post on social media (with parent permission), bring it up at Shabbat dinner, and include a QR code or card at your bar/bat mitzvah party',
            'Host an event: Organize a bake sale, car wash, talent show, or Shabbat dinner to raise money and awareness together',
            'Give guests a way to donate at the party: A tzedakah table at your celebration is a beautiful tradition and can raise hundreds of dollars in a single evening',
          ],
          tip: 'Fundraising tip: Personal stories raise 3x more money than statistics. Tell donors about a specific moment that made you care about this cause \u2014 whether it\u2019s something you heard from a grandparent, read about, or witnessed yourself.',
        },
        {
          _key: 'step5',
          label: 'VOLUNTEER \u2014 WHEN SOLDIERS VISIT SAN DIEGO',
          title: 'Serve & Honor Jewish Soldiers in San Diego',
          description:
            'One of the most unique and powerful parts of a Jewmanity mitzvah project is the opportunity to volunteer when Israeli and Jewish soldiers visit San Diego. This is a hands-on experience you can only get through Jewmanity \u2014 and it will stay with you forever.',
          actions: [
            'Register your interest with Jewmanity\u2019s San Diego volunteer coordinator when you first sign up for your project',
            'You\u2019ll be notified when soldiers are scheduled to visit \u2014 Jewmanity will coordinate the dates with your family',
            'Before the visit: Write personal welcome letters to the soldiers; research the unit or mission to understand who you\u2019ll be meeting',
            'During the visit: Help prepare and serve a Shabbat or communal meal; assist with hospitality, setup, and activities; spend time listening to their stories',
            'After the visit: Write a reflection on what you learned, take photos (where permitted), and share your experience as part of your mitzvah project presentation',
          ],
          tip: 'What to expect: These visits are incredibly moving. You\u2019ll meet young Jewish men and women not much older than you who have dedicated their lives to protecting the Jewish people. Many b\u2019nai mitzvah students say this experience was the highlight of their entire project.',
        },
        {
          _key: 'step6',
          label: 'SHARE YOUR STORY \u2014 1 MONTH BEFORE YOUR BAR/BAT MITZVAH',
          title: 'Present Your Project to Your Community',
          description:
            'Your project isn\u2019t complete until you\u2019ve shared what you\u2019ve learned and accomplished with the people who love you. This is your moment to inspire others \u2014 and to show that your bar or bat mitzvah stands for something bigger than a party.',
          actions: [
            'Prepare a 2\u20133 minute presentation summarizing your project: what you did, what you raised, what you learned, and how it changed you',
            'Include your personal \u201cwhy\u201d \u2014 the moment that made this project feel important to you',
            'Share photos, a short video, or artwork from your volunteering or fundraising experience',
            'Present at your synagogue\u2019s Friday night service, a family Shabbat dinner, or during your bar/bat mitzvah party',
            'If you\u2019re comfortable, post about your project on social media \u2014 with parent permission \u2014 to inspire other Jewish young people',
          ],
        },
        {
          _key: 'step7',
          label: 'CELEBRATE & CONTINUE \u2014 AFTER YOUR BAR/BAT MITZVAH',
          title: 'Receive Your Jewmanity Recognition & Keep Going',
          description:
            'When your project is complete, Jewmanity will honor your commitment with a certificate of recognition \u2014 and we hope this is only the beginning of a lifetime of Jewish service and advocacy.',
          actions: [
            'Receive your official Jewmanity Mitzvah Project Certificate of Recognition',
            'Be featured on the Jewmanity website as a Mitzvah Project honoree',
            'Consider staying involved as a Jewmanity teen volunteer or ambassador',
            'Share your completed project report with your school or synagogue \u2014 your story could inspire the next generation of b\u2019nai mitzvah students',
            'Know that the money you raised is directly funding retreats and programs that help Jewish young people thrive in a time of rising antisemitism',
          ],
          tip: 'You\u2019re now a Jewish adult. The promise you made to your community on the bimah isn\u2019t just words \u2014 this project is proof that you meant it. Mazel tov!',
        },
      ],

      // Inspirational quote
      inspirationalQuote:
        'In every generation, they rise up against us \u2014 and in every generation, we rise to meet them. Your mitzvah project is how our generation answers that call.',
      inspirationalQuoteAttribution: 'JEWMANITY.COM',

      // Updated fundraising heading
      goalsHeading: 'Set Your Fundraising Goal',
    })
    .commit();

  console.log('Done! Mitzvah Project singleton patched with full PDF content.');
}

main().catch((err) => {
  console.error('Patch failed:', err);
  process.exit(1);
});
