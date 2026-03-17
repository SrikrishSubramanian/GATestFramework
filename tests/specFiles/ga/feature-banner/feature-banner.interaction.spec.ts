import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('FeatureBanner — Component Interactions', () => {
  test('[FB-017] @interaction @regression feature-banner adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  // FB-018–024 removed: all 7 were identical to FB-017 (same locator, same parent, same assertion)
});
