import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import { scanImages, attachImageScanResults } from '../../../utils/broken-image-detector';
import ENV from '../../../utils/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(`${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('Button — Image Health', () => {
  test('@regression No broken images', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('@regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('@regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('@regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
