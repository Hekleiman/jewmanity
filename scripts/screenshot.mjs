import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:4321';
const name = process.argv[3] || 'page';

async function screenshot() {
  const browser = await chromium.launch();

  // Desktop screenshot (1280px)
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.goto(url, { waitUntil: 'networkidle' });
  await desktop.screenshot({ path: `screenshots/${name}-desktop.png`, fullPage: true });
  console.log(`✓ Desktop: screenshots/${name}-desktop.png`);

  // Mobile screenshot (375px)
  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobile.goto(url, { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: `screenshots/${name}-mobile.png`, fullPage: true });
  console.log(`✓ Mobile: screenshots/${name}-mobile.png`);

  await browser.close();
}

screenshot().catch(console.error);
