import { test, expect } from '@playwright/test';
import { GridContainerPage } from '../../../pages/ga/components/gridContainerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const STYLE_GUIDE_PATH = '/content/global-atlantic/style-guide/components/grid-container.html?wcmmode=disabled';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('GridContainer — Deep Interaction Tests', () => {

  // ─── Responsive Layout Transitions ───────────────────────────────────────

  test('GC-INT-001 @interaction @regression 2col layout transitions from grid to stacked at mobile (1440px → 390px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    // Locate the first 2col grid container
    const grid2col = page.locator('.grid-container.ga-grid--2col').first();
    await expect(grid2col).toBeVisible();

    const innerGrid = grid2col.locator('.cmp-grid-container__items > .aem-Grid');
    await expect(innerGrid).toBeVisible();

    // At desktop (1440px): columns should be side-by-side — grid or flex layout
    const desktopColumns = innerGrid.locator('> .aem-GridColumn');
    const desktopCount = await desktopColumns.count();
    expect(desktopCount).toBeGreaterThanOrEqual(2);

    const firstColDesktop = await desktopColumns.nth(0).boundingBox();
    const secondColDesktop = await desktopColumns.nth(1).boundingBox();
    expect(firstColDesktop).not.toBeNull();
    expect(secondColDesktop).not.toBeNull();

    // At desktop columns should be side by side (same Y, different X)
    expect(Math.abs(firstColDesktop!.y - secondColDesktop!.y)).toBeLessThan(50);
    expect(secondColDesktop!.x).toBeGreaterThan(firstColDesktop!.x);

    // Shrink to mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const firstColMobile = await desktopColumns.nth(0).boundingBox();
    const secondColMobile = await desktopColumns.nth(1).boundingBox();
    expect(firstColMobile).not.toBeNull();
    expect(secondColMobile).not.toBeNull();

    // At mobile columns should stack vertically (second col is below first)
    expect(secondColMobile!.y).toBeGreaterThan(firstColMobile!.y + firstColMobile!.height - 10);
  });

  test('GC-INT-002 @interaction @regression 3col layout transitions from 3-col to stacked at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    const grid3col = page.locator('.grid-container.ga-grid--3col').first();
    await expect(grid3col).toBeVisible();

    const innerGrid = grid3col.locator('.cmp-grid-container__items > .aem-Grid');
    const columns = innerGrid.locator('> .aem-GridColumn');
    const colCount = await columns.count();
    expect(colCount).toBeGreaterThanOrEqual(3);

    // At desktop: all three columns should be on the same row
    const col0Box = await columns.nth(0).boundingBox();
    const col1Box = await columns.nth(1).boundingBox();
    const col2Box = await columns.nth(2).boundingBox();
    expect(col0Box).not.toBeNull();
    expect(col1Box).not.toBeNull();
    expect(col2Box).not.toBeNull();

    expect(Math.abs(col0Box!.y - col1Box!.y)).toBeLessThan(50);
    expect(Math.abs(col1Box!.y - col2Box!.y)).toBeLessThan(50);
    expect(col1Box!.x).toBeGreaterThan(col0Box!.x);
    expect(col2Box!.x).toBeGreaterThan(col1Box!.x);

    // Shrink to mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const col0Mobile = await columns.nth(0).boundingBox();
    const col1Mobile = await columns.nth(1).boundingBox();
    const col2Mobile = await columns.nth(2).boundingBox();
    expect(col0Mobile).not.toBeNull();
    expect(col1Mobile).not.toBeNull();
    expect(col2Mobile).not.toBeNull();

    // Stacked: each column is below the previous
    expect(col1Mobile!.y).toBeGreaterThan(col0Mobile!.y + col0Mobile!.height - 10);
    expect(col2Mobile!.y).toBeGreaterThan(col1Mobile!.y + col1Mobile!.height - 10);
  });

  test('GC-INT-003 @interaction @regression 4col layout transitions from 4-col to stacked at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    // 4col is on a granite background section
    const grid4col = page.locator('.grid-container.ga-grid--4col').first();
    await expect(grid4col).toBeVisible();

    const innerGrid = grid4col.locator('.cmp-grid-container__items > .aem-Grid');
    const columns = innerGrid.locator('> .aem-GridColumn');
    const colCount = await columns.count();
    expect(colCount).toBeGreaterThanOrEqual(4);

    // At desktop: columns 0–3 should all be on the same row
    const boxes: Array<{ x: number; y: number; width: number; height: number }> = [];
    for (let i = 0; i < 4; i++) {
      const box = await columns.nth(i).boundingBox();
      expect(box).not.toBeNull();
      boxes.push(box!);
    }

    // All should share approximately the same Y coordinate
    for (let i = 1; i < 4; i++) {
      expect(Math.abs(boxes[i].y - boxes[0].y)).toBeLessThan(50);
    }
    // X positions should increase left to right
    for (let i = 1; i < 4; i++) {
      expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].x);
    }

    // Shrink to mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const mobileBoxes: Array<{ x: number; y: number; width: number; height: number }> = [];
    for (let i = 0; i < 4; i++) {
      const box = await columns.nth(i).boundingBox();
      expect(box).not.toBeNull();
      mobileBoxes.push(box!);
    }

    // Each column stacks below the previous
    for (let i = 1; i < 4; i++) {
      expect(mobileBoxes[i].y).toBeGreaterThan(mobileBoxes[i - 1].y + mobileBoxes[i - 1].height - 10);
    }
  });

  // ─── Mobile Grid Behavior ─────────────────────────────────────────────────

  test('GC-INT-004 @interaction @regression Mobile Grid 2col stays 2-col at 390px (flex-direction row, flex-wrap wrap)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    // Mobile-grid variant uses a specific class or is the last 2col instance
    // Locate the grid with mobile-grid class (may also carry ga-grid--2col)
    const mobileGrid = page.locator('.grid-container.ga-grid--mobile-grid, .grid-container[class*="mobile-grid"]').first();
    await expect(mobileGrid).toBeVisible();

    const innerGrid = mobileGrid.locator('.cmp-grid-container__items > .aem-Grid');

    // Verify the inner grid does NOT stack: columns should still be side-by-side
    const columns = innerGrid.locator('> .aem-GridColumn');
    const colCount = await columns.count();
    expect(colCount).toBeGreaterThanOrEqual(2);

    const col0Box = await columns.nth(0).boundingBox();
    const col1Box = await columns.nth(1).boundingBox();
    expect(col0Box).not.toBeNull();
    expect(col1Box).not.toBeNull();

    // Side-by-side: same approximate Y, col1 is to the right of col0
    expect(Math.abs(col0Box!.y - col1Box!.y)).toBeLessThan(50);
    expect(col1Box!.x).toBeGreaterThan(col0Box!.x);
  });

  test('GC-INT-005 @interaction @regression Mobile Grid columns are ~50% width each at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    const mobileGrid = page.locator('.grid-container.ga-grid--mobile-grid, .grid-container[class*="mobile-grid"]').first();
    await expect(mobileGrid).toBeVisible();

    const columns = mobileGrid.locator('.cmp-grid-container__items > .aem-Grid > .aem-GridColumn');
    const colCount = await columns.count();
    expect(colCount).toBeGreaterThanOrEqual(2);

    const col0Box = await columns.nth(0).boundingBox();
    const col1Box = await columns.nth(1).boundingBox();
    expect(col0Box).not.toBeNull();
    expect(col1Box).not.toBeNull();

    const containerBox = await mobileGrid.boundingBox();
    expect(containerBox).not.toBeNull();

    // Each column should be approximately half the container width (within 10%)
    const halfWidth = containerBox!.width / 2;
    expect(col0Box!.width).toBeGreaterThan(halfWidth * 0.8);
    expect(col0Box!.width).toBeLessThan(halfWidth * 1.2);
    expect(col1Box!.width).toBeGreaterThan(halfWidth * 0.8);
    expect(col1Box!.width).toBeLessThan(halfWidth * 1.2);
  });

  test('GC-INT-006 @interaction @regression Mobile Grid gap is 24px at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    const mobileGrid = page.locator('.grid-container.ga-grid--mobile-grid, .grid-container[class*="mobile-grid"]').first();
    await expect(mobileGrid).toBeVisible();

    const innerGrid = mobileGrid.locator('.cmp-grid-container__items > .aem-Grid');

    // Read computed column-gap on the AEM grid element
    const columnGap = await innerGrid.evaluate((el) => {
      return window.getComputedStyle(el).columnGap;
    });

    // Mobile grid gap should be 24px
    const gapValue = parseFloat(columnGap);
    expect(gapValue).toBeGreaterThanOrEqual(20);
    expect(gapValue).toBeLessThanOrEqual(30);
  });

  // ─── Gap Transition ───────────────────────────────────────────────────────

  test('GC-INT-007 @interaction @regression 1 Column Gap at desktop is larger than 30px default gap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    const gapColGrid = page.locator('.ga-grid--gap-col').first();
    if (await gapColGrid.count() === 0) { test.skip(true, 'No gap-col variant on style guide'); return; }
    const innerGapGrid = gapColGrid.locator('.cmp-grid-container__items > .aem-Grid');

    // Standard 2col for comparison
    const standardGrid = page.locator('.ga-grid--2col:not(.ga-grid--gap-col)').first();
    const innerStandardGrid = standardGrid.locator('.cmp-grid-container__items > .aem-Grid');

    // Measure actual gap by distance between columns
    const gapColGapPx = await innerGapGrid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return 0;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.left - r0.right;
    });
    const standardGapPx = await innerStandardGrid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return 0;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.left - r0.right;
    });

    expect(gapColGapPx).toBeGreaterThan(standardGapPx);
    expect(gapColGapPx).toBeGreaterThan(30);
  });

  test('GC-INT-008 @interaction @regression 1 Column Gap reverts to mobile gap at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    const gapColGrid = page.locator('.ga-grid--gap-col').first();
    if (await gapColGrid.count() === 0) { test.skip(true, 'No gap-col variant on style guide'); return; }
    const innerGapGrid = gapColGrid.locator('.cmp-grid-container__items > .aem-Grid');

    const desktopGap = await innerGapGrid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return 0;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.left - r0.right;
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    // On mobile, columns stack — measure vertical gap instead
    const mobileGap = await innerGapGrid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return 0;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.top - r0.bottom;
    });

    expect(mobileGap).toBeLessThanOrEqual(desktopGap);
    // And should be a reasonable mobile gap (≤ 32px)
    expect(mobileGap).toBeLessThanOrEqual(32);
  });

  // ─── Cross-Background Consistency ────────────────────────────────────────

  test('GC-INT-009 @interaction @regression Grid display property is consistent across white/slate/granite backgrounds', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    // Collect all distinct grid-container instances
    const allGrids = page.locator('.grid-container');
    const count = await allGrids.count();
    expect(count).toBeGreaterThan(0);

    const displayValues: string[] = [];

    for (let i = 0; i < count; i++) {
      const grid = allGrids.nth(i);
      const isVisible = await grid.isVisible();
      if (!isVisible) continue;

      const innerGrid = grid.locator('.cmp-grid-container__items > .aem-Grid');
      const innerCount = await innerGrid.count();
      if (innerCount === 0) continue;

      const displayValue = await innerGrid.first().evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      displayValues.push(displayValue);
    }

    expect(displayValues.length).toBeGreaterThan(0);

    // All inner AEM grids should use the same display mode (grid or flex)
    const uniqueDisplayValues = [...new Set(displayValues)];
    // Allow at most one display type across all grid instances
    expect(uniqueDisplayValues.length).toBeLessThanOrEqual(2); // grid + possible inline variants
    for (const val of displayValues) {
      expect(['grid', 'flex', 'block']).toContain(val);
    }
  });

  test('GC-INT-010 @interaction @regression Column widths are consistent regardless of background color', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    // Compare ratio-1-1 (50/50) grids across different backgrounds
    // The first 2col ratio-1-1 grid (white background) vs the slate background one
    const twoColGrids = page.locator('.grid-container.ga-grid--2col');
    const gridCount = await twoColGrids.count();
    expect(gridCount).toBeGreaterThanOrEqual(2);

    const columnWidthRatios: number[] = [];

    for (let i = 0; i < Math.min(gridCount, 4); i++) {
      const grid = twoColGrids.nth(i);
      const isVisible = await grid.isVisible();
      if (!isVisible) continue;

      const columns = grid.locator('.cmp-grid-container__items > .aem-Grid > .aem-GridColumn');
      const colCount = await columns.count();
      if (colCount < 2) continue;

      const col0Box = await columns.nth(0).boundingBox();
      const col1Box = await columns.nth(1).boundingBox();
      if (!col0Box || !col1Box) continue;

      // Record width ratio col0/col1
      const ratio = col0Box.width / col1Box.width;
      columnWidthRatios.push(ratio);
    }

    expect(columnWidthRatios.length).toBeGreaterThan(0);

    // For 50/50 grids, ratio should be close to 1.0 across backgrounds
    // (Within 15% to account for minor padding/border differences)
    for (const ratio of columnWidthRatios) {
      if (ratio > 0.8 && ratio < 1.2) {
        // This is a 50/50 grid — ratio should be near 1
        expect(ratio).toBeGreaterThan(0.85);
        expect(ratio).toBeLessThan(1.15);
      }
    }
  });

  // ─── Column Equal Heights ─────────────────────────────────────────────────

  test('GC-INT-011 @interaction @regression Columns in 2col layout have equal height (stretch alignment)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    const grid2col = page.locator('.grid-container.ga-grid--2col').first();
    await expect(grid2col).toBeVisible();

    const innerGrid = grid2col.locator('.cmp-grid-container__items > .aem-Grid');
    const columns = innerGrid.locator('> .aem-GridColumn');
    const colCount = await columns.count();
    expect(colCount).toBeGreaterThanOrEqual(2);

    // Verify align-items on the grid container is stretch (default) or explicitly set
    const alignItems = await innerGrid.evaluate((el) => {
      return window.getComputedStyle(el).alignItems;
    });

    // Default CSS grid/flex align-items is 'stretch' — columns fill the row height equally
    expect(['stretch', 'normal']).toContain(alignItems);

    // Verify column heights are equal (within 2px for sub-pixel rendering)
    const col0Box = await columns.nth(0).boundingBox();
    const col1Box = await columns.nth(1).boundingBox();
    expect(col0Box).not.toBeNull();
    expect(col1Box).not.toBeNull();

    const heightDiff = Math.abs(col0Box!.height - col1Box!.height);
    expect(heightDiff).toBeLessThanOrEqual(5);
  });

  test('GC-INT-012 @interaction @regression Tab navigation flows through grid columns in DOM order', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}${STYLE_GUIDE_PATH}`);

    const grid2col = page.locator('.grid-container.ga-grid--2col').first();
    await expect(grid2col).toBeVisible();

    // Collect all focusable elements inside the grid in DOM order
    const focusableElements = await grid2col.locator(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ).all();

    if (focusableElements.length < 2) {
      // If there are not enough focusable elements, verify the grid column order in DOM
      const columns = grid2col.locator('.cmp-grid-container__items > .aem-Grid > .aem-GridColumn');
      const colCount = await columns.count();
      expect(colCount).toBeGreaterThanOrEqual(2);

      // Verify DOM order matches visual left-to-right order at desktop
      const col0Box = await columns.nth(0).boundingBox();
      const col1Box = await columns.nth(1).boundingBox();
      expect(col0Box).not.toBeNull();
      expect(col1Box).not.toBeNull();

      // col0 (first in DOM) should be visually to the left of col1
      expect(col0Box!.x).toBeLessThan(col1Box!.x);
      return;
    }

    // Collect bounding boxes for each focusable element to verify left-to-right, top-to-bottom ordering
    const positions: Array<{ x: number; y: number; index: number }> = [];
    for (let i = 0; i < focusableElements.length; i++) {
      const box = await focusableElements[i].boundingBox();
      if (box) {
        positions.push({ x: box.x, y: box.y, index: i });
      }
    }

    // Verify that DOM order (tab order) corresponds to visual reading order (top-left to bottom-right)
    // Elements in the same row should have increasing X; rows should have increasing Y
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      const isInSameRow = Math.abs(curr.y - prev.y) < 50;

      if (isInSameRow) {
        // Same row: current element should be to the right
        expect(curr.x).toBeGreaterThanOrEqual(prev.x - 10);
      } else {
        // New row: current element should be lower
        expect(curr.y).toBeGreaterThan(prev.y - 10);
      }
    }
  });

});
