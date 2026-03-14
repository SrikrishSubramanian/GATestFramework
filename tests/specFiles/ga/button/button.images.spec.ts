import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import { scanImages, attachImageScanResults } from '../../../utils/broken-image-detector';
import ENV from '../../../utils/env';
import { loginToAEMAuthor } from '../../../utils/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

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
  test('[BTN-024] @regression No broken images', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('[BTN-025] @regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('[BTN-026] @regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('[BTN-027] @regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
