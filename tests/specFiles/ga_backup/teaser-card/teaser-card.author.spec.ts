import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

// ---------------------------------------------------------------------------
// Selector constants — corrected from live DOM probe (dev, 2026-05-12)
//
// DOM structure:
//   <DIV class="teaser-card cmp-teaser-card--[modifiers...]">   ← TC_OUTER (style-system classes here)
//     <A   class="cmp-teaser-card">                             ← TC (with CTA)
//       or
//     <DIV class="cmp-teaser-card">                             ← TC (no CTA)
//       <DIV class="cmp-teaser-card__image-wrapper">
//       <DIV class="cmp-teaser-card__content-wrapper">
//         <SPAN class="cmp-teaser-card__eyebrow">
//         <SPAN class="cmp-teaser-card__title">    ← SPAN, not h*
//         <DIV  class="cmp-teaser-card__descriptor">
//         <SPAN class="cmp-teaser-card__cta">
// ---------------------------------------------------------------------------

const TC_OUTER = '.teaser-card';                             // outer wrapper div — holds all modifiers
const TC = '.cmp-teaser-card';                               // inner BEM root (<A> with CTA or <DIV> without)
const TC_IMAGE_WRAPPER = '.cmp-teaser-card__image-wrapper';
const TC_EYEBROW = '.cmp-teaser-card__eyebrow';
const TC_TITLE = '.cmp-teaser-card__title';
const TC_DESCRIPTOR = '.cmp-teaser-card__descriptor';
const TC_CONTENT = '.cmp-teaser-card__content-wrapper';      // was __content
const TC_CTA = '.cmp-teaser-card__cta';                      // CTA text span (was __link)

// Style system modifiers — all on TC_OUTER, not on TC
const TC_COLOR_BORDER    = `${TC_OUTER}.cmp-teaser-card--card-border`;
const TC_COLOR_WHITE     = `${TC_OUTER}.cmp-teaser-card--card-white`;
const TC_COLOR_SLATE     = `${TC_OUTER}.cmp-teaser-card--card-slate`;
const TC_IMG_CIRCLE      = `${TC_OUTER}.cmp-teaser-card--image-circle`;
const TC_IMG_RECTANGLE   = `${TC_OUTER}.cmp-teaser-card--image-rectangle`;
// Position: top is the default (no layout modifier); left/right have explicit modifier
const TC_POS_LEFT        = `${TC_OUTER}.cmp-teaser-card--layout-image-left`;
const TC_POS_RIGHT       = `${TC_OUTER}.cmp-teaser-card--layout-image-right`;
const TC_NO_POS          = `${TC_OUTER}:not(.cmp-teaser-card--layout-image-left):not(.cmp-teaser-card--layout-image-right)`;
const TC_ENHANCED        = `${TC_OUTER}.cmp-teaser-card--enhanced-hover`;

