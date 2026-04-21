// Purge em-dashes from Sanity recipe documents.
//
// Replacement rule (applied uniformly):
//   "</strong>" followed by whitespace + em-dash + whitespace  →  "</strong>. "
//     (numbered instruction step breaks in HTML-as-string form, e.g.,
//      "<strong>Mix</strong> — Stir..." becomes "<strong>Mix</strong>. Stir...")
//   Portable Text equivalent: a child whose text begins with /^\s*—\s*/ and
//   whose IMMEDIATELY PRECEDING sibling child has marks containing 'strong'
//   is treated the same way — leading em-dash becomes a period. This handles
//   the Sanity case where <strong> and the following " — text" live in
//   separate child nodes of the same block.
//   Any other " — " (whitespace-flanked em-dash)  →  ", "
//     (appositives, descriptive asides)
//   Any bare em-dash with no surrounding whitespace  →  ","
//     (safety net; not observed in current data)
//
// Idempotent: once em-dashes are gone, re-running is a no-op (no writes
// submitted when the replacement would produce identical text).
//
// Scans and patches these fields on every `recipe` document:
//   - description             (plain string)
//   - culturalContext         (Portable Text — block.children[].text)
//   - instructions            (Portable Text — block.children[].text)
//   - ingredients             (string array)
//   - notes                   (Portable Text — block.children[].text, optional)
//
// Usage:
//   npx tsx scripts/strip-emdashes-recipes.ts --dry-run
//   npx tsx scripts/strip-emdashes-recipes.ts
//
// The mutation mode requires SANITY_API_TOKEN (Editor role) in .env. Dry-run
// does not — it performs a read-only scan.
//

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

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
    if (!process.env[key]) process.env[key] = value;
  }
}

const DRY_RUN = process.argv.includes('--dry-run');
const token = process.env.SANITY_API_TOKEN;

if (!DRY_RUN && !token) {
  console.error('SANITY_API_TOKEN required for live run; pass --dry-run to scan only.');
  process.exit(1);
}

// Reads use the public-dataset client (no token). Only the write transaction
// needs the token — attaching it here too would cause a 401 if the token is
// expired/revoked, even though the read itself is public.
const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const writeClient = DRY_RUN
  ? client
  : client.withConfig({ token });

const EM_DASH = '—';

function stripEmDashes(input: string): string {
  if (typeof input !== 'string' || input.indexOf(EM_DASH) === -1) return input;
  let out = input;
  // 1. </strong>\s*—\s* → </strong>.
  out = out.replace(/<\/strong>\s*—\s*/g, '</strong>. ');
  // 2. whitespace-flanked em-dash elsewhere → ", "
  out = out.replace(/\s—\s/g, ', ');
  // 3. safety: any stray bare em-dash → ","
  out = out.replace(/—/g, ',');
  return out;
}

interface PortableBlockChild {
  _key?: string;
  _type?: string;
  text?: string;
  marks?: string[];
}
interface PortableBlock {
  _key?: string;
  _type?: string;
  children?: PortableBlockChild[];
  [k: string]: unknown;
}
interface Recipe {
  _id: string;
  title?: string;
  description?: string;
  culturalContext?: PortableBlock[];
  instructions?: PortableBlock[];
  ingredients?: string[];
  notes?: PortableBlock[];
}

interface Change {
  docId: string;
  title: string;
  field: string;
  before: string;
  after: string;
}

function snippet(s: string, max = 80): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + '…';
}

