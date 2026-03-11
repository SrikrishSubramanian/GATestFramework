import { Page } from '@playwright/test';
import { SMALL_TIMEOUT, STANDARD_TIMEOUT } from './timeout-constants';
import { firefox } from 'playwright';
let page: Page;
export async function setPage(pageInstance: Page) {
  page = pageInstance;
  // const browser = await firefox.launch({ headless: false });
  // const context = await browser.newContext(); // incognito
  // page = await context.newPage();
}
export function getPage(): Page {
  return page;
}

export async function switchPage(winNum: number): Promise<void> {
  const startTime = Date.now();
  while (page.context().pages().length < winNum && Date.now() - startTime < STANDARD_TIMEOUT) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (page.context().pages().length < winNum) {
    throw new Error(`Page number ${winNum} not found after ${STANDARD_TIMEOUT} seconds`);
  }
  const pageInstance = page.context().pages()[winNum - 1];
  await pageInstance.waitForLoadState();
  setPage(pageInstance);
}

/**
 * Switches back to the default page (the first one).
 */
export async function switchToDefaultPage(): Promise<void> {
  const pageInstance = page.context().pages()[0];
  if (pageInstance) {
    await pageInstance.bringToFront();
    setPage(pageInstance);
  }
}

// export async function getPageTitle(): Promise<string> {
//   return getPage().title()
// }

// export async function getPageTitle(): Promise<string> {
//   const maxRetries = 2
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const page = getPage();

//       if (!page || page.isClosed()) {
//         console.warn(`⚠️ Attempt ${attempt}: Page is closed or undefined, retrying...`);
//         await new Promise((r) => setTimeout(r, 60000));
//         continue;
//       }

//       await page.waitForLoadState('domcontentloaded', { timeout: 90000 });
//       const title = await page.title();
//       if (title) return title;

//     } catch (error: any) {
//       // Detect the specific closed page error and retry
//       if (error.message.includes('Target page, context or browser has been closed')) {
//         console.warn(`⚠️ Attempt ${attempt}: ${error.message}`);
//         await new Promise((r) => setTimeout(r, 60000));
//         continue;
//       }
//       // For other errors, rethrow
//       throw error;
//     }
//   }

//   throw new Error(`❌ getPageTitle failed after ${maxRetries} retries.`);
// }

export async function getPageTitle(): Promise<string> {
  const maxRetries = 3
  const retryDelayMs = 5000
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const page = getPage();

      if (!page || page.isClosed()) {
        console.warn(`⚠️ Attempt ${attempt}: Page is closed or undefined, retrying in ${retryDelayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, retryDelayMs));
        continue;
      }

      console.log(`🧭 Attempt ${attempt}: Getting title from URL: ${page.url()}`);

      // Wait for page to load (shorter timeout for CI stability)
      await page.waitForLoadState('domcontentloaded', { timeout: 90000 });

      const title = await page.title();

      if (title) {
        console.log(`✅ Page title found: "${title}"`);
        return title;
      } else {
        console.warn(`⚠️ Attempt ${attempt}: Title is empty, retrying...`);
      }

    } catch (error: any) {
      const msg = error.message || '';

      // Retry if the page is closed or locator is detached
      if (msg.includes('Target page, context or browser has been closed')) {
        console.warn(`⚠️ Attempt ${attempt}: ${msg}. Retrying in ${retryDelayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, retryDelayMs));
        continue;
      }

      // Other errors: rethrow
      throw error;
    }
  }

  // All retries exhausted
  throw new Error(`❌ getPageTitle failed after ${maxRetries} retries. Page may have been closed or failed to load.`);
}

export async function getPageUrl(): Promise<string> {
  return getPage().url();
}
export async function closePage(winNum: number): Promise<void> {
  if (!winNum) {
    await page.close();
    return;
  }
  const noOfWindows = page.context().pages().length;
  const pageInstance = page.context().pages()[winNum - 1];
  await pageInstance.close();
  if (noOfWindows > 1) {
    await switchToDefaultPage();
  }
}

export async function getUrl(): Promise<string> {
  return getPage().url();
}