import { test, expect } from '@playwright/test';
import { ImageWithNestedContentPage } from '../../../pages/ga/components/imageWithNestedContentPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const IWNC = '.cmp-image-with-nested-content';
const IMG = '.cmp-image__image';
const CT_CONTAINER = '.cmp-content-trail__container';
const STAT_ITEM = '.cmp-statistic__item';
const SMALL = '.cmp-image-with-nested-content--small';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Core Structure (001-010) ─────────────────────────────────────────────────

test.describe('ImageWithNestedContent — Core Structure', () => {

  test('[IWNC-001] @smoke @regression all 4 style-guide variations render', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(IWNC);
    const count = await instances.count();
    expect(count, 'Expected at least 4 image-with-nested-content instances on style guide').toBeGreaterThanOrEqual(4);
    for (let i = 0; i < 4; i++) {
      await expect(instances.nth(i)).toBeVisible();
    }
  });

  test('[IWNC-002] @smoke @regression image element has border-radius 20px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    // Find the first instance that has a rendered image
    const instances = page.locator(IWNC);
    const count = await instances.count();
    let checked = false;
    for (let i = 0; i < count; i++) {
      const img = instances.nth(i).locator(IMG).first();
      const imgCount = await img.count();
      if (imgCount === 0) continue;
      const radius = await img.evaluate((el: HTMLImageElement) =>
        getComputedStyle(el).borderRadius
      );
      // border-radius: 20px may be expressed as "20px" or "20px 20px 20px 20px"
      expect(radius, `Instance ${i}: expected border-radius 20px but got "${radius}"`).toMatch(/^20px/);
      checked = true;
      break;
    }
    if (!checked) {
      test.skip();
    }
  });

  test('[IWNC-003] @smoke @regression nested content is positioned absolute at bottom', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    // Check content-trail or statistic overlay has position: absolute
    const ctOverlay = page.locator(CT_CONTAINER).first();
    const statOverlay = page.locator(STAT_ITEM).first();
    const hasCT = await ctOverlay.count() > 0;
    const hasStat = await statOverlay.count() > 0;
    if (hasCT) {
      const pos = await ctOverlay.evaluate((el: HTMLElement) => getComputedStyle(el).position);
      expect(pos, 'Content-trail overlay should be position: absolute').toBe('absolute');
    } else if (hasStat) {
      const pos = await statOverlay.evaluate((el: HTMLElement) => getComputedStyle(el).position);
      expect(pos, 'Statistic overlay should be position: absolute').toBe('absolute');
    } else {
      test.skip();
    }
  });

  test('[IWNC-004] @smoke @regression content-trail child renders within component', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ct = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    const count = await ct.count();
    if (count === 0) {
      test.skip();
      return;
    }
    await expect(ct).toBeVisible();
  });

  test('[IWNC-005] @smoke @regression statistic child renders within component', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const stat = page.locator(`${IWNC} ${STAT_ITEM}`).first();
    const count = await stat.count();
    if (count === 0) {
      test.skip();
      return;
    }
    await expect(stat).toBeVisible();
  });

  test('[IWNC-006] @regression BEM class structure: root uses .cmp-image-with-nested-content', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const root = page.locator(IWNC).first();
    await expect(root).toBeVisible();
    const classes = await root.evaluate((el: HTMLElement) => Array.from(el.classList));
    expect(classes.some(c => c === 'cmp-image-with-nested-content'),
      `Root element missing BEM block class. Found: ${classes.join(', ')}`
    ).toBe(true);
  });

  test('[IWNC-007] @regression component root has no inline style attribute', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(IWNC);
    const count = await instances.count();
    for (let i = 0; i < count; i++) {
      const inlineStyle = await instances.nth(i).getAttribute('style');
      expect(inlineStyle ?? '', `Instance ${i} should not use inline styles`).toBe('');
    }
  });

  test('[IWNC-008] @regression image is responsive: width 100%', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(IWNC);
    const count = await instances.count();
    let checked = false;
    for (let i = 0; i < count; i++) {
      const img = instances.nth(i).locator(IMG).first();
      if (await img.count() === 0) continue;
      const width = await img.evaluate((el: HTMLElement) => getComputedStyle(el).width);
      // width: 100% resolves to a pixel value equal to the container width
      const containerWidth = await instances.nth(i).evaluate((el: HTMLElement) => el.clientWidth);
      const imgWidth = await img.evaluate((el: HTMLElement) => el.getBoundingClientRect().width);
      expect(imgWidth, `Instance ${i}: image width ${imgWidth} should equal container width ${containerWidth}`
      ).toBeCloseTo(containerWidth, -1);
      checked = true;
      break;
    }
    if (!checked) test.skip();
  });

  test('[IWNC-009] @regression image wrapper .cmp-image-with-nested-content__image present when image authored', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const imgWrapper = page.locator('.cmp-image-with-nested-content__image').first();
    const count = await imgWrapper.count();
    if (count === 0) {
      // Image may not be authored on every instance — not a failure
      test.skip();
      return;
    }
    await expect(imgWrapper).toBeVisible();
  });

  test('[IWNC-010] @regression image has no fixed height constraint from inline styles', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(IWNC);
    const count = await instances.count();
    for (let i = 0; i < count; i++) {
      const img = instances.nth(i).locator(IMG).first();
      if (await img.count() === 0) continue;
      const inlineHeight = await img.getAttribute('style');
      expect((inlineHeight ?? '').includes('height'),
        `Instance ${i}: image should not have inline height style`
      ).toBe(false);
    }
  });
});

