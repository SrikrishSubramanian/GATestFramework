import { test, expect } from '@playwright/test';
import { FormOptionsPage } from '../../../pages/ga/components/formOptionsPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
    capture = new ConsoleCapture(page);
    capture.start();
});
test.afterEach(async ({ page }, testInfo) => {
    if (capture) {
        await attachConsoleCapture(testInfo, capture);
    }
    await annotateEnvironment(testInfo);
});
test.describe('Form Options — Interactions', () => {
    test('[FO-INTERACTION-001] @interaction @regression @sanity Checkbox toggle works', async ({ page }) => {
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
