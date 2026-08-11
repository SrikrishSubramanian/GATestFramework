import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/siteHeaderPage.locators.json'));

export class SiteHeaderPage {
  constructor(private page: Page) {}

  /**
   * Navigate to the site header.
   * Site Header ships inside a persona-specific Experience Fragment (GAAM-792) —
   * there is no standalone style-guide page for it, and the plain
   * /content/global-atlantic/en.html home page still serves the legacy
   * .cmp-header component, not this one. Default target is the
   * financial-professionals persona XF master, confirmed live.
   */
  async navigate(baseUrl: string, overrideUrl?: string) {
    const url = overrideUrl
      ?? `${baseUrl}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /** Component root */
  get root(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.root);
  }

  /** Logo image element */
  get logo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.logo);
  }

  /** Top navigation bar */
  get topNav(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.topNav);
  }

  /** Main navigation bar */
  get mainNav(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.mainNav);
  }

  /** Login trigger button */
  get loginTrigger(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.loginTrigger);
  }

  /** Search icon button */
  get searchTrigger(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.searchTrigger);
  }

  /** Role selector panel */
  get roleSelector(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.roleSelector);
  }

  /** Main nav CTA button */
  get navCta(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navCta);
  }

  /** L1 navigation panel (mega-menu) */
  get navPanel(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.navPanel);
  }

  // --- Actions ---

  async clickLoginTrigger() {
    const el = await this.loginTrigger;
    await el.click();
  }

  async clickSearchTrigger() {
    const el = await this.searchTrigger;
    await el.click();
  }

  async clickNavCta() {
    const el = await this.navCta;
    await el.click();
  }
}
