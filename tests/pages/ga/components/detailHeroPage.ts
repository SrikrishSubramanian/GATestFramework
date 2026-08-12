import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'detailHeroPage.locators.json'));

export class DetailHeroPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/detail-hero.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/detail-hero.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for a_Style_Guide */
  get a_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Style_Guide);
  }

  /** Locator for a_Component_Library */
  get a_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Component_Library);
  }

  /** Locator for a_Primary_CTA */
  get a_Primary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Primary_CTA);
  }

  /** Locator for a_Secondary_CTA */
  get a_Secondary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Secondary_CTA);
  }

  /** Locator for h1_4 */
  get h1_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_4);
  }

  /** Locator for Breadcrumb */
  get Breadcrumb(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Breadcrumb);
  }

  /** Locator for nav_6 */
  get nav_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.nav_6);
  }

  /** Locator for ol_7 */
  get ol_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_7);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for span_9 */
  get span_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_9);
  }

  /** Locator for li_Style_Guide */
  get li_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Style_Guide);
  }

  /** Locator for li_Component_Library */
  get li_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Component_Library);
  }

  /** Locator for li_Detail_Hero */
  get li_Detail_Hero(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Detail_Hero);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for p_OptionalEyebrow */
  get p_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_OptionalEyebrow);
  }

  /** Locator for div_16 */
  get div_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_16);
  }

  /** Locator for div_17 */
  get div_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_17);
  }

  /** Locator for i_18 */
  get i_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_18);
  }

  /** Locator for span_Primary_CTA */
  get span_Primary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Primary_CTA);
  }

  /** Locator for span_Secondary_CTA */
  get span_Secondary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Secondary_CTA);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
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

  /** Click a_Primary_CTA */
  async clickAPrimaryCta() {
    const el = await this.a_Primary_CTA;
    await el.click();
  }

  /** Click a_Secondary_CTA */
  async clickASecondaryCta() {
    const el = await this.a_Secondary_CTA;
    await el.click();
  }

  /** Click h1_4 */
  async clickH14() {
    const el = await this.h1_4;
    await el.click();
  }

  /** Click Breadcrumb */
  async clickBreadcrumb() {
    const el = await this.Breadcrumb;
    await el.click();
  }

  /** Click nav_6 */
  async clickNav6() {
    const el = await this.nav_6;
    await el.click();
  }

  /** Click ol_7 */
  async clickOl7() {
    const el = await this.ol_7;
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
