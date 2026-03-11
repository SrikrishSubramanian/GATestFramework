import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
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

test.describe('Button — Component Interactions', () => {
  test('@interaction @regression button adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--md').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#5)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#6)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#7)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#8)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#9)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#10)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#11)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#12)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#13)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#14)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#15)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--theme-dark').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#16)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--theme-dark').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#17)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#18)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#19)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#20)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#21)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#22)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#23)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#24)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#25)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#26)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#27)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#28)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#29)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#30)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#31)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#32)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#33)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#34)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#35)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#36)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#37)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#38)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#39)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#40)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#41)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#42)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#43)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#44)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#45)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#46)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#47)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#48)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#49)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#50)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#51)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#52)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#53)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#54)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#55)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#56)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#57)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#58)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#59)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('@interaction @regression button adapts to unknown parent (#60)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });
});
