import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import { scanImages, attachImageScanResults } from '../../../utils/generation/broken-image-detector';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Button — Image Health', () => {
  test('[BTN-024] @regression No broken images', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('[BTN-025] @regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('[BTN-026] @regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('[BTN-027] @regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.button');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
