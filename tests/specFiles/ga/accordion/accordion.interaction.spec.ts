import { test, expect } from '@playwright/test';
import { AccordionPage } from '../../../pages/ga/components/accordionPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const ACCORDION = '.cmp-accordion';
const ITEM_BUTTON = '.cmp-accordion__item-button';
const ITEM_CONTENT = '.cmp-accordion__item-content';
const INDICATOR_GA = '.cmp-accordion__item-indicator--ga';
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
test.describe('Accordion — Keyboard Navigation', () => {
});
test.describe('Accordion — Rapid Interaction', () => {
    test('[ACRD-INT-005] @interaction @regression Rapid expand/collapse does not break state', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        // Rapidly toggle 5 times
        for (let i = 0; i < 5; i++) {
            await clickElement(firstButton);
        }
        // After odd number of clicks, should be expanded
        await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
        // One more click to collapse
        await clickElement(firstButton);
        await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });
    test('[ACRD-INT-006] @interaction @regression Single-expansion rapid switching maintains invariant', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const slateButtons = page.locator(`${SECTION_SLATE} ${ITEM_BUTTON}`);
        // Rapidly click through all items
        const count = await slateButtons.count();
        for (let i = 0; i < count; i++) {
            await slateButtons.nth(i).click();
        }
        // Only the last clicked should be expanded (single expansion)
        for (let i = 0; i < count - 1; i++) {
            await expect(slateButtons.nth(i)).toHaveAttribute('aria-expanded', 'false');
        }
        await expect(slateButtons.nth(count - 1)).toHaveAttribute('aria-expanded', 'true');
    });
});
test.describe('Accordion — Cross-Background Behavior Consistency', () => {
    test('[ACRD-INT-007] @interaction @regression White section: expand/collapse is functional', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
        await clickElement(btn);
        await expect(btn).toHaveAttribute('aria-expanded', 'true');
        await clickElement(btn);
        await expect(btn).toHaveAttribute('aria-expanded', 'false');
    });
    test('[ACRD-INT-008] @interaction @regression Granite section: expand/collapse is functional', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`).first();
        await clickElement(btn);
        await expect(btn).toHaveAttribute('aria-expanded', 'true');
        // Verify content panel becomes visible
        const content = page.locator(`${SECTION_GRANITE} ${ITEM_CONTENT}`).first();
        await expect(content).toHaveAttribute('aria-hidden', 'false');
    });
    test('[ACRD-INT-009] @interaction @regression Azul section: expand/collapse is functional', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_AZUL} ${ITEM_BUTTON}`).first();
        await clickElement(btn);
        await expect(btn).toHaveAttribute('aria-expanded', 'true');
        const content = page.locator(`${SECTION_AZUL} ${ITEM_CONTENT}`).first();
        await expect(content).toHaveAttribute('aria-hidden', 'false');
    });
    test('[ACRD-INT-010] @interaction @regression Icon animation is consistent across all backgrounds', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const sections = [SECTION_WHITE, SECTION_GRANITE, SECTION_AZUL];
        for (const section of sections) {
            const btn = page.locator(`${section} ${ITEM_BUTTON}`).first();
            const indicator = btn.locator(INDICATOR_GA);
            // Verify indicator exists and has transition
            await expect(indicator).toBeVisible();
            const transition = // 📏 TODO: Replace with measurement-utils
             await indicator.evaluate(el => getComputedStyle(el).transition);
            // measurement: use measurement-utils for cleaner code
            expect(transition).toContain('background-color');
        }
    });
});
test.describe('Accordion — Hover State on Dark Backgrounds', () => {
    test('[ACRD-INT-011] @interaction @regression Granite hover changes icon background', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`).first();
        const indicator = btn.locator(INDICATOR_GA);
        const bgBefore = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        await hover(btn);
        const bgAfter = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        expect(bgAfter).not.toBe(bgBefore);
    });
    test('[ACRD-INT-012] @interaction @regression Azul hover changes icon background', async ({ page }) => {
        const pom = new AccordionPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SECTION_AZUL} ${ITEM_BUTTON}`).first();
        const indicator = btn.locator(INDICATOR_GA);
        const bgBefore = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        await hover(btn);
        const bgAfter = // 📏 TODO: Replace with measurement-utils
         await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        expect(bgAfter).not.toBe(bgBefore);
    });
});