function processBlocks(
  blocks: PortableBlock[] | undefined,
): { next: PortableBlock[] | undefined; changes: Array<{ before: string; after: string }> } {
  if (!Array.isArray(blocks)) return { next: blocks, changes: [] };
  const changes: Array<{ before: string; after: string }> = [];
  const next = blocks.map((b) => {
    if (!b || b._type !== 'block' || !Array.isArray(b.children)) return b;
    const newChildren = b.children.map((c, i) => {
      if (typeof c.text !== 'string' || c.text.indexOf(EM_DASH) === -1) return c;
      let working = c.text;
      // If this child immediately follows a strong-marked sibling AND starts
      // with /^\s*—\s*/, rewrite the leading em-dash to ". " before the
      // generic rules run.
      const prev = i > 0 ? b.children![i - 1] : undefined;
      const prevIsStrong =
        !!prev && Array.isArray(prev.marks) && prev.marks.includes('strong');
      if (prevIsStrong) {
        working = working.replace(/^\s*—\s*/, '. ');
      }
      const after = stripEmDashes(working);
      if (after !== c.text) changes.push({ before: c.text, after });
      return { ...c, text: after };
    });
    return { ...b, children: newChildren };
  });
  return { next, changes };
}

const recipes: Recipe[] = await client.fetch(
  `*[_type == "recipe"] | order(orderRank asc) {
    _id, title, description, culturalContext, instructions, ingredients, notes
  }`,
);

console.log(`mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (will patch)'}`);
console.log(`recipes found: ${recipes.length}`);
console.log('');

const allChanges: Change[] = [];
const patches: Array<{ id: string; set: Record<string, unknown> }> = [];

for (const r of recipes) {
  const set: Record<string, unknown> = {};
  const docChanges: Change[] = [];

  if (typeof r.description === 'string' && r.description.indexOf(EM_DASH) !== -1) {
    const after = stripEmDashes(r.description);
    if (after !== r.description) {
      set.description = after;
      docChanges.push({ docId: r._id, title: r.title || '', field: 'description', before: r.description, after });
    }
  }

  const ctx = processBlocks(r.culturalContext);
  if (ctx.changes.length > 0) {
    set.culturalContext = ctx.next;
    for (const ch of ctx.changes) {
      docChanges.push({ docId: r._id, title: r.title || '', field: 'culturalContext', before: ch.before, after: ch.after });
    }
  }

  const ins = processBlocks(r.instructions);
  if (ins.changes.length > 0) {
    set.instructions = ins.next;
    for (const ch of ins.changes) {
      docChanges.push({ docId: r._id, title: r.title || '', field: 'instructions', before: ch.before, after: ch.after });
    }
  }

  if (Array.isArray(r.ingredients)) {
    const mapped = r.ingredients.map((s) => stripEmDashes(s));
    const anyChanged = mapped.some((s, i) => s !== r.ingredients![i]);
    if (anyChanged) {
      set.ingredients = mapped;
      r.ingredients.forEach((before, i) => {
        const after = mapped[i];
        if (before !== after) {
          docChanges.push({ docId: r._id, title: r.title || '', field: `ingredients[${i}]`, before, after });
        }
      });
    }
  }

  const notes = processBlocks(r.notes);
  if (notes.changes.length > 0) {
    set.notes = notes.next;
    for (const ch of notes.changes) {
      docChanges.push({ docId: r._id, title: r.title || '', field: 'notes', before: ch.before, after: ch.after });
    }
  }

  if (docChanges.length > 0) {
    allChanges.push(...docChanges);
    patches.push({ id: r._id, set });
  }
}

console.log(`documents with changes: ${patches.length}`);
console.log(`total text replacements: ${allChanges.length}`);
console.log('');
console.log('--- per-change detail ---');
for (const ch of allChanges) {
  console.log(`[${ch.docId}] ${ch.field}`);
  console.log(`  before: ${snippet(ch.before)}`);
  console.log(`  after : ${snippet(ch.after)}`);
}
console.log('');

if (DRY_RUN) {
  console.log('dry run complete — no writes performed.');
  process.exit(0);
}

if (patches.length === 0) {
  console.log('nothing to patch — exiting.');
  process.exit(0);
}

console.log('applying patches...');
let tx = writeClient.transaction();
for (const p of patches) {
  tx = tx.patch(p.id, (patch) => patch.set(p.set));
}
await tx.commit();
console.log(`patched ${patches.length} document(s).`);
