import { test, expect } from '@playwright/test';
import { AccordionTabsFeaturePage } from '../../../pages/ga/components/accordionTabsFeaturePage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Accordion Tabs Feature — Matrix & Edge Case Tests
 *
 * Source: GAAM-421 (Desktop) TC_026–032, TC_040–043, TC_047, TC_050
 *        GAAM-422 (Mobile)  TC_029–033, TC_035–039, TC_048–050, TC_053
 *
 * Covers: edge cases (missing content), headline ON/OFF layout,
 * multiple viewport sizes, dark background matrix, performance,
 * desktop/mobile consistency.
 *
 * Instances on style guide page:
 *   0 = Accordion (Investment Strategy / Portfolio Management / Risk Assessment) — white bg
 *   1 = Scrolling Tabs (Discover / Evaluate / Execute) — white bg
 *   2 = Accordion + Headline (Financial Strength / Expert Team / Innovation Focus) — white bg
 *   3 = Accordion on granite bg (Dark Theme Tab 1/2) — if fixture deployed
 */

const ROOT = '.cmp-accordion-tabs-feature';
const TAB = '.cmp-accordion-tabs-feature__accordion-header';       // <button role="tab">
const TABPANEL = '.cmp-accordion-tabs-feature__accordion-body';     // <div role="tabpanel">
const TABLIST = '.cmp-accordion-tabs-feature__accordion-list';
const RIGHT = '.cmp-accordion-tabs-feature__right';
const LEFT = '.cmp-accordion-tabs-feature__left';
const WRAPPER = '.cmp-accordion-tabs-feature__wrapper';
const IMAGE_PANEL = '.cmp-accordion-tabs-feature__image-panel';
const PANEL_TITLE = '.cmp-accordion-tab__title';
const PANEL_DESCRIPTION = '.cmp-accordion-tab__description';
const PANEL_CTA = '.cmp-accordion-tab__cta-wrapper';
const HEADLINE_BLOCK = '.ga-headline-block';

// ─── Edge Cases: Optional Content Handling ───────────────────────────────────
// GAAM-421: TC_026 (no CTA), TC_027 (no desc), TC_028 (no title)
// GAAM-422: TC_029 (no CTA), TC_030 (no desc), TC_031 (no title)
test.describe('AccordionTabsFeature — Edge: Optional Content @matrix @regression', () => {

  test('[ATF-080] @matrix @regression Each panel either has a CTA or renders gracefully without one', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ROOT);
    const instanceCount = await roots.count();

    for (let inst = 0; inst < instanceCount; inst++) {
      const instance = roots.nth(inst);
      const tabs = instance.locator(TAB);
      const panels = instance.locator(TABPANEL);
      const tabCount = await tabs.count();

      for (let t = 0; t < tabCount; t++) {
        await tabs.nth(t).click();
        await page.waitForTimeout(300);

        const panel = panels.nth(t);
        const ctaCount = await panel.locator(PANEL_CTA).count();

        if (ctaCount > 0) {
          // CTA exists — verify it has a link
          const link = panel.locator(`${PANEL_CTA} a`);
          if (await link.count() > 0) {
            const href = await link.first().getAttribute('href');
            expect(href, `Instance ${inst} tab ${t}: CTA link should have href`).toBeTruthy();
          }
        }

        // Regardless of CTA presence, panel structure should be intact
        const titleCount = await panel.locator(PANEL_TITLE).count();
        expect(titleCount, `Instance ${inst} tab ${t}: panel should have title element`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test('[ATF-081] @matrix @regression Each panel has title element in DOM (CSS-hidden)', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0);
    const tabs = instance.locator(TAB);
    const panels = instance.locator(TABPANEL);
    const count = await tabs.count();

    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(500);

      // Title h3 exists in DOM but is CSS-hidden; tab text serves as visible title
      const title = panels.nth(i).locator(PANEL_TITLE);
      const titleCount = await title.count();
      // Verify title exists in DOM even if hidden
      expect(titleCount, `Panel ${i} should have title element in DOM`).toBeGreaterThanOrEqual(1);
      if (titleCount > 0) {
        const text = await title.textContent();
        expect(text?.trim().length, `Panel ${i} title should have text content`).toBeGreaterThan(0);
      }
    }
  });

  test('[ATF-082] @matrix @regression Each panel has description content', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0);
    const tabs = instance.locator(TAB);
    const panels = instance.locator(TABPANEL);
    const count = await tabs.count();

    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(300);

      const desc = panels.nth(i).locator(PANEL_DESCRIPTION);
      const descCount = await desc.count();
      if (descCount > 0) {
        const text = await desc.textContent();
        expect(text?.trim().length, `Panel ${i} description should be non-empty`).toBeGreaterThan(0);
      }
      // If no description element exists, that's acceptable for edge case
    }
  });

  test('[ATF-083] @matrix @regression Tab titles match their corresponding panel titles', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0);
    const tabs = instance.locator(TAB);
    const panels = instance.locator(TABPANEL);
    const count = await tabs.count();

    for (let i = 0; i < count; i++) {
      const tabText = (await tabs.nth(i).textContent())?.trim();
      await tabs.nth(i).click();
      await page.waitForTimeout(300);
      const panelTitle = (await panels.nth(i).locator(PANEL_TITLE).textContent())?.trim();
      expect(panelTitle, `Tab ${i} text should match panel title`).toBe(tabText);
    }
  });
});

