import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(`${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('Statistic — Visual Regression', () => {
  test('[STAT-061] @visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.cmp-statistic').first();
    await expect(el).toHaveScreenshot('statistic-desktop.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('[STAT-062] @visual @regression @mobile Mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.cmp-statistic').first();
    await expect(el).toHaveScreenshot('statistic-mobile.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('[STAT-063] @visual @regression Tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.cmp-statistic').first();
    await expect(el).toHaveScreenshot('statistic-tablet.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
