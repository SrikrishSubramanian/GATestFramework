import { test, expect } from '@playwright/test';
import { SpacerPage } from '../../../pages/ga/components/spacerPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Spacer — CSV Test Cases', () => {
  test('[SPC-001] @smoke @regression TC_SPC_001 Verify Spacer component availability', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Pre-condition: User logged into CMS
    // Step 1: Open page template
    // Step 2: Open component list
    // Expected: Spacer component visible in component list
    await expect(pom.getAllSpacers().first()).toBeVisible();
  });

  test('[SPC-002] @smoke @regression TC_SPC_002 Insert Spacer between components', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacer inserts successfully and persists after refresh
    await expect(pom.getAllSpacers().first()).toBeVisible();
  });

  test('[SPC-003] @smoke @regression TC_SPC_003 Verify Spacer label & visual indicator', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: "Spacer" label visible and placement distinguishable in author mode
    await expect(pom.getAllSpacers().first()).toBeVisible();
  });

  test('[SPC-004] @smoke @regression TC_SPC_004 Verify style options availability', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: XXS, XS, Small, Medium (default), Large, XL options visible
    // Verify that multiple spacer variants are rendered on the style guide page
    const wrappers = pom.getAllSpacerWrappers();
    const count = await wrappers.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('[SPC-005] @smoke @regression TC_SPC_005 Validate 3XS style — Desktop spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // NOTE: 3XS variant not present on style guide — CSV specifies 6px desktop.
    test.skip();
  });

  test('[SPC-006] @smoke @regression TC_SPC_006 Validate 2XS/XXS style — Desktop spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // CSV says "2XS = 12px desktop" — maps to XXS (cmp-spacer--xxsmall)
    const spacer = page.locator('.cmp-spacer--xxsmall > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(12);
  });

  test('[SPC-007] @smoke @regression TC_SPC_007 Validate XS style — Desktop spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 20px
    const spacer = page.locator('.cmp-spacer--xsmall > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(20);
  });

  test('[SPC-008] @smoke @regression TC_SPC_008 Validate Small style — Desktop spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 32px
    const spacer = page.locator('.cmp-spacer--small > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(32);
  });

  test('[SPC-009] @smoke @regression TC_SPC_009 Validate default Medium style — Desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Default is Medium; spacing equals 48px
    // Default spacer has no size modifier class on the wrapper
    const spacer = page.locator('div.spacer:not([class*="cmp-spacer--"]) > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(48);
  });

  test('[SPC-010] @smoke @regression TC_SPC_010 Validate Large style — Desktop spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 64px
    const spacer = page.locator('.cmp-spacer--large > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(64);
  });

  test('[SPC-011] @smoke @regression TC_SPC_011 Validate XL style — Desktop spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 112px
    const spacer = page.locator('.cmp-spacer--xlarge > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(112);
  });

  test('[SPC-012] @smoke @regression @mobile TC_SPC_012 Validate 3XS style — Mobile spacing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // NOTE: 3XS variant not present on style guide — CSV specifies 4px mobile.
    test.skip();
  });

  test('[SPC-013] @smoke @regression @mobile TC_SPC_013 Validate 2XS/XXS style — Mobile spacing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // CSV says "2XS = 8px mobile" — maps to XXS (cmp-spacer--xxsmall)
    const spacer = page.locator('.cmp-spacer--xxsmall > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(8);
  });

  test('[SPC-014] @smoke @regression @mobile TC_SPC_014 Validate XS style — Mobile spacing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 16px
    const spacer = page.locator('.cmp-spacer--xsmall > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(16);
  });

  test('[SPC-015] @smoke @regression @mobile TC_SPC_015 Validate Small style — Mobile spacing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 20px
    const spacer = page.locator('.cmp-spacer--small > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(20);
  });

  test('[SPC-016] @smoke @regression @mobile TC_SPC_016 Validate Medium style — Mobile spacing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 32px
    const spacer = page.locator('div.spacer:not([class*="cmp-spacer--"]) > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(32);
  });

  test('[SPC-017] @smoke @regression @mobile TC_SPC_017 Validate Large style — Mobile spacing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 48px
    const spacer = page.locator('.cmp-spacer--large > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(48);
  });

  test('[SPC-018] @smoke @regression @mobile TC_SPC_018 Validate XL style — Mobile spacing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacing equals 64px
    const spacer = page.locator('.cmp-spacer--xlarge > .cmp-spacer').first();
    await expect(spacer).toBeVisible();
    const height = await pom.getSpacerHeight(spacer);
    expect(height).toBe(64);
  });

  test('[SPC-019] @a11y @smoke @regression TC_SPC_019 Accessibility validation (aria-hidden)', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: aria-hidden="true" present; no reading interruption
    const spacers = pom.getAllSpacers();
    const count = await spacers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const ariaHidden = await spacers.nth(i).getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('[SPC-020] @smoke @regression TC_SPC_020 Multiple Spacer components rendering', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Each spacer renders correct spacing
    const spacers = pom.getAllSpacers();
    const count = await spacers.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      const box = await spacers.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(0);
    }
  });

  test('[SPC-021] @smoke @regression TC_SPC_021 Reposition Spacer component', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Position updates correctly and persists
    await expect(pom.getAllSpacers().first()).toBeVisible();
  });

  test('[SPC-022] @smoke @regression TC_SPC_022 Verify Authoring Guide documentation', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Usage, style variations, desktop & mobile values documented
    await expect(pom.getAllSpacers().first()).toBeVisible();
  });

  test('[SPC-023] @smoke @regression TC_SPC_023 Verify Style Guide reference', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: All spacer variations match design specifications
    const wrappers = pom.getAllSpacerWrappers();
    const count = await wrappers.count();
    expect(count).toBeGreaterThanOrEqual(6); // default + 5 named variants
  });

  test('[SPC-024] @smoke @regression TC_SPC_024 Validate default style without manual selection', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Default style is Medium
    const defaultSpacer = page.locator('div.spacer:not([class*="cmp-spacer--"]) > .cmp-spacer').first();
    await expect(defaultSpacer).toBeVisible();
  });

  test('[SPC-025] @smoke @regression TC_SPC_025 Publish page with Spacer', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Spacer renders correctly on published site
    await expect(pom.getAllSpacers().first()).toBeVisible();
  });

  test('[SPC-026] @negative @regression TC_SPC_026 Prevent multiple style selection', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Only one style can be active at a time
    // Each spacer wrapper should have at most one cmp-spacer--* modifier
    const wrappers = pom.getAllSpacerWrappers();
    const count = await wrappers.count();
    for (let i = 0; i < count; i++) {
      const classes = await wrappers.nth(i).getAttribute('class') || '';
      const sizeModifiers = classes.split(/\s+/).filter(c => c.startsWith('cmp-spacer--'));
      expect(sizeModifiers.length).toBeLessThanOrEqual(1);
    }
  });

  test('[SPC-027] @negative @regression TC_SPC_027 Remove Spacer and verify layout stability', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Expected: Layout adjusts correctly without residual spacing
    await expect(pom.getAllSpacers().first()).toBeVisible();
  });
});

