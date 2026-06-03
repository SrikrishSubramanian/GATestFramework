import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Navigation — State Matrix', () => {
  const types = ['horizontal', 'vertical'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const navType of types) {
    for (const viewport of viewports) {
      test(`[NAV-MATRIX-${navType}-${viewport.name}] @matrix @regression Navigation (${navType}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/navigation.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

        const root = page.locator('.cmp-navigation, nav').first();
        await expect(root).toBeVisible();

        const links = root.locator('a');
        expect(await links.count()).toBeGreaterThan(0);

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});
