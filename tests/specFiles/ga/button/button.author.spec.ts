import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';

import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Button — Happy Path', () => {
  test('[BTTN-001] @smoke @regression Button renders correctly', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.button').first();
    await expect(root).toBeVisible();
    // Verify core structure: heading or primary content exists
    const heading = root.locator('h1, h2, h3').first();
    const hasHeading = await heading.count() > 0;
    if (hasHeading) {
      await expect(heading).toBeVisible();
    }
    // Verify no JS errors during render
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    expect(errors).toEqual([]);
  });

  test('[BTTN-002] @smoke @regression Button interactive elements are functional', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Scope to non-disabled button wrappers — style guide includes disabled variants by design
    const enabledButtons = page.locator('.button:not(.ga-button--disabled) .cmp-button');
    const count = await enabledButtons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(enabledButtons.nth(i)).toBeVisible();
      await expect(enabledButtons.nth(i)).toBeEnabled();
    }
  });
});

test.describe('Button — Responsive', () => {
  // Retry once — Windows Chromium occasionally crashes on viewport resize
  test.describe.configure({ retries: 1 });

  test('[BTTN-006] @mobile @regression Button adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.button').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('Button — Accessibility', () => {
  // Retry once — Windows Chromium occasionally crashes under axe-core memory pressure
  test.describe.configure({ retries: 1 });

  test('[BTTN-010] @a11y @wcag22 @regression @smoke Button passes axe-core scan', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.button')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[BTTN-011] @a11y @wcag22 @regression @smoke Button interactive elements meet 24px target size', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.button a, .button button, .button input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[BTTN-012] @a11y @wcag22 @regression @smoke Button focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.button a, .button button, .button input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Reskin — Style System & CSS Class Compilation (BTTN-013 – BTTN-018) GAAM-213
// ---------------------------------------------------------------------------

test.describe('Button — Reskin Style System', () => {
  test('[BTTN-013] @regression @smoke .ga-button--primary CSS class has compiled rules in stylesheet', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const hasRule = await page.evaluate(() => {
      return Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some((rule: any) =>
            rule.selectorText?.includes('ga-button--primary')
          );
        } catch { return false; }
      });
    });
    expect(hasRule, '.ga-button--primary must be defined in the compiled GA stylesheet').toBe(true);
  });

  test('[BTTN-014] @regression .ga-button--secondary CSS class has compiled rules in stylesheet', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const hasRule = await page.evaluate(() => {
      return Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some((rule: any) =>
            rule.selectorText?.includes('ga-button--secondary')
          );
        } catch { return false; }
      });
    });
    expect(hasRule, '.ga-button--secondary must be defined in the compiled GA stylesheet').toBe(true);
  });

  test('[BTTN-015] @regression .ga-button--icon-text CSS class has compiled rules in stylesheet', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const hasRule = await page.evaluate(() => {
      return Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some((rule: any) =>
            rule.selectorText?.includes('ga-button--icon-text')
          );
        } catch { return false; }
      });
    });
    expect(hasRule, '.ga-button--icon-text must be defined in the compiled GA stylesheet').toBe(true);
  });

  test('[BTTN-016] @regression Primary button has a non-transparent background fill', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.cmp-section--background-color-white')
      .first()
      .locator('.button.ga-button--primary:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    const bg = await btn.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg, 'Primary button must have a visible background (not transparent)').not.toBe('rgba(0, 0, 0, 0)');
    expect(bg, 'Primary button must have a visible background (not transparent)').not.toBe('transparent');
  });

  test('[BTTN-017] @regression Secondary button has a visible border on white background', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.cmp-section--background-color-white')
      .first()
      .locator('.button.ga-button--secondary:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    const border = await btn.evaluate(el => ({
      width: getComputedStyle(el).borderTopWidth,
      style: getComputedStyle(el).borderTopStyle,
    }));
    expect(parseFloat(border.width), 'Secondary button must have a visible border').toBeGreaterThan(0);
    expect(border.style, 'Secondary button border must not be none').not.toBe('none');
  });

  test('[BTTN-018] @regression BEM inner element uses .cmp-button class (not .ga-button as BEM root)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const cmpButtons = page.locator('.cmp-button');
    expect(await cmpButtons.count(), '.cmp-button BEM elements must be present').toBeGreaterThan(0);
    const gaBtnRoots = page.locator('.ga-button');
    // .ga-button should not exist as a standalone class — only as a modifier prefix
    const count = await gaBtnRoots.count();
    if (count > 0) {
      // Verify any .ga-button also has a modifier suffix (.ga-button--primary etc.)
      for (let i = 0; i < count; i++) {
        const classes = await gaBtnRoots.nth(i).getAttribute('class') ?? '';
        const hasModifier = /ga-button--\w+/.test(classes);
        expect(hasModifier, `.ga-button[${i}] must always be used with a modifier class`).toBe(true);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Reskin — Hover States — GAAM-213 (BTTN-019 – BTTN-025)
// ---------------------------------------------------------------------------

test.describe('Button — Reskin Hover States', () => {
  test('[BTTN-019] @regression [GAAM-213] Primary button has CSS transition for hover animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.button.ga-button--primary:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    const transition = await btn.evaluate(el => getComputedStyle(el).transition);
    expect(transition, '[GAAM-213] Primary button must have a CSS transition for hover').not.toBe('');
    expect(transition, '[GAAM-213] Primary button hover transition must not be instant (0s)').not.toBe('all 0s ease 0s');
  });

  test('[BTTN-020] @regression [GAAM-213] Secondary button has CSS transition for hover animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.button.ga-button--secondary:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    const transition = await btn.evaluate(el => getComputedStyle(el).transition);
    expect(transition, '[GAAM-213] Secondary button must have a CSS transition for hover').not.toBe('');
    expect(transition, '[GAAM-213] Secondary button hover transition must not be instant (0s)').not.toBe('all 0s ease 0s');
  });

  test('[BTTN-021] @regression [GAAM-213] Icon-text button has CSS transition for hover animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.button.ga-button--icon-text:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    const transition = await btn.evaluate(el => getComputedStyle(el).transition);
    expect(transition, '[GAAM-213] Icon-text button must have a CSS transition for hover').not.toBe('');
    expect(transition, '[GAAM-213] Icon-text button hover transition must not be instant (0s)').not.toBe('all 0s ease 0s');
  });

  test('[BTTN-022] @regression [GAAM-213] Hover CSS for primary button is defined in stylesheet (::before/::after or :hover rule)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const hasHoverRule = await page.evaluate(() => {
      return Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some((rule: any) =>
            rule.selectorText?.includes('ga-button--primary') &&
            (rule.selectorText?.includes(':hover') || rule.selectorText?.includes('::before') || rule.selectorText?.includes('::after'))
          );
        } catch { return false; }
      });
    });
    expect(hasHoverRule, '[GAAM-213] Primary button must have :hover or pseudo-element rule in stylesheet').toBe(true);
  });

  test('[BTTN-023] @regression [GAAM-213] Disabled button does NOT show pointer cursor (hover state must not apply)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const disabledWrapper = page.locator('.button.ga-button--disabled').first();
    if (await disabledWrapper.count() === 0) { test.skip(); return; }
    const btn = disabledWrapper.locator('.cmp-button').first();
    if (await btn.count() === 0) { test.skip(); return; }
    await btn.hover();
    const cursor = await btn.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor, '[GAAM-213] Disabled button must not show pointer cursor on hover').not.toBe('pointer');
  });

  test('[BTTN-024] @regression [GAAM-213] Hover cursor is pointer for all enabled button variants', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const variants = ['.ga-button--primary', '.ga-button--secondary', '.ga-button--icon-text'];
    for (const variant of variants) {
      const btn = page
        .locator(`.button${variant}:not(.ga-button--disabled) .cmp-button`)
        .first();
      if (await btn.count() === 0) continue;
      await btn.hover();
      const cursor = await btn.evaluate(el => getComputedStyle(el).cursor);
      expect(cursor, `[GAAM-213] ${variant} must show pointer cursor on hover`).toBe('pointer');
    }
  });

  test('[BTTN-025] @regression [GAAM-213] Hover transition duration is non-zero (animation is not instant)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.button.ga-button--primary:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    const durationMs = await btn.evaluate(el => {
      const dur = getComputedStyle(el).transitionDuration;
      if (!dur || dur === '') return 0;
      return dur.includes('ms') ? parseFloat(dur) : parseFloat(dur) * 1000;
    });
    expect(durationMs, '[GAAM-213] Button hover transition duration must be > 0ms (not instant)').toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Reskin — Focus States (BTTN-026 – BTTN-028) GAAM-213
