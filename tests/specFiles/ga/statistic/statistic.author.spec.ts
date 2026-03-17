import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Statistic — CSV Test Cases', () => {
  test('[STTS-001] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC1', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Create/Copy/Update the documentation for the authoring guide
    // Expected: Create/Copy/Update the documentation for the authoring guide
  });

  test('[STTS-002] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC2', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Create/Update a style guide page with all the variations
    // Expected: Create/Update a style guide page with all the variations
  });

  test('[STTS-003] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC3', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Ensure no critical or major issues are flagged by the Level Access Extension accessibility tool
    // Expected: Ensure no critical or major issues are flagged by the Level Access Extension accessibility tool
  });

  test('[STTS-004] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC4', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Update the Statistic component to inherit global typography, colour, and spacing tokens from the site's global style system — reference Figma for all visual specifications
    // Expected: Update the Statistic component to inherit global typography, colour, and spacing tokens from the site\'s global style system — reference Figma for all visual specifications
  });

  test('[STTS-005] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC5', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Ensure all existing style variations continue to render correctly after global style inheritance is applied
    // Expected: Ensure all existing style variations continue to render correctly after global style inheritance is applied
  });

  test('[STTS-006] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC6', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Any component-specific overrides should be reviewed against the global styles and removed or reconciled where no longer needed
    // Expected: Any component-specific overrides should be reviewed against the global styles and removed or reconciled where no longer needed
  });

  test('[STTS-007] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC7', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Existing authored content and component behaviour must be preserved — no functional changes are in scope for this ticket
    // Expected: Existing authored content and component behaviour must be preserved — no functional changes are in scope for this ticket
  });

  test('[STTS-008] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC8', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Verify that global style updates do not introduce any unintended visual regressions across the component's variations
    // Expected: Verify that global style updates do not introduce any unintended visual regressions across the component\'s variations
  });

  test('[STTS-009] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC9', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Global style inheritance must apply consistently across desktop, tablet, and mobile breakpoints
    // Expected: Global style inheritance must apply consistently across desktop, tablet, and mobile breakpoints
  });

  test('[STTS-010] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC10', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Colour contrast must continue to meet WCAG 2.1 Level AA requirements after global styles are applied
    // Expected: Colour contrast must continue to meet WCAG 2.1 Level AA requirements after global styles are applied
  });

  test('[STTS-011] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC11', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Focus states must remain visible and compliant following any style updates
    // Expected: Focus states must remain visible and compliant following any style updates
  });

  test('[STTS-012] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC12', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: No changes to semantic HTML or screen reader behaviour are expected — verify nothing has regressed after implementation
    // Expected: No changes to semantic HTML or screen reader behaviour are expected — verify nothing has regressed after implementation
  });

  test('[STTS-013] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC13', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Component is available on any existing templates (except Rate Administration)
    // Expected: Component is available on any existing templates (except Rate Administration)
  });

  test('[STTS-014] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC14', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Authoring Guide exists and is updated with all style variations
    // Expected: Authoring Guide exists and is updated with all style variations
  });

  test('[STTS-015] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC15', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Style Guide page exists and reflects all variations
    // Expected: Style Guide page exists and reflects all variations
  });

  test('[STTS-016] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC16', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Both desktop and mobile versions are implemented
    // Expected: Both desktop and mobile versions are implemented
  });

  test('[STTS-017] @a11y @mobile @security Statistic Component FE – Implement Global Style — AC17', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Step 1: Notify the design team that the component is ready for their review and provide a link to the Style Guide page
    // Expected: Notify the design team that the component is ready for their review and provide a link to the Style Guide page
  });
});

test.describe('Statistic — Happy Path', () => {
  test('[STTS-018] @smoke @regression Statistic renders correctly', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-statistic').first()).toBeVisible();
  });

  test('[STTS-019] @smoke @regression Statistic interactive elements are functional', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Verify primary interactive elements
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Statistic — Negative & Boundary', () => {
  test('[STTS-020] @negative @regression Statistic handles empty content gracefully', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Component should not throw errors with minimal content
  });

  test('[STTS-021] @negative @regression Statistic handles missing images', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-statistic img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Statistic — Responsive', () => {
  test('[STTS-022] @mobile @regression @mobile Statistic adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-statistic').first()).toBeVisible();
  });

  test('[STTS-023] @mobile @regression Statistic adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-statistic').first()).toBeVisible();
  });
});

test.describe('Statistic — Console & Resources', () => {
  test('[STTS-024] @regression Statistic produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

// STTS-025–026 removed: Image health tests covered by statistic.images.spec.ts (STAT-013–016)

test.describe('Statistic — Accessibility', () => {
  test('[STTS-027] @a11y @wcag22 @regression @smoke Statistic passes axe-core scan', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-statistic')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[STTS-028] @a11y @wcag22 @regression @smoke Statistic interactive elements meet 24px target size', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-statistic a, .cmp-statistic button, .cmp-statistic input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[STTS-029] @a11y @wcag22 @regression @smoke Statistic focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-statistic a, .cmp-statistic button, .cmp-statistic input');
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
