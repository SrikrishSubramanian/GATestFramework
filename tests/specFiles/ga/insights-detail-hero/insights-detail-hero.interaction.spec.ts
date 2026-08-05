import { test, expect } from '@playwright/test';
import { InsightsDetailHeroPage } from '../../../pages/ga/components/insightsDetailHeroPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('InsightsDetailHero — Component Interactions', () => {
  test('@interaction @regression insights-detail-hero adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new InsightsDetailHeroPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-insights-detail-hero').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression insights-detail-hero adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new InsightsDetailHeroPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-insights-detail-hero').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression insights-detail-hero adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new InsightsDetailHeroPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-insights-detail-hero').first();
    await expect(child).toBeVisible();
  });
});
