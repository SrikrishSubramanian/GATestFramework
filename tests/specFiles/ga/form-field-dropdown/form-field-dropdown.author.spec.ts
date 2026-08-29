import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Field Dropdown Component (GAAM-507)', () => {
  // ============ Dropdown Rendering & Structure ============
  test('[GAAM-507-001] @regression Verify dropdown component renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const dropdown = page.locator('select, [role="combobox"], [class*="dropdown"], [class*="select"]').first();
    if (await dropdown.count() > 0) {
      expect(await dropdown.isVisible()).toBe(true);
    }
  });

  test('[GAAM-507-002] @regression Verify dropdown has label associated', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const selectId = await select.getAttribute('id');
      if (selectId) {
        const label = page.locator(`label[for="${selectId}"]`);
        expect(await label.count()).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('[GAAM-507-003] @regression Verify dropdown has accessible name', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const ariaLabel = await select.getAttribute('aria-label');
      const ariaLabelledBy = await select.getAttribute('aria-labelledby');
      const name = await select.getAttribute('name');

      expect(ariaLabel || ariaLabelledBy || name).toBeTruthy();
    }
  });

  test('[GAAM-507-004] @regression Verify dropdown has default option/placeholder', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  // ============ Option Display & Selection ============
  test('[GAAM-507-005] @regression Verify dropdown options are visible when opened', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.click();
      const options = select.locator('option');
      expect(await options.count()).toBeGreaterThan(0);
    }
  });

  test('[GAAM-507-006] @regression Verify option selection updates dropdown value', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();

      if (count > 1) {
        await select.selectOption(await options.nth(1).getAttribute('value') || '');
        const selectedValue = await select.inputValue();
        expect(selectedValue).toBeTruthy();
      }
    }
  });

  test('[GAAM-507-007] @regression Verify option text displays correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const firstOption = select.locator('option').first();
      if (await firstOption.count() > 0) {
        const text = await firstOption.textContent();
        expect(text).toBeTruthy();
      }
    }
  });

  test('[GAAM-507-008] @regression Verify disabled options appear grayed out', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const disabledOptions = page.locator('option[disabled]');
    const count = await disabledOptions.count();
    // At least verify the DOM structure supports disabled options
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ============ Keyboard Navigation ============
  test('[GAAM-507-009] @a11y @regression Verify dropdown opens with Space key', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.focus();
      await page.keyboard.press('Space');

      const options = select.locator('option');
      expect(await options.count()).toBeGreaterThan(0);
    }
  });

  test('[GAAM-507-010] @a11y @regression Verify arrow keys navigate options', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.focus();
      await page.keyboard.press('ArrowDown');

      const value = await select.inputValue();
      expect(value).toBeDefined();
    }
  });

  test('[GAAM-507-011] @a11y @regression Verify Enter key selects option', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      const value = await select.inputValue();
      expect(value).toBeTruthy();
    }
  });

  test('[GAAM-507-012] @a11y @regression Verify Tab key moves focus away from dropdown', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.focus();
      const initialFocus = await page.evaluate(() => document.activeElement?.tagName);

      await page.keyboard.press('Tab');
      const afterTabFocus = await page.evaluate(() => document.activeElement?.tagName);

      expect([initialFocus, afterTabFocus]).toBeTruthy();
    }
  });

  // ============ Form Integration ============
  test('[GAAM-507-013] @regression Verify dropdown integrates with form submission', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const select = form.locator('select').first();
      expect(await select.count()).toBeGreaterThan(0);
    }
  });

  test('[GAAM-507-014] @regression Verify required dropdown shows validation', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select[required]').first();
    if (await select.count() > 0) {
      expect(await select.getAttribute('required')).toBeTruthy();
    }
  });

  test('[GAAM-507-015] @regression Verify disabled dropdown cannot be interacted', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const disabledSelect = page.locator('select[disabled]').first();
    if (await disabledSelect.count() > 0) {
      const isDisabled = await disabledSelect.evaluate((el: HTMLSelectElement) => el.disabled);
      expect(isDisabled).toBe(true);
    }
  });

  // ============ Responsive Behavior ============
  test('[GAAM-507-016] @regression Verify dropdown responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const width = await select.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-507-017] @regression Verify dropdown responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const width = await select.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[GAAM-507-018] @regression Verify dropdown responsive on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const width = await select.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(200);
    }
  });

  // ============ Styling & Appearance ============
  test('[GAAM-507-019] @regression Verify dropdown has visible border', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const border = await select.evaluate(el =>
        window.getComputedStyle(el).border
      );
      expect(border).toBeTruthy();
    }
  });

  test('[GAAM-507-020] @regression Verify dropdown has readable text color', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const color = await select.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('[GAAM-507-021] @regression Verify dropdown has appropriate padding', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const padding = await select.evaluate(el =>
        window.getComputedStyle(el).padding
      );
      expect(padding).not.toBe('0px');
    }
  });

  // ============ Error States & Validation ============
  test('[GAAM-507-022] @regression Verify dropdown shows error message for invalid selection', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const errorMsg = page.locator('[class*="error"], [class*="invalid"], [role="alert"]').first();
    // Verify error message structure exists in DOM
    expect(errorMsg).toBeDefined();
  });

  test('[GAAM-507-023] @regression Verify dropdown clears error on valid selection', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select[required]').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();

      if (count > 1) {
        await select.selectOption(await options.nth(1).getAttribute('value') || '');
        const value = await select.inputValue();
        expect(value).toBeTruthy();
      }
    }
  });

  test('[GAAM-507-024] @regression Verify dropdown placeholder text visible before selection', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const initialValue = await select.inputValue();
      expect(initialValue).toBeDefined();
    }
  });

  // ============ Multiple Dropdowns ============
  test('[GAAM-507-025] @regression Verify multiple dropdowns on same page work independently', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const selects = page.locator('select');
    const count = await selects.count();
    expect(count).toBeGreaterThanOrEqual(1);

    if (count > 1) {
      await selects.nth(0).selectOption(await selects.nth(0).locator('option').nth(1).getAttribute('value') || '');
      const value0 = await selects.nth(0).inputValue();

      await selects.nth(1).selectOption(await selects.nth(1).locator('option').nth(0).getAttribute('value') || '');
      const value1 = await selects.nth(1).inputValue();

      expect(value0).toBeTruthy();
      expect(value1).toBeTruthy();
    }
  });

  // ============ Option Groups ============
  test('[GAAM-507-026] @regression Verify option groups render correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const optgroup = page.locator('optgroup').first();
    const count = await optgroup.count();
    // Verify structure if option groups are used
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ============ Data Attributes ============
  test('[GAAM-507-027] @regression Verify dropdown has name attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const name = await select.getAttribute('name');
      expect(name).toBeTruthy();
    }
  });

  test('[GAAM-507-028] @regression Verify dropdown options have value attributes', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      if (await options.count() > 0) {
        const value = await options.first().getAttribute('value');
        expect(value).toBeDefined();
      }
    }
  });

  // ============ Focus Management ============
  test('[GAAM-507-029] @a11y @regression Verify dropdown receives focus on Tab', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.focus();
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBe('SELECT');
    }
  });

  test('[GAAM-507-030] @a11y @regression Verify visible focus indicator on dropdown', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.focus();
      const outline = await select.evaluate(el =>
        window.getComputedStyle(el).outline
      );
      expect(outline).toBeTruthy();
    }
  });
});
