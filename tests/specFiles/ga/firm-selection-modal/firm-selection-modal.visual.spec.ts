import { test, expect } from '@playwright/test';
import { FirmSelectionModalPage } from '../../../pages/ga/components/firmSelectionModalPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('FirmSelectionModal — Visual Regression', () => {
  test('@visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FirmSelectionModalPage(page);
    await pom.navigate(BASE());
    // Modal is hidden until its trigger is clicked
    await page.locator('a[data-modal]').first().click();
    const el = page.locator('.cmp-firm-selection-modal').first();
    await expect(el).toHaveScreenshot('firm-selection-modal-desktop.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression @mobile Mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FirmSelectionModalPage(page);
    await pom.navigate(BASE());
    // Modal is hidden until its trigger is clicked
    await page.locator('a[data-modal]').first().click();
    const el = page.locator('.cmp-firm-selection-modal').first();
    await expect(el).toHaveScreenshot('firm-selection-modal-mobile.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FirmSelectionModalPage(page);
    await pom.navigate(BASE());
    // Modal is hidden until its trigger is clicked
    await page.locator('a[data-modal]').first().click();
    const el = page.locator('.cmp-firm-selection-modal').first();
    await expect(el).toHaveScreenshot('firm-selection-modal-tablet.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
