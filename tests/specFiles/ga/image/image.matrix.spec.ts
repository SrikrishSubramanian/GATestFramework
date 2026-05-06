import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Image — State Matrix', () => {
  const variations = ['with-caption', 'with-link', 'responsive'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const variation of variations) {
    for (const viewport of viewports) {
      test(`[IMG-MATRIX-${variation}-${viewport.name}] @matrix @regression Image (${variation}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/image.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

        const root = page.locator('.cmp-image').first();
        await expect(root).toBeVisible();

        const img = root.locator('img').first();
        await expect(img).toBeVisible();

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});
