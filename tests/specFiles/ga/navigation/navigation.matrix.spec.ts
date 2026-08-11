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

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Navigation — State Matrix', () => {
  const types = ['horizontal', 'vertical'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const navType of types) {
    for (const viewport of viewports) {
      test(`[NAV-MATRIX-${navType}-${viewport.name}] @matrix @regression Navigation (${navType}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        await deployFixture('navigation', page);
        const url = resolveComponentUrl('navigation');
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // The header renders multiple nav elements (e.g. a hidden mobile drawer alongside the
        // visible bar) — scope to :visible so .first() doesn't lock onto a hidden decoy.
        const root = page.locator('.cmp-navigation:visible, nav:visible').first();
        await expect(root).toBeVisible({ timeout: 10000 });

        const links = root.locator('a');
        expect(await links.count()).toBeGreaterThan(0);

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
      });
    }
  }
});

