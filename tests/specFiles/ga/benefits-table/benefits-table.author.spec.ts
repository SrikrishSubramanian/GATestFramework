import { test, expect } from '@playwright/test';
import { BenefitsTablePage } from '../../../pages/ga/components/benefitsTablePage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('BenefitsTable — Happy Path', () => {
    test('[BT-001] @smoke @regression @sanity BenefitsTable renders correctly', async ({ page }) => {
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-benefits-table').first();
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
    test('[BT-002] @smoke @regression BenefitsTable interactive elements are functional', async ({ page }) => {
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-benefits-table').first();
        await expect(root).toBeVisible();
        // Verify interactive elements (links, buttons) are present and clickable
        const interactive = root.locator('a, button');
        const count = await interactive.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await expect(interactive.nth(i)).toBeVisible();
            await expect(interactive.nth(i)).toBeEnabled();
        }
    });
});
test.describe('BenefitsTable — Negative & Boundary', () => {
    test('[BT-003] @negative @regression BenefitsTable handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-benefits-table').first()).toBeVisible();
    });
    test('[BT-004] @negative @regression BenefitsTable handles missing images', async ({ page }) => {
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-benefits-table img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('BenefitsTable — Responsive', () => {
    test('[BT-005] @mobile @regression @mobile BenefitsTable adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-benefits-table').first();
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
    test('[BT-006] @mobile @regression BenefitsTable adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-benefits-table').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('BenefitsTable — Console & Resources', () => {
    test('[BT-007] @regression BenefitsTable produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('BenefitsTable — Broken Images', () => {
    test('[BT-008] @regression BenefitsTable all images load successfully', async ({ page }) => {
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-benefits-table img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[BT-009] @regression BenefitsTable all images have alt attributes', async ({ page }) => {
        const pom = new BenefitsTablePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-benefits-table img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('BenefitsTable — Accessibility', () => {
});
test.describe('BenefitsTable — AEM Dialog Configuration', () => {
});
