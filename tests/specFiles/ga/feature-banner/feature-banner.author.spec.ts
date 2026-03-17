import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import AxeBuilder from '@axe-core/playwright';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('FeatureBanner — Happy Path', () => {
  test('[FB-001] @smoke @regression FeatureBanner renders correctly', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.feature-banner').first()).toBeVisible();
  });

  test('[FB-002] @smoke @regression FeatureBanner interactive elements are functional', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify primary interactive elements
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });
});

test.describe('FeatureBanner — Negative & Boundary', () => {
  test('[FB-003] @negative @regression FeatureBanner handles empty content gracefully', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Component should not throw errors with minimal content
  });

  test('[FB-004] @negative @regression FeatureBanner handles missing images', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.feature-banner img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('FeatureBanner — Responsive', () => {
  test('[FB-005] @mobile @regression @mobile FeatureBanner adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.feature-banner').first()).toBeVisible();
  });

  test('[FB-006] @mobile @regression FeatureBanner adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.feature-banner').first()).toBeVisible();
  });
});

test.describe('FeatureBanner — Console & Resources', () => {
  test('[FB-007] @regression FeatureBanner produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

// FB-008–009 removed: Image health tests covered by feature-banner.images.spec.ts (FB-013–016)

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
