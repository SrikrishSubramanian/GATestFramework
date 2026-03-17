import { test as base, BrowserContext, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const AUTH_STATE_PATH = path.join(__dirname, '..', '..', '..', '.auth-state.json');
const reuseBrowser = process.env.REUSE_BROWSER === 'true';

/**
 * Custom test fixture that reuses saved auth state when REUSE_BROWSER=true.
 *
 * Usage:
 *   1. First run:  REUSE_BROWSER=true env=dev npx playwright test --grep "BTN-012" --headed
 *      → Full IMS login + MFA. After success, cookies are saved to .auth-state.json.
 *   2. Later runs:  Same command.
 *      → Saved cookies are loaded automatically. No login/MFA needed.
 *   3. Session expired? Delete .auth-state.json and re-run step 1.
 *
 * When REUSE_BROWSER is not set, falls back to default Playwright behavior.
 */
export const test = base.extend<{ context: BrowserContext; page: Page }>({
  context: async ({ context }, use) => {
    // Load saved auth state if available
    if (reuseBrowser && fs.existsSync(AUTH_STATE_PATH)) {
      try {
        const state = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, 'utf-8'));
        if (state.cookies?.length) {
          await context.addCookies(state.cookies);
        }
      } catch {
        // Corrupted state file — ignore, will re-login
      }
    }
    await use(context);
  },
});

export { expect } from '@playwright/test';
