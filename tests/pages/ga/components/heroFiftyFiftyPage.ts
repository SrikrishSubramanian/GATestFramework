import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'heroFiftyFiftyPage.locators.json'));

export class HeroFiftyFiftyPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for a_Style_Guide */
  get a_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Style_Guide);
  }

  /** Locator for a_Component_Library */
  get a_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Component_Library);
  }

  /** Locator for h1_2 */
  get h1_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_2);
  }

  /** Locator for h1_Invest_In_What_Matters_Most */
  get h1_Invest_In_What_Matters_Most(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_Invest_In_What_Matters_Most);
  }

  /** Locator for h1_Global_Atlantic_At_A_Glance */
  get h1_Global_Atlantic_At_A_Glance(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_Global_Atlantic_At_A_Glance);
  }

  /** Locator for h1_Building_ForeIncome_II_For_Tom */
  get h1_Building_ForeIncome_II_For_Tom(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_Building_ForeIncome_II_For_Tom);
  }

  /** Locator for nav_6 */
  get nav_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.nav_6);
  }

  /** Locator for ol_7 */
  get ol_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_7);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for li_Style_Guide */
  get li_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Style_Guide);
  }

  /** Locator for li_Component_Library */
  get li_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Component_Library);
  }

  /** Locator for li_Hero_5050 */
  get li_Hero_5050(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for p_Retirement_Solutions */
  get p_Retirement_Solutions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Retirement_Solutions);
  }

  /** Locator for div_17 */
  get div_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_17);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_19 */
  get div_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_19);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
  }

  /** Locator for div_Invest_In_What_Matters_Most */
  get div_Invest_In_What_Matters_Most(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Invest_In_What_Matters_Most);
  }

  /** Locator for div_Invest_In_What_Matters_Most_23 */
  get div_Invest_In_What_Matters_Most_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Invest_In_What_Matters_Most_23);
  }

  /** Locator for div_Invest_In_What_Matters_Most_24 */
  get div_Invest_In_What_Matters_Most_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Invest_In_What_Matters_Most_24);
  }

  /** Locator for div_Global_Atlantic_At_A_Glance */
  get div_Global_Atlantic_At_A_Glance(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Global_Atlantic_At_A_Glance);
  }

  /** Locator for div_Global_Atlantic_At_A_Glance_26 */
  get div_Global_Atlantic_At_A_Glance_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Global_Atlantic_At_A_Glance_26);
  }

  /** Locator for div_Global_Atlantic_At_A_Glance_27 */
  get div_Global_Atlantic_At_A_Glance_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Global_Atlantic_At_A_Glance_27);
  }

  /** Locator for div_28 */
  get div_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_28);
  }

  /** Locator for div_29 */
  get div_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_29);
  }

  /** Locator for div_30 */
  get div_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30);
  }

  /** Locator for p_Investment_Management */
  get p_Investment_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Investment_Management);
  }

  /** Locator for div_32 */
  get div_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_32);
  }

  // --- Actions ---

  /** Click a_Style_Guide */
  async clickAStyleGuide() {
    const el = await this.a_Style_Guide;
    await el.click();
  }

  /** Click a_Component_Library */
  async clickAComponentLibrary() {
    const el = await this.a_Component_Library;
    await el.click();
  }

  /** Click h1_2 */
  async clickH12() {
    const el = await this.h1_2;
    await el.click();
  }

  /** Click h1_Invest_In_What_Matters_Most */
  async clickH1InvestInWhatMattersMost() {
    const el = await this.h1_Invest_In_What_Matters_Most;
    await el.click();
  }

  /** Click h1_Global_Atlantic_At_A_Glance */
  async clickH1GlobalAtlanticAtAGlance() {
    const el = await this.h1_Global_Atlantic_At_A_Glance;
    await el.click();
  }

  /** Click h1_Building_ForeIncome_II_For_Tom */
  async clickH1BuildingForeincomeIiForTom() {
    const el = await this.h1_Building_ForeIncome_II_For_Tom;
    await el.click();
  }

  /** Click nav_6 */
  async clickNav6() {
    const el = await this.nav_6;
    await el.click();
  }

  /** Click ol_7 */
  async clickOl7() {
    const el = await this.ol_7;
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
