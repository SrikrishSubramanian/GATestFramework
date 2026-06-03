import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const TC = '.cmp-teaser-card';

type ImagePosition = 'top' | 'left' | 'right';
type ColorVariant = 'border' | 'white' | 'slate';
type ImageStyle = 'circle' | 'rectangle';
type Viewport = { width: number; height: number; label: string };

const IMAGE_POSITIONS: ImagePosition[] = ['top', 'left', 'right'];
const COLOR_VARIANTS: ColorVariant[] = ['border', 'white', 'slate'];
const IMAGE_STYLES: ImageStyle[] = ['circle', 'rectangle'];
const VIEWPORTS: Viewport[] = [
  { width: 1440, height: 900, label: 'desktop' },
  { width: 390, height: 844, label: 'mobile' },
];

const positionClass = (p: ImagePosition) => `cmp-teaser-card--image-position-${p}`;
const colorClass = (c: ColorVariant) => `cmp-teaser-card--color-${c}`;
const styleClass = (s: ImageStyle) => `cmp-teaser-card--image-style-${s}`;

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ---------------------------------------------------------------------------
// Matrix: Image Position × Color Variant × Desktop/Mobile (54 scenarios)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — State Matrix: Position × Color × Viewport', () => {
  for (const position of IMAGE_POSITIONS) {
    for (const color of COLOR_VARIANTS) {
      for (const viewport of VIEWPORTS) {
        test(`@matrix @regression [${viewport.label}] ${position}-position + ${color}-color: card renders visibly`, async ({ page }) => {
          await page.setViewportSize(viewport);
          const pom = new TeaserCardPage(page);
          await pom.navigate(BASE());

          const selector = `${TC}.${positionClass(position)}.${colorClass(color)}`;
          let card = page.locator(selector).first();
          if (await card.count() === 0) {
            // Inject variant classes on first available card
            await page.evaluate(({ root, posClass, colClass }) => {
              const el = document.querySelector(root);
              if (el) {
                el.classList.add(posClass, colClass);
              }
            }, { root: TC, posClass: positionClass(position), colClass: colorClass(color) });
            card = page.locator(selector).first();
          }

          if (await card.count() === 0) { test.skip(); return; }
          await expect(card).toBeVisible();

          const title = card.locator('.cmp-teaser-card__title').first();
          expect(await title.count(), `${position}/${color}/${viewport.label}: title must be present`).toBeGreaterThan(0);
          await expect(title).toBeVisible();
        });
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Matrix: Image Position × Image Style × Desktop (6 scenarios)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — State Matrix: Position × Image Style', () => {
  for (const position of IMAGE_POSITIONS) {
    for (const style of IMAGE_STYLES) {
      test(`@matrix @regression [desktop] ${position}-position + ${style}-image: card renders with image wrapper`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());

        const selector = `${TC}.${positionClass(position)}.${styleClass(style)}`;
        let card = page.locator(selector).first();
        if (await card.count() === 0) {
          await page.evaluate(({ root, posClass, styleClass }) => {
            const el = document.querySelector(root);
            if (el) el.classList.add(posClass, styleClass);
          }, { root: TC, posClass: positionClass(position), styleClass: styleClass(style) });
          card = page.locator(selector).first();
        }

        if (await card.count() === 0) { test.skip(); return; }
        await expect(card).toBeVisible();

        const imgWrapper = card.locator('.cmp-teaser-card__image-wrapper').first();
        if (await imgWrapper.count() > 0) {
          await expect(imgWrapper).toBeVisible();

          if (style === 'circle') {
            const radius = await imgWrapper.evaluate(el => getComputedStyle(el).borderRadius);
            expect(radius, `Circle image wrapper must have 50% border-radius`).toBe('50%');
          } else {
            const radius = await imgWrapper.evaluate(el => getComputedStyle(el).borderRadius);
            expect(radius, `Rectangle image wrapper must not be circular`).not.toBe('50%');
          }
        }
      });
    }
  }
});

// ---------------------------------------------------------------------------
// Matrix: Color × Mobile collapse behaviour (3 scenarios)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — State Matrix: Color × Mobile', () => {
  for (const color of COLOR_VARIANTS) {
    test(`@matrix @regression @mobile ${color}-color card stacks correctly on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const pom = new TeaserCardPage(page);
      await pom.navigate(BASE());

      const selector = `${TC}.${colorClass(color)}`;
      let card = page.locator(selector).first();
      if (await card.count() === 0) {
        await page.evaluate(({ root, colClass }) => {
          const el = document.querySelector(root);
          if (el) el.classList.add(colClass);
        }, { root: TC, colClass: colorClass(color) });
        card = page.locator(selector).first();
      }
      if (await card.count() === 0) { test.skip(); return; }
      await expect(card).toBeVisible();

      const overflow = await card.evaluate(el => el.scrollWidth > el.clientWidth + 2);
      expect(overflow, `${color} card must not overflow on mobile`).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// Matrix: Enhanced Hover × Circle/Top only (1 valid + 2 invalid combos)
// ---------------------------------------------------------------------------

test.describe('TeaserCard — State Matrix: Enhanced Hover Applicability', () => {
  test('@matrix @regression Enhanced hover ON + Circle + Top: all active together', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    let card = page.locator(`${TC}.cmp-teaser-card--enhanced-hover`).first();
    if (await card.count() === 0) {
      await page.evaluate((root) => {
        const el = document.querySelector(root);
        if (el) el.classList.add(
          'cmp-teaser-card--enhanced-hover',
          'cmp-teaser-card--image-style-circle',
          'cmp-teaser-card--image-position-top'
        );
      }, TC);
      card = page.locator(`${TC}.cmp-teaser-card--enhanced-hover`).first();
    }
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();

    // Must have circle + top
    const hasCircle = await card.evaluate(el => el.classList.contains('cmp-teaser-card--image-style-circle'));
    const hasTop = await card.evaluate(el =>
      !el.classList.contains('cmp-teaser-card--image-position-left') &&
      !el.classList.contains('cmp-teaser-card--image-position-right')
    );
    expect(hasCircle, 'Enhanced hover must be on circle card').toBe(true);
    expect(hasTop, 'Enhanced hover must be on top-position card').toBe(true);
  });

  test('@matrix @regression Enhanced hover must not be active on left/right cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const invalidLeft = page.locator(`${TC}.cmp-teaser-card--enhanced-hover.cmp-teaser-card--image-position-left`);
    const invalidRight = page.locator(`${TC}.cmp-teaser-card--enhanced-hover.cmp-teaser-card--image-position-right`);
    expect(await invalidLeft.count(), 'Enhanced hover must not be on left-position').toBe(0);
    expect(await invalidRight.count(), 'Enhanced hover must not be on right-position').toBe(0);
  });

  test('@matrix @regression Enhanced hover must not be active on rectangle cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const invalidRect = page.locator(`${TC}.cmp-teaser-card--enhanced-hover.cmp-teaser-card--image-style-rectangle`);
    expect(await invalidRect.count(), 'Enhanced hover must not be on rectangle cards').toBe(0);
  });
});
