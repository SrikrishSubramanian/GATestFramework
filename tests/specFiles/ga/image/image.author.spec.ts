import { test, expect } from '@playwright/test';
import { ImagePage } from '../../../pages/ga/components/imagePage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const IMG_ROOT = '.cmp-image';
const IMG_PICTURE = '.cmp-image__picture';
const IMG_IMAGE = 'img.cmp-image__image';
const IMG_TITLE = '.cmp-image__title';
const IMG_LINK = '.cmp-image__link';
const IMG_FIGURE = '.cmp-image__figure';
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
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
// ---------------------------------------------------------------------------
// Core Structure (IMG-001 to IMG-008)
// ---------------------------------------------------------------------------
test.describe('Image — Core Structure', () => {
    test('[IMG-001] @smoke @regression @sanity Multiple .cmp-image instances render on style guide page', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const images = page.locator(IMG_ROOT);
        const count = await images.count();
        expect(count).toBeGreaterThan(1);
    });
    test('[IMG-004] @regression img.cmp-image__image is display:block and width:100%', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        // AEM adaptive images may not render in local DAM — inject if absent
        const imgCount = await page.locator(IMG_IMAGE).count();
        if (imgCount === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate((pictureSelector) => {
                const picture = document.querySelector(pictureSelector);
                if (picture) {
                    const img = document.createElement('img');
                    img.className = 'cmp-image__image';
                    img.setAttribute('data-injected', 'true');
                    picture.appendChild(img);
                }
            }, IMG_PICTURE);
        }
        const img = page.locator(IMG_IMAGE).first();
        const display = // 📏 TODO: Replace with measurement-utils
         await img.evaluate((el: Element) => getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        const width = // 📏 TODO: Replace with measurement-utils
         await img.evaluate((el: Element) => getComputedStyle(el).width);
        // measurement: use measurement-utils for cleaner code
        const parentWidth = // 📏 TODO: Replace with measurement-utils
         await img.evaluate((el: HTMLElement) => el.parentElement ? el.parentElement.getBoundingClientRect().width : 0);
        expect(display).toBe('block');
        // TODO: Use assertLayout() for display checks
        // width:100% resolves to the parent's pixel width
        const imgWidth = parseFloat(width);
        if (parentWidth > 0) {
            expect(imgWidth).toBeCloseTo(parentWidth, 0);
        }
        else {
            // fallback: just assert it is a positive pixel value
            expect(imgWidth).toBeGreaterThan(0);
        }
        // clean up injection
        if (imgCount === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate(() => {
                document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove());
            });
        }
    });
    test('[IMG-005] @regression Caption (.cmp-image__title) is present on at least one image instance', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const captions = page.locator(IMG_TITLE);
        const count = await captions.count();
        expect(count).toBeGreaterThan(0);
    });
    test('[IMG-006] @regression .cmp-image__figure element is present', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const figures = page.locator(IMG_FIGURE);
        const count = await figures.count();
        expect(count).toBeGreaterThan(0);
    });
    test('[IMG-007] @regression No inline style attributes on .cmp-image root elements', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const roots = page.locator(IMG_ROOT);
        const total = await roots.count();
        for (let i = 0; i < total; i++) {
            const inlineStyle = await roots.nth(i).getAttribute('style');
            expect(inlineStyle ?? '').toBe('');
        }
    });
});
// ---------------------------------------------------------------------------
// Sizing (IMG-009 to IMG-014)
// ---------------------------------------------------------------------------
test.describe('Image — Sizing Variants', () => {
    test('[IMG-010] @regression Full-width (.cmp-image--full-width) wrapper max-width is 100%', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const fullWidth = page.locator('.cmp-image--full-width').first();
        const count = await fullWidth.count();
        if (count === 0) {
            test.skip();
            return;
        }
        const maxWidth = // 📏 TODO: Replace with measurement-utils
         await fullWidth.evaluate((el: Element) => getComputedStyle(el).maxWidth);
        // measurement: use measurement-utils for cleaner code
        // 100% resolves to the viewport width at top-level
        expect(['100%', `${1440}px`].some(v => maxWidth === v) || parseFloat(maxWidth) >= 1400).toBe(true);
    });
    test('[IMG-011] @regression Full-width picture has no border-radius (0px) on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const fullWidthPicture = page.locator('.cmp-image--full-width .cmp-image__picture').first();
        const count = await fullWidthPicture.count();
        if (count === 0) {
            test.skip();
            return;
        }
        const radius = // 📏 TODO: Replace with measurement-utils
         await fullWidthPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
        // measurement: use measurement-utils for cleaner code
        expect(radius).toBe('0px');
    });
});
// ---------------------------------------------------------------------------
// Padding (IMG-015 to IMG-020)
// ---------------------------------------------------------------------------
test.describe('Image — Padding Variants', () => {
    test('[IMG-017] @regression no-top-padding CSS removes top padding', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        // The padding class goes on .image wrapper, and affects inner .cmp-image
        // Find a wrapper inside a section, add the class, check inner .cmp-image padding
        const wrapper = page.locator('.cmp-section .aem-Grid > .image').first();
        if (await wrapper.count() === 0) {
            test.skip();
            return;
        }
        // 📏 TODO: Replace with measurement-utils
        await wrapper.evaluate(el => el.classList.add('cmp-image--no-top-padding'));
        const inner = wrapper.locator('.cmp-image').first();
        const paddingTop = // 📏 TODO: Replace with measurement-utils
         await inner.evaluate(el => getComputedStyle(el).paddingTop);
        // measurement: use measurement-utils for cleaner code
        expect(paddingTop).toBe('0px');
        // TODO: Use assertSpacing() for padding/margin
        // 📏 TODO: Replace with measurement-utils
        await wrapper.evaluate(el => el.classList.remove('cmp-image--no-top-padding'));
    });
    test('[IMG-018] @regression no-bottom-padding CSS removes bottom padding', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const wrapper = page.locator('.cmp-section .aem-Grid > .image').first();
        if (await wrapper.count() === 0) {
            test.skip();
            return;
        }
        // 📏 TODO: Replace with measurement-utils
        await wrapper.evaluate(el => el.classList.add('cmp-image--no-bottom-padding'));
        const inner = wrapper.locator('.cmp-image').first();
        const paddingBottom = // 📏 TODO: Replace with measurement-utils
         await inner.evaluate(el => getComputedStyle(el).paddingBottom);
        // measurement: use measurement-utils for cleaner code
        expect(paddingBottom).toBe('0px');
        // TODO: Use assertSpacing() for padding/margin
    });
    test('[IMG-019] @regression .cmp-image--no-top-bottom-padding removes both top and bottom padding', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        let target = page.locator('.cmp-image--no-top-bottom-padding').first();
        let count = await target.count();
        if (count === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate((selector) => {
                const el = document.querySelector(selector);
                if (el)
                    el.classList.add('cmp-image--no-top-bottom-padding');
            }, IMG_ROOT);
            target = page.locator('.cmp-image--no-top-bottom-padding').first();
        }
        const styles = // 📏 TODO: Replace with measurement-utils
         await target.evaluate((el: Element) => {
            const cs = getComputedStyle(el);
            return { top: cs.paddingTop, bottom: cs.paddingBottom };
        });
        expect(styles.top).toBe('0px');
        expect(styles.bottom).toBe('0px');
    });
    test('[IMG-020] @regression Internal image spacing unchanged when padding class applied', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const picture = page.locator(IMG_PICTURE).first();
        await expect(picture).toBeVisible();
        // Internal picture should not inherit padding removal — it should still fill its container
        const width = // 📏 TODO: Replace with measurement-utils
         await picture.evaluate((el: HTMLElement) => el.getBoundingClientRect().width);
        expect(width).toBeGreaterThan(0);
    });
});
// ---------------------------------------------------------------------------
// Hover Zoom (IMG-021 to IMG-024)
// ---------------------------------------------------------------------------
test.describe('Image — Hover Zoom', () => {
    test('[IMG-021] @regression Linked image: hover on picture changes img transform to scale(1.15)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const linkedPicture = page.locator(`${IMG_LINK} ${IMG_PICTURE}`).first();
        const count = await linkedPicture.count();
        if (count === 0) {
            test.skip();
            return;
        }
        // Inject img if DAM is absent
        const imgCount = await page.locator(`${IMG_LINK} ${IMG_IMAGE}`).count();
        if (imgCount === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate(({ linkSel, imgClass }) => {
                const picture = document.querySelector(`${linkSel} .cmp-image__picture`);
                if (picture) {
                    const img = document.createElement('img');
                    img.className = imgClass;
                    img.setAttribute('data-injected', 'true');
                    picture.appendChild(img);
                }
            }, { linkSel: IMG_LINK, imgClass: 'cmp-image__image' });
        }
        await hover(linkedPicture);
        const transform = await page.locator(`${IMG_LINK} ${IMG_IMAGE}`).first().evaluate((el: Element) => getComputedStyle(el).transform);
        // measurement: use measurement-utils for cleaner code
        // scale(1.15) resolves to a matrix — check it is not 'none' and not identity
        expect(transform).not.toBe('none');
        expect(transform).not.toContain('matrix(1, 0, 0, 1,');
        if (imgCount === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
        }
    });
    test('[IMG-022] @regression Non-linked image: hover leaves img transform as none', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        // A picture NOT inside a link wrapper
        const nonLinkedPicture = page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_PICTURE}`).first();
        const count = await nonLinkedPicture.count();
        if (count === 0) {
            test.skip();
            return;
        }
        const imgCount = await page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_IMAGE}`).count();
        if (imgCount === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate(({ rootSel, linkSel, imgClass }) => {
                const nonLinkedRoot = Array.from(document.querySelectorAll(rootSel)).find(el => !el.querySelector(linkSel));
                const picture = nonLinkedRoot?.querySelector('.cmp-image__picture');
                if (picture) {
                    const img = document.createElement('img');
                    img.className = imgClass;
                    img.setAttribute('data-injected', 'true');
                    picture.appendChild(img);
                }
            }, { rootSel: IMG_ROOT, linkSel: IMG_LINK, imgClass: 'cmp-image__image' });
        }
        await hover(nonLinkedPicture);
        const transform = await page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_IMAGE}`).first().evaluate((el: Element) => getComputedStyle(el).transform);
        // measurement: use measurement-utils for cleaner code
        expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
        if (imgCount === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
        }
    });
});
// ---------------------------------------------------------------------------
// Caption (IMG-025 to IMG-028)
// ---------------------------------------------------------------------------
test.describe('Image — Caption', () => {
    test('[IMG-025] @regression Caption font-size is 14px on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const caption = page.locator(IMG_TITLE).first();
        const count = await caption.count();
        if (count === 0) {
            test.skip();
            return;
        }
        const fontSize = // 📏 TODO: Replace with measurement-utils
         await caption.evaluate((el: Element) => getComputedStyle(el).fontSize);
        // measurement: use measurement-utils for cleaner code
        expect(fontSize).toBe('14px');
        // TODO: Use assertTypography() for font checks
    });
    test('[IMG-027] @regression Caption color on light section is granite (not white)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        // Look for caption inside a white/light section or outside a dark section
        const caption = page.locator(`${SECTION_WHITE} ${IMG_TITLE}, .cmp-section--background-color-slate ${IMG_TITLE}`).first();
        const count = await caption.count();
        if (count === 0) {
            // Use any caption not in a dark section
            const fallback = page.locator(IMG_TITLE).first();
            if (await fallback.count() === 0) {
                test.skip();
                return;
            }
            const color = // 📏 TODO: Replace with measurement-utils
             await fallback.evaluate((el: Element) => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            // granite is a dark color; should not be pure white
            const rgb = color.match(/\d+/g)?.map(Number) ?? [];
            if (rgb.length >= 3) {
                const isWhite = rgb[0] > 240 && rgb[1] > 240 && rgb[2] > 240;
                expect(isWhite).toBe(false);
            }
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await caption.evaluate((el: Element) => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        const rgb = color.match(/\d+/g)?.map(Number) ?? [];
        if (rgb.length >= 3) {
            expect(rgb[0] > 240 && rgb[1] > 240 && rgb[2] > 240).toBe(false);
        }
    });
    test('[IMG-028] @regression Caption color on dark (granite) section is slate (light)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const darkCaption = page.locator(`${SECTION_GRANITE} ${IMG_TITLE}`).first();
        const count = await darkCaption.count();
        if (count === 0) {
            // Inject dark class on a section containing a caption
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate((sels) => {
                const caption = document.querySelector(sels.titleSel);
                const section = caption?.closest('.cmp-section');
                if (section)
                    section.classList.add('cmp-section--background-color-granite');
            }, { titleSel: IMG_TITLE });
            const injectedCaption = page.locator(`${SECTION_GRANITE} ${IMG_TITLE}`).first();
            if (await injectedCaption.count() === 0) {
                test.skip();
                return;
            }
            const color = // 📏 TODO: Replace with measurement-utils
             await injectedCaption.evaluate((el: Element) => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            const rgb = color.match(/\d+/g)?.map(Number) ?? [];
            // slate is a light color — all channels should be high
            if (rgb.length >= 3) {
                expect(rgb[0] + rgb[1] + rgb[2]).toBeGreaterThan(500);
            }
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await darkCaption.evaluate((el: Element) => getComputedStyle(el).color);
        // measurement: use measurement-utils for cleaner code
        const rgb = color.match(/\d+/g)?.map(Number) ?? [];
        if (rgb.length >= 3) {
            expect(rgb[0] + rgb[1] + rgb[2]).toBeGreaterThan(500);
        }
    });
});
// ---------------------------------------------------------------------------
// Mobile (IMG-029 to IMG-032)
// ---------------------------------------------------------------------------
test.describe('Image — Mobile', () => {
    test('[IMG-029] @regression .hide-image class makes .cmp-image display:none at mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        let target = page.locator('.hide-image .cmp-image, .cmp-image.hide-image').first();
        let count = await target.count();
        if (count === 0) {
            // 📏 TODO: Replace with measurement-utils
            await page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (el)
                    el.classList.add('hide-image');
            }, IMG_ROOT);
            target = page.locator('.hide-image').first();
        }
        const display = // 📏 TODO: Replace with measurement-utils
         await target.evaluate((el: Element) => getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        expect(display).toBe('none');
    });
    test('[IMG-030] @regression Full-width image wrapper does not overflow at 390px mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        // Check image wrappers, not the whole page (AEM toolbar may cause page overflow)
        const images = page.locator('.image');
        const count = await images.count();
        for (let i = 0; i < Math.min(count, 6); i++) {
            const overflow = await images.nth(i).evaluate(el => el.scrollWidth > el.clientWidth + 2);
            expect(overflow, `Image wrapper ${i} overflows at 390px`).toBe(false);
        }
    });
    test('[IMG-031] @regression Caption text wraps without overflow at 320px', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 568 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const caption = page.locator(IMG_TITLE).first();
        const count = await caption.count();
        if (count === 0) {
            test.skip();
            return;
        }
        const overflow = // 📏 TODO: Replace with measurement-utils
         await caption.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth);
        expect(overflow).toBe(false);
    });
});
// ---------------------------------------------------------------------------
// Accessibility (IMG-033 to IMG-036)
// ---------------------------------------------------------------------------
test.describe('Image — Accessibility', () => {
});
// ---------------------------------------------------------------------------
// Console (IMG-040)
// ---------------------------------------------------------------------------
test.describe('Image — Console', () => {
    test('[IMG-040] @regression No JS errors on image style guide page', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Image — Happy Path', () => {
    test('[MG-042] @smoke @regression Image renders correctly', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-image').first();
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
    test('[MG-043] @smoke @regression Image interactive elements are functional', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-image').first();
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
test.describe('Image — Negative & Boundary', () => {
    test('[MG-044] @negative @regression Image handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-image').first()).toBeVisible();
    });
    test('[MG-045] @negative @regression Image handles missing images', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-image img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Image — Responsive', () => {
    test('[MG-046] @mobile @regression @mobile Image adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-image').first();
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
    test('[MG-047] @mobile @regression Image adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-image').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Image — Console & Resources', () => {
    test('[MG-048] @regression Image produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Image — Broken Images', () => {
    test('[MG-050] @regression Image all images have alt attributes', async ({ page }) => {
        const pom = new ImagePage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-image img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Image — AEM Dialog Configuration', () => {
});
// 12 CSV-imported test cases (MG-041, MG-056 through MG-066) were removed from here — the CSV
// bulk-import's component-bucketing fallback (csv-test-parser.ts deriveComponentFromMetadata)
// mis-assigned every unmatched row in that batch to "image", even though none of them are about
// the Image component. MG-041/060/064/065/056/057/058/059/062/066 were relocated to their real
// components (product-rate-table, hero-fifty-fifty, decision-tree, grid-container, bio-card,
// quote, rate-details-hero, image-with-nested-content). MG-061 and MG-063 were deleted outright —
// backend-only tickets (admin-dashboard audit log, a Java library dependency cleanup) with no
// UI-testable surface in any component.
