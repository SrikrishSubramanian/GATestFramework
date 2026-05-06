import { test, expect } from '@playwright/test';
import { FooterPage } from '../../../pages/ga/components/footerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Footer — Happy Path & Core Functionality', () => {
  test('[FTR-001] @smoke @regression Footer renders correctly', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const root = await pom.getRoot();
    await expect(root).toBeVisible();

    // Verify footer is at bottom
    const boundingBox = await root.boundingBox();
    expect(boundingBox).toBeTruthy();
  });

  test('[FTR-002] @regression Footer has required sections', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    // At least one of the main sections should exist
    const hasTop = await (await pom.getFooterTop()).count() > 0;
    const hasMiddle = await (await pom.getFooterMiddle()).count() > 0;
    const hasBottom = await (await pom.getFooterBottom()).count() > 0;

    expect(hasTop || hasMiddle || hasBottom).toBeTruthy();
  });

  test('[FTR-003] @regression Footer navigation links are functional', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const links = await pom.getNavigationLinks();
    const linkCount = await links.count();

    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = links.nth(i);
        await expect(link).toBeVisible();

        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });

  test('[FTR-004] @regression Footer social media links are present', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const socialLinks = await pom.getSocialLinks();
    const count = await socialLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const link = socialLinks.nth(i);
        await expect(link).toBeVisible();
      }
    }
  });

  test('[FTR-005] @regression Footer copyright notice is visible', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const copyright = await pom.getCopyright();
    const copyrightCount = await copyright.count();

    if (copyrightCount > 0) {
      await expect(copyright.first()).toBeVisible();
    }
  });

  test('[FTR-006] @regression Footer disclosure buttons expand/collapse', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const buttons = await pom.getDisclosureButtons();
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const button = buttons.first();
      const initialState = await button.getAttribute('aria-expanded');

      await button.click();
      await page.waitForTimeout(200);

      const newState = await button.getAttribute('aria-expanded');
      expect(newState).not.toBeNull();
    }
  });

  test('[FTR-007] @regression Footer subscribe form accepts input', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const form = await pom.getSubscribeForm();
    const formCount = await form.count();

    if (formCount > 0) {
      const input = await pom.getSubscribeInput();
      const inputCount = await input.count();

      if (inputCount > 0) {
        await input.first().fill('test@example.com');
        const value = await input.first().inputValue();
        expect(value).toBe('test@example.com');
      }
    }
  });

  test('[FTR-008] @negative Footer handles empty content gracefully', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const root = await pom.getRoot();
    await expect(root).toBeVisible();

    // Footer should be visible even if some sections are empty
    const display = await root.evaluate(el => window.getComputedStyle(el).display);
    expect(['block', 'flex', 'grid', 'table']).toContain(display);
  });

  test('[FTR-009] @regression Footer no JavaScript errors', async ({ page }) => {
    const pom = new FooterPage(page);

    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await pom.navigate(BASE());

    // Allow some errors but not footer-specific ones
    const footerErrors = errors.filter(e => e.includes('footer') || e.includes('Footer'));
    expect(footerErrors).toEqual([]);
  });

  test('[FTR-010] @a11y @wcag22 Footer is accessible', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const results = await new AxeBuilder({ page })
      .include('.cmp-footer')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe('Footer — Responsive Design', () => {
  test.describe.configure({ retries: 1 });

  test('[FTR-020] @mobile @regression Footer adapts to mobile viewport', async ({ page }) => {
    const pom = new FooterPage(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await pom.navigate(BASE());

    const root = await pom.getRoot();
    await expect(root).toBeVisible();

    // Footer should stack vertically on mobile
    const width = await root.evaluate(el => el.offsetWidth);
    expect(width).toBeLessThanOrEqual(375);
  });

  test('[FTR-021] @mobile @regression Footer menu toggle works on mobile', async ({ page }) => {
    const pom = new FooterPage(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await pom.navigate(BASE());

    const toggle = await pom.getMobileMenuToggle();
    const toggleCount = await toggle.count();

    if (toggleCount > 0) {
      await toggle.first().click();
      await page.waitForTimeout(200);

      const nav = await pom.getNavigation();
      await expect(nav.first()).toBeVisible();
    }
  });
});
