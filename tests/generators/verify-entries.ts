/**
 * Reusable: verify a list of locator-registry entries for a component
 * resolve to exactly one live element (or report the actual count) against
 * its style-guide page. Read-only — does not write any files.
 *
 * Usage:
 *   COMPONENT=login:login KEYS=usernameInput,passwordInput \
 *     SIDECAR=tests/pages/ga/locators/loginPage.locators.json \
 *     env=local npx playwright test verify-entries --config playwright.generators.config.ts --project chromium --workers 1
 */
import { test } from '@playwright/test';
import { loginToAEMAuthor } from '../utils/infra/auth-fixture';
import { loadLocators, resolveLocatorWithLog } from '../utils/infra/locator-registry';
import path from 'path';

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const [slug, pageSlugRaw] = (process.env.COMPONENT || '').split(':');
const pageSlug = pageSlugRaw || slug;
const keys = (process.env.KEYS || '').split(',').map(s => s.trim()).filter(Boolean);
const sidecarPath = process.env.SIDECAR || '';

test(`verify entries: ${slug}`, async ({ page }) => {
  await loginToAEMAuthor(page, { authorUrl: AUTHOR_URL, username: 'admin', password: 'admin' });
  const url = `${AUTHOR_URL}/content/global-atlantic/style-guide/components/${pageSlug}.html?wcmmode=disabled`;
  const resp = await page.goto(url);
  console.log(`URL: ${url} status=${resp?.status()}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registry = loadLocators(path.resolve(process.cwd(), sidecarPath));
  for (const key of keys) {
    const entry = registry.entries[key];
    if (!entry) { console.log(`[MISSING FROM JSON] ${key}`); continue; }
    try {
      const { locator, usedStrategy, fallbackUsed } = await resolveLocatorWithLog(page, entry);
      const count = await locator.count();
      console.log(`${key}: strategy=${usedStrategy.type}:${usedStrategy.value} count=${count} fallback=${fallbackUsed}`);
    } catch (e: any) {
      console.log(`${key}: ERROR ${e.message}`);
    }
  }
});
