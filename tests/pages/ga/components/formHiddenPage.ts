import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'formHiddenPage.locators.json'));

export class FormHiddenPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/form-hidden.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-form-hidden' }] });
  }

  get hiddenInput(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.input || { strategies: [{ type: 'css', value: 'input[type="hidden"]' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible().catch(() => false);
  }
}
