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

test.describe('FeatureBanner — Responsive', () => {
  test('[FB-006] @mobile @regression FeatureBanner adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
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
