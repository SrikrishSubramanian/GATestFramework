import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/promoBannerPage.locators.json'));

export class PromoBannerPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/promo-banner.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for Learn_More */
  get Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Learn_More);
  }

  /** Locator for GetIn_Touch */
  get GetIn_Touch(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.GetIn_Touch);
  }

  /** Locator for div_3 */
  get div_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_3);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for p_Lorem_Ipsum_Dolor_Sit_Amet */
  get p_Lorem_Ipsum_Dolor_Sit_Amet(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Lorem_Ipsum_Dolor_Sit_Amet);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for div_7 */
  get div_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_7);
  }

  /** Locator for span_Learn_More */
  get span_Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Learn_More);
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

  /** Locator for p_12 */
  get p_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_12);
  }

  /** Locator for div_GetIn_Touch */
  get div_GetIn_Touch(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_GetIn_Touch);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for div_GetIn_Touch_15 */
  get div_GetIn_Touch_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_GetIn_Touch_15);
  }

  /** Locator for span_GetIn_Touch */
  get span_GetIn_Touch(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_GetIn_Touch);
  }

  /** Locator for div_Lorem_Ipsum_Dolor_Sit_Amet */
  get div_Lorem_Ipsum_Dolor_Sit_Amet(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Lorem_Ipsum_Dolor_Sit_Amet);
  }

  /** Locator for div_Lorem_Ipsum_Dolor_Sit_Amet_18 */
  get div_Lorem_Ipsum_Dolor_Sit_Amet_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Lorem_Ipsum_Dolor_Sit_Amet_18);
  }

  /** Locator for div_Learn_More */
  get div_Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Learn_More);
  }

  /** Locator for div_Learn_More_20 */
  get div_Learn_More_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Learn_More_20);
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

  /** Click div_3 */
  async clickDiv3() {
    const el = await this.div_3;
    await el.click();
  }

  /** Click div_4 */
  async clickDiv4() {
    const el = await this.div_4;
    await el.click();
  }

  /** Click p_Lorem_Ipsum_Dolor_Sit_Amet */
  async clickPLoremIpsumDolorSitAmet() {
    const el = await this.p_Lorem_Ipsum_Dolor_Sit_Amet;
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

  /** Click span_Learn_More */
  async clickSpanLearnMore() {
    const el = await this.span_Learn_More;
    await el.click();
  }

  /** Click span_9 */
  async clickSpan9() {
    const el = await this.span_9;
    await el.click();
  }

  /** Click div_10 */
  async clickDiv10() {
    const el = await this.div_10;
    await el.click();
  }
}
