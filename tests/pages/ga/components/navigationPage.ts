import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/navigationPage.locators.json'));

export class NavigationPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    const url = `${baseUrl}/content/global-atlantic/style-guide/components/navigation.html?wcmmode=disabled`;
    try {
      return await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(url, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for Style_Guide */
  get Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide);
  }

  /** Locator for Templates */
  get Templates(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates);
  }

  /** Locator for Freeform_Template */
  get Freeform_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template);
  }

  /** Locator for Insights_Detail_Template */
  get Insights_Detail_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template);
  }

  /** Locator for Product_Detail_Page_ */
  get Product_Detail_Page_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page_);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I */
  get Product_Rate_Page_ForeIncome_I(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I);
  }

  /** Locator for Homepage_Template */
  get Homepage_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template);
  }

  /** Locator for Rate_Admin_Template */
  get Rate_Admin_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template);
  }

  /** Locator for Branding */
  get Branding(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding);
  }

  /** Locator for Component_Library */
  get Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library);
  }

  /** Locator for Accordion */
  get Accordion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion);
  }

  /** Locator for Accordion_Tabs_Feature */
  get Accordion_Tabs_Feature(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc */
  get Accordion_Tabs_FeatureWith_Sc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He */
  get Accordion_Tabs_FeatureWith_He(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He);
  }

  /** Locator for Accordion_Tabs_FeatureWithout */
  get Accordion_Tabs_FeatureWithout(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout);
  }

  /** Locator for Alert_Banner */
  get Alert_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner);
  }

  /** Locator for Benefits_Table */
  get Benefits_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table);
  }

  /** Locator for Bio_Card */
  get Bio_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card);
  }

  /** Locator for Brand_Relationship */
  get Brand_Relationship(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship);
  }

  /** Locator for Breadcrumb */
  get Breadcrumb(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb);
  }

  /** Locator for Button */
  get Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button);
  }

  /** Locator for Button_IllustrationsAnd_Login */
  get Button_IllustrationsAnd_Login(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login);
  }

  /** Locator for Content_Highlight */
  get Content_Highlight(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight);
  }

  /** Locator for Content_Trail */
  get Content_Trail(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail);
  }

  /** Locator for Decision_Tree */
  get Decision_Tree(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree);
  }

  /** Locator for Detail_Hero */
  get Detail_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero);
  }

  /** Locator for Disclosure_List */
  get Disclosure_List(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List);
  }

  /** Locator for Enhanced_Related_Content */
  get Enhanced_Related_Content(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content);
  }

  /** Locator for Feature_Banner */
  get Feature_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner);
  }

  /** Locator for Feature_Banner_5050_Layout */
  get Feature_Banner_5050_Layout(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout);
  }

  /** Locator for Firm_Selection_Modal */
  get Firm_Selection_Modal(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal);
  }

  /** Locator for Footer_Disclosure */
  get Footer_Disclosure(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure);
  }

  /** Locator for Form_Options */
  get Form_Options(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options);
  }

  /** Locator for Grid_Container */
  get Grid_Container(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container);
  }

  /** Locator for Headline_Block */
  get Headline_Block(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block);
  }

  /** Locator for Hero_5050 */
  get Hero_5050(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050);
  }

  /** Locator for Homepage_Hero */
  get Homepage_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero);
  }

  /** Locator for Image */
  get Image(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image);
  }

  /** Locator for Image_With_Nested_Content */
  get Image_With_Nested_Content(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content);
  }

  /** Locator for In_Brief */
  get In_Brief(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief);
  }

  /** Locator for Insights_Detail_Hero */
  get Insights_Detail_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero);
  }

  /** Locator for Insights_Listing */
  get Insights_Listing(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing);
  }

  /** Locator for Login */
  get Login(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login);
  }

  /** Locator for Navigation */
  get Navigation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation);
  }

  /** Locator for Product_Comparison_Card */
  get Product_Comparison_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card);
  }

  /** Locator for Product_Path_Detail_Card */
  get Product_Path_Detail_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card);
  }

  /** Locator for Product_Path_Summary_Card */
  get Product_Path_Summary_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card);
  }

  /** Locator for Product_Rate_Table */
  get Product_Rate_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table);
  }

  /** Locator for ForeCertain_Income_Annuity */
  get ForeCertain_Income_Annuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu */
  get ForeIncome_II_Fixed_Index_Annu(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu);
  }

  /** Locator for SecureFore_II_Fixed_Annuity */
  get SecureFore_II_Fixed_Annuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity);
  }

  /** Locator for SecureFore_Rates */
  get SecureFore_Rates(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates);
  }

  /** Locator for forestructuredgrowthii */
  get forestructuredgrowthii(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii);
  }

  /** Locator for Income_150_SE */
  get Income_150_SE(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE);
  }

  /** Locator for ForeCare_Fixed_Annuity */
  get ForeCare_Fixed_Annuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde */
  get ForeAccumulation_II_Fixed_Inde(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde);
  }

  /** Locator for ForeCertain_Advisory */
  get ForeCertain_Advisory(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory);
  }

  /** Locator for Promo_Banner */
  get Promo_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner);
  }

  /** Locator for Quote */
  get Quote(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote);
  }

  /** Locator for Rate_Details_Hero */
  get Rate_Details_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero);
  }

  /** Locator for Rate_List_Accordion */
  get Rate_List_Accordion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion);
  }

  /** Locator for Rate_Sheet_Grid */
  get Rate_Sheet_Grid(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid);
  }

  /** Locator for Ratings_Card */
  get Ratings_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card);
  }

  /** Locator for RTE_Table */
  get RTE_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table);
  }

  /** Locator for Section */
  get Section(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section);
  }

  /** Locator for Separator */
  get Separator(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator);
  }

  /** Locator for Site_Search */
  get Site_Search(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search);
  }

  /** Locator for Spacer */
  get Spacer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer);
  }

  /** Locator for Statistic */
  get Statistic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic);
  }

  /** Locator for Tabs */
  get Tabs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs);
  }

  /** Locator for Teaser_Card */
  get Teaser_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card);
  }

  /** Locator for Text */
  get Text(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text);
  }

  /** Locator for Video_External */
  get Video_External(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External);
  }

  /** Locator for Workbench */
  get Workbench(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench);
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

  /** Locator for Main_78 */
  get Main_78(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_78);
  }

  /** Locator for English_79 */
  get English_79(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_79);
  }

  /** Locator for Individuals */
  get Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals);
  }

  /** Locator for Main_81 */
  get Main_81(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_81);
  }

  /** Locator for English_82 */
  get English_82(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_82);
  }

  /** Locator for Preneed */
  get Preneed(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed);
  }

  /** Locator for Main_84 */
  get Main_84(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_84);
  }

  /** Locator for English_85 */
  get English_85(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_85);
  }

  /** Locator for Style_Guide_86 */
  get Style_Guide_86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_86);
  }

  /** Locator for Templates_87 */
  get Templates_87(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_87);
  }

  /** Locator for Freeform_Template_88 */
  get Freeform_Template_88(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_88);
  }

  /** Locator for Insights_Detail_Template_89 */
  get Insights_Detail_Template_89(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_89);
  }

  /** Locator for Product_Detail_Page__90 */
  get Product_Detail_Page__90(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__90);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_91 */
  get Product_Rate_Page_ForeIncome_I_91(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_91);
  }

  /** Locator for Homepage_Template_92 */
  get Homepage_Template_92(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_92);
  }

  /** Locator for Rate_Admin_Template_93 */
  get Rate_Admin_Template_93(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_93);
  }

  /** Locator for Branding_94 */
  get Branding_94(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_94);
  }

  /** Locator for Component_Library_95 */
  get Component_Library_95(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_95);
  }

  /** Locator for Accordion_96 */
  get Accordion_96(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_96);
  }

  /** Locator for Accordion_Tabs_Feature_97 */
  get Accordion_Tabs_Feature_97(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_97);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_98 */
  get Accordion_Tabs_FeatureWith_Sc_98(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_98);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_99 */
  get Accordion_Tabs_FeatureWith_He_99(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_99);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_100 */
  get Accordion_Tabs_FeatureWithout_100(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_100);
  }

  /** Locator for Alert_Banner_101 */
  get Alert_Banner_101(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_101);
  }

  /** Locator for Benefits_Table_102 */
  get Benefits_Table_102(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_102);
  }

  /** Locator for Bio_Card_103 */
  get Bio_Card_103(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_103);
  }

  /** Locator for Brand_Relationship_104 */
  get Brand_Relationship_104(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_104);
  }

  /** Locator for Breadcrumb_105 */
  get Breadcrumb_105(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_105);
  }

  /** Locator for Button_106 */
  get Button_106(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_106);
  }

  /** Locator for Button_IllustrationsAnd_Login_107 */
  get Button_IllustrationsAnd_Login_107(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_107);
  }

  /** Locator for Content_Highlight_108 */
  get Content_Highlight_108(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_108);
  }

  /** Locator for Content_Trail_109 */
  get Content_Trail_109(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_109);
  }

  /** Locator for Decision_Tree_110 */
  get Decision_Tree_110(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_110);
  }

  /** Locator for Detail_Hero_111 */
  get Detail_Hero_111(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_111);
  }

  /** Locator for Disclosure_List_112 */
  get Disclosure_List_112(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_112);
  }

  /** Locator for Enhanced_Related_Content_113 */
  get Enhanced_Related_Content_113(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_113);
  }

  /** Locator for Feature_Banner_114 */
  get Feature_Banner_114(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_114);
  }

  /** Locator for Feature_Banner_5050_Layout_115 */
  get Feature_Banner_5050_Layout_115(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_115);
  }

  /** Locator for Firm_Selection_Modal_116 */
  get Firm_Selection_Modal_116(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_116);
  }

  /** Locator for Footer_Disclosure_117 */
  get Footer_Disclosure_117(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_117);
  }

  /** Locator for Form_Options_118 */
  get Form_Options_118(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_118);
  }

  /** Locator for Grid_Container_119 */
  get Grid_Container_119(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_119);
  }

  /** Locator for Headline_Block_120 */
  get Headline_Block_120(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_120);
  }

  /** Locator for Hero_5050_121 */
  get Hero_5050_121(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_121);
  }

  /** Locator for Homepage_Hero_122 */
  get Homepage_Hero_122(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_122);
  }

  /** Locator for Image_123 */
  get Image_123(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_123);
  }

  /** Locator for Image_With_Nested_Content_124 */
  get Image_With_Nested_Content_124(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_124);
  }

  /** Locator for In_Brief_125 */
  get In_Brief_125(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_125);
  }

  /** Locator for Insights_Detail_Hero_126 */
  get Insights_Detail_Hero_126(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_126);
  }

  /** Locator for Insights_Listing_127 */
  get Insights_Listing_127(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_127);
  }

  /** Locator for Login_128 */
  get Login_128(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_128);
  }

  /** Locator for Navigation_129 */
  get Navigation_129(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_129);
  }

  /** Locator for Product_Comparison_Card_130 */
  get Product_Comparison_Card_130(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_130);
  }

  /** Locator for Product_Path_Detail_Card_131 */
  get Product_Path_Detail_Card_131(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_131);
  }

  /** Locator for Product_Path_Summary_Card_132 */
  get Product_Path_Summary_Card_132(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_132);
  }

  /** Locator for Product_Rate_Table_133 */
  get Product_Rate_Table_133(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_133);
  }

  /** Locator for ForeCertain_Income_Annuity_134 */
  get ForeCertain_Income_Annuity_134(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_134);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_135 */
  get ForeIncome_II_Fixed_Index_Annu_135(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_135);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_136 */
  get SecureFore_II_Fixed_Annuity_136(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_136);
  }

  /** Locator for SecureFore_Rates_137 */
  get SecureFore_Rates_137(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_137);
  }

  /** Locator for forestructuredgrowthii_138 */
  get forestructuredgrowthii_138(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_138);
  }

  /** Locator for Income_150_SE_139 */
  get Income_150_SE_139(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_139);
  }

  /** Locator for ForeCare_Fixed_Annuity_140 */
  get ForeCare_Fixed_Annuity_140(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_140);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_141 */
  get ForeAccumulation_II_Fixed_Inde_141(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_141);
  }

  /** Locator for ForeCertain_Advisory_142 */
  get ForeCertain_Advisory_142(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_142);
  }

  /** Locator for Promo_Banner_143 */
  get Promo_Banner_143(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_143);
  }

  /** Locator for Quote_144 */
  get Quote_144(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_144);
  }

  /** Locator for Rate_Details_Hero_145 */
  get Rate_Details_Hero_145(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_145);
  }

  /** Locator for Rate_List_Accordion_146 */
  get Rate_List_Accordion_146(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_146);
  }

  /** Locator for Rate_Sheet_Grid_147 */
  get Rate_Sheet_Grid_147(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_147);
  }

  /** Locator for Ratings_Card_148 */
  get Ratings_Card_148(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_148);
  }

  /** Locator for RTE_Table_149 */
  get RTE_Table_149(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_149);
  }

  /** Locator for Section_150 */
  get Section_150(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_150);
  }

  /** Locator for Separator_151 */
  get Separator_151(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_151);
  }

  /** Locator for Site_Search_152 */
  get Site_Search_152(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_152);
  }

  /** Locator for Spacer_153 */
  get Spacer_153(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_153);
  }

  /** Locator for Statistic_154 */
  get Statistic_154(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_154);
  }

  /** Locator for Tabs_155 */
  get Tabs_155(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_155);
  }

  /** Locator for Teaser_Card_156 */
  get Teaser_Card_156(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_156);
  }

  /** Locator for Text_157 */
  get Text_157(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_157);
  }

  /** Locator for Video_External_158 */
  get Video_External_158(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_158);
  }

  /** Locator for Workbench_159 */
  get Workbench_159(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_159);
  }

  /** Locator for Corporate_Agnostic_160 */
  get Corporate_Agnostic_160(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_160);
  }

  /** Locator for Main_161 */
  get Main_161(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_161);
  }

  /** Locator for English_162 */
  get English_162(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_162);
  }

  /** Locator for Financial_Professionals_163 */
  get Financial_Professionals_163(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_163);
  }

  /** Locator for Main_164 */
  get Main_164(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_164);
  }

  /** Locator for English_165 */
  get English_165(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_165);
  }

  /** Locator for Individuals_166 */
  get Individuals_166(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_166);
  }

  /** Locator for Main_167 */
  get Main_167(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_167);
  }

  /** Locator for English_168 */
  get English_168(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_168);
  }

  /** Locator for Preneed_169 */
  get Preneed_169(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_169);
  }

  /** Locator for Main_170 */
  get Main_170(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_170);
  }

  /** Locator for English_171 */
  get English_171(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_171);
  }

  /** Locator for Style_Guide_172 */
  get Style_Guide_172(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_172);
  }

  /** Locator for Templates_173 */
  get Templates_173(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_173);
  }

  /** Locator for Freeform_Template_174 */
  get Freeform_Template_174(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_174);
  }

  /** Locator for Insights_Detail_Template_175 */
  get Insights_Detail_Template_175(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_175);
  }

  /** Locator for Product_Detail_Page__176 */
  get Product_Detail_Page__176(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__176);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_177 */
  get Product_Rate_Page_ForeIncome_I_177(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_177);
  }

  /** Locator for Homepage_Template_178 */
  get Homepage_Template_178(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_178);
  }

  /** Locator for Rate_Admin_Template_179 */
  get Rate_Admin_Template_179(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_179);
  }

  /** Locator for Branding_180 */
  get Branding_180(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_180);
  }

  /** Locator for Component_Library_181 */
  get Component_Library_181(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_181);
  }

  /** Locator for Accordion_182 */
  get Accordion_182(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_182);
  }

  /** Locator for Accordion_Tabs_Feature_183 */
  get Accordion_Tabs_Feature_183(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_183);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_184 */
  get Accordion_Tabs_FeatureWith_Sc_184(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_184);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_185 */
  get Accordion_Tabs_FeatureWith_He_185(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_185);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_186 */
  get Accordion_Tabs_FeatureWithout_186(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_186);
  }

  /** Locator for Alert_Banner_187 */
  get Alert_Banner_187(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_187);
  }

  /** Locator for Benefits_Table_188 */
  get Benefits_Table_188(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_188);
  }

  /** Locator for Bio_Card_189 */
  get Bio_Card_189(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_189);
  }

  /** Locator for Brand_Relationship_190 */
  get Brand_Relationship_190(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_190);
  }

  /** Locator for Breadcrumb_191 */
  get Breadcrumb_191(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_191);
  }

  /** Locator for Button_192 */
  get Button_192(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_192);
  }

  /** Locator for Button_IllustrationsAnd_Login_193 */
  get Button_IllustrationsAnd_Login_193(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_193);
  }

  /** Locator for Content_Highlight_194 */
  get Content_Highlight_194(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_194);
  }

  /** Locator for Content_Trail_195 */
  get Content_Trail_195(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_195);
  }

  /** Locator for Decision_Tree_196 */
  get Decision_Tree_196(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_196);
  }

  /** Locator for Detail_Hero_197 */
  get Detail_Hero_197(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_197);
  }

  /** Locator for Disclosure_List_198 */
  get Disclosure_List_198(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_198);
  }

  /** Locator for Enhanced_Related_Content_199 */
  get Enhanced_Related_Content_199(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_199);
  }

  /** Locator for Feature_Banner_200 */
  get Feature_Banner_200(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_200);
  }

  /** Locator for Feature_Banner_5050_Layout_201 */
  get Feature_Banner_5050_Layout_201(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_201);
  }

  /** Locator for Firm_Selection_Modal_202 */
  get Firm_Selection_Modal_202(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_202);
  }

  /** Locator for Footer_Disclosure_203 */
  get Footer_Disclosure_203(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_203);
  }

  /** Locator for Form_Options_204 */
  get Form_Options_204(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_204);
  }

  /** Locator for Grid_Container_205 */
  get Grid_Container_205(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_205);
  }

  /** Locator for Headline_Block_206 */
  get Headline_Block_206(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_206);
  }

  /** Locator for Hero_5050_207 */
  get Hero_5050_207(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_207);
  }

  /** Locator for Homepage_Hero_208 */
  get Homepage_Hero_208(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_208);
  }

  /** Locator for Image_209 */
  get Image_209(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_209);
  }

  /** Locator for Image_With_Nested_Content_210 */
  get Image_With_Nested_Content_210(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_210);
  }

  /** Locator for In_Brief_211 */
  get In_Brief_211(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_211);
  }

  /** Locator for Insights_Detail_Hero_212 */
  get Insights_Detail_Hero_212(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_212);
  }

  /** Locator for Insights_Listing_213 */
  get Insights_Listing_213(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_213);
  }

  /** Locator for Login_214 */
  get Login_214(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_214);
  }

  /** Locator for Navigation_215 */
  get Navigation_215(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_215);
  }

  /** Locator for Product_Comparison_Card_216 */
  get Product_Comparison_Card_216(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_216);
  }

  /** Locator for Product_Path_Detail_Card_217 */
  get Product_Path_Detail_Card_217(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_217);
  }

  /** Locator for Product_Path_Summary_Card_218 */
  get Product_Path_Summary_Card_218(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_218);
  }

  /** Locator for Product_Rate_Table_219 */
  get Product_Rate_Table_219(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_219);
  }

  /** Locator for ForeCertain_Income_Annuity_220 */
  get ForeCertain_Income_Annuity_220(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_220);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_221 */
  get ForeIncome_II_Fixed_Index_Annu_221(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_221);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_222 */
  get SecureFore_II_Fixed_Annuity_222(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_222);
  }

  /** Locator for SecureFore_Rates_223 */
  get SecureFore_Rates_223(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_223);
  }

  /** Locator for forestructuredgrowthii_224 */
  get forestructuredgrowthii_224(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_224);
  }

  /** Locator for Income_150_SE_225 */
  get Income_150_SE_225(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_225);
  }

  /** Locator for ForeCare_Fixed_Annuity_226 */
  get ForeCare_Fixed_Annuity_226(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_226);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_227 */
  get ForeAccumulation_II_Fixed_Inde_227(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_227);
  }

  /** Locator for ForeCertain_Advisory_228 */
  get ForeCertain_Advisory_228(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_228);
  }

  /** Locator for Promo_Banner_229 */
  get Promo_Banner_229(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_229);
  }

  /** Locator for Quote_230 */
  get Quote_230(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_230);
  }

  /** Locator for Rate_Details_Hero_231 */
  get Rate_Details_Hero_231(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_231);
  }

  /** Locator for Rate_List_Accordion_232 */
  get Rate_List_Accordion_232(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_232);
  }

  /** Locator for Rate_Sheet_Grid_233 */
  get Rate_Sheet_Grid_233(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_233);
  }

  /** Locator for Ratings_Card_234 */
  get Ratings_Card_234(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_234);
  }

  /** Locator for RTE_Table_235 */
  get RTE_Table_235(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_235);
  }

  /** Locator for Section_236 */
  get Section_236(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_236);
  }

  /** Locator for Separator_237 */
  get Separator_237(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_237);
  }

  /** Locator for Site_Search_238 */
  get Site_Search_238(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_238);
  }

  /** Locator for Spacer_239 */
  get Spacer_239(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_239);
  }

  /** Locator for Statistic_240 */
  get Statistic_240(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_240);
  }

  /** Locator for Tabs_241 */
  get Tabs_241(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_241);
  }

  /** Locator for Teaser_Card_242 */
  get Teaser_Card_242(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_242);
  }

  /** Locator for Text_243 */
  get Text_243(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_243);
  }

  /** Locator for Video_External_244 */
  get Video_External_244(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_244);
  }

  /** Locator for Workbench_245 */
  get Workbench_245(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_245);
  }

  /** Locator for Corporate_Agnostic_246 */
  get Corporate_Agnostic_246(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_246);
  }

  /** Locator for Main_247 */
  get Main_247(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_247);
  }

  /** Locator for English_248 */
  get English_248(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_248);
  }

  /** Locator for Financial_Professionals_249 */
  get Financial_Professionals_249(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_249);
  }

  /** Locator for Main_250 */
  get Main_250(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_250);
  }

  /** Locator for English_251 */
  get English_251(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_251);
  }

  /** Locator for Individuals_252 */
  get Individuals_252(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_252);
  }

  /** Locator for Main_253 */
  get Main_253(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_253);
  }

  /** Locator for English_254 */
  get English_254(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_254);
  }

  /** Locator for Preneed_255 */
  get Preneed_255(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_255);
  }

  /** Locator for Main_256 */
  get Main_256(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_256);
  }

  /** Locator for English_257 */
  get English_257(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_257);
  }

  /** Locator for Style_Guide_258 */
  get Style_Guide_258(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_258);
  }

  /** Locator for Templates_259 */
  get Templates_259(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_259);
  }

  /** Locator for Freeform_Template_260 */
  get Freeform_Template_260(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_260);
  }

  /** Locator for Insights_Detail_Template_261 */
  get Insights_Detail_Template_261(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_261);
  }

  /** Locator for Product_Detail_Page__262 */
  get Product_Detail_Page__262(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__262);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_263 */
  get Product_Rate_Page_ForeIncome_I_263(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_263);
  }

  /** Locator for Homepage_Template_264 */
  get Homepage_Template_264(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_264);
  }

  /** Locator for Rate_Admin_Template_265 */
  get Rate_Admin_Template_265(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_265);
  }

  /** Locator for Branding_266 */
  get Branding_266(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_266);
  }

  /** Locator for Component_Library_267 */
  get Component_Library_267(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_267);
  }

  /** Locator for Accordion_268 */
  get Accordion_268(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_268);
  }

  /** Locator for Accordion_Tabs_Feature_269 */
  get Accordion_Tabs_Feature_269(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_269);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_270 */
  get Accordion_Tabs_FeatureWith_Sc_270(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_270);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_271 */
  get Accordion_Tabs_FeatureWith_He_271(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_271);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_272 */
  get Accordion_Tabs_FeatureWithout_272(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_272);
  }

  /** Locator for Alert_Banner_273 */
  get Alert_Banner_273(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_273);
  }

  /** Locator for Benefits_Table_274 */
  get Benefits_Table_274(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_274);
  }

  /** Locator for Bio_Card_275 */
  get Bio_Card_275(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_275);
  }

  /** Locator for Brand_Relationship_276 */
  get Brand_Relationship_276(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_276);
  }

  /** Locator for Breadcrumb_277 */
  get Breadcrumb_277(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_277);
  }

  /** Locator for Button_278 */
  get Button_278(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_278);
  }

  /** Locator for Button_IllustrationsAnd_Login_279 */
  get Button_IllustrationsAnd_Login_279(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_279);
  }

  /** Locator for Content_Highlight_280 */
  get Content_Highlight_280(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_280);
  }

  /** Locator for Content_Trail_281 */
  get Content_Trail_281(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_281);
  }

  /** Locator for Decision_Tree_282 */
  get Decision_Tree_282(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_282);
  }

  /** Locator for Detail_Hero_283 */
  get Detail_Hero_283(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_283);
  }

  /** Locator for Disclosure_List_284 */
  get Disclosure_List_284(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_284);
  }

  /** Locator for Enhanced_Related_Content_285 */
  get Enhanced_Related_Content_285(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_285);
  }

  /** Locator for Feature_Banner_286 */
  get Feature_Banner_286(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_286);
  }

  /** Locator for Feature_Banner_5050_Layout_287 */
  get Feature_Banner_5050_Layout_287(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_287);
  }

  /** Locator for Firm_Selection_Modal_288 */
  get Firm_Selection_Modal_288(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_288);
  }

  /** Locator for Footer_Disclosure_289 */
  get Footer_Disclosure_289(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_289);
  }

  /** Locator for Form_Options_290 */
  get Form_Options_290(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_290);
  }

  /** Locator for Grid_Container_291 */
  get Grid_Container_291(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_291);
  }

  /** Locator for Headline_Block_292 */
  get Headline_Block_292(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_292);
  }

  /** Locator for Hero_5050_293 */
  get Hero_5050_293(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_293);
  }

  /** Locator for Homepage_Hero_294 */
  get Homepage_Hero_294(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_294);
  }

  /** Locator for Image_295 */
  get Image_295(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_295);
  }

  /** Locator for Image_With_Nested_Content_296 */
  get Image_With_Nested_Content_296(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_296);
  }

  /** Locator for In_Brief_297 */
  get In_Brief_297(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_297);
  }

  /** Locator for Insights_Detail_Hero_298 */
  get Insights_Detail_Hero_298(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_298);
  }

  /** Locator for Insights_Listing_299 */
  get Insights_Listing_299(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_299);
  }

  /** Locator for Login_300 */
  get Login_300(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_300);
  }

  /** Locator for Navigation_301 */
  get Navigation_301(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_301);
  }

  /** Locator for Product_Comparison_Card_302 */
  get Product_Comparison_Card_302(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_302);
  }

  /** Locator for Product_Path_Detail_Card_303 */
  get Product_Path_Detail_Card_303(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_303);
  }

  /** Locator for Product_Path_Summary_Card_304 */
  get Product_Path_Summary_Card_304(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_304);
  }

  /** Locator for Product_Rate_Table_305 */
  get Product_Rate_Table_305(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_305);
  }

  /** Locator for ForeCertain_Income_Annuity_306 */
  get ForeCertain_Income_Annuity_306(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_306);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_307 */
  get ForeIncome_II_Fixed_Index_Annu_307(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_307);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_308 */
  get SecureFore_II_Fixed_Annuity_308(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_308);
  }

  /** Locator for SecureFore_Rates_309 */
  get SecureFore_Rates_309(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_309);
  }

  /** Locator for forestructuredgrowthii_310 */
  get forestructuredgrowthii_310(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_310);
  }

  /** Locator for Income_150_SE_311 */
  get Income_150_SE_311(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_311);
  }

  /** Locator for ForeCare_Fixed_Annuity_312 */
  get ForeCare_Fixed_Annuity_312(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_312);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_313 */
  get ForeAccumulation_II_Fixed_Inde_313(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_313);
  }

  /** Locator for ForeCertain_Advisory_314 */
  get ForeCertain_Advisory_314(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_314);
  }

  /** Locator for Promo_Banner_315 */
  get Promo_Banner_315(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_315);
  }

  /** Locator for Quote_316 */
  get Quote_316(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_316);
  }

  /** Locator for Rate_Details_Hero_317 */
  get Rate_Details_Hero_317(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_317);
  }

  /** Locator for Rate_List_Accordion_318 */
  get Rate_List_Accordion_318(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_318);
  }

  /** Locator for Rate_Sheet_Grid_319 */
  get Rate_Sheet_Grid_319(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_319);
  }

  /** Locator for Ratings_Card_320 */
  get Ratings_Card_320(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_320);
  }

  /** Locator for RTE_Table_321 */
  get RTE_Table_321(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_321);
  }

  /** Locator for Section_322 */
  get Section_322(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_322);
  }

  /** Locator for Separator_323 */
  get Separator_323(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_323);
  }

  /** Locator for Site_Search_324 */
  get Site_Search_324(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_324);
  }

  /** Locator for Spacer_325 */
  get Spacer_325(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_325);
  }

  /** Locator for Statistic_326 */
  get Statistic_326(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_326);
  }

  /** Locator for Tabs_327 */
  get Tabs_327(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_327);
  }

  /** Locator for Teaser_Card_328 */
  get Teaser_Card_328(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_328);
  }

  /** Locator for Text_329 */
  get Text_329(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_329);
  }

  /** Locator for Video_External_330 */
  get Video_External_330(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_330);
  }

  /** Locator for Workbench_331 */
  get Workbench_331(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_331);
  }

  /** Locator for Corporate_Agnostic_332 */
  get Corporate_Agnostic_332(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_332);
  }

  /** Locator for Main_333 */
  get Main_333(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_333);
  }

  /** Locator for English_334 */
  get English_334(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_334);
  }

  /** Locator for Financial_Professionals_335 */
  get Financial_Professionals_335(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_335);
  }

  /** Locator for Main_336 */
  get Main_336(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_336);
  }

  /** Locator for English_337 */
  get English_337(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_337);
  }

  /** Locator for Individuals_338 */
  get Individuals_338(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_338);
  }

  /** Locator for Main_339 */
  get Main_339(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_339);
  }

  /** Locator for English_340 */
  get English_340(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_340);
  }

  /** Locator for Preneed_341 */
  get Preneed_341(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_341);
  }

  /** Locator for Main_342 */
  get Main_342(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_342);
  }

  /** Locator for English_343 */
  get English_343(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_343);
  }

  /** Locator for Style_Guide_344 */
  get Style_Guide_344(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_344);
  }

  /** Locator for Templates_345 */
  get Templates_345(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_345);
  }

  /** Locator for Freeform_Template_346 */
  get Freeform_Template_346(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_346);
  }

  /** Locator for Insights_Detail_Template_347 */
  get Insights_Detail_Template_347(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_347);
  }

  /** Locator for Product_Detail_Page__348 */
  get Product_Detail_Page__348(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__348);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_349 */
  get Product_Rate_Page_ForeIncome_I_349(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_349);
  }

  /** Locator for Homepage_Template_350 */
  get Homepage_Template_350(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_350);
  }

  /** Locator for Rate_Admin_Template_351 */
  get Rate_Admin_Template_351(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_351);
  }

  /** Locator for Branding_352 */
  get Branding_352(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_352);
  }

  /** Locator for Component_Library_353 */
  get Component_Library_353(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_353);
  }

  /** Locator for Accordion_354 */
  get Accordion_354(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_354);
  }

  /** Locator for Accordion_Tabs_Feature_355 */
  get Accordion_Tabs_Feature_355(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_355);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_356 */
  get Accordion_Tabs_FeatureWith_Sc_356(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_356);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_357 */
  get Accordion_Tabs_FeatureWith_He_357(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_357);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_358 */
  get Accordion_Tabs_FeatureWithout_358(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_358);
  }

  /** Locator for Alert_Banner_359 */
  get Alert_Banner_359(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_359);
  }

  /** Locator for Benefits_Table_360 */
  get Benefits_Table_360(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_360);
  }

  /** Locator for Bio_Card_361 */
  get Bio_Card_361(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_361);
  }

  /** Locator for Brand_Relationship_362 */
  get Brand_Relationship_362(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_362);
  }

  /** Locator for Breadcrumb_363 */
  get Breadcrumb_363(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_363);
  }

  /** Locator for Button_364 */
  get Button_364(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_364);
  }

  /** Locator for Button_IllustrationsAnd_Login_365 */
  get Button_IllustrationsAnd_Login_365(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_365);
  }

  /** Locator for Content_Highlight_366 */
  get Content_Highlight_366(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_366);
  }

  /** Locator for Content_Trail_367 */
  get Content_Trail_367(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_367);
  }

  /** Locator for Decision_Tree_368 */
  get Decision_Tree_368(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_368);
  }

  /** Locator for Detail_Hero_369 */
  get Detail_Hero_369(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_369);
  }

  /** Locator for Disclosure_List_370 */
  get Disclosure_List_370(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_370);
  }

  /** Locator for Enhanced_Related_Content_371 */
  get Enhanced_Related_Content_371(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_371);
  }

  /** Locator for Feature_Banner_372 */
  get Feature_Banner_372(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_372);
  }

  /** Locator for Feature_Banner_5050_Layout_373 */
  get Feature_Banner_5050_Layout_373(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_373);
  }

  /** Locator for Firm_Selection_Modal_374 */
  get Firm_Selection_Modal_374(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_374);
  }

  /** Locator for Footer_Disclosure_375 */
  get Footer_Disclosure_375(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_375);
  }

  /** Locator for Form_Options_376 */
  get Form_Options_376(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_376);
  }

  /** Locator for Grid_Container_377 */
  get Grid_Container_377(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_377);
  }

  /** Locator for Headline_Block_378 */
  get Headline_Block_378(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_378);
  }

  /** Locator for Hero_5050_379 */
  get Hero_5050_379(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_379);
  }

  /** Locator for Homepage_Hero_380 */
  get Homepage_Hero_380(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_380);
  }

  /** Locator for Image_381 */
  get Image_381(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_381);
  }

  /** Locator for Image_With_Nested_Content_382 */
  get Image_With_Nested_Content_382(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_382);
  }

  /** Locator for In_Brief_383 */
  get In_Brief_383(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_383);
  }

  /** Locator for Insights_Detail_Hero_384 */
  get Insights_Detail_Hero_384(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_384);
  }

  /** Locator for Insights_Listing_385 */
  get Insights_Listing_385(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_385);
  }

  /** Locator for Login_386 */
  get Login_386(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_386);
  }

  /** Locator for Navigation_387 */
  get Navigation_387(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_387);
  }

  /** Locator for Product_Comparison_Card_388 */
  get Product_Comparison_Card_388(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_388);
  }

  /** Locator for Product_Path_Detail_Card_389 */
  get Product_Path_Detail_Card_389(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_389);
  }

  /** Locator for Product_Path_Summary_Card_390 */
  get Product_Path_Summary_Card_390(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_390);
  }

  /** Locator for Product_Rate_Table_391 */
  get Product_Rate_Table_391(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_391);
  }

  /** Locator for ForeCertain_Income_Annuity_392 */
  get ForeCertain_Income_Annuity_392(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_392);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_393 */
  get ForeIncome_II_Fixed_Index_Annu_393(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_393);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_394 */
  get SecureFore_II_Fixed_Annuity_394(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_394);
  }

  /** Locator for SecureFore_Rates_395 */
  get SecureFore_Rates_395(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_395);
  }

  /** Locator for forestructuredgrowthii_396 */
  get forestructuredgrowthii_396(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_396);
  }

  /** Locator for Income_150_SE_397 */
  get Income_150_SE_397(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_397);
  }

  /** Locator for ForeCare_Fixed_Annuity_398 */
  get ForeCare_Fixed_Annuity_398(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_398);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_399 */
  get ForeAccumulation_II_Fixed_Inde_399(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_399);
  }

  /** Locator for ForeCertain_Advisory_400 */
  get ForeCertain_Advisory_400(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_400);
  }

  /** Locator for Promo_Banner_401 */
  get Promo_Banner_401(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_401);
  }

  /** Locator for Quote_402 */
  get Quote_402(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_402);
  }

  /** Locator for Rate_Details_Hero_403 */
  get Rate_Details_Hero_403(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_403);
  }

  /** Locator for Rate_List_Accordion_404 */
  get Rate_List_Accordion_404(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_404);
  }

  /** Locator for Rate_Sheet_Grid_405 */
  get Rate_Sheet_Grid_405(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_405);
  }

  /** Locator for Ratings_Card_406 */
  get Ratings_Card_406(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_406);
  }

  /** Locator for RTE_Table_407 */
  get RTE_Table_407(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_407);
  }

  /** Locator for Section_408 */
  get Section_408(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_408);
  }

  /** Locator for Separator_409 */
  get Separator_409(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_409);
  }

  /** Locator for Site_Search_410 */
  get Site_Search_410(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_410);
  }

  /** Locator for Spacer_411 */
  get Spacer_411(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_411);
  }

  /** Locator for Statistic_412 */
  get Statistic_412(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_412);
  }

  /** Locator for Tabs_413 */
  get Tabs_413(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_413);
  }

  /** Locator for Teaser_Card_414 */
  get Teaser_Card_414(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_414);
  }

  /** Locator for Text_415 */
  get Text_415(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_415);
  }

  /** Locator for Video_External_416 */
  get Video_External_416(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_416);
  }

  /** Locator for Workbench_417 */
  get Workbench_417(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_417);
  }

  /** Locator for Corporate_Agnostic_418 */
  get Corporate_Agnostic_418(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_418);
  }

  /** Locator for Main_419 */
  get Main_419(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_419);
  }

  /** Locator for English_420 */
  get English_420(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_420);
  }

  /** Locator for Financial_Professionals_421 */
  get Financial_Professionals_421(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_421);
  }

  /** Locator for Main_422 */
  get Main_422(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_422);
  }

  /** Locator for English_423 */
  get English_423(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_423);
  }

  /** Locator for Individuals_424 */
  get Individuals_424(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_424);
  }

  /** Locator for Main_425 */
  get Main_425(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_425);
  }

  /** Locator for English_426 */
  get English_426(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_426);
  }

  /** Locator for Preneed_427 */
  get Preneed_427(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_427);
  }

  /** Locator for Main_428 */
  get Main_428(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_428);
  }

  /** Locator for English_429 */
  get English_429(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_429);
  }

  /** Locator for Style_Guide_430 */
  get Style_Guide_430(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_430);
  }

  /** Locator for Templates_431 */
  get Templates_431(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_431);
  }

  /** Locator for Freeform_Template_432 */
  get Freeform_Template_432(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_432);
  }

  /** Locator for Insights_Detail_Template_433 */
  get Insights_Detail_Template_433(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_433);
  }

  /** Locator for Product_Detail_Page__434 */
  get Product_Detail_Page__434(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__434);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_435 */
  get Product_Rate_Page_ForeIncome_I_435(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_435);
  }

  /** Locator for Homepage_Template_436 */
  get Homepage_Template_436(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_436);
  }

  /** Locator for Rate_Admin_Template_437 */
  get Rate_Admin_Template_437(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_437);
  }

  /** Locator for Branding_438 */
  get Branding_438(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_438);
  }

  /** Locator for Component_Library_439 */
  get Component_Library_439(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_439);
  }

  /** Locator for Accordion_440 */
  get Accordion_440(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_440);
  }

  /** Locator for Accordion_Tabs_Feature_441 */
  get Accordion_Tabs_Feature_441(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_441);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_442 */
  get Accordion_Tabs_FeatureWith_Sc_442(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_442);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_443 */
  get Accordion_Tabs_FeatureWith_He_443(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_443);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_444 */
  get Accordion_Tabs_FeatureWithout_444(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_444);
  }

  /** Locator for Alert_Banner_445 */
  get Alert_Banner_445(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_445);
  }

  /** Locator for Benefits_Table_446 */
  get Benefits_Table_446(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_446);
  }

  /** Locator for Bio_Card_447 */
  get Bio_Card_447(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_447);
  }

  /** Locator for Brand_Relationship_448 */
  get Brand_Relationship_448(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_448);
  }

  /** Locator for Breadcrumb_449 */
  get Breadcrumb_449(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_449);
  }

  /** Locator for Button_450 */
  get Button_450(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_450);
  }

  /** Locator for Button_IllustrationsAnd_Login_451 */
  get Button_IllustrationsAnd_Login_451(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_451);
  }

  /** Locator for Content_Highlight_452 */
  get Content_Highlight_452(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_452);
  }

  /** Locator for Content_Trail_453 */
  get Content_Trail_453(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_453);
  }

  /** Locator for Decision_Tree_454 */
  get Decision_Tree_454(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_454);
  }

  /** Locator for Detail_Hero_455 */
  get Detail_Hero_455(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_455);
  }

  /** Locator for Disclosure_List_456 */
  get Disclosure_List_456(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_456);
  }

  /** Locator for Enhanced_Related_Content_457 */
  get Enhanced_Related_Content_457(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_457);
  }

  /** Locator for Feature_Banner_458 */
  get Feature_Banner_458(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_458);
  }

  /** Locator for Feature_Banner_5050_Layout_459 */
  get Feature_Banner_5050_Layout_459(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_459);
  }

  /** Locator for Firm_Selection_Modal_460 */
  get Firm_Selection_Modal_460(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_460);
  }

  /** Locator for Footer_Disclosure_461 */
  get Footer_Disclosure_461(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_461);
  }

  /** Locator for Form_Options_462 */
  get Form_Options_462(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_462);
  }

  /** Locator for Grid_Container_463 */
  get Grid_Container_463(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_463);
  }

  /** Locator for Headline_Block_464 */
  get Headline_Block_464(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_464);
  }

  /** Locator for Hero_5050_465 */
  get Hero_5050_465(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_465);
  }

  /** Locator for Homepage_Hero_466 */
  get Homepage_Hero_466(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_466);
  }

  /** Locator for Image_467 */
  get Image_467(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_467);
  }

  /** Locator for Image_With_Nested_Content_468 */
  get Image_With_Nested_Content_468(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_468);
  }

  /** Locator for In_Brief_469 */
  get In_Brief_469(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_469);
  }

  /** Locator for Insights_Detail_Hero_470 */
  get Insights_Detail_Hero_470(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_470);
  }

  /** Locator for Insights_Listing_471 */
  get Insights_Listing_471(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_471);
  }

  /** Locator for Login_472 */
  get Login_472(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_472);
  }

  /** Locator for Navigation_473 */
  get Navigation_473(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_473);
  }

  /** Locator for Product_Comparison_Card_474 */
  get Product_Comparison_Card_474(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_474);
  }

  /** Locator for Product_Path_Detail_Card_475 */
  get Product_Path_Detail_Card_475(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_475);
  }

  /** Locator for Product_Path_Summary_Card_476 */
  get Product_Path_Summary_Card_476(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_476);
  }

  /** Locator for Product_Rate_Table_477 */
  get Product_Rate_Table_477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_477);
  }

  /** Locator for ForeCertain_Income_Annuity_478 */
  get ForeCertain_Income_Annuity_478(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_478);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_479 */
  get ForeIncome_II_Fixed_Index_Annu_479(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_479);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_480 */
  get SecureFore_II_Fixed_Annuity_480(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_480);
  }

  /** Locator for SecureFore_Rates_481 */
  get SecureFore_Rates_481(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_481);
  }

  /** Locator for forestructuredgrowthii_482 */
  get forestructuredgrowthii_482(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_482);
  }

  /** Locator for Income_150_SE_483 */
  get Income_150_SE_483(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_483);
  }

  /** Locator for ForeCare_Fixed_Annuity_484 */
  get ForeCare_Fixed_Annuity_484(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_484);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_485 */
  get ForeAccumulation_II_Fixed_Inde_485(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_485);
  }

  /** Locator for ForeCertain_Advisory_486 */
  get ForeCertain_Advisory_486(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_486);
  }

  /** Locator for Promo_Banner_487 */
  get Promo_Banner_487(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_487);
  }

  /** Locator for Quote_488 */
  get Quote_488(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_488);
  }

  /** Locator for Rate_Details_Hero_489 */
  get Rate_Details_Hero_489(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_489);
  }

  /** Locator for Rate_List_Accordion_490 */
  get Rate_List_Accordion_490(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_490);
  }

  /** Locator for Rate_Sheet_Grid_491 */
  get Rate_Sheet_Grid_491(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_491);
  }

  /** Locator for Ratings_Card_492 */
  get Ratings_Card_492(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_492);
  }

  /** Locator for RTE_Table_493 */
  get RTE_Table_493(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_493);
  }

  /** Locator for Section_494 */
  get Section_494(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_494);
  }

  /** Locator for Separator_495 */
  get Separator_495(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_495);
  }

  /** Locator for Site_Search_496 */
  get Site_Search_496(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_496);
  }

  /** Locator for Spacer_497 */
  get Spacer_497(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_497);
  }

  /** Locator for Statistic_498 */
  get Statistic_498(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_498);
  }

  /** Locator for Tabs_499 */
  get Tabs_499(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_499);
  }

  /** Locator for Teaser_Card_500 */
  get Teaser_Card_500(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_500);
  }

  /** Locator for Text_501 */
  get Text_501(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_501);
  }

  /** Locator for Video_External_502 */
  get Video_External_502(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_502);
  }

  /** Locator for Workbench_503 */
  get Workbench_503(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_503);
  }

  /** Locator for Corporate_Agnostic_504 */
  get Corporate_Agnostic_504(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_504);
  }

  /** Locator for Main_505 */
  get Main_505(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_505);
  }

  /** Locator for English_506 */
  get English_506(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_506);
  }

  /** Locator for Financial_Professionals_507 */
  get Financial_Professionals_507(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_507);
  }

  /** Locator for Main_508 */
  get Main_508(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_508);
  }

  /** Locator for English_509 */
  get English_509(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_509);
  }

  /** Locator for Individuals_510 */
  get Individuals_510(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_510);
  }

  /** Locator for Main_511 */
  get Main_511(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_511);
  }

  /** Locator for English_512 */
  get English_512(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_512);
  }

  /** Locator for Preneed_513 */
  get Preneed_513(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_513);
  }

  /** Locator for Main_514 */
  get Main_514(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_514);
  }

  /** Locator for English_515 */
  get English_515(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_515);
  }

  /** Locator for ul_516 */
  get ul_516(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_516);
  }

  /** Locator for ul_517 */
  get ul_517(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_517);
  }

  /** Locator for ul_518 */
  get ul_518(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_518);
  }

  /** Locator for ul_519 */
  get ul_519(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_519);
  }

  /** Locator for ul_520 */
  get ul_520(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_520);
  }

  /** Locator for ul_521 */
  get ul_521(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_521);
  }

  /** Locator for ul_522 */
  get ul_522(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_522);
  }

  /** Locator for ul_English */
  get ul_English(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English);
  }

  /** Locator for ul_524 */
  get ul_524(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_524);
  }

  /** Locator for ul_English_525 */
  get ul_English_525(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_525);
  }

  /** Locator for ul_526 */
  get ul_526(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_526);
  }

  /** Locator for ul_English_527 */
  get ul_English_527(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_527);
  }

  /** Locator for ul_528 */
  get ul_528(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_528);
  }

  /** Locator for ul_English_529 */
  get ul_English_529(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_529);
  }

  /** Locator for ul_530 */
  get ul_530(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_530);
  }

  /** Locator for ul_531 */
  get ul_531(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_531);
  }

  /** Locator for ul_532 */
  get ul_532(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_532);
  }

  /** Locator for ul_533 */
  get ul_533(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_533);
  }

  /** Locator for ul_534 */
  get ul_534(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_534);
  }

  /** Locator for ul_535 */
  get ul_535(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_535);
  }

  /** Locator for ul_536 */
  get ul_536(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_536);
  }

  /** Locator for ul_English_537 */
  get ul_English_537(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_537);
  }

  /** Locator for ul_538 */
  get ul_538(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_538);
  }

  /** Locator for ul_English_539 */
  get ul_English_539(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_539);
  }

  /** Locator for ul_540 */
  get ul_540(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_540);
  }

  /** Locator for ul_English_541 */
  get ul_English_541(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_541);
  }

  /** Locator for ul_542 */
  get ul_542(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_542);
  }

  /** Locator for ul_English_543 */
  get ul_English_543(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_543);
  }

  /** Locator for ul_544 */
  get ul_544(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_544);
  }

  /** Locator for ul_545 */
  get ul_545(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_545);
  }

  /** Locator for ul_546 */
  get ul_546(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_546);
  }

  /** Locator for ul_547 */
  get ul_547(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_547);
  }

  /** Locator for ul_548 */
  get ul_548(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_548);
  }

  /** Locator for ul_549 */
  get ul_549(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_549);
  }

  /** Locator for ul_550 */
  get ul_550(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_550);
  }

  /** Locator for ul_English_551 */
  get ul_English_551(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_551);
  }

  /** Locator for ul_552 */
  get ul_552(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_552);
  }

  /** Locator for ul_English_553 */
  get ul_English_553(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_553);
  }

  /** Locator for ul_554 */
  get ul_554(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_554);
  }

  /** Locator for ul_English_555 */
  get ul_English_555(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_555);
  }

  /** Locator for ul_556 */
  get ul_556(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_556);
  }

  /** Locator for ul_English_557 */
  get ul_English_557(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_557);
  }

  /** Locator for ul_558 */
  get ul_558(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_558);
  }

  /** Locator for ul_559 */
  get ul_559(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_559);
  }

  /** Locator for ul_560 */
  get ul_560(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_560);
  }

  /** Locator for ul_561 */
  get ul_561(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_561);
  }

  /** Locator for ul_562 */
  get ul_562(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_562);
  }

  /** Locator for ul_563 */
  get ul_563(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_563);
  }

  /** Locator for ul_564 */
  get ul_564(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_564);
  }

  /** Locator for ul_English_565 */
  get ul_English_565(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_565);
  }

  /** Locator for ul_566 */
  get ul_566(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_566);
  }

  /** Locator for ul_English_567 */
  get ul_English_567(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_567);
  }

  /** Locator for ul_568 */
  get ul_568(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_568);
  }

  /** Locator for ul_English_569 */
  get ul_English_569(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_569);
  }

  /** Locator for ul_570 */
  get ul_570(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_570);
  }

  /** Locator for ul_English_571 */
  get ul_English_571(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_571);
  }

  /** Locator for ul_572 */
  get ul_572(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_572);
  }

  /** Locator for ul_573 */
  get ul_573(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_573);
  }

  /** Locator for ul_574 */
  get ul_574(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_574);
  }

  /** Locator for ul_575 */
  get ul_575(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_575);
  }

  /** Locator for ul_576 */
  get ul_576(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_576);
  }

  /** Locator for ul_577 */
  get ul_577(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_577);
  }

  /** Locator for ul_578 */
  get ul_578(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_578);
  }

  /** Locator for ul_English_579 */
  get ul_English_579(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_579);
  }

  /** Locator for ul_580 */
  get ul_580(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_580);
  }

  /** Locator for ul_English_581 */
  get ul_English_581(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_581);
  }

  /** Locator for ul_582 */
  get ul_582(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_582);
  }

  /** Locator for ul_English_583 */
  get ul_English_583(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_583);
  }

  /** Locator for ul_584 */
  get ul_584(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_584);
  }

  /** Locator for ul_English_585 */
  get ul_English_585(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_585);
  }

  /** Locator for ul_586 */
  get ul_586(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_586);
  }

  /** Locator for ul_587 */
  get ul_587(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_587);
  }

  /** Locator for ul_588 */
  get ul_588(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_588);
  }

  /** Locator for ul_589 */
  get ul_589(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_589);
  }

  /** Locator for ul_590 */
  get ul_590(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_590);
  }

  /** Locator for ul_591 */
  get ul_591(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_591);
  }

  /** Locator for ul_592 */
  get ul_592(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_592);
  }

  /** Locator for ul_English_593 */
  get ul_English_593(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_593);
  }

  /** Locator for ul_594 */
  get ul_594(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_594);
  }

  /** Locator for ul_English_595 */
  get ul_English_595(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_595);
  }

  /** Locator for ul_596 */
  get ul_596(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_596);
  }

  /** Locator for ul_English_597 */
  get ul_English_597(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_597);
  }

  /** Locator for ul_598 */
  get ul_598(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_598);
  }

  /** Locator for ul_English_599 */
  get ul_English_599(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_English_599);
  }

  /** Locator for navigationD95ec9c1a1Item_3dd3bf6e7a */
  get navigationD95ec9c1a1Item_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_3dd3bf6e7a);
  }

  /** Locator for Style_Guide_601 */
  get Style_Guide_601(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_601);
  }

  /** Locator for navigationD95ec9c1a1ItemF52820d1fe */
  get navigationD95ec9c1a1ItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemF52820d1fe);
  }

  /** Locator for Templates_603 */
  get Templates_603(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_603);
  }

  /** Locator for li_Freeform_Template */
  get li_Freeform_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Freeform_Template);
  }

  /** Locator for Freeform_Template_605 */
  get Freeform_Template_605(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_605);
  }

  /** Locator for li_Insights_Detail_Template */
  get li_Insights_Detail_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Template);
  }

  /** Locator for Insights_Detail_Template_607 */
  get Insights_Detail_Template_607(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_607);
  }

  /** Locator for li_Product_Detail_Page */
  get li_Product_Detail_Page(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Detail_Page);
  }

  /** Locator for Product_Detail_Page__609 */
  get Product_Detail_Page__609(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__609);
  }

  /** Locator for li_Product_Rate_Page_ForeIncome_I */
  get li_Product_Rate_Page_ForeIncome_I(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Rate_Page_ForeIncome_I);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_611 */
  get Product_Rate_Page_ForeIncome_I_611(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_611);
  }

  /** Locator for li_Homepage_Template */
  get li_Homepage_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Template);
  }

  /** Locator for Homepage_Template_613 */
  get Homepage_Template_613(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_613);
  }

  /** Locator for li_Rate_Admin_Template */
  get li_Rate_Admin_Template(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Admin_Template);
  }

  /** Locator for Rate_Admin_Template_615 */
  get Rate_Admin_Template_615(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_615);
  }

  /** Locator for li_Branding */
  get li_Branding(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Branding);
  }

  /** Locator for Branding_617 */
  get Branding_617(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_617);
  }

  /** Locator for navigationD95ec9c1a1Item_2b248a5ea1 */
  get navigationD95ec9c1a1Item_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_2b248a5ea1);
  }

  /** Locator for Component_Library_619 */
  get Component_Library_619(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_619);
  }

  /** Locator for li_Accordion */
  get li_Accordion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion);
  }

  /** Locator for Accordion_621 */
  get Accordion_621(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_621);
  }

  /** Locator for navigationD95ec9c1a1Item_7282c86477 */
  get navigationD95ec9c1a1Item_7282c86477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_7282c86477);
  }

  /** Locator for Accordion_Tabs_Feature_623 */
  get Accordion_Tabs_Feature_623(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_623);
  }

  /** Locator for navigationD95ec9c1a1Item_67f1c24b4b */
  get navigationD95ec9c1a1Item_67f1c24b4b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_67f1c24b4b);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_625 */
  get Accordion_Tabs_FeatureWith_Sc_625(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_625);
  }

  /** Locator for li_Accordion_Tabs_FeatureWith_He */
  get li_Accordion_Tabs_FeatureWith_He(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWith_He);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_627 */
  get Accordion_Tabs_FeatureWith_He_627(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_627);
  }

  /** Locator for li_Accordion_Tabs_FeatureWithout */
  get li_Accordion_Tabs_FeatureWithout(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWithout);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_629 */
  get Accordion_Tabs_FeatureWithout_629(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_629);
  }

  /** Locator for li_Alert_Banner */
  get li_Alert_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Alert_Banner);
  }

  /** Locator for Alert_Banner_631 */
  get Alert_Banner_631(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_631);
  }

  /** Locator for li_Benefits_Table */
  get li_Benefits_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Benefits_Table);
  }

  /** Locator for Benefits_Table_633 */
  get Benefits_Table_633(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_633);
  }

  /** Locator for li_Bio_Card */
  get li_Bio_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Bio_Card);
  }

  /** Locator for Bio_Card_635 */
  get Bio_Card_635(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_635);
  }

  /** Locator for li_Brand_Relationship */
  get li_Brand_Relationship(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Brand_Relationship);
  }

  /** Locator for Brand_Relationship_637 */
  get Brand_Relationship_637(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_637);
  }

  /** Locator for li_Breadcrumb */
  get li_Breadcrumb(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Breadcrumb);
  }

  /** Locator for Breadcrumb_639 */
  get Breadcrumb_639(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_639);
  }

  /** Locator for li_Button */
  get li_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Button);
  }

  /** Locator for Button_641 */
  get Button_641(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_641);
  }

  /** Locator for navigationD95ec9c1a1ItemA2306335d1 */
  get navigationD95ec9c1a1ItemA2306335d1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemA2306335d1);
  }

  /** Locator for Button_IllustrationsAnd_Login_643 */
  get Button_IllustrationsAnd_Login_643(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_643);
  }

  /** Locator for li_Content_Highlight */
  get li_Content_Highlight(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Highlight);
  }

  /** Locator for Content_Highlight_645 */
  get Content_Highlight_645(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_645);
  }

  /** Locator for li_Content_Trail */
  get li_Content_Trail(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Trail);
  }

  /** Locator for Content_Trail_647 */
  get Content_Trail_647(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_647);
  }

  /** Locator for li_Decision_Tree */
  get li_Decision_Tree(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Decision_Tree);
  }

  /** Locator for Decision_Tree_649 */
  get Decision_Tree_649(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_649);
  }

  /** Locator for li_Detail_Hero */
  get li_Detail_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Detail_Hero);
  }

  /** Locator for Detail_Hero_651 */
  get Detail_Hero_651(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_651);
  }

  /** Locator for li_Disclosure_List */
  get li_Disclosure_List(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Disclosure_List);
  }

  /** Locator for Disclosure_List_653 */
  get Disclosure_List_653(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_653);
  }

  /** Locator for li_Enhanced_Related_Content */
  get li_Enhanced_Related_Content(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Enhanced_Related_Content);
  }

  /** Locator for Enhanced_Related_Content_655 */
  get Enhanced_Related_Content_655(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_655);
  }

  /** Locator for li_Feature_Banner */
  get li_Feature_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner);
  }

  /** Locator for Feature_Banner_657 */
  get Feature_Banner_657(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_657);
  }

  /** Locator for li_Feature_Banner_5050_Layout */
  get li_Feature_Banner_5050_Layout(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_5050_Layout);
  }

  /** Locator for Feature_Banner_5050_Layout_659 */
  get Feature_Banner_5050_Layout_659(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_659);
  }

  /** Locator for li_Firm_Selection_Modal */
  get li_Firm_Selection_Modal(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Firm_Selection_Modal);
  }

  /** Locator for Firm_Selection_Modal_661 */
  get Firm_Selection_Modal_661(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_661);
  }

  /** Locator for li_Footer_Disclosure */
  get li_Footer_Disclosure(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Footer_Disclosure);
  }

  /** Locator for Footer_Disclosure_663 */
  get Footer_Disclosure_663(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_663);
  }

  /** Locator for li_Form_Options */
  get li_Form_Options(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Form_Options);
  }

  /** Locator for Form_Options_665 */
  get Form_Options_665(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_665);
  }

  /** Locator for li_Grid_Container */
  get li_Grid_Container(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Grid_Container);
  }

  /** Locator for Grid_Container_667 */
  get Grid_Container_667(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_667);
  }

  /** Locator for li_Headline_Block */
  get li_Headline_Block(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Headline_Block);
  }

  /** Locator for Headline_Block_669 */
  get Headline_Block_669(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_669);
  }

  /** Locator for li_Hero_5050 */
  get li_Hero_5050(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050);
  }

  /** Locator for Hero_5050_671 */
  get Hero_5050_671(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_671);
  }

  /** Locator for li_Homepage_Hero */
  get li_Homepage_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Hero);
  }

  /** Locator for Homepage_Hero_673 */
  get Homepage_Hero_673(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_673);
  }

  /** Locator for li_Image */
  get li_Image(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image);
  }

  /** Locator for Image_675 */
  get Image_675(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_675);
  }

  /** Locator for li_Image_With_Nested_Content */
  get li_Image_With_Nested_Content(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_With_Nested_Content);
  }

  /** Locator for Image_With_Nested_Content_677 */
  get Image_With_Nested_Content_677(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_677);
  }

  /** Locator for li_In_Brief */
  get li_In_Brief(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_In_Brief);
  }

  /** Locator for In_Brief_679 */
  get In_Brief_679(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_679);
  }

  /** Locator for li_Insights_Detail_Hero */
  get li_Insights_Detail_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Hero);
  }

  /** Locator for Insights_Detail_Hero_681 */
  get Insights_Detail_Hero_681(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_681);
  }

  /** Locator for li_Insights_Listing */
  get li_Insights_Listing(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Listing);
  }

  /** Locator for Insights_Listing_683 */
  get Insights_Listing_683(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_683);
  }

  /** Locator for li_Login */
  get li_Login(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Login);
  }

  /** Locator for Login_685 */
  get Login_685(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_685);
  }

  /** Locator for li_Navigation */
  get li_Navigation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Navigation);
  }

  /** Locator for Navigation_687 */
  get Navigation_687(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_687);
  }

  /** Locator for li_Product_Comparison_Card */
  get li_Product_Comparison_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Comparison_Card);
  }

  /** Locator for Product_Comparison_Card_689 */
  get Product_Comparison_Card_689(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_689);
  }

  /** Locator for li_Product_Path_Detail_Card */
  get li_Product_Path_Detail_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Detail_Card);
  }

  /** Locator for Product_Path_Detail_Card_691 */
  get Product_Path_Detail_Card_691(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_691);
  }

  /** Locator for li_Product_Path_Summary_Card */
  get li_Product_Path_Summary_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Summary_Card);
  }

  /** Locator for Product_Path_Summary_Card_693 */
  get Product_Path_Summary_Card_693(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_693);
  }

  /** Locator for navigationD95ec9c1a1Item_8d21a80f63 */
  get navigationD95ec9c1a1Item_8d21a80f63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_8d21a80f63);
  }

  /** Locator for Product_Rate_Table_695 */
  get Product_Rate_Table_695(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_695);
  }

  /** Locator for li_ForeCertain_Income_Annuity */
  get li_ForeCertain_Income_Annuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Income_Annuity);
  }

  /** Locator for ForeCertain_Income_Annuity_697 */
  get ForeCertain_Income_Annuity_697(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_697);
  }

  /** Locator for li_ForeIncome_II_Fixed_Index_Annu */
  get li_ForeIncome_II_Fixed_Index_Annu(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeIncome_II_Fixed_Index_Annu);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_699 */
  get ForeIncome_II_Fixed_Index_Annu_699(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_699);
  }

  /** Locator for li_SecureFore_II_Fixed_Annuity */
  get li_SecureFore_II_Fixed_Annuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_II_Fixed_Annuity);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_701 */
  get SecureFore_II_Fixed_Annuity_701(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_701);
  }

  /** Locator for li_SecureFore_Rates */
  get li_SecureFore_Rates(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_Rates);
  }

  /** Locator for SecureFore_Rates_703 */
  get SecureFore_Rates_703(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_703);
  }

  /** Locator for liForestructuredgrowthii */
  get liForestructuredgrowthii(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liForestructuredgrowthii);
  }

  /** Locator for forestructuredgrowthii_705 */
  get forestructuredgrowthii_705(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_705);
  }

  /** Locator for li_Income_150_SE */
  get li_Income_150_SE(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Income_150_SE);
  }

  /** Locator for Income_150_SE_707 */
  get Income_150_SE_707(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_707);
  }

  /** Locator for li_ForeCare_Fixed_Annuity */
  get li_ForeCare_Fixed_Annuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCare_Fixed_Annuity);
  }

  /** Locator for ForeCare_Fixed_Annuity_709 */
  get ForeCare_Fixed_Annuity_709(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_709);
  }

  /** Locator for li_ForeAccumulation_II_Fixed_Inde */
  get li_ForeAccumulation_II_Fixed_Inde(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeAccumulation_II_Fixed_Inde);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_711 */
  get ForeAccumulation_II_Fixed_Inde_711(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_711);
  }

  /** Locator for li_ForeCertain_Advisory */
  get li_ForeCertain_Advisory(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Advisory);
  }

  /** Locator for ForeCertain_Advisory_713 */
  get ForeCertain_Advisory_713(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_713);
  }

  /** Locator for li_Promo_Banner */
  get li_Promo_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Promo_Banner);
  }

  /** Locator for Promo_Banner_715 */
  get Promo_Banner_715(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_715);
  }

  /** Locator for li_Quote */
  get li_Quote(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Quote);
  }

  /** Locator for Quote_717 */
  get Quote_717(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_717);
  }

  /** Locator for li_Rate_Details_Hero */
  get li_Rate_Details_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Details_Hero);
  }

  /** Locator for Rate_Details_Hero_719 */
  get Rate_Details_Hero_719(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_719);
  }

  /** Locator for li_Rate_List_Accordion */
  get li_Rate_List_Accordion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_List_Accordion);
  }

  /** Locator for Rate_List_Accordion_721 */
  get Rate_List_Accordion_721(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_721);
  }

  /** Locator for li_Rate_Sheet_Grid */
  get li_Rate_Sheet_Grid(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Sheet_Grid);
  }

  /** Locator for Rate_Sheet_Grid_723 */
  get Rate_Sheet_Grid_723(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_723);
  }

  /** Locator for li_Ratings_Card */
  get li_Ratings_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Ratings_Card);
  }

  /** Locator for Ratings_Card_725 */
  get Ratings_Card_725(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_725);
  }

  /** Locator for li_RTE_Table */
  get li_RTE_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_RTE_Table);
  }

  /** Locator for RTE_Table_727 */
  get RTE_Table_727(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_727);
  }

  /** Locator for li_Section */
  get li_Section(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Section);
  }

  /** Locator for Section_729 */
  get Section_729(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_729);
  }

  /** Locator for li_Separator */
  get li_Separator(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Separator);
  }

  /** Locator for Separator_731 */
  get Separator_731(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_731);
  }

  /** Locator for li_Site_Search */
  get li_Site_Search(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Site_Search);
  }

  /** Locator for Site_Search_733 */
  get Site_Search_733(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_733);
  }

  /** Locator for li_Spacer */
  get li_Spacer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Spacer);
  }

  /** Locator for Spacer_735 */
  get Spacer_735(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_735);
  }

  /** Locator for li_Statistic */
  get li_Statistic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Statistic);
  }

  /** Locator for Statistic_737 */
  get Statistic_737(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_737);
  }

  /** Locator for li_Tabs */
  get li_Tabs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Tabs);
  }

  /** Locator for Tabs_739 */
  get Tabs_739(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_739);
  }

  /** Locator for li_Teaser_Card */
  get li_Teaser_Card(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Teaser_Card);
  }

  /** Locator for Teaser_Card_741 */
  get Teaser_Card_741(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_741);
  }

  /** Locator for li_Text */
  get li_Text(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Text);
  }

  /** Locator for Text_743 */
  get Text_743(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_743);
  }

  /** Locator for li_Video_External */
  get li_Video_External(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Video_External);
  }

  /** Locator for Video_External_745 */
  get Video_External_745(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_745);
  }

  /** Locator for li_Workbench */
  get li_Workbench(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Workbench);
  }

  /** Locator for Workbench_747 */
  get Workbench_747(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_747);
  }

  /** Locator for navigationD95ec9c1a1Item_83f7afdff6 */
  get navigationD95ec9c1a1Item_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_83f7afdff6);
  }

  /** Locator for Corporate_Agnostic_749 */
  get Corporate_Agnostic_749(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_749);
  }

  /** Locator for navigationD95ec9c1a1ItemC131db0ef8 */
  get navigationD95ec9c1a1ItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemC131db0ef8);
  }

  /** Locator for Main_751 */
  get Main_751(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_751);
  }

  /** Locator for li_English */
  get li_English(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English);
  }

  /** Locator for English_753 */
  get English_753(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_753);
  }

  /** Locator for navigationD95ec9c1a1ItemCc78444b86 */
  get navigationD95ec9c1a1ItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemCc78444b86);
  }

  /** Locator for Financial_Professionals_755 */
  get Financial_Professionals_755(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_755);
  }

  /** Locator for navigationD95ec9c1a1ItemCbb8c1caba */
  get navigationD95ec9c1a1ItemCbb8c1caba(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemCbb8c1caba);
  }

  /** Locator for Main_757 */
  get Main_757(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_757);
  }

  /** Locator for li_English_758 */
  get li_English_758(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_758);
  }

  /** Locator for English_759 */
  get English_759(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_759);
  }

  /** Locator for navigationD95ec9c1a1Item_0e452ee23a */
  get navigationD95ec9c1a1Item_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_0e452ee23a);
  }

  /** Locator for Individuals_761 */
  get Individuals_761(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_761);
  }

  /** Locator for navigationD95ec9c1a1Item_70efbfa4b4 */
  get navigationD95ec9c1a1Item_70efbfa4b4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_70efbfa4b4);
  }

  /** Locator for Main_763 */
  get Main_763(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_763);
  }

  /** Locator for li_English_764 */
  get li_English_764(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_764);
  }

  /** Locator for English_765 */
  get English_765(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_765);
  }

  /** Locator for navigationD95ec9c1a1Item_047745266e */
  get navigationD95ec9c1a1Item_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1Item_047745266e);
  }

  /** Locator for Preneed_767 */
  get Preneed_767(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_767);
  }

  /** Locator for navigationD95ec9c1a1ItemD51d767ca3 */
  get navigationD95ec9c1a1ItemD51d767ca3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationD95ec9c1a1ItemD51d767ca3);
  }

  /** Locator for Main_769 */
  get Main_769(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_769);
  }

  /** Locator for li_English_770 */
  get li_English_770(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_770);
  }

  /** Locator for English_771 */
  get English_771(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_771);
  }

  /** Locator for navigation_862a3a9298Item_3dd3bf6e7a */
  get navigation_862a3a9298Item_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_3dd3bf6e7a);
  }

  /** Locator for Style_Guide_773 */
  get Style_Guide_773(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_773);
  }

  /** Locator for navigation_862a3a9298ItemF52820d1fe */
  get navigation_862a3a9298ItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemF52820d1fe);
  }

  /** Locator for Templates_775 */
  get Templates_775(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_775);
  }

  /** Locator for li_Freeform_Template_776 */
  get li_Freeform_Template_776(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Freeform_Template_776);
  }

  /** Locator for Freeform_Template_777 */
  get Freeform_Template_777(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_777);
  }

  /** Locator for li_Insights_Detail_Template_778 */
  get li_Insights_Detail_Template_778(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Template_778);
  }

  /** Locator for Insights_Detail_Template_779 */
  get Insights_Detail_Template_779(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_779);
  }

  /** Locator for li_Product_Detail_Page_780 */
  get li_Product_Detail_Page_780(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Detail_Page_780);
  }

  /** Locator for Product_Detail_Page__781 */
  get Product_Detail_Page__781(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__781);
  }

  /** Locator for li_Product_Rate_Page_ForeIncome_I_782 */
  get li_Product_Rate_Page_ForeIncome_I_782(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Rate_Page_ForeIncome_I_782);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_783 */
  get Product_Rate_Page_ForeIncome_I_783(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_783);
  }

  /** Locator for li_Homepage_Template_784 */
  get li_Homepage_Template_784(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Template_784);
  }

  /** Locator for Homepage_Template_785 */
  get Homepage_Template_785(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_785);
  }

  /** Locator for li_Rate_Admin_Template_786 */
  get li_Rate_Admin_Template_786(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Admin_Template_786);
  }

  /** Locator for Rate_Admin_Template_787 */
  get Rate_Admin_Template_787(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_787);
  }

  /** Locator for li_Branding_788 */
  get li_Branding_788(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Branding_788);
  }

  /** Locator for Branding_789 */
  get Branding_789(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_789);
  }

  /** Locator for navigation_862a3a9298Item_2b248a5ea1 */
  get navigation_862a3a9298Item_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_2b248a5ea1);
  }

  /** Locator for Component_Library_791 */
  get Component_Library_791(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_791);
  }

  /** Locator for li_Accordion_792 */
  get li_Accordion_792(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_792);
  }

  /** Locator for Accordion_793 */
  get Accordion_793(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_793);
  }

  /** Locator for navigation_862a3a9298Item_7282c86477 */
  get navigation_862a3a9298Item_7282c86477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_7282c86477);
  }

  /** Locator for Accordion_Tabs_Feature_795 */
  get Accordion_Tabs_Feature_795(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_795);
  }

  /** Locator for navigation_862a3a9298Item_67f1c24b4b */
  get navigation_862a3a9298Item_67f1c24b4b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_67f1c24b4b);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_797 */
  get Accordion_Tabs_FeatureWith_Sc_797(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_797);
  }

  /** Locator for li_Accordion_Tabs_FeatureWith_He_798 */
  get li_Accordion_Tabs_FeatureWith_He_798(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWith_He_798);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_799 */
  get Accordion_Tabs_FeatureWith_He_799(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_799);
  }

  /** Locator for li_Accordion_Tabs_FeatureWithout_800 */
  get li_Accordion_Tabs_FeatureWithout_800(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWithout_800);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_801 */
  get Accordion_Tabs_FeatureWithout_801(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_801);
  }

  /** Locator for li_Alert_Banner_802 */
  get li_Alert_Banner_802(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Alert_Banner_802);
  }

  /** Locator for Alert_Banner_803 */
  get Alert_Banner_803(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_803);
  }

  /** Locator for li_Benefits_Table_804 */
  get li_Benefits_Table_804(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Benefits_Table_804);
  }

  /** Locator for Benefits_Table_805 */
  get Benefits_Table_805(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_805);
  }

  /** Locator for li_Bio_Card_806 */
  get li_Bio_Card_806(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Bio_Card_806);
  }

  /** Locator for Bio_Card_807 */
  get Bio_Card_807(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_807);
  }

  /** Locator for li_Brand_Relationship_808 */
  get li_Brand_Relationship_808(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Brand_Relationship_808);
  }

  /** Locator for Brand_Relationship_809 */
  get Brand_Relationship_809(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_809);
  }

  /** Locator for li_Breadcrumb_810 */
  get li_Breadcrumb_810(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Breadcrumb_810);
  }

  /** Locator for Breadcrumb_811 */
  get Breadcrumb_811(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_811);
  }

  /** Locator for li_Button_812 */
  get li_Button_812(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Button_812);
  }

  /** Locator for Button_813 */
  get Button_813(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_813);
  }

  /** Locator for navigation_862a3a9298ItemA2306335d1 */
  get navigation_862a3a9298ItemA2306335d1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemA2306335d1);
  }

  /** Locator for Button_IllustrationsAnd_Login_815 */
  get Button_IllustrationsAnd_Login_815(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_815);
  }

  /** Locator for li_Content_Highlight_816 */
  get li_Content_Highlight_816(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Highlight_816);
  }

  /** Locator for Content_Highlight_817 */
  get Content_Highlight_817(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_817);
  }

  /** Locator for li_Content_Trail_818 */
  get li_Content_Trail_818(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Trail_818);
  }

  /** Locator for Content_Trail_819 */
  get Content_Trail_819(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_819);
  }

  /** Locator for li_Decision_Tree_820 */
  get li_Decision_Tree_820(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Decision_Tree_820);
  }

  /** Locator for Decision_Tree_821 */
  get Decision_Tree_821(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_821);
  }

  /** Locator for li_Detail_Hero_822 */
  get li_Detail_Hero_822(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Detail_Hero_822);
  }

  /** Locator for Detail_Hero_823 */
  get Detail_Hero_823(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_823);
  }

  /** Locator for li_Disclosure_List_824 */
  get li_Disclosure_List_824(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Disclosure_List_824);
  }

  /** Locator for Disclosure_List_825 */
  get Disclosure_List_825(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_825);
  }

  /** Locator for li_Enhanced_Related_Content_826 */
  get li_Enhanced_Related_Content_826(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Enhanced_Related_Content_826);
  }

  /** Locator for Enhanced_Related_Content_827 */
  get Enhanced_Related_Content_827(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_827);
  }

  /** Locator for li_Feature_Banner_828 */
  get li_Feature_Banner_828(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_828);
  }

  /** Locator for Feature_Banner_829 */
  get Feature_Banner_829(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_829);
  }

  /** Locator for li_Feature_Banner_5050_Layout_830 */
  get li_Feature_Banner_5050_Layout_830(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_5050_Layout_830);
  }

  /** Locator for Feature_Banner_5050_Layout_831 */
  get Feature_Banner_5050_Layout_831(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_831);
  }

  /** Locator for li_Firm_Selection_Modal_832 */
  get li_Firm_Selection_Modal_832(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Firm_Selection_Modal_832);
  }

  /** Locator for Firm_Selection_Modal_833 */
  get Firm_Selection_Modal_833(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_833);
  }

  /** Locator for li_Footer_Disclosure_834 */
  get li_Footer_Disclosure_834(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Footer_Disclosure_834);
  }

  /** Locator for Footer_Disclosure_835 */
  get Footer_Disclosure_835(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_835);
  }

  /** Locator for li_Form_Options_836 */
  get li_Form_Options_836(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Form_Options_836);
  }

  /** Locator for Form_Options_837 */
  get Form_Options_837(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_837);
  }

  /** Locator for li_Grid_Container_838 */
  get li_Grid_Container_838(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Grid_Container_838);
  }

  /** Locator for Grid_Container_839 */
  get Grid_Container_839(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_839);
  }

  /** Locator for li_Headline_Block_840 */
  get li_Headline_Block_840(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Headline_Block_840);
  }

  /** Locator for Headline_Block_841 */
  get Headline_Block_841(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_841);
  }

  /** Locator for li_Hero_5050_842 */
  get li_Hero_5050_842(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050_842);
  }

  /** Locator for Hero_5050_843 */
  get Hero_5050_843(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_843);
  }

  /** Locator for li_Homepage_Hero_844 */
  get li_Homepage_Hero_844(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Hero_844);
  }

  /** Locator for Homepage_Hero_845 */
  get Homepage_Hero_845(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_845);
  }

  /** Locator for li_Image_846 */
  get li_Image_846(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_846);
  }

  /** Locator for Image_847 */
  get Image_847(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_847);
  }

  /** Locator for li_Image_With_Nested_Content_848 */
  get li_Image_With_Nested_Content_848(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_With_Nested_Content_848);
  }

  /** Locator for Image_With_Nested_Content_849 */
  get Image_With_Nested_Content_849(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_849);
  }

  /** Locator for li_In_Brief_850 */
  get li_In_Brief_850(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_In_Brief_850);
  }

  /** Locator for In_Brief_851 */
  get In_Brief_851(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_851);
  }

  /** Locator for li_Insights_Detail_Hero_852 */
  get li_Insights_Detail_Hero_852(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Hero_852);
  }

  /** Locator for Insights_Detail_Hero_853 */
  get Insights_Detail_Hero_853(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_853);
  }

  /** Locator for li_Insights_Listing_854 */
  get li_Insights_Listing_854(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Listing_854);
  }

  /** Locator for Insights_Listing_855 */
  get Insights_Listing_855(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_855);
  }

  /** Locator for li_Login_856 */
  get li_Login_856(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Login_856);
  }

  /** Locator for Login_857 */
  get Login_857(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_857);
  }

  /** Locator for li_Navigation_858 */
  get li_Navigation_858(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Navigation_858);
  }

  /** Locator for Navigation_859 */
  get Navigation_859(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_859);
  }

  /** Locator for li_Product_Comparison_Card_860 */
  get li_Product_Comparison_Card_860(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Comparison_Card_860);
  }

  /** Locator for Product_Comparison_Card_861 */
  get Product_Comparison_Card_861(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_861);
  }

  /** Locator for li_Product_Path_Detail_Card_862 */
  get li_Product_Path_Detail_Card_862(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Detail_Card_862);
  }

  /** Locator for Product_Path_Detail_Card_863 */
  get Product_Path_Detail_Card_863(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_863);
  }

  /** Locator for li_Product_Path_Summary_Card_864 */
  get li_Product_Path_Summary_Card_864(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Summary_Card_864);
  }

  /** Locator for Product_Path_Summary_Card_865 */
  get Product_Path_Summary_Card_865(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_865);
  }

  /** Locator for navigation_862a3a9298Item_8d21a80f63 */
  get navigation_862a3a9298Item_8d21a80f63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_8d21a80f63);
  }

  /** Locator for Product_Rate_Table_867 */
  get Product_Rate_Table_867(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_867);
  }

  /** Locator for li_ForeCertain_Income_Annuity_868 */
  get li_ForeCertain_Income_Annuity_868(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Income_Annuity_868);
  }

  /** Locator for ForeCertain_Income_Annuity_869 */
  get ForeCertain_Income_Annuity_869(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_869);
  }

  /** Locator for li_ForeIncome_II_Fixed_Index_Annu_870 */
  get li_ForeIncome_II_Fixed_Index_Annu_870(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeIncome_II_Fixed_Index_Annu_870);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_871 */
  get ForeIncome_II_Fixed_Index_Annu_871(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_871);
  }

  /** Locator for li_SecureFore_II_Fixed_Annuity_872 */
  get li_SecureFore_II_Fixed_Annuity_872(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_II_Fixed_Annuity_872);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_873 */
  get SecureFore_II_Fixed_Annuity_873(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_873);
  }

  /** Locator for li_SecureFore_Rates_874 */
  get li_SecureFore_Rates_874(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_Rates_874);
  }

  /** Locator for SecureFore_Rates_875 */
  get SecureFore_Rates_875(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_875);
  }

  /** Locator for liForestructuredgrowthii_876 */
  get liForestructuredgrowthii_876(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liForestructuredgrowthii_876);
  }

  /** Locator for forestructuredgrowthii_877 */
  get forestructuredgrowthii_877(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_877);
  }

  /** Locator for li_Income_150_SE_878 */
  get li_Income_150_SE_878(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Income_150_SE_878);
  }

  /** Locator for Income_150_SE_879 */
  get Income_150_SE_879(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_879);
  }

  /** Locator for li_ForeCare_Fixed_Annuity_880 */
  get li_ForeCare_Fixed_Annuity_880(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCare_Fixed_Annuity_880);
  }

  /** Locator for ForeCare_Fixed_Annuity_881 */
  get ForeCare_Fixed_Annuity_881(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_881);
  }

  /** Locator for li_ForeAccumulation_II_Fixed_Inde_882 */
  get li_ForeAccumulation_II_Fixed_Inde_882(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeAccumulation_II_Fixed_Inde_882);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_883 */
  get ForeAccumulation_II_Fixed_Inde_883(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_883);
  }

  /** Locator for li_ForeCertain_Advisory_884 */
  get li_ForeCertain_Advisory_884(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Advisory_884);
  }

  /** Locator for ForeCertain_Advisory_885 */
  get ForeCertain_Advisory_885(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_885);
  }

  /** Locator for li_Promo_Banner_886 */
  get li_Promo_Banner_886(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Promo_Banner_886);
  }

  /** Locator for Promo_Banner_887 */
  get Promo_Banner_887(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_887);
  }

  /** Locator for li_Quote_888 */
  get li_Quote_888(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Quote_888);
  }

  /** Locator for Quote_889 */
  get Quote_889(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_889);
  }

  /** Locator for li_Rate_Details_Hero_890 */
  get li_Rate_Details_Hero_890(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Details_Hero_890);
  }

  /** Locator for Rate_Details_Hero_891 */
  get Rate_Details_Hero_891(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_891);
  }

  /** Locator for li_Rate_List_Accordion_892 */
  get li_Rate_List_Accordion_892(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_List_Accordion_892);
  }

  /** Locator for Rate_List_Accordion_893 */
  get Rate_List_Accordion_893(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_893);
  }

  /** Locator for li_Rate_Sheet_Grid_894 */
  get li_Rate_Sheet_Grid_894(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Sheet_Grid_894);
  }

  /** Locator for Rate_Sheet_Grid_895 */
  get Rate_Sheet_Grid_895(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_895);
  }

  /** Locator for li_Ratings_Card_896 */
  get li_Ratings_Card_896(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Ratings_Card_896);
  }

  /** Locator for Ratings_Card_897 */
  get Ratings_Card_897(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_897);
  }

  /** Locator for li_RTE_Table_898 */
  get li_RTE_Table_898(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_RTE_Table_898);
  }

  /** Locator for RTE_Table_899 */
  get RTE_Table_899(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_899);
  }

  /** Locator for li_Section_900 */
  get li_Section_900(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Section_900);
  }

  /** Locator for Section_901 */
  get Section_901(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_901);
  }

  /** Locator for li_Separator_902 */
  get li_Separator_902(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Separator_902);
  }

  /** Locator for Separator_903 */
  get Separator_903(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_903);
  }

  /** Locator for li_Site_Search_904 */
  get li_Site_Search_904(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Site_Search_904);
  }

  /** Locator for Site_Search_905 */
  get Site_Search_905(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_905);
  }

  /** Locator for li_Spacer_906 */
  get li_Spacer_906(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Spacer_906);
  }

  /** Locator for Spacer_907 */
  get Spacer_907(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_907);
  }

  /** Locator for li_Statistic_908 */
  get li_Statistic_908(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Statistic_908);
  }

  /** Locator for Statistic_909 */
  get Statistic_909(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_909);
  }

  /** Locator for li_Tabs_910 */
  get li_Tabs_910(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Tabs_910);
  }

  /** Locator for Tabs_911 */
  get Tabs_911(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_911);
  }

  /** Locator for li_Teaser_Card_912 */
  get li_Teaser_Card_912(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Teaser_Card_912);
  }

  /** Locator for Teaser_Card_913 */
  get Teaser_Card_913(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_913);
  }

  /** Locator for li_Text_914 */
  get li_Text_914(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Text_914);
  }

  /** Locator for Text_915 */
  get Text_915(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_915);
  }

  /** Locator for li_Video_External_916 */
  get li_Video_External_916(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Video_External_916);
  }

  /** Locator for Video_External_917 */
  get Video_External_917(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_917);
  }

  /** Locator for li_Workbench_918 */
  get li_Workbench_918(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Workbench_918);
  }

  /** Locator for Workbench_919 */
  get Workbench_919(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_919);
  }

  /** Locator for navigation_862a3a9298Item_83f7afdff6 */
  get navigation_862a3a9298Item_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_83f7afdff6);
  }

  /** Locator for Corporate_Agnostic_921 */
  get Corporate_Agnostic_921(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_921);
  }

  /** Locator for navigation_862a3a9298ItemC131db0ef8 */
  get navigation_862a3a9298ItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemC131db0ef8);
  }

  /** Locator for Main_923 */
  get Main_923(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_923);
  }

  /** Locator for li_English_924 */
  get li_English_924(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_924);
  }

  /** Locator for English_925 */
  get English_925(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_925);
  }

  /** Locator for navigation_862a3a9298ItemCc78444b86 */
  get navigation_862a3a9298ItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemCc78444b86);
  }

  /** Locator for Financial_Professionals_927 */
  get Financial_Professionals_927(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_927);
  }

  /** Locator for navigation_862a3a9298ItemCbb8c1caba */
  get navigation_862a3a9298ItemCbb8c1caba(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemCbb8c1caba);
  }

  /** Locator for Main_929 */
  get Main_929(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_929);
  }

  /** Locator for li_English_930 */
  get li_English_930(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_930);
  }

  /** Locator for English_931 */
  get English_931(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_931);
  }

  /** Locator for navigation_862a3a9298Item_0e452ee23a */
  get navigation_862a3a9298Item_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_0e452ee23a);
  }

  /** Locator for Individuals_933 */
  get Individuals_933(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_933);
  }

  /** Locator for navigation_862a3a9298Item_70efbfa4b4 */
  get navigation_862a3a9298Item_70efbfa4b4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_70efbfa4b4);
  }

  /** Locator for Main_935 */
  get Main_935(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_935);
  }

  /** Locator for li_English_936 */
  get li_English_936(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_936);
  }

  /** Locator for English_937 */
  get English_937(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_937);
  }

  /** Locator for navigation_862a3a9298Item_047745266e */
  get navigation_862a3a9298Item_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298Item_047745266e);
  }

  /** Locator for Preneed_939 */
  get Preneed_939(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_939);
  }

  /** Locator for navigation_862a3a9298ItemD51d767ca3 */
  get navigation_862a3a9298ItemD51d767ca3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_862a3a9298ItemD51d767ca3);
  }

  /** Locator for Main_941 */
  get Main_941(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_941);
  }

  /** Locator for li_English_942 */
  get li_English_942(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_942);
  }

  /** Locator for English_943 */
  get English_943(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_943);
  }

  /** Locator for navigation_6ca70e2234Item_3dd3bf6e7a */
  get navigation_6ca70e2234Item_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_3dd3bf6e7a);
  }

  /** Locator for Style_Guide_945 */
  get Style_Guide_945(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_945);
  }

  /** Locator for navigation_6ca70e2234ItemF52820d1fe */
  get navigation_6ca70e2234ItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234ItemF52820d1fe);
  }

  /** Locator for Templates_947 */
  get Templates_947(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_947);
  }

  /** Locator for li_Freeform_Template_948 */
  get li_Freeform_Template_948(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Freeform_Template_948);
  }

  /** Locator for Freeform_Template_949 */
  get Freeform_Template_949(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_949);
  }

  /** Locator for li_Insights_Detail_Template_950 */
  get li_Insights_Detail_Template_950(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Template_950);
  }

  /** Locator for Insights_Detail_Template_951 */
  get Insights_Detail_Template_951(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_951);
  }

  /** Locator for li_Product_Detail_Page_952 */
  get li_Product_Detail_Page_952(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Detail_Page_952);
  }

  /** Locator for Product_Detail_Page__953 */
  get Product_Detail_Page__953(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__953);
  }

  /** Locator for li_Product_Rate_Page_ForeIncome_I_954 */
  get li_Product_Rate_Page_ForeIncome_I_954(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Rate_Page_ForeIncome_I_954);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_955 */
  get Product_Rate_Page_ForeIncome_I_955(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_955);
  }

  /** Locator for li_Homepage_Template_956 */
  get li_Homepage_Template_956(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Template_956);
  }

  /** Locator for Homepage_Template_957 */
  get Homepage_Template_957(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_957);
  }

  /** Locator for li_Rate_Admin_Template_958 */
  get li_Rate_Admin_Template_958(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Admin_Template_958);
  }

  /** Locator for Rate_Admin_Template_959 */
  get Rate_Admin_Template_959(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_959);
  }

  /** Locator for li_Branding_960 */
  get li_Branding_960(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Branding_960);
  }

  /** Locator for Branding_961 */
  get Branding_961(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_961);
  }

  /** Locator for navigation_6ca70e2234Item_2b248a5ea1 */
  get navigation_6ca70e2234Item_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_2b248a5ea1);
  }

  /** Locator for Component_Library_963 */
  get Component_Library_963(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_963);
  }

  /** Locator for li_Accordion_964 */
  get li_Accordion_964(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_964);
  }

  /** Locator for Accordion_965 */
  get Accordion_965(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_965);
  }

  /** Locator for navigation_6ca70e2234Item_7282c86477 */
  get navigation_6ca70e2234Item_7282c86477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_7282c86477);
  }

  /** Locator for Accordion_Tabs_Feature_967 */
  get Accordion_Tabs_Feature_967(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_967);
  }

  /** Locator for navigation_6ca70e2234Item_67f1c24b4b */
  get navigation_6ca70e2234Item_67f1c24b4b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_67f1c24b4b);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_969 */
  get Accordion_Tabs_FeatureWith_Sc_969(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_969);
  }

  /** Locator for li_Accordion_Tabs_FeatureWith_He_970 */
  get li_Accordion_Tabs_FeatureWith_He_970(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWith_He_970);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_971 */
  get Accordion_Tabs_FeatureWith_He_971(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_971);
  }

  /** Locator for li_Accordion_Tabs_FeatureWithout_972 */
  get li_Accordion_Tabs_FeatureWithout_972(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWithout_972);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_973 */
  get Accordion_Tabs_FeatureWithout_973(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_973);
  }

  /** Locator for li_Alert_Banner_974 */
  get li_Alert_Banner_974(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Alert_Banner_974);
  }

  /** Locator for Alert_Banner_975 */
  get Alert_Banner_975(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_975);
  }

  /** Locator for li_Benefits_Table_976 */
  get li_Benefits_Table_976(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Benefits_Table_976);
  }

  /** Locator for Benefits_Table_977 */
  get Benefits_Table_977(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_977);
  }

  /** Locator for li_Bio_Card_978 */
  get li_Bio_Card_978(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Bio_Card_978);
  }

  /** Locator for Bio_Card_979 */
  get Bio_Card_979(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_979);
  }

  /** Locator for li_Brand_Relationship_980 */
  get li_Brand_Relationship_980(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Brand_Relationship_980);
  }

  /** Locator for Brand_Relationship_981 */
  get Brand_Relationship_981(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_981);
  }

  /** Locator for li_Breadcrumb_982 */
  get li_Breadcrumb_982(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Breadcrumb_982);
  }

  /** Locator for Breadcrumb_983 */
  get Breadcrumb_983(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_983);
  }

  /** Locator for li_Button_984 */
  get li_Button_984(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Button_984);
  }

  /** Locator for Button_985 */
  get Button_985(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_985);
  }

  /** Locator for navigation_6ca70e2234ItemA2306335d1 */
  get navigation_6ca70e2234ItemA2306335d1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234ItemA2306335d1);
  }

  /** Locator for Button_IllustrationsAnd_Login_987 */
  get Button_IllustrationsAnd_Login_987(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_987);
  }

  /** Locator for li_Content_Highlight_988 */
  get li_Content_Highlight_988(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Highlight_988);
  }

  /** Locator for Content_Highlight_989 */
  get Content_Highlight_989(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_989);
  }

  /** Locator for li_Content_Trail_990 */
  get li_Content_Trail_990(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Trail_990);
  }

  /** Locator for Content_Trail_991 */
  get Content_Trail_991(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_991);
  }

  /** Locator for li_Decision_Tree_992 */
  get li_Decision_Tree_992(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Decision_Tree_992);
  }

  /** Locator for Decision_Tree_993 */
  get Decision_Tree_993(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_993);
  }

  /** Locator for li_Detail_Hero_994 */
  get li_Detail_Hero_994(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Detail_Hero_994);
  }

  /** Locator for Detail_Hero_995 */
  get Detail_Hero_995(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_995);
  }

  /** Locator for li_Disclosure_List_996 */
  get li_Disclosure_List_996(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Disclosure_List_996);
  }

  /** Locator for Disclosure_List_997 */
  get Disclosure_List_997(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_997);
  }

  /** Locator for li_Enhanced_Related_Content_998 */
  get li_Enhanced_Related_Content_998(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Enhanced_Related_Content_998);
  }

  /** Locator for Enhanced_Related_Content_999 */
  get Enhanced_Related_Content_999(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_999);
  }

  /** Locator for li_Feature_Banner_1000 */
  get li_Feature_Banner_1000(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_1000);
  }

  /** Locator for Feature_Banner_1001 */
  get Feature_Banner_1001(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_1001);
  }

  /** Locator for li_Feature_Banner_5050_Layout_1002 */
  get li_Feature_Banner_5050_Layout_1002(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_5050_Layout_1002);
  }

  /** Locator for Feature_Banner_5050_Layout_1003 */
  get Feature_Banner_5050_Layout_1003(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_1003);
  }

  /** Locator for li_Firm_Selection_Modal_1004 */
  get li_Firm_Selection_Modal_1004(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Firm_Selection_Modal_1004);
  }

  /** Locator for Firm_Selection_Modal_1005 */
  get Firm_Selection_Modal_1005(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_1005);
  }

  /** Locator for li_Footer_Disclosure_1006 */
  get li_Footer_Disclosure_1006(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Footer_Disclosure_1006);
  }

  /** Locator for Footer_Disclosure_1007 */
  get Footer_Disclosure_1007(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_1007);
  }

  /** Locator for li_Form_Options_1008 */
  get li_Form_Options_1008(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Form_Options_1008);
  }

  /** Locator for Form_Options_1009 */
  get Form_Options_1009(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_1009);
  }

  /** Locator for li_Grid_Container_1010 */
  get li_Grid_Container_1010(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Grid_Container_1010);
  }

  /** Locator for Grid_Container_1011 */
  get Grid_Container_1011(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_1011);
  }

  /** Locator for li_Headline_Block_1012 */
  get li_Headline_Block_1012(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Headline_Block_1012);
  }

  /** Locator for Headline_Block_1013 */
  get Headline_Block_1013(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_1013);
  }

  /** Locator for li_Hero_5050_1014 */
  get li_Hero_5050_1014(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050_1014);
  }

  /** Locator for Hero_5050_1015 */
  get Hero_5050_1015(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_1015);
  }

  /** Locator for li_Homepage_Hero_1016 */
  get li_Homepage_Hero_1016(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Hero_1016);
  }

  /** Locator for Homepage_Hero_1017 */
  get Homepage_Hero_1017(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_1017);
  }

  /** Locator for li_Image_1018 */
  get li_Image_1018(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_1018);
  }

  /** Locator for Image_1019 */
  get Image_1019(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_1019);
  }

  /** Locator for li_Image_With_Nested_Content_1020 */
  get li_Image_With_Nested_Content_1020(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_With_Nested_Content_1020);
  }

  /** Locator for Image_With_Nested_Content_1021 */
  get Image_With_Nested_Content_1021(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_1021);
  }

  /** Locator for li_In_Brief_1022 */
  get li_In_Brief_1022(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_In_Brief_1022);
  }

  /** Locator for In_Brief_1023 */
  get In_Brief_1023(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_1023);
  }

  /** Locator for li_Insights_Detail_Hero_1024 */
  get li_Insights_Detail_Hero_1024(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Hero_1024);
  }

  /** Locator for Insights_Detail_Hero_1025 */
  get Insights_Detail_Hero_1025(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_1025);
  }

  /** Locator for li_Insights_Listing_1026 */
  get li_Insights_Listing_1026(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Listing_1026);
  }

  /** Locator for Insights_Listing_1027 */
  get Insights_Listing_1027(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_1027);
  }

  /** Locator for li_Login_1028 */
  get li_Login_1028(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Login_1028);
  }

  /** Locator for Login_1029 */
  get Login_1029(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_1029);
  }

  /** Locator for li_Navigation_1030 */
  get li_Navigation_1030(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Navigation_1030);
  }

  /** Locator for Navigation_1031 */
  get Navigation_1031(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_1031);
  }

  /** Locator for li_Product_Comparison_Card_1032 */
  get li_Product_Comparison_Card_1032(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Comparison_Card_1032);
  }

  /** Locator for Product_Comparison_Card_1033 */
  get Product_Comparison_Card_1033(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_1033);
  }

  /** Locator for li_Product_Path_Detail_Card_1034 */
  get li_Product_Path_Detail_Card_1034(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Detail_Card_1034);
  }

  /** Locator for Product_Path_Detail_Card_1035 */
  get Product_Path_Detail_Card_1035(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_1035);
  }

  /** Locator for li_Product_Path_Summary_Card_1036 */
  get li_Product_Path_Summary_Card_1036(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Summary_Card_1036);
  }

  /** Locator for Product_Path_Summary_Card_1037 */
  get Product_Path_Summary_Card_1037(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_1037);
  }

  /** Locator for navigation_6ca70e2234Item_8d21a80f63 */
  get navigation_6ca70e2234Item_8d21a80f63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_8d21a80f63);
  }

  /** Locator for Product_Rate_Table_1039 */
  get Product_Rate_Table_1039(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_1039);
  }

  /** Locator for li_ForeCertain_Income_Annuity_1040 */
  get li_ForeCertain_Income_Annuity_1040(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Income_Annuity_1040);
  }

  /** Locator for ForeCertain_Income_Annuity_1041 */
  get ForeCertain_Income_Annuity_1041(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_1041);
  }

  /** Locator for li_ForeIncome_II_Fixed_Index_Annu_1042 */
  get li_ForeIncome_II_Fixed_Index_Annu_1042(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeIncome_II_Fixed_Index_Annu_1042);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_1043 */
  get ForeIncome_II_Fixed_Index_Annu_1043(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_1043);
  }

  /** Locator for li_SecureFore_II_Fixed_Annuity_1044 */
  get li_SecureFore_II_Fixed_Annuity_1044(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_II_Fixed_Annuity_1044);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_1045 */
  get SecureFore_II_Fixed_Annuity_1045(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_1045);
  }

  /** Locator for li_SecureFore_Rates_1046 */
  get li_SecureFore_Rates_1046(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_Rates_1046);
  }

  /** Locator for SecureFore_Rates_1047 */
  get SecureFore_Rates_1047(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_1047);
  }

  /** Locator for liForestructuredgrowthii_1048 */
  get liForestructuredgrowthii_1048(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liForestructuredgrowthii_1048);
  }

  /** Locator for forestructuredgrowthii_1049 */
  get forestructuredgrowthii_1049(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_1049);
  }

  /** Locator for li_Income_150_SE_1050 */
  get li_Income_150_SE_1050(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Income_150_SE_1050);
  }

  /** Locator for Income_150_SE_1051 */
  get Income_150_SE_1051(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_1051);
  }

  /** Locator for li_ForeCare_Fixed_Annuity_1052 */
  get li_ForeCare_Fixed_Annuity_1052(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCare_Fixed_Annuity_1052);
  }

  /** Locator for ForeCare_Fixed_Annuity_1053 */
  get ForeCare_Fixed_Annuity_1053(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_1053);
  }

  /** Locator for li_ForeAccumulation_II_Fixed_Inde_1054 */
  get li_ForeAccumulation_II_Fixed_Inde_1054(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeAccumulation_II_Fixed_Inde_1054);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_1055 */
  get ForeAccumulation_II_Fixed_Inde_1055(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_1055);
  }

  /** Locator for li_ForeCertain_Advisory_1056 */
  get li_ForeCertain_Advisory_1056(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Advisory_1056);
  }

  /** Locator for ForeCertain_Advisory_1057 */
  get ForeCertain_Advisory_1057(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_1057);
  }

  /** Locator for li_Promo_Banner_1058 */
  get li_Promo_Banner_1058(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Promo_Banner_1058);
  }

  /** Locator for Promo_Banner_1059 */
  get Promo_Banner_1059(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_1059);
  }

  /** Locator for li_Quote_1060 */
  get li_Quote_1060(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Quote_1060);
  }

  /** Locator for Quote_1061 */
  get Quote_1061(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_1061);
  }

  /** Locator for li_Rate_Details_Hero_1062 */
  get li_Rate_Details_Hero_1062(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Details_Hero_1062);
  }

  /** Locator for Rate_Details_Hero_1063 */
  get Rate_Details_Hero_1063(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_1063);
  }

  /** Locator for li_Rate_List_Accordion_1064 */
  get li_Rate_List_Accordion_1064(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_List_Accordion_1064);
  }

  /** Locator for Rate_List_Accordion_1065 */
  get Rate_List_Accordion_1065(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_1065);
  }

  /** Locator for li_Rate_Sheet_Grid_1066 */
  get li_Rate_Sheet_Grid_1066(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Sheet_Grid_1066);
  }

  /** Locator for Rate_Sheet_Grid_1067 */
  get Rate_Sheet_Grid_1067(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_1067);
  }

  /** Locator for li_Ratings_Card_1068 */
  get li_Ratings_Card_1068(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Ratings_Card_1068);
  }

  /** Locator for Ratings_Card_1069 */
  get Ratings_Card_1069(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_1069);
  }

  /** Locator for li_RTE_Table_1070 */
  get li_RTE_Table_1070(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_RTE_Table_1070);
  }

  /** Locator for RTE_Table_1071 */
  get RTE_Table_1071(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_1071);
  }

  /** Locator for li_Section_1072 */
  get li_Section_1072(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Section_1072);
  }

  /** Locator for Section_1073 */
  get Section_1073(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_1073);
  }

  /** Locator for li_Separator_1074 */
  get li_Separator_1074(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Separator_1074);
  }

  /** Locator for Separator_1075 */
  get Separator_1075(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_1075);
  }

  /** Locator for li_Site_Search_1076 */
  get li_Site_Search_1076(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Site_Search_1076);
  }

  /** Locator for Site_Search_1077 */
  get Site_Search_1077(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_1077);
  }

  /** Locator for li_Spacer_1078 */
  get li_Spacer_1078(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Spacer_1078);
  }

  /** Locator for Spacer_1079 */
  get Spacer_1079(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_1079);
  }

  /** Locator for li_Statistic_1080 */
  get li_Statistic_1080(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Statistic_1080);
  }

  /** Locator for Statistic_1081 */
  get Statistic_1081(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_1081);
  }

  /** Locator for li_Tabs_1082 */
  get li_Tabs_1082(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Tabs_1082);
  }

  /** Locator for Tabs_1083 */
  get Tabs_1083(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_1083);
  }

  /** Locator for li_Teaser_Card_1084 */
  get li_Teaser_Card_1084(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Teaser_Card_1084);
  }

  /** Locator for Teaser_Card_1085 */
  get Teaser_Card_1085(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_1085);
  }

  /** Locator for li_Text_1086 */
  get li_Text_1086(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Text_1086);
  }

  /** Locator for Text_1087 */
  get Text_1087(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_1087);
  }

  /** Locator for li_Video_External_1088 */
  get li_Video_External_1088(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Video_External_1088);
  }

  /** Locator for Video_External_1089 */
  get Video_External_1089(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_1089);
  }

  /** Locator for li_Workbench_1090 */
  get li_Workbench_1090(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Workbench_1090);
  }

  /** Locator for Workbench_1091 */
  get Workbench_1091(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_1091);
  }

  /** Locator for navigation_6ca70e2234Item_83f7afdff6 */
  get navigation_6ca70e2234Item_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_83f7afdff6);
  }

  /** Locator for Corporate_Agnostic_1093 */
  get Corporate_Agnostic_1093(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_1093);
  }

  /** Locator for navigation_6ca70e2234ItemC131db0ef8 */
  get navigation_6ca70e2234ItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234ItemC131db0ef8);
  }

  /** Locator for Main_1095 */
  get Main_1095(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1095);
  }

  /** Locator for li_English_1096 */
  get li_English_1096(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1096);
  }

  /** Locator for English_1097 */
  get English_1097(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1097);
  }

  /** Locator for navigation_6ca70e2234ItemCc78444b86 */
  get navigation_6ca70e2234ItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234ItemCc78444b86);
  }

  /** Locator for Financial_Professionals_1099 */
  get Financial_Professionals_1099(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_1099);
  }

  /** Locator for navigation_6ca70e2234ItemCbb8c1caba */
  get navigation_6ca70e2234ItemCbb8c1caba(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234ItemCbb8c1caba);
  }

  /** Locator for Main_1101 */
  get Main_1101(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1101);
  }

  /** Locator for li_English_1102 */
  get li_English_1102(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1102);
  }

  /** Locator for English_1103 */
  get English_1103(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1103);
  }

  /** Locator for navigation_6ca70e2234Item_0e452ee23a */
  get navigation_6ca70e2234Item_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_0e452ee23a);
  }

  /** Locator for Individuals_1105 */
  get Individuals_1105(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_1105);
  }

  /** Locator for navigation_6ca70e2234Item_70efbfa4b4 */
  get navigation_6ca70e2234Item_70efbfa4b4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_70efbfa4b4);
  }

  /** Locator for Main_1107 */
  get Main_1107(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1107);
  }

  /** Locator for li_English_1108 */
  get li_English_1108(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1108);
  }

  /** Locator for English_1109 */
  get English_1109(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1109);
  }

  /** Locator for navigation_6ca70e2234Item_047745266e */
  get navigation_6ca70e2234Item_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234Item_047745266e);
  }

  /** Locator for Preneed_1111 */
  get Preneed_1111(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_1111);
  }

  /** Locator for navigation_6ca70e2234ItemD51d767ca3 */
  get navigation_6ca70e2234ItemD51d767ca3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6ca70e2234ItemD51d767ca3);
  }

  /** Locator for Main_1113 */
  get Main_1113(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1113);
  }

  /** Locator for li_English_1114 */
  get li_English_1114(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1114);
  }

  /** Locator for English_1115 */
  get English_1115(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1115);
  }

  /** Locator for navigation_64a106b6d4Item_3dd3bf6e7a */
  get navigation_64a106b6d4Item_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_3dd3bf6e7a);
  }

  /** Locator for Style_Guide_1117 */
  get Style_Guide_1117(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_1117);
  }

  /** Locator for navigation_64a106b6d4ItemF52820d1fe */
  get navigation_64a106b6d4ItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4ItemF52820d1fe);
  }

  /** Locator for Templates_1119 */
  get Templates_1119(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_1119);
  }

  /** Locator for li_Freeform_Template_1120 */
  get li_Freeform_Template_1120(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Freeform_Template_1120);
  }

  /** Locator for Freeform_Template_1121 */
  get Freeform_Template_1121(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_1121);
  }

  /** Locator for li_Insights_Detail_Template_1122 */
  get li_Insights_Detail_Template_1122(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Template_1122);
  }

  /** Locator for Insights_Detail_Template_1123 */
  get Insights_Detail_Template_1123(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_1123);
  }

  /** Locator for li_Product_Detail_Page_1124 */
  get li_Product_Detail_Page_1124(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Detail_Page_1124);
  }

  /** Locator for Product_Detail_Page__1125 */
  get Product_Detail_Page__1125(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__1125);
  }

  /** Locator for li_Product_Rate_Page_ForeIncome_I_1126 */
  get li_Product_Rate_Page_ForeIncome_I_1126(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Rate_Page_ForeIncome_I_1126);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_1127 */
  get Product_Rate_Page_ForeIncome_I_1127(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_1127);
  }

  /** Locator for li_Homepage_Template_1128 */
  get li_Homepage_Template_1128(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Template_1128);
  }

  /** Locator for Homepage_Template_1129 */
  get Homepage_Template_1129(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_1129);
  }

  /** Locator for li_Rate_Admin_Template_1130 */
  get li_Rate_Admin_Template_1130(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Admin_Template_1130);
  }

  /** Locator for Rate_Admin_Template_1131 */
  get Rate_Admin_Template_1131(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_1131);
  }

  /** Locator for li_Branding_1132 */
  get li_Branding_1132(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Branding_1132);
  }

  /** Locator for Branding_1133 */
  get Branding_1133(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_1133);
  }

  /** Locator for navigation_64a106b6d4Item_2b248a5ea1 */
  get navigation_64a106b6d4Item_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_2b248a5ea1);
  }

  /** Locator for Component_Library_1135 */
  get Component_Library_1135(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_1135);
  }

  /** Locator for li_Accordion_1136 */
  get li_Accordion_1136(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_1136);
  }

  /** Locator for Accordion_1137 */
  get Accordion_1137(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_1137);
  }

  /** Locator for navigation_64a106b6d4Item_7282c86477 */
  get navigation_64a106b6d4Item_7282c86477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_7282c86477);
  }

  /** Locator for Accordion_Tabs_Feature_1139 */
  get Accordion_Tabs_Feature_1139(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_1139);
  }

  /** Locator for navigation_64a106b6d4Item_67f1c24b4b */
  get navigation_64a106b6d4Item_67f1c24b4b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_67f1c24b4b);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_1141 */
  get Accordion_Tabs_FeatureWith_Sc_1141(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_1141);
  }

  /** Locator for li_Accordion_Tabs_FeatureWith_He_1142 */
  get li_Accordion_Tabs_FeatureWith_He_1142(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWith_He_1142);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_1143 */
  get Accordion_Tabs_FeatureWith_He_1143(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_1143);
  }

  /** Locator for li_Accordion_Tabs_FeatureWithout_1144 */
  get li_Accordion_Tabs_FeatureWithout_1144(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWithout_1144);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_1145 */
  get Accordion_Tabs_FeatureWithout_1145(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_1145);
  }

  /** Locator for li_Alert_Banner_1146 */
  get li_Alert_Banner_1146(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Alert_Banner_1146);
  }

  /** Locator for Alert_Banner_1147 */
  get Alert_Banner_1147(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_1147);
  }

  /** Locator for li_Benefits_Table_1148 */
  get li_Benefits_Table_1148(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Benefits_Table_1148);
  }

  /** Locator for Benefits_Table_1149 */
  get Benefits_Table_1149(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_1149);
  }

  /** Locator for li_Bio_Card_1150 */
  get li_Bio_Card_1150(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Bio_Card_1150);
  }

  /** Locator for Bio_Card_1151 */
  get Bio_Card_1151(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_1151);
  }

  /** Locator for li_Brand_Relationship_1152 */
  get li_Brand_Relationship_1152(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Brand_Relationship_1152);
  }

  /** Locator for Brand_Relationship_1153 */
  get Brand_Relationship_1153(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_1153);
  }

  /** Locator for li_Breadcrumb_1154 */
  get li_Breadcrumb_1154(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Breadcrumb_1154);
  }

  /** Locator for Breadcrumb_1155 */
  get Breadcrumb_1155(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_1155);
  }

  /** Locator for li_Button_1156 */
  get li_Button_1156(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Button_1156);
  }

  /** Locator for Button_1157 */
  get Button_1157(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_1157);
  }

  /** Locator for navigation_64a106b6d4ItemA2306335d1 */
  get navigation_64a106b6d4ItemA2306335d1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4ItemA2306335d1);
  }

  /** Locator for Button_IllustrationsAnd_Login_1159 */
  get Button_IllustrationsAnd_Login_1159(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_1159);
  }

  /** Locator for li_Content_Highlight_1160 */
  get li_Content_Highlight_1160(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Highlight_1160);
  }

  /** Locator for Content_Highlight_1161 */
  get Content_Highlight_1161(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_1161);
  }

  /** Locator for li_Content_Trail_1162 */
  get li_Content_Trail_1162(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Trail_1162);
  }

  /** Locator for Content_Trail_1163 */
  get Content_Trail_1163(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_1163);
  }

  /** Locator for li_Decision_Tree_1164 */
  get li_Decision_Tree_1164(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Decision_Tree_1164);
  }

  /** Locator for Decision_Tree_1165 */
  get Decision_Tree_1165(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_1165);
  }

  /** Locator for li_Detail_Hero_1166 */
  get li_Detail_Hero_1166(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Detail_Hero_1166);
  }

  /** Locator for Detail_Hero_1167 */
  get Detail_Hero_1167(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_1167);
  }

  /** Locator for li_Disclosure_List_1168 */
  get li_Disclosure_List_1168(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Disclosure_List_1168);
  }

  /** Locator for Disclosure_List_1169 */
  get Disclosure_List_1169(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_1169);
  }

  /** Locator for li_Enhanced_Related_Content_1170 */
  get li_Enhanced_Related_Content_1170(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Enhanced_Related_Content_1170);
  }

  /** Locator for Enhanced_Related_Content_1171 */
  get Enhanced_Related_Content_1171(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_1171);
  }

  /** Locator for li_Feature_Banner_1172 */
  get li_Feature_Banner_1172(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_1172);
  }

  /** Locator for Feature_Banner_1173 */
  get Feature_Banner_1173(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_1173);
  }

  /** Locator for li_Feature_Banner_5050_Layout_1174 */
  get li_Feature_Banner_5050_Layout_1174(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_5050_Layout_1174);
  }

  /** Locator for Feature_Banner_5050_Layout_1175 */
  get Feature_Banner_5050_Layout_1175(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_1175);
  }

  /** Locator for li_Firm_Selection_Modal_1176 */
  get li_Firm_Selection_Modal_1176(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Firm_Selection_Modal_1176);
  }

  /** Locator for Firm_Selection_Modal_1177 */
  get Firm_Selection_Modal_1177(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_1177);
  }

  /** Locator for li_Footer_Disclosure_1178 */
  get li_Footer_Disclosure_1178(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Footer_Disclosure_1178);
  }

  /** Locator for Footer_Disclosure_1179 */
  get Footer_Disclosure_1179(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_1179);
  }

  /** Locator for li_Form_Options_1180 */
  get li_Form_Options_1180(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Form_Options_1180);
  }

  /** Locator for Form_Options_1181 */
  get Form_Options_1181(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_1181);
  }

  /** Locator for li_Grid_Container_1182 */
  get li_Grid_Container_1182(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Grid_Container_1182);
  }

  /** Locator for Grid_Container_1183 */
  get Grid_Container_1183(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_1183);
  }

  /** Locator for li_Headline_Block_1184 */
  get li_Headline_Block_1184(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Headline_Block_1184);
  }

  /** Locator for Headline_Block_1185 */
  get Headline_Block_1185(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_1185);
  }

  /** Locator for li_Hero_5050_1186 */
  get li_Hero_5050_1186(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050_1186);
  }

  /** Locator for Hero_5050_1187 */
  get Hero_5050_1187(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_1187);
  }

  /** Locator for li_Homepage_Hero_1188 */
  get li_Homepage_Hero_1188(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Hero_1188);
  }

  /** Locator for Homepage_Hero_1189 */
  get Homepage_Hero_1189(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_1189);
  }

  /** Locator for li_Image_1190 */
  get li_Image_1190(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_1190);
  }

  /** Locator for Image_1191 */
  get Image_1191(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_1191);
  }

  /** Locator for li_Image_With_Nested_Content_1192 */
  get li_Image_With_Nested_Content_1192(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_With_Nested_Content_1192);
  }

  /** Locator for Image_With_Nested_Content_1193 */
  get Image_With_Nested_Content_1193(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_1193);
  }

  /** Locator for li_In_Brief_1194 */
  get li_In_Brief_1194(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_In_Brief_1194);
  }

  /** Locator for In_Brief_1195 */
  get In_Brief_1195(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_1195);
  }

  /** Locator for li_Insights_Detail_Hero_1196 */
  get li_Insights_Detail_Hero_1196(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Hero_1196);
  }

  /** Locator for Insights_Detail_Hero_1197 */
  get Insights_Detail_Hero_1197(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_1197);
  }

  /** Locator for li_Insights_Listing_1198 */
  get li_Insights_Listing_1198(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Listing_1198);
  }

  /** Locator for Insights_Listing_1199 */
  get Insights_Listing_1199(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_1199);
  }

  /** Locator for li_Login_1200 */
  get li_Login_1200(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Login_1200);
  }

  /** Locator for Login_1201 */
  get Login_1201(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_1201);
  }

  /** Locator for li_Navigation_1202 */
  get li_Navigation_1202(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Navigation_1202);
  }

  /** Locator for Navigation_1203 */
  get Navigation_1203(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_1203);
  }

  /** Locator for li_Product_Comparison_Card_1204 */
  get li_Product_Comparison_Card_1204(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Comparison_Card_1204);
  }

  /** Locator for Product_Comparison_Card_1205 */
  get Product_Comparison_Card_1205(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_1205);
  }

  /** Locator for li_Product_Path_Detail_Card_1206 */
  get li_Product_Path_Detail_Card_1206(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Detail_Card_1206);
  }

  /** Locator for Product_Path_Detail_Card_1207 */
  get Product_Path_Detail_Card_1207(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_1207);
  }

  /** Locator for li_Product_Path_Summary_Card_1208 */
  get li_Product_Path_Summary_Card_1208(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Summary_Card_1208);
  }

  /** Locator for Product_Path_Summary_Card_1209 */
  get Product_Path_Summary_Card_1209(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_1209);
  }

  /** Locator for navigation_64a106b6d4Item_8d21a80f63 */
  get navigation_64a106b6d4Item_8d21a80f63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_8d21a80f63);
  }

  /** Locator for Product_Rate_Table_1211 */
  get Product_Rate_Table_1211(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_1211);
  }

  /** Locator for li_ForeCertain_Income_Annuity_1212 */
  get li_ForeCertain_Income_Annuity_1212(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Income_Annuity_1212);
  }

  /** Locator for ForeCertain_Income_Annuity_1213 */
  get ForeCertain_Income_Annuity_1213(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_1213);
  }

  /** Locator for li_ForeIncome_II_Fixed_Index_Annu_1214 */
  get li_ForeIncome_II_Fixed_Index_Annu_1214(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeIncome_II_Fixed_Index_Annu_1214);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_1215 */
  get ForeIncome_II_Fixed_Index_Annu_1215(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_1215);
  }

  /** Locator for li_SecureFore_II_Fixed_Annuity_1216 */
  get li_SecureFore_II_Fixed_Annuity_1216(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_II_Fixed_Annuity_1216);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_1217 */
  get SecureFore_II_Fixed_Annuity_1217(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_1217);
  }

  /** Locator for li_SecureFore_Rates_1218 */
  get li_SecureFore_Rates_1218(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_Rates_1218);
  }

  /** Locator for SecureFore_Rates_1219 */
  get SecureFore_Rates_1219(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_1219);
  }

  /** Locator for liForestructuredgrowthii_1220 */
  get liForestructuredgrowthii_1220(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liForestructuredgrowthii_1220);
  }

  /** Locator for forestructuredgrowthii_1221 */
  get forestructuredgrowthii_1221(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_1221);
  }

  /** Locator for li_Income_150_SE_1222 */
  get li_Income_150_SE_1222(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Income_150_SE_1222);
  }

  /** Locator for Income_150_SE_1223 */
  get Income_150_SE_1223(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_1223);
  }

  /** Locator for li_ForeCare_Fixed_Annuity_1224 */
  get li_ForeCare_Fixed_Annuity_1224(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCare_Fixed_Annuity_1224);
  }

  /** Locator for ForeCare_Fixed_Annuity_1225 */
  get ForeCare_Fixed_Annuity_1225(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_1225);
  }

  /** Locator for li_ForeAccumulation_II_Fixed_Inde_1226 */
  get li_ForeAccumulation_II_Fixed_Inde_1226(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeAccumulation_II_Fixed_Inde_1226);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_1227 */
  get ForeAccumulation_II_Fixed_Inde_1227(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_1227);
  }

  /** Locator for li_ForeCertain_Advisory_1228 */
  get li_ForeCertain_Advisory_1228(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Advisory_1228);
  }

  /** Locator for ForeCertain_Advisory_1229 */
  get ForeCertain_Advisory_1229(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_1229);
  }

  /** Locator for li_Promo_Banner_1230 */
  get li_Promo_Banner_1230(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Promo_Banner_1230);
  }

  /** Locator for Promo_Banner_1231 */
  get Promo_Banner_1231(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_1231);
  }

  /** Locator for li_Quote_1232 */
  get li_Quote_1232(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Quote_1232);
  }

  /** Locator for Quote_1233 */
  get Quote_1233(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_1233);
  }

  /** Locator for li_Rate_Details_Hero_1234 */
  get li_Rate_Details_Hero_1234(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Details_Hero_1234);
  }

  /** Locator for Rate_Details_Hero_1235 */
  get Rate_Details_Hero_1235(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_1235);
  }

  /** Locator for li_Rate_List_Accordion_1236 */
  get li_Rate_List_Accordion_1236(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_List_Accordion_1236);
  }

  /** Locator for Rate_List_Accordion_1237 */
  get Rate_List_Accordion_1237(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_1237);
  }

  /** Locator for li_Rate_Sheet_Grid_1238 */
  get li_Rate_Sheet_Grid_1238(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Sheet_Grid_1238);
  }

  /** Locator for Rate_Sheet_Grid_1239 */
  get Rate_Sheet_Grid_1239(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_1239);
  }

  /** Locator for li_Ratings_Card_1240 */
  get li_Ratings_Card_1240(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Ratings_Card_1240);
  }

  /** Locator for Ratings_Card_1241 */
  get Ratings_Card_1241(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_1241);
  }

  /** Locator for li_RTE_Table_1242 */
  get li_RTE_Table_1242(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_RTE_Table_1242);
  }

  /** Locator for RTE_Table_1243 */
  get RTE_Table_1243(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_1243);
  }

  /** Locator for li_Section_1244 */
  get li_Section_1244(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Section_1244);
  }

  /** Locator for Section_1245 */
  get Section_1245(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_1245);
  }

  /** Locator for li_Separator_1246 */
  get li_Separator_1246(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Separator_1246);
  }

  /** Locator for Separator_1247 */
  get Separator_1247(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_1247);
  }

  /** Locator for li_Site_Search_1248 */
  get li_Site_Search_1248(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Site_Search_1248);
  }

  /** Locator for Site_Search_1249 */
  get Site_Search_1249(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_1249);
  }

  /** Locator for li_Spacer_1250 */
  get li_Spacer_1250(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Spacer_1250);
  }

  /** Locator for Spacer_1251 */
  get Spacer_1251(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_1251);
  }

  /** Locator for li_Statistic_1252 */
  get li_Statistic_1252(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Statistic_1252);
  }

  /** Locator for Statistic_1253 */
  get Statistic_1253(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_1253);
  }

  /** Locator for li_Tabs_1254 */
  get li_Tabs_1254(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Tabs_1254);
  }

  /** Locator for Tabs_1255 */
  get Tabs_1255(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_1255);
  }

  /** Locator for li_Teaser_Card_1256 */
  get li_Teaser_Card_1256(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Teaser_Card_1256);
  }

  /** Locator for Teaser_Card_1257 */
  get Teaser_Card_1257(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_1257);
  }

  /** Locator for li_Text_1258 */
  get li_Text_1258(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Text_1258);
  }

  /** Locator for Text_1259 */
  get Text_1259(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_1259);
  }

  /** Locator for li_Video_External_1260 */
  get li_Video_External_1260(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Video_External_1260);
  }

  /** Locator for Video_External_1261 */
  get Video_External_1261(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_1261);
  }

  /** Locator for li_Workbench_1262 */
  get li_Workbench_1262(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Workbench_1262);
  }

  /** Locator for Workbench_1263 */
  get Workbench_1263(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_1263);
  }

  /** Locator for navigation_64a106b6d4Item_83f7afdff6 */
  get navigation_64a106b6d4Item_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_83f7afdff6);
  }

  /** Locator for Corporate_Agnostic_1265 */
  get Corporate_Agnostic_1265(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_1265);
  }

  /** Locator for navigation_64a106b6d4ItemC131db0ef8 */
  get navigation_64a106b6d4ItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4ItemC131db0ef8);
  }

  /** Locator for Main_1267 */
  get Main_1267(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1267);
  }

  /** Locator for li_English_1268 */
  get li_English_1268(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1268);
  }

  /** Locator for English_1269 */
  get English_1269(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1269);
  }

  /** Locator for navigation_64a106b6d4ItemCc78444b86 */
  get navigation_64a106b6d4ItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4ItemCc78444b86);
  }

  /** Locator for Financial_Professionals_1271 */
  get Financial_Professionals_1271(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_1271);
  }

  /** Locator for navigation_64a106b6d4ItemCbb8c1caba */
  get navigation_64a106b6d4ItemCbb8c1caba(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4ItemCbb8c1caba);
  }

  /** Locator for Main_1273 */
  get Main_1273(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1273);
  }

  /** Locator for li_English_1274 */
  get li_English_1274(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1274);
  }

  /** Locator for English_1275 */
  get English_1275(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1275);
  }

  /** Locator for navigation_64a106b6d4Item_0e452ee23a */
  get navigation_64a106b6d4Item_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_0e452ee23a);
  }

  /** Locator for Individuals_1277 */
  get Individuals_1277(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_1277);
  }

  /** Locator for navigation_64a106b6d4Item_70efbfa4b4 */
  get navigation_64a106b6d4Item_70efbfa4b4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_70efbfa4b4);
  }

  /** Locator for Main_1279 */
  get Main_1279(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1279);
  }

  /** Locator for li_English_1280 */
  get li_English_1280(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1280);
  }

  /** Locator for English_1281 */
  get English_1281(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1281);
  }

  /** Locator for navigation_64a106b6d4Item_047745266e */
  get navigation_64a106b6d4Item_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4Item_047745266e);
  }

  /** Locator for Preneed_1283 */
  get Preneed_1283(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_1283);
  }

  /** Locator for navigation_64a106b6d4ItemD51d767ca3 */
  get navigation_64a106b6d4ItemD51d767ca3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_64a106b6d4ItemD51d767ca3);
  }

  /** Locator for Main_1285 */
  get Main_1285(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1285);
  }

  /** Locator for li_English_1286 */
  get li_English_1286(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1286);
  }

  /** Locator for English_1287 */
  get English_1287(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1287);
  }

  /** Locator for navigationA0aec2a78bItem_3dd3bf6e7a */
  get navigationA0aec2a78bItem_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_3dd3bf6e7a);
  }

  /** Locator for Style_Guide_1289 */
  get Style_Guide_1289(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_1289);
  }

  /** Locator for navigationA0aec2a78bItemF52820d1fe */
  get navigationA0aec2a78bItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItemF52820d1fe);
  }

  /** Locator for Templates_1291 */
  get Templates_1291(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_1291);
  }

  /** Locator for li_Freeform_Template_1292 */
  get li_Freeform_Template_1292(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Freeform_Template_1292);
  }

  /** Locator for Freeform_Template_1293 */
  get Freeform_Template_1293(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_1293);
  }

  /** Locator for li_Insights_Detail_Template_1294 */
  get li_Insights_Detail_Template_1294(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Template_1294);
  }

  /** Locator for Insights_Detail_Template_1295 */
  get Insights_Detail_Template_1295(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_1295);
  }

  /** Locator for li_Product_Detail_Page_1296 */
  get li_Product_Detail_Page_1296(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Detail_Page_1296);
  }

  /** Locator for Product_Detail_Page__1297 */
  get Product_Detail_Page__1297(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__1297);
  }

  /** Locator for li_Product_Rate_Page_ForeIncome_I_1298 */
  get li_Product_Rate_Page_ForeIncome_I_1298(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Rate_Page_ForeIncome_I_1298);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_1299 */
  get Product_Rate_Page_ForeIncome_I_1299(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_1299);
  }

  /** Locator for li_Homepage_Template_1300 */
  get li_Homepage_Template_1300(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Template_1300);
  }

  /** Locator for Homepage_Template_1301 */
  get Homepage_Template_1301(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_1301);
  }

  /** Locator for li_Rate_Admin_Template_1302 */
  get li_Rate_Admin_Template_1302(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Admin_Template_1302);
  }

  /** Locator for Rate_Admin_Template_1303 */
  get Rate_Admin_Template_1303(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_1303);
  }

  /** Locator for li_Branding_1304 */
  get li_Branding_1304(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Branding_1304);
  }

  /** Locator for Branding_1305 */
  get Branding_1305(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_1305);
  }

  /** Locator for navigationA0aec2a78bItem_2b248a5ea1 */
  get navigationA0aec2a78bItem_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_2b248a5ea1);
  }

  /** Locator for Component_Library_1307 */
  get Component_Library_1307(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_1307);
  }

  /** Locator for li_Accordion_1308 */
  get li_Accordion_1308(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_1308);
  }

  /** Locator for Accordion_1309 */
  get Accordion_1309(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_1309);
  }

  /** Locator for navigationA0aec2a78bItem_7282c86477 */
  get navigationA0aec2a78bItem_7282c86477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_7282c86477);
  }

  /** Locator for Accordion_Tabs_Feature_1311 */
  get Accordion_Tabs_Feature_1311(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_1311);
  }

  /** Locator for navigationA0aec2a78bItem_67f1c24b4b */
  get navigationA0aec2a78bItem_67f1c24b4b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_67f1c24b4b);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_1313 */
  get Accordion_Tabs_FeatureWith_Sc_1313(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_1313);
  }

  /** Locator for li_Accordion_Tabs_FeatureWith_He_1314 */
  get li_Accordion_Tabs_FeatureWith_He_1314(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWith_He_1314);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_1315 */
  get Accordion_Tabs_FeatureWith_He_1315(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_1315);
  }

  /** Locator for li_Accordion_Tabs_FeatureWithout_1316 */
  get li_Accordion_Tabs_FeatureWithout_1316(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWithout_1316);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_1317 */
  get Accordion_Tabs_FeatureWithout_1317(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_1317);
  }

  /** Locator for li_Alert_Banner_1318 */
  get li_Alert_Banner_1318(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Alert_Banner_1318);
  }

  /** Locator for Alert_Banner_1319 */
  get Alert_Banner_1319(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_1319);
  }

  /** Locator for li_Benefits_Table_1320 */
  get li_Benefits_Table_1320(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Benefits_Table_1320);
  }

  /** Locator for Benefits_Table_1321 */
  get Benefits_Table_1321(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_1321);
  }

  /** Locator for li_Bio_Card_1322 */
  get li_Bio_Card_1322(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Bio_Card_1322);
  }

  /** Locator for Bio_Card_1323 */
  get Bio_Card_1323(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_1323);
  }

  /** Locator for li_Brand_Relationship_1324 */
  get li_Brand_Relationship_1324(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Brand_Relationship_1324);
  }

  /** Locator for Brand_Relationship_1325 */
  get Brand_Relationship_1325(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_1325);
  }

  /** Locator for li_Breadcrumb_1326 */
  get li_Breadcrumb_1326(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Breadcrumb_1326);
  }

  /** Locator for Breadcrumb_1327 */
  get Breadcrumb_1327(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_1327);
  }

  /** Locator for li_Button_1328 */
  get li_Button_1328(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Button_1328);
  }

  /** Locator for Button_1329 */
  get Button_1329(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_1329);
  }

  /** Locator for navigationA0aec2a78bItemA2306335d1 */
  get navigationA0aec2a78bItemA2306335d1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItemA2306335d1);
  }

  /** Locator for Button_IllustrationsAnd_Login_1331 */
  get Button_IllustrationsAnd_Login_1331(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_1331);
  }

  /** Locator for li_Content_Highlight_1332 */
  get li_Content_Highlight_1332(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Highlight_1332);
  }

  /** Locator for Content_Highlight_1333 */
  get Content_Highlight_1333(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_1333);
  }

  /** Locator for li_Content_Trail_1334 */
  get li_Content_Trail_1334(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Trail_1334);
  }

  /** Locator for Content_Trail_1335 */
  get Content_Trail_1335(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_1335);
  }

  /** Locator for li_Decision_Tree_1336 */
  get li_Decision_Tree_1336(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Decision_Tree_1336);
  }

  /** Locator for Decision_Tree_1337 */
  get Decision_Tree_1337(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_1337);
  }

  /** Locator for li_Detail_Hero_1338 */
  get li_Detail_Hero_1338(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Detail_Hero_1338);
  }

  /** Locator for Detail_Hero_1339 */
  get Detail_Hero_1339(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_1339);
  }

  /** Locator for li_Disclosure_List_1340 */
  get li_Disclosure_List_1340(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Disclosure_List_1340);
  }

  /** Locator for Disclosure_List_1341 */
  get Disclosure_List_1341(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_1341);
  }

  /** Locator for li_Enhanced_Related_Content_1342 */
  get li_Enhanced_Related_Content_1342(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Enhanced_Related_Content_1342);
  }

  /** Locator for Enhanced_Related_Content_1343 */
  get Enhanced_Related_Content_1343(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_1343);
  }

  /** Locator for li_Feature_Banner_1344 */
  get li_Feature_Banner_1344(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_1344);
  }

  /** Locator for Feature_Banner_1345 */
  get Feature_Banner_1345(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_1345);
  }

  /** Locator for li_Feature_Banner_5050_Layout_1346 */
  get li_Feature_Banner_5050_Layout_1346(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_5050_Layout_1346);
  }

  /** Locator for Feature_Banner_5050_Layout_1347 */
  get Feature_Banner_5050_Layout_1347(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_1347);
  }

  /** Locator for li_Firm_Selection_Modal_1348 */
  get li_Firm_Selection_Modal_1348(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Firm_Selection_Modal_1348);
  }

  /** Locator for Firm_Selection_Modal_1349 */
  get Firm_Selection_Modal_1349(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_1349);
  }

  /** Locator for li_Footer_Disclosure_1350 */
  get li_Footer_Disclosure_1350(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Footer_Disclosure_1350);
  }

  /** Locator for Footer_Disclosure_1351 */
  get Footer_Disclosure_1351(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_1351);
  }

  /** Locator for li_Form_Options_1352 */
  get li_Form_Options_1352(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Form_Options_1352);
  }

  /** Locator for Form_Options_1353 */
  get Form_Options_1353(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_1353);
  }

  /** Locator for li_Grid_Container_1354 */
  get li_Grid_Container_1354(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Grid_Container_1354);
  }

  /** Locator for Grid_Container_1355 */
  get Grid_Container_1355(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_1355);
  }

  /** Locator for li_Headline_Block_1356 */
  get li_Headline_Block_1356(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Headline_Block_1356);
  }

  /** Locator for Headline_Block_1357 */
  get Headline_Block_1357(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_1357);
  }

  /** Locator for li_Hero_5050_1358 */
  get li_Hero_5050_1358(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050_1358);
  }

  /** Locator for Hero_5050_1359 */
  get Hero_5050_1359(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_1359);
  }

  /** Locator for li_Homepage_Hero_1360 */
  get li_Homepage_Hero_1360(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Hero_1360);
  }

  /** Locator for Homepage_Hero_1361 */
  get Homepage_Hero_1361(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_1361);
  }

  /** Locator for li_Image_1362 */
  get li_Image_1362(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_1362);
  }

  /** Locator for Image_1363 */
  get Image_1363(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_1363);
  }

  /** Locator for li_Image_With_Nested_Content_1364 */
  get li_Image_With_Nested_Content_1364(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_With_Nested_Content_1364);
  }

  /** Locator for Image_With_Nested_Content_1365 */
  get Image_With_Nested_Content_1365(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_1365);
  }

  /** Locator for li_In_Brief_1366 */
  get li_In_Brief_1366(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_In_Brief_1366);
  }

  /** Locator for In_Brief_1367 */
  get In_Brief_1367(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_1367);
  }

  /** Locator for li_Insights_Detail_Hero_1368 */
  get li_Insights_Detail_Hero_1368(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Hero_1368);
  }

  /** Locator for Insights_Detail_Hero_1369 */
  get Insights_Detail_Hero_1369(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_1369);
  }

  /** Locator for li_Insights_Listing_1370 */
  get li_Insights_Listing_1370(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Listing_1370);
  }

  /** Locator for Insights_Listing_1371 */
  get Insights_Listing_1371(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_1371);
  }

  /** Locator for li_Login_1372 */
  get li_Login_1372(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Login_1372);
  }

  /** Locator for Login_1373 */
  get Login_1373(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_1373);
  }

  /** Locator for li_Navigation_1374 */
  get li_Navigation_1374(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Navigation_1374);
  }

  /** Locator for Navigation_1375 */
  get Navigation_1375(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_1375);
  }

  /** Locator for li_Product_Comparison_Card_1376 */
  get li_Product_Comparison_Card_1376(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Comparison_Card_1376);
  }

  /** Locator for Product_Comparison_Card_1377 */
  get Product_Comparison_Card_1377(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_1377);
  }

  /** Locator for li_Product_Path_Detail_Card_1378 */
  get li_Product_Path_Detail_Card_1378(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Detail_Card_1378);
  }

  /** Locator for Product_Path_Detail_Card_1379 */
  get Product_Path_Detail_Card_1379(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_1379);
  }

  /** Locator for li_Product_Path_Summary_Card_1380 */
  get li_Product_Path_Summary_Card_1380(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Summary_Card_1380);
  }

  /** Locator for Product_Path_Summary_Card_1381 */
  get Product_Path_Summary_Card_1381(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_1381);
  }

  /** Locator for navigationA0aec2a78bItem_8d21a80f63 */
  get navigationA0aec2a78bItem_8d21a80f63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_8d21a80f63);
  }

  /** Locator for Product_Rate_Table_1383 */
  get Product_Rate_Table_1383(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_1383);
  }

  /** Locator for li_ForeCertain_Income_Annuity_1384 */
  get li_ForeCertain_Income_Annuity_1384(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Income_Annuity_1384);
  }

  /** Locator for ForeCertain_Income_Annuity_1385 */
  get ForeCertain_Income_Annuity_1385(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_1385);
  }

  /** Locator for li_ForeIncome_II_Fixed_Index_Annu_1386 */
  get li_ForeIncome_II_Fixed_Index_Annu_1386(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeIncome_II_Fixed_Index_Annu_1386);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_1387 */
  get ForeIncome_II_Fixed_Index_Annu_1387(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_1387);
  }

  /** Locator for li_SecureFore_II_Fixed_Annuity_1388 */
  get li_SecureFore_II_Fixed_Annuity_1388(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_II_Fixed_Annuity_1388);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_1389 */
  get SecureFore_II_Fixed_Annuity_1389(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_1389);
  }

  /** Locator for li_SecureFore_Rates_1390 */
  get li_SecureFore_Rates_1390(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_Rates_1390);
  }

  /** Locator for SecureFore_Rates_1391 */
  get SecureFore_Rates_1391(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_1391);
  }

  /** Locator for liForestructuredgrowthii_1392 */
  get liForestructuredgrowthii_1392(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liForestructuredgrowthii_1392);
  }

  /** Locator for forestructuredgrowthii_1393 */
  get forestructuredgrowthii_1393(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_1393);
  }

  /** Locator for li_Income_150_SE_1394 */
  get li_Income_150_SE_1394(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Income_150_SE_1394);
  }

  /** Locator for Income_150_SE_1395 */
  get Income_150_SE_1395(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_1395);
  }

  /** Locator for li_ForeCare_Fixed_Annuity_1396 */
  get li_ForeCare_Fixed_Annuity_1396(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCare_Fixed_Annuity_1396);
  }

  /** Locator for ForeCare_Fixed_Annuity_1397 */
  get ForeCare_Fixed_Annuity_1397(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_1397);
  }

  /** Locator for li_ForeAccumulation_II_Fixed_Inde_1398 */
  get li_ForeAccumulation_II_Fixed_Inde_1398(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeAccumulation_II_Fixed_Inde_1398);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_1399 */
  get ForeAccumulation_II_Fixed_Inde_1399(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_1399);
  }

  /** Locator for li_ForeCertain_Advisory_1400 */
  get li_ForeCertain_Advisory_1400(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Advisory_1400);
  }

  /** Locator for ForeCertain_Advisory_1401 */
  get ForeCertain_Advisory_1401(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_1401);
  }

  /** Locator for li_Promo_Banner_1402 */
  get li_Promo_Banner_1402(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Promo_Banner_1402);
  }

  /** Locator for Promo_Banner_1403 */
  get Promo_Banner_1403(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_1403);
  }

  /** Locator for li_Quote_1404 */
  get li_Quote_1404(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Quote_1404);
  }

  /** Locator for Quote_1405 */
  get Quote_1405(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_1405);
  }

  /** Locator for li_Rate_Details_Hero_1406 */
  get li_Rate_Details_Hero_1406(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Details_Hero_1406);
  }

  /** Locator for Rate_Details_Hero_1407 */
  get Rate_Details_Hero_1407(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_1407);
  }

  /** Locator for li_Rate_List_Accordion_1408 */
  get li_Rate_List_Accordion_1408(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_List_Accordion_1408);
  }

  /** Locator for Rate_List_Accordion_1409 */
  get Rate_List_Accordion_1409(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_1409);
  }

  /** Locator for li_Rate_Sheet_Grid_1410 */
  get li_Rate_Sheet_Grid_1410(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Sheet_Grid_1410);
  }

  /** Locator for Rate_Sheet_Grid_1411 */
  get Rate_Sheet_Grid_1411(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_1411);
  }

  /** Locator for li_Ratings_Card_1412 */
  get li_Ratings_Card_1412(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Ratings_Card_1412);
  }

  /** Locator for Ratings_Card_1413 */
  get Ratings_Card_1413(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_1413);
  }

  /** Locator for li_RTE_Table_1414 */
  get li_RTE_Table_1414(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_RTE_Table_1414);
  }

  /** Locator for RTE_Table_1415 */
  get RTE_Table_1415(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_1415);
  }

  /** Locator for li_Section_1416 */
  get li_Section_1416(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Section_1416);
  }

  /** Locator for Section_1417 */
  get Section_1417(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_1417);
  }

  /** Locator for li_Separator_1418 */
  get li_Separator_1418(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Separator_1418);
  }

  /** Locator for Separator_1419 */
  get Separator_1419(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_1419);
  }

  /** Locator for li_Site_Search_1420 */
  get li_Site_Search_1420(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Site_Search_1420);
  }

  /** Locator for Site_Search_1421 */
  get Site_Search_1421(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_1421);
  }

  /** Locator for li_Spacer_1422 */
  get li_Spacer_1422(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Spacer_1422);
  }

  /** Locator for Spacer_1423 */
  get Spacer_1423(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_1423);
  }

  /** Locator for li_Statistic_1424 */
  get li_Statistic_1424(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Statistic_1424);
  }

  /** Locator for Statistic_1425 */
  get Statistic_1425(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_1425);
  }

  /** Locator for li_Tabs_1426 */
  get li_Tabs_1426(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Tabs_1426);
  }

  /** Locator for Tabs_1427 */
  get Tabs_1427(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_1427);
  }

  /** Locator for li_Teaser_Card_1428 */
  get li_Teaser_Card_1428(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Teaser_Card_1428);
  }

  /** Locator for Teaser_Card_1429 */
  get Teaser_Card_1429(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_1429);
  }

  /** Locator for li_Text_1430 */
  get li_Text_1430(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Text_1430);
  }

  /** Locator for Text_1431 */
  get Text_1431(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_1431);
  }

  /** Locator for li_Video_External_1432 */
  get li_Video_External_1432(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Video_External_1432);
  }

  /** Locator for Video_External_1433 */
  get Video_External_1433(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_1433);
  }

  /** Locator for li_Workbench_1434 */
  get li_Workbench_1434(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Workbench_1434);
  }

  /** Locator for Workbench_1435 */
  get Workbench_1435(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_1435);
  }

  /** Locator for navigationA0aec2a78bItem_83f7afdff6 */
  get navigationA0aec2a78bItem_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_83f7afdff6);
  }

  /** Locator for Corporate_Agnostic_1437 */
  get Corporate_Agnostic_1437(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_1437);
  }

  /** Locator for navigationA0aec2a78bItemC131db0ef8 */
  get navigationA0aec2a78bItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItemC131db0ef8);
  }

  /** Locator for Main_1439 */
  get Main_1439(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1439);
  }

  /** Locator for li_English_1440 */
  get li_English_1440(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1440);
  }

  /** Locator for English_1441 */
  get English_1441(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1441);
  }

  /** Locator for navigationA0aec2a78bItemCc78444b86 */
  get navigationA0aec2a78bItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItemCc78444b86);
  }

  /** Locator for Financial_Professionals_1443 */
  get Financial_Professionals_1443(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_1443);
  }

  /** Locator for navigationA0aec2a78bItemCbb8c1caba */
  get navigationA0aec2a78bItemCbb8c1caba(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItemCbb8c1caba);
  }

  /** Locator for Main_1445 */
  get Main_1445(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1445);
  }

  /** Locator for li_English_1446 */
  get li_English_1446(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1446);
  }

  /** Locator for English_1447 */
  get English_1447(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1447);
  }

  /** Locator for navigationA0aec2a78bItem_0e452ee23a */
  get navigationA0aec2a78bItem_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_0e452ee23a);
  }

  /** Locator for Individuals_1449 */
  get Individuals_1449(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_1449);
  }

  /** Locator for navigationA0aec2a78bItem_70efbfa4b4 */
  get navigationA0aec2a78bItem_70efbfa4b4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_70efbfa4b4);
  }

  /** Locator for Main_1451 */
  get Main_1451(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1451);
  }

  /** Locator for li_English_1452 */
  get li_English_1452(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1452);
  }

  /** Locator for English_1453 */
  get English_1453(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1453);
  }

  /** Locator for navigationA0aec2a78bItem_047745266e */
  get navigationA0aec2a78bItem_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItem_047745266e);
  }

  /** Locator for Preneed_1455 */
  get Preneed_1455(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_1455);
  }

  /** Locator for navigationA0aec2a78bItemD51d767ca3 */
  get navigationA0aec2a78bItemD51d767ca3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigationA0aec2a78bItemD51d767ca3);
  }

  /** Locator for Main_1457 */
  get Main_1457(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1457);
  }

  /** Locator for li_English_1458 */
  get li_English_1458(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1458);
  }

  /** Locator for English_1459 */
  get English_1459(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1459);
  }

  /** Locator for navigation_6e20d448acItem_3dd3bf6e7a */
  get navigation_6e20d448acItem_3dd3bf6e7a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_3dd3bf6e7a);
  }

  /** Locator for Style_Guide_1461 */
  get Style_Guide_1461(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Style_Guide_1461);
  }

  /** Locator for navigation_6e20d448acItemF52820d1fe */
  get navigation_6e20d448acItemF52820d1fe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItemF52820d1fe);
  }

  /** Locator for Templates_1463 */
  get Templates_1463(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Templates_1463);
  }

  /** Locator for li_Freeform_Template_1464 */
  get li_Freeform_Template_1464(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Freeform_Template_1464);
  }

  /** Locator for Freeform_Template_1465 */
  get Freeform_Template_1465(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Freeform_Template_1465);
  }

  /** Locator for li_Insights_Detail_Template_1466 */
  get li_Insights_Detail_Template_1466(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Template_1466);
  }

  /** Locator for Insights_Detail_Template_1467 */
  get Insights_Detail_Template_1467(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Template_1467);
  }

  /** Locator for li_Product_Detail_Page_1468 */
  get li_Product_Detail_Page_1468(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Detail_Page_1468);
  }

  /** Locator for Product_Detail_Page__1469 */
  get Product_Detail_Page__1469(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Detail_Page__1469);
  }

  /** Locator for li_Product_Rate_Page_ForeIncome_I_1470 */
  get li_Product_Rate_Page_ForeIncome_I_1470(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Rate_Page_ForeIncome_I_1470);
  }

  /** Locator for Product_Rate_Page_ForeIncome_I_1471 */
  get Product_Rate_Page_ForeIncome_I_1471(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Page_ForeIncome_I_1471);
  }

  /** Locator for li_Homepage_Template_1472 */
  get li_Homepage_Template_1472(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Template_1472);
  }

  /** Locator for Homepage_Template_1473 */
  get Homepage_Template_1473(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Template_1473);
  }

  /** Locator for li_Rate_Admin_Template_1474 */
  get li_Rate_Admin_Template_1474(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Admin_Template_1474);
  }

  /** Locator for Rate_Admin_Template_1475 */
  get Rate_Admin_Template_1475(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Admin_Template_1475);
  }

  /** Locator for li_Branding_1476 */
  get li_Branding_1476(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Branding_1476);
  }

  /** Locator for Branding_1477 */
  get Branding_1477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Branding_1477);
  }

  /** Locator for navigation_6e20d448acItem_2b248a5ea1 */
  get navigation_6e20d448acItem_2b248a5ea1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_2b248a5ea1);
  }

  /** Locator for Component_Library_1479 */
  get Component_Library_1479(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Component_Library_1479);
  }

  /** Locator for li_Accordion_1480 */
  get li_Accordion_1480(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_1480);
  }

  /** Locator for Accordion_1481 */
  get Accordion_1481(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_1481);
  }

  /** Locator for navigation_6e20d448acItem_7282c86477 */
  get navigation_6e20d448acItem_7282c86477(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_7282c86477);
  }

  /** Locator for Accordion_Tabs_Feature_1483 */
  get Accordion_Tabs_Feature_1483(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_Feature_1483);
  }

  /** Locator for navigation_6e20d448acItem_67f1c24b4b */
  get navigation_6e20d448acItem_67f1c24b4b(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_67f1c24b4b);
  }

  /** Locator for Accordion_Tabs_FeatureWith_Sc_1485 */
  get Accordion_Tabs_FeatureWith_Sc_1485(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_Sc_1485);
  }

  /** Locator for li_Accordion_Tabs_FeatureWith_He_1486 */
  get li_Accordion_Tabs_FeatureWith_He_1486(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWith_He_1486);
  }

  /** Locator for Accordion_Tabs_FeatureWith_He_1487 */
  get Accordion_Tabs_FeatureWith_He_1487(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWith_He_1487);
  }

  /** Locator for li_Accordion_Tabs_FeatureWithout_1488 */
  get li_Accordion_Tabs_FeatureWithout_1488(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Accordion_Tabs_FeatureWithout_1488);
  }

  /** Locator for Accordion_Tabs_FeatureWithout_1489 */
  get Accordion_Tabs_FeatureWithout_1489(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Accordion_Tabs_FeatureWithout_1489);
  }

  /** Locator for li_Alert_Banner_1490 */
  get li_Alert_Banner_1490(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Alert_Banner_1490);
  }

  /** Locator for Alert_Banner_1491 */
  get Alert_Banner_1491(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Alert_Banner_1491);
  }

  /** Locator for li_Benefits_Table_1492 */
  get li_Benefits_Table_1492(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Benefits_Table_1492);
  }

  /** Locator for Benefits_Table_1493 */
  get Benefits_Table_1493(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table_1493);
  }

  /** Locator for li_Bio_Card_1494 */
  get li_Bio_Card_1494(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Bio_Card_1494);
  }

  /** Locator for Bio_Card_1495 */
  get Bio_Card_1495(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Bio_Card_1495);
  }

  /** Locator for li_Brand_Relationship_1496 */
  get li_Brand_Relationship_1496(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Brand_Relationship_1496);
  }

  /** Locator for Brand_Relationship_1497 */
  get Brand_Relationship_1497(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Brand_Relationship_1497);
  }

  /** Locator for li_Breadcrumb_1498 */
  get li_Breadcrumb_1498(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Breadcrumb_1498);
  }

  /** Locator for Breadcrumb_1499 */
  get Breadcrumb_1499(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb_1499);
  }

  /** Locator for li_Button_1500 */
  get li_Button_1500(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Button_1500);
  }

  /** Locator for Button_1501 */
  get Button_1501(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_1501);
  }

  /** Locator for navigation_6e20d448acItemA2306335d1 */
  get navigation_6e20d448acItemA2306335d1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItemA2306335d1);
  }

  /** Locator for Button_IllustrationsAnd_Login_1503 */
  get Button_IllustrationsAnd_Login_1503(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Button_IllustrationsAnd_Login_1503);
  }

  /** Locator for li_Content_Highlight_1504 */
  get li_Content_Highlight_1504(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Highlight_1504);
  }

  /** Locator for Content_Highlight_1505 */
  get Content_Highlight_1505(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Highlight_1505);
  }

  /** Locator for li_Content_Trail_1506 */
  get li_Content_Trail_1506(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Content_Trail_1506);
  }

  /** Locator for Content_Trail_1507 */
  get Content_Trail_1507(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail_1507);
  }

  /** Locator for li_Decision_Tree_1508 */
  get li_Decision_Tree_1508(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Decision_Tree_1508);
  }

  /** Locator for Decision_Tree_1509 */
  get Decision_Tree_1509(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Decision_Tree_1509);
  }

  /** Locator for li_Detail_Hero_1510 */
  get li_Detail_Hero_1510(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Detail_Hero_1510);
  }

  /** Locator for Detail_Hero_1511 */
  get Detail_Hero_1511(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Detail_Hero_1511);
  }

  /** Locator for li_Disclosure_List_1512 */
  get li_Disclosure_List_1512(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Disclosure_List_1512);
  }

  /** Locator for Disclosure_List_1513 */
  get Disclosure_List_1513(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Disclosure_List_1513);
  }

  /** Locator for li_Enhanced_Related_Content_1514 */
  get li_Enhanced_Related_Content_1514(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Enhanced_Related_Content_1514);
  }

  /** Locator for Enhanced_Related_Content_1515 */
  get Enhanced_Related_Content_1515(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Enhanced_Related_Content_1515);
  }

  /** Locator for li_Feature_Banner_1516 */
  get li_Feature_Banner_1516(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_1516);
  }

  /** Locator for Feature_Banner_1517 */
  get Feature_Banner_1517(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_1517);
  }

  /** Locator for li_Feature_Banner_5050_Layout_1518 */
  get li_Feature_Banner_5050_Layout_1518(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Feature_Banner_5050_Layout_1518);
  }

  /** Locator for Feature_Banner_5050_Layout_1519 */
  get Feature_Banner_5050_Layout_1519(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner_5050_Layout_1519);
  }

  /** Locator for li_Firm_Selection_Modal_1520 */
  get li_Firm_Selection_Modal_1520(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Firm_Selection_Modal_1520);
  }

  /** Locator for Firm_Selection_Modal_1521 */
  get Firm_Selection_Modal_1521(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Firm_Selection_Modal_1521);
  }

  /** Locator for li_Footer_Disclosure_1522 */
  get li_Footer_Disclosure_1522(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Footer_Disclosure_1522);
  }

  /** Locator for Footer_Disclosure_1523 */
  get Footer_Disclosure_1523(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Footer_Disclosure_1523);
  }

  /** Locator for li_Form_Options_1524 */
  get li_Form_Options_1524(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Form_Options_1524);
  }

  /** Locator for Form_Options_1525 */
  get Form_Options_1525(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Form_Options_1525);
  }

  /** Locator for li_Grid_Container_1526 */
  get li_Grid_Container_1526(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Grid_Container_1526);
  }

  /** Locator for Grid_Container_1527 */
  get Grid_Container_1527(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Grid_Container_1527);
  }

  /** Locator for li_Headline_Block_1528 */
  get li_Headline_Block_1528(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Headline_Block_1528);
  }

  /** Locator for Headline_Block_1529 */
  get Headline_Block_1529(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block_1529);
  }

  /** Locator for li_Hero_5050_1530 */
  get li_Hero_5050_1530(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050_1530);
  }

  /** Locator for Hero_5050_1531 */
  get Hero_5050_1531(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Hero_5050_1531);
  }

  /** Locator for li_Homepage_Hero_1532 */
  get li_Homepage_Hero_1532(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Homepage_Hero_1532);
  }

  /** Locator for Homepage_Hero_1533 */
  get Homepage_Hero_1533(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Homepage_Hero_1533);
  }

  /** Locator for li_Image_1534 */
  get li_Image_1534(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_1534);
  }

  /** Locator for Image_1535 */
  get Image_1535(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_1535);
  }

  /** Locator for li_Image_With_Nested_Content_1536 */
  get li_Image_With_Nested_Content_1536(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Image_With_Nested_Content_1536);
  }

  /** Locator for Image_With_Nested_Content_1537 */
  get Image_With_Nested_Content_1537(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Image_With_Nested_Content_1537);
  }

  /** Locator for li_In_Brief_1538 */
  get li_In_Brief_1538(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_In_Brief_1538);
  }

  /** Locator for In_Brief_1539 */
  get In_Brief_1539(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.In_Brief_1539);
  }

  /** Locator for li_Insights_Detail_Hero_1540 */
  get li_Insights_Detail_Hero_1540(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Detail_Hero_1540);
  }

  /** Locator for Insights_Detail_Hero_1541 */
  get Insights_Detail_Hero_1541(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Detail_Hero_1541);
  }

  /** Locator for li_Insights_Listing_1542 */
  get li_Insights_Listing_1542(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Insights_Listing_1542);
  }

  /** Locator for Insights_Listing_1543 */
  get Insights_Listing_1543(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Insights_Listing_1543);
  }

  /** Locator for li_Login_1544 */
  get li_Login_1544(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Login_1544);
  }

  /** Locator for Login_1545 */
  get Login_1545(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Login_1545);
  }

  /** Locator for li_Navigation_1546 */
  get li_Navigation_1546(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Navigation_1546);
  }

  /** Locator for Navigation_1547 */
  get Navigation_1547(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Navigation_1547);
  }

  /** Locator for li_Product_Comparison_Card_1548 */
  get li_Product_Comparison_Card_1548(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Comparison_Card_1548);
  }

  /** Locator for Product_Comparison_Card_1549 */
  get Product_Comparison_Card_1549(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Comparison_Card_1549);
  }

  /** Locator for li_Product_Path_Detail_Card_1550 */
  get li_Product_Path_Detail_Card_1550(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Detail_Card_1550);
  }

  /** Locator for Product_Path_Detail_Card_1551 */
  get Product_Path_Detail_Card_1551(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Detail_Card_1551);
  }

  /** Locator for li_Product_Path_Summary_Card_1552 */
  get li_Product_Path_Summary_Card_1552(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Product_Path_Summary_Card_1552);
  }

  /** Locator for Product_Path_Summary_Card_1553 */
  get Product_Path_Summary_Card_1553(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Path_Summary_Card_1553);
  }

  /** Locator for navigation_6e20d448acItem_8d21a80f63 */
  get navigation_6e20d448acItem_8d21a80f63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_8d21a80f63);
  }

  /** Locator for Product_Rate_Table_1555 */
  get Product_Rate_Table_1555(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Product_Rate_Table_1555);
  }

  /** Locator for li_ForeCertain_Income_Annuity_1556 */
  get li_ForeCertain_Income_Annuity_1556(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Income_Annuity_1556);
  }

  /** Locator for ForeCertain_Income_Annuity_1557 */
  get ForeCertain_Income_Annuity_1557(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Income_Annuity_1557);
  }

  /** Locator for li_ForeIncome_II_Fixed_Index_Annu_1558 */
  get li_ForeIncome_II_Fixed_Index_Annu_1558(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeIncome_II_Fixed_Index_Annu_1558);
  }

  /** Locator for ForeIncome_II_Fixed_Index_Annu_1559 */
  get ForeIncome_II_Fixed_Index_Annu_1559(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeIncome_II_Fixed_Index_Annu_1559);
  }

  /** Locator for li_SecureFore_II_Fixed_Annuity_1560 */
  get li_SecureFore_II_Fixed_Annuity_1560(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_II_Fixed_Annuity_1560);
  }

  /** Locator for SecureFore_II_Fixed_Annuity_1561 */
  get SecureFore_II_Fixed_Annuity_1561(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_II_Fixed_Annuity_1561);
  }

  /** Locator for li_SecureFore_Rates_1562 */
  get li_SecureFore_Rates_1562(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_SecureFore_Rates_1562);
  }

  /** Locator for SecureFore_Rates_1563 */
  get SecureFore_Rates_1563(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SecureFore_Rates_1563);
  }

  /** Locator for liForestructuredgrowthii_1564 */
  get liForestructuredgrowthii_1564(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liForestructuredgrowthii_1564);
  }

  /** Locator for forestructuredgrowthii_1565 */
  get forestructuredgrowthii_1565(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.forestructuredgrowthii_1565);
  }

  /** Locator for li_Income_150_SE_1566 */
  get li_Income_150_SE_1566(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Income_150_SE_1566);
  }

  /** Locator for Income_150_SE_1567 */
  get Income_150_SE_1567(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Income_150_SE_1567);
  }

  /** Locator for li_ForeCare_Fixed_Annuity_1568 */
  get li_ForeCare_Fixed_Annuity_1568(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCare_Fixed_Annuity_1568);
  }

  /** Locator for ForeCare_Fixed_Annuity_1569 */
  get ForeCare_Fixed_Annuity_1569(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCare_Fixed_Annuity_1569);
  }

  /** Locator for li_ForeAccumulation_II_Fixed_Inde_1570 */
  get li_ForeAccumulation_II_Fixed_Inde_1570(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeAccumulation_II_Fixed_Inde_1570);
  }

  /** Locator for ForeAccumulation_II_Fixed_Inde_1571 */
  get ForeAccumulation_II_Fixed_Inde_1571(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeAccumulation_II_Fixed_Inde_1571);
  }

  /** Locator for li_ForeCertain_Advisory_1572 */
  get li_ForeCertain_Advisory_1572(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_ForeCertain_Advisory_1572);
  }

  /** Locator for ForeCertain_Advisory_1573 */
  get ForeCertain_Advisory_1573(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ForeCertain_Advisory_1573);
  }

  /** Locator for li_Promo_Banner_1574 */
  get li_Promo_Banner_1574(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Promo_Banner_1574);
  }

  /** Locator for Promo_Banner_1575 */
  get Promo_Banner_1575(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Promo_Banner_1575);
  }

  /** Locator for li_Quote_1576 */
  get li_Quote_1576(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Quote_1576);
  }

  /** Locator for Quote_1577 */
  get Quote_1577(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Quote_1577);
  }

  /** Locator for li_Rate_Details_Hero_1578 */
  get li_Rate_Details_Hero_1578(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Details_Hero_1578);
  }

  /** Locator for Rate_Details_Hero_1579 */
  get Rate_Details_Hero_1579(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Details_Hero_1579);
  }

  /** Locator for li_Rate_List_Accordion_1580 */
  get li_Rate_List_Accordion_1580(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_List_Accordion_1580);
  }

  /** Locator for Rate_List_Accordion_1581 */
  get Rate_List_Accordion_1581(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_List_Accordion_1581);
  }

  /** Locator for li_Rate_Sheet_Grid_1582 */
  get li_Rate_Sheet_Grid_1582(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Sheet_Grid_1582);
  }

  /** Locator for Rate_Sheet_Grid_1583 */
  get Rate_Sheet_Grid_1583(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Rate_Sheet_Grid_1583);
  }

  /** Locator for li_Ratings_Card_1584 */
  get li_Ratings_Card_1584(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Ratings_Card_1584);
  }

  /** Locator for Ratings_Card_1585 */
  get Ratings_Card_1585(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Ratings_Card_1585);
  }

  /** Locator for li_RTE_Table_1586 */
  get li_RTE_Table_1586(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_RTE_Table_1586);
  }

  /** Locator for RTE_Table_1587 */
  get RTE_Table_1587(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RTE_Table_1587);
  }

  /** Locator for li_Section_1588 */
  get li_Section_1588(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Section_1588);
  }

  /** Locator for Section_1589 */
  get Section_1589(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Section_1589);
  }

  /** Locator for li_Separator_1590 */
  get li_Separator_1590(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Separator_1590);
  }

  /** Locator for Separator_1591 */
  get Separator_1591(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Separator_1591);
  }

  /** Locator for li_Site_Search_1592 */
  get li_Site_Search_1592(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Site_Search_1592);
  }

  /** Locator for Site_Search_1593 */
  get Site_Search_1593(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Site_Search_1593);
  }

  /** Locator for li_Spacer_1594 */
  get li_Spacer_1594(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Spacer_1594);
  }

  /** Locator for Spacer_1595 */
  get Spacer_1595(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spacer_1595);
  }

  /** Locator for li_Statistic_1596 */
  get li_Statistic_1596(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Statistic_1596);
  }

  /** Locator for Statistic_1597 */
  get Statistic_1597(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Statistic_1597);
  }

  /** Locator for li_Tabs_1598 */
  get li_Tabs_1598(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Tabs_1598);
  }

  /** Locator for Tabs_1599 */
  get Tabs_1599(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Tabs_1599);
  }

  /** Locator for li_Teaser_Card_1600 */
  get li_Teaser_Card_1600(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Teaser_Card_1600);
  }

  /** Locator for Teaser_Card_1601 */
  get Teaser_Card_1601(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Teaser_Card_1601);
  }

  /** Locator for li_Text_1602 */
  get li_Text_1602(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Text_1602);
  }

  /** Locator for Text_1603 */
  get Text_1603(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Text_1603);
  }

  /** Locator for li_Video_External_1604 */
  get li_Video_External_1604(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Video_External_1604);
  }

  /** Locator for Video_External_1605 */
  get Video_External_1605(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_External_1605);
  }

  /** Locator for li_Workbench_1606 */
  get li_Workbench_1606(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Workbench_1606);
  }

  /** Locator for Workbench_1607 */
  get Workbench_1607(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Workbench_1607);
  }

  /** Locator for navigation_6e20d448acItem_83f7afdff6 */
  get navigation_6e20d448acItem_83f7afdff6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_83f7afdff6);
  }

  /** Locator for Corporate_Agnostic_1609 */
  get Corporate_Agnostic_1609(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Corporate_Agnostic_1609);
  }

  /** Locator for navigation_6e20d448acItemC131db0ef8 */
  get navigation_6e20d448acItemC131db0ef8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItemC131db0ef8);
  }

  /** Locator for Main_1611 */
  get Main_1611(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1611);
  }

  /** Locator for li_English_1612 */
  get li_English_1612(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1612);
  }

  /** Locator for English_1613 */
  get English_1613(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1613);
  }

  /** Locator for navigation_6e20d448acItemCc78444b86 */
  get navigation_6e20d448acItemCc78444b86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItemCc78444b86);
  }

  /** Locator for Financial_Professionals_1615 */
  get Financial_Professionals_1615(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Financial_Professionals_1615);
  }

  /** Locator for navigation_6e20d448acItemCbb8c1caba */
  get navigation_6e20d448acItemCbb8c1caba(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItemCbb8c1caba);
  }

  /** Locator for Main_1617 */
  get Main_1617(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1617);
  }

  /** Locator for li_English_1618 */
  get li_English_1618(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1618);
  }

  /** Locator for English_1619 */
  get English_1619(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1619);
  }

  /** Locator for navigation_6e20d448acItem_0e452ee23a */
  get navigation_6e20d448acItem_0e452ee23a(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_0e452ee23a);
  }

  /** Locator for Individuals_1621 */
  get Individuals_1621(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Individuals_1621);
  }

  /** Locator for navigation_6e20d448acItem_70efbfa4b4 */
  get navigation_6e20d448acItem_70efbfa4b4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_70efbfa4b4);
  }

  /** Locator for Main_1623 */
  get Main_1623(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1623);
  }

  /** Locator for li_English_1624 */
  get li_English_1624(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1624);
  }

  /** Locator for English_1625 */
  get English_1625(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1625);
  }

  /** Locator for navigation_6e20d448acItem_047745266e */
  get navigation_6e20d448acItem_047745266e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItem_047745266e);
  }

  /** Locator for Preneed_1627 */
  get Preneed_1627(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Preneed_1627);
  }

  /** Locator for navigation_6e20d448acItemD51d767ca3 */
  get navigation_6e20d448acItemD51d767ca3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navigation_6e20d448acItemD51d767ca3);
  }

  /** Locator for Main_1629 */
  get Main_1629(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Main_1629);
  }

  /** Locator for li_English_1630 */
  get li_English_1630(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_English_1630);
  }

  /** Locator for English_1631 */
  get English_1631(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.English_1631);
  }

  // --- Actions ---

  /** Click Style_Guide */
  async clickStyleGuide() {
    const el = await this.Style_Guide;
    await el.click();
  }

  /** Click Templates */
  async clickTemplates() {
    const el = await this.Templates;
    await el.click();
  }

  /** Click Freeform_Template */
  async clickFreeformTemplate() {
    const el = await this.Freeform_Template;
    await el.click();
  }

  /** Click Insights_Detail_Template */
  async clickInsightsDetailTemplate() {
    const el = await this.Insights_Detail_Template;
    await el.click();
  }

  /** Click Product_Detail_Page_ */
  async clickProductDetailPage() {
    const el = await this.Product_Detail_Page_;
    await el.click();
  }

  /** Click Product_Rate_Page_ForeIncome_I */
  async clickProductRatePageForeincomeI() {
    const el = await this.Product_Rate_Page_ForeIncome_I;
    await el.click();
  }

  /** Click Homepage_Template */
  async clickHomepageTemplate() {
    const el = await this.Homepage_Template;
    await el.click();
  }

  /** Click Rate_Admin_Template */
  async clickRateAdminTemplate() {
    const el = await this.Rate_Admin_Template;
    await el.click();
  }

  /** Click Branding */
  async clickBranding() {
    const el = await this.Branding;
    await el.click();
  }

  /** Click Component_Library */
  async clickComponentLibrary() {
    const el = await this.Component_Library;
    await el.click();
  }
}
