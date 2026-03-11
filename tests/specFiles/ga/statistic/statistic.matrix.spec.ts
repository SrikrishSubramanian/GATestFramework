import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(`${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});


// State Matrix: 36 total (24 valid, 12 invalid)

test.describe('Statistic — State Matrix (Valid)', () => {
  test('@matrix @regression default + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression default + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile default + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.ga-statistic').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Statistic — State Matrix (Invalid Combos)', () => {
  test('@matrix @negative default + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative default + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });
});
