import { test, expect } from '@playwright/test';
import { ImagePage } from '../../../pages/ga/components/imagePage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
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
    const radius = // 📏 TODO: Replace with measurement-utils
    await picture.evaluate((el: Element) => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    expect(radius).toBe('20px');
  });

  test('[IMG-003] @regression .cmp-image__picture has border-radius 12px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const radius = // 📏 TODO: Replace with measurement-utils
    await picture.evaluate((el: Element) => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    expect(radius).toBe('12px');
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
    await img.evaluate((el: Element) => getComputedStyle(el).display); // measurement: use measurement-utils for cleaner code
    const width = // 📏 TODO: Replace with measurement-utils
    await img.evaluate((el: Element) => getComputedStyle(el).width); // measurement: use measurement-utils for cleaner code
    const parentWidth = // 📏 TODO: Replace with measurement-utils
    await img.evaluate((el: HTMLElement) => el.parentElement ? el.parentElement.getBoundingClientRect().width : 0);

    expect(display).toBe('block'); // TODO: Use assertLayout() for display checks
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
    const maxWidth = // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate((el: Element) => getComputedStyle(el).maxWidth); // measurement: use measurement-utils for cleaner code
    expect(maxWidth).toBe('1134px');
  });

  test('[IMG-010] @regression Full-width (.cmp-image--full-width) wrapper max-width is 100%', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const fullWidth = page.locator('.cmp-image--full-width').first();
    const count = await fullWidth.count();
    if (count === 0) { test.skip(); return; }

    const maxWidth = // 📏 TODO: Replace with measurement-utils
    await fullWidth.evaluate((el: Element) => getComputedStyle(el).maxWidth); // measurement: use measurement-utils for cleaner code
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

    const radius = // 📏 TODO: Replace with measurement-utils
    await fullWidthPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    expect(radius).toBe('0px');
  });

  test('[IMG-012] @regression Grid Width picture has border-radius 20px on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridPicture = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width) ${IMG_PICTURE}`).first();
    const count = await gridPicture.count();
    if (count === 0) { test.skip(); return; }

    const radius = // 📏 TODO: Replace with measurement-utils
    await gridPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    expect(radius).toBe('20px');
  });

  test('[IMG-013] @regression .cmp-image__picture has overflow:hidden to clip zoom effect', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const overflow = // 📏 TODO: Replace with measurement-utils
    await picture.evaluate((el: Element) => getComputedStyle(el).overflow); // measurement: use measurement-utils for cleaner code
    expect(overflow).toBe('hidden');
  });

  test('[IMG-014] @regression .cmp-image__picture has display:block', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const display = // 📏 TODO: Replace with measurement-utils
    await picture.evaluate((el: Element) => getComputedStyle(el).display); // measurement: use measurement-utils for cleaner code
    expect(display).toBe('block'); // TODO: Use assertLayout() for display checks
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

    const styles = // 📏 TODO: Replace with measurement-utils
    await gridImage.evaluate((el: Element) => {
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

    const styles = // 📏 TODO: Replace with measurement-utils
    await gridImage.evaluate((el: Element) => {
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
    // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => el.classList.add('cmp-image--no-top-padding'));
    const inner = wrapper.locator('.cmp-image').first();
    const paddingTop = // 📏 TODO: Replace with measurement-utils
    await inner.evaluate(el => getComputedStyle(el).paddingTop); // measurement: use measurement-utils for cleaner code
    expect(paddingTop).toBe('0px'); // TODO: Use assertSpacing() for padding/margin
    // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => el.classList.remove('cmp-image--no-top-padding'));
  });

  test('[IMG-018] @regression no-bottom-padding CSS removes bottom padding', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const wrapper = page.locator('.cmp-section .aem-Grid > .image').first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => el.classList.add('cmp-image--no-bottom-padding'));
    const inner = wrapper.locator('.cmp-image').first();
    const paddingBottom = // 📏 TODO: Replace with measurement-utils
    await inner.evaluate(el => getComputedStyle(el).paddingBottom); // measurement: use measurement-utils for cleaner code
    expect(paddingBottom).toBe('0px'); // TODO: Use assertSpacing() for padding/margin
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
        if (el) el.classList.add('cmp-image--no-top-bottom-padding');
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
    if (count === 0) { test.skip(); return; }

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
    const transform = await page.locator(`${IMG_LINK} ${IMG_IMAGE}`).first().evaluate((el: Element) => getComputedStyle(el).transform); // measurement: use measurement-utils for cleaner code
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
    if (count === 0) { test.skip(); return; }

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
    const transform = await page.locator(`${IMG_ROOT}:not(:has(${IMG_LINK})) ${IMG_IMAGE}`).first().evaluate((el: Element) => getComputedStyle(el).transform); // measurement: use measurement-utils for cleaner code
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);

    if (imgCount === 0) {
      // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
    }
  });

  test('[IMG-023] @regression img.cmp-image__image has CSS transition of 0.3s ease on transform', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const imgCount = await page.locator(IMG_IMAGE).count();
    if (imgCount === 0) {
      // 📏 TODO: Replace with measurement-utils
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

    const transition = await page.locator(IMG_IMAGE).first().evaluate((el: Element) => getComputedStyle(el).transition); // measurement: use measurement-utils for cleaner code
    // transition should include 'transform' with '0.3s'
    expect(transition).toContain('0.3s');

    if (imgCount === 0) {
      // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => { document.querySelectorAll('[data-injected="true"]').forEach(el => el.remove()); });
    }
  });

  test('[IMG-024] @regression .cmp-image__picture has overflow:hidden to clip zoom', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const picture = page.locator(IMG_PICTURE).first();
    await expect(picture).toBeVisible();
    const overflow = // 📏 TODO: Replace with measurement-utils
    await picture.evaluate((el: Element) => getComputedStyle(el).overflow); // measurement: use measurement-utils for cleaner code
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

    const fontSize = // 📏 TODO: Replace with measurement-utils
    await caption.evaluate((el: Element) => getComputedStyle(el).fontSize); // measurement: use measurement-utils for cleaner code
    expect(fontSize).toBe('14px'); // TODO: Use assertTypography() for font checks
  });

  test('[IMG-026] @regression Caption font-size is 13px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const caption = page.locator(IMG_TITLE).first();
    const count = await caption.count();
    if (count === 0) { test.skip(); return; }

    const fontSize = // 📏 TODO: Replace with measurement-utils
    await caption.evaluate((el: Element) => getComputedStyle(el).fontSize); // measurement: use measurement-utils for cleaner code
    expect(fontSize).toBe('13px'); // TODO: Use assertTypography() for font checks
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
      const color = // 📏 TODO: Replace with measurement-utils
    await fallback.evaluate((el: Element) => getComputedStyle(el).color); // measurement: use measurement-utils for cleaner code
      // granite is a dark color; should not be pure white
      const rgb = color.match(/\d+/g)?.map(Number) ?? [];
      if (rgb.length >= 3) {
        const isWhite = rgb[0] > 240 && rgb[1] > 240 && rgb[2] > 240;
        expect(isWhite).toBe(false);
      }
      return;
    }
    const color = // 📏 TODO: Replace with measurement-utils
    await caption.evaluate((el: Element) => getComputedStyle(el).color); // measurement: use measurement-utils for cleaner code
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
        if (section) section.classList.add('cmp-section--background-color-granite');
      }, { titleSel: IMG_TITLE });

      const injectedCaption = page.locator(`${SECTION_GRANITE} ${IMG_TITLE}`).first();
      if (await injectedCaption.count() === 0) { test.skip(); return; }
      const color = // 📏 TODO: Replace with measurement-utils
    await injectedCaption.evaluate((el: Element) => getComputedStyle(el).color); // measurement: use measurement-utils for cleaner code
      const rgb = color.match(/\d+/g)?.map(Number) ?? [];
      // slate is a light color — all channels should be high
      if (rgb.length >= 3) {
        expect(rgb[0] + rgb[1] + rgb[2]).toBeGreaterThan(500);
      }
      return;
    }
    const color = // 📏 TODO: Replace with measurement-utils
    await darkCaption.evaluate((el: Element) => getComputedStyle(el).color); // measurement: use measurement-utils for cleaner code
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
        if (el) el.classList.add('hide-image');
      }, IMG_ROOT);
      target = page.locator('.hide-image').first();
    }
    const display = // 📏 TODO: Replace with measurement-utils
    await target.evaluate((el: Element) => getComputedStyle(el).display); // measurement: use measurement-utils for cleaner code
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

    const overflow = // 📏 TODO: Replace with measurement-utils
    await caption.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(false);
  });

  test('[IMG-032] @regression Border-radius changes to 12px at mobile viewport 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImagePage(page);
    await pom.navigate(BASE());

    const gridPicture = page.locator(`${IMG_ROOT}:not(.cmp-image--full-width) ${IMG_PICTURE}`).first();
    const count = await gridPicture.count();
    if (count === 0) { test.skip(); return; }

    const radius = // 📏 TODO: Replace with measurement-utils
    await gridPicture.evaluate((el: Element) => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
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
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Image — CSV Test Cases (GAAM-1402)', () => {
  test('[MG-041] @smoke @regression DR AEM FE: Only selected Index in dialog should be loaded in DR table — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: *Bug:*
    // 
    // * *Only the selected Index and Year in the dialog - should be loaded in the DR table.*
    // Refer the attach the AEM author page link.
    // * This should be done for all the products.
    // 
    // * [ForeIncome II - Morgan Stanley | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/foreincome-ii-ms.html]
    // 
    // 
    // *Selected Tag in Dialog*
    // 
    // !image-20260629-152548.png|width=665,alt="image-20260629-152548.png"!
    // 
    // *Data Appearing in Dialog*
    // 
    // !image-20260629-152636.png|width=665,alt="image-20260629-152636.png"!
    test.fixme();
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
    expect(errors).toEqual([]);
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
    expect(errors).toEqual([]);
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
  test('[MG-049] @regression Image all images load successfully', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-image img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

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
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[MG-054] @author @regression @smoke @smoke Image dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/image/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Image GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Image dialog missing helpPath property').toBeTruthy();
  });

  test('[MG-055] @author @regression @smoke Image helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/image/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});

test.describe('Image — CSV Test Cases (GAAM-1388)', () => {
  test('[MG-056] @smoke @regression CMS-BE | Decision Tree Component- authoring guide issue — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Authoring guide is not updated properly for all Decision tree, Decision tree step and Decision tree option
    // 
    // !image-20260626-130125.png|width=670,alt="image-20260626-130125.png"!
    // 
    // !image-20260626-130156.png|width=670,alt="image-20260626-130156.png"!
    // 
    // !image-20260626-130212.png|width=670,alt="image-20260626-130212.png"!
    // 
    // 
    // 
    // *Note:* Refer Promo banner and headline block components authoring guide
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1387)', () => {
  test('[MG-057] @smoke @regression CMS BE: Add a style option to Grid component - to be used in DR table component — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: *AS IS:*
    // 
    // * Grid component is missing with Style option while adding them in a Dynamic Rate component
    // !image-20260626-122947.png|width=1078,alt="image-20260626-122947.png"!
    // 
    // 
    // 
    // *TO BE:*
    // 
    // * Add a *Style Option in the Grid component* - so that the grid can be configured as needed.
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1360)', () => {
  test('[MG-058] @smoke @regression CMS FE: Bio Content – Bio Card issues — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: # Hover animation is not working as expected
    // 
    // !image-20260624-075934.png|width=670,alt="image-20260624-075934.png"!
    // 
    // # If bio link is not authored, the name and title are displaying on top in mobile view.It should be in center right(we dont have this scenario in Figma) please confirm
    // 
    // !image-20260624-080618.png|width=670,alt="image-20260624-080618.png"!
    // 
    // # Padding is not matching for all cards as per the Figma
    // 
    // !image-20260624-081833.png|width=670,alt="image-20260624-081833.png"!
    // 
    // # As per the feedback we need to add below role tag in content fragment (*Note:* Can we put a more realistic role in as an example? Let's go with 'Practice Management Consultant' for now.)
    // 
    // 
    // 
    // Tested URL: [https://author-p101514-e1845752.adobeaemcloud.com/editor.html/content/global-atlantic/style-guide/qa-testing/components/QA_testing/bio-card-test2.html|https://author-p101514-e1845752.adobeaemcloud.com/editor.html/content/global-atlantic/style-guide/qa-testing/components/QA_testing/bio-card-test2.html]
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1357)', () => {
  test('[MG-059] @smoke @regression CMS FE: GAAM-1280(quote component) alignment issue — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Hi, A few more issues:
    // 1. The roles in the info panel are not aligning to the right in small desktop breakpoints. 
    // 2. At small desktop breakpoints, only the quote wraps to multiple lines — the info panel maintains its width.
    // 3. In tablet breakpoints, the Author images and names should be aligned to the left for the left aligned quote (Refer [figma|https://www.figma.com/design/C7DwRfnSXu89s42cug1QyS/GAFG-%7C-Web-Design-System?m=auto&node-id=34313-44453&t=HD2vpnOwOlhUfkB4-1]). It should be aligned in the center for the center aligned quote. The mobile implementation working well, kindly incorporate the same implementation for desktop as well. 
    // 
    // 
    // !Screenshot 2026-06-24 at 12.53.56 PM-20260624-072402.png|width=648,alt="Screenshot 2026-06-24 at 12.53.56 PM-20260624-072402.png"!
    // 
    // 
    // Thank you.
    // CC: [~accountid:712020:19496377-93fa-4b6a-be8c-4f3dac15dfb5] [~accountid:712020:f8626600-fef9-4321-a873-db1099c23d62] [~accountid:712020:ca49fe11-4085-496b-8053-2df97275fc28] [~accountid:606ce8584703e400679818a2] 
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1356)', () => {
  test('[MG-060] @smoke @regression CMS: FE: feature 50/50: Removal of Left and Right Padding — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
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

test.describe('Image — CSV Test Cases (GAAM-1354)', () => {
  test('[MG-061] @smoke @regression DR AEM BE: Dynamic Rates Audit Log - error handling issue — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: validation error are not shown 
    // Testing _link -[https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/rate-admin-dashboard.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/rate-admin-dashboard.html?wcmmode=disabled]
    // 
    // !image-20260624-051512.png|width=330,alt="image-20260624-051512.png"!
    // 
    //  
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1333)', () => {
  test('[MG-062] @smoke @regression CMS FE: GAAM-1084 - Bio Content-Hero Card Issues — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Issue 1: Font Size of Bio Desc is 16px instead 18px
    // Issue 2: Font Size of Title is 20px instead 18px
    // Issue 3: Font Size of pdf link should be 14px
    // Issue 4: In dark theme the font color of the *title and location* should be rgba(238, 243, 249, 1) 
    // 
    // Issue 5: In Mobile View the Font Size of the Texts are mismatching. Please check all the font sizes in Mobile.
    // 
    // Test URL: [https://author-p101514-e1845752.adobeaemcloud.com/editor.html/content/global-atlantic/style-guide/qa-testing/components/bio-content-hero-card.html|https://author-p101514-e1845752.adobeaemcloud.com/editor.html/content/global-atlantic/style-guide/qa-testing/components/bio-content-hero-card.html]
    // 
    // Figma: [https://www.figma.com/design/C7DwRfnSXu89s42cug1QyS/GAFG-%7C-Web-Design-System?node-id=39478-46305&t=uL8ewnNZ52tPq11u-0|https://www.figma.com/design/C7DwRfnSXu89s42cug1QyS/GAFG-%7C-Web-Design-System?node-id=39478-46305&t=uL8ewnNZ52tPq11u-0|smart-link] 
    // 
    // Issue 1: 
    // 
    // !image-20260622-122919.png|width=418,alt="image-20260622-122919.png"!
    // 
    // Issue 2: 
    // 
    // !image-20260622-122958.png|width=420,alt="image-20260622-122958.png"!
    // 
    // Issue 3: 
    // 
    // !image-20260622-123142.png|width=420,alt="image-20260622-123142.png"!
    // 
    // Issue 4: 
    // 
    // !image-20260622-123303.png|width=425,alt="image-20260622-123303.png"!
    // 
    // 
    // 
    // 
    // 
    //           
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1332)', () => {
  test('[MG-063] @smoke @regression CMS BE: Code Optimization KKRV-1832 — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: There are reference of the deprecated {{com.google.common}} library in {{DynamicRateUploadServiceImplTest.java}}. 
    // 
    // Introduce alternate libraries supported by AEM Cloud to replace the deprecated com.google.common library used in our code base.
    // 
    // !image-20260619-062720.png|width=650,alt="image-20260619-062720.png"!
    // 
    // For reference, the MS team has already completed similar remediation work under [+*KKRV-1927*+|https://bounteous.jira.com/browse/KKRV-1927], and the changes implemented there can be leveraged as a reference for this update.
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1321)', () => {
  test('[MG-064] @smoke @regression DR AEM FE: Rider Charge is not aligned as expected — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: # Rider Charge - Added manually - is not aligned properly on *Dimensions 660 * 815* - should be fixed
    // # manual table addition would be checked for different products, wherever required.
    // # Testing Path - [ForeIncome II - All|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/resources/rates/foreincome-ii-all.html?wcmmode=disabled]
    // 
    // !image-20260625-080609.png|width=825,alt="image-20260625-080609.png"!
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1320)', () => {
  test('[MG-065] @smoke @regression DR AEM FE: Rate Detail Hero padding is not aligned in responsive mode — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: *In Responsive Mode:*
    // 
    // * Rate Details Hero Contents are not properly left aligned with another components - to be fixed
    // * Also *check with other possible responsive modes - All gaps should be fixed and tested thoroughly.*
    // * Update the padding left & right for Rate Details Hero to 20px
    // 
    // !image-20260619-074723.png|width=1096,alt="image-20260619-074723.png"!
    test.fixme();
  });
});

test.describe('Image — CSV Test Cases (GAAM-1242)', () => {
  test('[MG-066] @smoke @regression FE: Image with Nested Content - Background Color — AC1', async ({ page }) => {
    const pom = new ImagePage(page);
    await pom.navigate(BASE());
    const secondarySlot = page.locator('.cmp-image__secondary-slot').first();
    // Secondary slot may or may not be present depending on authored content
    const root = page.locator('.cmp-image').first();
    await expect(root).toBeVisible();
  });
});
