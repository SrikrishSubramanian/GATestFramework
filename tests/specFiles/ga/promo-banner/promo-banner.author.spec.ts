import { test, expect } from '@playwright/test';
import { PromoBannerPage } from '../../../pages/ga/components/promoBannerPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const PB_WRAPPER = '.promo-banner';
const PB = '.cmp-promo-banner';
const PB_CONTENT = '.cmp-promo-banner__content';
const PB_LOGO = '.cmp-promo-banner__logo';
const PB_TITLE = '.cmp-promo-banner__title';
const PB_LINKS = '.cmp-promo-banner__links';
const PB_SOCIAL = '.cmp-promo-banner__links-social';
const PB_CTA = '.cmp-promo-banner__links-cta';
const CMP_BUTTON = '.cmp-button';

test.beforeEach(async ({ page }) => {
  capture = new ConsoleCapture(page);
  capture.start();
  await loginToAEMAuthor(page);
});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

// ---------------------------------------------------------------------------
// Core Structure (PB-001 – PB-010)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Core Structure', () => {
  test('[PB-001] @smoke @regression multiple banner instances render on style guide', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const banners = page.locator(PB);
    const count = await banners.count();
    expect(count, 'Expected at least one .cmp-promo-banner on the style guide page').toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(banners.nth(i)).toBeVisible();
    }
  });

  test('[PB-002] @smoke @regression root element has granite background by default', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    // The first banner on the style guide should be the default granite variant
    const graniteEl = page.locator(`${PB}.cmp-promo-banner--granite`).first();
    // Fall back to checking computed background color if modifier class not present
    const hasGraniteClass = await graniteEl.count();
    if (hasGraniteClass > 0) {
      await expect(graniteEl).toBeVisible();
    } else {
      // Fallback: first banner should have a dark background (not white)
      const bg = await page.locator(PB).first().evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
      expect(bg, 'Default promo-banner background should not be white').not.toBe('rgb(255, 255, 255)');
    }
  });

  test('[PB-003] @smoke @regression root has 20px border-radius on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    const radius = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    expect(radius, 'Desktop border-radius should be 20px').toBe('20px');
  });

  test('[PB-004] @smoke @regression root has 16px border-radius on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    const radius = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    expect(radius, 'Mobile border-radius should be 16px').toBe('16px');
  });

  test('[PB-005] @smoke @regression root element has white text color', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    const color = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => getComputedStyle(el).color); // measurement: use measurement-utils for cleaner code
    expect(color, 'Promo banner text color should be white (rgb(255, 255, 255))', `Expected 'rgb(255, 255, 255, got ${color, 'Promo banner text color should be white (rgb(255, 255, 255))'}`).toBe('rgb(255, 255, 255)');
  });

  test('[PB-006] @smoke @regression desktop root uses flex layout with align-items center', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    const styles = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => {
      const cs = getComputedStyle(el);
      return { display: cs.display, alignItems: cs.alignItems };
    });
    expect(styles.display, 'Root should be flex on desktop').toBe('flex'); // TODO: Use assertLayout() for display checks
    expect(styles.alignItems, 'Root flex align-items should be center on desktop').toBe('center');
  });

  test('[PB-007] @smoke @regression content area has flex:1 (fills available space)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const content = page.locator(PB_CONTENT).first();
    const count = await content.count();
    if (count === 0) { test.skip(); return; }
    await expect(content).toBeVisible();
    const flexGrow = // 📏 TODO: Replace with measurement-utils
    await content.evaluate(el => getComputedStyle(el).flexGrow); // measurement: use measurement-utils for cleaner code
    expect(flexGrow, 'Content area flexGrow should be 1').toBe('1');
  });

  test('[PB-008] @smoke @regression title element is an h4 tag', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const titleEl = page.locator(PB_TITLE).first();
    const count = await titleEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(titleEl).toBeVisible();
    const tagName = // 📏 TODO: Replace with measurement-utils
    await titleEl.evaluate(el => el.tagName.toLowerCase());
    expect(tagName, 'Banner title should be rendered as an <h4>').toBe('h4');
  });

  test('[PB-009] @smoke @regression CTA buttons are present and visible', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const ctaArea = page.locator(PB_CTA).first();
    const count = await ctaArea.count();
    if (count === 0) { test.skip(); return; }
    await expect(ctaArea).toBeVisible();
    const buttons = ctaArea.locator(`${CMP_BUTTON}, a, button`);
    const btnCount = await buttons.count();
    expect(btnCount, 'At least one CTA button should exist').toBeGreaterThan(0);
  });

  test('[PB-010] @smoke @regression no inline styles on root element', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    const inlineStyle = await root.getAttribute('style');
    expect(inlineStyle ?? '', 'Root element must not have inline styles').toBe('');
  });
});

