import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const TC = '.cmp-teaser-card';
// Verified live 2026-08-12 against the real DOM (author.spec.ts already has the correct names —
// this file was generated before some CSS renames and was never resynced):
// - `.cmp-teaser-card__link` never existed; the actual clickable element is the card root itself
//   when CTA is authored (`a.cmp-teaser-card`) — `__cta` is just an inner label <span>, not focusable.
// - Modifier classes (--enhanced-hover, --layout-image-*, --image-rectangle) live on the OUTER
//   `.teaser-card` wrapper, not on the inner `.cmp-teaser-card` root — compounding them with `TC`
//   produced impossible selectors that never matched anything.
// - `--image-position-left/right` and `--image-style-rectangle` were never real classes; the real
//   ones are `--layout-image-left/right` and `--image-rectangle`.
const TC_OUTER = '.teaser-card';
const TC_LINK = `a${TC}`;
const TC_CTA = '.cmp-teaser-card__cta'; // the visual CTA text span inside a linked card
const TC_IMAGE_WRAPPER = '.cmp-teaser-card__image-wrapper';
const TC_TITLE = '.cmp-teaser-card__title';
const TC_DESCRIPTOR = '.cmp-teaser-card__descriptor';
const TC_CONTENT = '.cmp-teaser-card__content-wrapper';
const TC_ENHANCED = `${TC_OUTER}.cmp-teaser-card--enhanced-hover`;
const TC_POS_LEFT = `${TC_OUTER}.cmp-teaser-card--layout-image-left`;
const TC_POS_RIGHT = `${TC_OUTER}.cmp-teaser-card--layout-image-right`;
const TC_IMG_RECTANGLE = `${TC_OUTER}.cmp-teaser-card--image-rectangle`;
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
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
// ---------------------------------------------------------------------------
// Standard Hover — CTA-authored cards (TC-INT-001 – TC-INT-005)
// ---------------------------------------------------------------------------
test.describe('TeaserCard — Standard Hover', () => {
    test('[TC-INT-001] @interaction @regression @sanity Hovering a CTA card changes cursor to pointer', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const linkedCard = page.locator(TC_LINK).first();
        if (await linkedCard.count() === 0) {
            test.skip();
            return;
        }
        await hover(linkedCard);
        const cursor = // 📏 TODO: Replace with measurement-utils
         await linkedCard.evaluate(el => getComputedStyle(el).cursor);
        // measurement: use measurement-utils for cleaner code
        expect(cursor, 'Hovering a clickable card must show pointer cursor').toBe('pointer');
    });
    test('[TC-INT-002] @interaction @regression Standard hover: card background changes on hover (ripple / fill)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const linkedCard = page.locator(TC_LINK).first();
        if (await linkedCard.count() === 0) {
            test.skip();
            return;
        }
        // A CSS transition property must be present on the card to animate the hover
        const transition = // 📏 TODO: Replace with measurement-utils
         await linkedCard.evaluate(el => getComputedStyle(el).transition);
        // measurement: use measurement-utils for cleaner code
        expect(transition, 'CTA card must have a CSS transition for hover animation').not.toBe('all 0s ease 0s');
        expect(transition.length).toBeGreaterThan(0);
    });
    test('[TC-INT-003] @interaction @regression CTA transitions to hover state when card is hovered', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const linkedCard = page.locator(TC_LINK).first();
        if (await linkedCard.count() === 0) {
            test.skip();
            return;
        }
        const ctaLink = linkedCard.locator(TC_CTA).first();
        const colorBefore = // 📏 TODO: Replace with measurement-utils
         await ctaLink.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        await hover(linkedCard);
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const colorAfter = // 📏 TODO: Replace with measurement-utils
         await ctaLink.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        // Color should change on hover (CTA hover state activates)
        expect(colorAfter, 'CTA should change color when card is hovered').not.toBe(colorBefore);
    });
});
// ---------------------------------------------------------------------------
// Enhanced Hover — Circle/Top only (TC-INT-006 – TC-INT-010)
// ---------------------------------------------------------------------------
test.describe('TeaserCard — Enhanced Hover', () => {
    test('[TC-INT-006] @interaction @regression @sanity Enhanced hover: image expands on card hover', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const enhanced = page.locator(TC_ENHANCED).first();
        if (await enhanced.count() === 0) {
            test.skip();
            return;
        }
        const imgWrapper = enhanced.locator(TC_IMAGE_WRAPPER).first();
        if (await imgWrapper.count() === 0) {
            test.skip();
            return;
        }
        const boxBefore = await imgWrapper.boundingBox();
        await hover(enhanced);
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const boxAfter = await imgWrapper.boundingBox();
        if (boxBefore && boxAfter) {
            expect(boxAfter.width, 'Enhanced hover: image should expand width on hover').toBeGreaterThanOrEqual(boxBefore.width);
        }
    });
    test('[TC-INT-007] @interaction @regression Enhanced hover: 30% black overlay appears on hover', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const enhanced = page.locator(TC_ENHANCED).first();
        if (await enhanced.count() === 0) {
            test.skip();
            return;
        }
        const imgWrapper = enhanced.locator(TC_IMAGE_WRAPPER).first();
        if (await imgWrapper.count() === 0) {
            test.skip();
            return;
        }
        // Verified against teaser-card.less (ui.apps.ga clientlib-site/less/components):
        // the darkening overlay is the image-wrapper's own `::after` pseudo-element
        // (`background: rgba(0, 0, 0, 0.38); opacity: 0` by default), faded to `opacity: 1`
        // by the `a.cmp-teaser-card:hover`/`:focus-visible` rule inside `--enhanced-hover`.
        // The previous check looked for a literal "overlay"/"backdrop" class name, or a
        // `::before` background on the OUTER wrapper — neither exists in the source; it was
        // checking the wrong element and the wrong pseudo-element, so `hasOverlay` was always
        // false and the test blindly skipped instead of actually exercising the real mechanism.
        const before = await imgWrapper.evaluate(el => getComputedStyle(el, '::after').opacity);
        await hover(enhanced);
        await expect.poll(
            () => imgWrapper.evaluate(el => getComputedStyle(el, '::after').opacity),
            { timeout: 3000 }
        ).toBe('1');
        const afterBg = await imgWrapper.evaluate(el => getComputedStyle(el, '::after').backgroundColor);
        expect(before, 'Overlay must be hidden (opacity 0) before hover').toBe('0');
        expect(afterBg, 'Overlay background must be a black/dark tint (rgba(0, 0, 0, x))').toMatch(/^rgba\(0, 0, 0,/);
    });
    test('[TC-INT-008] @interaction @regression Enhanced hover: text transitions to white on hover', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const enhanced = page.locator(TC_ENHANCED).first();
        if (await enhanced.count() === 0) {
            test.skip();
            return;
        }
        const title = enhanced.locator(TC_TITLE).first();
        if (await title.count() === 0) {
            test.skip();
            return;
        }
        const colorBefore = await title.evaluate(el => getComputedStyle(el).color);
        const rgbSum = (color) => (color.match(/\d+/g)?.map(Number) ?? []).slice(0, 3).reduce((a, b) => a + b, 0);
        await hover(enhanced);
        // Wait for the CSS color transition to fully settle at its final (white) value — reading
        // immediately after hover() captures a mid-transition blend color, not the final state.
        await expect.poll(
            () => title.evaluate(el => getComputedStyle(el).color).then(rgbSum),
            { timeout: 3000 }
        ).toBeGreaterThan(600);
        const colorAfter = await title.evaluate(el => getComputedStyle(el).color);
        expect(colorAfter, 'Enhanced hover: title should transition to white').not.toBe(colorBefore);
        expect(rgbSum(colorAfter), 'Enhanced hover: title color should be white or near-white').toBeGreaterThan(600);
    });
    test('[TC-INT-009] @interaction @regression Enhanced hover: image-wrapper has a CSS transition', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const enhanced = page.locator(TC_ENHANCED).first();
        if (await enhanced.count() === 0) {
            test.skip();
            return;
        }
        const imgWrapper = enhanced.locator(TC_IMAGE_WRAPPER).first();
        if (await imgWrapper.count() === 0) {
            test.skip();
            return;
        }
        const transition = // 📏 TODO: Replace with measurement-utils
         await imgWrapper.evaluate(el => getComputedStyle(el).transition);
        // measurement: use measurement-utils for cleaner code
        expect(transition, 'Enhanced hover image wrapper must have a CSS transition').not.toBe('all 0s ease 0s');
    });
    test('[TC-INT-010] @interaction @regression Enhanced hover not applied to rectangle or left/right variants', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        // Enhanced hover should NOT be on left/right position cards
        const enhancedLeft = page.locator(`${TC_ENHANCED}${TC_POS_LEFT}`);
        const enhancedRight = page.locator(`${TC_ENHANCED}${TC_POS_RIGHT}`);
        expect(await enhancedLeft.count(), 'Enhanced hover must not be on left-position cards').toBe(0);
        expect(await enhancedRight.count(), 'Enhanced hover must not be on right-position cards').toBe(0);
    });
});
// ---------------------------------------------------------------------------
// Keyboard Navigation (TC-INT-011 – TC-INT-015)
// ---------------------------------------------------------------------------
test.describe('TeaserCard — Keyboard Navigation', () => {
    test('[TC-INT-011] @interaction @regression @sanity CTA card link is keyboard focusable via Tab', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const link = page.locator(TC_LINK).first();
        if (await link.count() === 0) {
            test.skip();
            return;
        }
        let reached = false;
        for (let i = 0; i < 50; i++) {
            await page.keyboard.press('Tab');
            // The card root itself is the <a> when CTA is authored — there is no separate
            // "__link" element (see TC_LINK definition above).
            const isCardLink = await page.evaluate(() => document.activeElement?.matches('a.cmp-teaser-card') ?? false);
            if (isCardLink) {
                reached = true;
                break;
            }
        }
        expect(reached, 'Tab navigation must reach the teaser card link').toBe(true);
    });
    test('[TC-INT-012] @interaction @regression Focus indicator is visible when card link is focused', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const link = page.locator(TC_LINK).first();
        if (await link.count() === 0) {
            test.skip();
            return;
        }
        await link.focus();
        const focusStyle = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => {
            const cs = getComputedStyle(el);
            return { outline: cs.outlineStyle, outlineW: cs.outlineWidth, boxShadow: cs.boxShadow };
        });
        const hasOutline = focusStyle.outline !== 'none' && parseFloat(focusStyle.outlineW) > 0;
        const hasBoxShadow = focusStyle.boxShadow !== 'none' && focusStyle.boxShadow.length > 0;
        expect(hasOutline || hasBoxShadow, 'Focus ring must be visible on card link').toBe(true);
    });
    test('[TC-INT-013] @interaction @regression Focused card link is not hidden behind sticky header', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const link = page.locator(TC_LINK).first();
        if (await link.count() === 0) {
            test.skip();
            return;
        }
        await link.focus();
        const linkBox = await link.boundingBox();
        // Ensure link is visible in viewport (not scrolled behind sticky header)
        if (linkBox) {
            expect(linkBox.y, 'Focused card link must not be hidden behind sticky header (y < 0)').toBeGreaterThanOrEqual(0);
        }
    });
    test('[TC-INT-014] @interaction @regression All CTA links in card grid are sequentially keyboard-reachable', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const links = page.locator(TC_LINK);
        const count = await links.count();
        if (count === 0) {
            test.skip();
            return;
        }
        for (let i = 0; i < count; i++) {
            await links.nth(i).focus();
            const activeEl = // 📏 TODO: Replace with measurement-utils
             await page.evaluate(() => document.activeElement?.className ?? '');
            expect(activeEl, `Link[${i}] must be keyboard focusable`).toContain('teaser-card');
        }
    });
});
// ---------------------------------------------------------------------------
// No-hover conditions (TC-INT-016 – TC-INT-018)
// ---------------------------------------------------------------------------
test.describe('TeaserCard — No-hover Conditions', () => {
    test('[TC-INT-016] @interaction @regression @sanity Non-CTA card: no hover state applied', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        // Non-CTA cards render as <div class="cmp-teaser-card">, not <a> (matches
        // TC_WITHOUT_CTA in teaser-card.author.spec.ts). The previous `:not(:has(TC_LINK))`
        // form was a no-op — TC_LINK never matched anything, so it silently matched every card
        // (including linked ones) instead of genuinely isolating the non-CTA case.
        const nonLinked = page.locator(`div${TC}`).first();
        if (await nonLinked.count() === 0) {
            // Verified live 2026-08-12: all 75 .cmp-teaser-card instances on the style-guide page
            // are <a> (linked) — same content gap as TC-025/TC-055 in teaser-card.author.spec.ts.
            test.skip(true, 'No unlinked (no-CTA) teaser-card instance authored on the style-guide page — content gap, not a component defect');
            return;
        }
        const bgBefore = // 📏 TODO: Replace with measurement-utils
         await nonLinked.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        await hover(nonLinked);
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const bgAfter = // 📏 TODO: Replace with measurement-utils
         await nonLinked.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        expect(bgBefore, 'Non-CTA card background must not change on hover').toBe(bgAfter);
    });
    test('[TC-INT-018] @interaction @regression Hover states do not apply at mobile breakpoint', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const linkedCard = page.locator(TC_LINK).first();
        if (await linkedCard.count() === 0) {
            test.skip();
            return;
        }
        // On mobile the enhanced hover overlay must not be active at rest
        const hasEnhancedHoverActive = // 📏 TODO: Replace with measurement-utils
         await linkedCard.evaluate(el => {
            const imgWrapper = el.querySelector('[class*="image-wrapper"]');
            if (!imgWrapper)
                return false;
            const cs = getComputedStyle(imgWrapper);
            // Check if the image fills the whole card (enhanced hover active on mobile = bug)
            const cardH = el.getBoundingClientRect().height;
            const wrapperH = imgWrapper.getBoundingClientRect().height;
            return wrapperH >= cardH * 0.9;
        });
        expect(hasEnhancedHoverActive, 'Enhanced hover should not be active on mobile').toBe(false);
    });
});
// ---------------------------------------------------------------------------
// Left / Right Position Interactions (TC-INT-019 – TC-INT-022)
// ---------------------------------------------------------------------------
test.describe('TeaserCard — Left/Right Position Layout', () => {
    test('[TC-INT-019] @interaction @regression @sanity Left-position card: image is to the left of content at desktop', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const card = page.locator(TC_POS_LEFT).first();
        if (await card.count() === 0) {
            test.skip();
            return;
        }
        const imgWrapper = card.locator(TC_IMAGE_WRAPPER).first();
        const content = card.locator(TC_CONTENT).first();
        if (await imgWrapper.count() === 0 || await content.count() === 0) {
            test.skip();
            return;
        }
        const imgBox = await imgWrapper.boundingBox();
        const contentBox = await content.boundingBox();
        if (imgBox && contentBox) {
            expect(imgBox.x, 'Left-position: image must be left of content').toBeLessThan(contentBox.x);
        }
    });
    test('[TC-INT-020] @interaction @regression Right-position card: image is to the right of content at desktop', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const card = page.locator(TC_POS_RIGHT).first();
        if (await card.count() === 0) {
            test.skip();
            return;
        }
        const imgWrapper = card.locator(TC_IMAGE_WRAPPER).first();
        const content = card.locator(TC_CONTENT).first();
        if (await imgWrapper.count() === 0 || await content.count() === 0) {
            test.skip();
            return;
        }
        const imgBox = await imgWrapper.boundingBox();
        const contentBox = await content.boundingBox();
        if (imgBox && contentBox) {
            expect(imgBox.x, 'Right-position: image must be right of content').toBeGreaterThan(contentBox.x);
        }
    });
    test('[TC-INT-021] @interaction @regression Rectangle Left card: stacks vertically on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());
        const card = page.locator(`${TC_POS_LEFT}${TC_IMG_RECTANGLE}`).first();
        if (await card.count() === 0) {
            test.skip();
            return;
        }
        const imgWrapper = card.locator(TC_IMAGE_WRAPPER).first();
        const content = card.locator(TC_CONTENT).first();
        if (await imgWrapper.count() === 0 || await content.count() === 0) {
            test.skip();
            return;
        }
        const imgBox = await imgWrapper.boundingBox();
        const contentBox = await content.boundingBox();
        if (imgBox && contentBox) {
            expect(imgBox.y, 'Rectangle Left: image should be above content on mobile').toBeLessThan(contentBox.y);
        }
    });
});
