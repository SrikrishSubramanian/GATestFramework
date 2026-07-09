/**
 * EXAMPLE: How to restructure a component POM using BaseComponent and shared locators.
 *
 * This file shows the pattern for all new and refactored component POMs.
 * Replace <ComponentName> and file paths with your component details.
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { CommonLocators, FormElementLocators, SharedLocatorGroups } from './SharedLocators';
import path from 'path';

export class ButtonPageExample extends BaseComponent {
  constructor(page: Page) {
    super(page);

    // Load component-specific locators
    this.loadComponentLocators('button', path.join(__dirname, '../locators/buttonPage.locators.json'));

    // Load shared locator groups this component uses
    this.loadSharedLocators(SharedLocatorGroups.COMMON);
    this.loadSharedLocators(SharedLocatorGroups.FORM_ELEMENTS);
  }

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  // --- Component-Specific Locators ---

  /** Custom getter that uses component-specific locator OR falls back to shared primary button */
  get buttonElement(): Promise<Locator | null> {
    return this.getLocator('a_Button') || this.getLocator(CommonLocators.PRIMARY_BUTTON, SharedLocatorGroups.COMMON);
  }

  get learnMoreButton(): Promise<Locator | null> {
    return this.getLocator('a_LearnMore');
  }

  get closeIcon(): Promise<Locator | null> {
    return this.getLocator(CommonLocators.CLOSE_ICON, SharedLocatorGroups.COMMON);
  }

  // --- Reusable Actions ---

  /**
   * Click the main button (demonstrates fallback to shared locators).
   * If component has a_Button, use it. Otherwise, try the shared primaryButton.
   */
  async clickMainButton() {
    const locator = await this.buttonElement;
    if (locator) {
      await locator.click();
    } else {
      // Fallback to shared primary button
      await this.click(CommonLocators.PRIMARY_BUTTON, SharedLocatorGroups.COMMON);
    }
  }

  /**
   * Click close icon (uses shared locator).
   */
  async clickClose() {
    await this.click(CommonLocators.CLOSE_ICON, SharedLocatorGroups.COMMON);
  }

  /**
   * Verify button is visible.
   */
  async isButtonVisible(): Promise<boolean> {
    return this.isVisible('a_Button') || this.isVisible(CommonLocators.PRIMARY_BUTTON, SharedLocatorGroups.COMMON);
  }

  /**
   * Get button text (demonstrates reuse of common getText action).
   */
  async getButtonText(): Promise<string> {
    return this.getText('a_Button');
  }

  /**
   * Verify button is enabled.
   */
  async isButtonEnabled(): Promise<boolean> {
    return this.isEnabled('a_Button');
  }
}

/**
 * MIGRATION GUIDE:
 *
 * 1. Change: class ButtonPage extends BaseComponent
 *    From:  class ButtonPage
 *
 * 2. Update constructor:
 *    this.loadComponentLocators('button', path.join(__dirname, '../locators/buttonPage.locators.json'));
 *    this.loadSharedLocators(SharedLocatorGroups.COMMON);
 *
 * 3. Replace manual locator resolution:
 *    OLD: return resolveLocator(this.page, registry.entries.a_Button);
 *    NEW: return this.getLocator('a_Button');
 *    NEW: return this.getLocator(CommonLocators.PRIMARY_BUTTON, SharedLocatorGroups.COMMON);
 *
 * 4. Use inherited action methods:
 *    OLD: const el = await this.a_Button; await el.click();
 *    NEW: await this.click('a_Button');
 *
 * 5. Combine with shared locators for common elements:
 *    OLD: Create component-specific closeButton locator
 *    NEW: await this.click(CommonLocators.CLOSE_BUTTON, SharedLocatorGroups.COMMON);
 *
 * BENEFITS:
 * - Automatic fallback to shared locators (DRY principle)
 * - Built-in common actions (click, fill, type, etc.)
 * - Consistent error handling and logging
 * - Easier test maintenance and debugging
 * - Reuse across components without code duplication
 */
