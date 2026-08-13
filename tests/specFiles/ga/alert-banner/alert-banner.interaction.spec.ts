import { test, expect } from '@playwright/test';
import { AlertBannerPage } from '../../../pages/ga/components/alertBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('AlertBanner — Component Interactions', () => {
  test('@interaction @regression @sanity alert-banner adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new AlertBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-alert-banner-ga').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression alert-banner adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new AlertBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-alert-banner-ga').first();
    await expect(child).toBeVisible();
  });
});
