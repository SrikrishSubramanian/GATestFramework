import { Page, Browser, test as baseTest } from '@playwright/test';
import { closePage, getPage, setPage } from '../utils/page-utils';

// baseTest.beforeEach(async ({ page }: { page: Page }) => {
//    setPage(page);
//    console.log("Browser is started in before each")

// });

// baseTest.afterEach(async ({ page, browser }: { page: Page, browser: Browser }) => {
//    // closePage(1);
//    // await page.close();
//    // await browser.close();
//    await getPage().close();
//    console.log("Browser is closed in after each")

// });

export const test = baseTest;