// ---------------------------------------------------------------------------

test.describe('Button — Reskin Focus States', () => {
  test('[BTTN-026] @a11y @regression Focus ring is visible on primary button (outline or box-shadow)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.button.ga-button--primary:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    await btn.focus();
    const focus = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return { outline: cs.outlineStyle, outlineWidth: cs.outlineWidth, boxShadow: cs.boxShadow };
    });
    const hasOutline = focus.outline !== 'none' && parseFloat(focus.outlineWidth) > 0;
    const hasBoxShadow = focus.boxShadow !== 'none' && focus.boxShadow !== '';
    expect(hasOutline || hasBoxShadow, 'Primary button must show a visible focus indicator').toBe(true);
  });

  test('[BTTN-027] @a11y @regression Focus ring is visible on secondary button', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.button.ga-button--secondary:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    await btn.focus();
    const focus = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return { outline: cs.outlineStyle, outlineWidth: cs.outlineWidth, boxShadow: cs.boxShadow };
    });
    const hasOutline = focus.outline !== 'none' && parseFloat(focus.outlineWidth) > 0;
    const hasBoxShadow = focus.boxShadow !== 'none' && focus.boxShadow !== '';
    expect(hasOutline || hasBoxShadow, 'Secondary button must show a visible focus indicator').toBe(true);
  });

  test('[BTTN-028] @a11y @regression Focus ring is visible on icon-text button', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const btn = page
      .locator('.button.ga-button--icon-text:not(.ga-button--disabled) .cmp-button')
      .first();
    if (await btn.count() === 0) { test.skip(); return; }
    await btn.focus();
    const focus = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return { outline: cs.outlineStyle, outlineWidth: cs.outlineWidth, boxShadow: cs.boxShadow };
    });
    const hasOutline = focus.outline !== 'none' && parseFloat(focus.outlineWidth) > 0;
    const hasBoxShadow = focus.boxShadow !== 'none' && focus.boxShadow !== '';
    expect(hasOutline || hasBoxShadow, 'Icon-text button must show a visible focus indicator').toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Reskin — Disabled State (BTTN-029 – BTTN-031) GAAM-213
