import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/imageWithNestedContentPage.locators.json'));

export class ImageWithNestedContentPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/image-with-nested-content.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for ComeGrowWithUs */
  get ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ComeGrowWithUs);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for div_2 */
  get div_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_2);
  }

  /** Locator for div_3 */
  get div_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_3);
  }

  /** Locator for div_ComeGrowWithUs */
  get div_ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ComeGrowWithUs);
  }

  /** Locator for p_5 */
  get p_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_5);
  }

  /** Locator for dialog_6 */
  get dialog_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_6);
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

  /** Locator for div_100M */
  get div_100M(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_100M);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  // --- Actions ---

  /** Click ComeGrowWithUs */
  async clickComegrowwithus() {
    const el = await this.ComeGrowWithUs;
    await el.click();
  }

  /** Click Close */
  async clickClose() {
    const el = await this.Close;
    await el.click();
  }

  /** Click div_2 */
  async clickDiv2() {
    const el = await this.div_2;
    await el.click();
  }

  /** Click div_3 */
  async clickDiv3() {
    const el = await this.div_3;
    await el.click();
  }

  /** Click div_ComeGrowWithUs */
  async clickDivComegrowwithus() {
    const el = await this.div_ComeGrowWithUs;
    await el.click();
  }

  /** Click p_5 */
  async clickP5() {
    const el = await this.p_5;
    await el.click();
  }

  /** Click dialog_6 */
  async clickDialog6() {
    const el = await this.dialog_6;
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
}
