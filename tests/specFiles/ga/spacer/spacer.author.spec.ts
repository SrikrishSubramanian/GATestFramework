import { test, expect } from '@playwright/test';
import { SpacerPage } from '../../../pages/ga/components/spacerPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    capture = new ConsoleCapture(page);
    capture.start();
    await loginToAEMAuthor(page);
});
test.afterEach(async ({ page }, testInfo) => {
    if (capture) {
        await attachConsoleCapture(testInfo, capture);
    }
    await annotateEnvironment(testInfo);
});
test.describe('Spacer — CSV Test Cases', () => {
    test('[SPC-001] @smoke @regression @sanity TC_SPC_001 Verify Spacer component availability', async ({ page }) => {
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Pre-condition: User logged into CMS
        // Step 1: Open page template
        // Step 2: Open component list
        // Expected: Spacer component visible in component list
        await expect(pom.getAllSpacers().first()).toBeVisible();
    });
    test('[SPC-004] @smoke @regression TC_SPC_004 Verify style options availability', async ({ page }) => {
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: XXS, XS, Small, Medium (default), Large, XL options visible
        // Verify that multiple spacer variants are rendered on the style guide page
        const wrappers = pom.getAllSpacerWrappers();
        const count = await wrappers.count();
        expect(count).toBeGreaterThanOrEqual(6);
    });
    test('[SPC-005] @smoke @regression TC_SPC_005 Validate 3XS style — Desktop spacing', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        const spacer = page.locator('.cmp-spacer--3xsmall > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(6);
    });
    test('[SPC-006] @smoke @regression TC_SPC_006 Validate 2XS/XXS style — Desktop spacing', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // CSV says "2XS = 12px desktop" — maps to XXS (cmp-spacer--xxsmall)
        const spacer = page.locator('.cmp-spacer--xxsmall > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(12);
    });
    test('[SPC-007] @smoke @regression TC_SPC_007 Validate XS style — Desktop spacing', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 20px
        const spacer = page.locator('.cmp-spacer--xsmall > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(20);
    });
    test('[SPC-008] @smoke @regression TC_SPC_008 Validate Small style — Desktop spacing', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 32px
        const spacer = page.locator('.cmp-spacer--small > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(32);
    });
    test('[SPC-009] @smoke @regression TC_SPC_009 Validate default Medium style — Desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Default is Medium; spacing equals 48px
        // Default spacer has no size modifier class on the wrapper
        const spacer = page.locator('div.spacer:not([class*="cmp-spacer--"]) > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(48);
    });
    test('[SPC-010] @smoke @regression TC_SPC_010 Validate Large style — Desktop spacing', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 64px
        const spacer = page.locator('.cmp-spacer--large > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(64);
    });
    test('[SPC-011] @smoke @regression TC_SPC_011 Validate XL style — Desktop spacing', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 112px
        const spacer = page.locator('.cmp-spacer--xlarge > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(112);
    });
    test('[SPC-012] @smoke @regression @mobile TC_SPC_012 Validate 3XS style — Mobile spacing', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        const spacer = page.locator('.cmp-spacer--3xsmall > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(4);
    });
    test('[SPC-013] @smoke @regression @mobile TC_SPC_013 Validate 2XS/XXS style — Mobile spacing', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // CSV says "2XS = 8px mobile" — maps to XXS (cmp-spacer--xxsmall)
        const spacer = page.locator('.cmp-spacer--xxsmall > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(8);
    });
    test('[SPC-014] @smoke @regression @mobile TC_SPC_014 Validate XS style — Mobile spacing', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 16px
        const spacer = page.locator('.cmp-spacer--xsmall > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(16);
    });
    test('[SPC-015] @smoke @regression @mobile TC_SPC_015 Validate Small style — Mobile spacing', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 20px
        const spacer = page.locator('.cmp-spacer--small > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(20);
    });
    test('[SPC-016] @smoke @regression @mobile TC_SPC_016 Validate Medium style — Mobile spacing', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 32px
        const spacer = page.locator('div.spacer:not([class*="cmp-spacer--"]) > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(32);
    });
    test('[SPC-017] @smoke @regression @mobile TC_SPC_017 Validate Large style — Mobile spacing', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 48px
        const spacer = page.locator('.cmp-spacer--large > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(48);
    });
    test('[SPC-018] @smoke @regression @mobile TC_SPC_018 Validate XL style — Mobile spacing', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Spacing equals 64px
        const spacer = page.locator('.cmp-spacer--xlarge > .cmp-spacer').first();
        await expect(spacer).toBeVisible();
        const height = await pom.getSpacerHeight(spacer);
        expect(height).toBe(64);
    });
    test('[SPC-020] @smoke @regression TC_SPC_020 Multiple Spacer components rendering', async ({ page }) => {
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Each spacer renders correct spacing
        const spacers = pom.getAllSpacers();
        const count = await spacers.count();
        expect(count).toBeGreaterThanOrEqual(3);
        for (let i = 0; i < count; i++) {
            const box = await spacers.nth(i).boundingBox();
            expect(box).not.toBeNull();
            expect(box!.height).toBeGreaterThan(0);
        }
    });
    test('[SPC-024] @smoke @regression TC_SPC_024 Validate default style without manual selection', async ({ page }) => {
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Default style is Medium
        const defaultSpacer = page.locator('div.spacer:not([class*="cmp-spacer--"]) > .cmp-spacer').first();
        await expect(defaultSpacer).toBeVisible();
    });
    test('[SPC-026] @negative @regression TC_SPC_026 Prevent multiple style selection', async ({ page }) => {
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // Expected: Only one style can be active at a time
        // Each spacer wrapper should have at most one cmp-spacer--* modifier
        const wrappers = pom.getAllSpacerWrappers();
        const count = await wrappers.count();
        for (let i = 0; i < count; i++) {
            const classes = await wrappers.nth(i).getAttribute('class') || '';
            const sizeModifiers = classes.split(/\s+/).filter(c => c.startsWith('cmp-spacer--'));
            expect(sizeModifiers.length).toBeLessThanOrEqual(1);
        }
    });
});
test.describe('Spacer — Console & Resources', () => {
    test('[SPC-034] @regression Spacer produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new SpacerPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Spacer — Accessibility', () => {
});
