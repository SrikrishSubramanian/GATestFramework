import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'imagePage.locators.json'));

export class ImagePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/image.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for ImageInWhiteBackground */
  get ImageInWhiteBackground(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ImageInWhiteBackground);
  }

  /** Locator for img_ImageInWhiteBackg */
  get img_ImageInWhiteBackg(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_ImageInWhiteBackg);
  }

  /** Locator for figure_2 */
  get figure_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_2);
  }

  /** Locator for picture_3 */
  get picture_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_3);
  }

  /** Locator for figcaption_4 */
  get figcaption_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figcaption_4);
  }

  /** Locator for figure_5 */
  get figure_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_5);
  }

  // --- Actions ---

  /** Click ImageInWhiteBackground */
  async clickImageinwhitebackground() {
    const el = await this.ImageInWhiteBackground;
    await el.click();
  }

  /** Click img_ImageInWhiteBackg */
  async clickImgImageinwhitebackg() {
    const el = await this.img_ImageInWhiteBackg;
    await el.click();
  }

  /** Click figure_2 */
  async clickFigure2() {
    const el = await this.figure_2;
    await el.click();
  }

  /** Click picture_3 */
  async clickPicture3() {
    const el = await this.picture_3;
    await el.click();
  }

  /** Click figcaption_4 */
  async clickFigcaption4() {
    const el = await this.figcaption_4;
    await el.click();
  }

  /** Click figure_5 */
  async clickFigure5() {
    const el = await this.figure_5;
    await el.click();
  }
}
