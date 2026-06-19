import { test, expect } from '@playwright/test';
import { BrandRelationshipPage } from '../../../pages/ga/components/brandRelationshipPage';
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

test.describe('Brand Relationship — Happy Path', () => {
  test('[BR-001] @smoke @regression Brand Relationship component renders', async ({ page }) => {
    const pom = new BrandRelationshipPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-brand-relationship').first();
    await expect(root).toBeVisible();
  });

  test('[BR-002] @regression Brand Relationship content displays correctly', async ({ page }) => {
    const pom = new BrandRelationshipPage(page);
    await pom.navigate(BASE());
    const content = page.locator('.cmp-brand-relationship__content');
    await expect(content).toBeVisible();
  });
});

test.describe('Brand Relationship — Responsive', () => {
  test.describe.configure({ retries: 1 });

  test('[BR-006] @mobile @regression Brand Relationship adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const pom = new BrandRelationshipPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-brand-relationship').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Brand Relationship — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[BR-010] @a11y @wcag22 @regression Brand Relationship passes axe-core scan', async ({ page }) => {
    const pom = new BrandRelationshipPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-brand-relationship')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
