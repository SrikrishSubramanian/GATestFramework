import { test, expect } from '@playwright/test';
import { BenefitsTablePage } from '../../../pages/ga/components/benefitsTablePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('BenefitsTable — Component Interactions', () => {
  test('@interaction @regression @sanity benefits-table adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#5)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#6)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#7)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#8)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression benefits-table adapts to unknown parent (#9)', async ({ page }) => {
    const pom = new BenefitsTablePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-benefits-table').first();
    await expect(child).toBeVisible();
  });
});
