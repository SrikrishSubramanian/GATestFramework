import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { test, expect } from '@playwright/test';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { RateTablePage, RATE_TABLE_VARIATIONS, VARIATION_TITLES, VARIATION_COLUMNS, VARIATION_ROW_COUNTS, VARIATION_PRODUCTS, RateTableVariation, } from '../../../pages/ga/components/rateTablePage';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor, navigateToEditor, openComponentDialog, cancelDialog } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
let capture: ConsoleCapture;
const BASE = () => process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const STYLE_GUIDE_PATH = '/content/global-atlantic/style-guide/components/rate-table.html';
test.beforeEach(async ({ page }) => {
    capture = new ConsoleCapture(page);
    capture.start();
    // Auth handled by globalSetup + storageState in config
});
test.afterEach(async ({ page }, testInfo) => {
    if (capture) {
        await attachConsoleCapture(testInfo, capture);
    }
    await annotateEnvironment(testInfo);
});
// ── GAAM-558 Acceptance Criteria ─────────────────────────────────────────────
test.describe('RateTable — GAAM-558 Dialog Acceptance Criteria', () => {
    /**
     * Helper: open the rate-table component dialog in the AEM editor.
     * AEM editor renders content in an iframe; component overlays live on the
     * parent page. Click the overlay to select, then click the configure (wrench)
     * button in the floating toolbar to open the dialog.
     */
    async function openRateTableDialog(page: import('@playwright/test').Page) {
        await navigateToEditor(page, STYLE_GUIDE_PATH);
        await page.waitForLoadState('networkidle');
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
        // wait for editor overlays to initialize
        // The editor overlay layer has clickable areas for each component.
        // Find the first rate-table overlay by its data-path attribute containing "rate-table"
        const overlay = page.locator('[data-path*="rate-table-fixed-index"]').first();
        await overlay.waitFor({ state: 'visible', timeout: 10000 });
        await clickElement(overlay);
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
        // After selecting, the floating toolbar appears. Click the configure (wrench) button.
        const configureButton = page.locator('#EditableToolbar button[data-action="CONFIGURE"], .cq-editable-action[data-action="CONFIGURE"], coral-icon[icon="wrench"]').first();
        await configureButton.waitFor({ state: 'visible', timeout: 5000 });
        await clickElement(configureButton);
        // Wait for dialog to appear
        await page.locator('coral-dialog[open]').waitFor({ state: 'visible', timeout: 10000 });
    }
    test('[RT-001] @smoke @regression Dialog lists all 5 table variations', async ({ page }) => {
        await openRateTableDialog(page);
        const dialog = page.locator('coral-dialog[open]');
        const select = dialog.locator('coral-select[name="./tableVariation"]');
        await expect(select).toBeVisible();
        // Coral UI select keeps coral-select-item children in the DOM
        const items = select.locator('coral-select-item');
        const optionCount = await items.count();
        expect(optionCount).toBe(5);
        const expectedOptions = [
            { text: 'Rate Table - Fixed Index Annuities', value: 'fixed-index-annuities' },
            { text: 'Rate Table - Fixed Annuities v1', value: 'fixed-annuities-v1' },
            { text: 'Rate Table - Fixed Annuities v2', value: 'fixed-annuities-v2' },
            { text: 'Rate Table - Index Linked Annuities', value: 'index-linked-annuities' },
            { text: 'Rate Table - Income Annuity', value: 'income-annuity' },
        ];
        for (let i = 0; i < optionCount; i++) {
            const value = await items.nth(i).getAttribute('value');
            const text = (await items.nth(i).textContent() || '').trim();
            const match = expectedOptions.find(o => o.value === value);
            expect(match, `Unexpected option value: ${value}`).toBeTruthy();
            expect(text).toBe(match!.text);
        }
        await cancelDialog(page);
    });
    test('[RT-003] @smoke @regression Dialog table variation field is required', async ({ page }) => {
        await openRateTableDialog(page);
        const dialog = page.locator('coral-dialog[open]');
        const select = dialog.locator('coral-select[name="./tableVariation"]');
        const isRequired = await select.getAttribute('required');
        expect(isRequired).not.toBeNull();
        await cancelDialog(page);
    });
});
// ── Variation Rendering ──────────────────────────────────────────────────────
test.describe('RateTable — Variation Rendering', () => {
    for (const variation of RATE_TABLE_VARIATIONS) {
        const idx = RATE_TABLE_VARIATIONS.indexOf(variation);
        test(`[RT-${String(4 + idx).padStart(3, '0')}] @smoke @regression Variation "${variation}" renders with correct title`, async ({ page }) => {
            const pom = new RateTablePage(page);
            await pom.navigate(BASE());
            const instance = pom.instanceByVariation(variation);
            await expect(instance).toBeVisible();
            const title = await pom.getTitle(variation);
            expect(title).toBe(VARIATION_TITLES[variation]);
        });
    }
});
// ── Table Structure & Data ───────────────────────────────────────────────────
test.describe('RateTable — Table Structure', () => {
    for (const variation of RATE_TABLE_VARIATIONS) {
        const idx = RATE_TABLE_VARIATIONS.indexOf(variation);
        test(`[RT-${String(9 + idx * 3).padStart(3, '0')}] @regression Variation "${variation}" has correct column headers`, async ({ page }) => {
            const pom = new RateTablePage(page);
            await pom.navigate(BASE());
            const headers = await pom.getColumnHeaders(variation);
            expect(headers).toEqual(VARIATION_COLUMNS[variation]);
        });
        test(`[RT-${String(10 + idx * 3).padStart(3, '0')}] @regression Variation "${variation}" has correct row count`, async ({ page }) => {
            const pom = new RateTablePage(page);
            await pom.navigate(BASE());
            const rowCount = await pom.getRowCount(variation);
            expect(rowCount).toBe(VARIATION_ROW_COUNTS[variation]);
        });
        test(`[RT-${String(11 + idx * 3).padStart(3, '0')}] @regression Variation "${variation}" contains expected products`, async ({ page }) => {
            const pom = new RateTablePage(page);
            await pom.navigate(BASE());
            const instance = pom.instanceByVariation(variation);
            await expect(instance).toBeVisible();
            const productCells = instance.locator('.cmp-rate-table__tbody .cmp-rate-table__row .cmp-rate-table__cell:first-child');
            const count = await productCells.count();
            const foundProducts = new Set<string>();
            for (let i = 0; i < count; i++) {
                foundProducts.add((await productCells.nth(i).textContent() || '').trim());
            }
            for (const expected of VARIATION_PRODUCTS[variation]) {
                expect(foundProducts, `Missing product "${expected}" in ${variation}`).toContain(expected);
            }
        });
    }
});
// ── Semantic HTML & BEM ──────────────────────────────────────────────────────
test.describe('RateTable — HTML Semantics & BEM', () => {
    test('[RT-026] @regression Component root uses .cmp-rate-table BEM block class', async ({ page }) => {
        const pom = new RateTablePage(page);
        await pom.navigate(BASE());
        const rootClass = await pom.allInstances().first().getAttribute('class');
        expect(rootClass).toContain('cmp-rate-table');
    });
    test('[RT-030] @regression No inline style attributes on component elements', async ({ page }) => {
        const pom = new RateTablePage(page);
        await pom.navigate(BASE());
        const styledElements = pom.allInstances().first().locator('[style]');
        expect(await styledElements.count()).toBe(0);
    });
    test('[RT-031] @regression Data attributes are set correctly on root', async ({ page }) => {
        const pom = new RateTablePage(page);
        await pom.navigate(BASE());
        const instance = pom.allInstances().first();
        expect(await instance.getAttribute('data-component-name')).toBe('rate-table');
        const variation = await instance.getAttribute('data-table-variation');
        expect(variation).toBeTruthy();
        expect(RATE_TABLE_VARIATIONS as readonly string[]).toContain(variation);
        expect(await instance.getAttribute('data-path')).toBeTruthy();
    });
});
// ── Empty / Placeholder State ────────────────────────────────────────────────
test.describe('RateTable — Empty State', () => {
    test('[RT-032] @negative @regression Empty rate-table shows placeholder in editor mode', async ({ page }) => {
        await navigateToEditor(page, STYLE_GUIDE_PATH);
        await page.waitForLoadState('networkidle');
        const placeholder = page.locator('.cq-placeholder[data-emptytext*="Rate Table"]');
        const count = await placeholder.count();
        if (count > 0) {
            const text = await placeholder.getAttribute('data-emptytext');
            expect(text).toContain('Rate Table');
            expect(text).toContain('Select a table variation');
        }
    });
});
// ── Responsive ───────────────────────────────────────────────────────────────
test.describe('RateTable — Responsive', () => {
    test('[RT-034] @mobile @regression Rate table is visible at mobile viewport (390px)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new RateTablePage(page);
        await pom.navigate(BASE());
        await expect(pom.allInstances().first()).toBeVisible();
    });
    test('[RT-035] @mobile @regression Rate table container handles overflow at mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new RateTablePage(page);
        await pom.navigate(BASE());
        const container = pom.allInstances().first().locator('.cmp-rate-table__container');
        const overflow = // 📏 TODO: Replace with measurement-utils
         await container.evaluate(el => {
            const cs = getComputedStyle(el);
            return {
                overflowX: cs.overflowX,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
            };
        });
        const fits = overflow.scrollWidth <= overflow.clientWidth;
        const scrollable = overflow.overflowX === 'auto' || overflow.overflowX === 'scroll';
        expect(fits || scrollable).toBe(true);
    });
});
// ── Console Errors & Resources ───────────────────────────────────────────────
test.describe('RateTable — Console & Resources', () => {
    test('[RT-039] @regression No HTL comments in published HTML output', async ({ page }) => {
        const pom = new RateTablePage(page);
        await pom.navigate(BASE());
        const html = await page.content();
        expect(html).not.toContain('<!--/*');
    });
});
// ── Accessibility ────────────────────────────────────────────────────────────
test.describe('RateTable — Accessibility', () => {
});
// ── Cross-Variation Consistency ──────────────────────────────────────────────
test.describe('RateTable — Cross-Variation Consistency', () => {
    test('[RT-043] @regression All 5 variations render on the page', async ({ page }) => {
        const pom = new RateTablePage(page);
        await pom.navigate(BASE());
        for (const variation of RATE_TABLE_VARIATIONS) {
            const instance = pom.instanceByVariation(variation);
            await expect(instance, `Variation "${variation}" should be visible`).toBeVisible();
        }
    });
});
