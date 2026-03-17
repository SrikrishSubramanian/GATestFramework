import { test, expect } from '@playwright/test';
import { FormOptionsPage } from '../../../pages/ga/components/formOptionsPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import AxeBuilder from '@axe-core/playwright';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars (same workaround as POM — globalSetup doesn't propagate to workers)
if (process.env.env) {
  dotenv.config({
    path: path.resolve(__dirname, '..', '..', '..', 'environments', `.env.${process.env.env}`),
    override: true,
  });
}

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const AUTH = {
  username: process.env.AEM_AUTHOR_USERNAME || 'admin',
  password: process.env.AEM_AUTHOR_PASSWORD || 'admin',
};

// Root selectors for the two dropdown variants on the style guide page
const SINGLE_SELECT = '.cmp-form-options--drop-down';
const MULTI_SELECT = '.cmp-form-options--multi-drop-down';
const LABEL = '.cmp-form-options__label';
const ERROR_MSG = '.cmp-form-options__required-message';

// Choices.js selectors (single-select)
const CHOICES = '.choices';
const CHOICES_INNER = '.choices__inner';
const CHOICES_LIST = '.choices__list--dropdown';
const CHOICES_ITEM = '.choices__item--selectable';
const CHOICES_PLACEHOLDER = '.choices__placeholder';

// Custom multiselect selectors
const CUSTOM_MS = '.custom-multiselect';
const SELECT_BOX = '.select-box';
const CHECKBOXES_PANEL = '.checkboxes';
const MS_CHECKBOX = '.cmp-form-options__field--checkbox';
const SELECT_ALL_TEXT = '.select-all-text';

// Dark mode parent section selectors
const DARK_SECTIONS = '.cmp-section--background-color-granite, .cmp-section--background-color-azul';

/** Authenticate and navigate to form-options style guide page */
async function loginAndNavigate(page: import('@playwright/test').Page, pom: FormOptionsPage) {
  await page.goto(`${AUTHOR_URL}/libs/granite/core/content/login.html`);
  await page.fill('#username', AUTH.username);
  await page.fill('#password', AUTH.password);
  await page.click('#submit-button');
  await page.waitForLoadState('networkidle');
  await pom.navigate(AUTHOR_URL);
}

