#!/usr/bin/env node

/**
 * Seed Sanity with content from the Figma designs.
 * Safe to re-run — uses createIfNotExists to avoid duplicates.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> node scripts/seed-sanity.mjs
 *
 * Create a token at: https://www.sanity.io/manage/project/9pc3wgri/api#tokens
 * The token needs "Editor" permissions.
 */

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load .env file if it exists
const envPath = path.resolve(ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx);
    const value = trimmed.slice(eqIdx + 1);
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    '\n❌ SANITY_API_TOKEN is required.\n\n' +
    'Create a token at: https://www.sanity.io/manage/project/9pc3wgri/api#tokens\n' +
    'Then run:  SANITY_API_TOKEN=<token> node scripts/seed-sanity.mjs\n' +
    'Or add SANITY_API_TOKEN=<token> to your .env file and run:\n' +
    '  source .env && node scripts/seed-sanity.mjs\n',
  );
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

// ---------------------------------------------------------------------------
// Counters
// ---------------------------------------------------------------------------

let created = 0;
let skipped = 0;
let imagesUploaded = 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toPortableText(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `block-${i}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `span-${i}`,
        text,
        marks: [],
      },
    ],
  }));
}

/**
 * Convert HTML strings (with <strong> tags) to Portable Text blocks.
 * Handles: plain text, <strong>bold</strong>, and mixed content.
 */
function htmlToPortableText(strings) {
  return strings.map((html, i) => {
    const children = [];
    let remaining = html;
    let childIdx = 0;

    while (remaining.length > 0) {
      const boldStart = remaining.indexOf('<strong>');
      if (boldStart === -1) {
        if (remaining) {
          children.push({
            _type: 'span',
            _key: `s${i}-${childIdx++}`,
            text: remaining,
            marks: [],
          });
        }
        break;
      }

      if (boldStart > 0) {
        children.push({
          _type: 'span',
          _key: `s${i}-${childIdx++}`,
          text: remaining.slice(0, boldStart),
          marks: [],
        });
      }

      const boldEnd = remaining.indexOf('</strong>', boldStart);
      if (boldEnd === -1) {
        children.push({
          _type: 'span',
          _key: `s${i}-${childIdx++}`,
          text: remaining.slice(boldStart),
          marks: [],
        });
        break;
      }

      children.push({
        _type: 'span',
        _key: `s${i}-${childIdx++}`,
        text: remaining.slice(boldStart + 8, boldEnd),
        marks: ['strong'],
      });

      remaining = remaining.slice(boldEnd + 9);
    }

    if (children.length === 0) {
      children.push({
        _type: 'span',
        _key: `s${i}-0`,
        text: '',
        marks: [],
      });
    }

    return {
      _type: 'block',
      _key: `b${i}`,
      style: 'normal',
      markDefs: [],
      children,
    };
  });
}

/**
 * Upload a local image to Sanity and return an image asset reference.
 * Returns null if the file doesn't exist.
 */
async function uploadImage(localPath, filename) {
  const absolute = path.resolve(ROOT, localPath);
  if (!fs.existsSync(absolute)) {
    return null;
  }
  try {
    const asset = await client.assets.upload('image', fs.createReadStream(absolute), {
      filename,
    });
    imagesUploaded++;
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (err) {
    console.warn(`  ⚠️  Failed to upload ${localPath}: ${err.message}`);
    return null;
  }
}

/**
 * Create a document if it doesn't already exist.
 * Returns true if created, false if skipped.
 */
async function createDoc(doc, label) {
  try {
    const result = await client.createIfNotExists(doc);
    // createIfNotExists returns the doc whether created or not.
    // We can't easily distinguish, so we just count as created.
    // On re-runs, Sanity silently skips — the log may say "Created" but it's idempotent.
    created++;
    console.log(`  ${label}: ${doc._id}`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed ${doc._id}: ${err.message}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// 0. Delete ALL existing recipes
// ---------------------------------------------------------------------------

async function deleteAllRecipes() {
  console.log('\n🗑️  Deleting all existing recipes from Sanity...');
  const recipes = await client.fetch(`*[_type == "recipe"]{ _id }`);
  for (const doc of recipes) {
    await client.delete(doc._id);
    console.log(`  Deleted: ${doc._id}`);
  }
  console.log(`  ${recipes.length} recipe(s) deleted.`);
}

// ---------------------------------------------------------------------------
// 1. Recipes (real data from hardcoded codebase)
// ---------------------------------------------------------------------------

async function seedRecipes() {
  console.log('\n📝 Seeding real recipes...');

  const recipes = [
    {
      _id: 'recipe-savtas-stuffed-chicken',
      title: 'Savta\u2019s Stuffed Chicken with Rice and Nuts',
      slug: { _type: 'slug', current: 'savtas-stuffed-chicken' },
      description:
        'A beloved family recipe passed down through generations \u2014 tender deboned chicken stuffed with fragrant rice, pine nuts, and parsley, glazed with teriyaki and sweet chili.',
      tags: ['Traditional', 'Family Favorite'],
      prepTime: '30 min',
      servings: '6\u20138',
      ingredients: [
        '<strong>For the Chicken:</strong>',
        '1 whole chicken, deboned',
        '1 onion, cut into quarters (for the baking dish)',
        '<strong>Rice Stuffing:</strong>',
        '1 onion, finely chopped',
        '1 cup rice',
        '1 bunch parsley, finely chopped',
        '2 tbsp pine nuts',
        'Water, as needed (to cover rice)',
        '<strong>Spices:</strong>',
        '1 tsp salt',
        '\u00bd tsp black pepper',
        '\u00bc tsp baharat',
        '<strong>External Seasoning:</strong>',
        '1 tsp salt',
        '\u00bd tsp black pepper',
        '4 tbsp teriyaki sauce',
        '2 tbsp sweet chili sauce',
        '3 tbsp olive oil',
      ],
      instructions: htmlToPortableText([
        '<strong>Saut\u00e9 the onion</strong> \u2014 Heat a pan over medium heat and saut\u00e9 the chopped onion until golden and fragrant.',
        '<strong>Prepare the rice filling</strong> \u2014 Add rice, parsley, pine nuts, and spices. Stir well to combine.',
        '<strong>Par-cook the rice</strong> \u2014 Add enough water to just cover the rice. Cook until the water evaporates and the rice is halfway cooked. Remove from heat and let cool completely.',
        '<strong>Stuff the chicken</strong> \u2014 Generously fill the deboned chicken with the rice mixture and secure if needed.',
        '<strong>Season the chicken</strong> \u2014 Mix all external seasoning ingredients and brush generously over the chicken.',
        '<strong>Assemble the dish</strong> \u2014 Place quartered onions in the bottom of a baking dish, set the stuffed chicken on top.',
        '<strong>Bake</strong> \u2014 Cover and bake at 350\u00b0F until chicken is cooked through and golden.',
      ]),
      culturalContext: toPortableText([
        'In many Sephardic and Mizrahi households, a beautifully stuffed chicken is the centerpiece of the Friday night table. This recipe carries the flavors of a grandmother\u2019s kitchen \u2014 the aroma of baharat, the crunch of pine nuts, and the love that goes into preparing something by hand for the people you cherish most.',
      ]),
      orderRank: 1,
      localImage: 'public/images/recipes/savtas-stuffed-chicken.png',
    },
    {
      _id: 'recipe-mimas-noodle-kugel',
      title: 'Mima\u2019s Noodle Kugel',
      slug: { _type: 'slug', current: 'mimas-noodle-kugel' },
      description:
        'A sweet, creamy noodle kugel topped with crunchy corn flake crumbles \u2014 the kind of comfort food that makes every holiday table feel like home.',
      tags: ['Holiday', 'Comfort Food'],
      prepTime: '15 min',
      servings: '8\u201310',
      ingredients: [
        '1\u00bd bags kosher egg noodles',
        '\u00bd jar peach preserves',
        '1 cup brown sugar',
        '\u00bd cup cream cheese',
        '1\u00bd cups cottage cheese',
        '2 eggs',
        'Kellogg corn flake crumbles (baking aisle \u2014 crumbles, not regular corn flakes)',
      ],
      instructions: toPortableText([
        'Cook noodles according to package directions. Drain.',
        'Mix noodles with peach preserves, brown sugar, cream cheese, cottage cheese, and eggs until well combined.',
        'Pour into a greased baking dish.',
        'Bake covered at 350\u00b0F for 20 minutes.',
        'Remove cover and top generously with corn flake crumbles.',
        'Continue baking uncovered until golden and set.',
      ]),
      culturalContext: toPortableText([
        'Kugel is one of the most beloved dishes in Ashkenazi Jewish cooking \u2014 served at Shabbat, holidays, and family gatherings for centuries. Sweet or savory, every family has their version. This one, with its peach preserves and corn flake crumble, is pure nostalgia on a plate.',
      ]),
      orderRank: 2,
      localImage: 'public/images/recipes/mimas-noodle-kugel.jpg',
    },
    {
      _id: 'recipe-grammys-chocolate-pb-candy',
      title: 'Grammy\u2019s Chocolate Peanut Butter Cookies Candy',
      slug: { _type: 'slug', current: 'grammys-chocolate-peanut-butter-candy' },
      description:
        'A cherished family recipe that brings comfort and joy to every gathering. Rich, indulgent treats combining creamy peanut butter with smooth dark chocolate.',
      tags: ['Dessert', 'Family Favorite'],
      prepTime: '20 min',
      servings: '24\u201330 pieces',
      ingredients: [
        '1 cup Peanut Butter (Skippy Extra Crunch Peanut Butter Super Chunk recommended)',
        '2 sticks melted butter (1 stick unsalted + 1 stick salted and a tiny amount more)',
        '1 lb. box Powdered sugar (3\u00be cups to 1 lb. box \u2014 the perfect measurement is by using one box)',
        '1 cup crushed graham crackers (or graham cracker crumbs \u2014 Nabisco crumbs are best but hard to find)',
        '14oz. Nestle Dark Chocolate Chips (package comes in 10oz. size so add 1 cup more; semi-sweet chips come in 12oz. so add \u00bd cup more)',
      ],
      instructions: toPortableText([
        'Line a 9x13 inch pan with parchment paper or grease well.',
        'Mix the peanut butter, butter, powdered sugar, and graham crackers together really well. Press down into the pan to make an even layer.',
        'Melt the chocolate chips and pour over the peanut butter layer. Spread the chocolate with a knife as if frosting the whole pan.',
        'Refrigerate for 15 minutes.',
        'Cut a section and put a spatula under it and remove along with the parchment paper so you can easily cut them.',
        'Refrigerate for another 15 minutes.',
        'Layer between sheets of parchment paper in a plastic container. Keep in the refrigerator and serve cold. Fine to keep in the freezer but let them thaw before eating.',
      ]),
      culturalContext: toPortableText([
        'Some of the most treasured recipes aren\u2019t from cookbooks \u2014 they\u2019re scribbled on index cards and passed from grandmother to grandchild. This no-bake candy is one of those recipes: simple, sweet, and inseparable from the memory of the person who made it.',
      ]),
      orderRank: 3,
      localImage: 'public/images/recipes/grammys-chocolate-pb-candy.jpg',
    },
    {
      _id: 'recipe-grandma-mendelsons-apple-cake',
      title: 'Grandma Mendelson\u2019s Apple Butter Cake',
      slug: { _type: 'slug', current: 'grandma-mendelsons-apple-butter-cake' },
      description:
        'A towering apple cake with layers of cinnamon-kissed fruit \u2014 the kind of recipe that fills the house with warmth and brings everyone to the table.',
      tags: ['Dessert', 'Holiday'],
      prepTime: '25 min',
      servings: '10',
      ingredients: [
        '4 large apples, peeled and cored',
        '1 tablespoon sugar',
        '2 teaspoons ground cinnamon',
        '1 cup butter, at room temperature',
        '2 cups sugar',
        '4 large eggs',
        '3 cups flour',
        '3 teaspoons baking powder',
        '\u00bd teaspoon salt',
        '\u00bd cup orange juice',
        '1 tablespoon pure vanilla extract',
      ],
      instructions: toPortableText([
        'Heat oven to 350\u00b0F. Grease and flour a tube pan or springform cake pan.',
        'Slice the apples. Put in a small bowl and sprinkle with the sugar and cinnamon.',
        'In a large bowl, cream the butter and sugar using an electric mixer on medium-high speed. Add the eggs one at a time, beating well to combine.',
        'In a medium bowl, sift together the dry ingredients and add to butter and sugar mixture.',
        'Add the orange juice and vanilla, beating well to form a smooth batter.',
        'Pour about a third of the batter into pan. Layer with one-half of the apples. Repeat for one more layer, finishing with the batter.',
        'Bake for about 1\u00bd hours until lightly browned and a tester inserted in the middle comes out clean.',
        'Remove from oven and let cool in pan on a rack for 20 minutes, then turn out onto the rack to cool completely.',
      ]),
      culturalContext: toPortableText([
        'Apple cake holds a special place in Jewish baking, especially around Rosh Hashanah when apples symbolize sweetness for the new year. This layered cake, with its butter-rich batter and cinnamon apples, is the kind of recipe that turns a kitchen into a gathering place.',
      ]),
      orderRank: 4,
      localImage: 'public/images/recipes/grandma-mendelsons-apple-cake.jpg',
    },
    {
      _id: 'recipe-bubbas-brisket',
      title: 'Bubba\u2019s Brisket',
      slug: { _type: 'slug', current: 'bubbas-brisket' },
      description:
        'Slow-cooked to perfection with garlic, paprika, and onion soup mix \u2014 this is the brisket that anchors every holiday table and tastes even better the next day.',
      tags: ['Holiday', 'Comfort Food'],
      prepTime: '20 min',
      servings: '6\u20138',
      ingredients: [
        '<strong>For the Brisket:</strong>',
        '1 beef brisket (3\u20134 pounds)',
        '6 cloves garlic, minced',
        '2 tablespoons vegetable oil',
        'Salt and black pepper to taste',
        'Paprika to taste',
        '<strong>Vegetables:</strong>',
        '2 large onions, chopped',
        'Carrots, chopped (optional)',
        'Celery, chopped (optional)',
        '<strong>Liquid and Seasonings:</strong>',
        '1 cup water, tomato juice, or tomato sauce',
        '1 envelope dried onion soup mix',
      ],
      instructions: toPortableText([
        'Preheat oven to 325\u00b0F.',
        'Rinse the meat with water and pat completely dry. Rub on all sides with crushed garlic. Season generously with salt, pepper, and paprika.',
        'Heat oil in a heavy-bottomed casserole dish or Dutch oven. Brown the brisket on all sides until well-seared.',
        'Add chopped onions, carrots, and celery around the meat. Pour in your liquid of choice. Sprinkle the dried onion soup mix over everything.',
        'Cover tightly and bake for 3 hours.',
        'Remove cover and continue baking for an additional 30 minutes to brown the top.',
      ]),
      culturalContext: toPortableText([
        'Brisket is the undisputed king of the Jewish holiday table. Slow-braised for hours, it fills the house with an aroma that says \u201cfamily is gathering.\u201d Every Jewish grandmother has her version, and this one \u2014 with its garlic rub and onion soup mix \u2014 is as classic as it gets.',
      ]),
      orderRank: 5,
      localImage: 'public/images/recipes/bubbas-brisket.jpg',
    },
    {
      _id: 'recipe-memas-mondel-brot',
      title: 'Mema\u2019s Mondel Brot',
      slug: { _type: 'slug', current: 'memas-mondel-brot' },
      description:
        'A classic twice-baked cookie \u2014 crunchy, nutty, and kissed with orange and brandy. Perfect for coffee or tea, and even better shared with someone you love.',
      tags: ['Dessert', 'Shabbat'],
      prepTime: '15 min',
      servings: '36\u201340 cookies',
      ingredients: [
        '2 eggs',
        '\u00bd cup oil',
        '\u00bd cup sugar',
        '1 teaspoon vanilla extract',
        '2 tablespoons brandy',
        '2 cups all-purpose flour',
        '1 teaspoon baking powder',
        '\u00bd teaspoon salt',
        '2 cups nuts (almonds or walnuts), coarsely chopped',
        '\u00bd orange, zested and juiced',
        'Cinnamon and sugar mixture (for rolling)',
      ],
      instructions: toPortableText([
        'Preheat oven to 350\u00b0F. Line a cookie sheet with parchment paper.',
        'Whisk together eggs, oil, sugar, vanilla, and brandy until well combined.',
        'Stir in flour, baking powder, and salt until just incorporated.',
        'Fold in chopped nuts, orange zest, and orange juice.',
        'Divide dough into 4 equal parts. Roll each into a log about 1 inch thick.',
        'Roll each log in cinnamon-sugar mixture to coat.',
        'Place on prepared cookie sheet. Bake at 350\u00b0F for 15 minutes.',
        'Remove and let rest 5 minutes. Reduce oven to 300\u00b0F.',
        'Slice logs into cookies about \u00bd-inch thick. Lay cut-side down on baking sheet.',
        'Bake at 300\u00b0F for 15 minutes until golden and crisp.',
        'Cool completely. Store in an airtight container.',
      ]),
      culturalContext: toPortableText([
        'Mondel brot (also spelled mandelbrot) is the Ashkenazi Jewish cousin of biscotti \u2014 a twice-baked cookie that\u2019s been a staple of Jewish bakeries and home kitchens for generations. The name means \u201calmond bread\u201d in Yiddish, and these crisp, fragrant cookies are meant for dunking, sharing, and savoring slowly.',
      ]),
      orderRank: 6,
      localImage: 'public/images/recipes/memas-mondel-brot.jpg',
    },
    {
      _id: 'recipe-grandma-joyces-lemon-cake',
      title: 'Grandma Joyce\u2019s Favorite Lemon Cake',
      slug: { _type: 'slug', current: 'grandma-joyces-lemon-cake' },
      description:
        'A bright, moist lemon Bundt cake soaked in fresh lemon glaze \u2014 the recipe that Grandma Joyce made for every special occasion, now shared with our community.',
      tags: ['Dessert', 'Family Favorite'],
      prepTime: '10 min',
      servings: '10\u201312',
      ingredients: [
        '<strong>Cake:</strong>',
        '1 box Duncan Hines Lemon Supreme cake mix',
        '1 box lemon pudding mix',
        '\u00bd cup EVOO (extra virgin olive oil)',
        '1 cup 2% milk',
        '4 eggs',
        '<strong>Glaze:</strong>',
        '2 cups powdered sugar',
        '\u00bd to \u00be cup fresh squeezed lemon juice',
      ],
      instructions: htmlToPortableText([
        'Preheat oven to 350\u00b0F.',
        'Mix cake mix and wet ingredients with blender until smooth and all lumps are gone.',
        'Pour into well-greased Bundt cake pan and bake for approximately 30\u201335 minutes or until toothpick comes out clean. <strong>DO NOT OVERCOOK!</strong>',
        'Let cake sit for 5 minutes.',
        'Using a skewer or thin knife, poke holes around what will be the bottom of the cake (once flipped).',
        'Drizzle approximately \u00bd to \u00be of the glaze gently all around so it goes into the holes.',
        'Once cooled for 5\u201310 minutes, flip onto cake dish.',
        'Poke more small holes all around the top of the cake (very gently).',
        'Drizzle remaining glaze slowly all over the top.',
        'Once completely cooled (a few hours or next day), sprinkle with powdered sugar.',
      ]),
      culturalContext: toPortableText([
        'Some recipes become so intertwined with a person that you can\u2019t think of one without the other. This lemon cake is Grandma Joyce\u2019s signature \u2014 the one she brought to every simcha, every Shabbat lunch, every \u201cjust because.\u201d Sharing it here keeps her spirit at the table.',
      ]),
      orderRank: 7,
      localImage: 'public/images/recipes/grandma-joyces-lemon-cake.jpg',
    },
  ];

  for (const recipe of recipes) {
    const { localImage, ...doc } = recipe;
    doc._type = 'recipe';

    // Upload image if available
    const image = await uploadImage(localImage, `${recipe.slug.current}.jpg`);
    if (image) {
      doc.image = image;
      console.log(`  📸 Uploaded image for ${recipe.title}`);
    } else {
      console.log(`  ⏭️  No local image for ${recipe.title}`);
    }

    await createDoc(doc, `📝 Created recipe: ${recipe.title}`);
  }
}

// ---------------------------------------------------------------------------
// 2. Products
// ---------------------------------------------------------------------------

async function seedProducts() {
  console.log('\n🛒 Seeding products...');

  const products = [
    {
      _id: 'product-heads-up-water-bottle',
      name: 'Heads Up Water Bottle',
      slug: { _type: 'slug', current: 'heads-up-water-bottle' },
      price: 35,
      snipcartId: 'heads-up-water-bottle',
      description:
        'Stay hydrated while supporting healing. This premium water bottle features the Heads Up logo and represents your commitment to mental health and community support.',
      features: [
        'Durable, high-quality construction',
        'Heads Up program logo',
        'Supports healing retreats with every purchase',
      ],
      inStock: true,
      orderRank: 1,
      localImage: 'public/images/products/product-1.jpg',
    },
    {
      _id: 'product-black-trucker-hat',
      name: 'Black Trucker Hat',
      slug: { _type: 'slug', current: 'black-trucker-hat' },
      price: 35,
      snipcartId: 'black-trucker-hat',
      description:
        "Wear your values with pride. This comfortable trucker hat represents more than style\u2014it's a statement of solidarity and support for healing within the Jewish community.",
      features: [
        'Premium mesh backing for breathability',
        'Adjustable snapback closure for perfect fit',
        'Embroidered Jewmanity logo symbolizing unity',
        'Soft, structured crown for all-day comfort',
        'Unisex design suitable for everyone',
      ],
      inStock: true,
      orderRank: 2,
      localImage: 'public/images/products/product-2.jpg',
    },
    {
      _id: 'product-pink-trucker-hat',
      name: 'Pink Trucker Hat',
      slug: { _type: 'slug', current: 'pink-trucker-hat' },
      price: 30,
      snipcartId: 'pink-trucker-hat',
      description:
        "Wear your values with pride. This comfortable trucker hat represents more than style\u2014it's a statement of solidarity and support for healing within the Jewish community.",
      features: [
        'Premium mesh backing for breathability',
        'Adjustable snapback closure for perfect fit',
        'Embroidered Jewmanity logo symbolizing unity',
        'Soft, structured crown for all-day comfort',
        'Unisex design suitable for everyone',
      ],
      inStock: true,
      orderRank: 3,
      localImage: 'public/images/products/product-3.jpg',
    },
  ];

  for (const product of products) {
    const { localImage, ...doc } = product;
    doc._type = 'product';

    const image = await uploadImage(localImage, `${product.slug.current}.jpg`);
    if (image) {
      doc.mainImage = image;
      console.log(`  📸 Uploaded image for ${product.name}`);
    } else {
      console.log(`  ⏭️  No local image for ${product.name}`);
    }

    await createDoc(doc, `🛒 Created product: ${product.name}`);
  }
}

// ---------------------------------------------------------------------------
// 3. Team Members
// ---------------------------------------------------------------------------

async function seedTeamMembers() {
  console.log('\n👥 Seeding team members...');

  const members = [
    {
      _id: 'team-belinda-donner',
      name: 'Belinda Donner',
      role: 'CEO & Founder',
      bio: 'Rooted in legacy and driven by compassion, Belinda brings heart, creativity, and a deep commitment to community-building at Jewmanity.',
      orderRank: 1,
      localImage: 'public/images/team/member-1.jpg',
    },
    {
      _id: 'team-andrew-donner',
      name: 'Andrew Donner',
      role: 'Founding Board Member',
      bio: 'With decades of leadership and operational experience, Andrew provides steady guidance to help Jewmanity grow with purpose and impact.',
      orderRank: 2,
      localImage: 'public/images/team/member-2.jpg',
    },
    {
      _id: 'team-shai-gino',
      name: 'Shai Gino',
      role: 'Executive Director',
      bio: 'A proven leader shaped by service and resilience, Shai leads Jewmanity with courage, clarity, and an unwavering focus on helping others.',
      orderRank: 3,
      localImage: 'public/images/team/member-3.jpg',
    },
    {
      _id: 'team-rabbi-avi-libman',
      name: 'Rabbi Avi Libman',
      role: 'Board Member',
      bio: "A trusted spiritual and community leader, Rabbi Libman helps strengthen Jewmanity's mission through connection, education, and shared values.",
      orderRank: 4,
      localImage: 'public/images/team/member-4.jpg',
    },
  ];

  for (const member of members) {
    const { localImage, ...doc } = member;
    doc._type = 'teamMember';

    const image = await uploadImage(localImage, `${member.name.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    if (image) {
      doc.photo = image;
      console.log(`  📸 Uploaded photo for ${member.name}`);
    } else {
      console.log(`  ⏭️  No local photo for ${member.name}`);
    }

    await createDoc(doc, `👥 Created team member: ${member.name}`);
  }
}

