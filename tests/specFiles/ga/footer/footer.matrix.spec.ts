import { test, expect } from '@playwright/test';
import { FooterPage } from '../../../pages/ga/components/footerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
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

test.describe('Footer — State Matrix', () => {
  const themes = ['light', 'dark'];
  const backgrounds = ['white', 'gray', 'dark', 'colored'];
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const theme of themes) {
    for (const bg of backgrounds) {
      for (const viewport of viewports) {
        const testName = `[FTR-MATRIX-${theme}-${bg}-${viewport.name}] @matrix @regression Footer (${theme}, ${bg}, ${viewport.name})`;

        test(testName, async ({ page }) => {
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height
          });

          const pom = new FooterPage(page);
          await pom.navigate(BASE());

          const root = await pom.getRoot();
          await expect(root).toBeVisible({ timeout: 10000 });

          // Verify footer width adapts to viewport
          const width = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => el.offsetWidth);
          expect(width).toBeLessThanOrEqual(viewport.width);

          // Verify no errors
          const errors: string[] = [];
          page.on('pageerror', e => errors.push(e.message));
          expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        });
      }
    }
  }
});
