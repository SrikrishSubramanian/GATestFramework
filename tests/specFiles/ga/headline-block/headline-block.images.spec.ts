import { test, expect } from '@playwright/test';
import { HeadlineBlockPage } from '../../../pages/ga/components/headlineBlockPage';
import { scanImages, attachImageScanResults } from '../../../utils/infra/broken-image-detector';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});

test.describe('HeadlineBlock — Image Health', () => {
  test('@regression No broken images', async ({ page }, testInfo) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.ga-headline-block');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('@regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.ga-headline-block');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('@regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.ga-headline-block');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('@regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const results = await scanImages(page, '.ga-headline-block');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
