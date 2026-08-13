import { test, expect } from '@playwright/test';
import { HomepageHeroPage } from '../../../pages/ga/components/homepageHeroPage';
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
test.describe('Homepage Hero — Happy Path', () => {
    test('[HH-001] @smoke @regression @sanity Homepage Hero component renders', async ({ page }) => {
        const pom = new HomepageHeroPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-homepage-hero').first();
        await expect(root).toBeVisible();
    });
    test('[HH-002] @regression Hero background image loads', async ({ page }) => {
        const pom = new HomepageHeroPage(page);
        await pom.navigate(BASE());
        const hero = page.locator('.cmp-homepage-hero__image');
        await expect(hero).toBeVisible();
    });
});
test.describe('Homepage Hero — Responsive', () => {
    test.describe.configure({ retries: 1 });
    test('[HH-006] @mobile @regression @sanity Homepage Hero adapts to mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const pom = new HomepageHeroPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-homepage-hero').first();
        await expect(root).toBeVisible();
    });
});
test.describe('Homepage Hero — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
// Relocated from text.author.spec.ts (TEXT-001) — CSV import mis-bucketed this under Text;
// it's actually about the Homepage Hero role card click behavior.
test.describe('Homepage Hero — CSV Test Cases (GAAM-397)', () => {
    test('[HH-007] @regression @sanity CMS FE: Homepage Hero Role Card Click Action — AC1', async ({ page }) => {
        // GAAM-397 AC1's literal text calls for a "Local Storage Write on Card Click", but that
        // mechanism does not exist anywhere in this codebase: homepage-hero.js
        // (clientlibs/site/js/homepage-hero.js, ~2350 lines) has zero localStorage/sessionStorage
        // references, and neither does HomePageShrinkModeModelImpl.java or homepage-hero.html.
        // What IS built for "Role Card Click Action" is plain anchor navigation: each role card is
        // meant to render as a single
        //   <a class="hero-role-card" href="${card.shrinkCtaLink.href}">
        // (homepage-hero.html lines 202-205), with the href resolved via LinkUtilService in
        // HomePageShrinkModeModelImpl.getShrinkCtaLink() (lines 132-140).
        //
        // Content check (live JCR, .../homepage-hero/jcr:content.infinity.json): "Individuals" is
        // the only role card authored with a real internal link
        // (shrinkCtaLink="/content/ga/style-guide/components") — every other card on the page
        // ("Financial Professionals", "Institutions", "Investors", "Pre-Need Planners") uses the
        // "#" placeholder.
        //
        // CONFIRMED PRODUCT BUG (verified on live DOM, both homepage-hero instances on this page,
        // at a desktop viewport so the mobile infinite-scroll card cloning in
        // initMobileRoleCards() doesn't obscure the server-rendered markup): when shrinkCtaLink
        // resolves to a real internal link, the entire <a class="hero-role-card"> wrapper fails to
        // render — only the inner <div class="hero-role-card__inner"> content is emitted as a bare
        // sibling inside .hero-role-cards__container, with no anchor tag at all around it. Cards
        // authored with "#" (e.g. "Financial Professionals", right next to it in the DOM) render
        // their <a href="#"> wrapper correctly. So the one role card with a genuine navigation
        // target is the one card on the page that is completely unclickable — the opposite of what
        // AC1 (role card click action) requires.
        await page.setViewportSize({ width: 1920, height: 1080 });
        const pom = new HomepageHeroPage(page);
        await pom.navigate(BASE());
        const individualsHeading = page.locator('.hero-role-card__content h3', { hasText: 'Individuals' }).first();
        await expect(individualsHeading).toBeVisible();
        const individualsAnchor = page.locator('a.hero-role-card', { has: page.locator('h3', { hasText: 'Individuals' }) });
        expect(
            await individualsAnchor.count(),
            'Individuals role card is authored with a real internal link (shrinkCtaLink) but renders with no <a class="hero-role-card"> wrapper at all, so the click-to-navigate action required by AC1 cannot happen'
        ).toBeGreaterThan(0);
        // Once the missing-anchor bug is fixed, the card's click target should resolve to the
        // authored internal link (not the "#" placeholder used by the other cards).
        await expect(individualsAnchor.first()).not.toHaveAttribute('href', '#');
        await expect(individualsAnchor.first()).toHaveAttribute('href', /style-guide\/components/);
    });
});
