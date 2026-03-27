import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const products = [
  {
    name: 'Heads Up Signature Water Bottle',
    slug: 'heads-up-water-bottle',
    snipcartId: 'heads-up-water-bottle',
    price: 35,
    description: 'Black Owala Freesip\u00ae Twist water bottle with the Heads Up logo. 100% of proceeds directly support Jewmanity\'s initiatives.',
    features: [
      'Owala Freesip\u00ae Twist design for easy drinking',
      'Heads Up logo representing healing and resilience',
      'Insulated to keep drinks cold',
      'BPA-free and dishwasher safe',
      '100% of proceeds support Jewmanity programs',
    ],
    mainImageUrl: 'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/a944ca0a-76d4-4e45-bbf7-62c009b256aa/Untitled+design.png',
    galleryUrls: [],
    orderRank: 1,
  },
  {
    name: 'Black Trucker Hat',
    slug: 'black-trucker-hat',
    snipcartId: 'black-trucker-hat',
    price: 30,
    description: 'Embrace style and significance with our Black Trucker Hat, featuring a vibrant dove emblem. Perfect for making a statement while staying comfortable.',
    features: [
      'Classic trucker hat style with breathable mesh back',
      'Stylish blue dove design symbolizing peace and unity',
      'Adjustable snapback closure for a custom fit',
      'Free shipping included',
    ],
    mainImageUrl: 'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/3d617a78-3b29-4f21-81c0-c01d5d4c22e5/B650983D-2C07-43B1-9C02-5CCF450BB7C5.png',
    galleryUrls: [
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/43bb22a1-8ca5-4023-b349-f9204447baf7/IMG_0127.jpeg',
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/076907c1-e173-4ad3-b22b-aee9936caac4/IMG_9894.jpeg',
    ],
    orderRank: 2,
  },
  {
    name: 'Pink Trucker Hat',
    slug: 'pink-trucker-hat',
    snipcartId: 'pink-trucker-hat',
    price: 30,
    description: 'Stand out in style and make a statement with the Jewmanity Logo Hat. Designed for comfort and impact, this hat is perfect for those who value both fashion and ideals.',
    features: [
      'Mesh backing for breathability',
      'Adjustable strap for a custom fit',
      'Bold Jewmanity logo design',
      'Free shipping included',
    ],
    mainImageUrl: 'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/cc8528de-91c2-4c0c-ab97-53826094e065/D3520DDE-D501-4B55-A971-AFECE89450DC.png',
    galleryUrls: [
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/817e7893-f571-44a8-bad0-038e72767eaa/IMG_7537.jpeg',
      'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/fbb89958-c458-4414-b5a4-a31694cca1ac/IMG_9232.jpeg',
    ],
    orderRank: 3,
  },
  {
    name: 'Travel Shabbat Candle Set',
    slug: 'travel-shabbat-candle-set',
    snipcartId: 'travel-shabbat-candle-set',
    price: 30,
    description: 'Everything you need to welcome Shabbat wherever you are. Two tea light ceramic candle holders, 3 boxes of Jewmanity\u00ae matches, 2 tea light candles, and travel pouch.',
    features: [
      'Two tea light ceramic candle holders',
      '3 boxes of Jewmanity\u00ae branded matches',
      '2 tea light candles included',
      'Compact travel pouch for portability',
      '100% of proceeds support Jewmanity programs',
    ],
    mainImageUrl: 'https://images.squarespace-cdn.com/content/v1/656e6401e86bb64afd5e0c08/674edd0d-54bf-44c4-8055-219f85fe2948/IMG_2896.jpeg',
    galleryUrls: [],
    orderRank: 4,
  },
];

async function uploadImageFromUrl(url) {
  console.log(`  Downloading: ${url.split('/').pop().substring(0, 40)}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = url.split('/').pop().split('?')[0] || 'image.jpg';
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType,
  });
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  };
}

async function run() {
  console.log('=== Sanity Product Migration ===\n');

  // Step 1: Delete all existing products
  console.log('Step 1: Deleting existing products...');
  const existing = await client.fetch('*[_type == "product"]{ _id }');
  if (existing.length > 0) {
    const tx = client.transaction();
    for (const doc of existing) {
      tx.delete(doc._id);
      console.log(`  Queued delete: ${doc._id}`);
    }
    await tx.commit();
    console.log(`  Deleted ${existing.length} products.\n`);
  } else {
    console.log('  No existing products found.\n');
  }

  // Step 2: Create new products with uploaded images
  console.log('Step 2: Creating new products...\n');
  for (const product of products) {
    console.log(`Creating: ${product.name}`);

    const mainImage = await uploadImageFromUrl(product.mainImageUrl);

    const gallery = [];
    for (const url of product.galleryUrls) {
      const img = await uploadImageFromUrl(url);
      gallery.push(img);
    }

    const doc = {
      _type: 'product',
      name: product.name,
      slug: { _type: 'slug', current: product.slug },
      snipcartId: product.snipcartId,
      price: product.price,
      description: product.description,
      features: product.features,
      mainImage,
      inStock: true,
      orderRank: product.orderRank,
    };

    if (gallery.length > 0) {
      doc.gallery = gallery;
    }

    const created = await client.create(doc);
    console.log(`  Created: ${created._id}\n`);
  }

  console.log('=== Migration complete! ===');
  console.log('4 products created with images from jewmanity.com');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
