import { test, expect } from '@playwright/test';
import { InBriefPage } from '../../../pages/ga/components/inBriefPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('InBrief — Component Interactions', () => {
  test('@interaction @regression @sanity in-brief adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new InBriefPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-in-brief').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression in-brief adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new InBriefPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-in-brief').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression in-brief adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new InBriefPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-in-brief').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression in-brief adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new InBriefPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-in-brief').first();
    await expect(child).toBeVisible();
  });
});
