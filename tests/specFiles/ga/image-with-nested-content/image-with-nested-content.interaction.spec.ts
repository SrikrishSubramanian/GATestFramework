import { test, expect } from '@playwright/test';
import { ImageWithNestedContentPage } from '../../../pages/ga/components/imageWithNestedContentPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const IWNC = '.cmp-image-with-nested-content';
const CT_CONTAINER = '.cmp-content-trail__container';
const STAT_ITEM = '.cmp-statistic__item';
const SMALL_CLASS = 'cmp-image-with-nested-content--small';
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
// ── Focus Interactions ──
test.describe('ImageWithNestedContent — Focus Interactions', () => {
});
// ── Hover Interactions ──
test.describe('ImageWithNestedContent — Hover Interactions', () => {
    test('[IWNC-INT-005] @interaction @regression Content-trail link has cursor:pointer', async ({ page }) => {
        const pom = new ImageWithNestedContentPage(page);
        await pom.navigate(BASE());
        const cursor = await page.locator(IWNC).first().evaluate(el => {
            const ct = el.querySelector('.cmp-content-trail__container') as HTMLElement;
            return ct ? getComputedStyle(ct).cursor : 'default';
        });
        expect(cursor).toBe('pointer');
    });
    test('[IWNC-INT-006] @interaction @regression Content-trail hover changes visual state', async ({ page }) => {
        const pom = new ImageWithNestedContentPage(page);
        await pom.navigate(BASE());
        // Use evaluate for hover since element may have 0 height
        const instance = page.locator(IWNC).first();
        const hasCT = // 📏 TODO: Replace with measurement-utils
         await instance.evaluate(el => !!el.querySelector('.cmp-content-trail__container'));
        expect(hasCT).toBe(true);
        // Verify the content-trail link element has CSS transition defined for hover
        const transition = // 📏 TODO: Replace with measurement-utils
         await instance.evaluate(el => {
            const ct = el.querySelector('.cmp-content-trail__container') as HTMLElement;
            return ct ? getComputedStyle(ct).transition : '';
        });
        expect(transition.length).toBeGreaterThan(0);
    });
    test('[IWNC-INT-007] @interaction @regression Statistic overlay is non-interactive', async ({ page }) => {
        const pom = new ImageWithNestedContentPage(page);
        await pom.navigate(BASE());
        const statInstance = page.locator(IWNC).filter({ has: page.locator(STAT_ITEM) }).first();
        const cursor = // 📏 TODO: Replace with measurement-utils
         await statInstance.evaluate(el => {
            const stat = el.querySelector('.cmp-statistic__item') as HTMLElement;
            return stat ? getComputedStyle(stat).cursor : 'auto';
        });
        expect(cursor).not.toBe('pointer');
    });
});
// ── Responsive Transitions ──
test.describe('ImageWithNestedContent — Responsive', () => {
    test('[IWNC-INT-008] @interaction @regression Overlay has position:absolute at both viewports', async ({ page }) => {
        const pom = new ImageWithNestedContentPage(page);
        await page.setViewportSize({ width: 1440, height: 900 });
        await pom.navigate(BASE());
        const overlay = page.locator(`${IWNC} ${CT_CONTAINER}, ${IWNC} ${STAT_ITEM}`).first();
        const desktopPos = // 📏 TODO: Replace with measurement-utils
         await overlay.evaluate(el => getComputedStyle(el).position);
        // measurement: use measurement-utils for cleaner code
        expect(desktopPos).toBe('absolute');
        await page.setViewportSize({ width: 390, height: 844 });
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const mobilePos = // 📏 TODO: Replace with measurement-utils
         await overlay.evaluate(el => getComputedStyle(el).position);
        // measurement: use measurement-utils for cleaner code
        expect(mobilePos).toBe('absolute');
    });
    test('[IWNC-INT-009] @interaction @regression Small variant CSS max-width 350px', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImageWithNestedContentPage(page);
        await pom.navigate(BASE());
        const iwnc = page.locator(IWNC).nth(1);
        // 📏 TODO: Replace with measurement-utils
        await iwnc.evaluate((el, cls) => el.parentElement?.classList.add(cls), SMALL_CLASS);
        const maxW = // 📏 TODO: Replace with measurement-utils
         await iwnc.evaluate(el => getComputedStyle(el).maxWidth);
        // measurement: use measurement-utils for cleaner code
        expect(maxW).toBe('350px');
        // 📏 TODO: Replace with measurement-utils
        await iwnc.evaluate((el, cls) => el.parentElement?.classList.remove(cls), SMALL_CLASS);
    });
    test('[IWNC-INT-010] @interaction @mobile @regression Content-trail is an <a> link at mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new ImageWithNestedContentPage(page);
        await pom.navigate(BASE());
        const ctTag = await page.locator(`${IWNC} ${CT_CONTAINER}`).first().evaluate(el => el.tagName.toLowerCase());
        expect(ctTag).toBe('a');
        const href = await page.locator(`${IWNC} ${CT_CONTAINER}`).first().getAttribute('href');
        expect(href).toBeTruthy();
    });
});
// ── Nested Component Behavior ──
test.describe('ImageWithNestedContent — Nested Components', () => {
    test('[IWNC-INT-011] @interaction @regression Content-trail and statistic render in separate instances', async ({ page }) => {
        const pom = new ImageWithNestedContentPage(page);
        await pom.navigate(BASE());
        const ctCount = await page.locator(`${IWNC} ${CT_CONTAINER}`).count();
        const statCount = await page.locator(`${IWNC} ${STAT_ITEM}`).count();
        expect(ctCount).toBeGreaterThanOrEqual(1);
        expect(statCount).toBeGreaterThanOrEqual(1);
    });
    test('[IWNC-INT-012] @interaction @regression All 4 instances exist independently in DOM', async ({ page }) => {
        const pom = new ImageWithNestedContentPage(page);
        await pom.navigate(BASE());
        const count = await page.locator(IWNC).count();
        expect(count).toBeGreaterThanOrEqual(4);
    });
});
