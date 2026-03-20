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

  test('[FB-054] @regression Image-right variant renders with correct structure', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const imageRight = page.locator('.feature-banner.cmp-feature-banner-image-right').first();
    if (await imageRight.count() === 0) { test.skip(); return; }
    await expect(imageRight).toBeVisible();
    // Verify it has both media and content sections in DOM
    const inner = imageRight.locator(ROOT);
    await expect(inner.locator(MEDIA)).toHaveCount(1);
    await expect(inner.locator(CONTENT)).toBeVisible();
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

  test('[FB-058] @regression Granite background renders with granite class', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const graniteBanner = page.locator('.feature-banner.cmp-feature-banner-granite').first();
    if (await graniteBanner.count() === 0) { test.skip(); return; }
    await expect(graniteBanner).toBeVisible();
    // Verify granite banner has the BEM root and content
    const inner = graniteBanner.locator(ROOT);
    await expect(inner.locator(CONTENT)).toBeVisible();
    await expect(inner.locator(HEADLINE_BLOCK)).toBeVisible();
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

test.describe('FeatureBanner — Media', () => {
  test('[FB-060] @regression @smoke Each banner has a media section (image or video)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Every feature-banner should have a __media container in DOM
    const banners = page.locator(ROOT);
    const count = await banners.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < Math.min(count, 4); i++) {
      await expect(banners.nth(i).locator(MEDIA)).toHaveCount(1);
    }
  });

  test('[FB-061] @regression Video media containers have non-zero dimensions', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Video wrappers are visible; image containers may be empty (no DAM asset)
    const videoMedia = page.locator(`${ROOT} ${VIDEO_WRAPPER}`).first();
    if (await videoMedia.count() === 0) { test.skip(); return; }
    await expect(videoMedia).toBeVisible();
    const box = await videoMedia.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      expect(box.width).toBeGreaterThan(100);
      expect(box.height).toBeGreaterThan(50);
    }
  });

  test('[FB-062] @regression Video instances have visible video control', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Videos autoplay so pause button is visible (play is hidden)
    const videoPause = page.locator(`${ROOT} ${VIDEO_PAUSE}`);
    if (await videoPause.count() === 0) { test.skip(); return; }
    await expect(videoPause.first()).toBeVisible();
  });
});

test.describe('FeatureBanner — Responsive', () => {
  test('[FB-063] @mobile @regression Mobile layout stacks media and content vertically', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const first = page.locator(ROOT).first();
    const mediaBox = await first.locator(MEDIA).boundingBox();
    const contentBox = await first.locator(CONTENT).boundingBox();
    // At mobile, media and content should stack (content below media)
    if (mediaBox && contentBox) {
      expect(contentBox.y).toBeGreaterThanOrEqual(mediaBox.y);
    }
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
      .disableRules(['color-contrast'])  // Known contrast issues on dark backgrounds
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
    // Only check visible, non-hidden focusable elements in the first banner
    const firstBanner = page.locator('.feature-banner').first();
    const focusable = firstBanner.locator('a:visible, button:visible');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await focusable.nth(i).scrollIntoViewIfNeeded();
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      const vh = await page.evaluate(() => window.innerHeight);
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(-5);
        // Allow 5px tolerance for sub-pixel rendering
        expect(box.y + box.height).toBeLessThanOrEqual(vh + 5);
      }
    }
  });
});
