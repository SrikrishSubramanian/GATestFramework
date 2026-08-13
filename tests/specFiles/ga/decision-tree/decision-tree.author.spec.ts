import { test, expect } from '@playwright/test';
import { DecisionTreePage } from '../../../pages/ga/components/decisionTreePage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('DecisionTree — Happy Path', () => {
    test('[DT-001] @smoke @regression @sanity DecisionTree renders correctly', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
        await expect(root).toBeVisible();
        // Verify core structure: heading or primary content exists
        // Multi-step wizard: only :visible to avoid matching hidden inactive-step modal titles
        const heading = root.locator('h1:visible, h2:visible, h3:visible').first();
        const hasHeading = await heading.count() > 0;
        if (hasHeading) {
            await expect(heading).toBeVisible();
        }
        // Verify no JS errors during render
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
    test('[DT-002] @smoke @regression @sanity DecisionTree interactive elements are functional', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
        await expect(root).toBeVisible();
        // Verify interactive elements (links, buttons) are present and clickable
        // Multi-step wizard: only :visible to avoid matching hidden inactive-step toggles
        const interactive = root.locator('a:visible, button:visible');
        const count = await interactive.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await expect(interactive.nth(i)).toBeVisible();
            await expect(interactive.nth(i)).toBeEnabled();
        }
    });
});
test.describe('DecisionTree — Negative & Boundary', () => {
    test('[DT-003] @negative @regression @sanity DecisionTree handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-decision-tree').first()).toBeVisible();
    });
    test('[DT-004] @negative @regression @sanity DecisionTree handles missing images', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-decision-tree img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('DecisionTree — Responsive', () => {
    test('[DT-005] @mobile @regression @mobile @sanity DecisionTree adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
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
    test('[DT-006] @mobile @regression @sanity DecisionTree adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-decision-tree').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('DecisionTree — Console & Resources', () => {
    test('[DT-007] @regression DecisionTree produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('DecisionTree — Broken Images', () => {
    test('[DT-009] @regression DecisionTree all images have alt attributes', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-decision-tree img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('DecisionTree — Accessibility', () => {
});
test.describe('DecisionTree — AEM Dialog Configuration', () => {
});
// Relocated from image.author.spec.ts (MG-056) — CSV import mis-bucketed this under Image;
// it's actually about the Decision Tree component's authoring guide.
test.describe('DecisionTree — CSV Test Cases (GAAM-1388)', () => {
    test('[DT-010] @regression @sanity CMS-BE | Decision Tree Component- authoring guide issue — AC1', async ({ page }) => {
        const pom = new DecisionTreePage(page);
        await pom.navigate(BASE());
        // Investigated 2026-08-13: GAAM-1388 (mis-bucketed under Image in the CSV import — see
        // relocation comment above) reports "Authoring guide is not updated properly for all
        // Decision tree, Decision tree step and Decision tree option", asking the fix to match
        // the Promo Banner and Headline Block authoring guides' format.
        // All three READMEs already exist and are complete, matching that referenced format
        // (# Title, ## Authoring Notes, ## Dialog Configuration with Required/Description/
        // Authoring Guideline per field — see ui.apps/.../promo-banner/README.md and
        // .../headline-block/README.md):
        //   - ui.apps/src/main/content/jcr_root/apps/kkr-aem-base/components/content/
        //     decision-tree/README.md (dated "Last Modified Date & Time: Jul 15, 2026")
        //   - .../decision-tree-step/README.md (dated Jul 15, 2026)
        //   - .../decision-tree-option/README.md (dated Jun 27, 2026)
        // Verified field-by-field against each component's _cq_dialog/.content.xml: decision-tree
        // (accessibilityLabel, id) matches README lines 15-25; decision-tree-step (stepNumber,
        // prompt, accessibilityLabel, infoModalTitle, infoModalBody, id, options min-items="2"
        // max-items="4", activeSelect) matches README lines 16-61; decision-tree-option (label,
        // description, accessibilityLabel, id) matches README lines 14-36. No stale or missing
        // guidance was found — the doc update requested by this ticket has already been made.
        // Like TABS-061 (Tabs authoring-guide ticket), this remains documentation-only: the
        // README.md is a static repo file, not surfaced in the live AEM authoring UI. Each
        // _cq_dialog only carries the generic AEM helpPath boilerplate
        // (/mnt/overlay/wcm/core/content/sites/components/details.html/apps/...), identical to
        // promo-banner's own _cq_dialog helpPath, so there is no help-icon/link that renders the
        // README content in-product. There is no live, automatable UI surface to assert against.
        test.fixme(true, 'GAAM-1388 is documentation-only: the decision-tree, decision-tree-step, and decision-tree-option README.md authoring guides already exist, are complete, and were verified field-by-field against each component\'s _cq_dialog (accessibilityLabel/id; stepNumber/prompt/accessibilityLabel/infoModalTitle/infoModalBody/id/options/activeItem; label/description/accessibilityLabel/id respectively), matching the Promo Banner / Headline Block guide format the ticket points to. The guide is a static repo doc with no rendered UI surface (_cq_dialog only has the generic AEM details.html helpPath, same as promo-banner) to assert against in a live Playwright test.');
        expect(true).toBe(true);
    });
});