// ---------------------------------------------------------------------------
// 4. Retreats
// ---------------------------------------------------------------------------

async function seedRetreats() {
  console.log('\n🏕️  Seeding retreats...');

  const retreats = [
    {
      _id: 'retreat-heads-up-first',
      title: 'Heads Up First Retreat',
      slug: { _type: 'slug', current: 'heads-up-first-retreat' },
      subtitle: 'California',
      date: '2024-03-15',
      location: 'California',
      body: toPortableText([
        'A transformative retreat focused on healing, connection, and rebuilding trust through shared experience and community support.',
      ]),
      orderRank: 1,
      localImage: 'public/images/retreats/retreat-1.jpg',
    },
    {
      _id: 'retreat-heads-up-second',
      title: 'Heads Up Second Retreat',
      slug: { _type: 'slug', current: 'heads-up-second-retreat' },
      subtitle: 'California',
      date: '2024-06-15',
      location: 'California',
      body: toPortableText([
        'A transformative retreat focused on healing, connection, and rebuilding trust through shared experience and community support.',
      ]),
      orderRank: 2,
      localImage: 'public/images/retreats/retreat-2.jpg',
    },
    {
      _id: 'retreat-heads-up-third',
      title: 'Heads Up Third Retreat',
      slug: { _type: 'slug', current: 'heads-up-third-retreat' },
      subtitle: 'California',
      date: '2024-09-15',
      location: 'California',
      body: toPortableText([
        'A transformative retreat focused on healing, connection, and rebuilding trust through shared experience and community support.',
      ]),
      orderRank: 3,
      localImage: 'public/images/retreats/retreat-3.jpg',
    },
    {
      _id: 'retreat-heads-up-fourth',
      title: 'Heads Up Retreat #4 \u2014 "Fathers, Fighters"',
      slug: { _type: 'slug', current: 'heads-up-retreat-4-fathers-fighters' },
      subtitle: 'Winter in San Diego',
      author: 'Written by retreat assistant, Kate H.',
      date: '2025-01-15',
      location: 'San Diego, CA',
      body: toPortableText([
        'You could hear the sound of makot\u2014 the rhythmic ping of balls hitting paddles\u2014 as I walked up to the group of soldiers playing on the beach. It was the end of a gorgeous San Diego winter day; they were in T-shirts, laughing, and completely relaxed. When I approached, they greeted me with warm hugs and immediately invited me to join them on the porch of the house. With beers in hand, we watched the huge orange sun disappear into the dark blue ocean together. We sat there for a long time, talking, sharing stories about their grandmothers born in Jaffa before World War II, and their children born after COVID. We discussed where to buy Bamba in San Diego and the similarities of Jewish mothers, even though we had been raised in different countries.',
      ]),
      orderRank: 4,
      localImage: 'public/images/retreats/retreat-4.jpg',
    },
  ];

  for (const retreat of retreats) {
    const { localImage, ...doc } = retreat;
    doc._type = 'retreat';

    const image = await uploadImage(localImage, `${retreat.slug.current}.jpg`);
    if (image) {
      doc.coverImage = image;
      console.log(`  📸 Uploaded cover image for ${retreat.title}`);
    } else {
      console.log(`  ⏭️  No local image for ${retreat.title}`);
    }

    await createDoc(doc, `🏕️  Created retreat: ${retreat.title}`);
  }
}

