import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Text — Images & Media', () => {
  test('[TEXT-IMAGE-001] @regression Text embedded images load', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const images = page.locator('.cmp-text img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[TEXT-IMAGE-002] @regression Text images have alt text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const images = page.locator('.cmp-text img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('[TEXT-IMAGE-003] @regression Text image sizing is responsive', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const images = page.locator('.cmp-text img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const img = images.nth(i);
      const width = await img.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(0);
    }
  });

  test('[TEXT-IMAGE-004] @regression Text figure elements are semantic', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const figures = page.locator('.cmp-text figure');
    const count = await figures.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 2); i++) {
        const figure = figures.nth(i);
        const img = figure.locator('img').first();
        await expect(img).toBeVisible();
      }
    }
  });

  test('[TEXT-IMAGE-005] @regression Text icons are visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const icons = page.locator('.cmp-text svg, .cmp-text i[class*="icon"]');
    const count = await icons.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const icon = icons.nth(i);
      await expect(icon).toBeVisible();
    }
  });
});
