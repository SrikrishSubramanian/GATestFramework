import { test, expect } from '@playwright/test';
import { TopNavPage } from '../../../pages/ga/components/topNavPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Top Nav — Happy Path', () => {
  test('[TN-001] @smoke @regression Top Navigation renders', async ({ page }) => {
    const pom = new TopNavPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-top-nav').first();
    await expect(root).toBeVisible();
  });

  test('[TN-002] @regression Navigation items are visible', async ({ page }) => {
    const pom = new TopNavPage(page);
    await pom.navigate(BASE());
    const items = page.locator('.cmp-top-nav__item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Top Nav — Interaction', () => {
  test('[TN-005] @interaction @regression Top nav items are clickable', async ({ page }) => {
    const pom = new TopNavPage(page);
    await pom.navigate(BASE());
    const items = page.locator('.cmp-top-nav__item');
    if (await items.count() > 0) {
      await expect(items.first()).toBeEnabled();
    }
  });
});

test.describe('Top Nav — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[TN-010] @a11y @wcag22 @regression Top Nav passes axe-core scan', async ({ page }) => {
    const pom = new TopNavPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-top-nav')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