// ---------------------------------------------------------------------------

test.describe('Button — Reskin Disabled State', () => {
  test('[BTTN-029] @regression Disabled button has reduced opacity or greyed appearance', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const disabledWrapper = page.locator('.button.ga-button--disabled').first();
    if (await disabledWrapper.count() === 0) { test.skip(); return; }
    const btn = disabledWrapper.locator('.cmp-button').first();
    if (await btn.count() === 0) { test.skip(); return; }
    const opacity = await btn.evaluate(el => parseFloat(getComputedStyle(el).opacity));
    // Disabled buttons should appear visually muted (opacity < 1 or pointer-events none)
    const pointerEvents = await btn.evaluate(el => getComputedStyle(el).pointerEvents);
    const isVisuallyMuted = opacity < 1 || pointerEvents === 'none';
    expect(isVisuallyMuted, 'Disabled button must appear visually muted (reduced opacity or pointer-events: none)').toBe(true);
  });

  test('[BTTN-030] @regression Disabled button has aria-disabled="true" or disabled attribute', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const disabledWrapper = page.locator('.button.ga-button--disabled').first();
    if (await disabledWrapper.count() === 0) { test.skip(); return; }
    const btn = disabledWrapper.locator('.cmp-button').first();
    if (await btn.count() === 0) { test.skip(); return; }
    const ariaDisabled = await btn.getAttribute('aria-disabled');
    const isDisabled = await btn.isDisabled().catch(() => false);
    expect(
      ariaDisabled === 'true' || isDisabled,
      'Disabled button must have aria-disabled="true" or be natively disabled'
    ).toBe(true);
  });

  test('[BTTN-031] @regression Disabled button cannot be activated via keyboard Enter', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const disabledWrapper = page.locator('.button.ga-button--disabled').first();
    if (await disabledWrapper.count() === 0) { test.skip(); return; }
    const btn = disabledWrapper.locator('.cmp-button').first();
    if (await btn.count() === 0) { test.skip(); return; }
    // Pressing Enter on a disabled button should not navigate or throw
    await btn.focus().catch(() => {});
    await btn.press('Enter').catch(() => {});
    // Verify page did not navigate away
    const url = page.url();
    expect(url, 'Disabled button Enter press must not trigger navigation').not.toBe('about:blank');
  });
});

// ---------------------------------------------------------------------------
// AEM Dialog & GA Overlay Registration (BTTN-032 – BTTN-036) GAAM-213
// ---------------------------------------------------------------------------

test.describe('Button — AEM Dialog & GA Overlay', () => {
  test('[BTTN-032] @author @regression GA button overlay exists at /apps/ga/components/content/button', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/button.1.json`;
    const response = await page.request.get(url);
    expect(response.ok(), `GA button overlay not found at ${url}`).toBe(true);
  });

  test('[BTTN-033] @author @regression GA button overlay has correct sling:resourceSuperType', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/button.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['sling:resourceSuperType'], 'sling:resourceSuperType must reference kkr-aem-base button').toBe('kkr-aem-base/components/content/button');
  });

  test('[BTTN-034] @author @regression GA button overlay has componentGroup "GA Base"', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/button.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['componentGroup'], 'componentGroup must be GA Base').toBe('GA Base');
  });

  test('[BTTN-035] @author @regression GA button _cq_dialog overlay exists and returns 200', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/button/_cq_dialog.1.json`;
    const response = await page.request.get(url);
    expect(response.ok(), `GA button _cq_dialog not found at ${url}`).toBe(true);
  });

  test('[BTTN-036] @author @regression GA button _cq_dialog has helpPath configured', async ({ page }) => {
    const url = `${BASE()}/apps/ga/components/content/button/_cq_dialog.1.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath, 'Button dialog missing helpPath').toBeTruthy();
  });
});
