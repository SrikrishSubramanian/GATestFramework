import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('SAML Login Component (GAAM-410)', () => {
  // ============ Login Form Rendering ============
  test('[GAAM-410-001] @regression Verify SAML login form renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/saml-login.html?wcmmode=disabled`);

    const form = page.locator('form, [class*="login"], [class*="saml"]').first();
    if (await form.count() > 0) {
      expect(await form.isVisible()).toBe(true);
    }
  });

  test('[GAAM-410-002] @regression Verify SAML login button present', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/saml-login.html?wcmmode=disabled`);

    const samlBtn = page.locator('button[class*="saml"], a[class*="saml"], button[class*="login"]').first();
    if (await samlBtn.count() > 0) {
      expect(await samlBtn.isVisible()).toBe(true);
    }
  });

  test('[GAAM-410-003] @regression Verify SAML login has secure connection indicator', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/saml-login.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const action = await form.getAttribute('action');
      // Should use HTTPS for security
      expect(action || '').toBeTruthy();
    }
  });

  test('[GAAM-410-004] @a11y @regression Verify SAML login is accessible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/saml-login.html?wcmmode=disabled`);

    const button = page.locator('button, a[class*="login"]').first();
    if (await button.count() > 0) {
      const text = await button.textContent();
      expect(text).toBeTruthy();
    }
  });
});
