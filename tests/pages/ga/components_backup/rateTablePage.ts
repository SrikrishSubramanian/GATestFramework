import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'rateTablePage.locators.json'));

/** Variation IDs matching the AEM dialog select values */
export const RATE_TABLE_VARIATIONS = [
  'fixed-index-annuities',
  'fixed-annuities-v1',
  'fixed-annuities-v2',
  'index-linked-annuities',
  'income-annuity',
] as const;

export type RateTableVariation = typeof RATE_TABLE_VARIATIONS[number];

/** Display titles per variation (must match RateTableImpl.VARIATION_TITLES) */
export const VARIATION_TITLES: Record<RateTableVariation, string> = {
  'fixed-index-annuities': 'Rate Table - Fixed Index Annuities',
  'fixed-annuities-v1': 'Rate Table - Fixed Annuities v1',
  'fixed-annuities-v2': 'Rate Table - Fixed Annuities v2',
  'index-linked-annuities': 'Rate Table - Index Linked Annuities',
  'income-annuity': 'Rate Table - Income Annuity',
};

/** Expected column headers per variation (must match RateTableImpl) */
export const VARIATION_COLUMNS: Record<RateTableVariation, string[]> = {
  'fixed-index-annuities': ['Product', 'Term', 'Cap Rate', 'Participation Rate', 'Spread', 'Effective Date'],
  'fixed-annuities-v1': ['Product', 'Term', 'Guaranteed Rate', 'Current Rate', 'Effective Date'],
  'fixed-annuities-v2': ['Product', 'Term', 'Base Rate', 'Bonus Rate', 'Total Rate', 'Effective Date'],
  'index-linked-annuities': ['Product', 'Index', 'Term', 'Buffer', 'Cap Rate', 'Participation Rate', 'Effective Date'],
  'income-annuity': ['Product', 'Premium', 'Payout Start', 'Monthly Income', 'Annual Income', 'Effective Date'],
};

/** Expected row counts per variation (must match RateTableImpl dummy data) */
export const VARIATION_ROW_COUNTS: Record<RateTableVariation, number> = {
  'fixed-index-annuities': 6,
  'fixed-annuities-v1': 5,
  'fixed-annuities-v2': 4,
  'index-linked-annuities': 5,
  'income-annuity': 5,
};

/** Products per variation (for content validation) */
export const VARIATION_PRODUCTS: Record<RateTableVariation, string[]> = {
  'fixed-index-annuities': ['ForeAccumulation II', 'ForeIncome II', 'Income 150+ SE'],
  'fixed-annuities-v1': ['ForeCare', 'SecureFore'],
  'fixed-annuities-v2': ['ForeCare', 'SecureFore'],
  'index-linked-annuities': ['ForeStructured Growth II'],
  'income-annuity': ['ForeCertain'],
};

export class RateTablePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(
      `${baseUrl}/content/global-atlantic/style-guide/components/rate-table.html?wcmmode=disabled`
    );
    await this.page.waitForLoadState('networkidle');
  }

  /** Get all rate-table component instances on the page */
  allInstances(): Locator {
    return this.page.locator('.cmp-rate-table');
  }

  /** Get a specific rate-table instance by its data-table-variation attribute */
  instanceByVariation(variation: RateTableVariation): Locator {
    return this.page.locator(`.cmp-rate-table[data-table-variation="${variation}"]`);
  }

  /** Get the nth rate-table instance (0-indexed) */
  nthInstance(n: number): Locator {
    return this.page.locator('.cmp-rate-table').nth(n);
  }

  // --- Registry-backed locators (DOM-verified) ---

  get h2_FixedIndexAnnuities(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Rate_Table_Fixed_Index_Annuiti);
  }

  get h2_FixedAnnuitiesV1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Rate_Table_Fixed_AnnuitiesV1);
  }

  get h2_FixedAnnuitiesV2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Rate_Table_Fixed_AnnuitiesV2);
  }

  get h2_IndexLinkedAnnuities(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Rate_Table_Index_Linked_Annuit);
  }

  get h2_IncomeAnnuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Rate_Table_Income_Annuity);
  }

  // --- Scoped helpers for a specific variation instance ---

  /** Get column headers text for a specific variation */
  async getColumnHeaders(variation: RateTableVariation): Promise<string[]> {
    const instance = this.instanceByVariation(variation);
    const cells = instance.locator('.cmp-rate-table__cell--header');
    const count = await cells.count();
    const headers: string[] = [];
    for (let i = 0; i < count; i++) {
      headers.push((await cells.nth(i).textContent() || '').trim());
    }
    return headers;
  }

  /** Get data row count for a specific variation */
  async getRowCount(variation: RateTableVariation): Promise<number> {
    const instance = this.instanceByVariation(variation);
    return instance.locator('.cmp-rate-table__tbody .cmp-rate-table__row').count();
  }

  /** Get the title text for a specific variation */
  async getTitle(variation: RateTableVariation): Promise<string> {
    const instance = this.instanceByVariation(variation);
    return (await instance.locator('.cmp-rate-table__title').textContent() || '').trim();
  }

  /** Get all cell values for a specific row in a specific variation */
  async getRowData(variation: RateTableVariation, rowIndex: number): Promise<string[]> {
    const instance = this.instanceByVariation(variation);
    const row = instance.locator('.cmp-rate-table__tbody .cmp-rate-table__row').nth(rowIndex);
    const cells = row.locator('.cmp-rate-table__cell');
    const count = await cells.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      values.push((await cells.nth(i).textContent() || '').trim());
    }
    return values;
  }
}
