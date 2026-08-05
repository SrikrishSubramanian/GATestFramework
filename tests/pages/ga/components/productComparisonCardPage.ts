import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'productComparisonCardPage.locators.json'));

export class ProductComparisonCardPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/product-comparison-card.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for Explore_Forge_Accumulation */
  get Explore_Forge_Accumulation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Explore_Forge_Accumulation);
  }

  /** Locator for Explore_Heritage_Income */
  get Explore_Heritage_Income(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Explore_Heritage_Income);
  }

  /** Locator for Explore_Foundation_Plus */
  get Explore_Foundation_Plus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Explore_Foundation_Plus);
  }

  /** Locator for h3_Forge_Accumulation */
  get h3_Forge_Accumulation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Forge_Accumulation);
  }

  /** Locator for h3_Heritage_Income */
  get h3_Heritage_Income(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Heritage_Income);
  }

  /** Locator for h3_Foundation_Plus */
  get h3_Foundation_Plus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Foundation_Plus);
  }

  /** Locator for ul_7 */
  get ul_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_7);
  }

  /** Locator for ul_8 */
  get ul_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_8);
  }

  /** Locator for ul_9 */
  get ul_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_9);
  }

  /** Locator for ul_10 */
  get ul_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_10);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for li_12 */
  get li_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_12);
  }

  /** Locator for div_Forge_Accumulation */
  get div_Forge_Accumulation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Forge_Accumulation);
  }

  /** Locator for div_Forge_Accumulation_14 */
  get div_Forge_Accumulation_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Forge_Accumulation_14);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for div_16 */
  get div_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_16);
  }

  /** Locator for div_17 */
  get div_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_17);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for span_Issue_Ages */
  get span_Issue_Ages(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Issue_Ages);
  }

  /** Locator for span_1880 */
  get span_1880(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_1880);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
  }

  /** Locator for div_22 */
  get div_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_22);
  }

  /** Locator for span_Withdrawal_Charge_Period */
  get span_Withdrawal_Charge_Period(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Withdrawal_Charge_Period);
  }

  /** Locator for span_7_Years */
  get span_7_Years(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_7_Years);
  }

  /** Locator for div_25 */
  get div_25(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_25);
  }

  /** Locator for div_26 */
  get div_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_26);
  }

  /** Locator for span_Key_Features */
  get span_Key_Features(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Key_Features);
  }

  /** Locator for li_IndexlinkedGrowthPotential */
  get li_IndexlinkedGrowthPotential(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_IndexlinkedGrowthPotential);
  }

  /** Locator for li_PrincipalProtectionFromMark */
  get li_PrincipalProtectionFromMark(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_PrincipalProtectionFromMark);
  }

  /** Locator for li_TaxdeferredAccumulation */
  get li_TaxdeferredAccumulation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_TaxdeferredAccumulation);
  }

  /** Locator for div_31 */
  get div_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_31);
  }

  /** Locator for div_32 */
  get div_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_32);
  }

  /** Locator for span_Best_For */
  get span_Best_For(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Best_For);
  }

  /** Locator for span_34 */
  get span_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_34);
  }

  /** Locator for div_Explore_Forge_Accumulation */
  get div_Explore_Forge_Accumulation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Explore_Forge_Accumulation);
  }

  /** Locator for span_Explore_Forge_Accumulation */
  get span_Explore_Forge_Accumulation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Explore_Forge_Accumulation);
  }

  /** Locator for span_37 */
  get span_37(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_37);
  }

  /** Locator for li_38 */
  get li_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_38);
  }

  /** Locator for div_Heritage_Income */
  get div_Heritage_Income(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Heritage_Income);
  }

  /** Locator for div_Heritage_Income_40 */
  get div_Heritage_Income_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Heritage_Income_40);
  }

  /** Locator for span_4585 */
  get span_4585(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_4585);
  }

  /** Locator for span_10_Years */
  get span_10_Years(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_10_Years);
  }

  /** Locator for li_GuaranteedIncomeForLife */
  get li_GuaranteedIncomeForLife(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_GuaranteedIncomeForLife);
  }

  /** Locator for li_MultiplePayoutOptions */
  get li_MultiplePayoutOptions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_MultiplePayoutOptions);
  }

  /** Locator for li_SpousalContinuationFeature */
  get li_SpousalContinuationFeature(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SpousalContinuationFeature);
  }

  /** Locator for span_46 */
  get span_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_46);
  }

  /** Locator for div_Explore_Heritage_Income */
  get div_Explore_Heritage_Income(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Explore_Heritage_Income);
  }

  /** Locator for span_Explore_Heritage_Income */
  get span_Explore_Heritage_Income(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Explore_Heritage_Income);
  }

  /** Locator for div_01_ */
  get div_01_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_01_);
  }

  /** Locator for div_01__50 */
  get div_01__50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_01__50);
  }

  /** Locator for span_01 */
  get span_01(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_01);
  }

  /** Locator for span_52 */
  get span_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_52);
  }

  /** Locator for span_53 */
  get span_53(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_53);
  }

  /** Locator for div_54 */
  get div_54(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_54);
  }

  /** Locator for div_55 */
  get div_55(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_55);
  }

  /** Locator for li_56 */
  get li_56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_56);
  }

  /** Locator for div_Foundation_Plus */
  get div_Foundation_Plus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Foundation_Plus);
  }

  /** Locator for div_Foundation_Plus_58 */
  get div_Foundation_Plus_58(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Foundation_Plus_58);
  }

  /** Locator for span_085 */
  get span_085(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_085);
  }

  /** Locator for span_5_Years */
  get span_5_Years(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_5_Years);
  }

  /** Locator for li_GuaranteedFixedInterestRate */
  get li_GuaranteedFixedInterestRate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_GuaranteedFixedInterestRate);
  }

  /** Locator for li_FullPrincipalProtection */
  get li_FullPrincipalProtection(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_FullPrincipalProtection);
  }

  /** Locator for li_FlexibleWithdrawalOptions */
  get li_FlexibleWithdrawalOptions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_FlexibleWithdrawalOptions);
  }

  /** Locator for span_64 */
  get span_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_64);
  }

  /** Locator for div_Explore_Foundation_Plus */
  get div_Explore_Foundation_Plus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Explore_Foundation_Plus);
  }

  /** Locator for span_Explore_Foundation_Plus */
  get span_Explore_Foundation_Plus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Explore_Foundation_Plus);
  }

  // --- Actions ---

  /** Click Explore_Forge_Accumulation */
  async clickExploreForgeAccumulation() {
    const el = await this.Explore_Forge_Accumulation;
    await el.click();
  }

  /** Click Explore_Heritage_Income */
  async clickExploreHeritageIncome() {
    const el = await this.Explore_Heritage_Income;
    await el.click();
  }

  /** Click Explore_Foundation_Plus */
  async clickExploreFoundationPlus() {
    const el = await this.Explore_Foundation_Plus;
    await el.click();
  }

  /** Click h3_Forge_Accumulation */
  async clickH3ForgeAccumulation() {
    const el = await this.h3_Forge_Accumulation;
    await el.click();
  }

  /** Click h3_Heritage_Income */
  async clickH3HeritageIncome() {
    const el = await this.h3_Heritage_Income;
    await el.click();
  }

  /** Click h3_Foundation_Plus */
  async clickH3FoundationPlus() {
    const el = await this.h3_Foundation_Plus;
    await el.click();
  }

  /** Click ul_7 */
  async clickUl7() {
    const el = await this.ul_7;
    await el.click();
  }

  /** Click ul_8 */
  async clickUl8() {
    const el = await this.ul_8;
    await el.click();
  }

  /** Click ul_9 */
  async clickUl9() {
    const el = await this.ul_9;
    await el.click();
  }

  /** Click ul_10 */
  async clickUl10() {
    const el = await this.ul_10;
    await el.click();
  }
}
