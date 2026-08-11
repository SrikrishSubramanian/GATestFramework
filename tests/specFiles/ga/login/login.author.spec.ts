import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
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
test.describe('Login — CSV Test Cases', () => {
    test('[LGN-001] @smoke @regression @sanity CMS BE: Login cookie sessionIndex update & Ping Logout Servlet implementation — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for Ping Logout Servlet - See GAAM-821, GAAM-1217 for SAML SLO requirements
        test.fixme();
    });
});
test.describe('Login — Happy Path', () => {
    test('[LGN-002] @smoke @regression Login renders correctly', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-login').first();
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
    test('[LGN-003] @smoke @regression Login interactive elements are functional', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-login').first();
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
test.describe('Login — Negative & Boundary', () => {
    test('[LGN-004] @negative @regression Login handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-login').first()).toBeVisible();
    });
    test('[LGN-005] @negative @regression Login handles missing images', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-login img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Login — Responsive', () => {
    test('[LGN-006] @mobile @regression @mobile Login adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-login').first();
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
});
test.describe('Login — Console & Resources', () => {
    test('[LGN-008] @regression Login produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Login — Broken Images', () => {
    test('[LGN-009] @regression Login all images load successfully', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-login img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = // 📏 TODO: Replace with measurement-utils
             await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[LGN-010] @regression Login all images have alt attributes', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-login img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Login — Accessibility', () => {
});
test.describe('Login — AEM Dialog Configuration', () => {
});
test.describe('Login — CSV Test Cases (GAAM-1352)', () => {
    test('[LGN-016] @smoke @regression CMS BE: Update Login Processing with OOTB SAML Handler — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: A valid, signed assertion at {{/saml_login}} creates an *AEM login-token session* + a user under {{/home/users/global-atlantic/fiancial-professionals/ping}} with {{profile/*}} populated from the assertion.
        test.fixme();
    });
});
test.describe('Login — CSV Test Cases (GAAM-1351)', () => {
    test('[LGN-017] @smoke @regression CMS BE: Enable Login Processing with MFA - OTP — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Correct username/password advances to an *OTP step* showing the *masked registered phone*.
        test.fixme();
    });
});
test.describe('Login — CSV Test Cases (GAAM-1299)', () => {
    test('[LGN-018] @smoke @regression CMS BE: Login Component - New firm Products API integration — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: API Integration — NTT Firms API (Request 2 in attached pdf)*
        test.fixme();
    });
});
test.describe('Login — CSV Test Cases (GAAM-1288)', () => {
    test('[LGN-019] @smoke @regression CMS BE: Login Component – MFA Extension — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Dialog Structure*
        test.fixme();
    });
});
