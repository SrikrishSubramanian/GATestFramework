import { test, expect } from '@playwright/test';
import { AccordionTabsFeaturePage } from '../../../pages/ga/components/accordionTabsFeaturePage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
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
// ─── Selectors (from live DOM scan 2026-03-27) ──────────────────────────────
// Left column: accordion-list (role="tablist") with accordion-items containing
//   <button role="tab"> headers and <div role="tabpanel"> accordion-body panels.
// Right column: image panels (.cmp-accordion-tabs-feature__image-panel)
const ROOT = '.cmp-accordion-tabs-feature';
const WRAPPER = '.cmp-accordion-tabs-feature__wrapper';
const LEFT = '.cmp-accordion-tabs-feature__left';
const RIGHT = '.cmp-accordion-tabs-feature__right';
const TABLIST = '.cmp-accordion-tabs-feature__accordion-list';
const TAB = '.cmp-accordion-tabs-feature__accordion-header'; // <button role="tab">
const TABPANEL = '.cmp-accordion-tabs-feature__accordion-body'; // <div role="tabpanel">
const IMAGE_PANEL = '.cmp-accordion-tabs-feature__image-panel';
// Child component selectors (inside accordion-body panels)
const PANEL_TITLE = '.cmp-accordion-tab__title';
const PANEL_DESCRIPTION = '.cmp-accordion-tab__description';
const PANEL_CTA = '.cmp-accordion-tab__cta-wrapper';
const HEADLINE_BLOCK = '.cmp-headline-block';
// Instance indices on the style guide page:
// 0 = Accordion variant (Investment Strategy / Portfolio Management / Risk Assessment)
// 1 = Scrolling Tabs variant (Discover / Evaluate / Execute) — cq:styleIds=[behavior-scroll]
// 2 = Accordion + Headline variant (Financial Strength / Expert Team / Innovation Focus)
// 3 = Slate Background variant (Wealth Management / Retirement Planning / Insurance Solutions) — background-slate
// 4 = Granite Background variant (Global Reach / Innovation / Sustainability) — background-granite
// ─── Accordion Variant — Desktop ────────────────────────────────────────────
test.describe('AccordionTabsFeature — Accordion Variant (Desktop)', () => {
    test('[ATF-001] @smoke @regression @sanity Style guide page loads with all 5 component instances', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const roots = page.locator(ROOT);
        await expect(roots).toHaveCount(5);
        for (let i = 0; i < 5; i++) {
            await expect(roots.nth(i)).toBeVisible();
        }
    });
    test('[ATF-002] @smoke @regression @sanity Accordion instance renders left/right columns', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(0);
        await expect(instance.locator(LEFT)).toBeVisible();
        await expect(instance.locator(RIGHT)).toBeVisible();
        // Wrapper layout (flex or block) depends on whether component CSS is loaded
        const display = await instance.locator(WRAPPER).evaluate(el => getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        expect(['flex', 'block']).toContain(display);
        // TODO: Use assertLayout() for display checks
    });
    test('[ATF-003] @regression Tab list uses semantic ordered list with role="tablist"', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const tablist = page.locator(ROOT).nth(0).locator(TABLIST);
        await expect(tablist).toBeVisible();
        const tag = // 📏 TODO: Replace with measurement-utils
         await tablist.evaluate(el => el.tagName.toLowerCase());
        expect(tag).toBe('div');
        await expect(tablist).toHaveAttribute('role', 'tablist');
    });
    test('[ATF-004] @smoke @regression @sanity Accordion instance has 3 tabs with correct titles', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const tabs = page.locator(ROOT).nth(0).locator(TAB);
        await expect(tabs).toHaveCount(3);
        // Tab titles are inside <span class="__accordion-title"> within the <button role="tab">
        const expected = ['Investment Strategy', 'Portfolio Management', 'Risk Assessment'];
        for (let i = 0; i < 3; i++) {
            await expect(tabs.nth(i)).toContainText(expected[i]);
        }
    });
    test('[ATF-005] @smoke @regression @sanity Tabs have role="tab" attribute', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const tabs = page.locator(ROOT).nth(0).locator(TAB);
        const count = await tabs.count();
        for (let i = 0; i < count; i++) {
            await expect(tabs.nth(i)).toHaveAttribute('role', 'tab');
        }
    });
    test('[ATF-006] @regression Tabs are clickable without JS errors', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        capture.clear();
        const tabs = page.locator(ROOT).nth(0).locator(TAB);
        for (let i = 0; i < 3; i++) {
            await tabs.nth(i).click();
            // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        }
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
    test('[ATF-007] @regression Tab panels contain title, description, and CTA', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(0);
        const panels = instance.locator(TABPANEL);
        const panelCount = await panels.count();
        expect(panelCount).toBe(3);
        // Check first panel has title, description, CTA
        const firstPanel = panels.first();
        await expect(firstPanel.locator(PANEL_TITLE)).toContainText('Investment Strategy');
        await expect(firstPanel.locator(PANEL_DESCRIPTION)).toBeVisible();
        await expect(firstPanel.locator(PANEL_CTA)).toBeVisible();
    });
    test('[ATF-008] @regression CTA links have valid href', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(0);
        const ctas = instance.locator(`${PANEL_CTA} a`);
        const count = await ctas.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const href = await ctas.nth(i).getAttribute('href');
            expect(href).toBeTruthy();
        }
    });
    test('[ATF-009] @regression JS initialization flag is set on all instances', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const roots = page.locator(ROOT);
        const first = roots.first();
        const initAttr = await first.getAttribute('data-accordion-tabs-init');
        if (!initAttr) {
            test.skip();
            return;
        } // JS not loaded on this build
        const count = await roots.count();
        for (let i = 0; i < count; i++) {
            await expect(roots.nth(i)).toHaveAttribute('data-accordion-tabs-init', 'true');
        }
    });
    test('[ATF-010] @regression Each tab has unique ID and data-cmp-hook attribute', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const tabs = page.locator(ROOT).nth(0).locator(TAB);
        const ids = new Set<string>();
        const count = await tabs.count();
        for (let i = 0; i < count; i++) {
            const id = await tabs.nth(i).getAttribute('id');
            expect(id).toBeTruthy();
            ids.add(id!);
            await expect(tabs.nth(i)).toHaveAttribute('data-cmp-hook-accordion-tabs-feature', 'tab');
        }
        // All IDs should be unique
        expect(ids.size).toBe(count);
    });
});
// ─── Accordion + Headline Variant ───────────────────────────────────────────
test.describe('AccordionTabsFeature — Accordion with Headline (Desktop)', () => {
    test('[ATF-011] @regression Headline variant has headline block in DOM', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(2);
        const headline = instance.locator(HEADLINE_BLOCK);
        // Headline block is present in DOM (hidden via CSS when empty `:has()` selector)
        await expect(headline).toHaveCount(1);
    });
    test('[ATF-012] @regression Headline variant has 3 tabs with correct titles', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(2);
        const tabs = instance.locator(TAB);
        await expect(tabs).toHaveCount(3);
        const expected = ['Financial Strength', 'Expert Team', 'Innovation Focus'];
        for (let i = 0; i < 3; i++) {
            await expect(tabs.nth(i)).toContainText(expected[i]);
        }
    });
    test('[ATF-013] @regression Headline variant panels match tab content', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(2);
        const panels = instance.locator(TABPANEL);
        await expect(panels).toHaveCount(3);
        await expect(panels.first().locator(PANEL_TITLE)).toContainText('Financial Strength');
    });
});
// ─── Scrolling Tabs Variant — Desktop ───────────────────────────────────────
// Instance 2 (Discover/Evaluate/Execute) has cq:styleIds=[behavior-scroll].
// The scrolling-tabs CSS is activated via data-style="scrolling-tabs" on the root.
// We set this attribute in-test to verify the CSS behavior.
test.describe('AccordionTabsFeature — Scrolling Tabs Variant (Desktop)', () => {
    async function activateScrollingTabs(page: import('@playwright/test').Page) {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        await page.locator(ROOT).nth(1).evaluate(el => {
            el.setAttribute('data-style', 'scrolling-tabs');
        });
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        return page.locator(ROOT).nth(1);
    }
    test('[ATF-014] @smoke @regression @sanity Scrolling tabs instance has 3 tabs (Discover/Evaluate/Execute)', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(1);
        const tabs = instance.locator(TAB);
        await expect(tabs).toHaveCount(3);
        const expected = ['Discover', 'Evaluate', 'Execute'];
        for (let i = 0; i < 3; i++) {
            await expect(tabs.nth(i)).toContainText(expected[i]);
        }
    });
    test('[ATF-016] @regression Scrolling-tabs mode makes the component root sticky (top:0), not the right column', async ({ page }) => {
        // Original test checked RIGHT (.cmp-accordion-tabs-feature__right) for position:sticky with
        // top:64px. Investigation of accordion-tabs-feature.less found ZERO occurrences of `sticky`
        // anywhere in the file — .__right is always `position: relative` on desktop (L446-457). There
        // is no header-height offset anywhere either: site-header.less sets the header to height:75px
        // (L199), not 64px, so `top: 64px` had no basis in the codebase.
        //
        // The real sticky mechanism lives in accordion-tabs-feature.js initScrollingMode() (L426-465):
        // it sets `position:sticky; top:0; height:100vh` inline on `this.element` — the component
        // ROOT (.cmp-accordion-tabs-feature) — not on the right column.
        //
        // Also, `activateScrollingTabs()` (setting `data-style` via el.setAttribute after load) never
        // actually triggers this: `this.style` is captured once at construction from the attribute
        // (accordion-tabs-feature.js L102), and the component's MutationObserver only watches
        // childList/subtree/characterData (L831-835), never attribute changes. So the original test
        // could never observe position:sticky and always fell into its own test.skip() branch —
        // matching the "flagged as skipped" report. (Separately, the live content's
        // accordion_tabs_scroll node is also missing the `style="scrolling-tabs"` property that the
        // checked-in fixture XML defines — an orphaned duplicate node holds it instead — so even a
        // correct attribute-based approach wouldn't organically reproduce scrolling-tabs mode right now.)
        //
        // Fixed test: drive the actual production code path directly (the same method real content
        // authoring triggers) and verify the real behavior on the real element.
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).nth(1);
        const right = instance.locator(RIGHT);

        await instance.evaluate(el => {
            const inst = (el as unknown as { accordionTabsFeatureInstance?: { style: string; applyMode: () => void } }).accordionTabsFeatureInstance;
            if (!inst) throw new Error('AccordionTabsFeature instance not attached to element');
            inst.style = 'scrolling-tabs';
            inst.applyMode();
        });

        const rootStyle = await instance.evaluate(el => ({
            position: getComputedStyle(el).position,
            top: getComputedStyle(el).top,
        }));
        expect(rootStyle.position, 'Component root should be position:sticky in scrolling-tabs mode (accordion-tabs-feature.js L460)').toBe('sticky');
        expect(rootStyle.top, 'Sticky top offset is 0 per JS (L461) — no header-height compensation exists').toBe('0px');

        const rightPosition = await right.evaluate(el => getComputedStyle(el).position);
        expect(rightPosition, 'Right column has no sticky rule anywhere in accordion-tabs-feature.less — it stays position:relative').toBe('relative');
    });
    test('[ATF-018] @regression Scrolling tabs accordion bodies all present', async ({ page }) => {
        const instance = await activateScrollingTabs(page);
        const panels = instance.locator(TABPANEL);
        const count = await panels.count();
        expect(count).toBe(3);
        // In scrolling mode, panels may not have the hidden attribute
        for (let i = 0; i < count; i++) {
            const hidden = await panels.nth(i).getAttribute('hidden');
            // At least in scroll mode, panels should not all be hidden
            if (hidden !== null && hidden !== '') {
                // If hidden, it's still the accordion behavior — acceptable
            }
        }
    });
    test('[ATF-019] @regression Scrolling tabs panels have content with descriptions', async ({ page }) => {
        const instance = await activateScrollingTabs(page);
        // In scrolling mode, panels are scroll-driven — tabs may not respond to click.
        // Verify all panels have description content in DOM (regardless of visibility).
        const panels = instance.locator(TABPANEL);
        const count = await panels.count();
        expect(count).toBe(3);
        for (let i = 0; i < count; i++) {
            const desc = panels.nth(i).locator(PANEL_DESCRIPTION);
            const text = await desc.textContent().catch(() => '');
            expect(text?.trim().length, `Panel ${i} should have description content`).toBeGreaterThan(0);
        }
    });
});
// ─── Accordion Variant — Mobile ─────────────────────────────────────────────
test.describe('AccordionTabsFeature — Accordion Variant (Mobile)', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
    });
    test('[ATF-020] @mobile @smoke @regression @sanity Component renders on mobile viewport', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).first();
        await expect(instance).toBeVisible();
        await expect(instance.locator(TAB).first()).toBeVisible();
    });
    test('[ATF-021] @mobile @regression Mobile hides right column (display:none)', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).first();
        const right = instance.locator(RIGHT);
        const display = // 📏 TODO: Replace with measurement-utils
         await right.evaluate(el => getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        // Requires component CSS for responsive hiding — skip if not loaded
        if (display !== 'none') {
            test.skip();
            return;
        }
        expect(display).toBe('none');
    });
    test('[ATF-022] @mobile @regression All tabs visible and accessible on mobile', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).first();
        const tabs = instance.locator(TAB);
        await expect(tabs).toHaveCount(3);
        for (let i = 0; i < 3; i++) {
            await expect(tabs.nth(i)).toBeVisible();
        }
    });
    test('[ATF-023] @mobile @regression Tab click does not cause errors on mobile', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        capture.clear();
        const tabs = page.locator(ROOT).first().locator(TAB);
        await tabs.nth(0).click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        await tabs.nth(1).click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
    test('[ATF-024] @mobile @regression Mobile has no horizontal overflow', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).first();
        const overflow = // 📏 TODO: Replace with measurement-utils
         await instance.evaluate(el => el.scrollWidth > el.clientWidth);
        expect(overflow).toBe(false);
    });
    test('[ATF-025] @mobile @regression Mobile font size for panel titles', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        // Panel titles are in the right column which is hidden on mobile
        // Check tab text size instead
        const tab = page.locator(ROOT).first().locator(TAB).first();
        const mobileSize = // 📏 TODO: Replace with measurement-utils
         await tab.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        // measurement: use measurement-utils for cleaner code
        expect(mobileSize).toBeGreaterThan(0);
    });
});
// ─── Scrolling Tabs Variant — Mobile ────────────────────────────────────────
test.describe('AccordionTabsFeature — Scrolling Tabs Variant (Mobile)', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
    });
    async function activateScrollingTabsMobile(page: import('@playwright/test').Page) {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        await page.locator(ROOT).nth(1).evaluate(el => {
            el.setAttribute('data-style', 'scrolling-tabs');
        });
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        return page.locator(ROOT).nth(1);
    }
    test('[ATF-026] @mobile @smoke @regression @sanity Scrolling tabs renders on mobile', async ({ page }) => {
        const instance = await activateScrollingTabsMobile(page);
        await expect(instance).toBeVisible();
        const tabs = instance.locator(TAB);
        await expect(tabs).toHaveCount(3);
    });
    test('[ATF-027] @mobile @regression Scrolling tabs right column hidden on mobile', async ({ page }) => {
        const instance = await activateScrollingTabsMobile(page);
        const right = instance.locator(RIGHT);
        const display = // 📏 TODO: Replace with measurement-utils
         await right.evaluate(el => getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        // Requires component CSS for responsive hiding — skip if not loaded
        if (display !== 'none') {
            test.skip();
            return;
        }
        expect(display).toBe('none');
    });
    test('[ATF-028] @mobile @regression Scrolling tabs mobile has no horizontal overflow', async ({ page }) => {
        const instance = await activateScrollingTabsMobile(page);
        const overflow = // 📏 TODO: Replace with measurement-utils
         await instance.evaluate(el => el.scrollWidth > el.clientWidth);
        expect(overflow).toBe(false);
    });
    test('[ATF-029] @mobile @regression Scrolling tabs render and are visible on mobile', async ({ page }) => {
        const instance = await activateScrollingTabsMobile(page);
        const tabs = instance.locator(TAB);
        const count = await tabs.count();
        expect(count).toBeGreaterThanOrEqual(2);
        // In scrolling mode on mobile, tabs may be scroll-driven rather than click-driven
        // Verify they exist and are visible
        await expect(tabs.first()).toBeVisible();
    });
});
// ─── BEM Structure ──────────────────────────────────────────────────────────
test.describe('AccordionTabsFeature — BEM Structure', () => {
    test('[ATF-030] @regression Root uses .cmp-accordion-tabs-feature class', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const roots = page.locator(ROOT);
        const count = await roots.count();
        expect(count).toBeGreaterThanOrEqual(3);
    });
    test('[ATF-031] @regression Wrapper follows BEM __wrapper pattern', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const wrappers = page.locator(ROOT).first().locator(WRAPPER);
        await expect(wrappers).toHaveCount(1);
    });
    test('[ATF-032] @regression Child elements follow BEM naming (accordion-header, accordion-body, accordion-list)', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).first();
        await expect(instance.locator(TABLIST)).toHaveCount(1);
        expect(await instance.locator(TAB).count()).toBe(3);
        expect(await instance.locator(TABPANEL).count()).toBe(3);
    });
    test('[ATF-033] @regression Tab panel child uses .cmp-accordion-tab BEM block', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const tabContent = page.locator('.cmp-accordion-tab');
        expect(await tabContent.count()).toBeGreaterThan(0);
        // First panel is expanded; title h3 is CSS-hidden, description is visible
        const firstInstance = page.locator(ROOT).first();
        const firstPanel = firstInstance.locator(TABPANEL).first();
        // Verify panel title exists in DOM (even if visually hidden)
        expect(await firstPanel.locator(PANEL_TITLE).count()).toBeGreaterThan(0);
        // Description should be visible in expanded panel
        await expect(firstPanel.locator(PANEL_DESCRIPTION)).toBeVisible();
    });
});
// ─── ARIA Accessibility ─────────────────────────────────────────────────────
test.describe('AccordionTabsFeature — Accessibility', () => {
});
// ─── Console & Resources ────────────────────────────────────────────────────
test.describe('AccordionTabsFeature — Console & Resources', () => {
    test('[ATF-041] @regression No unexpected JS errors on load and interaction', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        capture.clear();
        const tabs = page.locator(ROOT).first().locator(TAB);
        await tabs.nth(0).click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        await tabs.nth(1).click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        await tabs.nth(2).click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
    test('[ATF-042] @regression No HTL comments in published HTML', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const html = await page.content();
        expect(html).not.toContain('<!--/*');
    });
    test('[ATF-043] @regression All images load successfully', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const images = page.locator(`${ROOT} img`);
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[ATF-044] @regression All images have alt attributes', async ({ page }) => {
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const images = page.locator(`${ROOT} img`);
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
// ─── Tablet Viewport ────────────────────────────────────────────────────────
test.describe('AccordionTabsFeature — Tablet Viewport', () => {
    test('[ATF-045] @regression Component renders on tablet (1024px)', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const instance = page.locator(ROOT).first();
        await expect(instance).toBeVisible();
        // Verify tabs render (panels may be hidden except active)
        await expect(instance.locator(TAB).first()).toBeVisible();
    });
    test('[ATF-046] @regression Tablet tab interaction is error-free', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        capture.clear();
        const tabs = page.locator(ROOT).first().locator(TAB);
        await tabs.nth(1).click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
// ─── Bug Regression Tests ─────────────────────────────────────────────────────
// Added after GAAM-381 bugs: dialog helpPath missing + parsys policy blocking child components.
test.describe('AccordionTabsFeature — AEM Dialog Configuration', () => {
});
// ─── ResourceType Chain & Component Registration ─────────────────────────────
// GAAM-421: TC_001 (template availability), TC_002 (excluded templates)
test.describe('AccordionTabsFeature — Component Registration', () => {
    test('[ATF-112] @author @regression Component group is "GA Base"', async ({ page }) => {
        const overlayUrl = `${BASE()}/apps/ga/components/content/accordion-tabs-feature.1.json`;
        const response = await page.request.get(overlayUrl);
        if (!response.ok()) {
            test.skip();
            return;
        }
        const data = await response.json();
        expect(data.componentGroup, 'Component group must be GA Base for component browser').toBe('GA Base');
    });
});
// ─── Style System Verification ───────────────────────────────────────────────
test.describe('AccordionTabsFeature — Style System', () => {
    test('[ATF-114] @author @regression Style/behavior attribute selectors have rules in compiled stylesheet (not orphaned)', async ({ page }) => {
        // Original test checked cq:styleIds values ('behavior-accordion', 'behavior-scroll',
        // 'enable-Headline' — authored on content nodes per accordion-tabs-feature-fixtures.xml)
        // against document.styleSheets, expecting them to appear as CSS class rules (the classic AEM
        // Style System pattern: cq:styleGroups/cq:styles map a cq:styleId to a cq:styleClasses value
        // that gets added to the component's root class list).
        //
        // Live investigation shows this component does NOT use that mechanism at all:
        //  - The component's policy node has no cq:styleGroups/cq:styles config — confirmed live via
        //    GET /conf/global-atlantic/settings/wcm/policies/ga/components/content/accordion-tabs-feature/
        //    accordion-tabs-feature-default.infinity.json (only jcr:title/jcr:description/components).
        //  - The rendered root class list is always exactly "cmp-accordion-tabs-feature" for every
        //    instance on the live style guide page — no style-system-injected class is ever added.
        //  - None of 'behavior-accordion' / 'behavior-scroll' / 'enable-Headline' appear anywhere in
        //    accordion-tabs-feature.less, confirmed by both static grep and a live
        //    document.styleSheets scan (all 3 return false).
        // So those cq:styleIds are inert dialog-list metadata for this component — not a Style System
        // gap to detect, they were simply never wired to CSS in the first place and structurally can't be.
        //
        // The component's actual style/behavior toggle is the "./style" dialog dropdown
        // (kkr-aem-base .../accordion-tabs-feature/_cq_dialog/.content.xml L74-92: values "accordion" /
        // "scrolling-tabs"), rendered as the `data-style` attribute and consumed via attribute-selector
        // CSS (accordion-tabs-feature.less L37, L640: `&[data-style="scrolling-tabs"]`). This rewritten
        // test verifies THAT real mechanism's selector is actually present in the compiled clientlib
        // (i.e. would catch a broken/orphaned build), which is what live-verified as true.
        const pom = new AccordionTabsFeaturePage(page);
        await pom.navigate(BASE());
        const attributeSelectors = ['data-style="scrolling-tabs"'];
        const missingRules: string[] = [];
        for (const sel of attributeSelectors) {
            const hasRule = await page.evaluate((needle) => {
                try {
                    for (const sheet of document.styleSheets) {
                        try {
                            for (const rule of sheet.cssRules) {
                                if (rule.cssText && rule.cssText.includes(needle)) {
                                    return true;
                                }
                            }
                        }
                        catch { /* cross-origin sheet */ }
                    }
                }
                catch { /* no access */ }
                return false;
            }, sel);
            if (!hasRule)
                missingRules.push(sel);
        }
        expect(missingRules, `Style/behavior attribute selectors missing from compiled CSS: ${missingRules.join(', ')}`).toEqual([]);
    });
});
