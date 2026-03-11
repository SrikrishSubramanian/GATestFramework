import { getPage } from "./page-utils";
import { CheckOptions, ClearOptions, ClickOptions, DoubleClickOptions, DragAndDropOptions, FillOptions, FocusOptions, GotoOptions, HoverOptions, KeyboardOptions, LocatorOptions, SelectOptions, TimeoutOption } from "../setup/optional-parameter-types";
import { LOADSTATE } from "../../playwright.config";
import { Dialog, Locator, Page, Response } from '@playwright/test';
import { getLocator } from "./locator-utils";
import { NavigationOptions, WaitForLoadStateOptions } from "../setup/optional-parameter-types";
export async function gotoURL(
    path: string,
    options: GotoOptions = { waitUntil: LOADSTATE }
): Promise<null | Response> {
    // const page= getPage()
    return await getPage().goto(path, options);
    // return await page.goto(path, options);
}

export async function clickElement(input: string | Locator, options?: ClickOptions) {
    //     const locator = getLocator(input);
    //     const page = locator.page();

    //     // Prevent error if page is already closed
    //     if (page.isClosed()) {
    //         console.warn("⚠️ Skipping clickElement because the page is already closed.");
    //         return;
    //     }

    //     await locator.scrollIntoViewIfNeeded();
    //     await locator.waitFor({ state: "visible", timeout: 10000 });
    //     await locator.click(options);


    const locator = getLocator(input);
    const page = locator.page();

    // Early exit if page already closed
    if (page.isClosed()) {
        console.warn("⚠️ Skipping clickElement because the page is already closed.");
        return;
    }

    try {
        await locator.scrollIntoViewIfNeeded();
        await locator.waitFor({ state: "visible", timeout: 10000 });
        await locator.click(options);
    } catch (error: any) {
        const message = error?.message || "";

        // 🧠 Case 1: Page closed during wait/click
        if (message.includes("page, context or browser has been closed")) {
            console.warn("⚠️ Page was closed before click could complete.");
            return;
        }

        // 🧠 Case 2: Navigation interrupted the element
        if (message.includes("has been detached from the DOM")) {
            console.warn("⚠️ Element detached; retrying after reload...");
            try {
                await page.waitForLoadState("domcontentloaded", { timeout: 90000 });
                const freshLocator = getLocator(input); // re-locate after reload
                await freshLocator.click(options);
                return;
            } catch (retryError) {
                console.error("❌ Retry failed:", retryError);
            }
        }

        // Rethrow for anything else
        throw error;
    }
}

export async function wait(ms: number) {
    await getPage().waitForTimeout(ms);
}

export async function waitForURL(url: string | RegExp, options?: WaitForLoadStateOptions & TimeoutOption) {
    await getPage().waitForURL(url, options)
}
export async function waitForPageLoadState(options?: NavigationOptions): Promise<void> {
    let waitUntil: WaitForLoadStateOptions = LOADSTATE;

    if (options?.waitUntil && options.waitUntil !== 'commit') {
        waitUntil = options.waitUntil;
    }

    await getPage().waitForLoadState(waitUntil);
}

// export async function waitForNavigation(params:type) {
//     await getPage
// }

export async function goBack(options?: NavigationOptions): Promise<void> {
    // await Promise.all([getPage().goBack(options), getPage().waitForEvent('framenavigated')]);
    // await waitForPageLoadState(options);
    // await getPage().goBack({ waitUntil: 'load' },options);
    const page = getPage();
    await page.goBack({ waitUntil: 'load', timeout: 90000 });
}

export async function reloadPage(options?: NavigationOptions): Promise<void> {
    await Promise.all([getPage().reload(options), getPage().waitForEvent('framenavigated')]);
    await waitForPageLoadState(options);
}

export async function clickAndWaitForPageToLoad(input: string | Locator, options?: NavigationOptions): Promise<void> {
    await Promise.all([clickElement(input), waitForPageLoadState(options)]);
    // await waitForPageLoadState(options);
}

export async function fill(input: string | Locator, text: string, options?: FillOptions): Promise<void> {
    await getLocator(input).fill(text, options);
}

export async function fillAndEnter(input: string | Locator, text: string, options?: FillOptions): Promise<void> {
    const locator = getLocator(input);
    await locator.fill(text, options);
    await locator.press('Enter')
}

export async function clear(input: string | Locator, options?: ClearOptions): Promise<void> {
    const locator = getLocator(input);
    await locator.clear(options);
}

