import { clickElement, fill, gotoURL } from "../../src/utils/action-utils";
import { isVisible } from "../../src/utils/assert-utils";
import { getAllLocators, getCountOfLocators } from "../../src/utils/locator-utils";
const fs = require('fs');
const rawData = fs.readFileSync("tests/environments/urls.json", 'utf-8');
export const jsonData = JSON.parse(rawData);

const txtUsername='#username';
const txtPassword='#password';
const btnLogin='[type="submit"]';

export async function navigateToLoginPage() {
    
    await gotoURL(jsonData.login, { waitUntil: "domcontentloaded" });
}

export async function login(username: string, password: string) {
    await fill(txtUsername, username, { force: true });
    await fill(txtPassword, password, { force: true });
    await clickElement(btnLogin);
}

