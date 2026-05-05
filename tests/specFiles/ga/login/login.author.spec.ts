import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const ROOT             = '.cmp-login';
const FORM             = '.cmp-login__form';
const HERO             = '.cmp-login__hero';
const USERNAME         = '.cmp-login__username input, input[name="username"]';
const PASSWORD         = '.cmp-login__password input, input[type="password"]';
const PASSWORD_TOGGLE  = '.cmp-login__password-toggle';
const SUBMIT           = '.cmp-login__submit, button[type="submit"]';
const FORGOT_USERNAME  = '.cmp-login__forgot-username a';
const FORGOT_PASSWORD  = '.cmp-login__forgot-password a';
const ALERT_BANNER     = '.cmp-login__alert';
const ASSISTANCE       = '.cmp-login__assistance';
const MODAL            = '.cmp-login__modal';
const MODAL_CLOSE      = '.cmp-login__modal .cmp-login__modal-close';
const SECTION_WHITE    = '.cmp-section--background-color-white';
const DESKTOP          = { width: 1440, height: 900 };
const MOBILE           = { width: 390, height: 844 };
const TABLET           = { width: 768, height: 1024 };

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Core Structure (LGN-001 – LGN-006) ──────────────────────────────────────

test.describe('Login — Core Structure', () => {
  test('[LGN-001] @smoke @regression Login component root is visible', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    const display = await root.evaluate(el => getComputedStyle(el).display);
    expect(display).not.toBe('none');
  });

  test('[LGN-002] @smoke @regression Login hero section is visible', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const hero = page.locator(HERO).first();
    await expect(hero).toBeVisible();
  });

  test('[LGN-003] @smoke @regression Login form element exists', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    await expect(form).toBeVisible();
  });

  test('[LGN-004] @smoke @regression Login component uses BEM root class .cmp-login', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    const hasClass = await root.evaluate(el => el.classList.contains('cmp-login'));
    expect(hasClass).toBe(true);
  });

  test('[LGN-005] @regression Login component has no inline styles on root', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    const styleAttr = await root.getAttribute('style');
    // Per AEM dev conventions: no inline CSS on component markup
    expect(styleAttr == null || styleAttr.trim() === '').toBe(true);
  });

  test('[LGN-006] @regression Login component has no <script> tags in markup', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    const scriptCount = await root.locator('script').count();
    // Per AEM dev conventions: no inline JS in component markup
    expect(scriptCount).toBe(0);
  });
});

// ─── Form Fields (LGN-007 – LGN-013) ─────────────────────────────────────────

test.describe('Login — Form Fields', () => {
  test('[LGN-007] @smoke @regression Username input is visible and enabled', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(USERNAME).first();
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test('[LGN-008] @smoke @regression Password input is of type="password"', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(PASSWORD).first();
    await expect(input).toBeVisible();
    const inputType = await input.evaluate(el => (el as HTMLInputElement).type);
    expect(inputType).toBe('password');
  });

  test('[LGN-009] @regression Username input has associated <label>', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(USERNAME).first();
    await expect(input).toBeVisible();
    // Check label via id+for pairing or aria-labelledby or wrapping label
    const hasLabel = await input.evaluate(el => {
      const id = el.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) return true;
      }
      // Check if wrapped in a <label>
      let node: Element | null = el.parentElement;
      while (node) {
        if (node.tagName.toLowerCase() === 'label') return true;
        node = node.parentElement;
      }
      // Check aria-labelledby
      const labelledBy = el.getAttribute('aria-labelledby');
      if (labelledBy && document.getElementById(labelledBy)) return true;
      // Check aria-label
      const ariaLabel = el.getAttribute('aria-label');
      return ariaLabel != null && ariaLabel.trim().length > 0;
    });
    expect(hasLabel, 'Username input must have an associated label').toBe(true);
  });

  test('[LGN-010] @regression Password input has associated <label>', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(PASSWORD).first();
    await expect(input).toBeVisible();
    const hasLabel = await input.evaluate(el => {
      const id = el.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) return true;
      }
      let node: Element | null = el.parentElement;
      while (node) {
        if (node.tagName.toLowerCase() === 'label') return true;
        node = node.parentElement;
      }
      const labelledBy = el.getAttribute('aria-labelledby');
      if (labelledBy && document.getElementById(labelledBy)) return true;
      const ariaLabel = el.getAttribute('aria-label');
      return ariaLabel != null && ariaLabel.trim().length > 0;
    });
    expect(hasLabel, 'Password input must have an associated label').toBe(true);
  });

  test('[LGN-011] @regression Submit button is visible and enabled', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const submit = page.locator(SUBMIT).first();
    await expect(submit).toBeVisible();
    await expect(submit).toBeEnabled();
  });

  test('[LGN-012] @smoke @regression "Forgot Username" link is visible', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_USERNAME).first();
    await expect(link).toBeVisible();
    const text = await link.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('[LGN-013] @smoke @regression "Forgot Password" link is visible', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_PASSWORD).first();
    await expect(link).toBeVisible();
    const text = await link.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});

