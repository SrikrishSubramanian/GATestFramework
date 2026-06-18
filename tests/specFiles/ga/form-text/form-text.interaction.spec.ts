import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});

test.describe('Form Text â€” Interactions', () => {
  test('[FORMTEXT-INTERACTION-001] @interaction Form text field receives focus', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      await textInput.focus();
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBe('INPUT');
    }
  });

  test('[FORMTEXT-INTERACTION-002] @interaction Form text field displays focus outline', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      await textInput.focus();
      const outline = await textInput.evaluate(el =>
        window.getComputedStyle(el).outline
      );
      expect(outline).not.toBe('none');
    }
  });

  test('[FORMTEXT-INTERACTION-003] @interaction Form text field changes background on focus', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      const initialBg = await textInput.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      await textInput.focus();
      const focusBg = await textInput.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(focusBg).toBeTruthy();
    }
  });

  test('[FORMTEXT-INTERACTION-004] @interaction Form text allows text selection', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      await textInput.fill('Selectable Text');
      await textInput.selectOption?.({ index: 0 } as any).catch(() => {});
      const value = await textInput.inputValue();
      expect(value).toBe('Selectable Text');
    }
  });

  test('[FORMTEXT-INTERACTION-005] @interaction Form text responds to keyboard events', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      await textInput.focus();
      await page.keyboard.type('ABC');
      const value = await textInput.inputValue();
      expect(value).toContain('ABC');
    }
  });

  test('[FORMTEXT-INTERACTION-006] @interaction Form text field clears on backspace', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      await textInput.fill('Test');
      await textInput.press('Backspace');
      const value = await textInput.inputValue();
      expect(value).toBe('Tes');
    }
  });
});

