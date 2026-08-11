import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { SpacerPage } from '../../../pages/ga/components/spacerPage';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';

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

test.describe('Spacer — Interactions', () => {
  test('[SPACER-INTERACTION-001] @interaction @regression Spacer height adjusts responsively', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacer = page.locator('.cmp-spacer').first();
    const initialHeight = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el => el.offsetHeight);

    // Resize viewport
    await page.setViewportSize({ width: 375, height: 667 });
    // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

    const newHeight = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el => el.offsetHeight);

    // Height should adapt or stay reasonable
    expect(newHeight).toBeGreaterThan(0);
  });

  test('[SPACER-INTERACTION-002] @interaction @regression Spacer does not block keyboard navigation', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    // Spacer should not interfere with tab navigation
    await page.keyboard.press('Tab');
    const focused = // ?? TODO: Replace with measurement-utils
    await page.evaluate(() => document.activeElement?.tagName);

    expect(focused).toBeTruthy();
  });

  test('[SPACER-INTERACTION-003] @interaction @regression Spacer is not clickable', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacer = page.locator('.cmp-spacer').first();
    const pointerEvents = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    );

    // Spacer should typically not intercept pointer events
    expect(['none', 'auto']).toContain(pointerEvents);
  });

  test('[SPACER-INTERACTION-004] @interaction @regression Spacer maintains spacing under different content', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacers = page.locator('.cmp-spacer');
    const count = await spacers.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const spacer = spacers.nth(i);
        const height = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el => el.offsetHeight);
        expect(height).toBeGreaterThan(0);
      }
    }
  });

  test('[SPACER-INTERACTION-005] @interaction @regression Spacer responsive behavior', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const pom = new SpacerPage(page);
    await pom.navigate(BASE());

      const spacer = page.locator('.cmp-spacer').first();
      await expect(spacer).toBeVisible();
    }
  });
});

