import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'statisticPage.locators.json'));

export class StatisticPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/statistic.html?wcmmode=disabled`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.cmp-statistic', { timeout: 15000 });
  }

  /** Locator for div_42_GrowthIn_Sales */
  get div_42_GrowthIn_Sales(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_42_GrowthIn_Sales);
  }

  /** Locator for div_42 */
  get div_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_42);
  }

  /** Locator for div_GrowthIn_Sales */
  get div_GrowthIn_Sales(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_GrowthIn_Sales);
  }

  /** Locator for div_3 */
  get div_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_3);
  }

  /** Locator for div_5B */
  get div_5B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5B);
  }

  /** Locator for div_Assets_Under_Management */
  get div_Assets_Under_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Assets_Under_Management);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for div_25K */
  get div_25K(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_25K);
  }

  /** Locator for div_Investment_Professionals */
  get div_Investment_Professionals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Investment_Professionals);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for div_89 */
  get div_89(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_89);
  }

  /** Locator for div_Customer_Satisfaction */
  get div_Customer_Satisfaction(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Customer_Satisfaction);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_150 */
  get div_150(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_150);
  }

  /** Locator for div_Portfolio_Companies */
  get div_Portfolio_Companies(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Portfolio_Companies);
  }

  /** Locator for div_30T_Global_Capital */
  get div_30T_Global_Capital(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30T_Global_Capital);
  }

  /** Locator for div_30T */
  get div_30T(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30T);
  }

  /** Locator for div_Global_Capital */
  get div_Global_Capital(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Global_Capital);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_750M */
  get div_750M(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_750M);
  }

  /** Locator for div_Private_Equity_Dry_Powder */
  get div_Private_Equity_Dry_Powder(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Private_Equity_Dry_Powder);
  }

  /** Locator for div_500K_People_Impacted */
  get div_500K_People_Impacted(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_500K_People_Impacted);
  }

  /** Locator for div_500K */
  get div_500K(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_500K);
  }

  /** Locator for div_People_Impacted */
  get div_People_Impacted(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_People_Impacted);
  }

  // --- Actions ---

  /** Click div_42_GrowthIn_Sales */
  async clickDiv42GrowthinSales() {
    const el = await this.div_42_GrowthIn_Sales;
    await el.click();
  }

  /** Click div_42 */
  async clickDiv42() {
    const el = await this.div_42;
    await el.click();
  }

  /** Click div_GrowthIn_Sales */
  async clickDivGrowthinSales() {
    const el = await this.div_GrowthIn_Sales;
    await el.click();
  }

  /** Click div_3 */
  async clickDiv3() {
    const el = await this.div_3;
    await el.click();
  }

  /** Click div_5B */
  async clickDiv5b() {
    const el = await this.div_5B;
    await el.click();
  }

  /** Click div_Assets_Under_Management */
  async clickDivAssetsUnderManagement() {
    const el = await this.div_Assets_Under_Management;
    await el.click();
  }

  /** Click div_6 */
  async clickDiv6() {
    const el = await this.div_6;
    await el.click();
  }

  /** Click div_25K */
  async clickDiv25k() {
    const el = await this.div_25K;
    await el.click();
  }

  /** Click div_Investment_Professionals */
  async clickDivInvestmentProfessionals() {
    const el = await this.div_Investment_Professionals;
    await el.click();
  }

  /** Click div_9 */
  async clickDiv9() {
    const el = await this.div_9;
    await el.click();
  }
}
