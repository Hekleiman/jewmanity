// Port Jewmanity retreat posts from Squarespace to Sanity.
//
// Source of truth: https://www.jewmanity.com/ptsd-retreats/{one,two,three,four}
// Target: Sanity docs retreat-heads-up-{first,second,third,fourth}
//
// Behavior:
//   - Parses raw HTML (not WebFetch) to avoid summarization paraphrase.
//   - Copies title, datePublished, prose, inline <strong>/<em> marks, and images
//     verbatim. Videos are dropped (schema has no block type for them) and
//     reported in the dry-run log.
//   - Em-dash strip matches scripts/strip-emdashes-recipes.ts (commit 27b7e0a):
//       \s—\s → ", "
//       bare — → ","
//     EXCEPTION: any em-dash adjacent to a hyphen ("—-" / "-—") is preserved
//     verbatim — those are authoring typos where transforms read worse than
//     the source.
//   - Author field: "Belinda Donner" for all 4 (from <meta name="blog-author">).
//     Subtitle: null for all 4. Structural metadata stays strict-verbatim; any
//     body line that reads like a byline stays in body.
//   - Upload images via client.assets.upload; Sanity de-dupes by sha1 so
//     re-runs don't create duplicate assets.
//   - createOrReplace on the existing IDs. Slug/coverImage preserved across runs.
//
// Usage:
//   npx tsx scripts/seed-retreats-from-squarespace.ts --dry-run
//   npx tsx scripts/seed-retreats-from-squarespace.ts        # live (needs token)

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Minimal .env loader (same approach as strip-emdashes-recipes.ts).
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
const DUMP_BODY = process.argv.find((a) => a.startsWith('--dump-body='))?.split('=')[1] || null;
const TOKEN = process.env.SANITY_API_TOKEN;

if (!DRY_RUN && !TOKEN) {
  console.error('SANITY_API_TOKEN required for live run; pass --dry-run to plan only.');
  process.exit(1);
}

const readClient = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const writeClient = DRY_RUN ? readClient : readClient.withConfig({ token: TOKEN });

// ----- Retreat registry -----
interface RetreatTarget {
  urlSlug: 'one' | 'two' | 'three' | 'four';
  sanityId: string;
  sanitySlug: string;
}

const RETREATS: RetreatTarget[] = [
  { urlSlug: 'one',   sanityId: 'retreat-heads-up-first',  sanitySlug: 'heads-up-first-retreat' },
  { urlSlug: 'two',   sanityId: 'retreat-heads-up-second', sanitySlug: 'heads-up-second-retreat' },
  { urlSlug: 'three', sanityId: 'retreat-heads-up-third',  sanitySlug: 'heads-up-third-retreat' },
  { urlSlug: 'four',  sanityId: 'retreat-heads-up-fourth', sanitySlug: 'heads-up-retreat-4-fathers-fighters' },
];

// ----- Em-dash transform -----
// Applied to plain text (post-HTML-strip). Preserves any em-dash that is
// adjacent to a hyphen (either side) — those patterns are authoring typos
// where transformation reads worse than the source.
function stripEmDashes(input: string): string {
  if (!input.includes('—')) return input;
  // Placeholder protects `—-` / `-—` (em-dash adjacent to hyphen) before
  // the global rules fire.
  const SENTINEL = 'EMPROT';
  const protect = (s: string) => s.replace(/(—-|-—)/g, SENTINEL);
  const restore = (s: string) => s.replace(new RegExp(SENTINEL, 'g'), (_m) => {
    // We only ever protect the literal matched text, which is "—-" or "-—".
    // Restore by scanning the ORIGINAL in parallel — simpler: store matches.
    return '';
  });
  // Capture originals in order so we can restore them after transform.
  const originals: string[] = [];
  const protectedInput = input.replace(/(—-|-—)/g, (m) => {
    originals.push(m);
    return SENTINEL;
  });
  let out = protectedInput;
  out = out.replace(/\s—\s/g, ', ');
  out = out.replace(/—/g, ',');
  let i = 0;
  out = out.replace(new RegExp(SENTINEL, 'g'), () => originals[i++]);
  return out;
}

// ----- HTML utilities -----

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, n) => String.fromCharCode(parseInt(n, 16)));
}

