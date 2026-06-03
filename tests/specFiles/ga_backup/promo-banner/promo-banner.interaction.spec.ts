import { test, expect } from '@playwright/test';
import { PromoBannerPage } from '../../../pages/ga/components/promoBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const STYLE_GUIDE_URL = () =>
  `${BASE()}/content/global-atlantic/style-guide/components/promo-banner.html?wcmmode=disabled`;

const PB              = '.cmp-promo-banner';
const PB_SOCIAL_LINK  = '.cmp-promo-banner__links-social a';
const PB_CTA          = '.cmp-promo-banner__links-cta .cmp-button';
const PB_ICON_ARROW   = '.cmp-button__icon.Arrow-Right';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('PromoBanner — Interaction Tests', () => {

  // ── Social Link Hover ────────────────────────────────────────────────────

  test('@interaction @regression PB-INT-001 social link hover changes background to white', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_SOCIAL_LINK);

    const link = page.locator(PB_SOCIAL_LINK).first();
    await expect(link).toBeVisible();

    // Capture pre-hover background
    const bgBefore = await link.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );

    await link.hover();
    await page.waitForTimeout(250); // allow transition to complete

    const bgAfter = await link.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );

    // After hover the background should be white (rgb(255, 255, 255))
    expect(bgAfter).toBe('rgb(255, 255, 255)');
    // And it should differ from the resting state
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('@interaction @regression PB-INT-002 social link CSS defines white color', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForLoadState('networkidle');
    const link = page.locator(PB_SOCIAL_LINK).first();
    if (await link.count() === 0) {
      // No social links on page — inject temp element to verify CSS rule
      const linksArea = page.locator('.cmp-promo-banner__links').first();
      const color = await linksArea.evaluate(el => {
        const div = document.createElement('div');
        div.className = 'cmp-promo-banner__links-social';
        const a = document.createElement('a');
        const i = document.createElement('i');
        a.appendChild(i);
        div.appendChild(a);
        el.prepend(div);
        const cs = getComputedStyle(i).color;
        div.remove();
        return cs;
      });
      // Social icon color should be white on dark bg
      expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
      return;
    }
    // The <i> inside the <a> has white color (LESS: .cmp-promo-banner__links-social i { color: white })
    const iconColor = await link.evaluate(el => {
      const icon = el.querySelector('i');
      return icon ? getComputedStyle(icon).color : getComputedStyle(el).color;
    });
    expect(iconColor).toBe('rgb(255, 255, 255)');
  });

  test('@interaction @regression PB-INT-003 social link CSS defines transition 0.18s', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForLoadState('networkidle');
    const link = page.locator(PB_SOCIAL_LINK).first();
    if (await link.count() === 0) {
      const linksArea = page.locator('.cmp-promo-banner__links').first();
      const transition = await linksArea.evaluate(el => {
        const div = document.createElement('div');
        div.className = 'cmp-promo-banner__links-social';
        const a = document.createElement('a');
        div.appendChild(a);
        el.prepend(div);
        const cs = getComputedStyle(a).transition;
        div.remove();
        return cs;
      });
      expect(transition).toContain('0.18s');
      return;
    }
    const transition = await link.evaluate(el => getComputedStyle(el).transition);
    expect(transition).toContain('0.18s');
  });

  // ── CTA Button Hover ─────────────────────────────────────────────────────

  test('@interaction @regression PB-INT-004 CTA button hover changes background color', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_CTA);

    const btn = page.locator(PB_CTA).first();
    await expect(btn).toBeVisible();

    const bgBefore = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);

    await btn.hover();
    await page.waitForTimeout(250);

    const bgAfter = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);

    // Background must change on hover
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('@interaction @regression PB-INT-005 CTA button contains Arrow-Right icon', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_CTA);

    // Each CTA button should contain the Arrow-Right icon element
    const arrowIcon = page.locator(`${PB_CTA} ${PB_ICON_ARROW}`).first();
    await expect(arrowIcon).toBeVisible();
  });

  test('@interaction @regression PB-INT-006 CTA button link has cursor pointer', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_CTA);

    const cursor = await page.locator(PB_CTA).first().evaluate((el) =>
      getComputedStyle(el).cursor
    );

    expect(cursor).toBe('pointer');
  });

  // ── Keyboard Navigation ──────────────────────────────────────────────────

  test('@interaction @regression PB-INT-007 Tab key reaches social links', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_SOCIAL_LINK);

    // Start from the top of the page and Tab until a social link is focused
    await page.keyboard.press('Tab');
    let focused = false;
    for (let i = 0; i < 30; i++) {
      const activeTag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.closest('.cmp-promo-banner__links-social a') !== null : false;
      });
      if (activeTag) { focused = true; break; }
      await page.keyboard.press('Tab');
    }

    expect(focused).toBe(true);
  });

  test('@interaction @regression PB-INT-008 Tab key reaches CTA buttons', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_CTA);

    await page.keyboard.press('Tab');
    let focused = false;
    for (let i = 0; i < 40; i++) {
      const activeIsCta = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.closest('.cmp-promo-banner__links-cta .cmp-button') !== null : false;
      });
      if (activeIsCta) { focused = true; break; }
      await page.keyboard.press('Tab');
    }

    expect(focused).toBe(true);
  });

  test('@interaction @regression PB-INT-009 social link focus-visible CSS defines outline', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForLoadState('networkidle');
    const firstLink = page.locator(PB_SOCIAL_LINK).first();
    if (await firstLink.count() === 0) {
      // No social links — verify CSS rule via injection
      const linksArea = page.locator('.cmp-promo-banner__links').first();
      const outlineOffset = await linksArea.evaluate(el => {
        const div = document.createElement('div');
        div.className = 'cmp-promo-banner__links-social';
        const a = document.createElement('a');
        div.appendChild(a);
        el.prepend(div);
        const r = getComputedStyle(a).outlineOffset;
        div.remove();
        return r;
      });
      // CSS defines outline-offset: 2px for :focus-visible
      expect(outlineOffset).toBe('2px');
      return;
    }

    // Use keyboard Tab to trigger :focus-visible
    await firstLink.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');

    const { outlineWidth, outlineColor, outlineOffset } = await firstLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        outlineWidth:  s.outlineWidth,
        outlineColor:  s.outlineColor,
        outlineOffset: s.outlineOffset,
      };
    });

    // Focus-visible should show outline (width > 0 or offset defined)
    const hasFocus = parseFloat(outlineWidth) > 0 || outlineOffset === '2px';
    expect(hasFocus).toBe(true);
  });

  // ── Responsive Layout Transitions ────────────────────────────────────────

  test('@interaction @regression PB-INT-010 desktop layout: promo-banner uses flex-direction row', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB);

    const flexDirection = await page.locator(PB).first().evaluate((el) =>
      getComputedStyle(el).flexDirection
    );

    expect(flexDirection).toBe('row');
  });

  test('@interaction @regression PB-INT-011 mobile layout: promo-banner is NOT flex-row', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForLoadState('networkidle');

    const layout = await page.locator(PB).first().evaluate(el => {
      const cs = getComputedStyle(el);
      return { display: cs.display, flexDirection: cs.flexDirection };
    });

    // On mobile: display is block (no flex), or flex-column — NOT flex-row
    if (layout.display === 'flex') {
      expect(layout.flexDirection).not.toBe('row');
    } else {
      expect(layout.display).toBe('block');
    }
  });

  test('@interaction @regression PB-INT-012 CTA flex-direction changes from row (desktop) to column (mobile)', async ({ page }) => {
    const ctaSelector = '.cmp-promo-banner__links-cta';

    // Desktop
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(ctaSelector);

    const desktopDir = await page.locator(ctaSelector).first().evaluate((el) =>
      getComputedStyle(el).flexDirection
    );

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(200); // allow layout reflow

    const mobileDir = await page.locator(ctaSelector).first().evaluate((el) =>
      getComputedStyle(el).flexDirection
    );

    expect(desktopDir).toBe('row');
    expect(['column', 'column-reverse']).toContain(mobileDir);
  });

});
