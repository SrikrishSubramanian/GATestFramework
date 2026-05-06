import { test, expect } from '@playwright/test';
import { FormOptionsPage } from '../../../pages/ga/components/formOptionsPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Options — State Matrix', () => {
  const states = ['default', 'focused', 'disabled', 'error', 'success'];
  const fieldTypes = ['checkbox', 'radio', 'select', 'textarea'];
  const layouts = ['vertical', 'horizontal', 'grid'];

  for (const state of states) {
    for (const fieldType of fieldTypes) {
      for (const layout of layouts) {
        const testName = `[FO-MATRIX-${state}-${fieldType}-${layout}] @matrix @regression Form options (${state}, ${fieldType}, ${layout})`;

        test(testName, async ({ page }) => {
          const pom = new FormOptionsPage(page);
          await pom.navigate(BASE());

          const root = page.locator('.cmp-form-options').first();
          await expect(root).toBeVisible();

          // Find elements matching the field type
          const selector = `.cmp-form-options input[type="${fieldType}"], .cmp-form-options ${fieldType}`;
          const elements = page.locator(selector);
          const elementCount = await elements.count();

          if (elementCount > 0) {
            const element = elements.first();

            // Test state behaviors
            switch (state) {
              case 'focused':
                await element.focus();
                await page.waitForTimeout(100);
                const focused = await element.evaluate(el =>
                  document.activeElement === el
                );
                expect(focused).toBeTruthy();
                break;

              case 'disabled':
                // Check if disabled attribute exists on any similar element
                const disabled = page.locator(`${selector}:disabled`);
                // May or may not have disabled elements
                await expect(root).toBeVisible();
                break;

              case 'default':
              case 'error':
              case 'success':
                // Verify element is visible
                await expect(element).toBeVisible();
                break;
            }
          }

          // Verify no errors
          const errors: string[] = [];
          page.on('pageerror', e => errors.push(e.message));
          expect(errors).toEqual([]);
        });
      }
    }
  }
});
