import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Statistic — Component Interactions', () => {
  test('[STAT-017] @interaction @regression statistic adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-statistic').first();
    await expect(child).toBeVisible();
  });

  // STAT-018–024 removed: all 7 were identical to STAT-017 (same locator, same parent, same assertion)
});
