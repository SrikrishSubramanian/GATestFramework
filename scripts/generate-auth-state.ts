import { chromium } from 'playwright';
import dotenv from 'dotenv';
import path from 'path';
import { loginToAEMAuthor } from '../tests/utils/infra/auth-fixture';
import { AUTH_STATE_PATH } from '../tests/utils/infra/persistent-context';

/**
 * Run headed once to complete Microsoft SSO/MFA interactively and cache the
 * resulting session to .auth-state.json (loginToAEMAuthor saves it on success).
 * That file is what CI restores from the AEM_AUTH_STATE_JSON secret so tests
 * don't have to complete MFA headlessly.
 *
 * Usage: env=dev npx ts-node scripts/generate-auth-state.ts
 */
async function main() {
  const envName = process.env.env;
  if (envName) {
    dotenv.config({
      path: path.resolve(__dirname, '..', 'tests', 'environments', `.env.${envName}`),
      override: true,
    });
  }

  const authorUrl = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
  const username = process.env.AEM_AUTHOR_USERNAME || 'admin';
  const password = process.env.AEM_AUTHOR_PASSWORD || 'admin';

  console.log(`[generate-auth-state] Logging in to ${authorUrl} as ${username}`);
  console.log('[generate-auth-state] Complete the Microsoft SSO / MFA prompt in the browser window that opens.');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await loginToAEMAuthor(page, { authorUrl, username, password, timeout: 60000 });
    console.log(`[generate-auth-state] Success — session cached at ${AUTH_STATE_PATH}`);
    console.log('[generate-auth-state] Copy that file\'s contents into the AEM_AUTH_STATE_JSON GitHub secret.');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[generate-auth-state] Failed:', err);
  process.exit(1);
});
