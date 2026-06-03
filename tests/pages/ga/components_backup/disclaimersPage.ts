import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'disclaimersPage.locators.json'));

export class DisclaimersPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/disclaimers.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-disclaimers' }] });
  }

  get disclaimerText(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.text || { strategies: [{ type: 'css', value: '.cmp-disclaimers__text' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