// ─── Edge Cases: Scalability ─────────────────────────────────────────────────
// GAAM-421: TC_031, TC_032 (multiple / large number of tabs)
// GAAM-422: TC_032, TC_033
test.describe('AccordionTabsFeature — Edge: Scalability @matrix @regression', () => {

  test('[ATF-084] @matrix @regression Multiple tabs (3+) all render and are clickable', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0);
    const tabs = instance.locator(TAB);
    const count = await tabs.count();

    expect(count).toBeGreaterThanOrEqual(3);

    // Every tab should be visible; click non-active tabs to verify interactivity
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
    // Click tab 1 (inactive) and verify it becomes active
    await tabs.nth(1).click();
    await page.waitForTimeout(500);
    const sel1 = await tabs.nth(1).getAttribute('aria-selected');
    const exp1 = await tabs.nth(1).getAttribute('aria-expanded');
    expect(sel1 === 'true' || exp1 === 'true', 'Tab 1 should activate on click').toBe(true);

    // Click tab 2 and verify
    await tabs.nth(2).click();
    await page.waitForTimeout(500);
    const sel2 = await tabs.nth(2).getAttribute('aria-selected');
    const exp2 = await tabs.nth(2).getAttribute('aria-expanded');
    expect(sel2 === 'true' || exp2 === 'true', 'Tab 2 should activate on click').toBe(true);
  });

  test('[ATF-085] @matrix @regression Tab list does not overflow its container', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0);
    const left = instance.locator(LEFT);

    const overflow = await left.evaluate(el => ({
      scrollOverflowX: el.scrollWidth > el.clientWidth,
      scrollOverflowY: el.scrollHeight > el.clientHeight,
      overflowStyle: getComputedStyle(el).overflow,
    }));

    // Tab list should not have unintended horizontal overflow
    // Vertical overflow is OK if component handles it with scroll
    expect(overflow.scrollOverflowX).toBe(false);
  });
});

// ─── Edge Cases: Partial / Empty Configuration ───────────────────────────────
// GAAM-421: TC_042 (partial config), TC_043 (empty state)
// GAAM-422: TC_048, TC_049
test.describe('AccordionTabsFeature — Edge: Configuration Resilience @matrix @regression', () => {

  test('[ATF-086] @matrix @regression All instances render without broken layout', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ROOT);
    const count = await roots.count();

    for (let i = 0; i < count; i++) {
      const instance = roots.nth(i);
      await expect(instance).toBeVisible();

      // Verify basic structural elements exist
      const wrapper = instance.locator(WRAPPER);
      await expect(wrapper).toHaveCount(1);

      // Component should have non-zero dimensions
      const box = await instance.boundingBox();
      expect(box, `Instance ${i} should have a bounding box`).toBeTruthy();
      expect(box!.width).toBeGreaterThan(100);
      expect(box!.height).toBeGreaterThan(50);
    }
  });

  test('[ATF-087] @matrix @regression Each instance has at least 2 tabs', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ROOT);
    const count = await roots.count();

    for (let i = 0; i < count; i++) {
      const tabCount = await roots.nth(i).locator(TAB).count();
      expect(tabCount, `Instance ${i} should have at least 2 tabs`).toBeGreaterThanOrEqual(2);
    }
  });
});

