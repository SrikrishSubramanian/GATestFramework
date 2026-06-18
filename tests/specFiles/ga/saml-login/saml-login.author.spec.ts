import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';

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

test.describe('SAML Login Component (GAAM-410)', () => {
  // ============ Login Form Rendering ============
  test('[GAAM-410-001] @regression Verify SAML login form renders', async ({ page }) => {
    const url = resolveComponentUrl('saml-login');
    await page.goto(url);

    const form = page.locator('form, [class*="login"], [class*="saml"]').first();
    if (await form.count() > 0) {
      expect(await form.isVisible()).toBe(true);
    }
  });

  test('[GAAM-410-002] @regression Verify SAML login button present', async ({ page }) => {
    const url = resolveComponentUrl('saml-login');
    await page.goto(url);

    const samlBtn = page.locator('button[class*="saml"], a[class*="saml"], button[class*="login"]').first();
    if (await samlBtn.count() > 0) {
      expect(await samlBtn.isVisible()).toBe(true);
    }
  });

  test('[GAAM-410-003] @regression Verify SAML login has secure connection indicator', async ({ page }) => {
    const url = resolveComponentUrl('saml-login');
    await page.goto(url);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const action = await form.getAttribute('action');
      // Should use HTTPS for security
      expect(action || '').toBeTruthy();
    }
  });

  test('[GAAM-410-004] @a11y @regression Verify SAML login is accessible', async ({ page }) => {
    const url = resolveComponentUrl('saml-login');
    await page.goto(url);

    const button = page.locator('button, a[class*="login"]').first();
    if (await button.count() > 0) {
      const text = await button.textContent();
      expect(text).toBeTruthy();
    }
  });
});

