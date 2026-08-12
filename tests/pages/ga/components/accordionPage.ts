import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/accordionPage.locators.json'));

export class AccordionPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/accordion.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/accordion.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for button_WhatIs_Global_Atlantic */
  get button_WhatIs_Global_Atlantic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_WhatIs_Global_Atlantic);
  }

  /** Locator for button_HowDo_IContactCustomerServ */
  get button_HowDo_IContactCustomerServ(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_HowDo_IContactCustomerServ);
  }

  /** Locator for button_2 */
  get button_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_2);
  }

  /** Locator for button_WhereCan_IFindMyPolicyDoc */
  get button_WhereCan_IFindMyPolicyDoc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_WhereCan_IFindMyPolicyDoc);
  }

  /** Locator for button_Corporate_Pension_Plans */
  get button_Corporate_Pension_Plans(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Corporate_Pension_Plans);
  }

  /** Locator for button_Public_Pension_Plans */
  get button_Public_Pension_Plans(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Public_Pension_Plans);
  }

  /** Locator for button_Sovereign_Wealth_Funds */
  get button_Sovereign_Wealth_Funds(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Sovereign_Wealth_Funds);
  }

  /** Locator for button_Insurance_Companies */
  get button_Insurance_Companies(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Insurance_Companies);
  }

  /** Locator for button_Endowments_Foundations */
  get button_Endowments_Foundations(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Endowments_Foundations);
  }

  /** Locator for button_Health_Care_Organizations */
  get button_Health_Care_Organizations(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Health_Care_Organizations);
  }

  /** Locator for span_WhatIs_Global_Atlantic */
  get span_WhatIs_Global_Atlantic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_WhatIs_Global_Atlantic);
  }

  /** Locator for span_HowDo_IContactCustomerServ */
  get span_HowDo_IContactCustomerServ(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_HowDo_IContactCustomerServ);
  }

  /** Locator for span_12 */
  get span_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_12);
  }

  /** Locator for span_WhereCan_IFindMyPolicyDoc */
  get span_WhereCan_IFindMyPolicyDoc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_WhereCan_IFindMyPolicyDoc);
  }

  /** Locator for span_Corporate_Pension_Plans */
  get span_Corporate_Pension_Plans(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Corporate_Pension_Plans);
  }

  /** Locator for span_Public_Pension_Plans */
  get span_Public_Pension_Plans(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Public_Pension_Plans);
  }

  /** Locator for span_Sovereign_Wealth_Funds */
  get span_Sovereign_Wealth_Funds(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Sovereign_Wealth_Funds);
  }

  /** Locator for span_Insurance_Companies */
  get span_Insurance_Companies(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Insurance_Companies);
  }

  /** Locator for span_Endowments_Foundations */
  get span_Endowments_Foundations(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Endowments_Foundations);
  }

  /** Locator for span_Health_Care_Organizations */
  get span_Health_Care_Organizations(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Health_Care_Organizations);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for accordionItem_7bcebf78d9 */
  get accordionItem_7bcebf78d9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_7bcebf78d9);
  }

  /** Locator for accordionItem_7bcebf78d9Panel */
  get accordionItem_7bcebf78d9Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_7bcebf78d9Panel);
  }

  /** Locator for div_WhatIs_Global_Atlantic */
  get div_WhatIs_Global_Atlantic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_WhatIs_Global_Atlantic);
  }

  /** Locator for div_24 */
  get div_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_24);
  }

  /** Locator for svg_25 */
  get svg_25(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.svg_25);
  }

  /** Locator for div_26 */
  get div_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_26);
  }

  /** Locator for div_27 */
  get div_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_27);
  }

  /** Locator for accordionItemF96058c61b */
  get accordionItemF96058c61b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemF96058c61b);
  }

  /** Locator for accordionItemF96058c61bPanel */
  get accordionItemF96058c61bPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemF96058c61bPanel);
  }

  /** Locator for div_HowDo_IContactCustomerServ */
  get div_HowDo_IContactCustomerServ(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_HowDo_IContactCustomerServ);
  }

  /** Locator for div_31 */
  get div_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_31);
  }

  /** Locator for accordionItemE92b3cd16d */
  get accordionItemE92b3cd16d(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemE92b3cd16d);
  }

  /** Locator for accordionItemE92b3cd16dPanel */
  get accordionItemE92b3cd16dPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemE92b3cd16dPanel);
  }

  /** Locator for div_34 */
  get div_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_34);
  }

  /** Locator for div_35 */
  get div_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_35);
  }

  /** Locator for accordionItem_139cc6958a */
  get accordionItem_139cc6958a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_139cc6958a);
  }

  /** Locator for accordionItem_139cc6958aPanel */
  get accordionItem_139cc6958aPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_139cc6958aPanel);
  }

  /** Locator for div_WhereCan_IFindMyPolicyDoc */
  get div_WhereCan_IFindMyPolicyDoc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_WhereCan_IFindMyPolicyDoc);
  }

  /** Locator for div_39 */
  get div_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_39);
  }

  /** Locator for div_40 */
  get div_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_40);
  }

  /** Locator for accordionItemA3f45cd64a */
  get accordionItemA3f45cd64a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemA3f45cd64a);
  }

  /** Locator for accordionItemA3f45cd64aPanel */
  get accordionItemA3f45cd64aPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemA3f45cd64aPanel);
  }

  /** Locator for div_Corporate_Pension_Plans */
  get div_Corporate_Pension_Plans(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Corporate_Pension_Plans);
  }

  /** Locator for div_44 */
  get div_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_44);
  }

  /** Locator for accordionItemCfae96c9ec */
  get accordionItemCfae96c9ec(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemCfae96c9ec);
  }

  /** Locator for accordionItemCfae96c9ecPanel */
  get accordionItemCfae96c9ecPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemCfae96c9ecPanel);
  }

  /** Locator for div_Public_Pension_Plans */
  get div_Public_Pension_Plans(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Public_Pension_Plans);
  }

  /** Locator for div_48 */
  get div_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_48);
  }

  /** Locator for accordionItem_0765808f57 */
  get accordionItem_0765808f57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_0765808f57);
  }

  /** Locator for accordionItem_0765808f57Panel */
  get accordionItem_0765808f57Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_0765808f57Panel);
  }

  /** Locator for div_Sovereign_Wealth_Funds */
  get div_Sovereign_Wealth_Funds(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Sovereign_Wealth_Funds);
  }

  /** Locator for div_52 */
  get div_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_52);
  }

  /** Locator for div_53 */
  get div_53(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_53);
  }

  /** Locator for accordionItem_769a592d51 */
  get accordionItem_769a592d51(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_769a592d51);
  }

  /** Locator for accordionItem_769a592d51Panel */
  get accordionItem_769a592d51Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_769a592d51Panel);
  }

  /** Locator for div_Insurance_Companies */
  get div_Insurance_Companies(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Insurance_Companies);
  }

  /** Locator for div_57 */
  get div_57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_57);
  }

  /** Locator for accordionItem_2e8d31b3a6 */
  get accordionItem_2e8d31b3a6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_2e8d31b3a6);
  }

  /** Locator for accordionItem_2e8d31b3a6Panel */
  get accordionItem_2e8d31b3a6Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_2e8d31b3a6Panel);
  }

  /** Locator for div_Endowments_Foundations */
  get div_Endowments_Foundations(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Endowments_Foundations);
  }

  /** Locator for div_61 */
  get div_61(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_61);
  }

  /** Locator for accordionItem_590b2cc446 */
  get accordionItem_590b2cc446(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_590b2cc446);
  }

  /** Locator for accordionItem_590b2cc446Panel */
  get accordionItem_590b2cc446Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_590b2cc446Panel);
  }

  /** Locator for div_Health_Care_Organizations */
  get div_Health_Care_Organizations(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Health_Care_Organizations);
  }

  /** Locator for div_65 */
  get div_65(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_65);
  }

  // --- Actions ---

  /** Click button_WhatIs_Global_Atlantic */
  async clickButtonWhatisGlobalAtlantic() {
    const el = await this.button_WhatIs_Global_Atlantic;
    await el.click();
  }

  /** Click button_HowDo_IContactCustomerServ */
  async clickButtonHowdoIcontactcustomerserv() {
    const el = await this.button_HowDo_IContactCustomerServ;
    await el.click();
  }

  /** Click button_2 */
  async clickButton2() {
    const el = await this.button_2;
    await el.click();
  }

  /** Click button_WhereCan_IFindMyPolicyDoc */
  async clickButtonWherecanIfindmypolicydoc() {
    const el = await this.button_WhereCan_IFindMyPolicyDoc;
    await el.click();
  }

  /** Click button_Corporate_Pension_Plans */
  async clickButtonCorporatePensionPlans() {
    const el = await this.button_Corporate_Pension_Plans;
    await el.click();
  }

  /** Click button_Public_Pension_Plans */
  async clickButtonPublicPensionPlans() {
    const el = await this.button_Public_Pension_Plans;
    await el.click();
  }

  /** Click button_Sovereign_Wealth_Funds */
  async clickButtonSovereignWealthFunds() {
    const el = await this.button_Sovereign_Wealth_Funds;
    await el.click();
  }

  /** Click button_Insurance_Companies */
  async clickButtonInsuranceCompanies() {
    const el = await this.button_Insurance_Companies;
    await el.click();
  }

  /** Click button_Endowments_Foundations */
  async clickButtonEndowmentsFoundations() {
    const el = await this.button_Endowments_Foundations;
    await el.click();
  }

  /** Click button_Health_Care_Organizations */
  async clickButtonHealthCareOrganizations() {
    const el = await this.button_Health_Care_Organizations;
    await el.click();
  }
}
