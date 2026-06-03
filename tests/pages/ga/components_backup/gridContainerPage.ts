import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'gridContainerPage.locators.json'));

export class GridContainerPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/grid-container.html?wcmmode=disabled`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Locator for div_0 */
  get div_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_0);
  }

  /** Locator for div_1 */
  get div_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_1);
  }

  /** Locator for div_2 */
  get div_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_2);
  }

  /** Locator for div_3 */
  get div_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_3);
  }

  /** Locator for div_4 */
  get div_4(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_4);
  }

  /** Locator for div_5 */
  get div_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_5);
  }

  // --- Actions ---

  /** Click div_0 */
  async clickDiv0() {
    const el = await this.div_0;
    await el.click();
  }

  /** Click div_1 */
  async clickDiv1() {
    const el = await this.div_1;
    await el.click();
  }

  /** Click div_2 */
  async clickDiv2() {
    const el = await this.div_2;
    await el.click();
  }

  /** Click div_3 */
  async clickDiv3() {
    const el = await this.div_3;
    await el.click();
  }

  /** Click div_4 */
  async clickDiv4() {
    const el = await this.div_4;
    await el.click();
  }

  /** Click div_5 */
  async clickDiv5() {
    const el = await this.div_5;
    await el.click();
  }
}
