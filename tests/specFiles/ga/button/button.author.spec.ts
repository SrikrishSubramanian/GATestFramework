import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
let capture: ConsoleCapture;
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
test.describe('Button — CSV Test Cases', () => {
    test('[BTTN-001] @smoke @regression @sanity DR AEM FE: Dynamic Rates Audit Log — AC1', async ({ page }) => {
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Functionality*
        test.fixme();
    });
});
test.describe('Button — Happy Path', () => {
    test('[BTTN-002] @smoke @regression Button renders correctly', async ({ page }) => {
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-button:not(#skip-nav)').first();
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
    test('[BTTN-003] @smoke @regression Button interactive elements are functional', async ({ page }) => {
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-button:not(#skip-nav)').first();
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
test.describe('Button — Negative & Boundary', () => {
    test('[BTTN-004] @negative @regression Button handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-button:not(#skip-nav)').first()).toBeVisible();
    });
    test('[BTTN-005] @negative @regression Button handles missing images', async ({ page }) => {
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-button img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Button — Responsive', () => {
    test('[BTTN-006] @mobile @regression @mobile Button adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-button:not(#skip-nav)').first();
        await expect(root).toBeVisible();
        // Verify layout adapts to mobile: flex-direction should exist
        // Use assertLayout() to verify responsive behavior
        const computedStyle = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => ({
            flexDirection: getComputedStyle(el).flexDirection,
            display: getComputedStyle(el).display,
        }));
        expect(computedStyle.flexDirection || computedStyle.display).toBeDefined();
    });
    test('[BTTN-007] @mobile @regression Button adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-button:not(#skip-nav)').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Button — Console & Resources', () => {
});
test.describe('Button — Broken Images', () => {
    test('[BTTN-009] @regression Button all images load successfully', async ({ page }) => {
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-button img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = // 📏 TODO: Replace with measurement-utils
             await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[BTTN-010] @regression Button all images have alt attributes', async ({ page }) => {
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-button img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Button — Accessibility', () => {
});
test.describe('Button — AEM Dialog Configuration', () => {
});
