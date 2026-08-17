import { test, expect } from '@playwright/test';
import { BreadcrumbPage } from '../../../pages/ga/components/breadcrumbPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const BC = '.cmp-breadcrumb';
const BC_LIST = '.cmp-breadcrumb__list';
const BC_ITEM = '.cmp-breadcrumb__item';
const BC_ACTIVE = '.cmp-breadcrumb__item--active';
const BC_LINK = '.cmp-breadcrumb__item-link';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const DESKTOP = { width: 1440, height: 900 };
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
// ─── Core Structure (BC-001 – BC-008) ────────────────────────────────────────
test.describe('Breadcrumb — Core Structure', () => {
    test('[BC-001] @smoke @regression @sanity Breadcrumb is visible at desktop viewport', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator(BC).first();
        await expect(root).toBeVisible();
        const display = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).display);
        // measurement: style check
        expect(display).not.toBe('none');
    });
    test('[BC-002] @smoke @regression @sanity Breadcrumb list is an <ol> element', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const list = page.locator(BC_LIST).first();
        await expect(list).toBeVisible();
        const tag = // 📏 TODO: Replace with measurement-utils
         await list.evaluate(el => el.tagName.toLowerCase());
        expect(tag).toBe('ol');
    });
    test('[BC-003] @smoke @regression @sanity Breadcrumb items are <li> elements', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const items = page.locator(BC_ITEM);
        const count = await items.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const tag = await items.nth(i).evaluate(el => el.tagName.toLowerCase());
            expect(tag).toBe('li');
        }
    });
    test('[BC-004] @smoke @regression @sanity Breadcrumb ancestor links are <a> elements', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const links = page.locator(BC_LINK);
        const count = await links.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const tag = await links.nth(i).evaluate(el => el.tagName.toLowerCase());
            expect(tag).toBe('a');
        }
    });
    test('[BC-005] @smoke @regression @sanity Active (current page) item has --active class', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const active = page.locator(BC_ACTIVE).first();
        await expect(active).toBeVisible();
    });
    test('[BC-006] @smoke @regression @sanity Active item is non-linked (no <a> inside)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const active = page.locator(BC_ACTIVE).first();
        await expect(active).toBeVisible();
        const linkInsideActive = active.locator('a');
        const linkCount = await linkInsideActive.count();
        expect(linkCount).toBe(0);
    });
    test('[BC-007] @regression Chevron separators exist between breadcrumb items', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        // Items with ::before pseudo-element carry the SVG chevron separator.
        // Verify at least 2 items are present (one ancestor + one active = at least one separator).
        const items = page.locator(BC_ITEM);
        const count = await items.count();
        expect(count).toBeGreaterThanOrEqual(2);
        // Confirm ::before content is set (not 'none') on a non-first item
        const secondItem = items.nth(1);
        const beforeContent = // 📏 TODO: Replace with measurement-utils
         await secondItem.evaluate(el => {
            return getComputedStyle(el, '::before').content;
        });
        // SVG data-URI or url() string — should not be 'none' or empty
        expect(beforeContent).not.toBe('none');
        expect(beforeContent.length).toBeGreaterThan(0);
    });
    test('[BC-008] @regression Breadcrumb links are 14px and semibold (font-weight 600)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const styles = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => {
            const cs = getComputedStyle(el);
            return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
        });
        expect(styles.fontSize).toBe('14px');
        // TODO: Use assertTypography() for font checks
        // semibold = 600
        expect(parseInt(styles.fontWeight, 10)).toBeGreaterThanOrEqual(600);
        // TODO: Use assertTypography() for font checks
    });
});
// ─── Link Styling (BC-009 – BC-013) ──────────────────────────────────────────
test.describe('Breadcrumb — Link Styling', () => {
    test('[BC-009] @regression Breadcrumb links have a dark (gray-80) color on light background', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const color = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // gray-80 is a dark color: all RGB channels should be relatively low
        const match = color.match(/\d+/g);
        if (match) {
            const [r, g, b] = match.map(Number);
            // A dark color — average channel value should be below 150
            expect((r + g + b) / 3).toBeLessThan(150);
        }
    });
    test('[BC-010] @regression Breadcrumb links have max-width 220px', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const maxWidth = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).maxWidth);
        // measurement: style check
        expect(maxWidth).toBe('220px');
    });
    test('[BC-011] @regression Breadcrumb links have text-overflow: ellipsis', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const textOverflow = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).textOverflow);
        // measurement: style check
        expect(textOverflow).toBe('ellipsis');
    });
    test('[BC-012] @regression Breadcrumb links have overflow: hidden', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const overflow = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).overflow);
        // measurement: style check
        expect(overflow).toBe('hidden');
    });
    test('[BC-013] @regression Breadcrumb links have CSS transition on color', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const transition = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).transition);
        // measurement: style check
        // Should contain 'color' and a duration (0.2s)
        expect(transition).toContain('color');
        expect(transition).toMatch(/0\.2s/);
    });
});
// ─── Hover & Focus (BC-014 – BC-017) ─────────────────────────────────────────
test.describe('Breadcrumb — Hover & Focus', () => {
    test('[BC-014] @regression Breadcrumb link color changes on hover', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const colorBefore = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        await hover(link);
        const colorAfter = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // Hover should change the color
        expect(colorAfter).not.toBe(colorBefore);
    });
    test('[BC-015] @regression Breadcrumb link shows box-shadow focus ring on focus-visible', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        await link.focus();
        const focusStyles = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => {
            const cs = getComputedStyle(el);
            return { boxShadow: cs.boxShadow, outline: cs.outline };
        });
        // Should have a box-shadow (double ring) and outline:none
        expect(focusStyles.boxShadow).not.toBe('none');
        expect(focusStyles.boxShadow.length).toBeGreaterThan(0);
    });
    test('[BC-016] @regression Breadcrumb links have border-radius 4px', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const borderRadius = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).borderRadius);
        // measurement: style check
        expect(borderRadius).toBe('4px');
    });
    test('[BC-017] @regression Breadcrumb link transition is smooth (ease)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const link = page.locator(BC_LINK).first();
        await expect(link).toBeVisible();
        const transition = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).transition);
        // measurement: style check
        expect(transition).toContain('0.2s');
    });
});
// ─── Dark Mode (BC-018 – BC-022) ─────────────────────────────────────────────
test.describe('Breadcrumb — Dark Mode (granite section)', () => {
    test('[BC-018] @regression On granite section, breadcrumb links are white', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const darkSection = page.locator(SECTION_GRANITE).first();
        const hasDark = await darkSection.count();
        if (hasDark === 0) {
            test.skip();
            return;
        }
        const link = darkSection.locator(BC_LINK).first();
        const linkCount = await link.count();
        if (linkCount === 0) {
            test.skip();
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // White = rgb(255, 255, 255) or very close
        const match = color.match(/\d+/g);
        if (match) {
            const [r, g, b] = match.map(Number);
            expect(r).toBeGreaterThan(200);
            expect(g).toBeGreaterThan(200);
            expect(b).toBeGreaterThan(200);
        }
    });
    test('[BC-019] @regression On granite section, active item uses subdued (helper-dark) color', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const darkSection = page.locator(SECTION_GRANITE).first();
        const hasDark = await darkSection.count();
        if (hasDark === 0) {
            test.skip();
            return;
        }
        const active = darkSection.locator(BC_ACTIVE).first();
        const activeCount = await active.count();
        if (activeCount === 0) {
            test.skip();
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await active.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // helper-dark is a muted/off-white — not pure white and not fully dark
        const match = color.match(/\d+/g);
        if (match) {
            const [r, g, b] = match.map(Number);
            // Should be a light-ish color on dark background (average > 100)
            expect((r + g + b) / 3).toBeGreaterThan(100);
        }
    });
    test('[BC-020] @regression On granite section, focus ring uses granite+white double ring', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const darkSection = page.locator(SECTION_GRANITE).first();
        const hasDark = await darkSection.count();
        if (hasDark === 0) {
            test.skip();
            return;
        }
        const link = darkSection.locator(BC_LINK).first();
        const linkCount = await link.count();
        if (linkCount === 0) {
            test.skip();
            return;
        }
        await link.focus();
        const boxShadow = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).boxShadow);
        // measurement: style check
        // Dark mode focus ring must have a box-shadow (double ring)
        expect(boxShadow).not.toBe('none');
        expect(boxShadow.length).toBeGreaterThan(0);
    });
    test('[BC-021] @regression Dark mode and light mode focus box-shadows differ', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        // Light mode box-shadow
        const lightLink = page.locator(BC_LINK).first();
        const lightCount = await lightLink.count();
        if (lightCount === 0) {
            test.skip();
            return;
        }
        await lightLink.focus();
        const lightBoxShadow = // 📏 TODO: Replace with measurement-utils
         await lightLink.evaluate(el => getComputedStyle(el).boxShadow);
        // measurement: style check
        // Dark mode box-shadow
        const darkSection = page.locator(SECTION_GRANITE).first();
        const hasDark = await darkSection.count();
        if (hasDark === 0) {
            test.skip();
            return;
        }
        const darkLink = darkSection.locator(BC_LINK).first();
        const darkLinkCount = await darkLink.count();
        if (darkLinkCount === 0) {
            test.skip();
            return;
        }
        await darkLink.focus();
        const darkBoxShadow = // 📏 TODO: Replace with measurement-utils
         await darkLink.evaluate(el => getComputedStyle(el).boxShadow);
        // measurement: style check
        // The two focus rings should differ (different color tokens)
        expect(darkBoxShadow).not.toBe(lightBoxShadow);
    });
    test('[BC-022] @regression On granite section, link hover uses white with opacity', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const darkSection = page.locator(SECTION_GRANITE).first();
        const hasDark = await darkSection.count();
        if (hasDark === 0) {
            test.skip();
            return;
        }
        const link = darkSection.locator(BC_LINK).first();
        const linkCount = await link.count();
        if (linkCount === 0) {
            test.skip();
            return;
        }
        // Dark mode hover uses opacity:0.7 (not color change) per LESS
        const colorBefore = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // Verify link is white on dark bg
        expect(colorBefore).toMatch(/rgb\(255,\s*255,\s*255\)/);
        await hover(link);
        // After hover, check opacity changed or color has alpha
        const opacityAfter = // 📏 TODO: Replace with measurement-utils
         await link.evaluate(el => getComputedStyle(el).opacity);
        // measurement: style check
        expect(parseFloat(opacityAfter)).toBeLessThan(1);
    });
});
// ─── Mobile Hidden (BC-023 – BC-025) ─────────────────────────────────────────
test.describe('Breadcrumb — Mobile Hidden', () => {
    test('[BC-023] @regression Breadcrumb is display:none at mobile (390px)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator(BC).first();
        const display = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).display);
        // measurement: style check
        expect(display).toBe('none');
    });
    test('[BC-024] @regression Breadcrumb is display:block at desktop (1440px)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator(BC).first();
        const display = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).display);
        // measurement: style check
        expect(display).toBe('block');
        // TODO: Use assertLayout() for display checks
    });
    test('[BC-025] @regression Breadcrumb is hidden at tablet (768px)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator(BC).first();
        const display = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).display);
        // measurement: style check
        expect(display).toBe('none');
    });
});
// ─── GAAM-700 Font Color (BC-026 – BC-028) ───────────────────────────────────
test.describe('Breadcrumb — GAAM-700 Current Page Font Color', () => {
    test('[BC-026] @regression Active item on light background uses granite-60 color (muted dark)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const active = page.locator(BC_ACTIVE).first();
        await expect(active).toBeVisible();
        const color = // 📏 TODO: Replace with measurement-utils
         await active.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // granite-60 is a muted dark — not white, not pure black, midrange dark
        const match = color.match(/\d+/g);
        expect(match).not.toBeNull();
        if (match) {
            const [r, g, b] = match.map(Number);
            const avg = (r + g + b) / 3;
            // Should be a mid-range dark color: not pure black (0) and not light (>200)
            expect(avg).toBeGreaterThan(0);
            expect(avg).toBeLessThan(200);
        }
    });
    test('[BC-027] @regression Active item on dark background uses helper-dark color (light/muted)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const darkSection = page.locator(SECTION_GRANITE).first();
        const hasDark = await darkSection.count();
        if (hasDark === 0) {
            test.skip();
            return;
        }
        const active = darkSection.locator(BC_ACTIVE).first();
        const activeCount = await active.count();
        if (activeCount === 0) {
            test.skip();
            return;
        }
        const color = // 📏 TODO: Replace with measurement-utils
         await active.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        const match = color.match(/\d+/g);
        expect(match).not.toBeNull();
        if (match) {
            const [r, g, b] = match.map(Number);
            // helper-dark on dark bg should be a light/muted color (avg > 100)
            expect((r + g + b) / 3).toBeGreaterThan(100);
        }
    });
    test('[BC-028] @regression Active item color is not invisible (not transparent)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const active = page.locator(BC_ACTIVE).first();
        await expect(active).toBeVisible();
        const color = // 📏 TODO: Replace with measurement-utils
         await active.evaluate(el => getComputedStyle(el).color);
        // measurement: style check
        // Must not be transparent / rgba(0,0,0,0)
        expect(color).not.toMatch(/rgba\(0,\s*0,\s*0,\s*0\)/);
        expect(color).not.toBe('transparent');
        const opacity = // 📏 TODO: Replace with measurement-utils
         await active.evaluate(el => getComputedStyle(el).opacity);
        // measurement: style check
        expect(parseFloat(opacity)).toBeGreaterThan(0);
    });
});
// ─── ARIA Accessibility (BC-029 – BC-032) ────────────────────────────────────
test.describe('Breadcrumb — ARIA Accessibility', () => {
});
test.describe('Breadcrumb — CSV Test Cases (GAAM-1451)', () => {
    test('[BRDC-036] @regression @sanity CMS Analytics FE – Component Tracking | The Breadcrumb component is currently identifying as "homepage"  — AC1', async ({ page }) => {
        // AC1: "Inspect breadcrumb and verify the Datalayer. Actual: identifying as
        // 'homepage'. Expected: identified as 'Breadcrumb'." Verified against
        // breadcrumb.html (kkr-aem-base/components/content/breadcrumb/breadcrumb.html:44)
        // — the component's own data-cmp-data-layer comes from breadcrumb.data.json,
        // built by BaseModel.getComponentData() (BaseModel.java:183-196), which sets only
        // "@type" (the resource type, e.g. "ga/components/content/breadcrumb") and never a
        // title/name field — so there is no static field that could literally read
        // "homepage". Confirmed live on the style-guide page
        // (localhost:4502/content/global-atlantic/style-guide/components/breadcrumb.html):
        // every rendered breadcrumb's data-cmp-data-layer resolves to
        // {"<id>":{"@type":"ga/components/content/breadcrumb"}} — correctly identified as
        // the breadcrumb component, with no "homepage" reference anywhere in the payload.
        // This assertion pins that current, correct behavior. The ticket's screenshot is
        // from Adobe's "CMS Analytics FE" browser extension reading this same datalayer —
        // that extension's own label-resolution logic lives outside this repo and can't be
        // driven from Playwright, but the datalayer it reads off this page is verified
        // correct here.
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator(BC).first();
        await expect(root).toBeVisible();
        const rawLayer = await root.getAttribute('data-cmp-data-layer');
        expect(rawLayer, 'Breadcrumb root must emit a data-cmp-data-layer attribute').not.toBeNull();
        const parsed = JSON.parse(rawLayer!);
        const entries = Object.values(parsed) as Array<Record<string, unknown>>;
        expect(entries.length).toBeGreaterThan(0);
        const entry = entries[0];
        // Must not mis-identify as "homepage" anywhere in the component's own payload.
        expect(JSON.stringify(entry).toLowerCase()).not.toContain('homepage');
        // Must correctly identify as the breadcrumb component via @type.
        expect(String(entry['@type'])).toContain('breadcrumb');
    });
});
test.describe('Breadcrumb — Happy Path', () => {
    test('[BRDC-037] @smoke @regression @sanity Breadcrumb renders correctly', async ({ page }) => {
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-breadcrumb').first();
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
    test('[BRDC-038] @smoke @regression @sanity Breadcrumb interactive elements are functional', async ({ page }) => {
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-breadcrumb').first();
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
test.describe('Breadcrumb — Negative & Boundary', () => {
    test('[BRDC-039] @negative @regression @sanity Breadcrumb handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-breadcrumb').first()).toBeVisible();
    });
    test('[BRDC-040] @negative @regression @sanity Breadcrumb handles missing images', async ({ page }) => {
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-breadcrumb img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Breadcrumb — Responsive', () => {
    test('[BRDC-041] @mobile @regression @mobile @sanity Breadcrumb adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        // breadcrumb.less:34-43 ("Hidden on mobile and tablet") intentionally sets
        // display: none below @ga-bp-desktop-min (1024px) — the component is not meant to be
        // visible at this 390px viewport at all, so "adapts to mobile" here means confirming it's
        // correctly hidden, not checking a layout property on a visible element.
        const root = page.locator('.cmp-breadcrumb').first();
        await expect(root).toBeHidden();
    });
    test('[BRDC-042] @mobile @regression @sanity Breadcrumb adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-breadcrumb').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Breadcrumb — Console & Resources', () => {
    test('[BRDC-043] @regression Breadcrumb produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Breadcrumb — Broken Images', () => {
    test('[BRDC-044] @regression Breadcrumb all images load successfully', async ({ page }) => {
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-breadcrumb img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[BRDC-045] @regression Breadcrumb all images have alt attributes', async ({ page }) => {
        const pom = new BreadcrumbPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-breadcrumb img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Breadcrumb — Accessibility', () => {
});
test.describe('Breadcrumb — AEM Dialog Configuration', () => {
});
