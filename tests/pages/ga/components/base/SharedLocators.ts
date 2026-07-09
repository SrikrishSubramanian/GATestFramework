/**
 * SharedLocators enum provides centralized access to all shared locator names.
 * Use these constants to ensure consistency when referencing shared locators.
 */

export enum CommonLocators {
  CLOSE_BUTTON = 'closeButton',
  CLOSE_ICON = 'closeIcon',
  DIALOG_OVERLAY = 'dialogOverlay',
  PRIMARY_BUTTON = 'primaryButton',
  SECONDARY_BUTTON = 'secondaryButton',
  TEXT_INPUT = 'textInput',
  CHECKBOX = 'checkbox',
  RADIO_BUTTON = 'radioButton',
  SELECT = 'select',
  HEADING = 'heading',
  LINK = 'link',
  IMAGE = 'image',
  PARAGRAPH = 'paragraph',
  LABEL = 'label',
  MODAL = 'modal',
}

export enum FormElementLocators {
  FORM_FIELD = 'formField',
  FORM_LABEL = 'formLabel',
  FORM_ERROR = 'formError',
  SUBMIT_BUTTON = 'submitButton',
  RESET_BUTTON = 'resetButton',
  TEXTAREA = 'textarea',
  REQUIRED_FIELD = 'requiredField',
  FIELD_HINT = 'fieldHint',
}

export enum NavigationLocators {
  NAV_MENU = 'navMenu',
  NAV_ITEM = 'navItem',
  NAV_LINK = 'navLink',
  BREADCRUMB = 'breadcrumb',
  BREADCRUMB_ITEM = 'breadcrumbItem',
}

/**
 * SharedLocatorGroups maps locator names to their file names for easy organization.
 */
export const SharedLocatorGroups = {
  COMMON: 'common',
  FORM_ELEMENTS: 'form-elements',
  NAVIGATION: 'navigation',
} as const;

/**
 * Helper function to determine which shared group a locator belongs to.
 */
export function getSharedLocatorGroup(locatorName: string): string | null {
  // Check common locators
  if (Object.values(CommonLocators).includes(locatorName as any)) {
    return SharedLocatorGroups.COMMON;
  }
  // Check form element locators
  if (Object.values(FormElementLocators).includes(locatorName as any)) {
    return SharedLocatorGroups.FORM_ELEMENTS;
  }
  // Check navigation locators
  if (Object.values(NavigationLocators).includes(locatorName as any)) {
    return SharedLocatorGroups.NAVIGATION;
  }
  return null;
}
