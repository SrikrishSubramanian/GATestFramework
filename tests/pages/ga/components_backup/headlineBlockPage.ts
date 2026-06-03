import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'headlineBlockPage.locators.json'));

export class HeadlineBlockPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/headline-block.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for a_Optional_CTA */
  get a_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Optional_CTA);
  }

  /** Locator for a_Link_Label */
  get a_Link_Label(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Link_Label);
  }

  /** Locator for h2_2 */
  get h2_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_2);
  }

  /** Locator for div_EyeBrow */
  get div_EyeBrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_EyeBrow);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for i_6 */
  get i_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_6);
  }

  /** Locator for span_Optional_CTA */
  get span_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Optional_CTA);
  }

  /** Locator for span_Link_Label */
  get span_Link_Label(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Link_Label);
  }

  // --- Actions ---

  /** Click a_Optional_CTA */
  async clickAOptionalCta() {
    const el = await this.a_Optional_CTA;
    await el.click();
  }

  /** Click a_Link_Label */
  async clickALinkLabel() {
    const el = await this.a_Link_Label;
    await el.click();
  }

  /** Click h2_2 */
  async clickH22() {
    const el = await this.h2_2;
    await el.click();
  }

  /** Click div_EyeBrow */
  async clickDivEyebrow() {
    const el = await this.div_EyeBrow;
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

  /** Click i_6 */
  async clickI6() {
    const el = await this.i_6;
    await el.click();
  }

  /** Click span_Optional_CTA */
  async clickSpanOptionalCta() {
    const el = await this.span_Optional_CTA;
    await el.click();
  }

  /** Click span_Link_Label */
  async clickSpanLinkLabel() {
    const el = await this.span_Link_Label;
    await el.click();
  }
}
