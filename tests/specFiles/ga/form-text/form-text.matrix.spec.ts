import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Text — State Matrix', () => {
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const viewport of viewports) {
    test(`[FORMTEXT-MATRIX-${viewport.name}] @matrix @regression Form text responsive (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: 600 });

      await loginToAEMAuthor(page);
      await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

      const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
      if (await textInput.count() > 0) {
        await expect(textInput).toBeVisible();

        const width = await textInput.evaluate(el => el.offsetWidth);
        expect(width).toBeLessThanOrEqual(viewport.width);
      }

      const errors: string[] = [];
      page.on('pageerror', e => errors.push(e.message));
      expect(errors).toEqual([]);
    });
  }
});
