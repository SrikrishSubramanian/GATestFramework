import { test, expect } from '../../../utils/infra/persistent-context';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Feature Banner State Matrix
 *
 * Background variants are applied directly on the .feature-banner wrapper
 * as style-system classes (not on parent sections):
 *   - default (no bg class) = white background
 *   - cmp-feature-banner-slate = slate background
 *   - cmp-feature-banner-granite = granite background
 *
 * Layout variants:
 *   - default = page-width, image-left
 *   - cmp-feature-banner-image-right = image on right
 *   - cmp-feature-banner-grid-width = narrower grid width
 *
 * 8 instances on the style guide page:
 *   1. default (white, image-left, page-width)
 *   2. default (white, video, page-width)
 *   3. slate (image-left, page-width)
 *   4. granite + image-right (page-width)
 *   5. image-right (video, page-width)
 *   6. image-right (image, page-width)
 *   7. grid-width (image-left)
 *   8. slate + image-right + grid-width (video)
 */

const COMPONENT = '.feature-banner';
const CMP_ROOT = '.cmp-feature-banner';

// ── Valid: feature-banner across available backgrounds ─────────────────

test.describe('FeatureBanner — State Matrix (Valid)', () => {

  test('[FB-025] @matrix @regression feature-banner in default (white) background', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Default = no background modifier class
    const defaultBanner = page.locator(`${COMPONENT}:not(.cmp-feature-banner-slate):not(.cmp-feature-banner-granite)`).first();
    await expect(defaultBanner).toBeVisible();
    await expect(defaultBanner.locator(CMP_ROOT)).toBeVisible();
  });

  test('[FB-026] @matrix @regression feature-banner in slate background', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const slateBanner = page.locator(`${COMPONENT}.cmp-feature-banner-slate`).first();
    await expect(slateBanner).toBeVisible();
    await expect(slateBanner.locator(CMP_ROOT)).toBeVisible();
  });

  test('[FB-027] @matrix @regression feature-banner in granite background', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const graniteBanner = page.locator(`${COMPONENT}.cmp-feature-banner-granite`).first();
    await expect(graniteBanner).toBeVisible();
    await expect(graniteBanner.locator(CMP_ROOT)).toBeVisible();
  });
});

// ── Layout Variants ───────────────────────────────────────────────────

test.describe('FeatureBanner — State Matrix (Layout Variants)', () => {

  test('[FB-028] @matrix @regression image-right variant renders', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const imageRight = page.locator(`${COMPONENT}.cmp-feature-banner-image-right`).first();
    await expect(imageRight).toBeVisible();
    await expect(imageRight.locator(CMP_ROOT)).toBeVisible();
  });

  test('[FB-029] @matrix @regression grid-width variant renders', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const gridWidth = page.locator(`${COMPONENT}.cmp-feature-banner-grid-width`).first();
    await expect(gridWidth).toBeVisible();
    await expect(gridWidth.locator(CMP_ROOT)).toBeVisible();
  });

  test('[FB-030] @matrix @regression combined variant: slate + image-right + grid-width', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const combined = page.locator(`${COMPONENT}.cmp-feature-banner-slate.cmp-feature-banner-image-right.cmp-feature-banner-grid-width`).first();
    await expect(combined).toBeVisible();
    await expect(combined.locator(CMP_ROOT)).toBeVisible();
  });
});

// ── Responsive: mobile viewport ───────────────────────────────────────

test.describe('FeatureBanner — State Matrix (Responsive)', () => {

  test('[FB-031] @matrix @regression @mobile default banner renders at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const banner = page.locator(COMPONENT).first();
    await expect(banner).toBeVisible();
    const box = await banner.boundingBox();
    expect(box).toBeTruthy();
    // Should use full width at mobile
    if (box) expect(box.width).toBeGreaterThanOrEqual(350);
  });

  test('[FB-032] @matrix @regression @mobile slate banner renders at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const slateBanner = page.locator(`${COMPONENT}.cmp-feature-banner-slate`).first();
    await expect(slateBanner).toBeVisible();
  });

  test('[FB-033] @matrix @regression @mobile granite banner renders at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const graniteBanner = page.locator(`${COMPONENT}.cmp-feature-banner-granite`).first();
    await expect(graniteBanner).toBeVisible();
  });
});

// ── Cross-variant: video + background combos ──────────────────────────

test.describe('FeatureBanner — State Matrix (Media Types)', () => {

  test('[FB-034] @matrix @regression image-based banner has __image container in DOM', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // First instance is image-based (no video); __image div exists but may be
    // hidden if no DAM asset is configured in the style guide
    const imageBanner = page.locator(COMPONENT).first();
    const imageContainer = imageBanner.locator('.cmp-feature-banner__image');
    await expect(imageContainer).toHaveCount(1);
  });

  test('[FB-035] @matrix @regression video-based banner has __video-wrapper container', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Second instance has video
    const videoBanner = page.locator(`${COMPONENT}:has(.cmp-feature-banner__video-wrapper)`).first();
    await expect(videoBanner).toBeVisible();
    await expect(videoBanner.locator('.cmp-feature-banner__video-wrapper')).toBeVisible();
  });
});
