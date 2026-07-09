import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../../utils/infra/locator-registry';
import path from 'path';

/**
 * BaseComponent provides shared functionality for all component POMs.
 * Automatically falls back to shared locators if component-specific ones don't exist.
 */
export class BaseComponent {
  protected page: Page;
  protected componentRegistry: any;
  protected sharedRegistry: Map<string, any> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Load component-specific locators from JSON file.
   * @param componentName The component name (e.g., 'button', 'accordion')
   * @param locatorsPath Path to the locators JSON file
   */
  protected loadComponentLocators(componentName: string, locatorsPath: string) {
    try {
      this.componentRegistry = loadLocators(locatorsPath);
    } catch (e) {
      console.warn(`Failed to load locators for ${componentName}:`, e);
      this.componentRegistry = { entries: {} };
    }
  }

  /**
   * Load shared locators from a specific shared locator file.
   * @param locatorType The type of shared locators (e.g., 'common', 'form-elements')
   */
  protected loadSharedLocators(locatorType: string) {
    try {
      const sharedPath = path.join(__dirname, `../locators/shared/${locatorType}.locators.json`);
      const registry = loadLocators(sharedPath);
      this.sharedRegistry.set(locatorType, registry);
    } catch (e) {
      console.warn(`Failed to load shared locators (${locatorType}):`, e);
    }
  }

  /**
   * Get a locator, trying component-specific first, then shared locators.
   * @param locatorName The name of the locator to resolve
   * @param sharedGroup Optional: specific shared locator group to check
   * @returns Promise<Locator> or null if not found
   */
  protected async getLocator(locatorName: string, sharedGroup?: string): Promise<Locator | null> {
    // Try component-specific locator first
    if (this.componentRegistry?.entries?.[locatorName]) {
      return resolveLocator(this.page, this.componentRegistry.entries[locatorName]);
    }

    // Try shared locators
    if (sharedGroup) {
      const shared = this.sharedRegistry.get(sharedGroup);
      if (shared?.entries?.[locatorName]) {
        return resolveLocator(this.page, shared.entries[locatorName]);
      }
    } else {
      // Try all shared registries
      for (const [, shared] of this.sharedRegistry) {
        if (shared?.entries?.[locatorName]) {
          return resolveLocator(this.page, shared.entries[locatorName]);
        }
      }
    }

    return null;
  }

  /**
   * Get locator and throw if not found.
   * @param locatorName The name of the locator
   * @param sharedGroup Optional: specific shared locator group
   */
  protected async requireLocator(locatorName: string, sharedGroup?: string): Promise<Locator> {
    const locator = await this.getLocator(locatorName, sharedGroup);
    if (!locator) {
      throw new Error(`Locator not found: ${locatorName} (group: ${sharedGroup || 'any'})`);
    }
    return locator;
  }

  // --- Common Actions ---

  /**
   * Click an element by locator name.
   */
  async click(locatorName: string, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.click();
  }

  /**
   * Fill a text input by locator name.
   */
  async fill(locatorName: string, text: string, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.fill(text);
  }

  /**
   * Type text into an input field.
   */
  async type(locatorName: string, text: string, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.type(text);
  }

  /**
   * Select an option from a select element.
   */
  async selectOption(locatorName: string, value: string, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.selectOption(value);
  }

  /**
   * Check a checkbox or radio button.
   */
  async check(locatorName: string, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.check();
  }

  /**
   * Uncheck a checkbox.
   */
  async uncheck(locatorName: string, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.uncheck();
  }

  /**
   * Hover over an element.
   */
  async hover(locatorName: string, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.hover();
  }

  /**
   * Get the text content of an element.
   */
  async getText(locatorName: string, sharedGroup?: string): Promise<string> {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    return locator.textContent() || '';
  }

  /**
   * Get the value of an input element.
   */
  async getValue(locatorName: string, sharedGroup?: string): Promise<string> {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    return locator.inputValue() || '';
  }

  /**
   * Wait for an element to be visible.
   */
  async waitForVisible(locatorName: string, timeout = 5000, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden.
   */
  async waitForHidden(locatorName: string, timeout = 5000, sharedGroup?: string) {
    const locator = await this.requireLocator(locatorName, sharedGroup);
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if an element is visible.
   */
  async isVisible(locatorName: string, sharedGroup?: string): Promise<boolean> {
    const locator = await this.getLocator(locatorName, sharedGroup);
    if (!locator) return false;
    return locator.isVisible();
  }

  /**
   * Check if an element is enabled.
   */
  async isEnabled(locatorName: string, sharedGroup?: string): Promise<boolean> {
    const locator = await this.getLocator(locatorName, sharedGroup);
    if (!locator) return false;
    return locator.isEnabled();
  }

  /**
   * Submit a form.
   */
  async submitForm(submitButtonLocator = 'submitButton', sharedGroup = 'form-elements') {
    await this.click(submitButtonLocator, sharedGroup);
  }

  /**
   * Close a dialog or modal using the close button.
   */
  async closeDialog(closeButtonLocator = 'closeButton', sharedGroup = 'common') {
    await this.click(closeButtonLocator, sharedGroup);
  }

  /**
   * Take a screenshot of the component.
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }
}
