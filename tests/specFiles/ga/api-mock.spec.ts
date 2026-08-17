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

