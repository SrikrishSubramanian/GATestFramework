import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'benefitsTablePage.locators.json'));

export class BenefitsTablePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/benefits-table.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for aHyperlinks */
  get aHyperlinks(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.aHyperlinks);
  }

  /** Locator for ul_1 */
  get ul_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_1);
  }

  /** Locator for ul_2 */
  get ul_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_2);
  }

  /** Locator for div_Optional_Headline */
  get div_Optional_Headline(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Optional_Headline);
  }

  /** Locator for li_IncludedAtNoAdditionalCost */
  get li_IncludedAtNoAdditionalCost(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_IncludedAtNoAdditionalCost);
  }

  /** Locator for li_Available_247WithDedicatedS */
  get li_Available_247WithDedicatedS(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Available_247WithDedicatedS);
  }

  /** Locator for li_6 */
  get li_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_6);
  }

  /** Locator for li_FlexiblePremiumPaymentOptio */
  get li_FlexiblePremiumPaymentOptio(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_FlexiblePremiumPaymentOptio);
  }

  /** Locator for li_8 */
  get li_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_8);
  }

  /** Locator for li_9 */
  get li_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_9);
  }

  // --- Actions ---

  /** Click aHyperlinks */
  async clickAhyperlinks() {
    const el = await this.aHyperlinks;
    await el.click();
  }

  /** Click ul_1 */
  async clickUl1() {
    const el = await this.ul_1;
    await el.click();
  }

  /** Click ul_2 */
  async clickUl2() {
    const el = await this.ul_2;
    await el.click();
  }

  /** Click div_Optional_Headline */
  async clickDivOptionalHeadline() {
    const el = await this.div_Optional_Headline;
    await el.click();
  }

  /** Click li_IncludedAtNoAdditionalCost */
  async clickLiIncludedatnoadditionalcost() {
    const el = await this.li_IncludedAtNoAdditionalCost;
    await el.click();
  }

  /** Click li_Available_247WithDedicatedS */
  async clickLiAvailable247withdedicateds() {
    const el = await this.li_Available_247WithDedicatedS;
    await el.click();
  }

  /** Click li_6 */
  async clickLi6() {
    const el = await this.li_6;
    await el.click();
  }

  /** Click li_FlexiblePremiumPaymentOptio */
  async clickLiFlexiblepremiumpaymentoptio() {
    const el = await this.li_FlexiblePremiumPaymentOptio;
    await el.click();
  }

  /** Click li_8 */
  async clickLi8() {
    const el = await this.li_8;
    await el.click();
  }

  /** Click li_9 */
  async clickLi9() {
    const el = await this.li_9;
    await el.click();
  }
}
