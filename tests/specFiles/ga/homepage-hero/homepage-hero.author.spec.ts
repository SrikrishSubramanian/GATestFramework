import { test, expect } from '@playwright/test';
import { HomepageHeroPage } from '../../../pages/ga/components/homepageHeroPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});

test.describe('Homepage Hero — Happy Path', () => {
  test('[HH-001] @smoke @regression Homepage Hero component renders', async ({ page }) => {
    const pom = new HomepageHeroPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-homepage-hero').first();
    await expect(root).toBeVisible();
  });

  test('[HH-002] @regression Hero background image loads', async ({ page }) => {
    const pom = new HomepageHeroPage(page);
    await pom.navigate(BASE());
    const hero = page.locator('.cmp-homepage-hero__image');
    await expect(hero).toBeVisible();
  });
});

test.describe('Homepage Hero — Responsive', () => {
  test.describe.configure({ retries: 1 });

  test('[HH-006] @mobile @regression Homepage Hero adapts to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const pom = new HomepageHeroPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-homepage-hero').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Homepage Hero — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[HH-010] @a11y @wcag22 @regression Homepage Hero passes axe-core scan', async ({ page }) => {
    const pom = new HomepageHeroPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-homepage-hero')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
