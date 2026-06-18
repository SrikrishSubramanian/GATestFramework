import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../../locators/workbenchPage.locators.json'));

export class WorkbenchPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/workbench.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-workbench' }] });
  }

  get content(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.content || { strategies: [{ type: 'css', value: '.cmp-workbench__content' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
