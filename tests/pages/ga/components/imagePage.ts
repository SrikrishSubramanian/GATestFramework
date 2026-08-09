import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/imagePage.locators.json'));

export class ImagePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/image.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for ImageInWhiteBackground */
  get ImageInWhiteBackground(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ImageInWhiteBackground);
  }

  /** Locator for ImageInWhiteBackground_1 */
  get ImageInWhiteBackground_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ImageInWhiteBackground_1);
  }

  /** Locator for ImageInWhiteBackground_2 */
  get ImageInWhiteBackground_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ImageInWhiteBackground_2);
  }

  /** Locator for img_ImageInWhiteBackg */
  get img_ImageInWhiteBackg(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_ImageInWhiteBackg);
  }

  /** Locator for img_FullWidthImageIn_ */
  get img_FullWidthImageIn_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_FullWidthImageIn_);
  }

  /** Locator for img_ImageInWhiteBackg_5 */
  get img_ImageInWhiteBackg_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_ImageInWhiteBackg_5);
  }

  /** Locator for img_FullWidthImageIn__6 */
  get img_FullWidthImageIn__6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_FullWidthImageIn__6);
  }

  /** Locator for img_ImageInWhiteBackg_7 */
  get img_ImageInWhiteBackg_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_ImageInWhiteBackg_7);
  }

  /** Locator for img_FullWidthImageIn__8 */
  get img_FullWidthImageIn__8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_FullWidthImageIn__8);
  }

  /** Locator for imgImage_9 */
  get imgImage_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.imgImage_9);
  }

  /** Locator for imgImage_10 */
  get imgImage_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.imgImage_10);
  }

  /** Locator for img_CaptionFrom_Metadat */
  get img_CaptionFrom_Metadat(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_CaptionFrom_Metadat);
  }

  /** Locator for img_ImageInWhiteBackg_12 */
  get img_ImageInWhiteBackg_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_ImageInWhiteBackg_12);
  }

  /** Locator for img_FullWidthImageIn__13 */
  get img_FullWidthImageIn__13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_FullWidthImageIn__13);
  }

  /** Locator for figure_14 */
  get figure_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_14);
  }

  /** Locator for picture_15 */
  get picture_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_15);
  }

  /** Locator for div_16 */
  get div_16(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_16);
  }

  /** Locator for figcaption_17 */
  get figcaption_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_17);
  }

  /** Locator for figure_18 */
  get figure_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_18);
  }

  /** Locator for picture_19 */
  get picture_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_19);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for figcaption_21 */
  get figcaption_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_21);
  }

  /** Locator for figure_22 */
  get figure_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_22);
  }

  /** Locator for picture_23 */
  get picture_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_23);
  }

  /** Locator for div_24 */
  get div_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_24);
  }

  /** Locator for figcaption_25 */
  get figcaption_25(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_25);
  }

  /** Locator for figure_26 */
  get figure_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_26);
  }

  /** Locator for picture_27 */
  get picture_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_27);
  }

  /** Locator for div_28 */
  get div_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_28);
  }

  /** Locator for figcaption_29 */
  get figcaption_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_29);
  }

  /** Locator for figure_30 */
  get figure_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_30);
  }

  /** Locator for picture_31 */
  get picture_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_31);
  }

  /** Locator for div_32 */
  get div_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_32);
  }

  /** Locator for figcaption_33 */
  get figcaption_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_33);
  }

  /** Locator for figure_34 */
  get figure_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_34);
  }

  /** Locator for picture_35 */
  get picture_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_35);
  }

  /** Locator for div_36 */
  get div_36(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_36);
  }

  /** Locator for figcaption_37 */
  get figcaption_37(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_37);
  }

  /** Locator for figure_38 */
  get figure_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_38);
  }

  /** Locator for picture_39 */
  get picture_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_39);
  }

  /** Locator for figure_40 */
  get figure_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_40);
  }

  /** Locator for picture_41 */
  get picture_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_41);
  }

  /** Locator for figure_42 */
  get figure_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_42);
  }

  /** Locator for picture_43 */
  get picture_43(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_43);
  }

  /** Locator for div_44 */
  get div_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_44);
  }

  /** Locator for figure_45 */
  get figure_45(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_45);
  }

  /** Locator for picture_46 */
  get picture_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_46);
  }

  /** Locator for div_47 */
  get div_47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_47);
  }

  /** Locator for figure_48 */
  get figure_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_48);
  }

  /** Locator for picture_49 */
  get picture_49(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_49);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for figcaption_51 */
  get figcaption_51(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_51);
  }

  // --- Actions ---

  /** Click ImageInWhiteBackground */
  async clickImageinwhitebackground() {
    const el = await this.ImageInWhiteBackground;
    await el.click();
  }

  /** Click ImageInWhiteBackground_1 */
  async clickImageinwhitebackground1() {
    const el = await this.ImageInWhiteBackground_1;
    await el.click();
  }

  /** Click ImageInWhiteBackground_2 */
  async clickImageinwhitebackground2() {
    const el = await this.ImageInWhiteBackground_2;
    await el.click();
  }

  /** Click img_ImageInWhiteBackg */
  async clickImgImageinwhitebackg() {
    const el = await this.img_ImageInWhiteBackg;
    await el.click();
  }

  /** Click img_FullWidthImageIn_ */
  async clickImgFullwidthimagein() {
    const el = await this.img_FullWidthImageIn_;
    await el.click();
  }

  /** Click img_ImageInWhiteBackg_5 */
  async clickImgImageinwhitebackg5() {
    const el = await this.img_ImageInWhiteBackg_5;
    await el.click();
  }

  /** Click img_FullWidthImageIn__6 */
  async clickImgFullwidthimagein6() {
    const el = await this.img_FullWidthImageIn__6;
    await el.click();
  }

  /** Click img_ImageInWhiteBackg_7 */
  async clickImgImageinwhitebackg7() {
    const el = await this.img_ImageInWhiteBackg_7;
    await el.click();
  }

  /** Click img_FullWidthImageIn__8 */
  async clickImgFullwidthimagein8() {
    const el = await this.img_FullWidthImageIn__8;
    await el.click();
  }

  /** Click imgImage_9 */
  async clickImgimage9() {
    const el = await this.imgImage_9;
    await el.click();
  }
}
