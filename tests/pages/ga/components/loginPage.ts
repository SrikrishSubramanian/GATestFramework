import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../../locators/loginPage.locators.json'));

/**
 * Page Object Model for the Login component (including MFA support - GAAM-601).
 */
export class LoginPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

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

  get loginForm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.loginForm);
  }

  get loginHero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.loginHero);
  }

  get usernameInput(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.usernameInput);
  }

  get passwordInput(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.passwordInput);
  }

  get passwordToggle(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.passwordToggle);
  }

  get submitButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.submitButton);
  }

  get forgotUsernameLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forgotUsernameLink);
  }

  get forgotPasswordLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forgotPasswordLink);
  }

  get alertBanner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.alertBanner);
  }

  get assistanceText(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.assistanceText);
  }

  get modalForgotUsername(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.modalForgotUsername);
  }

  get modalForgotPassword(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.modalForgotPassword);
  }

  get modalCloseButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.modalCloseButton);
  }

  async clickLoginForm(): Promise<void> {
    const el = await this.loginForm;
    await el.click();
  }

  async clickLoginHero(): Promise<void> {
    const el = await this.loginHero;
    await el.click();
  }

  async fillUsername(value: string): Promise<void> {
    const el = await this.usernameInput;
    await el.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    const el = await this.passwordInput;
    await el.fill(value);
  }

  async submitForm(): Promise<void> {
    const el = await this.submitButton;
    await el.click();
  }

  async togglePasswordVisibility(): Promise<void> {
    const el = await this.passwordToggle;
    await el.click();
  }

  async openForgotUsernameModal(): Promise<void> {
    const el = await this.forgotUsernameLink;
    await el.click();
  }

  async openForgotPasswordModal(): Promise<void> {
    const el = await this.forgotPasswordLink;
    await el.click();
  }

  async closeModal(): Promise<void> {
    const el = await this.modalCloseButton;
    await el.click();
  }

  async clickAlertBanner(): Promise<void> {
    const el = await this.alertBanner;
    await el.click();
  }

  async clickAssistanceText(): Promise<void> {
    const el = await this.assistanceText;
    await el.click();
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
    return !this.page.url().includes('login.html');
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