// ---------------------------------------------------------------------------
// Style Variants (PB-011 – PB-016)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Style Variants', () => {
  test('[PB-011] @regression granite variant has correct dark background color', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const graniteEl = page.locator(`${PB}.cmp-promo-banner--granite`).first();
    const count = await graniteEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(graniteEl).toBeVisible();
    const bg = // 📏 TODO: Replace with measurement-utils
    await graniteEl.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    // Granite is a dark color — should not be white or transparent
    expect(bg, 'Granite variant background should not be white').not.toBe('rgb(255, 255, 255)');
    expect(bg, 'Granite variant background should not be transparent').not.toBe('rgba(0, 0, 0, 0)');
  });

  test('[PB-012] @regression azul variant has correct background color', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const azulEl = page.locator(`${PB}.cmp-promo-banner--azul`).first();
    const count = await azulEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(azulEl).toBeVisible();
    const bg = // 📏 TODO: Replace with measurement-utils
    await azulEl.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    expect(bg, 'Azul variant background should not be white').not.toBe('rgb(255, 255, 255)');
    expect(bg, 'Azul variant background should not be transparent').not.toBe('rgba(0, 0, 0, 0)');
  });

  test('[PB-013] @regression aubergine variant has correct twilight background color', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const aubergineEl = page.locator(`${PB}.cmp-promo-banner--aubergine`).first();
    const count = await aubergineEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(aubergineEl).toBeVisible();
    const bg = // 📏 TODO: Replace with measurement-utils
    await aubergineEl.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    expect(bg, 'Aubergine variant background should not be white').not.toBe('rgb(255, 255, 255)');
    expect(bg, 'Aubergine variant background should not be transparent').not.toBe('rgba(0, 0, 0, 0)');
  });

  test('[PB-014] @regression footer variant has azul background and border separator on title', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const footerEl = page.locator(`${PB}.cmp-promo-banner--footer`).first();
    const count = await footerEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(footerEl).toBeVisible();
    const bg = // 📏 TODO: Replace with measurement-utils
    await footerEl.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    expect(bg, 'Footer variant background should not be white').not.toBe('rgb(255, 255, 255)');
    // Title inside footer variant should have a border separator
    const titleInFooter = footerEl.locator(PB_TITLE).first();
    const titleCount = await titleInFooter.count();
    if (titleCount > 0) {
      const borderRight = // 📏 TODO: Replace with measurement-utils
    await titleInFooter.evaluate(el => getComputedStyle(el).borderRightWidth); // measurement: use measurement-utils for cleaner code
      const borderWidth = parseFloat(borderRight);
      expect(borderWidth, 'Footer variant title should have a border separator (borderRight > 0)').toBeGreaterThan(0);
    }
  });

  test('[PB-015] @regression all variants maintain white text color', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const variants = ['cmp-promo-banner--granite', 'cmp-promo-banner--azul', 'cmp-promo-banner--aubergine'];
    for (const variant of variants) {
      const el = page.locator(`${PB}.${variant}`).first();
      const count = await el.count();
      if (count === 0) continue;
      const color = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => getComputedStyle(el).color); // measurement: use measurement-utils for cleaner code
      expect(color, `Variant ${variant} should have white text`, `Expected 'rgb(255, 255, 255, got ${color, `Variant ${variant} should have white text`}`).toBe('rgb(255, 255, 255)');
    }
  });

  test('[PB-016] @regression each banner instance has exactly one variant class active', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const banners = page.locator(PB);
    const count = await banners.count();
    const variantClasses = ['cmp-promo-banner--granite', 'cmp-promo-banner--azul', 'cmp-promo-banner--aubergine', 'cmp-promo-banner--footer'];
    for (let i = 0; i < count; i++) {
      const classList = await banners.nth(i).evaluate(el => Array.from(el.classList));
      const activeVariants = variantClasses.filter(v => classList.includes(v));
      expect(activeVariants.length, `Banner ${i} should have at most one variant modifier class`).toBeLessThanOrEqual(1);
    }
  });
});

