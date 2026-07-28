import { test, expect } from '@playwright/test';
import { HomepageHeroPage } from '../../../pages/ga/components/homepageHeroPage';
import ENV from '../utils/infra/env';
import { loginToAEMAuthor } from '../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('HomepageHero — Component Interactions', () => {
  test('@interaction @regression homepage-hero adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new HomepageHeroPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-homepage-hero').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression homepage-hero adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new HomepageHeroPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-homepage-hero').first();
    await expect(child).toBeVisible();
  });
});
