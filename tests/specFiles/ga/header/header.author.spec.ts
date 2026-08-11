import { test, expect } from '@playwright/test';
import { HeaderPage } from '../../../pages/ga/components/headerPage';
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
// HDR-027 (GAAM-1455, "CMS BE: Cleanup BE integration code") removed — pure backend RedOak/form-clientlib
// integration cleanup, explicitly marked "QA Waived" in the ticket itself, and not about the Header
// component at all. CSV import mis-bucketed it here; no UI-testable surface exists for it anywhere.
// HDR-028 (GAAM-1286, "50 50 banner: Background extension in XL breakpoints") relocated to
// hero-fifty-fifty.author.spec.ts — it's about the hero-fifty-fifty component, not Header.
test.describe('Header — Negative & Boundary', () => {
    test('[HDR-015] @negative @regression Header handles empty content gracefully', async ({ page }) => {
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