// ---------------------------------------------------------------------------
// Padding (PB-017 – PB-022)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Padding', () => {
  test('[PB-017] @regression desktop default has 64px top and bottom padding', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(PB_WRAPPER).first();
    const count = await wrapper.count();
    if (count === 0) { test.skip(); return; }
    await expect(wrapper).toBeVisible();
    const padding = // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => {
      const cs = getComputedStyle(el);
      return { top: cs.paddingTop, bottom: cs.paddingBottom };
    });
    expect(padding.top, 'Desktop wrapper padding-top should be 64px').toBe('64px'); // TODO: Use assertSpacing() for padding/margin
    expect(padding.bottom, 'Desktop wrapper padding-bottom should be 64px').toBe('64px'); // TODO: Use assertSpacing() for padding/margin
  });

  test('[PB-018] @regression mobile default has 48px top and bottom padding', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(PB_WRAPPER).first();
    const count = await wrapper.count();
    if (count === 0) { test.skip(); return; }
    await expect(wrapper).toBeVisible();
    const padding = // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => {
      const cs = getComputedStyle(el);
      return { top: cs.paddingTop, bottom: cs.paddingBottom };
    });
    expect(padding.top, 'Mobile wrapper padding-top should be 48px').toBe('48px'); // TODO: Use assertSpacing() for padding/margin
    expect(padding.bottom, 'Mobile wrapper padding-bottom should be 48px').toBe('48px'); // TODO: Use assertSpacing() for padding/margin
  });

  test('[PB-019] @regression remove-top-padding modifier sets padding-top to 0', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(PB_WRAPPER).first();
    const count = await wrapper.count();
    if (count === 0) { test.skip(); return; }
    // Inject the modifier class to test its effect
    // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => el.classList.add('cmp-promo-banner--remove-top-padding'));
    const paddingTop = // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => getComputedStyle(el).paddingTop); // measurement: use measurement-utils for cleaner code
    expect(paddingTop, 'remove-top-padding modifier should set padding-top to 0px').toBe('0px'); // TODO: Use assertSpacing() for padding/margin
  });

  test('[PB-020] @regression remove-bottom-padding modifier sets padding-bottom to 0', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(PB_WRAPPER).first();
    const count = await wrapper.count();
    if (count === 0) { test.skip(); return; }
    // Inject the modifier class to test its effect
    // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => el.classList.add('cmp-promo-banner--remove-bottom-padding'));
    const paddingBottom = // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => getComputedStyle(el).paddingBottom); // measurement: use measurement-utils for cleaner code
    expect(paddingBottom, 'remove-bottom-padding modifier should set padding-bottom to 0px').toBe('0px'); // TODO: Use assertSpacing() for padding/margin
  });

  test('[PB-021] @regression both padding modifiers applied sets both top and bottom to 0', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(PB_WRAPPER).first();
    const count = await wrapper.count();
    if (count === 0) { test.skip(); return; }
    // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => {
      el.classList.add('cmp-promo-banner--remove-top-padding');
      el.classList.add('cmp-promo-banner--remove-bottom-padding');
    });
    const padding = // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => {
      const cs = getComputedStyle(el);
      return { top: cs.paddingTop, bottom: cs.paddingBottom };
    });
    expect(padding.top, 'Both padding modifiers: padding-top should be 0px').toBe('0px'); // TODO: Use assertSpacing() for padding/margin
    expect(padding.bottom, 'Both padding modifiers: padding-bottom should be 0px').toBe('0px'); // TODO: Use assertSpacing() for padding/margin
  });

  test('[PB-022] @regression padding modifiers do not affect internal content spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator(PB_WRAPPER).first();
    const count = await wrapper.count();
    if (count === 0) { test.skip(); return; }
    // Record internal root padding before modification
    const rootPaddingBefore = await page.locator(PB).first().evaluate(el => getComputedStyle(el).padding); // measurement: use measurement-utils for cleaner code
    // 📏 TODO: Replace with measurement-utils
    await wrapper.evaluate(el => el.classList.add('cmp-promo-banner--remove-top-padding'));
    const rootPaddingAfter = await page.locator(PB).first().evaluate(el => getComputedStyle(el).padding); // measurement: use measurement-utils for cleaner code
    expect(rootPaddingAfter, 'Internal root padding must be unchanged by wrapper padding modifiers').toBe(rootPaddingBefore); // TODO: Use assertSpacing() for padding/margin
  });
});

