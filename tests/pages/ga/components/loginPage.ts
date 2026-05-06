import { Page, Locator } from '@playwright/test';

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
  constructor(private page: Page) {}

  getComponentRoot(): Locator {
    return this.page.locator('.cmp-login').first();
  }

  getUsernameInput(): Locator {
    return this.page.locator('input[type="email"], input[type="text"][name*="user" i], #username').first();
  }

  getPasswordInput(): Locator {
    return this.page.locator('input[type="password"], #password').first();
  }

  getLoginButton(): Locator {
    return this.page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Continue")').first();
  }

  getMFAPrompt(): Locator {
    return this.page.locator('[data-testid="mfa-prompt"], .mfa-prompt, .mfa-container').first();
  }

  getMFACodeInput(): Locator {
    return this.page.locator('[data-testid="mfa-code-input"], input[aria-label*="code" i]').first();
  }

  getMFASubmitButton(): Locator {
    return this.page.locator('[data-testid="mfa-submit"], button:has-text("Verify"), button:has-text("Submit")').first();
  }

  getBackupCodeOption(): Locator {
    return this.page.locator('[data-testid="backup-code-option"], button:has-text("Backup"), a:has-text("Backup")').first();
  }

  getBackupCodeInput(): Locator {
    return this.page.locator('[data-testid="backup-code-input"]').first();
  }

  getMFATimeoutMessage(): Locator {
    return this.page.locator('[data-testid="mfa-timeout"], .mfa-timeout').first();
  }

  getRecoveryOption(): Locator {
    return this.page.locator('[data-testid="recovery-option"], button:has-text("Recovery")').first();
  }

  getErrorMessage(): Locator {
    return this.page.locator('[role="alert"], .error-message, .form-error').first();
  }

  async navigate(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username: string, password: string): Promise<void> {
    await this.getUsernameInput().fill(username);
    await this.getPasswordInput().fill(password);
    await this.getLoginButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async enterMFACode(code: string): Promise<void> {
    await this.getMFACodeInput().fill(code);
  }

  async submitMFACode(): Promise<void> {
    await this.getMFASubmitButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async completeMFAFlow(code: string): Promise<void> {
    await this.enterMFACode(code);
    await this.submitMFACode();
  }

  async useBackupCode(): Promise<void> {
    await this.getBackupCodeOption().click();
    await this.getBackupCodeInput().waitFor({ state: 'visible' });
  }

  async enterBackupCode(code: string): Promise<void> {
    await this.getBackupCodeInput().fill(code);
  }

  async accessRecoveryOptions(): Promise<void> {
    await this.getRecoveryOption().click();
  }

  async isMFAPromptVisible(): Promise<boolean> {
    return this.getMFAPrompt().isVisible();
  }

  async getMFATimeoutText(): Promise<string | null> {
    return this.getMFATimeoutMessage().textContent();
  }

  async getErrorMessageText(): Promise<string | null> {
    return this.getErrorMessage().textContent();
  }

  async isLoginSuccessful(): Promise<boolean> {
    const url = this.page.url();
    return !url.includes('login.html');
  }

  async waitForMFAPrompt(): Promise<void> {
    await this.getMFAPrompt().waitFor({ state: 'visible', timeout: 10000 });
  }

  async isVisible(): Promise<boolean> {
    return this.getComponentRoot().isVisible();
  }

  async isLoginButtonDisabled(): Promise<boolean> {
    return this.getLoginButton().isDisabled();
  }
}
