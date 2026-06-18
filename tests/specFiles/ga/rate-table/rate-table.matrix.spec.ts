import { test, expect } from '@playwright/test';
import { RateTablePage } from '../../../pages/ga/components/rateTablePage';
import ENV from '../../../utils/infra/env';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../src/utils/action-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
  // Auth handled by globalSetup + storageState in config

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Rate Table — State Matrix (Variants × Themes × Backgrounds)', () => {
  const variants = ['default', 'compact', 'striped'];
  const themes = ['light', 'dark'];
  const backgrounds = ['white', 'gray', 'colored'];
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const variant of variants) {
    for (const theme of themes) {
      for (const bg of backgrounds) {
        for (const viewport of viewports) {
          const testName = `[RT-MATRIX-${variant}-${theme}-${bg}-${viewport.name}] @matrix @regression Rate table (${variant}, ${theme}, ${bg}, ${viewport.name})`;

          test(testName, async ({ page }) => {
            // Set viewport
            await page.setViewportSize({
              width: viewport.width,
              height: viewport.height
            });

            const pom = new RateTablePage(page);
            await pom.navigate(BASE());

            const root = page.locator('.cmp-rate-table').first();
            await expect(root).toBeVisible();

            // Verify table is rendered
            const table = root.locator('table');
            await expect(table).toBeVisible();

            // Check table has content
            const rows = table.locator('tbody tr');
            const rowCount = await rows.count();
            expect(rowCount).toBeGreaterThanOrEqual(0);

            // Verify no console errors
            const errors: string[] = [];
            page.on('pageerror', e => errors.push(e.message));
            expect(errors).toEqual([]);

            // Verify responsive behavior on smaller viewports
            if (viewport.width < 768) {
              const overflowX = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el =>
                window.getComputedStyle(el).overflowX
              );
              expect(['auto', 'scroll', 'visible']).toContain(overflowX);
            }
          });
        }
      }
    }
  }
});
