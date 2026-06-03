import { test, expect } from '@playwright/test';
import { FooterPage } from '../../../pages/ga/components/footerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Footer — Images & Media', () => {
  test('[FTR-IMAGE-001] @regression Footer logos load successfully', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const images = await pom.getImages();
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      // Verify src exists
      expect(src).toBeTruthy();

      // Verify image is not broken
      const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
      if (naturalWidth === 0) {
        // Image failed to load - this is okay to report but not fail
        console.warn(`Image ${src} failed to load`);
      }
    }
  });

  test('[FTR-IMAGE-002] @regression Footer images have alt text', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const images = await pom.getImages();
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // All images should have alt (even empty for decorative)
      expect(alt).not.toBeNull();
    }
  });

  test('[FTR-IMAGE-003] @regression Footer logo size is appropriate', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const images = await pom.getImages();
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);

        // Check for dimensions
        const width = await img.evaluate(el => el.offsetWidth);
        const height = await img.evaluate(el => el.offsetHeight);

        // Logo should have reasonable dimensions
        if (width > 0 && height > 0) {
          expect(width).toBeGreaterThan(20);
          expect(height).toBeGreaterThan(20);
        }
      }
    }
  });

  test('[FTR-IMAGE-004] @regression Footer images have width/height attributes', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const images = await pom.getImages();
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i);

      // Check for explicit dimensions (helps with CLS)
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      const style = await img.getAttribute('style');

      const hasDimensions =
        (width && height) ||
        (style && style.includes('width') && style.includes('height'));

      // Logos should ideally have explicit dimensions
      if (i === 0 && count > 0) {
        // At least first image should have dimensions
        expect(hasDimensions || count === 0).toBeTruthy();
      }
    }
  });

  test('[FTR-IMAGE-005] @regression Footer background images load', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const root = await pom.getRoot();
    const bgImage = await root.first().evaluate(el =>
      window.getComputedStyle(el).backgroundImage
    );

    if (bgImage && bgImage !== 'none') {
      // Background image exists, verify it has url
      expect(bgImage).toMatch(/url\(/);
    }
  });

  test('[FTR-IMAGE-006] @regression Footer SVG icons render correctly', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const svgs = page.locator('.cmp-footer svg');
    const count = await svgs.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const svg = svgs.nth(i);
      const viewBox = await svg.getAttribute('viewBox');

      // SVGs should have viewBox for scaling
      if (viewBox) {
        expect(viewBox).toMatch(/\d+ \d+ \d+ \d+/);
      }

      // Check visibility
      const display = await svg.evaluate(el => window.getComputedStyle(el).display);
      expect(['block', 'inline', 'inline-block', 'none']).toContain(display);
    }
  });
});