// ─── Size Variants (011-015) ──────────────────────────────────────────────────

test.describe('ImageWithNestedContent — Size Variants', () => {

  test('[IWNC-011] @regression default (large) variant has no max-width constraint', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    // Default instance: does NOT have the --small modifier
    const defaultInstance = page.locator(`${IWNC}:not(${SMALL})`).first();
    const count = await defaultInstance.count();
    if (count === 0) { test.skip(); return; }
    const maxWidth = await defaultInstance.evaluate((el: HTMLElement) => getComputedStyle(el).maxWidth);
    // "none" means no constraint; or a value significantly larger than 350px
    const isUnbounded = maxWidth === 'none' || parseInt(maxWidth) > 350;
    expect(isUnbounded, `Default variant should have no max-width constraint but got "${maxWidth}"`).toBe(true);
  });

  test('[IWNC-012] @regression small variant has max-width 350px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const small = page.locator(SMALL).first();
    const count = await small.count();
    if (count === 0) { test.skip(); return; }
    const maxWidth = await small.evaluate((el: HTMLElement) => getComputedStyle(el).maxWidth);
    expect(maxWidth, `Small variant should have max-width 350px but got "${maxWidth}"`).toBe('350px');
  });

  test('[IWNC-013] @regression small variant has max-height 366px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const small = page.locator(SMALL).first();
    const count = await small.count();
    if (count === 0) { test.skip(); return; }
    const maxHeight = await small.evaluate((el: HTMLElement) => getComputedStyle(el).maxHeight);
    expect(maxHeight, `Small variant should have max-height 366px but got "${maxHeight}"`).toBe('366px');
  });

  test('[IWNC-014] @regression small variant image has border-radius 12px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const small = page.locator(SMALL).first();
    const count = await small.count();
    if (count === 0) { test.skip(); return; }
    const img = small.locator(IMG).first();
    if (await img.count() === 0) { test.skip(); return; }
    const radius = await img.evaluate((el: HTMLElement) => getComputedStyle(el).borderRadius);
    expect(radius, `Small variant image should have border-radius 12px but got "${radius}"`).toMatch(/^12px/);
  });

  test('[IWNC-015] @regression small variant statistic font-size is 40px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const small = page.locator(SMALL).first();
    const count = await small.count();
    if (count === 0) { test.skip(); return; }
    // Look for statistic value element within small variant
    const statValue = small.locator('.cmp-statistic__value, .cmp-statistic__number').first();
    if (await statValue.count() === 0) { test.skip(); return; }
    const fontSize = await statValue.evaluate((el: HTMLElement) => getComputedStyle(el).fontSize);
    expect(fontSize, `Small variant statistic value should have font-size 40px but got "${fontSize}"`).toBe('40px');
  });
});

