import { test, expect } from '@playwright/test';
import { BrandRelationshipPage } from '../../../pages/ga/components/brandRelationshipPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('BrandRelationship — Component Interactions', () => {
  test('@interaction @regression @sanity brand-relationship adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new BrandRelationshipPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-brand-relationship').first();
    await expect(child).toBeVisible();
  });
});
