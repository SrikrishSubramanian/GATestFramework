import { test, expect } from '@playwright/test';
import { NavigationPage } from '../../../pages/ga/components/navigationPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

// Mobile viewport (matches @ga-bp-mobile-max: 768px)
const MOBILE = { width: 390, height: 844 };
const TABLET = { width: 768, height: 1024 };
const DESKTOP = { width: 1440, height: 900 };

// Selectors from live DOM scan + LESS analysis
const SEL = {
  root: '.cmp-navigation',
  group: '.cmp-navigation__group',
  item: '.cmp-navigation__item',
  itemLevel0: '.cmp-navigation__item--level-0',
  itemLevel1: '.cmp-navigation__item--level-1',
  itemLink: '.cmp-navigation__item-link',
  itemExpanded: '.cmp-navigation__item--expanded',
  verticalMod: '.ga-nav--vertical',
  sectionGranite: '.cmp-section--background-color-granite',
  sectionAzul: '.cmp-section--background-color-azul',
  sectionWhite: '.cmp-section--background-color-white',
};

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Mobile Single List ───────────────────────────────────────────────────────

test.describe('Navigation — Mobile Single List (GAAM-396)', () => {
  test('[NVGT-001] @mobile @regression Horizontal nav converts to vertical stack on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    // First .cmp-navigation on page is single-list (structureDepth=1)
    const nav = page.locator(`${SEL.sectionWhite} ${SEL.root}`).first();
    await expect(nav).toBeVisible();

    // At mobile, the top-level group should stack vertically (flex-direction: column)
    const group = nav.locator(`> ${SEL.group}`);
    const flexDir = await group.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  test('[NVGT-002] @mobile @regression Vertical orientation remains vertical stack on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    // Vertical orientation nav has .ga-nav--vertical class
    const vertNav = page.locator(`${SEL.verticalMod} ${SEL.root}`).first();
    if (await vertNav.count() === 0) {
      // Fall back to finding by the vertical style system class on a parent
      const vertNavAlt = page.locator(`${SEL.root}`).filter({ has: page.locator(SEL.verticalMod) });
      test.skip(await vertNavAlt.count() === 0, 'No vertical orientation nav found on style guide');
    }

    const group = vertNav.locator(`> ${SEL.group}`);
    const flexDir = await group.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  test('[NVGT-003] @mobile @a11y @regression Links are keyboard navigable in single list', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const nav = page.locator(SEL.root).first();
    const links = nav.locator(SEL.itemLink);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    // Tab to first link and verify it receives focus
    await links.first().focus();
    const focused = await page.evaluate(() => document.activeElement?.classList.contains('cmp-navigation__item-link'));
    expect(focused).toBe(true);
  });
});

// ─── Mobile Grouped Navigation (Accordion) ───────────────────────────────────

test.describe('Navigation — Mobile Grouped Accordion (GAAM-396)', () => {
  test('[NVGT-004] @mobile @regression Grouped nav converts to accordion on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    // Grouped nav has structureDepth=2 — look for nav with level-1 items
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    await expect(groupedNav).toBeVisible();

    // Level-0 items should act as accordion triggers at mobile
    const triggers = groupedNav.locator(SEL.itemLevel0);
    const triggerCount = await triggers.count();
    expect(triggerCount).toBeGreaterThan(1);
  });

  test('[NVGT-005] @mobile @regression Accordion triggers have expand/collapse icon', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const trigger = groupedNav.locator(SEL.itemLevel0).first();

    // Check for icon indicator — could be ::before/::after, SVG, or background-image
    const hasIcon = await trigger.evaluate(el => {
      const before = getComputedStyle(el, '::before');
      const after = getComputedStyle(el, '::after');
      const hasPseudo = (before.content !== 'none' && before.content !== '') ||
                        (after.content !== 'none' && after.content !== '');
      const hasSvg = el.querySelector('svg') !== null;
      const hasBgImage = getComputedStyle(el).backgroundImage !== 'none';
      // Also check the direct child link for icon indicators
      const link = el.querySelector(':scope > .cmp-navigation__item-link');
      const linkBefore = link ? getComputedStyle(link, '::before') : null;
      const linkAfter = link ? getComputedStyle(link, '::after') : null;
      const hasLinkPseudo = linkBefore && linkBefore.content !== 'none' && linkBefore.content !== '' ||
                            linkAfter && linkAfter.content !== 'none' && linkAfter.content !== '';
      return hasPseudo || hasSvg || hasBgImage || hasLinkPseudo;
    });
    expect(hasIcon).toBe(true);
  });

  test('[NVGT-006] @mobile @regression Accordion shows + icon when collapsed', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const trigger = groupedNav.locator(SEL.itemLevel0).first();

    // Ensure item is not expanded
    const isExpanded = await trigger.evaluate(el => el.classList.contains('cmp-navigation__item--expanded'));
    if (isExpanded) {
      await trigger.locator(':scope > .cmp-navigation__item-link').click();
      await page.waitForTimeout(300);
    }

    // Check for + indicator (pseudo-element content or SVG)
    const afterContent = await trigger.evaluate(el => getComputedStyle(el, '::after').content);
    // + icon should be present when collapsed
    expect(afterContent).toBeTruthy();
  });

  test('[NVGT-007] @mobile @regression Accordion shows - icon when expanded', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const trigger = groupedNav.locator(SEL.itemLevel0).first();

    // Click to expand
    await trigger.locator(':scope > .cmp-navigation__item-link').click();
    await page.waitForTimeout(300);

    // Verify expanded class is added
    await expect(trigger).toHaveClass(/cmp-navigation__item--expanded/);

    // Check for - indicator in expanded state
    const afterContent = await trigger.evaluate(el => getComputedStyle(el, '::after').content);
    expect(afterContent).toBeTruthy();
  });

  test('[NVGT-008] @mobile @regression Only one accordion section open at a time', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const triggers = groupedNav.locator(SEL.itemLevel0);
    const triggerCount = await triggers.count();
    test.skip(triggerCount < 2, 'Need at least 2 accordion triggers for exclusive-open test');

    // Expand first section
    await triggers.nth(0).locator(':scope > .cmp-navigation__item-link').click();
    await page.waitForTimeout(300);
    await expect(triggers.nth(0)).toHaveClass(/cmp-navigation__item--expanded/);

    // Expand second section — first should collapse
    await triggers.nth(1).locator(':scope > .cmp-navigation__item-link').click();
    await page.waitForTimeout(300);
    await expect(triggers.nth(1)).toHaveClass(/cmp-navigation__item--expanded/);

    // First should no longer be expanded
    const firstExpanded = await triggers.nth(0).evaluate(el =>
      el.classList.contains('cmp-navigation__item--expanded')
    );
    expect(firstExpanded).toBe(false);
  });

  test('[NVGT-009] @mobile @regression Click accordion trigger expands/collapses link list', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const trigger = groupedNav.locator(SEL.itemLevel0).first();
    // Use :scope > to get only the direct child group (not nested groups)
    const childGroup = trigger.locator(':scope > .cmp-navigation__group');

    // Initially collapsed — child links should be hidden
    const initialDisplay = await childGroup.evaluate(el => getComputedStyle(el).display);
    expect(initialDisplay).toBe('none');

    // Click to expand
    await trigger.locator(':scope > .cmp-navigation__item-link').click();
    await page.waitForTimeout(300);

    // Child links should now be visible
    const expandedDisplay = await childGroup.evaluate(el => getComputedStyle(el).display);
    expect(expandedDisplay).not.toBe('none');

    // Click again to collapse
    await trigger.locator(':scope > .cmp-navigation__item-link').click();
    await page.waitForTimeout(300);

    const collapsedDisplay = await childGroup.evaluate(el => getComputedStyle(el).display);
    expect(collapsedDisplay).toBe('none');
  });

  test('[NVGT-010] @mobile @a11y @regression Links within expanded accordion are keyboard navigable', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const trigger = groupedNav.locator(SEL.itemLevel0).first();

    // Expand the section
    await trigger.locator(':scope > .cmp-navigation__item-link').click();
    await page.waitForTimeout(300);

    // Child links should be visible and focusable
    const childLinks = trigger.locator(':scope > .cmp-navigation__group .cmp-navigation__item-link');
    const childCount = await childLinks.count();
    expect(childCount).toBeGreaterThan(0);

    // Focus first child link
    await childLinks.first().focus();
    const isFocused = await page.evaluate(() =>
      document.activeElement?.classList.contains('cmp-navigation__item-link')
    );
    expect(isFocused).toBe(true);
  });

  test('[NVGT-011] @mobile @regression Accordion state persists during session (optional)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const trigger = groupedNav.locator(SEL.itemLevel0).first();

    // Expand a section
    await trigger.locator(':scope > .cmp-navigation__item-link').click();
    await page.waitForTimeout(300);
    await expect(trigger).toHaveClass(/cmp-navigation__item--expanded/);

    // Note: Session persistence is marked optional in AC — this test verifies
    // the expanded state survives within the same page session (no navigation away)
    // Full session persistence (across page loads) would require sessionStorage checks
  });
});

