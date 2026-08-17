import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { test, expect } from '@playwright/test';
import { setupMocks, clearMocks, MockConfig } from '../../../utils/infra/api-mock-helper';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';

let capture: ConsoleCapture;

test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await loginToAEMAuthor(page);
  }
  capture = new ConsoleCapture(page);
  capture.start();
});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
  await clearMocks(page);
});

test.describe('API Mocking — Error States', () => {
  test('@regression Component handles empty API response', async ({ page }) => {
    const mocks: MockConfig[] = [{
      urlPattern: '**/api/**',
      scenario: 'empty',
      component: 'button',
    }];
    await setupMocks(page, mocks);
    await page.goto(ENV.AEM_AUTHOR_URL + '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled', { waitUntil: 'domcontentloaded' });
    // Component should handle empty state
    await expect(page.locator('.button').first()).toBeVisible();
  });
});
