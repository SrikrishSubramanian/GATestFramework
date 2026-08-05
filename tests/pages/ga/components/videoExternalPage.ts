import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/videoExternalPage.locators.json'));

export class VideoExternalPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/video-external.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-video-external' }] });
  }

  get container(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.container || { strategies: [{ type: 'css', value: '.cmp-video-external__container' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
