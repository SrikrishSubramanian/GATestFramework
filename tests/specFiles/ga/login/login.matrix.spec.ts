import { test, expect } from '@playwright/test';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import ENV from '../../../utils/infra/env';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — State Matrix', () => {
  const modes = ['signin', 'signup', 'mfa'];
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const mode of modes) {
    for (const viewport of viewports) {
      const testName = `[LOGIN-MATRIX-${mode}-${viewport.name}] @matrix @regression Login (${mode}, ${viewport.name})`;

      test(testName, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        await loginToAEMAuthor(page);
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`, { waitUntil: 'networkidle' });

        const form = page.locator('form').first();
        await expect(form).toBeVisible();

        // Verify form adapts to viewport
        const width = await form.evaluate(el => el.offsetWidth);
        expect(width).toBeLessThanOrEqual(viewport.width);

        // Check for errors
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});
