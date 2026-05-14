import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'siteHeaderPage.locators.json'));

export class SiteHeaderPage {
  constructor(private page: Page) {}

  /**
   * Navigate to the site header style guide page.
   * NOTE: Site Header is delivered inside an Experience Fragment (GAAM-792).
   * For local/dev testing, use the XF preview URL or a page that embeds the header XF.
   * The style guide URL below is a placeholder until the XF is set up (GAAM-792).
   */
  async navigate(baseUrl: string, overrideUrl?: string) {
    const url = overrideUrl
      ?? `${baseUrl}/content/global-atlantic/style-guide/components/site-header.html?wcmmode=disabled`;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
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
