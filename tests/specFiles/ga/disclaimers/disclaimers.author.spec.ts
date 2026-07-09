import { test, expect } from '@playwright/test';
import { DisclaimersPage } from '../../../pages/ga/components/disclaimersPage';
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

test.describe('Disclaimers — Happy Path', () => {
  test('[DISC-001] @smoke @regression Disclaimers component renders', async ({ page }) => {
    const pom = new DisclaimersPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-disclaimers').first();
    await expect(root).toBeVisible();
  });

  test('[DISC-002] @regression Disclaimer text displays correctly', async ({ page }) => {
    const pom = new DisclaimersPage(page);
    await pom.navigate(BASE());
    const text = page.locator('.cmp-disclaimers__text');
    const count = await text.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Disclaimers — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[DISC-010] @a11y @wcag22 @regression Disclaimers passes axe-core scan', async ({ page }) => {
    const pom = new DisclaimersPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-disclaimers')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
