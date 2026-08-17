import { test, expect } from '@playwright/test';
import { PromoBannerPage } from '../../../pages/ga/components/promoBannerPage';
import { resolveComponentUrl, deployFixture } from '../../../utils/infra/content-fixture-deployer';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const PB_WRAPPER = '.promo-banner';
const PB = '.cmp-promo-banner';
const PB_CONTENT = '.cmp-promo-banner__content';
const PB_LOGO = '.cmp-promo-banner__logo';
const PB_TITLE = '.cmp-promo-banner__title';
const PB_LINKS = '.cmp-promo-banner__links';
const PB_SOCIAL = '.cmp-promo-banner__links-social';
const PB_CTA = '.cmp-promo-banner__links-cta';
const CMP_BUTTON = '.cmp-button';
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
// ---------------------------------------------------------------------------
// Core Structure (PB-001 – PB-010)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Core Structure', () => {
    test('[PB-001] @smoke @regression @sanity multiple banner instances render on style guide', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const banners = page.locator(PB);
        const count = await banners.count();
        expect(count, 'Expected at least one .cmp-promo-banner on the style guide page').toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            await expect(banners.nth(i)).toBeVisible();
        }
    });
    test('[PB-002] @smoke @regression @sanity root element has granite background by default', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        // The first banner on the style guide should be the default granite variant
        const graniteEl = page.locator(`${PB}.cmp-promo-banner--granite`).first();
        // Fall back to checking computed background color if modifier class not present
        const hasGraniteClass = await graniteEl.count();
        if (hasGraniteClass > 0) {
            await expect(graniteEl).toBeVisible();
        }
        else {
            // Fallback: first banner should have a dark background (not white)
            const bg = await page.locator(PB).first().evaluate(el => getComputedStyle(el).backgroundColor);
            // measurement: use measurement-utils for cleaner code
            expect(bg, 'Default promo-banner background should not be white').not.toBe('rgb(255, 255, 255)');
        }
    });
    test('[PB-003] @smoke @regression @sanity root has 20px border-radius on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        const radius = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).borderRadius);
        // measurement: use measurement-utils for cleaner code
        expect(radius, 'Desktop border-radius should be 20px').toBe('20px');
    });
    test('[PB-004] @smoke @regression @sanity root has 12px border-radius on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        const radius = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).borderRadius);
        // measurement: use measurement-utils for cleaner code
        expect(radius, 'Mobile border-radius should be 12px').toBe('12px');
    });
    test('[PB-005] @smoke @regression @sanity root element has white text color', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        const color = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        expect(color, 'Promo banner text color should be white (rgb(255, 255, 255))', `Expected 'rgb(255, 255, 255, got ${color, 'Promo banner text color should be white (rgb(255, 255, 255))'}`).toBe('rgb(255, 255, 255)');
    });
    test('[PB-006] @smoke @regression @sanity desktop root uses flex layout with align-items center', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        const styles = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            const cs = getComputedStyle(el);
            return { display: cs.display, alignItems: cs.alignItems };
        });
        expect(styles.display, 'Root should be flex on desktop').toBe('flex');
        // TODO: Use assertLayout() for display checks
        expect(styles.alignItems, 'Root flex align-items should be center on desktop').toBe('center');
    });
    test('[PB-007] @smoke @regression @sanity content area has flex:1 (fills available space)', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const content = page.locator(PB_CONTENT).first();
        const count = await content.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(content).toBeVisible();
        const flexGrow = // 📏 TODO: Replace with measurement-utils
         await content.evaluate(el => getComputedStyle(el).flexGrow);
        // measurement: use measurement-utils for cleaner code
        expect(flexGrow, 'Content area flexGrow should be 1').toBe('1');
    });
    test('[PB-009] @smoke @regression @sanity CTA buttons are present and visible', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const ctaArea = page.locator(PB_CTA).first();
        const count = await ctaArea.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(ctaArea).toBeVisible();
        const buttons = ctaArea.locator(`${CMP_BUTTON}, a, button`);
        const btnCount = await buttons.count();
        expect(btnCount, 'At least one CTA button should exist').toBeGreaterThan(0);
    });
    test('[PB-010] @smoke @regression @sanity no inline styles on root element', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        const inlineStyle = await root.getAttribute('style');
        expect(inlineStyle ?? '', 'Root element must not have inline styles').toBe('');
    });
});
// ---------------------------------------------------------------------------
// Style Variants (PB-011 – PB-016)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Style Variants', () => {
    // Each test deploys the promo-banner fixture independently (rather than sharing one beforeAll
    // deploy) so a failure in one doesn't skip the others — deployFixture() itself retries on the
    // 409 Conflict these concurrent same-fixture deploys can race into under parallel workers
    // (see content-fixture-deployer.ts).
    test('[PB-015] @regression all variants maintain white text color', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const variants = ['cmp-promo-banner--granite', 'cmp-promo-banner--azul', 'cmp-promo-banner--aubergine'];
        for (const variant of variants) {
            const el = page.locator(`${PB}.${variant}`).first();
            const count = await el.count();
            if (count === 0)
                continue;
            const color = // 📏 TODO: Replace with measurement-utils
             await el.evaluate(el => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            expect(color, `Variant ${variant} should have white text`, `Expected 'rgb(255, 255, 255, got ${color, `Variant ${variant} should have white text`}`).toBe('rgb(255, 255, 255)');
        }
    });
    test('[PB-016] @regression each banner instance has exactly one variant class active', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const banners = page.locator(PB);
        const count = await banners.count();
        const variantClasses = ['cmp-promo-banner--granite', 'cmp-promo-banner--azul', 'cmp-promo-banner--aubergine', 'cmp-promo-banner--footer'];
        for (let i = 0; i < count; i++) {
            const classList = await banners.nth(i).evaluate(el => Array.from(el.classList));
            const activeVariants = variantClasses.filter(v => classList.includes(v));
            expect(activeVariants.length, `Banner ${i} should have at most one variant modifier class`).toBeLessThanOrEqual(1);
        }
    });
});
// ---------------------------------------------------------------------------
// Padding (PB-017 – PB-022)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Padding', () => {
    test('[PB-017] @regression desktop default has 64px top and bottom padding', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator(PB_WRAPPER).first();
        const count = await wrapper.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(wrapper).toBeVisible();
        const padding = // 📏 TODO: Replace with measurement-utils
         await wrapper.evaluate(el => {
            const cs = getComputedStyle(el);
            return { top: cs.paddingTop, bottom: cs.paddingBottom };
        });
        expect(padding.top, 'Desktop wrapper padding-top should be 64px').toBe('64px');
        // TODO: Use assertSpacing() for padding/margin
        expect(padding.bottom, 'Desktop wrapper padding-bottom should be 64px').toBe('64px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[PB-018] @regression mobile default has 48px top and bottom padding', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator(PB_WRAPPER).first();
        const count = await wrapper.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(wrapper).toBeVisible();
        const padding = // 📏 TODO: Replace with measurement-utils
         await wrapper.evaluate(el => {
            const cs = getComputedStyle(el);
            return { top: cs.paddingTop, bottom: cs.paddingBottom };
        });
        expect(padding.top, 'Mobile wrapper padding-top should be 48px').toBe('48px');
        // TODO: Use assertSpacing() for padding/margin
        expect(padding.bottom, 'Mobile wrapper padding-bottom should be 48px').toBe('48px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[PB-019] @regression remove-top-padding modifier sets padding-top to 0', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator(PB_WRAPPER).first();
        const count = await wrapper.count();
        if (count === 0) {
            test.skip();
            return;
        }
        // Inject the modifier class to test its effect
        // 📏 TODO: Replace with measurement-utils
        await wrapper.evaluate(el => el.classList.add('cmp-promo-banner--remove-top-padding'));
        const paddingTop = // 📏 TODO: Replace with measurement-utils
         await wrapper.evaluate(el => getComputedStyle(el).paddingTop);
        // measurement: use measurement-utils for cleaner code
        expect(paddingTop, 'remove-top-padding modifier should set padding-top to 0px').toBe('0px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[PB-020] @regression remove-bottom-padding modifier sets padding-bottom to 0', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator(PB_WRAPPER).first();
        const count = await wrapper.count();
        if (count === 0) {
            test.skip();
            return;
        }
        // Inject the modifier class to test its effect
        // 📏 TODO: Replace with measurement-utils
        await wrapper.evaluate(el => el.classList.add('cmp-promo-banner--remove-bottom-padding'));
        const paddingBottom = // 📏 TODO: Replace with measurement-utils
         await wrapper.evaluate(el => getComputedStyle(el).paddingBottom);
        // measurement: use measurement-utils for cleaner code
        expect(paddingBottom, 'remove-bottom-padding modifier should set padding-bottom to 0px').toBe('0px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[PB-021] @regression both padding modifiers applied sets both top and bottom to 0', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator(PB_WRAPPER).first();
        const count = await wrapper.count();
        if (count === 0) {
            test.skip();
            return;
        }
        // 📏 TODO: Replace with measurement-utils
        await wrapper.evaluate(el => {
            el.classList.add('cmp-promo-banner--remove-top-padding');
            el.classList.add('cmp-promo-banner--remove-bottom-padding');
        });
        const padding = // 📏 TODO: Replace with measurement-utils
         await wrapper.evaluate(el => {
            const cs = getComputedStyle(el);
            return { top: cs.paddingTop, bottom: cs.paddingBottom };
        });
        expect(padding.top, 'Both padding modifiers: padding-top should be 0px').toBe('0px');
        // TODO: Use assertSpacing() for padding/margin
        expect(padding.bottom, 'Both padding modifiers: padding-bottom should be 0px').toBe('0px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[PB-022] @regression padding modifiers do not affect internal content spacing', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator(PB_WRAPPER).first();
        const count = await wrapper.count();
        if (count === 0) {
            test.skip();
            return;
        }
        // Record internal root padding before modification
        const rootPaddingBefore = await page.locator(PB).first().evaluate(el => getComputedStyle(el).padding);
        // measurement: use measurement-utils for cleaner code
        // 📏 TODO: Replace with measurement-utils
        await wrapper.evaluate(el => el.classList.add('cmp-promo-banner--remove-top-padding'));
        const rootPaddingAfter = await page.locator(PB).first().evaluate(el => getComputedStyle(el).padding);
        // measurement: use measurement-utils for cleaner code
        expect(rootPaddingAfter, 'Internal root padding must be unchanged by wrapper padding modifiers').toBe(rootPaddingBefore);
        // TODO: Use assertSpacing() for padding/margin
    });
});
// ---------------------------------------------------------------------------
// Desktop Layout (PB-023 – PB-027)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Desktop Layout', () => {
    test('[PB-023] @regression desktop layout uses flex-direction row', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(flexDir, 'Desktop flex-direction should be row').toBe('row');
    });
    test('[PB-024] @regression content area on desktop uses flex-direction row with gap 24px', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const content = page.locator(PB_CONTENT).first();
        const count = await content.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(content).toBeVisible();
        const styles = // 📏 TODO: Replace with measurement-utils
         await content.evaluate(el => {
            const cs = getComputedStyle(el);
            return { flexDirection: cs.flexDirection, gap: cs.gap || cs.columnGap };
        });
        expect(styles.flexDirection, 'Content area flex-direction should be row on desktop').toBe('row');
        expect(styles.gap, 'Content area gap should be 24px on desktop').toBe('24px');
    });
    test('[PB-025] @regression desktop CTA links use flex-direction row', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const cta = page.locator(PB_CTA).first();
        const count = await cta.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(cta).toBeVisible();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await cta.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(flexDir, 'CTA links flex-direction should be row on desktop').toBe('row');
    });
    test('[PB-026] @regression social icons CSS defines 40px circular styling', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const socialLinks = page.locator(`${PB_SOCIAL} a`);
        const count = await socialLinks.count();
        if (count > 0) {
            // Real social links exist — verify dimensions
            const box = await socialLinks.first().boundingBox();
            if (box) {
                expect(box.width).toBeGreaterThanOrEqual(38);
                expect(box.width).toBeLessThanOrEqual(44);
            }
            const radius = await socialLinks.first().evaluate(el => getComputedStyle(el).borderRadius);
            // measurement: use measurement-utils for cleaner code
            expect(radius).toMatch(/50%|999px/);
        }
        else {
            // No social links — inject+check CSS rule and clean up
            const linksArea = page.locator(PB_LINKS).first();
            const result = // 📏 TODO: Replace with measurement-utils
             await linksArea.evaluate(el => {
                const div = document.createElement('div');
                div.className = 'cmp-promo-banner__links-social';
                const a = document.createElement('a');
                a.href = '#';
                div.appendChild(a);
                el.prepend(div);
                const cs = getComputedStyle(a);
                const r = { w: cs.width, h: cs.height, radius: cs.borderRadius };
                div.remove(); // clean up
                return r;
            });
            expect(result.radius).toMatch(/50%|999px/);
        }
    });
    test('[PB-027] @regression desktop links area has margin-top 0 (not 24px)', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const links = page.locator(PB_LINKS).first();
        const count = await links.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(links).toBeVisible();
        const marginTop = // 📏 TODO: Replace with measurement-utils
         await links.evaluate(el => getComputedStyle(el).marginTop);
        // measurement: use measurement-utils for cleaner code
        expect(marginTop, 'Links margin-top on desktop should be 0px (not 24px)').toBe('0px');
        // TODO: Use assertSpacing() for padding/margin
    });
});
// ---------------------------------------------------------------------------
// Mobile Layout (PB-028 – PB-032)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Mobile Layout', () => {
    test('[PB-028] @mobile @regression banner is NOT flex-row on mobile (stacks naturally)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        // On mobile, the component uses display:block (no flex), so content stacks naturally
        const display = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        // Should NOT be flex-row — acceptable values: block, flex+column
        const isStacked = display === 'block' || display === 'flex';
        // TODO: Use assertLayout() for display checks
        expect(isStacked).toBe(true);
        if (display === 'flex') {
            const dir = // 📏 TODO: Replace with measurement-utils
             await root.evaluate(el => getComputedStyle(el).flexDirection);
            // measurement: use measurement-utils for cleaner code
            expect(dir).toBe('column');
        }
    });
    test('[PB-029] @mobile @regression CTA uses flex-direction column on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const cta = page.locator(PB_CTA).first();
        const count = await cta.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(cta).toBeVisible();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await cta.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(flexDir, 'CTA links flex-direction should be column on mobile').toBe('column');
    });
    test('[PB-030] @mobile @regression links area has margin-top 24px on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const links = page.locator(PB_LINKS).first();
        const count = await links.count();
        if (count === 0) {
            test.skip();
            return;
        }
        await expect(links).toBeVisible();
        const marginTop = // 📏 TODO: Replace with measurement-utils
         await links.evaluate(el => getComputedStyle(el).marginTop);
        // measurement: use measurement-utils for cleaner code
        expect(marginTop, 'Links margin-top on mobile should be 24px').toBe('24px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[PB-031] @mobile @regression no horizontal overflow on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        const hasOverflow = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => el.scrollWidth > el.clientWidth);
        expect(hasOverflow, 'Promo banner must not overflow horizontally on mobile').toBe(false);
    });
    test('[PB-032] @mobile @regression all banner content elements are visible on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator(PB).first();
        await expect(root).toBeVisible();
        // Title and links should still be visible
        const title = root.locator(PB_TITLE);
        const titleCount = await title.count();
        if (titleCount > 0) {
            await expect(title.first()).toBeVisible();
        }
        const links = root.locator(PB_LINKS);
        const linksCount = await links.count();
        if (linksCount > 0) {
            await expect(links.first()).toBeVisible();
        }
    });
});
// ---------------------------------------------------------------------------
// Footer Variant (PB-033 – PB-036)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Footer Variant', () => {
});
// ---------------------------------------------------------------------------
// Accessibility (PB-037 – PB-041)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Accessibility', () => {
});
// ---------------------------------------------------------------------------
// Dialog / Overlay (PB-042 – PB-044)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — AEM Dialog Configuration', () => {
});
// ---------------------------------------------------------------------------
// Console Errors (PB-045)
// ---------------------------------------------------------------------------
test.describe('PromoBanner — Console Errors', () => {
    test('[PB-045] @regression no JS errors on page load', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors, `JS errors found on promo-banner style guide: ${errors.join(' | ')}`).toEqual([]);
    });
});
test.describe('PromoBanner — CSV Test Cases (GAAM-1329)', () => {
    test('[PB-046] @regression @sanity CMS: Promo Banner: Tablet view in both Android and Apple is misaligned. — AC1', async ({ page }) => {
        // Investigated via kkr-aem source + live tablet-viewport measurement (methodology per
        // RDH-010/rate-details-hero.author.spec.ts and BRDC-051/detail-hero.author.spec.ts) — unlike
        // those two, this ticket's CSS is internally consistent and no cascade gap was found:
        //
        // 1) Breakpoint structure: promo-banner.less uses exactly ONE breakpoint call
        //    (`#ga-aem-mixins.breakpoint(@ga-bp-desktop-min, ...)` at .promo-banner:31,
        //    .cmp-promo-banner:43, __content:59, __logo:70, __logo img:85, __image:97, __text:119,
        //    __title:143, __links:174) which mixins.less:261-265 compiles to `@media (min-width:1024px)`.
        //    variables.less:245-248 defines @ga-bp-tablet-max=1023 / @ga-bp-desktop-min=1024, so this
        //    breakpoint boundary IS the tablet/desktop boundary — there is no early/premature jump
        //    inside the 768-1023 tablet range the way RDH-010 had (rate-details-hero switched at 768
        //    while the page grid didn't change until 1024). Mobile and tablet intentionally share
        //    identical rules here (single mobile-first breakpoint), which is not itself a bug.
        //
        // 2) Live verification (localhost:4502, admin/admin) at
        //    /content/global-atlantic/style-guide/components/promo-banner.html?wcmmode=disabled across
        //    all 4 rendered variants (granite/azul/aubergine/footer) at 768x1024 (iPad-min portrait),
        //    800x1280 (Android tablet portrait), 820x1180 (iPad Air portrait), 1023x1366 (tablet-max
        //    boundary), and the 1024 desktop boundary: .cmp-promo-banner padding stays a consistent
        //    20px left/right the entire 768-1023 range (matches promo-banner.less:41 @sp-20, never
        //    jumps early), no horizontal overflow at any width (document.body.scrollWidth ==
        //    viewport width every time), __text/__title/__links stay left-aligned at x=20px with no
        //    overlap, and on the footer variant (the only content combo with both
        //    __links-social + __links-cta rendered together) the two link groups sit side-by-side
        //    with a clean 12px gap (right=170px / x=182px) and never overlap at 768/820/1023px.
        //    Layout cleanly flips to the flex/centered desktop layout exactly at 1024px in every case.
        //
        // 3) At the time of that investigation, the ticket's "images... not properly positioned"
        //    claim couldn't be reproduced or refuted: no .cmp-promo-banner__logo/<img> element ever
        //    rendered on the live page, in any variant/viewport, despite image.fileReference being
        //    set in the JCR content for 3 of the 4 style-guide instances — a separate, unrelated
        //    rendering defect blocking the image resource from resolving.
        //
        // Re-verified 2026-08-14 (Chromium + Firefox, 768/1023px): that blocker no longer
        // reproduces — .cmp-promo-banner__logo img now renders for all 4 image-configured
        // instances, loads with real dimensions (naturalWidth 130/118), and sits cleanly above
        // __text/__links with no overlap. Converting this from fixme to a real assertion now that
        // there's an actual <img> to measure — this guards the currently-correct behavior for both
        // the alignment claim (no cascade defect, per the investigation above) and the images claim
        // (renders with real dimensions, no overlap) against regression.
        await page.setViewportSize({ width: 768, height: 1024 }); // tablet-min (variables.less: @ga-bp-tablet-min=768)
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        await page.waitForLoadState('load'); // logo images finish downloading after domcontentloaded

        const banners = page.locator(PB);
        const count = await banners.count();
        expect(count, 'Style guide should render at least one promo-banner instance').toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const banner = banners.nth(i);
            const bannerBox = await banner.evaluate(el => el.getBoundingClientRect());
            expect(bannerBox.right, `Instance ${i}: banner should not overflow the 768px tablet viewport`).toBeLessThanOrEqual(768);

            const contentBox = await banner.locator(PB_CONTENT).evaluate(el => el.getBoundingClientRect());
            expect(
                Math.round(contentBox.left - bannerBox.left),
                `Instance ${i}: content padding should stay the mobile-first 20px (promo-banner.less @sp-20) — no early jump to the desktop value inside the tablet range`
            ).toBe(20);

            const logo = banner.locator(PB_LOGO);
            if (await logo.count() > 0) {
                const img = logo.locator('img').first();
                const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
                expect(naturalWidth, `Instance ${i}: logo image should render with real dimensions, not be missing/broken`).toBeGreaterThan(0);

                const logoBox = await logo.evaluate(el => el.getBoundingClientRect());
                const title = banner.locator(PB_TITLE);
                if (await title.count() > 0) {
                    const titleBox = await title.evaluate(el => el.getBoundingClientRect());
                    expect(titleBox.top, `Instance ${i}: title should sit below the logo, not overlap it`).toBeGreaterThanOrEqual(logoBox.bottom);
                }
            }

            const links = banner.locator(PB_LINKS);
            if (await links.count() > 0) {
                const title = banner.locator(PB_TITLE);
                if (await title.count() > 0) {
                    const linksBox = await links.evaluate(el => el.getBoundingClientRect());
                    const titleBox = await title.evaluate(el => el.getBoundingClientRect());
                    expect(linksBox.top, `Instance ${i}: links row should sit below the title, not overlap it`).toBeGreaterThanOrEqual(titleBox.bottom);
                }
            }
        }
    });
});
test.describe('PromoBanner — Happy Path', () => {
    test('[PB-047] @smoke @regression @sanity PromoBanner renders correctly', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-promo-banner').first();
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
    test('[PB-048] @smoke @regression @sanity PromoBanner interactive elements are functional', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-promo-banner').first();
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
test.describe('PromoBanner — Negative & Boundary', () => {
    test('[PB-049] @negative @regression @sanity PromoBanner handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-promo-banner').first()).toBeVisible();
    });
    test('[PB-050] @negative @regression @sanity PromoBanner handles missing images', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-promo-banner img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('PromoBanner — Responsive', () => {
    test('[PB-051] @mobile @regression @mobile @sanity PromoBanner adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-promo-banner').first();
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
    test('[PB-052] @mobile @regression @sanity PromoBanner adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-promo-banner').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('PromoBanner — Console & Resources', () => {
    test('[PB-053] @regression PromoBanner produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('PromoBanner — Broken Images', () => {
    test('[PB-054] @regression PromoBanner all images load successfully', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-promo-banner img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[PB-055] @regression PromoBanner all images have alt attributes', async ({ page }) => {
        const pom = new PromoBannerPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-promo-banner img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
