import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'contentTrailPage.locators.json'));

export class ContentTrailPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/content-trail.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for a_0 */
  get a_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_0);
  }

  /** Locator for a_1 */
  get a_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_1);
  }

  /** Locator for a_2 */
  get a_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_2);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for div_ComeGrowWithUs */
  get div_ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ComeGrowWithUs);
  }

  /** Locator for svg_8 */
  get svg_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.svg_8);
  }

  /** Locator for p_9 */
  get p_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_9);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  /** Locator for dialog_11 */
  get dialog_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_11);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  // --- Actions ---

  /** Click a_0 */
  async clickA0() {
    const el = await this.a_0;
    await el.click();
  }

  /** Click a_1 */
  async clickA1() {
    const el = await this.a_1;
    await el.click();
  }

  /** Click a_2 */
  async clickA2() {
    const el = await this.a_2;
    await el.click();
  }

  /** Click Close */
  async clickClose() {
    const el = await this.Close;
    await el.click();
  }

  /** Click div_5 */
  async clickDiv5() {
    const el = await this.div_5;
    await el.click();
  }

  /** Click div_6 */
  async clickDiv6() {
    const el = await this.div_6;
    await el.click();
  }

  /** Click div_ComeGrowWithUs */
  async clickDivComegrowwithus() {
    const el = await this.div_ComeGrowWithUs;
    await el.click();
  }

  /** Click svg_8 */
  async clickSvg8() {
    const el = await this.svg_8;
    await el.click();
  }

  /** Click p_9 */
  async clickP9() {
    const el = await this.p_9;
    await el.click();
  }

  /** Click div_10 */
  async clickDiv10() {
    const el = await this.div_10;
    await el.click();
  }
}
