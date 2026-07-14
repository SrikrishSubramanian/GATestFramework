import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'insightsListingPage.locators.json'));

export class InsightsListingPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/insights-listing.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for button_Professionals */
  get button_Professionals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Professionals);
  }

  /** Locator for button_Individuals */
  get button_Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Individuals);
  }

  /** Locator for button_Corp */
  get button_Corp(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Corp);
  }

  /** Locator for button_Corporate_Agnostic */
  get button_Corporate_Agnostic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Corporate_Agnostic);
  }

  /** Locator for button_Financial_Professionals */
  get button_Financial_Professionals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Financial_Professionals);
  }

  /** Locator for CloseFilterPanel */
  get CloseFilterPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.CloseFilterPanel);
  }

  /** Locator for ApplySelectedFilters */
  get ApplySelectedFilters(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ApplySelectedFilters);
  }

  /** Locator for ClearAllFilters */
  get ClearAllFilters(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ClearAllFilters);
  }

  /** Locator for OpenFilters */
  get OpenFilters(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.OpenFilters);
  }

  /** Locator for ClearAllActiveFilters */
  get ClearAllActiveFilters(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ClearAllActiveFilters);
  }

  /** Locator for Prev */
  get Prev(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Prev);
  }

  /** Locator for Next */
  get Next(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Next);
  }

  /** Locator for h2_Explore_All_Insights */
  get h2_Explore_All_Insights(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_Explore_All_Insights);
  }

  /** Locator for InsightsPagination */
  get InsightsPagination(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.InsightsPagination);
  }

  /** Locator for ul_14 */
  get ul_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_14);
  }

  /** Locator for ul_15 */
  get ul_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_15);
  }

  /** Locator for ul_16 */
  get ul_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_16);
  }

  /** Locator for FilterInsights */
  get FilterInsights(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.FilterInsights);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for p_JumpToA_Featured_Topic */
  get p_JumpToA_Featured_Topic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_JumpToA_Featured_Topic);
  }

  /** Locator for li_Professionals */
  get li_Professionals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Professionals);
  }

  /** Locator for span_21 */
  get span_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_21);
  }

  /** Locator for li_Individuals */
  get li_Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Individuals);
  }

  /** Locator for li_Corp */
  get li_Corp(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Corp);
  }

  /** Locator for li_Corporate_Agnostic */
  get li_Corporate_Agnostic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Corporate_Agnostic);
  }

  /** Locator for li_Financial_Professionals */
  get li_Financial_Professionals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Financial_Professionals);
  }

  /** Locator for div_26 */
  get div_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_26);
  }

  /** Locator for aside_27 */
  get aside_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.aside_27);
  }

  /** Locator for div_FilterBy_Topics */
  get div_FilterBy_Topics(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_FilterBy_Topics);
  }

  /** Locator for p_FilterBy_Topics */
  get p_FilterBy_Topics(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_FilterBy_Topics);
  }

  /** Locator for p_FilterBy_Topics_30 */
  get p_FilterBy_Topics_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_FilterBy_Topics_30);
  }

  /** Locator for div_31 */
  get div_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_31);
  }

  /** Locator for main_32 */
  get main_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.main_32);
  }

  /** Locator for div_33 */
  get div_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_33);
  }

  /** Locator for p_0_Insights */
  get p_0_Insights(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_0_Insights);
  }

  /** Locator for span_Filter */
  get span_Filter(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Filter);
  }

  /** Locator for span_36 */
  get span_36(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_36);
  }

  /** Locator for div_37 */
  get div_37(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_37);
  }

  /** Locator for span_38 */
  get span_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_38);
  }

  /** Locator for p_39 */
  get p_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_39);
  }

  // --- Actions ---

  /** Click button_Professionals */
  async clickButtonProfessionals() {
    const el = await this.button_Professionals;
    await el.click();
  }

  /** Click button_Individuals */
  async clickButtonIndividuals() {
    const el = await this.button_Individuals;
    await el.click();
  }

  /** Click button_Corp */
  async clickButtonCorp() {
    const el = await this.button_Corp;
    await el.click();
  }

  /** Click button_Corporate_Agnostic */
  async clickButtonCorporateAgnostic() {
    const el = await this.button_Corporate_Agnostic;
    await el.click();
  }

  /** Click button_Financial_Professionals */
  async clickButtonFinancialProfessionals() {
    const el = await this.button_Financial_Professionals;
    await el.click();
  }

  /** Click CloseFilterPanel */
  async clickClosefilterpanel() {
    const el = await this.CloseFilterPanel;
    await el.click();
  }

  /** Click ApplySelectedFilters */
  async clickApplyselectedfilters() {
    const el = await this.ApplySelectedFilters;
    await el.click();
  }

  /** Click ClearAllFilters */
  async clickClearallfilters() {
    const el = await this.ClearAllFilters;
    await el.click();
  }

  /** Click OpenFilters */
  async clickOpenfilters() {
    const el = await this.OpenFilters;
    await el.click();
  }

  /** Click ClearAllActiveFilters */
  async clickClearallactivefilters() {
    const el = await this.ClearAllActiveFilters;
    await el.click();
  }
}
