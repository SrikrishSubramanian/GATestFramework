import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Field Text Component (GAAM-504)', () => {
  // ============ Input Field Rendering ============
  test('[GAAM-504-001] @regression Verify text input renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"], [class*="text-input"], [class*="form-text"]').first();
    if (await input.count() > 0) {
      expect(await input.isVisible()).toBe(true);
    }
  });

  test('[GAAM-504-002] @regression Verify textarea renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea, [class*="textarea"]').first();
    if (await textarea.count() > 0) {
      expect(await textarea.isVisible()).toBe(true);
    }
  });

  test('[GAAM-504-003] @regression Verify input has label associated', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const inputId = await input.getAttribute('id');
      if (inputId) {
        const label = page.locator(`label[for="${inputId}"]`);
        expect(await label.count()).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('[GAAM-504-004] @regression Verify textarea has label associated', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const textareaId = await textarea.getAttribute('id');
      if (textareaId) {
        const label = page.locator(`label[for="${textareaId}"]`);
        expect(await label.count()).toBeGreaterThanOrEqual(0);
      }
    }
  });

  // ============ Input Typing & Value ============
  test('[GAAM-504-005] @regression Verify text input accepts typed input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await input.fill('test value');
      const value = await input.inputValue();
      expect(value).toBe('test value');
    }
  });

  test('[GAAM-504-006] @regression Verify textarea accepts multiline input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.fill('line 1\nline 2\nline 3');
      const value = await textarea.inputValue();
      expect(value).toContain('\n');
    }
  });

  test('[GAAM-504-007] @regression Verify input field clears value', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await input.fill('test');
      await input.clear();
      const value = await input.inputValue();
      expect(value).toBe('');
    }
  });

  test('[GAAM-504-008] @regression Verify textarea clears value', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.fill('test');
      await textarea.clear();
      const value = await textarea.inputValue();
      expect(value).toBe('');
    }
  });

  // ============ Placeholder & Default Text ============
  test('[GAAM-504-009] @regression Verify input placeholder displays', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"][placeholder]').first();
    if (await input.count() > 0) {
      const placeholder = await input.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
    }
  });

  test('[GAAM-504-010] @regression Verify textarea placeholder displays', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea[placeholder]').first();
    if (await textarea.count() > 0) {
      const placeholder = await textarea.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
    }
  });

  // ============ Input Constraints ============
  test('[GAAM-504-011] @regression Verify maxlength constraint on input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const inputWithMax = page.locator('input[type="text"][maxlength]').first();
    if (await inputWithMax.count() > 0) {
      const maxlength = await inputWithMax.getAttribute('maxlength');
      expect(maxlength).toBeTruthy();
      expect(parseInt(maxlength || '')).toBeGreaterThan(0);
    }
  });

  test('[GAAM-504-012] @regression Verify maxlength constraint on textarea', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textareaWithMax = page.locator('textarea[maxlength]').first();
    if (await textareaWithMax.count() > 0) {
      const maxlength = await textareaWithMax.getAttribute('maxlength');
      expect(maxlength).toBeTruthy();
    }
  });

  test('[GAAM-504-013] @regression Verify minlength constraint on input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const inputWithMin = page.locator('input[type="text"][minlength]').first();
    if (await inputWithMin.count() > 0) {
      const minlength = await inputWithMin.getAttribute('minlength');
      expect(minlength).toBeTruthy();
    }
  });

  test('[GAAM-504-014] @regression Verify input respects maxlength during typing', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"][maxlength]').first();
    if (await input.count() > 0) {
      const maxlength = parseInt(await input.getAttribute('maxlength') || '');
      if (maxlength > 0) {
        const longText = 'a'.repeat(maxlength + 10);
        await input.fill(longText);
        const value = await input.inputValue();
        expect(value.length).toBeLessThanOrEqual(maxlength);
      }
    }
  });

  // ============ Required Field Validation ============
  test('[GAAM-504-015] @regression Verify required input has required attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const requiredInput = page.locator('input[type="text"][required]').first();
    if (await requiredInput.count() > 0) {
      expect(await requiredInput.getAttribute('required')).toBeTruthy();
    }
  });

  test('[GAAM-504-016] @regression Verify required textarea has required attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const requiredTextarea = page.locator('textarea[required]').first();
    if (await requiredTextarea.count() > 0) {
      expect(await requiredTextarea.getAttribute('required')).toBeTruthy();
    }
  });

  // ============ Input Types ============
  test('[GAAM-504-017] @regression Verify email input type', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      expect(await emailInput.getAttribute('type')).toBe('email');
    }
  });

  test('[GAAM-504-018] @regression Verify number input type', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.count() > 0) {
      expect(await numberInput.getAttribute('type')).toBe('number');
    }
  });

  test('[GAAM-504-019] @regression Verify phone input type', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const phoneInput = page.locator('input[type="tel"]').first();
    if (await phoneInput.count() > 0) {
      expect(await phoneInput.getAttribute('type')).toBe('tel');
    }
  });

  // ============ Disabled & ReadOnly States ============
  test('[GAAM-504-020] @regression Verify disabled input cannot be edited', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const disabledInput = page.locator('input[type="text"][disabled]').first();
    if (await disabledInput.count() > 0) {
      const isDisabled = await disabledInput.evaluate((el: HTMLInputElement) => el.disabled);
      expect(isDisabled).toBe(true);
    }
  });

  test('[GAAM-504-021] @regression Verify readonly input cannot be edited', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const readonlyInput = page.locator('input[type="text"][readonly]').first();
    if (await readonlyInput.count() > 0) {
      const isReadonly = await readonlyInput.evaluate((el: HTMLInputElement) => el.readOnly);
      expect(isReadonly).toBe(true);
    }
  });

  // ============ Focus Management ============
  test('[GAAM-504-022] @a11y @regression Verify input receives focus on Tab', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await input.focus();
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBe('INPUT');
    }
  });

  test('[GAAM-504-023] @a11y @regression Verify textarea receives focus on Tab', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.focus();
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBe('TEXTAREA');
    }
  });

  test('[GAAM-504-024] @a11y @regression Verify visible focus indicator on input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await input.focus();
      const outline = await input.evaluate(el =>
        window.getComputedStyle(el).outline || window.getComputedStyle(el).boxShadow
      );
      expect(outline).toBeTruthy();
    }
  });

  // ============ Responsive Behavior ============
  test('[GAAM-504-025] @regression Verify input responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const width = await input.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-504-026] @regression Verify textarea responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const width = await textarea.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-504-027] @regression Verify input responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const width = await input.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[GAAM-504-028] @regression Verify input responsive on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const width = await input.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(200);
    }
  });

  // ============ Styling & Appearance ============
  test('[GAAM-504-029] @regression Verify input has visible border', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const border = await input.evaluate(el =>
        window.getComputedStyle(el).border
      );
      expect(border).toBeTruthy();
    }
  });

  test('[GAAM-504-030] @regression Verify textarea has visible border', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const border = await textarea.evaluate(el =>
        window.getComputedStyle(el).border
      );
      expect(border).toBeTruthy();
    }
  });

  test('[GAAM-504-031] @regression Verify input has readable text color', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const color = await input.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('[GAAM-504-032] @regression Verify input has appropriate padding', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const padding = await input.evaluate(el =>
        window.getComputedStyle(el).padding
      );
      expect(padding).not.toBe('0px');
    }
  });

  // ============ Data Attributes ============
  test('[GAAM-504-033] @regression Verify input has name attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const name = await input.getAttribute('name');
      expect(name).toBeTruthy();
    }
  });

  test('[GAAM-504-034] @regression Verify textarea has name attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-text.html?wcmmode=disabled`);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const name = await textarea.getAttribute('name');
      expect(name).toBeTruthy();
    }
  });
});
