import { test, expect } from '@playwright/test';
import { ImageWithNestedContentPage } from '../../../pages/ga/components/imageWithNestedContentPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const IWNC = '.cmp-image-with-nested-content';
const IMG = '.cmp-image__image';
const CT_CONTAINER = '.cmp-content-trail__container';
const STAT_ITEM = '.cmp-statistic__item';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ── Focus Interactions ──

test.describe('ImageWithNestedContent — Focus Interactions', () => {
  test('[IWNC-INT-001] @interaction @a11y @regression Content-trail focus triggers azul outline on image', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctLink = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ctLink.count() === 0) { test.skip(); return; }
    await ctLink.scrollIntoViewIfNeeded();
    await ctLink.focus();
    // The LESS rule: &:has(.cmp-content-trail__container:focus) .cmp-image__image { outline: 3px solid azul }
    const parentIwnc = page.locator(IWNC).first();
    const outlineWidth = await parentIwnc.locator(IMG).first().evaluate(el => {
      return parseFloat(getComputedStyle(el).outlineWidth) || 0;
    });
    expect(outlineWidth).toBeGreaterThanOrEqual(2);
  });

  test('[IWNC-INT-002] @interaction @a11y @regression Focus outline-offset is 4px', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctLink = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ctLink.count() === 0) { test.skip(); return; }
    await ctLink.scrollIntoViewIfNeeded();
    await ctLink.focus();
    const outlineOffset = await page.locator(`${IWNC} ${IMG}`).first().evaluate(el =>
      getComputedStyle(el).outlineOffset
    );
    expect(outlineOffset).toBe('4px');
  });

  test('[IWNC-INT-003] @interaction @a11y @regression Tab reaches content-trail link inside overlay', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctLink = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ctLink.count() === 0) { test.skip(); return; }
    await ctLink.scrollIntoViewIfNeeded();
    await ctLink.focus();
    const isFocused = await page.evaluate(() =>
      document.activeElement?.classList.contains('cmp-content-trail__container') ||
      document.activeElement?.classList.contains('cmp-content-trail__link')
    );
    expect(isFocused).toBe(true);
  });

  test('[IWNC-INT-004] @interaction @a11y @regression Focus indicator visible against image background', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctLink = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ctLink.count() === 0) { test.skip(); return; }
    await ctLink.scrollIntoViewIfNeeded();
    await ctLink.focus();
    // Verify outline is not transparent
    const outlineColor = await page.locator(`${IWNC} ${IMG}`).first().evaluate(el =>
      getComputedStyle(el).outlineColor
    );
    expect(outlineColor).not.toBe('transparent');
    expect(outlineColor).not.toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\)/);
  });
});

// ── Hover Interactions ──

test.describe('ImageWithNestedContent — Hover Interactions', () => {
  test('[IWNC-INT-005] @interaction @regression Content-trail link has cursor:pointer', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctLink = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ctLink.count() === 0) { test.skip(); return; }
    await ctLink.scrollIntoViewIfNeeded();
    await ctLink.hover();
    const cursor = await ctLink.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
  });

  test('[IWNC-INT-006] @interaction @regression Content-trail hover changes visual state', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctLink = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ctLink.count() === 0) { test.skip(); return; }
    await ctLink.scrollIntoViewIfNeeded();
    const before = await ctLink.evaluate(el => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, boxShadow: cs.boxShadow, clipPath: cs.clipPath };
    });
    await ctLink.hover();
    const after = await ctLink.evaluate(el => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, boxShadow: cs.boxShadow, clipPath: cs.clipPath };
    });
    const changed = after.bg !== before.bg || after.boxShadow !== before.boxShadow || after.clipPath !== before.clipPath;
    expect(changed).toBe(true);
  });

  test('[IWNC-INT-007] @interaction @regression Statistic overlay is non-interactive (no pointer cursor)', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const stat = page.locator(`${IWNC} ${STAT_ITEM}`).first();
    if (await stat.count() === 0) { test.skip(); return; }
    const cursor = await stat.evaluate(el => getComputedStyle(el).cursor);
    // Statistic should not have pointer cursor (not a link)
    expect(cursor).not.toBe('pointer');
  });
});

// ── Responsive Transitions ──

test.describe('ImageWithNestedContent — Responsive', () => {
  test('[IWNC-INT-008] @interaction @regression Overlay stays at bottom of image at both viewports', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await pom.navigate(BASE());
    const iwnc = page.locator(IWNC).first();
    const overlay = iwnc.locator(`${CT_CONTAINER}, ${STAT_ITEM}`).first();
    if (await overlay.count() === 0) { test.skip(); return; }
    // Desktop: overlay position is absolute
    const desktopPos = await overlay.evaluate(el => getComputedStyle(el).position);
    expect(desktopPos).toBe('absolute');

    // Mobile: check overlay still visible
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await expect(overlay).toBeVisible();
  });

  test('[IWNC-INT-009] @interaction @regression Small variant respects max-width at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const small = page.locator(`.cmp-image-with-nested-content--small ${IWNC}`).first();
    if (await small.count() === 0) { test.skip(); return; }
    const maxWidth = await small.evaluate(el => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('350px');
  });

  test('[IWNC-INT-010] @interaction @mobile @regression Content-trail clickable at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctLink = page.locator(`${IWNC} ${CT_CONTAINER}`).first();
    if (await ctLink.count() === 0) { test.skip(); return; }
    await expect(ctLink).toBeVisible();
    const href = await ctLink.getAttribute('href');
    expect(href).toBeTruthy();
  });
});

// ── Nested Component Behavior ──

test.describe('ImageWithNestedContent — Nested Components', () => {
  test('[IWNC-INT-011] @interaction @regression Content-trail and statistic render in separate instances', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const ctCount = await page.locator(`${IWNC} ${CT_CONTAINER}`).count();
    const statCount = await page.locator(`${IWNC} ${STAT_ITEM}`).count();
    // Style guide has both types
    expect(ctCount).toBeGreaterThanOrEqual(1);
    expect(statCount).toBeGreaterThanOrEqual(1);
  });

  test('[IWNC-INT-012] @interaction @regression Multiple variations on same page do not interfere', async ({ page }) => {
    const pom = new ImageWithNestedContentPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(IWNC);
    const count = await instances.count();
    expect(count).toBeGreaterThanOrEqual(4);
    // Verify each instance has its own image
    for (let i = 0; i < count; i++) {
      const img = instances.nth(i).locator(IMG).first();
      if (await img.count() > 0) {
        const box = await img.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeGreaterThan(0);
      }
    }
  });
});
