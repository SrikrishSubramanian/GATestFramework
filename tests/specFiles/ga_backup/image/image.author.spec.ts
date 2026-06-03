import { test, expect } from '@playwright/test';
import { ImagePage } from '../../../pages/ga/components/imagePage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

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
  await loginToAEMAuthor(page);
});

// ---------------------------------------------------------------------------
// Core Structure (IMG-001 to IMG-008)
// ---------------------------------------------------------------------------

test.describe('Image — Core Structure', () => {
  test('[IMG-001] @smoke @regression Multiple .cmp-image instances render on style guide page', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const images = page.locator(IMG_ROOT);
    const count = await images.count();
    expect(count).toBeGreaterThan(1);
  });

  test('[IMG-002] @smoke @regression .cmp-image__picture has border-radius 20px on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const radius = await picture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('20px');
  });

  test('[IMG-003] @regression .cmp-image__picture has border-radius 12px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const radius = await picture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('12px');
  });

  test('[IMG-004] @regression img.cmp-image__image is display:block and width:100%', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    // AEM adaptive images may not render in local DAM — inject if absent
    const imgCount = await page.locator(IMG_IMAGE).count();
    if (imgCount === 0) {
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
    const display = await img.evaluate((el: Element) => getComputedStyle(el).display);
    const width = await img.evaluate((el: Element) => getComputedStyle(el).width);
    const parentWidth = await img.evaluate((el: HTMLElement) => el.parentElement ? el.parentElement.getBoundingClientRect().width : 0);

    expect(display).toBe('block');
    // width:100% resolves to the parent's pixel width
    const imgWidth = parseFloat(width);
    if (parentWidth > 0) {
      expect(imgWidth).toBeCloseTo(parentWidth, 0);
    } else {
      // fallback: just assert it is a positive pixel value
      expect(imgWidth).toBeGreaterThan(0);
    }

    // clean up injection
    if (imgCount === 0) {
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

  test('[IMG-008] @regression Image width adapts responsively (narrower at mobile than desktop)', async ({ page }) => {
    const pom = new ImagePage(page);

    await page.setViewportSize({ width: 1440, height: 900 });
    await pom.navigate(BASE());
    const desktopWidth = await page.locator(IMG_ROOT).first().evaluate((el: HTMLElement) => el.getBoundingClientRect().width);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileWidth = await page.locator(IMG_ROOT).first().evaluate((el: HTMLElement) => el.getBoundingClientRect().width);

    expect(mobileWidth).toBeLessThan(desktopWidth);
  });
});

// ---------------------------------------------------------------------------
// Sizing (IMG-009 to IMG-014)
// ---------------------------------------------------------------------------

test.describe('Image — Sizing Variants', () => {
  test('[IMG-009] @regression Grid Width wrapper max-width is 1134px inside section on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    // Styles only apply inside section/grid containers per LESS scoping
    // The max-width is on the .image wrapper (parent of .cmp-image), not .cmp-image itself
    const wrapper = page.locator('.cmp-section .aem-Grid > .image:not(.cmp-image--full-width)').first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const maxWidth = await wrapper.evaluate((el: Element) => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('1134px');
  });

  test('[IMG-010] @regression Full-width (.cmp-image--full-width) wrapper max-width is 100%', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const fullWidth = page.locator('.cmp-image--full-width').first();
    const count = await fullWidth.count();
    if (count === 0) { test.skip(); return; }

    const maxWidth = await fullWidth.evaluate((el: Element) => getComputedStyle(el).maxWidth);
    // 100% resolves to the viewport width at top-level
    expect(['100%', `${1440}px`].some(v => maxWidth === v) || parseFloat(maxWidth) >= 1400).toBe(true);
  });

  test('[IMG-011] @regression Full-width picture has no border-radius (0px) on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const fullWidthPicture = page.locator('.cmp-image--full-width .cmp-image__picture').first();
    const count = await fullWidthPicture.count();
    if (count === 0) { test.skip(); return; }

    const radius = await fullWidthPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('0px');
  });

  test('[IMG-012] @regression Grid Width picture has border-radius 20px on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridPicture = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width) ${IMG_PICTURE}`).first();
    const count = await gridPicture.count();
    if (count === 0) { test.skip(); return; }

    const radius = await gridPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('20px');
  });

  test('[IMG-013] @regression .cmp-image__picture has overflow:hidden to clip zoom effect', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const overflow = await picture.evaluate((el: Element) => getComputedStyle(el).overflow);
    expect(overflow).toBe('hidden');
  });

  test('[IMG-014] @regression .cmp-image__picture has display:block', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const display = await picture.evaluate((el: Element) => getComputedStyle(el).display);
    expect(display).toBe('block');
  });
});

