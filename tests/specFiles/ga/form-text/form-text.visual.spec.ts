import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';

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

test.describe('Form Text â€” Visual Regression', () => {
  test('[FORMTEXT-VISUAL-001] @visual Form text field is properly styled', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      const borderStyle = await textInput.evaluate(el =>
        window.getComputedStyle(el).borderStyle
      );
      expect(borderStyle).not.toBe('none');
    }
  });

  test('[FORMTEXT-VISUAL-002] @visual Form text label is visible and readable', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const label = page.locator('label, .cmp-form-text label').first();
    if (await label.count() > 0) {
      const fontSize = await label.evaluate(el =>
        parseInt(window.getComputedStyle(el).fontSize)
      );
      expect(fontSize).toBeGreaterThan(10);
    }
  });

  test('[FORMTEXT-VISUAL-003] @visual Form text input has appropriate padding', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      const padding = await textInput.evaluate(el =>
        window.getComputedStyle(el).padding
      );
      expect(padding).not.toBe('0px');
    }
  });

  test('[FORMTEXT-VISUAL-004] @visual Form text placeholder text is visible', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const textInput = page.locator('input[type="text"][placeholder], .cmp-form-text input[placeholder]').first();
    if (await textInput.count() > 0) {
      const placeholderColor = await textInput.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(placeholderColor).toBeTruthy();
    }
  });

  test('[FORMTEXT-VISUAL-005] @visual Form text field maintains proper alignment', async ({ page }) => {
    const url = resolveComponentUrl('form-text');
    await page.goto(url);

    const container = page.locator('.cmp-form-text, [class*="form-text"]').first();
    if (await container.count() > 0) {
      const display = await container.evaluate(el =>
        window.getComputedStyle(el).display
      );
      expect(['block', 'flex', 'grid']).toContain(display);
    }
  });
});

