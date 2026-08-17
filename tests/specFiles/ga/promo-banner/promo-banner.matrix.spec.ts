import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl, deployFixture } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  // resolveComponentUrl() resolves to the test-fixtures path (fixture exists
  // for this component) — that path 404s until the fixture is deployed. Assert
  // here so a deploy race/failure fails fast instead of hanging on later waits.
  const deployResult = await deployFixture('promo-banner', page);
  expect(deployResult.deployed, `Fixture deploy failed: ${deployResult.message}`).toBe(true);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Promo Banner — State Matrix', () => {
  const layouts = ['default', 'full-width'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const layout of layouts) {
    for (const viewport of viewports) {
      test(`[PROMO-MATRIX-${layout}-${viewport.name}] @matrix @regression Promo Banner (${layout}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        const url = resolveComponentUrl('promo-banner');
    await page.goto(url, { waitUntil: 'domcontentloaded' });

        const root = page.locator('.cmp-promo-banner').first();
        await expect(root).toBeVisible({ timeout: 10000 });

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
      });
    }
  }
});

