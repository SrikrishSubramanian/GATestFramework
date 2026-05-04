import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Image with Nested Content — State Matrix', () => {
  const positions = ['left', 'right'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const position of positions) {
    for (const viewport of viewports) {
      test(`[IMG-NESTED-${position}-${viewport.name}] @matrix @regression Image with Content (${position}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/image-with-nested-content.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

        const root = page.locator('.cmp-image-with-nested-content').first();
        await expect(root).toBeVisible();

        const img = root.locator('img').first();
        const content = root.locator('[class*="content"]').first();

        await expect(img).toBeVisible();

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});
