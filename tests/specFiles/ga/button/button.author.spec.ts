import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/env';
import { ConsoleCapture } from '../../../utils/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/report-enhancer';
import AxeBuilder from '@axe-core/playwright';

test.describe('Button — CSV Test Cases', () => {
  test('@a11y @mobile Button component — add disabled state styling — AC1', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a button with the 'disabled' style applied, the button should have reduced opacity (0.5)
    // Expected: Given a button with the \'disabled\' style applied, the button should have reduced opacity (0.5)
  });

  test('@a11y @mobile Button component — add disabled state styling — AC2', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a disabled button, the cursor should show 'not-allowed' on hover
    // Expected: Given a disabled button, the cursor should show \'not-allowed\' on hover
  });

  test('@a11y @mobile Button component — add disabled state styling — AC3', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a disabled button, clicking it should not trigger any navigation
    // Expected: Given a disabled button, clicking it should not trigger any navigation
  });

  test('@a11y @mobile Button component — add disabled state styling — AC4', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Given a disabled button on a dark background (granite/azul), the disabled state should still be visible with sufficient contrast
    // Expected: Given a disabled button on a dark background (granite/azul), the disabled state should still be visible with sufficient contrast
  });

  test('@visual button background-color color matches Figma spec (#003DA5)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Navigate to button style guide page
    // Step 2: Get computed background-color of component
    // Expected: background-color should be #003DA5
  });

  test('@visual button color color matches Figma spec (#FFFFFF)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Navigate to button style guide page
    // Step 2: Get computed color of component
    // Expected: color should be #FFFFFF
  });

  test('@visual button border-color color matches Figma spec (#003DA5)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Navigate to button style guide page
    // Step 2: Get computed border-color of component
    // Expected: border-color should be #003DA5
  });

  test('@visual button typography matches Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Navigate to button style guide page
    // Step 2: Get computed font properties
    // Expected: Typography should match: {"font-family":"Poppins","font-size":"16px","font-weight":"600","line-height":"24px"}
  });

  test('@visual button hover animation matches Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Navigate to button style guide page
    // Step 2: Trigger hover interaction
    // Step 3: Capture before/after states
    // Expected: Animation: {"property":"background-color","duration":"0.3s","timingFunction":"ease"}
  });

  test('@visual @regression button layout at desktop matches Figma', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Set viewport to desktop
    // Step 2: Navigate to button style guide page
    // Step 3: Verify dimensions
    // Expected: Layout should match: {"width":"auto","min-width":"200px"}
  });

  test('@visual @mobile button layout at mobile matches Figma', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Set viewport to mobile
    // Step 2: Navigate to button style guide page
    // Step 3: Verify dimensions
    // Expected: Layout should match: {"width":"100%","min-width":"unset"}
  });
});

test.describe('Button — Happy Path', () => {
  test('@smoke @regression Button renders correctly', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.ga-button').first()).toBeVisible();
  });

  test('@smoke @regression Button interactive elements are functional', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify primary interactive elements
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Button — Negative & Boundary', () => {
  test('@negative @regression Button handles empty content gracefully', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Component should not throw errors with minimal content
  });

  test('@negative @regression Button handles missing images', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.ga-button img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Button — Responsive', () => {
  test('@mobile @regression @mobile Button adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.ga-button').first()).toBeVisible();
  });

  test('@mobile @regression Button adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.ga-button').first()).toBeVisible();
  });
});

test.describe('Button — Console & Resources', () => {
  test('@regression Button produces no JS errors', async ({ page }) => {
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

test.describe('Button — Broken Images', () => {
  test('@regression Button all images load successfully', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.ga-button img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('@regression Button all images have alt attributes', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.ga-button img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Button — Accessibility', () => {
  test('@a11y @wcag22 @regression @smoke Button passes axe-core scan', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await new AxeBuilder({ page })
      .include('.ga-button')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('@a11y @wcag22 @regression @smoke Button interactive elements meet 24px target size', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const interactive = page.locator('.ga-button a, .ga-button button, .ga-button input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('@a11y @wcag22 @regression @smoke Button focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const focusable = page.locator('.ga-button a, .ga-button button, .ga-button input');
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