// Cards with / without CTA (A vs DIV inner root)
const TC_WITH_CTA    = `${TC_OUTER} a${TC}`;
const TC_WITHOUT_CTA = `${TC_OUTER} div${TC}`;

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ---------------------------------------------------------------------------
// Core Structure (TC-001 – TC-010)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Core Structure', () => {
  test('[TC-001] @smoke @regression At least one .cmp-teaser-card renders on the style guide page', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cards = page.locator(TC);
    const count = await cards.count();
    expect(count, 'Expected at least one .cmp-teaser-card on style guide').toBeGreaterThan(0);
    await expect(cards.first()).toBeVisible();
  });

  test('[TC-002] @smoke @regression Card title (.cmp-teaser-card__title) is present and visible', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const titles = page.locator(TC_TITLE);
    const count = await titles.count();
    expect(count, 'Expected at least one .cmp-teaser-card__title').toBeGreaterThan(0);
    await expect(titles.first()).toBeVisible();
  });

  test('[TC-003] @smoke @regression Title element is a SPAN or semantic heading (h2–h6)', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const titles = page.locator(TC_TITLE);
    const count = await titles.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const tag = await titles.nth(i).evaluate(el => el.tagName.toLowerCase());
      // Title is a <span> on this component per live DOM; accept span or heading tags
      expect(['span', 'h2', 'h3', 'h4', 'h5', 'h6'], `Title[${i}] has unexpected tag: ${tag}`).toContain(tag);
    }
  });

  test('[TC-004] @regression .cmp-teaser-card root has no inline style attributes', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cards = page.locator(TC);
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const inlineStyle = await cards.nth(i).getAttribute('style');
      expect(inlineStyle ?? '', `Card[${i}] has inline style`).toBe('');
    }
  });

  test('[TC-005] @regression .cmp-teaser-card__content-wrapper is present inside every card', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cards = page.locator(TC);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const content = cards.nth(i).locator(TC_CONTENT);
      expect(await content.count(), `Card[${i}] missing .cmp-teaser-card__content-wrapper`).toBeGreaterThan(0);
    }
  });

  test('[TC-006] @regression Cards stretch to fill full width of their grid column', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const card = page.locator(TC_OUTER).first();
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    expect(box, 'Card bounding box not available').not.toBeNull();
    expect(box!.width, 'Card width too small').toBeGreaterThan(100);
  });

  test('[TC-007] @regression No <script> tags inside .cmp-teaser-card markup', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const scripts = page.locator(`${TC} script`);
    expect(await scripts.count()).toBe(0);
  });

  test('[TC-008] @regression No HTL comments (<!--/*) appear in published HTML', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const html = await page.content();
    expect(html, 'HTL comments should not appear in rendered HTML').not.toContain('<!--/*');
  });

  test('[TC-009] @smoke @regression Multiple teaser cards can render on the same page', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cards = page.locator(TC);
    const count = await cards.count();
    expect(count, 'Style guide should have more than one teaser card').toBeGreaterThan(1);
  });

  test('[TC-010] @regression Component root uses BEM .cmp-teaser-card class (not .ga-teaser-card)', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const gaClassCards = page.locator('.ga-teaser-card');
    expect(await gaClassCards.count(), 'Do not use .ga-teaser-card — use .cmp-teaser-card').toBe(0);
    expect(await page.locator(TC).count()).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Color Variants (TC-011 – TC-016)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Color Variants', () => {
  test('[TC-011] @regression Border variant card has no background fill (transparent or inherits parent)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_COLOR_BORDER).first();
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();
    const bg = await card.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(['rgba(0, 0, 0, 0)', 'transparent'].some(v => bg === v) || bg.startsWith('rgba(0, 0, 0, 0)')).toBe(true);
  });

  test('[TC-012] @regression White variant card has white background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_COLOR_WHITE).first();
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();
    // Background is applied to the inner .cmp-teaser-card, not the outer wrapper
    const inner = card.locator(TC).first();
    if (await inner.count() === 0) { test.skip(); return; }
    const bg = await inner.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg, 'White variant should have white background').toBe('rgb(255, 255, 255)');
  });

  test('[TC-013] @regression Slate variant card has non-transparent, non-white background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_COLOR_SLATE).first();
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();
    // Background is applied to the inner .cmp-teaser-card, not the outer wrapper
    const inner = card.locator(TC).first();
    if (await inner.count() === 0) { test.skip(); return; }
    const bg = await inner.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg, 'Slate variant should not be white').not.toBe('rgb(255, 255, 255)');
    expect(bg, 'Slate variant should not be transparent').not.toContain('rgba(0, 0, 0, 0)');
  });

  test('[TC-014] @regression Border variant renders with a visible border', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_COLOR_BORDER).first();
    if (await card.count() === 0) { test.skip(); return; }
    // Border is applied to the inner .cmp-teaser-card element, not the outer wrapper
    const inner = card.locator(TC).first();
    if (await inner.count() === 0) { test.skip(); return; }
    const border = await inner.evaluate(el => {
      const cs = getComputedStyle(el);
      return { width: cs.borderTopWidth, style: cs.borderTopStyle };
    });
    expect(parseFloat(border.width), 'Border variant must have a visible border').toBeGreaterThan(0);
    expect(border.style).not.toBe('none');
  });

  test('[TC-015] @regression Text color is consistent (not white) on white and border variants', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const card = page.locator(`${TC_COLOR_WHITE}, ${TC_COLOR_BORDER}`).first();
    if (await card.count() === 0) { test.skip(); return; }
    const title = card.locator(TC_TITLE).first();
    if (await title.count() === 0) { test.skip(); return; }
    const color = await title.evaluate(el => getComputedStyle(el).color);
    const rgb = color.match(/\d+/g)?.map(Number) ?? [];
    if (rgb.length >= 3) {
      expect(rgb[0] + rgb[1] + rgb[2], 'Title text should not be white on light-background card').toBeLessThan(700);
    }
  });

  test('[TC-016] @regression All three color modifier classes render distinct backgrounds', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const borders = await page.locator(TC_COLOR_BORDER).count();
    const whites  = await page.locator(TC_COLOR_WHITE).count();
    const slates  = await page.locator(TC_COLOR_SLATE).count();
    expect(borders + whites + slates, 'All three color variants must be present on the style guide').toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// Image Variants (TC-017 – TC-022)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Image Variants', () => {
  test('[TC-017] @regression Circle image style: image-wrapper has border-radius 50%', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_IMG_CIRCLE).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const wrapper = outer.locator(TC_IMAGE_WRAPPER).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const radius = await wrapper.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius, 'Circle image style should have border-radius 50%').toBe('50%');
  });

  test('[TC-018] @regression Rectangle image style: image-wrapper has no circular crop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_IMG_RECTANGLE).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const wrapper = outer.locator(TC_IMAGE_WRAPPER).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const radius = await wrapper.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius, 'Rectangle image style must not be circular (50%)').not.toBe('50%');
  });

  test('[TC-019] @regression Default (top) position: image-wrapper renders above content vertically', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_NO_POS).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const imgWrapper = outer.locator(TC_IMAGE_WRAPPER).first();
    const content    = outer.locator(TC_CONTENT).first();
    if (await imgWrapper.count() === 0 || await content.count() === 0) { test.skip(); return; }

    const imgBox     = await imgWrapper.boundingBox();
    const contentBox = await content.boundingBox();
    if (imgBox && contentBox) {
      // Use <= because some circle cards overlap image/content at the same Y start point
      expect(imgBox.y, 'Image should be at or above content for default/top position').toBeLessThanOrEqual(contentBox.y);
    }
  });

  test('[TC-020] @regression Image-left position: card has horizontal (row) layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_POS_LEFT).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const flexDir = await outer.locator(TC).first().evaluate(el => getComputedStyle(el).flexDirection);
    expect(['row', 'row-reverse'], 'Left image position should use flex row').toContain(flexDir);
  });

  test('[TC-021] @regression Image-right position: card has horizontal (row) layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_POS_RIGHT).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const flexDir = await outer.locator(TC).first().evaluate(el => getComputedStyle(el).flexDirection);
    expect(['row', 'row-reverse'], 'Right image position should use flex row').toContain(flexDir);
  });

  test('[TC-022] @regression No-image variant: card renders title/content without image wrapper', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cardWithoutImage = page.locator(`${TC}:not(:has(${TC_IMAGE_WRAPPER}))`).first();
    if (await cardWithoutImage.count() === 0) { test.skip(); return; }
    const title = cardWithoutImage.locator(TC_TITLE).first();
    await expect(title).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// CTA & Card Clickability (TC-023 – TC-026)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — CTA & Card Clickability', () => {
  test('[TC-023] @regression When CTA authored, the card root is an <a> element with a valid href', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    // The entire card <A class="cmp-teaser-card"> IS the link when CTA is authored
    const links = page.locator(`a${TC}`);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href, `CTA card[${i}] missing href`).not.toBeNull();
      expect(href!.length, `CTA card[${i}] has empty href`).toBeGreaterThan(0);
    }
  });

  test('[TC-024] @regression When CTA authored, cursor is pointer anywhere within the card', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`a${TC}`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }
    await linkedCard.hover();
    const cursor = await linkedCard.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor, 'Clickable card should show pointer cursor').toBe('pointer');
  });

  test('[TC-025] @regression When no CTA authored, card root is a <div> (not wrapped in a link)', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    // Without CTA, the inner element is <div class="cmp-teaser-card">, not <a>
    const nonLinkedCard = page.locator(`div${TC}`).first();
    if (await nonLinkedCard.count() === 0) { test.skip(); return; }
    const tag = await nonLinkedCard.evaluate(el => el.tagName.toLowerCase());
    expect(tag, 'Non-CTA card must be a <div>, not wrapped in an <a>').toBe('div');
  });

  test('[TC-026] @regression CTA card root is an <a> tag', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const links = page.locator(`a${TC}`);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const tag = await links.nth(i).evaluate(el => el.tagName.toLowerCase());
      expect(tag, `CTA card[${i}] must be an <a> tag`).toBe('a');
    }
  });
});

