import { test, expect } from '../../../utils/infra/persistent-context';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

/**
 * All visual tests scope to the primary button variant inside the white
 * background section for deterministic element targeting. The previous
 * `.cmp-button:first()` was hitting a different variant depending on
 * page layout, causing color/typography mismatches.
 */
function primaryBtn(page: import('@playwright/test').Page) {
  return page
    .locator('.cmp-section--background-color-white')
    .first()
    .locator('.ga-button--primary:not(.ga-button--disabled) .cmp-button')
    .first();
}

test.describe('Button — Visual Verification', () => {
  test('[BTN-196] @visual button colors match Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = primaryBtn(page);
    await assertLayout(el, { display: 'inline-flex' });
    const styles = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'background-color': cs.backgroundColor,
        'color': cs.color,
        'border-color': cs.borderColor,
      };
    });
      expect(styles['background-color'], `Expected 'rgb(21, 65, 151, got ${styles['background-color']}`).toBe('rgb(21, 65, 151)');
      expect(styles['color'], `Expected 'rgb(255, 255, 255, got ${styles['color']}`).toBe('rgb(255, 255, 255)');
      expect(styles['border-color'], `Expected 'rgb(255, 255, 255, got ${styles['border-color']}`).toBe('rgb(255, 255, 255)');
  });

  test('[BTN-197] @visual button typography matches Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = primaryBtn(page);
    await assertTypography(el, {
      fontFamily: 'graphie',
      fontSize: '16px',
      fontWeight: '700',
      lineHeight: '16px',
    });
    const styles = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => {
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
    const el = primaryBtn(page);
    await assertSpacing(el, {
      paddingTop: '15px',
      paddingRight: '20px',
      paddingBottom: '15px',
      paddingLeft: '20px',
    }, 2);
    const styles = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'padding-top': cs.paddingTop,
        'padding-right': cs.paddingRight,
        'padding-bottom': cs.paddingBottom,
        'padding-left': cs.paddingLeft,
      };
    });
      expect(Math.abs(parseInt(styles['padding-top']) - 15)).toBeLessThanOrEqual(2); // TODO: Use assertSpacing() for padding/margin
      expect(Math.abs(parseInt(styles['padding-right']) - 20)).toBeLessThanOrEqual(2); // TODO: Use assertSpacing() for padding/margin
      expect(Math.abs(parseInt(styles['padding-bottom']) - 15)).toBeLessThanOrEqual(2); // TODO: Use assertSpacing() for padding/margin
      expect(Math.abs(parseInt(styles['padding-left']) - 20)).toBeLessThanOrEqual(2); // TODO: Use assertSpacing() for padding/margin
  });

  test('[BTN-199] @visual button hover animation matches spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = primaryBtn(page);
    const transition = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => getComputedStyle(el).transition); // measurement: use measurement-utils for cleaner code
    expect(transition).toContain('background');
    expect(transition).toContain('0.18s');

    // Capture before/after states
    const beforeBg = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    await hover(el);
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const afterBg = // 📏 TODO: Replace with measurement-utils
    await el.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    expect(beforeBg).not.toBe(afterBg);
  });

  test('[BTN-202] @visual button screenshot matches baseline', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const el = primaryBtn(page);
    await expect(el).toHaveScreenshot('button-baseline.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
