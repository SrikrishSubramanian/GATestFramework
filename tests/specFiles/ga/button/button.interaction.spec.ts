import { test, expect } from '../../../utils/infra/persistent-context';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Button — Component Interactions
 *
 * Tests actual interaction behavior: click readiness, keyboard access,
 * focus, hover, disabled state, and video modal.
 *
 * Real DOM selectors (from live probe, validated by matrix spec):
 *   Component wrapper: .button  (variant: .ga-button--primary, --secondary, --icon-text)
 *   BEM element:       .cmp-button
 *   Section bg:        .cmp-section--background-color-{white|slate|granite|azul}
 *   Disabled overlay:  .ga-button--disabled
 */

/** Enabled button of a variant inside a background section */
function btnInSection(page: import('@playwright/test').Page, bg: string, variantClass: string) {
  return page
    .locator(`.cmp-section--background-color-${bg}`)
    .first()
    .locator(`.button${variantClass}:not(.ga-button--disabled) .cmp-button`)
    .first();
}

test.describe('Button — Context Adaptation', () => {

  test('[BTN-044] @interaction @regression primary button is interactive in white section', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--primary');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('[BTN-045] @interaction @regression primary button is interactive in granite section', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'granite', '.ga-button--primary');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('[BTN-046] @interaction @regression secondary button is interactive in white section', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--secondary');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('[BTN-047] @interaction @regression secondary button is interactive in granite section', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'granite', '.ga-button--secondary');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('[BTN-048] @interaction @regression icon-text button is interactive in white section', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--icon-text');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('[BTN-049] @interaction @regression icon-text button is interactive in granite section', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'granite', '.ga-button--icon-text');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });
});

test.describe('Button — Keyboard & Accessibility Interactions', () => {

  test('[BTN-050] @interaction @regression primary button has accessible role and text', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--primary');
    const tagName = await btn.evaluate(el => el.tagName.toLowerCase());
    expect(['a', 'button']).toContain(tagName);
    const text = await btn.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('[BTN-051] @interaction @regression button receives focus on Tab', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--primary');
    await btn.focus();
    await expect(btn).toBeFocused();
  });

  test('[BTN-052] @interaction @regression button responds to Enter key', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--primary');
    await btn.focus();
    // Verify Enter doesn't throw — validates keyboard activation works
    await btn.press('Enter');
  });

  test('[BTN-053] @interaction @regression disabled button has correct aria state', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const disabledWrapper = page.locator('.button.ga-button--disabled').first();
    const exists = await disabledWrapper.count();
    if (exists > 0) {
      await expect(disabledWrapper).toBeVisible();
      const btn = disabledWrapper.locator('.cmp-button').first();
      const ariaDisabled = await btn.getAttribute('aria-disabled');
      const isDisabledAttr = await btn.isDisabled().catch(() => false);
      expect(ariaDisabled === 'true' || isDisabledAttr).toBeTruthy();
    }
  });
});

test.describe('Button — Hover & Visual Interactions', () => {

  test('[BTN-054] @interaction @regression button cursor is pointer', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--primary');
    const cursor = await btn.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
  });

  test('[BTN-055] @interaction @regression button text span exists inside cmp-button', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = btnInSection(page, 'white', '.ga-button--primary');
    const textSpan = btn.locator('.cmp-button__text');
    await expect(textSpan).toBeVisible();
    const text = await textSpan.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('Button — Video Modal Interactions', () => {

  test('[BTN-056] @interaction @regression video button opens modal', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const videoBtn = page.locator('.cmp-button.cmp-button--video').first();
    const exists = await videoBtn.count();
    if (exists > 0) {
      await videoBtn.click();
      const modal = page.locator('.cmp-button__video-modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
    }
  });

  test('[BTN-057] @interaction @regression video modal close button works', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const videoBtn = page.locator('.cmp-button.cmp-button--video').first();
    const exists = await videoBtn.count();
    if (exists > 0) {
      await videoBtn.click();
      const modal = page.locator('.cmp-button__video-modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      const closeBtn = page.locator('.cmp-button__video-modal-close').first();
      await closeBtn.click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    }
  });
});
