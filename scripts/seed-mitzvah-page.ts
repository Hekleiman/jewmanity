/**
 * Seeds Sanity with the Mitzvah Project singleton document.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-mitzvah-page.ts
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

const mitzvahProject = {
  _id: 'mitzvahProject',
  _type: 'mitzvahProject',

  // Hero
  heroHeading: 'A Mitzvah That Matters Right Now',
  heroSubtitle:
    'Turn your biggest Jewish milestone into an act of tikkun olam \u2014 help fight antisemitism, fund life-changing retreats, and stand beside Jewish soldiers visiting San Diego.',

  // Why This Matters
  whyHeading: 'Why This Matters',
  whyParagraphs: [
    'Antisemitism in America is at its highest level in decades. More than half of Jewish Americans report experiencing antisemitism in the past year. As a young Jewish adult, your bar or bat mitzvah project is an opportunity to take a stand \u2014 not just celebrate.',
    'Through Jewmanity\u2019s Mitzvah Project, you\u2019ll learn about the challenges facing Jewish communities, connect with soldiers and survivors in Israel, and take meaningful action that creates lasting impact.',
    'Jewmanity gives you real ways to make a real difference. This is your chance to not only mark your Jewish milestone, but to fight for your people, live your values, and make a difference that matters.',
  ],

  // Impact Cards
  impactHeading: "The Impact You'll Make",
  impactSubtitle: 'Your mitzvah project creates real change in four powerful ways.',
  impactCards: [
    {
      _key: 'card1',
      icon: 'shield',
      title: "Fight the World\u2019s Oldest Hatred",
      description:
        "Your project directly supports Jewmanity\u2019s mission to educate communities, publish resources, and combat antisemitism at every level.",
    },
    {
      _key: 'card2',
      icon: 'mountain',
      title: 'Fund Life-Changing Retreats',
      description:
        'Money you raise helps send Jewish young people to retreats that build identity, resilience, and pride during a time when those things are under attack.',
    },
    {
      _key: 'card3',
      icon: 'handshake',
      title: 'Volunteer with Jewish Soldiers',
      description:
        "When Israeli soldiers visit San Diego, you can be there to welcome, serve, and honor them \u2014 a once-in-a-lifetime volunteer experience you\u2019ll never forget.",
    },
    {
      _key: 'card4',
      icon: 'heart',
      title: 'Live Jewish Values',
      description:
        "Tikkun olam. Tzedakah. Ahavat Yisrael. This project isn\u2019t just a requirement \u2014 it\u2019s a living expression of everything your bar or bat mitzvah stands for.",
    },
  ],

  // How It Works
  howItWorksHeading: 'How It Works',
  howItWorksSubtitle: 'A clear, supportive process from start to finish.',
  steps: [
    {
      _key: 'step1',
      title: 'Get Started',
      description:
        "The very first step is to connect with the Jewmanity team so we can support you throughout your project. We\u2019ll pair you with a Jewmanity mentor, learn about your interests and strengths, and help you set a personal goal that feels right for you.",
    },
    {
      _key: 'step2',
      title: 'Learn',
      description:
        "You can\u2019t fight something you don\u2019t understand. Before you fundraise or volunteer, take time to learn about what antisemitism looks like in America right now, why it matters, and what Jewmanity is doing about it.",
    },
    {
      _key: 'step3',
      title: 'Choose Your Path',
      description:
        'Jewmanity offers three ways to make your mitzvah project meaningful. You can choose one, or combine them all for the biggest impact. Talk with your family and your Jewmanity mentor to decide what fits you best.',
    },
    {
      _key: 'step4',
      title: 'Fundraise',
      description:
        "If you\u2019ve chosen to fundraise, here is exactly how to do it. Your Jewmanity mentor will help you set up your fundraising page and create a compelling message that moves people to give.",
    },
    {
      _key: 'step5',
      title: 'Volunteer Experience',
      description:
        'One of the most unique and powerful parts of a Jewmanity mitzvah project is the opportunity to volunteer when Israeli and Jewish soldiers visit San Diego. This is a hands-on experience you can only get through Jewmanity \u2014 and it will stay with you forever.',
    },
    {
      _key: 'step6',
      title: 'Share Your Story',
      description:
        "Your project isn\u2019t complete until you\u2019ve shared what you\u2019ve learned and accomplished with the people who love you. This is your moment to inspire others \u2014 and to show that your bar or bat mitzvah stands for something bigger than a party.",
    },
    {
      _key: 'step7',
      title: 'Celebrate & Continue',
      description:
        'When your project is complete, Jewmanity will honor your commitment with a certificate of recognition \u2014 and we hope this is only the beginning of a lifetime of Jewish service and advocacy.',
    },
  ],

  // Choose Your Path
  pathsHeading: 'Choose Your Path',
  pathsSubtitle: 'Make an impact in the way that speaks to you \u2014 or combine all three.',
  paths: [
    {
      _key: 'pathA',
      icon: 'fundraise',
      title: 'Fundraise for Retreats',
      description:
        'Raise money to fund retreats for Jewish young people \u2014 experiences that build Jewish identity, resilience, and community during a time of rising antisemitism.',
      bullets: [
        'Set a fundraising goal (see suggested goals below)',
        'Create an online fundraising page',
        'Host a fundraising event',
        'Share your story with guests at your celebration',
      ],
    },
    {
      _key: 'pathB',
      icon: 'volunteer',
      title: 'Volunteer with Soldiers in San Diego',
      description:
        'When Israeli and Jewish soldiers visit San Diego, Jewmanity organizes volunteer experiences so you can meet, serve, and honor them directly.',
      bullets: [
        'Register as a volunteer with Jewmanity San Diego',
        'Help organize welcome events and meals',
        'Write personal letters to soldiers beforehand',
        'Document your experience for your mitzvah presentation',
      ],
    },
    {
      _key: 'pathC',
      icon: 'awareness',
      title: 'Raise Awareness',
      description:
        'Use your voice \u2014 in your school, synagogue, and online \u2014 to educate others about antisemitism and what they can do about it.',
      bullets: [
        'Give a presentation at your school or synagogue',
        'Create an informational display or poster series',
        'Write and share your personal story on social media',
        'Collect pledges from friends and family in exchange for awareness actions',
      ],
    },
  ],

  // Fundraising Goals
  goalsHeading: 'How Much Should I Raise?',
  goalsSubtitle:
    "Every dollar you raise makes a direct impact. Here are suggested fundraising tiers \u2014 choose what feels right for you, and remember: it\u2019s not about the amount, it\u2019s about the effort and the heart behind it.",
  goals: [
    {
      _key: 'tier1',
      amount: '$180',
      name: 'Chai Level',
      description: 'Chai (18) is the Hebrew number for life. A perfect starting goal \u2014 and deeply meaningful.',
    },
    {
      _key: 'tier2',
      amount: '$360',
      name: 'Double Chai',
      description: 'Double the life, double the impact. Achievable through family donations alone.',
    },
    {
      _key: 'tier3',
      amount: '$500',
      name: 'Rising Star',
      description: 'Covers supplies and materials for a Jewish youth retreat experience.',
    },
    {
      _key: 'tier4',
      amount: '$1,000',
      name: 'Champion',
      description: "Helps fund a full retreat scholarship for a Jewish young person who couldn\u2019t otherwise attend.",
    },
    {
      _key: 'tier5',
      amount: '$2,500',
      name: 'Leader',
      description: 'Funds programming and resources for an entire Jewmanity retreat cohort.',
    },
    {
      _key: 'tier6',
      amount: 'Custom',
      name: 'Your Goal',
      description: 'Set any goal that feels right for you. We celebrate every dollar and every effort, equally.',
    },
  ],

  // CTA
  ctaHeading: 'Ready to Begin Your Mitzvah Project?',
  ctaDescription:
    "Reach out to the Jewmanity team today. We\u2019d love to meet you, hear your story, and help you make your bar or bat mitzvah truly unforgettable.",
  ctaButton1Text: 'Start Your Project',
  ctaButton1Url: '/get-involved/contact',
  ctaButton2Text: 'Download Project Guide',
  ctaButton2Url: '/jewmanity-bar-bat-mitzvah-project.pdf',
};

async function main() {
  console.log('Seeding Mitzvah Project singleton into 9pc3wgri/production...\n');

  const existing = await client.fetch(`*[_id == "mitzvahProject"][0]._id`);

  if (existing) {
    console.log('Mitzvah Project document already exists. Replacing...');
    await client.delete('mitzvahProject');
  }

  const created = await client.createOrReplace(mitzvahProject);
  console.log(`Created: ${created._id}\n`);
  console.log('Done! Mitzvah Project page content seeded.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
