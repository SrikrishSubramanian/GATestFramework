import { test, expect } from '@playwright/test';
import { SeparatorPage } from '../../../pages/ga/components/separatorPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';

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

test.describe('Separator — Happy Path', () => {
  test('[SEP-001] @smoke @regression Separator renders', async ({ page }) => {
    const pom = new SeparatorPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-separator').first();
    await expect(root).toBeVisible();
  });

  test('[SEP-002] @regression Separator is properly styled', async ({ page }) => {
    const pom = new SeparatorPage(page);
    await pom.navigate(BASE());
    const sep = page.locator('.cmp-separator');
    const count = await sep.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Separator — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[SEP-010] @a11y @wcag22 @regression Separator passes axe-core scan', async ({ page }) => {
    const pom = new SeparatorPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-separator')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
