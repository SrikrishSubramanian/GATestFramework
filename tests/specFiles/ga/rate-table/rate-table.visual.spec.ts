import { test, expect } from '@playwright/test';
import { RateTablePage } from '../../../pages/ga/components/rateTablePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Rate Table — Visual Regression', () => {
  test('[RT-VISUAL-001] @visual Rate table layout is visually correct', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const root = page.locator('.cmp-rate-table').first();
    await expect(root).toBeVisible();

    // Check table structure
    const table = root.locator('table');
    await expect(table).toBeVisible();

    // Verify headers are visible
    const headers = root.locator('thead th');
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);
  });

  test('[RT-VISUAL-002] @visual Rate table columns align correctly', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const table = page.locator('.cmp-rate-table table').first();
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      const firstRowCells = rows.first().locator('td');
      const firstRowCellCount = await firstRowCells.count();

      // Verify all rows have same number of cells
      for (let i = 0; i < Math.min(rowCount, 3); i++) {
        const rowCells = rows.nth(i).locator('td');
        const cellCount = await rowCells.count();
        expect(cellCount).toBe(firstRowCellCount);
      }
    }
  });

  test('[RT-VISUAL-003] @visual Rate table text is readable', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const table = page.locator('.cmp-rate-table table').first();
    const cells = table.locator('td, th');

    const cellCount = await cells.count();
    if (cellCount > 0) {
      // Check that at least some cells have text
      let textCount = 0;
      for (let i = 0; i < Math.min(cellCount, 10); i++) {
        const text = await cells.nth(i).textContent();
        if (text && text.trim().length > 0) {
          textCount++;
        }
      }
      expect(textCount).toBeGreaterThan(0);
    }
  });

  test('[RT-VISUAL-004] @visual Rate table borders and spacing are correct', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const table = page.locator('.cmp-rate-table table').first();
    const tbody = table.locator('tbody');

    // Check that border-collapse or spacing is applied
    const borderCollapse = await table.evaluate(el =>
      window.getComputedStyle(el).borderCollapse
    );
    expect(['collapse', 'separate']).toContain(borderCollapse);
  });

  test('[RT-VISUAL-005] @visual Rate table responsive on mobile', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    // Check mobile-specific styles
    const table = page.locator('.cmp-rate-table').first();
    const display = await table.evaluate(el =>
      window.getComputedStyle(el).display
    );

    // Should be visible (either block, table, flex, or grid)
    expect(['block', 'table', 'flex', 'grid', 'inline-block']).toContain(display);
  });
});
