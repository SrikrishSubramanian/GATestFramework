import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'rateDetailsHeroPage.locators.json'));

export class RateDetailsHeroPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/rate-details-hero.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for a_Style_Guide */
  get a_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Style_Guide);
  }

  /** Locator for a_Component_Library */
  get a_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Component_Library);
  }

  /** Locator for h1_ForeStructured_Growth_II_Rates */
  get h1_ForeStructured_Growth_II_Rates(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_ForeStructured_Growth_II_Rates);
  }

  /** Locator for Breadcrumb */
  get Breadcrumb(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb);
  }

  /** Locator for nav_4 */
  get nav_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.nav_4);
  }

  /** Locator for ol_5 */
  get ol_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_5);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for span_7 */
  get span_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_7);
  }

  /** Locator for li_Style_Guide */
  get li_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Style_Guide);
  }

  /** Locator for li_Component_Library */
  get li_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Component_Library);
  }

  /** Locator for li_Rate_Details_Hero */
  get li_Rate_Details_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Rate_Details_Hero);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for span_Fixed_Index_Annuity */
  get span_Fixed_Index_Annuity(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Fixed_Index_Annuity);
  }

  /** Locator for span_14 */
  get span_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_14);
  }

  /** Locator for span_BShare */
  get span_BShare(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_BShare);
  }

  /** Locator for p_16 */
  get p_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_16);
  }

  // --- Actions ---

  /** Click a_Style_Guide */
  async clickAStyleGuide() {
    const el = await this.a_Style_Guide;
    await el.click();
  }

  /** Click a_Component_Library */
  async clickAComponentLibrary() {
    const el = await this.a_Component_Library;
    await el.click();
  }

  /** Click h1_ForeStructured_Growth_II_Rates */
  async clickH1ForestructuredGrowthIiRates() {
    const el = await this.h1_ForeStructured_Growth_II_Rates;
    await el.click();
  }

  /** Click Breadcrumb */
  async clickBreadcrumb() {
    const el = await this.Breadcrumb;
    await el.click();
  }

  /** Click nav_4 */
  async clickNav4() {
    const el = await this.nav_4;
    await el.click();
  }

  /** Click ol_5 */
  async clickOl5() {
    const el = await this.ol_5;
    await el.click();
  }

  /** Click div_6 */
  async clickDiv6() {
    const el = await this.div_6;
    await el.click();
  }

  /** Click span_7 */
  async clickSpan7() {
    const el = await this.span_7;
    await el.click();
  }

  /** Click li_Style_Guide */
  async clickLiStyleGuide() {
    const el = await this.li_Style_Guide;
    await el.click();
  }

  /** Click li_Component_Library */
  async clickLiComponentLibrary() {
    const el = await this.li_Component_Library;
    await el.click();
  }
}