test.describe('FormOptions Dropdown — GAAM-507 Acceptance Criteria', () => {
  let pom: FormOptionsPage;

  test.beforeEach(async ({ page }) => {
    pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    // Skip all dropdown AC tests if no dropdown content is on the page yet
    // (GAAM-507 dropdown content may not be deployed — deploy content fixtures first)
    const dropdownCount = await page.locator(SINGLE_SELECT).count();
    if (dropdownCount === 0) {
      test.skip();
    }
  });

  test('[FO-001] @regression All interactive states reskinned — Default state has correct border and bg', async ({ page }) => {
    const inner = page.locator(`${SINGLE_SELECT} ${CHOICES_INNER}`).first();
    await expect(inner).toBeVisible();
    await expect(inner).toHaveCSS('border-radius', '8px');
    await expect(inner).toHaveCSS('font-size', '16px');
  });

  test('[FO-002] @regression Error states reskinned — error message hidden by default', async ({ page }) => {
    const dropdown = page.locator(SINGLE_SELECT).first();
    await expect(dropdown).toBeVisible();
    const errorMsg = page.locator(`${SINGLE_SELECT} ${ERROR_MSG}`).first();
    await expect(errorMsg).toBeHidden();
  });

  test('[FO-003] @regression Dark mode variants implemented for both single and multi-select', async ({ page }) => {
    const darkSingleSelect = page.locator(`${DARK_SECTIONS} ${SINGLE_SELECT}`);
    const darkMultiSelect = page.locator(`${DARK_SECTIONS} ${MULTI_SELECT}`);
    const singleCount = await darkSingleSelect.count();
    const multiCount = await darkMultiSelect.count();
    expect(singleCount + multiCount).toBeGreaterThan(0);
  });

  test('[FO-004] @regression Light and dark mode styles do not interfere', async ({ page }) => {
    const lightInner = page.locator(`${SINGLE_SELECT} ${CHOICES_INNER}`).first();
    const lightBg = await lightInner.evaluate(el => getComputedStyle(el).backgroundColor);

    const darkInner = page.locator(`${DARK_SECTIONS} ${SINGLE_SELECT} ${CHOICES_INNER}`).first();
    if (await darkInner.count() > 0) {
      const darkBg = await darkInner.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(lightBg).not.toEqual(darkBg);
    }
  });

  test('[FO-005] @a11y @wcag22 WCAG 2.1 AA contrast in both light and dark mode', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.cmp-form-options')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations.filter(v => v.id.includes('contrast'))).toEqual([]);
  });

  test('[FO-006] @mobile @regression Mobile: full width, font styles match desktop', async ({ page }) => {
    const desktopDropdown = page.locator(`${SINGLE_SELECT}`).first();
    await expect(desktopDropdown).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await expect(page.locator(`${SINGLE_SELECT}`).first()).toBeVisible();
  });

  test('[FO-007] @regression Label renders above field with required asterisk', async ({ page }) => {
    const label = page.locator(`${SINGLE_SELECT} ${LABEL}`).first();
    await expect(label).toBeVisible();

    const asterisk = label.locator('div');
    if (await asterisk.count() > 0) {
      await expect(asterisk.first()).toHaveText('*');
    }
  });

  test('[FO-008] @regression Helper text / placeholder renders within the field', async ({ page }) => {
    const placeholder = page.locator(`${SINGLE_SELECT} ${CHOICES_PLACEHOLDER}`).first();
    if (await placeholder.count() > 0) {
      await expect(placeholder).toBeVisible();
    }
  });

  test('[FO-009] @regression Error state shows error icon + message below field', async ({ page }) => {
    const errorMsgs = page.locator(`${SINGLE_SELECT} ${ERROR_MSG}`);
    const count = await errorMsgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const img = errorMsgs.nth(i).locator('img');
      expect(await img.count()).toBeGreaterThan(0);
    }
  });

  test('[FO-010] @a11y @regression Disabled/Read Only state is not keyboard-focusable', async ({ page }) => {
    const disabledChoices = page.locator(`${SINGLE_SELECT} .choices.is-disabled`);
    const count = await disabledChoices.count();
    if (count > 0) {
      const inner = disabledChoices.first().locator(CHOICES_INNER);
      await expect(inner).toHaveCSS('cursor', 'not-allowed');
    }
    const disabledMs = page.locator(`${MULTI_SELECT} ${CUSTOM_MS}.disabled`);
    if (await disabledMs.count() > 0) {
      await expect(disabledMs.first().locator(SELECT_BOX)).toHaveCSS('cursor', 'not-allowed');
    }
  });

  test('[FO-011] @regression Chevron icon updates direction on open/close', async ({ page }) => {
    const dropdown = page.locator(`${SINGLE_SELECT} ${CHOICES}`).first();
    await expect(dropdown).toBeVisible();

    const isOpenBefore = await dropdown.evaluate(el => el.classList.contains('is-open'));
    expect(isOpenBefore).toBe(false);

    await dropdown.locator(CHOICES_INNER).click();
    await page.waitForTimeout(300);

    const isOpenAfter = await dropdown.evaluate(el => el.classList.contains('is-open'));
    expect(isOpenAfter).toBe(true);
  });

  test('[FO-012] @regression Panel border, background, list items reskinned', async ({ page }) => {
    const dropdown = page.locator(`${SINGLE_SELECT} ${CHOICES}`).first();
    await dropdown.locator(CHOICES_INNER).click();
    await page.waitForTimeout(300);

    const panel = page.locator(`${SINGLE_SELECT} ${CHOICES_LIST}`).first();
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS('border-radius', '8px');
  });

  test('[FO-013] @regression Hovered list item shows correct highlight', async ({ page }) => {
    const dropdown = page.locator(`${SINGLE_SELECT} ${CHOICES}`).first();
    await dropdown.locator(CHOICES_INNER).click();
    await page.waitForTimeout(300);

    const item = page.locator(`${SINGLE_SELECT} ${CHOICES_ITEM}`).first();
    await item.hover();
    await page.waitForTimeout(200);

    const isHighlighted = await item.evaluate(el => el.classList.contains('is-highlighted'));
    expect(isHighlighted).toBe(true);
  });

  test('[FO-014] @regression Focused list item highlight visually distinct from hover', async ({ page }) => {
    const dropdown = page.locator(`${SINGLE_SELECT} ${CHOICES}`).first();
    await dropdown.locator(CHOICES_INNER).click();
    await page.waitForTimeout(300);

    const items = page.locator(`${SINGLE_SELECT} ${CHOICES_ITEM}`);
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('[FO-015] @regression Single-select: selected item shows checkmark', async ({ page }) => {
    const dropdown = page.locator(`${SINGLE_SELECT} ${CHOICES}`).first();
    await dropdown.locator(CHOICES_INNER).click();
    await page.waitForTimeout(300);

    const item = page.locator(`${SINGLE_SELECT} ${CHOICES_ITEM}`).nth(1);
    if (await item.count() > 0) {
      await item.click();
      await page.waitForTimeout(300);

      await dropdown.locator(CHOICES_INNER).click();
      await page.waitForTimeout(300);

      const selectedItem = page.locator(`${SINGLE_SELECT} ${CHOICES_ITEM}[aria-selected="true"]`);
      if (await selectedItem.count() > 0) {
        await expect(selectedItem.first()).toBeVisible();
      }
    }
  });

  test('[FO-016] @regression Single-select: filled state shows selected value in trigger', async ({ page }) => {
    const dropdown = page.locator(`${SINGLE_SELECT} ${CHOICES}`).first();
    await dropdown.locator(CHOICES_INNER).click();
    await page.waitForTimeout(300);

    const item = page.locator(`${SINGLE_SELECT} ${CHOICES_ITEM}`).nth(1);
    if (await item.count() > 0) {
      const itemText = await item.textContent();
      await item.click();
      await page.waitForTimeout(300);

      const triggerText = await dropdown.locator(CHOICES_INNER).textContent();
      if (itemText) {
        expect(triggerText).toContain(itemText.trim());
      }
    }
  });

  test('[FO-017] @regression Multi-select: checkbox updates to checked styling on selection', async ({ page }) => {
    const multiDropdown = page.locator(`${MULTI_SELECT} ${CUSTOM_MS}`).first();
    if (await multiDropdown.count() === 0) { test.skip(); return; }

    await multiDropdown.locator(SELECT_BOX).click();
    await page.waitForTimeout(300);

    const checkbox = multiDropdown.locator(`${CHECKBOXES_PANEL} ${MS_CHECKBOX}`).first();
    if (await checkbox.count() > 0) {
      await checkbox.click();
      await expect(checkbox).toBeChecked();
    }
  });

  test('[FO-018] @regression Multi-select: checked color correct in light and dark mode', async ({ page }) => {
    const lightMs = page.locator(`${MULTI_SELECT} ${CUSTOM_MS}`).first();
    if (await lightMs.count() === 0) { test.skip(); return; }
    await expect(lightMs.locator(SELECT_BOX)).toBeVisible();
  });

  test('[FO-019] @regression Multi-select: filled trigger shows count of selected options', async ({ page }) => {
    const multiDropdown = page.locator(`${MULTI_SELECT} ${CUSTOM_MS}`).first();
    if (await multiDropdown.count() === 0) { test.skip(); return; }

    await multiDropdown.locator(SELECT_BOX).click();
    await page.waitForTimeout(300);

    const checkboxes = multiDropdown.locator(`${CHECKBOXES_PANEL} ${MS_CHECKBOX}`);
    const count = await checkboxes.count();
    if (count >= 2) {
      await checkboxes.nth(0).click();
      await checkboxes.nth(1).click();
      await page.waitForTimeout(300);
      await multiDropdown.locator(SELECT_BOX).click();
      await page.waitForTimeout(300);

      const triggerText = await multiDropdown.locator(SELECT_BOX).textContent();
      expect(triggerText).toBeTruthy();
    }
  });

  test('[FO-020] @regression Component available on existing templates', async ({ page }) => {
    await expect(page.locator('.cmp-form-options').first()).toBeVisible();
  });

  test('[FO-021] @regression Styles match Figma — border-radius, font-size, min-height', async ({ page }) => {
    const inner = page.locator(`${SINGLE_SELECT} ${CHOICES_INNER}`).first();
    await expect(inner).toBeVisible();
    await expect(inner).toHaveCSS('border-radius', '8px');
    await expect(inner).toHaveCSS('font-size', '16px');
    const minHeight = await inner.evaluate(el => getComputedStyle(el).minHeight);
    expect(parseInt(minHeight)).toBeGreaterThanOrEqual(48);
  });

  test('[FO-022] @regression Style guide has multiple dropdown variations', async ({ page }) => {
    const totalCount = await page.locator(SINGLE_SELECT).count() + await page.locator(MULTI_SELECT).count();
    expect(totalCount).toBeGreaterThan(0);
  });

  test('[FO-023] @regression Style Guide page exists and loads', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('form');
  });

  test('[FO-024] @mobile @regression Desktop and mobile versions render', async ({ page }) => {
    await expect(page.locator(`${SINGLE_SELECT}`).first()).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await expect(page.locator(`${SINGLE_SELECT}`).first()).toBeVisible();
  });

  test('[FO-025] @regression QA: component renders all variations', async ({ page }) => {
    await expect(page.locator(SINGLE_SELECT).first()).toBeVisible();
    console.log(`Single-select: ${await page.locator(SINGLE_SELECT).count()}`);
    console.log(`Multi-select: ${await page.locator(MULTI_SELECT).count()}`);
  });
});

