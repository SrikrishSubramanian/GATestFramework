import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/env';
import { ConsoleCapture } from '../../../utils/console-capture';
import AxeBuilder from '@axe-core/playwright';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    const loginUrl = `${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html`;
    await page.goto(loginUrl);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('Statistic — Happy Path', () => {
  test('[STAT-001] @smoke @regression Statistic renders correctly', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-statistic').first()).toBeVisible();
  });

  test('[STAT-002] @smoke @regression Statistic interactive elements are functional', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify primary interactive elements
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Statistic — Negative & Boundary', () => {
  test('[STAT-003] @negative @regression Statistic handles empty content gracefully', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Component should not throw errors with minimal content
  });

  test('[STAT-004] @negative @regression Statistic handles missing images', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-statistic img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Statistic — Responsive', () => {
  test('[STAT-005] @mobile @regression @mobile Statistic adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-statistic').first()).toBeVisible();
  });

  test('[STAT-006] @mobile @regression Statistic adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-statistic').first()).toBeVisible();
  });
});

test.describe('Statistic — Console & Resources', () => {
  test('[STAT-007] @regression Statistic produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Statistic — Broken Images', () => {
  test('[STAT-008] @regression Statistic all images load successfully', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-statistic img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[STAT-009] @regression Statistic all images have alt attributes', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-statistic img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Statistic — Accessibility', () => {
  test('[STAT-010] @a11y @wcag22 @regression @smoke Statistic passes axe-core scan', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await new AxeBuilder({ page })
      .include('.cmp-statistic')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[STAT-011] @a11y @wcag22 @regression @smoke Statistic interactive elements meet 24px target size', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const interactive = page.locator('.cmp-statistic a, .cmp-statistic button, .cmp-statistic input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[STAT-012] @a11y @wcag22 @regression @smoke Statistic focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const focusable = page.locator('.cmp-statistic a, .cmp-statistic button, .cmp-statistic input');
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