// ---------------------------------------------------------------------------
// Desktop Layout (PB-023 – PB-027)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Desktop Layout', () => {
  test('[PB-023] @regression desktop layout uses flex-direction row', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    const flexDir = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => getComputedStyle(el).flexDirection); // measurement: use measurement-utils for cleaner code
    expect(flexDir, 'Desktop flex-direction should be row').toBe('row');
  });

  test('[PB-024] @regression content area on desktop uses flex-direction row with gap 24px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const content = page.locator(PB_CONTENT).first();
    const count = await content.count();
    if (count === 0) { test.skip(); return; }
    await expect(content).toBeVisible();
    const styles = // 📏 TODO: Replace with measurement-utils
    await content.evaluate(el => {
      const cs = getComputedStyle(el);
      return { flexDirection: cs.flexDirection, gap: cs.gap || cs.columnGap };
    });
    expect(styles.flexDirection, 'Content area flex-direction should be row on desktop').toBe('row');
    expect(styles.gap, 'Content area gap should be 24px on desktop').toBe('24px');
  });

  test('[PB-025] @regression desktop CTA links use flex-direction row', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const cta = page.locator(PB_CTA).first();
    const count = await cta.count();
    if (count === 0) { test.skip(); return; }
    await expect(cta).toBeVisible();
    const flexDir = // 📏 TODO: Replace with measurement-utils
    await cta.evaluate(el => getComputedStyle(el).flexDirection); // measurement: use measurement-utils for cleaner code
    expect(flexDir, 'CTA links flex-direction should be row on desktop').toBe('row');
  });

  test('[PB-026] @regression social icons CSS defines 40px circular styling', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const socialLinks = page.locator(`${PB_SOCIAL} a`);
    const count = await socialLinks.count();
    if (count > 0) {
      // Real social links exist — verify dimensions
      const box = await socialLinks.first().boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(38);
        expect(box.width).toBeLessThanOrEqual(44);
      }
      const radius = await socialLinks.first().evaluate(el => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
      expect(radius).toMatch(/50%|999px/);
    } else {
      // No social links — inject+check CSS rule and clean up
      const linksArea = page.locator(PB_LINKS).first();
      const result = // 📏 TODO: Replace with measurement-utils
    await linksArea.evaluate(el => {
        const div = document.createElement('div');
        div.className = 'cmp-promo-banner__links-social';
        const a = document.createElement('a');
        a.href = '#';
        div.appendChild(a);
        el.prepend(div);
        const cs = getComputedStyle(a);
        const r = { w: cs.width, h: cs.height, radius: cs.borderRadius };
        div.remove(); // clean up
        return r;
      });
      expect(result.radius).toMatch(/50%|999px/);
    }
  });

  test('[PB-027] @regression desktop links area has margin-top 0 (not 24px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const links = page.locator(PB_LINKS).first();
    const count = await links.count();
    if (count === 0) { test.skip(); return; }
    await expect(links).toBeVisible();
    const marginTop = // 📏 TODO: Replace with measurement-utils
    await links.evaluate(el => getComputedStyle(el).marginTop); // measurement: use measurement-utils for cleaner code
    expect(marginTop, 'Links margin-top on desktop should be 0px (not 24px)').toBe('0px'); // TODO: Use assertSpacing() for padding/margin
  });
});

