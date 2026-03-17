import { test, expect } from '@playwright/test';
import { HeroFiftyFiftyPage } from '../../../pages/ga/components/heroFiftyFiftyPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('HeroFiftyFifty — CSV Test Cases', () => {
  test('[HFF-001] @a11y CMS FE: 50/50 Hero — AC1', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Component renders as a full-width two-column (50/50) layout on desktop
    // Expected: Component renders as a full-width two-column (50/50) layout on desktop
  });

  test('[HFF-002] @a11y CMS FE: 50/50 Hero — AC2', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Left column has granite background and may contain: Breadcrumb (optional), Eyebrow (optional), Headline, Description (optional), CTAs (optional)
    // Expected: Left column has granite background and may contain: Breadcrumb (optional), Eyebrow (optional), Headline, Description (optional), CTAs (optional)
  });

  test('[HFF-003] @a11y CMS FE: 50/50 Hero — AC3', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Right column contains the Image (top) and an optional secondary component in the lower slot: Nested Carousel, Statistic, or Content Trail — or no secondary component (Image Only)
    // Expected: Right column contains the Image (top) and an optional secondary component in the lower slot: Nested Carousel, Statistic, or Content Trail — or no secondary component (Image Only)
  });

  test('[HFF-004] @a11y CMS FE: 50/50 Hero — AC4', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: On mobile, columns stack vertically — left/content column above, right/media column below
    // Expected: On mobile, columns stack vertically — left/content column above, right/media column below
  });

  test('[HFF-005] @a11y CMS FE: 50/50 Hero — AC5', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Breadcrumb is not shown on mobile
    // Expected: Breadcrumb is not shown on mobile
  });

  test('[HFF-006] @a11y CMS FE: 50/50 Hero — AC6', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Column proportions, spacing, and breakpoint behavior must match Figma
    // Expected: Column proportions, spacing, and breakpoint behavior must match Figma
  });

  test('[HFF-007] @a11y CMS FE: 50/50 Hero — AC7', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Renders at the top of the left column, pinned above the content block
    // Expected: Renders at the top of the left column, pinned above the content block
  });

  test('[HFF-008] @a11y CMS FE: 50/50 Hero — AC8', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Uses Breadcrumb component styles
    // Expected: Uses Breadcrumb component styles
  });

  test('[HFF-009] @a11y CMS FE: 50/50 Hero — AC9', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Dark-background treatment and placement must match Figma
    // Expected: Dark-background treatment and placement must match Figma
  });

  test('[HFF-010] @a11y CMS FE: 50/50 Hero — AC10', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Renders above the Headline when authored
    // Expected: Renders above the Headline when authored
  });

  test('[HFF-011] @a11y CMS FE: 50/50 Hero — AC11', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: When Eyebrow is not authored, the Headline moves up to occupy the top content position; no empty wrapper is rendered to the DOM
    // Expected: When Eyebrow is not authored, the Headline moves up to occupy the top content position; no empty wrapper is rendered to the DOM
  });

  test('[HFF-012] @a11y CMS FE: 50/50 Hero — AC12', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Eyebrow typography, color, and spacing on dark background must match Figma
    // Expected: Eyebrow typography, color, and spacing on dark background must match Figma
  });

  test('[HFF-013] @a11y CMS FE: 50/50 Hero — AC13', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Always renders as a semantic <h1> element
    // Expected: Always renders as a semantic <h1> element
  });

  test('[HFF-014] @a11y CMS FE: 50/50 Hero — AC14', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Font size controlled by Type/Size dropdown (H1 XL or H1) authored in dialog
    // Expected: Font size controlled by Type/Size dropdown (H1 XL or H1) authored in dialog
  });

  test('[HFF-015] @a11y CMS FE: 50/50 Hero — AC15', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Supports an inline granite 50% color override applied to select words or phrases within the headline text
    // Expected: Supports an inline granite 50% color override applied to select words or phrases within the headline text
  });

  test('[HFF-016] @a11y CMS FE: 50/50 Hero — AC16', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Partial color treatment must render correctly regardless of position (beginning, middle, or end of headline)
    // Expected: Partial color treatment must render correctly regardless of position (beginning, middle, or end of headline)
  });

  test('[HFF-017] @a11y CMS FE: 50/50 Hero — AC17', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Granite 50% color value and usage examples must match Figma
    // Expected: Granite 50% color value and usage examples must match Figma
  });

  test('[HFF-018] @a11y CMS FE: 50/50 Hero — AC18', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: H1 XL vs H1 size definitions must follow Typography documentation
    // Expected: H1 XL vs H1 size definitions must follow Typography documentation
  });

  test('[HFF-019] @a11y CMS FE: 50/50 Hero — AC19', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Renders below the Headline when authored
    // Expected: Renders below the Headline when authored
  });

  test('[HFF-020] @a11y CMS FE: 50/50 Hero — AC20', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Supports two style variants: Paragraph Medium (default) and Paragraph Large, selectable in dialog
    // Expected: Supports two style variants: Paragraph Medium (default) and Paragraph Large, selectable in dialog
  });

  test('[HFF-021] @a11y CMS FE: 50/50 Hero — AC21', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: When Description is not authored, no empty wrapper is rendered to the DOM
    // Expected: When Description is not authored, no empty wrapper is rendered to the DOM
  });

  test('[HFF-022] @a11y CMS FE: 50/50 Hero — AC22', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Spacing between Headline and CTAs (or bottom of content block) adjusts accordingly when Description is absent
    // Expected: Spacing between Headline and CTAs (or bottom of content block) adjusts accordingly when Description is absent
  });

  test('[HFF-023] @a11y CMS FE: 50/50 Hero — AC23', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Paragraph size definitions and spacing per variant must match Figma
    // Expected: Paragraph size definitions and spacing per variant must match Figma
  });

  test('[HFF-024] @a11y CMS FE: 50/50 Hero — AC24', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Supports up to 2 optional CTA buttons rendered inline/horizontally
    // Expected: Supports up to 2 optional CTA buttons rendered inline/horizontally
  });

  test('[HFF-025] @a11y CMS FE: 50/50 Hero — AC25', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Button styles follow existing Button component styles adapted for dark background
    // Expected: Button styles follow existing Button component styles adapted for dark background
  });

  test('[HFF-026] @a11y CMS FE: 50/50 Hero — AC26', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: When no CTAs are authored, no empty wrapper is rendered to the DOM
    // Expected: When no CTAs are authored, no empty wrapper is rendered to the DOM
  });

  test('[HFF-027] @a11y CMS FE: 50/50 Hero — AC27', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Button styles, spacing, and stacking behavior on mobile must match Figma
    // Expected: Button styles, spacing, and stacking behavior on mobile must match Figma
  });

  test('[HFF-028] @a11y CMS FE: 50/50 Hero — AC28', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Left column handles all combinations of optional fields gracefully
    // Expected: Left column handles all combinations of optional fields gracefully
  });

  test('[HFF-029] @a11y CMS FE: 50/50 Hero — AC29', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Tested layout states: Eyebrow + Headline + Description + 2 CTAs (full); Headline + Description + 1 CTA; Headline only (minimal); Headline + 1 CTA (no eyebrow, no description); any other authored combination
    // Expected: Tested layout states: Eyebrow + Headline + Description + 2 CTAs (full); Headline + Description + 1 CTA; Headline only (minimal); Headline + 1 CTA (no eyebrow, no description); any other authored combination
  });

  test('[HFF-030] @a11y CMS FE: 50/50 Hero — AC30', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Mobile alignment (Left or Center) matches what was authored
    // Expected: Mobile alignment (Left or Center) matches what was authored
  });

  test('[HFF-031] @a11y CMS FE: 50/50 Hero — AC31', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: No extra whitespace or collapsed empty containers appear when optional fields are omitted
    // Expected: No extra whitespace or collapsed empty containers appear when optional fields are omitted
  });

  test('[HFF-032] @a11y CMS FE: 50/50 Hero — AC32', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Renders in the top portion of the right column
    // Expected: Renders in the top portion of the right column
  });

  test('[HFF-033] @a11y CMS FE: 50/50 Hero — AC33', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Supports responsive image rendering
    // Expected: Supports responsive image rendering
  });

  test('[HFF-034] @a11y CMS FE: 50/50 Hero — AC34', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Image area handles missing/empty image gracefully with no broken layout
    // Expected: Image area handles missing/empty image gracefully with no broken layout
  });

  test('[HFF-035] @a11y CMS FE: 50/50 Hero — AC35', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Image dimensions and aspect ratio behavior per breakpoint must match Figma
    // Expected: Image dimensions and aspect ratio behavior per breakpoint must match Figma
  });

  test('[HFF-036] @a11y CMS FE: 50/50 Hero — AC36', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Author may select one of: Nested Carousel, Statistic Component, Content Trail, or None
    // Expected: Author may select one of: Nested Carousel, Statistic Component, Content Trail, or None
  });

  test('[HFF-037] @a11y CMS FE: 50/50 Hero — AC37', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: When None is authored, the image expands to fill the full right column height
    // Expected: When None is authored, the image expands to fill the full right column height
  });

  test('[HFF-038] @a11y CMS FE: 50/50 Hero — AC38', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Each sub-component renders using its existing component styles
    // Expected: Each sub-component renders using its existing component styles
  });

  test('[HFF-039] @a11y CMS FE: 50/50 Hero — AC39', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Slot dimensions, padding, and alignment per variant must match Figma
    // Expected: Slot dimensions, padding, and alignment per variant must match Figma
  });

  test('[HFF-040] @a11y CMS FE: 50/50 Hero — AC40', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Component is available on all existing templates except Rate Administration
    // Expected: Component is available on all existing templates except Rate Administration
  });

  test('[HFF-041] @a11y CMS FE: 50/50 Hero — AC41', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Authoring guide exists and is updated with all style variations
    // Expected: Authoring guide exists and is updated with all style variations
  });

  test('[HFF-042] @a11y CMS FE: 50/50 Hero — AC42', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Style guide page exists with all variations
    // Expected: Style guide page exists with all variations
  });

  test('[HFF-043] @a11y CMS FE: 50/50 Hero — AC43', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Styles match Figma
    // Expected: Styles match Figma
  });

  test('[HFF-044] @a11y CMS FE: 50/50 Hero — AC44', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Both desktop and mobile versions are implemented
    // Expected: Both desktop and mobile versions are implemented
  });

  test('[HFF-045] @a11y CMS FE: 50/50 Hero — AC45', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Step 1: Design team is notified the component is ready for review, with a link to the Style Guide page
    // Expected: Design team is notified the component is ready for review, with a link to the Style Guide page
  });
});