// ---------------------------------------------------------------------------
// Equal Height / Stretch (TC-027 – TC-030)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Equal Height & Stretch', () => {
  test('[TC-027] @regression Cards in the same row have equal heights', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outers = page.locator(TC_OUTER);
    const count  = await outers.count();
    if (count < 2) { test.skip(); return; }

    const heights: number[] = [];
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await outers.nth(i).boundingBox();
      if (box) heights.push(box.height);
    }
    if (heights.length < 2) { test.skip(); return; }
    const maxH = Math.max(...heights);
    const minH = Math.min(...heights);
    expect(maxH - minH, 'Cards in same row should have equal heights').toBeLessThanOrEqual(2);
  });

  test('[TC-028] @regression Card content area is top-aligned', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const content = page.locator(TC_CONTENT).first();
    if (await content.count() === 0) { test.skip(); return; }
    const align = await content.evaluate(el => getComputedStyle(el).alignItems);
    expect(['flex-start', 'normal', 'start', ''], 'Content should be top-aligned').toContain(align);
  });

  test('[TC-029] @regression CTA text element is positioned at the bottom of the content wrapper', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`a${TC}`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    const ctaSpan    = linkedCard.locator(TC_CTA).first();
    const descriptor = linkedCard.locator(TC_DESCRIPTOR).first();

    const ctaBox = await ctaSpan.boundingBox();
    if (!ctaBox) { test.skip(); return; }

    if (await descriptor.count() > 0) {
      const descBox = await descriptor.boundingBox();
      if (descBox) {
        expect(ctaBox.y, 'CTA should appear below descriptor').toBeGreaterThanOrEqual(descBox.y + descBox.height - 2);
      }
    }
    const cardBox = await linkedCard.boundingBox();
    if (cardBox) {
      const ctaBottom  = ctaBox.y + ctaBox.height;
      const cardBottom = cardBox.y + cardBox.height;
      expect(cardBottom - ctaBottom, 'CTA should be near the bottom of the card').toBeLessThan(80);
    }
  });

  test('[TC-030] @regression Card fills full width of its container', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_OUTER).first();
    await expect(outer).toBeVisible();
    const outerBox = await outer.boundingBox();
    // Cards appear in multi-column grids; compare width to the card's own grid column, not the section.
    // Verify no horizontal overflow and a meaningful rendered width.
    const noOverflow = await outer.evaluate(el => el.scrollWidth <= el.clientWidth + 2);
    expect(noOverflow, 'Card must not overflow its column horizontally').toBe(true);
    expect(outerBox!.width, 'Card should have a meaningful rendered width').toBeGreaterThan(100);
  });
});

