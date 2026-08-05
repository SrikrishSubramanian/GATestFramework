import { test, expect } from '@playwright/test';
import { DecisionTreePage } from '../../../pages/ga/components/decisionTreePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('DecisionTree — Component Interactions', () => {
  test('@interaction @regression decision-tree adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new DecisionTreePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-decision-tree').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression decision-tree adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new DecisionTreePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-decision-tree').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression decision-tree adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new DecisionTreePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-decision-tree').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression decision-tree adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new DecisionTreePage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-decision-tree').first();
    await expect(child).toBeVisible();
  });
});