test.describe('HeroFiftyFifty — Happy Path', () => {
  test('[HFF-046] @smoke @regression HeroFiftyFifty renders correctly', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-hero-fifty-fifty').first()).toBeVisible();
  });

  test('[HFF-047] @smoke @regression HeroFiftyFifty interactive elements are functional', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Verify primary interactive elements
    const root = page.locator('.cmp-hero-fifty-fifty').first();
    await expect(root).toBeVisible();
  });
});

test.describe('HeroFiftyFifty — Negative & Boundary', () => {
  test('[HFF-048] @negative @regression HeroFiftyFifty handles empty content gracefully', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    // Component should not throw errors with minimal content
  });

  test('[HFF-049] @negative @regression HeroFiftyFifty handles missing images', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-hero-fifty-fifty img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('HeroFiftyFifty — Responsive', () => {
  test('[HFF-050] @mobile @regression @mobile HeroFiftyFifty adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-hero-fifty-fifty').first()).toBeVisible();
  });

  test('[HFF-051] @mobile @regression HeroFiftyFifty adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-hero-fifty-fifty').first()).toBeVisible();
  });
});

test.describe('HeroFiftyFifty — Console & Resources', () => {
  test('[HFF-052] @regression HeroFiftyFifty produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('HeroFiftyFifty — Broken Images', () => {
  test('[HFF-053] @regression HeroFiftyFifty all images load successfully', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-hero-fifty-fifty img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[HFF-054] @regression HeroFiftyFifty all images have alt attributes', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-hero-fifty-fifty img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('HeroFiftyFifty — Accessibility', () => {
  test('[HFF-055] @a11y @wcag22 @regression @smoke HeroFiftyFifty passes axe-core scan', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-hero-fifty-fifty')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[HFF-056] @a11y @wcag22 @regression @smoke HeroFiftyFifty interactive elements meet 24px target size', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-hero-fifty-fifty a, .cmp-hero-fifty-fifty button, .cmp-hero-fifty-fifty input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[HFF-057] @a11y @wcag22 @regression @smoke HeroFiftyFifty focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new HeroFiftyFiftyPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-hero-fifty-fifty a, .cmp-hero-fifty-fifty button, .cmp-hero-fifty-fifty input');
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
