import { Page } from '@playwright/test';
import fs from 'fs';
import ENV from './env';
import { AUTH_STATE_PATH } from './persistent-context';

/**
 * AEM Author mode authentication fixture.
 * Handles login to AEM author instance for author-mode testing.
 */

export interface AuthOptions {
  authorUrl?: string;
  username?: string;
  password?: string;
  timeout?: number;
}

/**
 * Check if this is a cloud (Adobe IMS) environment vs local AEM SDK.
 * Local environments use localhost URLs; cloud envs use adobeaemcloud.com.
 */
function isCloudEnv(authorUrl: string): boolean {
  return !authorUrl.includes('localhost') && !authorUrl.includes('127.0.0.1');
}

/**
 * Log in to AEM author instance.
 * Uses credentials from environment or explicit options.
 *
 * Supports two login flows:
 * - **Local AEM SDK**: Direct username/password form on the AEM login page.
 * - **Cloud (dev/qa/uat/prod)**: Adobe IMS SSO — "Sign In with Adobe" button →
 *   email field → Continue → password field → submit.
 */
export async function loginToAEMAuthor(page: Page, options?: AuthOptions): Promise<void> {
  const authorUrl = options?.authorUrl || ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
  const username = options?.username || ENV.AEM_AUTHOR_USERNAME || 'admin';
  const password = options?.password || ENV.AEM_AUTHOR_PASSWORD || 'admin';
  const timeout = options?.timeout || 60000;

  // Navigate to login page
  await page.goto(`${authorUrl}/libs/granite/core/content/login.html`, {
    waitUntil: 'domcontentloaded',
    timeout,
  });

  // Check if already logged in — covers direct redirect or active session
  if (isAlreadyLoggedIn(page.url())) {
    return;
  }

  // For cloud envs, the login page might auto-redirect through IMS back to AEM
  // if there's a valid session cookie. Wait briefly to see if that happens.
  if (isCloudEnv(authorUrl)) {
    await page.waitForTimeout(2000);
    if (isAlreadyLoggedIn(page.url())) {
      return;
    }
  }

  if (isCloudEnv(authorUrl)) {
    // Cloud environment: Adobe IMS SSO flow
    await loginViaAdobeIMS(page, username, password, timeout);
  } else {
    // Local AEM SDK: direct login form
    await loginViaLocalAEM(page, username, password, timeout);
  }

  // Wait for redirect after successful login (generous timeout for MFA)
  const mfaTimeout = isCloudEnv(authorUrl) ? 120000 : timeout;
  await page.waitForURL(/\/(aem\/start|sites\.html|welcome)/, { timeout: mfaTimeout });

  // Save auth state immediately after successful login for REUSE_BROWSER
  if (process.env.REUSE_BROWSER === 'true') {
    try {
      const state = await page.context().storageState();
      fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(state, null, 2));
      console.log('Auth state saved to .auth-state.json');
    } catch {
      // Non-fatal — test can still proceed
    }
  }
}

/**
 * Check if the current URL indicates an authenticated AEM session.
 */
function isAlreadyLoggedIn(url: string): boolean {
  return url.includes('/aem/start') ||
    url.includes('/sites.html') ||
    url.includes('/assets.html') ||
    url.includes('/welcome');
}

/**
 * Local AEM SDK login — direct username/password form.
 */
async function loginViaLocalAEM(page: Page, username: string, password: string, timeout: number): Promise<void> {
  const usernameField = page.locator('#username');
  const passwordField = page.locator('#password');
  const submitButton = page.locator('#submit-button');

  await usernameField.fill(username);
  await passwordField.fill(password);
  await submitButton.click();
}

/**
 * Adobe IMS SSO login — used by dev, qa, uat, prod cloud environments.
 * Flow: "Sign In with Adobe" → email → Continue → password → submit.
 */
