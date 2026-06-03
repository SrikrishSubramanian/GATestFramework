import { test, expect } from '@playwright/test';
import { GridContainerPage } from '../../../pages/ga/components/gridContainerPage';
import { scanImages, attachImageScanResults } from '../../../utils/generation/broken-image-detector';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('GridContainer — Image Health', () => {
  test('@regression No broken images', async ({ page }, testInfo) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-grid-container');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('@regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-grid-container');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('@regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-grid-container');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('@regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-grid-container');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
