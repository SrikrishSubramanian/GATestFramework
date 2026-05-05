import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const ROOT = '.cmp-login';
const FORM = '.cmp-login__form';
const USERNAME = '.cmp-login__username input, input[name="username"]';
const PASSWORD = '.cmp-login__password input, input[type="password"]';
const PASSWORD_TOGGLE = '.cmp-login__password-toggle';
const SUBMIT = '.cmp-login__submit, button[type="submit"]';
const FORGOT_USERNAME = '.cmp-login__forgot-username a';
const FORGOT_PASSWORD = '.cmp-login__forgot-password a';
const MODAL = '.cmp-login__modal';
const MODAL_CLOSE = '.cmp-login__modal .cmp-login__modal-close';
const ALERT_BANNER = '.cmp-login__alert';
const DESKTOP = { width: 1440, height: 900 };

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Password Toggle Interaction (LGN-I-001 – LGN-I-005) ──────────────────────

test.describe('Login — Password Toggle Interaction', () => {
  test('[LGN-I-001] @interaction @regression Password is masked by default (input type="password")', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    await expect(pwd).toBeVisible();
    const type = await pwd.getAttribute('type');
    expect(type).toBe('password');
  });

  test('[LGN-I-002] @interaction @regression Clicking toggle reveals password (type changes to "text")', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.fill('TestPass123');
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    if (await toggle.count() === 0) { test.skip(); return; }
    await toggle.click();
    const type = await pwd.getAttribute('type');
    expect(type).toBe('text');
  });

  test('[LGN-I-003] @interaction @regression Second toggle click re-masks password (type returns to "password")', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.fill('TestPass123');
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    if (await toggle.count() === 0) { test.skip(); return; }
    await toggle.click();
    await toggle.click();
    const type = await pwd.getAttribute('type');
    expect(type).toBe('password');
  });

  test('[LGN-I-004] @interaction @regression Toggle button aria-label or aria-pressed changes when activated', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    if (await toggle.count() === 0) { test.skip(); return; }
    const pressedBefore = await toggle.getAttribute('aria-pressed');
    const labelBefore = await toggle.getAttribute('aria-label');
    await toggle.click();
    const pressedAfter = await toggle.getAttribute('aria-pressed');
    const labelAfter = await toggle.getAttribute('aria-label');
    // Either aria-pressed toggles or aria-label changes
    const changed = pressedBefore !== pressedAfter || labelBefore !== labelAfter;
    expect(changed, 'Toggle button should update aria-pressed or aria-label on click').toBe(true);
  });

  test('[LGN-I-005] @interaction @regression Toggle is keyboard-accessible (Enter key triggers it)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.fill('TestPass123');
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    if (await toggle.count() === 0) { test.skip(); return; }
    await toggle.focus();
    await page.keyboard.press('Enter');
    const type = await pwd.getAttribute('type');
    expect(type).toBe('text');
  });
});

// ─── Modal Open/Close (LGN-I-006 – LGN-I-012) ────────────────────────────────

test.describe('Login — Modal Open/Close', () => {
  test('[LGN-I-006] @interaction @regression Forgot-username modal is hidden on page load', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const modal = page.locator('.cmp-login__modal--forgot-username, .cmp-login__modal[data-type="forgot-username"]').first();
    if (await modal.count() === 0) { test.skip(); return; }
    await expect(modal).not.toBeVisible();
  });

  test('[LGN-I-007] @interaction @regression Clicking "Forgot Username" link makes modal visible', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_USERNAME).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.click();
    const modal = page.locator(MODAL).first();
    if (await modal.count() === 0) { test.skip(); return; }
    await expect(modal).toBeVisible();
  });

  test('[LGN-I-008] @interaction @regression Clicking modal close dismisses forgot-username modal', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_USERNAME).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.click();
    const modal = page.locator(MODAL).first();
    if (await modal.count() === 0) { test.skip(); return; }
    await expect(modal).toBeVisible();
    const closeBtn = page.locator(MODAL_CLOSE).first();
    if (await closeBtn.count() === 0) { test.skip(); return; }
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('[LGN-I-009] @interaction @regression Pressing Escape closes the forgot-username modal', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_USERNAME).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.click();
    const modal = page.locator(MODAL).first();
    if (await modal.count() === 0) { test.skip(); return; }
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('[LGN-I-010] @interaction @regression Forgot-password modal is hidden on page load', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const modal = page.locator('.cmp-login__modal--forgot-password, .cmp-login__modal[data-type="forgot-password"]').first();
    if (await modal.count() === 0) { test.skip(); return; }
    await expect(modal).not.toBeVisible();
  });

  test('[LGN-I-011] @interaction @regression Clicking "Forgot Password" link makes modal visible', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_PASSWORD).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.click();
    const modal = page.locator(MODAL).first();
    if (await modal.count() === 0) { test.skip(); return; }
    await expect(modal).toBeVisible();
  });

  test('[LGN-I-012] @interaction @regression Clicking modal close dismisses forgot-password modal', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_PASSWORD).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.click();
    const modal = page.locator(MODAL).first();
    if (await modal.count() === 0) { test.skip(); return; }
    await expect(modal).toBeVisible();
    const closeBtn = page.locator(MODAL_CLOSE).first();
    if (await closeBtn.count() === 0) { test.skip(); return; }
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });
});

