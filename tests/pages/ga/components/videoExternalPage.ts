import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/videoExternalPage.locators.json'));

export class VideoExternalPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/video-external.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/video-external.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-video-external' }] });
  }

  get container(): Promise<Locator> {
    // Verified live 2026-08-12: real class is __image-box — __container never existed.
    return resolveLocator(this.page, registry.entries.container || { strategies: [{ type: 'css', value: '.cmp-video-external__image-box' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
