import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, './formRecaptchaPage.locators.json'));

export class FormRecaptchaPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/form-recaptcha.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-form-recaptcha' }] });
  }

  get captchaContainer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.container || { strategies: [{ type: 'css', value: '.g-recaptcha' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
