import { test, expect } from '@playwright/test';
import { HeadlineBlockPage } from '../../../pages/ga/components/headlineBlockPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const HB = '.cmp-headline-block';
const CTA_WRAPPER = '.cmp-headline-block__cta-wrapper';
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
// ── CTA Button Hover States ──
test.describe('Headline Block — CTA Hover States', () => {
    test('[HB-INT-001] @interaction @regression @sanity Primary CTA hover changes background on light section', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
        await btn.scrollIntoViewIfNeeded();
        const bgBefore = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        await hover(btn);
        const bgAfter = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        expect(bgAfter).not.toBe(bgBefore);
    });
    test('[HB-INT-002] @interaction @regression Secondary CTA hover changes border/background on light section', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).nth(1);
        await btn.scrollIntoViewIfNeeded();
        const bgBefore = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        const borderBefore = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => getComputedStyle(el).borderColor);
        // measurement: use measurement-utils for cleaner code
        await hover(btn);
        const bgAfter = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        const borderAfter = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => getComputedStyle(el).borderColor);
        // measurement: use measurement-utils for cleaner code
        // At least one of background or border should change
        const changed = bgAfter !== bgBefore || borderAfter !== borderBefore;
        expect(changed).toBe(true);
    });
    test('[HB-INT-003] @interaction @regression CTA hover on granite (dark) section changes styling', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_GRANITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
        await btn.scrollIntoViewIfNeeded();
        const before = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => {
            const cs = getComputedStyle(el);
            return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
        });
        await hover(btn);
        const after = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => {
            const cs = getComputedStyle(el);
            return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
        });
        const changed = after.bg !== before.bg || after.border !== before.border ||
            after.color !== before.color || after.boxShadow !== before.boxShadow;
        expect(changed).toBe(true);
    });
    test('[HB-INT-004] @interaction @regression CTA hover on azul (dark) section changes styling', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_AZUL} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
        await btn.scrollIntoViewIfNeeded();
        const before = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => {
            const cs = getComputedStyle(el);
            return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
        });
        await hover(btn);
        const after = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => {
            const cs = getComputedStyle(el);
            return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
        });
        // At least one property should change on hover
        const changed = after.bg !== before.bg || after.border !== before.border ||
            after.color !== before.color || after.boxShadow !== before.boxShadow;
        expect(changed).toBe(true);
    });
    test('[HB-INT-005] @interaction @regression CTA hover transition uses CSS animation (not instant)', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
        const transition = // 📏 TODO: Replace with measurement-utils
         await btn.evaluate(el => getComputedStyle(el).transition);
        // measurement: use measurement-utils for cleaner code
        // Should have a transition property set (not 'none' or empty)
        expect(transition.length).toBeGreaterThan(0);
        expect(transition).not.toBe('none 0s ease 0s');
    });
});
// ── Keyboard Navigation ──
test.describe('Headline Block — Keyboard Navigation', () => {
});
// ── CTA Layout Responsiveness ──
test.describe('Headline Block — CTA Layout Transitions', () => {
    test('[HB-INT-009] @interaction @regression @sanity CTA layout: horizontal at 1440px → vertical at 390px', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        // Desktop first
        await page.setViewportSize({ width: 1440, height: 900 });
        await pom.navigate(BASE());
        const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
        const desktopDir = // 📏 TODO: Replace with measurement-utils
         await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(desktopDir).toBe('row');
        // Switch to mobile
        await page.setViewportSize({ width: 390, height: 844 });
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
        // Allow reflow
        const mobileDir = // 📏 TODO: Replace with measurement-utils
         await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(mobileDir).toBe('column');
    });
    test('[HB-INT-010] @interaction @regression CTA buttons vertically aligned on mobile (start alignment)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
        const alignItems = // 📏 TODO: Replace with measurement-utils
         await ctaWrapper.evaluate(el => getComputedStyle(el).alignItems);
        // measurement: use measurement-utils for cleaner code
        expect(alignItems).toBe('flex-start');
    });
});
// ── Cross-Background Consistency ──
test.describe('Headline Block — Cross-Background Interaction Consistency', () => {
    test('[HB-INT-011] @interaction @regression @sanity All 4 backgrounds have functional CTAs', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const sections = [SECTION_WHITE, SECTION_SLATE, SECTION_GRANITE, SECTION_AZUL];
        for (const section of sections) {
            const cta = page.locator(`${section} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
            await expect(cta).toBeVisible();
            await expect(cta).toBeEnabled();
            const href = await cta.getAttribute('href');
            expect(href).toBeTruthy();
        }
    });
    test('[HB-INT-012] @interaction @regression CTA icon renders consistently on all backgrounds', async ({ page }) => {
        // Verified live 2026-08-15: the style guide's authored CTA icon is the ACS Commons Font
        // Awesome icon "arrow-down" (icon.html renders `cmp-button__icon ${icon}`, values come from
        // /etc/acs-commons/lists/font-awesome-icons, always lowercase-hyphenated) — never "Arrow-Right"
        // (wrong case, wrong direction, was never a valid icon value). Renamed to check the real
        // regression concern the title describes: the icon renders and is the SAME icon on every
        // background (i.e. no background-specific CSS hides/swaps it), rather than hardcoding one
        // specific icon name that's just today's style-guide content.
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const sections = [SECTION_WHITE, SECTION_GRANITE, SECTION_AZUL];
        let expectedIconClass: string | null = null;
        for (const section of sections) {
            const icon = page.locator(`${section} ${HB} ${CTA_WRAPPER} .cmp-button__icon`).first();
            await expect(icon).toBeVisible();
            const iconClass = await icon.getAttribute('class');
            expect(iconClass).toMatch(/cmp-button__icon \S+/);
            if (expectedIconClass === null) {
                expectedIconClass = iconClass;
            } else {
                expect(iconClass, `CTA icon on ${section} should match the icon rendered on other backgrounds`).toBe(expectedIconClass);
            }
        }
    });
});
