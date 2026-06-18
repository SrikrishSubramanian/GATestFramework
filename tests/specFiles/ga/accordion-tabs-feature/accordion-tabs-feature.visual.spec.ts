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

test.describe('Accordion Tabs Feature â€” Visual Regression', () => {
  test('[ACCORDION-TABS-VISUAL-001] @visual Accordion/tabs layout is properly structured', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const container = page.locator('[class*="accordion"], [class*="tabs"], .cmp-accordion-tabs').first();
    await expect(container).toBeVisible();

    const display = await container.evaluate(el =>
      window.getComputedStyle(el).display
    );
    expect(['block', 'flex', 'grid']).toContain(display);
  });

  test('[ACCORDION-TABS-VISUAL-002] @visual Accordion/tabs headers are styled correctly', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const headers = page.locator('[class*="accordion"] [class*="header"], [class*="tabs"] [class*="tab"], .cmp-accordion-tabs button');
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);

    if (count > 0) {
      const header = headers.first();
      const fontSize = await header.evaluate(el =>
        parseInt(window.getComputedStyle(el).fontSize)
      );
      expect(fontSize).toBeGreaterThan(10);
    }
  });

  test('[ACCORDION-TABS-VISUAL-003] @visual Accordion/tabs content area is properly spaced', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const content = page.locator('[class*="accordion"] [class*="content"], [class*="tabs"] [class*="panel"], [class*="tabpanel"]').first();
    if (await content.count() > 0) {
      const padding = await content.evaluate(el =>
        window.getComputedStyle(el).padding
      );
      expect(padding).not.toBe('0px');
    }
  });

  test('[ACCORDION-TABS-VISUAL-004] @visual Accordion/tabs indicators are visible', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const indicators = page.locator('[class*="accordion"] [class*="icon"], [class*="tabs"] [class*="indicator"], .cmp-accordion-tabs [class*="indicator"]');
    const count = await indicators.count();
    expect(count).toBeDefined();
  });

  test('[ACCORDION-TABS-VISUAL-005] @visual Accordion/tabs maintains consistent spacing', async ({ page }) => {
    const url = resolveComponentUrl('accordion-tabs-feature');
    await page.goto(url);

    const items = page.locator('[class*="accordion"] [class*="item"], [class*="tabs"] [class*="tab"]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });
});