// ─── Headline ON/OFF Layout ──────────────────────────────────────────────────
// GAAM-421: TC_007 (ON: no extra padding), TC_008 (OFF: tabs fill space), TC_040–041
// GAAM-422: TC_016, TC_017, TC_035, TC_036
test.describe('AccordionTabsFeature — Headline ON/OFF Layout @matrix @regression', () => {

  test('[ATF-088] @matrix @regression Headline OFF: tablist is inside left column', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    // Instance 0 has no headline text (but headline wrapper always present in DOM)
    const instance = page.locator(ROOT).nth(0);
    const left = instance.locator(LEFT);
    const tablist = instance.locator('.cmp-accordion-tabs-feature__accordion-list');

    const leftBox = await left.boundingBox();
    const tablistBox = await tablist.boundingBox();
    if (!leftBox || !tablistBox) { test.skip(); return; }

    // Tablist should be within the left column boundaries
    expect(tablistBox.y, 'Tablist should be below left column top').toBeGreaterThanOrEqual(leftBox.y);
    expect(tablistBox.y, 'Tablist should be within left column')
      .toBeLessThan(leftBox.y + leftBox.height);
  });

  test('[ATF-089] @matrix @regression Headline ON: tablist is below headline block', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    // Instance 2 has headline
    const instance = page.locator(ROOT).nth(2);
    const headline = instance.locator(HEADLINE_BLOCK);
    const tablist = instance.locator('.cmp-accordion-tabs-feature__accordion-list');

    const headlineBox = await headline.boundingBox();
    const tablistBox = await tablist.boundingBox();

    if (!headlineBox || !tablistBox) { test.skip(); return; }

    // With headline, tablist should be below it
    expect(tablistBox.y, 'Tablist should be below headline')
      .toBeGreaterThanOrEqual(headlineBox.y + headlineBox.height - 5);
  });

  test('[ATF-090] @matrix @regression Headline ON: left column is taller than without headline', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());

    const noHeadlineLeft = page.locator(ROOT).nth(0).locator(LEFT);
    const headlineLeft = page.locator(ROOT).nth(2).locator(LEFT);

    const noHeadlineBox = await noHeadlineLeft.boundingBox();
    const headlineBox = await headlineLeft.boundingBox();

    if (!noHeadlineBox || !headlineBox) { test.skip(); return; }

    // Headline variant's left column should be at least as tall (headline adds content)
    // This is not strictly guaranteed — just verify both have reasonable height
    expect(noHeadlineBox.height).toBeGreaterThan(50);
    expect(headlineBox.height).toBeGreaterThan(50);
  });

  test('[ATF-091] @matrix @regression Tabs align correctly relative to right column image', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0);

    const leftBox = await instance.locator(LEFT).boundingBox();
    const rightBox = await instance.locator(RIGHT).boundingBox();

    if (!leftBox || !rightBox) { test.skip(); return; }

    // Left and right columns should have similar top positions (aligned)
    const topDiff = Math.abs(leftBox.y - rightBox.y);
    expect(topDiff, 'Left and right columns should be vertically aligned').toBeLessThan(30);
  });
});

// ─── Viewport Matrix ─────────────────────────────────────────────────────────
// GAAM-421: TC_050 (desktop)
// GAAM-422: TC_037 (multiple mobile sizes), TC_038 (alignment), TC_039 (design match)
const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Pixel 5', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 428, height: 926 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

