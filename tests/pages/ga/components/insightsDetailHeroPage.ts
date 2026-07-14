import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'insightsDetailHeroPage.locators.json'));

export class InsightsDetailHeroPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/insights-detail-hero.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for PlayVideo */
  get PlayVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PlayVideo);
  }

  /** Locator for CloseVideo */
  get CloseVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.CloseVideo);
  }

  /** Locator for h1_2 */
  get h1_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_2);
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

  /** Locator for span_9 */
  get span_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_9);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for VideoPlayer */
  get VideoPlayer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.VideoPlayer);
  }

  /** Locator for insightsDetailHero_66ffcfaa31 */
  get insightsDetailHero_66ffcfaa31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.insightsDetailHero_66ffcfaa31);
  }

  // --- Actions ---

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

  /** Click h1_2 */
  async clickH12() {
    const el = await this.h1_2;
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

  /** Click span_9 */
  async clickSpan9() {
    const el = await this.span_9;
    await el.click();
  }
}
