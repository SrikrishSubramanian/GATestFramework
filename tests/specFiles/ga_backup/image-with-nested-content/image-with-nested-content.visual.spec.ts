import { test, expect } from '@playwright/test';
import { ImageWithNestedContentPage } from '../../../pages/ga/components/imageWithNestedContentPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('ImageWithNestedContent — Visual Regression', () => {
  // Component may have 0 height when DAM images are missing locally.
  // Screenshot the parent wrapper instead which includes the absolute-positioned overlay.
  test('@visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    // Use the wrapping GridColumn which has actual height from the overlay content
    const wrapper = page.locator('.image-with-nested-content.aem-GridColumn').first();
    if (await wrapper.count() === 0) {
      // Fallback: screenshot the main-par
      await expect(page.locator('.main-par, [class*="main-par"]').first())
        .toHaveScreenshot('iwnc-page-desktop.png', { maxDiffPixelRatio: 0.01, animations: 'disabled' });
      return;
    }
    await expect(wrapper).toHaveScreenshot('iwnc-desktop.png', { maxDiffPixelRatio: 0.01, animations: 'disabled' });
  });

  test('@visual @regression @mobile Mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator('.image-with-nested-content.aem-GridColumn').first();
    if (await wrapper.count() === 0) {
      await expect(page.locator('.main-par, [class*="main-par"]').first())
        .toHaveScreenshot('iwnc-page-mobile.png', { maxDiffPixelRatio: 0.01, animations: 'disabled' });
      return;
    }
    await expect(wrapper).toHaveScreenshot('iwnc-mobile.png', { maxDiffPixelRatio: 0.01, animations: 'disabled' });
  });

  test('@visual @regression Tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator('.image-with-nested-content.aem-GridColumn').first();
    if (await wrapper.count() === 0) {
      await expect(page.locator('.main-par, [class*="main-par"]').first())
        .toHaveScreenshot('iwnc-page-tablet.png', { maxDiffPixelRatio: 0.01, animations: 'disabled' });
      return;
    }
    await expect(wrapper).toHaveScreenshot('iwnc-tablet.png', { maxDiffPixelRatio: 0.01, animations: 'disabled' });
  });
});
