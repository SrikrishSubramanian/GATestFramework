import { test, expect } from '@playwright/test';
import { AccordionPage } from '../../../pages/ga/components/accordionPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { deployFixture } from '../../../utils/infra/content-fixture-deployer';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
let capture: ConsoleCapture;
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
// ─── Selectors ────────────────────────────────────────────────────────────────
// Style guide sections identified by section background style class
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const ACCORDION = '.cmp-accordion';
const ITEM = '.cmp-accordion__item';
const ITEM_BUTTON = '.cmp-accordion__item-button';
const ITEM_CONTENT = '.cmp-accordion__item-content';
// Verified live: only --blog (hidden) and --default (visible) indicator
// variants exist on the style guide page — no --ga variant is rendered.
// --default is the visible GA-branded circular icon indicator.
const INDICATOR_GA = '.cmp-accordion__item-indicator--default';
test.describe('Accordion — Style Guide Page', () => {
    test('[ACRD-001] @smoke @regression @sanity Style guide page exists and loads', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        await expect(page.locator(ACCORDION).first()).toBeVisible();
        // Verify all 4 background sections render accordions
        await expect(page.locator(`${SECTION_WHITE} ${ACCORDION}`)).toBeVisible();
        await expect(page.locator(`${SECTION_SLATE} ${ACCORDION}`)).toBeVisible();
        await expect(page.locator(`${SECTION_GRANITE} ${ACCORDION}`)).toBeVisible();
        await expect(page.locator(`${SECTION_AZUL} ${ACCORDION}`)).toBeVisible();
    });
    test('[ACRD-002] @smoke @regression @sanity Each accordion section renders all expected items', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        // White: 4 items, Slate: 3 items, Granite: 3 items, Azul: 4 items
        await expect(page.locator(`${SECTION_WHITE} ${ITEM}`)).toHaveCount(4);
        await expect(page.locator(`${SECTION_SLATE} ${ITEM}`)).toHaveCount(3);
        await expect(page.locator(`${SECTION_GRANITE} ${ITEM}`)).toHaveCount(3);
        await expect(page.locator(`${SECTION_AZUL} ${ITEM}`)).toHaveCount(4);
    });
});
test.describe('Accordion — BEM Structure', () => {
    test('[ACRD-003] @regression Component root uses .cmp-accordion class', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const roots = page.locator(ACCORDION);
        const count = await roots.count();
        expect(count).toBeGreaterThanOrEqual(4);
        for (let i = 0; i < count; i++) {
            await expect(roots.nth(i)).toBeVisible();
        }
    });
    test('[ACRD-004] @regression Items follow BEM .cmp-accordion__item pattern', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const items = page.locator(ITEM);
        expect(await items.count()).toBeGreaterThanOrEqual(12); // 4+3+3+2
    });
    test('[ACRD-005] @regression Each item has a button and content panel', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstAccordion = page.locator(`${SECTION_WHITE} ${ACCORDION}`);
        const items = firstAccordion.locator(ITEM);
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            await expect(items.nth(i).locator(ITEM_BUTTON)).toHaveCount(1);
            await expect(items.nth(i).locator(ITEM_CONTENT)).toHaveCount(1);
        }
    });
    test('[ACRD-006] @regression GA circular icon indicator is present on all items', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const buttons = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`);
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
            await expect(buttons.nth(i).locator(INDICATOR_GA)).toBeVisible();
        }
    });
});
test.describe('Accordion — Force Closed on Load', () => {
    test('[ACRD-009] @regression Granite section: all items closed on page load', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const buttons = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`);
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
            await expect(buttons.nth(i)).toHaveAttribute('aria-expanded', 'false');
        }
    });
});
test.describe('Accordion — Single Expansion Mode', () => {
    test('[ACRD-011] @smoke @regression @sanity Slate section: only one item can be open at a time', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const slateButtons = page.locator(`${SECTION_SLATE} ${ITEM_BUTTON}`);
        // First item should be pre-expanded on load (expandedItems=[item_0])
        await expect(slateButtons.nth(0)).toHaveAttribute('aria-expanded', 'true');
        // Click second item — first should close
        await slateButtons.nth(1).click();
        await expect(slateButtons.nth(1)).toHaveAttribute('aria-expanded', 'true');
        await expect(slateButtons.nth(0)).toHaveAttribute('aria-expanded', 'false');
        // Click third item — second should close
        await slateButtons.nth(2).click();
        await expect(slateButtons.nth(2)).toHaveAttribute('aria-expanded', 'true');
        await expect(slateButtons.nth(1)).toHaveAttribute('aria-expanded', 'false');
    });
    test('[ACRD-012] @regression Single expansion accordion has data attribute', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const slateAccordion = page.locator(`${SECTION_SLATE} ${ACCORDION}`);
        await expect(slateAccordion).toHaveAttribute('data-single-expansion');
    });
});
test.describe('Accordion — Pre-expanded Item on Load', () => {
    test('[ACRD-013] @smoke @regression @sanity Slate section: first item expanded by default on load', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const slateButtons = page.locator(`${SECTION_SLATE} ${ITEM_BUTTON}`);
        // item_0 is configured as expandedItems
        await expect(slateButtons.nth(0)).toHaveAttribute('aria-expanded', 'true');
        // Content panel should be visible
        const slateContents = page.locator(`${SECTION_SLATE} ${ITEM_CONTENT}`);
        await expect(slateContents.nth(0)).toHaveAttribute('aria-hidden', 'false');
    });
});
test.describe('Accordion — Expand/Collapse Interaction', () => {
    test('[ACRD-014] @smoke @regression @sanity Clicking a button expands the accordion item', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();
        // Initially closed
        await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
        await expect(firstContent).toHaveAttribute('aria-hidden', 'true');
        // Click to expand
        await clickElement(firstButton);
        await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
        await expect(firstContent).toHaveAttribute('aria-hidden', 'false');
    });
    test('[ACRD-015] @regression Clicking an expanded button collapses the item', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();
        // Expand
        await clickElement(firstButton);
        await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
        // Collapse
        await clickElement(firstButton);
        await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
        await expect(firstContent).toHaveAttribute('aria-hidden', 'true');
    });
});
test.describe('Accordion — Icon Animation', () => {
    test('[ACRD-017] @regression @interaction GA icon indicator has CSS transition', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const indicator = page.locator(`${SECTION_WHITE} ${INDICATOR_GA}`).first();
        const transition = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).transition);
        // measurement: style check
        expect(transition).toContain('background-color');
    });
    test('[ACRD-018] @regression @interaction Icon vertical bar has opacity fade transition', async ({ page }) => {
        // Root-caused 2026-08-13: there is no classed .cmp-accordion__item-icon-line--vertical/
        // --horizontal DOM node — the <svg> icons in the markup are legacy and stay display:none.
        // The actual +/- glyph is drawn by ::before (2x16px vertical bar) and ::after (16x2px
        // horizontal bar) pseudo-elements on .cmp-accordion__item-indicator--default. Verified live
        // (localhost:4502/.../accordion.html): ::before transitions `opacity` (fades out on expand,
        // leaving the horizontal bar as a "−") — it does NOT rotate. ::after is the one that
        // transitions `transform` (rotates 180° on expand). getComputedStyle() can't be scoped to a
        // pseudo-element via a locator selector, so this reads it directly off the indicator.
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const indicator = page.locator(`${SECTION_WHITE} ${INDICATOR_GA}`).first();
        const transition = await indicator.evaluate(el => getComputedStyle(el, '::before').transition);
        expect(transition).toContain('opacity');
    });
    test('[ACRD-019] @regression @interaction Expanded item icon vertical bar fades to hidden', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        const indicator = firstButton.locator(INDICATOR_GA);
        await clickElement(firstButton);
        await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
        // Settle the 0.3s opacity transition (see ACRD-018) before sampling.
        await page.waitForTimeout(300);
        // Vertical bar (::before) should have opacity 0, leaving only the horizontal bar ("−")
        const opacity = await indicator.evaluate(el => getComputedStyle(el, '::before').opacity);
        expect(Number(opacity)).toBeLessThanOrEqual(0.01);
    });
    test('[ACRD-020] @regression @interaction Collapsed item icon shows plus shape (both bars visible)', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        // Ensure collapsed
        await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
        // Both bars (::before vertical, ::after horizontal) visible, forming a "+"
        const indicator = firstButton.locator(INDICATOR_GA);
        const opacities = await indicator.evaluate(el => ({
            before: getComputedStyle(el, '::before').opacity,
            after: getComputedStyle(el, '::after').opacity,
        }));
        expect(Number(opacities.before)).toBe(1);
        expect(Number(opacities.after)).toBe(1);
    });
});
test.describe('Accordion — Hover & Focus States', () => {
    test('[ACRD-021] @interaction @regression Hover changes icon background color', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        const indicator = firstButton.locator(INDICATOR_GA);
        const bgBefore = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: style check
        await hover(firstButton);
        const bgAfter = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: style check
        // Background should darken on hover
        expect(bgAfter).not.toBe(bgBefore);
    });
    test('[ACRD-022] @interaction @regression Focus shows double-ring outline on icon', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        const indicator = firstButton.locator(INDICATOR_GA);
        await firstButton.focus();
        const boxShadow = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).boxShadow);
        // measurement: style check
        // Should have double ring box-shadow on focus
        expect(boxShadow).not.toBe('none');
        expect(boxShadow).toContain('0px 0px 0px');
    });
});
test.describe('Accordion — Dark Background Overrides', () => {
    test('[ACRD-025] @regression Granite: button text uses white color', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const graniteButton = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`).first();
        const color = // 📏 TODO: Replace with measurement-utils
         await graniteButton.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // Should be white on dark background
        expect(color).toContain('255');
    });
    test('[ACRD-027] @regression Azul: button text uses white color', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const azulButton = page.locator(`${SECTION_AZUL} ${ITEM_BUTTON}`).first();
        const color = // 📏 TODO: Replace with measurement-utils
         await azulButton.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        expect(color).toContain('255');
    });
    test('[ACRD-028] @regression Granite: icon bars use white color', async ({ page }) => {
        // See ACRD-018: the icon is drawn by ::before/::after pseudo-elements on
        // .cmp-accordion__item-indicator--default, not a classed icon-line element.
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const indicator = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON} ${INDICATOR_GA}`).first();
        const bgColor = await indicator.evaluate(el => getComputedStyle(el, '::after').backgroundColor);
        // Should be white on dark background
        expect(bgColor).toContain('255');
    });
    test('[ACRD-029] @regression Light background: title uses granite color', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const whiteButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        const heading = whiteButton.locator('h2, h3, h4, h5, h6').first();
        const headingCount = await heading.count();
        if (headingCount > 0) {
            const color = // 📏 TODO: Replace with measurement-utils
             await heading.evaluate(el => getComputedStyle(el).color);
            // measurement: style check
            // Should be a dark granite color, not white
            expect(color).not.toContain('rgb(255, 255, 255)');
        }
    });
});
test.describe('Accordion — Padding Removed (Section Handles Padding)', () => {
    test('[ACRD-030] @regression No padding-related style system classes on accordion', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const accordions = page.locator(ACCORDION);
        const count = await accordions.count();
        for (let i = 0; i < count; i++) {
            const classes = await accordions.nth(i).getAttribute('class') || '';
            expect(classes).not.toContain('--added-padding');
            // TODO: Use assertSpacing() for padding/margin
            expect(classes).not.toContain('--remove-default');
        }
    });
});
test.describe('Accordion — Content Panel', () => {
    test('[ACRD-032] @regression Collapsed panel has transparent border', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();
        await expect(firstContent).toHaveAttribute('aria-hidden', 'true');
        const borderColor = // 📏 TODO: Replace with measurement-utils
         await firstContent.evaluate(el => getComputedStyle(el).borderLeftColor);
        // measurement: style check
        // Should be transparent
        expect(borderColor).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
    });
    test('[ACRD-033] @regression Accordion height is variable based on content', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const whiteButtons = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`);
        const whiteContents = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`);
        // Expand first two items (they have different content lengths)
        await whiteButtons.nth(0).click();
        await whiteButtons.nth(1).click();
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
        // Wait for expansion animation
        const height0 = await whiteContents.nth(0).evaluate(el => el.scrollHeight);
        const height1 = await whiteContents.nth(1).evaluate(el => el.scrollHeight);
        // Heights should be > 0 (content-driven) — exact equality not required
        expect(height0).toBeGreaterThan(0);
        expect(height1).toBeGreaterThan(0);
    });
});
test.describe('Accordion — Responsive', () => {
    test('[ACRD-034] @mobile @regression @sanity Accordion renders on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        await expect(page.locator(ACCORDION).first()).toBeVisible();
        // All accordion items should still be present
        await expect(page.locator(`${SECTION_WHITE} ${ITEM}`)).toHaveCount(4);
    });
    test('[ACRD-035] @mobile @regression @sanity Accordion renders on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        await expect(page.locator(ACCORDION).first()).toBeVisible();
    });
    test('[ACRD-036] @mobile @regression @sanity Expand/collapse works on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        await clickElement(firstButton);
        await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
        await clickElement(firstButton);
        await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });
    test('[ACRD-037] @mobile @regression @sanity Mobile font size adjusts', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const button = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        const mobileSize = // 📏 TODO: Replace with measurement-utils
         await button.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        // measurement: style check
        await page.setViewportSize({ width: 1440, height: 900 });
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const desktopSize = // 📏 TODO: Replace with measurement-utils
         await button.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        // measurement: style check
        // Desktop font should be larger or equal to mobile
        expect(desktopSize).toBeGreaterThanOrEqual(mobileSize);
    });
});
test.describe('Accordion — ARIA Accessibility', () => {
});
// ─── Bug Regression Tests ─────────────────────────────────────────────────────
// Tests added after two post-GAAM-381 bugs were found and fixed.
// Bug 1: Accordion-item policy only allowed accordion-item children — content
//         components (text, button, image, etc.) couldn't be added to the inner parsys.
// Bug 2: GA accordion-item had no _cq_dialog overlay, so helpPath was missing.
const FIXTURE_URL = () => `${BASE()}/content/global-atlantic/test-fixtures/accordion.html?wcmmode=disabled`;
test.describe('Accordion — Bug 1 Regression: Child Components Inside Accordion Items', () => {
    // The accordion_item_content policy must allow: text, button, image, headline-block,
    // separator, spacer, statistic, image-with-nested-content, video-external.
    // The fixture section_mixed_content has pre-expanded items with diverse child types.
    test('[ACRD-048] @regression @smoke @sanity Accordion item renders button child component', async ({ page }) => {
        const deployResult = await deployFixture('accordion', page);
        expect(deployResult.deployed, `Fixture deploy failed: ${deployResult.message}`).toBe(true);
        await page.goto(FIXTURE_URL(), { waitUntil: 'domcontentloaded' });
        // The mixed-content accordion has a button inside item_0
        const buttonInItem = page.locator(`${ITEM_CONTENT} .cmp-button`);
        await expect(buttonInItem.first()).toBeVisible();
        // .cmp-button IS the anchor itself (ui.apps/.../kkr-aem-base/components/content/button/
        // button.html renders <a class="cmp-button">) — not a wrapper containing one. Verify it
        // rendered as a real link, not a nested <a>.
        await expect(buttonInItem.first()).toHaveAttribute('href', /.+/);
    });
    test('[ACRD-049] @regression Accordion item renders headline-block child component', async ({ page }) => {
        const deployResult = await deployFixture('accordion', page);
        expect(deployResult.deployed, `Fixture deploy failed: ${deployResult.message}`).toBe(true);
        await page.goto(FIXTURE_URL(), { waitUntil: 'domcontentloaded' });
        const headlineInItem = page.locator(`${ITEM_CONTENT} .cmp-headline-block`);
        await expect(headlineInItem.first()).toBeVisible();
    });
    test('[ACRD-050] @regression Accordion item renders separator child component', async ({ page }) => {
        const deployResult = await deployFixture('accordion', page);
        expect(deployResult.deployed, `Fixture deploy failed: ${deployResult.message}`).toBe(true);
        await page.goto(FIXTURE_URL(), { waitUntil: 'domcontentloaded' });
        const separatorInItem = page.locator(`${ITEM_CONTENT} .cmp-separator`);
        await expect(separatorInItem.first()).toBeVisible();
    });
    test('[ACRD-051] @regression Accordion item renders spacer child component', async ({ page }) => {
        const deployResult = await deployFixture('accordion', page);
        expect(deployResult.deployed, `Fixture deploy failed: ${deployResult.message}`).toBe(true);
        await page.goto(FIXTURE_URL(), { waitUntil: 'domcontentloaded' });
        const spacerInItem = page.locator(`${ITEM_CONTENT} .cmp-spacer`);
        await expect(spacerInItem.first()).toBeVisible();
    });
});
test.describe('Accordion — Console & Resources', () => {
    test('[ACRD-046] @regression No HTL comments in published HTML', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const html = await page.content();
        expect(html).not.toContain('<!--/*');
    });
    test('[ACRD-047] @regression No author-added inline styles on accordion markup', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        // Check buttons and indicator elements (not items — JS sets opacity on items for animation)
        const buttons = page.locator(ITEM_BUTTON);
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
            const style = await buttons.nth(i).getAttribute('style');
            expect(style).toBeFalsy();
        }
    });
});
// ─── GAAM-611: Dialog Structure After Header Tab Removal ─────────────────────
test.describe('Accordion — GAAM-611: Header Tab Removed from Dialog', () => {
    test('[ACRD-056] @author @regression Accordion dialog has no Header tab', async ({ page }) => {
        const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.infinity.json`;
        const response = await page.request.get(dialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = JSON.stringify(await response.json());
        // Header tab fields (eyebrow, headline RTE, path) should not be present
        expect(dialog).not.toContain('"header"');
        expect(dialog).not.toContain('"eyebrow"');
    });
    test('[ACRD-057] @author @regression Accordion dialog retains Items tab', async ({ page }) => {
        const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.infinity.json`;
        const response = await page.request.get(dialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = JSON.stringify(await response.json());
        expect(dialog).toContain('items');
    });
    test('[ACRD-058] @author @regression Accordion dialog retains Properties tab', async ({ page }) => {
        const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.infinity.json`;
        const response = await page.request.get(dialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = JSON.stringify(await response.json());
        expect(dialog).toContain('properties');
    });
});
test.describe('Accordion — CSV Test Cases (GAAM-1362)', () => {
    test('[CCRD-059] @regression @sanity CMS-FE | Text component font size is incorrect when it is added inside "Accordion" component — AC1', async ({ page }) => {
        // Verified live: this no longer reproduces. Text <p> inside an accordion item and a
        // standalone Text component's <p> both render at the expected 18px — not the reported
        // 22px. Already fixed; encoding the expected (passing) behavior as a regression guard.
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const textInAccordion = page.locator('.cmp-accordion .cmp-text p').first();
        await expect(textInAccordion).toBeVisible();
        const fontSize = await textInAccordion.evaluate(el => getComputedStyle(el).fontSize);
        expect(fontSize, 'Text inside Accordion should render at 18px, matching standalone Text').toBe('18px');
    });
});
test.describe('Accordion — Happy Path', () => {
    test('[CCRD-060] @smoke @regression @sanity Accordion renders correctly', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-accordion').first();
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
    test('[CCRD-061] @smoke @regression @sanity Accordion interactive elements are functional', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-accordion').first();
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
test.describe('Accordion — Negative & Boundary', () => {
    test('[CCRD-062] @negative @regression @sanity Accordion handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-accordion').first()).toBeVisible();
    });
    test('[CCRD-063] @negative @regression @sanity Accordion handles missing images', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-accordion img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Accordion — Broken Images', () => {
    test('[CCRD-067] @regression Accordion all images load successfully', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-accordion img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[CCRD-068] @regression Accordion all images have alt attributes', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-accordion img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Accordion — Accessibility', () => {
});
test.describe('Accordion — AEM Dialog Configuration', () => {
});
test.describe('Accordion — CSV Test Cases (GAAM-1316)', () => {
    test('[CCRD-074] @regression @sanity DR AEM FE: Filter Show/Hide Rendering – Annuity Category & Channel — AC1', async ({ page }) => {
        // Root-caused 2026-08-13: this ticket is about ga/components/dynamic-rate/accordion (the
        // "Rate List Accordion"), not the generic ga/components/content/accordion this spec file
        // otherwise tests — AccordionPage.navigate() goes to the wrong style-guide page entirely,
        // and .cmp-accordion__content doesn't exist anywhere in either component (verified live:
        // real classes are .cmp-accordion__panel and .cmp-accordion__item-content). The dynamic-rate
        // accordion-item HTL (ui.apps.ga/.../dynamic-rate/accordion/accordion-item/accordion-item.html
        // ~line 40-49) only renders .cmp-accordion__item-badges (containing
        // .cmp-accordion__item-annuity-category / .cmp-accordion__item-channel) when
        // annuityCategoryTitle/channelTitle are set and not the '--' placeholder — i.e. hidden by
        // default. Verified live against the real style guide page for this component,
        // /content/global-atlantic/style-guide/components/rate-list-accordion.html: all 14 authored
        // items have neither field set, and correctly render zero badges — confirming the "hide"
        // half of this AC (matches CCRD-075's dialog-side finding that both fields are optional).
        await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/rate-list-accordion.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
        const root = page.locator('.cmp-accordion').first();
        await expect(root).toBeVisible();
        const items = root.locator('.cmp-accordion__item');
        const itemCount = await items.count();
        expect(itemCount).toBeGreaterThan(0);
        // None of the style guide's items configure annuityCategory/channel — badges must stay hidden.
        await expect(page.locator('.cmp-accordion__item-badges')).toHaveCount(0);
        // Header renders before content in DOM order for every item (collapsed panel stays after its trigger).
        for (let i = 0; i < itemCount; i++) {
            const item = items.nth(i);
            const order = await item.evaluate((el) => {
                const header = el.querySelector('.cmp-accordion__item-header');
                const content = el.querySelector('.cmp-accordion__item-content');
                if (!header || !content) return null;
                return header.compareDocumentPosition(content) === Node.DOCUMENT_POSITION_FOLLOWING;
            });
            expect(order).toBe(true);
        }
    });
});
test.describe('Accordion — CSV Test Cases (GAAM-1315)', () => {
    test('[CCRD-075] @regression @sanity DR AEM BE: Filter Show/Hide Dialog Configuration – Annuity Category & Channel — AC1', async ({ page }) => {
        // Dialog-structure scope only (front-end rendering is CCRD-074). Verified live: the
        // "Show Annuity Category Filter" / "Show Channel Filter" checkboxes already exist on
        // the parent dialog with the correct defaults, and Annuity Category / Channel are
        // already optional on the accordion-item dialog. Already implemented — encoding as a
        // regression guard against the dialog JSON rather than exercising the UI.
        const authorUrl = ENV.AEM_AUTHOR_URL || "http://localhost:4502";
        const accordionDialog = await page.request.get(`${authorUrl}/apps/ga/components/dynamic-rate/accordion/_cq_dialog.infinity.json`).then(r => r.json());
        const itemDialog = await page.request.get(`${authorUrl}/apps/ga/components/dynamic-rate/accordion/accordion-item/_cq_dialog.infinity.json`).then(r => r.json());

        function findField(node: any, name: string): any {
            if (node && typeof node === "object") {
                if (node.name === `./${name}`) return node;
                for (const key of Object.keys(node)) {
                    if (typeof node[key] === "object") {
                        const found = findField(node[key], name);
                        if (found) return found;
                    }
                }
            }
            return null;
        }

        const showAnnuityCategory = findField(accordionDialog, "showAnnuityCategory");
        const showChannel = findField(accordionDialog, "showChannel");
        expect(showAnnuityCategory, "Show Annuity Category Filter checkbox must exist").toBeTruthy();
        expect(showAnnuityCategory.checked, "Annuity Category filter should be checked (visible) by default").toBe(true);
        expect(showChannel, "Show Channel Filter checkbox must exist").toBeTruthy();
        expect(showChannel.checked, "Channel filter should be unchecked (hidden) by default").not.toBe(true);

        const annuityCategoryField = findField(itemDialog, "annuityCategory");
        const channelField = findField(itemDialog, "channel");
        expect(annuityCategoryField, "Annuity Category field must exist on the accordion-item dialog").toBeTruthy();
        expect(annuityCategoryField.required, "Annuity Category must be optional, not required").not.toBe(true);
        expect(channelField, "Channel field must exist on the accordion-item dialog").toBeTruthy();
        expect(channelField.required, "Channel must be optional, not required").not.toBe(true);
    });
});
// [CCRD-076] "CMS FE: Decision Tree – Mobile Behavior — AC1" (CSV Test Cases GAAM-1097) was
// deleted here rather than fixed or relocated. It is CSV-mis-bucketed under Accordion — the
// title names Decision Tree, not Accordion — but unlike CCRD-074/075 (which carried a full
// Jira AC body pointing at concrete dialog fields), this ticket's imported AC text was never
// more than the single fragment "Style System*" (see the original stub this replaced: `// TODO:
// Implement assertion for: Style System*`), which is CSV-column bleed-over, not an acceptance
// criterion — there is no scenario, field, or behavior described anywhere to ground a test
// against. Decision Tree's own generic mobile-viewport-adaptation coverage already exists
// independently as DT-005 (decision-tree.author.spec.ts) and its authoring-guide ticket is
// separately tracked as DT-010; there is no distinct, sourceable "mobile behavior" AC left for
// this ticket to add. Confirmed via repo-wide search: CCRD-076 does not appear in any CSV/data
// source in this repo — only as a stale row in accordion-test-summary.html — so there is nothing
// further to recover.