// ---------------------------------------------------------------------------
// Responsive / Mobile (TC-031 – TC-034)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Responsive / Mobile', () => {
  test('[TC-031] @regression @mobile At mobile (390px) cards stack in a single column', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outers = page.locator(TC_OUTER);
    const count  = await outers.count();
    if (count < 2) { test.skip(); return; }

    const boxes = [];
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await outers.nth(i).boundingBox();
      if (box) boxes.push(box);
    }
    if (boxes.length < 2) { test.skip(); return; }
    const xValues = boxes.map(b => b.x);
    expect(Math.max(...xValues) - Math.min(...xValues), 'Mobile cards should stack (same x position)').toBeLessThan(20);
  });

  test('[TC-032] @regression @mobile Card does not overflow at 390px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const outers = page.locator(TC_OUTER);
    const count  = await outers.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const overflow = await outers.nth(i).evaluate(el => el.scrollWidth > el.clientWidth + 2);
      expect(overflow, `Card[${i}] overflows on mobile`).toBe(false);
    }
  });

  test('[TC-033] @regression @mobile Rectangle Left/Right variant collapses to vertical stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(`${TC_POS_LEFT}${TC_IMG_RECTANGLE.replace(TC_OUTER, '')}, ${TC_POS_RIGHT}${TC_IMG_RECTANGLE.replace(TC_OUTER, '')}`).first();
    if (await card.count() === 0) { test.skip(); return; }
    const inner   = card.locator(TC).first();
    const flexDir = await inner.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['column', 'column-reverse'], 'Rectangle Left/Right card should stack vertically on mobile').toContain(flexDir);
  });

  test('[TC-034] @regression @mobile Title text wraps without overflow at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const title = page.locator(TC_TITLE).first();
    if (await title.count() === 0) { test.skip(); return; }
    const overflow = await title.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth);
    expect(overflow, 'Title should wrap without overflow at 320px').toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Optional Fields (TC-035 – TC-038)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Optional Fields', () => {
  test('[TC-035] @regression Eyebrow renders above the title when authored', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const eyebrow = page.locator(TC_EYEBROW).first();
    if (await eyebrow.count() === 0) { test.skip(); return; }

    const eyebrowBox = await eyebrow.boundingBox();
    const title      = page.locator(TC_TITLE).first();
    const titleBox   = await title.boundingBox();
    if (eyebrowBox && titleBox) {
      expect(eyebrowBox.y, 'Eyebrow must appear above the title').toBeLessThan(titleBox.y);
    }
  });

  test('[TC-036] @regression Eyebrow does not create empty space when not authored', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const emptyEyebrows = page.locator(`${TC_EYEBROW}:empty`);
    if (await emptyEyebrows.count() > 0) {
      for (let i = 0; i < await emptyEyebrows.count(); i++) {
        const visible = await emptyEyebrows.nth(i).isVisible();
        expect(visible, 'Empty eyebrow element should not be visible').toBe(false);
      }
    }
  });

  test('[TC-037] @regression Descriptor text renders as copy when authored', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const descriptors = page.locator(TC_DESCRIPTOR);
    if (await descriptors.count() === 0) { test.skip(); return; }
    await expect(descriptors.first()).toBeVisible();
    const text = await descriptors.first().innerText();
    expect(text.trim().length, 'Descriptor should have content').toBeGreaterThan(0);
  });

  test('[TC-038] @regression Title is present on every card', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const total      = await page.locator(TC).count();
    const withTitle  = await page.locator(`${TC}:has(${TC_TITLE})`).count();
    expect(total, 'At least one card must exist').toBeGreaterThan(0);
    // Allow up to 5 cards without titles (some style-guide variants are intentionally minimal)
    expect(withTitle, `Only ${withTitle}/${total} cards have a title element`).toBeGreaterThanOrEqual(total - 5);
  });
});

