#!/usr/bin/env node
/**
 * Read-only audit of the published Sanity dataset for Jewmanity.
 *
 * No token required. Uses the same CDN-backed read endpoint the site uses
 * at build time (matches `useCdn: true` in src/lib/sanity.ts).
 *
 * Run from the repo root: `node scripts/verify-cms-state.mjs`
 *
 * Purpose: confirm which CMS fields are populated vs empty, so we can tell
 * the difference between "code gap" (page does not read the field) and
 * "content gap" (page reads the field but the field is empty in Sanity).
 *
 * Add new checks freely. Each check is a single GROQ projection; the result
 * is pretty-printed. Do not put secrets in here; this script intentionally
 * has no auth and queries only what is publicly visible on the site.
 */

const PROJECT = '9pc3wgri';
const DATASET = 'production';
const BASE = `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

async function runQuery(name, groq) {
  const url = `${BASE}?query=${encodeURIComponent(groq)}`;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    console.log(`== ${name}`);
    console.log(`  network error: ${err.message}`);
    console.log();
    return;
  }
  if (!res.ok) {
    console.log(`== ${name}`);
    console.log(`  HTTP ${res.status} ${res.statusText}`);
    console.log();
    return;
  }
  const body = await res.json();
  console.log(`== ${name}`);
  console.log(JSON.stringify(body.result, null, 2).replace(/^/gm, '  '));
  console.log();
}

const checks = [
  {
    name: 'Homepage: How We Help tiles (Belinda concern #1)',
    groq: `*[_type=="homepage"][0]{
      "heroImagePresent": defined(heroImage.asset),
      "programCardCount": count(howWeHelpPrograms),
      "programCardsWithImages": count(howWeHelpPrograms[defined(image.asset)]),
      "programCards": howWeHelpPrograms[]{
        title,
        "hasImage": defined(image.asset),
        "hasAlt": defined(alt) && alt != "",
        href
      },
      "donationTierCount": count(donationAmounts),
      "donationTiers": donationAmounts[]{amount, label},
      "statsCount": count(statsItems)
    }`,
  },
  {
    name: 'About Story: image and content state',
    groq: `*[_type=="aboutStory"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "heroHasCtas": count(hero.ctas) > 0,
      "storyParagraphCount": count(storyBody[_type=="block"]),
      "valuesCount": count(values),
      "valuesWithIcons": count(values[defined(icon)])
    }`,
  },
  {
    name: 'Fighting Antisemitism: per-section population (Belinda concern #3)',
    groq: `*[_type=="fightingAntisemitism"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "understandingBodyBlocks": count(understandingBody),
      "understandingStatsCount": count(understandingStats),
      "formsCardsCount": count(formsCards),
      "actionStepsCount": count(actionSteps),
      "organizationsCount": count(organizations),
      "organizations": organizations[]{name, "hasUrl": defined(url)},
      "ctaPrimary": ctaPrimaryButton.text,
      "ctaSecondary": ctaSecondaryButton.text
    }`,
  },
  {
    name: 'Recommended Articles collection (used on Fighting Antisemitism)',
    groq: `{
      "count": count(*[_type=="recommendedArticle"]),
      "titles": *[_type=="recommendedArticle"]|order(order asc){title, publication}
    }`,
  },
  {
    name: 'Heads Up singleton: section-by-section population',
    groq: `*[_type=="headsUp"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "supportCardsCount": count(supportCards),
      "experienceItemsCount": count(experienceItems),
      "carePillarsCount": count(carePillars),
      "includedItemsCount": count(includedItems),
      "impactStatsCount": count(impactStats)
    }`,
  },
  {
    name: 'Mitzvah Project singleton: section state',
    groq: `*[_type=="mitzvahProject"][0]{
      "heroImagePresent": defined(heroImage.asset),
      "impactCardsCount": count(impactCards),
      "stepsCount": count(steps),
      "pathsCount": count(paths),
      "goalsCount": count(goals)
    }`,
  },
  {
    name: 'Donate page singleton',
    groq: `*[_type=="donatePage"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "impactCardsCount": count(impactCards),
      "whyGiveValuesCount": count(whyGiveValues),
      "costBreakdownItemsCount": count(costBreakdownItems),
      "hasFaqContextField": defined(faqContext)
    }`,
  },
  {
    name: 'Volunteer page singleton',
    groq: `*[_type=="volunteerPage"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "howToHelpCardsCount": count(howToHelpCards),
      "impactStatsCount": count(impactStats),
      "hasFaqContextField": defined(faqContext)
    }`,
  },
  {
    name: 'Resources page singleton',
    groq: `*[_type=="resources"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "pillarsCount": count(advocacyPillars),
      "strugglesCount": count(commonStruggles),
      "signsCount": count(signs),
      "crisisResourcesByRegion": crisisResources[]{region, "count": count(items)},
      "disclaimerSet": defined(disclaimer) && disclaimer != ""
    }`,
  },
  {
    name: 'Shop page singleton',
    groq: `*[_type=="shopPage"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "impactIconsCount": count(impactIcons)
    }`,
  },
  {
    name: 'Contact page singleton',
    groq: `*[_type=="contactPage"][0]{
      "heroImagePresent": defined(hero.backgroundImage.asset),
      "otherWaysCardsCount": count(otherWaysCards)
    }`,
  },
  {
    name: 'Recipes collection',
    groq: `{
      "count": count(*[_type=="recipe"]),
      "withImages": count(*[_type=="recipe" && defined(image.asset)]),
      "recipes": *[_type=="recipe"]|order(orderRank){title, "slug": slug.current, "hasImage": defined(image.asset)}
    }`,
  },
  {
    name: 'Retreats collection',
    groq: `{
      "count": count(*[_type=="retreat"]),
      "withImages": count(*[_type=="retreat" && defined(coverImage.asset)]),
      "retreats": *[_type=="retreat"]|order(orderRank){title, "slug": slug.current, "hasImage": defined(coverImage.asset)}
    }`,
  },
  {
    name: 'Community Stories collection',
    groq: `{
      "count": count(*[_type=="communityStory"]),
      "stories": *[_type=="communityStory"]|order(orderRank){title, "slug": slug.current, "hasImage": defined(image.asset)}
    }`,
  },
  {
    name: 'Products collection (inStock field state)',
    groq: `{
      "count": count(*[_type=="product"]),
      "products": *[_type=="product"]|order(orderRank){name, price, inStock, "slug": slug.current}
    }`,
  },
  {
    name: 'Team Members collection',
    groq: `{
      "count": count(*[_type=="teamMember"]),
      "members": *[_type=="teamMember"]|order(orderRank){name, role, "hasPhoto": defined(photo.asset)}
    }`,
  },
  {
    name: 'Testimonials collection',
    groq: `{
      "count": count(*[_type=="testimonial"]),
      "byContext": *[_type=="testimonial"]{context}|{"context": context}
    }`,
  },
  {
    name: 'FAQ Items collection',
    groq: `{
      "count": count(*[_type=="faqItem"]),
      "byContext": *[_type=="faqItem"]{context}
    }`,
  },
  {
    name: 'Site Settings singleton',
    groq: `*[_type=="siteSettings"][0]{
      orgName,
      ein,
      footerTagline,
      copyrightText,
      "hasFacebook": defined(socialLinks.facebook),
      "hasInstagram": defined(socialLinks.instagram),
      "hasTwitter": defined(socialLinks.twitter),
      "hasLinkedin": defined(socialLinks.linkedin)
    }`,
  },
];

console.log(`Verifying Sanity ${PROJECT}/${DATASET} via CDN`);
console.log(`Endpoint: ${BASE}`);
console.log('');

for (const check of checks) {
  // eslint-disable-next-line no-await-in-loop
  await runQuery(check.name, check.groq);
}

console.log('Done.');
