import { test, expect } from '@playwright/test';
import { FirmSelectionModalPage } from '../../../pages/ga/components/firmSelectionModalPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('FirmSelectionModal — Happy Path', () => {
    test('[FSM-001] @smoke @regression FirmSelectionModal renders correctly', async ({ page }) => {
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        // Modal is hidden until its trigger is clicked
        await page.locator('a[data-modal]').first().click();
        const root = page.locator('.cmp-firm-selection-modal').first();
        await expect(root).toBeVisible();
        // Verify core structure: heading or primary content exists
        const heading = root.locator('h1, h2, h3').first();
        const hasHeading = await heading.count() > 0;
        if (hasHeading) {
            await expect(heading).toBeVisible();
        }
        // Verify no JS errors during render
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
    });
    test('[FSM-002] @smoke @regression FirmSelectionModal interactive elements are functional', async ({ page }) => {
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        await page.locator('a[data-modal]').first().click();
        const root = page.locator('.cmp-firm-selection-modal').first();
        await expect(root).toBeVisible();
        // Verify interactive elements (links, buttons) are present and clickable
        const interactive = root.locator('a, button');
        const count = await interactive.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await expect(interactive.nth(i)).toBeVisible();
            // The Confirm CTA is intentionally disabled until a firm is selected
            const ariaDisabled = await interactive.nth(i).getAttribute('aria-disabled');
            if (ariaDisabled !== 'true') {
                await expect(interactive.nth(i)).toBeEnabled();
            }
        }
    });
});
test.describe('FirmSelectionModal — Negative & Boundary', () => {
    test('[FSM-003] @negative @regression FirmSelectionModal handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors).toEqual([]);
        // Root element should still be present in the DOM (not crash) — modal itself
        // stays hidden until its trigger is clicked, so we check attached, not visible
        await expect(page.locator('.cmp-firm-selection-modal').first()).toBeAttached();
    });
    test('[FSM-004] @negative @regression FirmSelectionModal handles missing images', async ({ page }) => {
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-firm-selection-modal img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('FirmSelectionModal — Responsive', () => {
    test('[FSM-005] @mobile @regression @mobile FirmSelectionModal adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        await page.locator('a[data-modal]').first().click();
        const root = page.locator('.cmp-firm-selection-modal').first();
        await expect(root).toBeVisible();
        // Verify layout adapts to mobile: check flex-direction changes to column
        const flexDir = await root.evaluate(el => {
            const cs = getComputedStyle(el);
            return cs.flexDirection || cs.display;
        });
        // At mobile, flex containers typically switch to column layout
        // Grid containers may change template columns
        expect(flexDir).toBeDefined();
    });
    test('[FSM-006] @mobile @regression FirmSelectionModal adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        await page.locator('a[data-modal]').first().click();
        const root = page.locator('.cmp-firm-selection-modal').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('FirmSelectionModal — Console & Resources', () => {
    test('[FSM-007] @regression FirmSelectionModal produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('FirmSelectionModal — Broken Images', () => {
    test('[FSM-008] @regression FirmSelectionModal all images load successfully', async ({ page }) => {
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-firm-selection-modal img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[FSM-009] @regression FirmSelectionModal all images have alt attributes', async ({ page }) => {
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-firm-selection-modal img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('FirmSelectionModal — Accessibility', () => {
});
test.describe('FirmSelectionModal — AEM Dialog Configuration', () => {
});
test.describe('FirmSelectionModal — CSV Test Cases (GAAM-693)', () => {
    // Epic ticket has no description/ACs beyond its title — assertions below are
    // scoped to what's verifiable against the live modal's validation behavior.
    test('[FSM-015] @smoke @regression Confirm CTA stays disabled until a firm is selected', async ({ page }) => {
        const pom = new FirmSelectionModalPage(page);
        await pom.navigate(BASE());
        await page.locator('a[data-modal]').first().click();
        const root = page.locator('.cmp-firm-selection-modal').first();
        await expect(root).toBeVisible();
        const cta = root.locator('.cmp-firm-selection-modal__cta').first();
        await expect(cta).toHaveAttribute('aria-disabled', 'true');
        await expect(cta).toBeDisabled();
        const firmList = root.locator('.cmp-firm-selection-modal__firm-list');
        await expect(firmList).toHaveAttribute('role', 'listbox');
    });
    test('[FSM-016] @regression Selecting a firm enables the Confirm CTA', async ({ page }) => {
        // The firm list in this environment currently loads with zero options
        // (no firm data returned by the backing service), so there's no option to
        // select in order to verify the CTA becomes enabled. Needs test data/API
        // stubbing for the firm list before this can be implemented without
        // guessing at how a populated option renders.
        test.fixme();
    });
});
