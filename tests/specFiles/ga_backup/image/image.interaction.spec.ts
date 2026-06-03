import { test, expect } from '@playwright/test';
import { ImagePage } from '../../../pages/ga/components/imagePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const IMG_ROOT = '.cmp-image';
const IMG_PICTURE = '.cmp-image__picture';
const IMG_IMAGE = 'img.cmp-image__image';
const IMG_LINK = '.cmp-image__link';
const IMG_TITLE = '.cmp-image__title';
const SECTION_GRANITE = '.cmp-section--background-color-granite';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ---------------------------------------------------------------------------
// Hover Zoom (IMG-INT-001 to IMG-INT-004)
// ---------------------------------------------------------------------------

test.describe('Image — Hover Zoom Interaction', () => {
  test('[IMG-INT-001] @interaction @regression Linked image hover: transform scale changes from identity', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const linkedPicture = page.locator(`${IMG_LINK} ${IMG_PICTURE}`).first();
    const count = await linkedPicture.count();
    if (count === 0) { test.skip(); return; }

    // Capture transform before hover
    const imgCount = await page.locator(`${IMG_LINK} ${IMG_IMAGE}`).count();
    if (imgCount === 0) {
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

    const imgLocator = page.locator(`${IMG_LINK} ${IMG_IMAGE}`).first();
    const beforeTransform = await imgLocator.evaluate((el: Element) => getComputedStyle(el).transform);

    await linkedPicture.hover();
    await page.waitForTimeout(350); // allow 0.3s transition to complete

    const afterTransform = await imgLocator.evaluate((el: Element) => getComputedStyle(el).transform);

    // After hover, transform should differ from the default identity matrix
    // or explicitly be the scale(1.15) matrix
    expect(afterTransform).not.toBe('none');
    expect(afterTransform).not.toBe('matrix(1, 0, 0, 1, 0, 0)');

    if (imgCount === 0) {
      await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
    }
  });

  test('[IMG-INT-002] @interaction @regression Non-linked image hover: transform stays none/identity', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    // Find a .cmp-image root that does NOT contain .cmp-image__link
    const nonLinkedPicture = page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_PICTURE}`).first();
    const count = await nonLinkedPicture.count();
    if (count === 0) { test.skip(); return; }

    const imgCount = await page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_IMAGE}`).count();
    if (imgCount === 0) {
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

    await nonLinkedPicture.hover();
    await page.waitForTimeout(350);

    const transform = await page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_IMAGE}`).first().evaluate((el: Element) => getComputedStyle(el).transform);
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);

    if (imgCount === 0) {
      await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
    }
  });

  test('[IMG-INT-003] @interaction @regression Zoom clips within picture: overflow:hidden prevents overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const linkedPicture = page.locator(`${IMG_LINK} ${IMG_PICTURE}`).first();
    const count = await linkedPicture.count();
    if (count === 0) { test.skip(); return; }

    // Verify overflow:hidden is set (structural guarantee of clip behaviour)
    const overflow = await linkedPicture.evaluate((el: Element) => getComputedStyle(el).overflow);
    expect(overflow).toBe('hidden');

    // Hover and confirm the picture box dimensions do not change (clip in place)
    const boxBefore = await linkedPicture.boundingBox();
    await linkedPicture.hover();
    await page.waitForTimeout(350);
    const boxAfter = await linkedPicture.boundingBox();

    expect(boxAfter?.width).toBeCloseTo(boxBefore?.width ?? 0, 0);
    expect(boxAfter?.height).toBeCloseTo(boxBefore?.height ?? 0, 0);
  });

  test('[IMG-INT-004] @interaction @regression Transition duration is 0.3s on img.cmp-image__image', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const imgCount = await page.locator(IMG_IMAGE).count();
    if (imgCount === 0) {
      await page.evaluate((sel) => {
        const picture = document.querySelector(sel);
        if (picture) {
          const img = document.createElement('img');
          img.className = 'cmp-image__image';
          img.setAttribute('data-injected', 'true');
          picture.appendChild(img);
        }
      }, IMG_PICTURE);
    }

    const transition = await page.locator(IMG_IMAGE).first().evaluate((el: Element) => getComputedStyle(el).transition);
    expect(transition).toContain('0.3s');

    if (imgCount === 0) {
      await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
    }
  });
});

// ---------------------------------------------------------------------------
// Focus (IMG-INT-005 to IMG-INT-007)
// ---------------------------------------------------------------------------

test.describe('Image — Keyboard Focus Interaction', () => {
  test('[IMG-INT-005] @interaction @regression Linked image (.cmp-image__link) is keyboard focusable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const link = page.locator(IMG_LINK).first();
    const count = await link.count();
    if (count === 0) { test.skip(); return; }

    await link.focus();
    const isFocused = await link.evaluate((el: Element) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('[IMG-INT-006] @interaction @regression Focus indicator is visible on linked image', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const link = page.locator(IMG_LINK).first();
    const count = await link.count();
    if (count === 0) { test.skip(); return; }

    await link.focus();

    // A visible focus indicator means outline is not 'none' or has non-zero outline-width
    const outline = await link.evaluate((el: Element) => {
      const cs = getComputedStyle(el);
      return { style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor };
    });
    const hasOutline = outline.style !== 'none' && parseFloat(outline.width) > 0;
    const hasBoxShadow = await link.evaluate((el: Element) => {
      const cs = getComputedStyle(el);
      return cs.boxShadow !== 'none' && cs.boxShadow !== '';
    });
    expect(hasOutline || hasBoxShadow).toBe(true);
  });

  test('[IMG-INT-007] @interaction @regression Tab key navigation reaches linked image', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const link = page.locator(IMG_LINK).first();
    const count = await link.count();
    if (count === 0) { test.skip(); return; }

    // Tab through focusable elements until we reach the link or exhaust attempts
    let reached = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.className ?? '');
      if (focused.includes('cmp-image__link')) {
        reached = true;
        break;
      }
    }
    expect(reached).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Responsive (IMG-INT-008 to IMG-INT-010)
// ---------------------------------------------------------------------------

test.describe('Image — Responsive Interaction', () => {
  test('[IMG-INT-008] @interaction @regression Border-radius is 20px at 1440px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridPicture = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width) ${IMG_PICTURE}`).first();
    const count = await gridPicture.count();
    if (count === 0) { test.skip(); return; }

    const radius = await gridPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('20px');
  });

  test('[IMG-INT-009] @interaction @regression Border-radius is 12px at 390px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridPicture = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width) ${IMG_PICTURE}`).first();
    const count = await gridPicture.count();
    if (count === 0) { test.skip(); return; }

    const radius = await gridPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('12px');
  });

  test('[IMG-INT-010] @interaction @regression Image wrappers do not overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const images = page.locator('.image');
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      const overflow = await images.nth(i).evaluate(el => el.scrollWidth > el.clientWidth + 2);
      expect(overflow, `Image ${i} overflows`).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// Caption Behavior (IMG-INT-011 to IMG-INT-012)
// ---------------------------------------------------------------------------

test.describe('Image — Caption Interaction', () => {
  test('[IMG-INT-011] @interaction @regression Caption appears below image (Y position > picture bottom)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const caption = page.locator(IMG_TITLE).first();
    const captionCount = await caption.count();
    if (captionCount === 0) { test.skip(); return; }

    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();

    const pictureBox = await picture.boundingBox();
    const captionBox = await caption.boundingBox();

    if (pictureBox && captionBox) {
      // Caption top should be at or below picture bottom
      expect(captionBox.y).toBeGreaterThanOrEqual(pictureBox.y + pictureBox.height - 5); // 5px tolerance
    }
  });

  test('[IMG-INT-012] @interaction @regression Caption color differs between white and granite sections', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    // The style guide has both white and granite sections with images + captions
    const lightCaption = page.locator('.cmp-section--background-color-white .cmp-image__title').first();
    const darkCaption = page.locator('.cmp-section--background-color-granite .cmp-image__title').first();

    if (await lightCaption.count() === 0 || await darkCaption.count() === 0) {
      test.skip(true, 'Need both white and granite sections with captioned images');
      return;
    }

    const lightColor = await lightCaption.evaluate(el => getComputedStyle(el).color);
    const darkColor = await darkCaption.evaluate(el => getComputedStyle(el).color);
    expect(lightColor).not.toBe(darkColor);
  });
});
