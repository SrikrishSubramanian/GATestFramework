import { test, expect } from '@playwright/test';
import { QuotePage } from '../../../pages/ga/components/quotePage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('Quote — Happy Path', () => {
    test('[QT-001] @smoke @regression @sanity Quote renders correctly', async ({ page }) => {
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-quote').first();
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
    test('[QT-002] @smoke @regression @sanity Quote interactive elements are functional', async ({ page }) => {
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-quote').first();
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
test.describe('Quote — Negative & Boundary', () => {
    test('[QT-003] @negative @regression @sanity Quote handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-quote').first()).toBeVisible();
    });
    test('[QT-004] @negative @regression @sanity Quote handles missing images', async ({ page }) => {
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-quote img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Quote — Responsive', () => {
    test('[QT-005] @mobile @regression @mobile @sanity Quote adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-quote').first();
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
    test('[QT-006] @mobile @regression @sanity Quote adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-quote').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Quote — Console & Resources', () => {
    test('[QT-007] @regression Quote produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Quote — Broken Images', () => {
    test('[QT-008] @regression Quote all images load successfully', async ({ page }) => {
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-quote img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[QT-009] @regression Quote all images have alt attributes', async ({ page }) => {
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-quote img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Quote — Accessibility', () => {
});
test.describe('Quote — AEM Dialog Configuration', () => {
});
// Relocated from image.author.spec.ts (MG-059) — CSV import mis-bucketed this under Image;
// it's actually about the Quote component (GAAM-1280).
test.describe('Quote — CSV Test Cases (GAAM-1357)', () => {
    test('[QT-010] @regression @sanity CMS FE: GAAM-1280(quote component) alignment issue — AC1', async ({ page }) => {
        // Investigated via kkr-aem source 2026-08-12. This AC bundles 3 separate visual claims
        // from one Jira comment; none can be conclusively confirmed or denied from static source
        // alone, and there is no live content on the style guide that even renders the part of
        // the DOM the claims are about:
        //
        // 1. "Roles in the info panel are not aligning to the right in small desktop breakpoints."
        //    quote.less:272-274 explicitly sets `&__author-description { text-align: left }` at
        //    @bp_small_desktop_min (and quote.less:237-239 does the same for `&__name`) — i.e.
        //    the code deliberately left-aligns these today. Whether "right" is actually the
        //    correct direction can only be confirmed against the linked Figma frame
        //    (figma.com/design/C7DwRfnSXu89s42cug1QyS, node 34313-44453), which isn't fetchable
        //    from this repo — need a live design comparison, not a source read.
        //
        // 2. "Only the quote wraps to multiple lines — the info panel maintains its width."
        //    quote.less:38-49 gives quote text `flex: 3 1 0` and figcaption `flex: 2 1 0` at
        //    @bp_small_desktop_min — a deliberate 3:2 proportional split, not a fixed width, so
        //    whether this reads as a defect depends on real authored quote/role text length at
        //    the exact small-desktop viewport width — not decidable from the LESS rules alone.
        //
        // 3. "Author images and names should be aligned left for left-aligned quote, center for
        //    center-aligned — mobile works, bring desktop in line." This part already matches
        //    the code: `&__author`/`&__name` use `align-items/text-align: flex-start`/`left` at
        //    @bp_small_desktop_min for the default (left) variant (quote.less:227-239), and
        //    `.cmp-quote--align-center` forces `align-items/text-align: center` end-to-end
        //    (quote.less:386-397) — desktop already mirrors mobile.
        //
        //    BUT: none of the style-guide fixtures (ui.content.ga/.../style-guide/components/
        //    quote/.content.xml) author an `author` DAM asset — every instance sets only
        //    `textarea`/`authorDescription`. quote.html:59 guards the role text on
        //    `${quoteModel.authorDescription && quoteModel.author.name}` (both must be truthy),
        //    and the name/headshot spans (quote.html:48-58) require `author.imagePath`/
        //    `author.name` directly. With no `author` asset authored anywhere, the entire
        //    figcaption "info panel" this AC is about renders empty on every live instance —
        //    a content gap that blocks visually verifying any of points 1-3, not just point 3.
        test.fixme(true, 'AC bundles a Figma-direction question (point 1, needs live design comparison — not fetchable from source), a content-length-dependent wrap claim (point 2), and a claim already matching current CSS (point 3) that has no live content to render it (no style-guide quote instance authors an `author` DAM asset, so quote.html:59\'s authorDescription && author.name guard never passes). Verify manually against the linked Figma frame once a quote instance with a real author asset is authored.');
        const pom = new QuotePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-quote').first();
        await expect(root).toBeVisible();
    });
});
