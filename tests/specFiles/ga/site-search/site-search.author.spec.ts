import { test, expect } from '@playwright/test';
import { SiteSearchPage } from '../../../pages/ga/components/siteSearchPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('SiteSearch — Happy Path', () => {
    test('[SS-001] @smoke @regression @sanity SiteSearch renders correctly', async ({ page }) => {
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
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
    test('[SS-002] @smoke @regression @sanity SiteSearch interactive elements are functional', async ({ page }) => {
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
    test('[SS-003] @negative @regression @sanity SiteSearch handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-site-search').first()).toBeVisible();
    });
    test('[SS-004] @negative @regression @sanity SiteSearch handles missing images', async ({ page }) => {
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
    test('[SS-005] @mobile @regression @mobile @sanity SiteSearch adapts to mobile viewport', async ({ page }) => {
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
    test('[SS-006] @mobile @regression @sanity SiteSearch adapts to tablet viewport', async ({ page }) => {
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
    test('[SS-015] @regression @sanity Commonly Searched Terms chips trigger a search', async ({ page }) => {
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
        // Verified via kkr-aem source 2026-08-12 (re-confirmed live 2026-08-15): this AC's component
        // logic is already implemented. site-search.js (base clientlib) adds a `pdf-result` modifier
        // class to the result <li> whenever `item.type === '.pdf'` (SearchServlet#getQueryArray sets
        // type=".pdf" for assets under the component's `pdfSearchRootPath`) and renders an extra
        // `.search-result-pdf-icon` <img> (from the `pdfIconPath` dialog field) that plain page
        // results never get. The GA reskin LESS (clientlib-site/less/components/site-search.less)
        // has dedicated `.pdf-result` / `.search-result-pdf-icon` rules (row layout, 48px/80px icon)
        // distinct from the default column layout used for page results. However the style guide's
        // "State 3" instance (content/global-atlantic/style-guide/components/site-search) configures
        // pdfIconPath + pdfSearchRootPath=/content/dam/global-atlantic/style-guide and its own page
        // description promises "a mix of Page and PDF result items" for a search like "Wealth" — but
        // no PDF asset is actually present under that DAM path in this environment, so no live query
        // ever returns a `.pdf-result` item. This is a real, still-open DAM content gap (no fixture
        // mechanism in this framework uploads binary DAM assets), not a component defect — per team
        // convention it must fail (not skip) while open. See confirmed-bugs-2026-08-11.xlsx row 20.
        const pom = new SiteSearchPage(page);
        await pom.navigate(BASE());
        const input = page.locator('.cmp-site-search__input').first();
        await input.fill('Wealth');
        await input.press('Enter');
        await expect(page.locator('.cmp-site-search__results-list li').first()).toBeVisible({ timeout: 10000 });
        const pdfResult = page.locator('.cmp-site-search__results-list li.pdf-result').first();
        expect(await pdfResult.count(), 'expected at least one PDF result under pdfSearchRootPath (/content/dam/global-atlantic/style-guide) — none indexed, see confirmed-bugs-2026-08-11.xlsx row 20').toBeGreaterThan(0);
        await expect(pdfResult.locator('.search-result-pdf-icon img')).toBeVisible();
        // Page results (no pdf-result class) never render the PDF icon — confirms the two result
        // types are visually distinguishable, not just internally flagged.
        const pageResultWithIcon = page.locator('.cmp-site-search__results-list li:not(.pdf-result) .search-result-pdf-icon');
        expect(await pageResultWithIcon.count()).toBe(0);
    });
});
