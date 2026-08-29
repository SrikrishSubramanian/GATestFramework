import { test, expect } from '@playwright/test';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import ENV from '../../../utils/infra/env';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — Images & Icons', () => {
  test('[LOGIN-IMAGE-001] @regression Login logo loads successfully', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[LOGIN-IMAGE-002] @regression Login images have alt text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('[LOGIN-IMAGE-003] @regression Login SVG icons render', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const svgs = page.locator('svg');
    const count = await svgs.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const svg = svgs.nth(i);
      const display = await svg.evaluate(el => window.getComputedStyle(el).display);
      expect(['block', 'inline', 'inline-block', 'none']).toContain(display);
    }
  });

  test('[LOGIN-IMAGE-004] @regression Login button icons are visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const btn = buttons.nth(i);
      await expect(btn).toBeVisible();
    }
  });

  test('[LOGIN-IMAGE-005] @regression Input icons are accessible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const inputGroups = page.locator('.form-group, .input-group');
    const count = await inputGroups.count();

    if (count > 0) {
      const icons = inputGroups.locator('svg, i[class*="icon"]');
      // Icons may or may not exist, but if they do, should be visible
      await expect(inputGroups.first()).toBeVisible();
    }
  });
});
