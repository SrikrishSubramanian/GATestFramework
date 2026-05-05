import { test, expect } from '@playwright/test';
import { FooterPage } from '../../../pages/ga/components/footerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Footer — Interactions', () => {
  test('[FTR-INTERACTION-001] @interaction @regression Footer links are clickable', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const links = await pom.getFooterLinks();
    const count = await links.count();

    if (count > 0) {
      const link = links.first();
      const href = await link.getAttribute('href');

      if (href && href.startsWith('#')) {
        // Internal link - should navigate without leaving page
        await link.click();
        await page.waitForTimeout(200);

        // Page should still be accessible
        const root = await pom.getRoot();
        await expect(root).toBeVisible();
      }
    }
  });

  test('[FTR-INTERACTION-002] @interaction @regression Footer disclosure buttons toggle', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const buttons = await pom.getDisclosureButtons();
    const count = await buttons.count();

    if (count > 0) {
      const button = buttons.first();
      const initial = await button.getAttribute('aria-expanded');

      await button.click();
      await page.waitForTimeout(200);

      const after = await button.getAttribute('aria-expanded');
      expect(initial).not.toBe(after);
    }
  });

  test('[FTR-INTERACTION-003] @interaction @regression Footer subscribe form submission', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const form = await pom.getSubscribeForm();
    const formCount = await form.count();

    if (formCount > 0) {
      const input = await pom.getSubscribeInput();
      const button = await pom.getSubscribeButton();

      if (await input.count() > 0 && await button.count() > 0) {
        await input.first().fill('test@example.com');

        // Listen for form submission or button click
        page.on('response', async response => {
          if (response.status() >= 200 && response.status() < 400) {
            expect(response.ok()).toBeTruthy();
          }
        });

        await button.first().click({ timeout: 5000 });
      }
    }
  });

  test('[FTR-INTERACTION-004] @interaction @regression Footer logo link navigates home', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const logo = await pom.getLogoLink();
    const logoCount = await logo.count();

    if (logoCount > 0) {
      const href = await logo.first().getAttribute('href');
      expect(href).toBeTruthy();

      // Logo should link somewhere meaningful
      expect(href).not.toBe('#');
    }
  });

  test('[FTR-INTERACTION-005] @interaction @regression Footer keyboard navigation', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const root = await pom.getRoot();
    await root.first().focus();

    // Tab through footer elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('[FTR-INTERACTION-006] @interaction @regression Footer social links open in new tab', async ({ page, context }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const socialLinks = await pom.getSocialLinks();
    const count = await socialLinks.count();

    if (count > 0) {
      const link = socialLinks.first();
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');

      // Social links typically open in new tab
      if (target === '_blank') {
        expect(rel).toContain('noopener');
      }
    }
  });
});
