import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('TeaserCard — Visual Regression', () => {
  test('@visual @regression Desktop: full component page screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-teaser-card').first();
    await expect(el).toHaveScreenshot('teaser-card-desktop.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression @mobile Mobile: screenshot matches baseline at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-teaser-card').first();
    await expect(el).toHaveScreenshot('teaser-card-mobile.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Tablet: screenshot matches baseline at 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const el = page.locator('.cmp-teaser-card').first();
    await expect(el).toHaveScreenshot('teaser-card-tablet.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression White color variant screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const whiteCard = page.locator('.cmp-teaser-card.cmp-teaser-card--color-white').first();
    if (await whiteCard.count() === 0) { test.skip(); return; }
    await expect(whiteCard).toHaveScreenshot('teaser-card-color-white.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Slate color variant screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const slateCard = page.locator('.cmp-teaser-card.cmp-teaser-card--color-slate').first();
    if (await slateCard.count() === 0) { test.skip(); return; }
    await expect(slateCard).toHaveScreenshot('teaser-card-color-slate.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Rectangle image style screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());
    const rectCard = page.locator('.cmp-teaser-card.cmp-teaser-card--image-style-rectangle').first();
    if (await rectCard.count() === 0) { test.skip(); return; }
    await expect(rectCard).toHaveScreenshot('teaser-card-image-rectangle.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
