import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'formOptionsPage.locators.json'));

export class FormOptionsPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
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

  /** Locator for formOptions_818373936 */
  get formOptions_818373936(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.formOptions_818373936);
  }

  /** Locator for select_ChooseARegion */
  get select_ChooseARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_ChooseARegion);
  }

  /** Locator for select_NotAvailable */
  get select_NotAvailable(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_NotAvailable);
  }

  /** Locator for informationIconTooltip_Choos */
  get informationIconTooltip_Choos(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.informationIconTooltip_Choos);
  }

  /** Locator for informationIconTooltip_Choos_8 */
  get informationIconTooltip_Choos_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.informationIconTooltip_Choos_8);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  /** Locator for div_ChooseAnOption */
  get div_ChooseAnOption(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOption);
  }

  /** Locator for div_0 */
  get div_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_0);
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

  /** Locator for div_17 */
  get div_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_17);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_ChooseARegion */
  get div_ChooseARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseARegion);
  }

  /** Locator for div_North_America */
  get div_North_America(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_North_America);
  }

  /** Locator for div_Europe */
  get div_Europe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Europe);
  }

  /** Locator for div_Asia_Pacific */
  get div_Asia_Pacific(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Asia_Pacific);
  }

  /** Locator for div_23 */
  get div_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_23);
  }

  /** Locator for div_NotAvailable0Option_AOption_B */
  get div_NotAvailable0Option_AOption_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable0Option_AOption_B);
  }

  /** Locator for div_NotAvailable */
  get div_NotAvailable(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable);
  }

  /** Locator for legend_SelectAPlan */
  get legend_SelectAPlan(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_SelectAPlan);
  }

  /** Locator for div_27 */
  get div_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_27);
  }

  /** Locator for span_28 */
  get span_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_28);
  }

  /** Locator for legend_29 */
  get legend_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_29);
  }

  /** Locator for span_Option_A */
  get span_Option_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_A);
  }

  /** Locator for span_31 */
  get span_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_31);
  }

  /** Locator for div_Option_A_32 */
  get div_Option_A_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_A_32);
  }

  /** Locator for span_Option_B */
  get span_Option_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_B);
  }

  /** Locator for div_Option_B_34 */
  get div_Option_B_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_B_34);
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

  /** Locator for div_Option_DDisabled_38 */
  get div_Option_DDisabled_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_DDisabled_38);
  }

  /** Locator for legend_SelectARegion */
  get legend_SelectARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_SelectARegion);
  }

  /** Locator for span_40 */
  get span_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_40);
  }

  /** Locator for span_North_America */
  get span_North_America(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_North_America);
  }

  /** Locator for div_North_America_42 */
  get div_North_America_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_North_America_42);
  }

  /** Locator for span_Europe */
  get span_Europe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Europe);
  }

  /** Locator for div_Europe_44 */
  get div_Europe_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Europe_44);
  }

  /** Locator for span_Asia_Pacific */
  get span_Asia_Pacific(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Asia_Pacific);
  }

  /** Locator for div_Asia_Pacific_46 */
  get div_Asia_Pacific_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Asia_Pacific_46);
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

  /** Locator for span_50 */
  get span_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_50);
  }

  /** Locator for span_Retirement_Planning */
  get span_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Retirement_Planning);
  }

  /** Locator for span_52 */
  get span_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_52);
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

  /** Locator for span_61 */
  get span_61(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_61);
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

  /** Locator for div_ChooseAnOption_70 */
  get div_ChooseAnOption_70(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOption_70);
  }

  /** Locator for div_ChooseAnOption_71 */
  get div_ChooseAnOption_71(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseAnOption_71);
  }

  /** Locator for div_72 */
  get div_72(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_72);
  }

  /** Locator for div_0_73 */
  get div_0_73(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_0_73);
  }

  /** Locator for SelectYourInterests */
  get SelectYourInterests(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SelectYourInterests);
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

  /** Locator for SelectARegion */
  get SelectARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SelectARegion);
  }

  /** Locator for div_ChooseARegionChooseARegion */
  get div_ChooseARegionChooseARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseARegionChooseARegion);
  }

  /** Locator for div_ChooseARegion_82 */
  get div_ChooseARegion_82(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseARegion_82);
  }

  /** Locator for div_ChooseARegion_83 */
  get div_ChooseARegion_83(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ChooseARegion_83);
  }

  /** Locator for div_84 */
  get div_84(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_84);
  }

  /** Locator for DisabledDropdown */
  get DisabledDropdown(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.DisabledDropdown);
  }

  /** Locator for div_NotAvailableNotAvailable */
  get div_NotAvailableNotAvailable(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailableNotAvailable);
  }

  /** Locator for div_NotAvailable_87 */
  get div_NotAvailable_87(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable_87);
  }

  /** Locator for div_NotAvailable_88 */
  get div_NotAvailable_88(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable_88);
  }

  /** Locator for div_NotAvailable0Option_AOption_B_89 */
  get div_NotAvailable0Option_AOption_B_89(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NotAvailable0Option_AOption_B_89);
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

  /** Click formOptions_818373936 */
  async clickFormoptions818373936() {
    const el = await this.formOptions_818373936;
    await el.click();
  }

  /** Click select_ChooseARegion */
  async clickSelectChoosearegion() {
    const el = await this.select_ChooseARegion;
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

  /** Click informationIconTooltip_Choos_8 */
  async clickInformationicontooltipChoos8() {
    const el = await this.informationIconTooltip_Choos_8;
    await el.click();
  }

  /** Click div_9 */
  async clickDiv9() {
    const el = await this.div_9;
    await el.click();
  }
}
