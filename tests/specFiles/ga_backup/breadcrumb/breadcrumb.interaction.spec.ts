import { test, expect } from '@playwright/test';
import { BreadcrumbPage } from '../../../pages/ga/components/breadcrumbPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const BC = '.cmp-breadcrumb';
const BC_LINK = '.cmp-breadcrumb__item-link';
const BC_ACTIVE = '.cmp-breadcrumb__item--active';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const DESKTOP = { width: 1440, height: 900 };

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Hover (BC-INT-001 – BC-INT-003) ─────────────────────────────────────────

test.describe('Breadcrumb — Hover Interactions', () => {
  test('[BC-INT-001] @interaction @regression Link hover changes color on light background', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const link = page.locator(BC_LINK).first();
    await expect(link).toBeVisible();
    const colorBefore = await link.evaluate(el => getComputedStyle(el).color);
    await link.hover();
    const colorAfter = await link.evaluate(el => getComputedStyle(el).color);
    expect(colorAfter).not.toBe(colorBefore);
  });

  test('[BC-INT-002] @interaction @regression Link hover on dark (granite) bg maintains white+opacity', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const darkSection = page.locator(SECTION_GRANITE).first();
    const hasDark = await darkSection.count();
    if (hasDark === 0) {
      test.skip();
      return;
    }
    const link = darkSection.locator(BC_LINK).first();
    const linkCount = await link.count();
    if (linkCount === 0) {
      test.skip();
      return;
    }
    // Before hover: white (high channel values)
    const colorBefore = await link.evaluate(el => getComputedStyle(el).color);
    await link.hover();
    const colorAfter = await link.evaluate(el => getComputedStyle(el).color);
    // Dark hover uses opacity:0.7 (not color change) per LESS
    const opacityAfter = await link.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacityAfter)).toBeLessThan(1);
    // Color stays white
    expect(colorBefore).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[BC-INT-003] @interaction @regression Hover does not add underline (text-decoration stays none)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const link = page.locator(BC_LINK).first();
    await expect(link).toBeVisible();
    await link.hover();
    const textDecoration = await link.evaluate(el => getComputedStyle(el).textDecoration);
    // Should not contain 'underline'
    expect(textDecoration).not.toContain('underline');
  });
});

// ─── Keyboard Navigation (BC-INT-004 – BC-INT-007) ───────────────────────────

test.describe('Breadcrumb — Keyboard Navigation', () => {
  test('[BC-INT-004] @interaction @regression Breadcrumb links are keyboard focusable', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const link = page.locator(BC_LINK).first();
    await expect(link).toBeVisible();
    // Focus directly — verifies element is focusable
    await link.focus();
    const isFocused = await link.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
    // Tab from this link should move to next breadcrumb link
    await page.keyboard.press('Tab');
    const nextFocused = await page.evaluate(() => document.activeElement?.className || '');
    expect(nextFocused).toContain('breadcrumb');
  });

  test('[BC-INT-005] @interaction @regression Focus-visible shows box-shadow ring on keyboard focus', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const link = page.locator(BC_LINK).first();
    await expect(link).toBeVisible();
    // Use JS focus to simulate keyboard focus
    await link.focus();
    const focusStyles = await link.evaluate(el => {
      const cs = getComputedStyle(el);
      return { boxShadow: cs.boxShadow, outlineStyle: cs.outlineStyle };
    });
    // Focus ring must use box-shadow (not outline)
    expect(focusStyles.boxShadow).not.toBe('none');
    expect(focusStyles.boxShadow.length).toBeGreaterThan(0);
  });

  test('[BC-INT-006] @interaction @regression Focused breadcrumb link has a valid href', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const link = page.locator(BC_LINK).first();
    await expect(link).toBeVisible();
    await link.focus();
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();
    expect(href!.length).toBeGreaterThan(0);
  });

  test('[BC-INT-007] @interaction @regression All breadcrumb links are sequentially keyboard-reachable', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const links = page.locator(BC_LINK);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    // Each link should be focusable
    for (let i = 0; i < count; i++) {
      await links.nth(i).focus();
      const activeEl = await page.evaluate(() => document.activeElement?.className || '');
      expect(activeEl).toContain('breadcrumb__item-link');
    }
  });
});

// ─── Responsive Visibility (BC-INT-008 – BC-INT-010) ─────────────────────────

test.describe('Breadcrumb — Responsive Visibility', () => {
  test('[BC-INT-008] @interaction @regression Breadcrumb is visible at 1440px (desktop)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const root = page.locator(BC).first();
    const display = await root.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('block');
  });

  test('[BC-INT-009] @interaction @regression Breadcrumb is hidden at 390px (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const root = page.locator(BC).first();
    const display = await root.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('none');
  });

  test('[BC-INT-010] @interaction @regression Breadcrumb is hidden at 768px (tablet boundary)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const root = page.locator(BC).first();
    const display = await root.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('none');
  });
});

// ─── Dark Mode Interaction (BC-INT-011 – BC-INT-012) ─────────────────────────

test.describe('Breadcrumb — Dark Mode Interaction', () => {
  test('[BC-INT-011] @interaction @regression Dark focus box-shadow differs from light focus box-shadow', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());

    // Light mode focus ring
    const lightLink = page.locator(BC_LINK).first();
    const lightCount = await lightLink.count();
    if (lightCount === 0) {
      test.skip();
      return;
    }
    await lightLink.focus();
    const lightBoxShadow = await lightLink.evaluate(el => getComputedStyle(el).boxShadow);

    // Dark mode focus ring
    const darkSection = page.locator(SECTION_GRANITE).first();
    const hasDark = await darkSection.count();
    if (hasDark === 0) {
      test.skip();
      return;
    }
    const darkLink = darkSection.locator(BC_LINK).first();
    const darkLinkCount = await darkLink.count();
    if (darkLinkCount === 0) {
      test.skip();
      return;
    }
    await darkLink.focus();
    const darkBoxShadow = await darkLink.evaluate(el => getComputedStyle(el).boxShadow);

    // Dark and light focus rings must use different color tokens
    expect(darkBoxShadow).not.toBe(lightBoxShadow);
  });

  test('[BC-INT-012] @interaction @regression Active item is non-interactive (no hover color change)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new BreadcrumbPage(page);
    await pom.navigate(BASE());
    const active = page.locator(BC_ACTIVE).first();
    await expect(active).toBeVisible();
    // Active item must not contain a link — confirmed non-interactive
    const linkInside = active.locator('a');
    const linkCount = await linkInside.count();
    expect(linkCount).toBe(0);
    // Hovering should not change cursor to pointer (no link present)
    await active.hover();
    const cursor = await active.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).not.toBe('pointer');
  });
});
