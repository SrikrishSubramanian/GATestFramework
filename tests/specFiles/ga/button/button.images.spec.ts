import { scanImages, attachImageScanResults } from '../../../utils/infra/image-scan-utils';
import { test, expect } from '../../../utils/infra/persistent-context';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
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
