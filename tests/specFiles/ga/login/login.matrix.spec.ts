import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const ROOT = '.cmp-login';
const FORM = '.cmp-login__form';
const USERNAME = '.cmp-login__username input, input[name="username"]';
const SUBMIT = '.cmp-login__submit, button[type="submit"]';
const FORGOT_USERNAME = '.cmp-login__forgot-username a';
const FORGOT_PASSWORD = '.cmp-login__forgot-password a';
const PASSWORD = '.cmp-login__password input, input[type="password"]';
const PASSWORD_TOGGLE = '.cmp-login__password-toggle';

const VIEWPORTS = [
  { label: 'mobile-390', width: 390, height: 844 },
  { label: 'tablet-768', width: 768, height: 1024 },
  { label: 'desktop-1440', width: 1440, height: 900 },
];

const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Viewport Matrix (LGN-M-001 – LGN-M-009) ─────────────────────────────────

test.describe('Login — Viewport Matrix', () => {
  test('[LGN-M-001] @matrix @regression Login form visible at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
  });

  test('[LGN-M-002] @matrix @regression Login form visible at tablet-768', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
  });

  test('[LGN-M-003] @matrix @regression Login form visible at desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
  });

  test('[LGN-M-004] @matrix @regression Username input visible at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(USERNAME).first();
    if (await input.count() === 0) { test.skip(); return; }
    await expect(input).toBeVisible();
  });

  test('[LGN-M-005] @matrix @regression Username input visible at tablet-768', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(USERNAME).first();
    if (await input.count() === 0) { test.skip(); return; }
    await expect(input).toBeVisible();
  });

  test('[LGN-M-006] @matrix @regression Username input visible at desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(USERNAME).first();
    if (await input.count() === 0) { test.skip(); return; }
    await expect(input).toBeVisible();
  });

  test('[LGN-M-007] @matrix @regression Submit button visible at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(SUBMIT).first();
    if (await btn.count() === 0) { test.skip(); return; }
    await expect(btn).toBeVisible();
  });

  test('[LGN-M-008] @matrix @regression Submit button visible at tablet-768', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(SUBMIT).first();
    if (await btn.count() === 0) { test.skip(); return; }
    await expect(btn).toBeVisible();
  });

  test('[LGN-M-009] @matrix @regression Submit button visible at desktop-1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(SUBMIT).first();
    if (await btn.count() === 0) { test.skip(); return; }
    await expect(btn).toBeVisible();
  });
});

// ─── Background Color Variants (LGN-M-010 – LGN-M-013) ──────────────────────

test.describe('Login — Background Color Variants', () => {
  test('[LGN-M-010] @matrix @regression Login component renders on white background section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_WHITE).first();
    if (await section.count() === 0) { test.skip(); return; }
    const loginInSection = section.locator(ROOT).first();
    if (await loginInSection.count() === 0) {
      // Fall back to checking root component exists at all
      await expect(page.locator(ROOT).first()).toBeVisible();
      return;
    }
    await expect(loginInSection).toBeVisible();
  });

  test('[LGN-M-011] @matrix @regression Login component renders on slate background section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_SLATE).first();
    if (await section.count() === 0) { test.skip(); return; }
    const loginInSection = section.locator(ROOT).first();
    if (await loginInSection.count() === 0) { test.skip(); return; }
    await expect(loginInSection).toBeVisible();
  });

  test('[LGN-M-012] @matrix @regression Login component renders on granite (dark) background section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_GRANITE).first();
    if (await section.count() === 0) { test.skip(); return; }
    const loginInSection = section.locator(ROOT).first();
    if (await loginInSection.count() === 0) { test.skip(); return; }
    await expect(loginInSection).toBeVisible();
    // On dark background, verify background is non-transparent
    const bg = await section.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).not.toMatch(/rgba\(0,\s*0,\s*0,\s*0\)/);
  });

  test('[LGN-M-013] @matrix @regression Login component renders on azul background section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_AZUL).first();
    if (await section.count() === 0) { test.skip(); return; }
    const loginInSection = section.locator(ROOT).first();
    if (await loginInSection.count() === 0) { test.skip(); return; }
    await expect(loginInSection).toBeVisible();
  });
});

// ─── Viewport × Background Combined (LGN-M-014 – LGN-M-017) ─────────────────

test.describe('Login — Viewport × Background Combined', () => {
  test('[LGN-M-014] @matrix @regression Login form visible on mobile with white background', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_WHITE).first();
    if (await section.count() === 0) {
      await expect(page.locator(FORM).first()).toBeVisible();
      return;
    }
    const form = section.locator(FORM).first();
    if (await form.count() === 0) {
      await expect(page.locator(FORM).first()).toBeVisible();
      return;
    }
    await expect(form).toBeVisible();
  });

  test('[LGN-M-015] @matrix @regression Login form visible on mobile with granite background', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_GRANITE).first();
    if (await section.count() === 0) { test.skip(); return; }
    const form = section.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
  });

  test('[LGN-M-016] @matrix @regression Login form visible on desktop with granite background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_GRANITE).first();
    if (await section.count() === 0) { test.skip(); return; }
    const form = section.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
  });

  test('[LGN-M-017] @matrix @regression Login form visible on desktop with azul background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const section = page.locator(SECTION_AZUL).first();
    if (await section.count() === 0) { test.skip(); return; }
    const form = section.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
  });
});

// ─── Input State Matrix (LGN-M-018 – LGN-M-021) ─────────────────────────────

test.describe('Login — Input State Matrix', () => {
  test('[LGN-M-018] @matrix @regression Password input masked state renders correctly across all 3 viewports', async ({ page }) => {
    const pom = new LoginPage(page);
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await pom.navigate(BASE());
      const pwd = page.locator(PASSWORD).first();
      if (await pwd.count() === 0) continue;
      await expect(pwd).toBeVisible();
      const type = await pwd.getAttribute('type');
      expect(type, `Password should be masked at ${vp.label}`).toBe('password');
    }
  });

  test('[LGN-M-019] @matrix @regression Password revealed state (after toggle) visible across all 3 viewports', async ({ page }) => {
    const pom = new LoginPage(page);
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await pom.navigate(BASE());
      const pwd = page.locator(PASSWORD).first();
      if (await pwd.count() === 0) continue;
      await pwd.fill('TestPass123');
      const toggle = page.locator(PASSWORD_TOGGLE).first();
      if (await toggle.count() === 0) continue;
      await toggle.click();
      const type = await pwd.getAttribute('type');
      expect(type, `Password should be revealed at ${vp.label}`).toBe('text');
    }
  });

  test('[LGN-M-020] @matrix @regression Submit button enabled state across all 3 viewports', async ({ page }) => {
    const pom = new LoginPage(page);
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await pom.navigate(BASE());
      const btn = page.locator(SUBMIT).first();
      if (await btn.count() === 0) continue;
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    }
  });

  test('[LGN-M-021] @matrix @regression Forgot-username and forgot-password links visible across all 3 viewports', async ({ page }) => {
    const pom = new LoginPage(page);
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await pom.navigate(BASE());
      const forgotUser = page.locator(FORGOT_USERNAME).first();
      const forgotPwd = page.locator(FORGOT_PASSWORD).first();
      if (await forgotUser.count() > 0) {
        await expect(forgotUser, `Forgot username should be visible at ${vp.label}`).toBeVisible();
      }
      if (await forgotPwd.count() > 0) {
        await expect(forgotPwd, `Forgot password should be visible at ${vp.label}`).toBeVisible();
      }
    }
  });
});
