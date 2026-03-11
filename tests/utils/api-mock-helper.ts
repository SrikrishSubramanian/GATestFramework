import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const MOCKS_DIR = path.resolve(__dirname, '..', 'data', 'mocks');

export type MockScenario = 'success' | 'empty' | 'error';

export interface MockConfig {
  /** URL pattern to intercept (glob or regex string) */
  urlPattern: string;
  /** Scenario: success, empty, or error */
  scenario: MockScenario;
  /** Component name (for loading mock data files) */
  component: string;
  /** Optional custom response body (overrides file-based mock) */
  body?: any;
  /** HTTP status code */
  status?: number;
  /** Response headers */
  headers?: Record<string, string>;
}

/**
 * Set up API route mocking using Playwright page.route().
 */
export async function setupMocks(page: Page, configs: MockConfig[]): Promise<void> {
  for (const config of configs) {
    await page.route(config.urlPattern, (route) => {
      const body = config.body || loadMockData(config.component, config.scenario);
      const status = config.status || getStatusForScenario(config.scenario);

      route.fulfill({
        status,
        contentType: 'application/json',
        headers: config.headers || {},
        body: typeof body === 'string' ? body : JSON.stringify(body),
      });
    });
  }
}

/**
 * Clear all route mocks.
 */
export async function clearMocks(page: Page): Promise<void> {
  await page.unrouteAll({ behavior: 'wait' });
}

/**
 * Load mock data from file: tests/data/mocks/<component>/<scenario>.json
 */
export function loadMockData(component: string, scenario: MockScenario): any {
  const filePath = path.join(MOCKS_DIR, component, `${scenario}.json`);
  if (!fs.existsSync(filePath)) {
    return getDefaultMockData(scenario);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Save mock data to file for a component.
 */
export function saveMockData(component: string, scenario: MockScenario, data: any): string {
  const dir = path.join(MOCKS_DIR, component);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${scenario}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return filePath;
}

/**
 * Create default mock data files for a component.
 */
export function initMockData(component: string): void {
  saveMockData(component, 'success', { data: [], status: 'ok' });
  saveMockData(component, 'empty', { data: [], status: 'ok' });
  saveMockData(component, 'error', { error: 'Internal Server Error', status: 'error' });
}

function getStatusForScenario(scenario: MockScenario): number {
  switch (scenario) {
    case 'success': return 200;
    case 'empty': return 200;
    case 'error': return 500;
  }
}

function getDefaultMockData(scenario: MockScenario): any {
  switch (scenario) {
    case 'success': return { data: [{ id: 1, name: 'Test Item' }], status: 'ok' };
    case 'empty': return { data: [], status: 'ok' };
    case 'error': return { error: 'Internal Server Error', status: 'error' };
  }
}
