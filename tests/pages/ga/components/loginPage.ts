import { Page, Locator } from '@playwright/test';
import { getLocator } from '../../../src/utils/locator-utils';
import { resolveComponentUrl } from '../../utils/infra/content-fixture-deployer';
import locators from './loginPage.locators.json';

/**
 * Page Object Model for the Login component (including MFA support - GAAM-601)
 *
 * Handles:
 * - Standard login flow (username + password)
 * - Multi-Factor Authentication (MFA) flow
 * - TOTP/SMS OTP entry
 * - Backup code entry
 * - Recovery options
 */
export class LoginPage {
  readonly page: Page;
  readonly componentRoot: Locator;

  // Standard login form
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // MFA form elements
  readonly mfaPrompt: Locator;
  readonly mfaCodeInput: Locator;
  readonly mfaSubmitButton: Locator;
  readonly backupCodeOption: Locator;
  readonly backupCodeInput: Locator;
  readonly mfaTimeoutMessage: Locator;
  readonly recoveryOption: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Root selector for login component
    this.componentRoot = getLocator(page, '.cmp-login', locators);

    // Standard login form locators
    this.usernameInput = getLocator(page, '#username', locators);
    this.passwordInput = getLocator(page, '#password', locators);
    this.loginButton = getLocator(page, '[type="submit"]', locators);

    // MFA form locators
    this.mfaPrompt = getLocator(page, '[data-testid="mfa-prompt"]', locators);
    this.mfaCodeInput = getLocator(page, '[data-testid="mfa-code-input"]', locators);
    this.mfaSubmitButton = getLocator(page, '[data-testid="mfa-submit"]', locators);
    this.backupCodeOption = getLocator(page, '[data-testid="backup-code-option"]', locators);
    this.backupCodeInput = getLocator(page, '[data-testid="backup-code-input"]', locators);
    this.mfaTimeoutMessage = getLocator(page, '[data-testid="mfa-timeout"]', locators);
    this.recoveryOption = getLocator(page, '[data-testid="recovery-option"]', locators);
    this.errorMessage = getLocator(page, '[role="alert"]', locators);
  }

  /**
   * Navigate to the login page
   */
  async navigate(styleGuide: boolean = false): Promise<void> {
    if (styleGuide) {
      const url = resolveComponentUrl('login');
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } else {
      // Direct AEM author login URL
      await this.page.goto('/libs/granite/core/content/login.html', { waitUntil: 'domcontentloaded' });
    }
  }

  /**
   * Perform standard login (username + password)
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Enter MFA code (TOTP or SMS OTP)
   */
  async enterMFACode(code: string): Promise<void> {
    await this.mfaCodeInput.fill(code);
    await this.mfaCodeInput.evaluate((el: HTMLInputElement) => {
      // Mask characters after input
      el.type = 'password';
    });
  }

  /**
   * Submit MFA code
   */
  async submitMFACode(): Promise<void> {
    await this.mfaSubmitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Complete MFA flow (enter and submit code)
   */
  async completeMFAFlow(code: string): Promise<void> {
    await this.enterMFACode(code);
    await this.submitMFACode();
  }

  /**
   * Switch to backup code entry mode
   */
  async useBackupCode(): Promise<void> {
    await this.backupCodeOption.click();
    await this.backupCodeInput.waitFor({ state: 'visible' });
  }

  /**
   * Enter backup code
   */
  async enterBackupCode(code: string): Promise<void> {
    await this.backupCodeInput.fill(code);
  }

  /**
   * Access recovery options
   */
  async accessRecoveryOptions(): Promise<void> {
    await this.recoveryOption.click();
  }

  /**
   * Check if MFA prompt is visible
   */
  async isMFAPromptVisible(): Promise<boolean> {
    return this.mfaPrompt.isVisible();
  }

  /**
   * Get MFA timeout message text
   */
  async getMFATimeoutMessage(): Promise<string | null> {
    return this.mfaTimeoutMessage.textContent();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  /**
   * Verify login success (redirect check)
   */
  async isLoginSuccessful(): Promise<boolean> {
    // Check if we're no longer on login page
    const url = this.page.url();
    return !url.includes('login.html');
  }

  /**
   * Wait for MFA prompt to appear
   */
  async waitForMFAPrompt(): Promise<void> {
    await this.mfaPrompt.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check component root visibility
   */
  async isVisible(): Promise<boolean> {
    return this.componentRoot.isVisible();
  }

  /**
   * Get login button state (disabled/enabled)
   */
  async isLoginButtonDisabled(): Promise<boolean> {
    return this.loginButton.isDisabled();
  }
}
