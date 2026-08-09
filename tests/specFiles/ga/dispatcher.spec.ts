import { test, expect } from '@playwright/test';
import { testDispatcherCache } from '../../utils/generation/dispatcher-tester';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('Dispatcher Cache Tests — dev', () => {
});
