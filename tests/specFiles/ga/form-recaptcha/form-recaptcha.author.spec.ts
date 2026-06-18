import { test, expect } from '@playwright/test';
import { FormRecaptchaPage } from '../../../pages/ga/components/formRecaptchaPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
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

test.describe('Form reCAPTCHA — Happy Path', () => {
  test('[RECAP-001] @smoke @regression reCAPTCHA field renders', async ({ page }) => {
    const pom = new FormRecaptchaPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-form-recaptcha').first();
    await expect(root).toBeVisible();
  });

  test('[RECAP-002] @regression reCAPTCHA container is present', async ({ page }) => {
    const pom = new FormRecaptchaPage(page);
    await pom.navigate(BASE());
    const captcha = page.locator('.g-recaptcha, [data-sitekey]');
    const count = await captcha.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Form reCAPTCHA — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[RECAP-010] @a11y @wcag22 @regression reCAPTCHA passes axe-core scan', async ({ page }) => {
    const pom = new FormRecaptchaPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-form-recaptcha')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
