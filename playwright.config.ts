import { defineConfig, devices } from '@playwright/test';
import globalSetup from './tests/utils/infra/globalSetup';
import { WaitForLoadStateOptions } from './src/setup/optional-parameter-types';

// Timestamped report folder: playwright-report/YYYY-MM-DD/run-YYYY-MM-DDTHH-MM-SS/
const now = new Date();
const dateStr = now.toISOString().split('T')[0];
const timestamp = now.toISOString().replace(/[:.]/g, '-');
const reportDir = `playwright-report/${dateStr}/run-${timestamp}`;
// const config = process.env.env || 'stage';
// // const env = require(`./config/${config}.env.json`);
// const env = require(`./tests/environments/${config}.json`);
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export const LOADSTATE: WaitForLoadStateOptions = 'domcontentloaded';
const viewports = [
  { width: 1440, height: 900, name: 'Desktop-1440x900-' },
  { width: 3660, height: 1560, name: 'Desktop-3660x1560-' },
  // { width: 768, height: 1024, name: 'Tablet-768x1024-' },
  { width: 1024, height: 1366, name: 'Tablet-1024x1366-' },
  { width: 390, height: 844, name: 'Mobile-390x844-' },
  // { width: 767, height: 1024, name: 'Mobile-767x1024-' }
];


const viewportProjects = viewports.flatMap(viewport => {
  // Create a project for each viewport and browser (Chrome, Firefox, Safari)
  return [
    {
      name: `${viewport.name}Chrome`,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: viewport.width, height: viewport.height }
      },
    },
    // {
    //   name: `${viewport.name}Firefox`,
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: viewport.width, height: viewport.height }
    //   },
    // },
    {
      name: `${viewport.name}Safari`,
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: viewport.width, height: viewport.height }
      },
    },
  ];
});

export default defineConfig({

  // timeout: 120_000,
  timeout: 5 * 60 * 1000,
  testDir: './tests/specFiles',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: reportDir }],
    ['line'],
    ['json', { outputFile: `${reportDir}/results.json` }],
    ['./tests/utils/infra/test-run-reporter.ts'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  globalSetup: "tests/utils/infra/globalSetup.ts",
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // launchOptions: {
    //   slowMo: 1000,
    //   args: ["--start-fullscreen"],
    // },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true

  },

  /* Configure projects for major browsers */
  projects: [
    // ...viewportProjects,
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // deviceScaleFactor: undefined,
        // viewport: null,
        // launchOptions: {
        //   slowMo: 1000,
        //   args: ["--start-maximized"]
        // },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // deviceScaleFactor: undefined,
        // viewport: null,
        launchOptions: {
          slowMo: 1000,
          // args: ["--start-maximized"]
        },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        // deviceScaleFactor: undefined,
        // viewport: null,
        launchOptions: {
          // args: ['--no-sandbox', '--disable-gpu'],
          slowMo: 1000,
        },
        // // viewport: null,
      },
    },
    {
      name: 'Mobile-Chrome',
      use: { ...devices['Pixel 5'] },
    },
    //     {
    //   name: 'Mobile-Firefox',
    //  use: {
    //     browserName: 'firefox',
    //     viewport: { width: 390, height: 844 },
    //     // isMobile: true,
    //     // hasTouch: true,
    //   },
    // },
    {
      name: 'Mobile-WebKit',
      use: {
        ...devices['iPhone 13'],
        browserName: 'webkit',
        launchOptions: {
          // args: ['--no-sandbox', '--disable-gpu'],
          slowMo: 1000,
        },
      },
    },

  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
