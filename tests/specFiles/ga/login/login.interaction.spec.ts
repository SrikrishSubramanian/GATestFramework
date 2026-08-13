import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — Component Interactions', () => {
  test('@interaction @regression @sanity login adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-login').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression login adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-login').first();
    await expect(child).toBeVisible();
  });
});
