import { scanImages, attachImageScanResults } from '../../../utils/infra/image-scan-utils';
import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import { scanImages, attachImageScanResults } from '../../../utils/infra/broken-image-detector';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';

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

test.describe('TeaserCard — Image Health', () => {
  test('@regression No broken images within .cmp-teaser-card', async ({ page }, testInfo) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-teaser-card');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('@regression All card images have alt text', async ({ page }, testInfo) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-teaser-card');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('@regression No oversized card images (>500KB)', async ({ page }, testInfo) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-teaser-card');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('@regression Card images have explicit width/height (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.cmp-teaser-card');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
