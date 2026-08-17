import { test, expect } from '@playwright/test';
import { setupMocks, clearMocks, MockConfig } from '../../utils/infra/api-mock-helper';
import ENV from '../../utils/infra/env';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
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
    await page.goto(ENV.AEM_AUTHOR_URL + '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled', { waitUntil: 'domcontentloaded' });
    // Component should not crash on API errors
    await expect(page.locator('.button').first()).toBeVisible();
  });

});
