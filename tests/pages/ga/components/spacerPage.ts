import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/spacerPage.locators.json'));

export class SpacerPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    const url = `${baseUrl}/content/global-atlantic/style-guide/components/spacer.html?wcmmode=disabled`;
    try {
      await this.page.goto(url);
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        await this.page.goto(url);
      } else {
        throw err;
      }
    }
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.cmp-spacer', { timeout: 15000 });
  }

  /** Locator for any .cmp-spacer inner element */
  get div_spacer(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer);
  }

  /** Locator for spacer wrapper divs */
  get div_spacer_wrapper(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer_wrapper);
  }

  /** Locator for default/medium spacer (no size modifier) */
  get div_spacer_default(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer_default);
  }

  /** Locator for XXSmall spacer */
  get div_spacer_xxsmall(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer_xxsmall);
  }

  /** Locator for XSmall spacer */
  get div_spacer_xsmall(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer_xsmall);
  }

  /** Locator for Small spacer */
  get div_spacer_small(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer_small);
  }

  /** Locator for Large spacer */
  get div_spacer_large(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer_large);
  }

  /** Locator for XLarge spacer */
  get div_spacer_xlarge(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_spacer_xlarge);
  }

  /** Get the computed height of a spacer element */
  async getSpacerHeight(locator: Locator): Promise<number> {
    const box = await locator.boundingBox();
    return Math.round(box?.height ?? 0);
  }

  /** Get all .cmp-spacer inner elements on the page */
  getAllSpacers(): Locator {
    return this.page.locator('.cmp-spacer');
  }

  /** Get all spacer wrapper divs */
  getAllSpacerWrappers(): Locator {
    return this.page.locator('div.spacer');
  }
}