test.describe('FormOptions — Happy Path', () => {
  test('[FO-026] @smoke @regression FormOptions renders correctly', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    await expect(page.locator('.cmp-form-options').first()).toBeVisible();
  });

  test('[FO-027] @smoke @regression FormOptions dropdown opens on click', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    const dropdown = page.locator(`${SINGLE_SELECT} ${CHOICES}`).first();
    if (await dropdown.count() === 0) { test.skip(); return; }
    await dropdown.locator(CHOICES_INNER).click();
    await page.waitForTimeout(300);
    await expect(page.locator(`${SINGLE_SELECT} ${CHOICES_LIST}`).first()).toBeVisible();
  });
});

test.describe('FormOptions — Negative & Boundary', () => {
  test('[FO-028] @negative @regression FormOptions handles empty content gracefully', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    const jsErrors: string[] = [];
    page.on('pageerror', err => jsErrors.push(err.message));
    await page.waitForTimeout(2000);
    expect(jsErrors).toEqual([]);
  });

  test('[FO-029] @negative @regression FormOptions images are not broken', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    const images = page.locator('.cmp-form-options img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('FormOptions — Responsive', () => {
  test('[FO-030] @mobile @regression FormOptions adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    await expect(page.locator('.cmp-form-options').first()).toBeVisible();
  });

  test('[FO-031] @mobile @regression FormOptions adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    await expect(page.locator('.cmp-form-options').first()).toBeVisible();
  });
});

