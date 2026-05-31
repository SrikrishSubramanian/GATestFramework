import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'teaserCardPage.locators.json'));

export class TeaserCardPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/teaser-card.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
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
