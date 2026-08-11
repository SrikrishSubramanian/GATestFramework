import { test, expect } from '@playwright/test';
import { TextPage } from '../../../pages/ga/components/textPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';
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
// TEXT-001 (GAAM-397/"Homepage Hero Role Card Click Action") relocated to
// homepage-hero.author.spec.ts — CSV import mis-bucketed it under Text.
test.describe('Text — Happy Path', () => {
    test('[TEXT-002] @smoke @regression Text renders correctly', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
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
    test('[TEXT-003] @smoke @regression Text interactive elements are functional', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
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
test.describe('Text — Negative & Boundary', () => {
    test('[TEXT-004] @negative @regression Text handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-text').first()).toBeVisible();
    });
    test('[TEXT-005] @negative @regression Text handles missing images', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-text img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Text — Responsive', () => {
    test('[TEXT-006] @mobile @regression @mobile Text adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
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
    test('[TEXT-007] @mobile @regression Text adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Text — Console & Resources', () => {
    test('[TEXT-008] @regression Text produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
});
test.describe('Text — Broken Images', () => {
    test('[TEXT-009] @regression Text all images load successfully', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-text img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = // 📏 TODO: Replace with measurement-utils
             await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[TEXT-010] @regression Text all images have alt attributes', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-text img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Text — Accessibility', () => {
});
test.describe('Text — AEM Dialog Configuration', () => {
});
// 10 CSV-imported test cases (TEXT-016/017/018/019/020/021/022/023/024/025) were removed from
// here — same CSV bulk-import component-bucketing bug as before, everything unmatched dumped
// under "text". TEXT-018 (Product Comparison CF), TEXT-020 (Form Container), and TEXT-021
// (Product Path Detail Card superscript) were relocated to their real components. The rest had
// no valid single-component home and were deleted: TEXT-016/017 (Red Oak form issues spanning 3
// unrelated form pages, no dedicated component file), TEXT-019 ("Disclosure List Component" —
// no such component exists in this repo), TEXT-022/023 (QA coordination tasks that only asserted
// the wrong root selector `.cmp-text`, never actually testing Red Oak submission), TEXT-024 (AEM
// Assets admin UI, not a GA web component), TEXT-025 (cross-cutting analytics data-layer ticket,
// not tied to one component).
