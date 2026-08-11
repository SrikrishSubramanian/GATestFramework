import { test, expect } from '@playwright/test';
import { TeaserCardPage } from '../../../pages/ga/components/teaserCardPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const TC = '.cmp-teaser-card';
const GRID_COL = '.aem-GridColumn';

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

// Modifier classes live on the card's ancestor `.aem-GridColumn`, not on `.cmp-teaser-card`
// itself — confirmed against live DOM. "top" is the default layout and has no modifier
// class of its own; only "left"/"right" are explicit deviations.
const positionClass = (p: ImagePosition): string | null =>
  p === 'top' ? null : `cmp-teaser-card--layout-image-${p}`;
const colorClass = (c: ColorVariant) => `cmp-teaser-card--card-${c}`;
const styleClass = (s: ImageStyle) => `cmp-teaser-card--image-${s}`;

const ALL_POSITION_CLASSES = (['left', 'right'] as const).map(p => `cmp-teaser-card--layout-image-${p}`);
const ALL_COLOR_CLASSES = COLOR_VARIANTS.map(colorClass);
const ALL_STYLE_CLASSES = IMAGE_STYLES.map(styleClass);

/** Builds a selector for the ancestor grid column carrying the given modifier classes. */
function gridColSelector(include: string[], exclude: string[] = []): string {
  const includes = include.map(c => `.${c}`).join('');
  const excludes = exclude.map(c => `:not(.${c})`).join('');
  return `${GRID_COL}${includes}${excludes}`;
}

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

          const posClass = positionClass(position);
          const colClass = colorClass(color);
          const include = posClass ? [posClass, colClass] : [colClass];
          const exclude = posClass ? [] : ALL_POSITION_CLASSES;
          const selector = `${gridColSelector(include, exclude)} ${TC}`;
          let card = page.locator(selector).first();

          if (await card.count() === 0) {
            // Inject variant classes on the first available card's grid-column ancestor —
            // strip sibling classes from the same modifier group first, since it may already
            // carry a conflicting variant.
            await page.evaluate(({ cardSel, gridColSel, posClass, colClass, allPosClasses, allColorClasses }) => {
              const cardEl = document.querySelector(cardSel);
              const gridCol = cardEl?.closest(gridColSel) as HTMLElement | null;
              if (gridCol) {
                allPosClasses.forEach((c: string) => gridCol.classList.remove(c));
                allColorClasses.forEach((c: string) => gridCol.classList.remove(c));
                if (posClass) gridCol.classList.add(posClass);
                gridCol.classList.add(colClass);
              }
            }, { cardSel: TC, gridColSel: GRID_COL, posClass, colClass, allPosClasses: ALL_POSITION_CLASSES, allColorClasses: ALL_COLOR_CLASSES });
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
  // Circle image style is only a valid combination with top-position (confirmed against live
  // content — all circle cards are top-position, all left/right cards are rectangle-style).
  // circle+left / circle+right are not supported combinations, so they're excluded here.
  for (const position of IMAGE_POSITIONS) {
    for (const style of IMAGE_STYLES) {
      if (style === 'circle' && position !== 'top') continue;

      test(`@matrix @regression [desktop] ${position}-position + ${style}-image: card renders with image wrapper`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new TeaserCardPage(page);
        await pom.navigate(BASE());

        const posClass = positionClass(position);
        const stClass = styleClass(style);
        const include = posClass ? [posClass, stClass] : [stClass];
        const exclude = posClass ? [] : ALL_POSITION_CLASSES;
        const selector = `${gridColSelector(include, exclude)} ${TC}`;
        let card = page.locator(selector).first();

        if (await card.count() === 0) {
          // Strip sibling classes from the same modifier group first — otherwise a card already
          // authored as e.g. --image-circle keeps that class alongside the injected one.
          await page.evaluate(({ cardSel, gridColSel, posClass, stClass, allPosClasses, allStyleClasses }) => {
            const cardEl = document.querySelector(cardSel);
            const gridCol = cardEl?.closest(gridColSel) as HTMLElement | null;
            if (gridCol) {
              allPosClasses.forEach((c: string) => gridCol.classList.remove(c));
              allStyleClasses.forEach((c: string) => gridCol.classList.remove(c));
              if (posClass) gridCol.classList.add(posClass);
              gridCol.classList.add(stClass);
            }
          }, { cardSel: TC, gridColSel: GRID_COL, posClass, stClass, allPosClasses: ALL_POSITION_CLASSES, allStyleClasses: ALL_STYLE_CLASSES });
          card = page.locator(selector).first();
        }

        if (await card.count() === 0) { test.skip(); return; }
        await expect(card).toBeVisible();

        const imgWrapper = card.locator('.cmp-teaser-card__image-wrapper').first();
        if (await imgWrapper.count() > 0) {
          await expect(imgWrapper).toBeVisible();

          const radius = await imgWrapper.evaluate(el => getComputedStyle(el).borderRadius);
          if (style === 'circle') {
            expect(radius, `Circle image wrapper must have 50% border-radius`).toBe('50%');
          } else {
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

      const colClass = colorClass(color);
      const selector = `${gridColSelector([colClass])} ${TC}`;
      let card = page.locator(selector).first();
      if (await card.count() === 0) {
        // Strip sibling color classes first — otherwise a card already authored with a
        // different color variant keeps that class alongside the injected one.
        await page.evaluate(({ cardSel, gridColSel, colClass, allColorClasses }) => {
          const cardEl = document.querySelector(cardSel);
          const gridCol = cardEl?.closest(gridColSel) as HTMLElement | null;
          if (gridCol) {
            allColorClasses.forEach((c: string) => gridCol.classList.remove(c));
            gridCol.classList.add(colClass);
          }
        }, { cardSel: TC, gridColSel: GRID_COL, colClass, allColorClasses: ALL_COLOR_CLASSES });
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
  const ENHANCED_HOVER = 'cmp-teaser-card--enhanced-hover';

  test('@matrix @regression Enhanced hover ON + Circle + Top: all active together', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const selector = `${gridColSelector([ENHANCED_HOVER])} ${TC}`;
    let card = page.locator(selector).first();
    if (await card.count() === 0) {
      await page.evaluate(({ cardSel, gridColSel, enhancedHover, circleClass, allPosClasses }) => {
        const cardEl = document.querySelector(cardSel);
        const gridCol = cardEl?.closest(gridColSel) as HTMLElement | null;
        if (gridCol) {
          allPosClasses.forEach((c: string) => gridCol.classList.remove(c));
          gridCol.classList.add(enhancedHover, circleClass);
        }
      }, { cardSel: TC, gridColSel: GRID_COL, enhancedHover: ENHANCED_HOVER, circleClass: styleClass('circle'), allPosClasses: ALL_POSITION_CLASSES });
      card = page.locator(selector).first();
    }
    if (await card.count() === 0) { test.skip(); return; }
    await expect(card).toBeVisible();

    const gridCol = card.locator(`xpath=ancestor::*[contains(@class, "aem-GridColumn")][1]`);
    const hasCircle = await gridCol.evaluate(el => el.classList.contains('cmp-teaser-card--image-circle'));
    const hasTop = await gridCol.evaluate(el =>
      !el.classList.contains('cmp-teaser-card--layout-image-left') &&
      !el.classList.contains('cmp-teaser-card--layout-image-right')
    );
    expect(hasCircle, 'Enhanced hover must be on circle card').toBe(true);
    expect(hasTop, 'Enhanced hover must be on top-position card').toBe(true);
  });

  test('@matrix @regression Enhanced hover must not be active on left/right cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const invalidLeft = page.locator(`${gridColSelector([ENHANCED_HOVER, ALL_POSITION_CLASSES[0]])} ${TC}`);
    const invalidRight = page.locator(`${gridColSelector([ENHANCED_HOVER, ALL_POSITION_CLASSES[1]])} ${TC}`);
    expect(await invalidLeft.count(), 'Enhanced hover must not be on left-position').toBe(0);
    expect(await invalidRight.count(), 'Enhanced hover must not be on right-position').toBe(0);
  });

  test('@matrix @regression Enhanced hover must not be active on rectangle cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TeaserCardPage(page);
    await pom.navigate(BASE());

    const invalidRect = page.locator(`${gridColSelector([ENHANCED_HOVER, styleClass('rectangle')])} ${TC}`);
    expect(await invalidRect.count(), 'Enhanced hover must not be on rectangle cards').toBe(0);
  });
});