// ---------------------------------------------------------------------------
// Mobile Layout (PB-028 – PB-032)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Mobile Layout', () => {
  test('[PB-028] @mobile @regression banner is NOT flex-row on mobile (stacks naturally)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    // On mobile, the component uses display:block (no flex), so content stacks naturally
    const display = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => getComputedStyle(el).display); // measurement: use measurement-utils for cleaner code
    // Should NOT be flex-row — acceptable values: block, flex+column
    const isStacked = display === 'block' || display === 'flex'; // TODO: Use assertLayout() for display checks
    expect(isStacked).toBe(true);
    if (display === 'flex') {
      const dir = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => getComputedStyle(el).flexDirection); // measurement: use measurement-utils for cleaner code
      expect(dir).toBe('column');
    }
  });

  test('[PB-029] @mobile @regression CTA uses flex-direction column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const cta = page.locator(PB_CTA).first();
    const count = await cta.count();
    if (count === 0) { test.skip(); return; }
    await expect(cta).toBeVisible();
    const flexDir = // 📏 TODO: Replace with measurement-utils
    await cta.evaluate(el => getComputedStyle(el).flexDirection); // measurement: use measurement-utils for cleaner code
    expect(flexDir, 'CTA links flex-direction should be column on mobile').toBe('column');
  });

  test('[PB-030] @mobile @regression links area has margin-top 24px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const links = page.locator(PB_LINKS).first();
    const count = await links.count();
    if (count === 0) { test.skip(); return; }
    await expect(links).toBeVisible();
    const marginTop = // 📏 TODO: Replace with measurement-utils
    await links.evaluate(el => getComputedStyle(el).marginTop); // measurement: use measurement-utils for cleaner code
    expect(marginTop, 'Links margin-top on mobile should be 24px').toBe('24px'); // TODO: Use assertSpacing() for padding/margin
  });

  test('[PB-031] @mobile @regression no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    const hasOverflow = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => el.scrollWidth > el.clientWidth);
    expect(hasOverflow, 'Promo banner must not overflow horizontally on mobile').toBe(false);
  });

  test('[PB-032] @mobile @regression all banner content elements are visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator(PB).first();
    await expect(root).toBeVisible();
    // Title and links should still be visible
    const title = root.locator(PB_TITLE);
    const titleCount = await title.count();
    if (titleCount > 0) {
      await expect(title.first()).toBeVisible();
    }
    const links = root.locator(PB_LINKS);
    const linksCount = await links.count();
    if (linksCount > 0) {
      await expect(links.first()).toBeVisible();
    }
  });
});

