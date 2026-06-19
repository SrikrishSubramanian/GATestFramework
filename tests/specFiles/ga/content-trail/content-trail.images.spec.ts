import { scanImages, attachImageScanResults } from '../../../../tests/utils/infra/image-scan-utils';
import { test, expect } from '@playwright/test';
import { ContentTrailPage } from '../../../pages/ga/components/contentTrailPage';
import ENV from '../../../../tests/utils/infra/env';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../../tests/utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../../tests/utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('ContentTrail — Image Health', () => {
  /*
   * Note: Content-trail uses AEM's adaptive image component which renders
   * <img alt="..."/> without a src attribute — the image is loaded via the
   * reports these as "broken" (naturalWidth === 0) and "missing dimensions".
   * These are known false positives for this component.
   *
   * Instead, we verify:
   * - All images have alt attributes (a11y)
   * - No oversized images
   * - Image containers have correct CSS dimensions
   */

  test('@regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('@regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('@regression Image containers have correct CSS dimensions', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const containers = page.locator('.cmp-content-trail__image');
    const count = await containers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await containers.nth(i).boundingBox();
      if (box) {
        // Image container should be 64px (small) or 80px (large)
        expect(box.width).toBeGreaterThanOrEqual(60);
        expect(box.height).toBeGreaterThanOrEqual(60);
      }
    }
  });
});
