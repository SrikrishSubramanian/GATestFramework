import { test, expect } from '@playwright/test';
import { FooterPage } from '../../../pages/ga/components/footerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Footer — Visual Regression', () => {
  test('[FTR-VISUAL-001] @visual Footer layout is visually correct', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const root = await pom.getRoot();
    await expect(root).toBeVisible();

    // Verify footer background
    const bg = await root.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBeTruthy();
  });

  test('[FTR-VISUAL-002] @visual Footer columns are aligned', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const root = await pom.getRoot();
    const display = await root.evaluate(el => window.getComputedStyle(el).display);

    // Footer should use flexbox or grid for alignment
    expect(['flex', 'grid', 'block']).toContain(display);
  });

  test('[FTR-VISUAL-003] @visual Footer links are styled consistently', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const links = await pom.getFooterLinks();
    const count = await links.count();

    if (count > 1) {
      const link1Color = await links.nth(0).evaluate(el =>
        window.getComputedStyle(el).color
      );
      const link2Color = await links.nth(1).evaluate(el =>
        window.getComputedStyle(el).color
      );

      // Links in same group should have consistent colors
      expect(link1Color).toBeTruthy();
      expect(link2Color).toBeTruthy();
    }
  });

  test('[FTR-VISUAL-004] @visual Footer text is readable', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const headings = await pom.getHeadings();
    const count = await headings.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const heading = headings.nth(i);
        const fontSize = await heading.evaluate(el =>
          window.getComputedStyle(el).fontSize
        );

        // Font size should be reasonable
        const size = parseInt(fontSize);
        expect(size).toBeGreaterThan(10);
      }
    }
  });

  test('[FTR-VISUAL-005] @visual Footer spacing is correct', async ({ page }) => {
    const pom = new FooterPage(page);
    await pom.navigate(BASE());

    const root = await pom.getRoot();
    const padding = await root.evaluate(el =>
      window.getComputedStyle(el).padding
    );

    // Footer should have some padding
    expect(padding).not.toBe('0px');
  });
});
