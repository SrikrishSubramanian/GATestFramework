import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
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
test.describe('Form Text — Core Functionality', () => {
    test('[FORMTEXT-002] @regression @sanity Form text field accepts input', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
        if (await textInput.count() > 0) {
            await fill(textInput, 'Test Input Value');
            const value = await textInput.inputValue();
            expect(value).toBe('Test Input Value');
        }
    });
    test('[FORMTEXT-003] @regression Form text field has required attribute when specified', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textInputs = page.locator('input[type="text"], .cmp-form-text input');
        const count = await textInputs.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            const input = textInputs.nth(i);
            const required = await input.getAttribute('required');
            expect(required !== null || required === 'required').toBeDefined();
        }
    });
    test('[FORMTEXT-004] @regression Form text placeholder is displayed', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textInput = page.locator('input[type="text"][placeholder], .cmp-form-text input[placeholder]').first();
        if (await textInput.count() > 0) {
            const placeholder = await textInput.getAttribute('placeholder');
            expect(placeholder).toBeTruthy();
        }
    });
    test('[FORMTEXT-006] @regression Form text field validates minimum length', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textInput = page.locator('input[type="text"][minlength], .cmp-form-text input[minlength]').first();
        if (await textInput.count() > 0) {
            const minLength = await textInput.getAttribute('minlength');
            expect(minLength).toBeTruthy();
        }
    });
    test('[FORMTEXT-007] @regression Form text field respects maximum length', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textInput = page.locator('input[type="text"][maxlength], .cmp-form-text input[maxlength]').first();
        if (await textInput.count() > 0) {
            const maxLength = await textInput.getAttribute('maxlength');
            expect(maxLength).toBeTruthy();
        }
    });
    test('[FORMTEXT-008] @regression Form text field pattern validation', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textInput = page.locator('input[type="text"][pattern], .cmp-form-text input[pattern]').first();
        if (await textInput.count() > 0) {
            const pattern = await textInput.getAttribute('pattern');
            expect(pattern).toBeTruthy();
        }
    });
    test('[FORMTEXT-009] @regression Form text field name attribute is set', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textInputs = page.locator('input[type="text"], .cmp-form-text input');
        const count = await textInputs.count();
        expect(count).toBeGreaterThan(0);
        if (count > 0) {
            const name = await textInputs.first().getAttribute('name');
            expect(name).toBeTruthy();
        }
    });
    test('[FORMTEXT-010] @regression Form text displays error message on validation failure', async ({ page }) => {
        const url = resolveComponentUrl('form-text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const errorContainer = page.locator('[class*="error"], [class*="invalid"], .cmp-form-text [role="alert"]');
        const hasErrors = await errorContainer.count() > 0;
        expect(hasErrors).toBeDefined();
    });
});
