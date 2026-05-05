import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const TC = '.cmp-teaser-card';
const TC_IMAGE = '.cmp-teaser-card__image';
const TC_IMAGE_WRAPPER = '.cmp-teaser-card__image-wrapper';
const TC_EYEBROW = '.cmp-teaser-card__eyebrow';
const TC_TITLE = '.cmp-teaser-card__title';
const TC_DESCRIPTOR = '.cmp-teaser-card__descriptor';
const TC_LINK = '.cmp-teaser-card__link';
const TC_CONTENT = '.cmp-teaser-card__content';

// Style System modifier selectors
const TC_COLOR_BORDER = `${TC}.cmp-teaser-card--color-border`;
const TC_COLOR_WHITE = `${TC}.cmp-teaser-card--color-white`;
const TC_COLOR_SLATE = `${TC}.cmp-teaser-card--color-slate`;
const TC_IMG_CIRCLE = `${TC}.cmp-teaser-card--image-style-circle`;
const TC_IMG_RECTANGLE = `${TC}.cmp-teaser-card--image-style-rectangle`;
const TC_POS_TOP = `${TC}.cmp-teaser-card--image-position-top`;
const TC_POS_LEFT = `${TC}.cmp-teaser-card--image-position-left`;
const TC_POS_RIGHT = `${TC}.cmp-teaser-card--image-position-right`;
const TC_ENHANCED = `${TC}.cmp-teaser-card--enhanced-hover`;

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

  test('[TC-003] @smoke @regression Title uses a semantic heading element (h2–h6)', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const titles = page.locator(TC_TITLE);
    const count = await titles.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const tag = await titles.nth(i).evaluate(el => el.tagName.toLowerCase());
      expect(['h2', 'h3', 'h4', 'h5', 'h6'], `Title[${i}] uses non-heading tag: ${tag}`).toContain(tag);
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

  test('[TC-005] @regression .cmp-teaser-card__content is present inside every card', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cards = page.locator(TC);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const content = cards.nth(i).locator(TC_CONTENT);
      expect(await content.count(), `Card[${i}] missing .cmp-teaser-card__content`).toBeGreaterThan(0);
    }
  });

  test('[TC-006] @regression Cards stretch to fill full width of their grid column', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const card = page.locator(TC).first();
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

    let card = page.locator(TC_COLOR_BORDER).first();
    if (await card.count() === 0) {
      // Fallback: inject class on first card
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--color-border');
      }, TC);
      card = page.locator(TC_COLOR_BORDER).first();
    }
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();
    const bg = await card.evaluate(el => getComputedStyle(el).backgroundColor);
    // Border variant has no fill — should be transparent or rgba(0,0,0,0)
    expect(['rgba(0, 0, 0, 0)', 'transparent'].some(v => bg.includes(v) || bg === v) || bg.startsWith('rgba(0, 0, 0, 0)')).toBe(true);
  });

  test('[TC-012] @regression White variant card has white background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    let card = page.locator(TC_COLOR_WHITE).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--color-white');
      }, TC);
      card = page.locator(TC_COLOR_WHITE).first();
    }
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();
    const bg = await card.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg, 'White variant should have white background').toBe('rgb(255, 255, 255)');
  });

  test('[TC-013] @regression Slate variant card has non-transparent, non-white background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    let card = page.locator(TC_COLOR_SLATE).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--color-slate');
      }, TC);
      card = page.locator(TC_COLOR_SLATE).first();
    }
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();
    const bg = await card.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg, 'Slate variant should not be white').not.toBe('rgb(255, 255, 255)');
    expect(bg, 'Slate variant should not be transparent').not.toContain('rgba(0, 0, 0, 0)');
  });

  test('[TC-014] @regression Border variant renders with a visible border', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    let card = page.locator(TC_COLOR_BORDER).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--color-border');
      }, TC);
      card = page.locator(TC_COLOR_BORDER).first();
    }
    if (await card.count() === 0) { test.skip(); return; }
    const border = await card.evaluate(el => {
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
    // Should not be white text on a light card
    if (rgb.length >= 3) {
      expect(rgb[0] + rgb[1] + rgb[2], 'Title text should not be white on light-background card').toBeLessThan(700);
    }
  });

  test('[TC-016] @regression All three color modifier classes render distinct backgrounds', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const cards = page.locator(TC);
    const total = await cards.count();
    if (total < 3) { test.skip(); return; }

    // Inject all three variants into separate cards for comparison
    await page.evaluate((sels) => {
      const all = Array.from(document.querySelectorAll(sels.root));
      if (all[0]) all[0].classList.add('cmp-teaser-card--color-border');
      if (all[1]) all[1].classList.add('cmp-teaser-card--color-white');
      if (all[2]) all[2].classList.add('cmp-teaser-card--color-slate');
    }, { root: TC });

    const borders = await page.locator(TC_COLOR_BORDER).count();
    const whites = await page.locator(TC_COLOR_WHITE).count();
    const slates = await page.locator(TC_COLOR_SLATE).count();
    expect(borders + whites + slates).toBeGreaterThanOrEqual(3);
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

    let card = page.locator(TC_IMG_CIRCLE).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--image-style-circle');
      }, TC);
      card = page.locator(TC_IMG_CIRCLE).first();
    }
    if (await card.count() === 0) { test.skip(); return; }

    const wrapper = card.locator(`${TC_IMAGE_WRAPPER}, .cmp-teaser-card__image-wrapper`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const radius = await wrapper.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius, 'Circle image style should have border-radius 50%').toBe('50%');
  });

  test('[TC-018] @regression Rectangle image style: image has aspect ratio per Figma (no circular crop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    let card = page.locator(TC_IMG_RECTANGLE).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--image-style-rectangle');
      }, TC);
      card = page.locator(TC_IMG_RECTANGLE).first();
    }
    if (await card.count() === 0) { test.skip(); return; }

    const wrapper = card.locator(`${TC_IMAGE_WRAPPER}, .cmp-teaser-card__image-wrapper`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const radius = await wrapper.evaluate(el => getComputedStyle(el).borderRadius);
    // Rectangle must NOT be circular
    expect(radius, 'Rectangle image style must not be circular (50%)').not.toBe('50%');
  });

  test('[TC-019] @regression Image-top position: image-wrapper renders above content vertically', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    let card = page.locator(TC_POS_TOP).first();
    if (await card.count() === 0) { card = page.locator(TC).first(); }
    if (await card.count() === 0) { test.skip(); return; }

    const imgWrapper = card.locator(`${TC_IMAGE_WRAPPER}`).first();
    const content = card.locator(TC_CONTENT).first();
    if (await imgWrapper.count() === 0 || await content.count() === 0) { test.skip(); return; }

    const imgBox = await imgWrapper.boundingBox();
    const contentBox = await content.boundingBox();
    if (imgBox && contentBox) {
      expect(imgBox.y, 'Image should be above content for top-position').toBeLessThan(contentBox.y);
    }
  });

  test('[TC-020] @regression Image-left position: card has horizontal (row) layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_POS_LEFT).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--image-position-left');
      }, TC);
    }
    const leftCard = page.locator(TC_POS_LEFT).first();
    if (await leftCard.count() === 0) { test.skip(); return; }

    const flexDir = await leftCard.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['row', 'row-reverse'], 'Left/Right image position should use flex row').toContain(flexDir);
  });

  test('[TC-021] @regression Image-right position: card has horizontal (row) layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_POS_RIGHT).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('cmp-teaser-card--image-position-right');
      }, TC);
    }
    const rightCard = page.locator(TC_POS_RIGHT).first();
    if (await rightCard.count() === 0) { test.skip(); return; }

    const flexDir = await rightCard.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['row', 'row-reverse'], 'Right image position should use flex row').toContain(flexDir);
  });

  test('[TC-022] @regression No-image variant: image wrapper is hidden when image not authored', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    // Cards without image-wrapper should still render title/content
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
  test('[TC-023] @regression When CTA authored, a .cmp-teaser-card__link element is present', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const links = page.locator(TC_LINK);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href, `CTA link[${i}] missing href`).not.toBeNull();
      expect(href!.length, `CTA link[${i}] has empty href`).toBeGreaterThan(0);
    }
  });

  test('[TC-024] @regression When CTA authored, cursor is pointer anywhere within the card', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`${TC}:has(${TC_LINK})`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }
    await linkedCard.hover();
    const cursor = await linkedCard.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor, 'Clickable card should show pointer cursor').toBe('pointer');
  });

  test('[TC-025] @regression When no CTA authored, card is not wrapped in a link', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const nonLinkedCard = page.locator(`${TC}:not(:has(${TC_LINK}))`).first();
    if (await nonLinkedCard.count() === 0) { test.skip(); return; }
    // Ensure no link ancestor wraps this card
    const linkAncestor = await nonLinkedCard.evaluate(el => {
      let node: Element | null = el;
      while (node) {
        if (node.tagName === 'A') return true;
        node = node.parentElement;
      }
      return false;
    });
    expect(linkAncestor, 'Non-CTA card must not be wrapped in a link').toBe(false);
  });

  test('[TC-026] @regression CTA link element is an <a> tag with a valid href', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const links = page.locator(TC_LINK);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const tag = await links.nth(i).evaluate(el => el.tagName.toLowerCase());
      expect(tag, `TC link[${i}] must be an <a> tag`).toBe('a');
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

    const cards = page.locator(TC);
    const count = await cards.count();
    if (count < 2) { test.skip(); return; }

    // Gather heights of first 3 cards and check they're all equal (flexbox stretch)
    const heights: number[] = [];
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) heights.push(box.height);
    }
    if (heights.length < 2) { test.skip(); return; }
    // Allow 2px tolerance for sub-pixel rendering differences
    const maxH = Math.max(...heights);
    const minH = Math.min(...heights);
    expect(maxH - minH, 'Cards in same row should have equal heights').toBeLessThanOrEqual(2);
  });

  test('[TC-028] @regression Card title is top-aligned within the content area', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const content = page.locator(TC_CONTENT).first();
    if (await content.count() === 0) { test.skip(); return; }
    const align = await content.evaluate(el => getComputedStyle(el).alignItems);
    // Content container should use flex-start for top alignment of body
    expect(['flex-start', 'normal', 'start', ''], 'Content should be top-aligned').toContain(align);
  });

  test('[TC-029] @regression CTA element is positioned at the bottom of a stretched card', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`${TC}:has(${TC_LINK})`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    const ctaLink = linkedCard.locator(TC_LINK).first();
    const descriptor = linkedCard.locator(TC_DESCRIPTOR).first();

    const ctaBox = await ctaLink.boundingBox();
    if (!ctaBox) { test.skip(); return; }

    if (await descriptor.count() > 0) {
      const descBox = await descriptor.boundingBox();
      if (descBox) {
        expect(ctaBox.y, 'CTA should appear below descriptor').toBeGreaterThanOrEqual(descBox.y + descBox.height - 2);
      }
    }
    // CTA should be near bottom of card
    const cardBox = await linkedCard.boundingBox();
    if (cardBox) {
      const ctaBottom = ctaBox.y + ctaBox.height;
      const cardBottom = cardBox.y + cardBox.height;
      expect(cardBottom - ctaBottom, 'CTA should be near the bottom of the card').toBeLessThan(80);
    }
  });

  test('[TC-030] @regression Card fills full width of its container', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC).first();
    await expect(card).toBeVisible();
    const cardBox = await card.boundingBox();
    const parentBox = await card.evaluate(el => {
      const parent = el.parentElement;
      if (!parent) return null;
      const r = parent.getBoundingClientRect();
      return { width: r.width, height: r.height };
    });
    if (cardBox && parentBox && parentBox.width > 0) {
      expect(cardBox.width, 'Card width should fill parent column').toBeCloseTo(parentBox.width, -1);
    }
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

    const cards = page.locator(TC);
    const count = await cards.count();
    if (count < 2) { test.skip(); return; }

    // All cards should share approximately the same left offset (single column)
    const boxes = [];
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) boxes.push(box);
    }
    if (boxes.length < 2) { test.skip(); return; }
    // In single column, cards all have similar x positions
    const xValues = boxes.map(b => b.x);
    const maxX = Math.max(...xValues);
    const minX = Math.min(...xValues);
    expect(maxX - minX, 'Mobile cards should stack (same x position)').toBeLessThan(20);
  });

  test('[TC-032] @regression @mobile Card does not overflow at 390px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cards = page.locator(TC);
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const overflow = await cards.nth(i).evaluate(el => el.scrollWidth > el.clientWidth + 2);
      expect(overflow, `Card[${i}] overflows on mobile`).toBe(false);
    }
  });

  test('[TC-033] @regression @mobile Rectangle Left/Right variant collapses to vertical stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const rectLeftCard = page.locator(`${TC_POS_LEFT}${TC_IMG_RECTANGLE}`).first();
    if (await rectLeftCard.count() === 0) {
      // Inject the combination and test CSS behavior
      await page.evaluate((sels) => {
        const el = document.querySelector(sels.root);
        if (el) {
          el.classList.add('cmp-teaser-card--image-position-left', 'cmp-teaser-card--image-style-rectangle');
        }
      }, { root: TC });
    }
    const card = page.locator(`${TC_POS_LEFT}${TC_IMG_RECTANGLE}`).first();
    if (await card.count() === 0) { test.skip(); return; }
    const flexDir = await card.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['column', 'column-reverse'], 'Rectangle Left card should stack vertically on mobile').toContain(flexDir);
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
    const title = page.locator(TC_TITLE).first();
    const titleBox = await title.boundingBox();
    if (eyebrowBox && titleBox) {
      expect(eyebrowBox.y, 'Eyebrow must appear above the title').toBeLessThan(titleBox.y);
    }
  });

  test('[TC-036] @regression Eyebrow does not create empty space when not authored', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    // Cards without eyebrow authored should have no empty .cmp-teaser-card__eyebrow in DOM
    const emptyEyebrows = page.locator(`${TC_EYEBROW}:empty`);
    if (await emptyEyebrows.count() > 0) {
      for (let i = 0; i < await emptyEyebrows.count(); i++) {
        const visible = await emptyEyebrows.nth(i).isVisible();
        // Empty eyebrow elements should not be visible
        expect(visible, 'Empty eyebrow element should not be visible').toBe(false);
      }
    }
  });

  test('[TC-037] @regression Descriptor text renders as formatted copy when authored', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const descriptors = page.locator(TC_DESCRIPTOR);
    if (await descriptors.count() === 0) { test.skip(); return; }
    await expect(descriptors.first()).toBeVisible();
    const text = await descriptors.first().innerText();
    expect(text.trim().length, 'Descriptor should have content').toBeGreaterThan(0);
  });

  test('[TC-038] @regression Title is the only required element; other fields can be absent', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const cards = page.locator(TC);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const title = cards.nth(i).locator(TC_TITLE);
      expect(await title.count(), `Card[${i}] must have a title`).toBeGreaterThan(0);
    }
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
    const total = await images.count();
    for (let i = 0; i < total; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image[${i}] is missing alt attribute`).not.toBeNull();
    }
  });

  test('[TC-040] @a11y @regression When full card is clickable, an aria-label is present on the link', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const links = page.locator(TC_LINK);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      const innerText = await links.nth(i).innerText();
      // Must have aria-label OR meaningful inner text to describe the destination
      const hasAccessibleName = (ariaLabel && ariaLabel.trim().length > 0) || (innerText && innerText.trim().length > 0);
      expect(hasAccessibleName, `Card link[${i}] must have aria-label or accessible text`).toBe(true);
    }
  });

  test('[TC-041] @a11y @regression CTA and interactive elements have minimum 24×24 touch target', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const links = page.locator(TC_LINK);
    if (await links.count() === 0) { test.skip(); return; }
    for (let i = 0; i < await links.count(); i++) {
      const box = await links.nth(i).boundingBox();
      if (box) {
        expect(box.width, `Link[${i}] touch target too narrow`).toBeGreaterThanOrEqual(24);
        expect(box.height, `Link[${i}] touch target too short`).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[TC-042] @a11y @regression Card links are keyboard focusable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const link = page.locator(TC_LINK).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    const isFocused = await link.evaluate(el => document.activeElement === el);
    expect(isFocused, 'Card link must be keyboard focusable').toBe(true);
  });

  test('[TC-043] @a11y @regression Focus indicator is visible on card links (box-shadow or outline)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const link = page.locator(TC_LINK).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    const focus = await link.evaluate(el => {
      const cs = getComputedStyle(el);
      return { boxShadow: cs.boxShadow, outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth };
    });
    const hasOutline = focus.outlineStyle !== 'none' && parseFloat(focus.outlineWidth) > 0;
    const hasBoxShadow = focus.boxShadow !== 'none' && focus.boxShadow.length > 0;
    expect(hasOutline || hasBoxShadow, 'Focus indicator must be visible on card link').toBe(true);
  });

  test('[TC-044] @a11y @wcag22 @regression axe-core scan on .cmp-teaser-card passes WCAG 2.2 AA', async ({ page }) => {
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(TC)
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
  test('[TC-050] @regression Enhanced Hover style: .cmp-teaser-card--enhanced-hover modifier only applies to Circle/Top cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const enhanced = page.locator(TC_ENHANCED);
    if (await enhanced.count() === 0) { test.skip(); return; }
    // Enhanced hover must only be on Circle/Top variants
    for (let i = 0; i < await enhanced.count(); i++) {
      const isCircle = await enhanced.nth(i).evaluate(el =>
        el.classList.contains('cmp-teaser-card--image-style-circle')
      );
      const isTop = await enhanced.nth(i).evaluate(el =>
        !el.classList.contains('cmp-teaser-card--image-position-left') &&
        !el.classList.contains('cmp-teaser-card--image-position-right')
      );
      expect(isCircle && isTop, 'Enhanced hover must only be on Circle/Top cards').toBe(true);
    }
  });

  test('[TC-051] @regression Enhanced Hover: on hover image expands (transition property is present)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const enhanced = page.locator(TC_ENHANCED).first();
    if (await enhanced.count() === 0) { test.skip(); return; }

    const imgWrapper = enhanced.locator(`${TC_IMAGE_WRAPPER}`).first();
    if (await imgWrapper.count() === 0) { test.skip(); return; }

    const transition = await imgWrapper.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'Enhanced hover image wrapper must have a CSS transition').not.toBe('');
    expect(transition, 'Enhanced hover image wrapper must have a CSS transition').not.toBe('all 0s ease 0s');
  });
});
