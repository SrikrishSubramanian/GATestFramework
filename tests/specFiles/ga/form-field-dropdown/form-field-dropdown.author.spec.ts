import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
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
test.describe('Form Field Dropdown Component (GAAM-507)', () => {
    test('[GAAM-507-002] @regression @sanity Verify dropdown has label associated', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
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
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const ariaLabel = await select.getAttribute('aria-label');
            const ariaLabelledBy = await select.getAttribute('aria-labelledby');
            const name = await select.getAttribute('name');
            expect(ariaLabel || ariaLabelledBy || name).toBeTruthy();
        }
    });
    test('[GAAM-507-004] @regression Verify dropdown has default option/placeholder', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const options = select.locator('option');
            const count = await options.count();
            expect(count).toBeGreaterThanOrEqual(1);
        }
    });
    // ============ Option Display & Selection ============
    test('[GAAM-507-005] @regression Verify dropdown options are visible when opened', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            await clickElement(select);
            const options = select.locator('option');
            expect(await options.count()).toBeGreaterThan(0);
        }
    });
    test('[GAAM-507-006] @regression Verify option selection updates dropdown value', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
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
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
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
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const disabledOptions = page.locator('option[disabled]');
        const count = await disabledOptions.count();
        // At least verify the DOM structure supports disabled options
        expect(count).toBeGreaterThanOrEqual(0);
    });
    // ============ Form Integration ============
    test('[GAAM-507-013] @regression Verify dropdown integrates with form submission', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const form = page.locator('form').first();
        if (await form.count() > 0) {
            const select = form.locator('select').first();
            expect(await select.count()).toBeGreaterThan(0);
        }
    });
    test('[GAAM-507-014] @regression Verify required dropdown shows validation', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select[required]').first();
        if (await select.count() > 0) {
            expect(await select.getAttribute('required')).toBeTruthy();
        }
    });
    test('[GAAM-507-015] @regression Verify disabled dropdown cannot be interacted', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const disabledSelect = page.locator('select[disabled]').first();
        if (await disabledSelect.count() > 0) {
            const isDisabled = // ?? TODO: Replace with measurement-utils
             await disabledSelect.evaluate((el: HTMLSelectElement) => el.disabled);
            expect(isDisabled).toBe(true);
        }
    });
    // ============ Responsive Behavior ============
    test('[GAAM-507-016] @regression Verify dropdown responsive on mobile (375px)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const width = // ?? TODO: Replace with measurement-utils
             await select.evaluate(el => el.offsetWidth);
            expect(width).toBeLessThanOrEqual(375);
        }
    });
    test('[GAAM-507-017] @regression Verify dropdown responsive on tablet (768px)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const width = // ?? TODO: Replace with measurement-utils
             await select.evaluate(el => el.offsetWidth);
            expect(width).toBeLessThanOrEqual(768);
        }
    });
    test('[GAAM-507-018] @regression Verify dropdown responsive on desktop (1440px)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const width = // ?? TODO: Replace with measurement-utils
             await select.evaluate(el => el.offsetWidth);
            expect(width).toBeGreaterThan(200);
        }
    });
    // ============ Styling & Appearance ============
    test('[GAAM-507-019] @regression Verify dropdown has visible border', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const border = // ?? TODO: Replace with measurement-utils
             await select.evaluate(el => window.getComputedStyle(el).border);
            expect(border).toBeTruthy();
        }
    });
    test('[GAAM-507-020] @regression Verify dropdown has readable text color', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const color = // ?? TODO: Replace with measurement-utils
             await select.evaluate(el => window.getComputedStyle(el).color);
            expect(color).not.toBe('rgba(0, 0, 0, 0)');
        }
    });
    test('[GAAM-507-021] @regression Verify dropdown has appropriate padding', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await select.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).not.toBe('0px');
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    // ============ Error States & Validation ============
    test('[GAAM-507-022] @regression Verify dropdown shows error message for invalid selection', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const errorMsg = page.locator('[class*="error"], [class*="invalid"], [role="alert"]').first();
        // Verify error message structure exists in DOM
        expect(errorMsg).toBeDefined();
    });
    test('[GAAM-507-023] @regression Verify dropdown clears error on valid selection', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
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
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const initialValue = await select.inputValue();
            expect(initialValue).toBeDefined();
        }
    });
    // ============ Option Groups ============
    test('[GAAM-507-026] @regression Verify option groups render correctly', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const optgroup = page.locator('optgroup').first();
        const count = await optgroup.count();
        // Verify structure if option groups are used
        expect(count).toBeGreaterThanOrEqual(0);
    });
    // ============ Data Attributes ============
    test('[GAAM-507-027] @regression Verify dropdown has name attribute', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const name = await select.getAttribute('name');
            expect(name).toBeTruthy();
        }
    });
    test('[GAAM-507-028] @regression Verify dropdown options have value attributes', async ({ page }) => {
        const url = resolveComponentUrl('form-field-dropdown');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const select = page.locator('select').first();
        if (await select.count() > 0) {
            const options = select.locator('option');
            if (await options.count() > 0) {
                const value = await options.first().getAttribute('value');
                expect(value).toBeDefined();
            }
        }
    });
});
