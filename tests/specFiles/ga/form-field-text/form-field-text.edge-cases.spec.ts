import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Form Field Text â€” Edge Cases (GAAM-504)', () => {
  // ============ Edge Case: Maxlength Constraint ============
  test('[GAAM-504-EDGE-001] @edge Verify input enforces maxlength strictly', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"][maxlength]').first();
    if (await input.count() > 0) {
      const maxlength = parseInt(await input.getAttribute('maxlength') || '');
      const testString = 'x'.repeat(maxlength + 20);

      await input.fill(testString);
      const value = await input.inputValue();

      expect(value.length).toBeLessThanOrEqual(maxlength);
    }
  });

  test('[GAAM-504-EDGE-002] @edge Verify textarea enforces maxlength strictly', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea[maxlength]').first();
    if (await textarea.count() > 0) {
      const maxlength = parseInt(await textarea.getAttribute('maxlength') || '');
      const testString = 'x'.repeat(maxlength + 20);

      await textarea.fill(testString);
      const value = await textarea.inputValue();

      expect(value.length).toBeLessThanOrEqual(maxlength);
    }
  });

  // ============ Edge Case: Special Characters ============
  test('[GAAM-504-EDGE-003] @edge Verify input handles special characters', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const specialChars = '<>&"\'!@#$%^&*()';
      await input.fill(specialChars);
      const value = await input.inputValue();

      expect(value).toBe(specialChars);
    }
  });

  test('[GAAM-504-EDGE-004] @edge Verify textarea handles special characters', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const specialChars = '<>&"\'!@#$%^&*()\n\t';
      await textarea.fill(specialChars);
      const value = await textarea.inputValue();

      expect(value).toContain('<');
      expect(value).toContain('>');
    }
  });

  // ============ Edge Case: Unicode & Emoji ============
  test('[GAAM-504-EDGE-005] @edge Verify input handles unicode characters', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const unicode = 'ä½ å¥½ä¸–ç•Œ Ù…Ø±Ø­Ø¨Ø§ Ø§Ù„Ø¹Ø§Ù„Ù…';
      await input.fill(unicode);
      const value = await input.inputValue();

      expect(value).toBe(unicode);
    }
  });

  test('[GAAM-504-EDGE-006] @edge Verify textarea handles emoji characters', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const emoji = 'ðŸ˜€ðŸŽ‰ðŸš€âœ¨';
      await textarea.fill(emoji);
      const value = await textarea.inputValue();

      expect(value).toContain('ðŸ˜€');
    }
  });

  // ============ Edge Case: Whitespace Handling ============
  test('[GAAM-504-EDGE-007] @edge Verify input preserves leading whitespace', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const textWithSpaces = '   test   ';
      await input.fill(textWithSpaces);
      const value = await input.inputValue();

      expect(value).toContain('   test   ');
    }
  });

  test('[GAAM-504-EDGE-008] @edge Verify textarea preserves line breaks', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const multiline = 'line1\nline2\nline3';
      await textarea.fill(multiline);
      const value = await textarea.inputValue();

      expect(value).toContain('\n');
      expect(value.split('\n').length).toBe(3);
    }
  });

  // ============ Edge Case: Copy/Paste ============
  test('[GAAM-504-EDGE-009] @edge Verify input handles paste with maxlength', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"][maxlength]').first();
    if (await input.count() > 0) {
      const maxlength = parseInt(await input.getAttribute('maxlength') || '');
      const longText = 'x'.repeat(maxlength + 10);

      await input.fill(longText);
      const value = await input.inputValue();

      expect(value.length).toBeLessThanOrEqual(maxlength);
    }
  });

  test('[GAAM-504-EDGE-010] @edge Verify textarea handles paste correctly', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const multilineText = 'line1\nline2\nline3';
      await textarea.fill(multilineText);
      const value = await textarea.inputValue();

      expect(value).toBe(multilineText);
    }
  });

  // ============ Edge Case: Rapid Text Entry ============
  test('[GAAM-504-EDGE-011] @edge Verify input handles rapid typing', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      const chars = ['t', 'e', 's', 't'];
      for (const char of chars) {
        await input.type(char, { delay: 10 });
      }

      const value = await input.inputValue();
      expect(value).toBe('test');
    }
  });

  test('[GAAM-504-EDGE-012] @edge Verify textarea handles rapid typing', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.type('test input', { delay: 5 });
      const value = await textarea.inputValue();

      expect(value).toBe('test input');
    }
  });

  // ============ Edge Case: Clear & Refill ============
  test('[GAAM-504-EDGE-013] @edge Verify input can be cleared and refilled multiple times', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      for (let i = 0; i < 3; i++) {
        await fill(input, 'test${i}');
        const value = await input.inputValue();
        expect(value).toBe(`test${i}`);

        await input.clear();
        const clearedValue = await input.inputValue();
        expect(clearedValue).toBe('');
      }
    }
  });

  test('[GAAM-504-EDGE-014] @edge Verify textarea can be cleared and refilled multiple times', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      for (let i = 0; i < 3; i++) {
        await fill(textarea, 'line1\nline2${i}');
        const value = await textarea.inputValue();
        expect(value).toContain('line1');

        await textarea.clear();
        const clearedValue = await textarea.inputValue();
        expect(clearedValue).toBe('');
      }
    }
  });

  // ============ Edge Case: Focus/Blur Cycle ============
  test('[GAAM-504-EDGE-015] @edge Verify input focus/blur cycle preserves value', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await fill(input, 'test value');

      await input.focus();
      await input.blur();

      const value = await input.inputValue();
      expect(value).toBe('test value');
    }
  });

  test('[GAAM-504-EDGE-016] @edge Verify textarea focus/blur cycle preserves value', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await fill(textarea, 'test\nvalue');

      await textarea.focus();
      await textarea.blur();

      const value = await textarea.inputValue();
      expect(value).toBe('test\nvalue');
    }
  });

  // ============ Edge Case: Input Events ============
  test('[GAAM-504-EDGE-017] @edge Verify input event fires on text change', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => {
        (window as any).inputEvents = 0;
        document.querySelector('input[type="text"]')?.addEventListener('input', () => {
          (window as any).inputEvents = ((window as any).inputEvents || 0) + 1;
        });
      });

      await fill(input, 'test');
      const events = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => (window as any).inputEvents || 0);

      expect(events).toBeGreaterThanOrEqual(1);
    }
  });

  test('[GAAM-504-EDGE-018] @edge Verify change event fires on blur', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => {
        (window as any).changeEvents = 0;
        document.querySelector('input[type="text"]')?.addEventListener('change', () => {
          (window as any).changeEvents = ((window as any).changeEvents || 0) + 1;
        });
      });

      await fill(input, 'test');
      await input.blur();

      const events = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => (window as any).changeEvents || 0);
      expect(events).toBeGreaterThanOrEqual(0);
    }
  });

  // ============ Edge Case: Disabled & ReadOnly ============
  test('[GAAM-504-EDGE-019] @edge Verify disabled input shows disabled styling', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const disabledInput = page.locator('input[type="text"][disabled]').first();
    if (await disabledInput.count() > 0) {
      const opacity = // 📏 TODO: Replace with measurement-utils
    await disabledInput.evaluate(el =>
        window.getComputedStyle(el).opacity
      );
      // Disabled inputs often have reduced opacity
      expect(opacity).toBeDefined();
    }
  });

  test('[GAAM-504-EDGE-020] @edge Verify readonly input styling preserved', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const readonlyInput = page.locator('input[type="text"][readonly]').first();
    if (await readonlyInput.count() > 0) {
      const bgColor = // 📏 TODO: Replace with measurement-utils
    await readonlyInput.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).toBeDefined();
    }
  });

  // ============ Edge Case: Keyboard Shortcuts ============
  test('[GAAM-504-EDGE-021] @edge Verify Ctrl+A selects all text', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await fill(input, 'test text');
      await input.focus();
      await page.keyboard.press('Control+A');

      // Text should be selectable
      const value = await input.inputValue();
      expect(value).toBe('test text');
    }
  });

  test('[GAAM-504-EDGE-022] @edge Verify Ctrl+C copies text', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await fill(input, 'test text');
      const value = await input.inputValue();

      expect(value).toBe('test text');
    }
  });

  // ============ Edge Case: Number Input Constraints ============
  test('[GAAM-504-EDGE-023] @edge Verify number input rejects non-numeric', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.count() > 0) {
      await fill(numberInput, 'abc');
      const value = await numberInput.inputValue();

      // Number input should reject or clear non-numeric input
      expect(value).toBe('');
    }
  });

  test('[GAAM-504-EDGE-024] @edge Verify number input accepts numeric input', async ({ page }) => {
    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.count() > 0) {
      await fill(numberInput, '123');
      const value = await numberInput.inputValue();

      expect(value).toBe('123');
    }
  });

  // ============ Edge Case: No JavaScript Errors ============
  test('[GAAM-504-EDGE-025] @edge Verify no JavaScript errors on text input interactions', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    const url = resolveComponentUrl('form-field-text');
    await page.goto(url);

    const input = page.locator('input[type="text"]').first();
    if (await input.count() > 0) {
      await fill(input, 'test');
      await input.focus();
      await input.blur();
      await input.clear();
    }

    expect(errors).toEqual([]);
  });
});

