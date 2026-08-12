import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/formRecaptchaPage.locators.json'));

export class FormRecaptchaPage {
  constructor(private page: Page) {}

  /**
   * NOTE: there is no dedicated form-recaptcha demo page — reCAPTCHA only appears nested
   * inside the base kkr tenant's form-container style guide page (verified via querybuilder + live DOM).
   */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/kkr/style-guide/components/form-container.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/kkr/style-guide/components/form-container.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-recaptcha' }] });
  }

  get captchaContainer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.container || { strategies: [{ type: 'css', value: '.g-recaptcha' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
