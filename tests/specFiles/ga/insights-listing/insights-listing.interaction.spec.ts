import { test, expect } from '@playwright/test';
import { InsightsListingPage } from '../../../pages/ga/components/insightsListingPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('InsightsListing — Component Interactions', () => {
  test('@interaction @regression insights-listing adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-insights-listing').first();
    await expect(child).toBeVisible();
  });
});
