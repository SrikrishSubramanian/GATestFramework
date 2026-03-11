import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import {
  loadLocators,
  resolveLocator,
  resolveLocatorWithLog,
  LocatorRegistry,
  LocatorEntry,
} from '../../utils/locator-registry';

// Write a temp sidecar file for testing
const TEMP_SIDECAR = path.resolve(__dirname, '..', '..', 'data', '_test_temp.locators.json');

const sampleRegistry: LocatorRegistry = {
  component: 'test-button',
  generatedAt: new Date().toISOString(),
  source: 'manual',
  entries: {
    primaryButton: {
      name: 'primaryButton',
      component: 'test-button',
      strategies: [
        { type: 'testid', value: 'primary-btn', confidence: 1.0 },
        { type: 'css', value: '.ga-button.primary-filled', confidence: 0.8 },
        { type: 'text', value: 'Learn More', confidence: 0.5 },
      ],
    },
    heading: {
      name: 'heading',
      component: 'test-button',
      strategies: [
        { type: 'role', value: "heading[name='Welcome']", confidence: 0.9 },
        { type: 'css', value: 'h1.title', confidence: 0.7 },
      ],
    },
    byId: {
      name: 'byId',
      component: 'test-button',
      strategies: [
        { type: 'id', value: 'main-content', confidence: 0.95 },
      ],
    },
  },
};

test.describe('Locator Registry — Unit Tests', () => {
  test.beforeAll(() => {
    const dir = path.dirname(TEMP_SIDECAR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TEMP_SIDECAR, JSON.stringify(sampleRegistry, null, 2));
  });

  test.afterAll(() => {
    if (fs.existsSync(TEMP_SIDECAR)) {
      fs.unlinkSync(TEMP_SIDECAR);
    }
  });

  test('loadLocators reads and parses sidecar JSON', () => {
    const registry = loadLocators(TEMP_SIDECAR);
    expect(registry.component).toBe('test-button');
    expect(registry.source).toBe('manual');
    expect(Object.keys(registry.entries)).toHaveLength(3);
  });

  test('loadLocators preserves all strategies with correct types', () => {
    const registry = loadLocators(TEMP_SIDECAR);
    const btn = registry.entries.primaryButton;
    expect(btn.strategies).toHaveLength(3);
    expect(btn.strategies[0].type).toBe('testid');
    expect(btn.strategies[0].confidence).toBe(1.0);
    expect(btn.strategies[1].type).toBe('css');
    expect(btn.strategies[2].type).toBe('text');
  });

  test('loadLocators throws on non-existent file', () => {
    expect(() => loadLocators('/nonexistent/path.json')).toThrow();
  });

  test('resolveLocator returns a Playwright Locator for css strategy', async ({ page }) => {
    await page.setContent('<button class="ga-button primary-filled">Learn More</button>');
    const entry: LocatorEntry = {
      name: 'btn',
      component: 'test',
      strategies: [
        { type: 'css', value: '.ga-button.primary-filled', confidence: 0.8 },
      ],
    };
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText('Learn More');
  });

  test('resolveLocator returns a Playwright Locator for testid strategy', async ({ page }) => {
    await page.setContent('<button data-testid="submit-btn">Submit</button>');
    const entry: LocatorEntry = {
      name: 'submit',
      component: 'test',
      strategies: [
        { type: 'testid', value: 'submit-btn', confidence: 1.0 },
      ],
    };
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText('Submit');
  });

  test('resolveLocator returns a Playwright Locator for text strategy', async ({ page }) => {
    await page.setContent('<span>Hello World</span>');
    const entry: LocatorEntry = {
      name: 'greeting',
      component: 'test',
      strategies: [
        { type: 'text', value: 'Hello World', confidence: 0.5 },
      ],
    };
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
  });

  test('resolveLocator returns a Playwright Locator for role strategy', async ({ page }) => {
    await page.setContent('<h1>Welcome</h1>');
    const entry: LocatorEntry = {
      name: 'heading',
      component: 'test',
      strategies: [
        { type: 'role', value: "heading[name='Welcome']", confidence: 0.9 },
      ],
    };
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
  });

  test('resolveLocator returns a Playwright Locator for id strategy', async ({ page }) => {
    await page.setContent('<div id="main-content">Content</div>');
    const entry: LocatorEntry = {
      name: 'main',
      component: 'test',
      strategies: [
        { type: 'id', value: 'main-content', confidence: 0.95 },
      ],
    };
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText('Content');
  });

  test('resolveLocator returns a Playwright Locator for xpath strategy', async ({ page }) => {
    await page.setContent('<div><span class="target">Found</span></div>');
    const entry: LocatorEntry = {
      name: 'target',
      component: 'test',
      strategies: [
        { type: 'xpath', value: '//span[@class="target"]', confidence: 0.6 },
      ],
    };
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText('Found');
  });

  test('resolveLocator falls back to next strategy when primary fails', async ({ page }) => {
    await page.setContent('<button class="real-btn">Click Me</button>');
    const entry: LocatorEntry = {
      name: 'btn',
      component: 'test',
      strategies: [
        { type: 'testid', value: 'nonexistent', confidence: 1.0 },
        { type: 'css', value: '.real-btn', confidence: 0.8 },
      ],
    };
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText('Click Me');
  });

  test('resolveLocator prefers higher-confidence strategy', async ({ page }) => {
    await page.setContent('<button data-testid="pref-btn" class="pref-btn">Preferred</button>');
    const entry: LocatorEntry = {
      name: 'btn',
      component: 'test',
      strategies: [
        { type: 'css', value: '.pref-btn', confidence: 0.5 },
        { type: 'testid', value: 'pref-btn', confidence: 1.0 },
      ],
    };
    // Both work, but testid (higher confidence) should be tried first
    const locator = await resolveLocator(page, entry);
    await expect(locator).toBeVisible();
  });

  test('resolveLocatorWithLog tracks fallback usage', async ({ page }) => {
    await page.setContent('<a class="link">Click</a>');
    const logs: string[] = [];
    const entry: LocatorEntry = {
      name: 'link',
      component: 'test',
      strategies: [
        { type: 'testid', value: 'missing', confidence: 1.0 },
        { type: 'css', value: '.link', confidence: 0.7 },
      ],
    };
    const result = await resolveLocatorWithLog(page, entry, (msg) => logs.push(msg));
    expect(result.fallbackUsed).toBe(true);
    expect(result.usedStrategy.type).toBe('css');
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toContain('Fallback used');
  });

  test('resolveLocatorWithLog reports no fallback when primary works', async ({ page }) => {
    await page.setContent('<button data-testid="ok-btn">OK</button>');
    const logs: string[] = [];
    const entry: LocatorEntry = {
      name: 'btn',
      component: 'test',
      strategies: [
        { type: 'testid', value: 'ok-btn', confidence: 1.0 },
        { type: 'css', value: 'button', confidence: 0.5 },
      ],
    };
    const result = await resolveLocatorWithLog(page, entry, (msg) => logs.push(msg));
    expect(result.fallbackUsed).toBe(false);
    expect(result.usedStrategy.type).toBe('testid');
    expect(logs).toHaveLength(0);
  });
});