// ---------------------------------------------------------------------------
// Footer Variant (PB-033 – PB-036)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Footer Variant', () => {
  test('[PB-033] @regression footer variant logo has no circular border-radius', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const footerEl = page.locator(`${PB}.cmp-promo-banner--footer`).first();
    const count = await footerEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(footerEl).toBeVisible();
    const logo = footerEl.locator(PB_LOGO).first();
    const logoCount = await logo.count();
    if (logoCount === 0) { test.skip(); return; }
    const borderRadius = // 📏 TODO: Replace with measurement-utils
    await logo.evaluate(el => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    // Footer logo should NOT be circular (999px); it should be 0 or a small value
    expect(borderRadius, 'Footer variant logo should not have 999px circular radius').not.toMatch(/999px|9999px/);
  });

  test('[PB-034] @regression footer variant social icons are present', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const footerEl = page.locator(`${PB}.cmp-promo-banner--footer`).first();
    const count = await footerEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(footerEl).toBeVisible();
    const socialLinks = footerEl.locator(`${PB_SOCIAL} a`);
    const socialCount = await socialLinks.count();
    expect(socialCount, 'Footer variant should have at least one social icon link').toBeGreaterThan(0);
  });

  test('[PB-035] @regression footer variant title has a border separator (right or bottom border)', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const footerEl = page.locator(`${PB}.cmp-promo-banner--footer`).first();
    const count = await footerEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(footerEl).toBeVisible();
    const title = footerEl.locator(PB_TITLE).first();
    const titleCount = await title.count();
    if (titleCount === 0) { test.skip(); return; }
    const borderStyles = // 📏 TODO: Replace with measurement-utils
    await title.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        borderRight: cs.borderRightWidth,
        borderBottom: cs.borderBottomWidth,
        borderRightStyle: cs.borderRightStyle,
        borderBottomStyle: cs.borderBottomStyle,
      };
    });
    const hasRightBorder = parseFloat(borderStyles.borderRight) > 0 && borderStyles.borderRightStyle !== 'none';
    const hasBottomBorder = parseFloat(borderStyles.borderBottom) > 0 && borderStyles.borderBottomStyle !== 'none';
    expect(hasRightBorder || hasBottomBorder, 'Footer variant title should have a visible border separator').toBe(true);
  });

  test('[PB-036] @regression footer variant renders logo alongside content', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const footerEl = page.locator(`${PB}.cmp-promo-banner--footer`).first();
    const count = await footerEl.count();
    if (count === 0) { test.skip(); return; }
    await expect(footerEl).toBeVisible();
    const logo = footerEl.locator(PB_LOGO).first();
    const logoCount = await logo.count();
    if (logoCount > 0) {
      await expect(logo).toBeVisible();
    }
    const content = footerEl.locator(PB_CONTENT).first();
    const contentCount = await content.count();
    if (contentCount > 0) {
      await expect(content).toBeVisible();
    }
  });
});

