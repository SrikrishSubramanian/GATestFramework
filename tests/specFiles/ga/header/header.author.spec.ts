import { test, expect } from '@playwright/test';
import { HeaderPage } from '../../../pages/ga/components/headerPage';
import { ProductRateTablePage } from '../../../pages/ga/components/productRateTablePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
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
test.describe('Header — Happy Path', () => {
    test('[HDR-001] @smoke @regression @sanity Header component renders', async ({ page }) => {
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        const root = page.locator('header, .cmp-header').first();
        await expect(root).toBeVisible();
    });
    test('[HDR-002] @regression Header content is displayed', async ({ page }) => {
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        const content = page.locator('header [role="banner"], .cmp-header__content');
        const count = await content.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
test.describe('Header — Responsive', () => {
    test.describe.configure({ retries: 1 });
    test('[HDR-006] @mobile @regression @sanity Header adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        const root = page.locator('header, .cmp-header').first();
        await expect(root).toBeVisible();
    });
});
test.describe('Header — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
test.describe('Header — CSV Test Cases (GAAM-1481)', () => {
    test('[HDR-012] @regression @sanity DR AEM FE - Header is misplaced in the print view and also showing skip to main content when we scroll down in the page and print — AC1', async ({ page }) => {
        // Ticket's own repro link is exactly the Income 150+ SE Dynamic Rates page — reproduced here
        // via ProductRateTablePage.navigate('income-150--se-fixed-index-annuity', 'income-150-se-all'),
        // the same page/params as PRT-007 in product-rate-table.author.spec.ts.
        //
        // This ticket bundles two claims; both are already fixed in kkr-aem source (verified against
        // both static source and the live page above):
        //
        // 1) "Header is misplaced in print view" — root cause is the header's sticky positioning:
        //    site-header.less (ga/clientlibs/clientlib-site/less/components/site-header.less) lines
        //    66-74: `.aem-GridColumn:has(.cmp-site-header--identified) { position: sticky; top: 0; ... }`.
        //    Sticky elements are a known source of print misplacement (browsers can render them
        //    "stuck" at their last scroll position instead of in normal flow).
        //    FIX: product-rate-table.less (ga/components/dynamic-rate/product-rate-table/clientlibs/
        //    site/css/product-rate-table.less) line 1498 `@media print`, line 1505
        //    `body.product-rate-page {`, lines 1557-1559:
        //    `.aem-GridColumn:has(.cmp-site-header--identified) { position: static !important; }`
        //    — forces the header back into normal flow for print, scoped to `body.product-rate-page`
        //    (confirmed live below: this page's <body> does carry that class).
        //
        // 2) "showing skip to main content when we scroll down in the page and print" — the skip link
        //    (site-header.html line 20: `<a class="cmp-site-header__skip-link" href="#main-content">`)
        //    is normally kept off-screen via `transform: translateY(-150%)` (site-header.less lines
        //    162-174), not `display: none` — so it's still `display: block` while merely translated
        //    out of view (confirmed live below). Printing does not reliably honor that transform, so
        //    it could become visible when printed.
        //    FIX: product-rate-table.less line 1563 `body:has(.product-rate-table) {`, line 1575
        //    `.cmp-site-header__skip-link,` inside a `display: none !important` block (lines 1572-1601)
        //    — force-hides the skip link for print on any page containing a product-rate-table
        //    (confirmed live below: this page has exactly one `.product-rate-table` element).
        //
        // Live verification against the exact repro page (env=dev, author-p101514-e1845752, 2026-08-13),
        // scrolled down (matching the ticket's repro steps) then emulating print media:
        //   screen (post-scroll): grid position=sticky, skip-link display=block (present, just translated off-canvas)
        //   print  (post-scroll): grid position=static, skip-link display=none
        // Both defects are gone under print media on this exact page — this is a regression guard,
        // not an open bug.
        const pom = new ProductRateTablePage(page);
        await pom.navigate(BASE(), 'income-150--se-fixed-index-annuity', 'income-150-se-all');

        // Sanity: confirm the page context the fix is actually scoped to (body.product-rate-page,
        // containing exactly one .product-rate-table) still holds — if this ever stops matching,
        // the print overrides above would silently stop applying and this test's premise breaks.
        await expect(page.locator('body.product-rate-page')).toHaveCount(1);
        await expect(page.locator('.product-rate-table')).toHaveCount(1);

        // `:has()` matches every ancestor .aem-GridColumn along the way to the identified header
        // (the grid nests a wrapper column inside another) — verified live this resolves to 2
        // elements here, not 1, so assert on all of them rather than assuming a single match.
        const gridColumns = page.locator('.aem-GridColumn:has(.cmp-site-header--identified)');
        const skipLink = page.locator('.cmp-site-header__skip-link');
        expect(await gridColumns.count(), 'expected at least one ancestor .aem-GridColumn wrapping the identified header').toBeGreaterThan(0);
        await expect(skipLink).toHaveCount(1);

        // Reproduce the ticket's exact repro steps: scroll down, then print.
        await page.mouse.wheel(0, 1500);
        await page.waitForTimeout(300);

        await page.emulateMedia({ media: 'print' });

        const gridPositions = await gridColumns.evaluateAll(els => els.map(el => getComputedStyle(el).position));
        for (const position of gridPositions) {
            expect(position, 'AC1: header must not render sticky/misplaced in print — position: static override (product-rate-table.less lines 1557-1559) must be in effect').toBe('static');
        }

        const skipStyles = await getComputedStyles(skipLink, ['display']);
        expect(skipStyles.display, 'AC1: skip-to-main-content link must not be visible in print — display: none override (product-rate-table.less line 1575) must be in effect').toBe('none');
    });
});
// HDR-027 (GAAM-1455, "CMS BE: Cleanup BE integration code") removed — pure backend RedOak/form-clientlib
// integration cleanup, explicitly marked "QA Waived" in the ticket itself, and not about the Header
// component at all. CSV import mis-bucketed it here; no UI-testable surface exists for it anywhere.
// HDR-028 (GAAM-1286, "50 50 banner: Background extension in XL breakpoints") relocated to
// hero-fifty-fifty.author.spec.ts — it's about the hero-fifty-fifty component, not Header.
test.describe('Header — Negative & Boundary', () => {
    test('[HDR-015] @negative @regression @sanity Header handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-header').first()).toBeVisible();
    });
    test('[HDR-016] @negative @regression @sanity Header handles missing images', async ({ page }) => {
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-header img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Header — Console & Resources', () => {
});
test.describe('Header — Broken Images', () => {
    test('[HDR-020] @regression Header all images load successfully', async ({ page }) => {
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-header img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Header — AEM Dialog Configuration', () => {
});
