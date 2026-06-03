import { test } from '@playwright/test';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { DomProbe } from '../../../utils/infra/dom-probe';
import ENV from '../../../utils/infra/env';

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
