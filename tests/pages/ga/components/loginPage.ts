import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'loginPage.locators.json'));

export class LoginPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

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
  }
}
