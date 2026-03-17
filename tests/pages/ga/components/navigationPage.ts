import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'navigationPage.locators.json'));

export class NavigationPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/navigation.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for Corporate_Agnostic */
  get Corporate_Agnostic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic);
  }

  /** Locator for Main */
  get Main(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main);
  }

  /** Locator for English */
  get English(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English);
  }

  /** Locator for Financial_Professionals */
  get Financial_Professionals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals);
  }

  /** Locator for Individuals */
  get Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals);
  }

  /** Locator for Preneed */
  get Preneed(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed);
  }

  /** Locator for Style_Guide */
  get Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide);
  }

  /** Locator for Branding */
  get Branding(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding);
  }

  /** Locator for Templates */
  get Templates(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates);
  }

  /** Locator for Homepage_Template */
  get Homepage_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template);
  }

  /** Locator for Rate_Admin_Template */
  get Rate_Admin_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template);
  }

  /** Locator for Component_Library */
  get Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library);
  }

  /** Locator for Tabs */
  get Tabs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs);
  }

  /** Locator for Form_Options */
  get Form_Options(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options);
  }

  /** Locator for RTE_Table */
  get RTE_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table);
  }

  /** Locator for Accordion */
  get Accordion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion);
  }

  /** Locator for Rating_Card */
  get Rating_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rating_Card);
  }

  /** Locator for Hero_5050 */
  get Hero_5050(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050);
  }

  /** Locator for Navigation */
  get Navigation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation);
  }

  /** Locator for Accordion_Tabs_Feature */
  get Accordion_Tabs_Feature(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature);
  }

  /** Locator for Brand_Relationship */
  get Brand_Relationship(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship);
  }

  /** Locator for Button */
  get Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button);
  }

  /** Locator for Content_Trail */
  get Content_Trail(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail);
  }

  /** Locator for Feature_Banner */
  get Feature_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner);
  }

  /** Locator for Grid_Container */
  get Grid_Container(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container);
  }

  /** Locator for Homepage_Hero */
  get Homepage_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero);
  }

  /** Locator for Image_With_Nested_Content */
  get Image_With_Nested_Content(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content);
  }

  /** Locator for Rate_Sheet_Grid */
  get Rate_Sheet_Grid(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid);
  }

  /** Locator for Ratings_Card */
  get Ratings_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card);
  }

  /** Locator for Role_Selector */
  get Role_Selector(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Role_Selector);
  }

  /** Locator for Section */
  get Section(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section);
  }

  /** Locator for Separator */
  get Separator(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator);
  }

  /** Locator for Spacer */
  get Spacer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer);
  }

  /** Locator for Statistic */
  get Statistic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic);
  }

  /** Locator for Text */
  get Text(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text);
  }

  /** Locator for Video_External */
  get Video_External(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External);
  }

  /** Locator for ul_36 */
  get ul_36(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_36);
  }

  /** Locator for ul_37 */
  get ul_37(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_37);
  }

  /** Locator for ul_English */
  get ul_English(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English);
  }

  /** Locator for ul_39 */
  get ul_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_39);
  }

  /** Locator for ul_40 */
  get ul_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_40);
  }

  /** Locator for ul_41 */
  get ul_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_41);
  }

  /** Locator for ul_Button */
  get ul_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_Button);
  }

  /** Locator for navigationD95ec9c1a1Item_83f7afdff6 */
  get navigationD95ec9c1a1Item_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_83f7afdff6);
  }

  /** Locator for Corporate_Agnostic_44 */
  get Corporate_Agnostic_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_44);
  }

  /** Locator for navigationD95ec9c1a1ItemC131db0ef8 */
  get navigationD95ec9c1a1ItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemC131db0ef8);
  }

  /** Locator for Main_46 */
  get Main_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_46);
  }

  /** Locator for li_English */
  get li_English(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English);
  }

  /** Locator for English_48 */
  get English_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_48);
  }

  /** Locator for navigationD95ec9c1a1ItemCc78444b86 */
  get navigationD95ec9c1a1ItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemCc78444b86);
  }

  /** Locator for Financial_Professionals_50 */
  get Financial_Professionals_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_50);
  }

  /** Locator for navigationD95ec9c1a1Item_0e452ee23a */
  get navigationD95ec9c1a1Item_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_0e452ee23a);
  }

  /** Locator for Individuals_52 */
  get Individuals_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_52);
  }

  /** Locator for navigationD95ec9c1a1Item_047745266e */
  get navigationD95ec9c1a1Item_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_047745266e);
  }

  /** Locator for Preneed_54 */
  get Preneed_54(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_54);
  }

  /** Locator for navigationD95ec9c1a1Item_3dd3bf6e7a */
  get navigationD95ec9c1a1Item_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_3dd3bf6e7a);
  }

  /** Locator for Style_Guide_56 */
  get Style_Guide_56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_56);
  }

  /** Locator for li_Branding */
  get li_Branding(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Branding);
  }

  /** Locator for Branding_58 */
  get Branding_58(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_58);
  }

  /** Locator for navigationD95ec9c1a1ItemF52820d1fe */
  get navigationD95ec9c1a1ItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemF52820d1fe);
  }

  /** Locator for Templates_60 */
  get Templates_60(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_60);
  }

  /** Locator for li_Homepage_Template */
  get li_Homepage_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Template);
  }

  /** Locator for Homepage_Template_62 */
  get Homepage_Template_62(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_62);
  }

  /** Locator for li_Rate_Admin_Template */
  get li_Rate_Admin_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Admin_Template);
  }

  /** Locator for Rate_Admin_Template_64 */
  get Rate_Admin_Template_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_64);
  }

  /** Locator for navigationD95ec9c1a1Item_2b248a5ea1 */
  get navigationD95ec9c1a1Item_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_2b248a5ea1);
  }

  /** Locator for Component_Library_66 */
  get Component_Library_66(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_66);
  }

  /** Locator for li_Tabs */
  get li_Tabs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Tabs);
  }

  /** Locator for Tabs_68 */
  get Tabs_68(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_68);
  }

  /** Locator for li_Form_Options */
  get li_Form_Options(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Form_Options);
  }

  /** Locator for Form_Options_70 */
  get Form_Options_70(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_70);
  }

  /** Locator for li_RTE_Table */
  get li_RTE_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_RTE_Table);
  }

  /** Locator for RTE_Table_72 */
  get RTE_Table_72(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_72);
  }

  /** Locator for li_Accordion */
  get li_Accordion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion);
  }

  /** Locator for Accordion_74 */
  get Accordion_74(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_74);
  }

  /** Locator for li_Rating_Card */
  get li_Rating_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rating_Card);
  }

  /** Locator for Rating_Card_76 */
  get Rating_Card_76(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rating_Card_76);
  }

  /** Locator for li_Hero_5050 */
  get li_Hero_5050(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050);
  }

  /** Locator for Hero_5050_78 */
  get Hero_5050_78(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_78);
  }

  /** Locator for li_Navigation */
  get li_Navigation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Navigation);
  }

  /** Locator for Navigation_80 */
  get Navigation_80(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_80);
  }

  /** Locator for li_Accordion_Tabs_Feature */
  get li_Accordion_Tabs_Feature(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_Feature);
  }

  /** Locator for Accordion_Tabs_Feature_82 */
  get Accordion_Tabs_Feature_82(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_82);
  }

  /** Locator for li_Brand_Relationship */
  get li_Brand_Relationship(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Brand_Relationship);
  }

  /** Locator for Brand_Relationship_84 */
  get Brand_Relationship_84(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_84);
  }

  /** Locator for navigationD95ec9c1a1Item_04b7f5ce83 */
  get navigationD95ec9c1a1Item_04b7f5ce83(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_04b7f5ce83);
  }

  /** Locator for Button_86 */
  get Button_86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_86);
  }

  /** Locator for li_Button */
  get li_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Button);
  }

  /** Locator for li_Content_Trail */
  get li_Content_Trail(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Trail);
  }

  /** Locator for Content_Trail_89 */
  get Content_Trail_89(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_89);
  }

  /** Locator for li_Feature_Banner */
  get li_Feature_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner);
  }

  /** Locator for Feature_Banner_91 */
  get Feature_Banner_91(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_91);
  }

  /** Locator for li_Grid_Container */
  get li_Grid_Container(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Grid_Container);
  }

  /** Locator for Grid_Container_93 */
  get Grid_Container_93(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_93);
  }

  /** Locator for li_Homepage_Hero */
  get li_Homepage_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Hero);
  }

  /** Locator for Homepage_Hero_95 */
  get Homepage_Hero_95(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_95);
  }

  /** Locator for li_Image_With_Nested_Content */
  get li_Image_With_Nested_Content(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_With_Nested_Content);
  }

  /** Locator for Image_With_Nested_Content_97 */
  get Image_With_Nested_Content_97(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_97);
  }

  /** Locator for li_Rate_Sheet_Grid */
  get li_Rate_Sheet_Grid(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Sheet_Grid);
  }

  /** Locator for Rate_Sheet_Grid_99 */
  get Rate_Sheet_Grid_99(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_99);
  }

  /** Locator for li_Ratings_Card */
  get li_Ratings_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Ratings_Card);
  }

  /** Locator for Ratings_Card_101 */
  get Ratings_Card_101(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_101);
  }

  /** Locator for li_Role_Selector */
  get li_Role_Selector(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Role_Selector);
  }

  /** Locator for Role_Selector_103 */
  get Role_Selector_103(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Role_Selector_103);
  }

  /** Locator for li_Section */
  get li_Section(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Section);
  }

  /** Locator for Section_105 */
  get Section_105(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_105);
  }

  /** Locator for li_Separator */
  get li_Separator(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Separator);
  }

  /** Locator for Separator_107 */
  get Separator_107(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_107);
  }

  /** Locator for li_Spacer */
  get li_Spacer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Spacer);
  }

  /** Locator for Spacer_109 */
  get Spacer_109(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_109);
  }

  /** Locator for li_Statistic */
  get li_Statistic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Statistic);
  }

  /** Locator for Statistic_111 */
  get Statistic_111(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_111);
  }

  /** Locator for li_Text */
  get li_Text(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Text);
  }

  /** Locator for Text_113 */
  get Text_113(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_113);
  }

  /** Locator for li_Video_External */
  get li_Video_External(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Video_External);
  }

  /** Locator for Video_External_115 */
  get Video_External_115(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_115);
  }

  /** Locator for navigation_862a3a9298Item_83f7afdff6 */
  get navigation_862a3a9298Item_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_83f7afdff6);
  }

  /** Locator for navigation_862a3a9298ItemC131db0ef8 */
  get navigation_862a3a9298ItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemC131db0ef8);
  }

  /** Locator for navigation_862a3a9298ItemCc78444b86 */
  get navigation_862a3a9298ItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemCc78444b86);
  }

  /** Locator for navigation_862a3a9298Item_0e452ee23a */
  get navigation_862a3a9298Item_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_0e452ee23a);
  }

  /** Locator for navigation_862a3a9298Item_047745266e */
  get navigation_862a3a9298Item_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_047745266e);
  }

  /** Locator for navigation_862a3a9298Item_3dd3bf6e7a */
  get navigation_862a3a9298Item_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_3dd3bf6e7a);
  }

  /** Locator for navigation_862a3a9298ItemF52820d1fe */
  get navigation_862a3a9298ItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemF52820d1fe);
  }

  /** Locator for navigation_862a3a9298Item_2b248a5ea1 */
  get navigation_862a3a9298Item_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_2b248a5ea1);
  }

  // --- Actions ---

  /** Click Corporate_Agnostic */
  async clickCorporateAgnostic() {
    const el = await this.Corporate_Agnostic;
    await el.click();
  }

  /** Click Main */
  async clickMain() {
    const el = await this.Main;
    await el.click();
  }

  /** Click English */
  async clickEnglish() {
    const el = await this.English;
    await el.click();
  }

  /** Click Financial_Professionals */
  async clickFinancialProfessionals() {
    const el = await this.Financial_Professionals;
    await el.click();
  }

  /** Click Individuals */
  async clickIndividuals() {
    const el = await this.Individuals;
    await el.click();
  }

  /** Click Preneed */
  async clickPreneed() {
    const el = await this.Preneed;
    await el.click();
  }

  /** Click Style_Guide */
  async clickStyleGuide() {
    const el = await this.Style_Guide;
    await el.click();
  }

  /** Click Branding */
  async clickBranding() {
    const el = await this.Branding;
    await el.click();
  }

  /** Click Templates */
  async clickTemplates() {
    const el = await this.Templates;
    await el.click();
  }

  /** Click Homepage_Template */
  async clickHomepageTemplate() {
    const el = await this.Homepage_Template;
    await el.click();
  }
}