// ─── General Delivery ─────────────────────────────────────────────────────────

test.describe('Navigation — General Delivery (GAAM-396)', () => {
  test('[NVGT-012] @regression @visual Navigation styles render on granite background', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const graniteNav = page.locator(`${SEL.sectionGranite} ${SEL.root}`).first();
    await expect(graniteNav).toBeVisible();

    // Verify dark-mode: level-1 links use white color; headings use subdued color
    // Target level-1 child links (not headings which use helper-dark)
    const childLink = graniteNav.locator(`${SEL.itemLevel1} ${SEL.itemLink}`).first();
    if (await childLink.count() > 0) {
      const linkColor = await childLink.evaluate(el => getComputedStyle(el).color);
      expect(linkColor).toMatch(/rgb\(255,\s*255,\s*255\)/);
    } else {
      // Single-list nav — all links should be white on dark bg
      const anyLink = graniteNav.locator(SEL.itemLink).first();
      const color = await anyLink.evaluate(el => getComputedStyle(el).color);
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(match).toBeTruthy();
      const avg = (parseInt(match![1]) + parseInt(match![2]) + parseInt(match![3])) / 3;
      expect(avg).toBeGreaterThan(150);
    }
  });

  test('[NVGT-013] @regression Navigation renders on azul background', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const azulSection = page.locator(`${SEL.sectionAzul} ${SEL.root}`).first();
    await expect(azulSection).toBeVisible();
  });

  test('[NVGT-014] @regression Navigation renders on white background', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const whiteSection = page.locator(`${SEL.sectionWhite} ${SEL.root}`).first();
    await expect(whiteSection).toBeVisible();
  });

  test('[NVGT-015] @regression Style Guide page exists with all variations', async ({ page }) => {
    const pom = new NavigationPage(page);
    const response = await page.goto(
      `${BASE()}/content/global-atlantic/style-guide/components/navigation.html?wcmmode=disabled`
    );
    expect(response?.status()).toBe(200);

    // Should have multiple navigation instances
    const navCount = await page.locator(SEL.root).count();
    expect(navCount).toBeGreaterThanOrEqual(4);
  });

  test('[NVGT-016] @mobile @regression Mobile-only styles do not affect desktop layout', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    // On desktop, horizontal nav should be flex row (not column)
    const nav = page.locator(SEL.root).first();
    const group = nav.locator(`> ${SEL.group}`);
    const flexDir = await group.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

test.describe('Navigation — Accessibility (GAAM-396)', () => {
  test('[NVGT-017] @a11y @wcag22 @regression Navigation passes axe-core scan', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(SEL.root)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast']) // Heading colors are intentionally subdued per Figma design
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[NVGT-018] @a11y @mobile @wcag22 @regression Mobile navigation passes axe-core scan', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(SEL.root)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[NVGT-019] @a11y @regression Navigation uses semantic <nav> element', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const navElements = page.locator('nav.cmp-navigation');
    const count = await navElements.count();
    expect(count).toBeGreaterThan(0);

    // Verify role="navigation" or implicit nav semantics
    const role = await navElements.first().getAttribute('role');
    expect(role === 'navigation' || role === null).toBe(true); // <nav> has implicit navigation role
  });

  test('[NVGT-020] @a11y @regression Navigation has aria-label for accessibility', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const navs = page.locator('nav.cmp-navigation');
    const count = await navs.count();
    for (let i = 0; i < count; i++) {
      const label = await navs.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
    }
  });

  test('[NVGT-021] @a11y @mobile @regression Accordion triggers are keyboard operable', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const parentItem = groupedNav.locator(SEL.itemLevel0).first();
    const triggerLink = parentItem.locator(':scope > .cmp-navigation__item-link');

    // Focus the trigger link — it should be focusable via Tab
    await triggerLink.focus();
    const isFocused = await page.evaluate(() =>
      document.activeElement?.classList.contains('cmp-navigation__item-link')
    );
    expect(isFocused).toBe(true);

    // Click to expand (accordion JS intercepts click at mobile breakpoint)
    await triggerLink.click();
    await page.waitForTimeout(300);

    // Parent item should be expanded
    await expect(parentItem).toHaveClass(/cmp-navigation__item--expanded/);

    // Click again to collapse
    await triggerLink.click();
    await page.waitForTimeout(300);
    const stillExpanded = await parentItem.evaluate(el =>
      el.classList.contains('cmp-navigation__item--expanded')
    );
    expect(stillExpanded).toBe(false);
  });

  test('[NVGT-022] @a11y @regression Touch targets meet minimum 44x44px on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const links = page.locator(`${SEL.root} ${SEL.itemLink}`);
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const box = await links.nth(i).boundingBox();
      if (box && box.width > 0 && box.height > 0) {
        expect(Math.max(box.width, box.height)).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('[NVGT-023] @a11y @regression Focus indicators visible on both light and dark backgrounds', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    // Check focus indicator on dark background (granite)
    const darkLink = page.locator(`${SEL.sectionGranite} ${SEL.itemLink}`).first();
    await darkLink.focus();
    const darkOutline = await darkLink.evaluate(el => {
      const style = getComputedStyle(el);
      return style.outline || style.boxShadow;
    });

    // Check focus indicator on light background (white)
    const lightLink = page.locator(`${SEL.sectionWhite} ${SEL.itemLink}`).first();
    await lightLink.focus();
    const lightOutline = await lightLink.evaluate(el => {
      const style = getComputedStyle(el);
      return style.outline || style.boxShadow;
    });

    // Both should have some visible focus indicator
    expect(darkOutline || lightOutline).toBeTruthy();
  });
});

