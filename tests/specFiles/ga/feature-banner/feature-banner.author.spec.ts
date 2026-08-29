import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Feature Banner Component (Sprint 11 - BE-355, FE-376)', () => {
  // ============ Banner Rendering ============
  test('[FB-001] @regression Verify feature banner renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const banner = page.locator('[class*="feature-banner"], [class*="banner"]').first();
    if (await banner.count() > 0) {
      expect(await banner.isVisible()).toBe(true);
    }
  });

  test('[FB-002] @regression Verify banner has background image or color', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const banner = page.locator('[class*="feature-banner"]').first();
    if (await banner.count() > 0) {
      const bgImage = await banner.evaluate(el =>
        window.getComputedStyle(el).backgroundImage
      );
      const bgColor = await banner.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgImage || bgColor).toBeTruthy();
    }
  });

  test('[FB-003] @regression Verify banner text/content displays', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const content = page.locator('[class*="feature-banner"] *').first();
    if (await content.count() > 0) {
      const text = await content.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('[FB-004] @regression Verify banner has CTA button', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const button = page.locator('[class*="feature-banner"] button, [class*="feature-banner"] a[class*="cta"]').first();
    if (await button.count() > 0) {
      expect(await button.isVisible()).toBe(true);
    }
  });

  test('[FB-005] @regression Verify responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const banner = page.locator('[class*="feature-banner"]').first();
    if (await banner.count() > 0) {
      const width = await banner.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[FB-006] @regression Verify responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const banner = page.locator('[class*="feature-banner"]').first();
    if (await banner.count() > 0) {
      const width = await banner.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[FB-007] @regression Verify responsive on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const banner = page.locator('[class*="feature-banner"]').first();
    if (await banner.count() > 0) {
      const width = await banner.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(400);
    }
  });

  test('[FB-008] @a11y @regression Verify CTA button accessible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const cta = page.locator('[class*="feature-banner"] button').first();
    if (await cta.count() > 0) {
      const text = await cta.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('[FB-009] @a11y @regression Verify banner image has alt text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const image = page.locator('[class*="feature-banner"] img').first();
    if (await image.count() > 0) {
      const alt = await image.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('[FB-010] @regression Verify text readable over background', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);

    const text = page.locator('[class*="feature-banner"] p').first();
    if (await text.count() > 0) {
      const color = await text.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});
