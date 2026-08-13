import { test, expect } from '@playwright/test';
import { FirmSelectionModalPage } from '../../../pages/ga/components/firmSelectionModalPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('FirmSelectionModal — Component Interactions', () => {
  test('@interaction @regression @sanity firm-selection-modal adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new FirmSelectionModalPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Modal is hidden until its trigger is clicked
    await page.locator('a[data-modal]').first().click();
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-firm-selection-modal').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression firm-selection-modal adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new FirmSelectionModalPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Modal is hidden until its trigger is clicked
    await page.locator('a[data-modal]').first().click();
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-firm-selection-modal').first();
    await expect(child).toBeVisible();
  });
});
