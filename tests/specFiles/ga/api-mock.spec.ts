import { resolveComponentUrl } from '../../utils/infra/content-fixture-deployer';
import { test, expect } from '@playwright/test';
import { setupMocks, clearMocks, MockConfig } from '../../utils/infra/api-mock-helper';
import ENV from '../../utils/infra/env';
import { ConsoleCapture } from '../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../utils/infra/report-enhancer';

let capture: ConsoleCapture;

test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await loginToAEMAuthor(page);
  }
  capture = new ConsoleCapture(page);
  capture.start();
});

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
  await clearMocks(page);
});

test.describe('API Mocking — Error States', () => {
  test('@regression Component handles API error gracefully', async ({ page }) => {
    const mocks: MockConfig[] = [{
      urlPattern: '**/api/**',
      scenario: 'error',
      component: 'button',
      status: 500,
    }];
    await setupMocks(page, mocks);
    await page.goto(ENV.AEM_AUTHOR_URL + '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled');
    await page.waitForLoadState('networkidle');
    // Component should not crash on API errors
    await expect(page.locator('.button').first()).toBeVisible();
  });

  test('@regression Component handles empty API response', async ({ page }) => {
    const mocks: MockConfig[] = [{
      urlPattern: '**/api/**',
      scenario: 'empty',
      component: 'button',
    }];
    await setupMocks(page, mocks);
    await page.goto(ENV.AEM_AUTHOR_URL + '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled');
    await page.waitForLoadState('networkidle');
    // Component should handle empty state
    await expect(page.locator('.button').first()).toBeVisible();
  });
});
