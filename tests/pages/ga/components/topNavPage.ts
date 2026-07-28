import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/topNavPage.locators.json'));

export class TopNavPage {
  constructor(private page: Page) {}

  /**
   * Navigate to the site header Experience Fragment preview page.
   * NOTE: top-nav is not a standalone AEM component — it's the <nav class="cmp-site-header__top-nav">
   * nested inside site-header, which is delivered via Experience Fragment (GAAM-792). There is no
   * site-header.html under the global-atlantic style guide; the live instance is the XF itself
   * (verified via querybuilder + live DOM).
   */
  async navigate(baseUrl: string, overrideUrl?: string) {
    const url = overrideUrl
      ?? `${baseUrl}/content/experience-fragments/global-atlantic/style-guide/header/header-master/master.html?wcmmode=disabled`;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-site-header__top-nav' }] });
  }

  get items(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.items || { strategies: [{ type: 'css', value: '.cmp-site-header__top-nav-item' }] });
  }

  async clickItem(index: number): Promise<void> {
    const itemList = this.page.locator('.cmp-site-header__top-nav-item');
    if (await itemList.count() > index) {
      await itemList.nth(index).click();
    }
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
