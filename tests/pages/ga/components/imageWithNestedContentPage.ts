import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'imageWithNestedContentPage.locators.json'));

export class ImageWithNestedContentPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/image-with-nested-content.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for a_0 */
  get a_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_0);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for div_3 */
  get div_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_3);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for div_ComeGrowWithUs */
  get div_ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ComeGrowWithUs);
  }

  /** Locator for svg_7 */
  get svg_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.svg_7);
  }

  /** Locator for p_8 */
  get p_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_8);
  }

  /** Locator for dialog_9 */
  get dialog_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_9);
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

  /** Locator for div_100M */
  get div_100M(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_100M);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  // --- Actions ---

  /** Click a_0 */
  async clickA0() {
    const el = await this.a_0;
    await el.click();
  }

  /** Click Close */
  async clickClose() {
    const el = await this.Close;
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

  /** Click div_5 */
  async clickDiv5() {
    const el = await this.div_5;
    await el.click();
  }

  /** Click div_ComeGrowWithUs */
  async clickDivComegrowwithus() {
    const el = await this.div_ComeGrowWithUs;
    await el.click();
  }

  /** Click svg_7 */
  async clickSvg7() {
    const el = await this.svg_7;
    await el.click();
  }

  /** Click p_8 */
  async clickP8() {
    const el = await this.p_8;
    await el.click();
  }

  /** Click dialog_9 */
  async clickDialog9() {
    const el = await this.dialog_9;
    await el.click();
  }

  /** Click div_10 */
  async clickDiv10() {
    const el = await this.div_10;
    await el.click();
  }
}