// Collapse spans/a wrappers and other inline noise; keep <strong>/<em> for
// downstream mark-extraction.
function normalizeInline(raw: string): string {
  let s = raw;
  s = s.replace(/<br\s*\/?>/gi, '\n');
  // Drop span/a wrappers but keep contents.
  s = s.replace(/<\/?span[^>]*>/gi, '');
  s = s.replace(/<a\b[^>]*>/gi, '');
  s = s.replace(/<\/a>/gi, '');
  // Strip attributes from <strong>/<em>/<b>/<i> so the tag form is predictable.
  s = s.replace(/<(strong|em|b|i)\b[^>]*>/gi, (_m, t) => `<${t.toLowerCase()}>`);
  // Normalize <b>/<i> to <strong>/<em>.
  s = s.replace(/<b>/g, '<strong>').replace(/<\/b>/g, '</strong>');
  s = s.replace(/<i>/g, '<em>').replace(/<\/i>/g, '</em>');
  // Strip any remaining tag that isn't strong/em.
  s = s.replace(/<(?!\/?(?:strong|em)\b)[^>]+>/gi, '');
  s = decodeEntities(s);
  // Within a single paragraph block, collapse any run of whitespace
  // (incl. newlines from <br>) to a single space. PT blocks are paragraph-
  // level and do not render intra-block line breaks; this matches how the
  // browser renders the source Squarespace page.
  s = s.replace(/\s+/g, ' ');
  return s.trim();
}

// Parse a string that may contain <strong>/<em> tags into a Portable Text
// span list with marks. Also applies em-dash strip to the text content.
interface Span {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

function toSpans(raw: string, keyPrefix: string): Span[] {
  // Tokenize on <strong>/<em> open/close tags.
  const tokens: { text: string; open?: string; close?: string }[] = [];
  const re = /<(\/?)(strong|em)>/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) tokens.push({ text: raw.slice(last, m.index) });
    if (m[1] === '/') tokens.push({ text: '', close: m[2].toLowerCase() });
    else tokens.push({ text: '', open: m[2].toLowerCase() });
    last = re.lastIndex;
  }
  if (last < raw.length) tokens.push({ text: raw.slice(last) });

  const spans: Span[] = [];
  const markStack: string[] = [];
  let counter = 0;
  for (const tok of tokens) {
    if (tok.open) { markStack.push(tok.open); continue; }
    if (tok.close) {
      const idx = markStack.lastIndexOf(tok.close);
      if (idx !== -1) markStack.splice(idx, 1);
      continue;
    }
    if (!tok.text) continue;
    const text = stripEmDashes(tok.text);
    if (!text) continue;
    spans.push({
      _type: 'span',
      _key: `${keyPrefix}s${counter++}`,
      text,
      marks: [...markStack],
    });
  }
  // Collapse adjacent spans with identical marks to reduce churn.
  const merged: Span[] = [];
  for (const s of spans) {
    const last = merged[merged.length - 1];
    if (last && last.marks.length === s.marks.length && last.marks.every((m, i) => m === s.marks[i])) {
      last.text += s.text;
    } else {
      merged.push(s);
    }
  }
  // Trim outer whitespace at paragraph edges (e.g., leading space inside a
  // whole-paragraph <strong> wrapper caused by <br> at the tag boundary).
  // Do NOT trim between spans — inter-span whitespace carries meaning.
  if (merged.length) {
    merged[0].text = merged[0].text.replace(/^\s+/, '');
    merged[merged.length - 1].text = merged[merged.length - 1].text.replace(/\s+$/, '');
  }
  return merged.filter((s) => s.text.length > 0);
}

// ----- Squarespace page parser -----

interface ParsedImage { type: 'image'; url: string; alt: string; source: 'inline' | 'gallery'; }
interface ParsedPara  { type: 'paragraph'; rawInline: string; }
interface ParsedHead  { type: 'heading'; level: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; rawInline: string; }
interface ParsedVideo { type: 'video'; note: string; }
interface ParsedHr    { type: 'hr'; }
type ParsedBlock = ParsedImage | ParsedPara | ParsedHead | ParsedVideo | ParsedHr;

interface ParsedRetreat {
  title: string;
  datePublishedIso: string;
  author: string;
  blocks: ParsedBlock[];
  skippedVideos: number;
}

async function fetchHtml(urlSlug: string): Promise<string> {
  const res = await fetch(`https://www.jewmanity.com/ptsd-retreats/${urlSlug}`);
  if (!res.ok) throw new Error(`Squarespace fetch ${urlSlug} failed: ${res.status}`);
  return await res.text();
}

