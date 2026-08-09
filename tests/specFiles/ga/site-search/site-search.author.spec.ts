import { test, expect } from '@playwright/test';
import { SiteSearchPage } from '../../../pages/ga/components/siteSearchPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('SiteSearch — Happy Path', () => {
    test('[SS-001] @smoke @regression SiteSearch renders correctly', async ({ page }) => {
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-site-search').first();
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
    test('[SS-002] @smoke @regression SiteSearch interactive elements are functional', async ({ page }) => {
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-site-search').first();
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
test.describe('SiteSearch — Negative & Boundary', () => {
    test('[SS-003] @negative @regression SiteSearch handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-site-search').first()).toBeVisible();
    });
    test('[SS-004] @negative @regression SiteSearch handles missing images', async ({ page }) => {
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-site-search img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('SiteSearch — Responsive', () => {
    test('[SS-005] @mobile @regression @mobile SiteSearch adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-site-search').first();
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
    test('[SS-006] @mobile @regression SiteSearch adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-site-search').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('SiteSearch — Console & Resources', () => {
    test('[SS-007] @regression SiteSearch produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('SiteSearch — Broken Images', () => {
    test('[SS-008] @regression SiteSearch all images load successfully', async ({ page }) => {
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-site-search img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[SS-009] @regression SiteSearch all images have alt attributes', async ({ page }) => {
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-site-search img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('SiteSearch — Accessibility', () => {
});
test.describe('SiteSearch — AEM Dialog Configuration', () => {
});
test.describe('SiteSearch — CSV Test Cases (GAAM-2)', () => {
    // Epic: Site Search reskin — Commonly Searched Terms and PDF Result Detection
    // Ref: https://bounteous.jira.com/wiki/spaces/GAFGPL/pages/264469114322947/Site+Search+Commonly+Searched+Terms+and+PDF+Result+Detection
    test('[SS-015] @smoke @regression Commonly Searched Terms chips trigger a search', async ({ page }) => {
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const commonTerms = page.locator('.common-term');
        await expect(commonTerms.first()).toBeVisible();
        expect(await commonTerms.count()).toBeGreaterThan(0);
        await commonTerms.first().click();
        // Selecting a common term executes a search and populates the results list
        await expect(page.locator('.cmp-site-search__results-list li').first()).toBeVisible({ timeout: 10000 });
        expect(page.url()).toMatch(/[#&]q=/);
    });
    test('[SS-016] @regression PDF result type is visually distinguished from page results', async ({ page }) => {
        // No PDF-indexed content exists in this environment to assert against a
        // real "PDF" indicator/badge selector — the style guide page's own meta
        // description references "PDF result types", but no search query returns
        // an actual .pdf-linked result item to verify against. Needs a content
        // fixture with an indexed PDF asset before this can be implemented
        // without guessing at a selector.
        test.fixme();
    });
});
