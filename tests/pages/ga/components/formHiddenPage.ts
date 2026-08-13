import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/formHiddenPage.locators.json'));

export class FormHiddenPage {
  constructor(private page: Page) {}

  // The real component lives at kkr-aem's apps/{kkr-aem-base,ga}/components/form/hidden
  // (resourceType "ga/components/form/hidden") — there is no "form-hidden" style-guide page
  // anywhere in kkr-aem (confirmed: no such content dir, no fixture-meta.json) because this
  // field type is only ever used nested inside a real authored form, never standalone. The
  // one live page with real hidden-field instances configured is the Marketo form XF (7
  // <hidden> nodes: googleClientID, mostRecentSource, mostRecentOfferType, etc. — see
  // ui.content.ga/.../experience-fragments/global-atlantic/style-guide/header/header-master/
  // marketo-form/.content.xml), the same page already used for FC-003 in
  // form-container.author.spec.ts.
  private static readonly URL_PATH = '/content/experience-fragments/global-atlantic/style-guide/header/header-master/marketo-form.html?wcmmode=disabled';

  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}${FormHiddenPage.URL_PATH}`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}${FormHiddenPage.URL_PATH}`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root || { strategies: [{ type: 'css', value: 'input[type="hidden"]' }] });
  }

  get hiddenInput(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.input || { strategies: [{ type: 'css', value: 'input[type="hidden"]' }] });
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible().catch(() => false);
  }
}
