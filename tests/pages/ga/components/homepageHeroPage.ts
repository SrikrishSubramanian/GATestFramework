import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/homepageHeroPage.locators.json'));

export class HomepageHeroPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-homepage-hero' }] });
  }

  get heroImage(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.image || { strategies: [{ type: 'css', value: '.cmp-homepage-hero__image' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
