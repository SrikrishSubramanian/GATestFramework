import { test } from '@playwright/test';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import { DomProbe } from '../../../../tests/utils/infra/dom-probe';
import ENV from '../../../../tests/utils/infra/env';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../../tests/utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test('probe button style guide DOM', async ({ page }) => {
  await loginToAEMAuthor(page);

  const probe = new DomProbe(page);
  await probe.navigate('button', BASE());

  const result = await probe.probe('.button', [
    '.cmp-button',
    '[class*="ga-button"]',
  ]);

  DomProbe.log(result);
});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});
