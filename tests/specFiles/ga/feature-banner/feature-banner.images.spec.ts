import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import { scanImages, attachImageScanResults } from '../../../utils/generation/broken-image-detector';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('FeatureBanner — Image Health', () => {
  test('[FB-013] @regression No broken images', async ({ page }, testInfo) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.feature-banner');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('[FB-014] @regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.feature-banner');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('[FB-015] @regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.feature-banner');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('[FB-016] @regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.feature-banner');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
