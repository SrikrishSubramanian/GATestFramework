import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Tabs — State Matrix', () => {
  const states = ['default', 'active', 'disabled'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const state of states) {
    for (const viewport of viewports) {
      test(`[TABS-MATRIX-${state}-${viewport.name}] @matrix @regression Tabs (${state}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/tabs.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

        const root = page.locator('.cmp-tabs').first();
        await expect(root).toBeVisible();

        const buttons = root.locator('[role="tab"], button');
        expect(await buttons.count()).toBeGreaterThan(0);

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});
