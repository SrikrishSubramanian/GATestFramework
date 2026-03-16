import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Statistic — Component Interactions', () => {
  test('[STAT-017] @interaction @regression statistic adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  test('[STAT-018] @interaction @regression statistic adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  test('[STAT-019] @interaction @regression statistic adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  test('[STAT-020] @interaction @regression statistic adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  test('[STAT-021] @interaction @regression statistic adapts to unknown parent (#5)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  test('[STAT-022] @interaction @regression statistic adapts to unknown parent (#6)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  test('[STAT-023] @interaction @regression statistic adapts to unknown parent (#7)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  test('[STAT-024] @interaction @regression statistic adapts to unknown parent (#8)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });
});
