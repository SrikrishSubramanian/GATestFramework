import { FullConfig } from "playwright/test";

import dotenv from "dotenv";
import path from 'path';
import { checkFixtureSync, formatSyncWarnings } from './fixture-sync-checker';

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
}

export default globalSetup;