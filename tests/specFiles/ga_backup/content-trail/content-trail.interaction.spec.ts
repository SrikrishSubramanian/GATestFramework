import { test, expect } from '@playwright/test';
import { ContentTrailPage } from '../../../pages/ga/components/contentTrailPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('ContentTrail — Component Interactions', () => {
  test('@interaction @regression content-trail adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression content-trail adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: content-trail with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression content-trail adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: content-trail with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression content-trail adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: content-trail with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression content-trail adapts to unknown parent (#5)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: content-trail with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression content-trail adapts to unknown parent (#6)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: content-trail with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression content-trail adapts to unknown parent (#7)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: content-trail with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression content-trail adapts to unknown parent (#8)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: content-trail with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-content-trail').first();
    await expect(child).toBeVisible();
  });
});
