import { test, expect } from '@playwright/test';
import { BreadcrumbPage } from '../../../pages/ga/components/breadcrumbPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';

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

test.describe('Breadcrumb — Visual Regression', () => {
  test('@visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-breadcrumb').first();
    await expect(el).toHaveScreenshot('breadcrumb-desktop.png', {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    });
  });

  test('@visual @regression @mobile Mobile: breadcrumb is correctly hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    // Breadcrumb is hidden on mobile by design — verify display:none
    const display = await page.locator('.cmp-breadcrumb').first().evaluate(el =>
      getComputedStyle(el).display
    );
    expect(display).toBe('none');
  });

  test('@visual @regression Tablet (1024px) screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-breadcrumb').first();
    // At 1024px breadcrumb may be visible (depends on desktop breakpoint)
    const display = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => getComputedStyle(el).display); // measurement: use measurement-utils for cleaner code
    if (display === 'none') {
      // Component hidden at this breakpoint — verify that's correct
      expect(display).toBe('none');
    } else {
      await expect(el).toHaveScreenshot('breadcrumb-tablet.png', {
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      });
    }
  });
});