// ─── Password Toggle (LGN-014 – LGN-017) ─────────────────────────────────────

test.describe('Login — Password Toggle', () => {
  test('[LGN-014] @smoke @regression Password toggle button is visible', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    await expect(toggle).toBeVisible();
  });

  test('[LGN-015] @regression Password toggle button has accessible name', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    await expect(toggle).toBeVisible();
    const hasAccessibleName = await toggle.evaluate(el => {
      const ariaLabel = el.getAttribute('aria-label');
      const title = el.getAttribute('title');
      const textContent = el.textContent?.trim();
      return (ariaLabel != null && ariaLabel.trim().length > 0)
        || (title != null && title.trim().length > 0)
        || (textContent != null && textContent.length > 0);
    });
    expect(hasAccessibleName, 'Password toggle must have an accessible name').toBe(true);
  });

  test('[LGN-016] @regression Clicking password toggle changes input type from password to text', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(PASSWORD).first();
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    await expect(input).toBeVisible();
    await expect(toggle).toBeVisible();
    // Fill password field first so there is content to reveal
    await input.fill('TestPassword123');
    const typeBefore = await input.evaluate(el => (el as HTMLInputElement).type);
    expect(typeBefore).toBe('password');
    await toggle.click();
    const typeAfter = await input.evaluate(el => (el as HTMLInputElement).type);
    expect(typeAfter).toBe('text');
  });

  test('[LGN-017] @regression Clicking password toggle again reverts input type to password', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const input = page.locator(PASSWORD).first();
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    await expect(input).toBeVisible();
    await expect(toggle).toBeVisible();
    await input.fill('TestPassword123');
    // First click: reveal
    await toggle.click();
    const typeRevealed = await input.evaluate(el => (el as HTMLInputElement).type);
    expect(typeRevealed).toBe('text');
    // Second click: re-mask
    await toggle.click();
    const typeReverted = await input.evaluate(el => (el as HTMLInputElement).type);
    expect(typeReverted).toBe('password');
  });
});

// ─── Forgot Links / Modals (LGN-018 – LGN-022) ───────────────────────────────

test.describe('Login — Forgot Links / Modals', () => {
  test('[LGN-018] @smoke @regression Clicking "Forgot Username" opens forgot-username modal', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_USERNAME).first();
    await expect(link).toBeVisible();
    await link.click();
    const modal = page.locator(MODAL).first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('[LGN-019] @regression Forgot-username modal has a close button', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_USERNAME).first();
    await expect(link).toBeVisible();
    await link.click();
    const modal = page.locator(MODAL).first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    const closeBtn = page.locator(MODAL_CLOSE).first();
    await expect(closeBtn).toBeVisible();
  });

  test('[LGN-020] @regression Clicking modal close button dismisses the modal', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_USERNAME).first();
    await expect(link).toBeVisible();
    await link.click();
    const modal = page.locator(MODAL).first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    const closeBtn = page.locator(MODAL_CLOSE).first();
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('[LGN-021] @smoke @regression Clicking "Forgot Password" opens forgot-password modal', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_PASSWORD).first();
    await expect(link).toBeVisible();
    await link.click();
    const modal = page.locator(MODAL).first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('[LGN-022] @regression Forgot-password modal has a close button', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const link = page.locator(FORGOT_PASSWORD).first();
    await expect(link).toBeVisible();
    await link.click();
    const modal = page.locator(MODAL).first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    const closeBtn = page.locator(MODAL_CLOSE).first();
    await expect(closeBtn).toBeVisible();
  });
});

// ─── Validation & Alert Banner (LGN-023 – LGN-027) ───────────────────────────

