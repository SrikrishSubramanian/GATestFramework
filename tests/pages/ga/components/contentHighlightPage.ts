import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'contentHighlightPage.locators.json'));

export class ContentHighlightPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/content-highlight.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for a_Product_Button */
  get a_Product_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Product_Button);
  }

  /** Locator for a_ReadTheRelease */
  get a_ReadTheRelease(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_ReadTheRelease);
  }

  /** Locator for a_Contact_Us */
  get a_Contact_Us(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Contact_Us);
  }

  /** Locator for a_GlobalBioLink */
  get a_GlobalBioLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_GlobalBioLink);
  }

  /** Locator for a_ProductButton */
  get a_ProductButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_ProductButton);
  }

  /** Locator for h5_BarronsRecognizes_Global_Atla */
  get h5_BarronsRecognizes_Global_Atla(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h5_BarronsRecognizes_Global_Atla);
  }

  /** Locator for h5_6 */
  get h5_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h5_6);
  }

  /** Locator for h5_7 */
  get h5_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h5_7);
  }

  /** Locator for imgImage_8 */
  get imgImage_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.imgImage_8);
  }

  /** Locator for contentHighlightBannerMain */
  get contentHighlightBannerMain(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.contentHighlightBannerMain);
  }

  /** Locator for item1780302280431 */
  get item1780302280431(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.item1780302280431);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for item1780304577141 */
  get item1780304577141(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.item1780304577141);
  }

  /** Locator for item1780304694932 */
  get item1780304694932(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.item1780304694932);
  }

  /** Locator for Pause */
  get Pause(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Pause);
  }

  /** Locator for Play */
  get Play(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Play);
  }

  /** Locator for div_16 */
  get div_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_16);
  }

  /** Locator for div_17 */
  get div_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_17);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for figure_19 */
  get figure_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_19);
  }

  /** Locator for picture_20 */
  get picture_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_20);
  }

  /** Locator for section_21 */
  get section_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.section_21);
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

  /** Locator for div_Product_Button */
  get div_Product_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Product_Button);
  }

  /** Locator for i_26 */
  get i_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_26);
  }

  /** Locator for span_Product_Button */
  get span_Product_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Product_Button);
  }

  /** Locator for dialog_28 */
  get dialog_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_28);
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

  /** Locator for div_ReadTheRelease */
  get div_ReadTheRelease(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ReadTheRelease);
  }

  /** Locator for i_33 */
  get i_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_33);
  }

  /** Locator for span_ReadTheRelease */
  get span_ReadTheRelease(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_ReadTheRelease);
  }

  /** Locator for div_35 */
  get div_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_35);
  }

  /** Locator for div_Contact_Us */
  get div_Contact_Us(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Contact_Us);
  }

  /** Locator for span_Contact_Us */
  get span_Contact_Us(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Contact_Us);
  }

  /** Locator for div_38 */
  get div_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_38);
  }

  /** Locator for div_GlobalBioLink */
  get div_GlobalBioLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_GlobalBioLink);
  }

  /** Locator for span_GlobalBioLink */
  get span_GlobalBioLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_GlobalBioLink);
  }

  /** Locator for div_41 */
  get div_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_41);
  }

  /** Locator for div_ProductButton */
  get div_ProductButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ProductButton);
  }

  /** Locator for span_ProductButton */
  get span_ProductButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_ProductButton);
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

  /** Locator for span_49 */
  get span_49(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_49);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for span_HonoredToBeRecognizedAgain */
  get span_HonoredToBeRecognizedAgain(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_HonoredToBeRecognizedAgain);
  }

  /** Locator for span_52 */
  get span_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_52);
  }

  /** Locator for div_53 */
  get div_53(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_53);
  }

  // --- Actions ---

  /** Click a_Product_Button */
  async clickAProductButton() {
    const el = await this.a_Product_Button;
    await el.click();
  }

  /** Click a_ReadTheRelease */
  async clickAReadtherelease() {
    const el = await this.a_ReadTheRelease;
    await el.click();
  }

  /** Click a_Contact_Us */
  async clickAContactUs() {
    const el = await this.a_Contact_Us;
    await el.click();
  }

  /** Click a_GlobalBioLink */
  async clickAGlobalbiolink() {
    const el = await this.a_GlobalBioLink;
    await el.click();
  }

  /** Click a_ProductButton */
  async clickAProductbutton() {
    const el = await this.a_ProductButton;
    await el.click();
  }

  /** Click h5_BarronsRecognizes_Global_Atla */
  async clickH5BarronsrecognizesGlobalAtla() {
    const el = await this.h5_BarronsRecognizes_Global_Atla;
    await el.click();
  }

  /** Click h5_6 */
  async clickH56() {
    const el = await this.h5_6;
    await el.click();
  }

  /** Click h5_7 */
  async clickH57() {
    const el = await this.h5_7;
    await el.click();
  }

  /** Click imgImage_8 */
  async clickImgimage8() {
    const el = await this.imgImage_8;
    await el.click();
  }

  /** Click contentHighlightBannerMain */
  async clickContenthighlightbannermain() {
    const el = await this.contentHighlightBannerMain;
    await el.click();
  }
}
