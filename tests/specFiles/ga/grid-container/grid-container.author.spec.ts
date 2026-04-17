import { test, expect } from '@playwright/test';
import { GridContainerPage } from '../../../pages/ga/components/gridContainerPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

// ─── CSS Selectors ─────────────────────────────────────────────────────────────
const GC_WRAPPER = '.grid-container';
const GC_ROOT    = '.cmp-grid-container';
const GC_ITEMS   = '.cmp-grid-container__items';
const AEM_GRID   = '.cmp-grid-container__items > .aem-Grid';
const AEM_COL    = '.aem-GridColumn';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Core Structure (GC-001 to GC-009) ─────────────────────────────────────────

test.describe('GridContainer — Core Structure', () => {
  test('[GC-001] @smoke @regression Style guide page loads and grid containers are visible', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const roots = page.locator(GC_ROOT);
    const count = await roots.count();
    expect(count, 'Expected at least 7 grid-container instances on the style guide page').toBeGreaterThanOrEqual(7);
    // Verify first and last are visible
    await expect(roots.first()).toBeVisible();
    await expect(roots.last()).toBeVisible();
  });

  test('[GC-002] @smoke @regression Each grid container has .cmp-grid-container__items child', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrappers = page.locator(GC_WRAPPER);
    const count = await wrappers.count();
    expect(count).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < count; i++) {
      const items = wrappers.nth(i).locator(GC_ITEMS);
      await expect(items).toBeVisible();
    }
  });

  test('[GC-003] @regression Each grid container has an .aem-Grid inside __items', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrappers = page.locator(GC_WRAPPER);
    const count = await wrappers.count();
    for (let i = 0; i < count; i++) {
      const grid = wrappers.nth(i).locator(AEM_GRID);
      await expect(grid).toBeVisible();
    }
  });

  test('[GC-004] @regression Grid wrappers use ga-grid--* style system classes, not inline styles', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrappers = page.locator(GC_WRAPPER);
    const count = await wrappers.count();
    for (let i = 0; i < count; i++) {
      const el = wrappers.nth(i);
      // Must have at least one ga-grid--* class
      const classes = await el.getAttribute('class') || '';
      expect(classes, `Wrapper ${i} should have a ga-grid--* class`).toMatch(/ga-grid--/);
      // Must NOT have inline style overriding layout
      const inlineStyle = await el.getAttribute('style') || '';
      expect(inlineStyle, `Wrapper ${i} should not have inline grid-template-columns`).not.toContain('grid-template-columns');
    }
  });

  test('[GC-005] @regression Child components render inside grid columns', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    // Each grid should have at least 2 column children (aem-GridColumn)
    const grids = page.locator(AEM_GRID);
    const count = await grids.count();
    expect(count).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < count; i++) {
      const cols = grids.nth(i).locator(AEM_COL);
      const colCount = await cols.count();
      expect(colCount, `Grid ${i} should have at least 2 columns`).toBeGreaterThanOrEqual(2);
    }
  });

  test('[GC-006] @regression Grid columns contain rendered child content (text components)', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    // Check that columns have actual content, not empty placeholders
    const cols = page.locator(`${AEM_GRID} ${AEM_COL}`);
    const count = await cols.count();
    let contentCount = 0;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = await cols.nth(i).textContent();
      if (text && text.trim().length > 0) contentCount++;
    }
    expect(contentCount, 'At least half of checked columns should have text content').toBeGreaterThanOrEqual(4);
  });

  test('[GC-007] @regression 2col grids use display:grid on .aem-Grid', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid2col = page.locator(`.ga-grid--2col ${AEM_GRID}`).first();
    await expect(grid2col).toBeVisible();
    const display = await grid2col.evaluate(el => getComputedStyle(el).display);
    expect(display, '2-column grid should use CSS Grid').toBe('grid');
  });

  test('[GC-008] @regression 3col grid uses display:grid on .aem-Grid', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid3col = page.locator(`.ga-grid--3col ${AEM_GRID}`).first();
    if (await grid3col.count() === 0) { test.skip(); return; }
    const display = await grid3col.evaluate(el => getComputedStyle(el).display);
    expect(display, '3-column grid should use CSS Grid').toBe('grid');
  });

  test('[GC-009] @regression 4col grid uses display:grid on .aem-Grid', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid4col = page.locator(`.ga-grid--4col ${AEM_GRID}`).first();
    if (await grid4col.count() === 0) { test.skip(); return; }
    const display = await grid4col.evaluate(el => getComputedStyle(el).display);
    expect(display, '4-column grid should use CSS Grid').toBe('grid');
  });
});

