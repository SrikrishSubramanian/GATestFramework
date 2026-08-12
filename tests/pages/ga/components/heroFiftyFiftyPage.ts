import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/heroFiftyFiftyPage.locators.json'));

export class HeroFiftyFiftyPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/hero-fifty-fifty.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for a_Style_Guide */
  get a_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Style_Guide);
  }

  /** Locator for a_Component_Library */
  get a_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Component_Library);
  }

  /** Locator for a_Optional_CTA */
  get a_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Optional_CTA);
  }

  /** Locator for a_LearnMore */
  get a_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_LearnMore);
  }

  /** Locator for ComeGrowWithUs */
  get ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ComeGrowWithUs);
  }

  /** Locator for a_Plan_Your_Future_Today */
  get a_Plan_Your_Future_Today(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Plan_Your_Future_Today);
  }

  /** Locator for PauseCarousel */
  get PauseCarousel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PauseCarousel);
  }

  /** Locator for h1_7 */
  get h1_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_7);
  }

  /** Locator for h1_8 */
  get h1_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_8);
  }

  /** Locator for h1_9 */
  get h1_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_9);
  }

  /** Locator for h1_10 */
  get h1_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h1_10);
  }

  /** Locator for nav_11 */
  get nav_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.nav_11);
  }

  /** Locator for swiperWrapper_0c50ece3dbe6d25d */
  get swiperWrapper_0c50ece3dbe6d25d(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.swiperWrapper_0c50ece3dbe6d25d);
  }

  /** Locator for ol_13 */
  get ol_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_13);
  }

  /** Locator for Story_Cards */
  get Story_Cards(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Story_Cards);
  }

  /** Locator for el1_2 */
  get el1_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el1_2);
  }

  /** Locator for el2_2 */
  get el2_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el2_2);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for div_19 */
  get div_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_19);
  }

  /** Locator for li_Style_Guide */
  get li_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Style_Guide);
  }

  /** Locator for li_Component_Library */
  get li_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Component_Library);
  }

  /** Locator for li_Hero_5050 */
  get li_Hero_5050(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Hero_5050);
  }

  /** Locator for div_23 */
  get div_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_23);
  }

  /** Locator for div_24 */
  get div_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_24);
  }

  /** Locator for div_25 */
  get div_25(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_25);
  }

  /** Locator for i_26 */
  get i_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_26);
  }

  /** Locator for span_Optional_CTA */
  get span_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Optional_CTA);
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

  /** Locator for div_31 */
  get div_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_31);
  }

  /** Locator for div_32 */
  get div_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_32);
  }

  /** Locator for div_33 */
  get div_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_33);
  }

  /** Locator for div_34 */
  get div_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_34);
  }

  /** Locator for div_LearnMore */
  get div_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_LearnMore);
  }

  /** Locator for span_36 */
  get span_36(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_36);
  }

  /** Locator for span_LearnMore */
  get span_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_LearnMore);
  }

  /** Locator for div_38 */
  get div_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_38);
  }

  /** Locator for div_39 */
  get div_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_39);
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

  /** Locator for div_43 */
  get div_43(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_43);
  }

  /** Locator for div_44 */
  get div_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_44);
  }

  /** Locator for div_45 */
  get div_45(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_45);
  }

  /** Locator for div_46 */
  get div_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_46);
  }

  /** Locator for div_47 */
  get div_47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_47);
  }

  /** Locator for div_48 */
  get div_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_48);
  }

  /** Locator for div_90 */
  get div_90(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_90);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for div_51 */
  get div_51(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_51);
  }

  /** Locator for div_52 */
  get div_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_52);
  }

  /** Locator for div_53 */
  get div_53(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_53);
  }

  /** Locator for div_ComeGrowWithUs */
  get div_ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ComeGrowWithUs);
  }

  /** Locator for p_55 */
  get p_55(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_55);
  }

  /** Locator for dialog_56 */
  get dialog_56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_56);
  }

  /** Locator for div_57 */
  get div_57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_57);
  }

  /** Locator for div_58 */
  get div_58(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_58);
  }

  /** Locator for div_59 */
  get div_59(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_59);
  }

  /** Locator for div_60 */
  get div_60(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_60);
  }

  /** Locator for div_Plan_Your_Future_Today */
  get div_Plan_Your_Future_Today(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Plan_Your_Future_Today);
  }

  /** Locator for span_Plan_Your_Future_Today */
  get span_Plan_Your_Future_Today(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Plan_Your_Future_Today);
  }

  /** Locator for div_63 */
  get div_63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_63);
  }

  /** Locator for div_64 */
  get div_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_64);
  }

  /** Locator for div_65 */
  get div_65(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_65);
  }

  /** Locator for div_66 */
  get div_66(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_66);
  }

  /** Locator for p_OptionalEyebrow */
  get p_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_OptionalEyebrow);
  }

  /** Locator for div_68 */
  get div_68(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_68);
  }

  /** Locator for div_69 */
  get div_69(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_69);
  }

  /** Locator for div_70 */
  get div_70(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_70);
  }

  /** Locator for div_71 */
  get div_71(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_71);
  }

  /** Locator for div_90_ */
  get div_90_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_90_);
  }

  // --- Actions ---

  /** Click a_Style_Guide */
  async clickAStyleGuide() {
    const el = await this.a_Style_Guide;
    await el.click();
  }

  /** Click a_Component_Library */
  async clickAComponentLibrary() {
    const el = await this.a_Component_Library;
    await el.click();
  }

  /** Click a_Optional_CTA */
  async clickAOptionalCta() {
    const el = await this.a_Optional_CTA;
    await el.click();
  }

  /** Click a_LearnMore */
  async clickALearnmore() {
    const el = await this.a_LearnMore;
    await el.click();
  }

  /** Click ComeGrowWithUs */
  async clickComegrowwithus() {
    const el = await this.ComeGrowWithUs;
    await el.click();
  }

  /** Click a_Plan_Your_Future_Today */
  async clickAPlanYourFutureToday() {
    const el = await this.a_Plan_Your_Future_Today;
    await el.click();
  }

  /** Click PauseCarousel */
  async clickPausecarousel() {
    const el = await this.PauseCarousel;
    await el.click();
  }

  /** Click h1_7 */
  async clickH17() {
    const el = await this.h1_7;
    await el.click();
  }

  /** Click h1_8 */
  async clickH18() {
    const el = await this.h1_8;
    await el.click();
  }

  /** Click h1_9 */
  async clickH19() {
    const el = await this.h1_9;
    await el.click();
  }
}
