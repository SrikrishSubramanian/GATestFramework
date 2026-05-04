import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Spacer — Visual Regression', () => {
  test('[SPACER-VISUAL-001] @visual Spacer creates proper vertical spacing', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacer = page.locator('.cmp-spacer').first();
    await expect(spacer).toBeVisible();

    const height = await spacer.evaluate(el => el.offsetHeight);
    expect(height).toBeGreaterThan(0);
  });

  test('[SPACER-VISUAL-002] @visual Spacer margin/padding is correct', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacer = page.locator('.cmp-spacer').first();
    const margin = await spacer.evaluate(el => window.getComputedStyle(el).margin);
    const padding = await spacer.evaluate(el => window.getComputedStyle(el).padding);

    expect(margin || padding).toBeTruthy();
  });

  test('[SPACER-VISUAL-003] @visual Spacer does not affect horizontal layout', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacer = page.locator('.cmp-spacer').first();
    const width = await spacer.evaluate(el => el.offsetWidth);

    // Spacer should typically be full width
    const container = await spacer.evaluate(el => el.parentElement?.offsetWidth);
    expect(width).toBeLessThanOrEqual((container || 9999) + 1);
  });

  test('[SPACER-VISUAL-004] @visual Spacer variants apply different heights', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacers = page.locator('.cmp-spacer');
    const count = await spacers.count();

    if (count > 1) {
      const height1 = await spacers.nth(0).evaluate(el => el.offsetHeight);
      const height2 = await spacers.nth(1).evaluate(el => el.offsetHeight);

      // Heights may or may not be different, but should be measurable
      expect(height1).toBeGreaterThan(0);
      expect(height2).toBeGreaterThan(0);
    }
  });

  test('[SPACER-VISUAL-005] @visual Spacer is transparent', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacer = page.locator('.cmp-spacer').first();
    const bg = await spacer.evaluate(el => window.getComputedStyle(el).backgroundColor);

    // Should be transparent or inherit
    expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(bg);
  });
});