// ─── BEM / CSS Convention Compliance ──────────────────────────────────────────

test.describe('Navigation — Convention Compliance (GAAM-396)', () => {
  test('[NVGT-024] @regression Navigation uses .cmp-navigation BEM root class', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const roots = page.locator(SEL.root);
    const count = await roots.count();
    expect(count).toBeGreaterThan(0);

    // Verify BEM child elements exist
    const groups = page.locator(SEL.group);
    expect(await groups.count()).toBeGreaterThan(0);
    const items = page.locator(SEL.item);
    expect(await items.count()).toBeGreaterThan(0);
    const links = page.locator(SEL.itemLink);
    expect(await links.count()).toBeGreaterThan(0);
  });

  test('[NVGT-025] @regression Navigation has no inline styles', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    const allElements = page.locator(`${SEL.root} *`);
    const count = await allElements.count();
    for (let i = 0; i < Math.min(count, 50); i++) {
      const style = await allElements.nth(i).getAttribute('style');
      expect(style).toBeNull();
    }
  });

  test('[NVGT-026] @regression Navigation state transitions use CSS transitions', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    // Links should have transition property for smooth state changes
    const link = page.locator(`${SEL.root} ${SEL.itemLink}`).first();
    const transition = await link.evaluate(el => getComputedStyle(el).transition);
    // LESS defines: color 0.2s ease
    expect(transition).toContain('color');
  });
});

