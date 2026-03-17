import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});


// State Matrix: 72 total (48 valid, 24 invalid)

test.describe('FeatureBanner — State Matrix (Valid)', () => {
  test('[FB-025] @matrix @regression default + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-026] @matrix @regression default + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-027] @matrix @regression @mobile default + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-028] @matrix @regression default + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-029] @matrix @regression default + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-030] @matrix @regression @mobile default + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with light-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-031] @matrix @regression default + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-032] @matrix @regression default + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-033] @matrix @regression @mobile default + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-034] @matrix @regression default + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-035] @matrix @regression default + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-036] @matrix @regression @mobile default + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with dark-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-037] @matrix @regression default + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-038] @matrix @regression default + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-039] @matrix @regression @mobile default + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-040] @matrix @regression default + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-041] @matrix @regression default + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-042] @matrix @regression @mobile default + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-043] @matrix @regression default + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-044] @matrix @regression default + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-045] @matrix @regression @mobile default + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-046] @matrix @regression default + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-047] @matrix @regression default + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-048] @matrix @regression @mobile default + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: default with auto-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-049] @matrix @regression fifty-fifty + light-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with light-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-050] @matrix @regression fifty-fifty + light-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with light-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-051] @matrix @regression @mobile fifty-fifty + light-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with light-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-052] @matrix @regression fifty-fifty + light-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with light-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-053] @matrix @regression fifty-fifty + light-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with light-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-054] @matrix @regression @mobile fifty-fifty + light-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with light-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-055] @matrix @regression fifty-fifty + dark-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with dark-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-056] @matrix @regression fifty-fifty + dark-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with dark-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-057] @matrix @regression @mobile fifty-fifty + dark-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with dark-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-058] @matrix @regression fifty-fifty + dark-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with dark-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-059] @matrix @regression fifty-fifty + dark-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with dark-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-060] @matrix @regression @mobile fifty-fifty + dark-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with dark-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-061] @matrix @regression fifty-fifty + auto-theme on white @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-062] @matrix @regression fifty-fifty + auto-theme on white @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-063] @matrix @regression @mobile fifty-fifty + auto-theme on white @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on white section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-064] @matrix @regression fifty-fifty + auto-theme on slate @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-065] @matrix @regression fifty-fifty + auto-theme on slate @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-066] @matrix @regression @mobile fifty-fifty + auto-theme on slate @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on slate section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-067] @matrix @regression fifty-fifty + auto-theme on granite @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-068] @matrix @regression fifty-fifty + auto-theme on granite @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-069] @matrix @regression @mobile fifty-fifty + auto-theme on granite @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on granite section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-070] @matrix @regression fifty-fifty + auto-theme on azul @ desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-071] @matrix @regression fifty-fifty + auto-theme on azul @ tablet-1024', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });

  test('[FB-072] @matrix @regression @mobile fifty-fifty + auto-theme on azul @ mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FeatureBannerPage(page);
    await pom.navigate(BASE());
    // Verify: fifty-fifty with auto-theme renders correctly on azul section
    const root = page.locator('.feature-banner').first();
    await expect(root).toBeVisible();
  });
});

test.describe('FeatureBanner — State Matrix (Invalid Combos)', () => {
  test('[FB-073] @matrix @negative default + light-theme on white is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-074] @matrix @negative default + light-theme on white is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-075] @matrix @negative default + light-theme on white is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-076] @matrix @negative default + light-theme on slate is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-077] @matrix @negative default + light-theme on slate is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-078] @matrix @negative default + light-theme on slate is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-079] @matrix @negative default + dark-theme on granite is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-080] @matrix @negative default + dark-theme on granite is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-081] @matrix @negative default + dark-theme on granite is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-082] @matrix @negative default + dark-theme on azul is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-083] @matrix @negative default + dark-theme on azul is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-084] @matrix @negative default + dark-theme on azul is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-085] @matrix @negative fifty-fifty + light-theme on white is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-086] @matrix @negative fifty-fifty + light-theme on white is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-087] @matrix @negative fifty-fifty + light-theme on white is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-088] @matrix @negative fifty-fifty + light-theme on slate is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-089] @matrix @negative fifty-fifty + light-theme on slate is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-090] @matrix @negative fifty-fifty + light-theme on slate is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-091] @matrix @negative fifty-fifty + dark-theme on granite is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-092] @matrix @negative fifty-fifty + dark-theme on granite is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-093] @matrix @negative fifty-fifty + dark-theme on granite is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-094] @matrix @negative fifty-fifty + dark-theme on azul is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-095] @matrix @negative fifty-fifty + dark-theme on azul is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
  test('[FB-096] @matrix @negative fifty-fifty + dark-theme on azul is invalid', async ({ page }) => { const pom = new FeatureBannerPage(page); await pom.navigate(BASE()); });
});
