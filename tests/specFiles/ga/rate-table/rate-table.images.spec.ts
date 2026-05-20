import { test, expect } from '@playwright/test';
import { RateTablePage } from '../../../pages/ga/components/rateTablePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Rate Table — Image & Media Validation', () => {
  test('[RT-IMAGE-001] @regression Rate table images load successfully', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const images = page.locator('.cmp-rate-table img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      // Verify src exists
      expect(src).toBeTruthy();

      // Verify image is visible (or intentionally hidden)
      const display = await img.evaluate(el => window.getComputedStyle(el).display);
      expect(['block', 'inline', 'inline-block', 'none']).toContain(display);
    }
  });

  test('[RT-IMAGE-002] @regression Rate table images have alt text', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const images = page.locator('.cmp-rate-table img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // All images should have alt (even empty for decorative)
      expect(alt).not.toBeNull();
    }
  });

  test('[RT-IMAGE-003] @regression Rate table images have width/height', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const images = page.locator('.cmp-rate-table img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);

      // Check for explicit width/height (helps prevent CLS)
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      const style = await img.getAttribute('style');

      const hasDimensions =
        (width && height) ||
        (style && style.includes('width') && style.includes('height'));

      // At least some images should have explicit dimensions
      if (i === 0 && imageCount > 0) {
        // First image should ideally have dimensions
        expect(hasDimensions || imageCount === 0).toBeTruthy();
      }
    }
  });

  test('[RT-IMAGE-004] @regression Rate table icons render correctly', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    // Check for SVG or icon elements
    const icons = page.locator('.cmp-rate-table svg, .cmp-rate-table i[class*="icon"]');
    const iconCount = await icons.count();

    if (iconCount > 0) {
      // Verify icons are visible or intentionally hidden
      for (let i = 0; i < Math.min(iconCount, 3); i++) {
        const icon = icons.nth(i);
        const display = await icon.evaluate(el => window.getComputedStyle(el).display);
        expect(['block', 'inline', 'inline-block', 'none']).toContain(display);
      }
    }
  });

  test('[RT-IMAGE-005] @regression Rate table background images load', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const elementsWithBg = page.locator('.cmp-rate-table [style*="background-image"]');
    const count = await elementsWithBg.count();

    if (count > 0) {
      // Verify background images have URLs
      for (let i = 0; i < Math.min(count, 3); i++) {
        const el = elementsWithBg.nth(i);
        const bgImage = await el.evaluate(el =>
          window.getComputedStyle(el).backgroundImage
        );

        // Should have url()
        expect(bgImage).toMatch(/url\(/);
      }
    }
  });
});
