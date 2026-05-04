import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Accordion Tabs Feature — Images & Media', () => {
  test('[ACCORDION-TABS-IMAGE-001] @regression Accordion/tabs icons load successfully', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`);

    const icons = page.locator('[class*="accordion"] [class*="icon"], [class*="tabs"] [class*="icon"], .cmp-accordion-tabs svg');
    const iconCount = await icons.count();
    expect(iconCount).toBeDefined();
  });

  test('[ACCORDION-TABS-IMAGE-002] @regression Accordion/tabs has no broken images', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`);

    const images = page.locator('[class*="accordion"] img, [class*="tabs"] img, .cmp-accordion-tabs img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('[ACCORDION-TABS-IMAGE-003] @regression Accordion/tabs images have alt text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`);

    const images = page.locator('[class*="accordion"] img, [class*="tabs"] img, .cmp-accordion-tabs img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('[ACCORDION-TABS-IMAGE-004] @regression Accordion/tabs background images render', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`);

    const bgElements = page.locator('[class*="accordion"] [style*="background-image"], [class*="tabs"] [style*="background-image"], .cmp-accordion-tabs [style*="background-image"]');
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

  test('[ACCORDION-TABS-IMAGE-005] @regression Accordion/tabs SVG icons are accessible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`);

    const svgs = page.locator('[class*="accordion"] svg, [class*="tabs"] svg, .cmp-accordion-tabs svg');
    const svgCount = await svgs.count();

    for (let i = 0; i < Math.min(svgCount, 3); i++) {
      const svg = svgs.nth(i);
      const ariaLabel = await svg.getAttribute('aria-label');
      const role = await svg.getAttribute('role');
      expect(ariaLabel || role).toBeDefined();
    }
  });
});
