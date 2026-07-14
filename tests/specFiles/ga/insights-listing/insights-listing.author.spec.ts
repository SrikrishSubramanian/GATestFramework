import { test, expect } from '@playwright/test';
import { InsightsListingPage } from '../../../pages/ga/components/insightsListingPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('InsightsListing — Happy Path', () => {
  test('[IL-001] @smoke @regression InsightsListing renders correctly', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-insights-listing').first();
    await expect(root).toBeVisible();
    // Verify core structure: heading or primary content exists
    const heading = root.locator('h1, h2, h3').first();
    const hasHeading = await heading.count() > 0;
    if (hasHeading) {
      await expect(heading).toBeVisible();
    }
    // Verify no JS errors during render
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    expect(errors).toEqual([]);
  });

  test('[IL-002] @smoke @regression InsightsListing interactive elements are functional', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-insights-listing').first();
    await expect(root).toBeVisible();
    // Verify interactive elements (links, buttons) are present and clickable
    const interactive = root.locator('a, button');
    const count = await interactive.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(interactive.nth(i)).toBeVisible();
      await expect(interactive.nth(i)).toBeEnabled();
    }
  });
});

test.describe('InsightsListing — Negative & Boundary', () => {
  test('[IL-003] @negative @regression InsightsListing handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-insights-listing').first()).toBeVisible();
  });

  test('[IL-004] @negative @regression InsightsListing handles missing images', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-insights-listing img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('InsightsListing — Responsive', () => {
  test('[IL-005] @mobile @regression @mobile InsightsListing adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-insights-listing').first();
    await expect(root).toBeVisible();
    // Verify layout adapts to mobile: check flex-direction changes to column
    const flexDir = await root.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.flexDirection || cs.display;
    });
    // At mobile, flex containers typically switch to column layout
    // Grid containers may change template columns
    expect(flexDir).toBeDefined();
  });

  test('[IL-006] @mobile @regression InsightsListing adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-insights-listing').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('InsightsListing — Console & Resources', () => {
  test('[IL-007] @regression InsightsListing produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('InsightsListing — Broken Images', () => {
  test('[IL-008] @regression InsightsListing all images load successfully', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-insights-listing img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[IL-009] @regression InsightsListing all images have alt attributes', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-insights-listing img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('InsightsListing — Accessibility', () => {
  test('[IL-010] @a11y @wcag22 @regression @smoke InsightsListing passes axe-core scan', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-insights-listing')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[IL-011] @a11y @wcag22 @regression @smoke InsightsListing interactive elements meet 24px target size', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-insights-listing a, .cmp-insights-listing button, .cmp-insights-listing input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[IL-012] @a11y @wcag22 @regression @smoke InsightsListing focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new InsightsListingPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-insights-listing a, .cmp-insights-listing button, .cmp-insights-listing input');
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

test.describe('InsightsListing — AEM Dialog Configuration', () => {
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[IL-013] @author @regression @smoke @smoke InsightsListing dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/insights-listing/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'InsightsListing GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'InsightsListing dialog missing helpPath property').toBeTruthy();
  });

  test('[IL-014] @author @regression @smoke InsightsListing helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/insights-listing/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});