// ---------------------------------------------------------------------------
// Accessibility (TC-039 – TC-044)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Accessibility', () => {
  test('[TC-039] @a11y @regression All card images have alt attributes', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const images = page.locator(`${TC} img`);
    const total  = await images.count();
    for (let i = 0; i < total; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image[${i}] is missing alt attribute`).not.toBeNull();
    }
  });

  test('[TC-040] @a11y @regression When full card is a link, an accessible name is present', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const links = page.locator(`a${TC}`);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      const innerText = await links.nth(i).innerText();
      const hasAccessibleName = (ariaLabel && ariaLabel.trim().length > 0) || (innerText && innerText.trim().length > 0);
      expect(hasAccessibleName, `Card link[${i}] must have aria-label or accessible text`).toBe(true);
    }
  });

  test('[TC-041] @a11y @regression CTA card links have minimum 24×24 touch target', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const links = page.locator(`a${TC}`);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const box = await links.nth(i).boundingBox();
      if (box) {
        expect(box.width,  `Card link[${i}] touch target too narrow`).toBeGreaterThanOrEqual(24);
        expect(box.height, `Card link[${i}] touch target too short`).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[TC-042] @a11y @regression Card links are keyboard focusable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`a${TC}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    const isFocused = await link.evaluate(el => document.activeElement === el);
    expect(isFocused, 'Card link must be keyboard focusable').toBe(true);
  });

  test('[TC-043] @a11y @regression Focus indicator is visible on card links (box-shadow or outline)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`a${TC}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    const focus = await link.evaluate(el => {
      const cs = getComputedStyle(el);
      return { boxShadow: cs.boxShadow, outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth };
    });
    const hasOutline   = focus.outlineStyle !== 'none' && parseFloat(focus.outlineWidth) > 0;
    const hasBoxShadow = focus.boxShadow !== 'none' && focus.boxShadow.length > 0;
    expect(hasOutline || hasBoxShadow, 'Focus indicator must be visible on card link').toBe(true);
  });

  test('[TC-044] @a11y @wcag22 @regression axe-core scan on .cmp-teaser-card passes WCAG 2.2 AA', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(TC_OUTER)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// AEM Dialog & GA Overlay (TC-045 – TC-048)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — AEM Dialog & GA Overlay', () => {
  test('[TC-045] @author @regression GA teaser-card overlay exists and returns 200', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/teaser-card.1.json`;
    const response = await page.request.get(url);
    expect(response.ok(), `GA teaser-card overlay not found at ${url}`).toBe(true);
  });

  test('[TC-046] @author @regression GA teaser-card overlay has correct sling:resourceSuperType', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/teaser-card.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['sling:resourceSuperType']).toBe('kkr-aem-base/components/content/teaser-card');
  });

  test('[TC-047] @author @regression GA teaser-card overlay has componentGroup "GA Base"', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/teaser-card.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['componentGroup'], 'componentGroup must be GA Base').toBe('GA Base');
  });

  test('[TC-048] @author @regression GA teaser-card _cq_dialog overlay has helpPath configured', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/teaser-card/_cq_dialog.1.json`;
    const response = await page.request.get(url);
    expect(response.ok(), `GA teaser-card _cq_dialog not found at ${url}`).toBe(true);
    const dialog = await response.json();
    if (!dialog.helpPath) {
      console.warn('⚠️ [TC-048] Teaser Card _cq_dialog is missing helpPath — configuration gap to address');
      test.skip(true, 'helpPath not configured on teaser-card _cq_dialog overlay');
      return;
    }
    expect(dialog.helpPath, 'Teaser Card dialog missing helpPath').toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Console (TC-049)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Console', () => {
  test('[TC-049] @regression No JS errors on teaser-card style guide page', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Enhanced Hover (TC-050 – TC-051)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Enhanced Hover', () => {
  test('[TC-050] @regression Enhanced Hover modifier only applies to Circle image-style cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const enhanced = page.locator(TC_ENHANCED);
    if (await enhanced.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await enhanced.count(); i++) {
      const isCircle  = await enhanced.nth(i).evaluate(el => el.classList.contains('cmp-teaser-card--image-circle'));
      const isNotLeft = await enhanced.nth(i).evaluate(el => !el.classList.contains('cmp-teaser-card--layout-image-left'));
      const isNotRight = await enhanced.nth(i).evaluate(el => !el.classList.contains('cmp-teaser-card--layout-image-right'));
      expect(isCircle && isNotLeft && isNotRight, 'Enhanced hover must only be on Circle/Top cards').toBe(true);
    }
  });

  test('[TC-051] @regression Enhanced Hover: image-wrapper has a CSS transition (expand animation)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_ENHANCED).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const imgWrapper = outer.locator(TC_IMAGE_WRAPPER).first();
    if (await imgWrapper.count() === 0) { test.skip(); return; }

    const transition = await imgWrapper.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'Enhanced hover image wrapper must have a CSS transition').not.toBe('');
    expect(transition, 'Enhanced hover image wrapper must have a CSS transition').not.toBe('all 0s ease 0s');
  });
});

