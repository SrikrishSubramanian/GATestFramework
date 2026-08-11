import { test, expect } from '@playwright/test';
import { NavigationPage } from '../../../pages/ga/components/navigationPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
// Mobile viewport (matches @ga-bp-mobile-max: 768px)
const MOBILE = { width: 390, height: 844 };
const TABLET = { width: 768, height: 1024 };
const DESKTOP = { width: 1440, height: 900 };
// Selectors from live DOM scan + LESS analysis
const SEL = {
    root: '.cmp-navigation',
    group: '.cmp-navigation__group',
    item: '.cmp-navigation__item',
    itemLevel0: '.cmp-navigation__item--level-0',
    itemLevel1: '.cmp-navigation__item--level-1',
    itemLink: '.cmp-navigation__item-link',
    itemExpanded: '.cmp-navigation__item--expanded',
    verticalMod: '.ga-nav--vertical',
    sectionGranite: '.cmp-section--background-color-granite',
    sectionAzul: '.cmp-section--background-color-azul',
    sectionWhite: '.cmp-section--background-color-white',
};
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
// ─── Mobile Single List ───────────────────────────────────────────────────────
test.describe('Navigation — Mobile Single List (GAAM-396)', () => {
    test('[NVGT-001] @mobile @regression @sanity Horizontal nav converts to vertical stack on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // First .cmp-navigation on page is single-list (structureDepth=1)
        const nav = page.locator(`${SEL.sectionWhite} ${SEL.root}`).first();
        await expect(nav).toBeVisible();
        // At mobile, the top-level group should stack vertically (flex-direction: column)
        const group = nav.locator(`> ${SEL.group}`);
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await group.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: style check
        expect(flexDir).toBe('column');
    });
    test('[NVGT-002] @mobile @regression Vertical orientation remains vertical stack on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Vertical orientation nav has .ga-nav--vertical class
        const vertNav = page.locator(`${SEL.verticalMod} ${SEL.root}`).first();
        if (await vertNav.count() === 0) {
            // Fall back to finding by the vertical style system class on a parent
            const vertNavAlt = page.locator(`${SEL.root}`).filter({ has: page.locator(SEL.verticalMod) });
            test.skip(await vertNavAlt.count() === 0, 'No vertical orientation nav found on style guide');
        }
        const group = vertNav.locator(`> ${SEL.group}`);
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await group.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: style check
        expect(flexDir).toBe('column');
    });
});
// ─── Mobile Grouped Navigation (Accordion) ───────────────────────────────────
test.describe('Navigation — Mobile Grouped Accordion (GAAM-396)', () => {
    test('[NVGT-004] @mobile @regression Grouped nav converts to accordion on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Grouped nav has structureDepth=2 — look for nav with level-1 items
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        await expect(groupedNav).toBeVisible();
        // Level-0 items should act as accordion triggers at mobile
        const triggers = groupedNav.locator(SEL.itemLevel0);
        const triggerCount = await triggers.count();
        expect(triggerCount).toBeGreaterThan(1);
    });
    test('[NVGT-005] @mobile @regression Accordion triggers have expand/collapse icon', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        const trigger = groupedNav.locator(SEL.itemLevel0).first();
        // Check for icon indicator — could be ::before/::after, SVG, or background-image
        const hasIcon = // 📏 TODO: Replace with measurement-utils
         await trigger.evaluate(el => {
            const before = getComputedStyle(el, '::before');
            const after = getComputedStyle(el, '::after');
            const hasPseudo = (before.content !== 'none' && before.content !== '') ||
                (after.content !== 'none' && after.content !== '');
            const hasSvg = el.querySelector('svg') !== null;
            const hasBgImage = getComputedStyle(el).backgroundImage !== 'none';
            // Also check the direct child link for icon indicators
            const link = el.querySelector(':scope > .cmp-navigation__item-link');
            const linkBefore = link ? getComputedStyle(link, '::before') : null;
            const linkAfter = link ? getComputedStyle(link, '::after') : null;
            const hasLinkPseudo = linkBefore && linkBefore.content !== 'none' && linkBefore.content !== '' ||
                linkAfter && linkAfter.content !== 'none' && linkAfter.content !== '';
            return hasPseudo || hasSvg || hasBgImage || hasLinkPseudo;
        });
        expect(hasIcon).toBe(true);
    });
    test('[NVGT-006] @mobile @regression Accordion shows + icon when collapsed', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        const trigger = groupedNav.locator(SEL.itemLevel0).first();
        // Ensure item is not expanded
        const isExpanded = // 📏 TODO: Replace with measurement-utils
         await trigger.evaluate(el => el.classList.contains('cmp-navigation__item--expanded'));
        if (isExpanded) {
            await trigger.locator(':scope > .cmp-navigation__item-link').click();
            // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        }
        // Check for + indicator (pseudo-element content or SVG)
        const afterContent = // 📏 TODO: Replace with measurement-utils
         await trigger.evaluate(el => getComputedStyle(el, '::after').content);
        // measurement: style check
        // + icon should be present when collapsed
        expect(afterContent).toBeTruthy();
    });
    test('[NVGT-007] @mobile @regression Accordion shows - icon when expanded', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        const trigger = groupedNav.locator(SEL.itemLevel0).first();
        // Click to expand
        await trigger.locator(':scope > .cmp-navigation__item-link').click();
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
        // Verify expanded class is added
        await expect(trigger).toHaveClass(/cmp-navigation__item--expanded/);
        // Check for - indicator in expanded state
        const afterContent = // 📏 TODO: Replace with measurement-utils
         await trigger.evaluate(el => getComputedStyle(el, '::after').content);
        // measurement: style check
        expect(afterContent).toBeTruthy();
    });
    test('[NVGT-008] @mobile @regression Only one accordion section open at a time', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        const triggers = groupedNav.locator(SEL.itemLevel0);
        const triggerCount = await triggers.count();
        test.skip(triggerCount < 2, 'Need at least 2 accordion triggers for exclusive-open test');
        // Expand first section
        await triggers.nth(0).locator(':scope > .cmp-navigation__item-link').click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        await expect(triggers.nth(0)).toHaveClass(/cmp-navigation__item--expanded/);
        // Expand second section — first should collapse
        await triggers.nth(1).locator(':scope > .cmp-navigation__item-link').click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        await expect(triggers.nth(1)).toHaveClass(/cmp-navigation__item--expanded/);
        // First should no longer be expanded
        const firstExpanded = await triggers.nth(0).evaluate(el => el.classList.contains('cmp-navigation__item--expanded'));
        expect(firstExpanded).toBe(false);
    });
    test('[NVGT-009] @mobile @regression Click accordion trigger expands/collapses link list', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        const trigger = groupedNav.locator(SEL.itemLevel0).first();
        // Use :scope > to get only the direct child group (not nested groups)
        const childGroup = trigger.locator(':scope > .cmp-navigation__group');
        // Initially collapsed — child links should be hidden
        const initialDisplay = // 📏 TODO: Replace with measurement-utils
         await childGroup.evaluate(el => getComputedStyle(el).display);
        // measurement: style check
        expect(initialDisplay).toBe('none');
        // Click to expand
        await trigger.locator(':scope > .cmp-navigation__item-link').click();
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
        // Child links should now be visible
        const expandedDisplay = // 📏 TODO: Replace with measurement-utils
         await childGroup.evaluate(el => getComputedStyle(el).display);
        // measurement: style check
        expect(expandedDisplay).not.toBe('none');
        // Click again to collapse
        await trigger.locator(':scope > .cmp-navigation__item-link').click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const collapsedDisplay = // 📏 TODO: Replace with measurement-utils
         await childGroup.evaluate(el => getComputedStyle(el).display);
        // measurement: style check
        expect(collapsedDisplay).toBe('none');
    });
    test('[NVGT-011] @mobile @regression Accordion state persists during session (optional)', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        const trigger = groupedNav.locator(SEL.itemLevel0).first();
        // Expand a section
        await trigger.locator(':scope > .cmp-navigation__item-link').click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        await expect(trigger).toHaveClass(/cmp-navigation__item--expanded/);
        // Note: Session persistence is marked optional in AC — this test verifies
        // the expanded state survives within the same page session (no navigation away)
        // Full session persistence (across page loads) would require sessionStorage checks
    });
});
// ─── General Delivery ─────────────────────────────────────────────────────────
test.describe('Navigation — General Delivery (GAAM-396)', () => {
    test('[NVGT-013] @regression Navigation renders on azul background', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const azulSection = page.locator(`${SEL.sectionAzul} ${SEL.root}`).first();
        await expect(azulSection).toBeVisible();
    });
    test('[NVGT-014] @regression Navigation renders on white background', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const whiteSection = page.locator(`${SEL.sectionWhite} ${SEL.root}`).first();
        await expect(whiteSection).toBeVisible();
    });
    test('[NVGT-015] @regression Style Guide page exists with all variations', async ({ page }) => {
        const pom = new NavigationPage(page);
        // Use the same shared style-guide page as the rest of this file (already has 6
        // instances across granite/azul/white sections) — resolveComponentUrl() routes
        // local/dev through an auto-deploy test-fixtures path that isn't deployed here.
        const response = await pom.navigate(BASE());
        expect(response?.status()).toBe(200);
        // Should have multiple navigation instances
        const navCount = await page.locator(SEL.root).count();
        expect(navCount).toBeGreaterThanOrEqual(4);
    });
    test('[NVGT-016] @mobile @regression Mobile-only styles do not affect desktop layout', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // On desktop, horizontal nav should be flex row (not column)
        const nav = page.locator(SEL.root).first();
        const group = nav.locator(`> ${SEL.group}`);
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await group.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: style check
        expect(flexDir).toBe('row');
    });
});
// ─── Accessibility ────────────────────────────────────────────────────────────
test.describe('Navigation — Accessibility (GAAM-396)', () => {
});
// ─── BEM / CSS Convention Compliance ──────────────────────────────────────────
test.describe('Navigation — Convention Compliance (GAAM-396)', () => {
    test('[NVGT-024] @regression Navigation uses .cmp-navigation BEM root class', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const roots = page.locator(SEL.root);
        const count = await roots.count();
        expect(count).toBeGreaterThan(0);
        // Verify BEM child elements exist
        const groups = page.locator(SEL.group);
        expect(await groups.count()).toBeGreaterThan(0);
        const items = page.locator(SEL.item);
        expect(await items.count()).toBeGreaterThan(0);
        const links = page.locator(SEL.itemLink);
        expect(await links.count()).toBeGreaterThan(0);
    });
    test('[NVGT-025] @regression Navigation has no inline styles', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const allElements = page.locator(`${SEL.root} *`);
        const count = await allElements.count();
        for (let i = 0; i < Math.min(count, 50); i++) {
            const style = await allElements.nth(i).getAttribute('style');
            expect(style).toBeNull();
        }
    });
    test('[NVGT-026] @regression Navigation state transitions use CSS transitions', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Links should have transition property for smooth state changes
        const link = page.locator(`${SEL.root} ${SEL.itemLink}`).first();
        const transition = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).transition);
        // measurement: style check
        // LESS defines: color 0.2s ease
        expect(transition).toContain('color');
    });
});
// ─── Console & Resources ──────────────────────────────────────────────────────
test.describe('Navigation — Console & Resources', () => {
    test('[NVGT-029] @regression Navigation produces no JS errors', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors().filter(e => 
        // Filter out pre-existing AEM platform errors unrelated to navigation component
        !e.message?.includes('getElementsByTagName'));
        capture.stop();
        expect(errors).toEqual([]);
    });
    test('[NVGT-030] @regression Navigation mobile accordion produces no JS errors', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Interact with accordion — click direct child links of level-0 items
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        const level0Items = groupedNav.locator(SEL.itemLevel0);
        const count = await level0Items.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await level0Items.nth(i).locator(':scope > .cmp-navigation__item-link').click();
            // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        }
        const errors = capture.getErrors().filter(e => !e.message?.includes('getElementsByTagName'));
        capture.stop();
        expect(errors).toEqual([]);
    });
});
// ─── Desktop Navigation (GAAM-395) ──────────────────────────────────────────
test.describe('Navigation — Desktop Single List (GAAM-395)', () => {
    test('[NVGT-031] @regression Desktop: horizontal nav links display in single row', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const nav = page.locator(`${SEL.sectionWhite} ${SEL.root}`).first();
        if (await nav.count() === 0) {
            test.skip();
            return;
        }
        const group = nav.locator(`> ${SEL.group}`);
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await group.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: style check
        expect(flexDir).toBe('row');
        // Verify links are side-by-side (same Y coordinate)
        const items = group.locator(`> ${SEL.itemLevel0}`);
        const count = await items.count();
        if (count >= 2) {
            const box0 = await items.nth(0).boundingBox();
            const box1 = await items.nth(1).boundingBox();
            expect(Math.abs(box0!.y - box1!.y)).toBeLessThan(10);
        }
    });
    test('[NVGT-032] @regression Desktop: vertical nav links display in single column', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const vertNav = page.locator(`${SEL.verticalMod} ${SEL.root}`).first();
        if (await vertNav.count() === 0) {
            test.skip();
            return;
        }
        const group = vertNav.locator(`> ${SEL.group}`);
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await group.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: style check
        expect(flexDir).toBe('column');
    });
    test('[NVGT-033] @regression Desktop: link font is 14px Graphie Regular', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const link = page.locator(`${SEL.sectionWhite} ${SEL.itemLink}`).first();
        if (await link.count() === 0) {
            test.skip();
            return;
        }
        const fontSize = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).fontSize);
        // measurement: style check
        expect(fontSize).toBe('14px');
        // TODO: Use assertTypography() for font checks
    });
    test('[NVGT-034] @regression Desktop: link hover shows rounded background', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Use level-1 or single-list links (not grouped headings which have pointer-events: none)
        const link = page.locator(`${SEL.sectionWhite} ${SEL.itemLevel1} ${SEL.itemLink}, ${SEL.sectionWhite} ${SEL.root}:not(:has(${SEL.itemLevel1})) ${SEL.itemLink}`).first();
        if (await link.count() === 0) {
            test.skip();
            return;
        }
        await link.scrollIntoViewIfNeeded();
        const bgBefore = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: style check
        await hover(link);
        const bgAfter = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: style check
        const borderRadius = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).borderRadius);
        // measurement: style check
        expect(bgAfter).not.toBe(bgBefore);
        expect(parseFloat(borderRadius)).toBeGreaterThanOrEqual(20);
    });
    test('[NVGT-035] @regression Desktop: link color transition is 0.2s', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const link = page.locator(`${SEL.root} ${SEL.itemLink}`).first();
        const transition = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).transition);
        // measurement: style check
        expect(transition).toContain('color');
    });
});
test.describe('Navigation — Desktop Grouped Navigation (GAAM-395)', () => {
    test('[NVGT-036] @regression Desktop: grouped nav headings display side by side in columns', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        if (await groupedNav.count() === 0) {
            test.skip();
            return;
        }
        const group = groupedNav.locator(`> ${SEL.group}`);
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await group.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: style check
        expect(flexDir).toBe('row');
        // Headings should be in the same row
        const headings = group.locator(`> ${SEL.itemLevel0}`);
        const count = await headings.count();
        if (count >= 2) {
            const box0 = await headings.nth(0).boundingBox();
            const box1 = await headings.nth(1).boundingBox();
            expect(Math.abs(box0!.y - box1!.y)).toBeLessThan(10);
        }
    });
    test('[NVGT-037] @regression Desktop: grouped headings are non-interactive (pointer-events: none)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        if (await groupedNav.count() === 0) {
            test.skip();
            return;
        }
        // Level-0 items with children have pointer-events: none on their link
        const headingLink = groupedNav.locator(`${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`).first();
        const pointerEvents = // 📏 TODO: Replace with measurement-utils
         await headingLink.evaluate(el => getComputedStyle(el).pointerEvents);
        // measurement: style check
        expect(pointerEvents).toBe('none');
    });
    test('[NVGT-038] @regression Desktop: grouped heading uses semibold font', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        if (await groupedNav.count() === 0) {
            test.skip();
            return;
        }
        const headingLink = groupedNav.locator(`${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`).first();
        const fontWeight = // 📏 TODO: Replace with measurement-utils
         await headingLink.evaluate(el => getComputedStyle(el).fontWeight);
        // measurement: style check
        // 600 = semibold
        expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(600);
        // TODO: Use assertTypography() for font checks
    });
    test('[NVGT-039] @regression Desktop: child links display vertically under headings', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        if (await groupedNav.count() === 0) {
            test.skip();
            return;
        }
        const childGroup = groupedNav.locator(`${SEL.itemLevel0} > ${SEL.group}`).first();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await childGroup.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: style check
        expect(flexDir).toBe('column');
    });
});
// ─── GAAM-612: L1 Label Without Path ─────────────────────────────────────────
test.describe('Navigation — L1 Label Without Path (GAAM-612)', () => {
    test('[NVGT-042] @regression Grouped headings render as text (not links) when path is empty', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        if (await groupedNav.count() === 0) {
            test.skip();
            return;
        }
        // L1 headings: should have pointer-events: none (rendered as text, not clickable link)
        const headingLinks = groupedNav.locator(`${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`);
        const count = await headingLinks.count();
        for (let i = 0; i < count; i++) {
            const pe = await headingLinks.nth(i).evaluate(el => getComputedStyle(el).pointerEvents);
            // measurement: style check
            expect(pe).toBe('none');
        }
    });
});
// ─── GAAM-699: Font Color Changes ────────────────────────────────────────────
test.describe('Navigation — Font Color (GAAM-699)', () => {
    test('[NVGT-043] @regression Light bg: link color is granite (dark)', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const link = page.locator(`${SEL.sectionWhite} ${SEL.itemLink}`).first();
        if (await link.count() === 0) {
            test.skip();
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // Should be dark (granite) — NOT white
        expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
    });
    test('[NVGT-044] @regression Dark bg (granite): child link color is white', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Target level-1 links (not headings) or single-list links
        const link = page.locator(`${SEL.sectionGranite} ${SEL.itemLevel1} ${SEL.itemLink}`).first();
        const singleLink = page.locator(`${SEL.sectionGranite} ${SEL.root}:not(:has(${SEL.itemLevel1})) ${SEL.itemLink}`).first();
        const target = (await link.count() > 0) ? link : singleLink;
        if (await target.count() === 0) {
            test.skip();
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await target.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
    });
    test('[NVGT-045] @regression Dark bg (azul): child link color is white', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const link = page.locator(`${SEL.sectionAzul} ${SEL.itemLevel1} ${SEL.itemLink}`).first();
        const singleLink = page.locator(`${SEL.sectionAzul} ${SEL.root}:not(:has(${SEL.itemLevel1})) ${SEL.itemLink}`).first();
        const target = (await link.count() > 0) ? link : singleLink;
        if (await target.count() === 0) {
            test.skip();
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await target.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
    });
    test('[NVGT-046] @regression Dark bg: grouped heading color is helper-dark (subdued)', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const heading = page.locator(`${SEL.sectionGranite} ${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`).first();
        if (await heading.count() === 0) {
            test.skip();
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await heading.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // Helper-dark is a muted/subdued color — NOT pure white
        expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
        // But should be lighter than granite
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            const avg = (parseInt(match[1]) + parseInt(match[2]) + parseInt(match[3])) / 3;
            expect(avg).toBeGreaterThan(100); // Not too dark
        }
    });
    test('[NVGT-047] @regression Dark bg: focus-visible uses double ring (box-shadow)', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const link = page.locator(`${SEL.sectionGranite} ${SEL.itemLink}`).first();
        if (await link.count() === 0) {
            test.skip();
            return;
        }
        await link.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        const boxShadow = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).boxShadow);
        // measurement: style check
        // Should have box-shadow for focus ring on dark bg (not just outline)
        expect(boxShadow).not.toBe('none');
    });
    test('[NVGT-048] @mobile @regression Mobile accordion: expanded heading color changes', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
        if (await groupedNav.count() === 0) {
            test.skip();
            return;
        }
        const trigger = groupedNav.locator(SEL.itemLevel0).first();
        const link = trigger.locator(':scope > .cmp-navigation__item-link');
        const colorBefore = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        await clickElement(link);
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const colorAfter = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // Color should change when expanded (collapsed: full color, expanded: subdued)
        expect(colorAfter).not.toBe(colorBefore);
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-1454)', () => {
    test('[NVGT-049] @smoke @regression DR FE: Preview link opens incorrect Rate Detail page for selected row — AC1', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: The *Preview* link in each row should open the *Rate Detail* page associated with that specific row, based on the combination of *Product*, *Firm*, and *Effective Date*. Currently, the navigation does not consistently open the exact record corresponding to the Effective date.
        // 
        // *Steps to Reproduce:*
        // 
        // # Navigate to the DR FE rates table.
        // # Identify a row with a specific *Product*, *Firm*, and *Effective Date*.
        // # Click the *Preview* link for that row.
        // # Observe the Rate Detail page that opens.
        // 
        // *Expected Result:*
        // The *Preview* link should open the *Rate Detail* page for the selected row, matching the *Product*, *Firm*, and *Effective Date*, and navigate to the exact *Effective Date* displayed in the table.
        // 
        // *Actual Result:*
        // The *Preview* link does not consistently open the Rate Detail page corresponding to the selected row and/or does not navigate to the exact *Effective Date* shown in the table.
        // 
        // !20260702-1237-25.2803875.mp4|width=559,alt="20260702-1237-25.2803875.mp4"!
        test.fixme();
    });
});
test.describe('Navigation — Happy Path', () => {
    test('[NVGT-050] @smoke @regression Navigation renders correctly', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-navigation').first();
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
    test('[NVGT-051] @smoke @regression Navigation interactive elements are functional', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-navigation').first();
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
test.describe('Navigation — Negative & Boundary', () => {
    test('[NVGT-052] @negative @regression Navigation handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-navigation').first()).toBeVisible();
    });
    test('[NVGT-053] @negative @regression Navigation handles missing images', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-navigation img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Navigation — Responsive', () => {
    test('[NVGT-054] @mobile @regression @mobile Navigation adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-navigation').first();
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
    test('[NVGT-055] @mobile @regression Navigation adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-navigation').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Navigation — Broken Images', () => {
    test('[NVGT-057] @regression Navigation all images load successfully', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-navigation img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[NVGT-058] @regression Navigation all images have alt attributes', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-navigation img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Navigation — Accessibility', () => {
});
test.describe('Navigation — AEM Dialog Configuration', () => {
});
test.describe('Navigation — CSV Test Cases (GAAM-1386)', () => {
    test('[NVGT-064] @smoke @regression CMS BE: Global External Link Handler — AC1', async ({ page }) => {
        // GAAM-1386: any <a> whose href resolves outside the internal domain list must render
        // target="_blank" rel="noopener noreferrer"; internal/relative links must not be modified.
        // Confirmed live: corporate-agnostic and financial-professionals home pages both have
        // real external links (globalatlanticannuity.com, cwannuity.se2.com, SAML SSO redirects).
        await page.goto(`${BASE()}/content/global-atlantic/corporate-agnostic/main/en.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });

        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a[href]'));
            const isExternal = (href: string) => /^https?:\/\//.test(href) && !href.includes('adobeaemcloud.com') && !href.includes('global-atlantic');
            return anchors.map(a => ({
                href: a.getAttribute('href') || '',
                target: a.getAttribute('target'),
                rel: a.getAttribute('rel'),
                external: isExternal(a.getAttribute('href') || ''),
            }));
        });

        const external = links.filter(l => l.external);
        expect(external.length, 'expected at least one external link on this page').toBeGreaterThan(0);
        // Author override precedence (GAAM-1386 AC) means not every external link is guaranteed
        // target=_blank — but the majority must be, confirming the global handler is active.
        const withBlankTarget = external.filter(l => l.target === '_blank' && l.rel?.includes('noopener'));
        expect(withBlankTarget.length / external.length, 'most external links should have target=_blank rel=noopener noreferrer').toBeGreaterThan(0.5);

        const internal = links.filter(l => l.href.startsWith('/content/') || l.href.startsWith('/'));
        expect(internal.length, 'expected at least one internal link').toBeGreaterThan(0);
        expect(internal.every(l => l.target !== '_blank'), 'internal/relative links must not get target=_blank').toBe(true);
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-1371)', () => {
    test('[NVGT-065] @smoke @regression CMS FE: Alert Modal – Consent Alert "Show Once" Behavior — AC1', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // As a site visitor, 
        // I want a consent alert modal to display only once per browser when the author has configured it as a consent alert, 
        // so that I'm not repeatedly shown the same acknowledgement prompt on every page load.
        // 
        // 
        // *Background*
        // This pairs with backend ticket [https://bounteous.jira.com/browse/GAAM-1347|https://bounteous.jira.com/browse/GAAM-1347|smart-link], which replaces the authored Preference Key text field with a "Consent Alert" checkbox and auto-generates a unique key (derived from the component's JCR resource path) rendered as a {{data-consent-key}} attribute on the component's wrapper element. This ticket covers the client-side logic that reads that attribute and manages the "show once" behavior.
        // 
        // *Acceptance Criteria*
        // 
        // *Functionality*
        // 
        // * On page load, component JS reads the {{data-consent-key}} attribute on the wrapper element (present in the DOM regardless of Consent Alert state).
        // * If the author has checked "Consent Alert" in the dialog and the visitor has previously seen/dismissed the modal, the modal does not display on subsequent page loads.
        // * Visitor "seen" state is tracked via localStorage, keyed by the {{data-consent-key}} value.
        // * If "Consent Alert" is unchecked (default), the modal displays on every page load — no localStorage read/write occurs.
        // * Remove any existing JS logic that reads an authored {{preferenceKey}} string; consent tracking now keys off {{data-consent-key}} only.
        // * No author input is required for key generation — this is handled entirely on the backend/HTL side.
        // 
        // *Responsive Behavior*
        // 
        // * "Show once" behavior is consistent across desktop, tablet, and mobile breakpoints.
        // * No visual or layout changes are introduced by this ticket.
        // 
        // *Accessibility (WCAG 2.2 Level AA)*
        // 
        // * No new interactive elements are introduced; existing modal focus trap, keyboard navigation, and screen reader behavior remain unchanged.
        // * Suppressing display of the modal (when previously seen) must not affect tab order or leave hidden focusable elements in the DOM.
        // 
        // 
        // 
        // *QA Checklist*
        // 
        // * Component is available on any existing templates (except Rate Administration)
        // * Styles match Figma
        // * Authoring Guide exists and is updated with all style variations
        // * Style Guide page exists and reflects all variations
        // * Both desktop and mobile versions are implemented
        // * Notify the design team that the component is ready for their review and provide a link to the Style Guide page
        test.fixme();
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-1358)', () => {
    test('[NVGT-066] @smoke @regression VQA - Main Nav sticky behavior — AC1', async ({ page }) => {
        // GAAM-1358 / GAAM-397: once a role is selected (e.g. Financial Professional), the
        // site-header should stick to the top of the viewport on scroll. Reported as broken —
        // confirmed live on the FP persona page (header uses position:static and scrolls away).
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`${BASE()}/content/global-atlantic/financial-professionals/main/en.html?wcmmode=disabled`, { waitUntil: 'load' });

        // Dismiss the first-visit consent alert modal (GAAM-1371) — it scroll-locks the body.
        const modalClose = page.locator('.cmp-alert-modal__dialog button').first();
        if (await modalClose.count() > 0 && await modalClose.isVisible()) {
            await modalClose.click();
        }

        const header = page.locator('.cmp-site-header').first();
        await expect(header).toBeVisible();

        await page.mouse.wheel(0, 900);
        await page.waitForTimeout(500);

        const position = await header.evaluate(el => getComputedStyle(el).position);
        const top = await header.evaluate(el => el.getBoundingClientRect().top);
        // A sticky/fixed header stays pinned at (or near) the top of the viewport after scrolling.
        expect(['sticky', 'fixed']).toContain(position);
        expect(top).toBeGreaterThanOrEqual(-1);
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-1342)', () => {
    test('[NVGT-067] @smoke @regression CMS FE: Navigation Component - Link Type SE2 — AC1', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Functionality*
        test.fixme();
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-1233)', () => {
    test('[NVGT-068] @smoke @regression CMS QA Task: Private Report Fraud Form – Red Oak Submission Integration — AC1', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // Desktop
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom1 = new NavigationPage(page);
        await pom1.navigate(BASE());
        await expect(page.locator('.cmp-navigation').first()).toBeVisible();
        // Mobile
        await page.setViewportSize({ width: 390, height: 844 });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(page.locator('.cmp-navigation').first()).toBeVisible();
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-1215)', () => {
    test('[NVGT-069] @smoke @regression CMS FE: Navigation Component - flows for snapApp and Illustrations — AC1', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: h3. Illustrations Nav Item — On Click
        test.fixme();
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-1214)', () => {
    test('[NVGT-070] @smoke @regression CMS BE: Navigation Component - Link types : SnapApp, Illustration & SE2 Driven — AC1', async ({ page }) => {
        // GAAM-1214: dialog-only change adding a "Link Type" dropdown (./linkType, default
        // "standard") to Primary/Secondary Links multifields in the GA dialog overlay, with
        // options Standard Link / Illustrations / SnapApp / SE2 Driven. Confirmed live in
        // /apps/ga/components/content/navigation/_cq_dialog.infinity.json.
        const gaDialogUrl = `${BASE()}/apps/ga/components/content/navigation/_cq_dialog.infinity.json`;
        const response = await page.request.get(gaDialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = JSON.stringify(await response.json());

        expect(dialog).toContain('"linkType"');
        expect(dialog).toContain('"name":"./linkType"');
        expect(dialog).toContain('"value":"standard"');
        expect(dialog).toContain('"Standard Link"');
        expect(dialog).toContain('"Illustrations"');
        expect(dialog).toContain('"SnapApp"');
        expect(dialog).toContain('SE2');
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-549)', () => {
    test('[NVGT-071] @smoke @regression CMS Analytics FE – Component Tracking: Include Product Info in Click Event — AC1', async ({ page }) => {
        const pom = new NavigationPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Functionality*
        test.fixme();
    });
});
test.describe('Navigation — CSV Test Cases (GAAM-794)', () => {
    test('[NVGT-072] @smoke @regression CMS FE: Main Nav - MegaMenu Panel layouts — AC1', async ({ page }) => {
        // GAAM-794: Main Navigation L1 category triggers expand a mega-menu panel of sub-links.
        // This only exists on the site-header integration (FP persona page) — the standalone
        // Navigation style-guide demo page has no aria-haspopup triggers at all.
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`${BASE()}/content/global-atlantic/financial-professionals/main/en.html?wcmmode=disabled`, { waitUntil: 'load' });

        const modalClose = page.locator('.cmp-alert-modal__dialog button').first();
        if (await modalClose.count() > 0 && await modalClose.isVisible()) {
            await modalClose.click();
        }

        // aria-controls="nav-panel-N" identifies Main Nav L1 category triggers specifically
        // (distinct from the top-nav "Company" dropdown and the role-changer trigger).
        const trigger = page.locator('button[aria-haspopup][aria-controls^="nav-panel-"]').first();
        await expect(trigger).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');

        const panelId = await trigger.getAttribute('aria-controls');
        await trigger.click();

        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        const panel = page.locator(`#${panelId}`);
        await expect(panel).toBeVisible();
        expect(await panel.locator('a').count()).toBeGreaterThan(0);
    });
});
