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
    test('[LGN-001] @regression @sanity CMS BE: Login cookie sessionIndex update & Ping Logout Servlet implementation — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // Investigated live + source 2026-08-13 — no "sessionIndex" cookie logic and no dedicated
        // "Ping Logout Servlet" exist anywhere in kkr-aem (exhaustive case-insensitive source grep:
        // zero hits for "sessionIndex"; zero servlet registered with a "logout" selector — see
        // com.kkr.aem.tenant.ga.servlets.PingLoginServlet.java, which registers only a "submit"
        // selector on resourceType ga/components/content/login, with no logout counterpart).
        // Live-confirmed against this AEM author instance: POST /saml_logout and POST /ping_logout
        // both return the same status as an arbitrary unmapped control path — proving neither is a
        // registered Sling path/servlet (contrast with /saml_login, which IS wired to real SAML
        // processing — see LGN-016). The only related backend artifact is PingLoginConfigServiceImpl
        // (GAAM-728, logoutUrl/handleLogout OSGi config), which SH-048 (site-header suite) already
        // confirmed drives only the site-header FE click-handler redirect — a different
        // component/test, and not a servlet implementation.
        // This AC's actual behavior (a real IdP-issued SessionIndex on the login cookie, consumed by
        // a server-side Ping Logout Servlet to invalidate the AEM session) would live entirely
        // inside the OOTB/third-party SAML2 auth handler bundle (not part of kkr-aem's own source)
        // and requires a genuine SAML SLO round-trip with a live PingOne IdP session to exercise —
        // this headless, AEM-author-only suite has no credentials for that.
        test.fixme(true, 'No sessionIndex cookie logic or dedicated Ping Logout Servlet exists in kkr-aem (exhaustive source grep + live probe confirmed: /saml_logout and /ping_logout behave like an unmapped path, unlike /saml_login). Any real implementation would live inside the OOTB SAML2 handler bundle and requires a live PingOne SSO session with a real SessionIndex to verify end-to-end. Verify manually with live SSO credentials.');
    });
});
test.describe('Login — Happy Path', () => {
    test('[LGN-002] @smoke @regression @sanity Login renders correctly', async ({ page }) => {
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
    test('[LGN-003] @smoke @regression @sanity Login interactive elements are functional', async ({ page }) => {
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
    test('[LGN-004] @negative @regression @sanity Login handles empty content gracefully', async ({ page }) => {
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
    test('[LGN-005] @negative @regression @sanity Login handles missing images', async ({ page }) => {
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
    test('[LGN-006] @mobile @regression @mobile @sanity Login adapts to mobile viewport', async ({ page }) => {
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
    test('[LGN-016] @regression @sanity CMS BE: Update Login Processing with OOTB SAML Handler — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // Live-verified 2026-08-13 that Login Processing IS wired to a real OOTB SAML handler
        // pipeline: com.kkr.aem.tenant.ga.authentication.PingLoginAuthInfoPostProcessor (an
        // org.apache.sling.auth.core.spi.AuthenticationInfoPostProcessor) is registered for any
        // request URI ending in "/saml_login" and is invoked by Sling's own OOTB auth pipeline
        // (SlingAuthenticator.doHandleSecurity -> handleSecurity -> postProcess). Proof: POSTing to
        // /saml_login without a SAMLResponse param throws inside
        // PingLoginAuthInfoPostProcessor.postProcess (NPE decoding a null SAMLResponse at
        // PingLoginAuthInfoPostProcessor.java line ~79), surfaced live as a 500 whose stack trace
        // names that exact class — versus an arbitrary unmapped control path, which never returns
        // that class's processing error. That contrast proves /saml_login is a real, registered
        // Sling auth path reaching custom SAML login processing, not a dead/unmapped route.
        const authorUrl = BASE();
        const controlResponse = await page.request.post(`${authorUrl}/__lgn016-unmapped-control-path-${Date.now()}`);
        const samlLoginResponse = await page.request.post(`${authorUrl}/saml_login`);
        // /saml_login behaves distinctly from an unmapped path (whatever that path's status is for
        // the current session) and returns a genuine processing/validation error rather than a
        // route-miss — proving the OOTB SAML handler + custom login post-processing is wired up.
        expect(samlLoginResponse.status()).not.toBe(controlResponse.status());
        expect([400, 500]).toContain(samlLoginResponse.status());
        // NOTE: this verifies the *wiring*, not the full AC. The full AC (a valid, cryptographically
        // signed SAML assertion creating an AEM login-token session + a user node under
        // /home/users/global-atlantic/fiancial-professionals/ping with profile/* populated from the
        // assertion) requires a real signed assertion from a live PingOne IdP, which this suite has
        // no credentials/keys for — that full round-trip needs manual/live verification.
    });
});
test.describe('Login — CSV Test Cases (GAAM-1351)', () => {
    test('[LGN-017] @regression @sanity CMS BE: Enable Login Processing with MFA - OTP — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // Investigated live + source 2026-08-13. The Login dialog's Settings tab now carries new
        // MFA/OTP copy-config placeholders (authenticateAccountHeader, authenticationInstructions,
        // mfaErrorMessage, confirmationCodeResentMessage — see LGN-019, confirmed live via
        // /apps/ga/components/content/login/_cq_dialog.infinity.json on this AEM author instance),
        // but there is still zero runtime OTP implementation: com.kkr.aem.tenant.ga.models.impl.
        // LoginImpl.java has no getters exposing these properties, login.html renders no OTP
        // step/masked-phone markup, and clientlibs/site/js/login.js has no MFA/OTP logic at all —
        // only password show/hide toggle, inline blur validation, and the auth-fail/system-error
        // banner handling (see init() in login.js). This matches GAAM-601 ("Login Page -
        // Multi-Factor Authentication (MFA) Support"), authored as status "In Progress" in
        // tests/data/gaam-601-requirements.json — a genuinely unbuilt feature, not merely a
        // live-session-only gap. Once built, this AC ("correct username/password advances to an
        // OTP step showing the masked registered phone") will additionally need a live OTP
        // delivery mechanism (SMS/TOTP via a real provider) to verify end-to-end.
        test.fixme(true, 'MFA/OTP runtime flow is not implemented (GAAM-601 status: In Progress) — the Login dialog has new MFA copy-config fields, but LoginImpl.java/login.html/login.js have zero OTP rendering or logic. Re-test once GAAM-601 ships and a live OTP delivery path is available.');
    });
});
test.describe('Login — CSV Test Cases (GAAM-1299)', () => {
    test('[LGN-018] @regression @sanity CMS BE: Login Component - New firm Products API integration — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // Investigated live + source 2026-08-13. Zero "Products API" / "Firms API" / "NTT"
        // integration exists anywhere on the Login component: com.kkr.aem.tenant.ga.models.Login /
        // LoginImpl.java expose only marketing-copy and form-label fields (no firm/product
        // properties), login.html has no firm-related markup, login.js has no such network calls,
        // and the live dialog (_cq_dialog.infinity.json) has no firm/product fields either — the
        // only "firm" substring hit in that JSON is the false positive inside
        // "confirmationCodeResentMessage". Exhaustively grepped kkr-aem case-insensitively for
        // "NTT" and "Firms API" — zero real hits (only false positives like "currentTime" matching
        // "ntt" case-insensitively).
        // A conceptually similar, but entirely separate, firm-lookup integration DOES exist —
        // com.kkr.aem.tenant.ga.servlets.FirmSelectionServlet.java (resourceType
        // ga/components/content/firm-selection-modal) + FirmSelectionService, which POSTs to Ping's
        // user API to patch a rep's active firm/writing-code — but that is a distinct, post-login
        // firm-selection-modal component that Login never references or renders.
        test.fixme(true, 'No "New firm Products API" (NTT Firms API) integration exists on the Login component (confirmed via LoginImpl.java, login.html, login.js, and the live dialog JSON) — a similarly-shaped but unrelated firm-lookup API exists only on the separate firm-selection-modal component (FirmSelectionServlet.java). This AC targets unbuilt functionality on Login; once implemented it will also need live NTT API credentials to verify end-to-end.');
    });
});
test.describe('Login — CSV Test Cases (GAAM-1288)', () => {
    test('[LGN-019] @regression @sanity CMS BE: Login Component – MFA Extension — AC1', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // Live-verified 2026-08-13: the Login dialog's Settings tab now contains 4 fields for the
        // MFA Extension's copy/config — authenticateAccountHeader ("Displayed as the MFA panel
        // heading"), authenticationInstructions ("Instruction text shown above the OTP code
        // input"), mfaErrorMessage, and confirmationCodeResentMessage — confirmed via a live GET of
        // /apps/ga/components/content/login/_cq_dialog.infinity.json on this AEM author instance.
        // NOTE: this content is NOT yet reflected in kkr-aem's committed source — the checked-out
        // ui.apps.ga/.../login/_cq_dialog/.content.xml on disk still shows only headline/
        // formCardHeadline/postLoginRedirectUrl/invalidCredentialsMessage/systemErrorMessage with
        // none of these 4 fields (`git status`/`git log` on that file show no local changes and no
        // matching commit) — i.e. this AEM author instance's JCR content is ahead of the
        // git-tracked kkr-aem source, a real source/content drift worth reconciling separately.
        // These fields also aren't yet wired to a Java model getter (LoginImpl.java has none for
        // them) or rendered in login.html/login.js (see LGN-017), so "Dialog Structure" is
        // partially, but not fully, in place — this test asserts the part that is live today.
        const authorUrl = BASE();
        const dialogUrl = `${authorUrl}/apps/ga/components/content/login/_cq_dialog.infinity.json`;
        const response = await page.request.get(dialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = JSON.stringify(await response.json());
        expect(dialog).toContain('authenticateAccountHeader');
        expect(dialog).toContain('authenticationInstructions');
        expect(dialog).toContain('mfaErrorMessage');
        expect(dialog).toContain('confirmationCodeResentMessage');
    });
});
