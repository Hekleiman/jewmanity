import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:4321';
const OUT = 'screenshots/qa-nav-fix';
mkdirSync(OUT, { recursive: true });

const pages = [
  ['home', '/'],
  ['about-story', '/about/story'],
  ['programs-heads-up', '/programs/heads-up'],
  ['community-recipes', '/community/recipes'],
  ['get-involved-volunteer', '/get-involved/volunteer'],
  ['donate', '/donate'],
  ['shop', '/shop'],
  ['privacy', '/privacy'],
];

const viewports = [
  { label: '375x800', width: 375, height: 800 },
  { label: '768x800', width: 768, height: 800 },
  { label: '1024x900', width: 1024, height: 900 },
  { label: '1440x900', width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const [slug, path] of pages) {
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      console.warn(`! ${slug} ${vp.label} nav timeout, continuing`);
    }
    await page.waitForTimeout(400);
    const file = `${OUT}/${slug}__${vp.label}.png`;
    await page.screenshot({ path: file, fullPage: false });
    console.log('✓', file);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log('done');