async function loginViaAdobeIMS(page: Page, email: string, password: string, timeout: number): Promise<void> {
  // Step 1: Click "Sign In with Adobe" button (skip if not present — may have auto-redirected to IMS)
  const signInButton = page.locator('text=Sign In with Adobe').or(page.locator('a[href*="ims"], button:has-text("Sign In")'));
  if (await signInButton.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await signInButton.first().click();
  }

  // Step 2: Wait for Adobe IMS login page and fill email
  const emailField = page.locator('input[name="username"], input[type="email"], #EmailPage-EmailField');
  await emailField.waitFor({ state: 'visible', timeout });
  await emailField.click();
  await emailField.fill('');
  await page.keyboard.type(email, { delay: 50 });

  // Step 3: Wait for the typed value to settle, then click Continue
  await page.waitForTimeout(1000);
  const continueButton = page.locator('button:has-text("Continue"), input[type="submit"][value="Continue"], #EmailPage-ContinueButton');
  await continueButton.first().click();

  // Step 4: Wait for password page and fill password
  const passwordField = page.locator('input[name="password"], input[type="password"], #PasswordPage-PasswordField');
  await passwordField.waitFor({ state: 'visible', timeout });
  await passwordField.fill(password);

  // Step 5: Submit password
  const submitButton = page.locator('button:has-text("Continue"), button:has-text("Sign In"), input[type="submit"], #PasswordPage-ContinueButton');
  await submitButton.first().click();

  // Step 6: Handle Microsoft Authenticator MFA prompt.
  // The page shows a 2-digit number to match on the Authenticator app.
  // Log the number to console so the tester can see it, then wait for approval.
  const mfaPrompt = page.locator('#idRichContext_DisplaySign, [id*="DisplaySign"], text=/Enter the number/i');
  const hasMfa = await mfaPrompt.isVisible({ timeout: 5000 }).catch(() => false);
  if (hasMfa) {
    // Extract the 2-digit number shown on screen
    const numberDisplay = page.locator('#idRichContext_DisplaySign, [id*="DisplaySign"]');
    const mfaNumber = await numberDisplay.textContent().catch(() => '??');
    console.log(`\n🔐 Microsoft Authenticator MFA — approve the number: ${mfaNumber?.trim()}\n`);

    // Wait up to 2 minutes for the user to approve on their phone
    await page.waitForURL((url) => !url.toString().includes('login.microsoftonline.com'), { timeout: 120000 });
  }
}

/**
 * Navigate to a component page in author mode (wcmmode=disabled).
 */
export async function navigateToAuthorPage(
  page: Page,
  componentPath: string,
  options?: AuthOptions
): Promise<void> {
  const authorUrl = options?.authorUrl || ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

  // Ensure logged in first
  if (ENV.GA_AUTH_REQUIRED) {
    await loginToAEMAuthor(page, options);
  }

  // Navigate to the component page with wcmmode=disabled
  const url = `${authorUrl}${componentPath}?wcmmode=disabled`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
}

/**
 * Navigate to a component page in editor mode (full AEM editor).
 */
export async function navigateToEditor(
  page: Page,
  componentPath: string,
  options?: AuthOptions
): Promise<void> {
  const authorUrl = options?.authorUrl || ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

  if (ENV.GA_AUTH_REQUIRED) {
    await loginToAEMAuthor(page, options);
  }

  const url = `${authorUrl}/editor.html${componentPath}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
}

/**
 * Open a component dialog in the AEM editor.
 * Double-clicks the component and waits for the dialog to appear.
 */
export async function openComponentDialog(
  page: Page,
  componentSelector: string
): Promise<void> {
  // In AEM editor, components are wrapped in editables
  const editable = page.locator(`[data-path] ${componentSelector}`).first();
  await editable.dblclick();

  // Wait for dialog to appear
  await page.locator('coral-dialog[open]').waitFor({ state: 'visible', timeout: 10000 });
}

/**
 * Save and close the current AEM component dialog.
 */
export async function saveDialog(page: Page): Promise<void> {
  const doneButton = page.locator('coral-dialog[open] button[is="coral-button"][variant="primary"]');
  await doneButton.click();
  await page.locator('coral-dialog[open]').waitFor({ state: 'hidden', timeout: 10000 });
}

/**
 * Close the current AEM dialog without saving.
 */
export async function cancelDialog(page: Page): Promise<void> {
  const cancelButton = page.locator('coral-dialog[open] button[is="coral-button"][variant="default"]');
  await cancelButton.click();
  await page.locator('coral-dialog[open]').waitFor({ state: 'hidden', timeout: 10000 });
}

/**
 * Check if we're currently in AEM editor mode.
 */
export async function isEditorMode(page: Page): Promise<boolean> {
  return page.url().includes('/editor.html/');
}

/**
 * Check if we're in wcmmode=disabled (preview/publish simulation).
 */
export async function isPreviewMode(page: Page): Promise<boolean> {
  return page.url().includes('wcmmode=disabled');
}
