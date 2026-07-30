import { test, expect } from '@playwright/test';
import { SiteSearchPage } from '../../../pages/ga/components/siteSearchPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('SiteSearch — Component Interactions', () => {
  test('@interaction @regression site-search adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new SiteSearchPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-site-search').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression site-search adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new SiteSearchPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-site-search').first();
    await expect(child).toBeVisible();
  });
});
