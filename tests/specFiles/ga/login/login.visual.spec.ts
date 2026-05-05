import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const ROOT = '.cmp-login';
const HERO = '.cmp-login__hero';
const FORM = '.cmp-login__form';
const PASSWORD = '.cmp-login__password input, input[type="password"]';
const PASSWORD_TOGGLE = '.cmp-login__password-toggle';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — Visual Regression', () => {
  test('[LGN-V-001] @visual Login component desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('login-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-002] @visual Login component mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('login-mobile.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-003] @visual Login component tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('login-tablet.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-004] @visual Login hero section screenshot matches baseline at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const hero = page.locator(HERO).first();
    if (await hero.count() === 0) { test.skip(); return; }
    await expect(hero).toBeVisible();
    await expect(hero).toHaveScreenshot('login-hero-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-005] @visual Login form section screenshot matches baseline at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
    await expect(form).toHaveScreenshot('login-form-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-006] @visual Password field in masked state screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.fill('TestPass123');
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toHaveScreenshot('login-password-masked.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-007] @visual Password field in revealed state (after toggle) screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.fill('TestPass123');
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    if (await toggle.count() === 0) { test.skip(); return; }
    await toggle.click();
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toHaveScreenshot('login-password-revealed.png', { maxDiffPixelRatio: 0.02 });
  });
});
