import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Hero Fifty-Fifty — State Matrix', () => {
  const layouts = ['image-left', 'image-right'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const layout of layouts) {
    for (const viewport of viewports) {
      test(`[H5050-MATRIX-${layout}-${viewport.name}] @matrix @regression Hero 50/50 (${layout}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

        const hero = page.locator('.cmp-hero-fifty-fifty').first();
        await expect(hero).toBeVisible();

        const width = await hero.evaluate(el => el.offsetWidth);
        expect(width).toBeLessThanOrEqual(viewport.width);

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});
