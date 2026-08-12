import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/buttonPage.locators.json'));

export class ButtonPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for i_0 */
  get i_0(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_0);
  }

  /** Locator for span_Button */
  get span_Button(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Button);
  }

  /** Locator for span_Watch_Video */
  get span_Watch_Video(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Watch_Video);
  }

  /** Locator for span_LearnMore */
  get span_LearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_LearnMore);
  }

  /** Locator for span_Button_Icon_Text */
  get span_Button_Icon_Text(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Button_Icon_Text);
  }

  // --- Actions ---

  /** Click i_0 */
  async clickI0() {
    const el = await this.i_0;
    await el.click();
  }

  /** Click span_Button */
  async clickSpanButton() {
    const el = await this.span_Button;
    await el.click();
  }

  /** Click span_Watch_Video */
  async clickSpanWatchVideo() {
    const el = await this.span_Watch_Video;
    await el.click();
  }

  /** Click span_LearnMore */
  async clickSpanLearnmore() {
    const el = await this.span_LearnMore;
    await el.click();
  }

  /** Click span_Button_Icon_Text */
  async clickSpanButtonIconText() {
    const el = await this.span_Button_Icon_Text;
    await el.click();
  }
}