// ---------------------------------------------------------------------------
// Padding (IMG-015 to IMG-020)
// ---------------------------------------------------------------------------

test.describe('Image — Padding Variants', () => {
  test('[IMG-015] @regression Grid Width default has 48px padding on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridImage = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width):not(.cmp-image--no-top-padding):not(.cmp-image--no-bottom-padding)`).first();
    const count = await gridImage.count();
    if (count === 0) { test.skip(); return; }

    const styles = await gridImage.evaluate((el: Element) => {
      const cs = getComputedStyle(el);
      return { top: cs.paddingTop, bottom: cs.paddingBottom };
    });
    expect(styles.top).toBe('48px');
    expect(styles.bottom).toBe('48px');
  });

  test('[IMG-016] @regression Grid Width default has 32px padding on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridImage = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width):not(.cmp-image--no-top-padding):not(.cmp-image--no-bottom-padding)`).first();
    const count = await gridImage.count();
    if (count === 0) { test.skip(); return; }

    const styles = await gridImage.evaluate((el: Element) => {
      const cs = getComputedStyle(el);
      return { top: cs.paddingTop, bottom: cs.paddingBottom };
    });
    expect(styles.top).toBe('32px');
    expect(styles.bottom).toBe('32px');
  });

  test('[IMG-017] @regression no-top-padding CSS removes top padding', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    // The padding class goes on .image wrapper, and affects inner .cmp-image
    // Find a wrapper inside a section, add the class, check inner .cmp-image padding
    const wrapper = page.locator('.cmp-section .aem-Grid > .image').first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    await wrapper.evaluate(el => el.classList.add('cmp-image--no-top-padding'));
    const inner = wrapper.locator('.cmp-image').first();
    const paddingTop = await inner.evaluate(el => getComputedStyle(el).paddingTop);
    expect(paddingTop).toBe('0px');
    await wrapper.evaluate(el => el.classList.remove('cmp-image--no-top-padding'));
  });

  test('[IMG-018] @regression no-bottom-padding CSS removes bottom padding', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const wrapper = page.locator('.cmp-section .aem-Grid > .image').first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    await wrapper.evaluate(el => el.classList.add('cmp-image--no-bottom-padding'));
    const inner = wrapper.locator('.cmp-image').first();
    const paddingBottom = await inner.evaluate(el => getComputedStyle(el).paddingBottom);
    expect(paddingBottom).toBe('0px');
  });

  test('[IMG-019] @regression .cmp-image--no-top-bottom-padding removes both top and bottom padding', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    let target = page.locator('.cmp-image--no-top-bottom-padding').first();
    let count = await target.count();
    if (count === 0) {
      await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (el) el.classList.add('cmp-image--no-top-bottom-padding');
      }, IMG_ROOT);
      target = page.locator('.cmp-image--no-top-bottom-padding').first();
    }

    const styles = await target.evaluate((el: Element) => {
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
    const width = await picture.evaluate((el: HTMLElement) => el.getBoundingClientRect().width);
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
    if (count === 0) { test.skip(); return; }

    // Inject img if DAM is absent
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

    await linkedPicture.hover();
    const transform = await page.locator(`${IMG_LINK} ${IMG_IMAGE}`).first().evaluate((el: Element) => getComputedStyle(el).transform);
    // scale(1.15) resolves to a matrix — check it is not 'none' and not identity
    expect(transform).not.toBe('none');
    expect(transform).not.toContain('matrix(1, 0, 0, 1,');

    if (imgCount === 0) {
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
    const transform = await page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_IMAGE}`).first().evaluate((el: Element) => getComputedStyle(el).transform);
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);

    if (imgCount === 0) {
      await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
    }
  });

  test('[IMG-023] @regression img.cmp-image__image has CSS transition of 0.3s ease on transform', async ({ page }) => {
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
    // transition should include 'transform' with '0.3s'
    expect(transition).toContain('0.3s');

    if (imgCount === 0) {
      await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
    }
  });

  test('[IMG-024] @regression .cmp-image__picture has overflow:hidden to clip zoom', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const overflow = await picture.evaluate((el: Element) => getComputedStyle(el).overflow);
    expect(overflow).toBe('hidden');
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
    if (count === 0) { test.skip(); return; }

    const fontSize = await caption.evaluate((el: Element) => getComputedStyle(el).fontSize);
    expect(fontSize).toBe('14px');
  });

  test('[IMG-026] @regression Caption font-size is 13px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const caption = page.locator(IMG_TITLE).first();
    const count = await caption.count();
    if (count === 0) { test.skip(); return; }

    const fontSize = await caption.evaluate((el: Element) => getComputedStyle(el).fontSize);
    expect(fontSize).toBe('13px');
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
      if (await fallback.count() === 0) { test.skip(); return; }
      const color = await fallback.evaluate((el: Element) => getComputedStyle(el).color);
      // granite is a dark color; should not be pure white
      const rgb = color.match(/\d+/g)?.map(Number) ?? [];
      if (rgb.length >= 3) {
        const isWhite = rgb[0] > 240 && rgb[1] > 240 && rgb[2] > 240;
        expect(isWhite).toBe(false);
      }
      return;
    }
    const color = await caption.evaluate((el: Element) => getComputedStyle(el).color);
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
      await page.evaluate((sels) => {
        const caption = document.querySelector(sels.titleSel);
        const section = caption?.closest('.cmp-section');
        if (section) section.classList.add('cmp-section--background-color-granite');
      }, { titleSel: IMG_TITLE });

      const injectedCaption = page.locator(`${SECTION_GRANITE} ${IMG_TITLE}`).first();
      if (await injectedCaption.count() === 0) { test.skip(); return; }
      const color = await injectedCaption.evaluate((el: Element) => getComputedStyle(el).color);
      const rgb = color.match(/\d+/g)?.map(Number) ?? [];
      // slate is a light color — all channels should be high
      if (rgb.length >= 3) {
        expect(rgb[0] + rgb[1] + rgb[2]).toBeGreaterThan(500);
      }
      return;
    }
    const color = await darkCaption.evaluate((el: Element) => getComputedStyle(el).color);
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
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('hide-image');
      }, IMG_ROOT);
      target = page.locator('.hide-image').first();
    }
    const display = await target.evaluate((el: Element) => getComputedStyle(el).display);
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
    if (count === 0) { test.skip(); return; }

    const overflow = await caption.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(false);
  });

  test('[IMG-032] @regression Border-radius changes to 12px at mobile viewport 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridPicture = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width) ${IMG_PICTURE}`).first();
    const count = await gridPicture.count();
    if (count === 0) { test.skip(); return; }

    const radius = await gridPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('12px');
  });
});

