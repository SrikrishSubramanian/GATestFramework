import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'firmSelectionModalPage.locators.json'));

export class FirmSelectionModalPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/firm-selection-modal.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/firm-selection-modal.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for button_Confirm */
  get button_Confirm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Confirm);
  }

  /** Locator for button_Continue */
  get button_Continue(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Continue);
  }

  /** Locator for h2_SelectYourFirm */
  get h2_SelectYourFirm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_SelectYourFirm);
  }

  /** Locator for SelectAFirm */
  get SelectAFirm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SelectAFirm);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for div_7 */
  get div_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_7);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for p_Illustrations */
  get p_Illustrations(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Illustrations);
  }

  /** Locator for div_LoadingYourFirms */
  get div_LoadingYourFirms(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_LoadingYourFirms);
  }

  /** Locator for div_LoadingYourFirms_11 */
  get div_LoadingYourFirms_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_LoadingYourFirms_11);
  }

  /** Locator for span_12 */
  get span_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_12);
  }

  /** Locator for span_LoadingYourFirms */
  get span_LoadingYourFirms(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_LoadingYourFirms);
  }

  /** Locator for div_Confirm */
  get div_Confirm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Confirm);
  }

  /** Locator for span_15 */
  get span_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_15);
  }

  /** Locator for span_16 */
  get span_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_16);
  }

  /** Locator for div_Confirm_17 */
  get div_Confirm_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Confirm_17);
  }

  /** Locator for i_18 */
  get i_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_18);
  }

  /** Locator for span_Confirm */
  get span_Confirm(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Confirm);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
  }

  /** Locator for p_SnapApp */
  get p_SnapApp(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_SnapApp);
  }

  /** Locator for div_Continue */
  get div_Continue(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Continue);
  }

  /** Locator for div_Continue_24 */
  get div_Continue_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Continue_24);
  }

  /** Locator for span_Continue */
  get span_Continue(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Continue);
  }

  // --- Actions ---

  /** Click Close */
  async clickClose() {
    const el = await this.Close;
    await el.click();
  }

  /** Click button_Confirm */
  async clickButtonConfirm() {
    const el = await this.button_Confirm;
    await el.click();
  }

  /** Click button_Continue */
  async clickButtonContinue() {
    const el = await this.button_Continue;
    await el.click();
  }

  /** Click h2_SelectYourFirm */
  async clickH2Selectyourfirm() {
    const el = await this.h2_SelectYourFirm;
    await el.click();
  }

  /** Click SelectAFirm */
  async clickSelectafirm() {
    const el = await this.SelectAFirm;
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

  /** Click div_7 */
  async clickDiv7() {
    const el = await this.div_7;
    await el.click();
  }

  /** Click div_8 */
  async clickDiv8() {
    const el = await this.div_8;
    await el.click();
  }

  /** Click p_Illustrations */
  async clickPIllustrations() {
    const el = await this.p_Illustrations;
    await el.click();
  }
}
