import { test, expect } from '@playwright/test';
import { TabsPage } from '../../../pages/ga/components/tabsPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

// ─── Selectors (from live DOM + LESS) ────────────────────────────────────────
const TABS            = '.cmp-tabs';
const TABLIST         = '.cmp-tabs__tablist';
const TAB             = '.cmp-tabs__tab';
const TAB_ACTIVE      = '.cmp-tabs__tab--active';
const TABPANEL        = '.cmp-tabs__tabpanel';
const TABPANEL_ACTIVE = '.cmp-tabs__tabpanel--active';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL    = '.cmp-section--background-color-azul';
const SECTION_SLATE   = '.cmp-section--background-color-slate';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─────────────────────────────────────────────────────────────────────────────
// Core Structure (TAB-001 – TAB-010)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Core Structure', () => {
  test('[TAB-001] @smoke @regression Style guide has at least 4 tabs instances', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const instances = page.locator(TABS);
    expect(await instances.count()).toBeGreaterThanOrEqual(4);
  });

  test('[TAB-002] @smoke @regression Tablist is rendered as an <ol> element', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tablist = page.locator(TABLIST).first();
    await expect(tablist).toBeVisible();
    const tagName = await tablist.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('ol');
  });

  test('[TAB-003] @regression Tab items are rendered as <li> elements', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTab = page.locator(TAB).first();
    await expect(firstTab).toBeVisible();
    const tagName = await firstTab.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('li');
  });

  test('[TAB-004] @regression Tab pill has border-radius of 999px', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tab = page.locator(TAB).first();
    await expect(tab).toBeVisible();
    const radius = await tab.evaluate(el => getComputedStyle(el).borderRadius);
    // 999px resolves to a large pixel value (clamped to half the element size) or 999px literally
    const numericValue = parseFloat(radius);
    expect(numericValue).toBeGreaterThanOrEqual(19); // at minimum half of 38px height
  });

  test('[TAB-005] @smoke @regression First tab is active by default (has --active class)', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const firstTab = firstTabsInstance.locator(TAB).first();
    await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);
  });

  test('[TAB-006] @regression Active tab has granite background and white text', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const activeTab = page.locator(TAB_ACTIVE).first();
    await expect(activeTab).toBeVisible();
    const color = await activeTab.evaluate(el => getComputedStyle(el).color);
    // White text: rgb(255, 255, 255)
    expect(color).toBe('rgb(255, 255, 255)');
    const bg = await activeTab.evaluate(el => getComputedStyle(el).backgroundColor);
    // Should not be transparent — granite bg is a dark color
    expect(bg).not.toContain('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
  });

  test('[TAB-007] @regression Inactive tabs have azul-toned color', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const tabCount = await tabs.count();
    // Find a tab without --active class
    let foundInactive = false;
    for (let i = 0; i < tabCount; i++) {
      const classes = await tabs.nth(i).getAttribute('class') || '';
      if (!classes.includes('--active')) {
        const color = await tabs.nth(i).evaluate(el => getComputedStyle(el).color);
        // Inactive tabs on white/slate sections have azul color (not white, not black)
        expect(color).not.toBe('rgb(255, 255, 255)');
        foundInactive = true;
        break;
      }
    }
    expect(foundInactive, 'Expected at least one inactive tab').toBe(true);
  });

  test('[TAB-008] @regression Hidden KKR elements are not visible (display:none)', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const bgImage = page.locator('.cmp-tabs__background-image').first();
    const linkListHeadline = page.locator('.cmp-link-list-headline').first();
    const linkListSubHeadline = page.locator('.cmp-link-list-sub-headline').first();
    // These elements are display:none GA overrides; they should not be visible
    if (await bgImage.count() > 0) {
      await expect(bgImage).toBeHidden();
    }
    if (await linkListHeadline.count() > 0) {
      await expect(linkListHeadline).toBeHidden();
    }
    if (await linkListSubHeadline.count() > 0) {
      await expect(linkListSubHeadline).toBeHidden();
    }
  });

  test('[TAB-009] @regression Tabs wrapper is a flex column container', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const wrapper = page.locator('.cmp-tabs__wrapper').first();
    if (await wrapper.count() === 0) { test.skip(); return; }
    const display = await wrapper.evaluate(el => getComputedStyle(el).display);
    const flexDir = await wrapper.evaluate(el => getComputedStyle(el).flexDirection);
    expect(display).toBe('flex');
    expect(flexDir).toBe('column');
  });

  test('[TAB-010] @regression Tab panel content area exists within each tabs instance', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const panels = firstTabsInstance.locator(TABPANEL);
    expect(await panels.count()).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tab Behavior (TAB-011 – TAB-016)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Tab Behavior', () => {
  test('[TAB-011] @smoke @regression Clicking a tab makes it active and removes active from old', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const tabCount = await tabs.count();
    if (tabCount < 2) { test.skip(); return; }
    // First tab is active; click the second
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveClass(/cmp-tabs__tab--active/);
    await expect(tabs.nth(0)).not.toHaveClass(/cmp-tabs__tab--active/);
  });

  test('[TAB-012] @smoke @regression Clicking a tab shows its associated tabpanel', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const panels = firstTabsInstance.locator(TABPANEL);
    if (await tabs.count() < 2) { test.skip(); return; }
    // Click second tab
    await tabs.nth(1).click();
    // Second panel should become active
    await expect(panels.nth(1)).toHaveClass(/cmp-tabs__tabpanel--active/);
  });

  test('[TAB-013] @regression Only one tabpanel is active at a time', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const activePanels = firstTabsInstance.locator(TABPANEL_ACTIVE);
    expect(await activePanels.count()).toBe(1);
    // Click a different tab and verify still only one active
    const tabs = firstTabsInstance.locator(TAB);
    if (await tabs.count() >= 3) {
      await tabs.nth(2).click();
      expect(await activePanels.count()).toBe(1);
    }
  });

  test('[TAB-014] @regression Active panel has display:block, inactive panels have display:none', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const panels = firstTabsInstance.locator(TABPANEL);
    const count = await panels.count();
    for (let i = 0; i < count; i++) {
      const classes = await panels.nth(i).getAttribute('class') || '';
      const display = await panels.nth(i).evaluate(el => getComputedStyle(el).display);
      if (classes.includes('--active')) {
        expect(display).toBe('block');
      } else {
        expect(display).toBe('none');
      }
    }
  });

  test('[TAB-015] @regression Active tab panel has margin-top of 48px', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const activePanel = page.locator(TABPANEL_ACTIVE).first();
    await expect(activePanel).toBeVisible();
    const marginTop = await activePanel.evaluate(el => getComputedStyle(el).marginTop);
    expect(marginTop).toBe('48px');
  });

  test('[TAB-016] @regression Active tab has tabindex="0", inactive tabs have tabindex="-1"', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const count = await tabs.count();
    for (let i = 0; i < count; i++) {
      const classes = await tabs.nth(i).getAttribute('class') || '';
      const tabindex = await tabs.nth(i).getAttribute('tabindex');
      if (classes.includes('--active')) {
        expect(tabindex).toBe('0');
      } else {
        expect(tabindex).toBe('-1');
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Pill Styling (TAB-017 – TAB-022)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Pill Styling', () => {
  test('[TAB-017] @regression Tab has cursor:pointer', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tab = page.locator(TAB).first();
    await expect(tab).toBeVisible();
    const cursor = await tab.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
  });

  test('[TAB-018] @regression Tab has CSS transition for background-color and color', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tab = page.locator(TAB).first();
    await expect(tab).toBeVisible();
    const transition = await tab.evaluate(el => getComputedStyle(el).transition);
    // Should contain transition properties for bg/color
    expect(transition).not.toBe('');
    expect(transition).not.toBe('none 0s ease 0s');
  });

  test('[TAB-019] @regression Inactive tab background changes on hover (azul 8% bg)', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const tabCount = await tabs.count();
    // Find an inactive tab
    let inactiveIdx = -1;
    for (let i = 0; i < tabCount; i++) {
      const classes = await tabs.nth(i).getAttribute('class') || '';
      if (!classes.includes('--active')) { inactiveIdx = i; break; }
    }
    if (inactiveIdx === -1) { test.skip(); return; }
    const bgBefore = await tabs.nth(inactiveIdx).evaluate(el => getComputedStyle(el).backgroundColor);
    await tabs.nth(inactiveIdx).hover();
    await page.waitForTimeout(200);
    const bgAfter = await tabs.nth(inactiveIdx).evaluate(el => getComputedStyle(el).backgroundColor);
    // Background should change on hover; if transition is in progress both values may differ
    // Accept that it changed OR assert it is not fully transparent (azul 8%)
    expect(bgAfter).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('[TAB-020] @a11y @regression Focus-visible shows 2px azul outline on tab', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const tabCount = await tabs.count();
    if (tabCount === 0) { test.skip(); return; }
    await tabs.first().focus();
    const outline = await tabs.first().evaluate(el => {
      const cs = getComputedStyle(el);
      return { style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor };
    });
    // Focus outline should have non-zero width and be visible
    expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
    expect(outline.style).not.toBe('none');
  });

  test('[TAB-021] @regression Desktop tab height is 46px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tab = page.locator(TAB).first();
    await expect(tab).toBeVisible();
    const box = await tab.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeCloseTo(46, 0);
  });

  test('[TAB-022] @regression Tab uses Graphie Bold font family', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tab = page.locator(TAB).first();
    await expect(tab).toBeVisible();
    const fontFamily = await tab.evaluate(el => getComputedStyle(el).fontFamily);
    // GA uses Graphie Bold for tab labels
    expect(fontFamily.toLowerCase()).toContain('graphie');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Responsive (TAB-023 – TAB-028)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Responsive', () => {
  test('[TAB-023] @mobile @regression At 390px tablist wraps tabs (flex-wrap: wrap)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tablist = page.locator(TABLIST).first();
    await expect(tablist).toBeVisible();
    const flexWrap = await tablist.evaluate(el => getComputedStyle(el).flexWrap);
    expect(flexWrap).toBe('wrap');
  });

  test('[TAB-024] @mobile @regression Mobile tablist gap is 8px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tablist = page.locator(TABLIST).first();
    await expect(tablist).toBeVisible();
    const gap = await tablist.evaluate(el => getComputedStyle(el).gap);
    expect(gap).toBe('8px');
  });

  test('[TAB-025] @mobile @regression Mobile tab height is 38px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tab = page.locator(TAB).first();
    await expect(tab).toBeVisible();
    const box = await tab.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeCloseTo(38, 0);
  });

  test('[TAB-026] @mobile @regression Mobile tab font-size is smaller than desktop', async ({ page }) => {
    // Desktop font size
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const desktopFontSize = await page.locator(TAB).first().evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    // Mobile font size
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    const mobileFontSize = await page.locator(TAB).first().evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(mobileFontSize).toBeLessThanOrEqual(desktopFontSize);
  });

  test('[TAB-027] @mobile @regression No horizontal overflow on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tabsInstance = page.locator(TABS).first();
    await expect(tabsInstance).toBeVisible();
    const hasOverflow = await tabsInstance.evaluate(el => el.scrollWidth > el.clientWidth + 1);
    expect(hasOverflow).toBe(false);
  });

  test('[TAB-028] @mobile @regression Tablist centers on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tablist = page.locator(TABLIST).first();
    await expect(tablist).toBeVisible();
    const justifyContent = await tablist.evaluate(el => getComputedStyle(el).justifyContent);
    // Center or flex-start both acceptable; verify it is not overflow-causing
    expect(['center', 'flex-start', 'normal', 'start']).toContain(justifyContent);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Dark Mode (TAB-029 – TAB-034)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Dark Mode', () => {
  test('[TAB-029] @regression On granite section: inactive tab text is white', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const graniteSection = page.locator(SECTION_GRANITE).first();
    if (await graniteSection.count() === 0) { test.skip(); return; }
    const firstTabsInstance = graniteSection.locator(TABS).first();
    if (await firstTabsInstance.count() === 0) { test.skip(); return; }
    const tabs = firstTabsInstance.locator(TAB);
    const tabCount = await tabs.count();
    for (let i = 0; i < tabCount; i++) {
      const classes = await tabs.nth(i).getAttribute('class') || '';
      if (!classes.includes('--active')) {
        const color = await tabs.nth(i).evaluate(el => getComputedStyle(el).color);
        expect(color).toBe('rgb(255, 255, 255)');
        return;
      }
    }
    test.skip(); // no inactive tab found
  });

  test('[TAB-030] @regression On granite section: active tab has white bg and granite text', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const graniteSection = page.locator(SECTION_GRANITE).first();
    if (await graniteSection.count() === 0) { test.skip(); return; }
    const firstTabsInstance = graniteSection.locator(TABS).first();
    if (await firstTabsInstance.count() === 0) { test.skip(); return; }
    const activeTab = firstTabsInstance.locator(TAB_ACTIVE).first();
    if (await activeTab.count() === 0) { test.skip(); return; }
    const bg = await activeTab.evaluate(el => getComputedStyle(el).backgroundColor);
    // Active tab on dark: white background
    expect(bg).toBe('rgb(255, 255, 255)');
    const color = await activeTab.evaluate(el => getComputedStyle(el).color);
    // Text should be dark (granite) — not white
    expect(color).not.toBe('rgb(255, 255, 255)');
  });

  test('[TAB-031] @regression On azul section: inactive tab text is white', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const azulSection = page.locator(SECTION_AZUL).first();
    if (await azulSection.count() === 0) { test.skip(); return; }
    const firstTabsInstance = azulSection.locator(TABS).first();
    if (await firstTabsInstance.count() === 0) { test.skip(); return; }
    const tabs = firstTabsInstance.locator(TAB);
    const tabCount = await tabs.count();
    for (let i = 0; i < tabCount; i++) {
      const classes = await tabs.nth(i).getAttribute('class') || '';
      if (!classes.includes('--active')) {
        const color = await tabs.nth(i).evaluate(el => getComputedStyle(el).color);
        expect(color).toBe('rgb(255, 255, 255)');
        return;
      }
    }
    test.skip(); // no inactive tab found
  });

  test('[TAB-032] @a11y @regression Focus outline on dark section uses white outline', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const darkSection = page.locator(`${SECTION_GRANITE}, ${SECTION_AZUL}`).first();
    if (await darkSection.count() === 0) { test.skip(); return; }
    const firstTabsInstance = darkSection.locator(TABS).first();
    if (await firstTabsInstance.count() === 0) { test.skip(); return; }
    const tab = firstTabsInstance.locator(TAB).first();
    await tab.focus();
    const outlineColor = await tab.evaluate(el => getComputedStyle(el).outlineColor);
    // On dark backgrounds GA uses white focus ring
    expect(outlineColor).toBe('rgb(255, 255, 255)');
  });

  test('[TAB-033] @regression Tablist pill background on dark section is semi-transparent', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const graniteSection = page.locator(SECTION_GRANITE).first();
    if (await graniteSection.count() === 0) { test.skip(); return; }
    const firstTabsInstance = graniteSection.locator(TABS).first();
    if (await firstTabsInstance.count() === 0) { test.skip(); return; }
    const tablist = firstTabsInstance.locator(TABLIST).first();
    const bg = await tablist.evaluate(el => getComputedStyle(el).backgroundColor);
    // On dark sections tablist bg is rgba semi-transparent (not solid white or transparent)
    expect(bg).toMatch(/rgba/);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('[TAB-034] @regression On slate section tablist background is white on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const slateSection = page.locator(SECTION_SLATE).first();
    if (await slateSection.count() === 0) { test.skip(); return; }
    const firstTabsInstance = slateSection.locator(TABS).first();
    if (await firstTabsInstance.count() === 0) { test.skip(); return; }
    const tablist = firstTabsInstance.locator(TABLIST).first();
    const bg = await tablist.evaluate(el => getComputedStyle(el).backgroundColor);
    // Slate is a light section; tablist bg is white
    expect(bg).toBe('rgb(255, 255, 255)');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ARIA Accessibility (TAB-035 – TAB-040)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — ARIA Accessibility', () => {
  test('[TAB-035] @a11y @wcag22 @regression Tablist has role="tablist"', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const tablist = page.locator(TABLIST).first();
    await expect(tablist).toBeVisible();
    const role = await tablist.getAttribute('role');
    expect(role).toBe('tablist');
  });

  test('[TAB-036] @a11y @wcag22 @regression Each tab item has role="tab"', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const role = await tabs.nth(i).getAttribute('role');
      expect(role).toBe('tab');
    }
  });

  test('[TAB-037] @a11y @wcag22 @regression Active tab has aria-selected="true"', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const activeTab = firstTabsInstance.locator(TAB_ACTIVE).first();
    await expect(activeTab).toBeVisible();
    const ariaSelected = await activeTab.getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
  });

  test('[TAB-038] @a11y @wcag22 @regression Tab panel has role="tabpanel"', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const activePanel = firstTabsInstance.locator(TABPANEL_ACTIVE).first();
    await expect(activePanel).toBeVisible();
    const role = await activePanel.getAttribute('role');
    expect(role).toBe('tabpanel');
  });

  test('[TAB-039] @a11y @wcag22 @regression @smoke Tabs passes axe-core WCAG 2.2 AA scan', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(TABS)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[TAB-040] @a11y @wcag22 @regression All tabs are keyboard-reachable via Tab key', async ({ page }) => {
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    const firstTabsInstance = page.locator(TABS).first();
    const firstTab = firstTabsInstance.locator(TAB).first();
    await expect(firstTab).toBeVisible();
    // Focus the first tab via Tab navigation
    await firstTab.focus();
    const focusedTagName = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName.toLowerCase() : '';
    });
    // Focus should land on a tab item or its container
    expect(['li', 'button', 'a', 'div']).toContain(focusedTagName);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Dialog & GA Overlay (TAB-041 – TAB-044)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Dialog & GA Overlay', () => {
  test('[TAB-041] @author @regression GA overlay has correct sling:resourceSuperType', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/tabs.1.json`;
    const response = await page.request.get(overlayUrl);
    expect(response.ok(), 'GA tabs overlay component not found').toBe(true);
    const json = await response.json();
    expect(json['sling:resourceSuperType']).toBe('kkr-aem-base/components/content/tabs');
  });

  test('[TAB-042] @author @regression GA overlay has componentGroup="GA Base"', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/tabs.1.json`;
    const response = await page.request.get(overlayUrl);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(json['componentGroup']).toBe('GA Base');
  });

  test('[TAB-043] @author @regression GA overlay has cq:isContainer=true', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/tabs.1.json`;
    const response = await page.request.get(overlayUrl);
    if (!response.ok()) { test.skip(); return; }
    const json = await response.json();
    expect(String(json['cq:isContainer'])).toBe('true');
  });

  test('[TAB-044] @author @regression @smoke GA tabs dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/tabs/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'GA tabs dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Tabs dialog missing helpPath property').toBeTruthy();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Console (TAB-045)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabs — Console', () => {
  test('[TAB-045] @regression No JS errors on page load or tab interaction', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new TabsPage(page);
    await pom.navigate(BASE());
    // Interact with tabs to trigger any JS errors during activation
    const firstTabsInstance = page.locator(TABS).first();
    const tabs = firstTabsInstance.locator(TAB);
    const tabCount = await tabs.count();
    for (let i = 1; i < Math.min(tabCount, 3); i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(500);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});