function parseRetreat(html: string): ParsedRetreat {
  // Title.
  const titleM = html.match(/<h1[^>]*class="[^"]*BlogItem-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/)
              || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = titleM
    ? decodeEntities(titleM[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
    : '';

  // datePublished from embedded JSON-LD.
  const dateM = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  const datePublishedIso = dateM ? dateM[1] : '';

  // blog-author.
  const authorM = html.match(/blog-author[^>]*>([^<]+)</);
  const author = authorM ? authorM[1].trim() : 'Belinda Donner';

  // Isolate article body: blog-item-content-wrapper → blog-item-comments.
  const startM = html.match(/<div class="blog-item-content-wrapper">/);
  const endM = html.match(/<section\s+class="blog-item-comments"/);
  if (!startM || !endM) throw new Error('Could not isolate article body');
  const bodyHtml = html.slice(startM.index! + startM[0].length, endM.index!);

  // Walk sqs-block children in order.
  const blockRe = /<div[^>]+class="[^"]*sqs-block\s+([^\s"]+)[^"]*"[^>]*id="(block-[^"]+)"/g;
  interface Raw { pos: number; end: number; type: string; id: string; html: string; }
  const raws: Raw[] = [];
  let bm: RegExpExecArray | null;
  while ((bm = blockRe.exec(bodyHtml)) !== null) {
    raws.push({ pos: bm.index, end: -1, type: bm[1], id: bm[2], html: '' });
  }
  for (let i = 0; i < raws.length; i++) {
    raws[i].end = i + 1 < raws.length ? raws[i + 1].pos : bodyHtml.length;
    raws[i].html = bodyHtml.slice(raws[i].pos, raws[i].end);
  }

  const blocks: ParsedBlock[] = [];
  let skippedVideos = 0;

  for (const r of raws) {
    switch (r.type) {
      case 'website-component-block':
      case 'html-block':
      case 'code-block': {
        // Walk p/h1-h6 in order.
        const tagRe = /<(p|h1|h2|h3|h4|h5|h6)([^>]*)>([\s\S]*?)<\/\1>/g;
        let tm: RegExpExecArray | null;
        while ((tm = tagRe.exec(r.html)) !== null) {
          const tag = tm[1].toLowerCase();
          const attrs = tm[2] || '';
          const inner = tm[3];
          const normalized = normalizeInline(inner);
          if (!normalized.replace(/<[^>]+>/g, '').trim()) continue;
          const isLarge = /sqsrte-large/.test(attrs);
          if (tag === 'p' && isLarge) {
            blocks.push({ type: 'heading', level: 'h2', rawInline: normalized });
          } else if (tag === 'p') {
            blocks.push({ type: 'paragraph', rawInline: normalized });
          } else if (tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
            blocks.push({ type: 'heading', level: tag, rawInline: normalized });
          } else {
            // h1 is reserved for the page title — map body h1 to h2.
            blocks.push({ type: 'heading', level: 'h2', rawInline: normalized });
          }
        }
        break;
      }
      case 'image-block': {
        const urlM = r.html.match(/data-image="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/)
                  || r.html.match(/<img[^>]+src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/);
        if (urlM) {
          const altM = r.html.match(/<img[^>]+alt="([^"]*)"/);
          blocks.push({ type: 'image', url: urlM[1], alt: altM ? altM[1] : '', source: 'inline' });
        }
        break;
      }
      case 'gallery-block': {
        const urls = Array.from(r.html.matchAll(/data-image="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/g), (x) => x[1]);
        const seen = new Set<string>();
        for (const u of urls) {
          if (seen.has(u)) continue;
          seen.add(u);
          blocks.push({ type: 'image', url: u, alt: '', source: 'gallery' });
        }
        break;
      }
      case 'video-block':
        skippedVideos++;
        blocks.push({ type: 'video', note: 'squarespace video — no Sanity schema support' });
        break;
      case 'horizontalrule-block':
        blocks.push({ type: 'hr' });
        break;
      default:
        // Unknown block type — ignored.
        break;
    }
  }

  return { title, datePublishedIso, author, blocks, skippedVideos };
}

// ----- Asset upload with in-process cache -----

const assetCache = new Map<string, string>(); // url → asset _id

async function uploadImage(url: string): Promise<string> {
  if (assetCache.has(url)) return assetCache.get(url)!;
  if (DRY_RUN) {
    // Synthesize a placeholder ref for dry-run logging only.
    const fakeId = 'image-dryrun-' + crypto.createHash('sha1').update(url).digest('hex').slice(0, 10);
    assetCache.set(url, fakeId);
    return fakeId;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch ${url} failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const filename = url.split('/').pop() || 'image';
  const asset = await writeClient.assets.upload('image', buf, { filename });
  assetCache.set(url, asset._id);
  return asset._id;
}

// ----- Portable Text builder -----

interface PTBlock {
  _type: 'block';
  _key: string;
  style: string;
  markDefs: [];
  children: Span[];
}
interface PTImage {
  _type: 'image';
  _key: string;
  asset: { _type: 'reference'; _ref: string };
  alt?: string;
}
type PT = PTBlock | PTImage;

async function buildBody(parsed: ParsedRetreat, keyPrefix: string): Promise<PT[]> {
  const out: PT[] = [];
  let idx = 0;
  for (const b of parsed.blocks) {
    const k = `${keyPrefix}b${idx}`;
    if (b.type === 'paragraph') {
      out.push({
        _type: 'block', _key: k, style: 'normal', markDefs: [],
        children: toSpans(b.rawInline, `${k}`),
      });
    } else if (b.type === 'heading') {
      out.push({
        _type: 'block', _key: k, style: b.level, markDefs: [],
        children: toSpans(b.rawInline, `${k}`),
      });
    } else if (b.type === 'image') {
      const ref = await uploadImage(b.url);
      const img: PTImage = { _type: 'image', _key: k, asset: { _type: 'reference', _ref: ref } };
      if (b.alt) img.alt = b.alt;
      out.push(img);
    }
    // video / hr / unknown: dropped.
    idx++;
  }
  return out;
}

// ----- Main -----

interface ExistingDoc {
  _id: string;
  _type: string;
  title?: string;
  slug?: { current: string };
  date?: string;
  author?: string | null;
  subtitle?: string | null;
  body?: unknown;
  coverImage?: { asset?: { _ref: string } };
  [k: string]: unknown;
}

async function main() {
  console.log('='.repeat(70));
  console.log(`retreat seed ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'}`);
  console.log('='.repeat(70));

  // Fetch existing docs once for diff/preserve.
  const existing = await readClient.fetch<ExistingDoc[]>(
    `*[_type == "retreat" && _id in $ids]`,
    { ids: RETREATS.map((r) => r.sanityId) },
  );
  const byId = new Map(existing.map((d) => [d._id, d]));

  let totalVideos = 0;
  let totalImages = 0;

  for (const target of RETREATS) {
    console.log('\n' + '-'.repeat(70));
    console.log(`[${target.urlSlug}] → ${target.sanityId}`);
    console.log('-'.repeat(70));

    const html = await fetchHtml(target.urlSlug);
    const parsed = parseRetreat(html);
    const imageCount = parsed.blocks.filter((b) => b.type === 'image').length;
    totalImages += imageCount;
    totalVideos += parsed.skippedVideos;

    console.log(`  title:     ${parsed.title}`);
    console.log(`  date:      ${parsed.datePublishedIso} → ${parsed.datePublishedIso.slice(0, 10)}`);
    console.log(`  author:    ${parsed.author}`);
    console.log(`  subtitle:  (null — strict-verbatim, bylines remain in body)`);
    console.log(`  body blocks: ${parsed.blocks.length} total` +
                ` (${parsed.blocks.filter(b=>b.type==='paragraph').length} p, ` +
                `${parsed.blocks.filter(b=>b.type==='heading').length} h, ` +
                `${imageCount} img, ` +
                `${parsed.blocks.filter(b=>b.type==='hr').length} hr) — ` +
                `${parsed.skippedVideos} videos SKIPPED`);

    // Per-block outline with first 80 chars of text.
    console.log(`  outline:`);
    parsed.blocks.forEach((b, i) => {
      if (b.type === 'paragraph') {
        const t = stripEmDashes(b.rawInline.replace(/<[^>]+>/g, '')).slice(0, 80);
        console.log(`    [${String(i).padStart(2,' ')}] P:     ${t}`);
      } else if (b.type === 'heading') {
        const t = b.rawInline.replace(/<[^>]+>/g, '').slice(0, 80);
        console.log(`    [${String(i).padStart(2,' ')}] ${b.level.toUpperCase()}:    ${t}`);
      } else if (b.type === 'image') {
        const base = b.url.split('/').pop();
        console.log(`    [${String(i).padStart(2,' ')}] IMG:   ${base}${b.source==='gallery'?' [gallery]':''}`);
      } else if (b.type === 'video') {
        console.log(`    [${String(i).padStart(2,' ')}] VIDEO: (SKIPPED — ${b.note})`);
      } else if (b.type === 'hr') {
        console.log(`    [${String(i).padStart(2,' ')}] HR`);
      }
    });

    // Flag em-dash-adjacent-hyphen preservations.
    const preserved: string[] = [];
    for (const b of parsed.blocks) {
      if (b.type !== 'paragraph' && b.type !== 'heading') continue;
      const txt = b.rawInline.replace(/<[^>]+>/g, '');
      for (const m of txt.matchAll(/.{0,15}(—-|-—).{0,15}/g)) {
        preserved.push(m[0]);
      }
    }
    if (preserved.length) {
      console.log(`  em-dash-adjacent-to-hyphen preserved (${preserved.length}):`);
      for (const p of preserved) console.log(`    • …${p}…`);
    }

    // Upload images (dry-run short-circuits to fake IDs).
    console.log(`  ${DRY_RUN ? 'would upload' : 'uploading'} ${imageCount} images…`);
    const body = await buildBody(parsed, target.sanityId.replace(/^retreat-/, ''));

    // Pick coverImage: first image block's asset ref. If none, preserve existing.
    const firstImg = body.find((b): b is PTImage => b._type === 'image');
    const prev = byId.get(target.sanityId);
    const coverRef = firstImg?.asset._ref || prev?.coverImage?.asset?._ref;

    const doc: Record<string, unknown> = {
      _id: target.sanityId,
      _type: 'retreat',
      title: parsed.title,
      slug: { _type: 'slug', current: target.sanitySlug },
      date: parsed.datePublishedIso.slice(0, 10),
      author: parsed.author,
      // subtitle intentionally omitted (null/undefined → preserves Sanity null)
      body,
    };
    if (coverRef) {
      doc.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: coverRef } };
    }

    // Preserve untouched fields (gallery, participants, location, orderRank)
    // so createOrReplace doesn't wipe them.
    if (prev) {
      for (const k of ['gallery', 'participants', 'location', 'orderRank'] as const) {
        if (prev[k] !== undefined) doc[k] = prev[k];
      }
    }

    if (DRY_RUN) {
      const bodyStructure = body.map((b, i) => {
        if (b._type === 'image') return `[${i}] image(${b.asset._ref})`;
        const txt = b.children.map((c) => c.text).join('');
        return `[${i}] ${b.style}: ${txt.slice(0, 60)}…`;
      });
      console.log(`  planned write (dry): _id=${doc._id}, slug=${target.sanitySlug}, body.length=${body.length}`);
      console.log(`  sample body JSON keys: ${Object.keys(doc).join(', ')}`);
      console.log(`  first 5 PT blocks:`);
      bodyStructure.slice(0, 5).forEach((s) => console.log(`    ${s}`));

      if (DUMP_BODY && target.urlSlug === DUMP_BODY) {
        console.log('\n  === FULL PT BODY DUMP (' + target.urlSlug + ') ===');
        body.forEach((b, i) => {
          if (b._type === 'image') {
            console.log(`  [${i}] IMAGE asset=${b.asset._ref}${b.alt ? ' alt="' + b.alt + '"' : ''}`);
          } else {
            console.log(`  [${i}] ${b.style.toUpperCase()}:`);
            b.children.forEach((c) => {
              const marks = c.marks.length ? ' marks=' + JSON.stringify(c.marks) : '';
              console.log(`       "${c.text}"${marks}`);
            });
          }
        });
        console.log('  === END DUMP ===\n');
      }
    } else {
      // Idempotency: compare serialized body to existing. If identical, skip.
      const prevBodyJson = JSON.stringify(prev?.body ?? null);
      const nextBodyJson = JSON.stringify(body);
      const prevMeta = JSON.stringify({
        title: prev?.title, date: prev?.date, author: prev?.author,
        cover: prev?.coverImage?.asset?._ref,
      });
      const nextMeta = JSON.stringify({
        title: doc.title, date: doc.date, author: doc.author, cover: coverRef,
      });
      if (prevBodyJson === nextBodyJson && prevMeta === nextMeta) {
        console.log(`  no changes → skipping write.`);
      } else {
        await writeClient.createOrReplace(doc as any);
        console.log(`  wrote ${doc._id}.`);
      }
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`SUMMARY`);
  console.log('='.repeat(70));
  console.log(`  Retreats processed:  ${RETREATS.length}`);
  console.log(`  Images ${DRY_RUN ? 'planned' : 'uploaded'}:   ${totalImages}`);
  console.log(`  Videos SKIPPED:      ${totalVideos} (no schema support)`);
  console.log('');
  if (DRY_RUN) console.log('Dry run complete. No writes performed.');
  else console.log('Live run complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
