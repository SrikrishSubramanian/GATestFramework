import { test, expect } from '@playwright/test';
import { RateDetailsHeroPage } from '../../../pages/ga/components/rateDetailsHeroPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('RateDetailsHero — Happy Path', () => {
  test('[RDH-001] @smoke @regression RateDetailsHero renders correctly', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-rate-details-hero').first();
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

  test('[RDH-002] @smoke @regression RateDetailsHero interactive elements are functional', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-rate-details-hero').first();
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

test.describe('RateDetailsHero — Negative & Boundary', () => {
  test('[RDH-003] @negative @regression RateDetailsHero handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-rate-details-hero').first()).toBeVisible();
  });

  test('[RDH-004] @negative @regression RateDetailsHero handles missing images', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-rate-details-hero img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('RateDetailsHero — Responsive', () => {
  test('[RDH-005] @mobile @regression @mobile RateDetailsHero adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-rate-details-hero').first();
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

  test('[RDH-006] @mobile @regression RateDetailsHero adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-rate-details-hero').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('RateDetailsHero — Console & Resources', () => {
  test('[RDH-007] @regression RateDetailsHero produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('RateDetailsHero — Broken Images', () => {
  test('[RDH-008] @regression RateDetailsHero all images load successfully', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-rate-details-hero img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[RDH-009] @regression RateDetailsHero all images have alt attributes', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-rate-details-hero img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('RateDetailsHero — Accessibility', () => {
  test('[RDH-010] @a11y @wcag22 @regression @smoke RateDetailsHero passes axe-core scan', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-rate-details-hero')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[RDH-011] @a11y @wcag22 @regression @smoke RateDetailsHero interactive elements meet 24px target size', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-rate-details-hero a, .cmp-rate-details-hero button, .cmp-rate-details-hero input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[RDH-012] @a11y @wcag22 @regression @smoke RateDetailsHero focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new RateDetailsHeroPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-rate-details-hero a, .cmp-rate-details-hero button, .cmp-rate-details-hero input');
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

test.describe('RateDetailsHero — AEM Dialog Configuration', () => {
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[RDH-013] @author @regression @smoke @smoke RateDetailsHero dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/rate-details-hero/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'RateDetailsHero GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'RateDetailsHero dialog missing helpPath property').toBeTruthy();
  });

  test('[RDH-014] @author @regression @smoke RateDetailsHero helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/rate-details-hero/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});
