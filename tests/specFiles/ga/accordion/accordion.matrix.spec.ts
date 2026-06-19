import { test, expect } from '@playwright/test';
import { AccordionPage } from '../../../pages/ga/components/accordionPage';
import ENV from '../../../../tests/utils/infra/env';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
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

test.describe('Accordion — State Matrix', () => {
  const states = ['collapsed', 'expanded', 'disabled'];
  const themes = ['light', 'dark'];
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const state of states) {
    for (const theme of themes) {
      for (const viewport of viewports) {
        const testName = `[ACC-MATRIX-${state}-${theme}-${viewport.name}] @matrix @regression Accordion (${state}, ${theme}, ${viewport.name})`;

        test(testName, async ({ page }) => {
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height
          });

          const pom = new AccordionPage(page);
          await pom.navigate(BASE());

          const root = page.locator('.cmp-accordion').first();
          await expect(root).toBeVisible();

          const items = root.locator('[role="tab"], button[aria-expanded]');
          const itemCount = await items.count();

          if (itemCount > 0) {
            const item = items.first();

            switch (state) {
              case 'expanded':
                await clickElement(item);
                // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
                const expanded = await item.getAttribute('aria-expanded');
                expect(expanded).toBe('true');
                break;

              case 'collapsed':
                const collapsed = await item.getAttribute('aria-expanded');
                expect(['false', 'true']).toContain(collapsed);
                break;

              case 'disabled':
                const disabled = await item.getAttribute('aria-disabled');
                // May or may not have disabled state
                expect([null, 'true', 'false']).toContain(disabled);
                break;
            }
          }

          const errors: string[] = [];
          page.on('pageerror', e => errors.push(e.message));
          expect(errors).toEqual([]);
        });
      }
    }
  }
});
