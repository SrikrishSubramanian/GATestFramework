import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'siteSearchPage.locators.json'));

export class SiteSearchPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/site-search.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/site-search.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for Search */
  get Search(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Search);
  }

  /** Locator for cmpSiteSearch */
  get cmpSiteSearch(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cmpSiteSearch);
  }

  /** Locator for h3_Search_Global_Atlantic */
  get h3_Search_Global_Atlantic(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Search_Global_Atlantic);
  }

  /** Locator for ul_NoResults */
  get ul_NoResults(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_NoResults);
  }

  /** Locator for ul_4 */
  get ul_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_4);
  }

  /** Locator for ul_5 */
  get ul_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_5);
  }

  /** Locator for span_Annuities */
  get span_Annuities(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Annuities);
  }

  /** Locator for span_Life_Insurance */
  get span_Life_Insurance(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Life_Insurance);
  }

  /** Locator for span_Continuing_Education */
  get span_Continuing_Education(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Continuing_Education);
  }

  /** Locator for span_Business_Building */
  get span_Business_Building(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Business_Building);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for span_12 */
  get span_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_12);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for form_14 */
  get form_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.form_14);
  }

  /** Locator for label_Search */
  get label_Search(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.label_Search);
  }

  /** Locator for svg_16 */
  get svg_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.svg_16);
  }

  /** Locator for div_NoResults */
  get div_NoResults(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_NoResults);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_19 */
  get div_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_19);
  }

  /** Locator for span_SearchTerm */
  get span_SearchTerm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_SearchTerm);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
  }

  // --- Actions ---

  /** Click Search */
  async clickSearch() {
    const el = await this.Search;
    await el.click();
  }

  /** Click cmpSiteSearch */
  async clickCmpsitesearch() {
    const el = await this.cmpSiteSearch;
    await el.click();
  }

  /** Click h3_Search_Global_Atlantic */
  async clickH3SearchGlobalAtlantic() {
    const el = await this.h3_Search_Global_Atlantic;
    await el.click();
  }

  /** Click ul_NoResults */
  async clickUlNoresults() {
    const el = await this.ul_NoResults;
    await el.click();
  }

  /** Click ul_4 */
  async clickUl4() {
    const el = await this.ul_4;
    await el.click();
  }

  /** Click ul_5 */
  async clickUl5() {
    const el = await this.ul_5;
    await el.click();
  }

  /** Click span_Annuities */
  async clickSpanAnnuities() {
    const el = await this.span_Annuities;
    await el.click();
  }

  /** Click span_Life_Insurance */
  async clickSpanLifeInsurance() {
    const el = await this.span_Life_Insurance;
    await el.click();
  }

  /** Click span_Continuing_Education */
  async clickSpanContinuingEducation() {
    const el = await this.span_Continuing_Education;
    await el.click();
  }

  /** Click span_Business_Building */
  async clickSpanBusinessBuilding() {
    const el = await this.span_Business_Building;
    await el.click();
  }
}
