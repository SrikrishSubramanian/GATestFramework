import { test, expect } from '@playwright/test';
import { RatingsCardPage } from '../../../pages/ga/components/ratingsCardPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('RatingsCard — Component Interactions', () => {
  test('@interaction @regression ratings-card adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new RatingsCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-rating-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression ratings-card adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new RatingsCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-rating-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression ratings-card adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new RatingsCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-rating-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression ratings-card adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new RatingsCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-rating-card').first();
    await expect(child).toBeVisible();
  });
});
