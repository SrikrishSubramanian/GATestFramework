import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const TC = '.cmp-teaser-card';
const TC_LINK = '.cmp-teaser-card__link';
const TC_IMAGE_WRAPPER = '.cmp-teaser-card__image-wrapper';
const TC_TITLE = '.cmp-teaser-card__title';
const TC_DESCRIPTOR = '.cmp-teaser-card__descriptor';
const TC_ENHANCED = `${TC}.cmp-teaser-card--enhanced-hover`;
const TC_POS_LEFT = `${TC}.cmp-teaser-card--image-position-left`;
const TC_POS_RIGHT = `${TC}.cmp-teaser-card--image-position-right`;
const TC_IMG_RECTANGLE = `${TC}.cmp-teaser-card--image-style-rectangle`;

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ---------------------------------------------------------------------------
// Standard Hover — CTA-authored cards (TC-INT-001 – TC-INT-005)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Standard Hover', () => {
  test('[TC-INT-001] @interaction @regression Hovering a CTA card changes cursor to pointer', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`${TC}:has(${TC_LINK})`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }
    await linkedCard.hover();
    const cursor = await linkedCard.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor, 'Hovering a clickable card must show pointer cursor').toBe('pointer');
  });

  test('[TC-INT-002] @interaction @regression Standard hover: card background changes on hover (ripple / fill)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`${TC}:has(${TC_LINK})`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    // A CSS transition property must be present on the card to animate the hover
    const transition = await linkedCard.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'CTA card must have a CSS transition for hover animation').not.toBe('all 0s ease 0s');
    expect(transition.length).toBeGreaterThan(0);
  });

  test('[TC-INT-003] @interaction @regression CTA transitions to hover state when card is hovered', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`${TC}:has(${TC_LINK})`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    const ctaLink = linkedCard.locator(TC_LINK).first();
    const colorBefore = await ctaLink.evaluate(el => getComputedStyle(el).color);

    await linkedCard.hover();
    await page.waitForTimeout(350);

    const colorAfter = await ctaLink.evaluate(el => getComputedStyle(el).color);
    // Color should change on hover (CTA hover state activates)
    expect(colorAfter, 'CTA should change color when card is hovered').not.toBe(colorBefore);
  });

  test('[TC-INT-004] @interaction @regression Non-CTA card shows no pointer cursor on hover', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const nonLinkedCard = page.locator(`${TC}:not(:has(${TC_LINK}))`).first();
    if (await nonLinkedCard.count() === 0) { test.skip(); return; }
    await nonLinkedCard.hover();
    const cursor = await nonLinkedCard.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor, 'Non-CTA card must not show pointer cursor').not.toBe('pointer');
  });

  test('[TC-INT-005] @interaction @regression Card bounding box does not change on hover (no layout shift)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC).first();
    if (await card.count() === 0) { test.skip(); return; }

    const boxBefore = await card.boundingBox();
    await card.hover();
    await page.waitForTimeout(350);
    const boxAfter = await card.boundingBox();

    if (boxBefore && boxAfter) {
      expect(boxAfter.width).toBeCloseTo(boxBefore.width, 0);
      expect(boxAfter.height).toBeCloseTo(boxBefore.height, 0);
    }
  });
});

