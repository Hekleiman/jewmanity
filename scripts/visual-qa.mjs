#!/usr/bin/env node

// Visual QA: Takes a Playwright screenshot and analyzes it with Claude Vision
// Usage: node scripts/visual-qa.mjs <url-path> <name> [reference-image-path]
// Examples:
//   node scripts/visual-qa.mjs / homepage
//   node scripts/visual-qa.mjs /about/story about-story
//   node scripts/visual-qa.mjs /about/story about-story design-reference/About__Our_Story___Desktop_View.png

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

// Load .env file if it exists (for ANTHROPIC_API_KEY)
if (existsSync('.env')) {
  const envContent = readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx);
        const value = trimmed.slice(eqIdx + 1);
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

const urlPath = process.argv[2] || '/';
const name = process.argv[3] || 'screenshot';
const refImagePath = process.argv[4];

// Ensure screenshots directory exists
if (!existsSync('screenshots')) mkdirSync('screenshots');

// Step 1: Take the screenshot
console.log(`\u{1F4F8} Taking screenshot of http://localhost:4321${urlPath}...`);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`http://localhost:4321${urlPath}`, { waitUntil: 'networkidle', timeout: 15000 });

// Wait a bit for GSAP animations to complete
await page.waitForTimeout(1500);

const screenshotPath = `screenshots/${name}.png`;
await page.screenshot({ fullPage: false, path: screenshotPath });
console.log(`\u2705 Screenshot saved: ${screenshotPath}`);

// Also take a full-page screenshot
const fullScreenshotPath = `screenshots/${name}-full.png`;
await page.screenshot({ fullPage: true, path: fullScreenshotPath });
console.log(`\u2705 Full-page screenshot saved: ${fullScreenshotPath}`);

await browser.close();

// Step 2: Analyze with Claude Vision API
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.log('\u26A0\uFE0F  ANTHROPIC_API_KEY not set — skipping vision analysis.');
  console.log('Screenshots were saved. Set ANTHROPIC_API_KEY to enable visual QA reports.');
  process.exit(0);
}

console.log(`\u{1F50D} Analyzing screenshot with Claude Vision...`);

const screenshotBase64 = readFileSync(screenshotPath).toString('base64');

// Build the message content
const content = [];

// Add the current screenshot
content.push({
  type: 'image',
  source: {
    type: 'base64',
    media_type: 'image/png',
    data: screenshotBase64,
  },
});

// Add reference image if provided
if (refImagePath && existsSync(refImagePath)) {
  console.log(`\u{1F4CE} Comparing against reference: ${refImagePath}`);
  const refBase64 = readFileSync(refImagePath).toString('base64');
  content.push({
    type: 'image',
    source: {
      type: 'base64',
      media_type: 'image/png',
      data: refBase64,
    },
  });
  content.push({
    type: 'text',
    text: `Image 1 is a screenshot of the current website at path "${urlPath}". Image 2 is the Figma design reference. Compare them and report:

1. LAYOUT: Does the overall layout match? Any sections missing or in wrong order?
2. HERO IMAGE: Is the hero image properly positioned? Are people's heads or important elements cut off? What object-position would fix any cropping issues?
3. TEXT CONTRAST: Is ALL text clearly readable? Especially headings over images — are they white on dark backgrounds as in the design?
4. COLORS: Do the colors match the design? Teal (#3783A3), cream background (#FAF8F5), etc.
5. TYPOGRAPHY: Do fonts look correct? Headings in Manrope, body in Inter?
6. SPACING: Any sections with too much or too little spacing?
7. IMAGES: Are all images loading? Any broken images or placeholders still showing?
8. SPECIFIC ISSUES: List any specific visual bugs, misalignments, or differences from the design.

Be concise and specific. For each issue, describe exactly what's wrong and what the fix should be (e.g., "Hero heading is #262626 dark text, should be text-white" or "Hero image needs object-position: center 25% to show faces").`,
  });
} else {
  if (refImagePath) {
    console.log(`\u26A0\uFE0F  Reference image not found: ${refImagePath} — running without comparison.`);
  }
  content.push({
    type: 'text',
    text: `This is a screenshot of a nonprofit website at path "${urlPath}". Analyze the visual design and report:

1. HERO IMAGE: Is the hero image properly positioned? Are people's heads or important elements cut off at top/bottom? Suggest an object-position value if cropping looks off.
2. TEXT CONTRAST: Is ALL text clearly readable against its background? Flag any text that's hard to read — especially headings over dark images.
3. LAYOUT: Does the layout look professional and well-structured? Any alignment issues?
4. IMAGES: Are all images loading properly? Any broken images or gradient placeholders?
5. SPECIFIC ISSUES: List any visual bugs or things that look off.

Be concise and specific. For each issue, describe exactly what's wrong and suggest a CSS fix.`,
  });
}

try {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.content && data.content[0]) {
    console.log('\n' + '='.repeat(60));
    console.log('VISUAL QA REPORT');
    console.log('='.repeat(60));
    console.log(data.content[0].text);
    console.log('='.repeat(60) + '\n');

    // Save the report
    const reportPath = `screenshots/${name}-report.txt`;
    writeFileSync(reportPath, data.content[0].text);
    console.log(`\u{1F4DD} Report saved: ${reportPath}`);
  } else {
    console.error('\u274C API error:', JSON.stringify(data, null, 2));
    process.exit(1);
  }
} catch (error) {
  console.error('\u274C Failed to analyze screenshot:', error.message);
  console.log('Make sure ANTHROPIC_API_KEY is set in your environment.');
  process.exit(1);
}
