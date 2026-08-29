import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Breadcrumb — State Matrix', () => {
  const themeVariants = ['light', 'dark'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const theme of themeVariants) {
    for (const viewport of viewports) {
      test(`[BREAD-MATRIX-${theme}-${viewport.name}] @matrix @regression Breadcrumb (${theme}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/breadcrumb.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

        const root = page.locator('.cmp-breadcrumb').first();
        await expect(root).toBeVisible();

        const items = root.locator('[role="listitem"], li');
        expect(await items.count()).toBeGreaterThan(0);

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});