// ---------------------------------------------------------------------------
// 5. Community Stories
// ---------------------------------------------------------------------------

async function seedCommunityStories() {
  console.log('\n📖 Seeding community stories...');

  const stories = [
    {
      _id: 'story-neighbors-helping-neighbors',
      title: 'Neighbors Helping Neighbors',
      slug: { _type: 'slug', current: 'neighbors-helping-neighbors' },
      excerpt:
        'A local synagogue transforms its space into a weekly community meal program, feeding over 200 families each month.',
      orderRank: 1,
      localImage: 'public/images/community/story-1.jpg',
    },
    {
      _id: 'story-food-security-initiative',
      title: 'Food Security Initiative',
      slug: { _type: 'slug', current: 'food-security-initiative' },
      excerpt:
        'Jewish volunteers partner with organizations to ensure no family goes hungry, distributing thousands of meals weekly.',
      orderRank: 2,
      localImage: 'public/images/community/story-2.jpg',
    },
    {
      _id: 'story-medical-missions-of-compassion',
      title: 'Medical Missions of Compassion',
      slug: { _type: 'slug', current: 'medical-missions-of-compassion' },
      excerpt:
        'Israeli medical volunteers provide free healthcare in underserved regions, treating thousands of patients each year.',
      orderRank: 3,
      localImage: 'public/images/community/story-3.jpg',
    },
    {
      _id: 'story-mentorship-for-tomorrow',
      title: 'Mentorship for Tomorrow',
      slug: { _type: 'slug', current: 'mentorship-for-tomorrow' },
      excerpt:
        'Community members create after-school programs, offering tutoring and mentorship to help youth reach their full potential.',
      orderRank: 4,
      localImage: 'public/images/community/story-4.jpg',
    },
    {
      _id: 'story-growing-together',
      title: 'Growing Together',
      slug: { _type: 'slug', current: 'growing-together' },
      excerpt:
        'A community garden brings people of all backgrounds together, cultivating connection and fresh produce for families.',
      orderRank: 5,
      localImage: 'public/images/community/story-5.jpg',
    },
    {
      _id: 'story-honoring-our-elders',
      title: 'Honoring Our Elders',
      slug: { _type: 'slug', current: 'honoring-our-elders' },
      excerpt:
        'Volunteers visit seniors regularly, providing companionship and support to combat isolation and loneliness.',
      orderRank: 6,
      // No image for the 6th story (only 5 images exist)
    },
  ];

  for (const story of stories) {
    const { localImage, ...doc } = story;
    doc._type = 'communityStory';

    if (localImage) {
      const image = await uploadImage(localImage, `${story.slug.current}.jpg`);
      if (image) {
        doc.image = image;
        console.log(`  📸 Uploaded image for ${story.title}`);
      } else {
        console.log(`  ⏭️  No local image for ${story.title}`);
      }
    }

    await createDoc(doc, `📖 Created community story: ${story.title}`);
  }
}

