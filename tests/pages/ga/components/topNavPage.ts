import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../../locators/topNavPage.locators.json'));

export class TopNavPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/top-nav.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-top-nav' }] });
  }

  get items(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.items || { strategies: [{ type: 'css', value: '.cmp-top-nav__item' }] });
  }

  async clickItem(index: number): Promise<void> {
    const itemList = this.page.locator('.cmp-top-nav__item');
    if (await itemList.count() > index) {
      await itemList.nth(index).click();
    }
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
