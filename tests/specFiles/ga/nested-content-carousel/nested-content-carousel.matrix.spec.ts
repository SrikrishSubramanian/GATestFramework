import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';

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

test.describe('Nested Content Carousel â€” State Matrix', () => {
  const autoplay = ['on', 'off'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const play of autoplay) {
    for (const viewport of viewports) {
      test(`[CAROUSEL-MATRIX-autoplay-${play}-${viewport.name}] @matrix @regression Nested Carousel (autoplay=${play}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        const url = resolveComponentUrl('nested-content-carousel');
    await page.goto(url, { waitUntil: 'networkidle' });

        const root = page.locator('.cmp-nested-content-carousel').first();
        await expect(root).toBeVisible();

        const slides = root.locator('[role="group"], .slide');
        expect(await slides.count()).toBeGreaterThan(0);

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});

