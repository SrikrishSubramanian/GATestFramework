import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'alertBannerPage.locators.json'));

export class AlertBannerPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/alert-banner.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for aLink */
  get aLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.aLink);
  }

  /** Locator for DismissAlert */
  get DismissAlert(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.DismissAlert);
  }

  /** Locator for ul_2 */
  get ul_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_2);
  }

  /** Locator for ul_3 */
  get ul_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_3);
  }

  /** Locator for li_4 */
  get li_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_4);
  }

  /** Locator for li_5 */
  get li_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_5);
  }

  /** Locator for li_6 */
  get li_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_6);
  }

  /** Locator for div_7 */
  get div_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_7);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for span_9 */
  get span_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_9);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
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

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for div_16 */
  get div_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_16);
  }

  /** Locator for div_DismissAlert */
  get div_DismissAlert(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_DismissAlert);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_19 */
  get div_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_19);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
  }

  /** Locator for li_22 */
  get li_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_22);
  }

  // --- Actions ---

  /** Click aLink */
  async clickAlink() {
    const el = await this.aLink;
    await el.click();
  }

  /** Click DismissAlert */
  async clickDismissalert() {
    const el = await this.DismissAlert;
    await el.click();
  }

  /** Click ul_2 */
  async clickUl2() {
    const el = await this.ul_2;
    await el.click();
  }

  /** Click ul_3 */
  async clickUl3() {
    const el = await this.ul_3;
    await el.click();
  }

  /** Click li_4 */
  async clickLi4() {
    const el = await this.li_4;
    await el.click();
  }

  /** Click li_5 */
  async clickLi5() {
    const el = await this.li_5;
    await el.click();
  }

  /** Click li_6 */
  async clickLi6() {
    const el = await this.li_6;
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

  /** Click span_9 */
  async clickSpan9() {
    const el = await this.span_9;
    await el.click();
  }
}
