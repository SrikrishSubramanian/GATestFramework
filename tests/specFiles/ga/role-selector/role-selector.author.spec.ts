import { test, expect } from '@playwright/test';
import { RoleSelectorPage } from '../../../pages/ga/components/roleSelectorPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Role Selector — Happy Path', () => {
  test('[RS-001] @smoke @regression Role Selector renders', async ({ page }) => {
    const pom = new RoleSelectorPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-role-selector').first();
    await expect(root).toBeVisible();
  });

  test('[RS-002] @regression Role options are selectable', async ({ page }) => {
    const pom = new RoleSelectorPage(page);
    await pom.navigate(BASE());
    const options = page.locator('.cmp-role-selector__option');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Role Selector — Interaction', () => {
  test('[RS-005] @interaction @regression Role selection changes content', async ({ page }) => {
    const pom = new RoleSelectorPage(page);
    await pom.navigate(BASE());
    const options = page.locator('.cmp-role-selector__option');
    if (await options.count() > 0) {
      await options.first().click();
      await expect(options.first()).toHaveClass(/selected/);
    }
  });
});

test.describe('Role Selector — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[RS-010] @a11y @wcag22 @regression Role Selector passes axe-core scan', async ({ page }) => {
    const pom = new RoleSelectorPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-role-selector')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
