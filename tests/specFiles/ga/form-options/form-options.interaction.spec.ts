import { test, expect } from '@playwright/test';
import { FormOptionsPage } from '../../../pages/ga/components/formOptionsPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Options — Interactions', () => {
  test('[FO-INTERACTION-001] @interaction @regression Checkbox toggle works', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const checkboxes = page.locator('.cmp-form-options input[type="checkbox"]');
    if (await checkboxes.count() > 0) {
      const checkbox = checkboxes.first();
      const initialState = await checkbox.isChecked();

      await checkbox.click();
      await page.waitForTimeout(100);

      const newState = await checkbox.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('[FO-INTERACTION-002] @interaction @regression Radio button selection', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const radios = page.locator('.cmp-form-options input[type="radio"]');
    if (await radios.count() > 1) {
      const radio1 = radios.nth(0);
      const radio2 = radios.nth(1);

      // Select first radio
      await radio1.click();
      await page.waitForTimeout(100);
      expect(await radio1.isChecked()).toBeTruthy();

      // Select second radio (should deselect first)
      await radio2.click();
      await page.waitForTimeout(100);
      expect(await radio2.isChecked()).toBeTruthy();
      expect(await radio1.isChecked()).toBeFalsy();
    }
  });

  test('[FO-INTERACTION-003] @interaction @regression Dropdown selection changes value', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const selects = page.locator('.cmp-form-options select');
    if (await selects.count() > 0) {
      const select = selects.first();
      const initialValue = await select.inputValue();

      const options = select.locator('option');
      const optionCount = await options.count();

      if (optionCount > 1) {
        // Select second option
        const secondOption = options.nth(1);
        const secondValue = await secondOption.getAttribute('value');

        await select.selectOption(secondValue || '');
        await page.waitForTimeout(100);

        const newValue = await select.inputValue();
        expect(newValue).not.toBe(initialValue);
      }
    }
  });

  test('[FO-INTERACTION-004] @interaction @regression Form label click focuses input', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const labels = page.locator('.cmp-form-options label');
    if (await labels.count() > 0) {
      const label = labels.first();
      const htmlFor = await label.getAttribute('for');

      if (htmlFor) {
        const input = page.locator(`#${htmlFor}`);

        // Click label
        await label.click();
        await page.waitForTimeout(100);

        // Input should be focused or checked
        const isFocused = await input.evaluate(el => document.activeElement === el);
        const isChecked = await input.isChecked().catch(() => false);

        expect(isFocused || isChecked).toBeTruthy();
      }
    }
  });

  test('[FO-INTERACTION-005] @interaction @regression Textarea input updates value', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const textareas = page.locator('.cmp-form-options textarea');
    if (await textareas.count() > 0) {
      const textarea = textareas.first();

      await textarea.fill('test input');
      await page.waitForTimeout(100);

      const value = await textarea.inputValue();
      expect(value).toBe('test input');
    }
  });

  test('[FO-INTERACTION-006] @interaction @regression Keyboard navigation through form elements', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const form = page.locator('.cmp-form-options').first();
    const firstInput = form.locator('input, select, textarea').first();

    if (firstInput) {
      await firstInput.focus();
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeTruthy();
    }
  });
});
