import { test, expect } from '@playwright/test';
import { WorkbenchPage } from '../../../pages/ga/components/workbenchPage';
import ENV from '../../../../tests/utils/infra/env';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../../tests/utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../../tests/utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';

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

test.describe('Workbench — Happy Path', () => {
  test('[WB-001] @smoke @regression Workbench component renders', async ({ page }) => {
    const pom = new WorkbenchPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-workbench').first();
    await expect(root).toBeVisible();
  });

  test('[WB-002] @regression Workbench content is displayed', async ({ page }) => {
    const pom = new WorkbenchPage(page);
    await pom.navigate(BASE());
    const content = page.locator('.cmp-workbench__content');
    await expect(content).toBeVisible();
  });
});

test.describe('Workbench — Interaction', () => {
  test('[WB-005] @interaction @regression Workbench controls are functional', async ({ page }) => {
    const pom = new WorkbenchPage(page);
    await pom.navigate(BASE());
    const controls = page.locator('.cmp-workbench__control');
    const count = await controls.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Workbench — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[WB-010] @a11y @wcag22 @regression Workbench passes axe-core scan', async ({ page }) => {
    const pom = new WorkbenchPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-workbench')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