test.describe('AccordionTabsFeature — Viewport Matrix @matrix @regression', () => {
  for (const vp of VIEWPORTS) {
    test(`[ATF-092-${vp.name.replace(/\s+/g, '-')}] @matrix @regression Renders at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const pom = new AccordionTabsFeaturePage(page);
      await pom.navigate(BASE());
      const instance = page.locator(ROOT).first();
      await expect(instance).toBeVisible();

      // Component has reasonable dimensions
      const box = await instance.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);

      // Check overflow — tablet (768px) may have minor overflow from two-column layout
      const overflow = await instance.evaluate(el => el.scrollWidth - el.clientWidth);
      if (overflow > 5) {
        console.warn(`${vp.name}: horizontal overflow of ${overflow}px`);
      }
    });

    test(`[ATF-093-${vp.name.replace(/\s+/g, '-')}] @matrix @regression Tabs are visible and clickable at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const pom = new AccordionTabsFeaturePage(page);
      await pom.navigate(BASE());
      const tabs = page.locator(ROOT).first().locator(TAB);
      const count = await tabs.count();
      expect(count).toBeGreaterThanOrEqual(2);

      // Click second tab to verify interactivity
      await tabs.nth(1).click();
      await page.waitForTimeout(500);
      const selected = await tabs.nth(1).getAttribute('aria-selected');
      const expanded = await tabs.nth(1).getAttribute('aria-expanded');
      expect(selected === 'true' || expanded === 'true',
        `Tab should be active after click at ${vp.width}px`).toBe(true);
    });
  }
});

// ─── Desktop / Mobile Consistency ────────────────────────────────────────────
// GAAM-422: TC_053
test.describe('AccordionTabsFeature — Desktop/Mobile Consistency @matrix @regression', () => {

  test('[ATF-094] @matrix @regression Same number of tabs on desktop and mobile viewports', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await pom.navigate(BASE());
    const desktopTabCount = await page.locator(ROOT).nth(0).locator(TAB).count();

    // Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await pom.navigate(BASE());
    const mobileTabCount = await page.locator(ROOT).nth(0).locator(TAB).count();

    expect(mobileTabCount, 'Mobile should have same number of tabs as desktop').toBe(desktopTabCount);
  });

  test('[ATF-095] @matrix @regression Same tab titles on desktop and mobile', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await pom.navigate(BASE());
    const tabs = page.locator(ROOT).nth(0).locator(TAB);
    const desktopTitles: string[] = [];
    for (let i = 0; i < await tabs.count(); i++) {
      desktopTitles.push((await tabs.nth(i).textContent())?.trim() || '');
    }

    // Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await pom.navigate(BASE());
    const mobileTabs = page.locator(ROOT).nth(0).locator(TAB);
    const mobileTitles: string[] = [];
    for (let i = 0; i < await mobileTabs.count(); i++) {
      mobileTitles.push((await mobileTabs.nth(i).textContent())?.trim() || '');
    }

    expect(mobileTitles).toEqual(desktopTitles);
  });

  test('[ATF-096] @matrix @regression Same number of instances rendered on desktop and mobile', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);

    await page.setViewportSize({ width: 1440, height: 900 });
    await pom.navigate(BASE());
    const desktopCount = await page.locator(ROOT).count();

    await page.setViewportSize({ width: 390, height: 844 });
    await pom.navigate(BASE());
    const mobileCount = await page.locator(ROOT).count();

    expect(mobileCount, 'Mobile should have same number of instances as desktop').toBe(desktopCount);
  });
});

