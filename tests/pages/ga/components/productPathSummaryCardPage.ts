import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'productPathSummaryCardPage.locators.json'));

export class ProductPathSummaryCardPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/product-path-summary-card.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for aLinks */
  get aLinks(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.aLinks);
  }

  /** Locator for ul_1 */
  get ul_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_1);
  }

  /** Locator for ul_2 */
  get ul_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_2);
  }

  /** Locator for ul_3 */
  get ul_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_3);
  }

  /** Locator for ul_4 */
  get ul_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_4);
  }

  /** Locator for ul_5 */
  get ul_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_5);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for div_Path_A */
  get div_Path_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_A);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  /** Locator for div_30_ */
  get div_30_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30_);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_Guaranteed_Rollup1 */
  get div_Guaranteed_Rollup1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Guaranteed_Rollup1);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for li_IncludedAtNoAdditionalCost */
  get li_IncludedAtNoAdditionalCost(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_IncludedAtNoAdditionalCost);
  }

  /** Locator for li_Available_247WithDedicatedS */
  get li_Available_247WithDedicatedS(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Available_247WithDedicatedS);
  }

  /** Locator for li_18 */
  get li_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_18);
  }

  /** Locator for li_FlexiblePremiumPaymentOptio */
  get li_FlexiblePremiumPaymentOptio(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_FlexiblePremiumPaymentOptio);
  }

  /** Locator for div_Path_B */
  get div_Path_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_B);
  }

  /** Locator for div_Path_B_21 */
  get div_Path_B_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_B_21);
  }

  /** Locator for div_22 */
  get div_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_22);
  }

  /** Locator for div_23 */
  get div_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_23);
  }

  /** Locator for div_65 */
  get div_65(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_65);
  }

  /** Locator for div_25 */
  get div_25(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_25);
  }

  /** Locator for div_Annual_Yield */
  get div_Annual_Yield(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Annual_Yield);
  }

  /** Locator for div_SubjectToMarketConditions */
  get div_SubjectToMarketConditions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_SubjectToMarketConditions);
  }

  /** Locator for div_28 */
  get div_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_28);
  }

  /** Locator for li_Minimum_1GuaranteedFloor */
  get li_Minimum_1GuaranteedFloor(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Minimum_1GuaranteedFloor);
  }

  /** Locator for li_NoSurrenderChargesAfterYea */
  get li_NoSurrenderChargesAfterYea(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_NoSurrenderChargesAfterYea);
  }

  /** Locator for li_SupportsInlineLinksAndSupe */
  get li_SupportsInlineLinksAndSupe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SupportsInlineLinksAndSupe);
  }

  /** Locator for div_32 */
  get div_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_32);
  }

  /** Locator for div_Path_C */
  get div_Path_C(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_C);
  }

  /** Locator for div_34 */
  get div_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_34);
  }

  /** Locator for div_35 */
  get div_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_35);
  }

  /** Locator for div_36 */
  get div_36(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_36);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for div_Fixed_Rate */
  get div_Fixed_Rate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Fixed_Rate);
  }

  /** Locator for div_Fixed_Rate_39 */
  get div_Fixed_Rate_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Fixed_Rate_39);
  }

  /** Locator for div_40 */
  get div_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_40);
  }

  /** Locator for li_PrincipalProtectionGuarantee */
  get li_PrincipalProtectionGuarantee(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_PrincipalProtectionGuarantee);
  }

  /** Locator for li_PredictableStableReturns */
  get li_PredictableStableReturns(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_PredictableStableReturns);
  }

  /** Locator for li_NoMarketRiskExposure */
  get li_NoMarketRiskExposure(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_NoMarketRiskExposure);
  }

  /** Locator for li_AnnualLiquidityProvisionsAv */
  get li_AnnualLiquidityProvisionsAv(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_AnnualLiquidityProvisionsAv);
  }

  /** Locator for div_45 */
  get div_45(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_45);
  }

  /** Locator for div_Guaranteed_Income_Builder_Bene */
  get div_Guaranteed_Income_Builder_Bene(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Guaranteed_Income_Builder_Bene);
  }

  /** Locator for div_47 */
  get div_47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_47);
  }

  /** Locator for div_48 */
  get div_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_48);
  }

  /** Locator for div_15_ */
  get div_15_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15_);
  }

  /** Locator for div_Guaranteed_Rollup */
  get div_Guaranteed_Rollup(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Guaranteed_Rollup);
  }

  /** Locator for div_Guaranteed_Rollup_51 */
  get div_Guaranteed_Rollup_51(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Guaranteed_Rollup_51);
  }

  /** Locator for div_52 */
  get div_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_52);
  }

  /** Locator for li_53 */
  get li_53(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_53);
  }

  /** Locator for div_54 */
  get div_54(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_54);
  }

  /** Locator for div_55 */
  get div_55(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_55);
  }

  /** Locator for div_56 */
  get div_56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_56);
  }

  /** Locator for div_57 */
  get div_57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_57);
  }

  /** Locator for div_150_ */
  get div_150_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_150_);
  }

  /** Locator for div_59 */
  get div_59(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_59);
  }

  /** Locator for div_60 */
  get div_60(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_60);
  }

  /** Locator for div_61 */
  get div_61(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_61);
  }

  /** Locator for div_62 */
  get div_62(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_62);
  }

  /** Locator for li_63 */
  get li_63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_63);
  }

  /** Locator for li_64 */
  get li_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_64);
  }

  // --- Actions ---

  /** Click aLinks */
  async clickAlinks() {
    const el = await this.aLinks;
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

  /** Click ul_3 */
  async clickUl3() {
    const el = await this.ul_3;
    await el.click();
  }

  /** Click ul_4 */
  async clickUl4() {
    const el = await this.ul_4;
    await el.click();
  }

  /** Click ul_5 */
  async clickUl5() {
    const el = await this.ul_5;
    await el.click();
  }

  /** Click div_6 */
  async clickDiv6() {
    const el = await this.div_6;
    await el.click();
  }

  /** Click div_Path_A */
  async clickDivPathA() {
    const el = await this.div_Path_A;
    await el.click();
  }

  /** Click div_8 */
  async clickDiv8() {
    const el = await this.div_8;
    await el.click();
  }

  /** Click div_9 */
  async clickDiv9() {
    const el = await this.div_9;
    await el.click();
  }
}
