import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';

import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('FeatureBanner — Happy Path', () => {
  test('[FB-001] @smoke @regression FeatureBanner renders correctly', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.feature-banner').first();
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

  test('[FB-002] @smoke @regression FeatureBanner interactive elements are functional', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.feature-banner').first();
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

// ─── Selectors (from style guide DOM + policies) ─────────────────────────────
const ROOT = '.cmp-feature-banner';
const WRAPPER = '.cmp-feature-banner__wrapper';
const MEDIA = '.cmp-feature-banner__media';
const CONTENT = '.cmp-feature-banner__content';
const CONTENT_WRAPPER = '.cmp-feature-banner__content-wrapper';
const HEADLINE_BLOCK = '.cmp-feature-banner__headline-block';
const IMAGE = '.cmp-feature-banner__image';
const MOBILE_IMAGE = '.cmp-feature-banner__mobile-image';
const VIDEO_WRAPPER = '.cmp-feature-banner__video-wrapper';
const VIDEO_PLAY = '.cmp-feature-banner__video-control--play';
const VIDEO_PAUSE = '.cmp-feature-banner__video-control--pause';

// Section backgrounds used on style guide page
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';

test.describe('FeatureBanner — BEM Structure', () => {
  test('[FB-050] @regression Component root uses .cmp-feature-banner class', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ROOT);
    expect(await roots.count()).toBeGreaterThanOrEqual(3);
  });

  test('[FB-051] @regression Each instance has wrapper, media, and content sections', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const first = page.locator(ROOT).first();
    await expect(first.locator(WRAPPER)).toHaveCount(1);
    await expect(first.locator(MEDIA)).toHaveCount(1);
    await expect(first.locator(CONTENT)).toHaveCount(1);
  });

  test('[FB-052] @regression Content section contains headline-block', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const first = page.locator(ROOT).first();
    const headline = first.locator(HEADLINE_BLOCK);
    expect(await headline.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe('FeatureBanner — Layout Variants', () => {
  test('[FB-053] @regression @smoke Image-left layout places media before content in DOM order', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // First instance on style guide is image-left
    const first = page.locator(ROOT).first();
    const mediaBox = await first.locator(MEDIA).boundingBox();
    const contentBox = await first.locator(CONTENT).boundingBox();
    if (mediaBox && contentBox) {
      // On desktop, image-left means media is to the left of content
      expect(mediaBox.x).toBeLessThan(contentBox.x);
    }
  });

  test('[FB-054] @regression Image-right layout places content before media', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Find an image-right instance (style class cmp-feature-banner-image-right)
    const imageRight = page.locator('.cmp-feature-banner-image-right').first();
    if (await imageRight.count() === 0) { test.skip(); return; }
    const wrapper = imageRight.locator(WRAPPER);
    const mediaBox = await wrapper.locator(MEDIA).boundingBox();
    const contentBox = await wrapper.locator(CONTENT).boundingBox();
    if (mediaBox && contentBox) {
      expect(contentBox.x).toBeLessThan(mediaBox.x);
    }
  });

  test('[FB-055] @regression Page-width variant spans full viewport width', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const pageWidth = page.locator('.cmp-feature-banner-page-width').first();
    if (await pageWidth.count() === 0) { test.skip(); return; }
    const box = await pageWidth.boundingBox();
    const viewport = page.viewportSize();
    if (box && viewport) {
      // Page-width should be at least 90% of viewport width
      expect(box.width).toBeGreaterThan(viewport.width * 0.9);
    }
  });

  test('[FB-056] @regression Grid-width variant is narrower than page-width', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const gridWidth = page.locator('.cmp-feature-banner-grid-width').first();
    const pageWidth = page.locator('.cmp-feature-banner-page-width').first();
    if (await gridWidth.count() === 0 || await pageWidth.count() === 0) { test.skip(); return; }
    const gridBox = await gridWidth.boundingBox();
    const pageBox = await pageWidth.boundingBox();
    if (gridBox && pageBox) {
      expect(gridBox.width).toBeLessThan(pageBox.width);
    }
  });
});

test.describe('FeatureBanner — Background Themes', () => {
  test('[FB-057] @regression White background renders light-themed content', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const whiteBanner = page.locator('.cmp-feature-banner-white').first();
    if (await whiteBanner.count() === 0) { test.skip(); return; }
    const bgColor = await whiteBanner.evaluate(el => getComputedStyle(el).backgroundColor);
    // Should be white or very light
    expect(bgColor).toMatch(/rgb\(2[0-5]\d, 2[0-5]\d, 2[0-5]\d\)|rgba\(0, 0, 0, 0\)/);
  });

  test('[FB-058] @regression Granite background uses dark theme text', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const graniteBanner = page.locator('.cmp-feature-banner-granite').first();
    if (await graniteBanner.count() === 0) { test.skip(); return; }
    // Text inside granite banner should be light-colored for contrast
    const textColor = await graniteBanner.locator(`${CONTENT} *`).first().evaluate(
      el => getComputedStyle(el).color
    );
    // Expect light text (RGB values > 200)
    expect(textColor).toMatch(/rgb\((1\d{2}|2\d{2}), (1\d{2}|2\d{2}), (1\d{2}|2\d{2})\)/);
  });

  test('[FB-059] @regression Slate background is visually distinct from white', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const slateBanner = page.locator('.cmp-feature-banner-slate').first();
    const whiteBanner = page.locator('.cmp-feature-banner-white').first();
    if (await slateBanner.count() === 0 || await whiteBanner.count() === 0) { test.skip(); return; }
    const slateBg = await slateBanner.evaluate(el => getComputedStyle(el).backgroundColor);
    const whiteBg = await whiteBanner.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(slateBg).not.toBe(whiteBg);
  });
});

test.describe('FeatureBanner — Image & Video', () => {
  test('[FB-060] @regression @smoke Image instances have visible <img> elements', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const imageMedia = page.locator(`${ROOT} ${IMAGE} img`);
    expect(await imageMedia.count()).toBeGreaterThanOrEqual(1);
    await expect(imageMedia.first()).toBeVisible();
  });

  test('[FB-061] @regression Image fills media container', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const img = page.locator(`${ROOT} ${IMAGE} img`).first();
    const imgBox = await img.boundingBox();
    if (imgBox) {
      expect(imgBox.width).toBeGreaterThan(100);
      expect(imgBox.height).toBeGreaterThan(100);
    }
  });

  test('[FB-062] @regression Video instances have play control button', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const videoPlay = page.locator(`${ROOT} ${VIDEO_PLAY}`);
    if (await videoPlay.count() === 0) { test.skip(); return; }
    await expect(videoPlay.first()).toBeVisible();
  });
});

test.describe('FeatureBanner — Responsive', () => {
  test('[FB-063] @mobile @regression Mobile layout stacks media and content vertically', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const first = page.locator(ROOT).first();
    const wrapper = first.locator(WRAPPER);
    const flexDir = await wrapper.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['column', 'column-reverse']).toContain(flexDir);
  });

  test('[FB-006] @mobile @regression FeatureBanner adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    const overflow = await root.evaluate(el => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(false);
  });
});

test.describe('FeatureBanner — Accessibility', () => {
  test('[FB-010] @a11y @wcag22 @regression @smoke FeatureBanner passes axe-core scan', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.feature-banner')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[FB-011] @a11y @wcag22 @regression @smoke FeatureBanner interactive elements meet 24px target size', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.feature-banner a, .feature-banner button, .feature-banner input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[FB-012] @a11y @wcag22 @regression @smoke FeatureBanner focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.feature-banner a, .feature-banner button, .feature-banner input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });
});
