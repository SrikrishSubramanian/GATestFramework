import { resolveComponentUrl, deployFixture } from '../../../utils/infra/content-fixture-deployer';
import { test, expect } from '@playwright/test';
import { PromoBannerPage } from '../../../pages/ga/components/promoBannerPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const componentUrl = () => resolveComponentUrl('promo-banner');

const PB              = '.cmp-promo-banner';
const PB_SOCIAL_LINK  = '.cmp-promo-banner__links-social a';
const PB_CTA          = '.cmp-promo-banner__links-cta .cmp-button';
const PB_ICON_ARROW   = '.cmp-button__icon.Arrow-Right';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
  // componentUrl() resolves to the test-fixtures path (fixture exists for this
  // component) — that path 404s until the fixture is deployed, which then
  // hangs every locator wait below for the full worker timeout. Assert here so a
  // deploy race/failure fails fast with a clear message instead of a silent hang.
  const deployResult = await deployFixture('promo-banner', page);
  expect(deployResult.deployed, `Fixture deploy failed: ${deployResult.message}`).toBe(true);
  capture = new ConsoleCapture(page);
  capture.start();
});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('PromoBanner — Interaction Tests', () => {

  // ── Social Link Hover ────────────────────────────────────────────────────

  test('@interaction @regression @sanity PB-INT-001 social link hover changes background to white', async ({ page }) => {
    // Social links only exist on the footer variant of the fixture, not the
    // style guide's default instances.
    await page.goto(componentUrl(), { waitUntil: 'domcontentloaded' });

    const link = page.locator(PB_SOCIAL_LINK).first();
    if (await link.count() === 0) {
      test.skip();
      return;
    }
    await expect(link).toBeVisible();

    // Capture pre-hover background
    const bgBefore = await link.evaluate((el) => getComputedStyle(el).backgroundColor);

    await hover(link);
    // Wait for the 0.18s CSS hover transition (see PB-INT-003) to fully settle at its final
    // (opaque white) value — a fixed wait can catch Firefox mid-transition, e.g.
    // "rgba(255, 255, 255, 0.64)" instead of the final "rgb(255, 255, 255)".
    await expect.poll(
      () => link.evaluate((el) => getComputedStyle(el).backgroundColor),
      { timeout: 3000 }
    ).toBe('rgb(255, 255, 255)');

    const bgAfter = await link.evaluate((el) => getComputedStyle(el).backgroundColor);

    // After hover the background should be white (rgb(255, 255, 255))
    expect(bgAfter, `Expected 'rgb(255, 255, 255, got ${bgAfter}`).toBe('rgb(255, 255, 255)');
    // And it should differ from the resting state
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('@interaction @regression PB-INT-002 social link CSS defines white color', async ({ page }) => {
    await page.goto(componentUrl(), { waitUntil: 'domcontentloaded' });
    const link = page.locator(PB_SOCIAL_LINK).first();
    if (await link.count() === 0) {
      // No social links on page — inject temp element to verify CSS rule
      const linksArea = page.locator('.cmp-promo-banner__links').first();
      const color = // 📏 TODO: Replace with measurement-utils
    await linksArea.evaluate(el => {
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
    const iconColor = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => {
      const icon = el.querySelector('i');
      return icon ? getComputedStyle(icon).color : getComputedStyle(el).color;
    });
    expect(iconColor, `Expected 'rgb(255, 255, 255, got ${iconColor}`).toBe('rgb(255, 255, 255)');
  });

  test('@interaction @regression PB-INT-003 social link CSS defines transition 0.18s', async ({ page }) => {
    await page.goto(componentUrl(), { waitUntil: 'domcontentloaded' });
    const link = page.locator(PB_SOCIAL_LINK).first();
    if (await link.count() === 0) {
      const linksArea = page.locator('.cmp-promo-banner__links').first();
      const transition = // 📏 TODO: Replace with measurement-utils
    await linksArea.evaluate(el => {
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
    const transition = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el).transition); // measurement: use measurement-utils for cleaner code
    expect(transition).toContain('0.18s');
  });

  // ── CTA Button Hover ─────────────────────────────────────────────────────

  test('@interaction @regression PB-INT-004 CTA button hover changes background color', async ({ page }) => {
    await page.goto(componentUrl());
    await page.locator(PB_CTA).first().waitFor({ state: 'visible' });

    const btn = page.locator(PB_CTA).first();
    await expect(btn).toBeVisible();

    const bgBefore = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);

    await hover(btn);
    // Wait for the 0.18s CSS hover transition (see PB-INT-003) to fully settle rather than
    // racing a fixed-duration sleep against browser-dependent transition timing.
    await expect.poll(
      () => btn.evaluate((el) => getComputedStyle(el).backgroundColor),
      { timeout: 3000 }
    ).not.toBe(bgBefore);

    const bgAfter = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);

    // Background must change on hover
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('@interaction @regression PB-INT-005 CTA button contains Arrow-Right icon', async ({ page }) => {
    await page.goto(componentUrl());
    await page.locator(PB_CTA).first().waitFor({ state: 'visible' });

    // Each CTA button should contain the Arrow-Right icon element
    const arrowIcon = page.locator(`${PB_CTA} ${PB_ICON_ARROW}`).first();
    await expect(arrowIcon).toBeVisible();
  });

  test('@interaction @regression PB-INT-006 CTA button link has cursor pointer', async ({ page }) => {
    await page.goto(componentUrl());
    await page.locator(PB_CTA).first().waitFor({ state: 'visible' });

    const cursor = await page.locator(PB_CTA).first().evaluate((el) => getComputedStyle(el) /* TODO: use component-assertions */.cursor // measurement: use measurement-utils for cleaner code
    );

    expect(cursor).toBe('pointer');
  });

  // ── Keyboard Navigation ──────────────────────────────────────────────────

  test('@interaction @regression PB-INT-008 Tab key reaches CTA buttons', async ({ page }) => {
    await page.goto(componentUrl());
    await page.locator(PB_CTA).first().waitFor({ state: 'visible' });

    await page.keyboard.press('Tab');
    let focused = false;
    for (let i = 0; i < 40; i++) {
      const activeIsCta = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.closest('.cmp-promo-banner__links-cta .cmp-button') !== null : false;
      });
      if (activeIsCta) { focused = true; break; }
      await page.keyboard.press('Tab');
    }

    expect(focused).toBe(true);
  });

  test('@interaction @regression PB-INT-009 social link focus-visible CSS defines outline', async ({ page }) => {
    await page.goto(componentUrl(), { waitUntil: 'domcontentloaded' });
    const firstLink = page.locator(PB_SOCIAL_LINK).first();
    if (await firstLink.count() === 0) {
      // No social links — verify CSS rule via injection
      const linksArea = page.locator('.cmp-promo-banner__links').first();
      const outlineOffset = // 📏 TODO: Replace with measurement-utils
    await linksArea.evaluate(el => {
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

    const { outlineWidth, outlineColor, outlineOffset } = // 📏 TODO: Replace with measurement-utils
    await firstLink.evaluate((el) => {
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
    await page.goto(componentUrl());
    await page.locator(PB_CTA).first().waitFor({ state: 'visible' });

    const flexDirection = await page.locator(PB).first().evaluate((el) => getComputedStyle(el) /* TODO: use component-assertions */.flexDirection // measurement: use measurement-utils for cleaner code
    );

    expect(flexDirection).toBe('row');
  });

  test('@interaction @regression PB-INT-011 mobile layout: promo-banner is NOT flex-row', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(componentUrl(), { waitUntil: 'domcontentloaded' });
    await page.locator(PB).first().waitFor({ state: 'visible' });

    const layout = await page.locator(PB).first().evaluate(el => {
      const cs = getComputedStyle(el);
      return { display: cs.display, flexDirection: cs.flexDirection };
    });

    // On mobile: display is block (no flex), or flex-column — NOT flex-row
    if (layout.display === 'flex') {
      expect(layout.flexDirection).not.toBe('row');
    } else {
      expect(layout.display).toBe('block'); // TODO: Use assertLayout() for display checks
    }
  });

  test('@interaction @regression PB-INT-012 CTA flex-direction changes from row (desktop) to column (mobile)', async ({ page }) => {
    const ctaSelector = '.cmp-promo-banner__links-cta';

    // Desktop
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(componentUrl());
    await page.locator(PB_CTA).first().waitFor({ state: 'visible' });

    const desktopDir = await page.locator(ctaSelector).first().evaluate((el) => getComputedStyle(el) /* TODO: use component-assertions */.flexDirection // measurement: use measurement-utils for cleaner code
    );

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // allow layout reflow

    const mobileDir = await page.locator(ctaSelector).first().evaluate((el) => getComputedStyle(el) /* TODO: use component-assertions */.flexDirection // measurement: use measurement-utils for cleaner code
    );

    expect(desktopDir).toBe('row');
    expect(['column', 'column-reverse']).toContain(mobileDir);
  });

});
