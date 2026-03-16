import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars for the current environment (same logic as globalSetup)
if (process.env.env) {
  dotenv.config({
    path: path.resolve(__dirname, '..', '..', '..', 'environments', `.env.${process.env.env}`),
    override: true,
  });
}

const DEFAULT_AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const registry = loadLocators(path.join(__dirname, 'formOptionsPage.locators.json'));

export class FormOptionsPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl?: string) {
    const url = baseUrl || DEFAULT_AUTHOR_URL;
    await this.page.goto(`${url}/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled`);
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

  /** Locator for informationIconTooltip_Choos */
  get informationIconTooltip_Choos(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.informationIconTooltip_Choos);
  }

  /** Locator for informationIconTooltip_Choos_3 */
  get informationIconTooltip_Choos_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.informationIconTooltip_Choos_3);
  }

  /** Locator for legend_SelectAPlan */
  get legend_SelectAPlan(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_SelectAPlan);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for span_6 */
  get span_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_6);
  }

  /** Locator for legend_7 */
  get legend_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_7);
  }

  /** Locator for span_Option_A */
  get span_Option_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_A);
  }

  /** Locator for span_9 */
  get span_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_9);
  }

  /** Locator for div_Option_A */
  get div_Option_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_A);
  }

  /** Locator for span_Option_B */
  get span_Option_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Option_B);
  }

  /** Locator for div_Option_B */
  get div_Option_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_B);
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

  /** Locator for div_Option_DDisabled */
  get div_Option_DDisabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Option_DDisabled);
  }

  /** Locator for legend_SelectARegion */
  get legend_SelectARegion(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.legend_SelectARegion);
  }

  /** Locator for span_18 */
  get span_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_18);
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

  /** Locator for span_28 */
  get span_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_28);
  }

  /** Locator for span_Retirement_Planning */
  get span_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Retirement_Planning);
  }

  /** Locator for span_30 */
  get span_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_30);
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

  /** Locator for span_39 */
  get span_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_39);
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

  /** Click informationIconTooltip_Choos */
  async clickInformationicontooltipChoos() {
    const el = await this.informationIconTooltip_Choos;
    await el.click();
  }

  /** Click informationIconTooltip_Choos_3 */
  async clickInformationicontooltipChoos3() {
    const el = await this.informationIconTooltip_Choos_3;
    await el.click();
  }

  /** Click legend_SelectAPlan */
  async clickLegendSelectaplan() {
    const el = await this.legend_SelectAPlan;
    await el.click();
  }

  /** Click div_5 */
  async clickDiv5() {
    const el = await this.div_5;
    await el.click();
  }

  /** Click span_6 */
  async clickSpan6() {
    const el = await this.span_6;
    await el.click();
  }

  /** Click legend_7 */
  async clickLegend7() {
    const el = await this.legend_7;
    await el.click();
  }

  /** Click span_Option_A */
  async clickSpanOptionA() {
    const el = await this.span_Option_A;
    await el.click();
  }

  /** Click span_9 */
  async clickSpan9() {
    const el = await this.span_9;
    await el.click();
  }
}
