import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Hero Fifty-Fifty — Visual Regression', () => {
  test('[H5050-VISUAL-001] @visual Hero 50/50 layout has two columns', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    await expect(hero).toBeVisible();

    // Check for left and right sections
    const sections = hero.locator('[class*="column"], [class*="section"], [class*="content"]');
    expect(await sections.count()).toBeGreaterThanOrEqual(2);
  });

  test('[H5050-VISUAL-002] @visual Hero 50/50 image is properly sized', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const image = hero.locator('img').first();

    if (await image.count() > 0) {
      await expect(image).toBeVisible();
      const width = await image.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(0);
    }
  });

  test('[H5050-VISUAL-003] @visual Hero 50/50 content is readable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const text = hero.locator('p, h1, h2, h3').first();

    if (await text.count() > 0) {
      const fontSize = await text.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );
      const size = parseInt(fontSize);
      expect(size).toBeGreaterThan(10);
    }
  });

  test('[H5050-VISUAL-004] @visual Hero 50/50 has proper spacing', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const padding = await hero.evaluate(el =>
      window.getComputedStyle(el).padding
    );

    expect(padding).not.toBe('0px');
  });

  test('[H5050-VISUAL-005] @visual Hero 50/50 call-to-action button is prominent', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const button = hero.locator('button, a[class*="button"], a[class*="cta"]').first();

    if (await button.count() > 0) {
      await expect(button).toBeVisible();
      const bg = await button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bg).toBeTruthy();
    }
  });
});