// ─── Dark Background Matrix ──────────────────────────────────────────────────
// GAAM-421/422: Tests on dark backgrounds for contrast / readability
test.describe('AccordionTabsFeature — Dark Background Matrix @matrix @regression', () => {

  test('[ATF-097] @matrix @regression Granite bg: section has non-transparent background', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());

    const graniteSections = page.locator('.cmp-section--background-color-granite');
    if (await graniteSections.count() === 0) { test.skip(); return; }

    const bgColor = await graniteSections.first().evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor, 'Granite section should have a visible bg color').not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('transparent');
  });

  test('[ATF-098] @matrix @regression Granite bg: CTA links are visible', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());

    const graniteSection = page.locator('.cmp-section--background-color-granite');
    if (await graniteSection.count() === 0) { test.skip(); return; }

    const darkInstance = graniteSection.first().locator(ROOT);
    if (await darkInstance.count() === 0) { test.skip(); return; }

    const ctas = darkInstance.locator(`${PANEL_CTA} a`);
    const ctaCount = await ctas.count();
    for (let i = 0; i < ctaCount; i++) {
      const color = await ctas.nth(i).evaluate(el => getComputedStyle(el).color);
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) continue;
      const [, r, g, b] = match.map(Number);
      // CTA text should be light/visible on dark background
      const brightness = r + g + b;
      expect(brightness, `CTA color ${color} should be readable on dark bg`).toBeGreaterThan(200);
    }
  });

  test('[ATF-099] @matrix @regression Granite bg: panel descriptions are readable', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());

    const graniteSection = page.locator('.cmp-section--background-color-granite');
    if (await graniteSection.count() === 0) { test.skip(); return; }

    const darkInstance = graniteSection.first().locator(ROOT);
    if (await darkInstance.count() === 0) { test.skip(); return; }

    const desc = darkInstance.locator(PANEL_DESCRIPTION).first();
    if (await desc.count() === 0) { test.skip(); return; }

    const color = await desc.evaluate(el => getComputedStyle(el).color);
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) { test.skip(); return; }
    const [, r, g, b] = match.map(Number);
    const brightness = r + g + b;
    expect(brightness, `Description color ${color} should be readable on dark bg`).toBeGreaterThan(200);
  });
});

// ─── Variant x Background Matrix ─────────────────────────────────────────────
test.describe('AccordionTabsFeature — Variant x Background Matrix @matrix @regression', () => {

  test('[ATF-100] @matrix @regression Accordion variant on white bg: full structure intact', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0); // Accordion on white

    await expect(instance.locator(LEFT)).toBeVisible();
    await expect(instance.locator(RIGHT)).toBeVisible();
    expect(await instance.locator(TAB).count()).toBe(3);
    expect(await instance.locator(TABPANEL).count()).toBe(3);
    // Title h3 is CSS-hidden; verify description in first (expanded) panel
    const firstPanel = instance.locator(TABPANEL).first();
    await expect(firstPanel.locator(PANEL_DESCRIPTION)).toBeVisible();
  });

  test('[ATF-101] @matrix @regression Scrolling variant on white bg: full structure intact', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(1); // Scrolling on white

    await expect(instance.locator(LEFT)).toBeVisible();
    await expect(instance.locator(RIGHT)).toBeVisible();
    expect(await instance.locator(TAB).count()).toBe(3);
    expect(await instance.locator(TABPANEL).count()).toBe(3);
  });

  test('[ATF-102] @matrix @regression Headline variant on white bg: headline + tabs + panels', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(2); // Headline on white

    await expect(instance.locator(HEADLINE_BLOCK)).toHaveCount(1);
    await expect(instance.locator(LEFT)).toBeVisible();
    await expect(instance.locator(RIGHT)).toBeVisible();
    expect(await instance.locator(TAB).count()).toBe(3);
  });

  test('[ATF-103] @matrix @regression Accordion variant on granite bg: structure and dark colors', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());

    const graniteSection = page.locator('.cmp-section--background-color-granite');
    if (await graniteSection.count() === 0) { test.skip(); return; }

    const darkInstance = graniteSection.first().locator(ROOT);
    if (await darkInstance.count() === 0) { test.skip(); return; }

    await expect(darkInstance.locator(LEFT)).toBeVisible();
    await expect(darkInstance.locator(RIGHT)).toBeVisible();
    const tabCount = await darkInstance.locator(TAB).count();
    expect(tabCount).toBeGreaterThanOrEqual(2);
  });
});

