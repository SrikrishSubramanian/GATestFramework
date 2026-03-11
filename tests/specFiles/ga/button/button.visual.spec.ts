import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/env';

test.describe('Button — Visual Verification', () => {
  test('@visual button colors match Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.ga-button').first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'background-color': cs.backgroundColor,
        'color': cs.color,
        'border-color': cs.borderColor,
      };
    });
      expect(styles['background-color']).toBe('rgb(0, 61, 165)');
      expect(styles['color']).toBe('rgb(255, 255, 255)');
      expect(styles['border-color']).toBe('rgb(0, 61, 165)');
  });

  test('@visual button typography matches Figma spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.ga-button').first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'font-family': cs.fontFamily,
        'font-size': cs.fontSize,
        'font-weight': cs.fontWeight,
        'line-height': cs.lineHeight,
      };
    });
      expect(styles['font-family']).toBe('Poppins');
      expect(styles['font-size']).toBe('16px');
      expect(styles['font-weight']).toBe('600');
      expect(styles['line-height']).toBe('24px');
  });

  test('@visual button spacing matches Figma spec (±2px)', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.ga-button').first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        'padding-top': cs.paddingTop,
        'padding-right': cs.paddingRight,
        'padding-bottom': cs.paddingBottom,
        'padding-left': cs.paddingLeft,
      };
    });
      expect(Math.abs(parseInt(styles['padding-top']) - 12)).toBeLessThanOrEqual(2);
      expect(Math.abs(parseInt(styles['padding-right']) - 24)).toBeLessThanOrEqual(2);
      expect(Math.abs(parseInt(styles['padding-bottom']) - 12)).toBeLessThanOrEqual(2);
      expect(Math.abs(parseInt(styles['padding-left']) - 24)).toBeLessThanOrEqual(2);
  });

  test('@visual button hover animation matches spec', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.ga-button').first();
    const transition = await el.evaluate(el => getComputedStyle(el).transition);
    expect(transition).toContain('background-color');
    expect(transition).toContain('0.3s');

    // Capture before/after states
    const beforeBg = await el.evaluate(el => getComputedStyle(el).backgroundColor);
    await el.hover();
    await page.waitForTimeout(50);
    const afterBg = await el.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(beforeBg).not.toBe(afterBg);
  });

  test('@visual button layout at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.ga-button').first();
    await expect(el).toBeVisible();
    // min-width should be 200px
  });

  test('@visual @mobile button layout at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.ga-button').first();
    await expect(el).toBeVisible();
    // width should be 100%
  });

  test('@visual button screenshot matches baseline', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('.ga-button').first();
    await expect(el).toHaveScreenshot('button-baseline.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