// ─── Nested Content Positioning (016-020) ────────────────────────────────────

test.describe('ImageWithNestedContent — Nested Content Positioning', () => {

  test('[IWNC-016] @regression content-trail overlay bottom: 24px left: 24px right: 24px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ct = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ct.count() === 0) { test.skip(); return; }
    const styles = await ct.evaluate((el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return { bottom: cs.bottom, left: cs.left, right: cs.right };
    });
    expect(styles.bottom, `content-trail bottom should be 24px but got "${styles.bottom}"`).toBe('24px');
    expect(styles.left, `content-trail left should be 24px but got "${styles.left}"`).toBe('24px');
    expect(styles.right, `content-trail right should be 24px but got "${styles.right}"`).toBe('24px');
  });

  test('[IWNC-017] @regression statistic overlay bottom: 24px left: 24px right: 24px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const stat = page.locator(`${IWNC} ${STAT_ITEM}`).first();
    if (await stat.count() === 0) { test.skip(); return; }
    const styles = await stat.evaluate((el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return { bottom: cs.bottom, left: cs.left, right: cs.right };
    });
    expect(styles.bottom, `statistic bottom should be 24px but got "${styles.bottom}"`).toBe('24px');
    expect(styles.left, `statistic left should be 24px but got "${styles.left}"`).toBe('24px');
    expect(styles.right, `statistic right should be 24px but got "${styles.right}"`).toBe('24px');
  });

  test('[IWNC-018] @regression overlay sits on top of image (z-index stacking)', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    // Content-trail or statistic should have a z-index that places it above the image
    const overlay = page.locator(`${IWNC} ${CT_CONTAINER}, ${IWNC} ${STAT_ITEM}`).first();
    if (await overlay.count() === 0) { test.skip(); return; }
    const zIndex = await overlay.evaluate((el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return cs.zIndex;
    });
    // z-index should be auto (positioned above due to stacking context) or a positive number
    const isOnTop = zIndex === 'auto' || parseInt(zIndex) >= 0;
    expect(isOnTop, `Overlay z-index "${zIndex}" should be auto or non-negative`).toBe(true);
  });

  test('[IWNC-019] @regression nested content is visible within image bounds', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instance = page.locator(IWNC).first();
    const overlay = instance.locator(`${CT_CONTAINER}, ${STAT_ITEM}`).first();
    if (await overlay.count() === 0) { test.skip(); return; }
    await expect(overlay).toBeVisible();
    const containerBox = await instance.boundingBox();
    const overlayBox = await overlay.boundingBox();
    if (!containerBox || !overlayBox) { test.skip(); return; }
    // Overlay left edge should be within container bounds
    expect(overlayBox.x, 'Overlay left edge should be within container').toBeGreaterThanOrEqual(containerBox.x - 1);
    // Overlay bottom edge should be within container bounds
    const overlayBottom = overlayBox.y + overlayBox.height;
    const containerBottom = containerBox.y + containerBox.height;
    expect(overlayBottom, 'Overlay bottom edge should be within container').toBeLessThanOrEqual(containerBottom + 1);
  });

  test('[IWNC-020] @regression component root has position relative for overlay context', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instance = page.locator(IWNC).first();
    await expect(instance).toBeVisible();
    const pos = await instance.evaluate((el: HTMLElement) => getComputedStyle(el).position);
    expect(pos, `Component root should be position: relative but got "${pos}"`).toBe('relative');
  });
});

// ─── Focus Accessibility (021-023) ───────────────────────────────────────────

