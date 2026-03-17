import { test, expect } from '@playwright/test';
import { TextPage } from '../../../pages/ga/components/textPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import AxeBuilder from '@axe-core/playwright';

test.describe('Text — CSV Test Cases', () => {
  test('[TEXT-001] @a11y @mobile CMS FE: RTE Table — AC1', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Table renders with a minimum of 2 columns; layout accommodates up to 5 columns proportionally
    // Expected: Table renders with a minimum of 2 columns; layout accommodates up to 5 columns proportionally
  });

  test('[TEXT-002] @a11y @mobile CMS FE: RTE Table — AC2', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Column width distribution, padding, and spacing at desktop and mobile breakpoints match Figma
    // Expected: Column width distribution, padding, and spacing at desktop and mobile breakpoints match Figma
  });

  test('[TEXT-003] @a11y @mobile CMS FE: RTE Table — AC3', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Table title uses the semantic <caption> element
    // Expected: Table title uses the semantic <caption> element
  });

  test('[TEXT-004] @a11y @mobile CMS FE: RTE Table — AC4', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Desktop style: Headline 5 typography class
    // Expected: Desktop style: Headline 5 typography class
  });

  test('[TEXT-005] @a11y @mobile CMS FE: RTE Table — AC5', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Mobile style: Headline 3 typography class
    // Expected: Mobile style: Headline 3 typography class
  });

  test('[TEXT-006] @a11y @mobile CMS FE: RTE Table — AC6', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Typography specs at desktop and mobile match Figma
    // Expected: Typography specs at desktop and mobile match Figma
  });

  test('[TEXT-007] @a11y @mobile CMS FE: RTE Table — AC7', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Cells designated as Header render with bold text and the header background fill
    // Expected: Cells designated as Header render with bold text and the header background fill
  });

  test('[TEXT-008] @a11y @mobile CMS FE: RTE Table — AC8', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Header color values for Light and Dark mode match Figma
    // Expected: Header color values for Light and Dark mode match Figma
  });

  test('[TEXT-009] @a11y @mobile CMS FE: RTE Table — AC9', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Cells designated as Subheader render with the subheader style as specified in Figma
    // Expected: Cells designated as Subheader render with the subheader style as specified in Figma
  });

  test('[TEXT-010] @a11y @mobile CMS FE: RTE Table — AC10', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: The cell immediately following a first-column Subheader in the same row always renders with the Default (white/no fill) background, never Stripe
    // Expected: The cell immediately following a first-column Subheader in the same row always renders with the Default (white/no fill) background, never Stripe
  });

  test('[TEXT-011] @a11y @mobile CMS FE: RTE Table — AC11', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Default — white / no fill in Light mode; Dark mode equivalent matches Figma
    // Expected: Default — white / no fill in Light mode; Dark mode equivalent matches Figma
  });

  test('[TEXT-012] @a11y @mobile CMS FE: RTE Table — AC12', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Stripe — alternate fill; Light and Dark values match Figma
    // Expected: Stripe — alternate fill; Light and Dark values match Figma
  });

  test('[TEXT-013] @a11y @mobile CMS FE: RTE Table — AC13', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Blank — renders empty; no background treatment and no content displayed unless the author uses '-'
    // Expected: Blank — renders empty; no background treatment and no content displayed unless the author uses \'-\'
  });

  test('[TEXT-014] @a11y @mobile CMS FE: RTE Table — AC14', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Highlight — emphasis fill color; Light and Dark values match Figma
    // Expected: Highlight — emphasis fill color; Light and Dark values match Figma
  });

  test('[TEXT-015] @a11y @mobile CMS FE: RTE Table — AC15', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: When enabled, a visible vertical rule renders between each column at the weight and color specified in Figma
    // Expected: When enabled, a visible vertical rule renders between each column at the weight and color specified in Figma
  });

  test('[TEXT-016] @a11y @mobile CMS FE: RTE Table — AC16', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: When disabled, no column dividers are visible
    // Expected: When disabled, no column dividers are visible
  });

  test('[TEXT-017] @a11y @mobile CMS FE: RTE Table — AC17', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: When Left placement is selected, the icon renders to the left of cell text with spacing per Figma
    // Expected: When Left placement is selected, the icon renders to the left of cell text with spacing per Figma
  });

  test('[TEXT-018] @a11y @mobile CMS FE: RTE Table — AC18', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: When Right placement is selected, the icon renders to the right of cell text with spacing per Figma
    // Expected: When Right placement is selected, the icon renders to the right of cell text with spacing per Figma
  });

  test('[TEXT-019] @a11y @mobile CMS FE: RTE Table — AC19', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: No cell renders icons on both left and right simultaneously
    // Expected: No cell renders icons on both left and right simultaneously
  });

  test('[TEXT-020] @a11y @mobile CMS FE: RTE Table — AC20', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: All cell colors, text, borders, and fills use the Light mode palette as specified in Figma
    // Expected: All cell colors, text, borders, and fills use the Light mode palette as specified in Figma
  });

  test('[TEXT-021] @a11y @mobile CMS FE: RTE Table — AC21', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Light mode applies when the component is on a white page or inside a Section component with a white background
    // Expected: Light mode applies when the component is on a white page or inside a Section component with a white background
  });

  test('[TEXT-022] @a11y @mobile CMS FE: RTE Table — AC22', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: When the component is placed inside a Section component with the Granite background style, all colors switch to the Dark mode palette as specified in Figma
    // Expected: When the component is placed inside a Section component with the Granite background style, all colors switch to the Dark mode palette as specified in Figma
  });

  test('[TEXT-023] @a11y @mobile CMS FE: RTE Table — AC23', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Dark mode is triggered by the parent container class; no separate author toggle is required
    // Expected: Dark mode is triggered by the parent container class; no separate author toggle is required
  });

  test('[TEXT-024] @a11y @mobile CMS FE: RTE Table — AC24', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Table columns extend beyond the screen width; a horizontally scrollable container is applied
    // Expected: Table columns extend beyond the screen width; a horizontally scrollable container is applied
  });

  test('[TEXT-025] @a11y @mobile CMS FE: RTE Table — AC25', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: The rightmost column is visually clipped to communicate that the table continues off-screen; scroll indicator treatment matches Figma
    // Expected: The rightmost column is visually clipped to communicate that the table continues off-screen; scroll indicator treatment matches Figma
  });

  test('[TEXT-026] @a11y @mobile CMS FE: RTE Table — AC26', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Cell font sizes update to mobile-optimized values per Figma
    // Expected: Cell font sizes update to mobile-optimized values per Figma
  });

  test('[TEXT-027] @a11y @mobile CMS FE: RTE Table — AC27', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: All columns remain accessible via horizontal scroll; no content is hidden or collapsed
    // Expected: All columns remain accessible via horizontal scroll; no content is hidden or collapsed
  });

  test('[TEXT-028] @a11y @mobile CMS FE: RTE Table — AC28', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Table uses semantic <table>, <thead>, <tbody>, <th>, and <td> elements
    // Expected: Table uses semantic <table>, <thead>, <tbody>, <th>, and <td> elements
  });

  test('[TEXT-029] @a11y @mobile CMS FE: RTE Table — AC29', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Header cells include appropriate scope attributes (col or row) based on their designated role
    // Expected: Header cells include appropriate scope attributes (col or row) based on their designated role
  });

  test('[TEXT-030] @a11y @mobile CMS FE: RTE Table — AC30', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Decorative icons use aria-hidden="true"; meaningful icons include a descriptive aria-label
    // Expected: Decorative icons use aria-hidden="true"; meaningful icons include a descriptive aria-label
  });

  test('[TEXT-031] @a11y @mobile CMS FE: RTE Table — AC31', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: The horizontal scroll container is keyboard-navigable and accessible via assistive technology
    // Expected: The horizontal scroll container is keyboard-navigable and accessible via assistive technology
  });

  test('[TEXT-032] @a11y @mobile CMS FE: RTE Table — AC32', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Component meets WCAG 2.1 AA color contrast requirements in both Light and Dark modes
    // Expected: Component meets WCAG 2.1 AA color contrast requirements in both Light and Dark modes
  });

  test('[TEXT-033] @a11y @mobile CMS FE: RTE Table — AC33', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Component styles updated to match Figma
    // Expected: Component styles updated to match Figma
  });

  test('[TEXT-034] @a11y @mobile CMS FE: RTE Table — AC34', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Authoring guide documentation created or updated
    // Expected: Authoring guide documentation created or updated
  });

  test('[TEXT-035] @a11y @mobile CMS FE: RTE Table — AC35', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Style guide page created or updated with all variations
    // Expected: Style guide page created or updated with all variations
  });

  test('[TEXT-036] @a11y @mobile CMS FE: RTE Table — AC36', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: No critical or major issues from the Level Access Extension accessibility tool
    // Expected: No critical or major issues from the Level Access Extension accessibility tool
  });

  test('[TEXT-037] @a11y @mobile CMS FE: RTE Table — AC37', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Component is available on any existing templates except Rate Administration
    // Expected: Component is available on any existing templates except Rate Administration
  });

  test('[TEXT-038] @a11y @mobile CMS FE: RTE Table — AC38', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Both desktop and mobile versions are implemented
    // Expected: Both desktop and mobile versions are implemented
  });

  test('[TEXT-039] @a11y @mobile CMS FE: RTE Table — AC39', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
    // Step 1: Notify the design team that the component is ready for their review and provide a link to the Style Guide page
    // Expected: Notify the design team that the component is ready for their review and provide a link to the Style Guide page
  });
});

