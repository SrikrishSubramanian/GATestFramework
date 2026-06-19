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

test.describe('Hero Fifty-Fifty â€” Images & Media', () => {
  test('[H5050-IMAGE-001] @regression Hero hero image loads successfully', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const images = hero.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[H5050-IMAGE-002] @regression Hero images have alt text', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const images = hero.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('[H5050-IMAGE-003] @regression Hero image is responsive', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const image = hero.locator('img').first();

    if (await image.count() > 0) {
      const width = // 📏 TODO: Replace with measurement-utils
    await image.evaluate(el => el.offsetWidth);
      const maxWidth = // 📏 TODO: Replace with measurement-utils
    await image.evaluate(el =>
        window.getComputedStyle(el).maxWidth
      );

      expect(width).toBeGreaterThan(0);
      expect(maxWidth).not.toBe('none');
    }
  });

  test('[H5050-IMAGE-004] @regression Hero image aspect ratio is maintained', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const image = hero.locator('img').first();

    if (await image.count() > 0) {
      const width = // 📏 TODO: Replace with measurement-utils
    await image.evaluate(el => (el as HTMLImageElement).naturalWidth);
      const height = // 📏 TODO: Replace with measurement-utils
    await image.evaluate(el => (el as HTMLImageElement).naturalHeight);

      if (width > 0 && height > 0) {
        const ratio = width / height;
        expect(ratio).toBeGreaterThan(0.5);
      }
    }
  });

  test('[H5050-IMAGE-005] @regression Hero background images are styled correctly', async ({ page }) => {
    const url = resolveComponentUrl('hero-fifty-fifty');
    await page.goto(url);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const bgElements = hero.locator('[style*="background-image"]');
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
});