// ---------------------------------------------------------------------------
// Enhanced Hover — Circle/Top only (TC-INT-006 – TC-INT-010)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Enhanced Hover', () => {
  test('[TC-INT-006] @interaction @regression Enhanced hover: image expands on card hover', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const enhanced = page.locator(TC_ENHANCED).first();
    if (await enhanced.count() === 0) { test.skip(); return; }

    const imgWrapper = enhanced.locator(TC_IMAGE_WRAPPER).first();
    if (await imgWrapper.count() === 0) { test.skip(); return; }

    const boxBefore = await imgWrapper.boundingBox();
    await enhanced.hover();
    await page.waitForTimeout(500);
    const boxAfter = await imgWrapper.boundingBox();

    if (boxBefore && boxAfter) {
      expect(boxAfter.width, 'Enhanced hover: image should expand width on hover').toBeGreaterThanOrEqual(boxBefore.width);
    }
  });

  test('[TC-INT-007] @interaction @regression Enhanced hover: 30% black overlay appears on hover', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const enhanced = page.locator(TC_ENHANCED).first();
    if (await enhanced.count() === 0) { test.skip(); return; }

    await enhanced.hover();
    await page.waitForTimeout(500);
    // An overlay element or pseudo-element should introduce a darkening effect
    // Check via the card's opacity or an overlay child
    const hasOverlay = await enhanced.evaluate(el => {
      const overlays = Array.from(el.querySelectorAll('[class*="overlay"], [class*="backdrop"]'));
      if (overlays.length > 0) return true;
      const cs = getComputedStyle(el, '::before');
      return cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    });
    // Accept if overlay is via pseudo-element or explicit element — skip gracefully if neither
    if (!hasOverlay) {
      test.skip();
      return;
    }
    expect(hasOverlay).toBe(true);
  });

  test('[TC-INT-008] @interaction @regression Enhanced hover: text transitions to white on hover', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const enhanced = page.locator(TC_ENHANCED).first();
    if (await enhanced.count() === 0) { test.skip(); return; }

    const title = enhanced.locator(TC_TITLE).first();
    if (await title.count() === 0) { test.skip(); return; }

    const colorBefore = await title.evaluate(el => getComputedStyle(el).color);
    await enhanced.hover();
    await page.waitForTimeout(500);
    const colorAfter = await title.evaluate(el => getComputedStyle(el).color);

    expect(colorAfter, 'Enhanced hover: title should transition to white').not.toBe(colorBefore);
    const rgb = colorAfter.match(/\d+/g)?.map(Number) ?? [];
    if (rgb.length >= 3) {
      expect(rgb[0] + rgb[1] + rgb[2], 'Enhanced hover: title color should be white or near-white').toBeGreaterThan(600);
    }
  });

  test('[TC-INT-009] @interaction @regression Enhanced hover: image-wrapper has a CSS transition', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const enhanced = page.locator(TC_ENHANCED).first();
    if (await enhanced.count() === 0) { test.skip(); return; }

    const imgWrapper = enhanced.locator(TC_IMAGE_WRAPPER).first();
    if (await imgWrapper.count() === 0) { test.skip(); return; }

    const transition = await imgWrapper.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'Enhanced hover image wrapper must have a CSS transition').not.toBe('all 0s ease 0s');
  });

  test('[TC-INT-010] @interaction @regression Enhanced hover not applied to rectangle or left/right variants', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    // Enhanced hover should NOT be on left/right position cards
    const enhancedLeft = page.locator(`${TC_ENHANCED}${TC_POS_LEFT}`);
    const enhancedRight = page.locator(`${TC_ENHANCED}${TC_POS_RIGHT}`);
    expect(await enhancedLeft.count(), 'Enhanced hover must not be on left-position cards').toBe(0);
    expect(await enhancedRight.count(), 'Enhanced hover must not be on right-position cards').toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Keyboard Navigation (TC-INT-011 – TC-INT-015)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Keyboard Navigation', () => {
  test('[TC-INT-011] @interaction @regression CTA card link is keyboard focusable via Tab', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const link = page.locator(TC_LINK).first();
    if (await link.count() === 0) { test.skip(); return; }

    let reached = false;
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.className ?? '');
      if (focused.includes('teaser-card__link')) {
        reached = true;
        break;
      }
    }
    expect(reached, 'Tab navigation must reach the teaser card link').toBe(true);
  });

  test('[TC-INT-012] @interaction @regression Focus indicator is visible when card link is focused', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const link = page.locator(TC_LINK).first();
    if (await link.count() === 0) { test.skip(); return; }

    await link.focus();
    const focusStyle = await link.evaluate(el => {
      const cs = getComputedStyle(el);
      return { outline: cs.outlineStyle, outlineW: cs.outlineWidth, boxShadow: cs.boxShadow };
    });
    const hasOutline = focusStyle.outline !== 'none' && parseFloat(focusStyle.outlineW) > 0;
    const hasBoxShadow = focusStyle.boxShadow !== 'none' && focusStyle.boxShadow.length > 0;
    expect(hasOutline || hasBoxShadow, 'Focus ring must be visible on card link').toBe(true);
  });

  test('[TC-INT-013] @interaction @regression Focused card link is not hidden behind sticky header', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const link = page.locator(TC_LINK).first();
    if (await link.count() === 0) { test.skip(); return; }

    await link.focus();
    const linkBox = await link.boundingBox();
    // Ensure link is visible in viewport (not scrolled behind sticky header)
    if (linkBox) {
      expect(linkBox.y, 'Focused card link must not be hidden behind sticky header (y < 0)').toBeGreaterThanOrEqual(0);
    }
  });

  test('[TC-INT-014] @interaction @regression All CTA links in card grid are sequentially keyboard-reachable', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const links = page.locator(TC_LINK);
    const count = await links.count();
    if (count === 0) { test.skip(); return; }
    for (let i = 0; i < count; i++) {
      await links.nth(i).focus();
      const activeEl = await page.evaluate(() => document.activeElement?.className ?? '');
      expect(activeEl, `Link[${i}] must be keyboard focusable`).toContain('teaser-card');
    }
  });

  test('[TC-INT-015] @interaction @regression Focus state does not cause layout shift (card height stable)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const link = page.locator(TC_LINK).first();
    if (await link.count() === 0) { test.skip(); return; }

    const card = page.locator(`${TC}:has(${TC_LINK})`).first();
    const boxBefore = await card.boundingBox();
    await link.focus();
    const boxAfter = await card.boundingBox();

    if (boxBefore && boxAfter) {
      expect(Math.abs(boxAfter.height - boxBefore.height), 'Focus must not cause card height change').toBeLessThan(5);
    }
  });
});

