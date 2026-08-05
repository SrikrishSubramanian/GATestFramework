import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/headerPage.locators.json'));

export class HeaderPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/header.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: 'header' }] });
  }

  get banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.banner || { strategies: [{ type: 'css', value: '[role="banner"]' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
