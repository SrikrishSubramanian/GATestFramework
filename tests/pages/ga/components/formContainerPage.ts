import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/formContainerPage.locators.json'));

export class FormContainerPage {
  constructor(private page: Page) {}

  /**
   * NOTE: there is no form-container demo page under the global-atlantic style guide —
   * the live instance is the base kkr tenant's style guide (verified via querybuilder + live DOM).
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
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: '.cmp-form' }] });
  }

  get form(): Promise<Locator> {
    // .cmp-form is on the <form> element itself, not a wrapper around a nested <form>.
    return resolveLocator(this.page, registry.entries.form || { strategies: [{ type: 'css', value: 'form.cmp-form' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
