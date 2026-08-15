import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
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

test.describe('Breadcrumb — State Matrix', () => {
  const themeVariants = ['light', 'dark'];
  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  for (const theme of themeVariants) {
    for (const viewport of viewports) {
      test(`[BREAD-MATRIX-${theme}-${viewport.name}] @matrix @regression Breadcrumb (${theme}, ${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 600 });

        const url = resolveComponentUrl('breadcrumb');
    await page.goto(url, { waitUntil: 'domcontentloaded' });

        const root = page.locator('.cmp-breadcrumb').first();
        // breadcrumb.less:34-43 ("Hidden on mobile and tablet") intentionally sets display: none
        // below @ga-bp-desktop-min (1024px) — mobile (375px) and tablet (768px) are correctly
        // hidden entirely; only desktop (1440px) renders the breadcrumb.
        if (viewport.width < 1024) {
          await expect(root).toBeHidden({ timeout: 10000 });
        } else {
          await expect(root).toBeVisible({ timeout: 10000 });
          const items = root.locator('[role="listitem"], li');
          expect(await items.count()).toBeGreaterThan(0);
        }

        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
      });
    }
  }
});

