/**
 * Sanity token verification — READ-ONLY.
 *
 * Confirms that `SANITY_API_TOKEN` in the environment is a valid credential
 * against the `production` dataset. Issues a no-op authenticated query that
 * returns null but requires auth to attempt.
 *
 * Does NOT write anything.
 *
 * Run from repo root:
 *   set -a; source .env; set +a; npx tsx audit/2026-04-22/scripts/verify-token.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('FAIL: SANITY_API_TOKEN is not set in the environment.');
  console.error('  Load .env first, e.g.:');
  console.error('  set -a; source .env; set +a; npx tsx audit/2026-04-22/scripts/verify-token.ts');
  process.exit(1);
}

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

async function main() {
  try {
    // No-op authenticated query. `system.group` is a reserved document type
    // that always returns null for normal project queries, but the request
    // still gets authenticated (token rejected → auth error, not null).
    const result = await client.fetch(`*[_type == "system.group"][0]`);
    console.log(`Token works. (query returned: ${JSON.stringify(result)})`);
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    console.error(`Token failed: ${msg}`);
    process.exit(2);
  }
}

main();
