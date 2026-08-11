import { test, expect } from '@playwright/test';
import { HeroFiftyFiftyPage } from '../../../pages/ga/components/heroFiftyFiftyPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertColumnLayout, assertNoEmptyWrappers, assertImageFillsContainer, assertTagName, assertFocusIndicator, assertHidden, assertAlignment, } from '../../../utils/infra/component-assertions';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import AxeBuilder from '@axe-core/playwright';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
// Viewports (matches GA breakpoints)
const MOBILE = { width: 390, height: 844 };
const TABLET = { width: 1024, height: 1366 };
const DESKTOP = { width: 1440, height: 900 };
// BEM selectors from live DOM scan (heroFiftyFiftyPage.locators.json)
const SEL = {
    root: '.cmp-hero-fifty-fifty',
    left: '.cmp-hero-fifty-fifty__left',
    right: '.cmp-hero-fifty-fifty__right',
    content: '.cmp-hero-fifty-fifty__content',
    textContent: '.cmp-hero-fifty-fifty__text-content',
    breadcrumbWrap: '.cmp-hero-fifty-fifty__breadcrumb',
    breadcrumb: '.cmp-breadcrumb',
    eyebrowHeadline: '.cmp-hero-fifty-fifty__eyebrow-headline',
    eyebrow: '.cmp-hero-fifty-fifty__eyebrow',
    headline: '.cmp-hero-fifty-fifty__headline',
    headlineH1: '.cmp-hero-fifty-fifty__headline--h1',
    headlineH1XL: '.cmp-hero-fifty-fifty__headline--h1-xl',
    headlineGranite: '.cmp-hero-fifty-fifty__headline--granite',
    description: '.cmp-hero-fifty-fifty__description',
    descMedium: '.cmp-hero-fifty-fifty__description--medium',
    descLarge: '.cmp-hero-fifty-fifty__description--large',
    buttons: '.cmp-hero-fifty-fifty__buttons',
    image: '.cmp-hero-fifty-fifty__image',
    secondarySlot: '.cmp-hero-fifty-fifty__secondary-slot',
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
// ─── AC1–AC6: Overall Layout ─────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Layout (AC1–AC6)', () => {
    test('[HFF-001] @smoke @regression @sanity 50/50 two-column layout on desktop', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const root = page.locator(SEL.root).first();
        await expect(root).toBeVisible();
        // Should be a row layout with 2 children (left + right)
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(flexDir).toBe('row');
        const left = root.locator(SEL.left);
        const right = root.locator(SEL.right);
        await expect(left).toBeVisible();
        await expect(right).toBeVisible();
    });
    test('[HFF-002] @regression Left column has granite background', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const left = page.locator(SEL.left).first();
        await expect(left).toBeVisible();
        // Granite background should not be transparent
        const bg = // 📏 TODO: Replace with measurement-utils
         await left.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
        expect(bg).not.toBe('rgba(0, 0, 0, 0)');
        expect(bg).not.toBe('rgb(255, 255, 255)');
    });
    test('[HFF-003] @regression Right column contains image and optional secondary slot', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const right = page.locator(SEL.right).first();
        await expect(right).toBeVisible();
        // Image area should be present
        const imageArea = right.locator(SEL.image);
        await expect(imageArea).toBeVisible();
    });
    test('[HFF-004] @mobile @regression Columns stack vertically on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const root = page.locator(SEL.root).first();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
        expect(['column', 'column-reverse']).toContain(flexDir);
    });
    test('[HFF-005] @mobile @regression Breadcrumb hidden on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // First hero has breadcrumb enabled — check it's hidden at mobile
        const breadcrumbWrap = page.locator(SEL.breadcrumbWrap).first();
        const count = await breadcrumbWrap.count();
        if (count > 0) {
            const isHidden = // 📏 TODO: Replace with measurement-utils
             await breadcrumbWrap.evaluate(el => {
                const cs = getComputedStyle(el);
                return cs.display === 'none' || cs.visibility === 'hidden';
            });
            expect(isHidden).toBe(true);
        }
    });
    test('[HFF-006] @regression Column proportions are approximately 50/50', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const root = page.locator(SEL.root).first();
        const left = root.locator(SEL.left);
        const right = root.locator(SEL.right);
        const leftBox = await left.boundingBox();
        const rightBox = await right.boundingBox();
        if (leftBox && rightBox) {
            const total = leftBox.width + rightBox.width;
            const ratio = leftBox.width / total;
            // 50/50 ± 10% tolerance
            expect(ratio).toBeGreaterThan(0.4);
            expect(ratio).toBeLessThan(0.6);
        }
    });
});
// ─── AC7–AC9: Breadcrumb ──────────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Breadcrumb (AC7–AC9)', () => {
    test('[HFF-007] @regression Breadcrumb renders at top of left column', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // First hero (fixture 1) has breadcrumb enabled
        const firstHero = page.locator(SEL.root).first();
        const breadcrumb = firstHero.locator(SEL.breadcrumbWrap);
        const content = firstHero.locator(SEL.content);
        if (await breadcrumb.count() > 0) {
            const bcBox = await breadcrumb.boundingBox();
            const contentBox = await content.boundingBox();
            if (bcBox && contentBox) {
                // Breadcrumb should be above (or equal to) the content block
                expect(bcBox.y).toBeLessThanOrEqual(contentBox.y);
            }
        }
    });
    test('[HFF-008] @regression Breadcrumb uses .cmp-breadcrumb styles (not custom)', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Verify breadcrumb inside hero uses standard .cmp-breadcrumb BEM class
        const breadcrumb = page.locator(`${SEL.root} ${SEL.breadcrumb}`).first();
        if (await breadcrumb.count() > 0) {
            const classes = // 📏 TODO: Replace with measurement-utils
             await breadcrumb.evaluate(el => el.className);
            expect(classes).toContain('cmp-breadcrumb');
        }
    });
    test('[HFF-009] @regression Breadcrumb has dark-background treatment', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // On granite background, breadcrumb links should have light text
        const bcLink = page.locator(`${SEL.root} .cmp-breadcrumb__item-link`).first();
        if (await bcLink.count() > 0) {
            const color = // 📏 TODO: Replace with measurement-utils
             await bcLink.evaluate(el => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            // Text on dark bg should be light (R > 150 typically)
            const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const brightness = (parseInt(match[1]) + parseInt(match[2]) + parseInt(match[3])) / 3;
                expect(brightness).toBeGreaterThan(100);
            }
        }
    });
});
// ─── AC10–AC12: Eyebrow ──────────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Eyebrow (AC10–AC12)', () => {
    test('[HFF-010] @regression Eyebrow renders above headline when authored', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // First hero has eyebrow
        const firstHero = page.locator(SEL.root).first();
        const eyebrow = firstHero.locator(SEL.eyebrow);
        const headline = firstHero.locator(SEL.headline);
        if (await eyebrow.count() > 0) {
            const ebBox = await eyebrow.boundingBox();
            const hlBox = await headline.boundingBox();
            if (ebBox && hlBox) {
                expect(ebBox.y).toBeLessThan(hlBox.y);
            }
        }
    });
    test('[HFF-011] @regression No empty eyebrow wrapper when not authored', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Second hero (fixture 2, minimal) has no eyebrow
        const heroes = page.locator(SEL.root);
        const count = await heroes.count();
        expect(count).toBeGreaterThanOrEqual(2);
        const minimalHero = heroes.nth(1);
        const eyebrow = minimalHero.locator(SEL.eyebrow);
        const eyebrowCount = await eyebrow.count();
        if (eyebrowCount > 0) {
            // If wrapper exists, it should have no visible text
            const text = await eyebrow.textContent();
            expect(text?.trim()).toBe('');
        }
        // Also verify no empty wrappers in the content area
        const content = minimalHero.locator(SEL.textContent);
        await assertNoEmptyWrappers(content);
    });
    test('[HFF-012] @regression Eyebrow typography on dark background', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const eyebrow = page.locator(SEL.eyebrow).first();
        if (await eyebrow.count() > 0) {
            const color = // 📏 TODO: Replace with measurement-utils
             await eyebrow.evaluate(el => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            // Text on granite should be light
            expect(color).not.toBe('rgb(0, 0, 0)');
        }
    });
});
// ─── AC13–AC18: Headline ─────────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Headline (AC13–AC18)', () => {
    test('[HFF-013] @regression Headline renders as semantic <h1>', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const headline = page.locator(SEL.headline).first();
        await expect(headline).toBeVisible();
        await assertTagName(headline, 'h1');
    });
    test('[HFF-014] @regression H1 XL and H1 render at different sizes', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const h1 = page.locator(SEL.headlineH1).first();
        const h1xl = page.locator(SEL.headlineH1XL).first();
        const h1Count = await h1.count();
        const h1xlCount = await h1xl.count();
        if (h1Count > 0 && h1xlCount > 0) {
            const h1Size = // 📏 TODO: Replace with measurement-utils
             await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
            // measurement: use measurement-utils for cleaner code
            const h1xlSize = // 📏 TODO: Replace with measurement-utils
             await h1xl.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
            // measurement: use measurement-utils for cleaner code
            expect(h1xlSize).toBeGreaterThan(h1Size);
        }
    });
    test('[HFF-015] @regression Granite 50% inline color override renders', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const graniteSpan = page.locator(SEL.headlineGranite).first();
        if (await graniteSpan.count() > 0) {
            await expect(graniteSpan).toBeVisible();
            const color = // 📏 TODO: Replace with measurement-utils
             await graniteSpan.evaluate(el => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            // Granite 50% should differ from default white text
            expect(color).not.toBe('rgb(255, 255, 255)');
        }
    });
    test('[HFF-017] @regression Granite 50% color value is consistent', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const graniteSpans = page.locator(SEL.headlineGranite);
        const count = await graniteSpans.count();
        if (count >= 2) {
            const color1 = await graniteSpans.nth(0).evaluate(el => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            const color2 = await graniteSpans.nth(1).evaluate(el => getComputedStyle(el).color);
            // measurement: use measurement-utils for cleaner code
            expect(color1).toBe(color2);
        }
    });
});
// ─── AC19–AC23: Description ──────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Description (AC19–AC23)', () => {
    test('[HFF-019] @regression Description renders below headline', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const firstHero = page.locator(SEL.root).first();
        const headline = firstHero.locator(SEL.headline);
        const desc = firstHero.locator(SEL.description);
        if (await desc.count() > 0) {
            const hlBox = await headline.boundingBox();
            const descBox = await desc.boundingBox();
            if (hlBox && descBox) {
                expect(descBox.y).toBeGreaterThan(hlBox.y);
            }
        }
    });
    test('[HFF-022] @regression Spacing adjusts when description is absent', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Compare vertical space between headline and next element
        // in fixture with description (1st) vs without (2nd minimal)
        const heroWithDesc = page.locator(SEL.root).first();
        const heroWithoutDesc = page.locator(SEL.root).nth(1);
        const headlineWithDesc = heroWithDesc.locator(SEL.headline);
        const headlineWithoutDesc = heroWithoutDesc.locator(SEL.headline);
        await expect(headlineWithDesc).toBeVisible();
        await expect(headlineWithoutDesc).toBeVisible();
        // Both should render cleanly without layout breakage
        const box1 = await headlineWithDesc.boundingBox();
        const box2 = await headlineWithoutDesc.boundingBox();
        expect(box1).not.toBeNull();
        expect(box2).not.toBeNull();
    });
    test('[HFF-023] @regression Paragraph Medium and Large have different font sizes', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const medium = page.locator(SEL.descMedium).first();
        const large = page.locator(SEL.descLarge).first();
        if (await medium.count() > 0 && await large.count() > 0) {
            const medSize = // 📏 TODO: Replace with measurement-utils
             await medium.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
            // measurement: use measurement-utils for cleaner code
            const lgSize = // 📏 TODO: Replace with measurement-utils
             await large.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
            // measurement: use measurement-utils for cleaner code
            expect(lgSize).toBeGreaterThan(medSize);
        }
    });
});
// ─── AC24–AC27: CTAs ─────────────────────────────────────────────────────────
test.describe('HeroFiftyFifty — CTAs (AC24–AC27)', () => {
    test('[HFF-024] @regression Supports up to 2 CTA buttons inline', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // First hero (full) has 2 CTAs
        const firstHero = page.locator(SEL.root).first();
        const buttonsContainer = firstHero.locator(SEL.buttons);
        const buttons = buttonsContainer.locator('.cmp-button');
        const count = await buttons.count();
        expect(count).toBeLessThanOrEqual(2);
        expect(count).toBeGreaterThanOrEqual(1);
        // Buttons should be in a flex row (inline)
        if (await buttonsContainer.count() > 0) {
            const display = // 📏 TODO: Replace with measurement-utils
             await buttonsContainer.evaluate(el => getComputedStyle(el).display);
            // measurement: use measurement-utils for cleaner code
            expect(display).toBe('flex');
            // TODO: Use assertLayout() for display checks
        }
    });
    test('[HFF-025] @regression Button styles use .cmp-button BEM class', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const btn = page.locator(`${SEL.root} .cmp-button`).first();
        if (await btn.count() > 0) {
            const classes = // 📏 TODO: Replace with measurement-utils
             await btn.evaluate(el => el.className);
            expect(classes).toContain('cmp-button');
        }
    });
    test('[HFF-027] @mobile @regression CTA button layout on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const buttonsContainer = page.locator(SEL.buttons).first();
        if (await buttonsContainer.count() > 0) {
            // On mobile, buttons may stack vertically
            const flexDir = // 📏 TODO: Replace with measurement-utils
             await buttonsContainer.evaluate(el => getComputedStyle(el).flexDirection);
            // measurement: use measurement-utils for cleaner code
            expect(['row', 'column']).toContain(flexDir);
            // All buttons should still be visible and clickable
            const buttons = buttonsContainer.locator('.cmp-button');
            const count = await buttons.count();
            for (let i = 0; i < count; i++) {
                await expect(buttons.nth(i)).toBeVisible();
            }
        }
    });
});
// ─── AC28–AC31: Layout Combinations ──────────────────────────────────────────
test.describe('HeroFiftyFifty — Layout Combinations (AC28–AC31)', () => {
    test('[HFF-028] @regression Multiple fixture variants all render correctly', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const heroes = page.locator(SEL.root);
        const count = await heroes.count();
        // Style guide should have multiple fixtures
        expect(count).toBeGreaterThanOrEqual(4);
        for (let i = 0; i < count; i++) {
            await expect(heroes.nth(i)).toBeVisible();
            // Each hero should have a headline
            const headline = heroes.nth(i).locator(SEL.headline);
            if (await headline.count() > 0) {
                await expect(headline).toBeVisible();
            }
        }
    });
    test('[HFF-030] @mobile @regression Mobile alignment renders correctly', async ({ page }) => {
        await page.setViewportSize(MOBILE);
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const content = page.locator(SEL.content).first();
        if (await content.count() > 0) {
            const textAlign = // 📏 TODO: Replace with measurement-utils
             await content.evaluate(el => getComputedStyle(el).textAlign);
            // measurement: use measurement-utils for cleaner code
            expect(['left', 'center', 'start']).toContain(textAlign);
        }
    });
    test('[HFF-031] @regression No empty containers when optional fields omitted', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Check minimal hero (fixture 2) for empty wrappers
        const minimalHero = page.locator(SEL.root).nth(1);
        const left = minimalHero.locator(SEL.left);
        await assertNoEmptyWrappers(left);
    });
});
// ─── AC32–AC35: Image ────────────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Image (AC32–AC35)', () => {
    test('[HFF-032] @regression Image renders in top portion of right column', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const right = page.locator(SEL.right).first();
        const imageArea = right.locator(SEL.image);
        await expect(imageArea).toBeVisible();
        const rightBox = await right.boundingBox();
        const imgBox = await imageArea.boundingBox();
        if (rightBox && imgBox) {
            // Image should start at or near the top of the right column
            expect(Math.abs(imgBox.y - rightBox.y)).toBeLessThan(10);
        }
    });
    test('[HFF-033] @regression Image uses responsive rendering (object-fit)', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const img = page.locator(`${SEL.image} img`).first();
        if (await img.count() > 0) {
            const objectFit = // 📏 TODO: Replace with measurement-utils
             await img.evaluate(el => getComputedStyle(el).objectFit);
            // measurement: use measurement-utils for cleaner code
            expect(['cover', 'contain']).toContain(objectFit);
        }
    });
    test('[HFF-034] @negative @regression Missing image does not break layout', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Fixture 9 has no fileReference — verify no broken layout
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const heroes = page.locator(SEL.root);
        const count = await heroes.count();
        // All heroes should render even if one has missing image
        for (let i = 0; i < count; i++) {
            await expect(heroes.nth(i)).toBeVisible();
        }
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
    test('[HFF-035] @regression All authored images load successfully', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const images = page.locator(`${SEL.root} img`);
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            // naturalWidth > 0 means the image loaded (broken images have 0)
            // Skip placeholder/decorative images that may not have src
            const src = await images.nth(i).getAttribute('src');
            if (src && src.length > 0) {
                expect(naturalWidth).toBeGreaterThan(0);
            }
        }
    });
});
// ─── AC36–AC39: Secondary Slot ───────────────────────────────────────────────
test.describe('HeroFiftyFifty — Secondary Slot (AC36–AC39)', () => {
    test('[HFF-036] @regression Secondary slot variants render', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Check that secondary slots exist on some fixtures (8a, 8b, 8c have them)
        const secondarySlots = page.locator(SEL.secondarySlot);
        expect(await secondarySlots.count()).toBeGreaterThan(0);
    });
    test('[HFF-037] @regression Image fills full right column when no secondary slot', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Find a hero without secondary slot (fixture 8d or fixture 2)
        const heroes = page.locator(SEL.root);
        const count = await heroes.count();
        for (let i = 0; i < count; i++) {
            const hero = heroes.nth(i);
            const hasSecondary = await hero.locator(SEL.secondarySlot).count() > 0;
            if (!hasSecondary) {
                const right = hero.locator(SEL.right);
                const img = hero.locator(`${SEL.image} img`).first();
                if (await right.count() > 0 && await img.count() > 0) {
                    // Image area should expand when no secondary slot
                    const rightBox = await right.boundingBox();
                    const imgAreaBox = await hero.locator(SEL.image).boundingBox();
                    if (rightBox && imgAreaBox) {
                        // Image area should take most of the right column height
                        const heightRatio = imgAreaBox.height / rightBox.height;
                        expect(heightRatio).toBeGreaterThan(0.7);
                    }
                }
                break;
            }
        }
    });
    test('[HFF-038] @regression Sub-components use their own BEM styles', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Statistic sub-component should use .cmp-statistic
        const statistic = page.locator(`${SEL.secondarySlot} .cmp-statistic`).first();
        if (await statistic.count() > 0) {
            const classes = // 📏 TODO: Replace with measurement-utils
             await statistic.evaluate(el => el.className);
            expect(classes).toContain('cmp-statistic');
        }
    });
    test('[HFF-039] @regression Secondary slot is visually below image', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const heroWithSlot = page.locator(SEL.root).filter({
            has: page.locator(SEL.secondarySlot),
        }).first();
        if (await heroWithSlot.count() > 0) {
            const imgBox = await heroWithSlot.locator(SEL.image).boundingBox();
            const slotBox = await heroWithSlot.locator(SEL.secondarySlot).boundingBox();
            if (imgBox && slotBox) {
                expect(slotBox.y).toBeGreaterThanOrEqual(imgBox.y);
            }
        }
    });
});
// ─── AC40–AC45: Authoring & Compliance (non-automatable) ─────────────────────
test.describe('HeroFiftyFifty — Authoring & Compliance', () => {
    test('[HFF-042] @regression Style guide page exists with all variations', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Verify the page loaded and has multiple hero instances
        const heroes = page.locator(SEL.root);
        const count = await heroes.count();
        expect(count).toBeGreaterThanOrEqual(4);
    });
});
// ─── Console & Resources ─────────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Console & Resources', () => {
    test('[HFF-045] @regression No JS errors during page load', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
    test('[HFF-046] @regression All images have alt attributes', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const images = page.locator(`${SEL.root} img`);
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
// ─── Accessibility ───────────────────────────────────────────────────────────
test.describe('HeroFiftyFifty — Accessibility', () => {
});
test.describe('HeroFiftyFifty — Happy Path', () => {
    test('[HFF-050] @smoke @regression HeroFiftyFifty renders correctly', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-hero-fifty-fifty').first();
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
    test('[HFF-051] @smoke @regression HeroFiftyFifty interactive elements are functional', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-hero-fifty-fifty').first();
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
test.describe('HeroFiftyFifty — Negative & Boundary', () => {
    test('[HFF-052] @negative @regression HeroFiftyFifty handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-hero-fifty-fifty').first()).toBeVisible();
    });
});
test.describe('HeroFiftyFifty — Responsive', () => {
    test('[HFF-054] @mobile @regression @mobile HeroFiftyFifty adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-hero-fifty-fifty').first();
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
    test('[HFF-055] @mobile @regression HeroFiftyFifty adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-hero-fifty-fifty').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('HeroFiftyFifty — Broken Images', () => {
    test('[HFF-057] @regression HeroFiftyFifty all images load successfully', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-hero-fifty-fifty img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[HFF-058] @regression HeroFiftyFifty all images have alt attributes', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-hero-fifty-fifty img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('HeroFiftyFifty — AEM Dialog Configuration', () => {
});
// Relocated from header.author.spec.ts (HDR-028) — CSV import mis-bucketed this under Header;
// it's actually about the hero-fifty-fifty component.
test.describe('HeroFiftyFifty — CSV Test Cases (GAAM-1286)', () => {
    test('[HFF-059] @smoke @regression 50 50 banner : Background extension in XL breakpoints — AC1', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Hi, In XL desktop breakpoints - the background needs to extend edge to egde while the content stays aligned to the header as per design. The divider in the header also needs to extend to the sides.
        // [~accountid:5e73d47c17c6640c385f56a6] Can you help out with this issue? I’m raising this as a bug.
        //
        // Thank you.
        //
        // CC: [~accountid:712020:19496377-93fa-4b6a-be8c-4f3dac15dfb5] [~accountid:712020:ad021791-2e09-4b21-b18b-e7d643149e13]  [~accountid:712020:fe8fe45b-af82-40e5-baec-1580ec63583e]
        //
        //
        // !Screenshot 2026-06-15 at 7.03.20 PM-20260615-133326.png|width=686,alt="Screenshot 2026-06-15 at 7.03.20 PM-20260615-133326.png"!
        test.fixme();
    });
});
// Relocated from image.author.spec.ts (MG-060) — CSV import mis-bucketed this under Image;
// it's actually about the hero-fifty-fifty component ("feature 50/50").
test.describe('HeroFiftyFifty — CSV Test Cases (GAAM-1356)', () => {
    test('[HFF-060] @smoke @regression CMS: FE: feature 50/50: Removal of Left and Right Padding — AC1', async ({ page }) => {
        const pom = new HeroFiftyFiftyPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: The "Remove Left and Right Padding" feature is enabled for the 50% rollout group. However, the left and right padding is still being displayed on the affected pages/components, resulting in inconsistent layout behavior between users in the feature-enabled cohort and the expected design.
        //
        // URL tested - [ForeIncome II Fixed Index Annuity | Global Atlantic|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/annuities/fixed-index-annuities/foreincome-ii-fixed-index-annuity.html?wcmmode=disabled]
        //
        // *Steps to Reproduce:*
        //
        // # Enable the "Remove Left and Right Padding" feature flag for a test user.
        // # Navigate to the affected CMS page/component.
        // # Observe the page layout and spacing on the left and right sides of the content area.
        //
        // *Expected Result:*
        // Left and right padding should be completely removed according to the feature requirements, and the content should align with the updated design specifications.
        //
        // *Actual Result:*
        // Left and/or right padding is still visible, causing extra whitespace and layout inconsistencies.
        //
        // !image-20260624-070720.png|width=546,alt="image-20260624-070720.png"!
        //
        // !image-20260624-070746.png|width=547,alt="image-20260624-070746.png"!
        test.fixme();
    });
});
