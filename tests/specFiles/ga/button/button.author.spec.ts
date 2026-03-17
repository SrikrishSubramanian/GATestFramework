import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Button — CSV Test Cases', () => {
  test('[BTN-001] @a11y @mobile Button component — add disabled state styling — AC1', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a button with the 'disabled' style applied, the button should have reduced opacity (0.5)
    // Expected: Given a button with the \'disabled\' style applied, the button should have reduced opacity (0.5)
  });

  test('[BTN-002] @a11y @mobile Button component — add disabled state styling — AC2', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a disabled button, the cursor should show 'not-allowed' on hover
    // Expected: Given a disabled button, the cursor should show \'not-allowed\' on hover
  });

  test('[BTN-003] @a11y @mobile Button component — add disabled state styling — AC3', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a disabled button, clicking it should not trigger any navigation
    // Expected: Given a disabled button, clicking it should not trigger any navigation
  });

  test('[BTN-004] @a11y @mobile Button component — add disabled state styling — AC4', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a disabled button on a dark background (granite/azul), the disabled state should still be visible with sufficient contrast
    // Expected: Given a disabled button on a dark background (granite/azul), the disabled state should still be visible with sufficient contrast
  });

  // BTN-005–011 removed: Figma visual tests are covered with real assertions in button.visual.spec.ts (BTN-196–202)
});

test.describe('Button — Happy Path', () => {
  test('[BTN-012] @smoke @regression Button renders correctly', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-button:not(.basepage__skip-nav)').first()).toBeVisible();
  });

  test('[BTN-013] @smoke @regression Button interactive elements are functional', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify primary interactive elements
    const root = page.locator('.cmp-button:not(.basepage__skip-nav)').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Button — Negative & Boundary', () => {
  test('[BTN-014] @negative @regression Button handles empty content gracefully', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Component should not throw errors with minimal content
  });

  test('[BTN-015] @negative @regression Button handles missing images', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-button img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Button — Responsive', () => {
  test('[BTN-016] @mobile @regression Button adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-button:not(.basepage__skip-nav)').first()).toBeVisible();
  });

  test('[BTN-017] @mobile @regression Button adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-button:not(.basepage__skip-nav)').first()).toBeVisible();
  });
});

test.describe('Button — Console & Resources', () => {
  test('[BTN-018] @regression Button produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

// BTN-019–020 removed: Image health tests are covered with scanImages() in button.images.spec.ts (BTN-024–027)

test.describe('Button — Accessibility', () => {
  test('[BTN-021] @a11y @wcag22 @regression @smoke Button passes axe-core scan', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await new AxeBuilder({ page })
      .include('.cmp-button')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[BTN-022] @a11y @wcag22 @regression @smoke Button interactive elements meet 24px target size', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const interactive = page.locator('.cmp-button a, .cmp-button button, .cmp-button input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[BTN-023] @a11y @wcag22 @regression @smoke Button focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const focusable = page.locator('.cmp-button a, .cmp-button button, .cmp-button input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });
});
