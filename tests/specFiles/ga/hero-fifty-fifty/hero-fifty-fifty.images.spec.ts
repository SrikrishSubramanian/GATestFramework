import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Hero Fifty-Fifty — Images & Media', () => {
  test('[H5050-IMAGE-001] @regression Hero hero image loads successfully', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const images = hero.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[H5050-IMAGE-002] @regression Hero images have alt text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const images = hero.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('[H5050-IMAGE-003] @regression Hero image is responsive', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const image = hero.locator('img').first();

    if (await image.count() > 0) {
      const width = await image.evaluate(el => el.offsetWidth);
      const maxWidth = await image.evaluate(el =>
        window.getComputedStyle(el).maxWidth
      );

      expect(width).toBeGreaterThan(0);
      expect(maxWidth).not.toBe('none');
    }
  });

  test('[H5050-IMAGE-004] @regression Hero image aspect ratio is maintained', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const image = hero.locator('img').first();

    if (await image.count() > 0) {
      const width = await image.evaluate(el => (el as HTMLImageElement).naturalWidth);
      const height = await image.evaluate(el => (el as HTMLImageElement).naturalHeight);

      if (width > 0 && height > 0) {
        const ratio = width / height;
        expect(ratio).toBeGreaterThan(0.5);
      }
    }
  });

  test('[H5050-IMAGE-005] @regression Hero background images are styled correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const bgElements = hero.locator('[style*="background-image"]');
    const count = await bgElements.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const el = bgElements.nth(i);
      const bgImage = await el.evaluate(el =>
        window.getComputedStyle(el).backgroundImage
      );

      if (bgImage !== 'none') {
        expect(bgImage).toMatch(/url\(/);
      }
    }
  });
});