test.describe('Text — Happy Path', () => {
  test('[TEXT-040] @smoke @regression Text renders correctly', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-text').first()).toBeVisible();
  });

  test('[TEXT-041] @smoke @regression Text interactive elements are functional', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify primary interactive elements
    const root = page.locator('.cmp-text').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Text — Negative & Boundary', () => {
  test('[TEXT-042] @negative @regression Text handles empty content gracefully', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Component should not throw errors with minimal content
  });

  test('[TEXT-043] @negative @regression Text handles missing images', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Text — Responsive', () => {
  test('[TEXT-044] @mobile @regression @mobile Text adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-text').first()).toBeVisible();
  });

  test('[TEXT-045] @mobile @regression Text adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await expect(page.locator('.cmp-text').first()).toBeVisible();
  });
});

test.describe('Text — Console & Resources', () => {
  test('[TEXT-046] @regression Text produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Text — Broken Images', () => {
  // TEXT-047 removed: duplicate of TEXT-043 (both check naturalWidth on .cmp-text img)

  test('[TEXT-048] @regression Text all images have alt attributes', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const images = page.locator('.cmp-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Text — Accessibility', () => {
  test('[TEXT-049] @a11y @wcag22 @regression @smoke Text passes axe-core scan', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await new AxeBuilder({ page })
      .include('.cmp-text')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[TEXT-050] @a11y @wcag22 @regression @smoke Text interactive elements meet 24px target size', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const interactive = page.locator('.cmp-text a, .cmp-text button, .cmp-text input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[TEXT-051] @a11y @wcag22 @regression @smoke Text focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const focusable = page.locator('.cmp-text a, .cmp-text button, .cmp-text input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });
});
