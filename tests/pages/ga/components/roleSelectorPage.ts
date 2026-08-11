import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/roleSelectorPage.locators.json'));

/**
 * Role Selector is delivered inside the site header's global Experience Fragment
 * (GAAM-1314 folded the standalone role-selector component into the header), so
 * it renders on every page rather than at a dedicated style-guide content path.
 * Desktop uses a dropdown (`__header` trigger + `__panel`); mobile uses an
 * accordion nested in the header's mobile drawer (`__mobile-role-accordion-*`).
 */
export class RoleSelectorPage {
  constructor(private page: Page) {}

  async navigate(baseUrl: string) {
    await this.page.goto(
      `${baseUrl}/content/global-atlantic/style-guide/qa-testing/components/QA_testing/home_page/role-selector.html?wcmmode=disabled`,
      { waitUntil: 'domcontentloaded' }
    );
  }

  // --- Desktop dropdown ---

  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root);
  }

  get trigger(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.trigger);
  }

  get panel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.panel);
  }

  get options(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.options);
  }

  async openPanel(): Promise<void> {
    const trigger = await this.trigger;
    await trigger.click();
  }

  async selectRole(index: number): Promise<void> {
    await this.openPanel();
    const opts = await this.options;
    if (await opts.count() > index) {
      await opts.nth(index).click();
    }
  }

  // --- Mobile accordion ---

  get mobileRoot(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.mobileRoot);
  }

  get mobileTrigger(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.mobileTrigger);
  }

  get mobilePanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.mobilePanel);
  }

  get mobileOptions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.mobileOptions);
  }

  async isVisible(): Promise<boolean> {
    const el = await this.root;
    return el.isVisible();
  }
}
