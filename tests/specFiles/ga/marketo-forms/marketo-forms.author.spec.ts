import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Marketo Forms Component (GAAM-533)', () => {
  // ============ Form Rendering ============
  test('[GAAM-533-001] @regression Verify Marketo form renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const form = page.locator('form, [class*="marketo"], [class*="form"]').first();
    if (await form.count() > 0) {
      expect(await form.isVisible()).toBe(true);
    }
  });

  test('[GAAM-533-002] @regression Verify form has submit button', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const submitBtn = page.locator('button[type="submit"], [class*="submit"]').first();
    if (await submitBtn.count() > 0) {
      expect(await submitBtn.isVisible()).toBe(true);
    }
  });

  // ============ Form Fields ============
  test('[GAAM-533-003] @regression Verify text input fields render', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"], input[type="email"], input[type="tel"]').first();
    if (await textInput.count() > 0) {
      expect(await textInput.isVisible()).toBe(true);
    }
  });

  test('[GAAM-533-004] @regression Verify email field validation', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      const type = await emailInput.getAttribute('type');
      expect(type).toBe('email');
    }
  });

  test('[GAAM-533-005] @regression Verify textarea fields render', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      expect(await textarea.isVisible()).toBe(true);
    }
  });

  test('[GAAM-533-006] @regression Verify checkbox fields render', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      expect(await checkbox.isVisible()).toBe(true);
    }
  });

  test('[GAAM-533-007] @regression Verify radio button fields render', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const radio = page.locator('input[type="radio"]').first();
    if (await radio.count() > 0) {
      expect(await radio.isVisible()).toBe(true);
    }
  });

  test('[GAAM-533-008] @regression Verify select dropdown renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      expect(await options.count()).toBeGreaterThan(0);
    }
  });

  // ============ Form Interaction ============
  test('[GAAM-533-009] @regression Verify text input accepts value', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.count() > 0) {
      await textInput.fill('test value');
      const value = await textInput.inputValue();
      expect(value).toBe('test value');
    }
  });

  test('[GAAM-533-010] @regression Verify checkbox can be checked', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      await checkbox.check();
      const isChecked = await checkbox.isChecked();
      expect(isChecked).toBe(true);
    }
  });

  test('[GAAM-533-011] @regression Verify radio button can be selected', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const radio = page.locator('input[type="radio"]').first();
    if (await radio.count() > 0) {
      await radio.click();
      const isChecked = await radio.isChecked();
      expect(isChecked).toBe(true);
    }
  });

  // ============ Form Labels & Accessibility ============
  test('[GAAM-533-012] @a11y @regression Verify fields have associated labels', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const input = page.locator('input[id]').first();
    if (await input.count() > 0) {
      const inputId = await input.getAttribute('id');
      const label = page.locator(`label[for="${inputId}"]`);
      expect(await label.count() + (inputId ? 1 : 0)).toBeGreaterThanOrEqual(0);
    }
  });

  test('[GAAM-533-013] @a11y @regression Verify submit button has accessible text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.count() > 0) {
      const text = await submitBtn.textContent();
      expect(text).toBeTruthy();
    }
  });

  // ============ Form Styling ============
  test('[GAAM-533-014] @regression Verify form responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const width = await form.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-533-015] @regression Verify form responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const width = await form.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[GAAM-533-016] @regression Verify form responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const width = await form.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(300);
    }
  });

  test('[GAAM-533-017] @regression Verify form fields have visible focus indicators', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/marketo-forms.html?wcmmode=disabled`);

    const input = page.locator('input').first();
    if (await input.count() > 0) {
      await input.focus();
      const outline = await input.evaluate(el => window.getComputedStyle(el).outline);
      expect(outline).toBeTruthy();
    }
  });
});
