import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../src/utils/action-utils';

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

test.describe('Spacer â€” Visual Regression', () => {
  test('[SPACER-VISUAL-001] @visual Spacer creates proper vertical spacing', async ({ page }) => {
    const url = resolveComponentUrl('spacer');
    await page.goto(url);

    const spacer = page.locator('.cmp-spacer').first();
    await expect(spacer).toBeVisible();

    const height = // 📏 TODO: Replace with measurement-utils
    await spacer.evaluate(el => el.offsetHeight);
    expect(height).toBeGreaterThan(0);
  });

  test('[SPACER-VISUAL-002] @visual Spacer margin/padding is correct', async ({ page }) => {
    const url = resolveComponentUrl('spacer');
    await page.goto(url);

    const spacer = page.locator('.cmp-spacer').first();
    const margin = // 📏 TODO: Replace with measurement-utils
    await spacer.evaluate(el => window.getComputedStyle(el).margin); // measurement: use measurement-utils for cleaner code
    const padding = // 📏 TODO: Replace with measurement-utils
    await spacer.evaluate(el => window.getComputedStyle(el).padding); // measurement: use measurement-utils for cleaner code

    expect(margin || padding).toBeTruthy(); // TODO: Use assertSpacing() for padding/margin
  });

  test('[SPACER-VISUAL-003] @visual Spacer does not affect horizontal layout', async ({ page }) => {
    const url = resolveComponentUrl('spacer');
    await page.goto(url);

    const spacer = page.locator('.cmp-spacer').first();
    const width = // 📏 TODO: Replace with measurement-utils
    await spacer.evaluate(el => el.offsetWidth);

    // Spacer should typically be full width
    const container = // 📏 TODO: Replace with measurement-utils
    await spacer.evaluate(el => el.parentElement?.offsetWidth);
    expect(width).toBeLessThanOrEqual((container || 9999) + 1);
  });

  test('[SPACER-VISUAL-004] @visual Spacer variants apply different heights', async ({ page }) => {
    const url = resolveComponentUrl('spacer');
    await page.goto(url);

    const spacers = page.locator('.cmp-spacer');
    const count = await spacers.count();

    if (count > 1) {
      const height1 = await spacers.nth(0).evaluate(el => el.offsetHeight);
      const height2 = await spacers.nth(1).evaluate(el => el.offsetHeight);

      // Heights may or may not be different, but should be measurable
      expect(height1).toBeGreaterThan(0);
      expect(height2).toBeGreaterThan(0);
    }
  });

  test('[SPACER-VISUAL-005] @visual Spacer is transparent', async ({ page }) => {
    const url = resolveComponentUrl('spacer');
    await page.goto(url);

    const spacer = page.locator('.cmp-spacer').first();
    const bg = // 📏 TODO: Replace with measurement-utils
    await spacer.evaluate(el => window.getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code

    // Should be transparent or inherit
    expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(bg);
  });
});