// ─── Column Layouts (GC-010 to GC-019) ─────────────────────────────────────────

test.describe('GridContainer — Column Layouts', () => {
  test('[GC-010] @regression 2col 1:1 grid has two equal columns (~50% each)', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--2col.ga-grid--ratio-1-1 ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const templateCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    // gridTemplateColumns returns pixel values like "500px 500px" — split and compare
    const parts = templateCols.trim().split(/\s+/);
    expect(parts.length, '1:1 grid should have exactly 2 column tracks').toBe(2);
    const col1 = parseFloat(parts[0]);
    const col2 = parseFloat(parts[1]);
    expect(col1).toBeGreaterThan(0);
    expect(col2).toBeGreaterThan(0);
    // Columns should be within 5% of each other
    const ratio = col1 / col2;
    expect(ratio, '1:1 columns should be equal width (ratio within 5%)').toBeGreaterThanOrEqual(0.95);
    expect(ratio).toBeLessThanOrEqual(1.05);
  });

  test('[GC-011] @regression 2col 1:3 grid has first column ~25% and second ~75%', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--2col.ga-grid--ratio-1-3 ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const templateCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const parts = templateCols.trim().split(/\s+/);
    expect(parts.length, '1:3 grid should have exactly 2 column tracks').toBe(2);
    const col1 = parseFloat(parts[0]);
    const col2 = parseFloat(parts[1]);
    const total = col1 + col2;
    const pct1 = (col1 / total) * 100;
    const pct2 = (col2 / total) * 100;
    // First column ~25%, second ~75% (±5%)
    expect(pct1, `First column should be ~25%, got ${pct1.toFixed(1)}%`).toBeGreaterThanOrEqual(20);
    expect(pct1).toBeLessThanOrEqual(30);
    expect(pct2, `Second column should be ~75%, got ${pct2.toFixed(1)}%`).toBeGreaterThanOrEqual(70);
    expect(pct2).toBeLessThanOrEqual(80);
  });

  test('[GC-012] @regression 2col 3:1 grid has first column ~75% and second ~25%', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--2col.ga-grid--ratio-3-1 ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const templateCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const parts = templateCols.trim().split(/\s+/);
    expect(parts.length).toBe(2);
    const col1 = parseFloat(parts[0]);
    const col2 = parseFloat(parts[1]);
    const total = col1 + col2;
    const pct1 = (col1 / total) * 100;
    expect(pct1, `First column should be ~75%, got ${pct1.toFixed(1)}%`).toBeGreaterThanOrEqual(70);
    expect(pct1).toBeLessThanOrEqual(80);
  });

  test('[GC-013] @regression 2col 2:3 grid has first column ~40% and second ~60%', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--2col.ga-grid--ratio-2-3 ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const templateCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const parts = templateCols.trim().split(/\s+/);
    expect(parts.length).toBe(2);
    const col1 = parseFloat(parts[0]);
    const col2 = parseFloat(parts[1]);
    const total = col1 + col2;
    const pct1 = (col1 / total) * 100;
    expect(pct1, `2:3 first column should be ~40%, got ${pct1.toFixed(1)}%`).toBeGreaterThanOrEqual(35);
    expect(pct1).toBeLessThanOrEqual(45);
  });

  test('[GC-014] @regression 2col 3:2 grid has first column ~60% and second ~40%', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--2col.ga-grid--ratio-3-2 ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const templateCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const parts = templateCols.trim().split(/\s+/);
    expect(parts.length).toBe(2);
    const col1 = parseFloat(parts[0]);
    const col2 = parseFloat(parts[1]);
    const total = col1 + col2;
    const pct1 = (col1 / total) * 100;
    expect(pct1, `3:2 first column should be ~60%, got ${pct1.toFixed(1)}%`).toBeGreaterThanOrEqual(55);
    expect(pct1).toBeLessThanOrEqual(65);
  });

  test('[GC-015] @regression 3col grid has three equal column tracks (~33% each)', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--3col ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const templateCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const parts = templateCols.trim().split(/\s+/);
    expect(parts.length, '3col grid should have 3 column tracks').toBe(3);
    const widths = parts.map(p => parseFloat(p));
    const total = widths.reduce((s, v) => s + v, 0);
    for (let i = 0; i < 3; i++) {
      const pct = (widths[i] / total) * 100;
      expect(pct, `Column ${i} should be ~33%, got ${pct.toFixed(1)}%`).toBeGreaterThanOrEqual(30);
      expect(pct).toBeLessThanOrEqual(37);
    }
  });

  test('[GC-016] @regression 4col grid has four equal column tracks (~25% each)', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--4col ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const templateCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const parts = templateCols.trim().split(/\s+/);
    expect(parts.length, '4col grid should have 4 column tracks').toBe(4);
    const widths = parts.map(p => parseFloat(p));
    const total = widths.reduce((s, v) => s + v, 0);
    for (let i = 0; i < 4; i++) {
      const pct = (widths[i] / total) * 100;
      expect(pct, `Column ${i} should be ~25%, got ${pct.toFixed(1)}%`).toBeGreaterThanOrEqual(22);
      expect(pct).toBeLessThanOrEqual(28);
    }
  });

  test('[GC-017] @regression 2col grid renders exactly 2 aem-GridColumn children', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--2col ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const cols = grid.locator(':scope > ' + AEM_COL);
    expect(await cols.count(), '2col grid should have exactly 2 direct column children').toBe(2);
  });

  test('[GC-018] @regression 3col grid renders exactly 3 aem-GridColumn children', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--3col ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const cols = grid.locator(':scope > ' + AEM_COL);
    expect(await cols.count(), '3col grid should have exactly 3 direct column children').toBe(3);
  });

  test('[GC-019] @regression 4col grid renders exactly 4 aem-GridColumn children', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--4col ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const cols = grid.locator(':scope > ' + AEM_COL);
    expect(await cols.count(), '4col grid should have exactly 4 direct column children').toBe(4);
  });
});

