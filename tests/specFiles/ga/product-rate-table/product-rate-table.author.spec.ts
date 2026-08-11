import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { ProductRateTablePage } from '../../../pages/ga/components/productRateTablePage';
import { AUTH_STATE_PATH } from '../../../utils/infra/persistent-context';

/**
 * Dynamic Rates — Product Rate Table (ga/components/dynamic-rate/product-rate-table)
 *
 * Distinct from the generic style-guide "rate-table" component — this is the live,
 * client-side-rendered rate table used on real product pages, covering the Dynamic
 * Rates feature area (Jira epics GAAM-1197, GAAM-633, GAAM-632, GAAM-631, GAAM-590,
 * GAAM-514, GAAM-143). All product/page paths, DOM structure, and behavior below were
 * verified live against author-p101514-e1845752.adobeaemcloud.com on 2026-08-10 —
 * see kkr-sites-dev-2 environment.
 */

let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
  capture = new ConsoleCapture(page);
  capture.start();
});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

// One representative distribution-channel page per product, chosen from the live content
// tree. filterEnabled reflects the component's actual authored `enableFilter` behavior.
// hasSuperscripts reflects whether the product's Superscript tab has any fields authored —
// SecureFore/SecureFore II have none, which is the exact live regression case for GAAM-988
// ("table is deleted when none of the fields are authored under Superscript tab").
const PRODUCTS = [
  { id: 'PRT-001', productPath: 'foreincome-ii-fixed-index-annuity0', childPath: 'foreincome-ii-all', productName: 'ForeIncome II', tableVariation: 'foreincome-2-fixed-index-annuity', filterEnabled: true, hasSuperscripts: true },
  { id: 'PRT-002', productPath: 'foreaccumulation-ii-fixed-index-annuity', childPath: 'foraccumulation-ii-all', productName: 'ForeAccumulation II', tableVariation: 'foreaccumulation-2-fixed-index-annuity', filterEnabled: false, hasSuperscripts: true },
  { id: 'PRT-003', productPath: 'forecare-fixed-annuity', childPath: 'forecare-all', productName: 'ForeCare', tableVariation: 'forecare-fixed-annuity', filterEnabled: false, hasSuperscripts: true },
  { id: 'PRT-004', productPath: 'securefore-ii-fixed-annuity', childPath: 'securefore-ii-norop', productName: 'SecureFore II', tableVariation: 'securefore-fixed-annuity', filterEnabled: false, hasSuperscripts: false },
  { id: 'PRT-005', productPath: 'securefore-fixed-annuity', childPath: 'securefore---generic---norop', productName: 'SecureFore', tableVariation: 'securefore-fixed-annuity', filterEnabled: false, hasSuperscripts: false },
  { id: 'PRT-006', productPath: 'forestructured-growth-ii-registered-index-linked-annuity', childPath: 'forestructured-growth-ii-all', productName: 'ForeStructured Growth II', tableVariation: 'forestructured-growth-2-rila', filterEnabled: false, hasSuperscripts: true },
  { id: 'PRT-007', productPath: 'income-150--se-fixed-index-annuity', childPath: 'income-150-se-all', productName: 'Income 150+ SE', tableVariation: 'income-150-se-fixed-index-annuity', filterEnabled: false, hasSuperscripts: true },
  { id: 'PRT-008', productPath: 'forecertain-income-annuity', childPath: 'forecertain-all', productName: 'ForeCertain', tableVariation: 'forecertain-income-annuity', filterEnabled: false, hasSuperscripts: true },
];

