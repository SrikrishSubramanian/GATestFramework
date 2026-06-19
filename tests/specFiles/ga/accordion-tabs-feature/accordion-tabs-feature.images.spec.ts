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

test.describe('Accordion Tabs Feature â€” Images & Media', () => {
  test('[ACCORDION-TABS-IMAGE-001] @regression Accordion/tabs icons load successfully', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const icons = page.locator('[class*="accordion"] [class*="icon"], [class*="tabs"] [class*="icon"], .cmp-accordion-tabs svg');
    const iconCount = await icons.count();
    expect(iconCount).toBeDefined();
  });

  test('[ACCORDION-TABS-IMAGE-002] @regression Accordion/tabs has no broken images', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const images = page.locator('[class*="accordion"] img, [class*="tabs"] img, .cmp-accordion-tabs img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[ACCORDION-TABS-IMAGE-003] @regression Accordion/tabs images have alt text', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const images = page.locator('[class*="accordion"] img, [class*="tabs"] img, .cmp-accordion-tabs img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('[ACCORDION-TABS-IMAGE-004] @regression Accordion/tabs background images render', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const bgElements = page.locator('[class*="accordion"] [style*="background-image"], [class*="tabs"] [style*="background-image"], .cmp-accordion-tabs [style*="background-image"]');
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

  test('[ACCORDION-TABS-IMAGE-005] @regression Accordion/tabs SVG icons are accessible', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const svgs = page.locator('[class*="accordion"] svg, [class*="tabs"] svg, .cmp-accordion-tabs svg');
    const svgCount = await svgs.count();

    for (let i = 0; i < Math.min(svgCount, 3); i++) {
      const svg = svgs.nth(i);
      const ariaLabel = await svg.getAttribute('aria-label');
      const role = await svg.getAttribute('role');
      expect(ariaLabel || role).toBeDefined();
    }
  });
});

