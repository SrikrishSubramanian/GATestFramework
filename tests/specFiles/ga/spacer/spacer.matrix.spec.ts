import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { SpacerPage } from '../../../pages/ga/components/spacerPage';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';

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

test.describe('Spacer — State Matrix', () => {
  // Verified against the live style guide page (/style-guide/components/spacer.html): the
  // cmp-spacer--<modifier> class lives on the *parent* wrapper, not on .cmp-spacer itself
  // (.cmp-spacer's own class is always just "cmp-spacer"), so scoping requires a descendant
  // selector. Medium is the default and its wrapper carries no size modifier at all.
  const sizes: { name: string; selector: string }[] = [
    { name: 'small', selector: '.cmp-spacer--small .cmp-spacer' },
    { name: 'medium', selector: '.spacer:not([class*="cmp-spacer--"]) .cmp-spacer' },
    { name: 'large', selector: '.cmp-spacer--large .cmp-spacer' },
    { name: 'xl', selector: '.cmp-spacer--xlarge .cmp-spacer' },
  ];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const size of sizes) {
    for (const viewport of viewports) {
      test(`[SPACER-MATRIX-${size.name}-${viewport.name}] @matrix @regression Spacer (${size.name}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        const pom = new SpacerPage(page);
        await pom.navigate(BASE());

        const spacer = page.locator(size.selector).first();
        await expect(spacer).toBeVisible({ timeout: 10000 });

        const height = await spacer.evaluate(el => el.offsetHeight);
        expect(height).toBeGreaterThan(0);

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
      });
    }
  }
});

