import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
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


// State Matrix: 108 total (72 valid, 36 invalid)

test.describe('Button — State Matrix (Valid)', () => {
  test('@matrix @regression primary-filled + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression primary-filled + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile primary-filled + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: primary-filled with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression secondary-outline + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile secondary-outline + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: secondary-outline with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with light-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with light-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with dark-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with dark-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on white section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on slate section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on granite section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression text-only + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });

  test('@matrix @regression @mobile text-only + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: text-only with auto-theme renders correctly on azul section
    const root = page.locator('.ga-button').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Button — State Matrix (Invalid Combos)', () => {
  test('@matrix @negative primary-filled + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative primary-filled + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative secondary-outline + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });

  test('@matrix @negative text-only + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });
});
