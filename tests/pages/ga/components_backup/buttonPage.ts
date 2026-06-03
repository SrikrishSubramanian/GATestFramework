import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'buttonPage.locators.json'));

export class ButtonPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
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

  /** Locator for PlayVideo */
  get PlayVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PlayVideo);
  }

  /** Locator for CloseVideo */
  get CloseVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.CloseVideo);
  }

  /** Locator for img_Close */
  get img_Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_Close);
  }

  /** Locator for img_Close_6 */
  get img_Close_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_Close_6);
  }

  /** Locator for i_7 */
  get i_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_7);
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

  /** Locator for i_11 */
  get i_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_11);
  }

  /** Locator for span_Watch_Video */
  get span_Watch_Video(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Watch_Video);
  }

  /** Locator for dialog_13 */
  get dialog_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_13);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for bcPlayerButtonCb72533200 */
  get bcPlayerButtonCb72533200(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.bcPlayerButtonCb72533200);
  }

  // --- Actions ---

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

  /** Click PlayVideo */
  async clickPlayvideo() {
    const el = await this.PlayVideo;
    await el.click();
  }

  /** Click CloseVideo */
  async clickClosevideo() {
    const el = await this.CloseVideo;
    await el.click();
  }

  /** Click img_Close */
  async clickImgClose() {
    const el = await this.img_Close;
    await el.click();
  }

  /** Click img_Close_6 */
  async clickImgClose6() {
    const el = await this.img_Close_6;
    await el.click();
  }

  /** Click i_7 */
  async clickI7() {
    const el = await this.i_7;
    await el.click();
  }

  /** Click span_Button */
  async clickSpanButton() {
    const el = await this.span_Button;
    await el.click();
  }

  /** Click span_LearnMore */
  async clickSpanLearnmore() {
    const el = await this.span_LearnMore;
    await el.click();
  }
}
