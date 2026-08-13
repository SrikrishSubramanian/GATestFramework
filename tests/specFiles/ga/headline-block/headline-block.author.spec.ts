import { test, expect } from '@playwright/test';
import { HeadlineBlockPage } from '../../../pages/ga/components/headlineBlockPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const HB = '.cmp-headline-block';
const EYEBROW = '.cmp-headline-block__eyebrow';
const TITLE = '.cmp-headline-block__title';
const DESCRIPTOR = '.cmp-headline-block__descriptor';
const CTA_WRAPPER = '.cmp-headline-block__cta-wrapper';
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
// ── GAAM-344: Core Rendering ──
test.describe('Headline Block — Core Structure (GAAM-344)', () => {
    test('[HB-001] @smoke @regression @sanity Eyebrow renders above headline with correct BEM class', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const eyebrow = block.locator(EYEBROW);
        await expect(eyebrow).toBeVisible();
        await expect(eyebrow).toHaveText(/eye\s*brow/i);
        // Eyebrow should be positioned above title
        const eyeBox = await eyebrow.boundingBox();
        const titleBox = await block.locator(TITLE).boundingBox();
        expect(eyeBox!.y).toBeLessThan(titleBox!.y);
    });
    test('[HB-003] @smoke @regression @sanity Descriptor renders below headline with body-m class', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const descriptor = block.locator(DESCRIPTOR);
        await expect(descriptor).toBeVisible();
        await expect(descriptor).toHaveClass(/body-m/);
        // Descriptor should be below title
        const descBox = await descriptor.boundingBox();
        const titleBox = await block.locator(TITLE).boundingBox();
        expect(descBox!.y).toBeGreaterThan(titleBox!.y);
    });
    test('[HB-004] @smoke @regression @sanity Descriptor supports rich text (contains <p> tags)', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const descriptor = block.locator(DESCRIPTOR);
        const pTag = descriptor.locator('p');
        await expect(pTag.first()).toBeVisible();
    });
    test('[HB-005] @smoke @regression @sanity Primary and secondary CTAs render below descriptor', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const ctaWrapper = block.locator(CTA_WRAPPER);
        await expect(ctaWrapper).toBeVisible();
        // Should contain at least 2 button links
        const buttons = ctaWrapper.locator('.cmp-button');
        const count = await buttons.count();
        expect(count).toBeGreaterThanOrEqual(2);
        // Verify button text
        await expect(buttons.first()).toContainText(/Optional CTA/i);
        await expect(buttons.nth(1)).toContainText(/Link Label/i);
        // CTA wrapper should be below descriptor
        const ctaBox = await ctaWrapper.boundingBox();
        const descBox = await block.locator(DESCRIPTOR).boundingBox();
        expect(ctaBox!.y).toBeGreaterThan(descBox!.y);
    });
    test('[HB-007] @regression All 8 style guide variations render without errors', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const blocks = page.locator(HB);
        const count = await blocks.count();
        expect(count).toBeGreaterThanOrEqual(8);
        capture.stop();
        expect(capture.getErrors()).toEqual([]);
    });
    test('[HB-008] @regression @smoke @sanity HeadlineBlock uses cmp-headline-block BEM prefix', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(HB).first();
        await expect(block).toBeVisible();
        // Verify BEM child elements exist
        await expect(block.locator(EYEBROW)).toBeVisible();
        await expect(block.locator(TITLE)).toBeVisible();
        await expect(block.locator(DESCRIPTOR)).toBeVisible();
        await expect(block.locator(CTA_WRAPPER)).toBeVisible();
    });
    test('[HB-009] @regression No inline style attributes on headline-block elements', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const elementsWithInline = await page.locator(`${HB} [style]`).count();
        expect(elementsWithInline).toBe(0);
    });
});
// ── GAAM-344: Alignment Variants ──
test.describe('Headline Block — Alignment (GAAM-344)', () => {
    test('[HB-010] @regression Left-aligned variant aligns all content to the left', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        // First section is left-aligned on white
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const eyebrow = block.locator(EYEBROW);
        const textAlign = // 📏 TODO: Replace with measurement-utils
         await eyebrow.evaluate(el => getComputedStyle(el).textAlign);
        // measurement: use measurement-utils for cleaner code
        // left or start are both acceptable
        expect(['left', 'start']).toContain(textAlign);
    });
    test('[HB-011] @regression Center-aligned variant centers all content horizontally', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        // Second variation: center-aligned on white — find via .cmp-section--center
        const centerSection = page.locator(`${SECTION_WHITE}`).nth(1);
        const block = centerSection.locator(HB);
        const eyebrow = block.locator(EYEBROW);
        const title = block.locator(TITLE);
        const descriptor = block.locator(DESCRIPTOR);
        // All text should be centered
        const eyeAlign = // 📏 TODO: Replace with measurement-utils
         await eyebrow.evaluate(el => getComputedStyle(el).textAlign);
        // measurement: use measurement-utils for cleaner code
        const titleAlign = // 📏 TODO: Replace with measurement-utils
         await title.evaluate(el => getComputedStyle(el).textAlign);
        // measurement: use measurement-utils for cleaner code
        const descAlign = // 📏 TODO: Replace with measurement-utils
         await descriptor.evaluate(el => getComputedStyle(el).textAlign);
        // measurement: use measurement-utils for cleaner code
        expect(eyeAlign).toBe('center');
        expect(titleAlign).toBe('center');
        expect(descAlign).toBe('center');
    });
    test('[HB-012] @regression Center-aligned CTA wrapper centers buttons', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const centerSection = page.locator(`${SECTION_WHITE}`).nth(1);
        const ctaWrapper = centerSection.locator(`${HB} ${CTA_WRAPPER}`);
        const alignItems = // 📏 TODO: Replace with measurement-utils
         await ctaWrapper.evaluate(el => getComputedStyle(el).alignItems);
        // measurement: use measurement-utils for cleaner code
        expect(alignItems).toBe('center');
    });
});
// ── GAAM-344: Dark/Light Background Color Overrides ──
test.describe('Headline Block — Background Color Overrides (GAAM-344)', () => {
    test('[HB-013] @regression White section: eyebrow uses dark (granite-light) color', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const eyebrow = block.locator(EYEBROW);
        const color = // 📏 TODO: Replace with measurement-utils
         await eyebrow.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        // Should NOT be white/light — should be a dark color on light background
        expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
    });
    test('[HB-014] @regression Slate section: text uses light-mode colors', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_SLATE} ${HB}`).first();
        const title = block.locator(TITLE);
        const color = // 📏 TODO: Replace with measurement-utils
         await title.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        // Light mode — title should be dark colored, not white
        expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
    });
    test('[HB-015] @regression Granite section: title uses white color (dark mode)', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_GRANITE} ${HB}`).first();
        const title = block.locator(TITLE);
        const color = // 📏 TODO: Replace with measurement-utils
         await title.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        // Dark mode — title should be white
        expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
    });
    test('[HB-017] @regression Azul section: title uses white color (dark mode)', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_AZUL} ${HB}`).first();
        const title = block.locator(TITLE);
        const color = // 📏 TODO: Replace with measurement-utils
         await title.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
    });
    test('[HB-018] @regression Azul section: eyebrow uses light gray color', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_AZUL} ${HB}`).first();
        const eyebrow = block.locator(EYEBROW);
        const color = // 📏 TODO: Replace with measurement-utils
         await eyebrow.evaluate(el => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        // Should be a light color (ga-gray-20 or similar) — NOT the dark granite-light
        // Parse RGB and check lightness
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        expect(match).toBeTruthy();
        const lightness = (parseInt(match![1]) + parseInt(match![2]) + parseInt(match![3])) / 3;
        expect(lightness).toBeGreaterThan(150); // Light color
    });
});
// ── GAAM-676: Max Width ──
test.describe('Headline Block — Max Width (GAAM-676)', () => {
    test('[HB-019] @regression Left-aligned: max-width is 1032px on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const maxWidth = // 📏 TODO: Replace with measurement-utils
         await block.evaluate(el => getComputedStyle(el).maxWidth);
        // measurement: use measurement-utils for cleaner code
        expect(maxWidth).toBe('1032px');
    });
    test('[HB-021] @regression @mobile Mobile: no max-width constraint (full container width)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const maxWidth = // 📏 TODO: Replace with measurement-utils
         await block.evaluate(el => getComputedStyle(el).maxWidth);
        // measurement: use measurement-utils for cleaner code
        // On mobile, max-width should be 'none' or not set
        expect(maxWidth).toBe('none');
    });
    test('[HB-022] @regression Max-width applies to content wrapper, not individual elements', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        // Individual elements should NOT have their own max-width
        const eyebrowMaxW = await block.locator(EYEBROW).evaluate(el => getComputedStyle(el).maxWidth);
        // measurement: use measurement-utils for cleaner code
        const titleMaxW = await block.locator(TITLE).evaluate(el => getComputedStyle(el).maxWidth);
        // measurement: use measurement-utils for cleaner code
        const descMaxW = await block.locator(DESCRIPTOR).evaluate(el => getComputedStyle(el).maxWidth);
        // measurement: use measurement-utils for cleaner code
        expect(eyebrowMaxW).toBe('none');
        expect(titleMaxW).toBe('none');
        expect(descMaxW).toBe('none');
    });
});
// ── GAAM-655 / GAAM-757: Padding ──
test.describe('Headline Block — Default Padding (GAAM-655/757)', () => {
    test('[HB-023] @regression Desktop: default padding is 48px top and bottom', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const paddingTop = // 📏 TODO: Replace with measurement-utils
         await block.evaluate(el => getComputedStyle(el).paddingTop);
        // measurement: use measurement-utils for cleaner code
        const paddingBottom = // 📏 TODO: Replace with measurement-utils
         await block.evaluate(el => getComputedStyle(el).paddingBottom);
        // measurement: use measurement-utils for cleaner code
        expect(paddingTop).toBe('48px');
        // TODO: Use assertSpacing() for padding/margin
        expect(paddingBottom).toBe('48px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[HB-024] @regression @mobile Mobile: default padding is 32px top and bottom', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const paddingTop = // 📏 TODO: Replace with measurement-utils
         await block.evaluate(el => getComputedStyle(el).paddingTop);
        // measurement: use measurement-utils for cleaner code
        const paddingBottom = // 📏 TODO: Replace with measurement-utils
         await block.evaluate(el => getComputedStyle(el).paddingBottom);
        // measurement: use measurement-utils for cleaner code
        expect(paddingTop).toBe('32px');
        // TODO: Use assertSpacing() for padding/margin
        expect(paddingBottom).toBe('32px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[HB-025] @regression Padding-top-off class removes top padding only', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        // No style-guide instance authors this modifier, so it's applied at runtime. The
        // modifier lives on the ancestor .aem-GridColumn, not on .cmp-headline-block itself —
        // confirmed live (self-injection has no effect; ancestor injection does).
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const gridCol = block.locator('xpath=ancestor::*[contains(@class, "aem-GridColumn")][1]');
        await gridCol.evaluate(el => el.classList.add('cmp-headline-block--padding-top-off'));
        const paddingTop = await block.evaluate(el => getComputedStyle(el).paddingTop);
        const paddingBottom = await block.evaluate(el => getComputedStyle(el).paddingBottom);
        expect(paddingTop).toBe('0px');
        expect(paddingBottom).toBe('48px');
    });
    test('[HB-026] @regression Padding-bottom-off class removes bottom padding only', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const gridCol = block.locator('xpath=ancestor::*[contains(@class, "aem-GridColumn")][1]');
        await gridCol.evaluate(el => el.classList.add('cmp-headline-block--padding-bottom-off'));
        const paddingTop = await block.evaluate(el => getComputedStyle(el).paddingTop);
        const paddingBottom = await block.evaluate(el => getComputedStyle(el).paddingBottom);
        expect(paddingTop).toBe('48px');
        expect(paddingBottom).toBe('0px');
    });
    test('[HB-027] @regression Internal spacing unchanged when padding removed', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        // Compare eyebrow-to-title gap in normal block vs the same block with padding-top-off applied
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        const normalEyeBox = await block.locator(EYEBROW).boundingBox();
        const normalTitleBox = await block.locator(TITLE).boundingBox();
        const normalGap = normalTitleBox!.y - (normalEyeBox!.y + normalEyeBox!.height);

        const gridCol = block.locator('xpath=ancestor::*[contains(@class, "aem-GridColumn")][1]');
        await gridCol.evaluate(el => el.classList.add('cmp-headline-block--padding-top-off'));

        const offEyeBox = await block.locator(EYEBROW).boundingBox();
        const offTitleBox = await block.locator(TITLE).boundingBox();
        if (offEyeBox && offTitleBox) {
            const offGap = offTitleBox.y - (offEyeBox.y + offEyeBox.height);
            // Internal spacing should be approximately the same (±2px for rounding) — removing
            // the block's outer padding must not affect spacing between its own children.
            expect(Math.abs(offGap - normalGap)).toBeLessThanOrEqual(2);
        }
    });
});
// ── GAAM-344: Responsive Behavior ──
test.describe('Headline Block — Responsive (GAAM-344)', () => {
    test('[HB-028] @mobile @regression @sanity CTAs stack vertically on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(flexDir).toBe('column');
    });
    test('[HB-029] @regression @sanity CTAs stack horizontally on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(flexDir).toBe('row');
    });
    test('[HB-030] @mobile @regression @sanity All elements stack vertically on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
        // Verify vertical ordering: eyebrow → title → descriptor → CTAs
        const eyeBox = await block.locator(EYEBROW).boundingBox();
        const titleBox = await block.locator(TITLE).boundingBox();
        const descBox = await block.locator(DESCRIPTOR).boundingBox();
        const ctaBox = await block.locator(CTA_WRAPPER).boundingBox();
        expect(eyeBox!.y).toBeLessThan(titleBox!.y);
        expect(titleBox!.y).toBeLessThan(descBox!.y);
        expect(descBox!.y).toBeLessThan(ctaBox!.y);
    });
    test('[HB-031] @mobile @regression @sanity No horizontal overflow on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const blocks = page.locator(HB);
        const count = await blocks.count();
        for (let i = 0; i < Math.min(count, 4); i++) {
            const overflow = await blocks.nth(i).evaluate(el => el.scrollWidth > el.clientWidth);
            expect(overflow).toBe(false);
        }
    });
    test('[HB-032] @regression @sanity CTA wrapper has 12px gap between buttons', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
        const gap = // 📏 TODO: Replace with measurement-utils
         await ctaWrapper.evaluate(el => getComputedStyle(el).gap);
        // measurement: use measurement-utils for cleaner code
        expect(gap).toBe('12px');
    });
});
// ── AEM Dialog Configuration ──
test.describe('Headline Block — AEM Dialog Configuration', () => {
    test('[HB-036] @author @regression Dialog has Properties tab with required fields', async ({ page }) => {
        // GA overlay only has RTE customizations — full dialog comes from base via Sling resource merger
        const baseDialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/headline-block/_cq_dialog.infinity.json`;
        const response = await page.request.get(baseDialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = JSON.stringify(await response.json());
        // Verify Properties tab and its fields exist in the base dialog
        expect(dialog).toContain('"properties"');
        expect(dialog).toContain('"eyebrow"');
        expect(dialog).toContain('"title"');
        expect(dialog).toContain('"descriptor"');
        expect(dialog).toContain('"types"');
    });
    test('[HB-037] @author @regression Dialog Title field is required', async ({ page }) => {
        const dialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/headline-block/_cq_dialog.infinity.json`;
        const response = await page.request.get(dialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = await response.json();
        // Navigate to the title field and check required
        const titleField = dialog?.content?.items?.tabs?.items?.properties?.items?.columns?.items?.column?.items?.title;
        expect(titleField).toBeTruthy();
        expect(titleField.required).toBe(true);
    });
    test('[HB-039] @author @regression GA dialog overlay customizes RTE plugins', async ({ page }) => {
        const gaDialogUrl = `${BASE()}/apps/ga/components/content/headline-block/_cq_dialog.infinity.json`;
        const response = await page.request.get(gaDialogUrl);
        expect(response.ok()).toBe(true);
        const dialog = JSON.stringify(await response.json());
        // GA overlay should reference GA-specific RTE plugins
        expect(dialog).toContain('ga/components/common/richtext');
    });
});
// ── Accessibility ──
test.describe('Headline Block — Accessibility (GAAM-344/655/676)', () => {
});
// ── Console & JS Errors ──
test.describe('Headline Block — Console Errors', () => {
    test('[HB-046] @regression No JS errors on page load', async ({ page }) => {
        const pom = new HeadlineBlockPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        capture.stop();
        expect(capture.getErrors()).toEqual([]);
    });
});
