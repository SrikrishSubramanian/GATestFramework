import { FullConfig } from "playwright/test";

import dotenv from "dotenv";
import path from 'path';
async function globalSetup(config: FullConfig) {

    if (process.env.env) {
        dotenv.config({
            path: path.resolve(__dirname, '..', 'environments', `.env.${process.env.env}`),
            override: true
        });
    }
}

export default globalSetup;