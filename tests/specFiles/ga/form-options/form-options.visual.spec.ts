import { test, expect } from '@playwright/test';
import { FormOptionsPage } from '../../../pages/ga/components/formOptionsPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Form Options — Visual Regression', () => {
  test('[FO-VISUAL-001] @visual Form options layout is correct', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const root = page.locator('.cmp-form-options').first();
    await expect(root).toBeVisible();

    // Check that form elements are visible
    const formElements = root.locator('input, textarea, select, button');
    expect(await formElements.count()).toBeGreaterThan(0);
  });

  test('[FO-VISUAL-002] @visual Checkboxes are properly styled', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const checkboxes = page.locator('.cmp-form-options input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 0) {
      for (let i = 0; i < Math.min(checkboxCount, 3); i++) {
        const checkbox = checkboxes.nth(i);
        await expect(checkbox).toBeVisible();

        // Check computed size
        const width = await checkbox.evaluate(el => el.offsetWidth);
        const height = await checkbox.evaluate(el => el.offsetHeight);
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
      }
    }
  });

  test('[FO-VISUAL-003] @visual Radio buttons are properly styled', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const radios = page.locator('.cmp-form-options input[type="radio"]');
    const radioCount = await radios.count();

    if (radioCount > 0) {
      for (let i = 0; i < Math.min(radioCount, 3); i++) {
        const radio = radios.nth(i);
        await expect(radio).toBeVisible();

        // Check computed size
        const width = await radio.evaluate(el => el.offsetWidth);
        expect(width).toBeGreaterThan(0);
      }
    }
  });

  test('[FO-VISUAL-004] @visual Form labels are properly associated', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const labels = page.locator('.cmp-form-options label');
    const labelCount = await labels.count();

    for (let i = 0; i < labelCount; i++) {
      const label = labels.nth(i);
      const htmlFor = await label.getAttribute('for');

      // Label should be associated with an input
      expect(htmlFor).toBeTruthy();

      // Corresponding input should exist
      const input = page.locator(`#${htmlFor}`);
      await expect(input).toBeVisible();
    }
  });

  test('[FO-VISUAL-005] @visual Select dropdown styling is correct', async ({ page }) => {
    const pom = new FormOptionsPage(page);
    await pom.navigate(BASE());

    const selects = page.locator('.cmp-form-options select');
    const selectCount = await selects.count();

    if (selectCount > 0) {
      const select = selects.first();
      await expect(select).toBeVisible();

      // Check that options are accessible
      const options = select.locator('option');
      expect(await options.count()).toBeGreaterThan(0);
    }
  });
});