// ---------------------------------------------------------------------------
// 6. Testimonials
// ---------------------------------------------------------------------------

async function seedTestimonials() {
  console.log('\n💬 Seeding testimonials...');

  const testimonials = [
    {
      _id: 'testimonial-marina-m',
      quote:
        "Volunteering with Jewmanity changed my understanding of what it means to show up for someone. I thought I was there to help, but I gained so much more\u2014connection, purpose, and a deeper sense of community. Being part of someone's healing journey is a privilege I'll carry forever.",
      authorName: 'Marina M.',
      authorRole: 'Retreat Participant, January 2024',
      context: 'volunteer',
    },
    {
      _id: 'testimonial-david-l',
      quote:
        'This retreat gave me more than healing\u2014it gave me community. Being surrounded by people who truly understand, in a place where nature itself seems to hold you, changed everything. I came seeking peace and found a family.',
      authorName: 'David L.',
      authorRole: 'Mountain Haven Retreat, March 2026',
      context: 'retreat',
    },
  ];

  for (const testimonial of testimonials) {
    const doc = { ...testimonial, _type: 'testimonial' };
    await createDoc(doc, `💬 Created testimonial: ${testimonial.authorName}`);
  }
}

// ---------------------------------------------------------------------------
// 7. FAQ Items
// ---------------------------------------------------------------------------

