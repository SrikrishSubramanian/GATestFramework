import { Page, Locator } from '@playwright/test';
import * as fs from 'fs';

/**
 * Multi-locator strategy types for resilient element identification.
 * Each element can have multiple strategies ordered by confidence.
 */
export interface LocatorStrategy {
  type: 'css' | 'xpath' | 'text' | 'role' | 'testid' | 'id';
  value: string;
  confidence: number; // 0-1, stability score
}

export interface LocatorEntry {
  name: string;
  component: string;
  strategies: LocatorStrategy[];
  lastVerified?: string;
  lastFailedStrategy?: string;
}

export interface LocatorRegistry {
  component: string;
  generatedAt: string;
  source: 'dom' | 'kkr-aem' | 'manual';
  entries: Record<string, LocatorEntry>;
}

/**
 * Load a locator sidecar JSON file.
 */
export function loadLocators(filePath: string): LocatorRegistry {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as LocatorRegistry;
}

/**
 * Resolve the best available locator for an element.
 * Tries strategies in confidence order (highest first).
 * Falls back through alternatives when primary fails.
 *
 * Returns a standard Playwright Locator — compatible with all
 * existing utility wrappers (clickElement, fill, isVisible, etc.).
 */
export async function resolveLocator(
  page: Page,
  entry: LocatorEntry
): Promise<Locator> {
  // Sort strategies by confidence descending
  const sorted = [...entry.strategies].sort((a, b) => b.confidence - a.confidence);

  for (const strategy of sorted) {
    try {
      const locator = strategyToLocator(page, strategy);
      // Quick visibility check — if at least one element matches, use it
      const count = await locator.count();
      if (count > 0) {
        return locator;
      }
    } catch {
      // Strategy failed, try next
      continue;
    }
  }

  // All strategies exhausted — fall back to first strategy (will fail with Playwright's error)
  return strategyToLocator(page, sorted[0]);
}

/**
 * Convert a LocatorStrategy to a Playwright Locator.
 */
function strategyToLocator(page: Page, strategy: LocatorStrategy): Locator {
  switch (strategy.type) {
    case 'css':
      return page.locator(strategy.value);
    case 'xpath':
      return page.locator(`xpath=${strategy.value}`);
    case 'text':
      return page.getByText(strategy.value);
    case 'role': {
      // Format: "role[name='text']" or just "role"
      const match = strategy.value.match(/^(\w+)\[name=['"](.+)['"]\]$/);
      if (match) {
        return page.getByRole(match[1] as any, { name: match[2] });
      }
      return page.getByRole(strategy.value as any);
    }
    case 'testid':
      return page.getByTestId(strategy.value);
    case 'id':
      return page.locator(`#${strategy.value}`);
    default:
      return page.locator(strategy.value);
  }
}

/**
 * Resolve a locator with fallback logging.
 * Use this in production tests to track which strategies succeed/fail
 * for future self-healing improvements.
 */
export async function resolveLocatorWithLog(
  page: Page,
  entry: LocatorEntry,
  logger?: (msg: string) => void
): Promise<{ locator: Locator; usedStrategy: LocatorStrategy; fallbackUsed: boolean }> {
  const sorted = [...entry.strategies].sort((a, b) => b.confidence - a.confidence);
  let fallbackUsed = false;

  for (let i = 0; i < sorted.length; i++) {
    const strategy = sorted[i];
    try {
      const locator = strategyToLocator(page, strategy);
      const count = await locator.count();
      if (count > 0) {
        if (i > 0) {
          fallbackUsed = true;
          logger?.(`[locator-registry] Fallback used for "${entry.name}": ${strategy.type}="${strategy.value}" (primary "${sorted[0].type}" failed)`);
        }
        return { locator, usedStrategy: strategy, fallbackUsed };
      }
    } catch {
      logger?.(`[locator-registry] Strategy failed for "${entry.name}": ${strategy.type}="${strategy.value}"`);
      continue;
    }
  }

  // All failed — return first with log
  logger?.(`[locator-registry] All strategies failed for "${entry.name}", using primary as fallback`);
  return {
    locator: strategyToLocator(page, sorted[0]),
    usedStrategy: sorted[0],
    fallbackUsed: true,
  };
}
