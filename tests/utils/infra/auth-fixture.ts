import { Page } from '@playwright/test';
import ENV from './env';

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
 * Log in to AEM author instance.
 * Uses credentials from environment or explicit options.
 */
export async function loginToAEMAuthor(page: Page, options?: AuthOptions): Promise<void> {
  const authorUrl = options?.authorUrl || ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
  const username = options?.username || ENV.AEM_AUTHOR_USERNAME || 'admin';
  const password = options?.password || ENV.AEM_AUTHOR_PASSWORD || 'admin';
  const timeout = options?.timeout || 30000;

  // Navigate to login page
  await page.goto(`${authorUrl}/libs/granite/core/content/login.html`, {
    waitUntil: 'domcontentloaded',
    timeout,
  });

  // Check if already logged in (redirected to welcome page)
  if (page.url().includes('/aem/start') || page.url().includes('/sites.html')) {
    return; // Already authenticated
  }

  // Fill credentials
  const usernameField = page.locator('#username');
  const passwordField = page.locator('#password');
  const submitButton = page.locator('#submit-button');

  await usernameField.fill(username);
  await passwordField.fill(password);
  await submitButton.click();

  // Wait for redirect after successful login
  await page.waitForURL(/\/(aem\/start|sites\.html|welcome)/, { timeout });
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
