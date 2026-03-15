import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'buttonPage.locators.json'));

export class ButtonPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.cmp-button:not(.basepage__skip-nav)', { timeout: 15000 });
  }

  /** Locator for a_Primary_CTA */
  get a_Primary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Primary_CTA);
  }

  /** Locator for a_Secondary_CTA */
  get a_Secondary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Secondary_CTA);
  }

  /** Locator for a_Primary_Disabled */
  get a_Primary_Disabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Primary_Disabled);
  }

  /** Locator for a_Secondary_Disabled */
  get a_Secondary_Disabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Secondary_Disabled);
  }

  /** Locator for a_Primary_Dark_Override */
  get a_Primary_Dark_Override(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Primary_Dark_Override);
  }

  /** Locator for a_Secondary_Dark_Override */
  get a_Secondary_Dark_Override(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Secondary_Dark_Override);
  }

  /** Locator for a_Button */
  get a_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Button);
  }

  /** Locator for a_LearnMore */
  get a_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_LearnMore);
  }

  /** Locator for a_Button_Icon_Text */
  get a_Button_Icon_Text(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Button_Icon_Text);
  }

  /** Locator for span_Primary_CTA */
  get span_Primary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Primary_CTA);
  }

  /** Locator for span_Secondary_CTA */
  get span_Secondary_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Secondary_CTA);
  }

  /** Locator for span_Primary_Disabled */
  get span_Primary_Disabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Primary_Disabled);
  }

  /** Locator for span_Secondary_Disabled */
  get span_Secondary_Disabled(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Secondary_Disabled);
  }

  /** Locator for span_Primary_Dark_Override */
  get span_Primary_Dark_Override(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Primary_Dark_Override);
  }

  /** Locator for span_Secondary_Dark_Override */
  get span_Secondary_Dark_Override(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Secondary_Dark_Override);
  }

  /** Locator for i_15 */
  get i_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_15);
  }

  /** Locator for span_Button */
  get span_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Button);
  }

  /** Locator for span_LearnMore */
  get span_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_LearnMore);
  }

  /** Locator for span_Button_Icon_Text */
  get span_Button_Icon_Text(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Button_Icon_Text);
  }

  // --- Actions ---

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

  /** Click a_Primary_Disabled */
  async clickAPrimaryDisabled() {
    const el = await this.a_Primary_Disabled;
    await el.click();
  }

  /** Click a_Secondary_Disabled */
  async clickASecondaryDisabled() {
    const el = await this.a_Secondary_Disabled;
    await el.click();
  }

  /** Click a_Primary_Dark_Override */
  async clickAPrimaryDarkOverride() {
    const el = await this.a_Primary_Dark_Override;
    await el.click();
  }

  /** Click a_Secondary_Dark_Override */
  async clickASecondaryDarkOverride() {
    const el = await this.a_Secondary_Dark_Override;
    await el.click();
  }

  /** Click a_Button */
  async clickAButton() {
    const el = await this.a_Button;
    await el.click();
  }

  /** Click a_LearnMore */
  async clickALearnmore() {
    const el = await this.a_LearnMore;
    await el.click();
  }

  /** Click a_Button_Icon_Text */
  async clickAButtonIconText() {
    const el = await this.a_Button_Icon_Text;
    await el.click();
  }

  /** Click span_Primary_CTA */
  async clickSpanPrimaryCta() {
    const el = await this.span_Primary_CTA;
    await el.click();
  }
}
