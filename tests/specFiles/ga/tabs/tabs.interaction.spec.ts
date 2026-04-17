import { test, expect } from '@playwright/test';
import { TabsPage } from '../../../pages/ga/components/tabsPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const TABS = '.cmp-tabs';
const TAB = '.cmp-tabs__tab';
const TAB_ACTIVE = '.cmp-tabs__tab--active';
const TABPANEL = '.cmp-tabs__tabpanel';
const TABPANEL_ACTIVE = '.cmp-tabs__tabpanel--active';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';

const STYLE_GUIDE_URL = '/content/global-atlantic/style-guide/components/tabs.html?wcmmode=disabled';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Tabs — Component Interactions @interaction @regression', () => {

  // ─── Click Interactions ───────────────────────────────────────────────────

  test('TAB-INT-001: clicking 2nd tab makes it active and removes active from 1st', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    // Use the first tabs instance (default / light background)
    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);
    await expect(tabs).toHaveCount(6);

    // 1st tab should be active by default
    const firstTab = tabs.nth(0);
    const secondTab = tabs.nth(1);
    await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);
    await expect(secondTab).not.toHaveClass(/cmp-tabs__tab--active/);

    // Click 2nd tab
    await secondTab.click();

    await expect(secondTab).toHaveClass(/cmp-tabs__tab--active/);
    await expect(firstTab).not.toHaveClass(/cmp-tabs__tab--active/);
  });

  test('TAB-INT-002: clicking a tab makes its associated panel active', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);
    const panels = tabsRoot.locator(TABPANEL);

    // Click the 3rd tab
    const thirdTab = tabs.nth(2);
    await thirdTab.click();

    // The 3rd panel should now be active
    const thirdPanel = panels.nth(2);
    await expect(thirdPanel).toHaveClass(/cmp-tabs__tabpanel--active/);

    // The 3rd panel should be visible
    await expect(thirdPanel).toBeVisible();

    // Other panels should not be active
    await expect(panels.nth(0)).not.toHaveClass(/cmp-tabs__tabpanel--active/);
    await expect(panels.nth(1)).not.toHaveClass(/cmp-tabs__tabpanel--active/);
  });

  test('TAB-INT-003: clicking an already-active tab keeps it active (no state change)', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);
    const firstTab = tabs.nth(0);

    // Confirm 1st tab is active
    await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);

    // Click the same active tab
    await firstTab.click();

    // Should still be active
    await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);

    // Only one tab should be active
    const activeCount = await tabsRoot.locator(TAB_ACTIVE).count();
    expect(activeCount).toBe(1);
  });

  test('TAB-INT-004: rapid clicking between tabs leaves only the last clicked tab active', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);

    // Rapid-click through tabs 1 → 3 → 2 → 5 → 4
    await tabs.nth(0).click();
    await tabs.nth(2).click();
    await tabs.nth(1).click();
    await tabs.nth(4).click();
    await tabs.nth(3).click();

    // Only the 4th tab (index 3) should be active
    await expect(tabs.nth(3)).toHaveClass(/cmp-tabs__tab--active/);

    // Exactly one active tab
    const activeTabCount = await tabsRoot.locator(TAB_ACTIVE).count();
    expect(activeTabCount).toBe(1);

    // Exactly one active panel
    const activePanelCount = await tabsRoot.locator(TABPANEL_ACTIVE).count();
    expect(activePanelCount).toBe(1);
  });

  // ─── Keyboard Navigation ──────────────────────────────────────────────────

  test('TAB-INT-005: Tab key focuses the active tab in the tablist', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const firstTab = tabsRoot.locator(TAB).first();

    // The active tab should have tabindex="0" (WAI-ARIA roving tabindex)
    await expect(firstTab).toHaveAttribute('tabindex', '0');

    // Inactive tabs should have tabindex="-1"
    const secondTab = tabsRoot.locator(TAB).nth(1);
    await expect(secondTab).toHaveAttribute('tabindex', '-1');
  });

  test('TAB-INT-006: ArrowRight from active tab moves focus and activates next tab', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);
    const firstTab = tabs.nth(0);
    const secondTab = tabs.nth(1);

    // Ensure first tab is active and click to focus
    await firstTab.click();
    await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);

    // Press ArrowRight — AEM tabs JS activates the next tab on arrow key
    await firstTab.press('ArrowRight');

    await expect(secondTab).toHaveClass(/cmp-tabs__tab--active/);
    await expect(firstTab).not.toHaveClass(/cmp-tabs__tab--active/);
    await expect(secondTab).toHaveAttribute('tabindex', '0');
  });

  test('TAB-INT-007: ArrowLeft from active tab moves focus and activates previous tab', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);
    const secondTab = tabs.nth(1);
    const firstTab = tabs.nth(0);

    // Click 2nd tab first so we can navigate left
    await secondTab.click();
    await expect(secondTab).toHaveClass(/cmp-tabs__tab--active/);

    // Press ArrowLeft — should move to 1st tab
    await secondTab.press('ArrowLeft');

    await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);
    await expect(secondTab).not.toHaveClass(/cmp-tabs__tab--active/);
    await expect(firstTab).toHaveAttribute('tabindex', '0');
  });

  test('TAB-INT-008: focused tab has a visible focus-visible outline', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const firstTab = tabsRoot.locator(TAB).first();

    // Focus the tab via keyboard (Tab into the tablist, then verify outline)
    await firstTab.focus();

    // Verify the element is focused
    await expect(firstTab).toBeFocused();

    // Verify outline style is applied — AEM tabs uses 2px solid azul outline on :focus-visible
    const outlineWidth = await firstTab.evaluate((el) => {
      return window.getComputedStyle(el, ':focus-visible').outlineWidth ||
             window.getComputedStyle(el).outlineWidth;
    });
    // The outline-width should be non-zero (i.e., not '0px') when focused
    expect(outlineWidth).not.toBe('0px');
  });

  // ─── Hover States ─────────────────────────────────────────────────────────

  test('TAB-INT-009: hovering an inactive tab applies a background-color change', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);
    const secondTab = tabs.nth(1);

    // Ensure 2nd tab is inactive
    await expect(secondTab).not.toHaveClass(/cmp-tabs__tab--active/);

    // Capture background-color before hover
    const bgBefore = await secondTab.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // Hover over the inactive tab
    await secondTab.hover();

    // Capture background-color after hover
    const bgAfter = await secondTab.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // Background color should change on hover (azul 8% opacity overlay)
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('TAB-INT-010: hovering the active tab does not change its background-color', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    const tabsRoot = page.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const firstTab = tabsRoot.locator(TAB).first();

    // Ensure 1st tab is active
    await expect(firstTab).toHaveClass(/cmp-tabs__tab--active/);

    // Capture background-color of active tab before hover
    const bgBefore = await firstTab.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // Hover the active tab
    await firstTab.hover();

    // Background color should remain the same (granite fill is locked for active)
    const bgAfter = await firstTab.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    expect(bgAfter).toBe(bgBefore);
  });

  // ─── Cross-Background ─────────────────────────────────────────────────────

  test('TAB-INT-011: tab click works on granite section (dark background)', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    // Locate the granite section and its tabs instance
    const graniteSection = page.locator(SECTION_GRANITE).first();
    await expect(graniteSection).toBeVisible();

    const tabsRoot = graniteSection.locator(TABS).first();
    await expect(tabsRoot).toBeVisible();

    const tabs = tabsRoot.locator(TAB);
    const panels = tabsRoot.locator(TABPANEL);

    // Click 3rd tab
    const thirdTab = tabs.nth(2);
    await thirdTab.click();

    // 3rd tab should be active
    await expect(thirdTab).toHaveClass(/cmp-tabs__tab--active/);

    // 3rd panel should be active and visible
    const thirdPanel = panels.nth(2);
    await expect(thirdPanel).toHaveClass(/cmp-tabs__tabpanel--active/);
    await expect(thirdPanel).toBeVisible();

    // Previous tabs should not be active
    await expect(tabs.nth(0)).not.toHaveClass(/cmp-tabs__tab--active/);
    await expect(tabs.nth(1)).not.toHaveClass(/cmp-tabs__tab--active/);
  });

  test('TAB-INT-012: tab click works on default (light) section — both instances switch panels independently', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    // The default instance is the first tabs on the page (no granite/azul parent)
    const allTabsInstances = page.locator(TABS);
    const instanceCount = await allTabsInstances.count();
    expect(instanceCount).toBeGreaterThanOrEqual(2);

    // Use the first (default/light) instance
    const lightTabsRoot = allTabsInstances.first();
    await expect(lightTabsRoot).toBeVisible();

    const lightTabs = lightTabsRoot.locator(TAB);
    const lightPanels = lightTabsRoot.locator(TABPANEL);

    // Click 4th tab in light instance
    await lightTabs.nth(3).click();
    await expect(lightTabs.nth(3)).toHaveClass(/cmp-tabs__tab--active/);
    await expect(lightPanels.nth(3)).toHaveClass(/cmp-tabs__tabpanel--active/);

    // Use the granite instance (second or third instance depending on page layout)
    const graniteSection = page.locator(SECTION_GRANITE).first();
    const graniteTabsRoot = graniteSection.locator(TABS).first();
    await expect(graniteTabsRoot).toBeVisible();

    const graniteTabs = graniteTabsRoot.locator(TAB);
    const granitePanels = graniteTabsRoot.locator(TABPANEL);

    // Click 2nd tab in granite instance
    await graniteTabs.nth(1).click();
    await expect(graniteTabs.nth(1)).toHaveClass(/cmp-tabs__tab--active/);
    await expect(granitePanels.nth(1)).toHaveClass(/cmp-tabs__tabpanel--active/);

    // Verify light instance was NOT affected by granite interaction
    await expect(lightTabs.nth(3)).toHaveClass(/cmp-tabs__tab--active/);
    await expect(lightPanels.nth(3)).toHaveClass(/cmp-tabs__tabpanel--active/);
  });

});
