import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'accordionPage.locators.json'));

export class AccordionPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/accordion.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for button_WhatIs_Global_Atlantic */
  get button_WhatIs_Global_Atlantic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_WhatIs_Global_Atlantic);
  }

  /** Locator for button_HowDo_IContactCustomerServ */
  get button_HowDo_IContactCustomerServ(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_HowDo_IContactCustomerServ);
  }

  /** Locator for f5a1a9051a8d4c52bf83deaacfb86401 */
  get f5a1a9051a8d4c52bf83deaacfb86401(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.f5a1a9051a8d4c52bf83deaacfb86401);
  }

  /** Locator for button_WhereCan_IFindMyPolicyDoc */
  get button_WhereCan_IFindMyPolicyDoc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_WhereCan_IFindMyPolicyDoc);
  }

  /** Locator for button_SingleExpansionModeExample */
  get button_SingleExpansionModeExample(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_SingleExpansionModeExample);
  }

  /** Locator for button_HowDoesSingleExpansionWork */
  get button_HowDoesSingleExpansionWork(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_HowDoesSingleExpansionWork);
  }

  /** Locator for el2667027661d04d6682d7782a3c576df4 */
  get el2667027661d04d6682d7782a3c576df4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el2667027661d04d6682d7782a3c576df4);
  }

  /** Locator for button_DarkBackgroundAccordionItem */
  get button_DarkBackgroundAccordionItem(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_DarkBackgroundAccordionItem);
  }

  /** Locator for button_HowDoDarkBackgroundStyles_ */
  get button_HowDoDarkBackgroundStyles_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_HowDoDarkBackgroundStyles_);
  }

  /** Locator for button_IsTheIconAnimationTheSame */
  get button_IsTheIconAnimationTheSame(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_IsTheIconAnimationTheSame);
  }

  /** Locator for button_AzulBackgroundAccordionItem */
  get button_AzulBackgroundAccordionItem(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_AzulBackgroundAccordionItem);
  }

  /** Locator for button_AnotherAccordionItemOnAzul */
  get button_AnotherAccordionItemOnAzul(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_AnotherAccordionItemOnAzul);
  }

  /** Locator for accordionItem_7bcebf78d9Panel */
  get accordionItem_7bcebf78d9Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_7bcebf78d9Panel);
  }

  /** Locator for fd8b24fd82984d84904e505e54ca5327 */
  get fd8b24fd82984d84904e505e54ca5327(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.fd8b24fd82984d84904e505e54ca5327);
  }

  /** Locator for accordionItemF96058c61bPanel */
  get accordionItemF96058c61bPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemF96058c61bPanel);
  }

  /** Locator for el2c73a685e6c14760b7875fe7ab447cd8 */
  get el2c73a685e6c14760b7875fe7ab447cd8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el2c73a685e6c14760b7875fe7ab447cd8);
  }

  /** Locator for accordionItemE92b3cd16dPanel */
  get accordionItemE92b3cd16dPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemE92b3cd16dPanel);
  }

  /** Locator for el531fd91b5b464ef091b4a24043ec0b9b */
  get el531fd91b5b464ef091b4a24043ec0b9b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el531fd91b5b464ef091b4a24043ec0b9b);
  }

  /** Locator for accordionItem_139cc6958aPanel */
  get accordionItem_139cc6958aPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_139cc6958aPanel);
  }

  /** Locator for el1c0c5c9513fb4b5b97e97c0c543c69e1 */
  get el1c0c5c9513fb4b5b97e97c0c543c69e1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el1c0c5c9513fb4b5b97e97c0c543c69e1);
  }

  /** Locator for accordionItemA3f45cd64aPanel */
  get accordionItemA3f45cd64aPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemA3f45cd64aPanel);
  }

  /** Locator for b36d86405f5b49d48080eb0195066610 */
  get b36d86405f5b49d48080eb0195066610(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.b36d86405f5b49d48080eb0195066610);
  }

  /** Locator for accordionItemCfae96c9ecPanel */
  get accordionItemCfae96c9ecPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemCfae96c9ecPanel);
  }

  /** Locator for e091e79310e8414ba2b38615833cf056 */
  get e091e79310e8414ba2b38615833cf056(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.e091e79310e8414ba2b38615833cf056);
  }

  /** Locator for accordionItem_0765808f57Panel */
  get accordionItem_0765808f57Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_0765808f57Panel);
  }

  /** Locator for el060da03dc95c4fb2884d72efc391b9dc */
  get el060da03dc95c4fb2884d72efc391b9dc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el060da03dc95c4fb2884d72efc391b9dc);
  }

  /** Locator for accordionItem_769a592d51Panel */
  get accordionItem_769a592d51Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_769a592d51Panel);
  }

  /** Locator for el2a9b45692f2c43a7b1da2189387308ee */
  get el2a9b45692f2c43a7b1da2189387308ee(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el2a9b45692f2c43a7b1da2189387308ee);
  }

  /** Locator for accordionItem_2e8d31b3a6Panel */
  get accordionItem_2e8d31b3a6Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_2e8d31b3a6Panel);
  }

  /** Locator for c2f9114a542a478eae5fcab39451ddd6 */
  get c2f9114a542a478eae5fcab39451ddd6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.c2f9114a542a478eae5fcab39451ddd6);
  }

  /** Locator for accordionItem_590b2cc446Panel */
  get accordionItem_590b2cc446Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_590b2cc446Panel);
  }

  /** Locator for el371c1276b2da4216a20c39e8ce107e11 */
  get el371c1276b2da4216a20c39e8ce107e11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el371c1276b2da4216a20c39e8ce107e11);
  }

  /** Locator for accordionItem_60d74c83b5Panel */
  get accordionItem_60d74c83b5Panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_60d74c83b5Panel);
  }

  /** Locator for el9658c6dfe3dd470aa51dc8fbb2c00996 */
  get el9658c6dfe3dd470aa51dc8fbb2c00996(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el9658c6dfe3dd470aa51dc8fbb2c00996);
  }

  /** Locator for accordionItemF44480987fPanel */
  get accordionItemF44480987fPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemF44480987fPanel);
  }

  /** Locator for c4e15c23df484fcaaffec099c42cc6e5 */
  get c4e15c23df484fcaaffec099c42cc6e5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.c4e15c23df484fcaaffec099c42cc6e5);
  }

  /** Locator for div_36 */
  get div_36(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_36);
  }

  /** Locator for accordionItem_7bcebf78d9 */
  get accordionItem_7bcebf78d9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_7bcebf78d9);
  }

  /** Locator for div_WhatIs_Global_Atlantic */
  get div_WhatIs_Global_Atlantic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_WhatIs_Global_Atlantic);
  }

  /** Locator for span_39 */
  get span_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_39);
  }

  /** Locator for span_40 */
  get span_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_40);
  }

  /** Locator for span_41 */
  get span_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_41);
  }

  /** Locator for accordionItemF96058c61b */
  get accordionItemF96058c61b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemF96058c61b);
  }

  /** Locator for div_HowDo_IContactCustomerServ */
  get div_HowDo_IContactCustomerServ(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_HowDo_IContactCustomerServ);
  }

  /** Locator for accordionItemE92b3cd16d */
  get accordionItemE92b3cd16d(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemE92b3cd16d);
  }

  /** Locator for div_45 */
  get div_45(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_45);
  }

  /** Locator for accordionItem_139cc6958a */
  get accordionItem_139cc6958a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_139cc6958a);
  }

  /** Locator for div_WhereCan_IFindMyPolicyDoc */
  get div_WhereCan_IFindMyPolicyDoc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_WhereCan_IFindMyPolicyDoc);
  }

  /** Locator for div_48 */
  get div_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_48);
  }

  /** Locator for accordionItemA3f45cd64a */
  get accordionItemA3f45cd64a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemA3f45cd64a);
  }

  /** Locator for div_SingleExpansionModeExample */
  get div_SingleExpansionModeExample(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_SingleExpansionModeExample);
  }

  /** Locator for accordionItemCfae96c9ec */
  get accordionItemCfae96c9ec(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemCfae96c9ec);
  }

  /** Locator for div_HowDoesSingleExpansionWork */
  get div_HowDoesSingleExpansionWork(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_HowDoesSingleExpansionWork);
  }

  /** Locator for accordionItem_0765808f57 */
  get accordionItem_0765808f57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_0765808f57);
  }

  /** Locator for div_54 */
  get div_54(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_54);
  }

  /** Locator for div_55 */
  get div_55(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_55);
  }

  /** Locator for accordionItem_769a592d51 */
  get accordionItem_769a592d51(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_769a592d51);
  }

  /** Locator for div_DarkBackgroundAccordionItem */
  get div_DarkBackgroundAccordionItem(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_DarkBackgroundAccordionItem);
  }

  /** Locator for accordionItem_2e8d31b3a6 */
  get accordionItem_2e8d31b3a6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_2e8d31b3a6);
  }

  /** Locator for div_HowDoDarkBackgroundStyles_ */
  get div_HowDoDarkBackgroundStyles_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_HowDoDarkBackgroundStyles_);
  }

  /** Locator for accordionItem_590b2cc446 */
  get accordionItem_590b2cc446(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_590b2cc446);
  }

  /** Locator for div_IsTheIconAnimationTheSame */
  get div_IsTheIconAnimationTheSame(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_IsTheIconAnimationTheSame);
  }

  /** Locator for div_62 */
  get div_62(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_62);
  }

  /** Locator for accordionItem_60d74c83b5 */
  get accordionItem_60d74c83b5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItem_60d74c83b5);
  }

  /** Locator for div_AzulBackgroundAccordionItem */
  get div_AzulBackgroundAccordionItem(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_AzulBackgroundAccordionItem);
  }

  /** Locator for accordionItemF44480987f */
  get accordionItemF44480987f(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionItemF44480987f);
  }

  /** Locator for div_AnotherAccordionItemOnAzul */
  get div_AnotherAccordionItemOnAzul(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_AnotherAccordionItemOnAzul);
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

  /** Click f5a1a9051a8d4c52bf83deaacfb86401 */
  async clickF5a1a9051a8d4c52bf83deaacfb86401() {
    const el = await this.f5a1a9051a8d4c52bf83deaacfb86401;
    await el.click();
  }

  /** Click button_WhereCan_IFindMyPolicyDoc */
  async clickButtonWherecanIfindmypolicydoc() {
    const el = await this.button_WhereCan_IFindMyPolicyDoc;
    await el.click();
  }

  /** Click button_SingleExpansionModeExample */
  async clickButtonSingleexpansionmodeexample() {
    const el = await this.button_SingleExpansionModeExample;
    await el.click();
  }

  /** Click button_HowDoesSingleExpansionWork */
  async clickButtonHowdoessingleexpansionwork() {
    const el = await this.button_HowDoesSingleExpansionWork;
    await el.click();
  }

  /** Click el2667027661d04d6682d7782a3c576df4 */
  async clickEl2667027661d04d6682d7782a3c576df4() {
    const el = await this.el2667027661d04d6682d7782a3c576df4;
    await el.click();
  }

  /** Click button_DarkBackgroundAccordionItem */
  async clickButtonDarkbackgroundaccordionitem() {
    const el = await this.button_DarkBackgroundAccordionItem;
    await el.click();
  }

  /** Click button_HowDoDarkBackgroundStyles_ */
  async clickButtonHowdodarkbackgroundstyles() {
    const el = await this.button_HowDoDarkBackgroundStyles_;
    await el.click();
  }

  /** Click button_IsTheIconAnimationTheSame */
  async clickButtonIstheiconanimationthesame() {
    const el = await this.button_IsTheIconAnimationTheSame;
    await el.click();
  }
}