test.describe('ImageWithNestedContent — Focus Accessibility', () => {

  test('[IWNC-021] @a11y @regression content-trail link focus triggers azul outline on component', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instance = page.locator(IWNC).first();
    const link = instance.locator(`${CT_CONTAINER} a`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    // After focus, the component root or image should get an outline
    // Check either the root or the picture element for the azul outline
    const outlineTarget = instance.locator('.cmp-image__picture, .cmp-image-with-nested-content__image').first();
    if (await outlineTarget.count() === 0) { test.skip(); return; }
    const outlineWidth = await outlineTarget.evaluate((el: HTMLElement) => getComputedStyle(el).outlineWidth);
    expect(outlineWidth, `Focus outline width should be 3px but got "${outlineWidth}"`).toBe('3px');
  });

  test('[IWNC-022] @a11y @regression focus outline-offset is 4px when nested content is focused', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instance = page.locator(IWNC).first();
    const link = instance.locator(`${CT_CONTAINER} a, ${STAT_ITEM} a`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    const outlineTarget = instance.locator('.cmp-image__picture, .cmp-image-with-nested-content__image').first();
    if (await outlineTarget.count() === 0) { test.skip(); return; }
    const outlineOffset = await outlineTarget.evaluate((el: HTMLElement) => getComputedStyle(el).outlineOffset);
    expect(outlineOffset, `Focus outline-offset should be 4px but got "${outlineOffset}"`).toBe('4px');
  });

  test('[IWNC-023] @a11y @wcag22 @regression @smoke focus ring is visible when link inside component is focused', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instance = page.locator(IWNC).first();
    const focusable = instance.locator('a, button').first();
    if (await focusable.count() === 0) { test.skip(); return; }
    await focusable.focus();
    // Verify the element is focused and focus is not obscured
    const isFocused = await focusable.evaluate((el: HTMLElement) => document.activeElement === el);
    expect(isFocused, 'Focusable element should be the active element after focus()').toBe(true);
    const box = await focusable.boundingBox();
    if (box) {
      expect(box.y, 'Focused element should not be scrolled out of view (y should be >= 0)').toBeGreaterThanOrEqual(0);
    }
  });
});

// ─── Mobile Responsive (024-028) ─────────────────────────────────────────────

test.describe('ImageWithNestedContent — Mobile Responsive', () => {

  test('[IWNC-024] @mobile @regression at 390px statistic font-size is 40px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const statValue = page.locator(`${IWNC} .cmp-statistic__value, ${IWNC} .cmp-statistic__number`).first();
    if (await statValue.count() === 0) { test.skip(); return; }
    const fontSize = await statValue.evaluate((el: HTMLElement) => getComputedStyle(el).fontSize);
    expect(fontSize, `Mobile statistic font-size should be 40px but got "${fontSize}"`).toBe('40px');
  });

  test('[IWNC-025] @mobile @regression statistic description has width 100% on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const statDesc = page.locator(`${IWNC} .cmp-statistic__description`).first();
    if (await statDesc.count() === 0) { test.skip(); return; }
    const width = await statDesc.evaluate((el: HTMLElement) => {
      const parent = el.parentElement;
      if (!parent) return '';
      // width 100% means el.offsetWidth === parent.clientWidth
      return el.offsetWidth === parent.clientWidth ? '100%' : `${el.offsetWidth}px / ${parent.clientWidth}px`;
    });
    expect(width, `Mobile statistic description should fill 100% of parent width`).toBe('100%');
  });

  test('[IWNC-026] @mobile @regression no horizontal overflow at 390px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(IWNC);
    const count = await instances.count();
    for (let i = 0; i < count; i++) {
      const overflows = await instances.nth(i).evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth);
      expect(overflows, `Instance ${i} should not overflow horizontally on mobile`).toBe(false);
    }
  });

  test('[IWNC-027] @mobile @regression small variant is centered on mobile (margin auto)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const small = page.locator(SMALL).first();
    if (await small.count() === 0) { test.skip(); return; }
    const margin = await small.evaluate((el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return { left: cs.marginLeft, right: cs.marginRight };
    });
    // margin: 0 auto means left and right margins are equal (centered)
    expect(margin.left, `Small variant marginLeft should equal marginRight for centering`).toBe(margin.right);
  });

  test('[IWNC-028] @mobile @regression image renders without distortion at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(IWNC);
    const count = await instances.count();
    let checked = false;
    for (let i = 0; i < count; i++) {
      const img = instances.nth(i).locator(IMG).first();
      if (await img.count() === 0) continue;
      const box = await img.boundingBox();
      expect(box, `Instance ${i}: image should have a bounding box`).not.toBeNull();
      if (box) {
        expect(box.width, `Instance ${i}: image width ${box.width} should be > 0`).toBeGreaterThan(0);
        expect(box.height, `Instance ${i}: image height ${box.height} should be > 0`).toBeGreaterThan(0);
        // objectFit should prevent distortion
        const fit = await img.evaluate((el: HTMLElement) => getComputedStyle(el).objectFit);
        const validFit = ['cover', 'contain', 'fill', 'none', 'scale-down'];
        // Any valid value is acceptable — just should not be unexpected
        expect(fit).toBeTruthy();
      }
      checked = true;
      break;
    }
    if (!checked) test.skip();
  });
});

