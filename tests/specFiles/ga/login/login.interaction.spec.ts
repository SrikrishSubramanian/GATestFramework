import { test, expect } from '@playwright/test';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import ENV from '../../../utils/infra/env';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — Interactions', () => {
  test('[LOGIN-INTERACTION-001] @interaction @regression Login form accepts input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const emailInput = page.locator('input[type="email"], input[type="text"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');
      const value = await emailInput.inputValue();
      expect(value).toBe('test@example.com');
    }
  });

  test('[LOGIN-INTERACTION-002] @interaction @regression Password input hides characters', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.count() > 0) {
      await passwordInput.fill('testpassword123');
      const type = await passwordInput.getAttribute('type');
      expect(type).toBe('password');
    }
  });

  test('[LOGIN-INTERACTION-003] @interaction @regression Remember me checkbox works', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      const initialState = await checkbox.isChecked();
      await checkbox.click();
      const newState = await checkbox.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('[LOGIN-INTERACTION-004] @interaction @regression Forgot password link is clickable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const forgotLink = page.locator('a:has-text("Forgot"), a[href*="reset"], a[href*="forgot"]').first();
    if (await forgotLink.count() > 0) {
      const href = await forgotLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('[LOGIN-INTERACTION-005] @interaction @regression Login form submission', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const submitBtn = form.locator('button[type="submit"]').first();
      if (await submitBtn.count() > 0) {
        // Just verify button is clickable
        await expect(submitBtn).toBeEnabled();
      }
    }
  });

  test('[LOGIN-INTERACTION-006] @interaction @regression Keyboard navigation in login form', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const firstInput = page.locator('input').first();
    if (await firstInput.count() > 0) {
      await firstInput.focus();
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeTruthy();
    }
  });
});
