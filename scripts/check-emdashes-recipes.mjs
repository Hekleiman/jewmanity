#!/usr/bin/env node
//
// Read-only verification tool: scan all Sanity recipe documents for em-dash
// occurrences across description, culturalContext, instructions, ingredients,
// and notes. Prints a per-recipe count and a grand total.
//
// Use this after Belinda authors new recipe content to confirm no em-dashes
// have been (re)introduced. Em-dashes were purged in commit 3 of Belinda's
// round 1 feedback (see scripts/strip-emdashes-recipes.ts).
//
// No write token required — reads the production dataset via the CDN-less
// client. Safe to run anytime, repeatedly. Exits 1 if any em-dashes remain,
// so this can be used as a CI check.
//
// Usage:
//   node scripts/check-emdashes-recipes.mjs
//

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const EM_DASH = '—';

function countEmDash(s) {
  if (typeof s !== 'string') return 0;
  let n = 0;
  for (const ch of s) if (ch === EM_DASH) n++;
  return n;
}

function scanBlocks(blocks) {
  if (!Array.isArray(blocks)) return 0;
  let n = 0;
  for (const b of blocks) {
    if (!b || b._type !== 'block' || !Array.isArray(b.children)) continue;
    for (const c of b.children) n += countEmDash(c.text);
  }
  return n;
}

const recipes = await client.fetch(
  `*[_type == "recipe"] | order(orderRank asc) { _id, title, description, culturalContext, instructions, ingredients, notes }`,
);

console.log(`total recipe documents: ${recipes.length}`);
let grand = 0;
let hitCount = 0;

for (const r of recipes) {
  const counts = {
    description: countEmDash(r.description),
    culturalContext: scanBlocks(r.culturalContext),
    instructions: scanBlocks(r.instructions),
    ingredients: Array.isArray(r.ingredients)
      ? r.ingredients.reduce((a, s) => a + countEmDash(s), 0)
      : 0,
    notes: scanBlocks(r.notes),
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  grand += total;
  if (total > 0) hitCount++;
  console.log(`  ${r._id}  "${r.title}"  total=${total}  ${JSON.stringify(counts)}`);
}

console.log(`\nrecipes with em-dashes: ${hitCount} / ${recipes.length}`);
console.log(`total em-dash occurrences across all recipes: ${grand}`);

if (grand > 0) {
  process.exitCode = 1;
}
