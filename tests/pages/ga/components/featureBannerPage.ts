import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/featureBannerPage.locators.json'));

export class FeatureBannerPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for a_Optional_CTA */
  get a_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Optional_CTA);
  }

  /** Locator for ComeGrowWithUs */
  get ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ComeGrowWithUs);
  }

  /** Locator for PlayBackgroundVideo */
  get PlayBackgroundVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PlayBackgroundVideo);
  }

  /** Locator for PauseBackgroundVideo */
  get PauseBackgroundVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PauseBackgroundVideo);
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

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  /** Locator for div_OptionalEyebrow */
  get div_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_OptionalEyebrow);
  }

  /** Locator for div_LoremIpsumDolorSitAmetCon */
  get div_LoremIpsumDolorSitAmetCon(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_LoremIpsumDolorSitAmetCon);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for i_15 */
  get i_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_15);
  }

  /** Locator for span_Optional_CTA */
  get span_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Optional_CTA);
  }

  /** Locator for div_17 */
  get div_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_17);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_ComeGrowWithUs */
  get div_ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ComeGrowWithUs);
  }

  /** Locator for p_20 */
  get p_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_20);
  }

  /** Locator for dialog_21 */
  get dialog_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_21);
  }

  /** Locator for div_22 */
  get div_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_22);
  }

  /** Locator for div_23 */
  get div_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_23);
  }

  /** Locator for div_24 */
  get div_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_24);
  }

  /** Locator for bcPlayerFeatureBanner_4d061201c3 */
  get bcPlayerFeatureBanner_4d061201c3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.bcPlayerFeatureBanner_4d061201c3);
  }

  /** Locator for span_26 */
  get span_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_26);
  }

  /** Locator for span_27 */
  get span_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_27);
  }

  /** Locator for div_28 */
  get div_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_28);
  }

  /** Locator for div_29 */
  get div_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_29);
  }

  /** Locator for div_30 */
  get div_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30);
  }

  /** Locator for div_100M */
  get div_100M(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_100M);
  }

  /** Locator for div_32 */
  get div_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_32);
  }

  // --- Actions ---

  /** Click a_Optional_CTA */
  async clickAOptionalCta() {
    const el = await this.a_Optional_CTA;
    await el.click();
  }

  /** Click ComeGrowWithUs */
  async clickComegrowwithus() {
    const el = await this.ComeGrowWithUs;
    await el.click();
  }

  /** Click PlayBackgroundVideo */
  async clickPlaybackgroundvideo() {
    const el = await this.PlayBackgroundVideo;
    await el.click();
  }

  /** Click PauseBackgroundVideo */
  async clickPausebackgroundvideo() {
    const el = await this.PauseBackgroundVideo;
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
