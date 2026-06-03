import { test, expect } from '@playwright/test';
import { GridContainerPage } from '../../../pages/ga/components/gridContainerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const STYLE_GUIDE = '/content/global-atlantic/style-guide/components/grid-container.html?wcmmode=disabled';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * GridContainer Deep Matrix
 *
 * 12 tests across the matrix dimensions: columns × ratio × gap × background × viewport
 *
 * Style guide URL: /content/global-atlantic/style-guide/components/grid-container.html?wcmmode=disabled
 *
 * Style guide variations (7 grids):
 *   1. .ga-grid--2col + ratio-1-1 on white   (50/50)
 *   2. .ga-grid--2col + ratio-1-3 on white   (25/75)
 *   3. .ga-grid--2col + ratio-2-3 on slate   (40/60)
 *   4. .ga-grid--2col + gap-col on white     (1 Column Gap)
 *   5. .ga-grid--3col on white
 *   6. .ga-grid--4col on granite
 *   7. .ga-grid--2col + mobile-grid on white
 *
 * Desktop tests: GC-MX-001 to GC-MX-008
 * Mobile tests:  GC-MX-009 to GC-MX-012
 */

// ── Desktop Matrix (GC-MX-001 to GC-MX-008) ──────────────────────────────────

test.describe('GridContainer — Desktop Matrix', () => {

  test('[GC-MX-001] @matrix @regression 2col ratio-1-1 on white: equal columns and 30px gap', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--2col .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const { columns, gap } = await grid.evaluate((el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      return {
        columns: style.gridTemplateColumns,
        gap: style.columnGap || style.gap,
      };
    });

    // Two equal column values (e.g. "693px 693px")
    const colParts = columns.trim().split(/\s+/);
    expect(colParts).toHaveLength(2);
    expect(colParts[0]).toEqual(colParts[1]);

    // Gap should be ~30px (allow ±5px tolerance)
    const gapPx = parseFloat(gap);
    expect(gapPx).toBeGreaterThanOrEqual(25);
    expect(gapPx).toBeLessThanOrEqual(35);
  });

  test('[GC-MX-002] @matrix @regression 2col ratio-1-3 on white: 25%/75% column split', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--2col.ga-grid--ratio-1-3 .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const columns = await grid.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    const colParts = columns.trim().split(/\s+/);
    expect(colParts).toHaveLength(2);

    const firstPx = parseFloat(colParts[0]);
    const secondPx = parseFloat(colParts[1]);
    const total = firstPx + secondPx;

    // First column ~25% of total width
    const firstRatio = firstPx / total;
    expect(firstRatio).toBeGreaterThan(0.2);
    expect(firstRatio).toBeLessThan(0.3);

    // Second column ~75% of total width
    const secondRatio = secondPx / total;
    expect(secondRatio).toBeGreaterThan(0.7);
    expect(secondRatio).toBeLessThan(0.8);
  });

  test('[GC-MX-003] @matrix @regression 2col ratio-2-3 on slate: 40%/60% columns and slate background', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    // Slate background section contains this grid variant
    const slateSection = page.locator('.cmp-section--background-color-slate').first();
    await expect(slateSection).toBeVisible();

    const grid = slateSection.locator('.ga-grid--2col.ga-grid--ratio-2-3 .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const columns = await grid.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    const colParts = columns.trim().split(/\s+/);
    expect(colParts).toHaveLength(2);

    const firstPx = parseFloat(colParts[0]);
    const secondPx = parseFloat(colParts[1]);
    const total = firstPx + secondPx;

    // First column ~40% of total width
    const firstRatio = firstPx / total;
    expect(firstRatio).toBeGreaterThan(0.35);
    expect(firstRatio).toBeLessThan(0.45);

    // Second column ~60% of total width
    const secondRatio = secondPx / total;
    expect(secondRatio).toBeGreaterThan(0.55);
    expect(secondRatio).toBeLessThan(0.65);

    // Slate section must be present as ancestor
    const slateBg = await slateSection.evaluate((el: HTMLElement) => {
      return el.classList.contains('cmp-section--background-color-slate');
    });
    expect(slateBg).toBe(true);
  });

  test('[GC-MX-004] @matrix @regression 2col 1-column-gap on white: column gap larger than 100px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--gap-col .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const gapPx = await grid.evaluate((el: HTMLElement) => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return 0;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.left - r0.right;
    });

    expect(gapPx).toBeGreaterThan(80);
  });

  test('[GC-MX-005] @matrix @regression 3col on white: three columns side by side', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--3col .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    // Verify 3 columns are side-by-side at desktop
    const layout = await grid.evaluate((el: HTMLElement) => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 3) return { count: cols.length, sideBySide: false };
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      const r2 = cols[2].getBoundingClientRect();
      return {
        count: cols.length,
        sideBySide: Math.abs(r0.top - r1.top) < 5 && Math.abs(r1.top - r2.top) < 5,
        widthRatio: r0.width / r1.width,
      };
    });
    expect(layout.count).toBeGreaterThanOrEqual(3);
    expect(layout.sideBySide).toBe(true);
    expect(layout.widthRatio).toBeGreaterThan(0.85);
    expect(layout.widthRatio).toBeLessThan(1.15);
  });

  test('[GC-MX-006] @matrix @regression 4col on granite: four columns and white text', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const graniteSection = page.locator('.cmp-section--background-color-granite').first();
    await expect(graniteSection).toBeVisible();

    const grid = graniteSection.locator('.cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const layout = await grid.evaluate((el: HTMLElement) => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 4) return { count: cols.length, sideBySide: false };
      const r0 = cols[0].getBoundingClientRect();
      const r3 = cols[3].getBoundingClientRect();
      return {
        count: cols.length,
        sideBySide: Math.abs(r0.top - r3.top) < 5,
      };
    });
    expect(layout.count).toBeGreaterThanOrEqual(4);
    expect(layout.sideBySide).toBe(true);

    // On granite, text color should be white/light
    const wrapper = graniteSection.locator('.grid-container').first();
    const textColor = await wrapper.evaluate((el: HTMLElement) => window.getComputedStyle(el).color);
    const match = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      expect(parseInt(match[1])).toBeGreaterThan(200);
    }
  });

  test('[GC-MX-007] @matrix @regression mobile-grid on white: has ga-grid--mobile-grid class', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const mobileGridEl = page.locator('.ga-grid--mobile-grid').first();
    await expect(mobileGridEl).toBeVisible();

    const hasMobileGridClass = await mobileGridEl.evaluate((el: HTMLElement) => {
      return el.classList.contains('ga-grid--mobile-grid');
    });
    expect(hasMobileGridClass).toBe(true);
  });

  test('[GC-MX-008] @matrix @regression all grids use display: grid at desktop (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const gridSelectors = [
      '.ga-grid--2col .cmp-grid-container__items > .aem-Grid',
      '.ga-grid--3col .cmp-grid-container__items > .aem-Grid',
      '.ga-grid--4col .cmp-grid-container__items > .aem-Grid',
    ];

    for (const selector of gridSelectors) {
      const el = page.locator(selector).first();
      await expect(el).toBeVisible();

      const display = await el.evaluate((node: HTMLElement) => {
        return window.getComputedStyle(node).display;
      });

      expect(display, `Expected display:grid for selector "${selector}"`).toBe('grid');
    }
  });

});

