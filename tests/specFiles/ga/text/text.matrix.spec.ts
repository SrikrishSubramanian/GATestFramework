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

test.describe('Text â€” State Matrix', () => {
  const sizes = ['small', 'medium', 'large'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const size of sizes) {
    for (const viewport of viewports) {
      test(`[TEXT-MATRIX-${size}-${viewport.name}] @matrix @regression Text (${size}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await loginToAEMAuthor(page);
        const url = resolveComponentUrl('text');
    await page.goto(url, { waitUntil: 'networkidle' });

        const root = page.locator('.cmp-text').first();
        await expect(root).toBeVisible();

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
      });
    }
  }
});

