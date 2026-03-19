import { test, expect } from '../../../utils/infra/persistent-context';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

const BTN_SELECTOR = '.cmp-button:not(.basepage__skip-nav)';

test.describe('Button — Visual Verification', () => {
  test('[BTN-196] @visual button colors match Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = page.locator(BTN_SELECTOR).first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'background-color': cs.backgroundColor,
        'color': cs.color,
        'border-color': cs.borderColor,
      };
    });
      expect(styles['background-color']).toBe('rgb(21, 65, 151)');
      expect(styles['color']).toBe('rgb(255, 255, 255)');
      expect(styles['border-color']).toBe('rgb(255, 255, 255)');
  });

  test('[BTN-197] @visual button typography matches Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = page.locator(BTN_SELECTOR).first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'font-family': cs.fontFamily,
        'font-size': cs.fontSize,
        'font-weight': cs.fontWeight,
        'line-height': cs.lineHeight,
      };
    });
      expect(styles['font-family']).toBe('graphie');
      expect(styles['font-size']).toBe('16px');
      expect(styles['font-weight']).toBe('700');
      expect(styles['line-height']).toBe('16px');
  });

  test('[BTN-198] @visual button spacing matches Figma spec (±2px)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = page.locator(BTN_SELECTOR).first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'padding-top': cs.paddingTop,
        'padding-right': cs.paddingRight,
        'padding-bottom': cs.paddingBottom,
        'padding-left': cs.paddingLeft,
      };
    });
      expect(Math.abs(parseInt(styles['padding-top']) - 15)).toBeLessThanOrEqual(2);
      expect(Math.abs(parseInt(styles['padding-right']) - 20)).toBeLessThanOrEqual(2);
      expect(Math.abs(parseInt(styles['padding-bottom']) - 15)).toBeLessThanOrEqual(2);
      expect(Math.abs(parseInt(styles['padding-left']) - 20)).toBeLessThanOrEqual(2);
  });

  test('[BTN-199] @visual button hover animation matches spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = page.locator(BTN_SELECTOR).first();
    const transition = await el.evaluate(el => getComputedStyle(el).transition);
    expect(transition).toContain('background');
    expect(transition).toContain('0.18s');

    // Capture before/after states
    const beforeBg = await el.evaluate(el => getComputedStyle(el).backgroundColor);
    await el.hover();
    await page.waitForTimeout(250);
    const afterBg = await el.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(beforeBg).not.toBe(afterBg);
  });

  // BTN-200, BTN-201 removed: visibility-only checks at desktop/mobile, redundant with author spec

  test('[BTN-202] @visual button screenshot matches baseline', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = page.locator(BTN_SELECTOR).first();
    await expect(el).toHaveScreenshot('button-baseline.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