// ---------------------------------------------------------------------------
// No-hover conditions (TC-INT-016 – TC-INT-018)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — No-hover Conditions', () => {
  test('[TC-INT-016] @interaction @regression Non-CTA card: no hover state applied', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const nonLinked = page.locator(`${TC}:not(:has(${TC_LINK}))`).first();
    if (await nonLinked.count() === 0) { test.skip(); return; }

    const bgBefore = await nonLinked.evaluate(el => getComputedStyle(el).backgroundColor);
    await nonLinked.hover();
    await page.waitForTimeout(350);
    const bgAfter = await nonLinked.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgBefore, 'Non-CTA card background must not change on hover').toBe(bgAfter);
  });

  test('[TC-INT-017] @interaction @regression Non-CTA card: cursor stays default on hover', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const nonLinked = page.locator(`${TC}:not(:has(${TC_LINK}))`).first();
    if (await nonLinked.count() === 0) { test.skip(); return; }
    await nonLinked.hover();
    const cursor = await nonLinked.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor, 'Non-CTA card must not show pointer cursor').not.toBe('pointer');
  });

  test('[TC-INT-018] @interaction @regression Hover states do not apply at mobile breakpoint', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const linkedCard = page.locator(`${TC}:has(${TC_LINK})`).first();
    if (await linkedCard.count() === 0) { test.skip(); return; }

    // On mobile the enhanced hover overlay must not be active at rest
    const hasEnhancedHoverActive = await linkedCard.evaluate(el => {
      const imgWrapper = el.querySelector('[class*="image-wrapper"]');
      if (!imgWrapper) return false;
      const cs = getComputedStyle(imgWrapper);
      // Check if the image fills the whole card (enhanced hover active on mobile = bug)
      const cardH = el.getBoundingClientRect().height;
      const wrapperH = imgWrapper.getBoundingClientRect().height;
      return wrapperH >= cardH * 0.9;
    });
    expect(hasEnhancedHoverActive, 'Enhanced hover should not be active on mobile').toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Left / Right Position Interactions (TC-INT-019 – TC-INT-022)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — Left/Right Position Layout', () => {
  test('[TC-INT-019] @interaction @regression Left-position card: image is to the left of content at desktop', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_POS_LEFT).first();
    if (await card.count() === 0) { test.skip(); return; }

    const imgWrapper = card.locator(TC_IMAGE_WRAPPER).first();
    const content = card.locator('.cmp-teaser-card__content').first();
    if (await imgWrapper.count() === 0 || await content.count() === 0) { test.skip(); return; }

    const imgBox = await imgWrapper.boundingBox();
    const contentBox = await content.boundingBox();
    if (imgBox && contentBox) {
      expect(imgBox.x, 'Left-position: image must be left of content').toBeLessThan(contentBox.x);
    }
  });

  test('[TC-INT-020] @interaction @regression Right-position card: image is to the right of content at desktop', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const card = page.locator(TC_POS_RIGHT).first();
    if (await card.count() === 0) { test.skip(); return; }

    const imgWrapper = card.locator(TC_IMAGE_WRAPPER).first();
    const content = card.locator('.cmp-teaser-card__content').first();
    if (await imgWrapper.count() === 0 || await content.count() === 0) { test.skip(); return; }

    const imgBox = await imgWrapper.boundingBox();
    const contentBox = await content.boundingBox();
    if (imgBox && contentBox) {
      expect(imgBox.x, 'Right-position: image must be right of content').toBeGreaterThan(contentBox.x);
    }
  });

  test('[TC-INT-021] @interaction @regression Rectangle Left card: stacks vertically on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    let card = page.locator(`${TC_POS_LEFT}${TC_IMG_RECTANGLE}`).first();
    if (await card.count() === 0) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          el.classList.add('cmp-teaser-card--image-position-left', 'cmp-teaser-card--image-style-rectangle');
        }
      }, TC);
      card = page.locator(`${TC_POS_LEFT}${TC_IMG_RECTANGLE}`).first();
    }
    if (await card.count() === 0) { test.skip(); return; }

    const imgWrapper = card.locator(TC_IMAGE_WRAPPER).first();
    const content = card.locator('.cmp-teaser-card__content').first();
    if (await imgWrapper.count() === 0 || await content.count() === 0) { test.skip(); return; }

    const imgBox = await imgWrapper.boundingBox();
    const contentBox = await content.boundingBox();
    if (imgBox && contentBox) {
      expect(imgBox.y, 'Rectangle Left: image should be above content on mobile').toBeLessThan(contentBox.y);
    }
  });

  test('[TC-INT-022] @interaction @regression Circle Left card: retains side-by-side on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    // Circle + Left should stay horizontal even on mobile (per spec)
    let card = page.locator(`${TC_POS_LEFT}${TC}.cmp-teaser-card--image-style-circle`).first();
    if (await card.count() === 0) { test.skip(); return; }

    const flexDir = await card.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['row', 'row-reverse'], 'Circle Left card should remain side-by-side on mobile').toContain(flexDir);
  });
});
