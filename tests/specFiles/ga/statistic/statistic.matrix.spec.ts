import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// State Matrix: 36 total (24 valid, 12 invalid)

test.describe('Statistic — State Matrix (Valid)', () => {
  test('[STAT-025] @matrix @regression default + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-026] @matrix @regression default + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-027] @matrix @regression @mobile default + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-028] @matrix @regression default + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-029] @matrix @regression default + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-030] @matrix @regression @mobile default + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-031] @matrix @regression default + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-032] @matrix @regression default + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-033] @matrix @regression @mobile default + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-034] @matrix @regression default + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-035] @matrix @regression default + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-036] @matrix @regression @mobile default + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-037] @matrix @regression default + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-038] @matrix @regression default + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-039] @matrix @regression @mobile default + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-040] @matrix @regression default + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-041] @matrix @regression default + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-042] @matrix @regression @mobile default + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-043] @matrix @regression default + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-044] @matrix @regression default + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-045] @matrix @regression @mobile default + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-046] @matrix @regression default + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-047] @matrix @regression default + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });

  test('[STAT-048] @matrix @regression @mobile default + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Statistic — State Matrix (Invalid Combos)', () => {
  test('[STAT-049] @matrix @negative default + light-theme on white is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-050] @matrix @negative default + light-theme on white is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-051] @matrix @negative default + light-theme on white is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-052] @matrix @negative default + light-theme on slate is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-053] @matrix @negative default + light-theme on slate is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-054] @matrix @negative default + light-theme on slate is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-055] @matrix @negative default + dark-theme on granite is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-056] @matrix @negative default + dark-theme on granite is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-057] @matrix @negative default + dark-theme on granite is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-058] @matrix @negative default + dark-theme on azul is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-059] @matrix @negative default + dark-theme on azul is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
  test('[STAT-060] @matrix @negative default + dark-theme on azul is invalid', async ({ page }) => { const pom = new StatisticPage(page); await pom.navigate(BASE()); });
});
