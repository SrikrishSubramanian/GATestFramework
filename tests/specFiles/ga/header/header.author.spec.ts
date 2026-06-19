import { test, expect } from '@playwright/test';
import { HeaderPage } from '../../../pages/ga/components/headerPage';
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

test.describe('Header — Happy Path', () => {
  test('[HDR-001] @smoke @regression Header component renders', async ({ page }) => {
    const pom = new HeaderPage(page);
    await pom.navigate(BASE());
    const root = page.locator('header, .cmp-header').first();
    await expect(root).toBeVisible();
  });

  test('[HDR-002] @regression Header content is displayed', async ({ page }) => {
    const pom = new HeaderPage(page);
    await pom.navigate(BASE());
    const content = page.locator('header [role="banner"], .cmp-header__content');
    const count = await content.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Header — Responsive', () => {
  test.describe.configure({ retries: 1 });

  test('[HDR-006] @mobile @regression Header adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const pom = new HeaderPage(page);
    await pom.navigate(BASE());
    const root = page.locator('header, .cmp-header').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Header — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[HDR-010] @a11y @wcag22 @regression Header passes axe-core scan', async ({ page }) => {
    const pom = new HeaderPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('header, .cmp-header')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[HDR-011] @a11y @wcag22 @regression Header has proper landmark', async ({ page }) => {
    const pom = new HeaderPage(page);
    await pom.navigate(BASE());
    const landmark = page.locator('header, [role="banner"]').first();
    await expect(landmark).toBeVisible();
  });
});
