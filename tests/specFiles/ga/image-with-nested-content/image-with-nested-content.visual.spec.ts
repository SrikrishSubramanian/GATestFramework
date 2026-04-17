import { test, expect } from '@playwright/test';
import { ImageWithNestedContentPage } from '../../../pages/ga/components/imageWithNestedContentPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('ImageWithNestedContent — Visual Regression', () => {
  test('@visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-image-with-nested-content').first();
    await expect(el).toHaveScreenshot('image-with-nested-content-desktop.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression @mobile Mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-image-with-nested-content').first();
    await expect(el).toHaveScreenshot('image-with-nested-content-mobile.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-image-with-nested-content').first();
    await expect(el).toHaveScreenshot('image-with-nested-content-tablet.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