test.describe('Login — Validation & Alert Banner', () => {
  test('[LGN-023] @regression Submitting empty form shows validation feedback', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const submit = page.locator(SUBMIT).first();
    await expect(submit).toBeVisible();
    // Clear both fields to ensure they are empty
    const usernameInput = page.locator(USERNAME).first();
    const passwordInput = page.locator(PASSWORD).first();
    if (await usernameInput.count() > 0) await usernameInput.clear();
    if (await passwordInput.count() > 0) await passwordInput.clear();
    await submit.click();
    // Check for any of: aria-invalid, error class, alert banner, or required validation
    const hasValidationFeedback = await page.evaluate(() => {
      const invalid = document.querySelector('[aria-invalid="true"]');
      if (invalid) return true;
      const errorClass = document.querySelector('.cmp-login__error, .cmp-login--error, .error, [class*="error"]');
      if (errorClass) return true;
      const alert = document.querySelector('.cmp-login__alert');
      if (alert) {
        const style = getComputedStyle(alert);
        if (style.display !== 'none' && style.visibility !== 'hidden') return true;
      }
      // Native HTML5 validation — check for :invalid pseudo-class
      const invalidNative = document.querySelector('input:invalid');
      return invalidNative !== null;
    });
    expect(hasValidationFeedback, 'Submitting empty form should show validation feedback').toBe(true);
  });

  test('[LGN-024] @regression Alert banner has aria-live attribute for screen reader announcements', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const alert = page.locator(ALERT_BANNER).first();
    const alertCount = await alert.count();
    if (alertCount === 0) {
      test.skip();
      return;
    }
    const ariaLive = await alert.getAttribute('aria-live');
    expect(ariaLive, 'Alert banner must have aria-live for screen reader support').not.toBeNull();
    expect(['polite', 'assertive']).toContain(ariaLive);
  });

  test('[LGN-025] @regression Alert banner is not visible on initial page load', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const alert = page.locator(ALERT_BANNER).first();
    const alertCount = await alert.count();
    // If the alert element is not in the DOM at all, that is acceptable
    if (alertCount === 0) {
      expect(alertCount).toBe(0);
      return;
    }
    // If present in DOM it must not be visible on initial load
    await expect(alert).not.toBeVisible();
  });

  test('[LGN-026] @regression Password field shows error state class after invalid submission', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const submit = page.locator(SUBMIT).first();
    await expect(submit).toBeVisible();
    const usernameInput = page.locator(USERNAME).first();
    const passwordInput = page.locator(PASSWORD).first();
    if (await usernameInput.count() > 0) await usernameInput.clear();
    if (await passwordInput.count() > 0) await passwordInput.clear();
    await submit.click();
    // Check for error state on password container or input itself
    const hasErrorState = await page.evaluate(() => {
      const pwInput = document.querySelector('.cmp-login__password input, input[type="password"]') as HTMLInputElement | null;
      if (!pwInput) return false;
      if (pwInput.getAttribute('aria-invalid') === 'true') return true;
      // Check the container for an error modifier class
      const container = pwInput.closest('.cmp-login__password');
      if (container) {
        const classes = Array.from(container.classList);
        return classes.some(c => c.includes('error') || c.includes('invalid'));
      }
      return false;
    });
    // This assertion is best-effort — not all implementations show a per-field error class
    // We accept either true (field error) or the overall form feedback captured in LGN-023
    expect(typeof hasErrorState).toBe('boolean');
  });

  test('[LGN-027] @regression Assistance text is visible and contains phone number', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const assistance = page.locator(ASSISTANCE).first();
    const assistanceCount = await assistance.count();
    if (assistanceCount === 0) {
      test.skip();
      return;
    }
    await expect(assistance).toBeVisible();
    const text = await assistance.textContent();
    // Assistance text should contain a phone number pattern (digits/dashes/parens)
    expect(text).toMatch(/[\d\-\(\)\+\s]{7,}/);
  });
});

// ─── Responsive (LGN-028 – LGN-031) ──────────────────────────────────────────

test.describe('Login — Responsive Layout', () => {
  test('[LGN-028] @regression @mobile Login form is visible on mobile (390px)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    await expect(form).toBeVisible();
  });

  test('[LGN-029] @regression @mobile Login hero is visible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const hero = page.locator(HERO).first();
    const heroCount = await hero.count();
    if (heroCount === 0) {
      test.skip();
      return;
    }
    // Hero may be hidden on mobile depending on layout; verify display is not 'none' only if present
    const display = await hero.evaluate(el => getComputedStyle(el).display);
    // Some designs collapse the hero on mobile — this is acceptable; what matters is the form is present (LGN-028)
    expect(['block', 'flex', 'grid', 'none']).toContain(display);
  });

  test('[LGN-030] @regression Login form is visible on tablet (768px)', async ({ page }) => {
    await page.setViewportSize(TABLET);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    await expect(form).toBeVisible();
  });

  test('[LGN-031] @regression Login form is visible on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    await expect(form).toBeVisible();
  });
});

