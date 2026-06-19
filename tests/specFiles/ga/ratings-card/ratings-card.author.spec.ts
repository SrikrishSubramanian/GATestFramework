import { test, expect } from '@playwright/test';
import { RatingsCardPage } from '../../../pages/ga/components/ratingsCardPage';
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

test.describe('Ratings Card — Happy Path', () => {
  test('[RC-001] @smoke @regression Ratings Card renders', async ({ page }) => {
    const pom = new RatingsCardPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-ratings-card').first();
    await expect(root).toBeVisible();
  });

  test('[RC-002] @regression Rating display shows correctly', async ({ page }) => {
    const pom = new RatingsCardPage(page);
    await pom.navigate(BASE());
    const rating = page.locator('.cmp-ratings-card__rating');
    await expect(rating).toBeVisible();
  });
});

test.describe('Ratings Card — Accessibility', () => {
  test.describe.configure({ retries: 1 });

  test('[RC-010] @a11y @wcag22 @regression Ratings Card passes axe-core scan', async ({ page }) => {
    const pom = new RatingsCardPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-ratings-card')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
