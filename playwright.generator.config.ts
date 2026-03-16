/**
 * Playwright config for running test generators.
 * Overrides testDir to include tests/generators/.
 */
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: './tests/generators',
  testMatch: /generate-.*\.ts$/,
  timeout: 15 * 60 * 1000,
  reporter: [['line']],  // No HTML/JSON reports for generators — they just produce files
});
