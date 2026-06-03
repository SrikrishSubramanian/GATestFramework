import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'promoBannerPage.locators.json'));

export class PromoBannerPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/promo-banner.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for Learn_More */
  get Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Learn_More);
  }

  /** Locator for GetIn_Touch */
  get GetIn_Touch(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.GetIn_Touch);
  }

  /** Locator for h4_Lorem_Ipsum_Dolor_Sit_Amet */
  get h4_Lorem_Ipsum_Dolor_Sit_Amet(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h4_Lorem_Ipsum_Dolor_Sit_Amet);
  }

  /** Locator for h4_4 */
  get h4_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h4_4);
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

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for span_Learn_More */
  get span_Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Learn_More);
  }

  /** Locator for span_11 */
  get span_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_11);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for div_GetIn_Touch */
  get div_GetIn_Touch(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_GetIn_Touch);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for div_GetIn_Touch_16 */
  get div_GetIn_Touch_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_GetIn_Touch_16);
  }

  /** Locator for span_GetIn_Touch */
  get span_GetIn_Touch(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_GetIn_Touch);
  }

  /** Locator for div_Lorem_Ipsum_Dolor_Sit_Amet */
  get div_Lorem_Ipsum_Dolor_Sit_Amet(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Lorem_Ipsum_Dolor_Sit_Amet);
  }

  /** Locator for div_Lorem_Ipsum_Dolor_Sit_Amet_19 */
  get div_Lorem_Ipsum_Dolor_Sit_Amet_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Lorem_Ipsum_Dolor_Sit_Amet_19);
  }

  /** Locator for div_Learn_More */
  get div_Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Learn_More);
  }

  /** Locator for div_Learn_More_21 */
  get div_Learn_More_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Learn_More_21);
  }

  // --- Actions ---

  /** Click Learn_More */
  async clickLearnMore() {
    const el = await this.Learn_More;
    await el.click();
  }

  /** Click GetIn_Touch */
  async clickGetinTouch() {
    const el = await this.GetIn_Touch;
    await el.click();
  }

  /** Click h4_Lorem_Ipsum_Dolor_Sit_Amet */
  async clickH4LoremIpsumDolorSitAmet() {
    const el = await this.h4_Lorem_Ipsum_Dolor_Sit_Amet;
    await el.click();
  }

  /** Click h4_4 */
  async clickH44() {
    const el = await this.h4_4;
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

  /** Click div_9 */
  async clickDiv9() {
    const el = await this.div_9;
    await el.click();
  }

  /** Click span_Learn_More */
  async clickSpanLearnMore() {
    const el = await this.span_Learn_More;
    await el.click();
  }

  /** Click span_11 */
  async clickSpan11() {
    const el = await this.span_11;
    await el.click();
  }
}
