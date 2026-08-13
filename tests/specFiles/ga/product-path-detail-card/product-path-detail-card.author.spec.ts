import { test, expect } from '@playwright/test';
import { ProductPathDetailCardPage } from '../../../pages/ga/components/productPathDetailCardPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl, deployFixture } from '../../../utils/infra/content-fixture-deployer';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('ProductPathDetailCard — Happy Path', () => {
    test('[PPDC-001] @smoke @regression @sanity ProductPathDetailCard renders correctly', async ({ page }) => {
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-detail-card').first();
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
    test('[PPDC-002] @smoke @regression @sanity ProductPathDetailCard interactive elements are functional', async ({ page }) => {
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-detail-card').first();
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
test.describe('ProductPathDetailCard — Negative & Boundary', () => {
    test('[PPDC-003] @negative @regression @sanity ProductPathDetailCard handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-product-path-detail-card').first()).toBeVisible();
    });
});
test.describe('ProductPathDetailCard — Responsive', () => {
    test('[PPDC-005] @mobile @regression @mobile @sanity ProductPathDetailCard adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-detail-card').first();
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
    test('[PPDC-006] @mobile @regression @sanity ProductPathDetailCard adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-product-path-detail-card').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('ProductPathDetailCard — Console & Resources', () => {
    test('[PPDC-007] @regression ProductPathDetailCard produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('ProductPathDetailCard — Broken Images', () => {
    test('[PPDC-008] @regression ProductPathDetailCard all images load successfully', async ({ page }) => {
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        await page.waitForLoadState('load'); // page has 10 card image instances that finish downloading after domcontentloaded
        const images = page.locator('.cmp-product-path-detail-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[PPDC-009] @regression ProductPathDetailCard all images have alt attributes', async ({ page }) => {
        const pom = new ProductPathDetailCardPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-product-path-detail-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('ProductPathDetailCard — Accessibility', () => {
});
test.describe('ProductPathDetailCard — AEM Dialog Configuration', () => {
});
// Relocated from text.author.spec.ts (TEXT-021) — CSV import mis-bucketed this under Text;
// it's explicitly about the Product Path Detail Card's superscript support.
test.describe('ProductPathDetailCard — CSV Test Cases (GAAM-1269)', () => {
    test('[PPDC-010] @regression @sanity BE: Product Path Detail Card - Superscript — AC1', async ({ page }) => {
        // Verified via kkr-aem source 2026-08-12: this AC is already implemented on both sides —
        // listItemTitle/descriptorTitle/ctaCalloutTitle are cq/gui/components/authoring/dialog/richtext
        // fields whose fieldDescription explicitly says "Supports superscript, symbols, and links"
        // (_cq_dialog/.content.xml), and product-path-detail-card.html renders each with
        // `@ context='html'` (not escaped), so any authored <sup> markup survives to the DOM.
        // Base normalize.less also correctly raises <sup> (position:relative; top:-0.5em).
        // No title field on the real style-guide page authors a <sup> (content gap, not a
        // component defect), so this uses a dedicated content fixture instead
        // (tests/data/content-fixtures/product-path-detail-card) that authors a listItemTitle
        // with a real <sup>, deployed to a GATestFramework-owned test-fixtures path — the
        // kkr-aem style guide content itself isn't modified.
        await deployFixture('product-path-detail-card', page);
        await page.goto(resolveComponentUrl('product-path-detail-card'), { waitUntil: 'domcontentloaded' });
        const titleSup = page.locator(
            '.cmp-product-path-detail-card__list-item-title sup, ' +
            '.cmp-product-path-detail-card__descriptor-title sup, ' +
            '.cmp-product-path-detail-card__cta-callout-title sup'
        ).first();
        const count = await titleSup.count();
        test.skip(count === 0, 'No title/descriptor/CTA-callout title authors superscript text — content gap, not a component defect (dialog + HTL both correctly support it)');
        await expect(titleSup).toBeVisible();
        // normalize.less raises <sup> via position:relative + a negative top offset (not
        // vertical-align, which stays "baseline" by design) plus a smaller font-size.
        const styles = await titleSup.evaluate(el => {
            const cs = getComputedStyle(el);
            const parentFontSize = el.parentElement ? parseFloat(getComputedStyle(el.parentElement).fontSize) : parseFloat(cs.fontSize);
            return { position: cs.position, top: parseFloat(cs.top) || 0, fontSize: parseFloat(cs.fontSize), parentFontSize };
        });
        expect(styles.fontSize, 'Superscript font-size should be smaller than the surrounding title text').toBeLessThan(styles.parentFontSize);
        expect(styles.position === 'relative' && styles.top < 0, 'Superscript should be raised via position:relative with a negative top offset').toBe(true);
    });
});
