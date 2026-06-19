import { test, expect } from '@playwright/test';
import { ContentTrailPage } from '../../../pages/ga/components/contentTrailPage';
import ENV from '../../../../tests/utils/infra/env';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../../tests/utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../../tests/utils/infra/measurement-utils';

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

test.describe('ContentTrail — Visual Regression', () => {
  test('@visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-content-trail').first();
    await expect(el).toHaveScreenshot('content-trail-desktop.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression @mobile Mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-content-trail').first();
    await expect(el).toHaveScreenshot('content-trail-mobile.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-content-trail').first();
    await expect(el).toHaveScreenshot('content-trail-tablet.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
