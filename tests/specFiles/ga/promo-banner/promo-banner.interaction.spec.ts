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

  test('@interaction @regression PB-INT-002 social link hover changes icon color from white to granite', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_SOCIAL_LINK);

    const link = page.locator(PB_SOCIAL_LINK).first();
    await expect(link).toBeVisible();

    // Icon / SVG color before hover should be white
    const colorBefore = await link.evaluate((el) => getComputedStyle(el).color);

    await link.hover();
    await page.waitForTimeout(250);

    const colorAfter = await link.evaluate((el) => getComputedStyle(el).color);

    // After hover the foreground (icon) color should be granite-ish — not white
    expect(colorAfter).not.toBe('rgb(255, 255, 255)');
    // The resting state should have been white
    expect(colorBefore).toBe('rgb(255, 255, 255)');
  });

  test('@interaction @regression PB-INT-003 social link has CSS transition all 0.18s ease', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_SOCIAL_LINK);

    const transition = await page.locator(PB_SOCIAL_LINK).first().evaluate((el) =>
      getComputedStyle(el).transition
    );

    // Transition must reference "all" and contain ~0.18s
    expect(transition).toContain('0.18s');
    expect(transition.toLowerCase()).toContain('ease');
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

  test('@interaction @regression PB-INT-009 focus-visible on social link shows 2px white outline', async ({ page }) => {
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB_SOCIAL_LINK);

    // Focus the first social link via Tab
    const firstLink = page.locator(PB_SOCIAL_LINK).first();
    await firstLink.focus();

    const { outlineWidth, outlineColor, outlineOffset } = await firstLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        outlineWidth:  s.outlineWidth,
        outlineColor:  s.outlineColor,
        outlineOffset: s.outlineOffset,
      };
    });

    expect(outlineWidth).toBe('2px');
    // Outline color must be white (rgb(255,255,255)) or close to it
    expect(outlineColor).toBe('rgb(255, 255, 255)');
    expect(outlineOffset).toBe('2px');
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

  test('@interaction @regression PB-INT-011 mobile layout: promo-banner stacks vertically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(STYLE_GUIDE_URL());
    await page.waitForSelector(PB);

    const flexDirection = await page.locator(PB).first().evaluate((el) =>
      getComputedStyle(el).flexDirection
    );

    // On mobile the component should stack (column or column-reverse)
    expect(['column', 'column-reverse']).toContain(flexDirection);
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
