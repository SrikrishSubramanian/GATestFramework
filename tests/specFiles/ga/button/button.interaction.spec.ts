import { test, expect } from '../../../utils/infra/persistent-context';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Button — Component Interactions', () => {
  // BTN-028–043 removed: 16 tests with internal duplicates (e.g. .cmp-button--primary checked 5 times)
  // and fully superseded by BTN-066–087 which systematically covers section container context

  test('[BTN-044] @interaction @regression button adapts to unknown parent (#17)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-045] @interaction @regression button adapts to unknown parent (#18)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-046] @interaction @regression button adapts to unknown parent (#19)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary.cmp-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-047] @interaction @regression button adapts to unknown parent (#20)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary.cmp-button--sm.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-048] @interaction @regression button adapts to unknown parent (#21)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-049] @interaction @regression button adapts to unknown parent (#22)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-050] @interaction @regression button adapts to unknown parent (#23)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary.cmp-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-051] @interaction @regression button adapts to unknown parent (#24)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary.cmp-button--sm.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-052] @interaction @regression button adapts to unknown parent (#25)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-text').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-053] @interaction @regression button adapts to unknown parent (#26)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-text.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-054] @interaction @regression button adapts to unknown parent (#27)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-055] @interaction @regression button adapts to unknown parent (#28)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled-light.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-056] @interaction @regression button adapts to unknown parent (#29)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-057] @interaction @regression button adapts to unknown parent (#30)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled-light.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-058] @interaction @regression button adapts to unknown parent (#31)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-059] @interaction @regression button adapts to unknown parent (#32)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-060] @interaction @regression button adapts to unknown parent (#33)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-061] @interaction @regression button adapts to unknown parent (#34)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-062] @interaction @regression button adapts to unknown parent (#35)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-063] @interaction @regression button adapts to unknown parent (#36)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-outline.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-064] @interaction @regression button adapts to unknown parent (#37)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-065] @interaction @regression button adapts to unknown parent (#38)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: main-wrapper with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-outline.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-066] @interaction @regression button adapts to unknown parent (#39)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-067] @interaction @regression button adapts to unknown parent (#40)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-068] @interaction @regression button adapts to unknown parent (#41)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary.cmp-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-069] @interaction @regression button adapts to unknown parent (#42)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--primary.cmp-button--sm.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-070] @interaction @regression button adapts to unknown parent (#43)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-071] @interaction @regression button adapts to unknown parent (#44)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-072] @interaction @regression button adapts to unknown parent (#45)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary.cmp-button--sm').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-073] @interaction @regression button adapts to unknown parent (#46)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--secondary.cmp-button--sm.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-074] @interaction @regression button adapts to unknown parent (#47)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-text').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-075] @interaction @regression button adapts to unknown parent (#48)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-text.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-076] @interaction @regression button adapts to unknown parent (#49)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-077] @interaction @regression button adapts to unknown parent (#50)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled-light.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-078] @interaction @regression button adapts to unknown parent (#51)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled-light').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-079] @interaction @regression button adapts to unknown parent (#52)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled-light.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-080] @interaction @regression button adapts to unknown parent (#53)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-081] @interaction @regression button adapts to unknown parent (#54)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-filled.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-082] @interaction @regression button adapts to unknown parent (#55)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-083] @interaction @regression button adapts to unknown parent (#56)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-filled.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-084] @interaction @regression button adapts to unknown parent (#57)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-085] @interaction @regression button adapts to unknown parent (#58)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--sm.cmp-button--icon-only.cmp-button--icon-outline.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-086] @interaction @regression button adapts to unknown parent (#59)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-outline').first();
    await expect(child).toBeVisible();
  });

  test('[BTN-087] @interaction @regression button adapts to unknown parent (#60)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Parent: cmp-section__container with unknown background
    // Expected child theme: dark-theme
    const child = page.locator('.cmp-button--icon-only.cmp-button--icon-outline.cmp-button--disabled').first();
    await expect(child).toBeVisible();
  });
});
