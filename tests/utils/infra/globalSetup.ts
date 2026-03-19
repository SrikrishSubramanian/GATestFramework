import { FullConfig, chromium } from "playwright/test";

import dotenv from "dotenv";
import path from 'path';
import fs from 'fs';
import { checkFixtureSync, formatSyncWarnings } from './fixture-sync-checker';

/** Path where authenticated storage state is saved for reuse across all workers */
export const AUTH_STORAGE_STATE = path.resolve(__dirname, '..', '..', '..', '.auth-state.json');

async function globalSetup(config: FullConfig) {

    if (process.env.env) {
        dotenv.config({
            path: path.resolve(__dirname, '..', 'environments', `.env.${process.env.env}`),
            override: true
        });
    }

    // Check fixture sync status (warn mode — never blocks execution)
    const syncReport = checkFixtureSync();
    if (syncReport.hasWarnings) {
        console.warn(formatSyncWarnings(syncReport));
    }

    // ─── Global AEM Auth ──────────────────────────────────────────────
    // Login ONCE and save cookies so all worker processes reuse the session.
    // This eliminates hundreds of redundant login round-trips.
    const authorUrl = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
    const username = process.env.AEM_AUTHOR_USERNAME || 'admin';
    const password = process.env.AEM_AUTHOR_PASSWORD || 'admin';

    // Skip auth setup if running only publish-mode tests or if auth is disabled
    if (process.env.SKIP_AUTH === 'true') {
        console.log('[globalSetup] SKIP_AUTH=true — skipping AEM auth');
        return;
    }

    // Check if existing auth state is still valid (< 30 minutes old)
    if (fs.existsSync(AUTH_STORAGE_STATE)) {
        const stat = fs.statSync(AUTH_STORAGE_STATE);
        const ageMinutes = (Date.now() - stat.mtimeMs) / 60000;
        if (ageMinutes < 30) {
            console.log(`[globalSetup] Reusing auth state (${ageMinutes.toFixed(0)}m old)`);
            return;
        }
    }

    console.log('[globalSetup] Authenticating with AEM author...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(`${authorUrl}/libs/granite/core/content/login.html`, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
        });

        // Check if already on an authenticated page
        const url = page.url();
        if (url.includes('/aem/start') || url.includes('/sites.html') || url.includes('/welcome')) {
            // Already authenticated
        } else {
            // Local AEM SDK login
            await page.locator('#username').fill(username);
            await page.locator('#password').fill(password);
            await page.locator('#submit-button').click();
            await page.waitForURL(/\/(aem\/start|sites\.html|welcome)/, { timeout: 30000 });
        }

        // Save storage state for all workers
        await context.storageState({ path: AUTH_STORAGE_STATE });
        console.log('[globalSetup] Auth state saved — all workers will reuse this session');
    } catch (err) {
        console.warn(`[globalSetup] AEM auth failed: ${err}. Tests will login individually.`);
    } finally {
        await browser.close();
    }
}

export default globalSetup;