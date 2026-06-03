import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'breadcrumbPage.locators.json'));

export class BreadcrumbPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/breadcrumb.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for a_Style_Guide */
  get a_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Style_Guide);
  }

  /** Locator for a_Component_Library */
  get a_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Component_Library);
  }

  /** Locator for ol_2 */
  get ol_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ol_2);
  }

  /** Locator for li_Style_Guide */
  get li_Style_Guide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Style_Guide);
  }

  /** Locator for li_Component_Library */
  get li_Component_Library(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Component_Library);
  }

  /** Locator for li_Breadcrumb */
  get li_Breadcrumb(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Breadcrumb);
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

  /** Click ol_2 */
  async clickOl2() {
    const el = await this.ol_2;
    await el.click();
  }

  /** Click li_Style_Guide */
  async clickLiStyleGuide() {
    const el = await this.li_Style_Guide;
    await el.click();
  }

  /** Click li_Component_Library */
  async clickLiComponentLibrary() {
    const el = await this.li_Component_Library;
    await el.click();
  }

  /** Click li_Breadcrumb */
  async clickLiBreadcrumb() {
    const el = await this.li_Breadcrumb;
    await el.click();
  }
}
