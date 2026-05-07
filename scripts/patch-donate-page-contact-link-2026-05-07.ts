/**
 * Surgical patch for donatePage.ctaContactLink — 2026-05-07.
 *
 * Removes the public mailto value from production Sanity. After this runs,
 * /donate renders a generic "Get in touch" link to the contact form instead
 * of an email address.
 *
 * Defaults to dry-run. Pass --apply to actually write.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-donate-page-contact-link-2026-05-07.ts
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-donate-page-contact-link-2026-05-07.ts --apply
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_WRITE_TOKEN;
const apply = process.argv.includes('--apply');
const dryRun = !apply;

if (!token) {
  console.error('Error: SANITY_API_TOKEN (or SANITY_WRITE_TOKEN) env var is required.');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const DOC_ID = 'donatePage';
const NEW_VALUE = {
  text: 'Get in touch',
  href: '/get-involved/contact',
};

function logHeader(title: string) {
  const bar = '─'.repeat(72);
  console.log(`\n${bar}\n${title}\n${bar}`);
}

async function main() {
  console.log(
    `Mode: ${apply ? 'APPLY (writes will be sent to Sanity production)' : 'DRY-RUN (no writes)'}`,
  );

  logHeader('PREFLIGHT — read current state');
  const current = await client.fetch(
    `*[_id==$id][0]{_id, ctaContactLink}`,
    { id: DOC_ID },
  );
  if (!current) {
    throw new Error(`donatePage singleton not found at _id="${DOC_ID}"`);
  }
  console.log(`current ctaContactLink: ${JSON.stringify(current.ctaContactLink, null, 2)}`);

  logHeader('PLANNED MUTATION');
  console.log(
    JSON.stringify(
      {
        docId: DOC_ID,
        field: 'ctaContactLink',
        oldValue: current.ctaContactLink,
        newValue: NEW_VALUE,
      },
      null,
      2,
    ),
  );

  if (dryRun) {
    logHeader('DRY-RUN — no writes performed');
    console.log('Re-run with --apply to commit the mutation to Sanity production.');
    return;
  }

  logHeader('APPLYING MUTATION');
  const res = await client.patch(DOC_ID).set({ ctaContactLink: NEW_VALUE }).commit();
  console.log('API response:');
  console.log(JSON.stringify(res, null, 2));

  logHeader('VERIFY — re-read');
  const after = await client.fetch(
    `*[_id==$id][0]{_id, ctaContactLink}`,
    { id: DOC_ID },
  );
  console.log(`new ctaContactLink: ${JSON.stringify(after.ctaContactLink, null, 2)}`);
}

main().catch((err) => {
  console.error('\n✗ FAILED:', err.message);
  process.exit(1);
});
