/**
 * Cross-component AEM configuration validation.
 *
 * Tests two classes of bugs that escaped per-component test suites:
 *   1. Missing helpPath on GA dialog overlays (Bug 2 from GAAM-381)
 *   2. Restrictive parsys policies blocking child components (Bug 1 from GAAM-381)
 *
 * These tests run against the AEM Sling API and live rendered pages,
 * catching configuration regressions before they reach authors.
 */
import { test, expect } from '@playwright/test';
import ENV from '../../utils/infra/env';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── GA Overlay Components ────────────────────────────────────────────────────
// Every GA component with a sling:resourceSuperType should have its own
// _cq_dialog overlay with helpPath set. If the dialog doesn't exist at the GA
// path, the component falls back to the base dialog which may lack helpPath.

interface GAComponent {
  /** Display name */
  name: string;
  /** Sling path to the GA _cq_dialog */
  dialogPath: string;
  /** Whether this is a container component with an inner parsys */
  isContainer?: boolean;
  /** Fixture URL for parsys tests (only for containers) */
  fixtureUrl?: string;
  /** Child component CSS selectors expected inside container parsys */
  expectedChildren?: string[];
}

const GA_COMPONENTS: GAComponent[] = [
  {
    name: 'accordion',
    dialogPath: '/apps/ga/components/content/accordion/_cq_dialog',
    isContainer: true,
    fixtureUrl: '/content/global-atlantic/test-fixtures/accordion.html?wcmmode=disabled',
    expectedChildren: ['.cmp-button', '.cmp-separator', '.cmp-spacer'],
  },
  {
    name: 'accordion-item',
    dialogPath: '/apps/ga/components/content/accordion/accordion-item/_cq_dialog',
  },
  {
    name: 'accordion-tabs-feature',
    dialogPath: '/apps/ga/components/content/accordion-tabs-feature/_cq_dialog',
  },
  {
    name: 'button',
    dialogPath: '/apps/ga/components/content/button/_cq_dialog',
  },
  {
    name: 'feature-banner',
    dialogPath: '/apps/ga/components/content/feature-banner/_cq_dialog',
  },
  {
    name: 'form-options',
    dialogPath: '/apps/ga/components/content/form-options/_cq_dialog',
  },
  {
    name: 'headline-block',
    dialogPath: '/apps/ga/components/content/headline-block/_cq_dialog',
  },
  {
    name: 'hero-fifty-fifty',
    dialogPath: '/apps/ga/components/content/hero-fifty-fifty/_cq_dialog',
  },
  {
    name: 'homepage-hero',
    dialogPath: '/apps/ga/components/content/homepage-hero/_cq_dialog',
  },
  {
    name: 'image-with-nested-content',
    dialogPath: '/apps/ga/components/content/image-with-nested-content/_cq_dialog',
  },
  {
    name: 'navigation',
    dialogPath: '/apps/ga/components/content/navigation/_cq_dialog',
  },
  {
    name: 'rate-sheet-grid',
    dialogPath: '/apps/ga/components/content/rate-sheet-grid/_cq_dialog',
  },
  {
    name: 'section',
    dialogPath: '/apps/ga/components/content/section/_cq_dialog',
  },
  {
    name: 'separator',
    dialogPath: '/apps/ga/components/content/separator/_cq_dialog',
  },
  {
    name: 'spacer',
    dialogPath: '/apps/ga/components/content/spacer/_cq_dialog',
  },
  {
    name: 'statistic',
    dialogPath: '/apps/ga/components/content/statistic/_cq_dialog',
  },
  {
    name: 'text',
    dialogPath: '/apps/ga/components/content/text/_cq_dialog',
  },
];

// ─── Dialog helpPath Tests ────────────────────────────────────────────────────

test.describe('AEM Dialog Validation — helpPath', () => {
  for (const comp of GA_COMPONENTS) {
    test(`@author @regression ${comp.name} dialog exists as GA overlay`, async ({ page }) => {
      const url = `${BASE()}${comp.dialogPath}.1.json`;
      const response = await page.request.get(url);
      expect(
        response.ok(),
        `${comp.name}: No _cq_dialog found at GA overlay path. Component may inherit base dialog without helpPath. Create: ui.apps.ga/.../ga/components/content/${comp.name}/_cq_dialog/.content.xml`
      ).toBe(true);
    });

    test(`@author @regression @smoke ${comp.name} dialog has helpPath`, async ({ page }) => {
      const url = `${BASE()}${comp.dialogPath}.1.json`;
      const response = await page.request.get(url);
      if (!response.ok()) {
        // Dialog overlay doesn't exist — skip helpPath check but the previous test flags it
        test.skip();
        return;
      }
      const dialog = await response.json();
      expect(
        dialog.helpPath,
        `${comp.name}: Dialog exists but helpPath is missing. Authors will see no help link in the component toolbar.`
      ).toBeTruthy();
    });

    test(`@author @regression ${comp.name} helpPath points to correct component`, async ({ page }) => {
      const url = `${BASE()}${comp.dialogPath}.1.json`;
      const response = await page.request.get(url);
      if (!response.ok()) { test.skip(); return; }
      const dialog = await response.json();
      if (!dialog.helpPath) { test.skip(); return; }
      // helpPath should point to the AEM component details overlay
      expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
      // And should reference a GA component path
      expect(dialog.helpPath).toContain('/apps/ga/components/content/');
    });
  }
});

// ─── Container Parsys Policy Tests ────────────────────────────────────────────
// Container components that accept child components need their parsys policy
// to list all expected content component types. If only the container's own
// sub-type is listed (e.g., accordion_default only allowing accordion-item),
// authors can't add text, buttons, images, etc. inside the container.

const CONTAINERS = GA_COMPONENTS.filter(c => c.isContainer);

test.describe('AEM Parsys Policy — Container Child Components', () => {
  for (const comp of CONTAINERS) {
    if (!comp.fixtureUrl || !comp.expectedChildren) continue;

    test(`@author @regression @smoke ${comp.name} parsys renders diverse child component types`, async ({ page }) => {
      await page.goto(`${BASE()}${comp.fixtureUrl}`);
      await page.waitForLoadState('networkidle');

      for (const childSel of comp.expectedChildren!) {
        const childName = childSel.replace(/^\./, '');
        const count = await page.locator(childSel).count();
        expect(
          count,
          `${comp.name}: ${childName} not found on fixture page — parsys policy may block this component type`
        ).toBeGreaterThanOrEqual(1);
      }
    });
  }
});
