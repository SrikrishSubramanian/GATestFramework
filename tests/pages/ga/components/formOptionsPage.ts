import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/formOptionsPage.locators.json'));

export class FormOptionsPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for Option_ARadioButton */
  get Option_ARadioButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Option_ARadioButton);
  }

  /** Locator for Retirement_PlanningCheckbox */
  get Retirement_PlanningCheckbox(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Retirement_PlanningCheckbox);
  }

  /** Locator for input_2 */
  get input_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.input_2);
  }

  /** Locator for select_ChooseAnOption */
  get select_ChooseAnOption(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_ChooseAnOption);
  }

  /** Locator for formOptions_810781808 */
  get formOptions_810781808(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.formOptions_810781808);
  }

  /** Locator for select_Southeast */
  get select_Southeast(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_Southeast);
  }

  /** Locator for formOptions_993607988 */
  get formOptions_993607988(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.formOptions_993607988);
  }

  /** Locator for select_NotAvailable */
  get select_NotAvailable(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_NotAvailable);
  }

  /** Locator for informationIconTooltip_Choos */
  get informationIconTooltip_Choos(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.informationIconTooltip_Choos);
  }

  /** Locator for informationIconTooltip_Choos_9 */
  get informationIconTooltip_Choos_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.informationIconTooltip_Choos_9);
  }

  /** Locator for Error_Icon */
  get Error_Icon(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Error_Icon);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_ChooseAnOption */
  get div_ChooseAnOption(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOption);
  }

  /** Locator for div_Option_A */
  get div_Option_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_A);
  }

  /** Locator for div_Option_B */
  get div_Option_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_B);
  }

  /** Locator for div_Option_C */
  get div_Option_C(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_C);
  }

  /** Locator for div_Option_DDisabled */
  get div_Option_DDisabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_DDisabled);
  }

  /** Locator for div_ChooseAnOptionOption_AOption */
  get div_ChooseAnOptionOption_AOption(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOptionOption_AOption);
  }

  /** Locator for SelectYourInterests */
  get SelectYourInterests(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SelectYourInterests);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
  }

  /** Locator for div_ChooseARegion */
  get div_ChooseARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseARegion);
  }

  /** Locator for div_Northeast */
  get div_Northeast(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Northeast);
  }

  /** Locator for div_Southeast */
  get div_Southeast(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Southeast);
  }

  /** Locator for div_Midwest */
  get div_Midwest(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Midwest);
  }

  /** Locator for div_26 */
  get div_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_26);
  }

  /** Locator for div_NotAvailableOption_AOption_B */
  get div_NotAvailableOption_AOption_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailableOption_AOption_B);
  }

  /** Locator for div_NotAvailable */
  get div_NotAvailable(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable);
  }

  /** Locator for label_Retirement_Planning */
  get label_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Retirement_Planning);
  }

  /** Locator for label_Life_Insurance */
  get label_Life_Insurance(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Life_Insurance);
  }

  /** Locator for label_Annuities */
  get label_Annuities(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Annuities);
  }

  /** Locator for label_Wealth_Management */
  get label_Wealth_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Wealth_Management);
  }

  /** Locator for label_Tax_Planning */
  get label_Tax_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Tax_Planning);
  }

  /** Locator for label_Option_A */
  get label_Option_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Option_A);
  }

  /** Locator for label_Option_B */
  get label_Option_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Option_B);
  }

  /** Locator for legend_SelectAPlan */
  get legend_SelectAPlan(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_SelectAPlan);
  }

  /** Locator for div_37 */
  get div_37(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_37);
  }

  /** Locator for span_38 */
  get span_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_38);
  }

  /** Locator for legend_39 */
  get legend_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_39);
  }

  /** Locator for span_Option_A */
  get span_Option_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_A);
  }

  /** Locator for span_41 */
  get span_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_41);
  }

  /** Locator for div_Option_A_42 */
  get div_Option_A_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_A_42);
  }

  /** Locator for span_Option_B */
  get span_Option_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_B);
  }

  /** Locator for div_Option_B_44 */
  get div_Option_B_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_B_44);
  }

  /** Locator for span_Option_CPreselected */
  get span_Option_CPreselected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_CPreselected);
  }

  /** Locator for div_Option_CPreselected */
  get div_Option_CPreselected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_CPreselected);
  }

  /** Locator for span_Option_DDisabled */
  get span_Option_DDisabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_DDisabled);
  }

  /** Locator for div_Option_DDisabled_48 */
  get div_Option_DDisabled_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_DDisabled_48);
  }

  /** Locator for legend_SelectARegion */
  get legend_SelectARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_SelectARegion);
  }

  /** Locator for span_50 */
  get span_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_50);
  }

  /** Locator for span_North_America */
  get span_North_America(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_North_America);
  }

  /** Locator for div_North_America */
  get div_North_America(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_North_America);
  }

  /** Locator for span_Europe */
  get span_Europe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Europe);
  }

  /** Locator for div_Europe */
  get div_Europe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Europe);
  }

  /** Locator for span_Asia_Pacific */
  get span_Asia_Pacific(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Asia_Pacific);
  }

  /** Locator for div_Asia_Pacific */
  get div_Asia_Pacific(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Asia_Pacific);
  }

  /** Locator for span_Disabled_Region */
  get span_Disabled_Region(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Disabled_Region);
  }

  /** Locator for div_Disabled_Region */
  get div_Disabled_Region(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Disabled_Region);
  }

  /** Locator for legend_SelectYourInterests */
  get legend_SelectYourInterests(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_SelectYourInterests);
  }

  /** Locator for span_60 */
  get span_60(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_60);
  }

  /** Locator for span_Retirement_Planning */
  get span_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Retirement_Planning);
  }

  /** Locator for span_62 */
  get span_62(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_62);
  }

  /** Locator for div_Retirement_Planning */
  get div_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Retirement_Planning);
  }

  /** Locator for span_Life_Insurance */
  get span_Life_Insurance(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Life_Insurance);
  }

  /** Locator for div_Life_Insurance */
  get div_Life_Insurance(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Life_Insurance);
  }

  /** Locator for span_AnnuitiesPreselected */
  get span_AnnuitiesPreselected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_AnnuitiesPreselected);
  }

  /** Locator for div_AnnuitiesPreselected */
  get div_AnnuitiesPreselected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_AnnuitiesPreselected);
  }

  /** Locator for span_Unavailable_OptionDisabled */
  get span_Unavailable_OptionDisabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Unavailable_OptionDisabled);
  }

  /** Locator for div_Unavailable_OptionDisabled */
  get div_Unavailable_OptionDisabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Unavailable_OptionDisabled);
  }

  /** Locator for legend_Preferences */
  get legend_Preferences(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_Preferences);
  }

  /** Locator for span_71 */
  get span_71(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_71);
  }

  /** Locator for span_EmailNotifications */
  get span_EmailNotifications(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_EmailNotifications);
  }

  /** Locator for div_EmailNotifications */
  get div_EmailNotifications(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_EmailNotifications);
  }

  /** Locator for span_SMSNotifications */
  get span_SMSNotifications(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_SMSNotifications);
  }

  /** Locator for div_SMSNotifications */
  get div_SMSNotifications(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_SMSNotifications);
  }

  /** Locator for span_PhoneCalls */
  get span_PhoneCalls(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_PhoneCalls);
  }

  /** Locator for div_PhoneCalls */
  get div_PhoneCalls(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_PhoneCalls);
  }

  /** Locator for SelectAPlan */
  get SelectAPlan(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SelectAPlan);
  }

  /** Locator for div_ChooseAnOptionChooseAnOpti */
  get div_ChooseAnOptionChooseAnOpti(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOptionChooseAnOpti);
  }

  /** Locator for div_ChooseAnOption_80 */
  get div_ChooseAnOption_80(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOption_80);
  }

  /** Locator for div_ChooseAnOption_81 */
  get div_ChooseAnOption_81(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOption_81);
  }

  /** Locator for div_82 */
  get div_82(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_82);
  }

  /** Locator for div_ChooseAnOptionOption_AOption_83 */
  get div_ChooseAnOptionOption_AOption_83(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOptionOption_AOption_83);
  }

  /** Locator for SelectYourInterests_84 */
  get SelectYourInterests_84(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SelectYourInterests_84);
  }

  /** Locator for SelectARegion */
  get SelectARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SelectARegion);
  }

  /** Locator for div_SoutheastSoutheast */
  get div_SoutheastSoutheast(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_SoutheastSoutheast);
  }

  /** Locator for div_Southeast_87 */
  get div_Southeast_87(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Southeast_87);
  }

  /** Locator for div_Southeast_88 */
  get div_Southeast_88(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Southeast_88);
  }

  /** Locator for div_89 */
  get div_89(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_89);
  }

  /** Locator for RequiredField */
  get RequiredField(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RequiredField);
  }

  /** Locator for span_PleaseSelectAnOption */
  get span_PleaseSelectAnOption(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_PleaseSelectAnOption);
  }

  /** Locator for RequiredInterests */
  get RequiredInterests(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RequiredInterests);
  }

  /** Locator for span_PleaseSelectAtLeastOneOpt */
  get span_PleaseSelectAtLeastOneOpt(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_PleaseSelectAtLeastOneOpt);
  }

  /** Locator for RequiredInterests_Multi */
  get RequiredInterests_Multi(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.RequiredInterests_Multi);
  }

  /** Locator for DisabledDropdown */
  get DisabledDropdown(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.DisabledDropdown);
  }

  /** Locator for div_NotAvailableNotAvailable */
  get div_NotAvailableNotAvailable(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailableNotAvailable);
  }

  /** Locator for div_NotAvailable_97 */
  get div_NotAvailable_97(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable_97);
  }

  /** Locator for div_NotAvailable_98 */
  get div_NotAvailable_98(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable_98);
  }

  /** Locator for div_NotAvailableOption_AOption_B_99 */
  get div_NotAvailableOption_AOption_B_99(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailableOption_AOption_B_99);
  }

  // --- Actions ---

  /** Click Option_ARadioButton */
  async clickOptionAradiobutton() {
    const el = await this.Option_ARadioButton;
    await el.click();
  }

  /** Click Retirement_PlanningCheckbox */
  async clickRetirementPlanningcheckbox() {
    const el = await this.Retirement_PlanningCheckbox;
    await el.click();
  }

  /** Click input_2 */
  async clickInput2() {
    const el = await this.input_2;
    await el.click();
  }

  /** Click select_ChooseAnOption */
  async clickSelectChooseanoption() {
    const el = await this.select_ChooseAnOption;
    await el.click();
  }

  /** Click formOptions_810781808 */
  async clickFormoptions810781808() {
    const el = await this.formOptions_810781808;
    await el.click();
  }

  /** Click select_Southeast */
  async clickSelectSoutheast() {
    const el = await this.select_Southeast;
    await el.click();
  }

  /** Click formOptions_993607988 */
  async clickFormoptions993607988() {
    const el = await this.formOptions_993607988;
    await el.click();
  }

  /** Click select_NotAvailable */
  async clickSelectNotavailable() {
    const el = await this.select_NotAvailable;
    await el.click();
  }

  /** Click informationIconTooltip_Choos */
  async clickInformationicontooltipChoos() {
    const el = await this.informationIconTooltip_Choos;
    await el.click();
  }

  /** Click informationIconTooltip_Choos_9 */
  async clickInformationicontooltipChoos9() {
    const el = await this.informationIconTooltip_Choos_9;
    await el.click();
  }
}
