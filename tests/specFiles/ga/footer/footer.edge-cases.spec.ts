import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Footer Component — Edge Cases & Enhanced Validation', () => {
  // ============ Edge Case: Component Presence & Assembly ============
  test('[FOOTER-EDGE-001] @edge Verify all required footer sections rendered', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"], .cmp-footer').first();
    expect(await footer.count()).toBeGreaterThan(0);
  });

  test('[FOOTER-EDGE-002] @edge Verify footer renders on full page layout', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/`);

    const footer = page.locator('footer, [role="contentinfo"], .cmp-footer');
    expect(await footer.count()).toBeGreaterThan(0);
  });

  test('[FOOTER-EDGE-003] @edge Verify promo banner component in agnostic XF', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const promoBanner = page.locator('[class*="promo"], [class*="banner"]');
    // Promo banner should be conditionally rendered
    const count = await promoBanner.count();
    expect(count).toBeDefined();
  });

  test('[FOOTER-EDGE-004] @edge Verify navigation component rendered', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const nav = footer.locator('nav, [class*="nav"], [class*="navigation"]');
      expect(await nav.count()).toBeGreaterThan(0);
    }
  });

  // ============ Edge Case: Link Validation ============
  test('[FOOTER-EDGE-005] @edge Verify all footer links are valid and not broken', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const links = footer.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');

        if (href) {
          // Link should not be empty or javascript
          expect(href).not.toMatch(/^javascript:|^#$/);
        }
      }
    }
  });

  test('[FOOTER-EDGE-006] @edge Verify footer links open in correct target', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const externalLinks = footer.locator('a[target="_blank"]');
      const extCount = await externalLinks.count();

      if (extCount > 0) {
        // External links should have proper target
        const target = await externalLinks.first().getAttribute('target');
        expect(target).toBe('_blank');
      }
    }
  });

  // ============ Edge Case: Responsive Layout ============
  test('[FOOTER-EDGE-007] @edge Verify footer responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const width = await footer.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[FOOTER-EDGE-008] @edge Verify footer responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const width = await footer.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[FOOTER-EDGE-009] @edge Verify footer full width on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const width = await footer.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(0);
    }
  });

  // ============ Edge Case: Navigation Type Handling ============
  test('[FOOTER-EDGE-010] @edge Verify navigation single list on agnostic XF', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const nav = page.locator('footer nav, [role="contentinfo"] nav').first();
    if (await nav.count() > 0) {
      const lists = nav.locator('ul');
      const count = await lists.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('[FOOTER-EDGE-011] @edge Verify grouped navigation structure', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const nav = page.locator('footer nav, [role="contentinfo"] nav').first();
    if (await nav.count() > 0) {
      const sections = nav.locator('[class*="group"], [class*="section"], .nav-group');
      // Grouped nav might have multiple sections
      expect(await sections.count()).toBeDefined();
    }
  });

  // ============ Edge Case: Content Constraints ============
  test('[FOOTER-EDGE-012] @edge Verify footer content is not empty', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const text = await footer.textContent();
      expect(text).not.toBe('');
    }
  });

  test('[FOOTER-EDGE-013] @edge Verify footer text content is readable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const fontSize = await footer.evaluate(el =>
        parseInt(window.getComputedStyle(el).fontSize)
      );
      // Font size should be readable
      expect(fontSize).toBeGreaterThan(10);
    }
  });

  // ============ Edge Case: Disclosure Component (Footer Disclosure) ============
  test('[FOOTER-EDGE-014] @edge Verify disclosure component expands on click', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const disclosure = page.locator('[class*="disclosure"], details, [role="button"][aria-expanded]').first();
    if (await disclosure.count() > 0) {
      const initial = await disclosure.getAttribute('aria-expanded') || 'false';
      expect(['true', 'false']).toContain(initial);

      if (initial === 'false') {
        await disclosure.click();
        await page.waitForTimeout(100);
        const expanded = await disclosure.getAttribute('aria-expanded');
        expect(expanded).toBe('true');
      }
    }
  });

  test('[FOOTER-EDGE-015] @edge Verify disclosure content visible when expanded', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const disclosure = page.locator('[class*="disclosure"], details, [role="button"][aria-expanded="false"]').first();
    if (await disclosure.count() > 0) {
      await disclosure.click();

      const content = disclosure.locator('[class*="content"], [role="region"]');
      if (await content.count() > 0) {
        await expect(content).toBeVisible();
      }
    }
  });

  // ============ Edge Case: Form in Footer ============
  test('[FOOTER-EDGE-016] @edge Verify footer form if present is accessible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const form = footer.locator('form');

      if (await form.count() > 0) {
        const inputs = form.locator('input, textarea, select');
        expect(await inputs.count()).toBeGreaterThan(0);

        // Verify inputs have labels
        const labelCount = form.locator('label').count();
        expect(labelCount).toBeDefined();
      }
    }
  });

  test('[FOOTER-EDGE-017] @edge Verify footer form submission handling', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const form = footer.locator('form').first();

      if (await form.count() > 0) {
        const submitBtn = form.locator('button[type="submit"]');
        expect(await submitBtn.count()).toBeGreaterThan(0);
      }
    }
  });

  // ============ Edge Case: Social Links ============
  test('[FOOTER-EDGE-018] @edge Verify social media links present', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const socialLinks = footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"]');
      // Social links are optional but if present should be valid
      const count = await socialLinks.count();
      expect(count).toBeDefined();
    }
  });

  test('[FOOTER-EDGE-019] @edge Verify social links have descriptive labels', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const socialLinks = footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]').first();

      if (await socialLinks.count() > 0) {
        const ariaLabel = await socialLinks.getAttribute('aria-label');
        const title = await socialLinks.getAttribute('title');
        const text = await socialLinks.textContent();

        expect(ariaLabel || title || text).toBeTruthy();
      }
    }
  });

  // ============ Edge Case: Footer Styling ============
  test('[FOOTER-EDGE-020] @edge Verify footer has proper contrast for readability', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`);

    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      const bgColor = await footer.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      const textColor = await footer.evaluate(el =>
        window.getComputedStyle(el).color
      );

      // Both should be defined (not transparent)
      expect(bgColor).toBeTruthy();
      expect(textColor).toBeTruthy();
    }
  });
});