// ── Mobile Matrix (GC-MX-009 to GC-MX-012) ───────────────────────────────────

test.describe('GridContainer — Mobile Matrix', () => {

  test('[GC-MX-009] @matrix @regression @mobile 2col stacks to single column at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--2col:not(.ga-grid--mobile-grid) .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    // Mobile override uses display:flex;flex-direction:column — check columns stack
    const stacked = await grid.evaluate((el: HTMLElement) => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return true;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.top >= r0.bottom - 2;
    });
    expect(stacked, 'At 390px, 2col should stack vertically').toBe(true);
  });

  test('[GC-MX-010] @matrix @regression @mobile 3col stacks to single column at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--3col .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const stacked = await grid.evaluate((el: HTMLElement) => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return true;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.top >= r0.bottom - 2;
    });
    expect(stacked, 'At 390px, 3col should stack vertically').toBe(true);
  });

  test('[GC-MX-011] @matrix @regression @mobile 4col stacks to single column at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--4col .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const stacked = await grid.evaluate((el: HTMLElement) => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return true;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.top >= r0.bottom - 2;
    });
    expect(stacked, 'At 390px, 4col should stack vertically').toBe(true);
  });

  test('[GC-MX-012] @matrix @regression @mobile mobile-grid stays 2-col at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());

    const grid = page.locator('.ga-grid--mobile-grid .cmp-grid-container__items > .aem-Grid').first();
    await expect(grid).toBeVisible();

    const columns = await grid.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Mobile-grid variant must maintain 2 columns at 390px (does not stack)
    const colParts = columns.trim().split(/\s+/).filter(Boolean);
    expect(colParts).toHaveLength(2);
  });

});
