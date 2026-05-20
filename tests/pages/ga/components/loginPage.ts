import { Page, Locator } from '@playwright/test';
<<<<<<< HEAD
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'loginPage.locators.json'));

export class LoginPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
=======

/**
 * Page Object Model for the Login component (including MFA support - GAAM-601)
 *
 * Handles:
 * - Standard login flow (username + password)
 * - Multi-Factor Authentication (MFA) flow
 * - TOTP/SMS OTP entry
 * - Backup code entry
 * - Recovery options
 * 
 
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
>>>>>>> login_page
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

<<<<<<< HEAD
  /** Locator for loginForm */
  get loginForm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.loginForm);
  }

  /** Locator for loginHero */
  get loginHero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.loginHero);
  }

  /** Locator for usernameInput */
  get usernameInput(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.usernameInput);
  }

  /** Locator for passwordInput */
  get passwordInput(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.passwordInput);
  }

  /** Locator for passwordToggle */
  get passwordToggle(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.passwordToggle);
  }

  /** Locator for submitButton */
  get submitButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.submitButton);
  }

  /** Locator for forgotUsernameLink */
  get forgotUsernameLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forgotUsernameLink);
  }

  /** Locator for forgotPasswordLink */
  get forgotPasswordLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forgotPasswordLink);
  }

  /** Locator for alertBanner */
  get alertBanner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.alertBanner);
  }

  /** Locator for assistanceText */
  get assistanceText(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.assistanceText);
  }

  /** Locator for modalForgotUsername */
  get modalForgotUsername(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.modalForgotUsername);
  }

  /** Locator for modalForgotPassword */
  get modalForgotPassword(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.modalForgotPassword);
  }

  /** Locator for modalCloseButton */
  get modalCloseButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.modalCloseButton);
  }

  // --- Actions ---

  /** Click loginForm */
  async clickLoginForm() {
    const el = await this.loginForm;
    await el.click();
  }

  /** Click loginHero */
  async clickLoginHero() {
    const el = await this.loginHero;
    await el.click();
  }

  /** Fill username input */
  async fillUsername(value: string) {
    const el = await this.usernameInput;
    await el.fill(value);
  }

  /** Fill password input */
  async fillPassword(value: string) {
    const el = await this.passwordInput;
    await el.fill(value);
  }

  /** Click submit button */
  async submitForm() {
    const el = await this.submitButton;
    await el.click();
  }

  /** Toggle password visibility */
  async togglePasswordVisibility() {
    const el = await this.passwordToggle;
    await el.click();
  }

  /** Open forgot username modal */
  async openForgotUsernameModal() {
    const el = await this.forgotUsernameLink;
    await el.click();
  }

  /** Open forgot password modal */
  async openForgotPasswordModal() {
    const el = await this.forgotPasswordLink;
    await el.click();
  }

  /** Close modal */
  async closeModal() {
    const el = await this.modalCloseButton;
    await el.click();
  }

  /** Click alertBanner */
  async clickAlertBanner() {
    const el = await this.alertBanner;
    await el.click();
  }

  /** Click assistanceText */
  async clickAssistanceText() {
    const el = await this.assistanceText;
    await el.click();
=======
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
>>>>>>> login_page
  }
}