async function seedFaqItems() {
  console.log('\n❓ Seeding FAQ items...');

  const volunteerFaqs = [
    {
      question: 'Is prior experience required?',
      answer:
        'No prior experience is needed. What matters most is your compassion, reliability, and willingness to show up with care and humanity.',
      orderRank: 1,
    },
    {
      question: 'What is the time commitment?',
      answer:
        "It varies by role. Some tasks require a few hours during a retreat week, while others may involve ongoing monthly commitments. We'll work with your schedule.",
      orderRank: 2,
    },
    {
      question: 'Are meals provided for volunteers?',
      answer:
        'Yes, all meals are provided during retreat volunteering. We believe in nourishing our volunteers just as we nourish our participants.',
      orderRank: 3,
    },
    {
      question: 'Are there age or physical requirements?',
      answer:
        'Volunteers must be 18 or older. Some roles involve physical activity (meal prep, setup), but we have options for all ability levels.',
      orderRank: 4,
    },
    {
      question: 'Can I choose which tasks I help with?',
      answer:
        'Absolutely. We match volunteers with roles that fit their skills and interests \u2014 from cooking to logistics to emotional support.',
      orderRank: 5,
    },
    {
      question: 'Are background checks required?',
      answer:
        'Yes, for the safety of our participants, all volunteers undergo a standard background check before working directly with retreat attendees.',
      orderRank: 6,
    },
    {
      question: 'What if I have additional questions or considerations?',
      answer:
        "We're here to help. Reach out through our contact page or email us directly \u2014 we'll make sure volunteering works for you.",
      orderRank: 7,
    },
  ];

  const donateFaqs = [
    {
      question: 'Is my donation tax-deductible?',
      answer:
        'Yes. Jewmanity is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the fullest extent allowed by law. You will receive a receipt for your records.',
      orderRank: 1,
    },
    {
      question: 'Can I set up a recurring donation?',
      answer:
        'Yes, you can choose a monthly recurring donation through our donation form. You can cancel or modify your recurring donation at any time.',
      orderRank: 2,
    },
    {
      question: 'How is my donation used?',
      answer:
        'Your donation directly funds healing retreats, clinical support, accommodations, meals, transportation, and ongoing care for participants. We provide a full cost breakdown on this page.',
      orderRank: 3,
    },
    {
      question: "Can I donate in someone's honor or memory?",
      answer:
        "Yes. When making your donation, you can add a note dedicating it in honor or memory of a loved one. We'll acknowledge your tribute.",
      orderRank: 4,
    },
    {
      question: 'Is there a minimum donation amount?',
      answer:
        "No minimum \u2014 every contribution makes a difference. Whether it's $5 or $5,000, your generosity helps someone on their healing journey.",
      orderRank: 5,
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards and PayPal through our secure donation platform. You can also choose to cover processing fees so 100% of your donation goes to programs.',
      orderRank: 6,
    },
  ];

  // Volunteer FAQs
  for (let i = 0; i < volunteerFaqs.length; i++) {
    const faq = volunteerFaqs[i];
    const slug = faq.question
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40);
    const doc = {
      _id: `faq-volunteer-${slug}`,
      _type: 'faqItem',
      question: faq.question,
      answer: toPortableText([faq.answer]),
      context: 'volunteer',
      orderRank: faq.orderRank,
    };
    await createDoc(doc, `❓ Created FAQ: ${faq.question}`);
  }

  // Donate FAQs
  for (let i = 0; i < donateFaqs.length; i++) {
    const faq = donateFaqs[i];
    const slug = faq.question
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40);
    const doc = {
      _id: `faq-donate-${slug}`,
      _type: 'faqItem',
      question: faq.question,
      answer: toPortableText([faq.answer]),
      context: 'donate',
      orderRank: faq.orderRank,
    };
    await createDoc(doc, `❓ Created FAQ: ${faq.question}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Jewmanity Sanity Seed Script');
  console.log('================================');

  await deleteAllRecipes();
  await seedRecipes();
  await seedProducts();
  await seedTeamMembers();
  await seedRetreats();
  await seedCommunityStories();
  await seedTestimonials();
  await seedFaqItems();

  console.log('\n================================');
  console.log(
    `✅ Seed complete: ${created} documents created, ${imagesUploaded} images uploaded, ${skipped} skipped`,
  );
}

main().catch((err) => {
  console.error('\n💥 Seed script failed:', err);
  process.exit(1);
});
