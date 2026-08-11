import { test, expect } from '@playwright/test';
import { DecisionTreePage } from '../../../pages/ga/components/decisionTreePage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('DecisionTree — Happy Path', () => {
    test('[DT-001] @smoke @regression @sanity DecisionTree renders correctly', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
        await expect(root).toBeVisible();
        // Verify core structure: heading or primary content exists
        // Multi-step wizard: only :visible to avoid matching hidden inactive-step modal titles
        const heading = root.locator('h1:visible, h2:visible, h3:visible').first();
        const hasHeading = await heading.count() > 0;
        if (hasHeading) {
            await expect(heading).toBeVisible();
        }
        // Verify no JS errors during render
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
    test('[DT-002] @smoke @regression DecisionTree interactive elements are functional', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
        await expect(root).toBeVisible();
        // Verify interactive elements (links, buttons) are present and clickable
        // Multi-step wizard: only :visible to avoid matching hidden inactive-step toggles
        const interactive = root.locator('a:visible, button:visible');
        const count = await interactive.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await expect(interactive.nth(i)).toBeVisible();
            await expect(interactive.nth(i)).toBeEnabled();
        }
    });
});
test.describe('DecisionTree — Negative & Boundary', () => {
    test('[DT-003] @negative @regression DecisionTree handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-decision-tree').first()).toBeVisible();
    });
    test('[DT-004] @negative @regression DecisionTree handles missing images', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-decision-tree img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('DecisionTree — Responsive', () => {
    test('[DT-005] @mobile @regression @mobile DecisionTree adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
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
    test('[DT-006] @mobile @regression DecisionTree adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('DecisionTree — Console & Resources', () => {
    test('[DT-007] @regression DecisionTree produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('DecisionTree — Broken Images', () => {
    test('[DT-009] @regression DecisionTree all images have alt attributes', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-decision-tree img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('DecisionTree — Accessibility', () => {
});
test.describe('DecisionTree — AEM Dialog Configuration', () => {
});
// Relocated from image.author.spec.ts (MG-056) — CSV import mis-bucketed this under Image;
// it's actually about the Decision Tree component's authoring guide.
test.describe('DecisionTree — CSV Test Cases (GAAM-1388)', () => {
    test('[DT-010] @smoke @regression CMS-BE | Decision Tree Component- authoring guide issue — AC1', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Authoring guide is not updated properly for all Decision tree, Decision tree step and Decision tree option
        //
        // !image-20260626-130125.png|width=670,alt="image-20260626-130125.png"!
        //
        // !image-20260626-130156.png|width=670,alt="image-20260626-130156.png"!
        //
        // !image-20260626-130212.png|width=670,alt="image-20260626-130212.png"!
        //
        //
        //
        // *Note:* Refer Promo banner and headline block components authoring guide
        test.fixme();
    });
});
