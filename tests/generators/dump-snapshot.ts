/**
 * One-off diagnostic: scan a component's live style-guide DOM and dump the
 * full element list to stdout (and .snapshots/) for manual selector mapping.
 * Does not write any POM/sidecar files.
 *
 * Usage:
 *   COMPONENT=login[:pageSlug] env=local npx playwright test dump-snapshot --config playwright.generators.config.ts --project chromium --workers 1
 */
import { test } from '@playwright/test';
import { scanDOM } from '../utils/generation/dom-scanner';
import { loginToAEMAuthor } from '../utils/infra/auth-fixture';

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const AUTH = {
  username: process.env.AEM_AUTHOR_USERNAME || 'admin',
  password: process.env.AEM_AUTHOR_PASSWORD || 'admin',
};

const [slug, pageSlugRaw] = (process.env.COMPONENT || '').split(':');
const pageSlug = pageSlugRaw || slug;
const rootSelectorOverride = process.env.ROOT_SELECTOR || undefined;

test(`dump snapshot: ${slug}`, async ({ page }) => {
  await loginToAEMAuthor(page, { authorUrl: AUTHOR_URL, username: AUTH.username, password: AUTH.password });
  const url = `${AUTHOR_URL}/content/global-atlantic/style-guide/components/${pageSlug}.html?wcmmode=disabled`;
  const resp = await page.goto(url);
  console.log(`URL: ${url} status=${resp?.status()}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  const snapshot = await scanDOM(page, slug, rootSelectorOverride);
  console.log(`\n=== ${slug}: ${snapshot.elements.length} elements (root=${snapshot.rootSelector}) ===\n`);
  for (const el of snapshot.elements) {
    console.log(JSON.stringify({
      name: el.name,
      tag: el.tag,
      id: el.id,
      classes: el.classes,
      text: el.text?.slice(0, 60),
      role: el.role,
      ariaLabel: el.ariaLabel,
      attrs: el.attributes,
    }));
  }
});
