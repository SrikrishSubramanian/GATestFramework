import { test, expect } from '@playwright/test';
import { VideoExternalPage } from '../../../pages/ga/components/videoExternalPage';
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

test.describe('Video External — Happy Path', () => {
  test('[VE-001] @smoke @regression External Video renders', async ({ page }) => {
    const pom = new VideoExternalPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-video-external').first();
    await expect(root).toBeVisible();
  });

  test('[VE-002] @regression Video container is present', async ({ page }) => {
    const pom = new VideoExternalPage(page);
    await pom.navigate(BASE());
    const container = page.locator('.cmp-video-external__container');
    await expect(container).toBeVisible();
  });
});

test.describe('Video External — Responsive', () => {
  test.describe.configure({ retries: 1 });

  test('[VE-006] @mobile @regression Video adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const pom = new VideoExternalPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-video-external').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Video External — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[VE-010] @a11y @wcag22 @regression Video passes axe-core scan', async ({ page }) => {
    const pom = new VideoExternalPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-video-external')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