test.describe('Product Rate Table — Per-Product Rendering', () => {
  for (const product of PRODUCTS) {
    test(`[${product.id}] @smoke @regression @sanity ${product.productName} rate table renders with correct product identity`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      await expect(pom.root).toBeVisible();
      await expect(pom.root).toHaveAttribute('data-product', product.productName);
      await expect(pom.root).toHaveAttribute('data-table-variation', product.tableVariation);
    });

    test(`[${product.id}] @regression ${product.productName} renders at least one populated rate table`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      const tableCount = await pom.tables.count();
      expect(tableCount).toBeGreaterThan(0);

      const rows = await pom.getAllRowTexts();
      expect(rows.length).toBeGreaterThan(0);
      // Every product page observed live renders at least one non-empty data row.
      expect(rows.every(r => r.trim().length > 0)).toBe(true);
    });

    test(`[${product.id}] @regression ${product.productName} defaults to the Current Rates view`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      await expect(pom.currentRatesButton).toHaveClass(/is-active/);
      await expect(pom.activeButton).toHaveText('Current Rates');
    });

    test(`[${product.id}] @interaction @regression ${product.productName} effective date toggle switches active view and updates rates`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      const effectiveButtons = pom.effectiveDateButtons;
      const count = await effectiveButtons.count();
      if (count === 0) {
        test.skip(true, `${product.productName}: no scheduled effective-date rate change on this page today`);
        return;
      }

      const rowsBefore = await pom.getAllRowTexts();
      await pom.clickFirstEffectiveDate();
      await expect(effectiveButtons.first()).toHaveClass(/is-active/);
      const rowsAfter = await pom.getAllRowTexts();

      // Verified live: switching to the effective-date view renders different rate values,
      // not just a class toggle (e.g. ForeCare: "999.99%" current -> "6.25%"/"5.50%" effective).
      expect(rowsAfter).not.toEqual(rowsBefore);
    });

    test(`[${product.id}] @regression ${product.productName} changed-rate highlight mechanism is correctly styled`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      // The "indicates changes" legend is always present regardless of whether any cell is
      // currently highlighted (e.g. ForeAccumulation II has zero highlighted cells today but
      // still shows the legend).
      await expect(pom.changeIndicatorLabel).toBeVisible();
      await expect(pom.changeIndicatorLabel).toHaveText(/indicates changes since last published/i);

      // Count is live content and will change as rates get republished — don't assert it.
      // Only assert that IF a cell is flagged as changed, it's genuinely styled as such.
      const changedCount = await pom.changedRateCells.count();
      if (changedCount > 0) {
        const first = pom.changedRateCells.first();
        const fontWeight = await first.evaluate(el => getComputedStyle(el).fontWeight);
        expect(['bold', '700']).toContain(fontWeight);
      }
    });

    test(`[${product.id}] @regression ${product.productName} superscript mapping renders correctly and never breaks the table (GAAM-988 regression)`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      const configured = await pom.getConfiguredSuperscripts();

      if (product.hasSuperscripts) {
        expect(configured, `${product.productName} is expected to have superscripts authored`).not.toBeNull();
        expect(configured!.length).toBeGreaterThan(0);
        await expect(pom.superscripts.first()).toBeVisible();
      } else {
        // GAAM-988: when the Superscript tab has no fields authored, the table must still
        // render — it previously got deleted entirely. Verified live: SecureFore/SecureFore II
        // both have data-superscripts=null and render fine.
        expect(configured).toBeNull();
      }

      // Regardless of superscript config, the table itself must always render.
      await expect(pom.root).toBeVisible();
      expect(await pom.tables.count()).toBeGreaterThan(0);
    });

    test(`[${product.id}] @regression ${product.productName} print and share controls are present and enabled`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      await expect(pom.shareButton).toBeVisible();
      await expect(pom.shareButton).toBeEnabled();
      await expect(pom.printButton).toBeVisible();
      await expect(pom.printButton).toBeEnabled();
    });

    test(`[${product.id}] @regression ${product.productName} Product Details link opens in a new tab`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      // Destination is author-configured per product/strategy and genuinely varies (verified
      // live: ForeCare links to the style-guide demo, SecureFore links to a resources page,
      // ForeIncome II links back to its own page) — assert the link works, not a fixed target.
      const link = pom.productDetailsLink.first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      const href = await link.getAttribute('href');
      expect(href, 'Product Details link should have a non-empty href').toBeTruthy();
    });

    test(`[${product.id}] @regression ${product.productName} rate filter visibility matches configuration`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);

      if (product.filterEnabled) {
        await expect(pom.filterContainer).not.toHaveClass(/no-filter/);
      } else {
        await expect(pom.filterContainer).toHaveClass(/no-filter/);
      }
    });
  }
});

test.describe('Product Rate Table — Filter Interaction (GAAM-597)', () => {
  // ForeIncome II is the only product with enableFilter=true today (verified live). The filter
  // is a single "Duration" dropdown (5-Year/7-Year/10-Year/All) built with the Choices.js
  // library. Verified live: it works by updating rate values *within* the existing rows/tables
  // for the selected duration, not by hiding/removing non-matching rows — row count stays
  // constant, so the assertion checks row content, not count. Also confirmed the underlying
  // data is stable across independent page reloads (not randomized), so a content diff here
  // is a genuine signal of the filter applying, not noise.
  const foreIncomeII = PRODUCTS.find(p => p.id === 'PRT-001')!;

  test('[PRT-001-FILTER] @interaction @regression ForeIncome II Duration filter updates displayed rates', async ({ page }) => {
    const pom = new ProductRateTablePage(page);
    await pom.navigate(BASE(), foreIncomeII.productPath, foreIncomeII.childPath);

    const rowsBefore = await pom.getAllRowTexts();
    await pom.selectDurationFilter('5-Year');
    await page.waitForTimeout(2000);
    const rowsAfter = await pom.getAllRowTexts();

    expect(rowsAfter, 'Selecting a Duration filter (5-Year) should update the displayed rate values').not.toEqual(rowsBefore);
  });
});

test.describe('Product Rate Table — No JS Errors', () => {
  for (const product of PRODUCTS) {
    test(`[${product.id}-ERR] @regression ${product.productName} produces no JS errors on load`, async ({ page }) => {
      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), product.productPath, product.childPath);
      await page.waitForTimeout(500);
      expect(capture.getErrors().filter(e => !isBenignError(e.message))).toEqual([]);
    });
  }
});

