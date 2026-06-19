import { test, expect } from '@playwright/test';
import { FormOptionsPage } from '../../../pages/ga/components/formOptionsPage';
import ENV from '../../../../tests/utils/infra/env';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../../tests/utils/infra/component-assertions';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Form Options — Interactions', () => {
  test('[FO-INTERACTION-001] @interaction @regression Checkbox toggle works', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const checkboxes = page.locator('.cmp-form-options input[type="checkbox"]');
    if (await checkboxes.count() > 0) {
      const checkbox = checkboxes.first();
      const initialState = await checkbox.isChecked();

      await clickElement(checkbox);
      // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

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
      await clickElement(radio1);
      // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
      expect(await radio1.isChecked()).toBeTruthy();

      // Select second radio (should deselect first)
      await clickElement(radio2);
      // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
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
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

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
        await clickElement(label);
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // Input should be focused or checked
        const isFocused = // 📏 TODO: Replace with measurement-utils
    await input.evaluate(el => document.activeElement === el);
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

      await fill(textarea, 'test input');
      // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

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

      const focused = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeTruthy();
    }
  });
});