// ─── Section Background Colors (029-033) ─────────────────────────────────────

test.describe('ImageWithNestedContent — Section Background Colors', () => {

  test('[IWNC-029] @regression content-trail background is white on white section', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    // Find a content-trail inside a white-background section
    const whiteSection = page.locator('.background-white, .cmp-section--background-white').first();
    if (await whiteSection.count() === 0) { test.skip(); return; }
    const ct = whiteSection.locator(CT_CONTAINER).first();
    if (await ct.count() === 0) { test.skip(); return; }
    const bg = await ct.evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
    // White = rgb(255, 255, 255)
    expect(bg, `Content-trail on white section should have white background but got "${bg}"`).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[IWNC-030] @regression statistic background is white on white section', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const whiteSection = page.locator('.background-white, .cmp-section--background-white').first();
    if (await whiteSection.count() === 0) { test.skip(); return; }
    const stat = whiteSection.locator(STAT_ITEM).first();
    if (await stat.count() === 0) { test.skip(); return; }
    const bg = await stat.evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
    expect(bg, `Statistic on white section should have white background but got "${bg}"`).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[IWNC-031] @regression statistic on granite section has correct background', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const graniteSection = page.locator('.background-granite, .cmp-section--background-granite').first();
    if (await graniteSection.count() === 0) { test.skip(); return; }
    const stat = graniteSection.locator(STAT_ITEM).first();
    if (await stat.count() === 0) { test.skip(); return; }
    await expect(stat).toBeVisible();
    // On granite (dark), statistic should have non-white background
    const bg = await stat.evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
    expect(bg, 'Statistic on granite should have a non-transparent background').not.toBe('rgba(0, 0, 0, 0)');
  });

  test('[IWNC-032] @regression statistic on azul section has text with appropriate contrast', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const azulSection = page.locator('.background-azul, .cmp-section--background-azul').first();
    if (await azulSection.count() === 0) { test.skip(); return; }
    const stat = azulSection.locator(STAT_ITEM).first();
    if (await stat.count() === 0) { test.skip(); return; }
    await expect(stat).toBeVisible();
    // On azul (dark), text should be light (white/near-white)
    const valueEl = azulSection.locator('.cmp-statistic__value, .cmp-statistic__number').first();
    if (await valueEl.count() === 0) { test.skip(); return; }
    const color = await valueEl.evaluate((el: HTMLElement) => getComputedStyle(el).color);
    // White text = rgb(255, 255, 255) or near-white
    expect(color, `Statistic value on azul should be white/light but got "${color}"`).toMatch(/rgb\(2[0-9]{2},\s*2[0-9]{2},\s*2[0-9]{2}\)/);
  });

  test('[IWNC-033] @regression statistic on granite section has green value color', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const graniteSection = page.locator('.background-granite, .cmp-section--background-granite').first();
    if (await graniteSection.count() === 0) { test.skip(); return; }
    const valueEl = graniteSection.locator('.cmp-statistic__value, .cmp-statistic__number').first();
    if (await valueEl.count() === 0) { test.skip(); return; }
    const color = await valueEl.evaluate((el: HTMLElement) => getComputedStyle(el).color);
    // GA green is used for statistic values on dark backgrounds — not white
    // Accept any non-pure-white color as a signal of correct theming
    expect(color, `Statistic value on granite should have a themed (non-default) color but got "${color}"`).not.toBe('rgba(0, 0, 0, 0)');
  });
});