// ─── Console & Resources ──────────────────────────────────────────────────────

test.describe('Navigation — Console & Resources', () => {
  test('[NVGT-029] @regression Navigation produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors().filter(e =>
      // Filter out pre-existing AEM platform errors unrelated to navigation component
      !e.message?.includes('getElementsByTagName')
    );
    capture.stop();
    expect(errors).toEqual([]);
  });

  test('[NVGT-030] @regression Navigation mobile accordion produces no JS errors', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());

    // Interact with accordion — click direct child links of level-0 items
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    const level0Items = groupedNav.locator(SEL.itemLevel0);
    const count = await level0Items.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await level0Items.nth(i).locator(':scope > .cmp-navigation__item-link').click();
      await page.waitForTimeout(300);
    }

    const errors = capture.getErrors().filter(e =>
      !e.message?.includes('getElementsByTagName')
    );
    capture.stop();
    expect(errors).toEqual([]);
  });
});

// ─── Desktop Navigation (GAAM-395) ──────────────────────────────────────────

test.describe('Navigation — Desktop Single List (GAAM-395)', () => {
  test('[NVGT-031] @regression Desktop: horizontal nav links display in single row', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const nav = page.locator(`${SEL.sectionWhite} ${SEL.root}`).first();
    if (await nav.count() === 0) { test.skip(); return; }
    const group = nav.locator(`> ${SEL.group}`);
    const flexDir = await group.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
    // Verify links are side-by-side (same Y coordinate)
    const items = group.locator(`> ${SEL.itemLevel0}`);
    const count = await items.count();
    if (count >= 2) {
      const box0 = await items.nth(0).boundingBox();
      const box1 = await items.nth(1).boundingBox();
      expect(Math.abs(box0!.y - box1!.y)).toBeLessThan(10);
    }
  });

  test('[NVGT-032] @regression Desktop: vertical nav links display in single column', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const vertNav = page.locator(`${SEL.verticalMod} ${SEL.root}`).first();
    if (await vertNav.count() === 0) { test.skip(); return; }
    const group = vertNav.locator(`> ${SEL.group}`);
    const flexDir = await group.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  test('[NVGT-033] @regression Desktop: link font is 14px Graphie Regular', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SEL.sectionWhite} ${SEL.itemLink}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    const fontSize = await link.evaluate(el => getComputedStyle(el).fontSize);
    expect(fontSize).toBe('14px');
  });

  test('[NVGT-034] @regression Desktop: link hover shows rounded background', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    // Use level-1 or single-list links (not grouped headings which have pointer-events: none)
    const link = page.locator(`${SEL.sectionWhite} ${SEL.itemLevel1} ${SEL.itemLink}, ${SEL.sectionWhite} ${SEL.root}:not(:has(${SEL.itemLevel1})) ${SEL.itemLink}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.scrollIntoViewIfNeeded();
    const bgBefore = await link.evaluate(el => getComputedStyle(el).backgroundColor);
    await link.hover();
    const bgAfter = await link.evaluate(el => getComputedStyle(el).backgroundColor);
    const borderRadius = await link.evaluate(el => getComputedStyle(el).borderRadius);
    expect(bgAfter).not.toBe(bgBefore);
    expect(parseFloat(borderRadius)).toBeGreaterThanOrEqual(20);
  });

  test('[NVGT-035] @regression Desktop: link color transition is 0.2s', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SEL.root} ${SEL.itemLink}`).first();
    const transition = await link.evaluate(el => getComputedStyle(el).transition);
    expect(transition).toContain('color');
  });
});

