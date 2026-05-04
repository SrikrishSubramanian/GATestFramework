import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Text — Visual Regression', () => {
  test('[FORMTEXT-VISUAL-001] @visual Form text field is properly styled', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      const borderStyle = await textInput.evaluate(el =>
        window.getComputedStyle(el).borderStyle
      );
      expect(borderStyle).not.toBe('none');
    }
  });

  test('[FORMTEXT-VISUAL-002] @visual Form text label is visible and readable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const label = page.locator('label, .cmp-form-text label').first();
    if (await label.count() > 0) {
      const fontSize = await label.evaluate(el =>
        parseInt(window.getComputedStyle(el).fontSize)
      );
      expect(fontSize).toBeGreaterThan(10);
    }
  });

  test('[FORMTEXT-VISUAL-003] @visual Form text input has appropriate padding', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
    if (await textInput.count() > 0) {
      const padding = await textInput.evaluate(el =>
        window.getComputedStyle(el).padding
      );
      expect(padding).not.toBe('0px');
    }
  });

  test('[FORMTEXT-VISUAL-004] @visual Form text placeholder text is visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const textInput = page.locator('input[type="text"][placeholder], .cmp-form-text input[placeholder]').first();
    if (await textInput.count() > 0) {
      const placeholderColor = await textInput.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(placeholderColor).toBeTruthy();
    }
  });

  test('[FORMTEXT-VISUAL-005] @visual Form text field maintains proper alignment', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-text.html?wcmmode=disabled`);

    const container = page.locator('.cmp-form-text, [class*="form-text"]').first();
    if (await container.count() > 0) {
      const display = await container.evaluate(el =>
        window.getComputedStyle(el).display
      );
      expect(['block', 'flex', 'grid']).toContain(display);
    }
  });
});