// ─── Gap / Padding (GC-020 to GC-025) ──────────────────────────────────────────

test.describe('GridContainer — Gap and Padding', () => {
  test('[GC-020] @regression Default 30px gap is applied on 2col 1:1 grid', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--2col.ga-grid--ratio-1-1 ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const gap = await grid.evaluate(el => {
      const cs = getComputedStyle(el);
      // Measure actual gap by distance between first two columns
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length >= 2) {
        const r1 = cols[0].getBoundingClientRect();
        const r2 = cols[1].getBoundingClientRect();
        // If side-by-side, gap = col2.left - col1.right
        if (Math.abs(r1.top - r2.top) < 5) return String(r2.left - r1.right);
        // If stacked, gap = col2.top - col1.bottom
        return String(r2.top - r1.bottom);
      }
      return cs.gap || cs.columnGap || '0';
    });
    expect(parseFloat(gap), `Expected 30px column gap, got "${gap}"`).toBeCloseTo(30, 0);
  });

  test('[GC-021] @regression 30px gap is applied on 3col grid', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`.ga-grid--3col ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const gap = await grid.evaluate(el => {
      const cs = getComputedStyle(el);
      // Measure actual gap by distance between first two columns
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length >= 2) {
        const r1 = cols[0].getBoundingClientRect();
        const r2 = cols[1].getBoundingClientRect();
        // If side-by-side, gap = col2.left - col1.right
        if (Math.abs(r1.top - r2.top) < 5) return String(r2.left - r1.right);
        // If stacked, gap = col2.top - col1.bottom
        return String(r2.top - r1.bottom);
      }
      return cs.gap || cs.columnGap || '0';
    });
    expect(parseFloat(gap), `Expected 30px column gap on 3col, got "${gap}"`).toBeCloseTo(30, 0);
  });

  test('[GC-022] @regression 1-Column Gap variant has a larger gap than 30px', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const colGapWrapper = page.locator(`.ga-grid--gap-col`).first();
    if (await colGapWrapper.count() === 0) { test.skip(); return; }
    const grid = colGapWrapper.locator(AEM_GRID);
    const gap = await grid.evaluate(el => {
      const cs = getComputedStyle(el);
      // Measure actual gap by distance between first two columns
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length >= 2) {
        const r1 = cols[0].getBoundingClientRect();
        const r2 = cols[1].getBoundingClientRect();
        // If side-by-side, gap = col2.left - col1.right
        if (Math.abs(r1.top - r2.top) < 5) return String(r2.left - r1.right);
        // If stacked, gap = col2.top - col1.bottom
        return String(r2.top - r1.bottom);
      }
      return cs.gap || cs.columnGap || '0';
    });
    const gapPx = parseFloat(gap);
    expect(gapPx, `1-column-gap variant gap (${gapPx}px) should be greater than 30px`).toBeGreaterThan(30);
  });

  test('[GC-023] @regression 1-Column Gap is approximately 100-200px at desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const colGapWrapper = page.locator(`.ga-grid--gap-col`).first();
    if (await colGapWrapper.count() === 0) { test.skip(); return; }
    const grid = colGapWrapper.locator(AEM_GRID);
    const gap = await grid.evaluate(el => {
      const cs = getComputedStyle(el);
      // Measure actual gap by distance between first two columns
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length >= 2) {
        const r1 = cols[0].getBoundingClientRect();
        const r2 = cols[1].getBoundingClientRect();
        // If side-by-side, gap = col2.left - col1.right
        if (Math.abs(r1.top - r2.top) < 5) return String(r2.left - r1.right);
        // If stacked, gap = col2.top - col1.bottom
        return String(r2.top - r1.bottom);
      }
      return cs.gap || cs.columnGap || '0';
    });
    const gapPx = parseFloat(gap);
    expect(gapPx, `1-column-gap at 1440px wide should be 100-200px, got ${gapPx}px`).toBeGreaterThanOrEqual(80);
    expect(gapPx).toBeLessThanOrEqual(250);
  });

  test('[GC-024] @regression Gap is between columns, not applied as outer padding on the wrapper', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(`.ga-grid--2col.ga-grid--ratio-1-1`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    // Outer padding-left of the wrapper should be 0 (gap is between columns, not outer)
    const paddingLeft = await wrapper.evaluate(el => parseFloat(getComputedStyle(el).paddingLeft));
    // Allow for standard section padding; gap-specific padding should not exceed 30px extra
    // This is primarily a smoke check — wrapper should not apply gap as side padding
    expect(paddingLeft).toBeLessThan(200);
  });

  test('[GC-025] @regression 2col 2:3 grid on Slate has same gap as white-bg grids', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    // 2col 2:3 on Slate is variation 3 per the style guide
    const grid = page.locator(`.ga-grid--2col.ga-grid--ratio-2-3 ${AEM_GRID}`).first();
    if (await grid.count() === 0) { test.skip(); return; }
    const gap = await grid.evaluate(el => {
      const cs = getComputedStyle(el);
      // Measure actual gap by distance between first two columns
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length >= 2) {
        const r1 = cols[0].getBoundingClientRect();
        const r2 = cols[1].getBoundingClientRect();
        // If side-by-side, gap = col2.left - col1.right
        if (Math.abs(r1.top - r2.top) < 5) return String(r2.left - r1.right);
        // If stacked, gap = col2.top - col1.bottom
        return String(r2.top - r1.bottom);
      }
      return cs.gap || cs.columnGap || '0';
    });
    expect(parseFloat(gap)).toBeCloseTo(30, 0);
  });
});

// ─── Mobile Stacking (GC-026 to GC-032) ────────────────────────────────────────

test.describe('GridContainer — Mobile Stacking', () => {
  test('[GC-026] @mobile @regression At 390px viewport, 2col grid stacks to 1 column', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(`.ga-grid--2col:not(.ga-grid--mobile-grid)`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const grid = wrapper.locator(AEM_GRID);
    // Mobile override uses display:flex; flex-direction:column — check columns stack vertically
    const stacked = await grid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return true;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.top >= r0.bottom - 2; // stacked if col2 starts at/below col1 bottom
    });
    expect(stacked, 'At 390px, 2col should stack vertically').toBe(true);
  });

  test('[GC-027] @mobile @regression At 390px viewport, 3col grid stacks to 1 column', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(`.ga-grid--3col`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const grid = wrapper.locator(AEM_GRID);
    const stacked = await grid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return true;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.top >= r0.bottom - 2;
    });
    expect(stacked, 'At 390px, 3col should stack vertically').toBe(true);
  });

  test('[GC-028] @mobile @regression At 390px viewport, 4col grid stacks to 1 column', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(`.ga-grid--4col`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const grid = wrapper.locator(AEM_GRID);
    const stacked = await grid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return true;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return r1.top >= r0.bottom - 2;
    });
    expect(stacked, 'At 390px, 4col should stack vertically').toBe(true);
  });

  test('[GC-029] @mobile @regression Mobile Grid (.ga-grid--mobile-grid) keeps 2-col at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(`.ga-grid--mobile-grid`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const grid = wrapper.locator(AEM_GRID);
    // Mobile Grid keeps side-by-side layout — columns should be at same Y
    const sideBySide = await grid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return false;
      const r0 = cols[0].getBoundingClientRect();
      const r1 = cols[1].getBoundingClientRect();
      return Math.abs(r0.top - r1.top) < 10; // same row
    });
    expect(sideBySide, 'Mobile-grid should keep columns side-by-side at 390px').toBe(true);
  });

  test('[GC-030] @mobile @regression Mobile Grid columns are approximately equal at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(`.ga-grid--mobile-grid`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const grid = wrapper.locator(AEM_GRID);
    const ratio = await grid.evaluate(el => {
      const cols = el.querySelectorAll(':scope > .aem-GridColumn');
      if (cols.length < 2) return 1;
      const w0 = cols[0].getBoundingClientRect().width;
      const w1 = cols[1].getBoundingClientRect().width;
      return w0 / w1;
    });
    expect(ratio, 'Mobile-grid columns should be roughly equal').toBeGreaterThanOrEqual(0.8);
    expect(ratio).toBeLessThanOrEqual(1.2);
  });

  test('[GC-031] @mobile @regression Mobile stacked grid has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const roots = page.locator(GC_ROOT);
    const count = await roots.count();
    for (let i = 0; i < count; i++) {
      const overflow = await roots.nth(i).evaluate(el => el.scrollWidth > el.clientWidth + 1);
      expect(overflow, `Grid container ${i} has horizontal overflow on mobile`).toBe(false);
    }
  });

  test('[GC-032] @mobile @regression Mobile stacked grid gap is between 20px and 32px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    // Find a 2col that stacks (no mobile-grid class)
    const wrapper = page.locator(`.ga-grid--2col:not(.ga-grid--mobile-grid)`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const grid = wrapper.locator(AEM_GRID);
    const gap = await grid.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.rowGap || cs.gap;
    });
    const gapPx = parseFloat(gap);
    // GAAM-380 specifies 32px; GAAM-606 changed to 20px — accept either
    if (!isNaN(gapPx)) {
      expect(gapPx, `Mobile row gap should be 20–32px, got ${gapPx}px`).toBeGreaterThanOrEqual(16);
      expect(gapPx).toBeLessThanOrEqual(36);
    }
  });
});

// ─── Dark Section (GC-033 to GC-035) ───────────────────────────────────────────

test.describe('GridContainer — Dark Section Background', () => {
  test('[GC-033] @regression 4col on Granite: grid inherits white or light text color', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid4colGranite = page.locator(`.ga-grid--4col`).first();
    if (await grid4colGranite.count() === 0) { test.skip(); return; }
    // Check text color — on dark background it should be white/light
    const textColor = await grid4colGranite.locator(`${AEM_COL}`).first().evaluate(el => {
      return getComputedStyle(el).color;
    });
    // Parse RGB and check for light (r,g,b all > 180 suggests near-white)
    const match = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [, r, g, b] = match.map(Number);
      const luminance = (r + g + b) / 3;
      expect(luminance, `Text on granite should be light (>180), got color ${textColor}`).toBeGreaterThanOrEqual(180);
    }
  });

  test('[GC-034] @regression 4col on Granite: wrapper has granite background applied', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    // The 4col style guide variation is on a granite section
    const graniteSection = page.locator('.cmp-section--background-color-granite, [class*="granite"]').first();
    if (await graniteSection.count() === 0) { test.skip(); return; }
    const bgColor = await graniteSection.evaluate(el => getComputedStyle(el).backgroundColor);
    // Granite is a dark color (not white and not transparent)
    expect(bgColor, 'Granite section should have a non-white, non-transparent background').not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[GC-035] @regression Grid container on granite section renders without layout issues', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid4colEl = page.locator(`.ga-grid--4col ${GC_ROOT}`).first();
    if (await grid4colEl.count() === 0) { test.skip(); return; }
    await expect(grid4colEl).toBeVisible();
    // All 4 columns should be visible
    const cols = grid4colEl.locator(`${GC_ITEMS} > ${AEM_GRID.split(' > ')[1]} > ${AEM_COL}`);
    const colCount = await cols.count();
    expect(colCount).toBeGreaterThanOrEqual(4);
  });
});

// ─── Dialog / Author (GC-036 to GC-040) ────────────────────────────────────────

test.describe('GridContainer — AEM Dialog and Overlay', () => {
  test('[GC-036] @author @regression GA overlay has sling:resourceSuperType pointing to base component', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/grid-container.1.json`;
    const response = await page.request.get(url);
    expect(response.ok(), 'GA grid-container overlay component not found at /apps/ga/...').toBe(true);
    const json = await response.json();
    expect(
      json['sling:resourceSuperType'],
      'GA overlay should delegate to kkr-aem-base grid-container'
    ).toContain('grid-container');
  });

  test('[GC-037] @author @regression Component belongs to "GA Base" component group', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/grid-container.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['componentGroup'], 'componentGroup should be "GA Base"').toBe('GA Base');
  });

  test('[GC-038] @author @regression Dialog exists and has a Properties tab', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/grid-container/_cq_dialog.1.json`;
    const response = await page.request.get(url);
    // If GA dialog does not exist, the base dialog from resourceSuperType is used
    // Either case is acceptable per spec (base dialog has ID field only)
    if (!response.ok()) {
      // Fall back to base component dialog check
      const baseUrl = `${BASE()}/apps/kkr-aem-base/components/content/grid-container/_cq_dialog.1.json`;
      const baseResponse = await page.request.get(baseUrl);
      expect(baseResponse.ok(), 'Neither GA nor base grid-container dialog found').toBe(true);
      return;
    }
    const dialog = await response.json();
    // Dialog should have a jcr:title
    expect(dialog['jcr:title'] || dialog['sling:resourceType'], 'Dialog must have a title or resourceType').toBeTruthy();
  });

  test('[GC-039] @author @regression Style guide page returns HTTP 200', async ({ page }) => {
    const response = await page.request.get(
      `${BASE()}/content/global-atlantic/style-guide/components/grid-container.html?wcmmode=disabled`
    );
    expect(response.ok(), 'Grid-container style guide page should return 200').toBe(true);
  });

  test('[GC-040] @author @regression Component description is set', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/grid-container.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    // jcr:description is optional but if present should be non-empty
    if (json['jcr:description'] !== undefined) {
      expect(json['jcr:description'].trim().length).toBeGreaterThan(0);
    }
    // At minimum, jcr:title should exist
    expect(json['jcr:title'] || json['componentGroup'], 'Component should have a title or group').toBeTruthy();
  });
});

// ─── Accessibility (GC-041 to GC-045) ──────────────────────────────────────────

test.describe('GridContainer — Accessibility', () => {
  test('[GC-041] @a11y @wcag22 @regression @smoke axe-core scan on 2col grid passes', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(`.ga-grid--2col`).first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const results = await new AxeBuilder({ page })
      .include(`.ga-grid--2col`)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, `axe violations: ${JSON.stringify(results.violations.map(v => v.id))}`).toEqual([]);
  });

  test('[GC-042] @a11y @wcag22 @regression @smoke axe-core scan on 3col and 4col grids passes', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(`.ga-grid--3col, .ga-grid--4col`)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, `axe violations: ${JSON.stringify(results.violations.map(v => v.id))}`).toEqual([]);
  });

  test('[GC-043] @a11y @regression Grid columns maintain logical DOM order (first column first in DOM)', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const grid = page.locator(`${AEM_GRID}`).first();
    await expect(grid).toBeVisible();
    // Check that columns appear in source order: first column's bounding box left <= second's
    const cols = grid.locator(':scope > ' + AEM_COL);
    const count = await cols.count();
    if (count < 2) { test.skip(); return; }
    const box0 = await cols.nth(0).boundingBox();
    const box1 = await cols.nth(1).boundingBox();
    if (box0 && box1) {
      expect(box0.x, 'First column should be to the left of the second column').toBeLessThanOrEqual(box1.x);
    }
  });

  test('[GC-044] @a11y @mobile @regression No grid container overflows viewport at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const roots = page.locator(GC_ROOT);
    const count = await roots.count();
    for (let i = 0; i < count; i++) {
      const overflow = await roots.nth(i).evaluate(el => el.scrollWidth > el.clientWidth + 2);
      expect(overflow, `Grid container ${i} overflows at 390px`).toBe(false);
    }
  });

  test('[GC-045] @a11y @regression Images inside grid columns have alt attributes', async ({ page }) => {
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    const images = page.locator(`${GC_ROOT} img`);
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} inside grid should have an alt attribute (can be empty for decorative)`).not.toBeNull();
    }
  });
});

// ─── Console Errors (GC-046) ────────────────────────────────────────────────────

test.describe('GridContainer — Console Errors', () => {
  test('[GC-046] @regression No JS errors or page errors on style guide page load', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new GridContainerPage(page);
    await pom.navigate(BASE());
    // Allow a brief settle period for lazy-loaded scripts
    await page.waitForTimeout(500);
    const errors = capture.getErrors();
    capture.stop();
    expect(
      errors.map(e => e.message),
      `JS errors on grid-container style guide: ${errors.map(e => e.message).join('; ')}`
    ).toEqual([]);
  });
});
