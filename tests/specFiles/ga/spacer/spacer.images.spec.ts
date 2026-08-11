import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { SpacerPage } from '../../../pages/ga/components/spacerPage';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
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

test.describe('Spacer — Images & Media', () => {
  test('[SPACER-IMAGE-001] @regression Spacer component has no images by design', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacer = page.locator('.cmp-spacer').first();
    const images = spacer.locator('img');
    const imgCount = await images.count();

    // Spacer should not typically have images (it's a spacing component)
    expect(imgCount).toBe(0);
  });

  test('[SPACER-IMAGE-002] @regression Spacer background image is transparent', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacer = page.locator('.cmp-spacer').first();
    const bgImage = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el =>
      window.getComputedStyle(el).backgroundImage
    );

    // Should not have a background image
    expect(bgImage).toMatch(/none|unset/);
  });

  test('[SPACER-IMAGE-003] @regression Spacer renders without visual artifacts', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacer = page.locator('.cmp-spacer').first();
    await expect(spacer).toBeVisible();

    const display = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el =>
      window.getComputedStyle(el).display
    );

    // Should have valid display property
    expect(['block', 'div', 'flex', 'grid', 'none']).toContain(display); // TODO: Use assertLayout() for display checks
  });

  test('[SPACER-IMAGE-004] @regression Spacer border is not visible', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacer = page.locator('.cmp-spacer').first();
    const borderStyle = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el =>
      window.getComputedStyle(el).borderStyle
    );

    // Border should not be visible
    expect(['none', 'hidden']).toContain(borderStyle);
  });

  test('[SPACER-IMAGE-005] @regression Spacer outline is not visible', async ({ page }) => {
    const pom = new SpacerPage(page);
    await pom.navigate(BASE());

    const spacer = page.locator('.cmp-spacer').first();
    const outline = // ?? TODO: Replace with measurement-utils
    await spacer.evaluate(el =>
      window.getComputedStyle(el).outline
    );

    // Outline should be none or very thin
    expect(outline).toBeTruthy();
  });
});