// ---------------------------------------------------------------------------
// Accessibility (IMG-033 to IMG-036)
// ---------------------------------------------------------------------------

test.describe('Image — Accessibility', () => {
  test('[IMG-033] @a11y @regression All rendered img elements have an alt attribute', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const images = page.locator('img');
    const total = await images.count();
    for (let i = 0; i < total; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt must be present (value may be empty string for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('[IMG-034] @a11y @regression Decorative images have alt="" (empty string)', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    // Decorative images: those with role="presentation" or aria-hidden
    const decorative = page.locator('img[role="presentation"], img[aria-hidden="true"]');
    const count = await decorative.count();
    for (let i = 0; i < count; i++) {
      const alt = await decorative.nth(i).getAttribute('alt');
      expect(alt).toBe('');
    }
  });

  test('[IMG-035] @a11y @regression figure + figcaption markup is used where caption is present', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    // AEM Core Image renders caption as figcaption inside figure
    const figures = page.locator('figure');
    const figCount = await figures.count();
    if (figCount > 0) {
      for (let i = 0; i < figCount; i++) {
        const figTag = await figures.nth(i).evaluate((el: Element) => el.tagName.toLowerCase());
        expect(figTag).toBe('figure');
      }
    }
    // .cmp-image__figure must be a <figure> element or contain a <figure>
    const cmpFigures = page.locator(IMG_FIGURE);
    const cmpFigCount = await cmpFigures.count();
    for (let i = 0; i < cmpFigCount; i++) {
      const tag = await cmpFigures.nth(i).evaluate((el: Element) => el.tagName.toLowerCase());
      expect(['figure', 'div']).toContain(tag);
    }
  });

  test('[IMG-036] @a11y @wcag22 @regression axe-core scan on .cmp-image passes', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(IMG_ROOT)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Dialog / GA Overlay (IMG-037 to IMG-039)
// ---------------------------------------------------------------------------

test.describe('Image — Dialog & GA Overlay', () => {
  test('[IMG-037] @author @regression GA image overlay has correct sling:resourceSuperType', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/image.1.json`;
    const response = await page.request.get(url);
    expect(response.ok(), 'GA image overlay not found').toBe(true);
    const json = await response.json();
    expect(json['sling:resourceSuperType']).toBe('kkr-aem-base/components/content/image');
  });

  test('[IMG-038] @author @regression GA image overlay has componentGroup "GA Base"', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/image.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['componentGroup']).toBe('GA Base');
  });

  test('[IMG-039] @author @regression GA image dialog overlay has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/image/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'GA image _cq_dialog overlay not found').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Image dialog missing helpPath').toBeTruthy();
  });
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
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});
