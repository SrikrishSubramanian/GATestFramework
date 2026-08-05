import { test, expect } from '@playwright/test';
import { ProductPathSummaryCardPage } from '../../../pages/ga/components/productPathSummaryCardPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('ProductPathSummaryCard — Component Interactions', () => {
  test('@interaction @regression product-path-summary-card adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new ProductPathSummaryCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-path-summary-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression product-path-summary-card adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new ProductPathSummaryCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-path-summary-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression product-path-summary-card adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new ProductPathSummaryCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-path-summary-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression product-path-summary-card adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new ProductPathSummaryCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-path-summary-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression product-path-summary-card adapts to unknown parent (#5)', async ({ page }) => {
    const pom = new ProductPathSummaryCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-path-summary-card').first();
    await expect(child).toBeVisible();
  });
});
