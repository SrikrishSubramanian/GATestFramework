import { Page, Locator } from '@playwright/test';
import path from 'path';

export class FooterPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(baseUrl: string): Promise<void> {
    const url = `${baseUrl}/content/global-atlantic/style-guide/components/footer.html?wcmmode=disabled`;
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  // Root element
  async getRoot(): Promise<Locator> {
    return this.page.locator('.cmp-footer').first();
  }

  // Footer sections
  async getFooterTop(): Promise<Locator> {
    return this.page.locator('.cmp-footer__top');
  }

  async getFooterMiddle(): Promise<Locator> {
    return this.page.locator('.cmp-footer__middle');
  }

  async getFooterBottom(): Promise<Locator> {
    return this.page.locator('.cmp-footer__bottom');
  }

  // Links
  async getFooterLinks(): Promise<Locator> {
    return this.page.locator('.cmp-footer a');
  }

  async getLogoLink(): Promise<Locator> {
    return this.page.locator('.cmp-footer__logo a, .cmp-footer__brand a');
  }

  // Navigation
  async getNavigation(): Promise<Locator> {
    return this.page.locator('.cmp-footer nav');
  }

  async getNavigationLinks(): Promise<Locator> {
    return this.page.locator('.cmp-footer nav a');
  }

  // Social media
  async getSocialLinks(): Promise<Locator> {
    return this.page.locator('.cmp-footer__social a, .cmp-footer [class*="social"] a');
  }

  // Copyright text
  async getCopyright(): Promise<Locator> {
    return this.page.locator('.cmp-footer__copyright, [class*="copyright"]');
  }

  // Disclosure/Legal links
  async getDisclosureLinks(): Promise<Locator> {
    return this.page.locator('.cmp-footer__disclosure a, [class*="legal"] a');
  }

  // Contact info
  async getContactInfo(): Promise<Locator> {
    return this.page.locator('.cmp-footer__contact, [class*="contact"]');
  }

  // Subscribe form
  async getSubscribeForm(): Promise<Locator> {
    return this.page.locator('.cmp-footer form, .cmp-footer [class*="subscribe"]');
  }

  async getSubscribeInput(): Promise<Locator> {
    return this.page.locator('.cmp-footer input[type="email"], .cmp-footer input[name*="email"]');
  }

  async getSubscribeButton(): Promise<Locator> {
    return this.page.locator('.cmp-footer form button, .cmp-footer [class*="subscribe"] button');
  }

  // Disclosure/Expand buttons
  async getDisclosureButtons(): Promise<Locator> {
    return this.page.locator('.cmp-footer button[aria-expanded]');
  }

  // Mobile menu toggle
  async getMobileMenuToggle(): Promise<Locator> {
    return this.page.locator('.cmp-footer [class*="menu-toggle"], .cmp-footer button[aria-label*="menu"]');
  }

  // Images/Logos
  async getImages(): Promise<Locator> {
    return this.page.locator('.cmp-footer img');
  }

  // Text content
  async getHeadings(): Promise<Locator> {
    return this.page.locator('.cmp-footer h1, .cmp-footer h2, .cmp-footer h3');
  }

  // Lists
  async getListItems(): Promise<Locator> {
    return this.page.locator('.cmp-footer li');
  }
}
