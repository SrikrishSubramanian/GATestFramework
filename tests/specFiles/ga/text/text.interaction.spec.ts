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
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});

test.describe('Text â€” Interactions', () => {
  test('[TEXT-INTERACTION-001] @interaction @regression Text links are clickable', async ({ page }) => {
    const url = resolveComponentUrl('text');
    await page.goto(url);

    const links = page.locator('.cmp-text a');
    const count = await links.count();

    if (count > 0) {
      const link = links.first();
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('[TEXT-INTERACTION-002] @interaction @regression Text content is selectable', async ({ page }) => {
    const url = resolveComponentUrl('text');
    await page.goto(url);

    const text = page.locator('.cmp-text').first();
    await expect(text).toBeVisible();

    // Verify text can be selected
    const userSelect = await text.evaluate(el =>
      window.getComputedStyle(el).userSelect
    );
    expect(userSelect).not.toBe('none');
  });

  test('[TEXT-INTERACTION-003] @interaction @regression Text keyboard navigation', async ({ page }) => {
    const url = resolveComponentUrl('text');
    await page.goto(url);

    const links = page.locator('.cmp-text a');
    if (await links.count() > 0) {
      const firstLink = links.first();
      await firstLink.focus();

      const isFocused = await firstLink.evaluate(el =>
        document.activeElement === el
      );
      expect(isFocused).toBeTruthy();
    }
  });

  test('[TEXT-INTERACTION-004] @interaction @regression Text code blocks display', async ({ page }) => {
    const url = resolveComponentUrl('text');
    await page.goto(url);

    const codeBlocks = page.locator('.cmp-text code, .cmp-text pre');
    const count = await codeBlocks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 2); i++) {
        await expect(codeBlocks.nth(i)).toBeVisible();
      }
    }
  });

  test('[TEXT-INTERACTION-005] @interaction @regression Text tables render correctly', async ({ page }) => {
    const url = resolveComponentUrl('text');
    await page.goto(url);

    const tables = page.locator('.cmp-text table');
    const count = await tables.count();

    if (count > 0) {
      const rows = tables.first().locator('tr');
      expect(await rows.count()).toBeGreaterThan(0);
    }
  });
});