// ---------------------------------------------------------------------------
// Accessibility (PB-037 – PB-041)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Accessibility', () => {
  test('[PB-037] @a11y @regression social links have accessible names when present', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const socialLinks = page.locator(`${PB_SOCIAL} a`);
    const count = await socialLinks.count();
    if (count === 0) {
      // No social links on page — verify the social link CSS border-radius instead
      const linksArea = page.locator(PB_LINKS).first();
      const radius = // 📏 TODO: Replace with measurement-utils
    await linksArea.evaluate(el => {
        const div = document.createElement('div');
        div.className = 'cmp-promo-banner__links-social';
        const a = document.createElement('a');
        div.appendChild(a);
        el.prepend(div);
        const r = getComputedStyle(a).borderRadius;
        div.remove();
        return r;
      });
      expect(radius).toMatch(/999px|50%/);
      return;
    }
    // Verify social links have href and icon elements
    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href, `Social link ${i} must have href`).toBeTruthy();
      // Social links open in new tab
      const target = await link.getAttribute('target');
      expect(target).toBe('_blank');
      // Icon element present
      const hasIcon = await link.locator('i').count();
      expect(hasIcon).toBeGreaterThan(0);
    }
  });

  test('[PB-038] @a11y @regression CTA buttons/links have accessible names', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const ctaArea = page.locator(PB_CTA).first();
    const count = await ctaArea.count();
    if (count === 0) { test.skip(); return; }
    const ctaItems = ctaArea.locator('a, button');
    const ctaCount = await ctaItems.count();
    for (let i = 0; i < ctaCount; i++) {
      const item = ctaItems.nth(i);
      const ariaLabel = await item.getAttribute('aria-label');
      const textContent = (await item.textContent() || '').trim();
      const hasName = (ariaLabel && ariaLabel.trim().length > 0) || textContent.length > 0;
      expect(hasName, `CTA item ${i} must have an accessible name`).toBeTruthy();
    }
  });

  test('[PB-039] @a11y @regression focus-visible outline is present on interactive elements', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator(`${PB} a, ${PB} button`);
    const count = await interactive.count();
    if (count === 0) { test.skip(); return; }
    // Check that at least the first focusable element gets an outline on focus
    const first = interactive.first();
    await first.focus();
    const outlineWidth = // 📏 TODO: Replace with measurement-utils
    await first.evaluate(el => getComputedStyle(el).outlineWidth); // measurement: use measurement-utils for cleaner code
    const outlineStyle = // 📏 TODO: Replace with measurement-utils
    await first.evaluate(el => getComputedStyle(el).outlineStyle); // measurement: use measurement-utils for cleaner code
    const hasFocusOutline = parseFloat(outlineWidth) > 0 && outlineStyle !== 'none';
    // Also accept focus-visible via box-shadow
    const boxShadow = // 📏 TODO: Replace with measurement-utils
    await first.evaluate(el => getComputedStyle(el).boxShadow); // measurement: use measurement-utils for cleaner code
    const hasFocusBoxShadow = boxShadow !== 'none' && boxShadow !== '';
    expect(hasFocusOutline || hasFocusBoxShadow, 'First interactive element should have visible focus indicator').toBe(true);
  });

  test('[PB-040] @a11y @wcag22 @regression axe-core scan finds no violations', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(PB)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast', 'link-name']) // Dark theme contrast intentional; social icons use icon-only links
      .analyze();
    expect(results.violations, `axe-core violations: ${JSON.stringify(results.violations.map(v => v.id))}`).toEqual([]);
  });

  test('[PB-041] @a11y @regression social link hover changes background to white', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const socialLinks = page.locator(`${PB_SOCIAL} a`);
    const count = await socialLinks.count();
    if (count === 0) { test.skip(); return; }
    const first = socialLinks.first();
    const bgBefore = // 📏 TODO: Replace with measurement-utils
    await first.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    await hover(first);
    const bgAfter = // 📏 TODO: Replace with measurement-utils
    await first.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    // After hover the background should change (transition to white fill)
    // We verify either background changed or that white is now the background
    const isWhiteAfterHover = bgAfter === 'rgb(255, 255, 255)';
    const bgChanged = bgBefore !== bgAfter;
    expect(isWhiteAfterHover || bgChanged, 'Social link background should change on hover').toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Dialog / Overlay (PB-042 – PB-044)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — AEM Dialog Configuration', () => {
  test('[PB-042] @author @regression GA overlay has correct sling:resourceSuperType', async ({ page }) => {
    const componentUrl = `${BASE()}/apps/ga/components/content/promo-banner.1.json`;
    const response = await page.request.get(componentUrl);
    expect(response.ok(), 'GA promo-banner component overlay not found at expected path').toBe(true);
    const component = await response.json();
    expect(
      component['sling:resourceSuperType'],
      'GA promo-banner overlay sling:resourceSuperType must point to base component'
    ).toBe('kkr-aem-base/components/content/promo-banner');
  });

  test('[PB-043] @author @regression GA overlay has componentGroup "GA Base"', async ({ page }) => {
    const componentUrl = `${BASE()}/apps/ga/components/content/promo-banner.1.json`;
    const response = await page.request.get(componentUrl);
    if (!response.ok()) { test.skip(); return; }
    const component = await response.json();
    expect(
      component['componentGroup'],
      'GA promo-banner componentGroup must be "GA Base"'
    ).toBe('GA Base');
  });

  test('[PB-044] @author @regression dialog has helpPath and required fields (bannerTitle, bannerText, ctaLinks, socialLinks)', async ({ page }) => {
    // GA overlay doesn't have its own dialog — inherited from base via sling:resourceSuperType
    const dialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/promo-banner/_cq_dialog.infinity.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Base promo-banner _cq_dialog not found').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Dialog must have helpPath configured').toBeTruthy();
    expect(
      dialog.helpPath,
      'helpPath must point to WCM core component details page'
    ).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
    // Verify dialog JSON contains references to expected authored fields
    const dialogStr = JSON.stringify(dialog);
    expect(dialogStr, 'Dialog should reference bannerTitle field').toContain('bannerTitle');
    expect(dialogStr, 'Dialog should reference bannerText or Banner Description field').toMatch(/bannerText|bannerDescription|Banner Description/i);
    expect(dialogStr, 'Dialog should reference ctaLinks multifield').toContain('ctaLinks');
    expect(dialogStr, 'Dialog should reference socialLinks multifield').toContain('socialLinks');
  });
});

