import { test, expect } from '@playwright/test';
import { SectionPage } from '../../../pages/ga/components/sectionPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Section — Happy Path', () => {
  test('[SEC-001] @smoke @regression Section component renders', async ({ page }) => {
    const pom = new SectionPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-section').first();
    await expect(root).toBeVisible();
  });

  test('[SEC-002] @regression Section content is accessible', async ({ page }) => {
    const pom = new SectionPage(page);
    await pom.navigate(BASE());
    const content = page.locator('.cmp-section__content');
    await expect(content).toBeVisible();
  });
});

test.describe('Section — Responsive', () => {
  test.describe.configure({ retries: 1 });

  test('[SEC-006] @mobile @regression Section adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const pom = new SectionPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-section').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Section — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[SEC-010] @a11y @wcag22 @regression Section passes axe-core scan', async ({ page }) => {
    const pom = new SectionPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-section')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
