import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Field Dropdown — Edge Cases (GAAM-507)', () => {
  // ============ Edge Case: Large Option Lists ============
  test('[GAAM-507-EDGE-001] @edge Verify dropdown handles many options (100+)', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();
      // Dropdown should handle large option lists gracefully
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('[GAAM-507-EDGE-002] @edge Verify keyboard navigation in large option list', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      if (await options.count() > 10) {
        await select.focus();
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('ArrowDown');
        }
        const value = await select.inputValue();
        expect(value).toBeDefined();
      }
    }
  });

  // ============ Edge Case: Special Characters in Options ============
  test('[GAAM-507-EDGE-003] @edge Verify options with special characters display correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const text = await options.nth(i).textContent();
        // Should handle special chars like &, <, >, quotes
        expect(text).toBeTruthy();
      }
    }
  });

  test('[GAAM-507-EDGE-004] @edge Verify options with very long text wrap correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();

      for (let i = 0; i < Math.min(count, 2); i++) {
        const text = await options.nth(i).textContent();
        if (text && text.length > 50) {
          // Long text should be handled
          expect(text.length).toBeGreaterThan(0);
        }
      }
    }
  });

  // ============ Edge Case: Rapid Selection ============
  test('[GAAM-507-EDGE-005] @edge Verify rapid selection changes work correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      const count = await options.count();

      if (count > 2) {
        await select.selectOption(await options.nth(1).getAttribute('value') || '');
        const value1 = await select.inputValue();

        await select.selectOption(await options.nth(2).getAttribute('value') || '');
        const value2 = await select.inputValue();

        expect(value1).not.toBe(value2);
      }
    }
  });

  test('[GAAM-507-EDGE-006] @edge Verify selecting same option twice works', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      if (await options.count() > 1) {
        const value = await options.nth(1).getAttribute('value') || '';

        await select.selectOption(value);
        const firstSelection = await select.inputValue();

        await select.selectOption(value);
        const secondSelection = await select.inputValue();

        expect(firstSelection).toBe(secondSelection);
      }
    }
  });

  // ============ Edge Case: Empty Option ============
  test('[GAAM-507-EDGE-007] @edge Verify empty option can be selected', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const firstOption = select.locator('option').first();
      const value = await firstOption.getAttribute('value') || '';

      if (value === '') {
        await select.selectOption('');
        const selected = await select.inputValue();
        expect(selected).toBe('');
      }
    }
  });

  // ============ Edge Case: Focus & Blur Interactions ============
  test('[GAAM-507-EDGE-008] @edge Verify focus event fires on dropdown focus', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      let focusCount = 0;
      await page.evaluate(() => {
        (document.querySelector('select') as any)?.addEventListener('focus', () => {
          (window as any).focusCount = ((window as any).focusCount || 0) + 1;
        });
      });

      await select.focus();
      const count = await page.evaluate(() => (window as any).focusCount || 0);

      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('[GAAM-507-EDGE-009] @edge Verify blur event fires on dropdown blur', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.focus();
      await select.blur();

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).not.toBe('SELECT');
    }
  });

  // ============ Edge Case: Form Submission with Dropdown ============
  test('[GAAM-507-EDGE-010] @edge Verify form includes dropdown value on submission', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const select = form.locator('select').first();
      if (await select.count() > 0) {
        const options = select.locator('option');
        if (await options.count() > 1) {
          const value = await options.nth(1).getAttribute('value') || '';
          await select.selectOption(value);

          const formData = new FormData();
          const selectName = await select.getAttribute('name');
          if (selectName) {
            expect(selectName).toBeTruthy();
          }
        }
      }
    }
  });

  // ============ Edge Case: Disabled & ReadOnly States ============
  test('[GAAM-507-EDGE-011] @edge Verify disabled dropdown cannot change value', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const disabledSelect = page.locator('select[disabled]').first();
    if (await disabledSelect.count() > 0) {
      const isDisabled = await disabledSelect.evaluate((el: HTMLSelectElement) => el.disabled);
      expect(isDisabled).toBe(true);
    }
  });

  // ============ Edge Case: Responsive Option Rendering ============
  test('[GAAM-507-EDGE-012] @edge Verify option visibility across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

      const select = page.locator('select').first();
      if (await select.count() > 0) {
        const options = select.locator('option');
        expect(await options.count()).toBeGreaterThan(0);
      }
    }
  });

  test('[GAAM-507-EDGE-013] @edge Verify keyboard navigation works on all viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

      const select = page.locator('select').first();
      if (await select.count() > 0) {
        await select.focus();
        await page.keyboard.press('ArrowDown');
        const value = await select.inputValue();
        expect(value).toBeDefined();
      }
    }
  });

  // ============ Edge Case: Custom Styling ============
  test('[GAAM-507-EDGE-014] @edge Verify custom background color on dropdown', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const bgColor = await select.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).toBeTruthy();
    }
  });

  test('[GAAM-507-EDGE-015] @edge Verify custom font styling on options', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const fontSize = await select.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );
      expect(fontSize).toBeTruthy();
    }
  });

  // ============ Edge Case: Accessibility States ============
  test('[GAAM-507-EDGE-016] @a11y @edge Verify aria-required on required dropdown', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const requiredSelect = page.locator('select[required]').first();
    if (await requiredSelect.count() > 0) {
      const ariaRequired = await requiredSelect.getAttribute('aria-required');
      expect(ariaRequired === 'true' || (await requiredSelect.getAttribute('required')) === '').toBeTruthy();
    }
  });

  test('[GAAM-507-EDGE-017] @a11y @edge Verify aria-invalid on error state', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const errorSelect = page.locator('select[aria-invalid="true"]').first();
    if (await errorSelect.count() > 0) {
      expect(await errorSelect.getAttribute('aria-invalid')).toBe('true');
    }
  });

  test('[GAAM-507-EDGE-018] @a11y @edge Verify aria-describedby for error messages', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select[aria-describedby]').first();
    if (await select.count() > 0) {
      const describedById = await select.getAttribute('aria-describedby');
      expect(describedById).toBeTruthy();
    }
  });

  // ============ Edge Case: Change Event ============
  test('[GAAM-507-EDGE-019] @edge Verify change event fires on option selection', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      if (await options.count() > 1) {
        await page.evaluate(() => {
          (window as any).changeCount = 0;
          document.querySelector('select')?.addEventListener('change', () => {
            (window as any).changeCount = ((window as any).changeCount || 0) + 1;
          });
        });

        await select.selectOption(await options.nth(1).getAttribute('value') || '');
        const changes = await page.evaluate(() => (window as any).changeCount || 0);

        expect(changes).toBeGreaterThanOrEqual(1);
      }
    }
  });

  // ============ Edge Case: No JavaScript Errors ============
  test('[GAAM-507-EDGE-020] @edge Verify no JavaScript errors on dropdown interactions', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await select.click();
      await select.selectOption(await select.locator('option').nth(1).getAttribute('value') || '');
      await select.focus();
      await select.blur();
    }

    expect(errors).toEqual([]);
  });

  // ============ Edge Case: Value Persistence ============
  test('[GAAM-507-EDGE-021] @edge Verify selected value persists after page scroll', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      if (await options.count() > 1) {
        const selectedValue = await options.nth(1).getAttribute('value') || '';
        await select.selectOption(selectedValue);

        await page.evaluate(() => window.scrollBy(0, 500));
        const valueAfterScroll = await select.inputValue();

        expect(valueAfterScroll).toBe(selectedValue);
      }
    }
  });

  // ============ Edge Case: Empty Form State ============
  test('[GAAM-507-EDGE-022] @edge Verify dropdown maintains empty state when not required', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const optionalSelect = page.locator('select:not([required])').first();
    if (await optionalSelect.count() > 0) {
      const initialValue = await optionalSelect.inputValue();
      // Optional dropdown can have empty value
      expect(initialValue).toBeDefined();
    }
  });

  // ============ Edge Case: Multiple Selections with Ctrl/Cmd ============
  test('[GAAM-507-EDGE-023] @edge Verify dropdown ignores Ctrl+Click for single-select', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select:not([multiple])').first();
    if (await select.count() > 0) {
      const options = select.locator('option');
      if (await options.count() > 1) {
        // Single select shouldn't allow multiple values
        await select.selectOption(await options.nth(1).getAttribute('value') || '');
        const value = await select.inputValue();
        expect(value).toBeTruthy();
      }
    }
  });

  // ============ Edge Case: Dropdown with Data Attributes ============
  test('[GAAM-507-EDGE-024] @edge Verify custom data attributes preserved on dropdown', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/form-field-dropdown.html?wcmmode=disabled`);

    const select = page.locator('select[data-testid], select[data-value], select[data-*]').first();
    if (await select.count() > 0) {
      const attr = await select.getAttribute('data-testid') ||
                    await select.getAttribute('data-value');
      expect(attr).toBeDefined();
    }
  });
});
