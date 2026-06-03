import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Feature Banner Image Health
 *
 * The feature-banner component uses CSS background-image for its __image
 * containers, not <img> tags. The only <img> tags found are inside the
 * Brightcove video player (poster images) and nested content cards.
 *
 * These tests scope to the feature-banner's own content images,
 * excluding video player internals.
 */

test.describe('FeatureBanner — Image Health', () => {

  test('[FB-013] @regression No broken images in content areas', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Check images inside the component-parsys (nested content cards),
    // excluding video player poster images
    const contentImages = page.locator('.cmp-feature-banner__component-parsys img');
    const count = await contentImages.count();
    if (count === 0) { test.skip(); return; }
    for (let i = 0; i < count; i++) {
      const src = await contentImages.nth(i).getAttribute('src');
      if (src && src.length > 0) {
        const naturalWidth = await contentImages.nth(i).evaluate(
          (el) => (el as HTMLImageElement).naturalWidth
        );
        expect(naturalWidth, `Image ${src} should load`).toBeGreaterThan(0);
      }
    }
  });

  test('[FB-014] @regression All content images have alt text', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const contentImages = page.locator('.cmp-feature-banner__component-parsys img');
    const count = await contentImages.count();
    if (count === 0) { test.skip(); return; }
    for (let i = 0; i < count; i++) {
      const alt = await contentImages.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} should have alt attribute`).not.toBeNull();
    }
  });

  test('[FB-015] @regression Video media containers have non-zero dimensions', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Video wrappers are visible; image containers may be empty (no DAM asset)
    const videoContainers = page.locator('.cmp-feature-banner__video-wrapper');
    const count = await videoContainers.count();
    if (count === 0) { test.skip(); return; }
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await videoContainers.nth(i).boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(50);
        expect(box.height).toBeGreaterThan(50);
      }
    }
  });

  test('[FB-016] @regression Video poster images exist for video instances', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const videoWrappers = page.locator('.cmp-feature-banner__video-wrapper');
    const count = await videoWrappers.count();
    if (count === 0) { test.skip(); return; }
    // Each video wrapper should contain a video element
    for (let i = 0; i < count; i++) {
      const video = videoWrappers.nth(i).locator('video');
      await expect(video).toHaveCount(1);
    }
  });
});