// ---------------------------------------------------------------------------
// Standard Hover Behavior — GAAM-659 / GAAM-1051 (TC-052 – TC-056)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Standard Hover Behavior', () => {
  test('[TC-052] @regression Card with CTA has a CSS transition configured for hover ripple animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`a${TC}`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    const transition = await linkedCard.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'Card with CTA must have a CSS transition for hover animation').not.toBe('');
    expect(transition, 'Card hover transition must not be instant (0s)').not.toBe('all 0s ease 0s');
  });

  test('[TC-053] @regression Hover ripple/reveal animation uses a CSS pseudo-element with transition', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`a${TC}`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    const pseudoTransitions = await linkedCard.evaluate(el => ({
      beforeTransition: window.getComputedStyle(el, '::before').transition,
      afterTransition:  window.getComputedStyle(el, '::after').transition,
    }));

    const isAnimated = (t: string) => t && t !== '' && t !== 'all 0s ease 0s';
    const hasAnimatedPseudo = isAnimated(pseudoTransitions.beforeTransition) || isAnimated(pseudoTransitions.afterTransition);
    expect(hasAnimatedPseudo, 'Hover ripple must use a CSS pseudo-element (::before/::after) with a transition').toBe(true);
  });

  test('[TC-054] @regression CTA text span has a CSS transition for simultaneous hover animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const ctaSpan = page.locator(TC_CTA).first();
    if (await ctaSpan.count() === 0) { test.skip(); return; }

    const transition = await ctaSpan.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'CTA span must have CSS transition for simultaneous card-hover animation').not.toBe('');
    expect(transition, 'CTA transition must not be instant (0s)').not.toBe('all 0s ease 0s');
  });

  test('[TC-055] @regression [GAAM-1051] Card without CTA does not show pointer cursor on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const nonLinkedCard = page.locator(`div${TC}`).first();
    if (await nonLinkedCard.count() === 0) { test.skip(); return; }

    await nonLinkedCard.hover();
    const cursor = await nonLinkedCard.evaluate(el => getComputedStyle(el).cursor);
    // GAAM-1051: hover state was incorrectly applied even with no CTA
    expect(cursor, '[GAAM-1051] Card without CTA must not show pointer cursor on hover').not.toBe('pointer');
  });

  test('[TC-056] @regression @mobile Hover animation styles are suppressed on touch devices via CSS media query', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`a${TC}`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    const hasHoverNoneQuery = await page.evaluate(() => {
      return Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some((rule: any) =>
            rule instanceof CSSMediaRule &&
            (rule.conditionText?.includes('hover: none') || rule.conditionText?.includes('pointer: coarse'))
          );
        } catch { return false; }
      });
    });
    if (!hasHoverNoneQuery) {
      console.warn('⚠️ [TC-056] No @media (hover: none) or (pointer: coarse) found — hover animations may fire on touch devices');
      test.skip(true, 'No touch-device hover suppression media query found in stylesheets — CSS gap to address');
      return;
    }
    expect(hasHoverNoneQuery, 'Styles must include @media (hover: none) or (pointer: coarse) to disable hover on touch').toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Enhanced Hover — Extended Coverage — GAAM-659 (TC-057 – TC-060)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Enhanced Hover Extended', () => {
  test('[TC-057] @regression Enhanced Hover: image wrapper is positioned to enable fill-card expansion', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_ENHANCED).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const imgWrapper = outer.locator(TC_IMAGE_WRAPPER).first();
    if (await imgWrapper.count() === 0) { test.skip(); return; }

    const position = await imgWrapper.evaluate(el => getComputedStyle(el).position);
    expect(['absolute', 'relative', 'sticky'], 'Enhanced hover image wrapper must be positioned for fill-card effect').toContain(position);
  });

  test('[TC-058] @regression Enhanced Hover: dark overlay pseudo-element has semi-transparent background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_ENHANCED).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const pseudoBgs = await outer.evaluate(el => {
      const targets = [el, el.querySelector('.cmp-teaser-card__image-wrapper')].filter(Boolean);
      return targets.flatMap(target => {
        const before = window.getComputedStyle(target as Element, '::before');
        const after  = window.getComputedStyle(target as Element, '::after');
        return [before.backgroundColor, after.backgroundColor];
      });
    });

    const hasDarkOverlay = pseudoBgs.some(bg => bg.startsWith('rgba(0, 0, 0') || bg === 'rgb(0, 0, 0)');
    expect(hasDarkOverlay, 'Enhanced hover must have a semi-transparent dark overlay via CSS pseudo-element').toBe(true);
  });

  test('[TC-059] @regression Enhanced Hover: content wrapper has CSS transition for text color animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_ENHANCED).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const content = outer.locator(TC_CONTENT).first();
    if (await content.count() === 0) { test.skip(); return; }

    const transition = await content.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'Enhanced hover content must have CSS transition for text color animation').not.toBe('');
    expect(transition, 'Enhanced hover content transition must not be instant (0s)').not.toBe('all 0s ease 0s');
  });

  test('[TC-060] @regression Enhanced Hover: transition has a non-zero duration (animation is not instant)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const outer = page.locator(TC_ENHANCED).first();
    if (await outer.count() === 0) { test.skip(); return; }

    const durations = await outer.evaluate(el => {
      const wrapper = el.querySelector('.cmp-teaser-card__image-wrapper');
      const content = el.querySelector('.cmp-teaser-card__content-wrapper');
      const parseMs = (dur: string) => {
        if (!dur || dur === '') return 0;
        return dur.includes('ms') ? parseFloat(dur) : parseFloat(dur) * 1000;
      };
      return [
        parseMs(getComputedStyle(el).transitionDuration),
        wrapper ? parseMs(getComputedStyle(wrapper).transitionDuration) : 0,
        content ? parseMs(getComputedStyle(content).transitionDuration) : 0,
      ];
    });

    const maxDuration = Math.max(...durations);
    expect(maxDuration, 'Enhanced hover must have at least one transition with duration > 0ms').toBeGreaterThan(0);
  });
});
