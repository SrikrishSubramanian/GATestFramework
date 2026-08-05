import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'inBriefPage.locators.json'));

export class InBriefPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/in-brief.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for a_LearnMoreAboutRateAdjustme */
  get a_LearnMoreAboutRateAdjustme(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_LearnMoreAboutRateAdjustme);
  }

  /** Locator for h3_In_Brief */
  get h3_In_Brief(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_In_Brief);
  }

  /** Locator for ul_2 */
  get ul_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_2);
  }

  /** Locator for div_3 */
  get div_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_3);
  }

  // --- Actions ---

  /** Click a_LearnMoreAboutRateAdjustme */
  async clickALearnmoreaboutrateadjustme() {
    const el = await this.a_LearnMoreAboutRateAdjustme;
    await el.click();
  }

  /** Click h3_In_Brief */
  async clickH3InBrief() {
    const el = await this.h3_In_Brief;
    await el.click();
  }

  /** Click ul_2 */
  async clickUl2() {
    const el = await this.ul_2;
    await el.click();
  }

  /** Click div_3 */
  async clickDiv3() {
    const el = await this.div_3;
    await el.click();
  }
}