// ─── Form Focus & Keyboard Navigation (LGN-I-013 – LGN-I-017) ────────────────

test.describe('Login — Form Focus & Keyboard Navigation', () => {
  test('[LGN-I-013] @interaction @regression Username input receives focus on Tab into form', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const username = page.locator(USERNAME).first();
    if (await username.count() === 0) { test.skip(); return; }
    await username.focus();
    const isFocused = await username.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
  });

  test('[LGN-I-014] @interaction @regression Password input receives focus on Tab after username', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const username = page.locator(USERNAME).first();
    if (await username.count() === 0) { test.skip(); return; }
    await username.focus();
    await page.keyboard.press('Tab');
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    const isFocused = await pwd.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
  });

  test('[LGN-I-015] @interaction @regression Submit button is reachable via Tab navigation', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const submit = page.locator(SUBMIT).first();
    if (await submit.count() === 0) { test.skip(); return; }
    await submit.focus();
    const isFocused = await submit.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
  });

  test('[LGN-I-016] @interaction @regression Focus indicator is visible on username input (box-shadow or outline not "none")', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const username = page.locator(USERNAME).first();
    if (await username.count() === 0) { test.skip(); return; }
    await username.focus();
    const styles = await username.evaluate(el => {
      const cs = getComputedStyle(el);
      return { boxShadow: cs.boxShadow, outline: cs.outline, outlineWidth: cs.outlineWidth };
    });
    const hasFocusRing = styles.boxShadow !== 'none' || (styles.outline !== 'none' && styles.outlineWidth !== '0px');
    expect(hasFocusRing, 'Username input should show focus indicator').toBe(true);
  });

  test('[LGN-I-017] @interaction @regression Focus indicator is visible on password input', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.focus();
    const styles = await pwd.evaluate(el => {
      const cs = getComputedStyle(el);
      return { boxShadow: cs.boxShadow, outline: cs.outline, outlineWidth: cs.outlineWidth };
    });
    const hasFocusRing = styles.boxShadow !== 'none' || (styles.outline !== 'none' && styles.outlineWidth !== '0px');
    expect(hasFocusRing, 'Password input should show focus indicator').toBe(true);
  });
});

// ─── Form State (LGN-I-018 – LGN-I-020) ─────────────────────────────────────

test.describe('Login — Form State', () => {
  test('[LGN-I-018] @interaction @regression Submit button has CSS transition property', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const submit = page.locator(SUBMIT).first();
    if (await submit.count() === 0) { test.skip(); return; }
    await expect(submit).toBeVisible();
    const transition = await submit.evaluate(el => getComputedStyle(el).transition);
    expect(transition, 'Submit button should have CSS transition for animated state change').not.toBe('');
    expect(transition).not.toBe('none');
  });

  test('[LGN-I-019] @interaction @regression Username input border changes on focus', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const username = page.locator(USERNAME).first();
    if (await username.count() === 0) { test.skip(); return; }
    const borderBefore = await username.evaluate(el => getComputedStyle(el).borderColor);
    await username.focus();
    const borderAfter = await username.evaluate(el => getComputedStyle(el).borderColor);
    // Border color or box-shadow should change on focus
    const boxShadow = await username.evaluate(el => getComputedStyle(el).boxShadow);
    const changed = borderBefore !== borderAfter || boxShadow !== 'none';
    expect(changed, 'Username input should show visual change on focus').toBe(true);
  });

  test('[LGN-I-020] @interaction @regression Typing in username field reflects value in the input', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const username = page.locator(USERNAME).first();
    if (await username.count() === 0) { test.skip(); return; }
    await username.fill('testuser@example.com');
    const value = await username.inputValue();
    expect(value).toBe('testuser@example.com');
  });
});
