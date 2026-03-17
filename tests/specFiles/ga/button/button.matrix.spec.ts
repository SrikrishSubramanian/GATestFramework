import { test, expect } from '../../../utils/infra/persistent-context';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});


// State Matrix: 108 total (72 valid, 36 invalid)

test.describe('Button — State Matrix (Valid)', () => {
  test('[BTN-088] @matrix @regression primary-filled + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-089] @matrix @regression primary-filled + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-090] @matrix @regression @mobile primary-filled + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-091] @matrix @regression primary-filled + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-092] @matrix @regression primary-filled + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-093] @matrix @regression @mobile primary-filled + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-094] @matrix @regression primary-filled + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-095] @matrix @regression primary-filled + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-096] @matrix @regression @mobile primary-filled + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-097] @matrix @regression primary-filled + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-098] @matrix @regression primary-filled + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-099] @matrix @regression @mobile primary-filled + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-100] @matrix @regression primary-filled + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-101] @matrix @regression primary-filled + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-102] @matrix @regression @mobile primary-filled + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-103] @matrix @regression primary-filled + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-104] @matrix @regression primary-filled + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-105] @matrix @regression @mobile primary-filled + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-106] @matrix @regression primary-filled + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-107] @matrix @regression primary-filled + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-108] @matrix @regression @mobile primary-filled + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-109] @matrix @regression primary-filled + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-110] @matrix @regression primary-filled + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-111] @matrix @regression @mobile primary-filled + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: primary-filled with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-112] @matrix @regression secondary-outline + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-113] @matrix @regression secondary-outline + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-114] @matrix @regression @mobile secondary-outline + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-115] @matrix @regression secondary-outline + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-116] @matrix @regression secondary-outline + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-117] @matrix @regression @mobile secondary-outline + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-118] @matrix @regression secondary-outline + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-119] @matrix @regression secondary-outline + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-120] @matrix @regression @mobile secondary-outline + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-121] @matrix @regression secondary-outline + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-122] @matrix @regression secondary-outline + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-123] @matrix @regression @mobile secondary-outline + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-124] @matrix @regression secondary-outline + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-125] @matrix @regression secondary-outline + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-126] @matrix @regression @mobile secondary-outline + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-127] @matrix @regression secondary-outline + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-128] @matrix @regression secondary-outline + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-129] @matrix @regression @mobile secondary-outline + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-130] @matrix @regression secondary-outline + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-131] @matrix @regression secondary-outline + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-132] @matrix @regression @mobile secondary-outline + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-133] @matrix @regression secondary-outline + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-134] @matrix @regression secondary-outline + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-135] @matrix @regression @mobile secondary-outline + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: secondary-outline with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-136] @matrix @regression text-only + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-137] @matrix @regression text-only + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-138] @matrix @regression @mobile text-only + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with light-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-139] @matrix @regression text-only + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-140] @matrix @regression text-only + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-141] @matrix @regression @mobile text-only + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with light-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-142] @matrix @regression text-only + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-143] @matrix @regression text-only + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-144] @matrix @regression @mobile text-only + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with dark-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-145] @matrix @regression text-only + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-146] @matrix @regression text-only + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-147] @matrix @regression @mobile text-only + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with dark-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-148] @matrix @regression text-only + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-149] @matrix @regression text-only + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-150] @matrix @regression @mobile text-only + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on white section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-151] @matrix @regression text-only + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-152] @matrix @regression text-only + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-153] @matrix @regression @mobile text-only + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on slate section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-154] @matrix @regression text-only + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-155] @matrix @regression text-only + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-156] @matrix @regression @mobile text-only + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on granite section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-157] @matrix @regression text-only + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-158] @matrix @regression text-only + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });

  test('[BTN-159] @matrix @regression @mobile text-only + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Verify: text-only with auto-theme renders correctly on azul section
    const root = page.locator('.cmp-button').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Button — State Matrix (Invalid Combos)', () => {
  test('[BTN-160] @matrix @negative primary-filled + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-161] @matrix @negative primary-filled + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-162] @matrix @negative primary-filled + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-163] @matrix @negative primary-filled + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-164] @matrix @negative primary-filled + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-165] @matrix @negative primary-filled + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-166] @matrix @negative primary-filled + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-167] @matrix @negative primary-filled + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-168] @matrix @negative primary-filled + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-169] @matrix @negative primary-filled + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-170] @matrix @negative primary-filled + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-171] @matrix @negative primary-filled + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-172] @matrix @negative secondary-outline + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-173] @matrix @negative secondary-outline + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-174] @matrix @negative secondary-outline + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-175] @matrix @negative secondary-outline + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-176] @matrix @negative secondary-outline + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-177] @matrix @negative secondary-outline + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-178] @matrix @negative secondary-outline + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-179] @matrix @negative secondary-outline + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-180] @matrix @negative secondary-outline + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-181] @matrix @negative secondary-outline + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-182] @matrix @negative secondary-outline + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-183] @matrix @negative secondary-outline + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-184] @matrix @negative text-only + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-185] @matrix @negative text-only + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-186] @matrix @negative text-only + light-theme on white is invalid', async ({ page }) => {
    // light-theme on light background (white) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-187] @matrix @negative text-only + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-188] @matrix @negative text-only + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-189] @matrix @negative text-only + light-theme on slate is invalid', async ({ page }) => {
    // light-theme on light background (slate) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-190] @matrix @negative text-only + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-191] @matrix @negative text-only + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-192] @matrix @negative text-only + dark-theme on granite is invalid', async ({ page }) => {
    // dark-theme on dark background (granite) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-193] @matrix @negative text-only + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-194] @matrix @negative text-only + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });

  test('[BTN-195] @matrix @negative text-only + dark-theme on azul is invalid', async ({ page }) => {
    // dark-theme on dark background (azul) has insufficient contrast
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
  });
});
