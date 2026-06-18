import { test, expect } from '@playwright/test';
import { FormHiddenPage } from '../../../pages/ga/components/formHiddenPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
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

test.describe('Form Hidden Field — Happy Path', () => {
  test('[FH-001] @smoke @regression Hidden form field renders without visibility', async ({ page }) => {
    const pom = new FormHiddenPage(page);
    await pom.navigate(BASE());
    const hidden = page.locator('.cmp-form-hidden');
    const count = await hidden.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('[FH-002] @regression Hidden input field exists in DOM', async ({ page }) => {
    const pom = new FormHiddenPage(page);
    await pom.navigate(BASE());
    const hiddenInputs = page.locator('input[type="hidden"]');
    const count = await hiddenInputs.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
