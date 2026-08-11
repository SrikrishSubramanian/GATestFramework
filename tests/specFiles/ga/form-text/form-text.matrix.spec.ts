import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl, deployFixture } from '../../../utils/infra/content-fixture-deployer';
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

test.describe('Form Text — State Matrix', () => {
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const viewport of viewports) {
    test(`[FORMTEXT-MATRIX-${viewport.name}] @matrix @regression Form text responsive (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: 600 });

      await deployFixture('form-text', page);
      const url = resolveComponentUrl('form-text');
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const textInput = page.locator('input[type="text"], .cmp-form-text input').first();
      if (await textInput.count() > 0) {
        await expect(textInput).toBeVisible({ timeout: 10000 });

        const width = // ?? TODO: Replace with measurement-utils
    await textInput.evaluate(el => el.offsetWidth);
        expect(width).toBeLessThanOrEqual(viewport.width);
      }

      const errors: string[] = [];
      page.on('pageerror', e => errors.push(e.message));
      expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
  }
});

