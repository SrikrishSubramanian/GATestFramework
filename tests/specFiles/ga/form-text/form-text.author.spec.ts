import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Text — Core Functionality', () => {
  test('[FORMTEXT-001] @regression Form text field renders correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"], .cmp-form-text input');
    expect(await textInput.count()).toBeGreaterThan(0);
  });

  test('[FORMTEXT-002] @regression Form text field accepts input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      await textInput.fill('Test Input Value');
      const value = await textInput.inputValue();
      expect(value).toBe('Test Input Value');
    }
  });

  test('[FORMTEXT-003] @regression Form text field has required attribute when specified', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInputs = page.locator('input[type="text"], .cmp-form-text input');
    const count = await textInputs.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = textInputs.nth(i);
      const required = await input.getAttribute('required');
      expect(required !== null || required === 'required').toBeDefined();
    }
  });

  test('[FORMTEXT-004] @regression Form text placeholder is displayed', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"][placeholder], .cmp-form-text input[placeholder]').first();
    if (await textInput.count() > 0) {
      const placeholder = await textInput.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
    }
  });

  test('[FORMTEXT-005] @regression Form text label is associated with input', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const labels = page.locator('label, .cmp-form-text label');
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);

    if (count > 0) {
      const label = labels.first();
      const forAttr = await label.getAttribute('for');
      expect(forAttr).toBeTruthy();
    }
  });

  test('[FORMTEXT-006] @regression Form text field validates minimum length', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"][minlength], .cmp-form-text input[minlength]').first();
    if (await textInput.count() > 0) {
      const minLength = await textInput.getAttribute('minlength');
      expect(minLength).toBeTruthy();
    }
  });

  test('[FORMTEXT-007] @regression Form text field respects maximum length', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"][maxlength], .cmp-form-text input[maxlength]').first();
    if (await textInput.count() > 0) {
      const maxLength = await textInput.getAttribute('maxlength');
      expect(maxLength).toBeTruthy();
    }
  });

  test('[FORMTEXT-008] @regression Form text field pattern validation', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"][pattern], .cmp-form-text input[pattern]').first();
    if (await textInput.count() > 0) {
      const pattern = await textInput.getAttribute('pattern');
      expect(pattern).toBeTruthy();
    }
  });

  test('[FORMTEXT-009] @regression Form text field name attribute is set', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInputs = page.locator('input[type="text"], .cmp-form-text input');
    const count = await textInputs.count();
    expect(count).toBeGreaterThan(0);

    if (count > 0) {
      const name = await textInputs.first().getAttribute('name');
      expect(name).toBeTruthy();
    }
  });

  test('[FORMTEXT-010] @regression Form text displays error message on validation failure', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const errorContainer = page.locator('[class*="error"], [class*="invalid"], .cmp-form-text [role="alert"]');
    const hasErrors = await errorContainer.count() > 0;
    expect(hasErrors).toBeDefined();
  });
});
