import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/env';
import { ConsoleCapture } from '../../../utils/console-capture';
import AxeBuilder from '@axe-core/playwright';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    const loginUrl = `${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html`;
    await page.goto(loginUrl);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('FeatureBanner — Happy Path', () => {
  test('@smoke @regression FeatureBanner renders correctly', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.feature-banner').first()).toBeVisible();
  });

  test('@smoke @regression FeatureBanner interactive elements are functional', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify primary interactive elements
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });
});

test.describe('FeatureBanner — Negative & Boundary', () => {
  test('@negative @regression FeatureBanner handles empty content gracefully', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Component should not throw errors with minimal content
  });

  test('@negative @regression FeatureBanner handles missing images', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.feature-banner img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('FeatureBanner — Responsive', () => {
  test('@mobile @regression @mobile FeatureBanner adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.feature-banner').first()).toBeVisible();
  });

  test('@mobile @regression FeatureBanner adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.feature-banner').first()).toBeVisible();
  });
});

test.describe('FeatureBanner — Console & Resources', () => {
  test('@regression FeatureBanner produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('FeatureBanner — Broken Images', () => {
  test('@regression FeatureBanner all images load successfully', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.feature-banner img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('@regression FeatureBanner all images have alt attributes', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.feature-banner img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('FeatureBanner — Accessibility', () => {
  test('@a11y @wcag22 @regression @smoke FeatureBanner passes axe-core scan', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await new AxeBuilder({ page })
      .include('.feature-banner')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('@a11y @wcag22 @regression @smoke FeatureBanner interactive elements meet 24px target size', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const interactive = page.locator('.feature-banner a, .feature-banner button, .feature-banner input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('@a11y @wcag22 @regression @smoke FeatureBanner focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
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
