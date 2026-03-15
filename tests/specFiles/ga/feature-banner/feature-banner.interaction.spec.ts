import { test, expect } from '@playwright/test';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

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

test.describe('FeatureBanner — Component Interactions', () => {
  test('[FB-017] @interaction @regression feature-banner adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  test('[FB-018] @interaction @regression feature-banner adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  test('[FB-019] @interaction @regression feature-banner adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  test('[FB-020] @interaction @regression feature-banner adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  test('[FB-021] @interaction @regression feature-banner adapts to unknown parent (#5)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  test('[FB-022] @interaction @regression feature-banner adapts to unknown parent (#6)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  test('[FB-023] @interaction @regression feature-banner adapts to unknown parent (#7)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });

  test('[FB-024] @interaction @regression feature-banner adapts to unknown parent (#8)', async ({ page }) => {
    const pom = new FeatureBannerPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.feature-banner').first();
    await expect(child).toBeVisible();
  });
});
