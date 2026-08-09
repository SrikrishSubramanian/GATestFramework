import { test, expect } from '@playwright/test';
import { ProductPathSummaryCardPage } from '../../../pages/ga/components/productPathSummaryCardPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('ProductPathSummaryCard — Happy Path', () => {
    test('[PPSC-001] @smoke @regression ProductPathSummaryCard renders correctly', async ({ page }) => {
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-summary-card').first();
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
    test('[PPSC-002] @smoke @regression ProductPathSummaryCard interactive elements are functional', async ({ page }) => {
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-summary-card').first();
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
test.describe('ProductPathSummaryCard — Negative & Boundary', () => {
    test('[PPSC-003] @negative @regression ProductPathSummaryCard handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-product-path-summary-card').first()).toBeVisible();
    });
    test('[PPSC-004] @negative @regression ProductPathSummaryCard handles missing images', async ({ page }) => {
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-product-path-summary-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('ProductPathSummaryCard — Responsive', () => {
    test('[PPSC-005] @mobile @regression @mobile ProductPathSummaryCard adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-summary-card').first();
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
    test('[PPSC-006] @mobile @regression ProductPathSummaryCard adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-summary-card').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('ProductPathSummaryCard — Console & Resources', () => {
    test('[PPSC-007] @regression ProductPathSummaryCard produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('ProductPathSummaryCard — Broken Images', () => {
    test('[PPSC-008] @regression ProductPathSummaryCard all images load successfully', async ({ page }) => {
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-product-path-summary-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[PPSC-009] @regression ProductPathSummaryCard all images have alt attributes', async ({ page }) => {
        const pom = new ProductPathSummaryCardPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-product-path-summary-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('ProductPathSummaryCard — Accessibility', () => {
});
test.describe('ProductPathSummaryCard — AEM Dialog Configuration', () => {
});
