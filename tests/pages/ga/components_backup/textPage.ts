import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'textPage.locators.json'));

export class TextPage {
  constructor(private page: Page) {}

  /** Navigate to the text component fixture/style-guide page */
  async navigate(baseUrl: string) {
    // Authenticate with AEM author
    await loginToAEMAuthor(this.page);

    // Use style guide page — test-fixtures requires manual deployment
    const url = resolveComponentUrl('text', { forceStyleGuide: true });
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.cmp-text', { timeout: 15000 });
  }

  // ---------------------------------------------------------------------------
  // Registry-based locator getters (use resolveLocator with sidecar JSON)
  // ---------------------------------------------------------------------------

  /** Registry locator for the text root (.cmp-text) */
  get textRoot(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.textRoot);
  }

  /** Registry locator for any table inside .cmp-text */
  get table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.table);
  }

  /** Registry locator for a table with dividers (.table-dividers) */
  get tableWithDividers(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.tableWithDividers);
  }

  /** Registry locator for table caption */
  get caption(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.caption);
  }

  /** Registry locator for thead */
  get thead(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.thead);
  }

  /** Registry locator for tbody */
  get tbody(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.tbody);
  }

  /** Registry locator for header cells (th or td.table-cell-header) */
  get headerCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.headerCell);
  }

  /** Registry locator for subheader cells (td.table-cell-subheader) */
  get subheaderCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.subheaderCell);
  }

  /** Registry locator for stripe cells (td.table-cell-stripe) */
  get stripeCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.stripeCell);
  }

  /** Registry locator for blank cells (td.table-cell-blank) */
  get blankCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blankCell);
  }

  /** Registry locator for blank-stripe cells (td.table-cell-blank-stripe) */
  get blankStripeCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blankStripeCell);
  }

  /** Registry locator for highlight cells (td.table-cell-highlight) */
  get highlightCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.highlightCell);
  }

  /** Registry locator for icon-left cells (td.icon-left) */
  get iconLeftCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.iconLeftCell);
  }

  /** Registry locator for icon-right cells (td.icon-right) */
  get iconRightCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.iconRightCell);
  }

  /** Registry locator for generic body cells (td) */
  get bodyCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.bodyCell);
  }

  /** Registry locator for th elements with a scope attribute */
  get scopedHeader(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.scopedHeader);
  }

  /** Registry locator for decorative images with aria-hidden="true" */
  get ariaHiddenImg(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ariaHiddenImg);
  }

  /** Registry locator for focusable scroll container (.cmp-text[tabindex="0"]) */
  get focusableScrollContainer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.focusableScrollContainer);
  }

  /** Registry locator for dark-mode section wrapper */
  get darkModeSection(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.darkModeSection);
  }

  /** Registry locator for table inside dark-mode section */
  get darkModeTable(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.darkModeTable);
  }

  /** Registry locator for header cells inside dark-mode section */
  get darkModeHeaderCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.darkModeHeaderCell);
  }

  /** Registry locator for body cells inside dark-mode section */
  get darkModeBodyCell(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.darkModeBodyCell);
  }

  // ---------------------------------------------------------------------------
  // Direct Playwright locator getters (convenience, no registry overhead)
  // ---------------------------------------------------------------------------

  /** Direct locator for the text root */
  get textRootDirect(): Locator {
    return this.page.locator('.cmp-text');
  }

  /** Direct locator for all tables */
  get tables(): Locator {
    return this.page.locator('.cmp-text table');
  }

  /** Direct locator for tables with dividers */
  get tablesWithDividers(): Locator {
    return this.page.locator('.cmp-text table.table-dividers');
  }

  /** Direct locator for table captions */
  get captions(): Locator {
    return this.page.locator('.cmp-text table caption');
  }

  /** Direct locator for thead elements */
  get theads(): Locator {
    return this.page.locator('.cmp-text thead');
  }

  /** Direct locator for tbody elements */
  get tbodies(): Locator {
    return this.page.locator('.cmp-text tbody');
  }

  /** Direct locator for header cells */
  get headerCells(): Locator {
    return this.page.locator('.cmp-text th, .cmp-text td.table-cell-header');
  }

  /** Direct locator for subheader cells */
  get subheaderCells(): Locator {
    return this.page.locator('.cmp-text td.table-cell-subheader');
  }

  /** Direct locator for stripe cells */
  get stripeCells(): Locator {
    return this.page.locator('.cmp-text td.table-cell-stripe');
  }

  /** Direct locator for blank cells */
  get blankCells(): Locator {
    return this.page.locator('.cmp-text td.table-cell-blank');
  }

  /** Direct locator for blank-stripe cells */
  get blankStripeCells(): Locator {
    return this.page.locator('.cmp-text td.table-cell-blank-stripe');
  }

  /** Direct locator for highlight cells */
  get highlightCells(): Locator {
    return this.page.locator('.cmp-text td.table-cell-highlight');
  }

  /** Direct locator for icon-left cells */
  get iconLeftCells(): Locator {
    return this.page.locator('.cmp-text td.icon-left');
  }

  /** Direct locator for icon-right cells */
  get iconRightCells(): Locator {
    return this.page.locator('.cmp-text td.icon-right');
  }

  /** Direct locator for all body cells */
  get bodyCells(): Locator {
    return this.page.locator('.cmp-text td');
  }

  /** Direct locator for scoped header cells */
  get scopedHeaders(): Locator {
    return this.page.locator('.cmp-text th[scope]');
  }

  /** Direct locator for decorative images */
  get ariaHiddenImgs(): Locator {
    return this.page.locator('.cmp-text img[aria-hidden="true"]');
  }

  /** Direct locator for focusable scroll container */
  get focusableScrollContainers(): Locator {
    return this.page.locator('.cmp-text[tabindex="0"]');
  }

  /** Direct locator for dark-mode section */
  get darkModeSections(): Locator {
    return this.page.locator('.cmp-section--background-color-granite');
  }

  /** Direct locator for table inside dark-mode section */
  get darkModeTables(): Locator {
    return this.page.locator('.cmp-section--background-color-granite .cmp-text table');
  }

  /** Direct locator for header cells inside dark-mode section */
  get darkModeHeaderCells(): Locator {
    return this.page.locator('.cmp-section--background-color-granite .cmp-text th');
  }

  /** Direct locator for body cells inside dark-mode section */
  get darkModeBodyCells(): Locator {
    return this.page.locator('.cmp-section--background-color-granite .cmp-text td');
  }
}