test.describe('Product Rate Table — Share via Email (GAAM-704/749)', () => {
  // handleShareEmail() (read directly from the live clientlib JS) assigns
  // window.location.href = "mailto:?subject=...&body=..." — a scheme Firefox silently
  // no-ops on with zero observable side effect (confirmed live: no popup, no modal, no
  // console output, href unchanged). Firefox's location.href is also non-configurable
  // (confirmed live), so it can't be intercepted from within a Firefox page context either.
  // Chrome DevTools Protocol's Page.frameRequestedNavigation event is the only way that
  // reliably captures the attempted mailto: URL — and CDP is Chromium-only. This test
  // therefore launches its own Chromium instance directly (reusing the same AEM session
  // cookies), independent of this file's Firefox project, specifically to get that visibility.
  test('[PRT-003-SHARE] @regression ForeCare Share produces the correct mailto subject and body', async ({}, testInfo) => {
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({ storageState: AUTH_STATE_PATH, ignoreHTTPSErrors: true });
      const page = await context.newPage();
      const client = await context.newCDPSession(page);
      await client.send('Page.enable');

      const navAttempts: string[] = [];
      client.on('Page.frameRequestedNavigation', (e: any) => navAttempts.push(e.url));

      const pom = new ProductRateTablePage(page);
      await pom.navigate(BASE(), 'forecare-fixed-annuity', 'forecare-all');

      const configuredSubject = await pom.root.getAttribute('data-share-email-subject');
      const configuredBody = await pom.root.getAttribute('data-share-email-body');

      navAttempts.length = 0; // clear any load-time noise
      await pom.shareButton.click();
      await page.waitForTimeout(1000);

      expect(navAttempts.length, 'Clicking Share should attempt a mailto: navigation').toBe(1);
      const mailtoUrl = new URL(navAttempts[0]);
      expect(mailtoUrl.protocol).toBe('mailto:');

      const params = new URLSearchParams(mailtoUrl.search);
      const expectedSubject = (configuredSubject || '').replace(/<\/?[^>]+(>|$)/g, '');
      expect(params.get('subject')).toBe(expectedSubject);

      const expectedBodyText = (configuredBody || '')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?[^>]+(>|$)/g, '');
      expect(params.get('body')).toContain(expectedBodyText.trim());
      // The body also appends the current page URL with a view=shared param.
      expect(params.get('body')).toContain('view=shared');
    } finally {
      await browser.close();
    }
  });
});

test.describe('Product Rate Table — Known Content Gaps', () => {
  test('[PRT-009] @regression ForeInvestors Choice Variable Annuity has no rate table configured yet', async ({ page }) => {
    // Verified live 2026-08-10: this product page under Dynamic_rates has zero child pages
    // and renders no .cmp-product-rate-table at all — a genuine content gap, not a test bug.
    // Un-skip once content is authored (see Jira epics GAAM-1197/633/632/631/590/514/143).
    test.skip(true, 'ForeInvestors Choice Variable Annuity has no Dynamic Rates content authored yet — confirmed via live check, not a test defect');
  });
});

// Relocated from image.author.spec.ts (MG-041, MG-064) — CSV import mis-bucketed these under
// Image; they're actually about the Dynamic Rates / Product Rate Table component.
test.describe('Product Rate Table — CSV Test Cases (GAAM-1402)', () => {
  test('[PRT-010] @smoke @regression DR AEM FE: Only selected Index in dialog should be loaded in DR table — AC1', async ({ page }) => {
    const foreIncomeII = PRODUCTS.find(p => p.id === 'PRT-001')!;
    const pom = new ProductRateTablePage(page);
    await pom.navigate(BASE(), foreIncomeII.productPath, foreIncomeII.childPath);
    // TODO: Implement assertion for: *Bug:*
    //
    // * *Only the selected Index and Year in the dialog - should be loaded in the DR table.*
    // Refer the attach the AEM author page link.
    // * This should be done for all the products.
    //
    // * [ForeIncome II - Morgan Stanley | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/foreincome-ii-ms.html]
    test.fixme();
  });
});
test.describe('Product Rate Table — CSV Test Cases (GAAM-1321)', () => {
  test('[PRT-011] @smoke @regression DR AEM FE: Rider Charge is not aligned as expected — AC1', async ({ page }) => {
    const foreIncomeII = PRODUCTS.find(p => p.id === 'PRT-001')!;
    const pom = new ProductRateTablePage(page);
    await pom.navigate(BASE(), foreIncomeII.productPath, foreIncomeII.childPath);
    // TODO: Implement assertion for: # Rider Charge - Added manually - is not aligned properly on *Dimensions 660 * 815* - should be fixed
    // # manual table addition would be checked for different products, wherever required.
    // # Testing Path - [ForeIncome II - All|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/resources/rates/foreincome-ii-all.html?wcmmode=disabled]
    test.fixme();
  });
});
