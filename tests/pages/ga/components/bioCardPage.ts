import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'bioCardPage.locators.json'));

export class BioCardPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/bio-card.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for ViewBioFor_Jane_Doe */
  get ViewBioFor_Jane_Doe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ViewBioFor_Jane_Doe);
  }

  /** Locator for a_Download_Jane_Does_Bio */
  get a_Download_Jane_Does_Bio(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Download_Jane_Does_Bio);
  }

  /** Locator for h1_Jane_Doe */
  get h1_Jane_Doe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_Jane_Doe);
  }

  /** Locator for img_HeadshotOf_Jane_Doe */
  get img_HeadshotOf_Jane_Doe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_HeadshotOf_Jane_Doe);
  }

  /** Locator for ul_Individuals */
  get ul_Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_Individuals);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for p_Jane_Doe */
  get p_Jane_Doe(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Jane_Doe);
  }

  /** Locator for p_Financial_Professional */
  get p_Financial_Professional(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Financial_Professional);
  }

  /** Locator for div_Individuals */
  get div_Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Individuals);
  }

  /** Locator for span_Individuals */
  get span_Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Individuals);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for li_Individuals */
  get li_Individuals(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Individuals);
  }

  /** Locator for div_16 */
  get div_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_16);
  }

  /** Locator for span_17 */
  get span_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_17);
  }

  /** Locator for span_Download_Jane_Does_Bio */
  get span_Download_Jane_Does_Bio(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Download_Jane_Does_Bio);
  }

  // --- Actions ---

  /** Click ViewBioFor_Jane_Doe */
  async clickViewbioforJaneDoe() {
    const el = await this.ViewBioFor_Jane_Doe;
    await el.click();
  }

  /** Click a_Download_Jane_Does_Bio */
  async clickADownloadJaneDoesBio() {
    const el = await this.a_Download_Jane_Does_Bio;
    await el.click();
  }

  /** Click h1_Jane_Doe */
  async clickH1JaneDoe() {
    const el = await this.h1_Jane_Doe;
    await el.click();
  }

  /** Click img_HeadshotOf_Jane_Doe */
  async clickImgHeadshotofJaneDoe() {
    const el = await this.img_HeadshotOf_Jane_Doe;
    await el.click();
  }

  /** Click ul_Individuals */
  async clickUlIndividuals() {
    const el = await this.ul_Individuals;
    await el.click();
  }

  /** Click div_5 */
  async clickDiv5() {
    const el = await this.div_5;
    await el.click();
  }

  /** Click div_6 */
  async clickDiv6() {
    const el = await this.div_6;
    await el.click();
  }

  /** Click p_Jane_Doe */
  async clickPJaneDoe() {
    const el = await this.p_Jane_Doe;
    await el.click();
  }

  /** Click p_Financial_Professional */
  async clickPFinancialProfessional() {
    const el = await this.p_Financial_Professional;
    await el.click();
  }

  /** Click div_Individuals */
  async clickDivIndividuals() {
    const el = await this.div_Individuals;
    await el.click();
  }
}
