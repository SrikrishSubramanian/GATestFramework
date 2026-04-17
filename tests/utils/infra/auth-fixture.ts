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

  // Fast path: if globalSetup already saved auth cookies, they're loaded via storageState
  // in the project config. Just verify the session is valid with a lightweight check.
  const cookies = await page.context().cookies(authorUrl);
  const hasLoginToken = cookies.some(c => c.name === 'login-token' || c.name === 'JSESSIONID');
  if (hasLoginToken) {
    // Cookies present from globalSetup — verify they work with a quick request
    try {
      const resp = await page.request.get(`${authorUrl}/libs/granite/core/content/login.html`, {
        maxRedirects: 0,
      });
      // 302 redirect means authenticated, 200 means login page (session expired)
      if (resp.status() === 302 || resp.status() === 303) {
        return; // Session valid — skip full login
      }
    } catch {
      // Fall through to full login
    }
  }

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

  // Wait for redirect after successful login.
  // For cloud environments, Microsoft may show post-login interstitials
  // ("Stay signed in?", "Protect your account", MFA registration upsell)
  // that block the redirect to AEM. Poll and dismiss them.
  const mfaTimeout = isCloudEnv(authorUrl) ? 120000 : timeout;
  const deadline = Date.now() + mfaTimeout;

  while (Date.now() < deadline) {
    const url = page.url();

    // Success — we've reached AEM
    if (/\/(aem\/start|sites\.html|welcome)/.test(url)) {
      break;
    }

    // While on login.microsoftonline.com, MFA is still in progress —
    // do NOT click anything; let the user complete it in headed mode.
    if (url.includes('login.microsoftonline.com')) {
      await page.waitForTimeout(3000);
      continue;
    }

    // Post-MFA interstitial handling (mysignins.microsoft.com, etc.)
    if (url.includes('microsoftonline.com') || url.includes('mysignins.microsoft.com')) {
      // "Stay signed in?" prompt
      const staySignedIn = page.locator('#idSIButton9');
      if (await staySignedIn.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('[auth] Dismissing "Stay signed in?" prompt');
        await staySignedIn.click();
        await page.waitForTimeout(2000);
        continue;
      }

      // "Protect your account" / AppUpsell — skip or cancel
      const skipOrCancel = page.locator('a:has-text("Skip for now"), button:has-text("Skip for now"), a:has-text("Skip"), button:has-text("Ask later")');
      if (await skipOrCancel.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('[auth] Dismissing Microsoft interstitial (skip/cancel)');
        await skipOrCancel.first().click();
        await page.waitForTimeout(2000);
        continue;
      }

      // "Next" button on interstitial pages (may lead to skip on next page)
      const nextBtn = page.locator('button:has-text("Next"), input[type="submit"][value="Next"]');
      if (await nextBtn.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('[auth] Clicking "Next" on Microsoft interstitial');
        await nextBtn.first().click();
        await page.waitForTimeout(2000);
        continue;
      }
    }

    // Not on AEM yet, not a recognized interstitial — wait and retry
    await page.waitForTimeout(2000);
  }

  // Final check — if we never reached AEM, throw
  if (!/\/(aem\/start|sites\.html|welcome)/.test(page.url())) {
    throw new Error(`Auth flow did not reach AEM. Final URL: ${page.url()}`);
  }

  // Save auth state after successful login so subsequent runs (and globalSetup)
  // can reuse the session without repeating MFA.
  try {
    const state = await page.context().storageState();
    fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(state, null, 2));
    console.log('[auth] Auth state saved to .auth-state.json');
  } catch {
    // Non-fatal — test can still proceed
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

  // Step 3b: Handle account-type disambiguation.
  // Adobe IMS shows "Select an account" with "Personal Account" vs "Company or School Account".
  // Microsoft shows a similar picker with "Work or school account". Target the
  // clickable tile (button/anchor/role=button) rather than any parent div.
  const workAccountOption = page.locator('button, a, [role="button"]').filter({
    hasText: /company or school account|work or school account/i,
  }).first();
  try {
    await workAccountOption.waitFor({ state: 'visible', timeout: 10000 });
    console.log('[auth] Selecting "Company or School Account"');
    await workAccountOption.click();
    await page.waitForTimeout(1500);
  } catch {
    // No disambiguation page shown — may have skipped straight to password/FIDO.
    // Try legacy Microsoft tile as a last-ditch fallback.
    const legacyTile = page.locator('#aadTile, #aadTileTitle').first();
    if (await legacyTile.isVisible().catch(() => false)) {
      console.log('[auth] Selecting legacy "Work or school account" tile');
      await legacyTile.click();
      await page.waitForTimeout(1500);
    }
  }

  // Step 3c: Handle FIDO / passkey prompt by switching to password sign-in.
  // Microsoft may redirect to a passwordless/FIDO page (.../fido/get) before
  // showing the password field. Try several selectors, then fall back to
  // waiting for the tester to click it manually in headed mode.
  if (page.url().includes('/fido/')) {
    const useOtherMethodButton = page.locator(
      '#signInAnotherWay, #signInAnotherWayLink, [data-testid*="other"], a:has-text("Use my password"), a:has-text("Use your password"), a:has-text("Sign-in options"), button:has-text("Sign-in options"), a:has-text("Other ways to sign in"), button:has-text("Other ways to sign in"), a:has-text("Use password"), a[href*="challenge/Password"]'
    ).first();
    if (await useOtherMethodButton.isVisible({ timeout: 8000 }).catch(() => false)) {
      console.log('[auth] FIDO prompt detected — switching to password sign-in');
      await useOtherMethodButton.click();
      const passwordTile = page.locator(
        '[data-value="Password"], div[role="button"]:has-text("Password"), button:has-text("Password"), a:has-text("Password")'
      ).first();
      if (await passwordTile.isVisible({ timeout: 5000 }).catch(() => false)) {
        await passwordTile.click();
      }
      await page.waitForTimeout(1500);
    } else {
      console.log('\n🔐 FIDO / passkey prompt shown. In the browser, click "Sign-in options" → "Password" to continue. Waiting up to 3 minutes…\n');
    }
  }

  // Step 4: Race the password field against an already-authenticated redirect.
  // If Adobe IMS / Microsoft has a valid SSO session, the page lands on AEM
  // directly after email submission — no password prompt is shown. In that
  // case, skip the password + submit steps.
  const passwordField = page.locator(
    'input[name="password"]:not([aria-hidden="true"]), input[type="password"]:not([aria-hidden="true"]):not([tabindex="-1"]), #PasswordPage-PasswordField, #i0118'
  );
  const passwordTimeout = page.url().includes('/fido/') ? 180000 : timeout;
  const ssoAlreadyAuthenticated = page.waitForURL(
    (url) => /\/(aem\/start|sites\.html|welcome|projects\.html)/.test(url.toString()),
    { timeout: passwordTimeout }
  ).then(() => 'sso').catch(() => null);
  const passwordPrompt = passwordField.waitFor({ state: 'visible', timeout: passwordTimeout })
    .then(() => 'password').catch(() => null);

  const winner = await Promise.race([ssoAlreadyAuthenticated, passwordPrompt]);
  if (winner === 'sso') {
    console.log('[auth] SSO session active — skipped password prompt');
    return;
  }

  await passwordField.fill(password);

  // Step 5: Submit password
  const submitButton = page.locator('button:has-text("Continue"), button:has-text("Sign In"), input[type="submit"], #PasswordPage-ContinueButton');
  await submitButton.first().click();

  // Step 6: Handle Microsoft MFA.
  // Supports both push-notification (number matching) and TOTP (enter code) flows.
  // In headed mode the tester can interact manually; in headless the TOTP code entry
  // will time out (run --headed for first login).
  const mfaNumberPrompt = page.locator('#idRichContext_DisplaySign, [id*="DisplaySign"], text=/Enter the number/i');
  const mfaCodePrompt = page.locator('input#idTxtBx_SAOTCC_OTC, input[name="otc"], text=/Enter the code/i');
  const hasPushMfa = await mfaNumberPrompt.isVisible({ timeout: 5000 }).catch(() => false);
  const hasCodeMfa = !hasPushMfa && await mfaCodePrompt.isVisible({ timeout: 3000 }).catch(() => false);

  if (hasPushMfa) {
    const numberDisplay = page.locator('#idRichContext_DisplaySign, [id*="DisplaySign"]');
    const mfaNumber = await numberDisplay.textContent().catch(() => '??');
    console.log(`\n🔐 Microsoft Authenticator MFA — approve the number: ${mfaNumber?.trim()}\n`);
    await page.waitForURL((url) => !url.toString().includes('login.microsoftonline.com'), { timeout: 120000 });
  } else if (hasCodeMfa) {
    console.log('\n🔐 Microsoft Authenticator MFA — enter the TOTP code in the browser window\n');
    await page.waitForURL((url) => !url.toString().includes('login.microsoftonline.com'), { timeout: 120000 });
  }

  // Post-login interstitials are handled by the polling loop in loginToAEMAuthor.
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
