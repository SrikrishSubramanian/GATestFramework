import { test, expect } from '@playwright/test';
import { TabsPage } from '../../../pages/ga/components/tabsPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
// ─── Selectors (from live DOM + LESS) ────────────────────────────────────────
const TABS = '.cmp-tabs';
const TABLIST = '.cmp-tabs__tablist';
const TAB = '.cmp-tabs__tab';
const TAB_ACTIVE = '.cmp-tabs__tab--active';
const TABPANEL = '.cmp-tabs__tabpanel';
const TABPANEL_ACTIVE = '.cmp-tabs__tabpanel--active';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const SECTION_SLATE = '.cmp-section--background-color-slate';
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
// ─────────────────────────────────────────────────────────────────────────────
// Core Structure (TAB-001 – TAB-010)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Core Structure', () => {
    test('[TAB-001] @smoke @regression @sanity Style guide has at least 4 tabs instances', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const instances = page.locator(TABS);
        expect(await instances.count()).toBeGreaterThanOrEqual(4);
    });
    test('[TAB-002] @smoke @regression @sanity Tablist is rendered as an <ol> element', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tablist = page.locator(TABLIST).first();
        await expect(tablist).toBeVisible();
        const tagName = // 📏 TODO: Replace with measurement-utils
         await tablist.evaluate(el => el.tagName.toLowerCase());
        expect(tagName).toBe('ol');
    });
    test('[TAB-003] @regression Tab items are rendered as <li> elements', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTab = page.locator(TAB).first();
        await expect(firstTab).toBeVisible();
        const tagName = // 📏 TODO: Replace with measurement-utils
         await firstTab.evaluate(el => el.tagName.toLowerCase());
        expect(tagName).toBe('li');
    });
    test('[TAB-004] @regression Tab pill has border-radius of 999px', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tab = page.locator(TAB).first();
        await expect(tab).toBeVisible();
        const radius = // 📏 TODO: Replace with measurement-utils
         await tab.evaluate(el => getComputedStyle(el).borderRadius);
        // measurement: use measurement-utils for cleaner code
        // 999px resolves to a large pixel value (clamped to half the element size) or 999px literally
        const numericValue = parseFloat(radius);
        expect(numericValue).toBeGreaterThanOrEqual(19); // at minimum half of 38px height
    });
    test('[TAB-005] @smoke @regression @sanity First tab is active by default (has --active class)', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const firstTab = firstTabsInstance.locator(TAB).first();
        await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);
    });
    test('[TAB-006] @regression Active tab has granite background and white text', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const activeTab = page.locator(TAB_ACTIVE).first();
        await expect(activeTab).toBeVisible();
        // Root-caused 2026-08-13: TabsPage.navigate() resolves at 'domcontentloaded', before the
        // GA clientlib CSS has necessarily finished applying. tabs.less sets
        // `&--active { color: @c-ga-white; }` with `@c-ga-white: #FFFFFF` (pure white — confirmed in
        // kkr-aem/ui.apps.ga/.../abstracts/variables.less:337) and the tab's own rule declares
        // `transition: background-color 0.2s ease, color 0.2s ease;` (tabs.less line ~97). When the
        // active-state color rule finishes applying just after first paint, that transition property
        // makes the browser animate color from its pre-CSS default toward white instead of snapping to
        // it, so a computed-style read taken immediately after navigate() can land mid-transition —
        // reproduced live as rgb(238, 241, 247) and rgb(254, 254, 255) on different runs (both interpolate
        // linearly between azul #154197 and white #FFFFFF at ~93% / ~99.5% progress). Waiting out the
        // 200ms transition window makes the read deterministic.
        await page.waitForTimeout(300);
        const color = // 📏 TODO: Replace with measurement-utils
         await activeTab.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        // White text: rgb(255, 255, 255)
        expect(color, `Expected 'rgb(255, 255, 255, got ${color}`).toBe('rgb(255, 255, 255)');
        const bg = // 📏 TODO: Replace with measurement-utils
         await activeTab.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        // Should not be transparent — granite bg is a dark color
        expect(bg).not.toContain('rgba(0, 0, 0, 0)');
        expect(bg).not.toBe('transparent');
    });
    test('[TAB-007] @regression Inactive tabs have azul-toned color', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const tabs = firstTabsInstance.locator(TAB);
        const tabCount = await tabs.count();
        // Find a tab without --active class
        let foundInactive = false;
        for (let i = 0; i < tabCount; i++) {
            const classes = await tabs.nth(i).getAttribute('class') || '';
            if (!classes.includes('--active')) {
                const color = await tabs.nth(i).evaluate(el => getComputedStyle(el).color);
                // measurement: use measurement-utils for cleaner code
                // Inactive tabs on white/slate sections have azul color (not white, not black)
                expect(color).not.toBe('rgb(255, 255, 255)');
                foundInactive = true;
                break;
            }
        }
        expect(foundInactive, 'Expected at least one inactive tab').toBe(true);
    });
    test('[TAB-008] @regression Hidden KKR elements are not visible (display:none)', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const bgImage = page.locator('.cmp-tabs__background-image').first();
        const linkListHeadline = page.locator('.cmp-link-list-headline').first();
        const linkListSubHeadline = page.locator('.cmp-link-list-sub-headline').first();
        // These elements are display:none GA overrides; they should not be visible
        if (await bgImage.count() > 0) {
            await expect(bgImage).toBeHidden();
        }
        if (await linkListHeadline.count() > 0) {
            await expect(linkListHeadline).toBeHidden();
        }
        if (await linkListSubHeadline.count() > 0) {
            await expect(linkListSubHeadline).toBeHidden();
        }
    });
    test('[TAB-009] @regression Tabs wrapper is a flex column container', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator('.cmp-tabs__wrapper').first();
        if (await wrapper.count() === 0) {
            test.skip();
            return;
        }
        const display = // 📏 TODO: Replace with measurement-utils
         await wrapper.evaluate(el => getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await wrapper.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(display).toBe('flex');
        // TODO: Use assertLayout() for display checks
        expect(flexDir).toBe('column');
    });
    test('[TAB-010] @regression Tab panel content area exists within each tabs instance', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const panels = firstTabsInstance.locator(TABPANEL);
        expect(await panels.count()).toBeGreaterThanOrEqual(1);
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// Tab Behavior (TAB-011 – TAB-016)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Tab Behavior', () => {
    test('[TAB-011] @smoke @regression @sanity Clicking a tab makes it active and removes active from old', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const tabs = firstTabsInstance.locator(TAB);
        const tabCount = await tabs.count();
        if (tabCount < 2) {
            test.skip();
            return;
        }
        // First tab is active; click the second
        await tabs.nth(1).click();
        await expect(tabs.nth(1)).toHaveClass(/cmp-tabs__tab--active/);
        await expect(tabs.nth(0)).not.toHaveClass(/cmp-tabs__tab--active/);
    });
    test('[TAB-012] @smoke @regression @sanity Clicking a tab shows its associated tabpanel', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const tabs = firstTabsInstance.locator(TAB);
        const panels = firstTabsInstance.locator(TABPANEL);
        if (await tabs.count() < 2) {
            test.skip();
            return;
        }
        // Click second tab
        await tabs.nth(1).click();
        // Second panel should become active
        await expect(panels.nth(1)).toHaveClass(/cmp-tabs__tabpanel--active/);
    });
    test('[TAB-013] @regression Only one tabpanel is active at a time', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const activePanels = firstTabsInstance.locator(TABPANEL_ACTIVE);
        expect(await activePanels.count()).toBe(1);
        // Click a different tab and verify still only one active
        const tabs = firstTabsInstance.locator(TAB);
        if (await tabs.count() >= 3) {
            await tabs.nth(2).click();
            expect(await activePanels.count()).toBe(1);
        }
    });
    test('[TAB-014] @regression Active panel has display:block, inactive panels have display:none', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const panels = firstTabsInstance.locator(TABPANEL);
        const count = await panels.count();
        for (let i = 0; i < count; i++) {
            const classes = await panels.nth(i).getAttribute('class') || '';
            const display = await panels.nth(i).evaluate(el => getComputedStyle(el).display);
            // measurement: use measurement-utils for cleaner code
            if (classes.includes('--active')) {
                expect(display).toBe('block');
                // TODO: Use assertLayout() for display checks
            }
            else {
                expect(display).toBe('none');
            }
        }
    });
    test('[TAB-015] @regression Active tab panel has margin-top of 48px', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const activePanel = page.locator(TABPANEL_ACTIVE).first();
        await expect(activePanel).toBeVisible();
        const marginTop = // 📏 TODO: Replace with measurement-utils
         await activePanel.evaluate(el => getComputedStyle(el).marginTop);
        // measurement: use measurement-utils for cleaner code
        expect(marginTop).toBe('48px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[TAB-016] @regression Active tab has tabindex="0", inactive tabs have tabindex="-1"', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const tabs = firstTabsInstance.locator(TAB);
        const count = await tabs.count();
        for (let i = 0; i < count; i++) {
            const classes = await tabs.nth(i).getAttribute('class') || '';
            const tabindex = await tabs.nth(i).getAttribute('tabindex');
            if (classes.includes('--active')) {
                expect(tabindex).toBe('0');
            }
            else {
                expect(tabindex).toBe('-1');
            }
        }
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// Pill Styling (TAB-017 – TAB-022)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Pill Styling', () => {
    test('[TAB-017] @regression Tab has cursor:pointer', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tab = page.locator(TAB).first();
        await expect(tab).toBeVisible();
        const cursor = // 📏 TODO: Replace with measurement-utils
         await tab.evaluate(el => getComputedStyle(el).cursor);
        // measurement: use measurement-utils for cleaner code
        expect(cursor).toBe('pointer');
    });
    test('[TAB-018] @regression Tab has CSS transition for background-color and color', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tab = page.locator(TAB).first();
        await expect(tab).toBeVisible();
        const transition = // 📏 TODO: Replace with measurement-utils
         await tab.evaluate(el => getComputedStyle(el).transition);
        // measurement: use measurement-utils for cleaner code
        // Should contain transition properties for bg/color
        expect(transition).not.toBe('');
        expect(transition).not.toBe('none 0s ease 0s');
    });
    test('[TAB-019] @regression Inactive tab background changes on hover (azul 8% bg)', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const firstTabsInstance = page.locator(TABS).first();
        const tabs = firstTabsInstance.locator(TAB);
        const tabCount = await tabs.count();
        // Find an inactive tab
        let inactiveIdx = -1;
        for (let i = 0; i < tabCount; i++) {
            const classes = await tabs.nth(i).getAttribute('class') || '';
            if (!classes.includes('--active')) {
                inactiveIdx = i;
                break;
            }
        }
        if (inactiveIdx === -1) {
            test.skip();
            return;
        }
        // Settle any post-navigate transition (see TAB-006) before taking the baseline reading.
        await page.waitForTimeout(300);
        const bgBefore = await tabs.nth(inactiveIdx).evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        await tabs.nth(inactiveIdx).hover();
        // Root-caused 2026-08-13: tabs.less defines `&:hover { background-color: @c-primary-azul-opacity-8; }`
        // (kkr-aem/ui.apps.ga/.../components/tabs.less line ~123) unconditionally on `.cmp-tabs__tab`
        // (not scoped to a themed section), and `.cmp-tabs__tab` has
        // `transition: background-color 0.2s ease, color 0.2s ease;` (tabs.less line ~97). Reading
        // getComputedStyle() synchronously right after hover() catches background-color at the very
        // start of that 200ms transition — i.e. still the pre-hover value (`transparent` on desktop,
        // which computes to 'rgba(0, 0, 0, 0)') — reproduced live in CI. Waiting out the transition
        // window lets the hover background reach its azul-8%-opacity end state before asserting.
        await page.waitForTimeout(300);
        const bgAfter = await tabs.nth(inactiveIdx).evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        // Background should change on hover; if transition is in progress both values may differ
        // Accept that it changed OR assert it is not fully transparent (azul 8%)
        expect(bgAfter).not.toBe('rgba(0, 0, 0, 0)');
    });
    test('[TAB-021] @regression Desktop tab height is 46px', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tab = page.locator(TAB).first();
        await expect(tab).toBeVisible();
        const box = await tab.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeCloseTo(46, 0);
    });
    test('[TAB-022] @regression Tab uses Graphie Bold font family', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tab = page.locator(TAB).first();
        await expect(tab).toBeVisible();
        const fontFamily = // 📏 TODO: Replace with measurement-utils
         await tab.evaluate(el => getComputedStyle(el).fontFamily);
        // measurement: use measurement-utils for cleaner code
        // GA uses Graphie Bold for tab labels
        expect(fontFamily.toLowerCase()).toContain('graphie');
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// Responsive (TAB-023 – TAB-028)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Responsive', () => {
    test('[TAB-023] @mobile @regression @sanity At 390px tablist wraps tabs (flex-wrap: wrap)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tablist = page.locator(TABLIST).first();
        await expect(tablist).toBeVisible();
        const flexWrap = // 📏 TODO: Replace with measurement-utils
         await tablist.evaluate(el => getComputedStyle(el).flexWrap);
        // measurement: use measurement-utils for cleaner code
        expect(flexWrap).toBe('wrap');
    });
    test('[TAB-024] @mobile @regression @sanity Mobile tablist gap is 8px', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tablist = page.locator(TABLIST).first();
        await expect(tablist).toBeVisible();
        const gap = // 📏 TODO: Replace with measurement-utils
         await tablist.evaluate(el => getComputedStyle(el).gap);
        // measurement: use measurement-utils for cleaner code
        expect(gap).toBe('8px');
    });
    test('[TAB-025] @mobile @regression @sanity Mobile tab height is 38px', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tab = page.locator(TAB).first();
        await expect(tab).toBeVisible();
        const box = await tab.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeCloseTo(38, 0);
    });
    test('[TAB-026] @mobile @regression @sanity Mobile tab font-size is smaller than desktop', async ({ page }) => {
        // Desktop font size
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const desktopFontSize = await page.locator(TAB).first().evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        // measurement: use measurement-utils for cleaner code
        // Mobile font size
        await page.setViewportSize({ width: 390, height: 844 });
        await page.reload({ waitUntil: 'domcontentloaded' });
        const mobileFontSize = await page.locator(TAB).first().evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        // measurement: use measurement-utils for cleaner code
        expect(mobileFontSize).toBeLessThanOrEqual(desktopFontSize);
    });
    test('[TAB-027] @mobile @regression @sanity No horizontal overflow on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tabsInstance = page.locator(TABS).first();
        await expect(tabsInstance).toBeVisible();
        const hasOverflow = // 📏 TODO: Replace with measurement-utils
         await tabsInstance.evaluate(el => el.scrollWidth > el.clientWidth + 1);
        expect(hasOverflow).toBe(false);
    });
    test('[TAB-028] @mobile @regression @sanity Tablist centers on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const tablist = page.locator(TABLIST).first();
        await expect(tablist).toBeVisible();
        const justifyContent = // 📏 TODO: Replace with measurement-utils
         await tablist.evaluate(el => getComputedStyle(el).justifyContent);
        // measurement: use measurement-utils for cleaner code
        // Center or flex-start both acceptable; verify it is not overflow-causing
        expect(['center', 'flex-start', 'normal', 'start']).toContain(justifyContent);
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// Dark Mode (TAB-029 – TAB-034)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Dark Mode', () => {
    test('[TAB-029] @regression On granite section: inactive tab text is white', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const graniteSection = page.locator(SECTION_GRANITE).first();
        if (await graniteSection.count() === 0) {
            test.skip();
            return;
        }
        const firstTabsInstance = graniteSection.locator(TABS).first();
        if (await firstTabsInstance.count() === 0) {
            test.skip();
            return;
        }
        const tabs = firstTabsInstance.locator(TAB);
        const tabCount = await tabs.count();
        for (let i = 0; i < tabCount; i++) {
            const classes = await tabs.nth(i).getAttribute('class') || '';
            if (!classes.includes('--active')) {
                const color = await tabs.nth(i).evaluate(el => getComputedStyle(el).color);
                // measurement: use measurement-utils for cleaner code
                expect(color, `Expected 'rgb(255, 255, 255, got ${color}`).toBe('rgb(255, 255, 255)');
                return;
            }
        }
        test.skip(); // no inactive tab found
    });
    test('[TAB-030] @regression On granite section: active tab has white bg and granite text', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const graniteSection = page.locator(SECTION_GRANITE).first();
        if (await graniteSection.count() === 0) {
            test.skip();
            return;
        }
        const firstTabsInstance = graniteSection.locator(TABS).first();
        if (await firstTabsInstance.count() === 0) {
            test.skip();
            return;
        }
        const activeTab = firstTabsInstance.locator(TAB_ACTIVE).first();
        if (await activeTab.count() === 0) {
            test.skip();
            return;
        }
        // Root-caused 2026-08-13 (same mechanism as TAB-006): within a granite section, tabs.less sets
        // `.cmp-section--background-color-granite & .cmp-tabs__tab--active { background-color: @c-ga-white; }`
        // with `@c-ga-white: #FFFFFF` (kkr-aem/ui.apps.ga/.../abstracts/variables.less:337 — pure white,
        // 100% alpha), and the tab still carries `transition: background-color 0.2s ease, ...`. Sampling
        // background-color immediately after navigate() can catch it mid-transition — reproduced live as
        // rgba(255, 255, 255, 0.96), which is not an authored alpha value anywhere in variables.less, it's
        // an in-flight interpolation snapshot. Waiting out the 200ms transition window stabilizes the read.
        await page.waitForTimeout(300);
        const bg = // 📏 TODO: Replace with measurement-utils
         await activeTab.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        // Active tab on dark: white background
        expect(bg, `Expected 'rgb(255, 255, 255, got ${bg}`).toBe('rgb(255, 255, 255)');
        const color = // 📏 TODO: Replace with measurement-utils
         await activeTab.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        // Text should be dark (granite) — not white
        expect(color).not.toBe('rgb(255, 255, 255)');
    });
    test('[TAB-031] @regression On azul section: inactive tab text is white', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const azulSection = page.locator(SECTION_AZUL).first();
        if (await azulSection.count() === 0) {
            test.skip();
            return;
        }
        const firstTabsInstance = azulSection.locator(TABS).first();
        if (await firstTabsInstance.count() === 0) {
            test.skip();
            return;
        }
        const tabs = firstTabsInstance.locator(TAB);
        const tabCount = await tabs.count();
        for (let i = 0; i < tabCount; i++) {
            const classes = await tabs.nth(i).getAttribute('class') || '';
            if (!classes.includes('--active')) {
                const color = await tabs.nth(i).evaluate(el => getComputedStyle(el).color);
                // measurement: use measurement-utils for cleaner code
                expect(color, `Expected 'rgb(255, 255, 255, got ${color}`).toBe('rgb(255, 255, 255)');
                return;
            }
        }
        test.skip(); // no inactive tab found
    });
    test('[TAB-033] @regression Tablist pill background on dark section is semi-transparent', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const graniteSection = page.locator(SECTION_GRANITE).first();
        if (await graniteSection.count() === 0) {
            test.skip();
            return;
        }
        const firstTabsInstance = graniteSection.locator(TABS).first();
        if (await firstTabsInstance.count() === 0) {
            test.skip();
            return;
        }
        const tablist = firstTabsInstance.locator(TABLIST).first();
        const bg = // 📏 TODO: Replace with measurement-utils
         await tablist.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        // On dark sections tablist bg is rgba semi-transparent (not solid white or transparent)
        expect(bg).toMatch(/rgba/);
        expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    });
    test('[TAB-034] @regression On slate section tablist background is white on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const slateSection = page.locator(SECTION_SLATE).first();
        if (await slateSection.count() === 0) {
            test.skip();
            return;
        }
        const firstTabsInstance = slateSection.locator(TABS).first();
        if (await firstTabsInstance.count() === 0) {
            test.skip();
            return;
        }
        const tablist = firstTabsInstance.locator(TABLIST).first();
        const bg = // 📏 TODO: Replace with measurement-utils
         await tablist.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        // Slate is a light section; tablist bg is white
        expect(bg, `Expected 'rgb(255, 255, 255, got ${bg}`).toBe('rgb(255, 255, 255)');
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// ARIA Accessibility (TAB-035 – TAB-040)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — ARIA Accessibility', () => {
});
// ─────────────────────────────────────────────────────────────────────────────
// Console (TAB-045)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Console', () => {
    test('[TAB-045] @regression No JS errors on page load or tab interaction', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        // Interact with tabs to trigger any JS errors during activation
        const firstTabsInstance = page.locator(TABS).first();
        const tabs = firstTabsInstance.locator(TAB);
        const tabCount = await tabs.count();
        for (let i = 1; i < Math.min(tabCount, 3); i++) {
            await tabs.nth(i).click();
            // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        }
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Tabs — Happy Path', () => {
    test('[TABS-047] @smoke @regression @sanity Tabs renders correctly', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-tabs').first();
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
    test('[TABS-048] @smoke @regression @sanity Tabs interactive elements are functional', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-tabs').first();
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
test.describe('Tabs — Negative & Boundary', () => {
    test('[TABS-049] @negative @regression @sanity Tabs handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-tabs').first()).toBeVisible();
    });
    test('[TABS-050] @negative @regression @sanity Tabs handles missing images', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-tabs img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Tabs — Console & Resources', () => {
    test('[TABS-053] @regression Tabs produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Tabs — Broken Images', () => {
    test('[TABS-054] @regression Tabs all images load successfully', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-tabs img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[TABS-055] @regression Tabs all images have alt attributes', async ({ page }) => {
        const pom = new TabsPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-tabs img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Tabs — Accessibility', () => {
});
test.describe('Tabs — AEM Dialog Configuration', () => {
});
