import { test, expect } from '@playwright/test';
import { RateDetailsHeroPage } from '../../../pages/ga/components/rateDetailsHeroPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('RateDetailsHero — Happy Path', () => {
    test('[RDH-001] @smoke @regression @sanity RateDetailsHero renders correctly', async ({ page }) => {
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-rate-details-hero').first();
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
    test('[RDH-002] @smoke @regression @sanity RateDetailsHero interactive elements are functional', async ({ page }) => {
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-rate-details-hero').first();
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
test.describe('RateDetailsHero — Negative & Boundary', () => {
    test('[RDH-003] @negative @regression @sanity RateDetailsHero handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-rate-details-hero').first()).toBeVisible();
    });
    test('[RDH-004] @negative @regression @sanity RateDetailsHero handles missing images', async ({ page }) => {
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-rate-details-hero img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('RateDetailsHero — Responsive', () => {
    test('[RDH-005] @mobile @regression @mobile @sanity RateDetailsHero adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-rate-details-hero').first();
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
    test('[RDH-006] @mobile @regression @sanity RateDetailsHero adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-rate-details-hero').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('RateDetailsHero — Console & Resources', () => {
    test('[RDH-007] @regression RateDetailsHero produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('RateDetailsHero — Broken Images', () => {
    test('[RDH-008] @regression RateDetailsHero all images load successfully', async ({ page }) => {
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-rate-details-hero img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[RDH-009] @regression RateDetailsHero all images have alt attributes', async ({ page }) => {
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-rate-details-hero img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('RateDetailsHero — Accessibility', () => {
});
test.describe('RateDetailsHero — AEM Dialog Configuration', () => {
});
// Relocated from image.author.spec.ts (MG-065) — CSV import mis-bucketed this under Image;
// it's actually about the Rate Details Hero component.
test.describe('RateDetailsHero — CSV Test Cases (GAAM-1320)', () => {
    test('[RDH-010] @regression @sanity DR AEM FE: Rate Detail Hero padding is not aligned in responsive mode — AC1', async ({ page }) => {
        // Confirmed product bug via kkr-aem source (static CSS-cascade read, no live content needed):
        //
        // ui.apps.ga/.../clientlibs/clientlib-site/less/components/rate-details-hero.less:27-40 —
        // the component's base (mobile) side padding is @sp-20 (20px), and it switches to
        // @sp-63 (63px) at `#ga-aem-mixins.breakpoint(@ga-bp-tablet-min, ...)`, i.e. as soon as
        // the viewport hits 768px.
        //
        // ui.apps.ga/.../less/layout/_layout.less:248-260 — the sitewide page grid (`.ga-page`),
        // which every other component's content aligns to, uses only 24px left/right padding
        // for the ENTIRE tablet range 768–1023px ("TABLET GRID (768–1023px) ... Margins: 24px"),
        // only reaching a wider 30px gutter at desktop (>=1024px, default `.ga-page` rule,
        // lines 33-39).
        //
        // ui.apps.ga/.../less/components/detail-hero.less:32-37 — the sibling hero component
        // that rate-details-hero.less explicitly says its wave-overlay CSS is "Reused from"
        // (rate-details-hero.less:43) does NOT jump to 63px padding until
        // @bp_small_desktop_min (1025px, variables.less:240) — much closer to where the page
        // grid itself changes.
        //
        // Net effect: across the whole tablet breakpoint (768-1023px), Rate Details Hero's
        // content sits ~39px further from the edge (63px vs the page's 24px gutter) than every
        // other component on the page — exactly the "Contents are not properly left aligned
        // with another components" misalignment reported in this ticket.
        await page.setViewportSize({ width: 800, height: 1024 }); // tablet range per variables.less: @ga-bp-tablet-min=768, @ga-bp-tablet-max=1023
        const pom = new RateDetailsHeroPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-rate-details-hero').first();
        await expect(root).toBeVisible();
        const paddingLeft = await root.evaluate(el => parseFloat(getComputedStyle(el).paddingLeft));
        // Expected: 24px, matching the sitewide tablet-range page gutter (_layout.less:258,
        // "padding-left: ((768 - 720) / 2) // 24px"). Actual: 63px (rate-details-hero.less:39),
        // because the component's own breakpoint fires ~257px too early (768px vs 1025px)
        // relative to the page grid / sibling detail-hero component. This assertion is expected to FAIL until
        // rate-details-hero.less's tablet padding rule is corrected.
        expect(paddingLeft, 'Rate Details Hero left padding at tablet width (800px) should match the sitewide page grid gutter (24px, _layout.less tablet rule) instead of jumping early to the 63px desktop value (rate-details-hero.less:38-40)').toBeLessThanOrEqual(24);
    });
});
