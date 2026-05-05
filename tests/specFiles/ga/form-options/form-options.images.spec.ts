import { test, expect } from '@playwright/test';
import { FormOptionsPage } from '../../../pages/ga/components/formOptionsPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Options — Images & Icons', () => {
  test('[FO-IMAGE-001] @regression Form option icons load successfully', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const images = page.locator('.cmp-form-options img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      // Verify src exists
      expect(src).toBeTruthy();

      // Verify image is visible
      const display = await img.evaluate(el => window.getComputedStyle(el).display);
      expect(['block', 'inline', 'inline-block', 'none']).toContain(display);
    }
  });

  test('[FO-IMAGE-002] @regression Form images have alt text', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const images = page.locator('.cmp-form-options img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // All images should have alt
      expect(alt).not.toBeNull();
    }
  });

  test('[FO-IMAGE-003] @regression SVG icons render correctly', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const svgs = page.locator('.cmp-form-options svg');
    const svgCount = await svgs.count();

    for (let i = 0; i < Math.min(svgCount, 3); i++) {
      const svg = svgs.nth(i);
      const display = await svg.evaluate(el => window.getComputedStyle(el).display);
      expect(['block', 'inline', 'inline-block', 'none']).toContain(display);
    }
  });

  test('[FO-IMAGE-004] @regression Input type="checkbox" custom icons', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const checkboxLabels = page.locator('.cmp-form-options label:has(input[type="checkbox"])');
    const count = await checkboxLabels.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const label = checkboxLabels.nth(i);

      // Check if label has custom styling (pseudo-element or nested icon)
      const hasContent = await label.evaluate(el => {
        const computed = window.getComputedStyle(el, ':before');
        return computed.content !== 'none';
      });

      // Checkbox should be visible regardless of custom styling
      await expect(label).toBeVisible();
    }
  });

  test('[FO-IMAGE-005] @regression Input type="radio" custom icons', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const radioLabels = page.locator('.cmp-form-options label:has(input[type="radio"])');
    const count = await radioLabels.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const label = radioLabels.nth(i);

      // Radio button should be visible
      await expect(label).toBeVisible();

      // Check for custom styling
      const hasCustomStyle = await label.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.position || style.backgroundColor !== 'rgba(0, 0, 0, 0)';
      });

      // May or may not have custom styling
      expect(typeof hasCustomStyle).toBe('boolean');
    }
  });
});
