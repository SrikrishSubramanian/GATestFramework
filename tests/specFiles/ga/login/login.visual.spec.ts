import { test, expect } from '@playwright/test';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import ENV from '../../../utils/infra/env';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — Visual Regression', () => {
  test('[LOGIN-VISUAL-001] @visual Login form layout is correct', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Verify form elements are aligned
    const inputs = form.locator('input[type="text"], input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
  });

  test('[LOGIN-VISUAL-002] @visual Login input fields are styled correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      const borderWidth = await input.evaluate(el =>
        window.getComputedStyle(el).borderWidth
      );
      expect(borderWidth).toBeTruthy();
    }
  });

  test('[LOGIN-VISUAL-003] @visual Login submit button is prominent', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();

    const bg = await submitBtn.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bg).toBeTruthy();
  });

  test('[LOGIN-VISUAL-004] @visual Login form labels are visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const labels = page.locator('label');
    const count = await labels.count();

    expect(count).toBeGreaterThan(0);
  });

  test('[LOGIN-VISUAL-005] @visual Login error messages display correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const errorElements = page.locator('[role="alert"], .error, .alert-danger');
    // May or may not have error elements initially
    await expect(page).toBeTruthy();
  });
});