export async function check(input: string | Locator, options?: CheckOptions): Promise<void> {
    const locator = getLocator(input)
    locator.check(options);
}

export async function unCheck(input: string | Locator, options?: CheckOptions): Promise<void> {
    const locator = getLocator(input)
    locator.uncheck(options);
}

export async function selectByValue(input: string | Locator, value: string, options?: SelectOptions): Promise<void> {
    const locator = getLocator(input)
    locator.selectOption(value, options)
}

export async function selectByValues(input: string | Locator, value: Array<string>, options?: SelectOptions): Promise<void> {
    const locator = getLocator(input)
    locator.selectOption(value, options)
}

export async function selectByText(input: string | Locator, text: string, options?: SelectOptions): Promise<void> {
    const locator = getLocator(input)
    locator.selectOption({ label: text }, options)
}

export async function selectByIndex(input: string | Locator, index: number, options?: SelectOptions): Promise<void> {
    const locator = getLocator(input)
    locator.selectOption({ index: index }, options)
}

export async function acceptAlert(input: string | Locator, promptText?: string): Promise<string> {
    const locator = getLocator(input)
    let dialogMessage = '';
    getPage().once('dialog', dialog => {
        dialogMessage = dialog.message()
        dialog.accept(promptText).catch(e => console.error("Error accepting dialog box: " + e))
    })
    await locator.click();
    return dialogMessage;
}

export async function dismissAlert(input: string | Locator): Promise<string> {
    const locator = getLocator(input)
    await locator.click();
    let dialogMessage = '';
    getPage().once('dialog', dialog => {
        dialogMessage = dialog.message();
        dialog.dismiss().catch(e => console.error("Error dismissing dialog box: " + e))
    })
    return dialogMessage;
}

export async function getAlertText(input: string | Locator): Promise<string> {
    const locator = getLocator(input)
    let dialogMessage = '';
    const dialogHandler = (dialog: Dialog) => {
        dialogMessage = dialog.message();
    }

    getPage().once('dialog', dialogHandler)
    await locator.click();
    await getPage().waitForEvent('dialog');
    getPage().off('dialog', dialogHandler)
    return dialogMessage;
}

export async function hover(input: string | Locator, options?: HoverOptions): Promise<void> {
    const locator = getLocator(input)
    await locator.hover(options);
}

export async function hoverAndClick(input: string | Locator, options?: HoverOptions): Promise<void> {
    const locator = getLocator(input)
    await locator.hover(options);
    await clickElement(input, { force: true })
}

export async function focus(input: string | Locator, options?: FocusOptions): Promise<void> {
    const locator = getLocator(input)
    await locator.focus(options);
}

export async function dragAndDrop(src: string | Locator, dest: string | Locator, options?: DragAndDropOptions): Promise<void> {
    const source = getLocator(src)
    const destination = getLocator(dest)
    await source.dragTo(destination, options)
}

export async function doubleClick(input: string | Locator, options?: DoubleClickOptions) {
    const locator = getLocator(input)
    await locator.dblclick(options)
}

export async function scrollLocatorIntoView(input: string | Locator, options?: TimeoutOption): Promise<void> {
    const locator = getLocator(input);
    await locator.scrollIntoViewIfNeeded(options);
}

export async function clickByJS(input: string | Locator, options?: TimeoutOption): Promise<void> {
    const locator = getLocator(input);
    await locator.evaluate('el => el.click()', options);
}


export async function downloadFile(input: string | Locator, path: string): Promise<void> {
    const locator = getLocator(input);
    const downloadPromise = getPage().waitForEvent('download');
    await click(locator);
    const download = await downloadPromise;
    // Wait for the download process to complete
    console.log(await download.path());
    // Save downloaded file somewhere
    await download.saveAs(path);
}

export async function uploadFiles(input: string | Locator, path: UploadValues, options?: UploadOptions): Promise<void> {
    const locator = getLocator(input);
    await locator.setInputFiles(path, options);
}

export async function getInputValue(input: string | Locator, options?: TimeoutOption): Promise<string> {
    const locator = getLocator(input)
    return await locator.inputValue(options)

}

export async function mouseScroll(x: number, y: number) {
    await getPage().mouse.wheel(x, y);
}

export async function keyboardActions(key: string, options?: KeyboardOptions) {
    await getPage().keyboard.press(key, options);
}

export async function removeTag(locator: Locator) {
    
if (await locator.count() > 0) {
  await locator.evaluateAll(elements =>
    elements.forEach(el => el.remove())
  );
}

    
}

