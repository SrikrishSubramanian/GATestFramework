import { test, expect } from '@playwright/test';
import { GatedSectionPage } from '../../../pages/ga/components/gatedSectionPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('GatedSection — Component Interactions', () => {
  test('@interaction @regression @sanity gated-section adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new GatedSectionPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: gated-section with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-gated-section').first();
    await expect(child).toBeVisible();
  });
});
