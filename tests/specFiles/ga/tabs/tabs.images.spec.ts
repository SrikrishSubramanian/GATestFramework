import { scanImages, attachImageScanResults } from '../../../../tests/utils/infra/image-scan-utils';
import { test, expect } from '@playwright/test';
import { TabsPage } from '../../../pages/ga/components/tabsPage';
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

test.describe('Tabs — Image Health', () => {
  test('@regression No broken images', async ({ page }, testInfo) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('@regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('@regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('@regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
