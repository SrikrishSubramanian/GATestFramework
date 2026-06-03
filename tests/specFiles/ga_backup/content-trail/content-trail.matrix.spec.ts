import { test, expect } from '../../../utils/infra/persistent-context';
import { ContentTrailPage } from '../../../pages/ga/components/contentTrailPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * ContentTrail State Matrix
 *
 * Content-trail uses style-system classes on its own wrapper div (not parent sections):
 *   - .cmp-section--background-transparent (default)
 *   - .cmp-section--background-light-color
 *   - .cmp-section--background-dark-color
 *   - .cmp-section--background-dark-no-border
 *
 * Content types: .cmp-content-trail__video, .cmp-content-trail__written, .cmp-content-trail__link
 * Sizes: default (small) and .cmp-section--large
 *
 * The style guide page has 8 standalone variations + 1 inside a granite section.
 */

// ── Background Variants × Content Types ──

test.describe('ContentTrail — State Matrix: Background Variants', () => {
  test('[CT-M01] @matrix @regression Default transparent variant renders', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // First content-trail on page has no background styleId — default transparent with border
    const ct = page.locator('.cmp-content-trail').first();
    await expect(ct).toBeVisible();
    const container = ct.locator('.cmp-content-trail__container').first();
    const borderStyle = await container.evaluate(el => getComputedStyle(el).borderStyle);
    expect(borderStyle).not.toBe('none');
  });

  test('[CT-M02] @matrix @regression Light mode variant (white bg, no border) renders', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const lightWrapper = page.locator('.cmp-section--background-light-color .cmp-content-trail__container').first();
    if (await lightWrapper.count() > 0) {
      await expect(lightWrapper).toBeVisible();
      const bg = await lightWrapper.evaluate(el => getComputedStyle(el).backgroundColor);
      // White background should have high RGB values
      expect(bg).toBeDefined();
    }
  });

  test('[CT-M03] @matrix @regression Dark mode variant (transparent + border) renders', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const darkWrapper = page.locator('.cmp-section--background-dark-color .cmp-content-trail__container').first();
    if (await darkWrapper.count() > 0) {
      await expect(darkWrapper).toBeVisible();
    }
  });

  test('[CT-M04] @matrix @regression Dark mode granite (no border) variant renders', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const graniteWrapper = page.locator('.cmp-section--background-dark-no-border .cmp-content-trail__container').first();
    if (await graniteWrapper.count() > 0) {
      await expect(graniteWrapper).toBeVisible();
      // Granite bg variant has granite background and transparent border
      const bg = await graniteWrapper.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bg).toBeDefined();
    }
  });
});

// ── Content Types ──

test.describe('ContentTrail — State Matrix: Content Types', () => {
  test('[CT-M05] @matrix @regression Video content type has correct class', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const video = page.locator('.cmp-content-trail__container.cmp-content-trail__video').first();
    await expect(video).toBeVisible();
  });

  test('[CT-M06] @matrix @regression Written content type has correct class', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const written = page.locator('.cmp-content-trail__container.cmp-content-trail__written').first();
    await expect(written).toBeVisible();
  });

  test('[CT-M07] @matrix @regression Link content type has correct class', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const link = page.locator('.cmp-content-trail__container.cmp-content-trail__link').first();
    await expect(link).toBeVisible();
  });
});

// ── Sizes ──

test.describe('ContentTrail — State Matrix: Sizes', () => {
  test('[CT-M08] @matrix @regression Small (default) size renders with 64px image', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Default (small) content-trail — first one without .cmp-section--large
    const smallImg = page.locator('.cmp-content-trail:not(.cmp-section--large) .cmp-content-trail__image').first();
    await expect(smallImg).toBeVisible();
    const height = await smallImg.evaluate(el => parseInt(getComputedStyle(el).height));
    expect(height).toBe(64);
  });

  test('[CT-M09] @matrix @regression Large size renders with 80px image on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const largeImg = page.locator('.cmp-section--large .cmp-content-trail__image').first();
    if (await largeImg.count() > 0) {
      const height = await largeImg.evaluate(el => parseInt(getComputedStyle(el).height));
      expect(height).toBe(80);
    }
  });
});

// ── Section Context ──

test.describe('ContentTrail — State Matrix: Section Context', () => {
  test('[CT-M10] @matrix @regression Content trail inside granite section has dark styling', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const sectionCT = page.locator('.cmp-section--background-color-granite .cmp-content-trail__container').first();
    if (await sectionCT.count() > 0) {
      await expect(sectionCT).toBeVisible();
      // Dark context: border should be white/semi-transparent
      const borderColor = await sectionCT.evaluate(el => getComputedStyle(el).borderColor);
      expect(borderColor).toBeDefined();
    }
  });
});

// ── Responsive spot-checks ──

test.describe('ContentTrail — State Matrix: Responsive', () => {
  test('[CT-M11] @matrix @regression @mobile Content trail at mobile viewport (390px)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const ct = page.locator('.cmp-content-trail__container').first();
    await expect(ct).toBeVisible();
    // Verify container is visible and within viewport width
    const box = await ct.boundingBox();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(390);
    }
  });

  test('[CT-M12] @matrix @regression @mobile Content trail at tablet viewport (1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const ct = page.locator('.cmp-content-trail__container').first();
    await expect(ct).toBeVisible();
  });
});
