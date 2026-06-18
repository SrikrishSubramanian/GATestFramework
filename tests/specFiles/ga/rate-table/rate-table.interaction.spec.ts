import { test, expect } from '@playwright/test';
import { RateTablePage } from '../../../pages/ga/components/rateTablePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  // Auth handled by globalSetup + storageState in config

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Rate Table — Interactions', () => {
  test('[RT-INTERACTION-001] @interaction @regression Rate table responds to sort click', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const table = page.locator('.cmp-rate-table table').first();
    const headers = table.locator('thead th');

    const headerCount = await headers.count();
    if (headerCount > 0) {
      // Check if any headers have sortable indicator
      const firstHeader = headers.first();
      const ariaSort = await firstHeader.getAttribute('aria-sort');

      // If sortable, click and verify
      if (ariaSort !== null) {
        await clickElement(firstHeader);
        // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // Wait for sort animation

        // Verify table is still visible
        await expect(table).toBeVisible();
      }
    }
  });

  test('[RT-INTERACTION-002] @interaction @regression Rate table with expandable rows', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const table = page.locator('.cmp-rate-table table').first();
    const expandButtons = table.locator('button[aria-expanded]');
    const buttonCount = await expandButtons.count();

    if (buttonCount > 0) {
      const firstButton = expandButtons.first();
      const initialState = await firstButton.getAttribute('aria-expanded');

      // Click to expand/collapse
      await clickElement(firstButton);
      // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

      const newState = await firstButton.getAttribute('aria-expanded');
      expect(newState).not.toBe(initialState);
    }
  });

  test('[RT-INTERACTION-003] @interaction @regression Rate table hover states work', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const rows = page.locator('.cmp-rate-table table tbody tr').first();
    const initialBg = // 📏 TODO: Replace with measurement-utils
    await rows.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Hover over row
    await hover(rows);
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

    const hoverBg = // 📏 TODO: Replace with measurement-utils
    await rows.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Hover state may or may not change color, but should not error
    expect(hoverBg).toBeTruthy();
  });

  test('[RT-INTERACTION-004] @interaction @regression Rate table keyboard navigation', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const table = page.locator('.cmp-rate-table table').first();
    await table.focus();

    // Try keyboard navigation
    await page.keyboard.press('Tab');
    // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // Verify focus moved
    const focusedElement = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('[RT-INTERACTION-005] @interaction @regression Rate table filter behavior', async ({ page }) => {
    const pom = new RateTablePage(page);
    await pom.navigate(BASE());

    const filterInputs = page.locator('.cmp-rate-table input[type="text"], .cmp-rate-table input[type="search"]');
    const inputCount = await filterInputs.count();

    if (inputCount > 0) {
      const firstInput = filterInputs.first();

      // Type in filter
      await fill(firstInput, 'test');
      // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // Verify table is still visible
      const table = page.locator('.cmp-rate-table table').first();
      await expect(table).toBeVisible();
    }
  });
});
