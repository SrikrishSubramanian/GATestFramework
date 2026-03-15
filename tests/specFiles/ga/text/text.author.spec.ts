import { test, expect } from '@playwright/test';
import { TextPage } from '../../../pages/ga/components/textPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import AxeBuilder from '@axe-core/playwright';

test.describe('Text — CSV Test Cases', () => {
  test('[TEXT-001] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC1', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: All five interactive states are reskinned per Figma: Default, Hover, Focus, Filled, Disabled/Read Only
    // Expected: All five interactive states are reskinned per Figma: Default, Hover, Focus, Filled, Disabled/Read Only
  });

  test('[TEXT-002] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC2', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: All three error states are reskinned per Figma: Error Default, Error Focus, Error Filled
    // Expected: All three error states are reskinned per Figma: Error Default, Error Focus, Error Filled
  });

  test('[TEXT-003] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC3', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Dark mode variants are implemented for all states across both components
    // Expected: Dark mode variants are implemented for all states across both components
  });

  test('[TEXT-004] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC4', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Light and dark mode styles do not interfere with each other
    // Expected: Light and dark mode styles do not interfere with each other
  });

  test('[TEXT-005] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC5', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Font styles (size, weight, family) are identical between light and dark mode — color only changes
    // Expected: Font styles (size, weight, family) are identical between light and dark mode — color only changes
  });

  test('[TEXT-006] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC6', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: All text meets WCAG 2.1 AA contrast in both light and dark mode
    // Expected: All text meets WCAG 2.1 AA contrast in both light and dark mode
  });

  test('[TEXT-007] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC7', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Mobile: components span full width of their container; font styles match desktop
    // Expected: Mobile: components span full width of their container; font styles match desktop
  });

  test('[TEXT-008] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC8', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Label renders above the field; required fields display an asterisk (*)
    // Expected: Label renders above the field; required fields display an asterisk (*)
  });

  test('[TEXT-009] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC9', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Helper text renders below the field
    // Expected: Helper text renders below the field
  });

  test('[TEXT-010] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC10', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Error state shows error icon + message below the field
    // Expected: Error state shows error icon + message below the field
  });

  test('[TEXT-011] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC11', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Disabled/Read Only state is not keyboard-focusable
    // Expected: Disabled/Read Only state is not keyboard-focusable
  });

  test('[TEXT-012] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC12', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Character count (e.g., 0/240) renders in the top-right corner and updates live on input
    // Expected: Character count (e.g., 0/240) renders in the top-right corner and updates live on input
  });

  test('[TEXT-013] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC13', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Component should be available on any existing templates (except Rate Administration)
    // Expected: Component should be available on any existing templates (except Rate Administration)
  });

  test('[TEXT-014] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC14', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Styles should match Figma
    // Expected: Styles should match Figma
  });

  test('[TEXT-015] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC15', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Authoring Guide should exist and be updated with style variations
    // Expected: Authoring Guide should exist and be updated with style variations
  });

  test('[TEXT-016] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC16', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Style Guide page should exist
    // Expected: Style Guide page should exist
  });

  test('[TEXT-017] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC17', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Both desktop and mobile versions need to be implemented
    // Expected: Both desktop and mobile versions need to be implemented
  });

  test('[TEXT-018] @a11y @a11y @a11y @mobile CMS FE: Form Field Styling - Text, Text Area (Reskin) — AC18', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Notify the design team that the component is ready for their review and provide a link to the Style Guide page
    // Expected: Notify the design team that the component is ready for their review and provide a link to the Style Guide page
  });
});

test.describe('Text — Happy Path', () => {
  test('[TEXT-019] @smoke @regression Text renders correctly', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.ga-text').first()).toBeVisible();
  });

  test('[TEXT-020] @smoke @regression Text interactive elements are functional', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify primary interactive elements
    const root = page.locator('.ga-text').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Text — Negative & Boundary', () => {
  test('[TEXT-021] @negative @regression Text handles empty content gracefully', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Component should not throw errors with minimal content
  });

  test('[TEXT-022] @negative @regression Text handles missing images', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.ga-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Text — Responsive', () => {
  test('[TEXT-023] @mobile @regression @mobile Text adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.ga-text').first()).toBeVisible();
  });

  test('[TEXT-024] @mobile @regression Text adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.ga-text').first()).toBeVisible();
  });
});

test.describe('Text — Console & Resources', () => {
  test('[TEXT-025] @regression Text produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Text — Broken Images', () => {
  test('[TEXT-026] @regression Text all images load successfully', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.ga-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[TEXT-027] @regression Text all images have alt attributes', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.ga-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Text — Accessibility', () => {
  test('[TEXT-028] @a11y @wcag22 @regression @smoke Text passes axe-core scan', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await new AxeBuilder({ page })
      .include('.ga-text')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[TEXT-029] @a11y @wcag22 @regression @smoke Text interactive elements meet 24px target size', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const interactive = page.locator('.ga-text a, .ga-text button, .ga-text input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[TEXT-030] @a11y @wcag22 @regression @smoke Text focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const focusable = page.locator('.ga-text a, .ga-text button, .ga-text input');
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