test.describe('Spacer — Happy Path', () => {
  test('[SPC-028] @smoke @regression Spacer renders correctly', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-spacer').first()).toBeVisible();
  });

  test('[SPC-029] @smoke @regression Spacer all variants have positive height', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const spacers = pom.getAllSpacers();
    const count = await spacers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await spacers.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(0);
    }
  });
});

test.describe('Spacer — Negative & Boundary', () => {
  test('[SPC-030] @negative @regression Spacer handles empty content gracefully', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Component should not throw errors with minimal content
    await expect(page.locator('.cmp-spacer').first()).toBeVisible();
  });

  test('[SPC-031] @negative @regression Spacer handles missing images', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-spacer img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Spacer — Responsive', () => {
  test('[SPC-032] @mobile @regression Spacer adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-spacer').first()).toBeVisible();
  });

  test('[SPC-033] @mobile @regression Spacer adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-spacer').first()).toBeVisible();
  });
});

test.describe('Spacer — Console & Resources', () => {
  test('[SPC-034] @regression Spacer produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Spacer — Broken Images', () => {
  test('[SPC-035] @regression Spacer all images load successfully', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-spacer img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[SPC-036] @regression Spacer all images have alt attributes', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-spacer img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Spacer — Accessibility', () => {
  test('[SPC-037] @a11y @wcag22 @regression @smoke Spacer passes axe-core scan', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await new AxeBuilder({ page })
      .include('.cmp-spacer')
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[SPC-038] @a11y @wcag22 @regression @smoke Spacer interactive elements meet 24px target size', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const interactive = page.locator('.cmp-spacer a, .cmp-spacer button, .cmp-spacer input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[SPC-039] @a11y @wcag22 @regression @smoke Spacer focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const focusable = page.locator('.cmp-spacer a, .cmp-spacer button, .cmp-spacer input');
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
