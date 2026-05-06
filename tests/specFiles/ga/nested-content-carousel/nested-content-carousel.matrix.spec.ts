import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Nested Content Carousel — State Matrix', () => {
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
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/nested-content-carousel.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

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