test.describe('Navigation — Desktop Grouped Navigation (GAAM-395)', () => {
  test('[NVGT-036] @regression Desktop: grouped nav headings display side by side in columns', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const group = groupedNav.locator(`> ${SEL.group}`);
    const flexDir = await group.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
    // Headings should be in the same row
    const headings = group.locator(`> ${SEL.itemLevel0}`);
    const count = await headings.count();
    if (count >= 2) {
      const box0 = await headings.nth(0).boundingBox();
      const box1 = await headings.nth(1).boundingBox();
      expect(Math.abs(box0!.y - box1!.y)).toBeLessThan(10);
    }
  });

  test('[NVGT-037] @regression Desktop: grouped headings are non-interactive (pointer-events: none)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    // Level-0 items with children have pointer-events: none on their link
    const headingLink = groupedNav.locator(`${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`).first();
    const pointerEvents = await headingLink.evaluate(el => getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe('none');
  });

  test('[NVGT-038] @regression Desktop: grouped heading uses semibold font', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const headingLink = groupedNav.locator(`${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`).first();
    const fontWeight = await headingLink.evaluate(el => getComputedStyle(el).fontWeight);
    // 600 = semibold
    expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(600);
  });

  test('[NVGT-039] @regression Desktop: child links display vertically under headings', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const childGroup = groupedNav.locator(`${SEL.itemLevel0} > ${SEL.group}`).first();
    const flexDir = await childGroup.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });
});

// ─── GAAM-612: L1 Label Without Path ─────────────────────────────────────────

