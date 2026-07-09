import { Page, Locator } from '@playwright/test';
import { loadLocators } from '../../../utils/infra/locator-registry';
import path from 'path';

/**
 * LocatorResolver provides utilities for resolving locators with fallback support.
 * Handles loading and caching of both component-specific and shared locators.
 */
export class LocatorResolver {
  private componentRegistry: Map<string, any> = new Map();
  private sharedRegistry: Map<string, any> = new Map();
  private cache: Map<string, Locator> = new Map();

  constructor(private page: Page) {}

  /**
   * Load component-specific locators from JSON file.
   * @param componentName The component name
   * @param filePath Path to the locators JSON file
   */
  loadComponentLocators(componentName: string, filePath: string): void {
    try {
      const registry = loadLocators(filePath);
      this.componentRegistry.set(componentName, registry);
    } catch (error) {
      console.warn(`Failed to load component locators for ${componentName}:`, error);
    }
  }

  /**
   * Load shared locators from a group.
   * @param groupName The group name (e.g., 'common', 'form-elements')
   */
  loadSharedLocators(groupName: string): void {
    if (this.sharedRegistry.has(groupName)) {
      return; // Already loaded
    }

    try {
      const filePath = path.join(__dirname, `../locators/shared/${groupName}.locators.json`);
      const registry = loadLocators(filePath);
      this.sharedRegistry.set(groupName, registry);
    } catch (error) {
      console.warn(`Failed to load shared locators for group '${groupName}':`, error);
    }
  }

  /**
   * Resolve a locator by name, with automatic fallback to shared locators.
   * @param locatorName The locator name
   * @param componentName Optional: component to search in first
   * @param sharedGroupName Optional: specific shared group to fallback to
   * @returns Locator or null if not found
   */
  async resolveLocator(
    locatorName: string,
    componentName?: string,
    sharedGroupName?: string
  ): Promise<Locator | null> {
    // Check cache first
    const cacheKey = `${componentName || '*'}:${locatorName}:${sharedGroupName || '*'}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Try component-specific first
    if (componentName && this.componentRegistry.has(componentName)) {
      const registry = this.componentRegistry.get(componentName);
      if (registry?.entries?.[locatorName]) {
        const locator = await this.resolveStrategy(registry.entries[locatorName]);
        if (locator) {
          this.cache.set(cacheKey, locator);
          return locator;
        }
      }
    }

    // Try specific shared group
    if (sharedGroupName && this.sharedRegistry.has(sharedGroupName)) {
      const registry = this.sharedRegistry.get(sharedGroupName);
      if (registry?.entries?.[locatorName]) {
        const locator = await this.resolveStrategy(registry.entries[locatorName]);
        if (locator) {
          this.cache.set(cacheKey, locator);
          return locator;
        }
      }
    }

    // Try all loaded shared groups
    for (const [, registry] of this.sharedRegistry) {
      if (registry?.entries?.[locatorName]) {
        const locator = await this.resolveStrategy(registry.entries[locatorName]);
        if (locator) {
          this.cache.set(cacheKey, locator);
          return locator;
        }
      }
    }

    return null;
  }

  /**
   * Resolve a locator and throw if not found.
   */
  async requireLocator(
    locatorName: string,
    componentName?: string,
    sharedGroupName?: string
  ): Promise<Locator> {
    const locator = await this.resolveLocator(locatorName, componentName, sharedGroupName);
    if (!locator) {
      const context = componentName ? ` in component '${componentName}'` : '';
      const groupContext = sharedGroupName ? ` (shared group: '${sharedGroupName}')` : '';
      throw new Error(`Locator '${locatorName}' not found${context}${groupContext}`);
    }
    return locator;
  }

  /**
   * Resolve a locator strategy entry to a Playwright Locator.
   * @private
   */
  private async resolveStrategy(entry: any): Promise<Locator | null> {
    if (!entry?.strategies || !Array.isArray(entry.strategies)) {
      return null;
    }

    // Try primary strategy first
    const primary = entry.strategies.find((s: any) => s.type === entry.primary);
    if (primary) {
      const locator = this.createLocator(primary.type, primary.selector);
      if (locator) return locator;
    }

    // Fallback to other strategies
    for (const strategy of entry.strategies) {
      if (strategy.type !== entry.primary) {
        const locator = this.createLocator(strategy.type, strategy.selector);
        if (locator) return locator;
      }
    }

    return null;
  }

  /**
   * Create a Playwright Locator based on strategy type.
   * @private
   */
  private createLocator(type: string, selector: string): Locator | null {
    switch (type.toLowerCase()) {
      case 'css':
        return this.page.locator(selector);
      case 'xpath':
        return this.page.locator(`xpath=${selector}`);
      case 'text':
        return this.page.getByText(selector);
      case 'role':
        return this.page.getByRole(selector as any);
      case 'testid':
        return this.page.getByTestId(selector);
      case 'label':
        return this.page.getByLabel(selector);
      case 'placeholder':
        return this.page.getByPlaceholder(selector);
      default:
        console.warn(`Unknown locator strategy: ${type}`);
        return null;
    }
  }

  /**
   * Clear the locator cache.
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics for debugging.
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * List all available locators for a component.
   */
  getComponentLocators(componentName: string): string[] {
    const registry = this.componentRegistry.get(componentName);
    if (!registry?.entries) return [];
    return Object.keys(registry.entries);
  }

  /**
   * List all available locators in a shared group.
   */
  getSharedLocators(groupName: string): string[] {
    const registry = this.sharedRegistry.get(groupName);
    if (!registry?.entries) return [];
    return Object.keys(registry.entries);
  }

  /**
   * List all loaded shared groups.
   */
  getLoadedSharedGroups(): string[] {
    return Array.from(this.sharedRegistry.keys());
  }

  /**
   * Verify all registered locators are accessible on the page.
   * Useful for debugging missing or broken locators.
   */
  async verifyLocators(componentName?: string, groupName?: string): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    // Verify component locators
    if (componentName) {
      const locators = this.getComponentLocators(componentName);
      for (const locatorName of locators) {
        const locator = await this.resolveLocator(locatorName, componentName, groupName);
        results[`${componentName}:${locatorName}`] = locator !== null && (await locator?.isVisible().catch(() => false));
      }
    }

    // Verify shared locators
    if (groupName) {
      const locators = this.getSharedLocators(groupName);
      for (const locatorName of locators) {
        const locator = await this.resolveLocator(locatorName, componentName, groupName);
        results[`shared:${groupName}:${locatorName}`] = locator !== null && (await locator?.isVisible().catch(() => false));
      }
    }

    return results;
  }
}

/**
 * Factory function for creating a LocatorResolver for a specific component.
 * Pre-loads common shared groups automatically.
 */
export function createComponentResolver(
  page: Page,
  componentName: string,
  componentLocatorsPath: string,
  sharedGroups: string[] = ['common', 'form-elements', 'navigation']
): LocatorResolver {
  const resolver = new LocatorResolver(page);

  // Load component-specific locators
  resolver.loadComponentLocators(componentName, componentLocatorsPath);

  // Load shared groups
  for (const group of sharedGroups) {
    resolver.loadSharedLocators(group);
  }

  return resolver;
}
