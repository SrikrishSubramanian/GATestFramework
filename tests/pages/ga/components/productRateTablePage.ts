import { Page, Locator } from '@playwright/test';

/**
 * Dynamic Rates product pages live under a QA sandbox tree, one child page per
 * distribution-channel variant (e.g. "-all", "-wf", "-advisory", rider variants).
 * Verified live against author-p101514-e1845752.adobeaemcloud.com on 2026-08-10.
 */
const DYNAMIC_RATES_ROOT = '/content/global-atlantic/style-guide/qa-testing/dynamic_rates/Dynamic_rates';

export class ProductRateTablePage {
  constructor(private page: Page) {}

  /** Navigate to a specific product's rate table page (productPath + childPath under Dynamic_rates). */
  async navigate(baseUrl: string, productPath: string, childPath: string) {
    const url = `${baseUrl}${DYNAMIC_RATES_ROOT}/${productPath}/${childPath}.html?wcmmode=disabled`;
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // A residual AEM Start console redirect can transiently interrupt the very next
      // navigation right after login. It's self-resolving — retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      } else {
        throw err;
      }
    }
    await this.page.waitForSelector('.cmp-product-rate-table', { timeout: 20000 });
    await this.page.waitForSelector('.cmp-product-rate-table:not(.cmp-product-rate-table--loading)', { timeout: 20000 });
  }

  get root(): Locator {
    return this.page.locator('.cmp-product-rate-table').first();
  }

  get currentRatesButton(): Locator {
    return this.page.locator('.cmp-product-rate-table__current-rates').first();
  }

  get effectiveDateButtons(): Locator {
    return this.page.locator('.cmp-product-rate-table__effective-date');
  }

  get activeButton(): Locator {
    return this.page.locator('.cmp-product-rate-table__button-container button.is-active').first();
  }

  get shareButton(): Locator {
    return this.page.locator('#shareViaEmail');
  }

  get durationFilterDropdown(): Locator {
    return this.page.locator('.cmp-product-rate-filter .choices').first();
  }

  /** Opens the Duration filter dropdown and selects the option matching optionText (e.g. "5-Year"). */
  async selectDurationFilter(optionText: string): Promise<void> {
    await this.durationFilterDropdown.click();
    await this.page.locator('.choices__item--choice', { hasText: optionText }).first().click();
  }

  get printButton(): Locator {
    return this.page.locator('#printPdfBtn');
  }

  get productDetailsLink(): Locator {
    return this.page.locator('a[aria-label="Product Details"]');
  }

  get filterContainer(): Locator {
    return this.page.locator('.cmp-product-rate-filter');
  }

  get ratesCurrentAsOfLabel(): Locator {
    return this.page.locator('.cmp-product-rate__date');
  }

  get changeIndicatorLabel(): Locator {
    return this.page.locator('.cmp-product-rate__indicates');
  }

  /**
   * Cells highlighted as changed since the last published document. Verified live: this is
   * conditional per-cell (varies 0-120+ cells across products) and recomputed per view
   * (Current Rates vs. Effective Date each compare against their own prior-publish baseline) —
   * so the highlighted *count* is live content, not something to assert on directly.
   */
  get changedRateCells(): Locator {
    return this.root.locator('td[style*="font-weight:bold"]');
  }

  get tables(): Locator {
    return this.root.locator('table');
  }

  get superscripts(): Locator {
    // Multi-strategy products render several table-sections at once, some of which may be
    // hidden (e.g. behind a filter) — scope to :visible so .first() doesn't lock onto a
    // hidden decoy (verified live: ForeAccumulation II / Income 150+ SE both hit this).
    return this.root.locator('sup:visible');
  }

  /** The component's authored data-superscripts JSON, or null if the Superscript tab has no fields authored. */
  async getConfiguredSuperscripts(): Promise<Array<{ targetText: string; superscriptValue: string }> | null> {
    const raw = await this.root.getAttribute('data-superscripts');
    return raw ? JSON.parse(raw) : null;
  }

  /** All rendered data-row text, flattened, from every table in the component (cross-strategy products render multiple tables). */
  async getAllRowTexts(): Promise<string[]> {
    return this.root.locator('tbody tr').allTextContents();
  }

  async clickFirstEffectiveDate(): Promise<void> {
    await this.effectiveDateButtons.first().click();
  }
}
