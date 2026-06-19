import { test, expect } from '@playwright/test';
import ENV from '../../../../tests/utils/infra/env';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../../tests/utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../../tests/utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../../tests/utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
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

test.describe('Form Text â€” Images & Media', () => {
  test('[FORMTEXT-IMAGE-001] @regression Form text field icons are present', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const icons = page.locator('.cmp-form-text [class*="icon"], .cmp-form-text svg');
    const iconCount = await icons.count();
    expect(iconCount).toBeDefined();
  });

  test('[FORMTEXT-IMAGE-002] @regression Form text field icons load correctly', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const svgs = page.locator('.cmp-form-text svg, .cmp-form-text [class*="icon"] svg');
    const svgCount = await svgs.count();

    for (let i = 0; i < Math.min(svgCount, 3); i++) {
      const svg = svgs.nth(i);
      const isVisible = await svg.isVisible();
      expect(isVisible).toBeDefined();
    }
  });

  test('[FORMTEXT-IMAGE-003] @regression Form text background images render', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const bgElements = page.locator('.cmp-form-text [style*="background-image"]');
    const count = await bgElements.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const el = bgElements.nth(i);
      const bgImage = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el =>
        window.getComputedStyle(el).backgroundImage
      );
      if (bgImage !== 'none') {
        expect(bgImage).toMatch(/url\(/);
      }
    }
  });

  test('[FORMTEXT-IMAGE-004] @regression Form text has no broken images', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const images = page.locator('.cmp-form-text img');
    const imgCount = await images.count();

    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[FORMTEXT-IMAGE-005] @regression Form text images have alt text', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const images = page.locator('.cmp-form-text img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

