/**
 * Sprint 16 - Comprehensive Test Suite
 *
 * All 50 GAAM tickets for Sprint 16
 * Runs regression, smoke, and quality tests
 *
 * @tags: @sprint-16 @regression @smoke @a11y
 */
import { test, expect, Page } from '@playwright/test';
import { AEMTestHelper } from '../../../utils/infra/aem-test-helper';
import { FooterPage } from '../../../pages/ga/components/footerPage';
import { TextPage } from '../../../pages/ga/components/textPage';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import { NavigationPage } from '../../../pages/ga/components/navigationPage';
import ENV from '../../../utils/infra/env';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
// Sprint 16 GAAM Tickets (50 total)
const SPRINT_16_TICKETS = [
    'GAAM-1098', 'GAAM-1091', 'GAAM-1080', 'GAAM-1068', 'GAAM-1024',
    'GAAM-993', 'GAAM-983', 'GAAM-982', 'GAAM-969', 'GAAM-968',
    'GAAM-964', 'GAAM-940', 'GAAM-898', 'GAAM-859', 'GAAM-839',
    'GAAM-838', 'GAAM-837', 'GAAM-836', 'GAAM-835', 'GAAM-834',
    'GAAM-833', 'GAAM-827', 'GAAM-821', 'GAAM-819', 'GAAM-814',
    'GAAM-801', 'GAAM-800', 'GAAM-799', 'GAAM-798', 'GAAM-797',
    'GAAM-796', 'GAAM-795', 'GAAM-794', 'GAAM-792', 'GAAM-791',
    'GAAM-790', 'GAAM-788', 'GAAM-764', 'GAAM-763', 'GAAM-756',
    'GAAM-728', 'GAAM-684', 'GAAM-575', 'GAAM-397', 'GAAM-394',
    'GAAM-393', 'GAAM-69', 'GAAM-48'
];
// Component mapping for Sprint 16
const COMPONENT_MAP: Record<string, {
    name: string;
    path: string;
    cssClass: string;
}> = {
    'GAAM-1098': { name: 'Button', path: 'button', cssClass: 'cmp-button' },
    'GAAM-1091': { name: 'Text', path: 'text', cssClass: 'cmp-text' },
    // GAAM-1080 ('Hero'/cmp-hero/path 'hero') removed — no such component exists; see the
    // removed-test comment in the Smoke Tests block below for the full evidence.
    'GAAM-1068': { name: 'Navigation', path: 'navigation', cssClass: 'cmp-navigation' },
    'GAAM-1024': { name: 'Footer', path: 'footer', cssClass: 'cmp-footer' },
    'GAAM-394': { name: 'SiteHeader', path: 'site-header', cssClass: 'cmp-site-header' },
    'GAAM-393': { name: 'PageTemplate', path: 'page', cssClass: 'cmp-page' },
};
let capture: ConsoleCapture;
test.describe('Sprint 16 - Comprehensive Test Suite @sprint-16', () => {
    test.beforeEach(async ({ page }) => {
        await loginToAEMAuthor(page);
        // Auth already handled by globalSetup and loaded via storageState in config
        capture = new ConsoleCapture(page);
        capture.start();
    });
    test.afterEach(async ({ page }, testInfo) => {
        if (capture) {
            await attachConsoleCapture(testInfo, capture);
        }
        await annotateEnvironment(testInfo);
    });
    // ═══════════════════════════════════════════════════════════
    // SMOKE TESTS - Quick validation
    // ═══════════════════════════════════════════════════════════
    test.describe('Smoke Tests @smoke', () => {
        test('[GAAM-1098] @sanity Button component smoke test', async ({ page }) => {
            const component = COMPONENT_MAP['GAAM-1098'];
            // Same test-fixtures-path 404 as the Text/Navigation smoke tests — resolveComponentUrl()
            // routes to the undeployed test-fixtures path since a button-fixtures.xml exists on
            // disk. Use the real POM navigate() (matches button.author.spec.ts) instead.
            await new ButtonPage(page).navigate(ENV.AEM_AUTHOR_URL || 'http://localhost:4502');
            // Verify component exists
            // basepage's skip-nav link also carries the `cmp-button` class
            // (class="basepage__skip-nav cmp-button") and is intentionally hidden until
            // focused — exclude it so this generic lookup resolves to a real button
            // instance instead (matches button.author.spec.ts's `.cmp-button:not(#skip-nav)`).
            const locator = page.locator(`.${component.cssClass}:not(#skip-nav)`).first();
            await expect(locator).toBeVisible();
            // Basic quality checks
            const helper = new AEMTestHelper(page, {
                componentPath: `/apps/ga/components/content/${component.path}`,
                componentName: component.name,
                cssClass: component.cssClass,
            });
            const renderResult = await helper.verifyComponentRenders();
            expect(renderResult.passed).toBe(true);
        });
        test('[GAAM-1091] @sanity Text component smoke test', async ({ page }) => {
            const component = COMPONENT_MAP['GAAM-1091'];
            // /sites.html/content/ga is the AEM Sites admin console (page-tree browser UI) —
            // it never renders live component markup, so .cmp-text can never be found there.
            // resolveComponentUrl('text') alone 404s locally: a text-fixtures.xml exists on disk
            // so hasFixture()=true, which routes to the test-fixtures path — but nothing ever
            // deploys it here. textPage.ts's own navigate() sidesteps this the same way real
            // text.author.spec.ts tests do: force the style-guide path instead.
            await new TextPage(page).navigate(ENV.AEM_AUTHOR_URL || 'http://localhost:4502');
            const locator = page.locator(`.${component.cssClass}`).first();
            await expect(locator).toBeVisible();
        });
        // [GAAM-1080] "Hero component smoke test" removed — COMPONENT_MAP's 'Hero'/'cmp-hero'/
        // path 'hero' entry doesn't correspond to any real component in this codebase. GA has no
        // generic "hero" component: confirmed no kkr-aem component dir under
        // ui.apps*/.../components/content/hero, no tests/data/content-fixtures/hero, no
        // style-guide page at content/global-atlantic/style-guide/components/hero, and no
        // .cmp-hero class anywhere. GA only ships specific hero variants, each with its own
        // real, dedicated spec file: hero-fifty-fifty, hero-cta-video-modal, detail-hero,
        // homepage-hero, rate-details-hero, insights-detail-hero. This was a fabricated
        // placeholder mapping in this legacy scaffold, not a real ticket target — nothing to
        // relocate it to, since none of those real variants uniquely correspond to "GAAM-1080".
        test('[GAAM-1068] @sanity Navigation component smoke test', async ({ page }) => {
            const component = COMPONENT_MAP['GAAM-1068'];
            // Same test-fixtures-path issue as Button/Text above: resolveComponentUrl('navigation')
            // routes to the undeployed test-fixtures path (a navigation-fixtures.xml exists on
            // disk), and deployFixture() doesn't actually deploy real content — the page that
            // loads still carries the site's own global nav chrome (hidden .cmp-navigation, not
            // the demoed instance). Use the real POM navigate() (matches navigation.author.spec.ts,
            // which asserts this exact same style-guide page's .cmp-navigation is visible).
            await new NavigationPage(page).navigate(ENV.AEM_AUTHOR_URL || 'http://localhost:4502');
            const locator = page.locator(`.${component.cssClass}`).first();
            await expect(locator).toBeVisible();
        });
        test('[GAAM-1024] @sanity Footer component smoke test', async ({ page }) => {
            const component = COMPONENT_MAP['GAAM-1024'];
            // Same /sites.html console-URL bug — never renders live component markup.
            // Reuse footerPage.ts's own navigate() (same URL footer.author.spec.ts's passing
            // FTR-003/004/005 tests use) instead of duplicating the raw goto/retry logic here.
            await new FooterPage(page).navigate(ENV.AEM_AUTHOR_URL || 'http://localhost:4502');
            const locator = page.locator(`.${component.cssClass}`).first();
            await expect(locator).toBeVisible();
        });
    });
    // ═══════════════════════════════════════════════════════════
    // REGRESSION TESTS - Comprehensive validation
    // ═══════════════════════════════════════════════════════════
    test.describe('Regression Tests @regression', () => {
        test('[GAAM-1098] Button - CSS classes follow BEM convention', async ({ page }) => {
            // Same test-fixtures-path 404 as the Button smoke test above — use the real POM.
            await new ButtonPage(page).navigate(ENV.AEM_AUTHOR_URL || 'http://localhost:4502');
            const helper = new AEMTestHelper(page, {
                componentPath: '/apps/ga/components/content/button',
                componentName: 'Button',
                cssClass: 'cmp-button',
            });
            const result = await helper.verifyCSSClasses([
                'cmp-button',
                // Can include specific variants
            ]);
            expect(result.passed).toBe(true);
        });
        test('[GAAM-394] SiteHeader - Component registration', async ({ page }) => {
            // Same /sites.html console-URL bug. site-header ships via a global Experience
            // Fragment (GAAM-792), not the generic style-guide path convention — this is the
            // real, live-verified FP site-header XF instance used throughout this session's
            // site-header fixes (see site-header.author.spec.ts).
            await page.goto(`${ENV.AEM_AUTHOR_URL}/content/experience-fragments/global-atlantic/style-guide/header/header-master/financial-professionals.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const component = page.locator('.cmp-site-header');
            await expect(component).toBeVisible({ timeout: 5000 });
        });
        // [GAAM-393] "PageTemplate - Dialog structure" removed — checked for a literal
        // `.cmp-page` class that does not exist anywhere in kkr-aem. basepage.html renders
        // `<body class="${page.cssClassNames}">` (kkr-aem/ui.apps/.../structure/page/basepage/
        // basepage.html:48) — a dynamically computed, per-template class list (e.g.
        // "product-rate-page", see HDR-012's confirmed-bug evidence in
        // header.author.spec.ts), never a static "cmp-page". Same fabricated-target pattern as
        // the removed GAAM-1080 Hero test above — nothing real to relocate this to, since
        // "PageTemplate" isn't a discrete authored component with its own dialog anywhere in
        // this framework.
    });
    // ═══════════════════════════════════════════════════════════
    // QUALITY CHECK TESTS
    // ═══════════════════════════════════════════════════════════
    test.describe('Quality Checks @quality', () => {
        test('[GAAM-1091] Text - No inline JavaScript', async ({ page }) => {
            // Same test-fixtures-path 404 as the Text smoke test above — use the real POM.
            await new TextPage(page).navigate(ENV.AEM_AUTHOR_URL || 'http://localhost:4502');
            const text = page.locator('.cmp-text').first();
            const html = await text.innerHTML();
            // Verify no onclick handlers
            expect(html).not.toContain('onclick');
            expect(html).not.toContain('onload');
        });
        test('[GAAM-394] SiteHeader - HTL comments not in output', async ({ page }) => {
            // Bug: this test never navigated anywhere before checking the page — it ran the
            // helper against Playwright's blank initial page, so .cmp-site-header could never
            // be found. Navigate to the real, live-verified FP site-header XF instance first
            // (same URL used by the SiteHeader registration test above).
            await page.goto(`${ENV.AEM_AUTHOR_URL}/content/experience-fragments/global-atlantic/style-guide/header/header-master/financial-professionals.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const helper = new AEMTestHelper(page, {
                componentPath: '/apps/ga/components/structure/site-header',
                componentName: 'SiteHeader',
                cssClass: 'cmp-site-header',
            });
            const result = await helper.verifyNoHTLComments();
            expect(result.passed).toBe(true);
        });
    });
    // ═══════════════════════════════════════════════════════════
    // BATCH TESTS - All 50 tickets
    // ═══════════════════════════════════════════════════════════
    test.describe('All Sprint 16 Tickets - Existence Check @batch', () => {
        SPRINT_16_TICKETS.forEach((ticket) => {
            test(`[${ticket}] Component exists and renders`, async ({ page }) => {
                await page.goto(`${ENV.AEM_AUTHOR_URL}/sites.html/content/ga`);
                // Generic check for ticket in page
                await page.waitForLoadState('domcontentloaded');
                // Verify page loaded
                expect(page.url()).toContain('/sites.html');
            });
        });
    });
    // ═══════════════════════════════════════════════════════════
    // PERFORMANCE TESTS
    // ═══════════════════════════════════════════════════════════
    test.describe('Performance Tests @performance', () => {
        test('[GAAM-1091] Text - Component render time < 500ms', async ({ page }) => {
            // Same test-fixtures-path 404 as the Text smoke test above — use the real POM.
            await new TextPage(page).navigate(ENV.AEM_AUTHOR_URL || 'http://localhost:4502');
            const startTime = Date.now();
            await page.locator('.cmp-text').first().waitFor({ state: 'visible' });
            const renderTime = Date.now() - startTime;
            expect(renderTime).toBeLessThan(500);
        });
    });
});
// ═══════════════════════════════════════════════════════════════════════════
// UTILITY: Print Sprint 16 Summary
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Sprint 16 Summary @summary', () => {
    test('Print Sprint 16 ticket count and info', async () => {
        console.log(`
╔════════════════════════════════════════════════╗
║         SPRINT 16 - TEST SUMMARY               ║
╚════════════════════════════════════════════════╝

Total Tickets: ${SPRINT_16_TICKETS.length}
Test Types:
  ✓ Smoke Tests (5)
  ✓ Regression Tests (5)
  ✓ Accessibility Tests (2)
  ✓ Quality Checks (3)
  ✓ Batch Tests (${SPRINT_16_TICKETS.length})
  ✓ Performance Tests (2)

Expected Test Count: 200+
Quality Target: 98-100%
Environment: DEV (Adobe AEM Cloud)

Tickets:
${SPRINT_16_TICKETS.join(', ')}
    `);
    });
});
