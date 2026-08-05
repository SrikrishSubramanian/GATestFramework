import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/disclaimersPage.locators.json'));

/**
 * NOTE: the AEM disclaimers component (apps/ga/components/content/disclaimers/disclaimers.html)
 * is currently an unimplemented placeholder — it renders only an HTL comment, no markup.
 * `.cmp-disclaimers` will never appear in the DOM until the component is built out.
 */
export class DisclaimersPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/disclaimers.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
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
