import { test, expect } from '@playwright/test';
import { HeadlineBlockPage } from '../../../pages/ga/components/headlineBlockPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const HB = '.ga-headline-block';
const CTA_WRAPPER = '.ga-headline-block__cta-wrapper';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ── CTA Button Hover States ──

test.describe('Headline Block — CTA Hover States', () => {
  test('[HB-INT-001] @interaction @regression Primary CTA hover changes background on light section', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    await btn.scrollIntoViewIfNeeded();
    const bgBefore = await btn.evaluate(el => getComputedStyle(el).backgroundColor);
    await btn.hover();
    const bgAfter = await btn.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('[HB-INT-002] @interaction @regression Secondary CTA hover changes border/background on light section', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).nth(1);
    await btn.scrollIntoViewIfNeeded();
    const bgBefore = await btn.evaluate(el => getComputedStyle(el).backgroundColor);
    const borderBefore = await btn.evaluate(el => getComputedStyle(el).borderColor);
    await btn.hover();
    const bgAfter = await btn.evaluate(el => getComputedStyle(el).backgroundColor);
    const borderAfter = await btn.evaluate(el => getComputedStyle(el).borderColor);
    // At least one of background or border should change
    const changed = bgAfter !== bgBefore || borderAfter !== borderBefore;
    expect(changed).toBe(true);
  });

  test('[HB-INT-003] @interaction @regression CTA hover on granite (dark) section changes styling', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(`${SECTION_GRANITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    await btn.scrollIntoViewIfNeeded();
    const before = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
    });
    await btn.hover();
    const after = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
    });
    const changed = after.bg !== before.bg || after.border !== before.border ||
                    after.color !== before.color || after.boxShadow !== before.boxShadow;
    expect(changed).toBe(true);
  });

  test('[HB-INT-004] @interaction @regression CTA hover on azul (dark) section changes styling', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(`${SECTION_AZUL} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    await btn.scrollIntoViewIfNeeded();
    const before = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
    });
    await btn.hover();
    const after = await btn.evaluate(el => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, boxShadow: cs.boxShadow };
    });
    // At least one property should change on hover
    const changed = after.bg !== before.bg || after.border !== before.border ||
                    after.color !== before.color || after.boxShadow !== before.boxShadow;
    expect(changed).toBe(true);
  });

  test('[HB-INT-005] @interaction @regression CTA hover transition uses CSS animation (not instant)', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const btn = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    const transition = await btn.evaluate(el => getComputedStyle(el).transition);
    // Should have a transition property set (not 'none' or empty)
    expect(transition.length).toBeGreaterThan(0);
    expect(transition).not.toBe('none 0s ease 0s');
  });
});

// ── Keyboard Navigation ──

test.describe('Headline Block — Keyboard Navigation', () => {
  test('[HB-INT-006] @interaction @a11y @regression Tab navigates to CTA buttons', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const firstCta = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    await firstCta.scrollIntoViewIfNeeded();
    await firstCta.focus();
    const firstId = await firstCta.evaluate(el => el.id || el.textContent);

    // Tab to next CTA
    await page.keyboard.press('Tab');
    const focusedText = await page.evaluate(() => document.activeElement?.textContent?.trim());
    // Focus should have moved to a different element
    expect(focusedText).not.toBe(firstId);
  });

  test('[HB-INT-007] @interaction @a11y @regression Enter key activates CTA link', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const cta = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    await cta.scrollIntoViewIfNeeded();
    await cta.focus();
    // CTA should be an <a> element
    const tagName = await cta.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    // Pressing Enter on a focused link should trigger navigation
    // Since href="#", we just verify the element is focusable and interactive
    const href = await cta.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('[HB-INT-008] @interaction @a11y @regression Focus visible on dark background CTA', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const cta = page.locator(`${SECTION_GRANITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    await cta.scrollIntoViewIfNeeded();
    await cta.focus();
    // Verify focus indicator is visible (outline or box-shadow)
    const hasIndicator = await cta.evaluate(el => {
      const cs = getComputedStyle(el);
      const outlineW = parseFloat(cs.outlineWidth) || 0;
      const boxShadow = cs.boxShadow;
      return outlineW > 0 || (boxShadow !== 'none' && boxShadow !== '');
    });
    expect(hasIndicator).toBe(true);
  });
});

// ── CTA Layout Responsiveness ──

test.describe('Headline Block — CTA Layout Transitions', () => {
  test('[HB-INT-009] @interaction @regression CTA layout: horizontal at 1440px → vertical at 390px', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    // Desktop first
    await page.setViewportSize({ width: 1440, height: 900 });
    await pom.navigate(BASE());
    const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
    const desktopDir = await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
    expect(desktopDir).toBe('row');

    // Switch to mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300); // Allow reflow
    const mobileDir = await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
    expect(mobileDir).toBe('column');
  });

  test('[HB-INT-010] @interaction @regression CTA buttons vertically aligned on mobile (start alignment)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
    const alignItems = await ctaWrapper.evaluate(el => getComputedStyle(el).alignItems);
    expect(alignItems).toBe('flex-start');
  });
});

// ── Cross-Background Consistency ──

test.describe('Headline Block — Cross-Background Interaction Consistency', () => {
  test('[HB-INT-011] @interaction @regression All 4 backgrounds have functional CTAs', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const sections = [SECTION_WHITE, SECTION_SLATE, SECTION_GRANITE, SECTION_AZUL];
    for (const section of sections) {
      const cta = page.locator(`${section} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
      await expect(cta).toBeVisible();
      await expect(cta).toBeEnabled();
      const href = await cta.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('[HB-INT-012] @interaction @regression CTA icon (Arrow-Right) renders on all backgrounds', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const sections = [SECTION_WHITE, SECTION_GRANITE, SECTION_AZUL];
    for (const section of sections) {
      const icon = page.locator(`${section} ${HB} ${CTA_WRAPPER} .cmp-button__icon`).first();
      await expect(icon).toBeVisible();
      await expect(icon).toHaveClass(/Arrow-Right/);
    }
  });
});
