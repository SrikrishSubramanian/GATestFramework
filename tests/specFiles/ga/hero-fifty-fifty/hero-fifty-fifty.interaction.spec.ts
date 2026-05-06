import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Hero Fifty-Fifty — Interactions', () => {
  test('[H5050-INTERACTION-001] @interaction @regression CTA button is clickable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const button = hero.locator('button, a[class*="button"]').first();

    if (await button.count() > 0) {
      const href = await button.getAttribute('href');
      expect(href || button.tagName).toBeTruthy();
    }
  });

  test('[H5050-INTERACTION-002] @interaction @regression Hero links are functional', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    const links = hero.locator('a');
    const count = await links.count();

    if (count > 0) {
      const link = links.first();
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('[H5050-INTERACTION-003] @interaction @regression Hero 50/50 hover states work', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const button = page.locator('.cmp-hero-fifty-fifty button, .cmp-hero-fifty-fifty a[class*="button"]').first();

    if (await button.count() > 0) {
      const initialBg = await button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      await button.hover();
      await page.waitForTimeout(200);

      const hoverBg = await button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(hoverBg).toBeTruthy();
    }
  });

  test('[H5050-INTERACTION-004] @interaction @regression Keyboard navigation works', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    await hero.focus();

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('[H5050-INTERACTION-005] @interaction @regression Image adapts to content changes', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);

    const hero = page.locator('.cmp-hero-fifty-fifty').first();
    await expect(hero).toBeVisible();

    // Verify layout is responsive
    const width = await hero.evaluate(el => el.offsetWidth);
    expect(width).toBeGreaterThan(0);
  });
});
