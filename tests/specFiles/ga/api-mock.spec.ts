import { test, expect } from '@playwright/test';
import { setupMocks, clearMocks, MockConfig } from '../../utils/api-mock-helper';
import ENV from '../../utils/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(`${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.afterEach(async ({ page }) => {
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
