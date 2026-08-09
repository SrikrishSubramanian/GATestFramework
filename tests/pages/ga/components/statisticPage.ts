import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/statisticPage.locators.json'));

export class StatisticPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/statistic.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for div_0 */
  get div_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_0);
  }

  /** Locator for div_96M */
  get div_96M(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_96M);
  }

  /** Locator for div_AssetsUnderManagement */
  get div_AssetsUnderManagement(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_AssetsUnderManagement);
  }

  /** Locator for div_3 */
  get div_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_3);
  }

  /** Locator for div_150 */
  get div_150(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_150);
  }

  /** Locator for div_YearsOfCombinedExperience */
  get div_YearsOfCombinedExperience(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_YearsOfCombinedExperience);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for div_485 */
  get div_485(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_485);
  }

  /** Locator for div_CustomerSatisfactionRating */
  get div_CustomerSatisfactionRating(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_CustomerSatisfactionRating);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for div_68 */
  get div_68(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_68);
  }

  /** Locator for div_ClientRetentionRate */
  get div_ClientRetentionRate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ClientRetentionRate);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_20K */
  get div_20K(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20K);
  }

  /** Locator for div_ClientsServedNationwide */
  get div_ClientsServedNationwide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ClientsServedNationwide);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for div_42B */
  get div_42B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_42B);
  }

  /** Locator for div_TotalRevenueGenerated */
  get div_TotalRevenueGenerated(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_TotalRevenueGenerated);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_500 */
  get div_500(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_500);
  }

  /** Locator for div_TeamMembersWorldwide */
  get div_TeamMembersWorldwide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_TeamMembersWorldwide);
  }

  // --- Actions ---

  /** Click div_0 */
  async clickDiv0() {
    const el = await this.div_0;
    await el.click();
  }

  /** Click div_96M */
  async clickDiv96m() {
    const el = await this.div_96M;
    await el.click();
  }

  /** Click div_AssetsUnderManagement */
  async clickDivAssetsundermanagement() {
    const el = await this.div_AssetsUnderManagement;
    await el.click();
  }

  /** Click div_3 */
  async clickDiv3() {
    const el = await this.div_3;
    await el.click();
  }

  /** Click div_150 */
  async clickDiv150() {
    const el = await this.div_150;
    await el.click();
  }

  /** Click div_YearsOfCombinedExperience */
  async clickDivYearsofcombinedexperience() {
    const el = await this.div_YearsOfCombinedExperience;
    await el.click();
  }

  /** Click div_6 */
  async clickDiv6() {
    const el = await this.div_6;
    await el.click();
  }

  /** Click div_485 */
  async clickDiv485() {
    const el = await this.div_485;
    await el.click();
  }

  /** Click div_CustomerSatisfactionRating */
  async clickDivCustomersatisfactionrating() {
    const el = await this.div_CustomerSatisfactionRating;
    await el.click();
  }

  /** Click div_9 */
  async clickDiv9() {
    const el = await this.div_9;
    await el.click();
  }
}