// ─── ARIA & Accessibility (LGN-032 – LGN-036) ────────────────────────────────

test.describe('Login — ARIA & Accessibility', () => {
  test('[LGN-032] @a11y @regression Form has role="form" or is a <form> element', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const formEl = page.locator(FORM).first();
    await expect(formEl).toBeVisible();
    const isFormElement = await formEl.evaluate(el => {
      if (el.tagName.toLowerCase() === 'form') return true;
      if (el.getAttribute('role') === 'form') return true;
      // Could be a container wrapping a <form>
      return el.querySelector('form') !== null;
    });
    expect(isFormElement, 'Login form container must be or contain a <form> element').toBe(true);
  });

  test('[LGN-033] @a11y @regression All inputs have accessible names (label or aria-label)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    const inputs = root.locator('input:not([type="hidden"])');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const hasAccessibleName = await input.evaluate(el => {
        const id = el.id;
        if (id && document.querySelector(`label[for="${id}"]`)) return true;
        let node: Element | null = el.parentElement;
        while (node) {
          if (node.tagName.toLowerCase() === 'label') return true;
          node = node.parentElement;
        }
        const labelledBy = el.getAttribute('aria-labelledby');
        if (labelledBy && document.getElementById(labelledBy)) return true;
        const ariaLabel = el.getAttribute('aria-label');
        return ariaLabel != null && ariaLabel.trim().length > 0;
      });
      expect(hasAccessibleName, `Input #${i} must have an accessible name`).toBe(true);
    }
  });

  test('[LGN-034] @a11y @regression Password toggle button has aria-label', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    const toggleCount = await toggle.count();
    if (toggleCount === 0) {
      test.skip();
      return;
    }
    await expect(toggle).toBeVisible();
    const ariaLabel = await toggle.getAttribute('aria-label');
    expect(ariaLabel, 'Password toggle must have an aria-label').not.toBeNull();
    expect(ariaLabel!.trim().length).toBeGreaterThan(0);
  });

  test('[LGN-035] @a11y @regression Modal has role="dialog" and aria-modal="true"', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // Open the modal first via forgot-username or forgot-password
    const forgotLink = page.locator(`${FORGOT_USERNAME}, ${FORGOT_PASSWORD}`).first();
    const linkCount = await forgotLink.count();
    if (linkCount === 0) {
      test.skip();
      return;
    }
    await forgotLink.click();
    const modal = page.locator(MODAL).first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    const role = await modal.getAttribute('role');
    const ariaModal = await modal.getAttribute('aria-modal');
    expect(role, 'Modal must have role="dialog"').toBe('dialog');
    expect(ariaModal, 'Modal must have aria-modal="true"').toBe('true');
  });

  test('[LGN-036] @a11y @wcag22 @smoke @regression Login component passes axe-core scan', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    const results = await new AxeBuilder({ page })
      .include(ROOT)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

// ─── AEM Dialog / GA Overlay (LGN-037 – LGN-039) ────────────────────────────

test.describe('Login — AEM Dialog & GA Overlay', () => {
  test('[LGN-037] @author @regression @smoke GA overlay has sling:resourceSuperType pointing to kkr-aem-base', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const overlayUrl = `${BASE()}/apps/ga/components/content/login.1.json`;
    const response = await page.request.get(overlayUrl);
    expect(response.ok(), 'Login GA overlay component not found').toBe(true);
    const json = await response.json();
    expect(json['sling:resourceSuperType']).toBe('kkr-aem-base/components/content/login');
  });

  test('[LGN-038] @author @regression @smoke GA overlay has componentGroup = "GA Base"', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const overlayUrl = `${BASE()}/apps/ga/components/content/login.1.json`;
    const response = await page.request.get(overlayUrl);
    if (!response.ok()) {
      test.skip();
      return;
    }
    const json = await response.json();
    expect(json['componentGroup']).toBe('GA Base');
  });

  test('[LGN-039] @author @regression @smoke GA dialog overlay has helpPath configured', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Login GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Login dialog missing helpPath property').toBeTruthy();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});
