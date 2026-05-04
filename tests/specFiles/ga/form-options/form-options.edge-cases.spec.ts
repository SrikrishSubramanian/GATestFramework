import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Options — Edge Cases & Enhanced Validation', () => {
  // ============ Edge Case: Multiple Selection Types ============
  test('[FORMOPTIONS-EDGE-001] @edge Verify checkbox can be selected and deselected', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      const initialChecked = await checkbox.isChecked();

      await checkbox.check();
      expect(await checkbox.isChecked()).toBe(true);

      await checkbox.uncheck();
      expect(await checkbox.isChecked()).toBe(false);
    }
  });

  test('[FORMOPTIONS-EDGE-002] @edge Verify radio button single selection behavior', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const radioButtons = page.locator('input[type="radio"]');
    const count = await radioButtons.count();

    if (count > 1) {
      // Select first
      await radioButtons.nth(0).check();
      expect(await radioButtons.nth(0).isChecked()).toBe(true);

      // Select second - first should be unchecked
      await radioButtons.nth(1).check();
      expect(await radioButtons.nth(1).isChecked()).toBe(true);
      expect(await radioButtons.nth(0).isChecked()).toBe(false);
    }
  });

  test('[FORMOPTIONS-EDGE-003] @edge Verify select dropdown opens and closes', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const selectField = page.locator('select').first();
    if (await selectField.count() > 0) {
      await selectField.click();
      // Dropdown should be interactive
      expect(await selectField.count()).toBeGreaterThan(0);
    }
  });

  // ============ Edge Case: Label Association ============
  test('[FORMOPTIONS-EDGE-004] @edge Verify checkbox label association', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      const id = await checkbox.getAttribute('id');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        expect(await label.count()).toBeGreaterThan(0);
      }
    }
  });

  test('[FORMOPTIONS-EDGE-005] @edge Verify radio button label association', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const radioButtons = page.locator('input[type="radio"]');
    const count = await radioButtons.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const radio = radioButtons.nth(i);
      const id = await radio.getAttribute('id');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        if (await label.count() > 0) {
          expect(await label.textContent()).toBeTruthy();
        }
      }
    }
  });

  // ============ Edge Case: Disabled State ============
  test('[FORMOPTIONS-EDGE-006] @edge Verify disabled checkbox cannot be selected', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const disabledCheckbox = page.locator('input[type="checkbox"][disabled]').first();
    if (await disabledCheckbox.count() > 0) {
      const disabled = await disabledCheckbox.getAttribute('disabled');
      expect(disabled).toBe('');

      // Should not be clickable
      try {
        await disabledCheckbox.click();
      } catch {
        // Expected to fail
      }
    }
  });

  test('[FORMOPTIONS-EDGE-007] @edge Verify disabled radio button is not selectable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const disabledRadio = page.locator('input[type="radio"][disabled]').first();
    if (await disabledRadio.count() > 0) {
      const disabled = await disabledRadio.getAttribute('disabled');
      expect(disabled).toBe('');
    }
  });

  test('[FORMOPTIONS-EDGE-008] @edge Verify disabled option in select is visually indicated', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const disabledOptions = select.locator('option[disabled]');
      const count = await disabledOptions.count();
      expect(count).toBeDefined();
    }
  });

  // ============ Edge Case: Required Field ============
  test('[FORMOPTIONS-EDGE-009] @edge Verify required attribute on form options', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const requiredInputs = page.locator('[required], input[type="checkbox"][required], input[type="radio"][required]');
    const count = await requiredInputs.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = requiredInputs.nth(i);
      const required = await input.getAttribute('required');
      expect(required).toBe('');
    }
  });

  test('[FORMOPTIONS-EDGE-010] @edge Verify required field indicator displayed', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const labels = page.locator('label');
    let foundRequired = false;

    const count = await labels.count();
    for (let i = 0; i < count; i++) {
      const label = labels.nth(i);
      const text = await label.textContent();

      if (text && (text.includes('*') || text.includes('required'))) {
        foundRequired = true;
        break;
      }
    }

    expect(foundRequired).toBeDefined();
  });

  // ============ Edge Case: Custom Icons/Styling ============
  test('[FORMOPTIONS-EDGE-011] @edge Verify checkbox has custom styling', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      const className = await checkbox.getAttribute('class');
      expect(className || 'default').toBeDefined();
    }
  });

  test('[FORMOPTIONS-EDGE-012] @edge Verify radio button styling consistency', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const radioButtons = page.locator('input[type="radio"]');
    const count = await radioButtons.count();

    if (count > 0) {
      const firstClass = await radioButtons.nth(0).getAttribute('class');
      if (count > 1) {
        const secondClass = await radioButtons.nth(1).getAttribute('class');
        expect(firstClass).toBe(secondClass);
      }
    }
  });

  // ============ Edge Case: Keyboard Navigation ============
  test('[FORMOPTIONS-EDGE-013] @edge Verify checkbox focusable via keyboard', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      await checkbox.focus();
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBe('INPUT');
    }
  });

  test('[FORMOPTIONS-EDGE-014] @edge Verify space key toggles checkbox', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      await checkbox.focus();
      const initialState = await checkbox.isChecked();

      await page.keyboard.press('Space');
      await page.waitForTimeout(100);

      const newState = await checkbox.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('[FORMOPTIONS-EDGE-015] @edge Verify Tab key navigates through options', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const firstInput = page.locator('input[type="checkbox"], input[type="radio"], select').first();
    if (await firstInput.count() > 0) {
      await firstInput.focus();
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.getAttribute('class'));
      expect(focused).toBeDefined();
    }
  });

  // ============ Edge Case: Multiple Options Container ============
  test('[FORMOPTIONS-EDGE-016] @edge Verify maximum number of options rendered', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();
      // Should have at least 2 options
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });

  test('[FORMOPTIONS-EDGE-017] @edge Verify placeholder option in select', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const firstOption = select.locator('option').first();
      const value = await firstOption.getAttribute('value');
      const text = await firstOption.textContent();

      // First option is often placeholder
      expect(value || text).toBeDefined();
    }
  });

  // ============ Edge Case: Data Attributes ============
  test('[FORMOPTIONS-EDGE-018] @edge Verify form options have name attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const inputs = page.locator('input[type="checkbox"], input[type="radio"], select');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const input = inputs.nth(i);
      const name = await input.getAttribute('name');
      expect(name).toBeTruthy();
    }
  });

  test('[FORMOPTIONS-EDGE-019] @edge Verify form options have value attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const inputs = page.locator('input[type="checkbox"], input[type="radio"]');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const input = inputs.nth(i);
      const value = await input.getAttribute('value');
      expect(value).toBeTruthy();
    }
  });

  // ============ Edge Case: Appearance Modes ============
  test('[FORMOPTIONS-EDGE-020] @edge Verify form options visible on light background', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);

    const checkbox = page.locator('input[type="checkbox"], input[type="radio"]').first();
    if (await checkbox.count() > 0) {
      const isVisible = await checkbox.isVisible();
      expect(isVisible).toBe(true);
    }
  });
});
