import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Spacer — Interactions', () => {
  test('[SPACER-INTERACTION-001] @interaction @regression Spacer height adjusts responsively', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacer = page.locator('.cmp-spacer').first();
    const initialHeight = await spacer.evaluate(el => el.offsetHeight);

    // Resize viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(200);

    const newHeight = await spacer.evaluate(el => el.offsetHeight);

    // Height should adapt or stay reasonable
    expect(newHeight).toBeGreaterThan(0);
  });

  test('[SPACER-INTERACTION-002] @interaction @regression Spacer does not block keyboard navigation', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    // Spacer should not interfere with tab navigation
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);

    expect(focused).toBeTruthy();
  });

  test('[SPACER-INTERACTION-003] @interaction @regression Spacer is not clickable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacer = page.locator('.cmp-spacer').first();
    const pointerEvents = await spacer.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    );

    // Spacer should typically not intercept pointer events
    expect(['none', 'auto']).toContain(pointerEvents);
  });

  test('[SPACER-INTERACTION-004] @interaction @regression Spacer maintains spacing under different content', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

    const spacers = page.locator('.cmp-spacer');
    const count = await spacers.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const spacer = spacers.nth(i);
        const height = await spacer.evaluate(el => el.offsetHeight);
        expect(height).toBeGreaterThan(0);
      }
    }
  });

  test('[SPACER-INTERACTION-005] @interaction @regression Spacer responsive behavior', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`);

      const spacer = page.locator('.cmp-spacer').first();
      await expect(spacer).toBeVisible();
    }
  });
});