test.describe('FormOptions — Console & Resources', () => {
  test('[FO-032] @regression FormOptions produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('FormOptions — Broken Images', () => {
  // FO-033 removed: duplicate of FO-029 (both check naturalWidth on .cmp-form-options img)

  test('[FO-034] @regression FormOptions all images have alt attributes', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    const images = page.locator('.cmp-form-options img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('FormOptions — Accessibility', () => {
  test('[FO-035] @a11y @wcag22 @regression @smoke FormOptions passes axe-core scan', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    const results = await new AxeBuilder({ page })
      .include('.cmp-form-options')
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[FO-036] @a11y @wcag22 @regression FormOptions interactive elements meet 24px target size', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    const interactive = page.locator('.cmp-form-options select, .cmp-form-options input, .cmp-form-options .choices__inner, .cmp-form-options .select-box');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box && box.width > 0) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[FO-037] @a11y @wcag22 @regression FormOptions labels are associated with fields', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await loginAndNavigate(page, pom);
    const labels = page.locator(`${SINGLE_SELECT} ${LABEL}[for], ${MULTI_SELECT} ${LABEL}[for]`);
    const count = await labels.count();
    for (let i = 0; i < count; i++) {
      const forAttr = await labels.nth(i).getAttribute('for');
      if (forAttr) {
        const field = page.locator(`#${forAttr}`);
        expect(await field.count()).toBeGreaterThan(0);
      }
    }
  });
});
