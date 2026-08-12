import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/tabsPage.locators.json'));

export class TabsPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/tabs.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/tabs.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for ol_0 */
  get ol_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_0);
  }

  /** Locator for li_DeferYourTaxes */
  get li_DeferYourTaxes(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_DeferYourTaxes);
  }

  /** Locator for li_GrowYourMoney */
  get li_GrowYourMoney(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_GrowYourMoney);
  }

  /** Locator for li_IncomeOpportunities */
  get li_IncomeOpportunities(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_IncomeOpportunities);
  }

  /** Locator for li_LongtermCareNeeds */
  get li_LongtermCareNeeds(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_LongtermCareNeeds);
  }

  /** Locator for li_LeaveYourLegacy */
  get li_LeaveYourLegacy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_LeaveYourLegacy);
  }

  /** Locator for li_LoremIpsumDolor */
  get li_LoremIpsumDolor(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_LoremIpsumDolor);
  }

  /** Locator for image_7f7d722407Tab */
  get image_7f7d722407Tab(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.image_7f7d722407Tab);
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

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
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

  /** Locator for div_19 */
  get div_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_19);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for div_OptionalEyebrow */
  get div_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_OptionalEyebrow);
  }

  /** Locator for div_22 */
  get div_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_22);
  }

  /** Locator for div_23 */
  get div_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_23);
  }

  /** Locator for div_24 */
  get div_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_24);
  }

  /** Locator for div_25 */
  get div_25(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_25);
  }

  /** Locator for div_HB2 */
  get div_HB2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_HB2);
  }

  /** Locator for div_27 */
  get div_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_27);
  }

  /** Locator for div_Test_3 */
  get div_Test_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_3);
  }

  /** Locator for div_Test_3_29 */
  get div_Test_3_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_3_29);
  }

  /** Locator for div_Test_3_30 */
  get div_Test_3_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_3_30);
  }

  /** Locator for div_31 */
  get div_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_31);
  }

  /** Locator for div_Test_4 */
  get div_Test_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_4);
  }

  /** Locator for div_Test_4_33 */
  get div_Test_4_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_4_33);
  }

  /** Locator for div_Test_4_34 */
  get div_Test_4_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_4_34);
  }

  /** Locator for div_35 */
  get div_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_35);
  }

  /** Locator for div_Test_5 */
  get div_Test_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_5);
  }

  /** Locator for div_Test_5_37 */
  get div_Test_5_37(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_5_37);
  }

  /** Locator for div_Test_5_38 */
  get div_Test_5_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_5_38);
  }

  /** Locator for div_39 */
  get div_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_39);
  }

  /** Locator for div_Test_6 */
  get div_Test_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_6);
  }

  /** Locator for div_Test_6_41 */
  get div_Test_6_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_6_41);
  }

  /** Locator for div_Test_6_42 */
  get div_Test_6_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Test_6_42);
  }

  /** Locator for dialog_43 */
  get dialog_43(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_43);
  }

  /** Locator for div_44 */
  get div_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_44);
  }

  /** Locator for div_45 */
  get div_45(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_45);
  }

  // --- Actions ---

  /** Click ol_0 */
  async clickOl0() {
    const el = await this.ol_0;
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

  /** Click li_IncomeOpportunities */
  async clickLiIncomeopportunities() {
    const el = await this.li_IncomeOpportunities;
    await el.click();
  }

  /** Click li_LongtermCareNeeds */
  async clickLiLongtermcareneeds() {
    const el = await this.li_LongtermCareNeeds;
    await el.click();
  }

  /** Click li_LeaveYourLegacy */
  async clickLiLeaveyourlegacy() {
    const el = await this.li_LeaveYourLegacy;
    await el.click();
  }

  /** Click li_LoremIpsumDolor */
  async clickLiLoremipsumdolor() {
    const el = await this.li_LoremIpsumDolor;
    await el.click();
  }

  /** Click image_7f7d722407Tab */
  async clickImage7f7d722407tab() {
    const el = await this.image_7f7d722407Tab;
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
