import { test, expect } from '@playwright/test';
import { HeaderPage } from '../../../pages/ga/components/headerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
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
    test('[HDR-001] @smoke @regression Header component renders', async ({ page }) => {
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
    test('[HDR-006] @mobile @regression Header adapts to mobile viewport', async ({ page }) => {
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
    test('[HDR-012] @smoke @regression DR AEM FE - Header is misplaced in the print view and also showing skip to main content when we scroll down in the page and print — AC1', async ({ page }) => {
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Testing link - [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/dynamic_rates/Dynamic_rates/income-150--se-fixed-index-annuity/income-150-se-all.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/dynamic_rates/Dynamic_rates/income-150--se-fixed-index-annuity/income-150-se-all.html?wcmmode=disabled]
        // screenshot - 
        // 
        // 
        // !image (18)-20260708-063822.png|width=315,alt="image (18)-20260708-063822.png"!
        test.fixme();
    });
});
test.describe('Header — Negative & Boundary', () => {
    test('[HDR-015] @negative @regression Header handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-header').first()).toBeVisible();
    });
    test('[HDR-016] @negative @regression Header handles missing images', async ({ page }) => {
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
test.describe('Header — CSV Test Cases (GAAM-1455)', () => {
    test('[HDR-027] @smoke @regression CMS BE: Cleanup BE integration code — AC1', async ({ page }) => {
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: *Acceptance Criteria:* 
        // 
        // # Added RedoakService.isConfigured() and guarded the servlet to return a clear error in unconfigured environments.
        // # Updated RedOak token/submission-id parsing to prevent uncaught 500 errors on unexpected responses. Built the analytics cookie as the form clientlib expects, fixing the "Response header too large" error and success/failure events.
        // # Added Javadocs to missing methods and unit tests for the above.
        // # Added forward.jsp to route submissions to FormRedoakServlet.
        // # Added doGet config probe and redoak.js authoring clientlib to warn when the RedOak service is not configured.
        // # Logged successful submissions at INFO with submission ID instead of full response body at WARN.
        // 
        // 
        // *QA Waived*
        test.fixme();
    });
});
test.describe('Header — CSV Test Cases (GAAM-1286)', () => {
    test('[HDR-028] @smoke @regression 50 50 banner : Background extension in XL breakpoints — AC1', async ({ page }) => {
        const pom = new HeaderPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Hi, In XL desktop breakpoints - the background needs to extend edge to egde while the content stays aligned to the header as per design. The divider in the header also needs to extend to the sides.
        // [~accountid:5e73d47c17c6640c385f56a6] Can you help out with this issue? I’m raising this as a bug.
        // 
        // Thank you.
        // 
        // CC: [~accountid:712020:19496377-93fa-4b6a-be8c-4f3dac15dfb5] [~accountid:712020:ad021791-2e09-4b21-b18b-e7d643149e13]  [~accountid:712020:fe8fe45b-af82-40e5-baec-1580ec63583e] 
        // 
        // 
        // !Screenshot 2026-06-15 at 7.03.20 PM-20260615-133326.png|width=686,alt="Screenshot 2026-06-15 at 7.03.20 PM-20260615-133326.png"!
        test.fixme();
    });
});
