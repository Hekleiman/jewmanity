/**
 * Post-migration visual smoke test — READ-ONLY (dist/ must be pre-built).
 *
 * Starts `astro preview` as a subprocess on a local port, waits for it,
 * visits the five pages affected by the urlForCropped migration, takes a
 * full-page desktop screenshot (1280x800 viewport) of each, and saves to
 * audit/2026-04-22/post-migration-<page>.png.
 *
 * These screenshots are for human eyeball review against the design-reference
 * PNGs — this script does not interpret them.
 *
 * Run from repo root AFTER `npm run build`:
 *   npx tsx audit/2026-04-22/scripts/screenshot-migrated-pages.ts
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { mkdirSync } from 'node:fs';

const PORT = 4322;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = 'audit/2026-04-22';

const PAGES: Array<{ path: string; file: string }> = [
  { path: '/', file: 'post-migration-home.png' },
  { path: '/programs/past-retreats', file: 'post-migration-past-retreats.png' },
  { path: '/programs/heads-up', file: 'post-migration-heads-up.png' },
  { path: '/about/community-stories', file: 'post-migration-community-stories.png' },
  { path: '/get-involved/volunteer', file: 'post-migration-volunteer.png' },
];

async function waitForServer(url: string, timeoutMs = 20_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await delay(250);
  }
  throw new Error(`server did not come up at ${url} within ${timeoutMs}ms`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Spawning astro preview on port ${PORT}...`);
  const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  });

  preview.stdout?.on('data', (d) => process.stderr.write(`[preview] ${d}`));
  preview.stderr?.on('data', (d) => process.stderr.write(`[preview] ${d}`));

  const cleanup = () => {
    if (!preview.killed) preview.kill('SIGTERM');
  };
  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(130);
  });

  try {
    await waitForServer(BASE_URL);
    console.log('Preview ready.');

    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

    for (const p of PAGES) {
      const url = `${BASE_URL}${p.path}`;
      const out = `${OUT_DIR}/${p.file}`;
      console.log(`  ${url}  ->  ${out}`);
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: out, fullPage: true });
      await page.close();
    }

    await browser.close();
  } finally {
    cleanup();
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
