/**
 * Playwright config for running test generators.
 *
 * The generators live in tests/generators/ (not tests/specFiles/) and use
 * plain .ts filenames (not *.spec.ts), so they need a separate config.
 *
 * Usage:
 *   npx playwright test --config playwright.generators.config.ts --project chromium --workers 1
 *
 * Examples:
 *   JIRA_JSON=.aem-developer/artifacts/requirements.json COMPONENT=text \
 *     npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium --workers 1
 *
 *   CSV_PATH=file.csv \
 *     npx playwright test generate-from-csv --config playwright.generators.config.ts --project chromium --workers 1
 *
 *   COMPONENTS=button \
 *     npx playwright test generate-components --config playwright.generators.config.ts --project chromium --workers 1
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 15 * 60 * 1000,
  testDir: './tests/generators',
  testMatch: '**/*.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['line']],
  globalSetup: 'tests/utils/infra/globalSetup.ts',
  use: {
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
