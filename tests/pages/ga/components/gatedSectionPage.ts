import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'gatedSectionPage.locators.json'));

export class GatedSectionPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/gated-section.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for button_Submit */
  get button_Submit(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Submit);
  }

  /** Locator for First_Name */
  get First_Name(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.First_Name);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for span_6 */
  get span_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_6);
  }

  /** Locator for span_7 */
  get span_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_7);
  }

  /** Locator for span_8 */
  get span_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_8);
  }

  /** Locator for span_9 */
  get span_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_9);
  }

  /** Locator for i_10 */
  get i_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_10);
  }

  /** Locator for span_Submit */
  get span_Submit(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Submit);
  }

  /** Locator for div_Submitting */
  get div_Submitting(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Submitting);
  }

  /** Locator for span_13 */
  get span_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_13);
  }

  /** Locator for span_Submitting */
  get span_Submitting(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Submitting);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  // --- Actions ---

  /** Click button_Submit */
  async clickButtonSubmit() {
    const el = await this.button_Submit;
    await el.click();
  }

  /** Click First_Name */
  async clickFirstName() {
    const el = await this.First_Name;
    await el.click();
  }

  /** Click div_4 */
  async clickDiv4() {
    const el = await this.div_4;
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

  /** Click span_7 */
  async clickSpan7() {
    const el = await this.span_7;
    await el.click();
  }

  /** Click span_8 */
  async clickSpan8() {
    const el = await this.span_8;
    await el.click();
  }

  /** Click span_9 */
  async clickSpan9() {
    const el = await this.span_9;
    await el.click();
  }

  /** Click i_10 */
  async clickI10() {
    const el = await this.i_10;
    await el.click();
  }

  /** Click span_Submit */
  async clickSpanSubmit() {
    const el = await this.span_Submit;
    await el.click();
  }
}