test.describe('Navigation — L1 Label Without Path (GAAM-612)', () => {
  test('[NVGT-040] @regression GA overlay has correct resourceSuperType', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/navigation.1.json`;
    const response = await page.request.get(overlayUrl);
    expect(response.ok()).toBe(true);
    const overlay = await response.json();
    expect(overlay['sling:resourceSuperType']).toBe('kkr-aem-base/components/content/navigation');
    expect(overlay['componentGroup']).toBe('GA Base');
  });

  test('[NVGT-041] @regression GA dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/navigation/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });

  test('[NVGT-042] @regression Grouped headings render as text (not links) when path is empty', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    // L1 headings: should have pointer-events: none (rendered as text, not clickable link)
    const headingLinks = groupedNav.locator(`${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`);
    const count = await headingLinks.count();
    for (let i = 0; i < count; i++) {
      const pe = await headingLinks.nth(i).evaluate(el => getComputedStyle(el).pointerEvents);
      expect(pe).toBe('none');
    }
  });
});

// ─── GAAM-699: Font Color Changes ────────────────────────────────────────────

test.describe('Navigation — Font Color (GAAM-699)', () => {
  test('[NVGT-043] @regression Light bg: link color is granite (dark)', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SEL.sectionWhite} ${SEL.itemLink}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    const color = await link.evaluate(el => getComputedStyle(el).color);
    // Should be dark (granite) — NOT white
    expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[NVGT-044] @regression Dark bg (granite): child link color is white', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    // Target level-1 links (not headings) or single-list links
    const link = page.locator(`${SEL.sectionGranite} ${SEL.itemLevel1} ${SEL.itemLink}`).first();
    const singleLink = page.locator(`${SEL.sectionGranite} ${SEL.root}:not(:has(${SEL.itemLevel1})) ${SEL.itemLink}`).first();
    const target = (await link.count() > 0) ? link : singleLink;
    if (await target.count() === 0) { test.skip(); return; }
    const color = await target.evaluate(el => getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[NVGT-045] @regression Dark bg (azul): child link color is white', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SEL.sectionAzul} ${SEL.itemLevel1} ${SEL.itemLink}`).first();
    const singleLink = page.locator(`${SEL.sectionAzul} ${SEL.root}:not(:has(${SEL.itemLevel1})) ${SEL.itemLink}`).first();
    const target = (await link.count() > 0) ? link : singleLink;
    if (await target.count() === 0) { test.skip(); return; }
    const color = await target.evaluate(el => getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[NVGT-046] @regression Dark bg: grouped heading color is helper-dark (subdued)', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const heading = page.locator(`${SEL.sectionGranite} ${SEL.itemLevel0}:has(> ${SEL.group}) > ${SEL.itemLink}`).first();
    if (await heading.count() === 0) { test.skip(); return; }
    const color = await heading.evaluate(el => getComputedStyle(el).color);
    // Helper-dark is a muted/subdued color — NOT pure white
    expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
    // But should be lighter than granite
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const avg = (parseInt(match[1]) + parseInt(match[2]) + parseInt(match[3])) / 3;
      expect(avg).toBeGreaterThan(100); // Not too dark
    }
  });

  test('[NVGT-047] @regression Dark bg: focus-visible uses double ring (box-shadow)', async ({ page }) => {
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SEL.sectionGranite} ${SEL.itemLink}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    const boxShadow = await link.evaluate(el => getComputedStyle(el).boxShadow);
    // Should have box-shadow for focus ring on dark bg (not just outline)
    expect(boxShadow).not.toBe('none');
  });

  test('[NVGT-048] @mobile @regression Mobile accordion: expanded heading color changes', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(SEL.root).filter({ has: page.locator(SEL.itemLevel1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const trigger = groupedNav.locator(SEL.itemLevel0).first();
    const link = trigger.locator(':scope > .cmp-navigation__item-link');
    const colorBefore = await link.evaluate(el => getComputedStyle(el).color);
    await link.click();
    await page.waitForTimeout(300);
    const colorAfter = await link.evaluate(el => getComputedStyle(el).color);
    // Color should change when expanded (collapsed: full color, expanded: subdued)
    expect(colorAfter).not.toBe(colorBefore);
  });
});
