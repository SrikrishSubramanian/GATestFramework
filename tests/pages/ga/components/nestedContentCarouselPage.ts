import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'nestedContentCarouselPage.locators.json'));

export class NestedContentCarouselPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for a_LearnMore */
  get a_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_LearnMore);
  }

  /** Locator for PauseCarousel */
  get PauseCarousel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PauseCarousel);
  }

  /** Locator for swiperWrapper_851ccdb1b2fe7312 */
  get swiperWrapper_851ccdb1b2fe7312(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.swiperWrapper_851ccdb1b2fe7312);
  }

  /** Locator for el1_2 */
  get el1_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el1_2);
  }

  /** Locator for el2_2 */
  get el2_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el2_2);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  /** Locator for div_6 */
  get div_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_6);
  }

  /** Locator for div_7 */
  get div_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_7);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for div_LearnMore */
  get div_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_LearnMore);
  }

  /** Locator for span_10 */
  get span_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_10);
  }

  /** Locator for span_LearnMore */
  get span_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_LearnMore);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for span_01 */
  get span_01(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_01);
  }

  /** Locator for span_02 */
  get span_02(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_02);
  }

  /** Locator for span_Slide_1Of_2 */
  get span_Slide_1Of_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Slide_1Of_2);
  }

  // --- Actions ---

  /** Click a_LearnMore */
  async clickALearnmore() {
    const el = await this.a_LearnMore;
    await el.click();
  }

  /** Click PauseCarousel */
  async clickPausecarousel() {
    const el = await this.PauseCarousel;
    await el.click();
  }

  /** Click swiperWrapper_851ccdb1b2fe7312 */
  async clickSwiperwrapper851ccdb1b2fe7312() {
    const el = await this.swiperWrapper_851ccdb1b2fe7312;
    await el.click();
  }

  /** Click el1_2 */
  async clickEl12() {
    const el = await this.el1_2;
    await el.click();
  }

  /** Click el2_2 */
  async clickEl22() {
    const el = await this.el2_2;
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

  /** Click div_LearnMore */
  async clickDivLearnmore() {
    const el = await this.div_LearnMore;
    await el.click();
  }
}
