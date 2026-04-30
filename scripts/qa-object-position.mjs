import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const BASE = 'http://localhost:4321';
const OUT = process.env.QA_OUT_DIR || 'screenshots/qa-object-position';
mkdirSync(OUT, { recursive: true });

const pages = [
  ['home', '/'],
  ['about-story', '/about/story'],
  ['about-team', '/about/team'],
  ['about-community-stories', '/about/community-stories'],
  ['programs-heads-up', '/programs/heads-up'],
  ['programs-past-retreats', '/programs/past-retreats'],
  ['community-fighting-antisemitism', '/community/fighting-antisemitism'],
  ['community-recipes', '/community/recipes'],
  ['get-involved-volunteer', '/get-involved/volunteer'],
  ['get-involved-contact', '/get-involved/contact'],
  ['get-involved-mitzvah-project', '/get-involved/mitzvah-project'],
  ['donate', '/donate'],
  ['shop', '/shop'],
  ['resources', '/resources'],
];

const viewports = [
  { label: '375x800', width: 375, height: 800 },
  { label: '768x800', width: 768, height: 800 },
  { label: '1024x900', width: 1024, height: 900 },
  { label: '1440x900', width: 1440, height: 900 },
  { label: '1920x1080', width: 1920, height: 1080 },
];

const sidecar = [];

const browser = await chromium.launch();
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const [slug, path] of pages) {
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 20000 });
    } catch {
      console.warn(`! ${slug} ${vp.label} nav timeout, continuing`);
    }

    // Wait for ALL <img> tags inside the first <section> (the hero) to fully decode.
    // Without this, a screenshot can be captured before the image has resolved
    // its naturalWidth/Height, which produces unrepresentative crops.
    const heroDiag = await page.evaluate(async () => {
      const heroSection = document.querySelector('main section, body section');
      if (!heroSection) return { ok: false, reason: 'no hero section', imgs: [] };
      const imgs = Array.from(heroSection.querySelectorAll('img'));
      if (imgs.length === 0) return { ok: true, reason: 'no img in hero', imgs: [] };
      await Promise.all(imgs.map(async (img) => {
        if (img.complete && img.naturalWidth > 0) return;
        try { await img.decode(); } catch { /* fall through to listener */ }
        if (img.naturalWidth > 0) return;
        await new Promise((res) => {
          const done = () => res(undefined);
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        });
      }));
      // Final assertion pass
      const stillBroken = imgs.filter((i) => !(i.naturalWidth > 0));
      return {
        ok: stillBroken.length === 0,
        reason: stillBroken.length === 0 ? 'all decoded' : `${stillBroken.length} broken`,
        imgs: imgs.map((i) => ({
          src: i.currentSrc || i.src,
          naturalWidth: i.naturalWidth,
          naturalHeight: i.naturalHeight,
          objectPosition: getComputedStyle(i).objectPosition,
        })),
      };
    });

    if (!heroDiag.ok) {
      console.warn(`! ${slug} ${vp.label} hero img not ready: ${heroDiag.reason}`);
    }
    for (const img of heroDiag.imgs) {
      console.log(`  ${slug} ${vp.label} hero <img> ${img.naturalWidth}x${img.naturalHeight} @ ${img.objectPosition} :: ${img.src}`);
    }

    // Small settle for layout post-decode
    await page.waitForTimeout(200);

    const file = `${OUT}/${slug}__${vp.label}.png`;
    await page.screenshot({ path: file, fullPage: false });
    console.log('OK', file);

    sidecar.push({
      slug,
      path,
      viewport: vp.label,
      file,
      heroImgs: heroDiag.imgs,
      heroOk: heroDiag.ok,
      heroReason: heroDiag.reason,
    });

    await page.close();
  }
  await ctx.close();
}
await browser.close();

writeFileSync(`${OUT}/_manifest.json`, JSON.stringify(sidecar, null, 2));
console.log('done');
console.log(`manifest written: ${OUT}/_manifest.json`);
