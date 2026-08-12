import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/teaserCardPage.locators.json'));

export class TeaserCardPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/teaser-card.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/teaser-card.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  get cardRoot(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cardRoot);
  }

  get cardImage(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cardImage);
  }

  get cardEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cardEyebrow);
  }

  get cardTitle(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cardTitle);
  }

  get cardDescriptor(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cardDescriptor);
  }

  get cardLink(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cardLink);
  }

  get cardContent(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.cardContent);
  }

  // --- Actions ---

  async clickCardLink() {
    const el = await this.cardLink;
    await el.click();
  }

  async clickCardRoot() {
    const el = await this.cardRoot;
    await el.click();
  }
}
