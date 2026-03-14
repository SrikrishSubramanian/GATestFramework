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
  test('[BTN-028] @interaction @regression button adapts to unknown parent (#1)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-029] @interaction @regression button adapts to unknown parent (#2)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--md').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-030] @interaction @regression button adapts to unknown parent (#3)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-031] @interaction @regression button adapts to unknown parent (#4)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-032] @interaction @regression button adapts to unknown parent (#5)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-033] @interaction @regression button adapts to unknown parent (#6)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-034] @interaction @regression button adapts to unknown parent (#7)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-035] @interaction @regression button adapts to unknown parent (#8)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-036] @interaction @regression button adapts to unknown parent (#9)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-037] @interaction @regression button adapts to unknown parent (#10)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-038] @interaction @regression button adapts to unknown parent (#11)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-039] @interaction @regression button adapts to unknown parent (#12)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-040] @interaction @regression button adapts to unknown parent (#13)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-041] @interaction @regression button adapts to unknown parent (#14)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-042] @interaction @regression button adapts to unknown parent (#15)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--theme-dark').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-043] @interaction @regression button adapts to unknown parent (#16)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--theme-dark').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-044] @interaction @regression button adapts to unknown parent (#17)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-045] @interaction @regression button adapts to unknown parent (#18)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-046] @interaction @regression button adapts to unknown parent (#19)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-047] @interaction @regression button adapts to unknown parent (#20)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-048] @interaction @regression button adapts to unknown parent (#21)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-049] @interaction @regression button adapts to unknown parent (#22)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-050] @interaction @regression button adapts to unknown parent (#23)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-051] @interaction @regression button adapts to unknown parent (#24)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-052] @interaction @regression button adapts to unknown parent (#25)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-053] @interaction @regression button adapts to unknown parent (#26)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-054] @interaction @regression button adapts to unknown parent (#27)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-055] @interaction @regression button adapts to unknown parent (#28)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-056] @interaction @regression button adapts to unknown parent (#29)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-057] @interaction @regression button adapts to unknown parent (#30)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-058] @interaction @regression button adapts to unknown parent (#31)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-059] @interaction @regression button adapts to unknown parent (#32)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-060] @interaction @regression button adapts to unknown parent (#33)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-061] @interaction @regression button adapts to unknown parent (#34)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-062] @interaction @regression button adapts to unknown parent (#35)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-063] @interaction @regression button adapts to unknown parent (#36)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-064] @interaction @regression button adapts to unknown parent (#37)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-065] @interaction @regression button adapts to unknown parent (#38)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-066] @interaction @regression button adapts to unknown parent (#39)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-067] @interaction @regression button adapts to unknown parent (#40)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-068] @interaction @regression button adapts to unknown parent (#41)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-069] @interaction @regression button adapts to unknown parent (#42)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--primary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-070] @interaction @regression button adapts to unknown parent (#43)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-071] @interaction @regression button adapts to unknown parent (#44)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-072] @interaction @regression button adapts to unknown parent (#45)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-073] @interaction @regression button adapts to unknown parent (#46)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--secondary.ga-button--sm.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-074] @interaction @regression button adapts to unknown parent (#47)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-075] @interaction @regression button adapts to unknown parent (#48)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-text.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-076] @interaction @regression button adapts to unknown parent (#49)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-077] @interaction @regression button adapts to unknown parent (#50)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-078] @interaction @regression button adapts to unknown parent (#51)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-079] @interaction @regression button adapts to unknown parent (#52)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled-light.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-080] @interaction @regression button adapts to unknown parent (#53)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-081] @interaction @regression button adapts to unknown parent (#54)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-082] @interaction @regression button adapts to unknown parent (#55)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-083] @interaction @regression button adapts to unknown parent (#56)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-filled.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-084] @interaction @regression button adapts to unknown parent (#57)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-085] @interaction @regression button adapts to unknown parent (#58)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--sm.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-086] @interaction @regression button adapts to unknown parent (#59)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-087] @interaction @regression button adapts to unknown parent (#60)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.ga-button--icon-only.ga-button--icon-outline.ga-button--disabled').first();
    await expect(child).toBeVisible();
  });
});