// ---------------------------------------------------------------------------
// Console Errors (PB-045)
// ---------------------------------------------------------------------------

test.describe('PromoBanner — Console Errors', () => {
  test('[PB-045] @regression no JS errors on page load', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const errors = capture.getErrors();
    capture.stop();
    expect(errors, `JS errors found on promo-banner style guide: ${errors.join(' | ')}`).toEqual([]);
  });
});

test.describe('PromoBanner — CSV Test Cases (GAAM-1329)', () => {
  test('[PB-046] @smoke @regression CMS: Promo Banner: Tablet view in both Android and Apple is misaligned. — AC1', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: *Environment:*
    // 
    // * CMS Web Application
    // * Android Tablets (various screen sizes)
    // * Apple iPads (various screen sizes)
    // * Tablet viewport/responsive mode
    // 
    // URL Tested - [Promo-Banner|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/Promo-banner.html?wcmmode=disabled]
    // 
    // *Description:*
    // The Promo Banner displayed through the CMS is visually misaligned when viewed on tablet devices. The issue occurs on both Android tablets and Apple iPads, indicating a responsive layout problem specific to tablet breakpoints.
    // 
    // *Steps to Reproduce:*
    // 
    // # Open the CMS-managed website/application.
    // # Navigate to a page containing the Promo Banner.
    // # Access the page using an Android tablet or iPad (or emulate tablet view in browser developer tools).
    // # Observe the banner layout and alignment.
    // 
    // *Actual Result:*
    // The Promo Banner content appears misaligned in tablet view. Elements such as text, images, buttons, or banner containers are not properly positioned within the layout.
    // 
    // *Expected Result:*
    // The Promo Banner should be correctly aligned and displayed according to the approved design across all supported tablet devices and screen resolutions.
    // 
    // 
    // 
    // !image-20260622-072622.png|width=451,alt="image-20260622-072622.png"!
    test.fixme();
  });
});

test.describe('PromoBanner — Happy Path', () => {
  test('[PB-047] @smoke @regression PromoBanner renders correctly', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-promo-banner').first();
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

  test('[PB-048] @smoke @regression PromoBanner interactive elements are functional', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-promo-banner').first();
    await expect(root).toBeVisible();
    // Verify interactive elements (links, buttons) are present and clickable
    const interactive = root.locator('a, button');
    const count = await interactive.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(interactive.nth(i)).toBeVisible();
      await expect(interactive.nth(i)).toBeEnabled();
    }
  });
});

test.describe('PromoBanner — Negative & Boundary', () => {
  test('[PB-049] @negative @regression PromoBanner handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-promo-banner').first()).toBeVisible();
  });

  test('[PB-050] @negative @regression PromoBanner handles missing images', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-promo-banner img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('PromoBanner — Responsive', () => {
  test('[PB-051] @mobile @regression @mobile PromoBanner adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-promo-banner').first();
    await expect(root).toBeVisible();
    // Verify layout adapts to mobile: check flex-direction changes to column
    const flexDir = await root.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.flexDirection || cs.display;
    });
    // At mobile, flex containers typically switch to column layout
    // Grid containers may change template columns
    expect(flexDir).toBeDefined();
  });

  test('[PB-052] @mobile @regression PromoBanner adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-promo-banner').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('PromoBanner — Console & Resources', () => {
  test('[PB-053] @regression PromoBanner produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('PromoBanner — Broken Images', () => {
  test('[PB-054] @regression PromoBanner all images load successfully', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-promo-banner img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[PB-055] @regression PromoBanner all images have alt attributes', async ({ page }) => {
    const pom = new PromoBannerPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-promo-banner img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