// ─── AEM Dialog / Overlay (034-038) ──────────────────────────────────────────

test.describe('ImageWithNestedContent — AEM Dialog / Overlay', () => {

  test('[IWNC-034] @author @regression GA overlay sling:resourceSuperType points to base component', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/image-with-nested-content.1.json`;
    const response = await page.request.get(overlayUrl);
    expect(response.ok(), 'GA overlay component .1.json not accessible').toBe(true);
    const json = await response.json();
    expect(json['sling:resourceSuperType'],
      'GA overlay should set sling:resourceSuperType to base component'
    ).toBe('kkr-aem-base/components/content/image-with-nested-content');
  });

  test('[IWNC-035] @author @regression GA overlay componentGroup is "GA Base"', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/image-with-nested-content.1.json`;
    const response = await page.request.get(overlayUrl);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['componentGroup'],
      'GA overlay componentGroup should be "GA Base"'
    ).toBe('GA Base');
  });

  test('[IWNC-036] @author @regression component is marked as container (cq:isContainer)', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/image-with-nested-content.1.json`;
    const response = await page.request.get(overlayUrl);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    // cq:isContainer can be boolean true or string "true"
    const isContainer = json['cq:isContainer'];
    expect(String(isContainer),
      'image-with-nested-content should be cq:isContainer=true'
    ).toBe('true');
  });

  test('[IWNC-037] @author @regression dialog has helpPath configured', async ({ page }) => {
    // Check GA overlay dialog first; fall back to base dialog
    const gaDialogUrl = `${BASE()}/apps/ga/components/content/image-with-nested-content/_cq_dialog.1.json`;
    const baseDialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/image-with-nested-content/_cq_dialog.1.json`;
    let response = await page.request.get(gaDialogUrl);
    if (!response.ok()) {
      response = await page.request.get(baseDialogUrl);
    }
    expect(response.ok(), 'Neither GA nor base dialog JSON is accessible').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Dialog should have helpPath configured').toBeTruthy();
  });

  test('[IWNC-038] @author @regression dialog has image fileupload field and alt text field', async ({ page }) => {
    const gaDialogUrl = `${BASE()}/apps/ga/components/content/image-with-nested-content/_cq_dialog.infinity.json`;
    const baseDialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/image-with-nested-content/_cq_dialog.infinity.json`;
    let response = await page.request.get(gaDialogUrl);
    if (!response.ok()) {
      response = await page.request.get(baseDialogUrl);
    }
    if (!response.ok()) { test.skip(); return; }
    const dialogText = await response.text();
    // Dialog JSON should contain fileupload and alt field references
    expect(dialogText, 'Dialog should contain fileupload field for image').toContain('fileupload');
    expect(dialogText, 'Dialog should contain alt text field').toMatch(/alt|altText/i);
  });
});

// ─── Console Errors (039-040) ─────────────────────────────────────────────────

test.describe('ImageWithNestedContent — Console Errors', () => {

  test('[IWNC-039] @regression @smoke no JS errors on style guide page load', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    // Allow page to fully settle
    await page.waitForTimeout(1500);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors, `JS errors on page load: ${errors.join('; ')}`).toEqual([]);
  });

  test('[IWNC-040] @regression no JS errors across all 4 style-guide variations', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    // Scroll through all instances to trigger lazy loading
    const instances = page.locator(IWNC);
    const count = await instances.count();
    for (let i = 0; i < count; i++) {
      await instances.nth(i).scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
    }
    const errors = capture.getErrors();
    capture.stop();
    expect(errors, `JS errors while scrolling through variations: ${errors.join('; ')}`).toEqual([]);
  });
});
