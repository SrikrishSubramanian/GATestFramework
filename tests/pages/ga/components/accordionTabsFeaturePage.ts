import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'accordionTabsFeaturePage.locators.json'));

export class AccordionTabsFeaturePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for aContentglobalatlanticstyleguid */
  get aContentglobalatlanticstyleguid(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.aContentglobalatlanticstyleguid);
  }

  /** Locator for h2_1 */
  get h2_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_1);
  }

  /** Locator for ol_2 */
  get ol_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_2);
  }

  /** Locator for ol_3 */
  get ol_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_3);
  }

  /** Locator for ol_4 */
  get ol_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_4);
  }

  /** Locator for li_Investment_Strategy */
  get li_Investment_Strategy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Investment_Strategy);
  }

  /** Locator for li_Portfolio_Management */
  get li_Portfolio_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Portfolio_Management);
  }

  /** Locator for li_Risk_Assessment */
  get li_Risk_Assessment(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Risk_Assessment);
  }

  /** Locator for accordionTabCbe058cfe6 */
  get accordionTabCbe058cfe6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabCbe058cfe6);
  }

  /** Locator for accordionTabB58b139277 */
  get accordionTabB58b139277(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabB58b139277);
  }

  /** Locator for accordionTab_2cb0f20a56 */
  get accordionTab_2cb0f20a56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_2cb0f20a56);
  }

  /** Locator for li_Discover */
  get li_Discover(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Discover);
  }

  /** Locator for li_Evaluate */
  get li_Evaluate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Evaluate);
  }

  /** Locator for li_Execute */
  get li_Execute(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Execute);
  }

  /** Locator for accordionTab_247651daa6 */
  get accordionTab_247651daa6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_247651daa6);
  }

  /** Locator for accordionTab_358981e219 */
  get accordionTab_358981e219(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_358981e219);
  }

  /** Locator for accordionTab_1c86a17c0e */
  get accordionTab_1c86a17c0e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_1c86a17c0e);
  }

  /** Locator for li_Financial_Strength */
  get li_Financial_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Financial_Strength);
  }

  /** Locator for li_Expert_Team */
  get li_Expert_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Expert_Team);
  }

  /** Locator for li_Innovation_Focus */
  get li_Innovation_Focus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Innovation_Focus);
  }

  /** Locator for accordionTab_684bf12147 */
  get accordionTab_684bf12147(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_684bf12147);
  }

  /** Locator for accordionTab_4030f728d5 */
  get accordionTab_4030f728d5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_4030f728d5);
  }

  /** Locator for accordionTabD3a71b7036 */
  get accordionTabD3a71b7036(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabD3a71b7036);
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

  /** Locator for div_26 */
  get div_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_26);
  }

  /** Locator for div_27 */
  get div_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_27);
  }

  /** Locator for div_28 */
  get div_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_28);
  }

  /** Locator for div_Investment_Strategy */
  get div_Investment_Strategy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Investment_Strategy);
  }

  /** Locator for div_30 */
  get div_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30);
  }

  /** Locator for divContentglobalatlanticstyleguid */
  get divContentglobalatlanticstyleguid(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.divContentglobalatlanticstyleguid);
  }

  /** Locator for spanContentglobalatlanticstyleguid */
  get spanContentglobalatlanticstyleguid(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.spanContentglobalatlanticstyleguid);
  }

  /** Locator for div_33 */
  get div_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_33);
  }

  /** Locator for div_34 */
  get div_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_34);
  }

  /** Locator for div_35 */
  get div_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_35);
  }

  /** Locator for div_Portfolio_Management */
  get div_Portfolio_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Portfolio_Management);
  }

  /** Locator for div_37 */
  get div_37(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_37);
  }

  /** Locator for div_38 */
  get div_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_38);
  }

  /** Locator for div_Risk_Assessment */
  get div_Risk_Assessment(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Risk_Assessment);
  }

  /** Locator for div_40 */
  get div_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_40);
  }

  /** Locator for div_41 */
  get div_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_41);
  }

  /** Locator for div_42 */
  get div_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_42);
  }

  /** Locator for div_43 */
  get div_43(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_43);
  }

  /** Locator for div_44 */
  get div_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_44);
  }

  /** Locator for div_Discover */
  get div_Discover(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Discover);
  }

  /** Locator for div_46 */
  get div_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_46);
  }

  /** Locator for div_47 */
  get div_47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_47);
  }

  /** Locator for div_Evaluate */
  get div_Evaluate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Evaluate);
  }

  /** Locator for div_49 */
  get div_49(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_49);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for div_Execute */
  get div_Execute(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Execute);
  }

  /** Locator for div_52 */
  get div_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_52);
  }

  /** Locator for div_53 */
  get div_53(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_53);
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

  /** Locator for div_Financial_Strength */
  get div_Financial_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Financial_Strength);
  }

  /** Locator for div_58 */
  get div_58(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_58);
  }

  /** Locator for div_59 */
  get div_59(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_59);
  }

  /** Locator for div_Expert_Team */
  get div_Expert_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Expert_Team);
  }

  /** Locator for div_61 */
  get div_61(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_61);
  }

  /** Locator for div_62 */
  get div_62(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_62);
  }

  /** Locator for div_Innovation_Focus */
  get div_Innovation_Focus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Innovation_Focus);
  }

  /** Locator for div_64 */
  get div_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_64);
  }

  // --- Actions ---

  /** Click aContentglobalatlanticstyleguid */
  async clickAcontentglobalatlanticstyleguid() {
    const el = await this.aContentglobalatlanticstyleguid;
    await el.click();
  }

  /** Click h2_1 */
  async clickH21() {
    const el = await this.h2_1;
    await el.click();
  }

  /** Click ol_2 */
  async clickOl2() {
    const el = await this.ol_2;
    await el.click();
  }

  /** Click ol_3 */
  async clickOl3() {
    const el = await this.ol_3;
    await el.click();
  }

  /** Click ol_4 */
  async clickOl4() {
    const el = await this.ol_4;
    await el.click();
  }

  /** Click li_Investment_Strategy */
  async clickLiInvestmentStrategy() {
    const el = await this.li_Investment_Strategy;
    await el.click();
  }

  /** Click li_Portfolio_Management */
  async clickLiPortfolioManagement() {
    const el = await this.li_Portfolio_Management;
    await el.click();
  }

  /** Click li_Risk_Assessment */
  async clickLiRiskAssessment() {
    const el = await this.li_Risk_Assessment;
    await el.click();
  }

  /** Click accordionTabCbe058cfe6 */
  async clickAccordiontabcbe058cfe6() {
    const el = await this.accordionTabCbe058cfe6;
    await el.click();
  }

  /** Click accordionTabB58b139277 */
  async clickAccordiontabb58b139277() {
    const el = await this.accordionTabB58b139277;
    await el.click();
  }
}
