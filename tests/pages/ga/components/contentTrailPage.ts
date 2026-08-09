import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/contentTrailPage.locators.json'));

export class ContentTrailPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/content-trail.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for ComeGrowWithUs */
  get ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ComeGrowWithUs);
  }

  /** Locator for ComeGrowWithUs_1 */
  get ComeGrowWithUs_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ComeGrowWithUs_1);
  }

  /** Locator for ComeGrowWithUs_2 */
  get ComeGrowWithUs_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ComeGrowWithUs_2);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for div_ComeGrowWithUs */
  get div_ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ComeGrowWithUs);
  }

  /** Locator for p_6 */
  get p_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_6);
  }

  /** Locator for div_7 */
  get div_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_7);
  }

  /** Locator for dialog_8 */
  get dialog_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_8);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  // --- Actions ---

  /** Click ComeGrowWithUs */
  async clickComegrowwithus() {
    const el = await this.ComeGrowWithUs;
    await el.click();
  }

  /** Click ComeGrowWithUs_1 */
  async clickComegrowwithus1() {
    const el = await this.ComeGrowWithUs_1;
    await el.click();
  }

  /** Click ComeGrowWithUs_2 */
  async clickComegrowwithus2() {
    const el = await this.ComeGrowWithUs_2;
    await el.click();
  }

  /** Click Close */
  async clickClose() {
    const el = await this.Close;
    await el.click();
  }

  /** Click div_4 */
  async clickDiv4() {
    const el = await this.div_4;
    await el.click();
  }

  /** Click div_ComeGrowWithUs */
  async clickDivComegrowwithus() {
    const el = await this.div_ComeGrowWithUs;
    await el.click();
  }

  /** Click p_6 */
  async clickP6() {
    const el = await this.p_6;
    await el.click();
  }

  /** Click div_7 */
  async clickDiv7() {
    const el = await this.div_7;
    await el.click();
  }

  /** Click dialog_8 */
  async clickDialog8() {
    const el = await this.dialog_8;
    await el.click();
  }

  /** Click div_9 */
  async clickDiv9() {
    const el = await this.div_9;
    await el.click();
  }
}
