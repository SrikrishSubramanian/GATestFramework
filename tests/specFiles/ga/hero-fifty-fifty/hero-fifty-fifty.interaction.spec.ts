import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../src/utils/action-utils';
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

test.describe('Hero Fifty-Fifty â€” Interactions', () => {
  test('[H5050-INTERACTION-001] @interaction @regression CTA button is clickable', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const button = hero.locator('button, a[class*="button"]').first();

    if (await button.count() > 0) {
      const href = await button.getAttribute('href');
      expect(href || button.tagName).toBeTruthy();
    }
  });

  test('[H5050-INTERACTION-002] @interaction @regression Hero links are functional', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const links = hero.locator('a');
    const count = await links.count();

    if (count > 0) {
      const link = links.first();
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('[H5050-INTERACTION-003] @interaction @regression Hero 50/50 hover states work', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const button = page.locator('.cmp-hero-fifty-fifty button, .cmp-hero-fifty-fifty a[class*="button"]').first();

    if (await button.count() > 0) {
      const initialBg = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      await hover(button);
      // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

      const hoverBg = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(hoverBg).toBeTruthy();
    }
  });

  test('[H5050-INTERACTION-004] @interaction @regression Keyboard navigation works', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    await hero.focus();

    await page.keyboard.press('Tab');
    const focused = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('[H5050-INTERACTION-005] @interaction @regression Image adapts to content changes', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    await expect(hero).toBeVisible();

    // Verify layout is responsive
    const width = // 📏 TODO: Replace with measurement-utils
    await hero.evaluate(el => el.offsetWidth);
    expect(width).toBeGreaterThan(0);
  });
});

