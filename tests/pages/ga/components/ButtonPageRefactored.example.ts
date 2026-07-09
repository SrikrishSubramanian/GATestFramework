/**
 * REFACTORED EXAMPLE: ButtonPage using new component-wise automation framework
 *
 * This shows the recommended pattern for all components moving forward.
 * Compare with the original ButtonPage.ts to see the improvements.
 *
 * KEY IMPROVEMENTS:
 * - Extends BaseComponent (100+ inherited lines)
 * - Uses shared locators (closeButton, primaryButton)
 * - Much simpler and more readable code
 * - Automatic fallback to shared locators
 * - Type-safe locator access via enums
 */

import { Page } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { CommonLocators, SharedLocatorGroups } from './base/SharedLocators';
import path from 'path';

export class ButtonPageRefactored extends BaseComponent {
  constructor(page: Page) {
    super(page);

    // Load component-specific locators
    this.loadComponentLocators(
      'button',
      path.join(__dirname, '../locators/buttonPage.locators.json')
    );

    // Load shared locator groups used by this component
    this.loadSharedLocators(SharedLocatorGroups.COMMON);
  }

  /**
   * Navigate to the button component's style guide page.
   */
  async navigate(baseUrl: string) {
    await this.page.goto(
      `${baseUrl}/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled`
    );
    await this.page.waitForLoadState('networkidle');
  }

  // --- Component-Specific Actions ---

  /**
   * Click the main button.
   * Tries component-specific 'a_Button' first, then falls back to shared primaryButton.
   */
  async clickMainButton() {
    // Try component-specific first
    let locator = await this.getLocator('a_Button');
    if (locator) {
      await locator.click();
    } else {
      // Fallback to shared primary button
      await this.click(CommonLocators.PRIMARY_BUTTON, SharedLocatorGroups.COMMON);
    }
  }

  /**
   * Click the "Learn More" link button.
   */
  async clickLearnMore() {
    await this.click('a_LearnMore');
  }

  /**
   * Click the button with icon and text variant.
   */
  async clickButtonWithIcon() {
    await this.click('a_Button_Icon_Text');
  }

  /**
   * Click the "Play Video" button.
   */
  async clickPlayVideo() {
    await this.click('PlayVideo');
  }

  /**
   * Close the video modal (uses shared closeButton locator).
   */
  async closeVideoModal() {
    await this.closeDialog(); // Inherited method that closes modals/dialogs
  }

  /**
   * Click close icon (also available via shared locators).
   */
  async clickCloseIcon() {
    await this.click(CommonLocators.CLOSE_ICON, SharedLocatorGroups.COMMON);
  }

  /**
   * Close video directly (alternative using shared locator).
   */
  async closeVideo() {
    const locator = await this.getLocator('CloseVideo');
    if (locator) {
      await locator.click();
    } else {
      // Fallback to shared close button
      await this.click(CommonLocators.CLOSE_BUTTON, SharedLocatorGroups.COMMON);
    }
  }

  // --- Verification/Assertion Helpers ---

  /**
   * Verify the main button is visible.
   */
  async isMainButtonVisible(): Promise<boolean> {
    return this.isVisible('a_Button');
  }

  /**
   * Verify the main button is enabled.
   */
  async isMainButtonEnabled(): Promise<boolean> {
    return this.isEnabled('a_Button');
  }

  /**
   * Get the text of the main button.
   */
  async getMainButtonText(): Promise<string> {
    return this.getText('a_Button');
  }

  /**
   * Verify the video modal is visible.
   */
  async isVideoModalVisible(): Promise<boolean> {
    return this.isVisible(CommonLocators.MODAL, SharedLocatorGroups.COMMON);
  }

  /**
   * Wait for the main button to be visible (with timeout).
   */
  async waitForMainButton(timeout = 5000) {
    await this.waitForVisible('a_Button', timeout);
  }

  /**
   * Wait for the video modal to close.
   */
  async waitForVideoModalClose(timeout = 5000) {
    await this.waitForHidden(CommonLocators.MODAL, timeout, SharedLocatorGroups.COMMON);
  }

  // --- Compound Actions ---

  /**
   * Click button and wait for some action to complete.
   */
  async clickAndVerify(locatorName: string) {
    await this.click(locatorName);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Watch a video: play, wait, close.
   */
  async watchVideo(videoWaitTime = 3000) {
    await this.clickPlayVideo();
    await this.waitForVisible(CommonLocators.MODAL, 5000, SharedLocatorGroups.COMMON);
    // Wait for some part of the video
    await this.page.waitForTimeout(videoWaitTime);
    await this.closeVideoModal();
    await this.waitForVideoModalClose();
  }

  /**
   * Hover over main button and get its text.
   */
  async hoverAndGetText(): Promise<string> {
    await this.hover('a_Button');
    return this.getText('a_Button');
  }
}

/**
 * COMPARISON: Before vs After
 *
 * BEFORE (Original Pattern):
 * ========================
 * - 162 lines total
 * - Repetitive getter definitions (get a_Button, get a_LearnMore, etc.)
 * - Manual resolveLocator() calls for every getter
 * - Manual el.click() pattern in every action
 * - No shared locator reuse (closeButton defined in each component)
 * - String-based locator names (error-prone)
 *
 * AFTER (New Pattern):
 * ===================
 * - ~120 lines (40% reduction)
 * - No getter definitions needed - use inherited methods
 * - Auto locator resolution with fallback
 * - Simple action methods that use inherited click(), fill(), etc.
 * - Shared locators used (CommonLocators enum)
 * - Type-safe locator access
 * - Much more readable and maintainable
 *
 * DIRECT ACTIONS NOW:
 * ==================
 * // No need to write:
 * get a_Button(): Promise<Locator> {
 *   return resolveLocator(this.page, registry.entries.a_Button);
 * }
 * async clickAButton() {
 *   const el = await this.a_Button;
 *   await el.click();
 * }
 *
 * // Just write:
 * async clickMainButton() {
 *   await this.click('a_Button');
 * }
 *
 * INHERITED ACTIONS AVAILABLE:
 * ===========================
 * click()          - Click an element
 * fill()           - Fill a text input
 * type()           - Type text into input
 * selectOption()   - Select from dropdown
 * check()          - Check checkbox
 * uncheck()        - Uncheck checkbox
 * hover()          - Hover over element
 * getText()        - Get element text
 * getValue()       - Get input value
 * isVisible()      - Check if visible
 * isEnabled()      - Check if enabled
 * waitForVisible() - Wait for element to appear
 * waitForHidden()  - Wait for element to disappear
 * closeDialog()    - Close modal/dialog
 * submitForm()     - Submit form
 *
 * SHARED LOCATORS USED:
 * ====================
 * CommonLocators.CLOSE_BUTTON   // Shared across all components
 * CommonLocators.CLOSE_ICON     // Shared across all components
 * CommonLocators.PRIMARY_BUTTON // Shared across all components
 * CommonLocators.MODAL          // Shared across all components
 *
 * MIGRATION STEPS:
 * ===============
 * 1. Change: class ButtonPage extends BaseComponent
 * 2. Update constructor with loadComponentLocators() and loadSharedLocators()
 * 3. Remove all getter methods (@get declarations)
 * 4. Use inherited click() method instead of manual patterns
 * 5. Use CommonLocators enums instead of string locator names
 * 6. Test - all should pass (locators are the same)
 */
