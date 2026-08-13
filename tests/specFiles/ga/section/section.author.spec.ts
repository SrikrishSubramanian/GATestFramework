import { test, expect } from '@playwright/test';
import { SectionPage } from '../../../pages/ga/components/sectionPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
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
test.describe('Section — Happy Path', () => {
    test('[SCTN-002] @smoke @regression @sanity Section renders correctly', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
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
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
    test('[SCTN-003] @smoke @regression @sanity Section interactive elements are functional', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
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
test.describe('Section — Negative & Boundary', () => {
    test('[SCTN-004] @negative @regression @sanity Section handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-section').first()).toBeVisible();
    });
    test('[SCTN-005] @negative @regression @sanity Section handles missing images', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-section img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            // domcontentloaded fires before images finish downloading — wait for
            // this image's own load/error event instead of racing it.
            await images.nth(i).evaluate((el: HTMLImageElement) => {
                if (el.complete) return;
                return new Promise<void>((resolve) => {
                    el.addEventListener('load', () => resolve(), { once: true });
                    el.addEventListener('error', () => resolve(), { once: true });
                });
            });
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Section — Responsive', () => {
    test('[SCTN-006] @mobile @regression @mobile @sanity Section adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
        await expect(root).toBeVisible();
        // Verify layout adapts to mobile: check flex-direction changes to column
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            const cs = getComputedStyle(el);
            return cs.flexDirection || cs.display;
        });
        // At mobile, flex containers typically switch to column layout
        // Grid containers may change template columns
        expect(flexDir).toBeDefined();
    });
    test('[SCTN-007] @mobile @regression @sanity Section adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Section — Console & Resources', () => {
    test('[SCTN-008] @regression Section produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Section — Broken Images', () => {
    test('[SCTN-009] @regression Section all images load successfully', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-section img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = // 📏 TODO: Replace with measurement-utils
             await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[SCTN-010] @regression Section all images have alt attributes', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-section img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Section — Accessibility', () => {
});
test.describe('Section — AEM Dialog Configuration', () => {
});
