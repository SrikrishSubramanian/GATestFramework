import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'tabsPage.locators.json'));

export class TabsPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/tabs.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for h2_0 */
  get h2_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_0);
  }

  /** Locator for h2_Test_3 */
  get h2_Test_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Test_3);
  }

  /** Locator for h2_Test_4 */
  get h2_Test_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Test_4);
  }

  /** Locator for h2_Test_5 */
  get h2_Test_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Test_5);
  }

  /** Locator for h2_Test_6 */
  get h2_Test_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Test_6);
  }

  /** Locator for ol_5 */
  get ol_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_5);
  }

  /** Locator for li_DeferYourTaxes */
  get li_DeferYourTaxes(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_DeferYourTaxes);
  }

  /** Locator for li_GrowYourMoney */
  get li_GrowYourMoney(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_GrowYourMoney);
  }

  /** Locator for li_ProvideIncomeOpportunities */
  get li_ProvideIncomeOpportunities(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ProvideIncomeOpportunities);
  }

  /** Locator for li_PrepareForYourLongtermCare */
  get li_PrepareForYourLongtermCare(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_PrepareForYourLongtermCare);
  }

  /** Locator for li_LeaveYourLegacy */
  get li_LeaveYourLegacy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_LeaveYourLegacy);
  }

  /** Locator for li_LoremIpsumDolor */
  get li_LoremIpsumDolor(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_LoremIpsumDolor);
  }

  /** Locator for headlineBlock_2308fada47 */
  get headlineBlock_2308fada47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.headlineBlock_2308fada47);
  }

  /** Locator for headlineBlock_0f17881bfa */
  get headlineBlock_0f17881bfa(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.headlineBlock_0f17881bfa);
  }

  /** Locator for headlineBlockE4a7e0874b */
  get headlineBlockE4a7e0874b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.headlineBlockE4a7e0874b);
  }

  /** Locator for headlineBlock_21426baa55 */
  get headlineBlock_21426baa55(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.headlineBlock_21426baa55);
  }

  /** Locator for headlineBlockB70d6e0cc4 */
  get headlineBlockB70d6e0cc4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.headlineBlockB70d6e0cc4);
  }

  /** Locator for headlineBlock_35351ea611 */
  get headlineBlock_35351ea611(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.headlineBlock_35351ea611);
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

  /** Locator for div_OptionalEyebrow */
  get div_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_OptionalEyebrow);
  }

  /** Locator for div_23 */
  get div_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_23);
  }

  /** Locator for div_24 */
  get div_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_24);
  }

  /** Locator for div_HB2 */
  get div_HB2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_HB2);
  }

  /** Locator for div_Test_3 */
  get div_Test_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_3);
  }

  /** Locator for div_Test_3_27 */
  get div_Test_3_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_3_27);
  }

  /** Locator for div_Test_4 */
  get div_Test_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_4);
  }

  /** Locator for div_Test_4_29 */
  get div_Test_4_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_4_29);
  }

  /** Locator for div_Test_5 */
  get div_Test_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_5);
  }

  /** Locator for div_Test_5_31 */
  get div_Test_5_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_5_31);
  }

  /** Locator for div_Test_6 */
  get div_Test_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_6);
  }

  /** Locator for div_Test_6_33 */
  get div_Test_6_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_6_33);
  }

  // --- Actions ---

  /** Click h2_0 */
  async clickH20() {
    const el = await this.h2_0;
    await el.click();
  }

  /** Click h2_Test_3 */
  async clickH2Test3() {
    const el = await this.h2_Test_3;
    await el.click();
  }

  /** Click h2_Test_4 */
  async clickH2Test4() {
    const el = await this.h2_Test_4;
    await el.click();
  }

  /** Click h2_Test_5 */
  async clickH2Test5() {
    const el = await this.h2_Test_5;
    await el.click();
  }

  /** Click h2_Test_6 */
  async clickH2Test6() {
    const el = await this.h2_Test_6;
    await el.click();
  }

  /** Click ol_5 */
  async clickOl5() {
    const el = await this.ol_5;
    await el.click();
  }

  /** Click li_DeferYourTaxes */
  async clickLiDeferyourtaxes() {
    const el = await this.li_DeferYourTaxes;
    await el.click();
  }

  /** Click li_GrowYourMoney */
  async clickLiGrowyourmoney() {
    const el = await this.li_GrowYourMoney;
    await el.click();
  }

  /** Click li_ProvideIncomeOpportunities */
  async clickLiProvideincomeopportunities() {
    const el = await this.li_ProvideIncomeOpportunities;
    await el.click();
  }

  /** Click li_PrepareForYourLongtermCare */
  async clickLiPrepareforyourlongtermcare() {
    const el = await this.li_PrepareForYourLongtermCare;
    await el.click();
  }
}
