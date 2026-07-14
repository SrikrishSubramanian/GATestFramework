import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'quotePage.locators.json'));

export class QuotePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/quote.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for div_0 */
  get div_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_0);
  }

  /** Locator for div_1 */
  get div_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_1);
  }

  /** Locator for span_2 */
  get span_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_2);
  }

  /** Locator for span_3 */
  get span_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_3);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for blockquote_5 */
  get blockquote_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_5);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for span_7 */
  get span_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_7);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for blockquote_10 */
  get blockquote_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_10);
  }

  /** Locator for div_XSTopAndBottomPaddingExam */
  get div_XSTopAndBottomPaddingExam(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_XSTopAndBottomPaddingExam);
  }

  /** Locator for div_XSTopAndBottomPaddingExam_12 */
  get div_XSTopAndBottomPaddingExam_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_XSTopAndBottomPaddingExam_12);
  }

  /** Locator for blockquote_XSTopAndBottomPaddingExam */
  get blockquote_XSTopAndBottomPaddingExam(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_XSTopAndBottomPaddingExam);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for blockquote_16 */
  get blockquote_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_16);
  }

  /** Locator for div_17 */
  get div_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_17);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for blockquote_19 */
  get blockquote_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_19);
  }

  // --- Actions ---

  /** Click div_0 */
  async clickDiv0() {
    const el = await this.div_0;
    await el.click();
  }

  /** Click div_1 */
  async clickDiv1() {
    const el = await this.div_1;
    await el.click();
  }

  /** Click span_2 */
  async clickSpan2() {
    const el = await this.span_2;
    await el.click();
  }

  /** Click span_3 */
  async clickSpan3() {
    const el = await this.span_3;
    await el.click();
  }

  /** Click div_4 */
  async clickDiv4() {
    const el = await this.div_4;
    await el.click();
  }

  /** Click blockquote_5 */
  async clickBlockquote5() {
    const el = await this.blockquote_5;
    await el.click();
  }

  /** Click div_6 */
  async clickDiv6() {
    const el = await this.div_6;
    await el.click();
  }

  /** Click span_7 */
  async clickSpan7() {
    const el = await this.span_7;
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