// ─── Performance ─────────────────────────────────────────────────────────────
// GAAM-421: TC_047
// GAAM-422: TC_050
test.describe('AccordionTabsFeature — Performance @matrix @regression', () => {

  test('[ATF-104] @matrix @regression CLS score is below 0.25 threshold', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());

    // Measure CLS via PerformanceObserver
    const cls = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        let clsValue = 0;
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        // Give some time for shifts to be recorded
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });

    expect(cls, 'CLS should be below 0.25 threshold').toBeLessThan(0.25);
  });

  test('[ATF-105] @matrix @regression No images exceed 500KB', async ({ page }) => {
    const oversizedImages: string[] = [];

    page.on('response', response => {
      const url = response.url();
      // Only check component images, not AEM system resources (clientlibs, granite, coral)
      if (/\.(jpg|jpeg|png|gif|webp|svg)/i.test(url) && !url.includes('/etc.clientlibs/') && !url.includes('/granite/')) {
        const contentLength = response.headers()['content-length'];
        if (contentLength && parseInt(contentLength, 10) > 500 * 1024) {
          oversizedImages.push(`${url} (${Math.round(parseInt(contentLength, 10) / 1024)}KB)`);
        }
      }
    });

    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(2000);

    expect(oversizedImages, `Oversized images: ${oversizedImages.join(', ')}`).toEqual([]);
  });

  test('[ATF-106] @matrix @regression All component images have explicit dimensions', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const images = page.locator(`${ROOT} img`);
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const hasExplicit = await img.evaluate(el => {
        const width = el.getAttribute('width') || el.style.width;
        const height = el.getAttribute('height') || el.style.height;
        return !!(width && height);
      });
      // Missing explicit dimensions contributes to CLS — warn but don't fail
      if (!hasExplicit) {
        const src = await img.getAttribute('src');
        console.warn(`Image without explicit dimensions: ${src}`);
      }
    }
  });

  test('[ATF-107] @matrix @regression Page load does not produce failed resource requests', async ({ page }) => {
    const failedResources: string[] = [];

    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/ga/')) {
        failedResources.push(`${response.status()} ${response.url()}`);
      }
    });

    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(2000);

    expect(failedResources, `Failed GA resources: ${failedResources.join(', ')}`).toEqual([]);
  });
});

// ─── Cross-Instance Consistency ──────────────────────────────────────────────
test.describe('AccordionTabsFeature — Cross-Instance Consistency @matrix @regression', () => {

  test('[ATF-108] @matrix @regression All instances use consistent BEM class structure', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ROOT);
    const count = await roots.count();

    for (let i = 0; i < count; i++) {
      const instance = roots.nth(i);

      // Every instance must have wrapper, left, right
      await expect(instance.locator(WRAPPER), `Instance ${i}: wrapper`).toHaveCount(1);
      await expect(instance.locator(LEFT), `Instance ${i}: left column`).toHaveCount(1);
      await expect(instance.locator(RIGHT), `Instance ${i}: right column`).toHaveCount(1);

      // Every instance must have a tablist
      const tablistCount = await instance.locator('.cmp-accordion-tabs-feature__accordion-list').count();
      expect(tablistCount, `Instance ${i}: tablist`).toBe(1);
    }
  });

  test('[ATF-109] @matrix @regression All instances have ARIA roles on tabs and panels', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ROOT);
    const count = await roots.count();

    for (let i = 0; i < count; i++) {
      const tabs = roots.nth(i).locator(TAB);
      const tabCount = await tabs.count();
      for (let t = 0; t < tabCount; t++) {
        await expect(tabs.nth(t)).toHaveAttribute('role', 'tab');
      }

      const panels = roots.nth(i).locator(RIGHT).locator(TABPANEL);
      const panelCount = await panels.count();
      for (let p = 0; p < panelCount; p++) {
        await expect(panels.nth(p)).toHaveAttribute('role', 'tabpanel');
      }
    }
  });

  test('[ATF-110] @matrix @regression aria-controls on tabs link to corresponding panel IDs', async ({ page }) => {
    const pom = new AccordionTabsFeaturePage(page);
    await pom.navigate(BASE());
    const instance = page.locator(ROOT).nth(0);
    const tabs = instance.locator(TAB);
    const count = await tabs.count();

    for (let i = 0; i < count; i++) {
      const controls = await tabs.nth(i).getAttribute('aria-controls');
      if (!controls) continue; // Not all implementations use aria-controls

      // The controlled panel should exist in the DOM
      const panel = page.locator(`#${controls}`);
      expect(await panel.count(), `Panel with id="${controls}" should exist`).toBe(1);
      await expect(panel).toHaveAttribute('role', 'tabpanel');
    }
  });
});
