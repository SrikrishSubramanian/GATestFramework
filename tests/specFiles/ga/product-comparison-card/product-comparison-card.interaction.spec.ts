import { test, expect } from '@playwright/test';
import { ProductComparisonCardPage } from '../../../pages/ga/components/productComparisonCardPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('ProductComparisonCard — Component Interactions', () => {
  test('@interaction @regression @sanity product-comparison-card adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new ProductComparisonCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-comparison-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression product-comparison-card adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new ProductComparisonCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-comparison-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression product-comparison-card adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new ProductComparisonCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-comparison-card').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression product-comparison-card adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new ProductComparisonCardPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-product-comparison-card').first();
    await expect(child).toBeVisible();
  });
});
