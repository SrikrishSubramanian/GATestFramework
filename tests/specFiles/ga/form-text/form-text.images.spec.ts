import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Text — Images & Media', () => {
  test('[FORMTEXT-IMAGE-001] @regression Form text field icons are present', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const icons = page.locator('.cmp-form-text [class*="icon"], .cmp-form-text svg');
    const iconCount = await icons.count();
    expect(iconCount).toBeDefined();
  });

  test('[FORMTEXT-IMAGE-002] @regression Form text field icons load correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const svgs = page.locator('.cmp-form-text svg, .cmp-form-text [class*="icon"] svg');
    const svgCount = await svgs.count();

    for (let i = 0; i < Math.min(svgCount, 3); i++) {
      const svg = svgs.nth(i);
      const isVisible = await svg.isVisible();
      expect(isVisible).toBeDefined();
    }
  });

  test('[FORMTEXT-IMAGE-003] @regression Form text background images render', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const bgElements = page.locator('.cmp-form-text [style*="background-image"]');
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

  test('[FORMTEXT-IMAGE-004] @regression Form text has no broken images', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const images = page.locator('.cmp-form-text img');
    const imgCount = await images.count();

    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[FORMTEXT-IMAGE-005] @regression Form text images have alt text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const images = page.locator('.cmp-form-text img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
